🍔 Food Delivery API

A RESTful API for managing food orders, users, restaurants, and categories in a food delivery application.Built with Node.js, Express, and MongoDB.

📋 Table of Contents

🚀 Features

💪 Tech Stack

🔧 Prerequisites

⚙️ Installation

📝 Configuration

🎮 Running the Server

📚 API Endpoints

🔐 Authentication

🤝 Contributing

📜 License

🚀 Features

User sign-up, sign-in, and sign-out with JWT

Email verification and password reset flows

Role-based access control: Admin, Client, Vendor, Delivery

CRUD operations for Restaurants, Categories, and Foods

Order placement, status updates, and order history

Input validation using Joi

Centralized error handling with meaningful status codes

💪 Tech Stack

Node.js

Express.js

MongoDB + Mongoose

Joi for input validation

jsonwebtoken for auth

bcrypt for password hashing

🔧 Prerequisites

Node.js v14+

npm or yarn

A MongoDB instance (local or Atlas)

⚙️ Installation

Clone the repository:

git clone https://github.com/your-username/food-delivery-api.git
cd food-delivery-api

Install dependencies:

npm install
# or
yarn install

📝 Configuration

Copy the example environment file:

cp .env.example .env

Update your .env file with the appropriate values:

PORT=3000
MONGO_URL=mongodb+srv://<username>:<password>@your-cluster.mongodb.net/food-app
SECRET_ACCESS_TOKEN=your_access_token_secret
SECRET_REFRESH_TOKEN=your_refresh_token_secret
NODE_CODE_SENDING_EMAIL_ADDRESS=your_email@example.com
NODE_CODE_SENDING_EMAIL_PASSWORD=your_email_password
HMAC_VERIFICATION_CODE_SECRET=your_hmac_secret

🔐 Important: Do not commit your actual .env file to version control. Use .env.example as a reference.

🎮 Running the Server

npm start
# or for development
npm run dev

API will be available at:👉 http://localhost:3000/api

📚 API Endpoints

All protected routes require a Bearer token in the request header:

Authorization: Bearer <your_jwt_token>

🔐 Authentication - /api/auth

Method

Endpoint

Description

POST

/signup

Register a new user

POST

/signin

Log in and receive JWT

POST

/signout

Invalidate current token

PATCH

/send-verification-code

Send email verification code

PATCH

/verify-verification-code

Verify email using code

PATCH

/send-forgot-password-code

Send password reset code

PATCH

/verify-forgot-password-code

Verify password reset code

POST

/refresh-token

Refresh access token

👤 Users - /api/users

Method

Endpoint

Description

GET

/profile

Get current user's profile

PATCH

/profile

Update own profile

PATCH

/change-password

Change own password

DELETE

/profile

Delete own account

GET

/all-users

(Admin) List all users

GET

/profile/:id

(Admin) Get a specific user

PATCH

/profile/:id

(Admin) Update a specific user

DELETE

/profile/:id

(Admin) Delete a specific user

🍽️ Restaurants - /api/restaurant

Method

Endpoint

Description

POST

/create

(Admin) Create a restaurant

GET

/get-all

Get all restaurants

GET

/get/:id

Get restaurant by ID

DELETE

/delete/:id

(Admin) Delete a restaurant

📂 Categories - /api/category

Method

Endpoint

Description

POST

/create

(Admin) Create a category

GET

/get-all

Get all categories

GET

/get/:id

Get category by ID

PATCH

/update/:id

(Admin) Update a category

DELETE

/delete/:id

(Admin) Delete a category

🍕 Foods - /api/food

Method

Endpoint

Description

POST

/create

(Admin) Add a new food item

GET

/get-all

Get all food items

GET

/get/:id

Get food by ID

GET

/get-by-restaurant/:id

Get foods by restaurant ID

PATCH

/update/:id

(Admin) Update a food item

DELETE

/delete/:id

(Admin) Delete a food item

📦 Orders - /api/order

Method

Endpoint

Description

POST

/place-order

Place a new order

POST

/update-order-status/:id

(Admin) Update order status

GET

/get-orders

Get user's order history

DELETE

/cancel/:id

Cancel an order

🔐 Authentication

All secured routes require a Bearer token in the request header:

Authorization: Bearer <your_jwt_token>

Make sure the user has the correct role to access protected endpoints (Admin, Client, Vendor, Delivery).

🤝 Contributing

Fork the repository

Create your feature branch: git checkout -b feature/YourFeature

Commit your changes: git commit -m 'Add your feature'

Push to the branch: git push origin feature/YourFeature

Open a Pull Request

📜 License

This project is licensed under the MIT License.See the LICENSE file for details.

⚠️ This project is for educational and demonstration purposes only. Do not use in production without proper security reviews.

Happy coding! 🚀
