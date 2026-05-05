# Sospeter Sylivester - Graphics Designer Portfolio & Service Platform

## 🎨 Project Overview

A modern, responsive web application for a Graphics Designer portfolio and service platform. Built with **Next.js 14**, **React 18**, **Firebase**, and **Tailwind CSS**.

### Features
- ✅ User Authentication (Email/Password + Google Sign-In)
- ✅ "Remember Me" Persistent Login
- ✅ User Profile Management with Picture Upload
- ✅ Modern Dashboard
- ✅ Services Display (6 Different Services)
- ✅ Service Request System
- ✅ Portfolio & Skills Section
- ✅ Admin Panel for Requests
- ✅ Dark Mode Support (Ready)
- ✅ Mobile Responsive

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/sosybrown96/sosybrowntz.git
cd sosybrowntz

# Install dependencies
npm install
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable these services:
   - **Authentication** (Email/Password + Google)
   - **Firestore Database** (Test mode)
   - **Cloud Storage**

4. Get your credentials:
   - Click ⚙️ (Settings) > Project Settings
   - Scroll to "Your Apps" section
   - Copy the configuration

5. Create `.env.local` file:

```bash
# Copy from .env.example
cp .env.example .env.local

# Then edit .env.local with your Firebase credentials:
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
sosybrowntz/
├── src/
│   ├── config/
│   │   └── firebase.js              # Firebase initialization
│   ├── services/
│   │   ├── authService.js           # Authentication functions
│   │   └── serviceRequestService.js # Service request CRUD
│   ├── store/
│   │   └── authStore.js             # Zustand auth state
│   ├── components/                  # React components
│   ├── pages/                       # Next.js pages
│   └── app/                         # App router
├── public/                          # Static files
├── package.json
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
└── .env.local                       # Environment variables
```

## 🔐 Firebase Security Rules

Add these rules to your Firestore:

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Service requests - users can create, read their own; admins can read all
    match /serviceRequests/{requestId} {
      allow create: if request.auth != null;
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

Cloud Storage Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload to their own profile pictures folder
    match /profile-pictures/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }

    // Users can upload to their own uploads folder
    match /uploads/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

## 📚 Available Services

The platform displays these services:

1. **Graphic Design** - Logo design, flyers, brochures
2. **Branding** - Brand identity, style guides
3. **Social Media Graphics** - Posts, stories, banners
4. **Video Editing** - Professional video editing, transitions
5. **Animation** - 2D/3D animations, motion graphics
6. **Web Design** - Website design and mockups

## 🎯 API Services

### Authentication Service

```javascript
import { signUpWithEmail, signInWithEmail, signInWithGoogle, uploadProfilePicture } from '@/services/authService';

// Sign up
const result = await signUpWithEmail(email, password, displayName);

// Sign in
const result = await signInWithEmail(email, password, rememberMe);

// Google sign in
const result = await signInWithGoogle();

// Upload profile picture
const result = await uploadProfilePicture(userId, file);
```

### Service Request Service

```javascript
import { createServiceRequest, getUserServiceRequests, getAllServiceRequests } from '@/services/serviceRequestService';

// Create request
const result = await createServiceRequest(userId, {
  serviceType: 'Graphic Design',
  description: 'Design a logo',
  deadline: '2026-06-05',
  budget: 5000
});

// Get user requests
const result = await getUserServiceRequests(userId);

// Get all requests (admin)
const result = await getAllServiceRequests();
```

## 🎨 Customization

### Update Designer Profile

Edit `src/config/firebase.js` to pre-fill user data:

```javascript
phone: '+255 745 028 158',
location: 'Dar es Salaam, Tanzania',
```

### Update Color Theme

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: '#2563eb',    // Blue
  secondary: '#1e40af',  // Dark blue
  accent: '#3b82f6',     // Light blue
}
```

### Update Services

Edit `src/services/serviceRequestService.js`:

```javascript
export const SERVICE_TYPES = [
  'Your Service 1',
  'Your Service 2',
  // ...
];
```

## 📦 Build & Deploy

### Build

```bash
npm run build
```

### Deploy to Firebase Hosting

```bash
# Install Firebase tools
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase hosting
firebase init hosting

# Deploy
firebase deploy
```

## 📝 Contact Information

- **Name:** Sospeter Sylivester
- **Email:** sosybrown96@gmail.com
- **Phone:** +255 745 028 158
- **Location:** Dar es Salaam, Tanzania

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18
- **Styling:** Tailwind CSS 3.4
- **Backend:** Firebase (Auth + Firestore + Storage)
- **State Management:** Zustand
- **Form Handling:** React Hook Form
- **Notifications:** React Hot Toast
- **Icons:** React Icons
- **Hosting:** Firebase Hosting

## 📄 License

This project is private and for personal use.

## 🤝 Support

For issues or questions, contact: sosybrown96@gmail.com
