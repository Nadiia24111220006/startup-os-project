const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// --- ЛОГІКА ДЛЯ ДЕПЛОЮ (Env Variables) ---
// На Render беремо ключ зі змінної оточення, на ПК — з файлу
let serviceAccount;
try {
  serviceAccount = process.env.FIREBASE_KEY 
    ? JSON.parse(process.env.FIREBASE_KEY) 
    : require('./serviceAccountKey.json');
} catch (error) {
  console.error("Помилка завантаження ключів Firebase:", error.message);
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

// Головна сторінка, щоб не було "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Бекенд стартапу працює! Використовуйте /api/startup');
});

// 1. GET Маршрут: Отримання інформації про компанію
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

// 2. POST Маршрут: Збереження інформації з валідацією
app.post('/api/startup', async (req, res) => {
  const { name, domain, staff } = req.body;

  // ВАЛІДАЦІЯ: мінімум 5 знаків
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

// На Render порт призначається автоматично через process.env.PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер працює на порту ${PORT}`);
});