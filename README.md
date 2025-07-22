# Musk Simpson E-commerce Project

## Overview

This is a comprehensive e-commerce platform consisting of three main components:

- Frontend E-commerce Application (Tiki Clone)
- Backend API Service
- AI-powered Chatbot

## Project Components

### 1. E-commerce Frontend

- Built with React and Redux
- Material UI for design components
- Features:
  - User authentication
  - Product browsing and searching
  - Shopping cart management
  - Order processing
  - Payment integration

### 2. Backend Service

- Built with Node.js and Express
- MySQL database
- Features:
  - RESTful API endpoints
  - JWT authentication
  - Product management
  - Order processing
  - User management
  - Payment gateway integration

### 3. AI Chatbot

- Built with Python
- Features:
  - Natural language processing
  - Product recommendations
  - Customer support automation
  - Order status inquiries
  - FAQ handling

## Prerequisites

- Node.js v14+
- Python 3.8+
- MySQL
- MongoDB
- npm or yarn
- pip

## Installation & Setup

### Frontend Setup

```bash
cd tiki
npm install
npm start
```

### Backend Setup

```bash
cd tiki-backend
npm install
npm run dev
```

### Chatbot Setup

```bash
cd tiki-chatbot
pip install -r requirements.txt
python app.py
```

## Environment Variables

Create `.env` files in each project directory:

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CHATBOT_URL=http://localhost:5001
```

### Backend (.env)

```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Chatbot (.env)

```
PORT=5001
API_KEY=your_ai_service_key
```

## API Documentation

- Backend API: `http://localhost:5000/api-docs`
- Chatbot API: `http://localhost:5001/docs`

## Features

- User Authentication & Authorization
- Product Management
- Shopping Cart
- Order Processing
- Payment Integration
- Real-time Chat Support
- AI-powered Product Recommendations
- Search Functionality
- Admin Dashboard

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Contact

- Project Link: [https://github.com/doanndev/musksimpson_ecommerce](https://github.com/doanndev/musksimpson_ecommerce)
