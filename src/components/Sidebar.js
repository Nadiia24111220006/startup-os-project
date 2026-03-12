import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarChart3, Coins } from 'lucide-react'; 

function Sidebar({ user, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <aside className="sidebar">
            <div className="logo">
                <div className="logo-icon">S</div>
                <span>Startup.OS</span>
            </div>

            <nav>
                <div className={`nav-btn ${isActive('/') ? 'active-nav' : ''}`} onClick={() => navigate('/')}>
                    <Home size={18} /> Мій стартап
                </div>
                <div className={`nav-btn ${isActive('/market') ? 'active-nav' : ''}`} onClick={() => navigate('/market')}>
                    <BarChart3 size={18} /> Аналіз ринку
                </div>
                <div className={`nav-btn ${isActive('/investors') ? 'active-nav' : ''}`} onClick={() => navigate('/investors')}>
                    <Coins size={18} /> Інвестори
                </div>
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div style={{ marginLeft: '10px' }}>
                        <strong>{user?.email.split('@')[0]}</strong>
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>CEO Founder</p>
                    </div>
                </div>
                <button onClick={onLogout} className="pitch-btn" style={{marginTop: '15px', width: '100%'}}>Вийти</button>
            </div>
        </aside>
    );
}
export default Sidebar;