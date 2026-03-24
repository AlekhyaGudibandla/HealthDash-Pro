# Healthcare SaaS Dashboard

A production-grade B2B Healthcare SaaS frontend application focusing on scalability, maintainability, and real-world architecture.

## Tech Stack
- **React (Vite)**: Fast build tool and development server.
- **TypeScript**: Strict type-checking enabled.
- **Zustand**: Lightweight global state management for UI and Auth.
- **Tailwind CSS**: Utility-first CSS framework with custom healthcare theme.
- **React Router v6**: Client-side form routing and nested layouts.
- **Firebase Auth**: Authentication service for email/password.
- **Recharts**: Data visualization for Analytics.
- **Lucide React**: Clean, consistent icon set.
- **React Hook Form + Zod**: Performant form validation.

## Architecture

This project strictly follows feature-based (`src/features/*`) architecture to ensure components remain decoupled and micro-frontend ready. 

### Folder Structure
- `src/app/` - Global stores (Zustand) and top-level providers.
- `src/features/` - Domain-driven functionality:
  - `auth/` - Authentication logic, hooks, and forms.
  - `dashboard/` - Layout logic (Header, Sidebar).
- `src/pages/` - Route definitions tying features together.
- `src/components/` - Highly reusable interface components (Buttons, Inputs, Cards).
- `src/services/` - External API and Firebase configuration.
- `src/utils/` - Utility functions (e.g. `cn` for Tailwind class merging).

## Setup & Running Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase (Optional)**
   The project is mocked for demonstration, but you can plug in real Firebase credentials by creating a `.env` file:
   ```env
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-domain.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-bucket.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Key Considerations

- **Service Worker**: A basic Service Worker is implemented in `public/sw.js` for notifications. To see it in action, grant Notification permissions when loading the Dashboard.
- **Lazy Loading**: Pages in `App.tsx` are lazy-loaded via `React.lazy()` to shrink initial bundle sizes.
- **Error Boundaries**: A global top-level Error Boundary guarantees that crashes do not render a white page to the end user.
- **Vercel Deployment**: A `vercel.json` file is included to configure Vite SPA routing out of the box. Simply import this repo into Vercel and set framework to Vite.

## Test Credentials
- **Email**: admin@demo.com
- **Password**: password123 
(Firebase auth is connected, but without valid config keys, it will drop to a mock error state or fail gracefully. For production, replace with your actual Firebase config to test live.)
