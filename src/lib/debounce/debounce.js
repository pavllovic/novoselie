const debounce = (function() {
  let timeout;
  return function(callback, delay) {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
}());

export default debounce;
