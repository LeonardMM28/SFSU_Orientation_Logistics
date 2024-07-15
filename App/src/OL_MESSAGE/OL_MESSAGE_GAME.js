import React, { useEffect, useRef, useState } from "react";
import {
  MiniGameArea as MiniGameAreaStyle,
  FightButton,
  LifeBar,
  Life,
  Monster,
  HitWord,
  Symbol,
} from "./OL_MESSAGE_BOARD_STYLES";
import { GiSnakeSpiral } from "react-icons/gi";

const defeatWords = {
  "Procrastination_Phantom.png": [
    "Planning",
    "Responsibility",
    "Discipline",
    "Focus",
    "Time Management",
    "Motivation",
    "Goal Setting",
    "Prioritization",
    "Action",
    "Determination",
    "Efficiency",
    "Deadline",
    "Schedule",
    "Routine",
    "Commitment",
    "Proactivity",
    "Initiative",
    "Follow-through",
    "Consistency",
    "Self-Control",
    "Accountability",
  ],
  "Mental_Health_Monster.png": [
    "Support",
    "Therapy",
    "Exercise",
    "Meditation",
    "Sleep",
    "Healthy Eating",
    "Socializing",
    "Journaling",
    "Mindfulness",
    "Nature",
    "Relaxation",
    "Self-Care",
    "Boundaries",
    "Acceptance",
    "Compassion",
    "Positivity",
    "Resilience",
    "Routine",
    "Hydration",
    "Breathing",
    "Gratitude",
  ],
  "Information_Overload_Ogre.png": [
    "Organize",
    "Prioritize",
    "Breakdown",
    "Limit",
    "Focus",
    "Simplify",
    "Filter",
    "Delegate",
    "Batching",
    "Single-tasking",
    "Silence Notifications",
    "Schedule",
    "Declutter",
    "Categorize",
    "Routine",
    "Clear Goals",
    "Time Blocking",
    "Pause",
    "Minimalism",
    "Essentialism",
    "Decline",
  ],
  "Burnout_Beast.png": [
    "Rest",
    "Balance",
    "Break",
    "Delegation",
    "Boundaries",
    "Vacation",
    "Hobby",
    "Social Support",
    "Self-Care",
    "Mindfulness",
    "Sleep",
    "Healthy Eating",
    "Exercise",
    "Gratitude",
    "Meditation",
    "Positivity",
    "Relaxation",
    "Unplug",
    "Flexibility",
    "Joy",
    "Passion",
  ],
  "Work_Life_Imbalance_Wraith.png": [
    "Balance",
    "Time Off",
    "Hobby",
    "Family",
    "Rest",
    "Boundaries",
    "Exercise",
    "Relaxation",
    "Vacation",
    "Flexibility",
    "Socializing",
    "Self-Care",
    "Routine",
    "Prioritize",
    "Delegation",
    "Mindfulness",
    "Sleep",
    "Healthy Eating",
    "Joy",
    "Positivity",
    "Passion",
  ],
  "Student_Debt_Serpent.png": [
    "Scholarships",
    "Grants",
    "Savings",
    "Budgeting",
    "Jobs",
    "Work-Study",
    "Financial Aid",
    "Loans",
    "Cost Cutting",
    "Expense Tracking",
    "Side Hustle",
    "Internships",
    "Freelancing",
    "Grants",
    "Merit Aid",
    "Negotiation",
    "Stipends",
    "Crowdfunding",
    "Subsidies",
    "Emergency Fund",
    "Investment",
  ],
  "Budget_Cut_Beast.png": [
    "Efficiency",
    "Innovation",
    "Savings",
    "Fundraising",
    "Grants",
    "Cost Reduction",
    "Sponsorship",
    "Partnerships",
    "Revenue Streams",
    "Optimization",
    "Crowdfunding",
    "Donations",
    "Cost Sharing",
    "Streamlining",
    "Volunteerism",
    "Resource Allocation",
    "Outsourcing",
    "Shared Services",
    "Automation",
    "Lean Practices",
    "Grants",
  ],
  "Tuition_Hike_Hydra.png": [
    "Scholarships",
    "Financial Aid",
    "Work-Study",
    "Budgeting",
    "Savings",
    "Grants",
    "Loans",
    "Cost Cutting",
    "Expense Tracking",
    "Crowdfunding",
    "Part-time Job",
    "Internships",
    "Freelancing",
    "Negotiation",
    "Stipends",
    "Merit Aid",
    "Subsidies",
    "Investment",
    "Emergency Fund",
    "Savings Plans",
    "Employer Assistance",
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
  const [isHit, setIsHit] = useState(false);
  const [isDefeated, setIsDefeated] = useState(false);
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
    }
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
