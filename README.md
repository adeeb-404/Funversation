# Funversation

Funversation is a full-stack MERN (MongoDB, Express, React, Node.js) chat application that enables real-time messaging, group chats, and a range of interactive features to enhance communication. With an intuitive interface and seamless experience, Funversation allows users to engage in one-on-one conversations, create groups, and explore various ways to stay connected.

## Features

- **Real-Time Messaging:** Engage in instant messaging with users across the platform.
- **Group Chats:** Create and join group chats with friends or colleagues.
- **User Authentication:** Secure sign-up and login with JWT-based authentication.
- **User Profiles:** Customize and manage your user profile.
- **Notifications:** Get notified for new messages and events in chats.
- **Responsive UI:** Fully responsive design that works seamlessly on both desktop and mobile devices.

## Tech Stack

- **Frontend:** React.js, Redux (for state management)
- **Backend:** Node.js, Express.js, WebSocket (for real-time communication)
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Token), bcrypt.js (for password hashing)
- **Real-Time:** Socket.io for live chat functionality
- **Deployment:** Vercel (for both front-end and back-end deployment)

## Installation

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/funversation.git
cd funversation

```
### 2. Install dependencies
#### backend
```bash
npm i
```

#### frontend
```bash
cd frontend
npm i
```

### 3. Configure environment variables
```bash
PORT=5000
USERNAME=yourusername
PASSWORD=yourpassword
MONGO_URL=mongo_url
JWT_SECRET=jwtkey
NODE_ENV=production/dev
```


### 4. Run development servers
#### backend
```bash
npm start
```

#### frontend
```bash
cd frontend
npm start
```




