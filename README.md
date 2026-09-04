<div align="center">
  <h1>🍿 FilmFeed</h1>
  <p>
    <strong>A Modern, High-Performance Movie Discovery & Social Platform</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/TailwindCSS-4.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  </p>
</div>

<br />

## 📖 Overview

**FilmFeed** is a comprehensive, full-stack web application designed for cinema enthusiasts. Built with modern web technologies, it offers a seamless and interactive experience for discovering new movies, managing personal watchlists, and engaging with a vibrant community. The platform features a premium dark-themed UI, fluid micro-animations, and robust security standards, making it both visually striking and technically sound.

---

## ✨ Core Features

- **Advanced Authentication & Security**
  - Secure credential-based authentication using **bcrypt** and **JSON Web Tokens (JWT)**.
  - Protected API routes and role-based access control.

- **Dynamic User Experience**
  - Lightning-fast SPA (Single Page Application) routing with **React Router DOM**.
  - Fluid UI transitions and micro-animations powered by **Framer Motion**.
  - Fully responsive, mobile-first design implemented via **Tailwind CSS v4**.

- **Personalized Dashboards**
  - Comprehensive user profile management.
  - Dedicated pages for curated movie feeds and personal watchlists.
  - Centralized frontend state management ensuring data consistency utilizing **Redux Toolkit**.

---

## 🏗️ Architecture & Tech Stack

FilmFeed employs a decoupled client-server architecture, enabling independent scaling and seamless continuous deployment pipelines.

### Client-Side (Frontend)

- **Framework:** React 18
- **Build Engine:** Vite
- **Styling & UI:** Tailwind CSS, Framer Motion
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM v7

### Server-Side (Backend)

- **Runtime & Framework:** Node.js, Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** jsonwebtoken (JWT), bcryptjs
- **Middleware:** cors, express-async-handler

---

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites

Ensure you have the following installed on your local machine:

- **Node.js** (v18.x or higher recommended)
- **MongoDB** (Local instance or Atlas cluster)
- **Git**

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/FilmFeed.git
   cd FilmFeed
   ```

2. **Setup the Backend:**

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the `server` root directory:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=7d
   TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token
   TMDB_API_KEY=your_tmdb_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLIENT_ORIGIN=http://localhost:5173
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` root directory:
   ```env
   VITE_API_BASE_URL=/api
   ```

### Running the Environment

You will need to run the client and the server concurrently in separate terminal windows.

**Terminal 1 (Backend API):**

```bash
cd server
npm run dev
```

_The Express server will initialize on `http://localhost:5000`._

**Terminal 2 (Frontend Client):**

```bash
cd client
npm run dev
```

_The Vite development server will start, typically accessible at `http://localhost:5173`._

## Deploying to Render

FilmFeed can run as one Render Web Service. The root scripts install the nested
dependencies, build the Vite client, and start the Express server. Express then
serves the built client and the `/api` routes from the same service.

Create a new **Web Service** in Render and connect the repository with these settings:

- **Root Directory:** leave blank
- **Environment:** `Node`
- **Build Command:** `npm run build`
- **Start Command:** `npm start`

Add these environment variables in Render. Use the values from your own MongoDB,
TMDB, and Cloudinary accounts; do not commit them to Git:

```env
NODE_ENV=production
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token
TMDB_API_KEY=your_tmdb_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_ORIGIN=https://your-service-name.onrender.com
```

Render provides `PORT` automatically, so do not add a fixed production port.
After deployment, open the service URL. The React app and API should use the same
origin, so no `VITE_API_BASE_URL` variable is required for this setup.

Before deploying, run `npm run build` locally from the repository root. If you
want to deploy the frontend and backend as separate Render services instead,
use a Render Static Site for `client` with build command `npm install && npm run
build`, publish directory `client/dist`, and set `VITE_API_BASE_URL` to the
backend service's `/api` URL.

---

## 📂 Directory Structure

```text
FilmFeed/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── api/                # Axios instances & API calls
│   │   ├── components/         # Reusable UI components (Auth, Profile, Layouts)
│   │   ├── pages/              # Route-level components (MoviesPage, AuthPage, MyListPage)
│   │   ├── store/              # Redux slices and store configuration
│   │   ├── App.jsx             # Root application component
│   │   └── main.jsx            # React DOM entry point
│   ├── vite.config.js          # Vite bundler configuration
│   └── package.json
│
├── server/                     # Node.js/Express Backend
│   ├── controllers/            # Route request handlers
│   ├── models/                 # Mongoose database schemas (User, Movie, etc.)
│   ├── routes/                 # Express route definitions
│   ├── middleware/             # Custom middleware (Auth guarding, Error handling)
│   ├── server.js               # Express application entry point
│   └── package.json
│
└── README.md                   # Project documentation
```

---

## 🤝 Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

Please ensure your code adheres to the existing ESLint configurations and styling guidelines.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<br />
<div align="center">
  <i>Developed with ❤️ for movie lovers.</i>
</div>
