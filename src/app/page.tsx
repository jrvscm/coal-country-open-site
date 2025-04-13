import { getMetadata } from '@/lib/metadata';
import ClientPage from './ClientPage';

export const metadata = getMetadata('/');

export default function Page() {
  return <ClientPage />;
}