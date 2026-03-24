# HealthDash Pro 🏥

**HealthDash Pro** is a production-grade, B2B Healthcare SaaS dashboard built with React, TypeScript, and Firebase. It provides medical practitioners with a high-performance, real-time interface for managing patient records, monitoring clinical analytics, and receiving critical medical alerts.

---

## 🚀 Key Features

- **🔐 Real-time Authentication**: Secure Firebase-backed login/signup with session persistence.
- **📁 Patient Management**: Comprehensive patient directory with:
  - Advanced **Sorting** (by name, age, status, last visit).
  - **Pagination** for large datasets.
  - **Optimistic UI Updates** for status changes (Stable, Critical, etc.).
  - Search by Name, ID, or Medical Condition.
- **📊 Rich Analytics**: 30-day interactive charts showing patient intake trends, department load, and system health.
- **🔔 Notification Engine**:
  - **In-app Bell Dropdown**: Track history of patient registrations and alerts.
  - **Sonner Toasts**: Real-time feedback for all CRUD operations.
  - **Service Worker Push**: System-level notifications for critical updates.
- **⚙️ Settings & Security**: Profile management, notification toggles, and secure password updates with strength validation.
- **📱 Responsive UX**: Mobile-first design with auto-collapsing sidebar and touch-optimized data tables.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database/Auth**: [Firebase Firestore & Auth](https://firebase.google.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Notifications**: [Sonner](https://sonner.stevenly.me/)

---

## 🛠️ Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/AlekhyaGudibandla/HealthDash-Pro.git
cd HealthDash-Pro
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and add your Firebase credentials:
```env
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="healthcare-saas-..."
VITE_FIREBASE_PROJECT_ID="healthcare-saas-..."
VITE_FIREBASE_STORAGE_BUCKET="healthcare-saas-..."
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."
VITE_FIREBASE_MEASUREMENT_ID="..."
```

### 4. Run the project
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🚢 Deployment Guide

### Deployment Option 1: Vercel (Recommended)
1. **Connect to GitHub**: Import your repository into [Vercel](https://vercel.com).
2. **Environment Variables**: Go to Project Settings > Environment Variables and add all the keys from your `.env.local` file.
3. **Build Settings**: Vercel will automatically detect the Vite config.
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Deploy**: Click **Deploy**. Vercel handles the SPA routing automatically via the included `vercel.json`.

### Deployment Option 2: Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
   - Select your project.
   - What do you want to use as your public directory? `dist`
   - Configure as a single-page app? `Yes`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

---

## 📝 Credentials for Testing
If you are using the default demo environment:
- **Email**: `admin@demo.com`
- **Password**: `password123`

*(Note: Data is served in real-time from Firestore. If you are starting fresh, use the "Load Demo Data" button in the Patients tab to populate the dashboard.)*

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
