# Community Discussion Platform

A full-stack web application that enables users to participate in online discussions through a modern community forum. The platform supports user authentication, message publishing, threaded interactions, and role-based administration.

Developed using a client-server architecture with React, Node.js, Express, and MongoDB.

---

## Project Overview

The Community Discussion Platform provides a collaborative environment where registered users can exchange ideas, publish messages, reply to discussions, and interact with the community.

The application includes a role management system allowing administrators to validate new users, moderate the platform, and manage administrative requests.

---

## Features

### User Features

- User registration and authentication
- Secure login system
- Public discussion forum
- Create discussion posts
- Reply to existing posts
- Like posts and replies
- Personal profile management
- Delete personal posts
- Request administrator privileges

### Administrator Features

- Validate newly registered users
- Approve administrator requests
- Access a private administration forum
- Manage community members

---

## Technology Stack

### Frontend

- React
- Axios
- CSS3

### Backend

- Node.js
- Express.js

### Database

- MongoDB

### Development Tools

- Postman
- Git & GitHub

---

## Project Architecture

```
React Frontend
        │
        │ HTTP Requests
        ▼
Express REST API
        │
        ▼
MongoDB Database
```

---

## Project Structure

```text
community-Web-Application/
│
├── client/
│   ├── src/
│   │   ├── components/
|   |   |   ├── Auth/
|   |   |   |   ├── Login.jsx
|   |   |   |   └── Register.jsx
|   |   |   |
|   |   |   ├── Forum/
|   |   |   |   ├── Forum.jsx
|   |   |   |   └── MessageDetail.jsx
|   |   |   |
|   |   |   ├── Admin.jsx
|   |   |   ├── Header.jsx
|   |   |   └── Profil.jsx
│   │   │
│   │   ├── styles/
|   |   |   |   ├── Register.css
|   |   |   |   ├── admin.css
|   |   |   |   ├── forum.css
|   |   |   |   ├── global.css
|   |   |   |   ├── header.css
|   |   |   |   ├── messageDetail.css
|   |   |   |   └── profil.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── entities/
|   |   |   |   ├── messages.js
|   |   |   |   └── users.js
│   │   │
│   │   ├── api.js
│   │   ├── app.js
│   │   ├── db.js
│   │   └── index.js
│   │
│   └── package.json
│
└── README.md
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/yourusername/community-discussion-platform.git
```

### Install backend dependencies

```bash
cd server
npm install
```

### Install frontend dependencies

```bash
cd ../client
npm install
```

---

## Running the Application

### Start the backend

```bash
cd server
node src/index.js
```

Server:

```
http://localhost:4000
```

### Start the frontend

```bash
cd client
npm run dev
```

Client:

```
http://localhost:5173
```

---

## Database

The application uses MongoDB.

Main collections:

- users
- messages

For security reasons, database credentials are **not included** in this repository.

---

## REST API

The project exposes a REST API used by the React frontend.

Main operations include:

- Authentication
- User management
- Message management
- Replies
- Likes
- Administration

A Postman collection is included for API testing.

---

## Screenshots

The application includes several interfaces:

- Landing page
- Login
- Registration
- Community forum
- Discussion details
- User profile
- Administration dashboard

*(Screenshots will be added soon.)*

---

## Authors

This project was developed by **a team of two undergraduate Computer Science students** as part of a Web Technologies course.

---

## Academic Context

Course:

**LU3IN017 – Web Technologies**

Sorbonne Université

Academic Year: **2025–2026**
