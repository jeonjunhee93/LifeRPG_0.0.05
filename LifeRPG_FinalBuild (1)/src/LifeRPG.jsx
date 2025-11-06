// src/LifeRPG.jsx
import React, { useState } from "react";
import "./index.css";

const initialStats = {
  strength: 5,
  intelligence: 5,
  luck: 5,
};

const initialInventory = [];

const equipmentSlots = ["weapon", "armor", "helmet", "gloves", "boots"];

const defaultEquipment = {
  weapon: null,
  armor: null,
  helmet: null,
  gloves: null,
  boots: null,
};

const sampleQuests = [
  {
    id: 1,
    name: "방 청소하기",
    difficulty: "쉬움",
    reward: { xp: 10, gold: 5 },
    completed: false,
  },
  {
    id: 2,
    name: "밀린 업무 처리",
    difficulty: "보통",
    reward: { xp: 20, gold: 10 },
    completed: false,
  },
];

export default function LifeRPG() {
  const [xp, setXp] = useState(0);
  const [gold, setGold] = useState(0);
  const [stats, setStats] = useState(initialStats);
  const [inventory, setInventory] = useState(initialInventory);
  const [equipment, setEquipment] = useState(defaultEquipment);
  const [quests, setQuests] = useState(sampleQuests);

  const completeQuest = (id) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === id && !q.completed) {
          setXp((xp) => xp + q.reward.xp);
          setGold((gold) => gold + q.reward.gold);
          return { ...q, completed: true };
        }
        return q;
      })
    );
  };

  const equipItem = (slot, itemName) => {
    setEquipment((prev) => ({ ...prev, [slot]: itemName }));
  };

  return (
    <div className="life-rpg">
      <h1 className="title">Life R.P.G</h1>

      <div className="status">
        <p>경험치 (XP): {xp}</p>
        <p>골드 (G): {gold}</p>
        <p>힘: {stats.strength} / 지능: {stats.intelligence} / 운: {stats.luck}</p>
      </div>

      <div className="character">
        <h2>캐릭터 장비</h2>
        <img src="/silhouette.png" alt="캐릭터 실루엣" className="silhouette" />
        <div className="equipment">
          {equipmentSlots.map((slot) => (
            <div key={slot} className={`slot ${slot}`}>
              {equipment[slot] ? (
                <img
                  src={`item/${equipment[slot]}.png`}
                  alt={equipment[slot]}
                  title={equipment[slot]}
                />
              ) : (
                <span>{slot}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="quests">
        <h2>퀘스트 목록</h2>
        {quests.map((q) => (
          <div key={q.id} className={`quest ${q.completed ? "completed" : ""}`}>
            <p>
              [{q.difficulty}] {q.name}
            </p>
            <p>
              보상: XP {q.reward.xp}, G {q.reward.gold}
            </p>
            {!q.completed && (
              <button onClick={() => completeQuest(q.id)}>퀘스트 완료</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
