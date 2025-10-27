# ServiceDeskAI

Because even AI knows the printer’s always broken.

A mobile-first web application that makes it easy to report broken or malfunctioning items in offices or homes. It uses geolocation and AI to simplify reporting and help service teams resolve issues faster.

There are three user profiles:
- **Standard user**: Can create tickets, upload photos or videos, and track their status  
- **Service desk user**: Can manage and close tickets, update statuses, and chat with users  
- **Admin user**: Can create users and offices, and view all reports and analytics

---

## Features

- Mobile-first design, responsive across devices  
- Secure authentication with JWT  
- Geolocation-based reporting  
- AI image recognition (Google Cloud Vision or Azure AI Vision)  
- Create, view, and share reports  
- Accessible design following WCAG AA guidelines  
- Email sharing for ticket escalation  
- Dockerized for a consistent environment  

---

## Stack

|  |  |
|--------|---------------|
| Frontend | React, Redux, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB |
| AI APIs | Google Cloud Vision, Azure AI Vision |
| Environment | Docker, Docker Compose | 

---

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/char-projects/ServiceDeskAI.git
cd ServiceDeskAI
```

### 2. Configure environment variables

Create an `.env` file in the root directory of your project and add your environment variables:

```bash
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
CLOUD_VISION_API_KEY=<your-api-key>
```

### 3a. Run with Docker

Make sure you have Docker and Docker Compose installed on your system.

Then run:
```bash
docker-compose up --build
```

When the containers are running:

Frontend: http://localhost:3000
Backend: http://localhost:5000

### 3b. Local development (without Docker)

Backend:
```bash
cd backend
npm install
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm start
```

## Accessibility

The app follows WCAG 2.1 AA standards for accessibility.
It supports keyboard navigation, proper color contrast, and responsive layouts to ensure usability for all users.

---

## Bonus features (might add later)

- Chat between users and service desk staff  
- Admin dashboard for management and analytics  
- Profile photo upload  
- Dark mode  
- Offline mode (PWA) 
