import { createClient } from 'contentful';

const client = createClient({
  space: `${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}`,
  accessToken: `${process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN}`,
});

export const fetchSchedule = async () => {
    const res = await client.getEntries({
      content_type: 'tournamentSchedule',
    });
  
    const scheduleData = res.items[0]?.fields?.events || [];
    return scheduleData;
  };
  
  export async function fetchTournamentStartDate(): Promise<string> {
    const response = await client.getEntries({
      content_type: 'tournamentStartDate', 
      limit: 1,
    });
  
    const entry = response.items[0];
  
    return typeof entry?.fields?.startDate === 'string'
      ? entry.fields.startDate
      : String(entry?.fields?.startDate || 'Unknown Date');
  }  

  export const fetchSponsors = async () => {
    const res = await client.getEntries({
      content_type: 'sponsorLogos', 
    });
  
    const sponsors = res?.includes?.Asset?.map((item) => {
      const rawUrl = item?.fields?.file?.url ?? '';
      const source = rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl;
  
      return {
        href: item?.fields?.description ?? '',
        source,
        alt: `${item?.fields?.title ?? 'Sponsor'} Logo`,
        title: item?.fields?.title ?? 'Sponsor',
      };
    });
  
    return sponsors;
  };
  

  export const fetchTournamentCharity = async () => {
    const entries = await client.getEntries({
      content_type: 'tournamentCharity',
      limit: 1,
    });

    return entries.items[0].fields.charityInformationObject;
  }

  export const fetchCharityImages = async () => {
    const entries = await client.getEntries({
      content_type: 'charityImages',
    })
    return entries.items[0].fields.charityImages;
  }

  export async function getTournamentPricingConfig() {
    const entries = await client.getEntries({
      content_type: 'registrationPagePricingAndContent',
      limit: 1,
    });

    return entries.items[0].fields.registrationContent;
  }
  
export default client;