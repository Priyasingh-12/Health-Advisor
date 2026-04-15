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

---

## 📁 Project Structure

```
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

### Step 1 – Clone the repository

```bash
git clone https://github.com/Priyasingh-12/Health-Advisor.git
cd health-advisor
```

---

Install :

```bash
npm install
```

---

**Admin credentials created by seed:**
- Email: `admin@healthadvisor.com`
- Password: `admin123`

 – Start Frontend:**
```bash
cd frontend
npm start
```
Frontend runs at: `http://localhost:3000`

---