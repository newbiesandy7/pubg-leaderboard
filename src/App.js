import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const CURRENT_ROUND = 3; 


const TOURNAMENT_DATA = [
  { id: 1,  name: 'hatyara gang',         r1: 45, r2: 12, r3: 0, r4: 0, r5: 0 },
  { id: 2,  name: 'The Wicked Crew',      r1: 38, r2: 14, r3: 0, r4: 0, r5: 0 },
  { id: 3,  name: 'Tanke esports',        r1: 12, r2: 8,  r3: 0, r4: 0, r5: 0 },
  { id: 4,  name: 'VAMOS ESP',            r1: 29, r2: 10, r3: 0, r4: 0, r5: 0 },
  { id: 5,  name: 'Nexus Alliance',       r1: 31, r2: 9,  r3: 0, r4: 0, r5: 0 },
  { id: 6,  name: 'Innovators',           r1: 22, r2: 6,  r3: 0, r4: 0, r5: 0 },
  { id: 7,  name: 'Pani tyanki(PT)',      r1: 27, r2: 5,  r3: 0, r4: 0, r5: 0 },
  { id: 8,  name: '4brothers',            r1: 19, r2: 4,  r3: 0, r4: 0, r5: 0 },
  { id: 9,  name: 'Team apex',            r1: 8,  r2: 0,  r3: 0, r4: 0, r5: 0 },
  { id: 10, name: 'YOUNG HUSTLERS',       r1: 15, r2: 0,  r3: 0, r4: 0, r5: 0 },
  { id: 11, name: 'Genesis esports',      r1: 5,  r2: 0,  r3: 0, r4: 0, r5: 0 },
  { id: 12, name: 'A$AP',                 r1: 3,  r2: 0,  r3: 0, r4: 0, r5: 0 }
];

function App() {
  const [eliminatedTeams, setEliminatedTeams] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  
  // Track previous round to spot transitions
  const prevRoundRef = useRef(CURRENT_ROUND);

  // Helper helper functions to evaluate scores at a given round threshold
  const getSortedTeamsAtRound = (roundNum) => {
    return TOURNAMENT_DATA.map(team => {
      let totalScore = 0;
      if (roundNum >= 1) totalScore += team.r1;
      if (roundNum >= 2) totalScore += team.r2;
      if (roundNum >= 3) totalScore += team.r3;
      if (roundNum >= 4) totalScore += team.r4;
      if (roundNum >= 5) totalScore += team.r5;
      return { ...team, totalScore };
    }).sort((a, b) => b.totalScore - a.totalScore);
  };

  const currentSorted = getSortedTeamsAtRound(CURRENT_ROUND);

  // Define roster sizes per round limits
  const getLimitForRound = (roundNum) => {
    if (roundNum === 2) return 8;
    if (roundNum === 3) return 6;
    if (roundNum === 4) return 4;
    if (roundNum === 5) return 2;
    return 12;
  };

  const visibleTeams = currentSorted.slice(0, getLimitForRound(CURRENT_ROUND));

  // 🪄 Detect active transitions and find out who got knocked down the tier list
  useEffect(() => {
    if (CURRENT_ROUND > prevRoundRef.current) {
      const lastRoundSquads = getSortedTeamsAtRound(prevRoundRef.current).slice(0, getLimitForRound(prevRoundRef.current));
      const currentRoundSquads = getSortedTeamsAtRound(CURRENT_ROUND).slice(0, getLimitForRound(CURRENT_ROUND));
      
      const currentIds = currentRoundSquads.map(t => t.id);
      const knockedOut = lastRoundSquads.filter(t => !currentIds.includes(t.id));

      if (knockedOut.length > 0) {
        setEliminatedTeams(knockedOut);
        setShowPopup(true);
      }
    }
    prevRoundRef.current = CURRENT_ROUND;
  }, [CURRENT_ROUND]);

  const dynamicGridStyle = {
    gridTemplateColumns: `70px 220px repeat(${CURRENT_ROUND}, 70px) 90px`
  };

  return (
    <div className="leaderboard-wrapper">
      <header className="leaderboard-header">
        <h1>🏆 PUBG TOURNAMENT LEADERBOARD 🏆</h1>
        <div className="live-indicator">
          <span className="dot"></span> ROUND {CURRENT_ROUND} STANDINGS
        </div>
      </header>

      <main className="table-container">
        <div className="table-header-row" style={dynamicGridStyle}>
          <div className="col-rank header-text left-align">Rank</div>
          <div className="col-name header-text left-align">Squad Name</div>
          {CURRENT_ROUND >= 1 && <div className="col-round header-text">R1</div>}
          {CURRENT_ROUND >= 2 && <div className="col-round header-text">R2</div>}
          {CURRENT_ROUND >= 3 && <div className="col-round header-text">R3</div>}
          {CURRENT_ROUND >= 4 && <div className="col-round header-text">R4</div>}
          {CURRENT_ROUND >= 5 && <div className="col-round header-text">R5</div>}
          <div className="col-score header-text text-right">Total</div>
        </div>

        <div className="rows-container">
          <AnimatePresence mode="popLayout">
            {visibleTeams.map((team, index) => {
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
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ 
                    backgroundColor: "rgba(239, 68, 68, 0.4)", 
                    borderColor: "#ef4444",
                    x: [0, -10, 10, -10, 10, -50],
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.6 }
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                  className={`leaderboard-row ${podiumClass}`}
                  style={dynamicGridStyle}
                >
                  <div className="col-rank rank-num left-align">
                    {badge ? <span className="medal">{badge}</span> : `#${rank}`}
                  </div>
                  <div className="col-name team-title left-align">{team.name}</div>
                  {CURRENT_ROUND >= 1 && <div className="col-round score-cell">{team.r1}</div>}
                  {CURRENT_ROUND >= 2 && <div className="col-round score-cell">{team.r2}</div>}
                  {CURRENT_ROUND >= 3 && <div className="col-round score-cell">{team.r3}</div>}
                  {CURRENT_ROUND >= 4 && <div className="col-round score-cell">{team.r4}</div>}
                  {CURRENT_ROUND >= 5 && <div className="col-round score-cell">{team.r5}</div>}
                  <div className="col-score final-score text-right">{team.totalScore}</div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>

      {/* 🔥 THE ELIMINATION POPUP MODAL OVERLAY */}
      <AnimatePresence>
        {showPopup && (
          <div className="popup-overlay">
            <motion.div 
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { type: "spring", bounce: 0.4 } }}
              exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.3 } }}
              className="popup-box"
            >
              <div className="skull-icon">💀</div>
              <h2>SQUADS ELIMINATED</h2>
              <p>The following teams have dropped out of the battlezone:</p>
              
              <div className="eliminated-list">
                {eliminatedTeams.map(team => (
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    key={team.id} 
                    className="eliminated-item"
                  >
                    {team.name}
                  </motion.div>
                ))}
              </div>

              <button className="close-popup-btn" onClick={() => setShowPopup(false)}>
                CONTINUE TO LEADERBOARD
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;