# HireLoop - A Job Portal (Backend)

HireLoop is a web application where users can search for jobs, and recruiters or companies can post hiring opportunities. All job posts are reviewed and controlled by an admin.

This repository contains the backend API, built with Node.js and Express.

## Live Demo

**Frontend:** [https://hireloop-jobs-board.vercel.app](https://hireloop-jobs-board.vercel.app)

**Backend API:** [https://hireloop-jobs-server.vercel.app](https://hireloop-jobs-server.vercel.app)

## Related Repository

**Frontend:** [HireLoop Client](https://github.com/rezasdsju/hireloop-client)

## Technologies

- Node.js
- Express.js
- MongoDB
- CORS
- dotenv



## API Endpoints

**Base URL:** [https://hireloop-jobs-server.vercel.app](https://hireloop-jobs-server.vercel.app)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/` | Home route | Public |
| `GET` | `/users` | Retrieve all users | Public |
| `GET` | `/jobs` | Retrieve all jobs | Public |
| `POST` | `/jobs` | Create a new job post | Public |
| `DELETE` | `/jobs/:id` | Delete a job post | Public |