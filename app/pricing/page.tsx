import Link from "next/link";

const FREE_FEATURES = [
  "All 18 skills — letters to root & pattern",
  "Audio pronunciation for every word",
  "Quranic examples in every lesson",
  "Interactive exercises with instant feedback",
  "Quran comprehension tracker (up to 85%)",
  "Root-based vocabulary system",
  "Progress saved on your device",
];

const PRO_FEATURES = [
  "Everything in the free curriculum",
  "12 live classes per month with your teacher",
  "Three cohorts: Beginner, Intermediate, Advanced",
  "Real-time correction and Q&A",
  "Class recordings within 24 hours",
  "Move between cohorts as you progress",
  "Direct access to teacher between classes",
  "Drill sheets and class notes",
];

export default function PricingPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh" }}>
      {/* Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
          padding: "0 5vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
        }}
      >
        <Link
          href="/"
          className="font-display"
          style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          Glow<span style={{ color: "var(--accent)" }}>Desk</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 14 }}>
          <Link href="/learn" style={{ color: "var(--ink-2)" }}>
            Curriculum
          </Link>
          <Link href="/" style={{ color: "var(--ink-2)" }}>
            Home
          </Link>
        </div>
      </nav>

      <section style={{ maxWidth: 960, margin: "0 auto", padding: "80px 5vw" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
              marginBottom: 16,
            }}
          >
            Pricing
          </p>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--ink)",
              marginBottom: 16,
            }}
          >
            Simple. One plan.
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "var(--ink-2)",
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            All 18 skills are free — no account required. The $50/month is for
            12 live classes per month with your teacher.
          </p>
        </div>

        {/* Plans */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            marginBottom: 64,
          }}
        >
          {/* Free plan */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "36px 32px",
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
                marginBottom: 12,
              }}
            >
              Free
            </p>
            <div style={{ marginBottom: 28 }}>
              <span
                className="font-display"
                style={{
                  fontSize: 52,
                  fontWeight: 700,
                  color: "var(--ink)",
                  letterSpacing: "-0.03em",
                }}
              >
                $0
              </span>
              <span
                style={{ fontSize: 15, color: "var(--ink-2)", marginLeft: 4 }}
              >
                / month
              </span>
            </div>
            <p
              style={{
                fontSize: 14,
                color: "var(--ink-2)",
                marginBottom: 28,
                lineHeight: 1.6,
              }}
            >
              The full curriculum — all 18 skills, no account required. Progress lives in your browser.
            </p>

            <div
              style={{
                height: 1,
                background: "var(--border)",
                marginBottom: 24,
              }}
            />

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
              {FREE_FEATURES.map((f) => (
                <li
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    marginBottom: 12,
                    fontSize: 14,
                    color: "var(--ink-2)",
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: "var(--good)", flexShrink: 0, marginTop: 1 }}>
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/learn"
              style={{
                display: "block",
                border: "1px solid var(--border)",
                color: "var(--ink)",
                padding: "13px 24px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                textAlign: "center",
              }}
            >
              Start free →
            </Link>
          </div>

          {/* Pro plan */}
          <div
            style={{
              background: "var(--ink)",
              borderRadius: 16,
              padding: "36px 32px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top accent bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: "var(--accent)",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                }}
              >
                Pro
              </p>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--ink)",
                  background: "var(--accent)",
                  padding: "3px 10px",
                  borderRadius: 999,
                }}
              >
                Best value
              </span>
            </div>

            <div style={{ marginBottom: 8 }}>
              <span
                className="font-display"
                style={{
                  fontSize: 52,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  letterSpacing: "-0.03em",
                }}
              >
                $50
              </span>
              <span style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginLeft: 4 }}>
                / month
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 28,
              }}
            >
              Cancel anytime.
            </p>

            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.7)",
                marginBottom: 28,
                lineHeight: 1.6,
              }}
            >
              12 live classes per month. Three cohorts — join the one that matches
              where you are. App curriculum is already free.
            </p>

            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.1)",
                marginBottom: 24,
              }}
            />

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
              {PRO_FEATURES.map((f) => (
                <li
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    marginBottom: 12,
                    fontSize: 14,
                    color: "rgba(255,255,255,0.8)",
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }}>
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="https://www.skool.com/master-builder-arabic-lab-7688"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                background: "var(--accent)",
                color: "#fff",
                padding: "14px 24px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Join the live classes — $50/month →
            </a>
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
                textAlign: "center",
                marginTop: 12,
              }}
            >
              Via Skool · Cancel anytime
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2
            className="font-display"
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: 32,
              letterSpacing: "-0.02em",
              textAlign: "center",
            }}
          >
            Questions
          </h2>

          {[
            {
              q: "What are the live classes like?",
              a: "12 classes per month — 3 per week. Your teacher runs each session live. You drill what you're working on, ask questions, and get real-time correction. Three cohorts so you're always with learners at your level.",
            },
            {
              q: "I'm a complete beginner. Can I still sign up?",
              a: "Yes. The curriculum starts from zero — the Arabic alphabet, letter shapes, vowel sounds. Many of our students have never seen Arabic before. The first 5 skills are free so you can try before committing.",
            },
            {
              q: "How long does it take to reach Quranic comprehension?",
              a: "Everyone's pace is different, but students who work consistently through all 18 skills and attend live classes regularly typically start feeling real comprehension within 3–6 months. The root-pattern system (Skill 18) is the unlock — once you have it, everything accelerates.",
            },
            {
              q: "What if I can't attend every live class?",
              a: "All classes are recorded. You get the recording within 24 hours. You can also move between cohorts as you progress.",
            },
            {
              q: "Do I need any prior knowledge of Arabic or Islam?",
              a: "No. The curriculum is secular-friendly — it teaches the language, not theology. The Quranic examples are used because it's the most important classical Arabic text, not for religious instruction.",
            },
          ].map((item) => (
            <div
              key={item.q}
              style={{
                paddingBottom: 24,
                marginBottom: 24,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--ink)",
                  marginBottom: 10,
                }}
              >
                {item.q}
              </p>
              <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.7 }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            textAlign: "center",
            marginTop: 64,
            padding: "48px 32px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
          }}
        >
          <p
            className="font-arabic"
            style={{
              fontSize: 32,
              color: "var(--accent)",
              marginBottom: 8,
              lineHeight: 1.6,
            }}
          >
            اِقْرَأِ الْقُرْآنَ وَافْهَمْهُ
          </p>
          <p
            style={{
              fontSize: 14,
              color: "var(--ink-3)",
              marginBottom: 28,
              fontStyle: "italic",
            }}
          >
            "Read the Quran and understand it."
          </p>
          <Link
            href="/learn"
            style={{
              display: "inline-block",
              border: "1px solid var(--border)",
              color: "var(--ink)",
              padding: "12px 28px",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 15,
              marginRight: 12,
            }}
          >
            Try free first
          </Link>
          <a
            href="https://www.skool.com/master-builder-arabic-lab-7688"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "var(--ink)",
              color: "var(--bg)",
              padding: "12px 28px",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            Join live classes → $50/month
          </a>
        </div>
      </section>

      <footer
        style={{
          padding: "40px 5vw",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <p style={{ fontSize: 13, color: "var(--ink-2)" }}>
          © 2026 GlowDesk LLC · Melbourne, FL
        </p>
        <div style={{ display: "flex", gap: 24, fontSize: 13, color: "var(--ink-2)" }}>
          <Link href="/learn">Curriculum</Link>
          <a href="mailto:hello@glowdesk.io">hello@glowdesk.io</a>
        </div>
      </footer>
    </div>
  );
}
