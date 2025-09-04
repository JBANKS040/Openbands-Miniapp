function withValidProperties(
  properties: Record<string, undefined | string | string[] | boolean>
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => {
      if (Array.isArray(value)) return value.length > 0;
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

export async function GET(req: Request) {
  const envUrl = process.env.NEXT_PUBLIC_URL;
  const inferredOrigin = (() => {
    try {
      return new URL(req.url).origin;
    } catch {
      return undefined;
    }
  })();
  const URL = envUrl || inferredOrigin || 'https://miniapp.openbands.xyz';

  return Response.json({
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
      screenshotUrls: [],
      iconUrl: process.env.NEXT_PUBLIC_APP_ICON || `${URL}/Openbands.png`,
      splashImageUrl: process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE || `${URL}/splash.png`,
      splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || '#0000ff',
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory: process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY || 'social',
      tags: [],
      heroImageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE || `${URL}/hero.png`,
      tagline: process.env.NEXT_PUBLIC_APP_TAGLINE,
      ogTitle: process.env.NEXT_PUBLIC_APP_OG_TITLE,
      ogDescription: process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION,
      ogImageUrl: process.env.NEXT_PUBLIC_APP_OG_IMAGE || `${URL}/hero.png`,
      noindex: false,
    }),
    baseBuilder: {
      allowedAddresses:
        parseAllowedAddresses(process.env.NEXT_PUBLIC_BASE_BUILDER_ALLOWED_ADDRESSES) || [
          '0xBDcda61d8dd602CF9d516C9D2f200E362242C57D',
        ],
    },
  });
}
