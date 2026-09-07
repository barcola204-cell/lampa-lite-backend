const express = require('express');
const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());

// Базовый маршрут для проверки работы
app.get('/', (req, res) => {
  res.send('Custom backend is running');
});

// Здесь в будущем мы зарегистрируем нужные источники (Filmix, Kodik и т.д.)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
