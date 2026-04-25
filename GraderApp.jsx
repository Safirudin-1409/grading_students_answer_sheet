import { useState, useRef } from "react";

const N8N_WEBHOOK_URL = "https://safir1409.app.n8n.cloud/webhook/grade";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Outfit', sans-serif;
    background: #0e0e10;
    color: #f0ede8;
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    background: #0e0e10;
    padding: 48px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .header {
    text-align: center;
    margin-bottom: 52px;
  }

  .header-badge {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #c8a96e;
    background: rgba(200, 169, 110, 0.1);
    border: 1px solid rgba(200, 169, 110, 0.25);
    border-radius: 100px;
    padding: 6px 16px;
    margin-bottom: 20px;
  }

  .header h1 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(36px, 6vw, 58px);
    font-weight: 400;
    line-height: 1.1;
    color: #f0ede8;
    margin-bottom: 14px;
  }

  .header h1 em {
    font-style: italic;
    color: #c8a96e;
  }

  .header p {
    font-size: 15px;
    color: #7a7872;
    font-weight: 300;
    max-width: 400px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .card {
    background: #18181b;
    border: 1px solid #2a2a2e;
    border-radius: 20px;
    padding: 36px;
    width: 100%;
    max-width: 640px;
  }

  .field-label {
    display: block;
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #7a7872;
    margin-bottom: 10px;
  }

  .input {
    width: 100%;
    background: #0e0e10;
    border: 1px solid #2a2a2e;
    border-radius: 10px;
    padding: 12px 16px;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    color: #f0ede8;
    outline: none;
    transition: border-color 0.2s;
  }

  .input:focus { border-color: #c8a96e; }
  .input::placeholder { color: #3a3a3e; }

  .upload-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 24px;
  }

  .upload-zone {
    border: 1.5px dashed #2a2a2e;
    border-radius: 14px;
    padding: 28px 16px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    position: relative;
    background: #0e0e10;
  }

  .upload-zone:hover { border-color: #c8a96e; background: rgba(200,169,110,0.03); }
  .upload-zone.filled { border-style: solid; border-color: #c8a96e; background: rgba(200,169,110,0.05); }
  .upload-zone input { display: none; }

  .upload-icon {
    width: 36px;
    height: 36px;
    margin: 0 auto 10px;
    border-radius: 10px;
    background: #1e1e22;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .upload-zone.filled .upload-icon { background: rgba(200,169,110,0.15); }

  .upload-title {
    font-size: 12px;
    font-weight: 500;
    color: #b0aca5;
    margin-bottom: 4px;
  }

  .upload-hint {
    font-size: 11px;
    color: #3e3e42;
    font-family: 'DM Mono', monospace;
  }

  .file-name {
    font-size: 11px;
    color: #c8a96e;
    margin-top: 8px;
    word-break: break-all;
    line-height: 1.4;
  }

  .divider { height: 1px; background: #2a2a2e; margin: 28px 0; }

  .submit-btn {
    width: 100%;
    background: #c8a96e;
    color: #0e0e10;
    border: none;
    border-radius: 12px;
    padding: 15px;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .submit-btn:hover:not(:disabled) { opacity: 0.88; }
  .submit-btn:active:not(:disabled) { transform: scale(0.99); }
  .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(14,14,16,0.3);
    border-top-color: #0e0e10;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .error-box {
    background: rgba(226,75,74,0.08);
    border: 1px solid rgba(226,75,74,0.25);
    border-radius: 12px;
    padding: 14px 18px;
    font-size: 14px;
    color: #f09595;
    margin-top: 16px;
    font-weight: 400;
  }

  .results-section { margin-top: 40px; width: 100%; max-width: 640px; }

  .results-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  .results-header h2 {
    font-family: 'DM Serif Display', serif;
    font-size: 26px;
    font-weight: 400;
    color: #f0ede8;
  }

  .results-header .score-pill {
    background: rgba(200,169,110,0.12);
    border: 1px solid rgba(200,169,110,0.3);
    color: #c8a96e;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    padding: 4px 14px;
    border-radius: 100px;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 28px;
  }

  .metric-card {
    background: #18181b;
    border: 1px solid #2a2a2e;
    border-radius: 14px;
    padding: 18px 14px;
    text-align: center;
  }

  .metric-value {
    font-family: 'DM Serif Display', serif;
    font-size: 28px;
    color: #f0ede8;
    line-height: 1;
    margin-bottom: 6px;
  }

  .metric-value.gold { color: #c8a96e; }
  .metric-value.green { color: #5DCAA5; }
  .metric-value.red { color: #f09595; }

  .metric-label {
    font-size: 10px;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #3e3e42;
  }

  .questions-list { display: flex; flex-direction: column; gap: 10px; }

  .question-row {
    background: #18181b;
    border: 1px solid #2a2a2e;
    border-radius: 14px;
    padding: 18px 20px;
    display: grid;
    grid-template-columns: 40px 1fr 1fr 60px;
    align-items: center;
    gap: 16px;
    transition: border-color 0.15s;
  }

  .question-row:hover { border-color: #3a3a3e; }
  .question-row.correct { border-left: 3px solid #5DCAA5; }
  .question-row.wrong { border-left: 3px solid #f09595; }

  .q-num {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #3e3e42;
    font-weight: 500;
  }

  .q-answer-group { display: flex; flex-direction: column; gap: 4px; }

  .q-answer-label {
    font-size: 10px;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #3e3e42;
  }

  .q-answer-value {
    font-size: 14px;
    color: #b0aca5;
    font-weight: 400;
  }

  .q-answer-value.student { color: #f0ede8; }

  .q-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-left: auto;
    font-size: 15px;
  }

  .q-badge.correct { background: rgba(93,202,165,0.12); color: #5DCAA5; }
  .q-badge.wrong { background: rgba(240,149,149,0.12); color: #f09595; }

  @media (max-width: 500px) {
    .upload-grid { grid-template-columns: 1fr; }
    .metrics-grid { grid-template-columns: repeat(2, 1fr); }
    .question-row { grid-template-columns: 32px 1fr 1fr 40px; gap: 10px; padding: 14px; }
  }
`;

export default function GraderApp() {
  const [email, setEmail] = useState("");
  const [answerKey, setAnswerKey] = useState(null);
  const [answerSheet, setAnswerSheet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const keyRef = useRef();
  const sheetRef = useRef();

  const handleFile = (setter) => (e) => {
    const f = e.target.files[0];
    if (f) setter(f);
  };

  const handleDrop = (setter) => (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) setter(f);
  };

  const handleSubmit = async () => {
    if (!email || !answerKey || !answerSheet) {
      setError("Please fill in all fields and upload both files.");
      return;
    }
    setError("");
    setResults(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append("answer_key", answerKey, answerKey.name);
      form.append("answer_sheet", answerSheet, answerSheet.name);
      form.append("email", email);

      const res = await fetch(N8N_WEBHOOK_URL, { method: "POST", body: form });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const raw = await res.json();
      const data = Array.isArray(raw) ? raw[0] : raw;
      setResults(data);
    } catch (e) {
      setError(e.message || "Something went wrong. Check CORS settings on your n8n webhook.");
    } finally {
      setLoading(false);
    }
  };

  const pct = results?.score_percentage ?? 0;
  const pctColor = pct >= 75 ? "green" : pct >= 50 ? "gold" : "red";

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div className="header-badge">AI-Powered Grading</div>
          <h1>Grade with <em>intelligence</em></h1>
          <p>Upload an answer key and a student's answer sheet — get instant, detailed results.</p>
        </div>

        <div className="card">
          <label className="field-label">Student email</label>
          <input
            className="input"
            type="email"
            placeholder="student@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <div className="upload-grid">
            {[
              { label: "Answer Key", icon: "🗝", file: answerKey, setter: setAnswerKey, ref: keyRef },
              { label: "Answer Sheet", icon: "📄", file: answerSheet, setter: setAnswerSheet, ref: sheetRef },
            ].map(({ label, icon, file, setter, ref }) => (
              <div
                key={label}
                className={`upload-zone ${file ? "filled" : ""}`}
                onClick={() => ref.current.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop(setter)}
              >
                <input
                  ref={ref}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFile(setter)}
                />
                <div className="upload-icon">{icon}</div>
                <div className="upload-title">{label}</div>
                {file
                  ? <div className="file-name">{file.name}</div>
                  : <div className="upload-hint">PDF · PNG · JPG</div>
                }
              </div>
            ))}
          </div>

          <div className="divider" />

          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? <><div className="spinner" /> Analyzing…</> : "Grade Answer Sheet →"}
          </button>

          {error && <div className="error-box">{error}</div>}
        </div>

        {results && (
          <div className="results-section">
            <div className="results-header">
              <h2>Results</h2>
              <span className="score-pill">{results.marks_scored}/{results.total_marks} marks</span>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className={`metric-value ${pctColor}`}>{results.score_percentage}%</div>
                <div className="metric-label">Score</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{results.total_questions_attempted}</div>
                <div className="metric-label">Attempted</div>
              </div>
              <div className="metric-card">
                <div className="metric-value green">{results.correct}</div>
                <div className="metric-label">Correct</div>
              </div>
              <div className="metric-card">
                <div className="metric-value red">{results.wrong}</div>
                <div className="metric-label">Wrong</div>
              </div>
            </div>

            <div className="questions-list">
              {results.results?.map(q => (
                <div key={q.question_number} className={`question-row ${q.is_correct ? "correct" : "wrong"}`}>
                  <div className="q-num">Q{q.question_number}</div>
                  <div className="q-answer-group">
                    <div className="q-answer-label">Student</div>
                    <div className="q-answer-value student">{q.student_answer}</div>
                  </div>
                  <div className="q-answer-group">
                    <div className="q-answer-label">Correct</div>
                    <div className="q-answer-value">{q.correct_answer}</div>
                  </div>
                  <div className={`q-badge ${q.is_correct ? "correct" : "wrong"}`}>
                    {q.is_correct ? "✓" : "✗"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
