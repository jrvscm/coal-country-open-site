import type { Metadata } from 'next';

export function getMetadata(path: string): Metadata {
  const titleMap: Record<string, string> = {
    '/': 'Coal Country Open – Annual Golf Tournament in Gillette, Wyoming',
    '/registration/player': 'Player Registration – Coal Country Open',
    '/registration/sponsor': 'Sponsor Registration – Coal Country Open',
    '/tournament/charity': 'Charity Partner – Coal Country Open',
    '/tournament/information': 'Tournament Info – Coal Country Open',
    '/tournament/sponsors': 'Tournament Sponsors - Coal Country Open'
  };

  const descriptionMap: Record<string, string> = {
    '/': 'Join us for the Coal Country Open, a premier golf tournament held annually in Gillette, Wyoming. Register, compete, and support local causes.',
    '/registration/player': 'Register now to play in Gillette’s biggest golf event of the year.',
    '/registration/sponsor': 'Register now to play in Gillette’s biggest golf event of the year.',
    '/tournament/charity': 'Learn about this year’s charity and how your participation helps the community.',
    '/tournament/information': 'Find event details, rules, and schedule information.',
    '/tournament/sponsors': 'View our event sponsors for the Coal Country Open.'
  };

  const title = titleMap[path] || 'Coal Country Open';
  const description = descriptionMap[path] || 'Annual golf tournament in Gillette, Wyoming.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.coalcountryopen.com${path}`,
      siteName: 'Coal Country Open',
      images: [
        {
          url: "https://images.ctfassets.net/j2939n6mdbyq/3i6cXbMjJ1sXUGoYWdcAXk/ce6f3abe8f58abf7677ee60e3dfc81d7/CCO24-462__1___1_.jpg?w=1600&fm=webp&q=70",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
  };
}
