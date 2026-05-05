import { useState } from 'react';

const NOME1 = 'Bruno';
const NOME2 = 'Carol';
const DATA_EVENTO = 'DD de Mês de AAAA';

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1.25rem',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: '2.5rem 2rem',
    maxWidth: 460,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'var(--accent)',
  },
  eyebrow: {
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
    fontWeight: 500,
    color: 'var(--text)',
    textAlign: 'center',
    lineHeight: 1.2,
    marginBottom: '0.4rem',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--muted)',
    textAlign: 'center',
    marginBottom: '0.5rem',
    letterSpacing: '0.05em',
  },
  intro: {
    fontSize: '0.88rem',
    color: 'var(--muted)',
    textAlign: 'center',
    lineHeight: 1.65,
    marginBottom: '1.75rem',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid var(--border)',
    margin: '0 0 1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.35rem',
  },
  group: { marginBottom: '1rem' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  input: {
    width: '100%',
    padding: '0.65rem 0.9rem',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: '0.95rem',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text)',
    background: 'var(--bg)',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '0.65rem 0.9rem',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: '0.95rem',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text)',
    background: 'var(--bg)',
    outline: 'none',
    appearance: 'none',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0.65rem 0.9rem',
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: '0.95rem',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text)',
    background: 'var(--bg)',
    outline: 'none',
    resize: 'vertical',
    minHeight: 72,
    boxSizing: 'border-box',
  },
  error: {
    fontSize: '0.82rem',
    color: '#dc2626',
    marginBottom: '1rem',
    padding: '0.5rem 0.75rem',
    background: '#fef2f2',
    borderRadius: 6,
    border: '1px solid #fca5a5',
  },
  btnSubmit: {
    width: '100%',
    padding: '0.9rem',
    background: 'var(--accent)',
    border: 'none',
    borderRadius: 10,
    fontSize: '1rem',
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
    marginTop: '0.25rem',
    fontFamily: 'var(--font-sans)',
  },
  skipBtn: {
    display: 'block',
    width: '100%',
    textAlign: 'center',
    marginTop: '1rem',
    fontSize: '0.82rem',
    color: 'var(--muted)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontFamily: 'var(--font-sans)',
    padding: '0.25rem',
    textDecoration: 'underline',
  },
  successWrap: { textAlign: 'center', padding: '0.5rem 0' },
  successIcon: { fontSize: '3.5rem', marginBottom: '1rem', display: 'block' },
  successTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.5rem',
    color: 'var(--text)',
    marginBottom: '0.5rem',
  },
  successText: {
    fontSize: '0.9rem',
    color: 'var(--muted)',
    lineHeight: 1.65,
    marginBottom: '1.5rem',
  },
  btnGifts: {
    display: 'inline-block',
    padding: '0.75rem 2rem',
    background: 'var(--accent)',
    border: 'none',
    borderRadius: 10,
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
  },
};

export default function RsvpScreen({ onConfirmed }) {
  const [form, setForm] = useState({ name: '', phone: '', companions: '0', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Por favor, informe seu nome.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, companions: Number(form.companions) }),
      });
      if (res.ok || res.status === 409) {
        localStorage.setItem('chabar_rsvp', JSON.stringify({ name: form.name.trim(), confirmedAt: new Date().toISOString() }));
        setSuccess(true);
      } else {
        setError('Ocorreu um erro. Tente novamente.');
      }
    } catch {
      setError('Ocorreu um erro. Verifique sua conexão e tente novamente.');
    }
    setLoading(false);
  };

  const handleGoToGifts = () => {
    const stored = localStorage.getItem('chabar_rsvp');
    const name = stored ? JSON.parse(stored).name : form.name.trim() || '';
    onConfirmed(name);
  };

  const handleSkip = () => {
    localStorage.setItem('chabar_rsvp', JSON.stringify({ name: '', confirmedAt: new Date().toISOString() }));
    onConfirmed('');
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.accentBar} />

        {success ? (
          <div style={s.successWrap}>
            <span style={s.successIcon}>🎉</span>
            <p style={s.successTitle}>Presença confirmada!</p>
            <p style={s.successText}>
              Obrigado, <strong>{form.name.trim()}</strong>! Ficamos felizes em ter você com a gente.<br />
              Agora veja nossa lista de presentes!
            </p>
            <button style={s.btnGifts} onClick={handleGoToGifts}>
              Ver lista de presentes →
            </button>
          </div>
        ) : (
          <>
            <p style={s.eyebrow}>Chá Bar · Confirmação de Presença</p>
            <h1 style={s.title}>{NOME1} &amp; {NOME2}</h1>
            <p style={s.subtitle}>{DATA_EVENTO}</p>
            <p style={s.intro}>
              Sua presença é o nosso maior presente.<br />
              Confirme abaixo para que possamos te aguardar!
            </p>

            <hr style={s.divider} />

            {error && <p style={s.error}>{error}</p>}

            <div style={s.group}>
              <label style={s.label}>Seu nome *</label>
              <input
                style={s.input}
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Como devemos te chamar?"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            <div style={s.row}>
              <div>
                <label style={s.label}>WhatsApp</label>
                <input
                  style={s.input}
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  type="tel"
                />
              </div>
              <div>
                <label style={s.label}>Acompanhantes</label>
                <select
                  style={s.select}
                  value={form.companions}
                  onChange={(e) => set('companions', e.target.value)}
                >
                  {[0,1,2,3,4,5,6,7,8,9].map((n) => (
                    <option key={n} value={n}>
                      {n === 0 ? 'Só eu' : n === 1 ? '1 pessoa' : `${n} pessoas`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={s.group}>
              <label style={s.label}>Mensagem (opcional)</label>
              <textarea
                style={s.textarea}
                value={form.message}
                onChange={(e) => set('message', e.target.value)}
                placeholder="Deixe um recado para os noivos..."
              />
            </div>

            <button
              style={{ ...s.btnSubmit, opacity: loading ? 0.7 : 1 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Confirmando...' : 'Confirmar presença'}
            </button>

            <button style={s.skipBtn} onClick={handleSkip}>
              Já confirmei, quero ver a lista de presentes →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
