# fdfed-project (Backend Centric)

A full-stack automotive platform with a robust backend architecture, designed for vehicle inventory management, test drives, purchasing, selling, and agent hiring. 

## 🚀 Backend Technologies
- **Core:** Node.js, Express.js (ES Modules)
- **Database:** MongoDB (via Mongoose)
- **Caching & Rate Limiting:** Redis (`ioredis`, `express-rate-limit`)
- **Authentication:** JWT, `bcryptjs`
- **File Storage:** Cloudinary, Multer
- **Security:** Helmet, CORS, Cookie-parser
- **Testing:** Jest, Supertest
- **Logging:** Morgan, Rotating File Stream
- **API Documentation:** Swagger UI
- **Containerization:** Docker (`docker-compose.yml`)

## ⚙️ Key Backend Features
- **Role-Based Access Control (RBAC):** Distinct privileges for Admins, Agents, and Users.
- **Inventory Management:** CRUD operations for cars, advanced filtering, and image attachments via Cloudinary.
- **Test Drives & Transactions:** Secure scheduling for test drives, car selling queries, and purchase requests.
- **Agent Ecosystem:** Dedicated endpoints for agent hiring applications, acceptances, and metrics.
- **Reviews & Notifications:** User feedback module and email/in-app notification services (Nodemailer).
- **Performance Optimization:** Redis caching for fast data retrieval and API rate limiting to prevent abuse.
- **Security:** Helmet integration and robust encrypted cookie sessions.

## 🛠️ Getting Started (Backend)

1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`
3. Include required `.env` variables (MongoDB URI, Redis URL, Cloudinary keys, JWT secret, Nodemailer credentials).
4. Run Development Server: `npm run dev`
5. Run Tests: `npm run test`

*(The frontend is built with React/Vite, styled via Tailwind CSS, and uses Redux/Context for state management.)*
