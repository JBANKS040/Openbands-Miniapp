function withValidProperties(
  properties: Record<string, undefined | string | string[] | boolean>
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'boolean') return true; // keep both true and false
      return !!value;
    })
  );
}

function parseAllowedAddresses(input: unknown): string[] | undefined {
  if (!input) return undefined;
  if (Array.isArray(input)) return input as string[];
  if (typeof input === 'string') {
    try {
      const asJson = JSON.parse(input);
      if (Array.isArray(asJson)) return asJson as string[];
    } catch {
      return input
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return undefined;
}

function parseTags(input: unknown): string[] | undefined {
  const normalize = (s: string) => s.toLowerCase().trim();
  const valid = (s: string) => /^[a-z0-9-]{1,20}$/.test(s);
  let tags: string[] = [];
  if (!input) return undefined;
  if (Array.isArray(input)) tags = input as string[];
  else if (typeof input === 'string') {
    try {
      const asJson = JSON.parse(input);
      if (Array.isArray(asJson)) tags = asJson as string[];
      else tags = input.split(',');
    } catch {
      tags = input.split(',');
    }
  }
  const cleaned = Array.from(new Set(tags.map(normalize).filter(valid))).slice(0, 5);
  return cleaned.length > 0 ? cleaned : undefined;
}

function parseRequiredChains(input: unknown): string[] | undefined {
  if (!input) return undefined;
  if (Array.isArray(input)) return input as string[];
  if (typeof input === 'string') {
    try {
      const asJson = JSON.parse(input);
      if (Array.isArray(asJson)) return asJson as string[];
    } catch {
      return input
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return undefined;
}

function parseScreenshotUrls(input: unknown): string[] | undefined {
  const toArray = (val: unknown): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val as string[];
    if (typeof val === 'string') {
      try {
        const asJson = JSON.parse(val);
        if (Array.isArray(asJson)) return asJson as string[];
      } catch {
        return val.split(',');
      }
    }
    return [];
  };
  const urls = toArray(input)
    .map((u) => u.trim())
    .filter((u) => /^https:\/\//i.test(u))
    .slice(0, 3);
  return urls.length ? urls : undefined;
}

export async function GET(req: Request) {
  const envUrl = process.env.NEXT_PUBLIC_URL;
  const inferredOrigin = (() => {
    try {
      return new URL(req.url).origin;
    } catch {
      return undefined;
    }
  })();
  const rawBase = envUrl || inferredOrigin || 'https://miniapp.openbands.xyz';
  const BASE = rawBase.replace(/\/$/, '');

  const tags =
  parseTags(process.env.NEXT_PUBLIC_APP_TAGS) || ['social', 'anonymous', 'privacy', 'private'];  
  const requiredChains =
    parseRequiredChains(process.env.NEXT_PUBLIC_REQUIRED_CHAINS) || ['eip155:8453'];

  const payload = {
    accountAssociation: {
      header: "eyJmaWQiOjExODIzNDAsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhkQTliZDAzRTgxMEVlYjUxNzkxQ0ViQTJCNDYyM0Q2MTIwRTBkMGRGIn0",
      payload: "eyJkb21haW4iOiJtaW5pYXBwLm9wZW5iYW5kcy54eXoifQ",
      signature: "MHg0ZjJlNjAzMjU5NzUyNzZjYmQ0NmU4YzNhNTU1MzlhNjdiY2I1OTQ0NzIxOWRmZGJjMjU2MTM4MjVhZTczMDgxMDY4ZTNiODZlYjU0MjM3ZjI5ODdhNWY2MjhlZWM3OGFmZGVjMjcyM2FkNzAxZjhmY2RmMzNhYTgyMjM2OWQxZTFj",
    },
    frame: withValidProperties({
      version: '1',
      name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'Openbands',
      subtitle: process.env.NEXT_PUBLIC_APP_SUBTITLE || 'Anonymous. Verified. Raw.',
      description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'The anonymous social network for verified employees',
      screenshotUrls: parseScreenshotUrls(process.env.NEXT_PUBLIC_APP_SCREENSHOTS),
      iconUrl: process.env.NEXT_PUBLIC_APP_ICON || `${BASE}/Openbands.png`,
      splashImageUrl: process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE || `${BASE}/splash.png`,
      splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || '#0000ff',
      homeUrl: BASE,
      webhookUrl: `${BASE}/api/webhook`,
      primaryCategory: process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY || 'social',
      tags,
      heroImageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE || `${BASE}/hero.png`,
      ogTitle: process.env.NEXT_PUBLIC_APP_OG_TITLE,
      ogDescription: process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION,
      ogImageUrl: process.env.NEXT_PUBLIC_APP_OG_IMAGE || `${BASE}/hero.png`,
      tagline: process.env.NEXT_PUBLIC_APP_TAGLINE,
      requiredChains,
      noindex: false,
    }),
    baseBuilder: {
      allowedAddresses:
        parseAllowedAddresses(process.env.NEXT_PUBLIC_BASE_BUILDER_ALLOWED_ADDRESSES) || [
          '0xBDcda61d8dd602CF9d516C9D2f200E362242C57D',
        ],
    },
  };

  return new Response(JSON.stringify(payload), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  });
}
