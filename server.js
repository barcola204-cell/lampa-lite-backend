const express = require('express');
const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());

// Проверка работы сервера
app.get('/', (req, res) => {
  res.json({ status: 'online', service: 'lampa-lite-backend' });
});

// Интеграция Kodik API (базовый эндпоинт для поиска)
app.get('/kodik/search', async (req, res) => {
  try {
    const { title, kinopoisk } = req.query;
    // Пример запроса к публичному API Kodik (требует токен, если используется официальный, либо открытые зеркала)
    const kodikToken = process.env.KODIK_TOKEN || '';
    let url = `https://kodikapi.com/search?token=${kodikToken}&limit=20`;
    
    if (kinopoisk) url += `&kinopoisk_id=${kinopoisk}`;
    else if (title) url += `&title=${encodeURIComponent(title)}`;

    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Kodik fetch error', details: error.message });
  }
});

// Интеграция Filmix (проксирование запросов с учетом токена)
app.get('/filmix/api', async (req, res) => {
  try {
    const userToken = process.env.FILMIX_TOKEN || '';
    // Базовые параметры запроса к API Filmix
    const queryString = new URLSearchParams({ ...req.query, user_token: userToken }).toString();
    const url = `https://api.filmix.co/v2/index?${queryString}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent:': 'Mozilla/5.0 (Lampa/Lite)'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Filmix fetch error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
