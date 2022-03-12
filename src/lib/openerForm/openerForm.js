export function openerForm(parent) {
  this.wrapper = parent;
  this.btnOpen = parent.querySelector('[data-opener="open"]');
  this.btnClose = parent.querySelector('[data-opener="close"]');
  this.popup = parent.querySelector('[data-opener="popup"]');
  this.form = this.popup.querySelector('form');
}

export function init() {
  this.setListeners();
}

export function setListeners() {
  this.form.addEventListener('submit', this);
  this.wrapper.addEventListener('click', this);
}

export function showPopup() {
  this.btnOpen.setAttribute('tabindex', '-1');
  this.popup.classList.add('is-active');
  this.btnClose.focus();
  window.addEventListener('click', this);
}

export function hidePopup() {
  this.btnOpen.removeAttribute('tabindex');
  this.popup.classList.remove('is-active');
  window.removeEventListener('click', this);
}

export function catchClick(target) {
  if(!target.closest('[data-opener="popup"]') && (target !== this.btnOpen)) {
    this.hidePopup();
  }
}

export function handleEvent(e) {
  switch(e.type) {
    case 'click':
      if(e.target === this.btnOpen) return this.showPopup();
      if(e.target === this.btnClose) return this.hidePopup();
      return this.catchClick(e.target);
    case 'submit':
      e.preventDefault();
      return this.hidePopup();
    default:
      break;
  }
  return undefined;
}
