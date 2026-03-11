import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { Target, Send, Cloud } from 'lucide-react'; 

function Dashboard() {
  // --- СТАН (STATE) ---
  const [staff, setStaff] = useState(24);
  const [projectName, setProjectName] = useState("FutureMind AI");
  const [domain, setDomain] = useState("Deep Tech / AI");
  const [reportData, setReportData] = useState(null);
  const [isDescVisible, setIsDescVisible] = useState(true);
  const [goal, setGoal] = useState("");
  const [loadingGoal, setLoadingGoal] = useState(false);

  const oldRevenue = 68200;
  const oldExpenses = 42000;
  const oldStaff = 24;

  useEffect(() => {
    const fetchFromNode = async () => {
      try {
        const response = await fetch('https://startup-backend-nadiia.onrender.com/api/startup');
        if (response.ok) {
          const data = await response.json();
          setProjectName(data.name);
          setDomain(data.domain);
          setStaff(data.staff);
        }
      } catch (error) {
        console.log("Сервер Node.js вимкнений, працюємо локально");
      }
    };
    fetchFromNode();
  }, []);

  const saveStartupToServer = async () => {
    try {
      const response = await fetch('https://startup-backend-nadiia.onrender.com/api/startup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName,
          domain: domain,
          staff: Number(staff)
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Успіх ЛР5: " + result.message);
      } else {
        alert("Помилка валідації сервера: " + result.error);
      }
    } catch (error) {
      alert("Помилка: Перевір, чи запущений сервер (node server.js)");
    }
  };

  const handleSimulate = (e) => {
    e.preventDefault();
    if (projectName.trim() === "") { alert("Введіть назву!"); return; }
    const newRevenue = oldRevenue + (staff - oldStaff) * 800;
    const newExpenses = oldExpenses + (staff - oldStaff) * 600;
    const newProfit = newRevenue - newExpenses;
    setReportData({
      newRevenue, newExpenses, newProfit,
      growth: Math.round(((newRevenue - oldRevenue) / oldRevenue) * 100)
    });
  };

  const saveGoalToFirebase = async () => {
    if (!goal) return;
    setLoadingGoal(true);
    try {
      await addDoc(collection(db, "goals"), {
        project: projectName,
        goalText: goal,
        createdAt: new Date()
      });
      alert("Ціль збережена в Firestore!");
      setGoal("");
    } catch (e) { console.error("Помилка запису:", e); }
    setLoadingGoal(false);
  };

  const getStatus = () => {
    if (!reportData) return { text: "В розробці", bg: "#f1f5f9", color: "#64748b" };
    const p = reportData.newProfit;
    if (p > 35000) return { text: "Активне зростання", bg: "#dcfce7", color: "#166534" };
    if (p < 25000) return { text: "Потребує інвестицій", bg: "#fee2e2", color: "#991b1b" };
    return { text: "Стабільність", bg: "#fef3c7", color: "#92400e" };
  };

  const status = getStatus();

  return (
    <section className="tab-panel" style={{display: 'block'}}>
      {/* HERO SECTION */}
      <div className="premium-hero">
        <div className="hero-content">
          <span className="badge" style={{background: status.bg, color: status.color}}>{status.text}</span>
          <h1>Вітаємо! ✨</h1>
          {isDescVisible && <p>Сьогодні ідеальний день, щоб змінити правила гри на ринку.</p>}
          <button className="pitch-btn" style={{marginTop: '15px'}} onClick={() => setIsDescVisible(!isDescVisible)}>
            {isDescVisible ? "Сховати опис" : "Показати опис"}
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* MAIN FORM */}
        <div className="glass-card main-form">
          <div className="card-header">
            <h3><i className="fa-solid fa-sliders"></i> Конфігурація системи</h3>
          </div>
          <form onSubmit={handleSimulate}>
            <div className="input-grid">
              <div className="input-group">
                <label>Назва проєкту</label>
                <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Домен</label>
                <select value={domain} onChange={(e) => setDomain(e.target.value)}>
                  <option>Deep Tech / AI</option>
                  <option>Fintech Solutions</option>
                  <option>SaaS Enterprise</option>
                </select>
              </div>
            </div>
            <div className="range-container">
              <div className="range-info"><label>Штат працівників</label><span>{staff} осіб</span></div>
              <input type="range" className="modern-range" min="1" max="100" value={staff} onChange={(e) => setStaff(e.target.value)} />
            </div>
            
            <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
              <button type="submit" className="glow-btn" style={{flex: 2}}>Моделювати бізнес-процес</button>
              <button type="button" onClick={saveStartupToServer} className="glow-btn" style={{flex: 1, background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                <Cloud size={16} /> Сервер
              </button>
            </div>
          </form>

          {/* REPORT & CHART */}
          {reportData && (
            <div id="dynamic-report" style={{marginTop: '25px', padding: '20px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px'}}>
              <h4 style={{marginBottom: '15px'}}>Звіт: {projectName} ({domain})</h4>
              <table style={{width:'100%', borderCollapse:'collapse', textAlign: 'left'}}>
                <thead>
                  <tr style={{borderBottom:'1px solid #ddd'}}>
                    <th style={{padding: '10px'}}>Параметр</th>
                    <th style={{padding: '10px'}}>Реальний</th>
                    <th style={{padding: '10px'}}>Модель</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{padding: '8px'}}>Штат (осіб)</td><td>{oldStaff}</td><td>{staff}</td></tr>
                  <tr><td style={{padding: '8px'}}>Витрати</td><td>${oldExpenses.toLocaleString()}</td><td style={{color:'#e11d48'}}>${reportData.newExpenses.toLocaleString()}</td></tr>
                  <tr><td style={{padding: '8px'}}>Дохід (Gross)</td><td>${oldRevenue.toLocaleString()}</td><td style={{color:'#059669'}}>${reportData.newRevenue.toLocaleString()}</td></tr>
                  <tr style={{fontWeight:'bold', background:'#f8fafc'}}>
                    <td style={{padding: '10px'}}>Чистий прибуток</td><td>$26,200</td><td style={{color:'#6366f1'}}>${reportData.newProfit.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{marginTop: '30px'}}>
                <div style={{display:'flex', alignItems:'flex-end', gap:'35px', height:'120px', borderBottom:'2px solid #e2e8f0', paddingBottom: '5px'}}>
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'8px'}}>
                    <span style={{fontSize:'12px', fontWeight:'bold', color:'#64748b'}}>100%</span>
                    <div style={{width:'45px', height:'60px', background:'#cbd5e1', borderRadius:'6px'}}></div>
                    <span style={{fontSize:'10px', color:'#94a3b8', textTransform:'uppercase', fontWeight: 'bold'}}>ПОТОЧНИЙ</span>
                  </div>
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'8px'}}>
                    <span style={{fontSize:'12px', fontWeight:'bold', color:'#6366f1'}}>+{reportData.growth}%</span>
                    <div style={{width:'45px', height:`${Math.min((reportData.newRevenue / oldRevenue) * 60, 110)}px`, background:'#6366f1', borderRadius:'6px', transition:'0.5s', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'}}></div>
                    <span style={{fontSize:'10px', color:'#6366f1', fontWeight:'bold', textTransform:'uppercase'}}>ПРОГНОЗ</span>
                  </div>
                </div>
                <p style={{fontSize: '11px', color: '#94a3b8', marginTop: '15px'}}>* Аналіз базується на ефективності штату {staff} осіб та ринкових коефіцієнтах 2026 року.</p>
              </div>
            </div>
          )}
        </div>

        {/* SIDE STATS */}
        <div className="side-stats">
          <div className="stat-box profit">
            <div className="stat-icon"><i className="fa-solid fa-arrow-trend-up"></i></div>
            <div className="stat-data">
              <small>Чистий дохід (MRR)</small>
              <strong>${reportData ? reportData.newProfit.toLocaleString() : "26,200"}</strong>
            </div>
          </div>

          <div className="stat-box expense" style={{marginTop: '15px'}}>
            <div className="stat-icon"><i className="fa-solid fa-fire-flame-curved"></i></div>
            <div className="stat-card">
               <p style={{fontSize: '13px', color: '#64748b', fontWeight: '700', margin: 0}}>Витрати</p>
               <h3 style={{fontSize: '24px', fontWeight: '800', margin: 0}}>
                  ${reportData ? reportData.newExpenses.toLocaleString() : "42,000"}
               </h3> 
            </div>
          </div>

          {/* GOAL BOX */}
          <div className="stat-box" style={{marginTop: '20px', background: '#fff', border: '1px solid #e2e8f0', display: 'block', padding: '15px', borderRadius: '16px'}}>
             <h4 style={{fontSize: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700'}}>
               <Target size={16} color="#6366f1" /> Ціль проекту
             </h4>
             <input 
               type="text" 
               placeholder="Яка мета сьогодні?" 
               value={goal}
               onChange={(e) => setGoal(e.target.value)}
               style={{width: '100%', padding: '10px', border: '1px solid #f1f5f9', borderRadius: '8px', fontSize: '12px', marginBottom: '10px'}}
             />
             <button 
               onClick={saveGoalToFirebase}
               style={{width: '100%', background: '#1e293b', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '600'}}
             >
               <Send size={14} /> {loadingGoal ? "Запис..." : "Зберегти ціль у БД"}
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;