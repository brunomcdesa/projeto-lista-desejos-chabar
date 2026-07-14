// A chave do convidado é derivada do nome confirmado no RSVP (hash SHA-256).
// Assim, ao confirmar o mesmo nome em outro aparelho, a pessoa recupera as
// próprias reservas — e o servidor só guarda o hash, nunca o nome.

const CONNECTIVES = new Set(['da', 'de', 'do', 'das', 'dos', 'e']);

// Exige pelo menos duas palavras "de verdade" (conectivos como "da" não contam)
export function hasSurname(name) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter((w) => /\p{L}{2,}/u.test(w) && !CONNECTIVES.has(w.toLowerCase()));
  return words.length >= 2;
}

// Padroniza para formato título: "bruno DA silva" -> "Bruno da Silva"
export function formatName(name) {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .split(' ')
    .map((w) => (CONNECTIVES.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

function normalizeName(name) {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

export async function keyFromName(name) {
  const norm = normalizeName(name);
  if (crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(norm));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Fallback (contexto não seguro): hash djb2 simples
  let h = 5381;
  for (const c of norm) h = ((h * 33) ^ c.codePointAt(0)) >>> 0;
  return `n${h.toString(36)}-${norm.length}`;
}

// Retorna a chave atual e, se o aparelho ainda usa a chave aleatória antiga,
// devolve-a como `legacy` para o servidor migrar as reservas.
export async function resolveGuestKey() {
  const stored = localStorage.getItem('chabar_guest_key');
  let rsvpName = null;
  try {
    rsvpName = JSON.parse(localStorage.getItem('chabar_rsvp'))?.name || null;
  } catch {
    rsvpName = null;
  }

  if (!rsvpName) {
    if (stored) return { key: stored };
    const key = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('chabar_guest_key', key);
    return { key };
  }

  const key = await keyFromName(rsvpName);
  if (stored && stored !== key) return { key, legacy: stored };
  localStorage.setItem('chabar_guest_key', key);
  return { key };
}
