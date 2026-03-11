const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

let serviceAccount;
try {
  if (process.env.FIREBASE_KEY) {
    // Чистимо ключ від можливих зайвих пробілів при копіюванні в Render
    serviceAccount = JSON.parse(process.env.FIREBASE_KEY.trim());
  } else {
    // Якщо працюємо локально на комп'ютері
    serviceAccount = require('./serviceAccountKey.json');
  }
} catch (error) {
  console.error("Критична помилка завантаження ключів Firebase:", error.message);
}

// Ініціалізація Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

// Головна сторінка
app.get('/', (req, res) => {
  res.send('Бекенд стартапу працює! Використовуйте /api/startup');
});

// 1. GET Маршрут: Отримання інформації
app.get('/api/startup', async (req, res) => {
  try {
    const startupRef = db.collection('startups').doc('main_info');
    const doc = await startupRef.get();
    
    if (!doc.exists) {
      return res.status(404).send({ message: "Компанію не знайдено в БД" });
    }
    res.json(doc.data());
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 2. POST Маршрут: Збереження інформації
app.post('/api/startup', async (req, res) => {
  const { name, domain, staff } = req.body;

  if (!name || name.length < 5) {
    return res.status(400).json({ 
      error: "Назва компанії має містити мінімум 5 символів!" 
    });
  }

  try {
    await db.collection('startups').doc('main_info').set({
      name,
      domain,
      staff: Number(staff),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ message: "Дані компанії успішно оновлено на сервері!" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер працює на порту ${PORT}`);
});