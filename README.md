# Artifacts Tracker

## Project Overview

This server handles authentication, database operations, and API endpoints for **Artifact Tracker**.

The **Artifacts Tracker** is a web application designed to catalog and showcase various historical artifacts, such as the Rosetta Stone and the Antikythera Mechanism. This platform allows users to explore existing artifacts, add new entries, interact with other submissions through likes, and track their own contributions. The system aims to provide an engaging, user-friendly experience with smooth navigation, responsive design, and authentication security.

### Live URL : https://artifact-tracker-22c55.web.app/

---

## Tech Stack & Dependencies

### **Core Technologies**

- **Frontend:** React, React-Router, Tailwind CSS, DaisyUI
- **Backend:** Firebase Authentication, MongoDB, Express.js

### **Installed Packages**

- **cookie-parser**
- **cors**,
- **dotenv**
- **express**
- **firebase-admin**
- **jsonwebtoken**
- **mongodb**

## Key Features

### **User Authentication & Security**

- **Firebase Authentication** (Email/Password-based & Google Login)
- **JWT Authentication** for protecting routes
- **Secure Firebase & MongoDB credentials** using environment variables

### **Artifact Management**

- **Add Artifacts** with comprehensive details
- **Update/Delete Artifacts** (Only accessible to the artifact owner)
- **Like Button with Toggle Functionality** (Like & Dislike artifacts)
- **Dynamic Sorting & Filtering** for featured artifacts
- **Search Artifacts** by name using MongoDB's `$regex` method

### **UI & Navigation**

- **Tailwind CSS & DaisyUI for a modern design**
- **Fully responsive on mobile, tablet, and desktop**
- **Animated elements using Motion and Swiper**
- **Dynamic title updates per route**

### **Page Structure**

- **Home Page:** Includes a banner/slider, featured artifacts, our history and about us
- **Artifact Details Page:** Displays full details of each artifact, with a Like button
- **Add Artifacts Page:** Allows users to submit artifacts (Private Route)
- **All Artifacts Page:** Displays all available artifacts with filtering options
- **Liked Artifacts Page:** Shows artifacts liked by the user (Private Route)
- **My Artifacts Page:** Displays artifacts added by the logged-in user with update/delete options
- **Update Artifact Page:** Allows users to modify previously added artifacts
- **404 Page:** A custom Not Found page for unmatched routes

### **Additional Enhancements**

- **Spinner Animation** for loading states
- **Toast & SweetAlert notifications** for feedback on user actions
- **Conditional Navbar:** Displays login/logout buttons or user avatar with a dropdown menu

### Installation & Setup

To run this project locally:

1. **Clone the repository**

```bash
 git clone https://github.com/devabdullahalnoman/Artifact-Tracker-Server.git
 cd Artifact-Tracker-Server
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables Create a .env file and add:**

```env
DB_USER=your database username
DB_PASSWORD=your database password
```

4. **Start the development server**

```bash
npm run dev
```

View the app Open http://localhost:5173
