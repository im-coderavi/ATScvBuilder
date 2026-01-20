# 🚀 ResumeAI - ATS-Optimized Resume Builder

<div align="center">

![ResumeAI Banner](docs/screenshot.png)

**Build ATS-Optimized Resumes with AI-Powered Analysis**

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🎯 About

**ResumeAI** is a powerful, AI-driven resume builder designed to help job seekers create ATS (Applicant Tracking System) optimized resumes. Stop getting rejected by ATS bots! Our AI-powered builder creates perfectly optimized resumes that get you interviews at top companies.

### Key Highlights:
- 🤖 **AI-Powered Analysis** - Powered by Google Gemini AI for intelligent resume optimization
- 📊 **95% ATS Pass Rate** - Beat tracking systems with optimized formatting
- ⚡ **Real-time Preview** - See changes instantly as you edit
- 📄 **Multiple Templates** - Choose from professional, creative, modern, minimal, and executive templates
- 📤 **PDF Export** - Download your resume as a perfectly formatted PDF

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **User Authentication** | Secure JWT-based authentication with login/signup |
| 📤 **Resume Upload** | Upload existing resumes (PDF/DOCX) for AI analysis |
| 🤖 **AI Analysis** | Gemini AI analyzes and optimizes your resume content |
| 📊 **ATS Score** | Get real-time ATS compatibility scores |
| 📝 **Rich Editor** | Comprehensive editor with sections for personal info, experience, education, skills, projects, certifications, and awards |
| 🎨 **Multiple Templates** | 5 professional templates (Professional, Creative, Modern, Minimal, Executive) |
| 📄 **PDF Export** | Export your resume as a polished PDF document |
| 📈 **Score Comparison** | Compare ATS scores between old and new resumes |
| 💾 **Cloud Storage** | Resumes stored securely on Cloudinary |
| 📱 **Responsive Design** | Works seamlessly on desktop, tablet, and mobile |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Vite | Build Tool & Dev Server |
| TailwindCSS | Styling |
| Framer Motion | Animations |
| React Router DOM | Routing |
| Axios | HTTP Client |
| Lucide React | Icons |
| Recharts | Charts & Analytics |
| React Hot Toast | Notifications |
| jsPDF & html2pdf.js | PDF Generation |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Cloudinary | File Storage |
| Multer | File Upload |
| Google Gemini AI | AI Analysis |
| pdf-parse | PDF Parsing |
| Mammoth | DOCX Parsing |

---

## 📁 Project Structure

```
ats-cv-project/
├── 📂 backend/
│   ├── 📂 Config/
│   │   ├── cloudinary.js        # Cloudinary configuration
│   │   └── database.js          # MongoDB connection
│   ├── 📂 Controllers/
│   │   ├── resumeController.js  # Resume CRUD & AI operations
│   │   └── userController.js    # User authentication
│   ├── 📂 Middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── multer.js            # File upload configuration
│   ├── 📂 Models/
│   │   ├── Resume.js            # Resume schema
│   │   └── User.js              # User schema
│   ├── 📂 Routes/
│   │   ├── resume.js            # Resume API routes
│   │   └── user.js              # User API routes
│   ├── 📂 Services/
│   │   ├── docxParser.js        # DOCX file parsing
│   │   ├── geminiService.js     # Google Gemini AI integration
│   │   └── pdfParser.js         # PDF file parsing
│   ├── .env.example             # Environment variables template
│   ├── index.js                 # Server entry point
│   └── package.json             # Backend dependencies
│
├── 📂 frontend/
│   ├── 📂 public/
│   │   └── vite.svg
│   ├── 📂 src/
│   │   ├── 📂 Components/
│   │   │   ├── 📂 ATS/          # ATS score components
│   │   │   ├── 📂 Auth/         # Authentication components
│   │   │   ├── 📂 Home/         # Landing page components
│   │   │   ├── 📂 Resume/       # Resume editor & templates
│   │   │   ├── 📂 Shared/       # Shared components (Navbar, Footer)
│   │   │   └── 📂 UI/           # Reusable UI components
│   │   ├── 📂 Context/
│   │   │   └── AuthContext.jsx  # Authentication state management
│   │   ├── 📂 Pages/
│   │   │   ├── Dashboard.jsx    # User dashboard
│   │   │   ├── Editor.jsx       # Resume editor page
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Login.jsx        # Login page
│   │   │   └── Signup.jsx       # Signup page
│   │   ├── 📂 Services/
│   │   │   └── api.js           # API service layer
│   │   ├── App.jsx              # Main app component
│   │   ├── App.css              # App styles
│   │   ├── index.css            # Global styles
│   │   └── main.jsx             # React entry point
│   ├── index.html               # HTML template
│   ├── tailwind.config.js       # Tailwind configuration
│   ├── vite.config.js           # Vite configuration
│   └── package.json             # Frontend dependencies
│
├── package.json                 # Root package.json
└── README.md                    # This file
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Google Gemini API key

### Clone the Repository
```bash
git clone https://github.com/yourusername/resumeai.git
cd resumeai
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables (see below)

# Start development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Run Both Concurrently
From the root directory:
```bash
# Install root dependencies
npm install

# Run both frontend and backend
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/resumeai

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Auth0 (Optional)
AUTH0_DOMAIN=your_auth0_domain
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
```

### Getting API Keys

| Service | Instructions |
|---------|-------------|
| **MongoDB** | Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas) |
| **Cloudinary** | Sign up at [Cloudinary](https://cloudinary.com/) for free |
| **Gemini AI** | Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey) |

---

## 📖 Usage

1. **Sign Up/Login** - Create an account or log in to access the dashboard
2. **Upload Resume** - Upload your existing resume (PDF or DOCX format)
3. **AI Analysis** - Let Gemini AI analyze and extract information from your resume
4. **Edit & Optimize** - Use the rich editor to modify and enhance your resume
5. **Choose Template** - Select from 5 professional templates
6. **Check ATS Score** - View your real-time ATS compatibility score
7. **Export PDF** - Download your optimized resume as a PDF

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/auth/logout` | Logout user |
| `GET` | `/api/auth/me` | Get current user |

### Resume Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/resume/upload` | Upload a resume for analysis |
| `GET` | `/api/resume/all` | Get all resumes for current user |
| `GET` | `/api/resume/:id` | Get a specific resume |
| `PUT` | `/api/resume/:id` | Update resume content |
| `PUT` | `/api/resume/:id/title` | Update resume title |
| `DELETE` | `/api/resume/:id` | Delete a resume |
| `POST` | `/api/resume/:id/analyze` | Analyze resume with AI |

---

## 📸 Screenshots

### Landing Page
The stunning landing page with modern dark theme and gradient accents.

### Dashboard
User dashboard showing all resumes with ATS scores and quick actions.

### Resume Editor
Comprehensive editor with real-time preview and multiple templates.

### ATS Score Analysis
Detailed breakdown of ATS compatibility with improvement suggestions.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Avishek Giri**

- 🎓 B.Tech CSE Final Year Student at Greater Kolkata College of Engineering and Management
- 💻 Full Stack Web Developer (MERN Stack)

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/yourusername)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](https://yourportfolio.com)

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for AI-powered analysis
- [Cloudinary](https://cloudinary.com/) for file storage
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide Icons](https://lucide.dev/) for beautiful icons

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ by [Avishek Giri](https://github.com/yourusername)

</div>
