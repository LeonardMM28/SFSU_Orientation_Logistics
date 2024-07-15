import React, { useEffect, useRef, useState } from "react";
import {
  MiniGameArea as MiniGameAreaStyle,
  FightButton,
  LifeBar,
  Life,
  Monster,
} from "./OL_MESSAGE_BOARD_STYLES";

const MiniGame = ({ gameStarted, setGameStarted, monsterImage }) => {
  const [monsterPosition, setMonsterPosition] = useState({ top: 0, left: 0 });
  const [monsterSize, setMonsterSize] = useState(50);
  const [life, setLife] = useState(100);
  const gameAreaRef = useRef(null);
  const monsterRef = useRef(null);

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

  const handleMonsterClick = () => {
    setLife((prevLife) => Math.max(prevLife - 10, 0));
  };

  return (
    <MiniGameAreaStyle ref={gameAreaRef}>
      {!gameStarted && (
        <FightButton onClick={handleFightClick}>FIGHT</FightButton>
      )}
      {gameStarted && (
        <>
          <LifeBar>
            <Life width={life} />
          </LifeBar>
          <Monster
            ref={monsterRef}
            src={require(`./Headshots/${monsterImage}`)}
            alt="Monster"
            style={{
              top: `${monsterPosition.top}px`,
              left: `${monsterPosition.left}px`,
              width: `${monsterSize}px`,
              height: `${monsterSize}px`,
            }}
            onClick={handleMonsterClick}
          />
        </>
      )}
    </MiniGameAreaStyle>
  );
};

export default MiniGame;
