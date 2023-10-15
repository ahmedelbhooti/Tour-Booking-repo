/*eslint-disable*/
import '@babel/polyfill';
import { login, logout } from './login';
import { forgetPassword } from './forgetpassword';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSetting';
import { signUp } from './signup';
import { resetPassword } from './resetpassword';
import { bookTour } from './stripe';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const LogOut = document.querySelector('.nav__el--logout');
const update = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const singUpForm = document.querySelector('.form--signUp');
const ForgetPasswordForm = document.querySelector('.form--forgetPassword');
const resetPasswordForm = document.querySelector('.form--resetPassword');
const bookTourBtn = document.getElementById('book-tour');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (singUpForm) {
  singUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('user-name').value);
    form.append('email', document.getElementById('email').value);
    form.append('password', document.getElementById('password').value);
    form.append(
      'passwordConfirmation',
      document.getElementById('password-confirm').value,
    );
    // form.append('photo', document.getElementById('photo').files[0]);

    signUp(form);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (LogOut) {
  LogOut.addEventListener('click', logout);
}

if (update) {
  update.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });
}
// function updateSettings(formData, data, callback) {
//   // Perform your updateSettings logic here
//   // ...

//   // Call the callback function after the operation completes
//   if (callback) {
//     callback();
//   }
// }
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    document.querySelector('.save--password').textContent = 'UPDATING...';
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirmation =
      document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirmation },
      'password',
    );
    document.querySelector('.save--password').textContent = 'SAVE PASSWORD';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (ForgetPasswordForm) {
  ForgetPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    forgetPassword(email);
  });
}

//-------To send new password to the endpoint--------
if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const token = document.getElementById('token').value;
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById(
      'passwordConfirmation',
    ).value;
    resetPassword(token, password, passwordConfirmation);
  });
}

if (bookTourBtn) {
  bookTourBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
