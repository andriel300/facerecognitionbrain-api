# Image Recognition Backend Server

This backend server is built using the following technologies:

- [Clarifai API](https://clarifai.com/) for image recognition
- [bcrypt](https://www.npmjs.com/package/bcrypt) for password hashing
- [Express.js](https://expressjs.com/) for routing and middleware
- [http](https://nodejs.org/api/http.html) for creating the server
- [cors](https://www.npmjs.com/package/cors) for handling Cross-Origin Resource Sharing
- [knex](http://knexjs.org/) for interacting with the database

## Endpoints

The following endpoints are available in this server:

### `GET /`

This endpoint is used for testing the server and returns the string "success" if the server is running.

### `POST /signin`

This endpoint is used for signing in users. It expects a JSON object in the request body with the following properties:

- `email`: the email of the user
- `password`: the password of the user

If the provided email and password match a record in the database, the server returns the user's information as a JSON object. If the email or password is incorrect, the server returns an error message.

### `POST /register`

This endpoint is used for registering new users. It expects a JSON object in the request body with the following properties:

- `email`: the email of the user
- `name`: the name of the user
- `password`: the password of the user

The server hashes the password before inserting it into the database. If the registration is successful, the server returns the inserted user as a JSON object.

### `GET /profile/:id`

This endpoint is used for getting the information of a specific user. It expects an id in the URL parameters. If the provided id matches a record in the database, the server returns the user's information as a JSON object. If the id is not found, the server returns an error message.

### `PUT /image`

This endpoint is used for updating the number of image entries for a user. It expects a JSON object in the request body.

## Acknowledgements

- \[Andrei Neagoie / Instructor and Founder of zerotomastery.io\] for inspiration and guidance in building this server.
