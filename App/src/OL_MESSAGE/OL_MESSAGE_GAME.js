import React, { useEffect, useRef, useState } from "react";
import {
  FightButton,
  HitWord,
  Life,
  LifeBar,
  MiniGameArea as MiniGameAreaStyle,
  Monster,
  Symbol,
} from "./OL_MESSAGE_BOARD_STYLES";
import defeatWords from "./defeatWords";

const formatMonsterName = (monsterImage) =>
  monsterImage.replace(/_/g, " ").replace(".png", "");

const MiniGame = ({
  gameStarted,
  setGameStarted,
  monsterImage,
  monsterLife,
  onGameRestart,
  updateDialogue,
  toggleSpeakingImage,
  onMonsterDefeated,
  isFinalRescue,
}) => {
  const [monsterPosition, setMonsterPosition] = useState({ top: 0, left: 0 });
  const [monsterSize, setMonsterSize] = useState(50);
  const [life, setLife] = useState(monsterLife);
  const [hitWords, setHitWords] = useState([]);
  const [isHit, setIsHit] = useState(false);
  const [isDefeated, setIsDefeated] = useState(false);
  const gameAreaRef = useRef(null);
  const monsterRef = useRef(null);
  const [monsterSrc, setMonsterSrc] = useState("");
  const monsterName = formatMonsterName(monsterImage);

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
    if (gameStarted && !isDefeated) {
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
  }, [gameStarted, isDefeated, monsterSize]);

  const handleFightClick = () => {
    setGameStarted(true);
  };

  const handleMonsterClick = (e) => {
    if (isDefeated) return;

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

    setIsHit(true);
    setTimeout(() => setIsHit(false), 200); // Duration of the hit animation

    if (life - 10 <= 0) {
      setIsDefeated(true);
      setMonsterPosition({
        top: gameAreaRect.height / 2 - 250,
        left: gameAreaRect.width / 2 - 250,
      });
      setMonsterSize(500);
      toggleSpeakingImage(true);
      const finalMessage = isFinalRescue
        ? "Amazing! You have saved me, and everyone have been rescued, thank you! now we can continue with the Orientation successfully!"
        : "Amazing! You have saved me, thank you! I will be joining your journey in return. Let's go save the rest of the team!";
      updateDialogue(finalMessage);
      onMonsterDefeated();
    }
  };

  const restartGame = () => {
    setLife(monsterLife);
    setIsDefeated(false);
    setGameStarted(false);
    toggleSpeakingImage(false);
    onGameRestart();
  };

  return (
    <MiniGameAreaStyle ref={gameAreaRef}>
      {!gameStarted && (
        <FightButton onClick={handleFightClick}>FIGHT</FightButton>
      )}
      {gameStarted && (
        <>
          <div
            style={{
              width: "100%",
              textAlign: "center",
              left: "50%",
              top: "5px",
              color: "#6a1b9a",
              fontSize: "25px",
            }}
          >
            {monsterName}
          </div>
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
            className={`${isHit ? "hit" : ""} ${isDefeated ? "defeated" : ""}`}
            style={{
              top: `${monsterPosition.top}px`,
              left: `${monsterPosition.left}px`,
              width: `${monsterSize}px`,
              height: `${monsterSize}px`,
            }}
            onClick={handleMonsterClick}
          />
          {isDefeated && (
            <>
              {Array.from({ length: 30 }).map((_, index) => (
                <Symbol
                  key={index}
                  style={{
                    top: `${monsterPosition.top + Math.random() * 200 + 150}px`,
                    left: `${
                      monsterPosition.left + Math.random() * 200 + 180
                    }px`,
                  }}
                />
              ))}
            </>
          )}
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
