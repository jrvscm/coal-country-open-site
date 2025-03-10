// lib/contentful.js
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

export default client;