import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  ArrowButton,
  ArrowControls,
  BoardContainer,
  ChainIcon,
  EmptyCell,
  Grid,
  GridCell,
  GridRow,
  HeadshotCell,
  HeadshotWrapper,
  LockImage,
  OverlayContainer,
  Player,
  Popup,
  PopupMessage,
  PopupButton,
  DifficultyTag,
  DifficultyIndicator,
  LargePopup,
  PopupPicture,
  PopupDialogue,
  CloseButton,
  DialogueContainer,
  DialogueBox,
} from "./OL_MESSAGE_BOARD_STYLES";
import MiniGame from "./OL_MESSAGE_GAME";

const importAll = (r) => {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
};

const headshots = importAll(
  require.context("./Headshots", false, /\.(png|jpe?g|svg)$/)
);

const headshotsTalking = importAll(
  require.context("./Headshots/Talking", false, /\.(png|jpe?g|svg)$/)
);

const lockImage = require("./Headshots/lock.png");

const characterMapping = {
  "Xitali.png": {
    difficulty: 3,
    monster: "Information_Overload_Ogre.png",
    life: 500,
  },
  "Gio.png": {
    difficulty: 3,
    monster: "Information_Overload_Ogre.png",
    life: 500,
  },
  "Matt.png": { difficulty: 4, monster: "Burnout_Beast.png", life: 600 },
  "Evan.png": {
    difficulty: 5,
    monster: "Work_Life_Imbalance_Wraith.png",
    life: 700,
  },
  "Chris.png": {
    difficulty: 6,
    monster: "Student_Debt_Serpent.png",
    life: 800,
  },
  "Miguel.png": { difficulty: 7, monster: "Budget_Cut_Beast.png", life: 900 },
  "Lyn.png": { difficulty: 8, monster: "Tuition_Hike_Hydra.png", life: 1000 },
  "Daniel.png": {
    difficulty: 1,
    monster: "Mental_Health_Monster.png",
    life: 300,
  },
  "Drew.png": {
    difficulty: 2,
    monster: "Procrastination_Phantom.png",
    life: 400,
  },
  "Gracie.png": {
    difficulty: 2,
    monster: "Procrastination_Phantom.png",
    life: 400,
  },
  "Giovanna.png": {
    difficulty: 1,
    monster: "Mental_Health_Monster.png",
    life: 300,
  },
  "Hannah.png": {
    difficulty: 1,
    monster: "Mental_Health_Monster.png",
    life: 300,
  },
  "Isabella.png": {
    difficulty: 1,
    monster: "Mental_Health_Monster.png",
    life: 300,
  },
  "Jacob.png": {
    difficulty: 1,
    monster: "Mental_Health_Monster.png",
    life: 300,
  },
  "Jay.png": { difficulty: 1, monster: "Mental_Health_Monster.png", life: 300 },
  "Mariah.png": {
    difficulty: 1,
    monster: "Mental_Health_Monster.png",
    life: 300,
  },
  "Mia.png": { difficulty: 1, monster: "Mental_Health_Monster.png", life: 300 },
  "Nadia.png": {
    difficulty: 1,
    monster: "Mental_Health_Monster.png",
    life: 300,
  },
  "Seth.png": {
    difficulty: 1,
    monster: "Mental_Health_Monster.png",
    life: 300,
  },
  "Tamanna.png": {
    difficulty: 1,
    monster: "Mental_Health_Monster.png",
    life: 300,
  },
  "Tullah.png": {
    difficulty: 1,
    monster: "Mental_Health_Monster.png",
    life: 300,
  },
  "Tyler.png": {
    difficulty: 1,
    monster: "Mental_Health_Monster.png",
    life: 300,
  },
  "Adrian.png": {
    difficulty: 1,
    monster: "Mental_Health_Monster.png",
    life: 300,
  },
  "Atiksha.png": {
    difficulty: 1,
    monster: "Mental_Health_Monster.png",
    life: 300,
  },
  "Bobbie.png": {
    difficulty: 1,
    monster: "Mental_Health_Monster.png",
    life: 300,
  },
  "Briseyda.png": {
    difficulty: 1,
    monster: "Mental_Health_Monster.png",
    life: 300,
  },
  "Casey.png": {
    difficulty: 1,
    monster: "Mental_Health_Monster.png",
    life: 300,
  },
  "Evelio.png": {
    difficulty: 1,
    monster: "Mental_Health_Monster.png",
    life: 300,
  },
};

