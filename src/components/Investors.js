import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
// Додаємо іконки галочки та відправки
import { CircleDollarSign, CheckCircle2, SendHorizontal } from 'lucide-react';

function Investors() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  // Стан для відстеження відправлених пітчів
  const [sentPitches, setSentPitches] = useState([]);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "investors"));
        setInvestors(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      } catch (error) {
        console.error("Помилка завантаження:", error);
      }
    };
    fetchInvestors();
  }, []);

  const handleSendPitch = async (investorName) => {
    try {
      // 1. Записуємо в Firebase (Завдання 2.3)
      await addDoc(collection(db, "pitches"), {
        investor: investorName,
        status: "Sent",
        timestamp: new Date()
      });

      // 2. Оновлюємо інтерфейс (робимо кнопку зеленою)
      setSentPitches(prev => [...prev, investorName]);
      
    } catch (e) {
      alert("Помилка при відправці");
    }
  };

  if (loading) return <p style={{padding: '20px'}}>Завантаження інвесторів...</p>;

  return (
    <section className="tab-panel" style={{ display: 'block', padding: '20px' }}>
      <h2 className="section-title">Доступні інвестори</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {investors.map((inv) => {
          const isSent = sentPitches.includes(inv.name);
          
          return (
            <div key={inv.id} style={{ 
              background: '#fff', 
              padding: '25px', 
              borderRadius: '16px', 
              border: '1px solid #f1f5f9', 
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: isSent ? '#dcfce7' : '#f8fafc', 
                borderRadius: '50%', 
                margin: '0 auto 15px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                transition: '0.3s'
              }}>
                {isSent ? 
                  <CheckCircle2 size={28} color="#22c55e" /> : 
                  <CircleDollarSign size={28} color="#6366f1" />
                }
              </div>

              <h4 style={{ marginBottom: '5px', color: '#1e293b' }}>{inv.name}</h4>
              <p style={{ color: '#6366f1', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>{inv.type}</p>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Чек: <strong>{inv.amount}</strong></p>
              
              <button 
                onClick={() => handleSendPitch(inv.name)}
                disabled={isSent}
                style={{ 
                  width: '100%', 
                  marginTop: '20px', 
                  padding: '12px', 
                  borderRadius: '10px', 
                  border: 'none', 
                  // Якщо відправлено — зелена, якщо ні — темно-синя
                  background: isSent ? '#22c55e' : '#1e293b', 
                  color: '#fff', 
                  fontWeight: '600',
                  cursor: isSent ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: '0.3s'
                }}
              >
                {isSent ? (
                  <>Відправлено</>
                ) : (
                  <><SendHorizontal size={16} /> Надіслати Pitch</>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Investors;