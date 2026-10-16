import { NextRequest, NextResponse } from 'next/server';

// Accès au dashboard protégé par identifiant / mot de passe (Basic Auth).
// Sans DASHBOARD_USER ou DASHBOARD_PASSWORD, tout est refusé.

export function proxy(request: NextRequest) {
  const expectedUser = process.env.DASHBOARD_USER;
  const expectedPassword = process.env.DASHBOARD_PASSWORD;

  if (expectedUser && expectedPassword) {
    const header = request.headers.get('authorization') ?? '';
    if (header.startsWith('Basic ')) {
      const decoded = atob(header.slice('Basic '.length));
      const separatorIndex = decoded.indexOf(':');
      const user = decoded.slice(0, separatorIndex);
      const password = decoded.slice(separatorIndex + 1);
      if (separatorIndex > 0 && safeEqual(user, expectedUser) && safeEqual(password, expectedPassword)) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse('Authentification requise', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Movietime dashboard", charset="UTF-8"' },
  });
}

// Comparaison sans arrêt au premier caractère différent.
function safeEqual(a: string, b: string) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export const config = {
  // Tout sauf les fichiers statiques de Next.js
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
