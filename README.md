# Auth Mini API - Production Ready Security System (Task 9)

A secure, high-performance Authentication and Authorization RESTful API built using **Express 5** and **MongoDB/Mongoose**. The system implements industrial-grade security patterns, including a dual-token system (Access/Refresh tokens) handled entirely via secure, HTTP-only cookies, robust input sanitization, and Role-Based Access Control (RBAC).

## 🚀 Key Features

* **Express 5 Engine:** Built on the latest Express 5 framework with modern asynchronous error handling, it make a conflict with me so i stopped it.
* **Dual-Token Architecture:** Secure session control with short-lived `Access Tokens` and long-lived `Refresh Tokens` distributed safely through **HTTP-Only, SameSite, and Secure Cookies**.
* **Advanced Cryptography:** Secure password hashing utilizing the **Argon2** algorithm (winner of the Password Hashing Competition).
* **Contextual XSS Protection:** Full defense against Cross-Site Scripting (XSS) and code injection via semantic validation and contextual escaping with `express-validator`.
* **Brute-Force & DoS Mitigation:** Request rate limiting implemented on authentication endpoints using `express-rate-limit`.
* **Role-Based Access Control (RBAC):** Explicit enforcement of user permissions, isolating general client data from restricted administrative actions.

---

## 🛠️ Tech Stack

* **Runtime Environment:** Node.js
* **Backend Framework:** Express 5
* **Database Object Modeling:** Mongoose & MongoDB Atlas (Cloud)
* **Authentication & Security:** JSON Web Tokens (JWT), Argon2, Express-Validator, Express-Rate-Limit

---

## 📋 API Architecture & Endpoints

All API routes are versioned and structured into distinct protection spaces based on identity privileges.

### 1. Authentication Space (`/api/v1/auth`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/signup` | Registers a new account (accepts `user` / `admin` roles) | Public |
| `POST` | `/api/v1/auth/login` | Authenticates identity and sets encrypted session cookies | Public |
| `POST` | `/api/v1/auth/refresh` | Rotates expired access tokens using the active refresh cookie | Public |
| `GET` | `/api/v1/auth/profile` | Retrieves current authenticated profile payload | Authenticated |
| `POST` | `/api/v1/auth/logout` | Clears local session cookies and revokes database refresh token | Authenticated |

### 2. User Space (`/api/v1/me`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/me/welcome` | Returns personalized welcome interaction message | User & Admin |
| `GET` | `/api/v1/me/account-summary`| Computes and returns secure mock financial/account diagnostics | User & Admin |

### 3. Administration Space (`/api/v1/admin`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/overview` | Retrieves structural dashboard summary metrics | Admin Only |
| `GET` | `/api/v1/admin/users` | Lists all registered users (auto-filters password fields) | Admin Only |
| `DELETE`| `/api/v1/admin/users/:id` | Validates ID syntax and purges user account (Self-deletion blocked) | Admin Only |

---

## ⚙️ Environment Configuration

To run this project locally, create a `.env` file in the root directory and define the following variables:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=

JWT_SECRET=
JWT_EXPIRES_IN=15m

JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=7d
