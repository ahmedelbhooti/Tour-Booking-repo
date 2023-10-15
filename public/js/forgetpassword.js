/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const forgetPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/forgetPassword',
      data: {
        email,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', `Check your Dm for ${email}`);
    }
    console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
