const express = strict = require('express');
const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'online', service: 'lampa-lite-backend' });
});

// Простой универсальный прокси для поиска видео без жестких токенов
app.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    // Обращаемся к открытому каталогу
    const response = await fetch(`https://bazon.cc/api/search?token=free&title=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Search fetch error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
