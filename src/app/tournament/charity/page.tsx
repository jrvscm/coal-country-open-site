import { getMetadata } from '@/lib/metadata';
import ClientPage from './ClientPage';

export const metadata = getMetadata('/tournament/charity');

export default function Page() {
  return <ClientPage />;
}