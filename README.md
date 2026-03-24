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
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""
```

### 4. Run the project
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---


## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
