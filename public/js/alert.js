/*eslint-disable*/

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// Type of success or error
export const showAlert = (type, mgs) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${mgs}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};
