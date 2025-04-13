import { getMetadata } from '@/lib/metadata';
import ClientPage from './ClientPage';

export const metadata = getMetadata('/tournament/sponsors');

export default function Page() {
  return <ClientPage />;
}