# Frontend Documentation - Social Login Authentication

## Table of Contents

1. [Introduction](#1-introduction)
2. [Technologies Used](#2-technologies-used)
3. [Setup](#3-setup)
4. [Features](#4-features)
   - [Login](#41-login)
   - [Registration](#42-registration)
   - [Login with Google](#43-login-with-google)
   - [Forgot Password](#44-forgot-password).
   - [Two-Factor Authentication (2FA)](#45-two-factor-authentication)
  <!--  - [Login com Facebook](#44-login-com-facebook)-->
5. [API Communication](#5-api-communication)
6. [Error Handling](#6-error-handling)
7. [User Flow](#7-user-flow)
8. [Environment Variables Configuration](#8-environment-variables-configuration)
9. [Final Notes](#9-final-notes)

---

## 1. Introduction
This frontend was developed for an authentication system that allows login, user registration, and social login using Google and Facebook. It communicates with a REST API to authenticate and register users, as well as validate credentials.

### Website URL

The application is available at the following address:

https://site-kong.netlify.app/

### API Documentation

The documentation is available at the following address:

https://github.com/AlanZayon/api-auth

## 2. Technologies Used
- **React**
- **Firebase Authentication**
- **TanStack Query**
- **React Router**
- **React Bootstrap**

## 3. Setup

To run the project locally, follow these steps:

3.1. **Clone the repository:**:
   ```bash
   git clone https://github.com/AlanZayon/interface-auth.git
   ```
3.2. **Install dependencies:**:
   ```bash
   npm install
   ```
3.3. **Create a .env file with the environment variables:**:
   ```env
   VITE_API_BASE_URL=your_auth_domain
   ```
3.4. **Run the project:**:
   ```bash
   npm run dev
   ```
The project will be available at http://localhost:5173


## 4. Features

### 4.1 Login
![LOGIN](https://i.imgur.com/lCKa79t.gif)

### 4.2 Registration
![CADASTRO](https://i.imgur.com/hvZjU4Z.gif)

### 4.3 Login with Google
![LOGIN GOOGLE](https://i.imgur.com/J3bXMOU.gif)

#### 4.3.1 Login with Google (Advanced Flow)
The Login with Google flow is designed to check if the email used in the Google account is already registered in the system. If it is, the user will be redirected to the login page, and after logging in, the existing account will be automatically linked to the Google account.
![ADVANCED-FLOW](https://i.imgur.com/EyveR7e.gif)

#### 4.3.2 Login with Google (Registration for Non-Existing Accounts)
This flow handles cases where a user logs in with a Google account that does not already exist in the system. The user is redirected to the registration page with pre-filled information (such as name and email). They only need to complete the missing fields (password and date of birth). After registration, the system automatically links the new account with the Google account.
![REGISTRATIO FOR NON-EXISTING ACCOUNTS](https://i.imgur.com/6xEmfXr.gif)
<!-- 
### 4.4 Login com Facebook
![LOGIN FACEBOOK](https://i.imgur.com/QnuJpZj.gif)
-->
### 4.4 Forgot Password
The Forgot Password flow allows users to reset their password if they've forgotten it. The process involves entering the email associated with the account, receiving a password reset email with a link, and then entering a new password after clicking the link.

#### 4.4.1 Send Email
![SEND-EMAIL](https://i.imgur.com/SQ70P81.gif)

#### 4.4.2 Link to Change Password
![CHANGE-PASSWORD](https://i.imgur.com/bhLwFkP.gif)

### 4.5 Two-Factor Authentication
- Display QR Code for 2FA setup
- Allow users to scan the QR Code with an authenticator app (like Google Authenticator, Authy)
- Verify 2FA Code during setup
- Option to enable/disable 2FA
![2FA](https://i.imgur.com/Cc2Qzat.gif)

## 5. API Communication
Requests to the backend follow a pattern of authentication with JWT tokens or Firebase tokens, where the token is stored in localStorage or sessionStorage and sent or received with each request using the Authorization header: Bearer <token>.

### Example of a Fetch request:

```js
const response = await fetch(`${API_BASE_URL}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                },
                body: JSON.stringify({ email, password }),
            });

const token = await response.headers.get("Authorization-token").split(" ")[1];
```

## 6. Error Handling
### Login Validation Errors: Invalid email or password..
![erro de validação login](https://i.imgur.com/nLROfyP.gif)
### Registration Validation Errors: Username must be at least 5 characters, Emails do not match, Password is too weak, You must be at least 18 years old..
![erro de validação cadastro](https://i.imgur.com/3eJcbsE.gif)

## 7. User Flow
- **Registration**: The user registers by entering name, email, password, and date of birth. After confirmation, the system redirects to the email confirmation page.
- **Login**:The user logs in with email/password or via Google/Facebook. The JWT token or Firebase Token is saved and used in all future requests to validate the session.
- **Social Login**: Firebase authenticates the user via Google and returns a token that is sent to the backend to associate or create the account.
- **Session Persistence**: The token is stored in localStorage/sessionStorage to keep the user authenticated between sessions (this will eventually be changed to using cookies).

## 8. Environment Variables Configuration
To set up and run the project, you need to configure the required environment variables. These variables are essential for connecting to your backend API and Firebase services.

-In the root directory of your project, create a file named .env

-Replace the placeholder values (<your_*_here>) with your own Firebase and backend configuration details

   ```bash
   VITE_API_BASE_URL="<your_backend_api_url_here>"
VITE_APP_FIREBASE_API_KEY="<your_firebase_api_key_here>"
VITE_APP_FIREBASE_AUTH_DOMAIN="<your_firebase_auth_domain_here>"
VITE_APP_FIREBASE_PROJECT_ID="<your_firebase_project_id_here>"
VITE_APP_FIREBASE_STORAGE_BUCKET="<your_firebase_storage_bucket_here>"
VITE_APP_FIREBASE_MESSAGING_SENDER_ID="<your_firebase_messaging_sender_id_here>"
VITE_APP_FIREBASE_APP_ID="<your_firebase_app_id_here>"
   ```

## 9. Final Notes
This frontend was designed to be scalable and modular, facilitating maintenance and potential feature expansions such as password reset, two-factor authentication, etc. The project is still under construction and requires many improvements and fixes.

