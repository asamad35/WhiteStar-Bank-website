'use strict';

///////////////////////////////////////
// Selections

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

// End of Selections
///////////////////////////////////////

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  // console.log(e.target);
  e.preventDefault();
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
// End of Modal window
///////////////////////////////////////

///////////////////////////////////////
// Smooth scrolling
btnScrollTo.addEventListener('click', e => {
  /*
  const s1coords = section1.getBoundingClientRect();

  // return the position of the targetBox w.r.t viewport
  console.log(s1coords.top);

  //  return how much px is scrolled from the viewport
  console.log(window.scrollY);

  // return the height of viewport
  console.log(document.documentElement.clientHeight);

  // SCROLLING

  // Old Method
  // scroll w.r.t TOP OF DOCUMENT not w.r.t viewport
  window.scrollTo({
    top: s1coords.top + window.scrollY,
    behavior: 'smooth',
  });
  */

  // New Method
  section1.scrollIntoView({ behavior: 'smooth' });
});

// End of Smooth scrolling
///////////////////////////////////////

///////////////////////////////////////
// Page navigation
/*
           // INEFFICIENT WAY
document.querySelectorAll('.nav__link').forEach(el => {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
}); 
*/

// Event Delegation
// 1. Add event listener to common parent element.
// 2. Determine what element originated the event.
// EFFICIENT WAY

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // MATCHING
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
// End of page Navigation
///////////////////////////////////////

///////////////////////////////////////
// Sticky navigation

/* Inefficient way
const initialCoords = section1.getBoundingClientRect().top;
console.log(initialCoords);
window.addEventListener('scroll', function () {
  console.log(window.scrollY);
  if (window.scrollY > initialCoords) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
*/
const navHeight = nav.getBoundingClientRect().height;
function obsCallBack(entries) {
  const entry = entries[0];
  /* Q: isIntersecting true kb hota he ?
     A: when threshold is x% to target element ka atleast x% part root element me visible hona chahiye .
     Example if threshold is 0. Then if atleast 0% of target element is visible in root element then "isIntersecting" will be true 
  */
  if (entry.isIntersecting == false) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}
const obsOption = {
  root: null,
  theshold: 0,
  rootMargin: `-${navHeight}px`,
};
const observer = new IntersectionObserver(obsCallBack, obsOption);
observer.observe(header);

// Sticky navigation End
///////////////////////////////////////

///////////////////////////////////////
// Reveal Sections
const allSections = document.querySelectorAll('.section');

function revealSection(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  sectionObserver.unobserve(entry.target);
}
const revealOption = {
  root: null,
  threshold: 0.15,
};
const sectionObserver = new IntersectionObserver(revealSection, revealOption);
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
// Reveal Sections End
///////////////////////////////////////

///////////////////////////////////////
// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src');
function loadImg(entries) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  imgObserver.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(imgTarget => imgObserver.observe(imgTarget));
// Lazy loading images end
///////////////////////////////////////

///////////////////////////////////////
// Slider component

function slider() {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let curSlide = 0;
  const maxSlide = slides.length;

  // ------------Functions
  function init() {
    goToSlide(0);
    createDots();
    activateDot(0);
  }
  init();
  function createDots() {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  }

  function goToSlide(slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${(i - slide) * 100}%)`;
    });
  }

  // Next Slide
  function nextSlide() {
    if (curSlide == maxSlide - 1) curSlide = 0;
    else curSlide++;

    activateDot(curSlide);
    goToSlide(curSlide);
  }

  // Previous Slide
  function prevSlide() {
    if (curSlide == 0) curSlide = maxSlide - 1;
    else curSlide--;

    activateDot(curSlide);
    goToSlide(curSlide);
  }

  // Dots sliding navigation
  function activateDot(slide) {
    [...dotContainer.children].forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    const activeDot = document.querySelector(
      `.dots__dot[data-slide="${slide}"]`
    );
    activeDot.classList.add('dots__dot--active');
  }

  //------------------------- Event Listeners

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  // keyboard sliding navigation
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
  // handle dots
  dotContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
}
slider();
// Slider component end
///////////////////////////////////////

// Tabbed component

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Active content area
  tabsContent.forEach(tc => tc.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
//End of Tabbed component
///////////////////////////////////////

///////////////////////////////////////
// MENU FADE
// mouseover and mouseenter are same but mouseover also bubbles

function handleHover(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    // const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(sibling => {
      sibling.style.opacity = this;
    });
    link.style.opacity = '1';
  }
}

nav.addEventListener('mouseover', handleHover.bind('0.5'));
nav.addEventListener('mouseout', handleHover.bind('1'));
///////////////////////////////////////
// EVENT PROPAGATION (CAPTURING PHASE, TARGET PHASE, BUBBLING PHASE,)
/*
const alertMe = e => {
  alert('you Are in');
  section1.removeEventListener('mouseenter', alertMe);
};
section1.addEventListener('mouseenter', alertMe);

section1.addEventListener('click', e => {
  console.log(this);
});
section1.addEventListener('click', function (e) {
  console.log(this);
});
*/
