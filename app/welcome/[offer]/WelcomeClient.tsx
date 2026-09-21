"use client";

import { useState, useEffect } from "react";
import type { Offer } from "@/lib/types";

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  link?: string;
  linkText?: string;
}

export default function WelcomeClient({ offer }: { offer: Offer }) {
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);

  useEffect(() => {
    // Initialize tasks based on offer
    const baseTasks: OnboardingTask[] = [
      {
        id: "intake",
        title: "Complete your intake form",
        description: "Help me understand where you are and what you need from this experience.",
        completed: false,
        link: "#",
        linkText: "Start intake form",
      },
      {
        id: "calendar",
        title: "Add to your calendar",
        description: `Your ${offer.name} dates and calendar invite arrive by email.`,
        completed: false,
        link: "#",
        linkText: "Add to calendar",
      },
      {
        id: "community",
        title: "Join the community",
        description: "Connect with fellow participants in our private Slack group before the program begins.",
        completed: false,
        link: "#",
        linkText: "Join Slack",
      },
      {
        id: "resources",
        title: "Review pre-program resources",
        description: "Optional reading and practices to prepare for our first session together.",
        completed: false,
        link: "#",
        linkText: "View resources",
      },
    ];

    setTasks(baseTasks);
  }, [offer]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="wrap" style={{ maxWidth: 700, paddingTop: 80, paddingBottom: 100 }}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <h1 style={{ fontSize: 40, marginBottom: 12, fontFamily: '"Cormorant Garamond", serif' }}>
          Welcome home.
        </h1>
        <p className="muted" style={{ fontSize: 16, marginBottom: 20 }}>
          You're officially in. Let's get you ready for {offer.name}.
        </p>
        <div style={{ background: "#f7f3eb", padding: "16px 24px", borderRadius: 8, display: "inline-block" }}>
          <p style={{ fontSize: 14, margin: 0, color: "#1b1815" }}>
            <strong>{completedCount}</strong> of <strong>{tasks.length}</strong> onboarding steps complete
          </p>
          <div
            style={{
              height: 4,
              background: "#c9bfad",
              borderRadius: 2,
              marginTop: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "#5b4470",
                width: `${progress}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      </div>

      <div>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: "flex",
              gap: 16,
              padding: 24,
              background: task.completed ? "#f1ece5" : "#fff",
              border: "1px solid #c9bfad",
              borderRadius: 8,
              marginBottom: 12,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onClick={() => toggleTask(task.id)}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 20,
                height: 20,
                marginTop: 2,
                cursor: "pointer",
                accentColor: "#5b4470",
              }}
            />
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  margin: "0 0 8px",
                  color: task.completed ? "#8a7d78" : "#1b1815",
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              >
                {task.title}
              </h3>
              <p style={{ fontSize: 14, color: "#5c554c", margin: 0, marginBottom: 12 }}>
                {task.description}
              </p>
              {task.link && (
                <a
                  href={task.link}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    fontSize: 13,
                    color: "#5b4470",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  {task.linkText} →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 60, padding: 24, background: "#f7f3eb", borderRadius: 8, textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "#5c554c", margin: "0 0 12px" }}>
          Questions? Reach out — I'm here to support you.
        </p>
        <a
          href="mailto:hello@libni.co"
          style={{
            color: "#5b4470",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          hello@libni.co
        </a>
      </div>
    </div>
  );
}
