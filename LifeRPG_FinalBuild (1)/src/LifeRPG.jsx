import React, { useState } from "react";

const initialStats = {
  힘: 0,
  지능: 0,
  운: 0,
};

const initialEquipment = {
  weapon: null,
  armor: null,
  helmet: null,
};

const initialInventory = [];

const quests = [
  { id: 1, name: "방 청소", xp: 20, gold: 10, difficulty: "쉬움" },
  { id: 2, name: "서류 정리", xp: 30, gold: 15, difficulty: "보통" },
  { id: 3, name: "운동 30분", xp: 50, gold: 25, difficulty: "어려움" },
];

const equipmentStats = {
  weapon: {
    "무딘칼": { 힘: 1 },
    "루비소드": { 힘: 3 },
    "파멸의검": { 힘: 5 },
    "아스가르드의빛": { 힘: 10 },
  },
  armor: {
    "낡은 철 갑옷": { 지능: 1 },
    "기사단 정예 갑주": { 지능: 3 },
    "피의 결의 갑옷": { 지능: 5 },
    "태양의 심장 갑옷": { 지능: 10 },
  },
  helmet: {
    "녹슨 철 투구": { 운: 1 },
    "용기의 투구": { 운: 3 },
    "검은 달의 투구": { 운: 5 },
    "신왕의 면류관": { 운: 10 },
  },
};

const getItemImage = (type, name) => `/item/${name}.png`;

export default function LifeRPG() {
  const [xp, setXP] = useState(0);
  const [gold, setGold] = useState(0);
  const [stats, setStats] = useState(initialStats);
  const [equipment, setEquipment] = useState(initialEquipment);
  const [inventory, setInventory] = useState(initialInventory);

  const completeQuest = (quest) => {
    setXP(xp + quest.xp);
    setGold(gold + quest.gold);
    // 루팅: 확률적으로 아이템 추가
    if (Math.random() < 0.1) {
      const allItems = Object.entries(equipmentStats).flatMap(([type, items]) =>
        Object.keys(items).map((name) => ({ type, name }))
      );
      const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
      setInventory([...inventory, randomItem]);
    }
  };

  const equipItem = (item) => {
    setEquipment({ ...equipment, [item.type]: item });
    const bonus = equipmentStats[item.type][item.name];
    setStats((prev) => {
      const newStats = { ...prev };
      Object.entries(bonus).forEach(([key, value]) => {
        newStats[key] += value;
      });
      return newStats;
    });
  };

  return (
    <div className="app">
      <h1>Life R.P.G</h1>
      <div className="stats">
        <p>경험치: {xp}</p>
        <p>골드: {gold}</p>
        <p>힘: {stats.힘} / 지능: {stats.지능} / 운: {stats.운}</p>
      </div>

      <div className="character">
        <img src="/silhouette.png" alt="실루엣" className="silhouette" />
        {Object.entries(equipment).map(([type, item]) =>
          item ? (
            <img
              key={type}
              src={getItemImage(type, item.name)}
              alt={item.name}
              className={`equipment-icon ${type}`}
            />
          ) : null
        )}
      </div>

      <div className="quests">
        <h2>퀘스트</h2>
        {quests.map((quest) => (
          <div key={quest.id} className="quest">
            <span>{quest.name} ({quest.difficulty})</span>
            <button onClick={() => completeQuest(quest)}>완료</button>
          </div>
        ))}
      </div>

     <div className="inventory">
  <h2>인벤토리</h2>
  <div className="inventory-items">
    {inventory.map((item, index) => (
      <img
        key={index}
        src={item.image}
        alt={item.name}
        onDoubleClick={() => equipItem(item)}
        style={{ width: '50px', height: '50px', margin: '5px', cursor: 'pointer' }}
      />
    ))}
  </div>
</div>
    </div>
  );
}
