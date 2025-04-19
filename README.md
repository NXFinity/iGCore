<p align="center">
  <a href="https://beamify.online" target="_blank">
    <img src="assets/icon.png" width="120" alt="Beamify Logo" />
  </a>
</p>

<h1 align="center">iGCore — Beamify API</h1>
<p align="center">
  <strong>The foundational engine of the Beamify Network</strong><br/>
  An enterprise-grade, feature-rich API powering Beamify’s creative ecosystem.
</p>

---

## 🧠 What is iGCore?

**iGCore** is the official backend for the Beamify Network — a modular, scalable, and secure API that serves as the core of our entire creative platform.

Built with **NestJS**, **PostgreSQL**, and a clean service-first architecture, iGCore handles everything from user authentication, payments, and gamification to dynamic asset management and integrations with Beamify's frontend, chat, and city visualization engine.

---

## 🚀 Key Features

- ⚙️ **Enterprise-Grade Architecture** – Modular, testable, and built with scalability in mind
- 🔐 **Secure by Design** – Token-based auth, RBAC, and rate limiting baked in
- 🧱 **Reusable Modules** – Built as a plug-and-play system for internal and future microservices
- 🎮 **Gamification Engine** – Blockchain-inspired transaction model with reward pools and badge tracking
- 💬 **Integrated Messaging Ready** – Seamlessly connects with our standalone encrypted chat infrastructure
- 🌆 **City Visualization Sync** – Realtime metrics used to visually grow the Beamify digital city
- 📦 **Queue & Events Support** – Ready for microservice messaging, workers, and task queues
- 📈 **Audit & Traceability** – Built-in tracking for key system events and user actions
- ☁️ **Cloud & Dev Friendly** – Dockerized, environment-configurable, and CI/CD-ready

---

## 🧬 Technologies Used

- **NestJS** – Scalable and structured Node.js framework
- **TypeORM** – Elegant PostgreSQL ORM
- **Redis (Planned)** – Future caching, sessions, and pub/sub
- **JWT + Guards** – Role-based access control
- **Docker** – Containerization and deployment
- **Swagger** – Auto-generated API documentation
- **Jest** – Built-in testing support

---

## 📦 Project Structure

```bash
src/
├── auth/               # Authentication & authorization
├── users/              # User profile & account modules
├── gamification/       # Point system, rewards, NFT-like achievements
├── chat/               # (Integration layer with standalone chat server)
├── city-visualization/ # Data streams for Beamify's city engine
├── common/             # Shared utilities, guards, filters, pipes
├── database/           # Base entities, migrations, seeders
└── main.ts             # App bootstrap logic
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🛠️ Contributing

Contributions are welcome! Please open an issue or submit a PR with improvements or bug fixes.

---

## 🌐 Learn More

- 🔗 [Beamify Website](https://beamify.online)
- 📦 [Beamify Frontend](https://github.com/NXFinity/iGApp)
- 💬 [Beamify Chat](https://github.com/NXFinity/iGChat)  
