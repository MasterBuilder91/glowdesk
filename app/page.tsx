import Link from "next/link";

export default function Home() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)" }}>
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
        <span
          className="font-display"
          style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          Glow<span style={{ color: "var(--accent)" }}>Desk</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 14 }}>
          <Link href="/learn" style={{ color: "var(--ink-2)" }}>
            Curriculum
          </Link>
          <Link href="/pricing" style={{ color: "var(--ink-2)" }}>
            Pricing
          </Link>
          <Link
            href="/learn"
            style={{
              background: "var(--ink)",
              color: "var(--bg)",
              padding: "8px 20px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Start free →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "100px 5vw 80px",
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: 28,
          }}
        >
          Classical Arabic · Adult Learners
        </p>

        {/* Arabic headline */}
        <p
          className="font-arabic"
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: 8,
            lineHeight: 1.4,
          }}
        >
          اِقْرَأِ الْقُرْآنَ وَافْهَمْهُ
        </p>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(40px, 6vw, 80px)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--ink)",
            marginBottom: 32,
            maxWidth: 820,
          }}
        >
          Read the Quran.{" "}
          <span style={{ color: "var(--accent)" }}>Understand it.</span>
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "var(--ink-2)",
            maxWidth: 540,
            lineHeight: 1.75,
            marginBottom: 44,
          }}
        >
          18 structured skills take you from the Arabic alphabet to real Quranic
          comprehension — without memorizing rules out of context. Built by a
          teacher with 15+ years in the classroom.
        </p>

        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <Link
            href="/learn"
            style={{
              background: "var(--ink)",
              color: "var(--bg)",
              padding: "14px 32px",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            Open the full curriculum — free
          </Link>
          <Link
            href="/pricing"
            style={{ color: "var(--ink-2)", fontSize: 15 }}
          >
            See full plan →
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <div
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "28px 5vw",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 32,
            textAlign: "center",
          }}
        >
          {[
            { num: "18", label: "Structured skills" },
            { num: "12", label: "Live classes/month" },
            { num: "85%", label: "Quran comprehension" },
            { num: "15+", label: "Years teaching" },
          ].map((s) => (
            <div key={s.label}>
              <p
                className="font-display"
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: "var(--accent)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                {s.num}
              </p>
              <p style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 6 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "80px 5vw",
        }}
      >
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
          The method
        </p>
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
            marginBottom: 16,
          }}
        >
          Not flashcards. Not videos. Actual comprehension.
        </h2>
        <p
          style={{
            fontSize: 17,
            color: "var(--ink-2)",
            maxWidth: 620,
            lineHeight: 1.75,
            marginBottom: 60,
          }}
        >
          Most Arabic apps teach you vocabulary lists. We teach you the{" "}
          <em>mechanism</em> — the root-and-pattern system behind every Arabic
          word — so you can decode words you've never seen. Then you drill it on
          real Quranic text.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 2,
            background: "var(--border)",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid var(--border)",
          }}
        >
          {[
            {
              num: "01",
              title: "Skill by skill",
              body:
                "18 skills, each unlockable when you're ready. Letters → vowels → grammar → roots. Every step builds on the last.",
            },
            {
              num: "02",
              title: "Quranic context always",
              body:
                "Every skill ends with a real verse from the Quran. You see the grammar you just learned working in the actual text.",
            },
            {
              num: "03",
              title: "Root & pattern unlock",
              body:
                "Skill 18 teaches the root system — the real secret. Learn one root and you recognize 5–10 related Quranic words immediately.",
            },
            {
              num: "04",
              title: "Live with your teacher",
              body:
                "12 live classes per month. Ask questions, get corrections, drill together. Three cohorts: beginner, intermediate, advanced.",
            },
          ].map((item) => (
            <div
              key={item.num}
              style={{
                background: "var(--surface)",
                padding: "40px 32px",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: 16,
                }}
              >
                {item.num}
              </p>
              <h3
                className="font-display"
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: 12,
                  letterSpacing: "-0.01em",
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.7 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills preview */}
      <section
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "80px 5vw",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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
            The curriculum
          </p>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              marginBottom: 48,
            }}
          >
            18 skills. One coherent path.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 12,
            }}
          >
            {[
              { id: 1, title: "Letters & Forms", ar: "الحُرُوف", level: "beginner" },
              { id: 2, title: "Short Vowels", ar: "الحَرَكَات", level: "beginner" },
              { id: 3, title: "Sounding Out Letters", ar: "التَّجْوِيد الأَسَاسِي", level: "beginner" },
              { id: 4, title: "High-Frequency Words", ar: "الكَلِمَات الأَسَاسِيَّة", level: "beginner" },
              { id: 5, title: "Pronouns", ar: "الضَّمَائِر", level: "beginner" },
              { id: 6, title: "Demonstratives", ar: "أَسْمَاء الإِشَارَة", level: "beginner" },
              { id: 7, title: "Gender & The", ar: "التَّعْرِيف والجِنْس", level: "intermediate" },
              { id: 8, title: "Adjective Agreement", ar: "الصِّفَة", level: "intermediate" },
              { id: 9, title: "Prepositions", ar: "حُرُوف الجَرّ", level: "intermediate" },
              { id: 10, title: "Location & Time Words", ar: "الظُّرُوف", level: "intermediate" },
              { id: 11, title: "Present-Tense Verbs", ar: "الفِعْل المُضَارِع", level: "intermediate" },
              { id: 12, title: "Negation & Questions", ar: "النَّفْي والاسْتِفْهَام", level: "intermediate" },
              { id: 13, title: "Possession (Iḍāfa)", ar: "الإِضَافَة", level: "advanced" },
              { id: 14, title: "Plurals", ar: "الجَمْع", level: "advanced" },
              { id: 15, title: "Dual Number", ar: "الْمُثَنَّى", level: "advanced" },
              { id: 16, title: "Past-Tense Verbs", ar: "الفِعْل الْمَاضِي", level: "advanced" },
              { id: 17, title: "High-Frequency Quran Words", ar: "كَلِمَات القُرْآن الشَّائِعَة", level: "advanced" },
              { id: 18, title: "Root & Pattern — The Real Secret", ar: "الجَذْر والوَزْن", level: "advanced" },
            ].map((skill) => (
              <div
                key={skill.id}
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--accent)",
                    minWidth: 24,
                  }}
                >
                  {skill.id}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
                    {skill.title}
                  </p>
                  <p
                    className="font-arabic"
                    style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 2, direction: "rtl", textAlign: "left" }}
                  >
                    {skill.ar}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: skill.level === "beginner" ? "var(--good)" : skill.level === "intermediate" ? "var(--gold)" : "var(--accent)",
                    background: skill.level === "beginner" ? "rgba(26,122,62,0.1)" : skill.level === "intermediate" ? "rgba(196,149,42,0.1)" : "var(--accent-light)",
                    padding: "3px 10px",
                    borderRadius: 999,
                    textTransform: "capitalize",
                  }}
                >
                  {skill.level}
                </span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link
              href="/learn"
              style={{
                background: "var(--ink)",
                color: "var(--bg)",
                padding: "14px 40px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 16,
                display: "inline-block",
              }}
            >
              Start with the free skills →
            </Link>
          </div>
        </div>
      </section>

      {/* Root & Pattern teaser */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "80px 5vw",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
          }}
        >
          <div>
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
              Skill 18
            </p>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--ink)",
                marginBottom: 20,
                lineHeight: 1.2,
              }}
            >
              One root.<br />
              Seven words you didn't know you knew.
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "var(--ink-2)",
                lineHeight: 1.8,
                marginBottom: 32,
              }}
            >
              Arabic builds every word from a 3-letter root. Learn the root
              ك-ت-ب (writing) and you instantly recognize كِتَاب (book),
              كَاتِب (writer), مَكْتُوب (letter), and مَكْتَبَة (library) —
              without ever studying those words separately.
            </p>
            <Link
              href="/pricing"
              style={{
                color: "var(--accent)",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Unlock all 18 skills →
            </Link>
          </div>

          {/* Root tree visual */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "32px",
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
                marginBottom: 20,
              }}
            >
              Root: ك-ت-ب (writing)
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { arabic: "كَتَبَ", roman: "kataba", meaning: "he wrote", pattern: "فَعَلَ — verb" },
                { arabic: "كِتَاب", roman: "kitāb", meaning: "book", pattern: "فِعَال — result" },
                { arabic: "كَاتِب", roman: "kātib", meaning: "writer", pattern: "فَاعِل — doer" },
                { arabic: "مَكْتُوب", roman: "maktūb", meaning: "written / letter", pattern: "مَفْعُول — done-to" },
                { arabic: "كِتَابَة", roman: "kitāba", meaning: "the act of writing", pattern: "مَصْدَر — verbal noun" },
                { arabic: "مَكْتَبَة", roman: "maktaba", meaning: "library", pattern: "مَفْعَلَة — place noun" },
              ].map((item) => (
                <div
                  key={item.arabic}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    paddingBottom: 14,
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <span
                    className="font-arabic"
                    style={{
                      fontSize: 24,
                      color: "var(--accent)",
                      minWidth: 80,
                      textAlign: "right",
                    }}
                  >
                    {item.arabic}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
                      {item.roman} — {item.meaning}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                      {item.pattern}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section
        style={{
          background: "var(--ink)",
          padding: "80px 5vw",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 700,
                color: "var(--bg)",
                letterSpacing: "-0.02em",
                marginBottom: 8,
              }}
            >
              $50/month. 12 live classes with your teacher.
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>
              All 18 skills are free. The classes are where it comes together.
            </p>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link
              href="/pricing"
              style={{
                background: "var(--accent)",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 16,
                whiteSpace: "nowrap",
              }}
            >
              See pricing
            </Link>
            <Link
              href="/learn"
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.7)",
                padding: "13px 28px",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              Start free first
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
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
          <Link href="/pricing">Pricing</Link>
          <a href="mailto:hello@glowdesk.io">hello@glowdesk.io</a>
        </div>
      </footer>
    </div>
  );
}
