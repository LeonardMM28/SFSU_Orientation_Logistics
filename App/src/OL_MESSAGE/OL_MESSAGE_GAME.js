import React, { useEffect, useRef, useState } from "react";
import {
  MiniGameArea as MiniGameAreaStyle,
  FightButton,
  LifeBar,
  Life,
  Monster,
  HitWord,
} from "./OL_MESSAGE_BOARD_STYLES";

const defeatWords = {
  "Procrastination_Phantom.png": [
    "Planning",
    "Responsibility",
    "Discipline",
    "Focus",
    "Time Management",
  ],
  "Mental_Health_Monster.png": [
    "Support",
    "Therapy",
    "Exercise",
    "Meditation",
    "Sleep",
  ],
  "Information_Overload_Ogre.png": [
    "Organize",
    "Prioritize",
    "Breakdown",
    "Limit",
    "Focus",
  ],
  "Burnout_Beast.png": ["Rest", "Balance", "Break", "Delegation", "Boundaries"],
  "Work_Life_Imbalance_Wraith.png": [
    "Balance",
    "Time Off",
    "Hobby",
    "Family",
    "Rest",
  ],
  "Student_Debt_Serpent.png": [
    "Scholarships",
    "Grants",
    "Savings",
    "Budgeting",
    "Jobs",
  ],
  "Budget_Cut_Beast.png": [
    "Efficiency",
    "Innovation",
    "Savings",
    "Fundraising",
    "Grants",
  ],
  "Tuition_Hike_Hydra.png": [
    "Scholarships",
    "Financial Aid",
    "Work-Study",
    "Budgeting",
    "Savings",
  ],
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
  const [hitWords, setHitWords] = useState([]);
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
        setMonsterSrc(require(null).default); // Ensure you have a default image available
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

  const handleMonsterClick = (e) => {
    setLife((prevLife) => Math.max(prevLife - 10, 0));

    const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
    const hitX = e.clientX - gameAreaRect.left;
    const hitY = e.clientY - gameAreaRect.top;

    const words = defeatWords[monsterImage];
    const randomWord = words[Math.floor(Math.random() * words.length)];

    setHitWords((prevWords) => [
      ...prevWords,
      { word: randomWord, x: hitX, y: hitY, id: Date.now() },
    ]);
  };

  return (
    <MiniGameAreaStyle ref={gameAreaRef}>
      {!gameStarted && (
        <FightButton onClick={handleFightClick}>FIGHT</FightButton>
      )}
      {gameStarted && (
        <>
          <LifeBar
            width={(life / monsterLife) * 10}
            maxWidth={(monsterLife / 80) * 8}
          >
            <Life
              width={(life / monsterLife) * 100}
              maxWidth={(monsterLife / 80) * 8}
            />
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
          {hitWords.map(({ word, x, y, id }) => (
            <HitWord key={id} style={{ top: `${y}px`, left: `${x}px` }}>
              {word}
            </HitWord>
          ))}
        </>
      )}
    </MiniGameAreaStyle>
  );
};

export default MiniGame;
