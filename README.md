# 🩺 MedAssist – AI-Powered Health Advisor

A full-stack web application that leverages OpenAI to deliver intelligent health guidance, symptom checking, medicine lookup, diet planning, health tracking, and hospital discovery — all in one beautifully crafted platform.

---

## 🚀 Features

| Module | Description |
|---|---|
| 🤖 AI Chatbot | OpenAI-powered medical Q&A with conversation history |
| 🩺 Symptom Checker | AI analysis of symptoms with possible conditions & precautions |
| 💊 Medicine Database | Search medicines for uses, dosage, side effects |
| 🥗 Diet & Fitness | Goal-based meal plans + exercise recommendations |
| 📊 Health Tracker | Log and chart weight, BP, sugar, steps, heart rate, sleep |
| 🏥 Hospital Finder | Search hospitals/clinics by city with emergency contacts |
| ⚙️ Admin Panel | Manage users, medicines, hospitals, and diet plans |
| 🔐 JWT Auth | Secure signup/login with role-based access control |

---

## 🛠 Tech Stack

**Frontend**
- React.js 18 + React Router v6
- Tailwind CSS (utility-first styling)
- Chart.js + react-chartjs-2 (health charts)
- Axios (API calls)
- React Toastify (notifications)
- Google Fonts: Sora + DM Sans

**Backend**
- Node.js + Express.js (REST API)
- MongoDB + Mongoose (database)
- JWT (authentication)
- bcryptjs (password hashing)
- OpenAI API (AI features)

---

## 📁 Project Structure

```
health-advisor/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile
│   │   ├── chatController.js      # OpenAI chat & symptom analysis
│   │   ├── dietController.js      # Diet plan CRUD
│   │   ├── healthController.js    # Health records CRUD
│   │   ├── hospitalController.js  # Hospital search & CRUD
│   │   └── medicineController.js  # Medicine search & CRUD
│   ├── middleware/
│   │   └── auth.js               # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js               # Users collection
│   │   ├── Medicine.js           # Medicines collection
│   │   ├── DietPlan.js           # DietPlans collection
│   │   ├── HealthRecord.js       # HealthRecords collection
│   │   └── Hospital.js           # Hospitals collection
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── symptoms.js
│   │   ├── medicines.js
│   │   ├── diet.js
│   │   ├── health.js
│   │   ├── hospitals.js
│   │   └── admin.js
│   ├── scripts/
│   │   └── seed.js               # Database seed with sample data
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express app entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.js         # Sidebar + top bar layout
│   │   ├── context/
│   │   │   └── AuthContext.js    # Global auth state
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Chatbot.js
│   │   │   ├── SymptomChecker.js
│   │   │   ├── Medicines.js
│   │   │   ├── DietFitness.js
│   │   │   ├── HealthTracker.js
│   │   │   ├── HospitalFinder.js
│   │   │   ├── AdminPanel.js
│   │   │   └── Profile.js
│   │   ├── utils/
│   │   │   └── api.js            # Axios instance with auth interceptors
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json                  # Root scripts
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- OpenAI API Key ([get one here](https://platform.openai.com/api-keys))

---

### Step 1 – Clone the repository

```bash
git clone https://github.com/yourusername/health-advisor.git
cd health-advisor
```

---

### Step 2 – Configure the Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/health_advisor
JWT_SECRET=your_super_secret_key_change_this
OPENAI_API_KEY=sk-your-openai-api-key
NODE_ENV=development
```

Install backend dependencies:

```bash
npm install
```

---

### Step 3 – Seed the Database

This populates MongoDB with sample medicines, hospitals, diet plans, and creates an admin account.

```bash
npm run seed
```

**Admin credentials created by seed:**
- Email: `admin@healthadvisor.com`
- Password: `admin123`

---

### Step 4 – Configure the Frontend

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Install frontend dependencies:

```bash
npm install
```

---

### Step 5 – Run the Application

**Terminal 1 – Start Backend:**
```bash
cd backend
npm run dev
```
Backend runs at: `http://localhost:5000`

**Terminal 2 – Start Frontend:**
```bash
cd frontend
npm start
```
Frontend runs at: `http://localhost:3000`

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Protected |
| PUT | `/api/auth/profile` | Update profile | Protected |

### AI Chat & Symptoms
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/chat` | AI health chatbot | Protected |
| POST | `/api/chat/analyze-symptoms` | Analyze symptoms with AI | Protected |
| POST | `/api/symptoms/check` | Symptom checker | Protected |

### Medicines
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/medicines` | Get all medicines | Protected |
| GET | `/api/medicines/search?q=` | Search medicines | Protected |
| GET | `/api/medicines/:id` | Get medicine by ID | Protected |
| POST | `/api/medicines` | Add medicine | Admin |
| PUT | `/api/medicines/:id` | Update medicine | Admin |
| DELETE | `/api/medicines/:id` | Delete medicine | Admin |

### Diet Plans
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/diet` | Get all diet plans | Protected |
| GET | `/api/diet/:goal` | Get plan by goal | Protected |
| POST | `/api/diet` | Create diet plan | Admin |
| PUT | `/api/diet/:id` | Update diet plan | Admin |
| DELETE | `/api/diet/:id` | Delete diet plan | Admin |

### Health Records
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Get user's records | Protected |
| GET | `/api/health/latest` | Get latest record | Protected |
| POST | `/api/health` | Log health data | Protected |
| PUT | `/api/health/:id` | Update record | Protected |
| DELETE | `/api/health/:id` | Delete record | Protected |

### Hospitals
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/hospitals` | Get all hospitals | Protected |
| GET | `/api/hospitals/search?city=` | Search by city/type | Protected |
| POST | `/api/hospitals` | Add hospital | Admin |
| PUT | `/api/hospitals/:id` | Update hospital | Admin |
| DELETE | `/api/hospitals/:id` | Delete hospital | Admin |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/stats` | Dashboard statistics | Admin |
| GET | `/api/admin/users` | List all users | Admin |
| PUT | `/api/admin/users/:id/role` | Change user role | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |

---

## 🗄 Database Collections

### Users
```json
{ "name": "string", "email": "string", "password": "hashed", "role": "user|admin", "age": "number", "gender": "string", "bloodGroup": "string", "allergies": ["string"] }
```

### Medicines
```json
{ "name": "string", "genericName": "string", "category": "string", "uses": ["string"], "dosage": { "adult": "string", "child": "string", "frequency": "string" }, "sideEffects": ["string"], "contraindications": ["string"], "prescription": "boolean" }
```

### DietPlans
```json
{ "goal": "weight_loss|diabetes_control|heart_health|muscle_building|general_wellness", "title": "string", "meals": { "breakfast": [], "lunch": [], "dinner": [], "snacks": [] }, "exercises": [], "tips": [] }
```

### HealthRecords
```json
{ "user": "ObjectId", "date": "Date", "weight": "number", "bloodPressure": { "systolic": "number", "diastolic": "number" }, "sugarLevel": "number", "steps": "number", "heartRate": "number", "sleep": "number" }
```

### Hospitals
```json
{ "name": "string", "type": "hospital|clinic|diagnostic|pharmacy", "city": "string", "address": "string", "phone": "string", "specialties": ["string"], "emergencyServices": "boolean", "rating": "number" }
```

---

## ⚠️ Medical Disclaimer

MedAssist is designed for informational and educational purposes only. The AI-generated content does not constitute medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition.

---

## 📝 License

MIT License – free to use and modify for personal and commercial projects.
