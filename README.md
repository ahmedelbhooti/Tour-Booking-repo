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


link: https://tour-booking-ulhx.onrender.com
