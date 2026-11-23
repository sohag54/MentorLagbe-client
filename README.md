# MentorLagbe — Frontend Client

A modern, responsive, and secure tuition marketplace web application built for Bangladesh, connecting students with expert home and online tutors across Dhaka, Chittagong, Sylhet, and nationwide.

---

## 🌟 Key Features

### 1. Student Experience
- **Tuition Discovery**: Search and filter tuition opportunities by title, subject, class level, location, and teaching mode.
- **Direct Application**: Apply directly for verified tuition postings with preferred scheduling and notes.
- **Application Tracking**: Monitor real-time application statuses (Pending, Accepted, Rejected) with cancellation controls.
- **Pro Membership**: Instant upgrade to Student Pro via secure Stripe Checkout.

### 2. Tutor Experience
- **Tuition Posting**: Create detailed tuition listings with custom subjects, class levels, locations, remuneration, and requirements.
- **Plan Limits**: Free tutors can post up to 2 active tuitions; Pro tutors enjoy unlimited postings.
- **Tuition Management**: Update fees, schedules, and locations or delete listings with full ownership protection.
- **Applicant Management**: Review student applications with contact details and accept or reject requests directly.

### 3. Administrator Portal
- **Dashboard Overview**: Track platform metrics including total users, total tutors, pending tuitions, approved tuitions, and total Stripe revenue.
- **User Role Management**: Manage user profiles and update roles between Student, Tutor, and Admin.
- **Tuition Moderation**: Review and approve or reject newly submitted tuition postings before they go live.
- **Stripe Financial Ledger**: View real-time transaction logs with subscriber details, plan tiers, and timestamps.

### 4. Shared & Security Highlights
- **Authentication**: Powered by Better Auth session synchronization and verified HS256 JWT tokens.
- **In-Memory JWT Storage**: Tokens are stored strictly in memory, eliminating XSS token theft vectors.
- **Profile Customization**: Update name, phone, bio, and upload profile pictures hosted securely via ImgBB.
- **Stripe Checkout**: End-to-end subscription checkout redirecting to official Stripe billing portals.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router with Turbopack)
- **Library**: [React](https://react.dev/) 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Authentication**: [Better Auth](https://www.better-auth.com/) Client
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Payments**: Stripe Checkout Client Integration

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- MentorLagbe Backend Server running on `http://localhost:5000`

### 1. Installation
Clone the repository and install dependencies:
```bash
cd mentorlagbe-client
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
> **Note**: Never commit `.env.local` or expose sensitive secrets in version control.

### 3. Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build & Linting
```bash
npm run lint
npm run build
npm run start
```

---

## 🔗 Repository Links

- **Backend Repository**: [https://github.com/sohag54/MentorLagbe-server.git](https://github.com/sohag54/MentorLagbe-server.git)
- **Frontend Repository**: [https://github.com/sohag54/mentorlagbe-client.git](https://github.com/sohag54/mentorlagbe-client.git)
- **Deployment Status**: Configured for local development (`http://localhost:3000` connected to `http://localhost:5000`).

---

## 📄 License
This project was developed for educational purposes as part of Assignment 9 Category 001. All rights reserved.
