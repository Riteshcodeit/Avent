# 🚀 Avent – Securifide Assignment 
<img width="1348" height="635" alt="Screenshot 2025-09-10 225356" src="https://github.com/user-attachments/assets/d4aa2165-64f5-485e-9469-277872eb70a0" />


## ⚙️ Tech Stack

![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react&logoColor=white&style=for-the-badge)  
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)  
![Express](https://img.shields.io/badge/Framework-Express.js-000000?logo=express&logoColor=white&style=for-the-badge)  
![Zustand](https://img.shields.io/badge/State-Zustand-FF6F00?style=for-the-badge)  
![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)  
![Framer Motion](https://img.shields.io/badge/Animation-FramerMotion-0055FF?logo=framer&logoColor=white&style=for-the-badge)  
![React Three Fiber](https://img.shields.io/badge/3D-ReactThreeFiber-FF4785?logo=three.js&logoColor=white&style=for-the-badge)  
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)  

This repository contains the implementation of the assignment given by **Securifide**.  
The project demonstrates architectural design, modular code structure, and implementation of key functionalities as per the requirements.  

---

## 📌 Table of Contents  
- [🔎 Overview](#-overview)  
- [🏗️ Architecture](#-architecture)  
- [⚙️ Tech Stack](#-tech-stack)  
- [📂 Project Structure](#-project-structure)  
- [🛠️ Build & Run](#️-build--run)  
- [✨ Features](#-features)  

---

## 🔎 Overview  
<img width="1351" height="628" alt="Screenshot 2025-09-10 225449" src="https://github.com/user-attachments/assets/ba82f7f8-0c3a-47a4-8bbe-0f1d6b603f38" />

Avent is a **dashboard + backend system** that ingests **mock threat feeds**, processes them, and displays them in an **interactive UI for security teams**.  

The main goals of the project are:  
- Implement modular **frontend & backend** components.  
- Showcase **secure and scalable architecture**.  
- Provide **easy setup and usage instructions**.  

---

## 🏗️ Architecture  

```text
                ┌───────────────┐
                │   MockData    │  ← External APIs / Sources
                └───────┬───────┘
                        │
              ┌─────────▼─────────┐
              │    Backend API    │ (Node.js/Express)
              │  • Fetch & Send   │
              │    Mock Data      │  
              └─────────┬─────────┘
                        │
              ┌─────────▼─────────┐
              │   Frontend UI     │ (React)
              │  • Dashboard      │
              │  • Zustand Store  │
              │  • Filters/Charts │
              └───────────────────┘


```

<img width="1346" height="625" alt="Screenshot 2025-09-10 225521" src="https://github.com/user-attachments/assets/787ae2d5-0ea7-4996-a9b2-61ed3e904073" />


## 📂 Project Structure
```
Avent/
├── backend/             # API, routes, services
│   ├── routes/
│   ├── Controllers/
│   ├── Data/
│   └── server.js
├── frontend/            # React UI
│   ├── src/components/
│   ├── src/lib/
│   ├── src/store/
│   └── src/utils/
├── package.json
└── README.md
```
<img width="1352" height="628" alt="Screenshot 2025-09-10 225507" src="https://github.com/user-attachments/assets/a40f5744-1e73-42fe-b8cc-75adfce8a93a" />

## 🛠️ Build & Run
```
1️⃣ Clone the repository
git clone https://github.com/Riteshcodeit/Avent.git
cd Avent

2️⃣ Setup Backend
cd backend
npm install
npm start


👉 Runs on http://localhost:3000

3️⃣ Setup Frontend
cd frontend
npm install
npm run dev


👉 Runs on http://localhost:5173 (Vite) or http://localhost:3000 (CRA)
```
<img width="1339" height="625" alt="Screenshot 2025-09-10 225420" src="https://github.com/user-attachments/assets/4adafcbe-9cd2-4cd2-90a7-aecdf2cd8ca6" />

## ✨ Our Features

📡 Mock Data Fetching – Ingests feeds from local mock sources

🗄️ Backend API – Sends processed mock data

📊 Interactive Dashboard – Filter, sort, and visualize data

⚡ Real-time State Management – Powered by Zustand

🎨 Modern UI – Smooth animations with Framer Motion & 3D visuals with React Three Fiber
