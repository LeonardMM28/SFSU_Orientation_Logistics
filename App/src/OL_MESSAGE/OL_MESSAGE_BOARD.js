import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowButton,
  ArrowControls,
  BoardContainer,
  ChainIcon,
  CloseButton,
  DialogueBox,
  DialogueContainer,
  DifficultyIndicator,
  DifficultyTag,
  EmptyCell,
  Grid,
  GridCell,
  GridRow,
  HeadshotCell,
  HeadshotWrapper,
  LargePopup,
  LockImage,
  OverlayContainer,
  Player,
  Popup,
  PopupButton,
  PopupDialogue,
  PopupMessage,
  PopupPicture,
} from "./OL_MESSAGE_BOARD_STYLES";
import MiniGame from "./OL_MESSAGE_GAME";
import characterMapping from "./characterMapping";
import { userCodeMapping, validCodes } from "./validCodes";

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
  "Leo.png",
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

const OL_MESSAGE_BOARD = () => {
  const navigate = useNavigate();
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
  const [followers, setFollowers] = useState([]); // Initialize followers as an empty array
  const [trail, setTrail] = useState([]); // Initialize trail as an empty array
  const [cellImageMappingState, setCellImageMappingState] =
    useState(cellImageMapping);
  const gridRef = useRef(null);
  const [cellSize, setCellSize] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const dialogueBoxRef = useRef(null);
  const [mappedCellIndex, setMappedCellIndex] = useState(null);

  useEffect(() => {
    const playerCode = localStorage.getItem("playerCode");
    if (!playerCode || !validCodes.includes(playerCode)) {
      navigate("/message");
    } else {
      const playerName = Object.keys(userCodeMapping).find(
        (key) => userCodeMapping[key] === playerCode
      );
      const playerImage = `${playerName}.png`;
      const playerCellIndex = cellImageMapping.findIndex(
        (cell) => cell === playerImage
      );
      setMappedCellIndex(playerCellIndex);

      fetch(`http://localhost:3000/game/userdata/${playerCode}`)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            console.log("User Data:", data); // Debugging statement
            const progress = JSON.parse(data.progress || "[]"); // Parsing progress data
            console.log("Progress:", progress); // Debugging statement
            setFollowers(progress);

            // Updating cellImageMappingState to remove rescued users
            const updatedMapping = cellImageMapping.map((cell) => {
              const isRescued = progress.some((followerCode) => {
                const followerName = Object.keys(userCodeMapping).find(
                  (key) => userCodeMapping[key] === followerCode
                );
                return cell === `${followerName}.png`;
              });
              return isRescued ? null : cell;
            });
            setCellImageMappingState(updatedMapping);
          }
        })
        .catch((error) => {
          console.error("Error fetching game data:", error);
        });
    }
  }, [navigate]);

  // The remaining part of the code

  const formatMonsterName = (monster) =>
    monster.replace(/_/g, " ").replace(".png", "");

  const updateDialogues = (username, monster) => [
    `Heeeeeyy ${username} please help me! The ${formatMonsterName(
      monster
    )} has trapped me in here! I need your help.`,
    "Defeat it and bring me back to HQ so we can continue with the Orientation <3",
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

  useEffect(() => {
    if (dialogueBoxRef.current) {
      dialogueBoxRef.current.scrollTop = dialogueBoxRef.current.scrollHeight;
    }
  }, [currentDialogue]);

  const movePlayer = (direction) => {
    setPosition((prevPosition) => {
      const gridRect = gridRef.current.getBoundingClientRect();
      let newTop = prevPosition.top;
      let newLeft = prevPosition.left;
      let newTrail = [...trail, prevPosition];

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
      const imageName = cellImageMappingState[cellIndex];

      if (imageName && cellIndex !== mappedCellIndex) {
        const name = imageName.split(".")[0];
        const { difficulty, monster, life } = characterMapping[imageName];
        setPopup({ visible: true, name, difficulty, monster, life });
      } else {
        setPopup({ visible: false, name: "", difficulty: 0 });
      }

      if (newTrail.length > followers.length) {
        newTrail = newTrail.slice(1);
      }

      setTrail(newTrail);
      return { top: newTop, left: newLeft };
    });
  };

const handleRescueClick = () => {
  const playerCode = localStorage.getItem("playerCode");
  const progressCount = followers.length;
  const { tier } = characterMapping[`${popup.name}.png`];

  const tierRequirements = [0, 0, 19, 21, 23, 24, 25, 26, 27];
  const requiredProgress = tierRequirements[tier];
  const canBeRescued = tier === 1 || progressCount >= requiredProgress;

  if (canBeRescued) {
    setLargePopup({
      visible: true,
      name: popup.name,
      monster: popup.monster,
      life: popup.life,
    });
  } else {
    setPopup((prev) => ({
      ...prev,
      message: "Sorry, you do not have enough OL power yet",
    }));
  }
};

  const closeLargePopup = () => {
    setLargePopup({ visible: false, name: "", monster: "", life: 0 });
    setCurrentDialogue("");
    setDialogueIndex(0);
    setLetterIndex(0);
    setIsTalking(false);
    setGameStarted(false);
  };

  const handleGameRestart = () => {
    closeLargePopup();
    // Any other logic to reset the game
  };

  const updateDialogue = (newDialogue) => {
    setCurrentDialogue(newDialogue); // Clear the previous dialogue and set the new one
    setDialogueIndex(dialogueIndex + 1);
    setLetterIndex(0);
  };

  const toggleSpeakingImage = (speaking) => {
    setIsTalking(speaking);
  };

  const handleMonsterDefeated = () => {
    const playerCode = localStorage.getItem("playerCode");
    const rescueeCode = userCodeMapping[largePopup.name];

    fetch("http://localhost:3000/game/update/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rescuerCode: playerCode, rescueeCode }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Progress updated:", data);
        setFollowers((prevFollowers) => [...prevFollowers, rescueeCode]);
        setCellImageMappingState((prevMapping) =>
          prevMapping.map((cell) =>
            cell && cell.includes(`${largePopup.name}.png`) ? null : cell
          )
        );
      })
      .catch((error) => {
        console.error("Error updating progress:", error);
      });
  };

  return (
  <BoardContainer>
    <Grid ref={gridRef}>
      {Array.from({ length: 9 }).map((_, rowIndex) => (
        <GridRow key={rowIndex}>
          {Array.from({ length: 7 }).map((_, colIndex) => {
            const cellIndex = rowIndex * 7 + colIndex;
            const imageName = cellImageMappingState[cellIndex];

            if (imageName && cellIndex !== mappedCellIndex) {
              const userName = imageName.split(".")[0];
              const userCode = userCodeMapping[userName];

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
        backgroundImage: `url(${
          headshots[cellImageMapping[mappedCellIndex]]
        })`,
        backgroundSize: "cover",
        borderRadius: "5px",
      }}
    />

    {trail.map((trailPosition, index) => {
      const followerName = Object.keys(userCodeMapping).find(
        (key) => userCodeMapping[key] === followers[index]
      );
      return (
        <Player
          key={index}
          style={{
            top: `${trailPosition.top}px`,
            left: `${trailPosition.left}px`,
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            backgroundImage: `url(${headshots[`${followerName}.png`]})`,
            backgroundSize: "cover",
            borderRadius: "5px",
          }}
        />
      );
    })}

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
        <PopupButton onClick={handleRescueClick}>
          {popup.message || "YES!"}
        </PopupButton>
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
              ref={dialogueBoxRef}
            />
          </DialogueBox>
        </DialogueContainer>
        <MiniGame
          gameStarted={gameStarted}
          setGameStarted={setGameStarted}
          monsterImage={largePopup.monster}
          monsterLife={largePopup.life}
          onGameRestart={handleGameRestart}
          updateDialogue={updateDialogue}
          toggleSpeakingImage={toggleSpeakingImage}
          onMonsterDefeated={handleMonsterDefeated}
        />
      </LargePopup>
    )}
  </BoardContainer>
);

};

export default OL_MESSAGE_BOARD;
