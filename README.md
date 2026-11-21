# 🛒 YoursMart – Full-Stack E-Commerce Platform (MERN)

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![License](https://img.shields.io/badge/License-MIT-success)

📌 Designed and developed a full-stack MERN e-commerce application with JWT authentication, OTP-based email verification, and secure password reset functionality.

📌 Implemented product search, filtering, sorting, cart, checkout flow, and PayPal payment gateway, along with Redux Toolkit for state management.

📌 Built an admin dashboard with CRUD operations for users, products, orders, inventory, and integrated Cloudinary & Multer for image uploads; deployed on Render.


---

## 🌐 Live Demo

🔗 **Website:** https://yoursmart.onrender.com/  
📂 **GitHub Repo:** https://github.com/VishalKumarGupta1/YoursMart_E-commerce-platform

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Material UI (MUI)
- Redux Toolkit (state management)
- React Router DOM
- React Toastify (notifications)
- Responsive Design

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Bcrypt.js
- Multer
- Cloudinary
- Cron Jobs

### Payment Gateway
- PayPal

---

## 🔐 Authentication & Security

- JWT & **cookie-based authentication**
- **Email OTP verification** during signup (expires in 15 minutes)
- Forgot password with **email reset link**
- Password hashing using **bcrypt**
- Protected routes with middleware
- Auto-deletion of unverified users using **cron jobs**

---

## 🛒 User Features

- User registration & login
- Email OTP verification
- Product search by name
- Filter by **category** & **brand**
- Sort by **price** and **name**
- Add to cart & checkout flow
- Pay securely via **PayPal**
- Save **multiple delivery addresses**
- View complete order history
- Track real-time order status
- Product ratings & reviews
- Submit star-based ratings & experience
- Low-stock alerts (when stock < 10)
- Toast notifications
- Fully responsive UI

---

## 🧑‍💼 Admin Features

- Secure admin dashboard
- CRUD operations for:
  - Products
  - Users
  - Orders
  - Inventory stock
- Update order status
- Assign admin roles
- Image upload using **Multer + Cloudinary**
- Role-based access control

---

## 🧱 Backend Architecture

- Modular & scalable codebase
- RESTful APIs
- Middleware-based authentication
- Centralized error handling
- Secure JWT token management
- Cloud-based image storage
- Automated cleanup via cron jobs



---

## 📸 Screenshots

### 🏠 Home Page
<img width="1919" height="904" alt="Screenshot 2026-01-26 163234" src="https://github.com/user-attachments/assets/7ef32736-24c2-4318-b531-0084daa5dc73" />

<img width="1900" height="912" alt="Screenshot 2026-01-26 163249" src="https://github.com/user-attachments/assets/eaa75971-6125-4783-b924-6bddeefd262b" />

<img width="1896" height="812" alt="Screenshot 2026-01-26 163303" src="https://github.com/user-attachments/assets/f69cc019-3017-4721-8224-9ed83367a04c" />

### 🛍️ Product Listing

<img width="1897" height="908" alt="Screenshot 2026-01-26 163437" src="https://github.com/user-attachments/assets/fd00f5d5-0fc4-4044-9d27-eea11528797b" />
<img width="1698" height="893" alt="Screenshot 2026-01-26 163514" src="https://github.com/user-attachments/assets/2ac31bca-f1b5-47c0-94e9-210bdefc37ef" />

### 🛒 Cart & Checkout

<img width="1616" height="911" alt="Screenshot 2026-01-26 163707" src="https://github.com/user-attachments/assets/5eba0ff9-eed6-4981-9581-1e478fe2b50e" />
<img width="1916" height="905" alt="Screenshot 2026-01-26 163813" src="https://github.com/user-attachments/assets/ffeca882-7c56-44e8-a72a-04fcf51e1b7c" />


### 👤 User Profile & Orders
<img width="1901" height="908" alt="Screenshot 2026-01-26 163849" src="https://github.com/user-attachments/assets/b2c580f8-307c-4d98-9e17-cb9423895bd4" />
<img width="1919" height="825" alt="Screenshot 2026-01-26 170148" src="https://github.com/user-attachments/assets/86b8ac61-21e0-4266-8d15-436821ecdb0b" />


### 🧑‍💼 Admin Dashboard
<img width="1897" height="906" alt="Screenshot 2026-01-26 163927" src="https://github.com/user-attachments/assets/0eb000ac-52d2-4693-bde7-e98f2024673e" />
<img width="1899" height="896" alt="Screenshot 2026-01-26 163941" src="https://github.com/user-attachments/assets/d3b507b5-4f69-47e9-a403-791a842dd052" />
<img width="1901" height="916" alt="Screenshot 2026-01-26 164003" src="https://github.com/user-attachments/assets/c90c2716-69b5-4715-9d82-7410f8b7a796" />
<img width="1898" height="907" alt="Screenshot 2026-01-26 164022" src="https://github.com/user-attachments/assets/d83ae628-0383-4853-a1d3-4342ab3bc856" />


### 🏠 Register Page
<img width="1919" height="906" alt="Screenshot 2026-01-26 163148" src="https://github.com/user-attachments/assets/18d1b8a1-e35c-4518-89d8-827ef71744a4" />
---


## ☁️ Deployment

- Deployed on **Render**
- Cloudinary for image storage
- Environment variables for security

---

## ⚙️ Installation & Setup

```bash
# Clone repository
git clone https://github.com/VishalKumarGupta1/YoursMart_E-commerce-platform

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

Environment Variables

Create a .env file in backend folder:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
```

## 🚀 Future Enhancements

- Wishlist feature  
- Coupon and discount system  
- Email notifications for order updates  
- Razorpay / Stripe payment integration  
- Sales analytics dashboard  

---

## 👨‍💻 Author

**Vishal Kumar Gupta**  
GitHub: [VishalKumarGupta1](https://github.com/VishalKumarGupta1)

---

## ⭐ Support

If you like this project, please give it a ⭐ on GitHub — it really helps!
