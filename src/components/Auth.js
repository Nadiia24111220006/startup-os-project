import React, { useState } from 'react';
import { auth, db } from '../firebase'; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // методи Firestore

function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isRegistering) {
                // 1. Створюємо юзера в Auth
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // ЗАПИС ДАНИХ У FIRESTORE 
                // Створюємо документ у колекції 'users' з ID, що дорівнює UID користувача
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    registeredAt: new Date().toLocaleString(),
                    role: "Founder"
                });

            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err) {
            if (err.code === 'auth/wrong-password') setError('Неправильний пароль.');
            else if (err.code === 'auth/user-not-found') setError('Користувача не знайдено.');
            else if (err.code === 'auth/invalid-email') setError('Невірний формат пошти.');
            else if (err.code === 'auth/weak-password') setError('Пароль має бути мін. 6 символів.');
            else setError('Помилка входу. Перевірте дані.');
        }
    };

    return (
        <div style={{ 
            display: 'flex', justifyContent: 'center', alignItems: 'center', 
            width: '100vw', height: '100vh', 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
        }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '380px', padding: '40px' }}>
                <div className="logo" style={{ justifyContent: 'center' }}>
                    <div className="logo-icon">S</div>
                    <span>Startup.OS</span>
                </div>

                <h2 style={{ textAlign: 'center', marginBottom: '25px', color: 'var(--dark)' }}>
                    {isRegistering ? 'Реєстрація' : 'Вхід'}
                </h2>

                {error && <p style={{ color: '#ef4444', textAlign: 'center', fontSize: '14px', marginBottom: '15px', fontWeight: '600' }}>{error}</p>}

                <form onSubmit={handleAuth}>
                    <div className="input-group" style={{ marginBottom: '15px' }}>
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group" style={{ marginBottom: '20px' }}>
                        <label>Пароль</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="glow-btn" style={{ marginTop: '0' }}>
                        {isRegistering ? 'Створити акаунт' : 'Увійти'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '25px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px' }} 
                   onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? 'Вже є акаунт? Увійти' : 'Немає акаунту? Реєстрація'}
                </p>
            </div>
        </div>
    );
}

export default Auth;