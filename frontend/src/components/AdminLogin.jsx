import { useState } from 'react';

export default function AdminLogin({ onLogin, onBack }) {
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/verify', {
        headers: { 'x-admin-password': password },
      });
      if (res.ok) {
        sessionStorage.setItem('adminPassword', password);
        onLogin(password);
      } else {
        setError('Senha incorreta. Tente novamente.');
      }
    } catch {
      setError('Erro ao conectar. Verifique o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card gold-top">
        <div className="login-logo">🏡 Chá de Casa Nova</div>
        <p className="login-sub">Acesso restrito ao organizador</p>

        <form onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="pw">Senha de acesso</label>
          <input
            id="pw"
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="••••••••"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          />
          {error && <div className="login-err">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Verificando…' : 'Entrar'}
          </button>
        </form>

        <button className="back-link" onClick={onBack}>← Voltar para a lista</button>
      </div>
    </div>
  );
}
