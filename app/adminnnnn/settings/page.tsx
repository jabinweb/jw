// pages/admin/settings/index.tsx
import Link from 'next/link';

const SettingsPage = () => {
  return (
    <div>
      <h1>Settings</h1>
      <ul>
        <li>
          <Link href="/admin/settings/general">General Settings</Link>
        </li>
        <li>
          <Link href="/admin/settings/writing">Writing Settings</Link>
        </li>
        <li>
          <Link href="/admin/settings/reading">Reading Settings</Link>
        </li>
        <li>
          <Link href="/admin/settings/media">Media Settings</Link>
        </li>
        <li>
          <Link href="/admin/settings/permalinks">Permalinks Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default SettingsPage;
