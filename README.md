# Tour-Booking

Built using modern technologies: node.js, express.js, mongoDB, mongoDB Atlas, Mongoose, JWT, PUG template, ParcelJS, Stripe, Postman, Mailtrap & Gmail and Mapbox.

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

link: https://tour-booking-ulhx.onrender.com
