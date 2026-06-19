import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const THEME_CONFIG = 'dark';

function getSorted(teams) {
  return teams.map(t => ({ ...t, totalPoints: t.PLACEMENT + t.ELIM_POINT }))
    .sort((a, b) => b.totalPoints - a.totalPoints || a.id - b.id);
}

function App() {
  const [data, setData] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [rankChangedIds, setRankChangedIds] = useState(new Set());
  const prevRanksRef = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/tournament-data.json?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        if (response.ok) {
          const jsonData = await response.json();
          const teams = jsonData.teams || jsonData;
          setRoomId(jsonData.roomId || '');
          setPassword(jsonData.password || '');
          const newSorted = getSorted(teams);
          const newRanks = {};
          newSorted.forEach((t, i) => { newRanks[t.id] = i + 1; });

          const moved = new Set();
          Object.keys(newRanks).forEach(id => {
            const numId = Number(id);
            if (prevRanksRef.current[numId] !== undefined && prevRanksRef.current[numId] !== newRanks[numId]) {
              moved.add(numId);
            }
          });

          if (moved.size > 0) {
            setRankChangedIds(moved);
            setTimeout(() => setRankChangedIds(new Set()), 2000);
          }

          prevRanksRef.current = newRanks;
          setData(teams);
        }
      } catch (error) {
        console.error('Error fetching tournament data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);


  const RANK_MESSAGES = {
    'First': 'Winner Winner Chicken Dinner',
    'Second': 'First Runner-up',
    'Third': 'Second Runner-up',
  };

  const RANK_BADGE = { 'First': '🥇', 'Second': '🥈', 'Third': '🥉' };
  const RANK_CLASS = { 'First': 'celebrate-gold', 'Second': 'celebrate-silver', 'Third': 'celebrate-bronze' };

  const processedData = getSorted(data);
  const winners = processedData.filter(t => RANK_MESSAGES[t.rank]);
  const others = processedData.filter(t => !RANK_MESSAGES[t.rank]);

  return (
    <div className={`app-container ${THEME_CONFIG}-theme`}>
      <div className="leaderboard-wrapper">

        <header className="leaderboard-header">
          <h1>🏆 PUBG MOBILE TOURNAMENT  🏆</h1>
          <div className="live-indicator">
            <span className="dot"></span> LIVE LEADERBOARD
          </div>
        </header>

        <main className="table-container">
          <AnimatePresence mode="wait">
            {roomId ? (
              <motion.div
                key="room-id"
                className="room-id-overlay"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="room-id-bg"></div>
                <div className="room-id-content">
                  <div className="room-info-group">
                    <span className="room-id-label">ROOM ID</span>
                    <span className="room-id-value">{roomId}</span>
                  </div>
                  {password && (
                    <div className="room-info-group">
                      <span className="room-id-label">PASSWORD</span>
                      <span className="room-id-value">{password}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {winners.length > 0 && (
                  <div className="winners-section">
                    {winners.map(team => (
                      <div key={team.id} className={`celebrate-card ${RANK_CLASS[team.rank]}`}>
                        <div className="celebrate-bg"></div>
                        <div className="celebrate-content">
                          <span className="celebrate-badge">{RANK_BADGE[team.rank]}</span>
                          <span className="celebrate-name">{team.name}</span>
                          <span className="celebrate-points">{team.totalPoints} PTS</span>
                          <span className="celebrate-message">{RANK_MESSAGES[team.rank]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="rows-grid">
                  <AnimatePresence>
                    {others.map((team) => {
                      const rank = processedData.indexOf(team) + 1;
                      const hasPoints = team.totalPoints > 0;
                      const hasMoved = rankChangedIds.has(team.id);
                      const isEliminated = team.rank === 'Eliminated';
                      return (
                        <motion.div
                          key={team.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            layout: { type: "spring", stiffness: 80, damping: 18, mass: 1.2 },
                            opacity: { duration: 0.4 },
                          }}
                          className={`leaderboard-row regular-row ${rank <= 3 ? `rank-${rank}` : ''} ${hasMoved ? 'row-moved' : ''} ${isEliminated ? 'row-eliminated' : ''}`}
                        >
                          <div className="row-content">
                            <div className={`team-card ${isEliminated ? 'eliminated-card' : ''}`}>
                              <div className="card-top">
                                <span className="card-rank">{`#${rank}`}</span>
                                <span className="card-name-group">
                                  <span className="card-name">{team.name}</span>
                                  {isEliminated && <span className="eliminated-tag">Eliminated</span>}
                                </span>
                                <span className="card-total">{hasPoints ? team.totalPoints : 0}</span>
                              </div>
                              <div className="card-stats">
                                <div className="card-stat"><span className="card-label">Match</span><span className="card-value">{team.MATCHES}</span></div>
                                <div className="card-stat"><span className="card-label">WWCD</span><span className="card-value">{team.WWCD}</span></div>
                                <div className="card-stat"><span className="card-label">Place</span><span className="card-value">{team.PLACEMENT}</span></div>
                                <div className="card-stat"><span className="card-label">Elim</span><span className="card-value">{team.ELIM_POINT}</span></div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;