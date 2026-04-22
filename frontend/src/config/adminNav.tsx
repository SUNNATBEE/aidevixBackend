import type { ReactNode } from 'react';
import {
  FiActivity,
  FiBook,
  FiHome,
  FiSettings,
  FiUsers,
  FiDollarSign,
} from 'react-icons/fi';

export type AdminNavItem = {
  href: string;
  label: string;
  hint: string;
  icon: ReactNode;
};

export type AdminNavSection = { title: string; items: AdminNavItem[] };

export const ADMIN_NAV: AdminNavSection[] = [
  {
    title: 'Boshqaruv',
    items: [
      {
        href: '/admin',
        label: 'Umumiy panel',
        hint: 'Statistika va tezkor ko‘rinish',
        icon: <FiHome className="h-5 w-5" />,
      },
      {
        href: '/admin/courses',
        label: 'Kurslar',
        hint: 'Kurs CRUD, narx, chop etish',
        icon: <FiBook className="h-5 w-5" />,
      },
      {
        href: '/admin/users',
        label: 'Foydalanuvchilar',
        hint: 'Rol, faollik, qidiruv',
        icon: <FiUsers className="h-5 w-5" />,
      },
      {
        href: '/admin/payments',
        label: "To'lovlar",
        hint: 'So‘nggi tranzaksiyalar',
        icon: <FiDollarSign className="h-5 w-5" />,
      },
    ],
  },
  {
    title: 'Kontent va vositalar',
    items: [
      {
        href: '/admin/tools',
        label: 'Kunlik vazifalar',
        hint: 'Challenge yaratish (admin API)',
        icon: <FiActivity className="h-5 w-5" />,
      },
    ],
  },
  {
    title: 'Tizim',
    items: [
      {
        href: '/admin/settings',
        label: 'Sozlamalar va hujjatlar',
        hint: 'API, Swagger, yo‘riqnoma',
        icon: <FiSettings className="h-5 w-5" />,
      },
    ],
  },
];
