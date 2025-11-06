// LifeRPG.jsx
import React, { useState } from 'react';
import './index.css';

// 초기 장비 슬롯
const initialEquipment = {
  helmet: null,
  armor: null,
  weapon: null
};

// 초기 스탯
const initialStats = { strength: 0, intelligence: 0, luck: 0 };

// 인벤토리 아이템 데이터
const equipmentData = [
  {
    name: 'Dark Moon Sword',
    type: 'weapon',
    src: '/item/파멸의검_에픽.png',
    stats: { strength: 5, intelligence: 0, luck: 1 }
  },
  {
    name: 'Knight Helmet',
    type: 'helmet',
    src: '/item/용기의 투구.png',
    stats: { strength: 0, intelligence: 3, luck: 0 }
  },
  {
    name: 'Steel Armor',
    type: 'armor',
    src: '/item/기사단 정예 갑주.png',
    stats: { strength: 4, intelligence: 0, luck: 0 }
  },
  {
    name: 'Rusty Sword',
    type: 'weapon',
    src: '/item/무딘칼_일반.png',
    stats: { strength: 1, intelligence: 0, luck: 0 }
  },
  {
    name: 'Old Iron Armor',
    type: 'armor',
    src: '/item/낡은 철 갑옷.png',
    stats: { strength: 2, intelligence: 0, luck: 0 }
  },
  {
    name: 'Brave Crown',
    type: 'helmet',
    src: '/item/신왕의 면류관.png',
    stats: { strength: 0, intelligence: 5, luck: 2 }
  }
];

// 장비 위치 (실루엣 기준)
const equipmentPositions = {
  helmet: { top: '10px', left: '105px' },
  armor: { top: '100px', left: '90px' },
  weapon: { top: '180px', left: '200px' },
};

function LifeRPG() {
  const [xp, setXp] = useState(100);
  const [gold, setGold] = useState(50);
  const [stats, setStats] = useState(initialStats);
  const [inventory, setInventory] = useState(equipmentData);
  const [equipped, setEquipped] = useState(initialEquipment);

  // 장착 및 해제 기능 + 스탯 자동계산
  const handleEquip = (item) => {
    setEquipped(prev => {
      const newEquipped = { ...prev };

      // 같은 아이템 더블클릭 시 해제
      if (prev[item.type]?.name === item.name) {
        newEquipped[item.type] = null;
      } else {
        newEquipped[item.type] = item;
      }

      // 새 스탯 계산
      const newStats = { strength: 0, intelligence: 0, luck: 0 };
      Object.values(newEquipped).forEach(eq => {
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

  return (
    <div className="game-container">
      <div className="character-panel">
        <h1>Life R.P.G</h1>
        <p>경험치: {xp}</p>
        <p>골드: {gold}</p>
        <p>힘: {stats.strength} / 지능: {stats.intelligence} / 운: {stats.luck}</p>

        {/* 캐릭터 실루엣 */}
        <img src="/item/silhouette.png" alt="silhouette" className="silhouette" />

        {/* 장착된 아이템 표시 */}
        {Object.keys(equipped).map((slot) => (
          equipped[slot] ? (
            <img
              key={slot}
              src={equipped[slot].src}
              alt={slot}
              className="equipment-icon"
              style={equipmentPositions[slot]}
            />
          ) : null
        ))}
      </div>

      {/* 인벤토리 패널 */}
      <div className="quest-inventory-panel">
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
                border: equipped[item.type]?.name === item.name ? '2px solid gold' : '1px solid #ccc',
                borderRadius: '8px',
                padding: '2px',
                backgroundColor: '#f9f9f9'
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
