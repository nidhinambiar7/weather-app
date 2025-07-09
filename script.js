// Configuration
const API_KEY = 'xxx'; // Replace with your actual OpenWeatherMap API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Application state
let currentUser = null;

// DOM Elements - Pages
const loginPage = document.getElementById('loginPage');
const registerPage = document.getElementById('registerPage');
const weatherPage = document.getElementById('weatherPage');

// DOM Elements - Forms
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// DOM Elements - Messages
const loginError = document.getElementById('loginError');
const loginSuccess = document.getElementById('loginSuccess');
const registerError = document.getElementById('registerError');
const registerSuccess = document.getElementById('registerSuccess');

// DOM Elements - User Info
const currentUserSpan = document.getElementById('currentUser');

// DOM Elements - Weather
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const weatherError = document.getElementById('weatherError');
const weatherInfo = document.getElementById('weatherInfo');

// DOM Elements - Weather Data
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const uvIndex = document.getElementById('uvIndex');

// Event Listeners
document.addEventListener('DOMContentLoaded', enhancedInitializeApp);
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', handleEnterKey);

// Initialize Application
function initializeApp() {
  const usernameInput = document.getElementById('username');
  if (usernameInput) usernameInput.focus();
  showLoginPage();
}

function enhancedInitializeApp() {
  initializeTheme();
  initializeApp();
}

// Theme Management
function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', newTheme);
  try {
    localStorage.setItem('weatherAppTheme', newTheme);
  } catch (e) {
    console.log('Could not save theme preference');
  }
}

function initializeTheme() {
  try {
    const savedTheme = localStorage.getItem('weatherAppTheme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
  } catch (e) {
    console.log('Could not load theme preference');
  }
}

// Authentication (calls backend)
async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  hideAllMessages();

  if (!username || !password) {
    showLoginError('Please enter both username and password');
    return;
  }

  const loginButton = e.target.querySelector('button[type="submit"]');
  loginButton.disabled = true;
  loginButton.textContent = 'Signing In...';

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');

    currentUser = data.username;
    currentUserSpan.textContent = currentUser;
    showLoginSuccess('Login successful! Redirecting to dashboard...');

    setTimeout(() => showWeatherPage(), 1500);
  } catch (error) {
    showLoginError(error.message);
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = 'Sign In';
  }
}

async function handleRegister(e) {
  e.preventDefault();

  const username = document.getElementById('newUsername').value.trim();
  const password = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  hideAllMessages();

  if (!username || !password || !confirmPassword) {
    showRegisterError('Please fill in all fields');
    return;
  }

  if (password !== confirmPassword) {
    showRegisterError('Passwords do not match');
    return;
  }

  if (password.length < 6) {
    showRegisterError('Password must be at least 6 characters long');
    return;
  }

  if (username.length < 3) {
    showRegisterError('Username must be at least 3 characters long');
    return;
  }

  const registerButton = e.target.querySelector('button[type="submit"]');
  registerButton.disabled = true;
  registerButton.textContent = 'Creating Account...';

  try {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');

    showRegisterSuccess('Account created! You can now login.');
    document.getElementById('registerForm').reset();

    setTimeout(() => showLoginPage(), 2000);
  } catch (error) {
    showRegisterError(error.message);
  } finally {
    registerButton.disabled = false;
    registerButton.textContent = 'Create Account';
  }
}

function logout() {
  currentUser = null;
  hideWeatherInfo();
  hideAllMessages();
  cityInput.value = '';
  loginForm.reset();
  registerForm.reset();
  showLoginPage();
}

// Page Navigation
function showLoginPage() {
  hideAllPages();
  loginPage.classList.add('active');
  setTimeout(() => document.getElementById('username').focus(), 100);
}

function showRegisterPage() {
  hideAllPages();
  registerPage.classList.add('active');
  setTimeout(() => document.getElementById('newUsername').focus(), 100);
}

function showWeatherPage() {
  hideAllPages();
  weatherPage.classList.add('active');
  setTimeout(() => cityInput.focus(), 100);
}

