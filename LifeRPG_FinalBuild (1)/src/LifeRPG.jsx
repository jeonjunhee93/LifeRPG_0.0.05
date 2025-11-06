// LifeRPG.jsx
import React, { useState, useEffect } from 'react';
import './index.css';

// 초기 장비 슬롯
const initialEquipment = {
  helmet: null,
  armor: null,
  weapon: null,
};

// 초기 스탯
const initialStats = { strength: 0, intelligence: 0, luck: 0 };

// 인벤토리 데이터
const equipmentData = [
  {
    name: 'Dark Moon Sword',
    type: 'weapon',
    src: '/item/파멸의검_에픽.png',
    stats: { strength: 5, intelligence: 0, luck: 1 },
  },
  {
    name: 'Knight Helmet',
    type: 'helmet',
    src: '/item/용기의 투구.png',
    stats: { strength: 0, intelligence: 3, luck: 0 },
  },
  {
    name: 'Steel Armor',
    type: 'armor',
    src: '/item/기사단 정예 갑주.png',
    stats: { strength: 4, intelligence: 0, luck: 0 },
  },
];

// 퀘스트 데이터
const questData = [
  {
    id: 1,
    name: '집 청소하기',
    difficulty: '★☆☆ (쉬움)',
    rewardXp: 50,
    rewardGold: 30,
    color: '#b3ffb3',
  },
  {
    id: 2,
    name: '하루 업무 처리',
    difficulty: '★★☆ (보통)',
    rewardXp: 80,
    rewardGold: 50,
    color: '#fff4b3',
  },
  {
    id: 3,
    name: '운동 30분 하기',
    difficulty: '★★★ (어려움)',
    rewardXp: 120,
    rewardGold: 80,
    color: '#ffb3b3',
  },
];

function LifeRPG() {
  const [xp, setXp] = useState(100);
  const [gold, setGold] = useState(50);
  const [stats, setStats] = useState(initialStats);
  const [inventory, setInventory] = useState(equipmentData);
  const [equipped, setEquipped] = useState(initialEquipment);

  // 퀘스트 보상 기록
  const [questLog, setQuestLog] = useState(() => {
    const saved = localStorage.getItem('questLog');
    return saved ? JSON.parse(saved) : {};
  });

  // 자정에 퀘스트 초기화
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        localStorage.removeItem('questLog');
        setQuestLog({});
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // 장비 장착/해제
  const handleEquip = (item) => {
    setEquipped((prev) => {
      const newEquipped = { ...prev };
      if (prev[item.type]?.name === item.name) {
        newEquipped[item.type] = null;
      } else {
        newEquipped[item.type] = item;
      }

      const newStats = { strength: 0, intelligence: 0, luck: 0 };
      Object.values(newEquipped).forEach((eq) => {
        if (eq?.stats) {
          newStats.strength += eq.stats.strength || 0;
          newStats.intelligence += eq.stats.intelligence || 0;
          newStats.luck += eq.stats.luck || 0;
        }
      });

      setStats(newStats);
      return newEquipped;
    });
  };

  // 퀘스트 하루 1회 제한
  const handleQuestReward = (quest) => {
    const today = new Date().toISOString().split('T')[0];
    if (questLog[quest.id] === today) {
      alert(`"${quest.name}" 퀘스트는 오늘 이미 완료했습니다!`);
      return;
    }

    setXp((prev) => prev + quest.rewardXp);
    setGold((prev) => prev + quest.rewardGold);

    const updatedLog = { ...questLog, [quest.id]: today };
    setQuestLog(updatedLog);
    localStorage.setItem('questLog', JSON.stringify(updatedLog));

    alert(
      `${quest.name} 완료!\n보상: +${quest.rewardXp} XP / +${quest.rewardGold} Gold 🎉`
    );
  };

  return (
    <div className="game-container">
      {/* 캐릭터 패널 */}
      <div className="character-panel">
        <h1>Life R.P.G</h1>
        <p>경험치: {xp}</p>
        <p>골드: {gold}</p>
        <p>
          힘: {stats.strength} / 지능: {stats.intelligence} / 운: {stats.luck}
        </p>

        {/* ✅ 실루엣 경로 수정 */}
        <div className="silhouette-wrapper">
          <img src="/silhouette.png" alt="silhouette" className="silhouette" />

          {/* 장착된 장비 자동 위치 */}
          {equipped.helmet && (
            <img src={equipped.helmet.src} alt="helmet" className="helmet-slot" />
          )}
          {equipped.armor && (
            <img src={equipped.armor.src} alt="armor" className="armor-slot" />
          )}
          {equipped.weapon && (
            <img src={equipped.weapon.src} alt="weapon" className="weapon-slot" />
          )}
        </div>
      </div>

      {/* 퀘스트 + 인벤토리 */}
      <div className="quest-inventory-panel">
        <h2>퀘스트</h2>

        {questData.map((quest) => {
          const today = new Date().toISOString().split('T')[0];
          const completedToday = questLog[quest.id] === today;
          return (
            <div
              key={quest.id}
              style={{
                marginBottom: '10px',
                padding: '10px',
                border: '1px solid #aaa',
                borderRadius: '10px',
                backgroundColor: completedToday ? '#d3ffd3' : quest.color,
                boxShadow: '0 0 5px rgba(0,0,0,0.1)',
              }}
            >
              <strong>{quest.name}</strong>
              <p>난이도: {quest.difficulty}</p>
              <p>
                🎯 보상: <span style={{ color: '#008000' }}>XP +{quest.rewardXp}</span> /{' '}
                <span style={{ color: '#DAA520' }}>Gold +{quest.rewardGold}</span>
              </p>
              <button
                onClick={() => handleQuestReward(quest)}
                disabled={completedToday}
                style={{
                  padding: '6px 12px',
                  backgroundColor: completedToday ? '#aaa' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: completedToday ? 'not-allowed' : 'pointer',
                }}
              >
                {completedToday ? '오늘 완료됨' : '보상 받기'}
              </button>
            </div>
          );
        })}

        <h2>인벤토리</h2>
        <p>더블클릭으로 장착 / 해제 가능</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {inventory.map((item, index) => (
            <img
              key={index}
              src={item.src}
              alt={item.name}
              title={`${item.name} (힘 +${item.stats.strength}, 지능 +${item.stats.intelligence}, 운 +${item.stats.luck})`}
              style={{
                width: '50px',
                height: '50px',
                cursor: 'pointer',
                border:
                  equipped[item.type]?.name === item.name
                    ? '2px solid gold'
                    : '1px solid #ccc',
                borderRadius: '8px',
                padding: '2px',
                backgroundColor: '#f9f9f9',
              }}
              onDoubleClick={() => handleEquip(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LifeRPG;
