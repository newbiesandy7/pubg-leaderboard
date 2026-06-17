import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// ==========================================
// 🛠️ ADMIN PANEL: UPDATE MATCH STATS HERE
// ==========================================
const TOURNAMENT_DATA = [
  { id: 1,  name: 'Hatyara gang',         WWCD: 45, MATCHES: 12, PLACEMENT: 20, ELIM_POINT: 0 },
  { id: 2,  name: 'The Wicked Crew',      WWCD: 15, MATCHES: 12, PLACEMENT: 18, ELIM_POINT: 10 },
  { id: 3,  name: 'Tanke eSports',        WWCD: 15,  MATCHES: 7,  PLACEMENT: 9,  ELIM_POINT: 0 },
  { id: 4,  name: 'VAMOS ESP',            WWCD: 10,  MATCHES: 8,  PLACEMENT: 8,  ELIM_POINT: 20 },
  { id: 5,  name: 'Nexus Alliance',       WWCD: 0,  MATCHES: 0,  PLACEMENT: 0,  ELIM_POINT: 0 },
  { id: 6,  name: 'Innovators',           WWCD: 0,  MATCHES: 0,  PLACEMENT: 0,  ELIM_POINT: 0 },
  { id: 7,  name: 'Pani Ayanki(PT)',      WWCD: 0,  MATCHES: 0,  PLACEMENT: 0,  ELIM_POINT: 0 },
  { id: 8,  name: '4brothers',            WWCD: 0,  MATCHES: 0,  PLACEMENT: 0,  ELIM_POINT: 0 },
  { id: 9,  name: 'Team Apex',            WWCD: 0,  MATCHES: 0,  PLACEMENT: 0,  ELIM_POINT: 0 },
  { id: 10, name: 'YOUNG HUSTLERS',       WWCD: 0,  MATCHES: 0,  PLACEMENT: 0,  ELIM_POINT: 0 },
  { id: 11, name: 'Genesis eSports',      WWCD: 0,  MATCHES: 0,  PLACEMENT: 0,  ELIM_POINT: 0 },
  { id: 12, name: 'A$AP',                 WWCD: 0,  MATCHES: 0,  PLACEMENT: 0,  ELIM_POINT: 0 }
];

function App() {
  
  // 🪄 THE UPDATE: Placements + Kill Points + WWCD Bonus Points = Total
  const processedData = TOURNAMENT_DATA.map(team => ({
    ...team,
    totalPoints: team.PLACEMENT + team.ELIM_POINT + team.WWCD
  })).sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="leaderboard-wrapper">
      <header className="leaderboard-header">
        <h1>🏆 PUBG TOURNAMENT LEADERBOARD 🏆</h1>
        <div className="live-indicator">
          <span className="dot"></span> OVERALL STANDINGS
        </div>
      </header>

      <main className="table-container">
        <div className="table-header-row stats-grid">
          <div className="col-rank header-text left-align">Rank</div>
          <div className="col-name header-text left-align">Squad Name</div>
          <div className="col-stat header-text">Matches</div>
          <div className="col-stat header-text" style={{ color: '#f39c12' }}>WWCD</div>
          <div className="col-stat header-text">Place Pts</div>
          <div className="col-stat header-text">Elim Pts</div>
          <div className="col-score header-text text-right">Total Pts</div>
        </div>

        <div className="rows-container">
          <AnimatePresence>
            {processedData.map((team, index) => {
              const rank = index + 1;
              let podiumClass = "regular-row";
              let badge = "";
              if (rank === 1) { podiumClass = "rank-1"; badge = "🥇"; }
              if (rank === 2) { podiumClass = "rank-2"; badge = "🥈"; }
              if (rank === 3) { podiumClass = "rank-3"; badge = "🥉"; }

              return (
                <motion.div
                  key={team.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  className={`leaderboard-row stats-grid ${podiumClass}`}
                >
                  <div className="col-rank rank-num left-align">
                    {badge ? <span className="medal">{badge}</span> : `#${rank}`}
                  </div>
                  
                  <div className="col-name team-title left-align">{team.name}</div>
                  
                  <div className="col-stat stat-cell">{team.MATCHES}</div>
                  <div className="col-stat stat-cell wwcd-count">{team.WWCD}</div>
                  <div className="col-stat stat-cell">{team.PLACEMENT}</div>
                  <div className="col-stat stat-cell">{team.ELIM_POINT}</div>
                  
                  <div className="col-score final-score text-right">{team.totalPoints}</div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;