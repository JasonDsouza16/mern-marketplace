
# mern - marketplace

A weekend project, that leverages the MERN tech stack to create an online marketplace for users to buy products and also sell their own own products!


## Features

- Efficient search with price range, category and search filter.
- AuthO authtication service supporting traditional plus SSO logins.
- Add yuor own products for sale on the market place.
- Stripe payment gateway for secure payments.
- Order history section with smart filters, like date range picker, etc.
- Admin dashboard for managing approvals of products on the marketplace.




## Documentation and UI workflow

[Documentation and UI workflow](https://docs.google.com/document/d/1bWuI1TU4TJhGmRtEBPET3Qr164YtjtCPj2oCY20cprU/edit?usp=sharing)


## Setting environment variables

Clone the project

```bash
  git clone https://github.com/JasonDsouza16/mern-marketplace
```
- Steps to setup the backend environment file

  1. Go to the project directory

  ```bash
    cd server
  ```

  2. Create the .env file 
  ```bash
    MONGO_URI=mongodb://localhost:27017/mern-marketplace
    PORT=4000
    CLIENT_URL= http://localhost:3000
    STRIPE_SECRET_KEY= "{YOUR STRIPE SECRET KEY}"
    MM_SYSTEM_ADMIN_USER = "mern.marketplace.sa@gmail.com"
  ```

  3. Start the server

  ```bash
    npm run start
  ```

  - Steps to setup the frontend environment file

  1. Go to the project directory

  ```bash
    cd client
  ```

  2. Create the .env file 
  ```bash
    REACT_APP_API_BASE_URL = "http://localhost:4000/api"
    REACT_APP_STRIPE_PUBLIC_KEY = "{YOUR STRIPE PUBLIC KEY}"
    REACT_APP_AUTH0_DOMAIN = "{YOUR AUTH0 DOMAIN}"
    REACT_APP_AUTH0_CLIENT_ID = "{YOUR AUTH0 CLIENT ID}"
  ```
  
  3. Start the server

  ```bash
    npm run start
  ```

## Run Locally

Clone the project

```bash
  git clone https://github.com/JasonDsouza16/mern-marketplace
```

- Steps to run the backend server

  1. Go to the project directory

  ```bash
    cd server
  ```

  2. Install dependencies

  ```bash
    npm install
  ```

  3. Start the server (port 4000)

  ```bash
    npm run start
  ```


- Steps to run the frontend server

  1. Go to the project directory

  ```bash
    cd client
  ```

  2. Install dependencies

  ```bash
    npm install
  ```

  3. Start the server (port 3000)

  ```bash
    npm run start
  ```


## Tech Stack

**Client:** ReactJS, Material UI, Material Icons, Auth0

**Server:** NodeJS, ExpressJS, Stripe Payments

**Database:** MongoDB with mongoose



## Authors

- [@jasondsouza16](https://www.github.com/jasondsouza16)

