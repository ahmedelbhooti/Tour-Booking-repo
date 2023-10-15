/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const resetPassword = async (token, password, passwordConfirmation) => {
  try {
    // console.log(token);
    const res = await axios({
      method: 'PATCH',
      url: `http://localhost:3000/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirmation,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
    // console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
