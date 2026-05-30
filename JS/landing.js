'use strict';
const section1 = document.querySelector('#section--1');
const learnMoreBtn = document.querySelector('.btn--scroll-to');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnEl = document.getElementById('nav-open');
const closeBtnEl = document.getElementById('nav-close');
const navEl = document.querySelector('.nav');
const mainHeader = document.getElementById('header-main');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const lazyImage = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
///////////////////////////////////////
// Modal window

const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// // Humbarger BTN

function closeEnj() {
  if ((navEl.style.left = '210px')) {
    navEl.style.left = '-210px';
    closeBtnEl.style.display = 'none';
    btnEl.style.display = 'block';
    mainHeader.style.opacity = '1';
  }
}

navEl.style.left = '210px';
btnEl.addEventListener('click', function () {
  if ((navEl.style.left = '210px')) {
    closeBtnEl.style.display = 'block';
    btnEl.style.display = 'none';
    navEl.style.opacity = '1';
  } else {
    navEl.style.left = '-210px';
  }
});
closeBtnEl.addEventListener('click', closeEnj);
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeEnj();
  }
});
// CookieMessage
function cookieEng() {
  const message = document.createElement('div');
  message.classList.add('cookie-message');
  message.innerHTML = `<h3>We Use Cookies to Develop Our Performance!</h3> <button class="btn btn-close-cookies">OK</button>`;
  header.prepend(message);
  message.style.width = '120%';
  message.style.backgroundColor = '#37383d';
  message.style.height =
    Number.parseFloat(getComputedStyle(message).height, 10) + 28 + 'px';
  document
    .querySelector('.btn-close-cookies')
    .addEventListener('click', () => message.remove());
}
cookieEng();
// Scrolling
learnMoreBtn.addEventListener('click', function (event) {
  const first = section1.getBoundingClientRect();
  section1.scrollIntoView({ behavior: 'smooth' });
});

// nav-Smoth
document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    event.preventDefault();
    // condition
    if (event.target.classList.contains('nav__link')) {
      const position = event.target.getAttribute('href');
      document.querySelector(position).scrollIntoView({ behavior: 'smooth' });
    }
  });

// operations sliders

tabContainer.addEventListener('click', function (event) {
  const click = event.target.closest('.operations__tab');
  // guard class
  if (!click) return;
  // removing classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(item =>
    item.classList.remove('operations__content--active')
  );

  // adding classes
  click.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${click.dataset.tab}`) //check notes
    .classList.add('operations__content--active');
});

// Navigation Hovering
const hoverEng = function (event) {
  if (event.target.classList.contains('nav__link')) {
    const main = event.target;
    const sibling = main.closest('.nav').querySelectorAll('.nav__link');
    const logo = main.closest('.nav').querySelector('img');

    sibling.forEach(item => {
      if (item !== main) item.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
navEl.addEventListener('mouseover', hoverEng.bind(0.5));
navEl.addEventListener('mouseout', hoverEng.bind(1));

// sticky Navigation positioning
const navHeight = navEl.getBoundingClientRect().height;
const stickyNov = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting && window.innerWidth > 700) {
    navEl.classList.add('sticky');
    navEl.style.left = '0px';
  } else navEl.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNov, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// section animation
const revealSecEnj = function (entries, observe) {
  const [entry] = entries;
 
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observe.unobserve(entry.target);
};
const sectionObser = new IntersectionObserver(revealSecEnj, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (sec) {
  sectionObser.observe(sec);
  sec.classList.add('section--hidden');
});

// lazy Image
function lazyImgEng(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  // replace src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
}

const imgObse = new IntersectionObserver(lazyImgEng, {
  root: null,
  threshold: 0,
  rootMargin: '150px',
});
lazyImage.forEach(img => imgObse.observe(img));

// Slider

let currSlid = 0;
const maxSlid = slides.length;
const dotBox = document.querySelector('.dots');
function creatDots() {
  slides.forEach((_, i) => {
    dotBox.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
}
function activeDot(slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide = '${slide}']`)
    .classList.add('dots__dot--active');
}
function goToSlide(slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
}

function nextSlide() {
  if (currSlid === maxSlid - 1) {
    currSlid = 0;
  } else {
    currSlid++;
  }
  goToSlide(currSlid);
  activeDot(currSlid);
}
function preSlide() {
  if (currSlid === 0) {
    currSlid = maxSlid - 1;
  } else {
    currSlid--;
  }
  goToSlide(currSlid);
  activeDot(currSlid);
}
function initFunc() {
  goToSlide(0);
  creatDots();
  activeDot(0);
}
initFunc();
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', preSlide);
document.addEventListener('keydown', function (event) {
  event.key === 'ArrowRight' && nextSlide();
  event.key === 'ArrowLeft' && preSlide();
});
dotBox.addEventListener('click', function (event) {
  if (event.target.classList.contains('dots__dot')) {
    const { slide } = event.target.dataset;
    goToSlide(slide);
    activeDot(slide);
  }
});
