# Client360 – Client, Project & Payment Management Portal

A full-stack web application to manage clients end-to-end including client details, project information, domain & hosting tracking, payment management, notes, and automated reminders. Built to simulate a real IT services company workflow.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 17 (Standalone Components) |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Styling | Custom CSS |

---

## Features Implemented

### 1. Client Management
- Add, view, edit, and delete clients
- Each client has contact details (name, email, phone, company)
- Clients can have multiple projects linked to them

### 2. Project Management
- Create projects under a specific client
- Track project cost, start date, deadline, and status (Active / Completed / On Hold)
- View all projects with their associated client

### 3. Payment Management
- Record advance, milestone, and final payments per project
- Auto-calculates total paid and pending balance (Project Cost − Total Paid)
- Supports multiple payment methods: UPI, Cash, Bank Transfer, Cheque
- Payment history listed with date and optional notes
- Instant UI update on add/delete without page refresh

### 4. Domain & Hosting Management
- Store domain name, registrar, purchase date, and expiry date
- Store hosting provider, plan, and expiry date
- Expiry status shown with color-coded indicators

### 5. Notes & Follow-ups
- Add internal notes per client with timestamps
- Used for tracking communication, follow-ups, and meeting summaries

### 6. Reminders & Alerts
- Automated alerts for domains/hosting expiring within 30 days
- Alerts for projects with pending payments
- Shown prominently on the Reminders page and Dashboard

### 7. Dashboard
- Overview of total clients, active projects, total revenue, and pending payments
- Expiry alerts summary
- At-a-glance business health view

---

## Project Structure

```
client360/
├── frontend/                  # Angular application
│   └── src/
│       └── app/
│           ├── pages/
│           │   ├── dashboard/
│           │   ├── clients/
│           │   ├── projects/
│           │   ├── payments/
│           │   ├── expiry/
│           │   ├── notes/
│           │   └── reminders/
│           └── services/
│               ├── client.service.ts
│               ├── project.service.ts
│               ├── payment.service.ts
│               └── ...
│
└── backend/                   # Node.js + Express API
    ├── models/
    │   ├── client.model.js
    │   ├── project.model.js
    │   ├── payment.model.js
    │   └── ...
    ├── controllers/
    │   ├── client.controller.js
    │   ├── project.controller.js
    │   ├── payment.controller.js
    │   └── ...
    ├── routes/
    │   ├── client.routes.js
    │   ├── project.routes.js
    │   ├── payment.routes.js
    │   └── ...
    └── server.js
```

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Angular CLI (`npm install -g @angular/cli`)
- MongoDB Atlas account (or local MongoDB)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/client360.git
cd client360
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/client360
```

Start the backend server:

```bash
node server.js
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
ng serve
```

Frontend runs at: `http://localhost:4200`

---

## API Endpoints

### Clients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clients` | Get all clients |
| POST | `/api/clients` | Add a new client |
| PUT | `/api/clients/:id` | Update client |
| DELETE | `/api/clients/:id` | Delete client |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create a project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payments/project/:projectId` | Get payments for a project |
| POST | `/api/payments` | Add a payment |
| DELETE | `/api/payments/:id` | Delete a payment |
| GET | `/api/payments/summary/:projectId` | Get payment summary |

---

## Data Model

```
Client
  └── Projects (one client → many projects)
        └── Payments (one project → many payments)
```

**Payment balance logic:**
```
Pending Amount = Project Cost − Total Payments Made
```

---

## Assumptions

- A client must exist before a project can be created under them
- A project must exist before payments can be recorded
- Payment balance is calculated dynamically on the frontend using project cost and all recorded payments
- Domain and hosting expiry alerts trigger when expiry is within 30 days from today
- All monetary values are in Indian Rupees (₹)
- The app is designed for single-user/admin use (no authentication implemented)

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Port for the Express server (default: 5000) |
| `MONGO_URI` | MongoDB connection string (Atlas or local) |

> ⚠️ Never commit your `.env` file. A `.env.example` is included for reference.

---

## Author

Built as part of the Client360 Interview Assignment – Full Stack / Frontend Freshers.
