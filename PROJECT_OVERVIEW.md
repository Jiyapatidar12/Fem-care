# FEM-CARE — Project Overview

## Kya Hai Yeh Project?

FEM-CARE ek AI-powered women's health platform hai jo PCOS (Polycystic Ovary Syndrome) aur hormonal health se related symptoms ko samajhne aur manage karne mein help karta hai. Yeh platform machine learning, symptom tracking, data visualization, aur ek wellness chatbot ko combine karta hai — taaki users ko personalized health insights mil sakein.

> Platform medical diagnosis nahi deta, balki decision support aur wellness guidance provide karta hai.

---

## Kya Kaam Karta Hai?

1. User signup/login karta hai (secure authentication)
2. 5-step onboarding form fill karta hai — age, weight, menstrual health, symptoms, lifestyle
3. Backend data store karta hai aur ML model se PCOS risk percentage calculate karta hai
4. Dashboard pe health snapshot, trend charts, aur personalized recommendations dikhte hain
5. Mental health chatbot emotional support deta hai

---

## Technology Stack

### Frontend
| Technology | Version |
|---|---|
| Next.js | 16.1.0 |
| React | 19.2.3 |
| TypeScript | ✓ |
| Tailwind CSS | v4 |

Pages: Landing, Login, Signup, Onboarding (5 steps), Dashboard

### Backend
| Technology | Version |
|---|---|
| Node.js + Express | 5.2.1 |
| TypeScript | ✓ |
| MongoDB + Mongoose | 9.0.2 |
| JWT (jsonwebtoken) | 9.0.3 |
| bcryptjs | 3.0.3 |

### ML Service
| Technology | Details |
|---|---|
| Python | scikit-learn |
| Model | Random Forest Classifier |
| Serialization | joblib (.pkl file) |
| Preprocessing | StandardScaler, OneHotEncoder, SimpleImputer |

---

## Project Structure

```
fem-care/
├── frontend/               # Next.js React app
│   ├── app/
│   │   ├── landing/        # Landing page
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   ├── onboarding/     # 5-step health form
│   │   └── user/dashboard/ # Health dashboard
│   ├── components/ui/      # Reusable UI components
│   └── context/            # AuthContext (global auth state)
│
├── backend/                # Express TypeScript server
│   └── src/
│       ├── routes/         # Auth routes (signup, signin)
│       ├── modules/onboarding/ # Onboarding module
│       ├── models/         # MongoDB schemas
│       ├── config/         # DB & CORS config
│       └── middlewares/    # JWT auth middleware
│
└── ml-service/             # Python ML pipeline
    ├── data/               # Training datasets (CSV)
    ├── models/             # Saved model (pcos_risk_model.pkl)
    ├── preprocessing/      # Feature engineering pipeline
    ├── predict.py          # Inference function
    ├── train_final_model.py # Model training script
    └── evaluate.py         # Model evaluation
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Naya user register karo |
| POST | `/auth/signin` | Login karo, JWT token milega |
| GET | `/auth/protected` | Protected route test |
| POST | `/onboarding` | Health data save karo (auth required) |
| GET | `/onboarding` | User ka onboarding data fetch karo (auth required) |

---

## ML Model — Kaise Kaam Karta Hai?

- **Training Data:** PCOS clinical dataset (CSV)
- **Model:** Random Forest (best ROC-AUC performance)
- **Compared with:** Logistic Regression, Gradient Boosting, SVM
- **Input:** 17 health features (age, BMI, cycle data, symptoms, lifestyle)
- **Output:** PCOS risk percentage (0–100%)

```python
# Example usage
from predict import predict_risk

risk = predict_risk({
    "age": 24,
    "bmi": 27.5,
    "cycleRegularity": "Irregular",
    ...
})
# Returns: 73.45 (risk %)
```

---

## Data Models (MongoDB)

- **User** — email, hashed password, onboardingCompleted flag
- **Onboarding** — 17 health metrics linked to user
- **PredictionResult** — userId, prediction string, confidence score
- **ChatMessage** — userId, role (user/assistant), message text

---

## Security

- Passwords bcrypt se hash hote hain (10 salt rounds)
- JWT tokens se stateless authentication (24hr expiry)
- CORS sirf `localhost:3000` ke liye allowed
- Sensitive endpoints auth middleware se protected hain

---

## How to Run

### Backend
```bash
cd backend
cp .env.example .env   # MongoDB URI aur JWT_SECRET set karo
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### ML Service
```bash
cd ml-service
pip install -r requirements.txt
python predict.py
```
