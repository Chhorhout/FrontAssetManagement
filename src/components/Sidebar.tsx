'use client';

import {
  ChevronDownIcon,
  FolderIcon,
  HomeIcon,
  ShoppingBagIcon,
  Squares2X2Icon,
  UsersIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const sidebarSections = [
  {
    name: 'Dashboard',
    href: '/',
    icon: HomeIcon,
  },
  {
    name: 'Category',
    icon: Squares2X2Icon,
    submenu: [
      { name: 'Lists of category', href: '/category/list' },
      { name: 'Add new category', href: '/category/add' },
    ],
  },
  {
    name: 'Asset',
    icon: FolderIcon,
    submenu: [
      { name: 'Lists of asset', href: '/asset/list' },
      { name: 'Add new asset', href: '/asset/add' },
    ],
  },
  {
    name: 'Users',
    icon: UsersIcon,
    submenu: [
      { name: 'Lists of users', href: '/users/list' },
      { name: 'Add new user', href: '/users/add' },
    ],
  },
  {
    name: 'Maintainer',
    icon: WrenchScrewdriverIcon,
    submenu: [
      { name: 'Lists of maintainer', href: '/maintainer/list' },
      { name: 'Add new maintainer', href: '/maintainer/add' },
    ],
  },
  {
    name: 'Supplier',
    icon: ShoppingBagIcon,
    submenu: [
      { name: 'Lists of supplier', href: '/supplier/list' },
      { name: 'Add new supplier', href: '/supplier/add' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleToggle = (name: string) => {
    setOpenSection((prev) => (prev === name ? null : name));
  };

  return (
    <aside className="flex h-full w-64 flex-col bg-gradient-to-b from-blue-600 to-blue-400 text-white shadow-lg">
      <div className="flex h-16 items-center justify-center border-b border-blue-500">
        <span className="rounded-full bg-white/20 p-2 mr-2">
          <HomeIcon className="h-8 w-8 text-white" />
        </span>
        <h1 className="text-lg font-bold tracking-wide">KCL ASSET MANAGEMENT<sup className="text-xs">2</sup></h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {sidebarSections.map((section) => (
          <div key={section.name}>
            {section.href ? (
              <Link
                href={section.href}
                className={`flex items-center px-3 py-2 rounded-md font-medium transition-colors ${
                  pathname === section.href
                    ? 'bg-white/20 text-white'
                    : 'hover:bg-white/10 text-white/90'
                }`}
              >
                <section.icon className="h-6 w-6 mr-3" />
                {section.name}
              </Link>
            ) : (
              <div>
                <button
                  type="button"
                  className="flex w-full items-center px-3 py-2 rounded-md font-medium cursor-pointer hover:bg-white/10 focus:outline-none"
                  onClick={() => handleToggle(section.name)}
                  aria-expanded={openSection === section.name}
                >
                  <section.icon className="h-6 w-6 mr-3" />
                  {section.name}
                  <ChevronDownIcon className={`h-4 w-4 ml-auto transition-transform ${openSection === section.name ? 'rotate-180' : ''}`} />
                </button>
                {openSection === section.name && (
                  <div className="ml-9 mt-1 space-y-1 bg-white rounded shadow text-gray-800 py-3 px-3">
                    <div className="text-xs font-bold text-gray-400 mb-2 uppercase">Components for {section.name}:</div>
                    {section.submenu?.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`block px-2 py-1 rounded text-base transition-colors ${
                          pathname === item.href
                            ? 'bg-blue-100 text-blue-700 font-semibold'
                            : 'hover:bg-blue-50 text-gray-800'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div className="mt-8 text-xs text-white/60 px-3 pt-4 border-t border-blue-500">INTERFACE</div>
      </nav>
    </aside>
  );
} 