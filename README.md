# HireLoop - A Job Portal (Backend)

HireLoop is a web application where users can search for jobs, and recruiters or companies can post hiring opportunities. All job posts are reviewed and controlled by an admin.

This repository contains the backend API, built with Node.js and Express.

## Live Demo

**Frontend:** [https://hireloop-jobs-board.vercel.app](https://hireloop-jobs-board.vercel.app)

**Backend API:** [https://hireloop-jobs-server.vercel.app](https://hireloop-jobs-server.vercel.app)

## Related Repository

**Frontend:** [HireLoop Client](https://github.com/rezasdsju/hireloop-client)



## Features

- **User Management:** Retrieve all registered users.
- **Job Management:**
  - Retrieve all available job posts.
  - View individual job details by ID.
  - Create new job posts.
  - Delete existing job posts.
- **Job Filtering & Search:**
  - Filter jobs by employment type.
  - Filter jobs by remote availability.
  - Filter jobs by category.
  - Search jobs by title, company, description, and requirements.
- **Application Management:**
  - Submit job applications.
  - Retrieve all applications.
  - Retrieve applications for a specific applicant using their user ID.
- **Database Integration:** Store and retrieve users, jobs, and applications using MongoDB.
- **RESTful API:** Handle HTTP requests using Express.js.
- **CORS Support:** Enable cross-origin requests from frontend applications.


## Technologies

- Node.js
- Express.js
- MongoDB
- CORS
- dotenv



## API Endpoints

**Base URL:** https://hireloop-jobs-server.vercel.app

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/` | Home route | Public |
| `GET` | `/users` | Retrieve all users | Public |
| `GET` | `/jobs` | Retrieve all jobs (supports filtering and search) | Public |
| `GET` | `/jobs/:id` | Retrieve a single job by ID | Public |
| `POST` | `/jobs` | Create a new job post | Public |
| `DELETE` | `/jobs/:id` | Delete a job post | Public |
| `POST` | `/applications` | Submit a job application | Public |
| `GET` | `/applications` | Retrieve applications (supports filtering by applicant ID) | Public |