document.addEventListener('DOMContentLoaded',()=>{
  //переменные

//   if (window.innerWidth < 767) {
//     const oldArrows = document.querySelector('.slider-arrows');
//     const sliderBlock = document.querySelector('.swiper__block');
//     oldArrows.remove();
//     const element =document.createElement('div');
//     element.classList.add('slider-arrows');
//     element.innerHTML = `
//         <button type="button" class="prev disabled js-ga4-link" data-gatitle="стрелка - навигации назад"><img src="icons/Arrow left.svg" alt="arrow"></button>
//         <button type="button" class="next js-ga4-link" data-gatitle="стрелка - навигации вперед"><img src="icons/Arrow right.svg" alt="arrow"></button>
//     `;
//     sliderBlock.append(element);
//  }

 let video1_0 = true;
 let video1_10 = true;
 let video1_25 = true;
 let video1_50 = true;
 let video1_75 = true;
 let video1_100 = true;
 let video2_0 = true;
 let video2_10 = true;
 let video2_25 = true;
 let video2_50 = true;
 let video2_75 = true;
 let video2_100 = true;

 let video3_0 = true;
 let video3_10 = true;
 let video3_25 = true;
 let video3_50 = true;
 let video3_75 = true;
 let video3_100 = true;
 var controls =
 [
     'play',
     'volume',
     'mute'
 ];

const vid1 = document.querySelector('.video1'),
vid2 = document.querySelector('.video2'),
vid3 = document.querySelector('.video3'),
bar1 = document.querySelector('#bar1'),
bar2 = document.querySelector('#bar2'),
bar3 = document.querySelector('#bar3');
var video1 = new Plyr('.video1', {controls});
  var video2 = new Plyr('.video2', {controls});
  var video3 = new Plyr('.video3',{controls});
let slider = document.querySelector('.slider'),
  sliderList = slider.querySelector('.slider-list'),
  sliderTrack = slider.querySelector('.slider-track'),
  slides = slider.querySelectorAll('.slide'),
  arrows = document.querySelector('.slider-arrows'),
  prev = document.querySelector('.prev'),
  next = document.querySelector('.next'),
  slideWidth = slides[0].offsetWidth,
  slideIndex = 0,
  posInit = 0,
  posX1 = 0,
  posX2 = 0,
  posY1 = 0,
  posY2 = 0,
  posFinal = 0,
  isSwipe = false,
  isScroll = false,
  allowSwipe = true,
  transition = true,
  nextTrf = 0,
  prevTrf = 0,
  lastTrf = --slides.length * slideWidth,
  posThreshold = slides[0].offsetWidth * 0.35,
  trfRegExp = /([-0-9.]+(?=px))/,
  getEvent = function() {
    
    return (event.type.search('touch') !== -1) ? event.touches[0] : event;
  },
  slide = function() {
    
    if (transition) {
      sliderTrack.style.transition = 'transform .5s';
    }
    sliderTrack.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`;
    controlsVideo(slideIndex);
    prev.classList.toggle('disabled', slideIndex === 0);
    next.classList.toggle('disabled', slideIndex === --slides.length);
    makingMove(slideIndex);
    controlsVideo(slideIndex);

  },
  swipeStart = function() {
    let evt = getEvent();

    if (allowSwipe) {

      transition = true;

      nextTrf = (slideIndex + 1) * -slideWidth;
      prevTrf = (slideIndex - 1) * -slideWidth;

      posInit = posX1 = evt.clientX;
      posY1 = evt.clientY;

      sliderTrack.style.transition = '';

      document.addEventListener('touchmove', swipeAction);
      document.addEventListener('mousemove', swipeAction);
      document.addEventListener('touchend', swipeEnd);
      document.addEventListener('mouseup', swipeEnd);

      sliderList.classList.remove('grab');
      sliderList.classList.add('grabbing');
    }

  },
  swipeAction = function() {

    let evt = getEvent(),
      style = sliderTrack.style.transform,
      transform = +style.match(trfRegExp)[0];

    posX2 = posX1 - evt.clientX;
    posX1 = evt.clientX;

    posY2 = posY1 - evt.clientY;
    posY1 = evt.clientY;

    // определение действия свайп или скролл
    if (!isSwipe && !isScroll) {
      let posY = Math.abs(posY2);
      if (posY > 7 || posX2 === 0) {
        isScroll = true;
        allowSwipe = false;
      } else if (posY < 7) {
        isSwipe = true;
      }
    }

    if (isSwipe) {
      // запрет ухода влево на первом слайде
      if (slideIndex === 0) {
        if (posInit < posX1) {
          setTransform(transform, 0);
          return;
        } else {
          allowSwipe = true;
        }
      }

      // запрет ухода вправо на последнем слайде
      if (slideIndex === --slides.length) {
        if (posInit > posX1) {
          setTransform(transform, lastTrf);
          return;
        } else {
          allowSwipe = true;
        }
      }

      //запрет на уход на третий слайд пока не досмотрел следующий
      if (slideIndex === --slides.length - 1 && watchedSecond == false) {
        if (posInit > posX1) {
          setTransform(transform, lastTrf);
          return;
        } else {
          allowSwipe = true;
        }
      }

      // запрет протаскивания дальше одного слайда
      if (posInit > posX1 && transform < nextTrf || posInit < posX1 && transform > prevTrf) {
        reachEdge();
        return;
      }

      // двигаем слайд
      sliderTrack.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`;
      
// //авто пауза и воспроизведение

controlsVideo(slideIndex);

    }
  },
  swipeEnd = function() {
    posFinal = posInit - posX1;

    isScroll = false;
    isSwipe = false;

    document.removeEventListener('touchmove', swipeAction);
    document.removeEventListener('mousemove', swipeAction);
    document.removeEventListener('touchend', swipeEnd);
    document.removeEventListener('mouseup', swipeEnd);

    sliderList.classList.add('grab');
    sliderList.classList.remove('grabbing');

    if (allowSwipe) {
      if (Math.abs(posFinal) > posThreshold) {
        if (posInit < posX1) {
          slideIndex--;
        } else if (posInit > posX1) {
          slideIndex++;
        }
         
      }

      if (posInit !== posX1) {
        allowSwipe = false;
        slide();
      } else {
        allowSwipe = true;
      }

    } else {
      allowSwipe = true;
    }
  },
  setTransform = function(transform, comapreTransform) {
    
    if (transform >= comapreTransform) {
      if (transform > comapreTransform) {
        sliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
      }
    }
    allowSwipe = false;
  },
  reachEdge = function() {
    transition = false;
    swipeEnd();
    
    allowSwipe = true;
    
  };
sliderTrack.style.transform = 'translate3d(0px, 0px, 0px)';
sliderList.classList.add('grab');

function controlsVideo(slideIndex){
  video1.pause();
    // window.innerWidth < 767 ? video2.play() : video2.pause();
    video2.pause();
    video3.pause();
  // //авто пауза и воспроизведение
if (slideIndex==0) {
  // window.innerWidth < 767 ? video1.play() : video1.pause();
  video1.play();
    
}
if (slideIndex==1) {
  video2.play();
}

if (slideIndex==2) {
    // window.innerWidth < 767 ? video3.play() : video3.pause();
    video3.play();
} 
}


function loadBar (video, bar, name) {
  let percent=0;
  let guestWatched = false; 
  video.addEventListener('timeupdate', () => {
    
    percent = (video.currentTime / video.duration) * 100;
    // console.log(percent)
    if (percent >= 100) {
      guestWatched = true;
      
      bar.style.width = '100%';

    }
    
    if (percent<100) {
      

      // console.log(percent + 'процентов');
      // console.log(video);
      if (percent != 0 && guestWatched == false) {
        bar.style.width = percent+'%';
      }
      if(slideIndex==0) {
        
        if(video1_10) { 
          if (video.currentTime>15 && video.currentTime<=16) {
            timeTrecker('watched video1',video.currentTime); 
            video1_10 = false;
          }
        }
        if (video1_25) {
          if(percent>25.43 && percent<26) {
            timeTrecker('watched video1', percent);
            video1_25=false;
          }
        }
        if (video1_50) { 
          if(percent>50.25591157927509 && percent<51) {
            timeTrecker('watched video1', percent);
            video1_50=false;
          }
        }
        if (video1_75) { 
          if(percent>75.25591157927509 && percent<76) {
            timeTrecker('watched video1', percent);
            video1_75 = false;
          }
        } 
        
      }
      if(slideIndex==1) {
        if (video2_10) {
          if(video.currentTime>15 && video.currentTime<16) {
            timeTrecker('watched video2', video.currentTime);
            video2_10 = false;
          }
        }
        if (video2_25) {
          if(percent>25 && percent<26) {
            timeTrecker('watched video2', percent);
            video2_25 = false;
          }
        }
        if (video2_50) {
          if(percent>50.25591157927509 && percent<51) {
            timeTrecker('watched video2', percent);
            video2_50 = false;
          }
        }
        if (video2_75) {
          if(percent>75.25591157927509 && percent<76) {
            timeTrecker('watched video2', percent);
            video2_75 = false;
          }
        }
        
      }
      if(slideIndex==2) {
        if (video3_10) {
          if (video.currentTime>15 && percent<=16) {
            timeTrecker('watched video3',video.currentTime); 
            video3_10=false;
          }
          
        }
        if (video3_25) {
          if(percent>25 && percent<26) {
            timeTrecker('watched video3', percent);
            video3_25=false;
          }
         }
         if (video3_50) {
          if(percent>50.25591157927509 && percent<50.57753418260125) {
            timeTrecker('watched video3', percent);
            video3_50=false;
          }
         }
        if (video3_75) {
          if(percent>75.25591157927509 && percent<76) {
            timeTrecker('watched video3', percent);
            video3_75=false;
          }
        }
        
        
      }
      if (percent>85 && slideIndex!=2) {
          localStorage.setItem(name, 'yes');
          next.style.background = '#91e0cb';
          if (slideIndex == 0) {
            if (localStorage.getItem('watched video1')) {
              sliderTrack.addEventListener('transitionend', () => allowSwipe = true);
              slider.addEventListener('touchstart', swipeStart);
              slider.addEventListener('mousedown', swipeStart);
            }
          }
          if (slideIndex == 1) {
            if (localStorage.getItem('watched video2')) {
              sliderTrack.addEventListener('transitionend', () => allowSwipe = true);
              slider.addEventListener('touchstart', swipeStart);
              slider.addEventListener('mousedown', swipeStart);
              watchedSecond = true;
            }
          }
      }

    }
    
    
  });
 
  video.addEventListener('ended', () => {
    bar.style.width = '100%';
    
  });
  
}
const imageContainer = document.querySelectorAll('.swiper__item-img');
const textBlocks = document.querySelectorAll('.swiper__text');
const itemsbar = document.querySelector('.swiper__header');
let left = document.querySelector('.prev');
let right = document.querySelector('.next');
const allExtraTexts2 = document.querySelectorAll('.swiper__text-2');
const extraText3 = document.querySelector('.swiper__text-3');
function makingMove(slideIndex) {
  controlsVideo(slideIndex);
  if (localStorage.getItem('watched video1')) {
    imageContainer[0].nextElementSibling.style.opacity = '1';

  }
  if (localStorage.getItem('watched video2')) {
    imageContainer[1].nextElementSibling.style.opacity = '1';
    next.style.background = '#91e0cb';
  }
  if (localStorage.getItem('watched video3')) {
    imageContainer[2].nextElementSibling.style.opacity = '1';
  }
  if (slideIndex == 0) {
    controlsVideo(slideIndex);
    loadBar(vid1, bar1 , 'watched video1');
    imageContainer.forEach((img)=>{
      img.parentElement.classList.remove('swiper__item-wrap-before');
    });
    imageContainer[0].parentElement.classList.toggle('swiper__item-wrap-before');
    document.querySelector('.prev').style.background = '';
    allExtraTexts2.forEach(((item)=>{
      item.style.display = 'none';
    }));
    if (localStorage.getItem('watched video1')) {
      next.style.background = '#91e0cb';
    } else {
      next.style.background = '#d9f4ed';
    }
    extraText3.style.display = 'none';
    imageContainer[1].style.border = 'unset';
    imageContainer[1].style.borderRadius = 'unset';
    imageContainer[2].style.border = 'unset';
    imageContainer[2].style.borderRadius = 'unset';
    textBlocks[0].classList.add('swiper__text_active');
    textBlocks[1].classList.remove('swiper__text_active');
    textBlocks[2].classList.remove('swiper__text_active');
    imageContainer.forEach((item)=>{
      item.nextElementSibling.style.opacity = '1';
    })
    imageContainer[slideIndex].nextElementSibling.style.opacity = '0';
    if (window.innerWidth > 991 & window.innerWidth  < 1200) {
      itemsbar.style.transform = 'translateX(0px)';
    }
    if (window.innerWidth < 991 && window.innerWidth  > 767) {
      itemsbar.style.transform = 'translateX(0px)';
    }
    if (window.innerWidth < 767 && window.innerWidth  > 576) {
      itemsbar.style.transform = 'translateX(0px)';

    }
    if (window.innerWidth < 576 && window.innerWidth  >= 430) {
      itemsbar.style.transform = 'translateX(0px)';
      
      
    }
    if (window.innerWidth < 576 && window.innerWidth  >= 200) {
      itemsbar.style.transform = 'translateX(0px)';
      document.querySelector('.blur-white-left').style.display = 'none';
      document.querySelector('.blur-white-right').style.display = 'block';
      // console.log('слайдер 0');
    }
  }
  if (slideIndex == 1) {
    controlsVideo(slideIndex);
    loadBar(vid2, bar2, 'watched video2');
    if(localStorage.getItem('watched video2')) {
      document.querySelector('.prev').style.background = '#91e0cb';
      document.querySelector('.next').style.background = '';
    } else {
      document.querySelector('.prev').style.background = '#91e0cb';
      document.querySelector('.next').style.background = '#d9f4ed';
      

    }
    imageContainer.forEach((img)=>{
      img.parentElement.classList.remove('swiper__item-wrap-before');
    });
    imageContainer[1].parentElement.classList.toggle('swiper__item-wrap-before');
    
    if (localStorage.getItem('watched video2')) {
      next.style.background = '#91e0cb';
    }
    imageContainer[0].style.border = 'unset';
    imageContainer[0].style.borderRadius = 'unset';
    imageContainer[2].style.border = 'unset';
    imageContainer[2].style.borderRadius = 'unset';
    textBlocks[1].classList.add('swiper__text_active');
    textBlocks[0].classList.remove('swiper__text_active');
    textBlocks[2].classList.remove('swiper__text_active');
    imageContainer.forEach((item)=>{
      item.nextElementSibling.style.opacity = '1';
    })
    imageContainer[slideIndex].nextElementSibling.style.opacity = '0';
    allExtraTexts2.forEach(((item)=>{
      item.style.display = 'block';
    }));
    extraText3.style.display = 'none';
    if (window.innerWidth >= 991 && window.innerWidth  < 1200) {
      itemsbar.style.transform = 'translateX(-60px)';
      
    }
    if (window.innerWidth < 991 && window.innerWidth  >= 767) {
      itemsbar.style.transform = 'translateX(-185px)';
    }
    if (window.innerWidth < 767 && window.innerWidth  >= 576) {
      itemsbar.style.transform = 'translateX(-270px)';

    }
    if (window.innerWidth < 576 && window.innerWidth  >= 200) {
      itemsbar.style.transform = 'translateX(-195px)';
      document.querySelector('.blur-white-left').style.display = 'block';
      document.querySelector('.blur-white-right').style.display = 'block';
    }
  }
  if (slideIndex == 2) {
    controlsVideo(slideIndex);
    loadBar(vid3, bar3, 'watched video3');
    imageContainer.forEach((img)=>{
      img.parentElement.classList.remove('swiper__item-wrap-before');
    });
    imageContainer[2].parentElement.classList.toggle('swiper__item-wrap-before');
    document.querySelector('.next').style.background = '#d9f4ed';
    document.querySelector('.prev').style.background = '#91e0cb';
    allExtraTexts2.forEach(((item)=>{
      item.style.display = 'none';
    }));
    extraText3.style.display = 'block';
    // console.log(extraText3);
    imageContainer.forEach((item)=>{
      item.nextElementSibling.style.opacity = '1';
    })
    imageContainer[slideIndex].nextElementSibling.style.opacity = '0';
    imageContainer[1].style.border = 'unset';
    imageContainer[1].style.borderRadius = 'unset';
    imageContainer[2].style.border = 'unset';
    imageContainer[2].style.borderRadius = 'unset';
    textBlocks[2].classList.add('swiper__text_active');
    textBlocks[0].classList.remove('swiper__text_active');
    textBlocks[1].classList.remove('swiper__text_active');
    if (window.innerWidth >= 991 && window.innerWidth  < 1200) {
      itemsbar.style.transform = 'translateX(-120px)';
      
    }
    if (window.innerWidth < 991 && window.innerWidth  >= 767) {
      itemsbar.style.transform = 'translateX(-370px)';
    }
    if (window.innerWidth < 767 && window.innerWidth  >= 576) {
      itemsbar.style.transform = 'translateX(-450px)';
    }
    if (window.innerWidth < 576 && window.innerWidth  >= 200) {
      itemsbar.style.transform = 'translateX(-256px)';
      document.querySelector('.blur-white-left').style.display = 'block';
      document.querySelector('.blur-white-right').style.display = 'none';
    }
  }

}


loadBar(vid1, bar1 , 'watched video1');
loadBar(vid2, bar2, 'watched video2');
loadBar(vid3, bar3, 'watched video3');
//события стрелки
arrows.addEventListener('click', function(event) {
  let target = event.target;

  if (((target.classList.contains('next') && localStorage.getItem('watched video1')) || (target.parentElement.classList.contains('next') && target.tagName == 'IMG' && localStorage.getItem('watched video1')))) {
    if(slideIndex==1 && localStorage.getItem('watched video1') && localStorage.getItem('watched video2')){
      // makingMove(0);
      slideIndex++;
    }
    if (slideIndex==0 && localStorage.getItem('watched video1')) {
      // makingMove(0);
      slideIndex++;
    }
    
  }
   else if ((target.classList.contains('prev')) || (target.parentElement.classList.contains('prev') && target.tagName == 'IMG' && arrows.querySelector('.prev').querySelector('img'))) {
    slideIndex--;
  } else {
    return;
  }
  makingMove(slideIndex);
  slide();
});

arrows.addEventListener('touchstart', function(event) {
  let target = event.target;

  if (((target.classList.contains('next')  && localStorage.getItem('watched video1')) || (target.parentElement.classList.contains('next') && target.tagName == 'IMG' && localStorage.getItem('watched video1')))) {
    if(slideIndex==1 && localStorage.getItem('watched video1') && localStorage.getItem('watched video2')){
      // makingMove(0);
      console.log('vidoe 2');
      slideIndex++;
    }
    if (slideIndex==0 && localStorage.getItem('watched video1')) {
      // makingMove(0);
      slideIndex++;
    }
    
  }
   else if ((target.classList.contains('prev')) || (target.parentElement.classList.contains('prev') && target.tagName == 'IMG' && arrows.querySelector('.prev').querySelector('img'))) {
    console.log('prev');
    slideIndex--;
  } else {
    return;
  }
  makingMove(slideIndex);
  slide();
});

        


let watchedSecond =  localStorage.getItem('watched video2') ? true : false;//метка для проверки был ли он в 2 слайде
let tmpIndex = 0;//временный индекс для остановки видео
// Обработчик для первого видео
vid1.addEventListener('play', function() {
  if (video1_0) {
    timeTrecker('watched video1', 0);
    video1_0 = false;
  }
})
vid1.addEventListener('ended', function() {
  // Разрешаем свайп до второго слайда
  // makingMove(0);
  
  
  if (video1_100) {
    timeTrecker('watched video1', 100);
    video1_100 = false;
  }
  if(video2_0) {
    timeTrecker('watched video2',0);
    video2_0 = false;
  }
  localStorage.setItem("watched video1", "yes");
  slideIndex++;
  slide();
  sliderTrack.addEventListener('transitionend', () => allowSwipe = true);
  slider.addEventListener('touchstart', swipeStart);
  slider.addEventListener('mousedown', swipeStart);
  vid1.pause(); 
});
tmpIndex = slideIndex;
// Обработчик для второго видео

if (localStorage.getItem('watched video1')) {
  sliderTrack.addEventListener('transitionend', () => allowSwipe = true);
  slider.addEventListener('touchstart', swipeStart);
  slider.addEventListener('mousedown', swipeStart);
}
if (localStorage.getItem('watched video2')) {
  sliderTrack.addEventListener('transitionend', () => allowSwipe = true);
  slider.addEventListener('touchstart', swipeStart);
  slider.addEventListener('mousedown', swipeStart);
  watchedSecond = true;
  vid2.addEventListener('ended', function() {
    // Разрешаем свайп до третьего слайда
    if(video2_100) {
      timeTrecker('watched video2',100);
      video2_100=false;
    }
    if(video3_0) {
      timeTrecker('watched video3',0);
      video3_0=false;
    }
    
    slideIndex++;
    slide();
    // makingMove(slideIndex);
    sliderTrack.addEventListener('transitionend', () => allowSwipe = true);
    slider.addEventListener('touchstart', swipeStart);
    slider.addEventListener('mousedown', swipeStart);
    watchedSecond = true;
  });
  // controlsVideo(slideIndex);
  
  // makingMove(0);
} else {
  vid2.addEventListener('ended', function() {
    // Разрешаем свайп до третьего слайда
    
    slideIndex++;
    localStorage.setItem("watched video2", "yes");
    slide();
    // makingMove(slideIndex)
    // makingMove(slideIndex);
    sliderTrack.addEventListener('transitionend', () => allowSwipe = true);
    slider.addEventListener('touchstart', swipeStart);
    slider.addEventListener('mousedown', swipeStart);
    watchedSecond = true;
  });
  // controlsVideo(slideIndex);
  
  // makingMove(0);
}


if (window.innerWidth < 576 && window.innerWidth  >= 300) {
  document.querySelector('.blur-white-left').style.display = 'none';
  document.querySelector('.blur-white-right').style.display = 'block';
}
vid3.addEventListener('ended', function() {
  
  if(video3_100) {
    timeTrecker('watched video3',100);
    video3_100=false;
  }
  localStorage.setItem("watched video3", "yes");
  
  
});

let myStatisticArray = {};
function timeTrecker(video,percent) {
  if (video == 'watched video1') {
    if (Math.floor(percent) == 15) {
      console.log(`Видео 1 просмотренно на ${Math.floor(percent)} секунд`);
    } else {
      console.log(`Видео 1 просмотренно на ${Math.floor(percent)}%`);
    }
    myStatisticArray[`${Math.floor(percent)}%Of${video}`] = video;
    console.log(myStatisticArray);
  }
  if (video == 'watched video2') {
    if (Math.floor(percent) == 15) {
      console.log(`Видео 2 просмотренно на ${Math.floor(percent)} секунд`);
    } else {
      console.log(`Видео 2 просмотренно на ${Math.floor(percent)}%`);
    }
    myStatisticArray[`${Math.floor(percent)}%Of${video}`] = video;
    console.log(myStatisticArray);
  }
  if (video == 'watched video3') {
    if (Math.floor(percent) == 15) {
      console.log(`Видео 3 просмотренно на ${Math.floor(percent)} секунд`);
    } else {
      console.log(`Видео 3 просмотренно на ${Math.floor(percent)}%`);
    }
    
    myStatisticArray[`${Math.floor(percent)}%Of${video}`] = video;
    console.log(myStatisticArray);
  }
  
}
// document.addEventListener('DOMContentLoaded', function() {
//   document.querySelector('.video1').play();
// });

if(slideIndex==0) {
  textBlocks[0].classList.add('swiper__text_active');
  textBlocks[1].classList.remove('swiper__text_active');
  textBlocks[2].classList.remove('swiper__text_active');
  imageContainer.forEach((item)=>{
    item.nextElementSibling.style.opacity = '1';
  });
  imageContainer[0].parentElement.classList.toggle('swiper__item-wrap-before');
  imageContainer[0].nextElementSibling.style.opacity='0';
  if (localStorage.getItem('watched video1')) {
    next.style.background = '#91e0cb';
  } else {
    next.style.background = '#d9f4ed';
  }
}


vid1.volume = 0;

});
