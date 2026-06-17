import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const THEME_CONFIG = 'dark'; 

const TOURNAMENT_DATA = [
  { id: 1,  name: 'Hatyara gang',         WWCD: 45, MATCHES: 12, PLACEMENT: 20, ELIM_POINT: 0 },
  { id: 2,  name: 'The Wicked Crew',      WWCD: 15, MATCHES: 12, PLACEMENT: 18, ELIM_POINT: 10 },
  { id: 3,  name: 'Tanke eSports',        WWCD: 100,  MATCHES: 0,  PLACEMENT: 99,  ELIM_POINT: 0 },
  { id: 4,  name: 'VAMOS ESP',            WWCD: 0,  MATCHES: 0,  PLACEMENT: 100,  ELIM_POINT: 0 },
  { id: 5,  name: 'Nexus Alliance',       WWCD: 0,  MATCHES: 0,  PLACEMENT: 0,  ELIM_POINT: 0 },
  { id: 6,  name: 'Innovators',           WWCD: 0,  MATCHES: 0,  PLACEMENT: 0,  ELIM_POINT: 0 },
  { id: 7,  name: 'Pani Tyanki(PT)',      WWCD: 0,  MATCHES: 0,  PLACEMENT: 0,  ELIM_POINT: 0 },
  { id: 8,  name: '4brothers',            WWCD: 0,  MATCHES: 0,  PLACEMENT: 0,  ELIM_POINT: 0 },
  { id: 9,  name: 'Team Apex',            WWCD: 0,  MATCHES: 0,  PLACEMENT: 0,  ELIM_POINT: 0 },
  { id: 10, name: 'YOUNG HUSTLERS',       WWCD: 0,  MATCHES: 0,  PLACEMENT: 0,  ELIM_POINT: 0 },
  { id: 11, name: 'Genesis eSports',      WWCD: 0,  MATCHES: 0,  PLACEMENT: 0,  ELIM_POINT: 0 },
  { id: 12, name: 'A$AP',                 WWCD: 0,  MATCHES: 0,  PLACEMENT: 0,  ELIM_POINT: 0 }
];

function App() {
 
  const processedData = TOURNAMENT_DATA.map(team => ({
    ...team,
    totalPoints: team.PLACEMENT + team.ELIM_POINT 
  })).sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className={`app-container ${THEME_CONFIG}-theme`}>
      <div className="leaderboard-wrapper">
        
        <header className="leaderboard-header">
          <h1>🏆 PUBG MOBILE TOURNAMENT  🏆</h1>
          <div className="live-indicator">
            <span className="dot"></span> LEADERBOARD LIVE
          </div>
        </header>

        <main className="table-container">
          <div className="table-header-row stats-grid">
            <div className="col-rank header-text">Rank</div>
            <div className="col-name header-text">Squad Name</div>
            <div className="col-stat header-text">Matches</div>
            <div className="col-stat header-text wwcd-header">WWCD</div>
            <div className="col-stat header-text">Place Pts</div>
            <div className="col-stat header-text">Elim Pts</div>
            <div className="col-score header-text">Total Pts</div>
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
                    <div className="col-rank rank-num">
                      {badge ? <span className="medal">{badge}</span> : `#${rank}`}
                    </div>
                    
                    <div className="col-name team-title">{team.name}</div>
                    
                    <div className="col-stat stat-cell">{team.MATCHES}</div>
                    <div className="col-stat stat-cell ">{team.WWCD}</div>
                    <div className="col-stat stat-cell">{team.PLACEMENT}</div>
                    <div className="col-stat stat-cell">{team.ELIM_POINT}</div>
                    
                    <div className="col-score final-score">{team.totalPoints}</div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;