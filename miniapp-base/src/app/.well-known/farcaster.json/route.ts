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

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL;

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
      webhookUrl: URL ? `${URL}/api/webhook` : undefined,
      primaryCategory: process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY || 'social',
      tags: [],
      heroImageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
      tagline: process.env.NEXT_PUBLIC_APP_TAGLINE,
      ogTitle: process.env.NEXT_PUBLIC_APP_OG_TITLE,
      ogDescription: process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION,
      ogImageUrl: process.env.NEXT_PUBLIC_APP_OG_IMAGE,
      noindex: true,
    }),
  });
}
