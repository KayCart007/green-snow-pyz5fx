import { useState, useEffect } from "react";

export default function App() {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [log, setLog] = useState([]);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [lastDate, setLastDate] = useState(() => {
    const stored = localStorage.getItem("lastDate");
    return stored ? new Date(stored) : new Date();
  });

  const [dailyChallenge, setDailyChallenge] = useState("");
  const [streakXpBonus, setStreakXpBonus] = useState(0);
  const [badges, setBadges] = useState([]);
  const [sideQuestCount, setSideQuestCount] = useState(0);
  const [mood, setMood] = useState("");
  const [moodXp, setMoodXp] = useState(0);
  const [taskStartTime, setTaskStartTime] = useState(null);

  // Daily Challenge setup
  useEffect(() => {
    const challenges = [
      "Read 10 pages today",
      "Reflect on your progress for 10 minutes",
      "Take notes on your learning",
      "Try a new study technique",
    ];

    const randomChallenge =
      challenges[Math.floor(Math.random() * challenges.length)];
    setDailyChallenge(randomChallenge);
  }, []);

  // Streak XP bonus and badge system
  useEffect(() => {
    const today = new Date();
    const todayString = today.toDateString();
    const lastString = lastDate.toDateString();

    if (todayString !== lastString) {
      const diffTime = today - lastDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        setStreak((prev) => prev + 1);
      } else {
        setStreak(1);
      }

      setLastDate(today);
      localStorage.setItem("lastDate", today.toISOString());
    }

    if (streak >= 7) {
      setStreakXpBonus(50); // +50 XP for 7-day streak
    } else {
      setStreakXpBonus(0);
    }
  }, [streak, lastDate]);

  // Badges and achievements
  useEffect(() => {
    if (xp >= 100 && !badges.includes("Page Turner")) {
      setBadges((prev) => [...prev, "Page Turner"]);
    }
    if (sideQuestCount >= 50 && !badges.includes("Side Quest Hero")) {
      setBadges((prev) => [...prev, "Side Quest Hero"]);
    }
  }, [xp, sideQuestCount]);

  // Task categories
  const taskCategories = {
    Initiation: [{ label: "Read 1–4 pages", value: 5 }],
    Engagement: [
      { label: "Read 5–14 pages", value: 10 },
      { label: "Read 15–24 pages", value: 15 },
      { label: "Read 25+ pages", value: 20 },
    ],
    Understanding: [
      { label: "Understanding it", value: 10 },
      { label: "Active recall", value: 5 },
      { label: "Linking to real world", value: 10 },
      { label: "Answering/discussing", value: 5 },
    ],
    Mastery: [
      { label: "Reading notes later", value: 10 },
      { label: "Teaching someone", value: 20 },
    ],
  };

  // Adding XP
  const addXp = (amount, label) => {
    const newXp = xp + amount;
    setXp(newXp);
    setLog((prev) => [...prev, { label, amount, timestamp: new Date() }]);

    if (Math.floor(newXp / 100) > Math.floor(xp / 100)) {
      triggerRewardAnimation();
    }
  };

  // Trigger reward animation
  const triggerRewardAnimation = () => {
    setShowRewardAnimation(true);
    setTimeout(() => setShowRewardAnimation(false), 5000);
  };

  // Daily Challenge completion
  const completeChallenge = () => {
    setXp((prev) => prev + 25);
    alert(`You've completed the challenge: ${dailyChallenge}! +25 XP`);
  };

  // Claim Streak XP Bonus
  const handleStreakXp = () => {
    setXp((prev) => prev + streakXpBonus);
    if (streakXpBonus > 0) {
      alert(`Bonus! You've earned ${streakXpBonus} XP for your streak!`);
    }
  };

  // Mood tracking
  const handleMoodChange = (newMood) => {
    setMood(newMood);
    if (newMood === "Happy" || newMood === "Motivated") {
      setMoodXp(10);
    } else {
      setMoodXp(0);
    }
  };

  const submitMood = () => {
    if (moodXp > 0) {
      setXp((prev) => prev + moodXp);
      alert(`You earned ${moodXp} XP for your mood!`);
    }
  };

  // Side Quest completion
  const [sideQuest, setSideQuest] = useState("");
  const completeSideQuest = () => {
    setXp((prev) => prev + 15);
    setSideQuestCount((prev) => prev + 1);
    setSideQuest("");
    alert("You completed a side quest! +15 XP");
  };

  // Time-based reward
  const startTask = () => {
    setTaskStartTime(new Date());
  };

  const completeTask = () => {
    const taskDuration = new Date() - taskStartTime;
    if (taskDuration <= 30 * 60 * 1000) {
      // 30 minutes
      setXp((prev) => prev + 10); // Bonus XP for finishing task within time
      alert("You completed this task quickly! +10 XP");
    }
    setTaskStartTime(null);
  };

  // Level calculations
  const level = Math.floor(xp / 700) + 1;
  const progressPercent = ((xp % 700) / 700) * 100;

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 600,
        margin: "0 auto",
        textAlign: "center",
        background: "linear-gradient(to right, #ff7e5f, #feb47b)",
      }}
    >
      <h1 style={{ color: "#fff" }}>Scholar Quest XP</h1>
      <p style={{ color: "#fff", fontSize: "1.2em" }}>XP: {xp}</p>
      <p style={{ color: "#fff", fontSize: "1.2em" }}>Level: {level}</p>
      <p style={{ color: "#fff", fontSize: "1.2em" }}>
        Daily Streak: {streak} day{streak > 1 ? "s" : ""}
      </p>

      <div style={{ margin: "20px 0" }}>
        <div
          style={{
            height: 25,
            width: "100%",
            backgroundColor: "#ddd",
            borderRadius: 12,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              backgroundColor: "#28a745",
              borderRadius: 12,
              transition: "width 0.5s",
            }}
          ></div>
        </div>
        <p style={{ color: "#fff" }}>
          {Math.floor(progressPercent)}% to next level
        </p>
      </div>

      {showRewardAnimation && (
        <div
          style={{
            margin: "20px 0",
            padding: 10,
            backgroundColor: "gold",
            color: "black",
            fontWeight: "bold",
            borderRadius: 10,
            animation: "pop 2s ease",
          }}
        >
          🎉 You earned 100 XP! Time to reward yourself! 🎉
        </div>
      )}

      {Object.entries(taskCategories).map(([category, tasks]) => (
        <div key={category} style={{ marginTop: 30 }}>
          <h2 style={{ color: "#fff" }}>{category}</h2>
          {tasks.map((task) => (
            <button
              key={task.label}
              onClick={() => addXp(task.value, task.label)}
              style={{
                margin: "5px",
                padding: "10px 15px",
                background: "linear-gradient(to right, #4facfe, #00f2fe)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              +{task.value} XP - {task.label}
            </button>
          ))}
        </div>
      ))}

      <div style={{ marginTop: 30, textAlign: "center" }}>
        <h3 style={{ color: "#fff" }}>Daily Challenge</h3>
        <p style={{ color: "#fff" }}>{dailyChallenge}</p>
        <button
          onClick={completeChallenge}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ff7e5f",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          Complete Challenge
        </button>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3 style={{ color: "#fff" }}>Mood Tracker</h3>
        <button
          onClick={() => handleMoodChange("Happy")}
          style={{
            padding: "10px 15px",
            margin: "5px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: 12,
          }}
        >
          Happy
        </button>
        <button
          onClick={() => handleMoodChange("Motivated")}
          style={{
            padding: "10px 15px",
            margin: "5px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 12,
          }}
        >
          Motivated
        </button>
        <button
          onClick={() => handleMoodChange("Neutral")}
          style={{
            padding: "10px 15px",
            margin: "5px",
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: 12,
          }}
        >
          Neutral
        </button>
        <button
          onClick={() => handleMoodChange("Sad")}
          style={{
            padding: "10px 15px",
            margin: "5px",
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: 12,
          }}
        >
          Sad
        </button>
        <br />
        <button
          onClick={submitMood}
          style={{
            padding: "10px 20px",
            marginTop: "20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 12,
          }}
        >
          Submit Mood
        </button>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3 style={{ color: "#fff" }}>Side Quest</h3>
        <textarea
          value={sideQuest}
          onChange={(e) => setSideQuest(e.target.value)}
          rows="4"
          cols="50"
          placeholder="Enter a side quest task here..."
          style={{
            padding: "10px",
            width: "100%",
            borderRadius: "10px",
            border: "1px solid #ddd",
            fontSize: "1em",
          }}
        ></textarea>
        <br />
        <button
          onClick={completeSideQuest}
          style={{
            marginTop: 10,
            padding: "10px 20px",
            backgroundColor: "#ff7e5f",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Complete Side Quest
        </button>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3 style={{ color: "#fff" }}>Task Time Tracker</h3>
        <button
          onClick={startTask}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4facfe",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Start Task
        </button>
        <button
          onClick={completeTask}
          style={{
            padding: "10px 20px",
            backgroundColor: "#00f2fe",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            fontWeight: "bold",
            marginLeft: "10px",
          }}
        >
          Complete Task
        </button>
      </div>
    </div>
  );
}
