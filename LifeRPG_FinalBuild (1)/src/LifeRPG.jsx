// LifeRPG.jsx - 전체 루팅 시스템 포함 버전
import React, { useState } from 'react';

const initialQuests = [
  { name: '청소하기', xp: 10, gold: 5, completed: false },
  { name: '세탁물 개기', xp: 15, gold: 7, completed: false },
];

const itemPool = [
  { name: '무딘칼_일반', slot: 'weapon' },
  { name: '루비소드_희귀', slot: 'weapon' },
  { name: '파멸의검_에픽', slot: 'weapon' },
  { name: '아스가르드의빛_전설', slot: 'weapon' },

  { name: '낡은 철 갑옷', slot: 'armor' },
  { name: '기사단 정예 갑주', slot: 'armor' },
  { name: '피의 결의 갑옷', slot: 'armor' },
  { name: '태양의 심장 갑옷', slot: 'armor' },

  { name: '녹슨 철 투구', slot: 'helmet' },
  { name: '검은 달의 투구', slot: 'helmet' },
  { name: '용기의 투구', slot: 'helmet' },
  { name: '신왕의 면류관', slot: 'helmet' },
];

function getRandomItem() {
  const dropChance = 0.3; // 30% 확률
  if (Math.random() < dropChance) {
    const item = itemPool[Math.floor(Math.random() * itemPool.length)];
    return item;
  }
  return null;
}

export default function LifeRPG() {
  const [xp, setXP] = useState(0);
  const [gold, setGold] = useState(0);
  const [quests, setQuests] = useState(initialQuests);
  const [inventory, setInventory] = useState([]);
  const [equipped, setEquipped] = useState({ weapon: null, armor: null, helmet: null });

  const handleCompleteQuest = (index) => {
    const updatedQuests = [...quests];
    updatedQuests[index].completed = true;
    setXP(xp + updatedQuests[index].xp);
    setGold(gold + updatedQuests[index].gold);
    setQuests(updatedQuests);

    const drop = getRandomItem();
    if (drop) {
      alert(`${drop.name} 아이템을 획득했습니다!`);
      setInventory([...inventory, drop]);
    }
  };

  const equipItem = (item) => {
    setEquipped({ ...equipped, [item.slot]: item });
    setInventory(inventory.filter((i) => i !== item));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Life RPG</h1>
      <p>XP: {xp} | Gold: {gold}</p>

      <h2 className="text-xl mt-4">퀘스트</h2>
      <ul>
        {quests.map((q, i) => (
          <li key={i} className="mb-2">
            {q.completed ? (
              <s>{q.name}</s>
            ) : (
              <>
                {q.name} - XP: {q.xp}, Gold: {q.gold}{' '}
                <button className="ml-2 text-blue-500" onClick={() => handleCompleteQuest(i)}>완료</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2 className="text-xl mt-4">인벤토리</h2>
      <ul className="mb-4">
        {inventory.map((item, i) => (
          <li key={i}>
            {item.name} ({item.slot}){' '}
            <button className="text-green-500" onClick={() => equipItem(item)}>장착</button>
          </li>
        ))}
      </ul>

      <h2 className="text-xl mt-4">장착 중</h2>
      <p>무기: {equipped.weapon?.name || '없음'}</p>
      <p>갑옷: {equipped.armor?.name || '없음'}</p>
      <p>투구: {equipped.helmet?.name || '없음'}</p>
    </div>
  );
}
