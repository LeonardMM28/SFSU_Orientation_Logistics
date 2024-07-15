import React, { useEffect, useRef, useState } from "react";
import {
  MiniGameArea as MiniGameAreaStyle,
  FightButton,
  LifeBar,
  Life,
  Monster,
  HitWord,
} from "./OL_MESSAGE_BOARD_STYLES";
import { NULL } from "mysql/lib/protocol/constants/types";

// Defeating words for each monster
const defeatingWords = {
  "Information_Overload_Ogre.png": [
    "Focus",
    "Organization",
    "Breaks",
    "Clarity",
  ],
  "Burnout_Beast.png": ["Rest", "Exercise", "Nutrition", "Hobbies"],
  "Work_Life_Imbalance_Wraith.png": [
    "Balance",
    "Boundaries",
    "Relaxation",
    "Family",
  ],
  "Student_Debt_Serpent.png": [
    "Savings",
    "Budgeting",
    "Scholarships",
    "Grants",
  ],
  "Budget_Cut_Beast.png": [
    "Advocacy",
    "Fundraising",
    "Efficiency",
    "Donations",
  ],
  "Tuition_Hike_Hydra.png": ["Grants", "Scholarships", "Protests", "Petitions"],
  "Mental_Health_Monster.png": ["Therapy", "Support", "Meditation", "Exercise"],
  "Procrastination_Phantom.png": ["Planning", "Discipline", "Focus", "Goals"],
};

const MiniGame = ({
  gameStarted,
  setGameStarted,
  monsterImage,
  monsterLife,
}) => {
  const [monsterPosition, setMonsterPosition] = useState({ top: 0, left: 0 });
  const [monsterSize, setMonsterSize] = useState(50);
  const [life, setLife] = useState(monsterLife);
  const [hits, setHits] = useState([]);
  const gameAreaRef = useRef(null);
  const monsterRef = useRef(null);
  const [monsterSrc, setMonsterSrc] = useState("");

  useEffect(() => {
    import(`./Headshots/${monsterImage}`)
      .then((image) => setMonsterSrc(image.default))
      .catch((error) => {
        console.error(
          `Monster image ${monsterImage} not found. Using default image.`,
          error
        );
        setMonsterSrc(require(NULL).default); // Ensure you have a default image available
      });
  }, [monsterImage]);

  useEffect(() => {
    let interval;
    if (gameStarted) {
      interval = setInterval(() => {
        const gameArea = gameAreaRef.current;
        if (gameArea) {
          const maxTop = gameArea.clientHeight - monsterSize;
          const maxLeft = gameArea.clientWidth - monsterSize;
          const newTop = Math.random() * maxTop;
          const newLeft = Math.random() * maxLeft;
          const newSize = 30 + Math.random() * 100;

          setMonsterPosition({ top: newTop, left: newLeft });
          setMonsterSize(newSize);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameStarted, monsterSize]);

  const handleFightClick = () => {
    setGameStarted(true);
  };

  const handleMonsterClick = (event) => {
    setLife((prevLife) => Math.max(prevLife - 10, 0));
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const words = defeatingWords[monsterImage] || ["Hit"];
    const word = words[Math.floor(Math.random() * words.length)];
    setHits((prevHits) => [...prevHits, { word, x, y, id: Date.now() }]);
  };

  return (
    <MiniGameAreaStyle ref={gameAreaRef}>
      {!gameStarted && (
        <FightButton onClick={handleFightClick}>FIGHT</FightButton>
      )}
      {gameStarted && (
        <>
          <LifeBar>
            <Life width={(life / monsterLife) * 100} />
          </LifeBar>
          <Monster
            ref={monsterRef}
            src={monsterSrc}
            alt="Monster"
            style={{
              top: `${monsterPosition.top}px`,
              left: `${monsterPosition.left}px`,
              width: `${monsterSize}px`,
              height: `${monsterSize}px`,
            }}
            onClick={handleMonsterClick}
          />
          {hits.map((hit) => (
            <HitWord key={hit.id} x={hit.x} y={hit.y}>
              {hit.word}
            </HitWord>
          ))}
        </>
      )}
    </MiniGameAreaStyle>
  );
};

export default MiniGame;