function hideAllPages() {
  loginPage.classList.remove('active');
  registerPage.classList.remove('active');
  weatherPage.classList.remove('active');
}

// Weather
function handleEnterKey(e) {
  if (e.key === 'Enter') getWeather();
}

async function getWeather() {
  if (!currentUser) {
    showWeatherError('Please login first to access weather data');
    return;
  }

  const city = cityInput.value.trim();

  if (!city) {
    showWeatherError('Please enter a city name');
    cityInput.focus();
    return;
  }

  if (API_KEY === 'YOUR_API_KEY') {
    showWeatherError('API key not configured. Please replace YOUR_API_KEY with your actual OpenWeatherMap API key.');
    return;
  }

  showLoading();
  hideWeatherError();
  hideWeatherInfo();

  try {
    const response = await fetch(
      `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      let errorMessage = 'Failed to fetch weather data';
      switch (response.status) {
        case 404: errorMessage = 'City not found. Please check the spelling.'; break;
        case 401: errorMessage = 'Invalid API key.'; break;
        case 429: errorMessage = 'Too many requests. Try again later.'; break;
        case 500: errorMessage = 'Weather service is temporarily unavailable.'; break;
        default:  errorMessage = `Weather service error (${response.status}).`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    displayWeather(data);
    addToSearchHistory(city);
  } catch (error) {
    showWeatherError(error.message || 'Failed to fetch weather data.');
  } finally {
    hideLoading();
  }
}

function displayWeather(data) {
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  description.textContent = data.weather[0].description;
  feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
  humidity.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${data.wind.speed} m/s`;
  pressure.textContent = `${data.main.pressure} hPa`;
  visibility.textContent = data.visibility ? `${(data.visibility / 1000).toFixed(1)} km` : 'N/A';
  uvIndex.textContent = 'N/A'; // Not implemented
  showWeatherInfo();
}

// UI Helpers
function showLoading() {
  loading.classList.add('show');
  searchBtn.disabled = true;
  searchBtn.textContent = 'Loading...';
}

function hideLoading() {
  loading.classList.remove('show');
  searchBtn.disabled = false;
  searchBtn.textContent = 'Get Weather Data';
}

function showLoginError(message) {
  loginError.textContent = message;
  loginError.classList.add('show');
}

function showLoginSuccess(message) {
  loginSuccess.textContent = message;
  loginSuccess.classList.add('show');
}

function showRegisterError(message) {
  registerError.textContent = message;
  registerError.classList.add('show');
}

function showRegisterSuccess(message) {
  registerSuccess.textContent = message;
  registerSuccess.classList.add('show');
}

function showWeatherError(message) {
  weatherError.textContent = message;
  weatherError.classList.add('show');
}

function hideWeatherError() {
  weatherError.classList.remove('show');
}

function showWeatherInfo() {
  weatherInfo.classList.add('show');
}

function hideWeatherInfo() {
  weatherInfo.classList.remove('show');
}

function hideAllMessages() {
  loginError.classList.remove('show');
  loginSuccess.classList.remove('show');
  registerError.classList.remove('show');
  registerSuccess.classList.remove('show');
  weatherError.classList.remove('show');
}

// Optional: Search history
let searchHistory = [];

function addToSearchHistory(city) {
  if (!searchHistory.includes(city)) {
    searchHistory.unshift(city);
    if (searchHistory.length > 5) searchHistory.pop();
    updateSearchSuggestions();
  }
}

function updateSearchSuggestions() {
  const suggestions = document.getElementById('searchSuggestions');
  if (suggestions && searchHistory.length > 0) {
    suggestions.innerHTML = searchHistory
      .map(city => `<div class="suggestion-item" onclick="selectSuggestion('${city}')">${city}</div>`)
      .join('');
    suggestions.style.display = 'block';
  }
}

function selectSuggestion(city) {
  cityInput.value = city;
  const suggestions = document.getElementById('searchSuggestions');
  if (suggestions) suggestions.style.display = 'none';
  getWeather();
}
