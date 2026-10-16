import { NextRequest, NextResponse } from 'next/server';

// Proxy côté serveur vers les routes protégées de l'API : la clé admin reste
// sur Vercel et n'arrive jamais dans le navigateur.

export const dynamic = 'force-dynamic';

const API_BASE_URLS = {
  prod: 'https://hufyvhlacb.execute-api.us-west-2.amazonaws.com',
  dev: 'https://9ydbyn5j6h.execute-api.us-west-2.amazonaws.com',
} as const;

const ADMIN_API_KEYS = {
  prod: process.env.ADMIN_API_KEY_PROD,
  dev: process.env.ADMIN_API_KEY_STAGING,
} as const;

// Uniquement les lectures dont le dashboard a besoin : pas de proxy ouvert.
const ALLOWED_PATH = /^(admin\/.+|logs|events\/.+)$/;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const path = (await params).path.map(encodeURIComponent).join('/');
  if (!ALLOWED_PATH.test(path)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const env = request.nextUrl.searchParams.get('apiEnv') === 'dev' ? 'dev' : 'prod';
  const adminKey = ADMIN_API_KEYS[env];
  if (!adminKey) {
    return NextResponse.json({ error: `Clé admin ${env} non configurée` }, { status: 500 });
  }

  const query = new URLSearchParams(request.nextUrl.searchParams);
  query.delete('apiEnv');
  const queryString = query.toString();
  const upstreamUrl = `${API_BASE_URLS[env]}/${path}${queryString ? `?${queryString}` : ''}`;

  const upstream = await fetch(upstreamUrl, {
    headers: { 'x-admin-key': adminKey },
    cache: 'no-store',
  });
  return new NextResponse(await upstream.text(), {
    status: upstream.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
