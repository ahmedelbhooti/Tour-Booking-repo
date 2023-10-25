# Tour-Booking

Built using modern technologies: node.js, express.js, mongoDB, mongoDB Atlas, Mongoose, JWT, PUG template, ParcelJS, Stripe, Postman, Mailtrap & Gmail and Mapbox.
![1](https://github.com/ahmedelbhooti/Tour-Booking-repo/assets/102395081/e4fce365-71cd-4158-8476-2be3fa10073e)

Responsive Mode:
![2](https://github.com/ahmedelbhooti/Tour-Booking-repo/assets/102395081/fbb83589-bbc8-42c7-8410-1e478e374b0d)

Details Page:
![3](https://github.com/ahmedelbhooti/Tour-Booking-repo/assets/102395081/ac9ed2b1-a2db-4084-8939-681af87d2eb1)

Profile Page:
![4](https://github.com/ahmedelbhooti/Tour-Booking-repo/assets/102395081/02187c80-38a3-4469-a41f-0e56d6ad926c)

Payment Page:
![5](https://github.com/ahmedelbhooti/Tour-Booking-repo/assets/102395081/09a148cd-d0bf-4cb6-b4fc-bc40cd613d55)



The following is an explanation of all APIs and routes in tourRoutes:

GET /tour-stats: Returns statistics for all tours, such as the most popular tour and the average rating of all tours.
GET /monthly-plan/:year: Returns a monthly plan for all tours in the given year. This route is only accessible to logged-in users with the admin, lead-guide, or guide role.
GET /top-5-cheap: Returns the top 5 cheapest tours.
GET /: Returns a list of all tours.
POST /: Creates a new tour. This route is only accessible to logged-in users with the admin or lead-guide role.
GET /tours-within/:distance/center/:latlng/unit/:unit: Returns a list of all tours within the given distance of the given latitude and longitude, using the given unit of measurement.
GET /distances/:latlng/unit/:unit: Returns the distances to all tours from the given latitude and longitude, using the given unit of measurement.
GET /:id: Returns the tour with the given ID.
PATCH /:id: Updates the tour with the given ID. This route is only accessible to logged-in users with the admin or lead-guide role.
DELETE /:id: Deletes the tour with the given ID. This route is only accessible to logged-in users with the admin or lead-guide role.

Nested route for creating a new review:

POST /:tourId/review: Creates a new review for the tour with the given ID. This route is only accessible to logged-in users with the user role.

Tour API

This API provides access to information about tours, including:

A list of all tours
The details of a specific tour
The ability to create new tours
The ability to update existing tours
The ability to delete tours

Review API

This API provides the ability for users to create reviews of tours.

This route returns statistics for all tours, such as the most popular tour and the average rating of all tours.

Required parameters:

None
Expected output:
{
  "mostPopularTour": "The Forset Hiker",
  "averageRating": 5
}

The following is an explanation of all the APIs and routes in userRoute:

Auth routes:

POST /signup: Creates a new user account.
POST /login: Logs in a user and returns a JSON Web Token (JWT).
GET /logout: Logs out the current user.
POST /forgetPassword: Sends a password reset email to the user.
PATCH /resetPassword/:token: Resets the user's password using the given token.
Protected routes:

PATCH /updateMyPassword: Updates the current user's password.
PATCH /updateMe: Updates the current user's profile information.
DELETE /deleteMe: Deletes the current user's account.
GET /me: Returns the current user's profile information.

Admin routes:

GET /: Returns a list of all users.
POST /: Creates a new user.
GET /:id: Returns the user with the given ID.
PATCH /:id: Updates the user with the given ID.
DELETE /:id: Deletes the user with the given ID.

Auth API

This API provides the ability to create new user accounts, log in users, and reset forgotten passwords.

Protected API

This API provides the ability for logged-in users to update their profile information and password, and to delete their accounts.

Admin API

This API provides the ability for administrators to manage user accounts, including creating new users, updating existing users, and deleting users.

you could write something like the following for the /signup route:

POST /signup

This route creates a new user account.

Required parameters:

name: The user's name.
email: The user's email address.
password: The user's password.
passwordConfirmation: The user's password.

Expected output:
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTU4NjI2MjQ5MywiZXhwIjoxNTg2MzQ4ODkzfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}

The following is an explanation of all the APIs and routes in reviewRoutes:

GET /: Returns a list of all reviews for the current tour.
POST /: Creates a new review for the current tour. This route is only accessible to logged-in users.
GET /:id: Returns the review with the given ID.
PATCH /:id: Updates the review with the given ID. This route is only accessible to logged-in users with the admin or user role.
DELETE /:id: Deletes the review with the given ID. This route is only accessible to logged-in users with the admin or user role.
The mergeParams: true option in the router constructor tells Express to merge the parameters from the parent router into the child router. This means that the tourId parameter will be available in all of the routes in this router.

The authController.protect middleware is used to protect all of the routes in this router. This means that users will need to be logged in to access any of the routes.

The authController.restrictTo() middleware is used to restrict access to certain routes to users with specific roles. For example, the POST / route is only accessible to logged-in users with the user role.

The reviewController.setTourAndUserIDs() middleware is used to set the tourId and userId on the request object. This is necessary for creating a new review.

The reviewController.getAllReviews(), reviewController.getOneReview(), reviewController.updateReview(), and reviewController.deleteReview() functions are responsible for handling requests to the corresponding routes.

Review API

This API provides the ability to create, read, update, and delete reviews for tours. All routes in this API are protected, so users must be logged in to access them.

Creating a new review

To create a new review, you must send a POST request to the / route with the following parameters:

rating: The rating of the review (1-5 stars).
comment: The comment for the review.
Getting all reviews for a tour

To get all reviews for a tour, you must send a GET request to the / route.

Getting a specific review

To get a specific review, you must send a GET request to the / route with the ID of the review in the URL.

Updating a review

To update a review, you must send a PATCH request to the / route with the ID of the review in the URL and the updated parameters.

Deleting a review

To delete a review, you must send a DELETE request to the / route with the ID of the review in the URL.

The following is an explanation of all the APIs and routes in bookingRoutes:

GET /checkout-session/:tourId: Returns a Stripe Checkout Session for the tour with the given ID.
GET /: Returns a list of all bookings. This route is only accessible to logged-in users with the admin or lead-guide role.
POST /: Creates a new booking. This route is only accessible to logged-in users.
GET /:id: Returns the booking with the given ID. This route is only accessible to logged-in users.
PATCH /:id: Updates the booking with the given ID. This route is only accessible to logged-in users with the admin or lead-guide role.
DELETE /:id: Deletes the booking with the given ID. This route is only accessible to logged-in users with the admin or lead-guide role.
The mergeParams: true option in the router constructor tells Express to merge the parameters from the parent router into the child router. This means that the tourId parameter will be available in all of the routes in this router.

The authController.protect middleware is used to protect all of the routes in this router. This means that users will need to be logged in to access any of the routes.

The authController.restrictTo() middleware is used to restrict access to certain routes to users with specific roles. For example, the GET / and /checkout-session/:tourId routes are only accessible to logged-in users. The POST /, PATCH /:id, and DELETE /:id routes are only accessible to logged-in users with the admin or lead-guide role.

The bookingController.getCheckoutSession() function is responsible for returning a Stripe Checkout Session for the tour with the given ID. This allows users to book a tour without having to create an account or enter any personal information.

The bookingController.getAllBookings(), bookingController.getBooking(), bookingController.createBooking(), bookingController.updateBooking(), and bookingController.deleteBooking() functions are responsible for handling requests to the corresponding routes.


Booking API

This API provides the ability to create, read, update, and delete bookings. All routes in this API are protected, so users must be logged in to access them.

Creating a new booking

To create a new booking, you must send a POST request to the / route with the following parameters:

tourId: The ID of the tour to book.
userId: The ID of the user making the booking.
startDate: The start date of the booking.
endDate: The end date of the booking.
numberOfPeople: The number of people in the booking.
Getting a checkout session for a tour

To get a checkout session for a tour, you must send a GET request to the /checkout-session/:tourId route with the ID of the tour in the URL.

Getting all bookings

To get all bookings, you must send a GET request to the / route. This route is only accessible to logged-in users with the admin or lead-guide role.

Getting a specific booking

To get a specific booking, you must send a GET request to the / route with the ID of the booking in the URL.

Updating a booking

To update a booking, you must send a PATCH request to the / route with the ID of the booking in the URL and the updated parameters.

Deleting a booking

To delete a booking, you must send a DELETE request to the / route with the ID of the booking in the URL.

link: https://tour-booking-ulhx.onrender.com