const cellImageMapping = [
  "Xitali.png",
  "Gio.png",
  "Matt.png",
  "Evan.png",
  "Chris.png",
  "Miguel.png",
  "Lyn.png",
  "Daniel.png",
  null,
  "Drew.png",
  null,
  "Gracie.png",
  null,
  "Giovanna.png",
  "Hannah.png",
  null,
  null,
  null,
  null,
  null,
  "Isabella.png",
  "Jacob.png",
  null,
  null,
  null,
  null,
  null,
  "Jay.png",
  "Mariah.png",
  null,
  null,
  null,
  null,
  null,
  "Mia.png",
  "Nadia.png",
  null,
  null,
  null,
  null,
  null,
  "Seth.png",
  "Tamanna.png",
  null,
  null,
  null,
  null,
  null,
  "Tullah.png",
  "Tyler.png",
  null,
  null,
  null,
  null,
  null,
  "Adrian.png",
  "Atiksha.png",
  "Bobbie.png",
  "Briseyda.png",
  null,
  null,
  "Casey.png",
  "Evelio.png",
];

function OL_MESSAGE_BOARD() {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [popup, setPopup] = useState({
    visible: false,
    name: "",
    difficulty: 0,
  });
  const [largePopup, setLargePopup] = useState({
    visible: false,
    name: "",
    monster: "",
    life: 0,
  });
  const [currentDialogue, setCurrentDialogue] = useState("");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState("");
  const [isTalking, setIsTalking] = useState(false);
  const gridRef = useRef(null);
  const [cellSize, setCellSize] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);

  const updateDialogues = (username, monster) => [
    `Heeeeeyy ${username} please help me! The ${monster} has trapped me in here! I need your help.`,
    "Defeat IT and bring me back to HQ so we can continue with the Orientation",
    "Click on 'Fight' and hit the monster until you knock it.",
  ];
  const updateCellSize = () => {
    if (gridRef.current) {
      const gridWidth = gridRef.current.clientWidth;
      const newSize = gridWidth / 7;
      setCellSize(newSize);

      const gridRect = gridRef.current.getBoundingClientRect();
      const initialTop = gridRect.top + newSize * 7;
      const initialLeft = gridRect.left + newSize * 3;

      setPosition({ top: initialTop, left: initialLeft });
    }
  };

  useEffect(() => {
    updateCellSize();
    window.addEventListener("resize", updateCellSize);
    return () => window.removeEventListener("resize", updateCellSize);
  }, [gridRef]);

  useEffect(() => {
    let typingInterval;
    let talkingInterval;
    if (largePopup.visible && !gameStarted) {
      const dialogues = updateDialogues(largePopup.name, largePopup.monster);

      typingInterval = setInterval(() => {
        setCurrentDialogue((prev) => {
          if (letterIndex < dialogues[dialogueIndex].length) {
            const nextLetterIndex = letterIndex + 1;
            setLetterIndex(nextLetterIndex);
            return dialogues[dialogueIndex].slice(0, nextLetterIndex);
          } else {
            clearInterval(typingInterval);
            clearInterval(talkingInterval);
            setTimeout(() => {
              setLetterIndex(0);
              setDialogueIndex(
                (prevIndex) => (prevIndex + 1) % dialogues.length
              );
              setCurrentDialogue("");
              setIsTalking(false);
            }, 2000);
            return prev;
          }
        });
      }, 100);

      talkingInterval = setInterval(() => {
        setIsTalking((prev) => !prev);
      }, 100);

      return () => {
        clearInterval(typingInterval);
        clearInterval(talkingInterval);
      };
    }
  }, [largePopup.visible, dialogueIndex, letterIndex, gameStarted]);

  useEffect(() => {
    if (largePopup.visible) {
      setCurrentImage(
        isTalking
          ? headshotsTalking[`${largePopup.name}.png`]
          : headshots[`${largePopup.name}.png`]
      );
    }
  }, [isTalking, largePopup.visible, largePopup.name]);

  const movePlayer = (direction) => {
    setPosition((prevPosition) => {
      const gridRect = gridRef.current.getBoundingClientRect();
      let newTop = prevPosition.top;
      let newLeft = prevPosition.left;

      if (direction === "up" && newTop > gridRect.top) {
        newTop -= cellSize;
      } else if (direction === "down" && newTop < gridRect.top + cellSize * 8) {
        newTop += cellSize;
      } else if (direction === "left" && newLeft > gridRect.left) {
        newLeft -= cellSize;
      } else if (
        direction === "right" &&
        newLeft < gridRect.left + cellSize * 6
      ) {
        newLeft += cellSize;
      }

      const colIndex = (newLeft - gridRect.left) / cellSize;
      const rowIndex = (newTop - gridRect.top) / cellSize;
      const cellIndex = rowIndex * 7 + colIndex;
      const imageName = cellImageMapping[cellIndex];

      if (imageName) {
        const name = imageName.split(".")[0];
        const { difficulty, monster, life } = characterMapping[imageName];
        setPopup({ visible: true, name, difficulty, monster, life });
      } else {
        setPopup({ visible: false, name: "", difficulty: 0 });
      }

      return { top: newTop, left: newLeft };
    });
  };

  const handleRescueClick = () => {
    setLargePopup({
      visible: true,
      name: popup.name,
      monster: popup.monster,
      life: popup.life,
    });
    setPopup({ visible: false, name: "", difficulty: 0 });
  };

  const closeLargePopup = () => {
    setLargePopup({ visible: false, name: "", monster: "", life: 0 });
    setCurrentDialogue("");
    setDialogueIndex(0);
    setLetterIndex(0);
    setIsTalking(false);
    setGameStarted(false);
  };

  return (
    <BoardContainer>
      <Grid ref={gridRef}>
        {Array.from({ length: 9 }).map((_, rowIndex) => (
          <GridRow key={rowIndex}>
            {Array.from({ length: 7 }).map((_, colIndex) => {
              const cellIndex = rowIndex * 7 + colIndex;
              const imageName = cellImageMapping[cellIndex];

              if (imageName) {
                return (
                  <GridCell key={colIndex}>
                    <HeadshotWrapper cellSize={cellSize}>
                      <HeadshotCell
                        src={headshots[imageName]}
                        alt={`Headshot ${cellIndex + 1}`}
                        cellSize={cellSize}
                        isTalking={isTalking}
                      />
                      <OverlayContainer>
                        <ChainIcon size={cellSize} />
                        <LockImage
                          src={lockImage}
                          alt="Lock"
                          cellSize={cellSize}
                        />
                      </OverlayContainer>
                    </HeadshotWrapper>
                  </GridCell>
                );
              } else {
                return <EmptyCell key={colIndex} />;
              }
            })}
          </GridRow>
        ))}
      </Grid>
      <Player
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${cellSize}px`,
          height: `${cellSize}px`,
        }}
      />
      <ArrowControls>
        <ArrowButton onClick={() => movePlayer("up")}>↑</ArrowButton>
        <div>
          <ArrowButton onClick={() => movePlayer("left")}>←</ArrowButton>
          <ArrowButton onClick={() => movePlayer("down")}>↓</ArrowButton>
          <ArrowButton onClick={() => movePlayer("right")}>→</ArrowButton>
        </div>
      </ArrowControls>
      {popup.visible && (
        <Popup>
          <PopupMessage>
            Do you want to rescue {popup.name}?
            <DifficultyTag>
              Difficulty: <DifficultyIndicator difficulty={popup.difficulty} />
            </DifficultyTag>
          </PopupMessage>
          <PopupButton onClick={handleRescueClick}>YES!</PopupButton>
        </Popup>
      )}
      {largePopup.visible && (
        <LargePopup>
          <CloseButton onClick={closeLargePopup}>X</CloseButton>
          <DialogueContainer>
            <PopupPicture src={currentImage} alt={largePopup.name} />
            <DialogueBox>
              <PopupDialogue
                value={currentDialogue}
                readOnly
                rows="4"
                cols="50"
              />
            </DialogueBox>
          </DialogueContainer>
          <MiniGame
            gameStarted={gameStarted}
            setGameStarted={setGameStarted}
            monsterImage={largePopup.monster}
            monsterLife={largePopup.life}
          />
        </LargePopup>
      )}
    </BoardContainer>
  );
}

export default OL_MESSAGE_BOARD;
