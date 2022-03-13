import debounce from 'Lib/debounce/debounce.js';

const Filter = function(parent) {
  this.wrapper = parent;
  this.elementResult = parent.querySelector('[data-filter="result"]');
};

Filter.prototype = {
  init: function() {
    this.setListeners();
    this.setInitialValue();
  },

  setInitialValue: function() {
    const elementPrice = this.wrapper.querySelector('[data-filter="max-price"]');
    this.maxPrice = parseInt(elementPrice.max, 10);
    this.minPrice = parseInt(elementPrice.min, 10);
    this.roomValue = new Map();
    this.deadlineValue = new Map();
    this.location = '';
    this.filteredProjects = JSON.parse(localStorage.getItem('offers'));
  },

  setListeners: function() {
    this.wrapper.addEventListener('input', this);
    this.wrapper.querySelector('.btn').addEventListener('click', this);
  },

  destroy: function() {
    this.wrapper.removeEventListener('input', this);
  },

  getValue: function(input) {
    switch(input.dataset.filter) {
      case 'room':
        return this.updateRoomValue(input);
      case 'deadline':
        return this.updateDeadlineValue(input);
      case 'location':
        this.location = input.value.toLowerCase();
        break;
      case 'min-price':
        this.minPrice = parseInt(input.value, 10);
        break;
      case 'max-price':
        this.maxPrice = parseInt(input.value, 10);
        break;
      default:
        break;
    }
    return undefined;
  },

  updateRoomValue: function(checkbox) {
    checkbox.checked
      ? this.addRoomValue(checkbox)
      : this.removeRoomValue(checkbox);
  },

  addRoomValue: function(checkbox) {
    this.roomValue.set(checkbox.name, true);
  },

  removeRoomValue: function(checkbox) {
    this.roomValue.delete(checkbox.name);
  },

  updateDeadlineValue: function(checkbox) {
    checkbox.checked
      ? this.addDeadlineValue(checkbox)
      : this.removeDeadlineValue(checkbox);
  },

  addDeadlineValue: function(checkbox) {
    const value = checkbox.name.split('-');
    this.deadlineValue.set(checkbox.name, [parseInt(value[0], 10), parseInt(value[1], 10)]);
  },

  removeDeadlineValue: function(checkbox) {
    this.deadlineValue.delete(checkbox.name);
  },

  getFilterProjects: function(list) {
    const filteredProjects = list.filter((item) => {
      const project = item;
      const location = item.location.metro.toLowerCase();

      if(location !== this.location && this.location.length !== 0) {
        project.offers = [];
        return project;
      }

      project.offers = this.filterOffers(item.offers);
      return project;
    });

    this.filteredProjects = filteredProjects;
    console.log(this.filteredProjects);
  },

  filterOffers: function(list) {
    /* находим самую позднюю дату в Map */
    let deadline = [0, 0];
    this.deadlineValue.forEach((date) => {
      if(deadline[0] < date[0]) deadline = date;
      if((deadline[0] === date[0]) && (deadline[1] < date[0])) deadline = date;
    });

    /* фильтруем по самой поздней дате */
    const offers = list.filter((item) => {
      const offer = item;
      const year = parseInt(item.year, 10);
      const quarter = parseInt(item.quarter, 10);

      /* проверяем попадаем в deadline или нет */
      const isDeadline = (year < deadline[0]) || (year === deadline[0] && quarter <= deadline[1]);

      if(!isDeadline && (this.deadlineValue.size !== 0)) return false;

      offer.apartment = this.filterApartment(item.apartment);
      return offer.apartment.length > 0 ? offer : false;
    });

    return offers;
  },

  filterApartment: function(list) {
    const apartments = list.filter((item) => {
      const price = parseInt(item.price, 10) * 1000000;
      const room = (parseInt(item.room, 10) > 3) ? 3 : item.room;
      if(
        (this.minPrice <= price) && (price <= this.maxPrice)
        && (this.roomValue.has(`${room}`) || (this.roomValue.size === 0))
      ) return item;
      return false;
    });

    return apartments;
  },

  getCountAllOffers: function() {
    let count = 0;
    this.filteredProjects.forEach((project) => {
      count += project.offers.length;
    });
    return count;
  },

  getCountProjectApartments: function(project) {
    let count = 0;
    project.offers.forEach((offer) => {
      count += offer.apartment.length;
    });
    return count;
  },

  getCountAllApartments: function() {
    let count = 0;
    this.filteredProjects.forEach((project) => {
      count += this.getCountProjectApartments(project);
    });
    return count;
  },

  formatString: function(count, var1, var2, var3) {
    const char = `${count}`.slice(-1);
    const chars = `${count}`.slice(-2);

    let string = var1;

    if(char === '1' && count !== 11) string = var2;
    if(char === '2' || char === '3' || char === '4') string = var3;
    if((parseInt(chars, 10) >= 10) && (parseInt(chars, 10) <= 20)) string = var1;

    return string;
  },

  showCountOffers: function() {
    const count = this.getCountAllOffers();
    const string = this.formatString(count, 'проектов', 'проект', 'проекта');

    this.elementResult.innerText = `${count} ${string}`;
  },

  showCountApartments: function(project) {
    const parent = document.querySelector(`#project-${project.id}`);
    const target = parent.querySelector('.card-project--note-count');
    const count = this.getCountProjectApartments(project);
    const string = this.formatString(count, 'предложений', 'предложение', 'предложения');

    target.innerText = `${count} ${string}`;
  },

  onInput: function(input) {
    const offers = JSON.parse(localStorage.getItem('offers'));
    this.getValue(input);
    this.getFilterProjects(offers);
    this.showCountOffers();
  },

  getProjectMarkup: function(project) {
    const parentElement = document.querySelector(`#project-${project.id}`);
    const listElement = parentElement.querySelector('.offer-list');
    const newList = listElement.cloneNode(false);
    project.offers.forEach((offer) => {
      const item = this.getOfferMarkup(offer);
      newList.appendChild(item);
    });
    listElement.replaceWith(newList);
  },

  getOfferMarkup: function(offer) {
    const item = document.createElement('li');
    item.classList.add('offer-list--item');
    const title = document.createElement('p');
    title.classList.add('offer-list--title');
    const product = document.createElement('span');
    product.classList.add('offer-list--product');
    const price = document.createElement('span');
    price.classList.add('offer-list--price');

    title.innerText = offer.title;
    product.innerHTML = offer.ready
      ? `<span>${offer.product}.</span><span>Дом сдан</span>`
      : `<span>${offer.product}.</span><span>${offer.quarter} квартал ${offer.year}</span>`;
    price.innerText = `от ${offer.minPrice} млн. ₽`;

    item.appendChild(title);
    item.appendChild(product);
    item.appendChild(price);
    return item;
  },

  updateHeading: function() {
    const heading = document.querySelector('#heading');
    const count = this.getCountAllOffers();
    const stringStart = this.formatString(count, 'найдено', 'найден', 'найдено');
    const stringEnd = this.formatString(count, 'проектов', 'проект', 'проекта');

    heading.innerText = `${stringStart} ${count} ${stringEnd}`;
  },

  updateMarkup: function() {
    this.filteredProjects.forEach((project) => {
      this.getProjectMarkup(project);
      this.showCountApartments(project);
      this.updateHeading();
    });
  },

  debounceInput: debounce,

  handleEvent: function(e) {
    switch(e.type) {
      case 'input':
        return this.debounceInput(() => {
          this.onInput(e.target);
        }, 150);
      case 'click':
        return this.updateMarkup();
      default:
        break;
    }
    return undefined;
  },
};

export default Filter;
