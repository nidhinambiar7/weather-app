# Weather App

A simple, responsive weather dashboard that allows users to register, log in, and search for real-time weather data by city using the OpenWeatherMap API.

---

## Features

- User registration and login
- Live weather search by city name
- Responsive design for desktop and mobile
- Loading indicators and error handling
- Clean and user-friendly interface

---

## Project Files

```
weather-app/
├── index.html              # Main page
├── weather-app-css.css     # Styling
├── script.js               # JavaScript logic
├── server.js               # Optional backend (Node.js)
└── README.md               # This file
```

---

## Quick Setup

### Frontend Only (No backend)

1. Clone or download the repo:
```bash
git clone https://github.com/nidhinambiar7/weather-app.git
cd weather-app
```

2. Open `index.html` in your web browser

3. Make sure to insert your **OpenWeatherMap API key** in `script.js`:
```js
const API_KEY = 'your_openweathermap_api_key';
```

### Optional: Backend Setup (for user storage)

Requires Node.js and MySQL installed locally

1. Create the database:
```sql
CREATE DATABASE weather_app;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node server.js
```

The backend runs on `http://localhost:3000` by default and handles login/register with password hashing.

---

## Built With

* **HTML, CSS, JavaScript**
* **OpenWeatherMap API** for live data
* *(Optional)* Node.js + Express + MySQL for backend login/register

---

## License

MIT License — free to use, modify, and distribute.

---

## Author

**Made with ❤️ by @nidhinambiar7**
