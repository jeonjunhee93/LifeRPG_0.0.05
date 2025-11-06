import React, { useState, useEffect } from 'react';
import './index.css';

// =========================
// 초기 장비 / 스탯 / 데이터
// =========================
const initialEquipment = { helmet: null, armor: null, weapon: null };
const initialStats = { strength: 0, intelligence: 0, luck: 0 };

const equipmentData = [
  { name: 'Dark Moon Sword', type: 'weapon', src: '/item/파멸의검_에픽.png', stats: { strength: 5, intelligence: 0, luck: 1 } },
  { name: 'Knight Helmet', type: 'helmet', src: '/item/용기의 투구.png', stats: { strength: 0, intelligence: 3, luck: 0 } },
  { name: 'Steel Armor', type: 'armor', src: '/item/기사단 정예 갑주.png', stats: { strength: 4, intelligence: 0, luck: 0 } },
];

const questData = [
  { id: 1, name: '집 청소하기', rewardXp: 50, rewardGold: 30, difficulty: '★☆☆ (쉬움)' },
  { id: 2, name: '하루 업무 처리', rewardXp: 80, rewardGold: 50, difficulty: '★★☆ (보통)' },
  { id: 3, name: '운동 30분 하기', rewardXp: 120, rewardGold: 80, difficulty: '★★★ (어려움)' },
];

// =========================
// 메인 컴포넌트
// =========================
function LifeRPG() {
  const [playerId, setPlayerId] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const [xp, setXp] = useState(0);
  const [gold, setGold] = useState(0);
  const [stats, setStats] = useState(initialStats);
  const [inventory, setInventory] = useState(equipmentData);
  const [equipped, setEquipped] = useState(initialEquipment);
  const [questLog, setQuestLog] = useState({});

  // =========================
  // 로그인 및 데이터 로드
  // =========================
  const handleLogin = () => {
    if (!playerId.trim()) return alert('아이디를 입력하세요!');
    const saved = localStorage.getItem(`LifeRPG_${playerId}`);
    if (saved) {
      const data = JSON.parse(saved);
      setXp(data.xp || 0);
      setGold(data.gold || 0);
      setStats(data.stats || initialStats);
      setEquipped(data.equipped || initialEquipment);
      setQuestLog(data.questLog || {});
      alert(`"${playerId}"의 데이터를 불러왔습니다!`);
    } else {
      alert(`새로운 캐릭터 "${playerId}" 생성!`);
    }
    setLoggedIn(true);
  };

  // =========================
  // 데이터 자동 저장
  // =========================
  useEffect(() => {
    if (loggedIn) {
      const saveData = { xp, gold, stats, equipped, questLog };
      localStorage.setItem(`LifeRPG_${playerId}`, JSON.stringify(saveData));
    }
  }, [xp, gold, stats, equipped, questLog, loggedIn]);

  // =========================
  // 자정 초기화 (퀘스트 리셋)
  // =========================
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setQuestLog({});
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // =========================
  // 장비 장착 / 해제
  // =========================
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

  // =========================
  // 퀘스트 보상 (하루 1회 제한)
  // =========================
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

    alert(`"${quest.name}" 완료!\n보상: XP +${quest.rewardXp} / Gold +${quest.rewardGold}`);
  };

  // =========================
  // 로그아웃
  // =========================
  const handleLogout = () => {
    setPlayerId('');
    setLoggedIn(false);
  };

  // =========================
  // 로그인 화면
  // =========================
  if (!loggedIn) {
    return (
      <div className="login-screen">
        <h2>Life R.P.G</h2>
        <input
          type="text"
          placeholder="아이디 입력"
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
        />
        <button onClick={handleLogin}>로그인 / 캐릭터 생성</button>
      </div>
    );
  }

  // =========================
  // 메인 게임 화면
  // =========================
  return (
    <div className="rpg-ui">
      <div className="rpg-window">
        <div className="header">
          <h2 className="rpg-title">장비창</h2>
          <span className="player-id">🧙 {playerId}</span>
          <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
        </div>

        <div className="rpg-layout">
          {/* 왼쪽 슬롯 */}
          <div className="rpg-column left">
            <div className="rpg-slot">{equipped.helmet && <img src={equipped.helmet.src} alt="helmet" />}</div>
            <div className="rpg-slot">{equipped.armor && <img src={equipped.armor.src} alt="armor" />}</div>
            <div className="rpg-slot">{equipped.weapon && <img src={equipped.weapon.src} alt="weapon" />}</div>
          </div>

          {/* 중앙 캐릭터 */}
          <div className="rpg-center">
            <img src="/silhouette.png" alt="character silhouette" className="rpg-silhouette" />
            <div className="rpg-status">
              <p>경험치: {xp}</p>
              <p>골드: {gold}</p>
              <p>힘: {stats.strength} / 지능: {stats.intelligence} / 운: {stats.luck}</p>
            </div>
          </div>

          {/* 오른쪽 퀘스트 */}
          <div className="rpg-column right">
            {questData.map((quest) => {
              const today = new Date().toISOString().split('T')[0];
              const completedToday = questLog[quest.id] === today;
              return (
                <div key={quest.id} className="rpg-quest">
                  <p><strong>{quest.name}</strong></p>
                  <p>난이도: {quest.difficulty}</p>
                  <p>보상: XP +{quest.rewardXp} / Gold +{quest.rewardGold}</p>
                  <button
                    onClick={() => handleQuestReward(quest)}
                    disabled={completedToday}
                    className={completedToday ? 'disabled' : ''}
                  >
                    {completedToday ? '오늘 완료됨' : '보상 받기'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 인벤토리 */}
        <div className="rpg-inventory">
          <h3>인벤토리</h3>
          <div className="inventory-grid">
            {inventory.map((item, i) => (
              <img
                key={i}
                src={item.src}
                alt={item.name}
                title={`${item.name} (힘 +${item.stats.strength}, 지능 +${item.stats.intelligence}, 운 +${item.stats.luck})`}
                onDoubleClick={() => handleEquip(item)}
                className={equipped[item.type]?.name === item.name ? 'equipped-item' : ''}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LifeRPG;
