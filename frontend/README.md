# ✈️ Fly-with-Sigma

A full-stack **Flight Booking System** built with **Next.js**.
This project was developed as part of a **2110423 (2025/1) Software Engineering Course**, focusing on building scalable, secure, and user-friendly web applications.

## 📖 Overview

Fly-with-Sigma is a flight booking platform that allows users to:

* Search and book flights easily
* Manage accounts securely with authentication & authorization
* Access real-time flight information from a modern responsive interface

The project is built in **Next.js** (with API routes for backend logic), styled with **TailwindCSS**, connected to a **Neon serverless PostgreSQL** database via **Prisma ORM**, and deploy with **Vercel**.

## 🚀 Features

* **Authentication & Authorization**

  * NextAuth.js with **JWT & bcrypt** for secure login and role-based access
* **Flight Search & Booking**

  * Dynamic forms and filtering
  * Intuitive booking flow with confirmation page
* **User Profiles**

  * Manage bookings and personal details
* **Scalable Database Layer**

  * Neon PostgreSQL + Prisma ORM

---

## 🛠️ Tech Stack

| Layer          | Technology                                                     |
| -------------- | -------------------------------------------------------------- |
| Framework      | [Next.js](https://nextjs.org/) (Frontend + Backend API routes) |
| Authentication | [NextAuth.js](https://next-auth.js.org/) with JWT & bcrypt     |
| Database       | [Neon](https://neon.tech/) (serverless PostgreSQL)             |
| ORM            | [Prisma](https://www.prisma.io/)                               |
| Styling        | [TailwindCSS](https://tailwindcss.com/)                        |
| Deployment     | [Vercel](https://vercel.com/)                                  |

---

## 📂 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router (pages, layouts, routing)
│   ├── components/      # Reusable UI components
│   ├── lib/             # Utilities & helpers
│   ├── styles/          # Global Tailwind styles
│   └── prisma/          # Prisma schema & client
├── .env                 # Environment variables
├── package.json
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites

* Node.js (18+)
* npm or pnpm
* Neon PostgreSQL connection string

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Mysterioucz/Se-Project.git
   cd Se-Project/frontend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure environment variables (`.env`):

   ```env
   DATABASE_URL="your_neon_connection_string"
   NEXTAUTH_SECRET="your_secret"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```

4. Setup database with Prisma (This step is automatically done with `pnpm install`):

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. Run the development server:

   ```bash
   pnpm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤝 Collaboration

This project was built by a **team of 9** using **GitHub workflows, Agile methodology, and code reviews**.

* Collaborative sprint planning & task allocation
* Merge requests with peer reviews
* Integration of multiple features across backend and frontend

---

## 📚 Learning Outcomes

Through this project, we gained experience in:

* Building a **full-stack application** with Next.js
* Implementing **secure authentication** with JWT & NextAuth
* Designing and integrating a **relational database** using Prisma ORM
* Working with a **serverless database (Neon PostgreSQL)** for scalability
* Collaborating effectively in a **team of 9 engineers** with GitHub workflows
* Writing clean, modular, and maintainable code

---

## 📬 Collaborator

👤 **Chatrin Yoonchalard**  
*Role: Full-Stack Developer, CI/CD Workflow*

* Email: [chatrinyoonchalard@gmail.com](chatrinyoonchalard@gmail.com)
* GitHub: [Mysterioucz](https://github.com/Mysterioucz)
* LinkedIn: [Chatrin Yoonchalard](linkedin.com/in/chatrin-yoon)

👤 **Chanatda Konchom**  
*Role: Front-end, UX-UI Design*

* Email: [chanatdakc@gmail.com](chanatdakc@gmail.com)
* Github: [098ff](https://github.com/098ff)
* LinkedIn: [Chanatda Konchom](https://www.linkedin.com/in/chanatda-konchom-0b8376366/)

👤 **Nantaporn Phuaphanbun**  
*Role: Back-end Developer, UX-UI Design*

* Email: [feihao28@gmail.com](feihao28@gmail.com)
* GitHub: [uunws](https://github.com/uunws)
* LinkedIn: [Nantaporn Phuaphanbun](https://www.linkedin.com/in/nantaporn-phuaphanbun-a82395369/)

👤 **Punyapat Kijvorachai**  
*Role: Back-end Developer*

* Email: [mewpunyapat@gmail.com](mewpunyapat@gmail.com)
* GitHub: [mewpunyapat](https://github.com/mewpunyapat)
* LinkedIn: [Punyapat Kijvorachai](https://www.linkedin.com/in/punyapatk)