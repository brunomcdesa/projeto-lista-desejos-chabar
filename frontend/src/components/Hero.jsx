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

export default function Hero({ total, purchased, guestName }) {
  const available = total - purchased;
  const firstName = guestName ? guestName.split(' ')[0] : '';

  return (
    <div className="gifts-header gold-top">
      <div className="hero-bot-left" style={{ top: 16, opacity: 0.5 }}><Sprig /></div>
      <div className="hero-bot-right" style={{ top: 16, opacity: 0.5 }}><Sprig /></div>
      {firstName && <div className="gifts-greeting">Olá, {firstName}! 🌿</div>}
      <h2 className="gifts-title">Lista de Presentes</h2>
      <p className="gifts-sub">Escolha um item para reservar. Você pode cancelar a qualquer momento.</p>
      {total > 0 && (
        <div className="gifts-count">
          <strong>{available}</strong> de {total} itens ainda disponíveis
        </div>
      )}
    </div>
  );
}
