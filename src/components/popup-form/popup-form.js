import * as lib from 'Lib/openerForm/openerForm.js';

const PopupForm = lib.openerForm;

PopupForm.prototype = {
  constructor: PopupForm,
  init: lib.init,
  setListeners: lib.setListeners,
  showPopup: lib.showPopup,
  hidePopup: lib.hidePopup,
  catchClick: lib.catchClick,
  handleEvent: lib.handleEvent,
};

export default PopupForm;
