import { useState, useEffect } from 'react';

const NOME1 = 'Bruno';
const NOME2 = 'Carol';
const DATA_EVENTO = 'Sábado, 05 de Setembro de 2026';
const HORA_EVENTO = '14h às 22h';
const LOCAL_EVENTO = 'Rua Bélgica, 947 — Igapó';

const Sprig = () => (
  <svg width="110" height="160" viewBox="0 0 110 160" fill="none">
    <path d="M58 155 C56 120 52 88 44 58" stroke="#7D9E8C" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M47 105 C30 96 22 80 28 72 C37 79 43 92 47 105Z" fill="#7D9E8C" fillOpacity="0.18" stroke="#7D9E8C" strokeWidth="1.1" strokeLinejoin="round"/>
    <path d="M47 105 C64 96 70 80 64 72 C55 79 50 92 47 105Z" fill="#7D9E8C" fillOpacity="0.13" stroke="#7D9E8C" strokeWidth="1.1" strokeLinejoin="round"/>
    <path d="M45 79 C28 70 21 54 27 46 C36 53 41 66 45 79Z" fill="#7D9E8C" fillOpacity="0.16" stroke="#7D9E8C" strokeWidth="1.1" strokeLinejoin="round"/>
    <path d="M45 79 C62 70 67 54 61 46 C52 53 47 66 45 79Z" fill="#7D9E8C" fillOpacity="0.11" stroke="#7D9E8C" strokeWidth="1.1" strokeLinejoin="round"/>
    <path d="M44 55 C29 46 23 30 30 22 C38 29 42 42 44 55Z" fill="#7D9E8C" fillOpacity="0.12" stroke="#7D9E8C" strokeWidth="1" strokeLinejoin="round"/>
    <path d="M44 55 C59 46 63 30 56 22 C48 29 45 42 44 55Z" fill="#7D9E8C" fillOpacity="0.09" stroke="#7D9E8C" strokeWidth="1" strokeLinejoin="round"/>
    <circle cx="44" cy="22" r="2.8" fill="#C9A84C" fillOpacity="0.72"/>
    <circle cx="37" cy="17" r="2" fill="#C9A84C" fillOpacity="0.5"/>
    <circle cx="51" cy="16" r="1.8" fill="#C9A84C" fillOpacity="0.45"/>
  </svg>
);

const GoldDivider = () => (
  <div className="divider-gold">
    <div className="line" /><div className="dot">◆ ◆ ◆</div><div className="line" />
  </div>
);

function SuccessScreen({ name }) {
  return (
    <div className="success-screen">
      <div className="success-circle">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
          <path
            className="success-check"
            d="M11 21 L18 28 L31 14"
            stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="success-title">Presença confirmada!</h2>
      <p className="success-sub">
        Que alegria, <strong>{name.split(' ')[0] || name}</strong>!<br />
        Preparando a lista de presentes…
      </p>
    </div>
  );
}

export default function RsvpScreen({ onConfirmed }) {
  const [name, setName]             = useState('');
  const [companions, setCompanions] = useState(0);
  const [compNames, setCompNames]   = useState([]);
  const [message, setMessage]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [nameErr, setNameErr]       = useState('');
  const [success, setSuccess]       = useState(false);

  const changeCompanions = (delta) => {
    setCompanions((c) => {
      const next = Math.max(0, c + delta);
      setCompNames((prev) => {
        if (next > prev.length) return [...prev, ...Array(next - prev.length).fill('')];
        return prev.slice(0, next);
      });
      return next;
    });
  };

  const setCompNameAt = (idx, val) => {
    setCompNames((prev) => { const n = [...prev]; n[idx] = val; return n; });
  };

  const handleSubmit = async () => {
    if (!name.trim()) { setNameErr('Por favor, informe seu nome.'); return; }
    setNameErr('');
    setLoading(true);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), companions, compNames, message }),
      });
      if (res.ok || res.status === 409) {
        localStorage.setItem('chabar_rsvp', JSON.stringify({ name: name.trim(), confirmedAt: new Date().toISOString() }));
        setSuccess(true);
        setTimeout(() => onConfirmed(name.trim()), 2300);
      } else {
        setNameErr('Ocorreu um erro. Tente novamente.');
      }
    } catch {
      setNameErr('Ocorreu um erro. Verifique sua conexão e tente novamente.');
    }
    setLoading(false);
  };

  if (success) return <SuccessScreen name={name} />;

  const compLabel =
    companions === 0 ? 'sem acompanhante' :
    companions === 1 ? 'acompanhante' :
    'acompanhantes';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="hero gold-top">
        <div className="hero-bot-left"><Sprig /></div>
        <div className="hero-bot-right"><Sprig /></div>
        <div className="event-tag">Você está convidado/a</div>
        <h1 className="hero-title">Chá de Casa Nova</h1>
        <p className="hero-names">de {NOME1} &amp; {NOME2}</p>
        <div className="hero-rule" />
        <div className="hero-details">
          <span className="hero-detail">📅 {DATA_EVENTO} · {HORA_EVENTO}</span>
          <span className="hero-detail">📍 {LOCAL_EVENTO}</span>
        </div>
      </div>

      <div className="form-section">
        <p className="form-intro">
          Confirme sua presença abaixo e explore nossa lista de presentes 🏡
        </p>
        <div className="form-card">
          <GoldDivider />

          <div className="form-field">
            <label className="form-label">
              Nome completo <span className="req">*</span>
            </label>
            <input
              type="text"
              className={`field-input${nameErr ? ' error' : ''}`}
              value={name}
              onChange={(e) => { setName(e.target.value); setNameErr(''); }}
              placeholder="Como prefere ser chamado/a"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            {nameErr && <span className="field-err">{nameErr}</span>}
          </div>

          <div className="form-field">
            <label className="form-label">
              Acompanhantes <span className="opt">(adultos + crianças)</span>
            </label>
            <div className="stepper">
              <button className="step-btn" onClick={() => changeCompanions(-1)} disabled={companions === 0}>−</button>
              <span className="step-val">{companions}</span>
              <button className="step-btn" onClick={() => changeCompanions(+1)}>+</button>
              <span className="step-label">{compLabel}</span>
            </div>
          </div>

          {companions > 0 && (
            <div className="comp-names">
              <label className="form-label" style={{ marginBottom: 2 }}>
                Nome dos acompanhantes{' '}
                <span className="opt">(para {NOME1} e {NOME2} saberem quem virá)</span>
              </label>
              {compNames.map((cn, i) => (
                <div key={i} className="comp-row">
                  <span className="comp-idx">{i + 1}</span>
                  <input
                    type="text"
                    className="field-input"
                    value={cn}
                    onChange={(e) => setCompNameAt(i, e.target.value)}
                    placeholder={`Acompanhante ${i + 1}`}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="form-field">
            <label className="form-label">Mensagem <span className="opt">(opcional)</span></label>
            <textarea
              className="field-input"
              value={message}
              rows={3}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Uma palavrinha pra ${NOME1} e ${NOME2}…`}
            />
          </div>

          <GoldDivider />

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <><div className="spinner" />&nbsp;Confirmando…</> : 'Confirmar Presença'}
          </button>
        </div>
      </div>

      <div className="admin-link">
        <a href="?admin">Área do organizador →</a>
      </div>
    </div>
  );
}
