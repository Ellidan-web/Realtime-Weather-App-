# 🌦️ Premium Real-Time Weather App

A modern, responsive, and feature-rich **real-time weather application** built using **HTML, CSS, and Vanilla JavaScript**.  
It fetches live weather data from the **OpenWeatherMap API** and presents it with a clean, Apple-style UI, smooth animations, and interactive charts.

---

## 🚀 Features

### 🌍 Core Features
- 🔎 Search weather by city name
- 📍 Auto-detect user location using Geolocation API
- 🌡️ Current temperature and conditions
- 🌬️ Wind speed, humidity, and “feels like” temperature
- 📅 5-day weather forecast
- ⏱️ Hourly temperature chart

### 🎨 UI & UX
- Modern glassmorphism design
- Smooth transitions and hover animations
- Weather-based gradient backgrounds
- Animated weather effects (rain)
- Responsive layout (mobile & desktop)
- Readable typography with soft color palette

### ⚡ Performance & Extras
- Local caching with `localStorage`
- Loading and error states
- Day/Night visual adjustment
- Installable-ready PWA structure (optional extension)

---

## 🛠️ Tech Stack

- **HTML5**
- **CSS3 (Glassmorphism & Animations)**
- **JavaScript (ES6+)**
- **OpenWeatherMap API**
- **Chart.js** (for hourly temperature visualization)

---
## 🔑 API Key Setup (Required)

This app uses the OpenWeatherMap API.

### Step 1: Get an API Key

Create a free account and generate an API key:
👉 https://home.openweathermap.org/api_keys

### Step 2: Add the API Key

Open index.html and replace:
```
const API_KEY = "YOUR_API_KEY_HERE";
```

with your actual API key.

## 📦 Project Structure

```
weather-app/
│
├── index.html
├── styles.css
├── script.js
├── README.md
│
└── assets/
    └── logo/
        └── weather_logo.png
```
