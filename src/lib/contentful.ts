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
    return entry?.fields?.startDate || 'Unknown Date';
  }

export default client;