# DiscussCode

<p align="center">
  <img src="https://i.ibb.co/placeholder/400/320" alt="DiscussCode Logo" width="200"/>
</p>

<p align="center">
  <strong>A modern developer community forum built with Next.js, Prisma, and PostgreSQL</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#environment-setup">Environment Setup</a> •
  <a href="#api-routes">API Routes</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

## 📋 Overview

DiscussCode is a developer-focused discussion platform that combines the best elements of Stack Overflow and GitHub Discussions. Create threads, ask technical questions, and collaborate with fellow developers in a clean, modern interface.

## ✨ Features

- **Question & Answer System** - Post questions and get answers from the community
- **Rich Discussion Threads** - Support for nested comments and discussions
- **User Authentication** - Secure login/signup with JWT
- **Email Verification** - OTP-based email verification for new accounts
- **User Profiles** - View user contributions and activity
- **Markdown Support** - Rich text formatting for questions and answers
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Voting System** - Upvote helpful answers and questions
- **Tag-based Organization** - Categorize and discover content easily

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Node Mailer for OTP verification
- **Deployment**: Vercel (or your preferred platform)

## 📁 Project Structure

```
├── app                      # Next.js app directory with route groups
│   ├── (auth)               # Authentication routes
│   ├── api                  # API endpoints
│   ├── questions            # Question-related pages
│   └── users                # User profile pages
├── components               # Reusable UI components
├── helper                   # Helper functions and utilities
├── lib                      # Core libraries (DB, JWT, etc.)
└── utils                    # Utility functions
```

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/akshatgg/Oquoro.git
   cd Oquoro
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file following the environment setup section below.

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 🔐 Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
# Database Configuration
DATABASE_URL=postgresql://postgres:Akshat%401234@localhost:5432/OQUORO

# Email Service for OTP
OPT_EMAIL=Itaxeazy@gmail.com
OTP_PASS=fxeysnavgagjrgvv
OTP_EXPIRY_MINUTES=10

# JWT Authentication
NEXT_JWT_SECRET_KEY=CBu2yG/+JoskSDem9mGNox6Hml3bcwZJDVd+CNQZ3zI=

# Application URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
API_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

**Important Notes:**
- For production, replace the placeholder credentials with your actual secure values
- Make sure to set `NODE_ENV` to "production" for production deployments
- The `DATABASE_URL` should be updated to match your PostgreSQL configuration
- Generate a strong random string for `NEXT_JWT_SECRET_KEY` in production

## 🔌 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User login |
| `/api/auth/signup` | POST | User registration |
| `/api/auth/verify-otp` | POST | Verify email OTP |
| `/api/forums` | GET | Get all discussion forums |
| `/api/forums` | POST | Create a new forum |
| `/api/questions` | GET | Get all questions |
| `/api/questions` | POST | Create a new question |
| `/api/questions/[id]` | GET | Get a specific question |
| `/api/comments` | POST | Add a comment |

## 📸 Screenshots

<div align="center">
  <img src="/public/home.png" alt="Home Page" width="45%"/>
  <img src="/public/questions.png" alt="Question Detail" width="45%"/>
</div>
<div align="center">
  <img src="/public/askQuestion.png" alt="Ask Question" width="45%"/>
  <img src="/public/user.png" alt="User Profile" width="45%"/>
</div>
<div align="center">
  <img src="/public/Answer.png" alt="Discussion" width="45%"/>
  
</div>

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Akshat Gupta - [@AKSHAT_GUPTA](https://github.com/akshatgg) - akshatg9636@gmail.com

Project Link: [https://github.com/akshatgg/Oquoro](https://github.com/akshatgg/Oquoro)

---

<p align="center">
  Made with ❤️ by Akshat Gupta
</p>