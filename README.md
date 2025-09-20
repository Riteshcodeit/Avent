#  Avent – Securifide Assignment  
<img width="1348" height="635" alt="Screenshot 2025-09-10 225356" src="https://github.com/user-attachments/assets/b9b63e74-d9aa-4f70-b922-676fa4677891" />


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
<img width="1339" height="625" alt="Screenshot 2025-09-10 225420" src="https://github.com/user-attachments/assets/aa10bfc5-86b8-4214-a98f-2bce180345f1" />

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

Avent is a **dashboard + backend system** that ingests **mock threat feeds**, processes them, and displays them in an **interactive UI for security teams**.  
<img width="1351" height="628" alt="Screenshot 2025-09-10 225449" src="https://github.com/user-attachments/assets/eb57917a-221e-443f-ac97-cd0db5aa8604" />
<img width="1352" height="628" alt="Screenshot 2025-09-10 225507" src="https://github.com/user-attachments/assets/3a7f86d8-4e10-49dc-a789-52b5c843f275" />
<img width="1346" height="625" alt="Screenshot 2025-09-10 225521" src="https://github.com/user-attachments/assets/4f2280a3-f6ed-4c62-a26e-67aaaf279e12" />


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
## 🛠️ Build & Run
1️⃣ Clone the repository
```
git clone https://github.com/Riteshcodeit/Avent.git
cd Avent
```

2️⃣ Setup Backend
```
cd backend
npm install
npm start

```
👉 Runs on http://localhost:3000

3️⃣ Setup Frontend
```
cd frontend
npm install
npm run dev

```
👉 Runs on http://localhost:5173 (Vite) 
