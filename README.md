# HireLoop - A Job Portal (Backend)

HireLoop is a job portal where job seekers can search and apply for jobs, while recruiters and companies can post hiring opportunities. All job posts are reviewed and controlled by an admin.

This repository contains the backend API, built with Node.js and Express.

## Live Demo

**Frontend:** [https://hireloop-jobs-board.vercel.app](https://hireloop-jobs-board.vercel.app)

**Backend API:** [https://hireloop-jobs-server.vercel.app](https://hireloop-jobs-server.vercel.app)

## Related Repository

**Frontend:** [HireLoop Client](https://github.com/rezasdsju/hireloop-client)

## Features

- **User Management:**
  - Retrieve all registered users (admin only).
  - Update user roles (admin only).
  - Check user premium status.

- **Job Management:**
  - Retrieve all job posts.
  - View individual job details by ID.
  - Create job posts (recruiters only).
  - Delete job posts (job owners or admins).

- **Job Filtering & Search:**
  - Filter jobs by employment type.
  - Filter jobs by remote availability.
  - Filter jobs by category.
  - Search jobs by title, company, responsibilities, and qualifications.
  - Filter jobs by recruiter ID.

- **Application Management:**
  - Submit job applications (seekers only).
  - Retrieve applications based on user role and permissions.
  - Filter applications by applicant ID or job ID.
  - Update application status (job owners or admins).
  - Prevent duplicate applications.

- **Authentication & Authorization:**
  - Verify user sessions using stored session tokens.
  - Implement role-based access control for seekers, recruiters, and admins.
  - Restrict protected API endpoints based on user roles and ownership.

- **Payment Integration:**
  - Verify Stripe Checkout payments.
  - Update user premium status after successful payment.
  - Prevent duplicate payment verification.

- **Database Integration:** Store and retrieve users, jobs, applications, payments, and sessions using MongoDB.

- **RESTful API:** Handle HTTP requests using Express.js.

- **CORS Support:** Enable cross-origin requests from frontend applications.

## Technologies

- Node.js
- Express.js
- MongoDB
- Stripe
- CORS
- dotenv

## API Endpoints

**Base URL:** `https://hireloop-jobs-server.vercel.app`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/` | Check server status | Public |
| `GET` | `/users` | Retrieve all users | Admin |
| `GET` | `/users/:id/premium` | Check user premium status | Public |
| `PATCH` | `/users/:id/role` | Update a user's role | Admin |
| `GET` | `/jobs` | Retrieve jobs with filtering and search | Public |
| `GET` | `/jobs/:id` | Retrieve a single job by ID | Public |
| `POST` | `/jobs` | Create a new job post | Recruiter |
| `DELETE` | `/jobs/:id` | Delete a job post | Job Owner / Admin |
| `GET` | `/applications` | Retrieve applications with applicant or job filtering | Authenticated |
| `GET` | `/applications/count` | Count applications with optional applicant filtering | Public |
| `POST` | `/applications` | Submit a job application | Seeker |
| `PATCH` | `/applications/:id` | Update application status | Job Owner / Admin |
| `POST` | `/payments/checkout-verify` | Verify Stripe Checkout payment | Public |

## Environment Variables

Create a `.env` file in the project root and configure the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/rezasdsju/hireloop-server.git
   ```

2. Navigate to the project directory:

   ```bash
   cd hireloop-server
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure the environment variables in a `.env` file.

5. Start the server:

   ```bash
   npm start
   ```