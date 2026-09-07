const express = require('express');
const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());

// Разрешаем CORS, чтобы Лампа могла стучаться на наш сервер с любых устройств
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.get('/', (req, res) => {
  res.json({ status: 'online', service: 'lampa-lite-backend' });
});

// Эндпоинт поиска (проксирует на внешний стабильный каталог)
app.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const response = await fetch(`https://bazon.cc/api/search?token=free&title=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Search fetch error', details: error.message });
  }
});

// Готовый клиентский плагин для Лампы, который отдается по прямой ссылке
app.get('/plugin.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.send(`
(function () {
    'use strict';
    console.log('LampaLite plugin loaded');
    
    // Интеграция в интерфейс поиска Лампы
    if (window.Lampa && Lampa.Api) {
        Lampa.Api.sources.lampa_lite = {
            title: 'Lampa Lite',
            search: function (params, success, error) {
                fetch('https://lampa-lite-backend.onrender.com/search?q=' + encodeURIComponent(params.query))
                    .then(res => res.json())
                    .then(data => {
                        let results = [];
                        if (data && data.results) {
                            results = data.results.map(item => ({
                                title: item.title || item.name,
                                original_title: item.original_title,
                                release_date: item.year,
                                vote_average: item.rating || 0,
                                poster_path: item.poster || '',
                                id: item.id || Math.random()
                            }));
                        }
                        success(results);
                    })
                    .catch(err => error(err));
            }
        };
    }
})();
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
