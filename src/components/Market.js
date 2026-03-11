import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
// Імпортуємо контурні іконки для категорій
import { LayoutGrid, Brain, CreditCard, Layout } from 'lucide-react';

function Market() {
    const [marketInsights, setMarketInsights] = useState([]);
    const [filter, setFilter] = useState('Bci');

    useEffect(() => {
        const fetchMarkets = async () => {
            const querySnapshot = await getDocs(collection(db, "markets"));
            setMarketInsights(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchMarkets();
    }, []);

    const filteredItems = marketInsights.filter(item => filter === 'Bci' || item.tag === filter);

    return (
        <section className="tab-panel" style={{ display: 'block', padding: '20px' }}>
            <h2 className="section-title">Аналіз ринку</h2>
            
            {/* 1. Трішки відступу (margin-top) між заголовком і кнопками */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px', marginBottom: '25px' }}>
                {/* 2. Кнопки з контурними іконками */}
                {[
                    {id: 'Bci', icon: <LayoutGrid size={16}/>},
                    {id: 'AI', icon: <Brain size={16}/>},
                    {id: 'Fintech', icon: <CreditCard size={16}/>},
                    {id: 'SaaS', icon: <Layout size={16}/>}
                ].map(cat => (
                    <button 
                        key={cat.id}
                        onClick={() => setFilter(cat.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '13px',
                            background: filter === cat.id ? '#6366f1' : '#f1f5f9',
                            color: filter === cat.id ? '#fff' : '#64748b',
                            transition: '0.3s'
                        }}
                    >
                        {cat.icon} {cat.id}
                    </button>
                ))}
            </div>

            <div className="market-cards-container">
                {filteredItems.map((item) => (
                    <div key={item.id} className="market-item">
                        {/* 3. Картинка знову прямокутна (стандартна) */}
                        <img src={item.img} alt={item.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                        <div className="market-info">
                            <span className="m-tag blue">{item.tag}</span>
                            <h4>{item.title}</h4>
                            <p>{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
export default Market;