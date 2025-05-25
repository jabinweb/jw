import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offline | Jabin Web',
  description: 'You are currently offline.',
};

export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
