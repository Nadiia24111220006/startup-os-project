const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Ініціалізація Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

// 1. GET Маршрут: Отримання інформації про компанію (Завдання 3)
app.get('/api/startup', async (req, res) => {
  try {
    const startupRef = db.collection('startups').doc('main_info');
    const doc = await startupRef.get();
    
    if (!doc.exists) {
      return res.status(404).send({ message: "Компанію не знайдено" });
    }
    res.json(doc.data());
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 2. POST Маршрут: Збереження інформації з валідацією (Завдання 4)
app.post('/api/startup', async (req, res) => {
  const { name, domain, staff } = req.body;

  // ВАЛІДАЦІЯ: мінімум 5 знаків (Завдання 4)
  if (!name || name.length < 5) {
    return res.status(400).json({ 
      error: "Назва компанії має містити мінімум 5 символів!" 
    });
  }

  try {
    await db.collection('startups').doc('main_info').set({
      name,
      domain,
      staff,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ message: "Дані компанії успішно збережено!" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});