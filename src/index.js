import 'Styles/pages/index.scss';
import Carousel from 'Components/carousel/carousel.js';
import PopupForm from 'Components/popup-form/popup-form.js';
import Nav from 'Components/menu/menu.js';
import RangeBar from 'Components/range-bar/range-bar.js';
import Filter from 'Components/filter/filter.js';

const carouseles = document.querySelectorAll('.carousel');
carouseles.forEach((item) => {
  const carousel = new Carousel(item);
  carousel.init();
});

const orderCall = document.querySelector('.order-call');
const searchBar = document.querySelector('.search-bar');
const orderCallPopupForm = new PopupForm(orderCall);
const SearchBarPopupForm = new PopupForm(searchBar);
orderCallPopupForm.init();
SearchBarPopupForm.init();

const elementMenu = document.querySelector('#menu');
const menu = new Nav(elementMenu);
menu.init();

const elementRangeBar = document.querySelector('#range-bar');
const rangeBar = new RangeBar(elementRangeBar);
rangeBar.init();

const offers = require('BD/projects/partners.json');

localStorage.setItem('offers', JSON.stringify(offers));

const elementFilter = document.querySelector('#filter');
const filter = new Filter(elementFilter);
filter.init();

// const elemCarouselServices = document.querySelector('#carousel-services');
// const elemCarouselBenefits = document.querySelector('#carousel-benefits');
// const elemCarouselReviews = document.querySelector('#carousel-reviews');
// const CarouselServices = new Carousel(elemCarouselServices);
// const CarouselBenefits = new Carousel(elemCarouselBenefits);
// const CarouselReviews = new Carousel(elemCarouselReviews);

// CarouselServices.init();
// CarouselBenefits.init();
// CarouselReviews.init();

// const form = document.querySelector('#form-signup');
// const validatorSignupForm = new FormValidator(form);

// validatorSignupForm.init();

if (module.hot) {
  module.hot.accept();
}
