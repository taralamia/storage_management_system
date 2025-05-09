# 📦 Storage Management System
A cloud-based storage management system built using Node.js, Express, and MongoDB that allows users to securely upload, manage, and organize their files and notes. The system supports user authentication, folder organization, file uploads (PDFs, images, notes), and advanced features like favoriting, renaming, sharing, and more.
## 🚀 Features
- 🔐 User authentication (Sign-up/Login)
- 📁 Folder creation and management
- 📄 File uploading (PDFs, images, notes)
- ⭐ Mark files/folders as favorite
- 📂 Rename, duplicate, delete folders/files
- 🔗 Share files/folders via generated links
- 📊 Dashboard for managing all stored content
## 🛠️ Tech Stack
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- File Uploads: Multer
- Authentication: JWT (JSON Web Tokens)
- Testing & Debugging: Postman, Console logs
## ⚙️ Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone https://github.com/taralamia/storage-management-system.git
2. **Install Dependencies**
    ```bash
      npm install
3. **Create a .env file**:
    
    JWT_SECRET=your_jwt_secret_key
    MONGO_URI=your_mongodb_connection_uri

4. **Run the application**
   ```bash
      npm start
## 🧪 API Testing
Use Postman to test routes:
- POST /signup - Create user
- POST /login - Login
- POST /folder/create - Create folder
- POST /file/upload - Upload files
- POST /file/upload - Upload files
- PATCH /file/rename/:id - Rename file
- PATCH /file/favorite/:id - Mark as favorite
- DELETE /file/:id - Delete file
- GET /dashboard - Fetch all files/folders
## 📌 Future Enhancements
- Build a modern frontend using React.js
- Implement real-time file collaboration
- Complete development of all planned features
