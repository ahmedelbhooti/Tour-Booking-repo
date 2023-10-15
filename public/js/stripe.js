/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
  'pk_test_51NxbP0G5OMcQGF6QZmwTfiIVVHwRMH6sVtcEhQWWsaBafjIwDxlvnmHsPVhaF17O2dIj6qMjoXYIHL5mbiwvCIF500oNy5kWFA',
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get the session form API
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`,
    );
    console.log(session);

    // 2) Create checkout form + chanre credit card

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (e) {
    console.log(e);
    showAlert('error', e);
  }
};
