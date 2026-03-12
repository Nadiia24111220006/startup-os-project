import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
// Додаємо іконки Lucide
import { Home, BarChart3, Coins } from 'lucide-react'; 

import './App.css'; 

import Dashboard from './components/Dashboard';
import Market from './components/Market';
import Investors from './components/Investors';
import Auth from './components/Auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="app-container">
      <input type="radio" name="nav" id="nav-create" defaultChecked />
      <input type="radio" name="nav" id="nav-market" />
      <input type="radio" name="nav" id="nav-investors" />

      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">S</div>
          <span>Startup.OS</span>
        </div>
        
        <nav>
          <label htmlFor="nav-create" className="nav-btn">
            <Home size={18} style={{marginRight: '10px'}} /> Мій стартап
          </label>
          <label htmlFor="nav-market" className="nav-btn">
            <BarChart3 size={18} style={{marginRight: '10px'}} /> Аналіз ринку
          </label>
          <label htmlFor="nav-investors" className="nav-btn">
            <Coins size={18} style={{marginRight: '10px'}} /> Інвестори
          </label>
        </nav>
        
        <div className="sidebar-footer">
            <div className="user-info">
               <div style={{paddingLeft: '5px'}}>
                 <strong style={{fontSize: '14px'}}>{user.email.split('@')[0]}</strong>
                 <p style={{fontSize: '10px', color: '#64748b'}}>CEO Founder</p>
               </div>
            </div>
            <button onClick={() => signOut(auth)} className="pitch-btn" style={{marginTop: '15px', width: '100%'}}>Вийти</button>
        </div>
      </aside>

      <main className="main-content">
        <div id="panel-create" className="tab-panel">
          <Dashboard />
        </div>
        
        <div id="panel-market" className="tab-panel">
          {/* У Market.js відступ між заголовком і кнопками */}
          <Market />
        </div>

        <div id="panel-investors" className="tab-panel">
          <Investors />
        </div>
      </main>
    </div>
  );
}

export default App;