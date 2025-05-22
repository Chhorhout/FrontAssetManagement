'use client';

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  FolderIcon,
  HomeIcon,
  ShoppingBagIcon,
  Squares2X2Icon,
  UsersIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
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
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = (name: string) => {
    setOpenSection((prev) => (prev === name ? null : name));
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex h-full flex-col bg-gradient-to-b from-blue-600 to-blue-400 text-white shadow-lg relative"
    >
      <div className="flex h-16 items-center justify-center border-b border-blue-500">
        <span className="rounded-full bg-white/20 p-2 mr-2">
          <HomeIcon className="h-8 w-8 text-white" />
        </span>
        {!collapsed && <h1 className="text-lg font-bold tracking-wide">KCL ASSET MANAGEMENT<sup className="text-xs">2</sup></h1>}
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {sidebarSections.map((section) => (
          <div key={section.name} className="relative">
            {section.href ? (
              <div className="relative">
                <Link
                  href={section.href}
                  className={`flex items-center px-3 py-2 rounded-md font-medium transition-colors relative ${
                    pathname === section.href
                      ? 'bg-white/20 text-white'
                      : 'hover:bg-white/10 text-white/90'
                  }`}
                >
                  {pathname === section.href && (
                    <div
                      className="absolute left-0 top-0 h-full w-1 bg-white"
                    />
                  )}
                  <section.icon className={`h-6 w-6 mr-3 z-10 ${collapsed ? 'mx-auto' : ''}`} />
                  {!collapsed && <span className="z-10">{section.name}</span>}
                </Link>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  className={`flex w-full items-center px-3 py-2 rounded-md font-medium cursor-pointer hover:bg-white/10 focus:outline-none relative ${collapsed ? 'justify-center' : ''}`}
                  onClick={() => handleToggle(section.name)}
                  aria-expanded={openSection === section.name}
                  disabled={collapsed}
                >
                  <section.icon className={`h-6 w-6 mr-3 ${collapsed ? 'mx-auto' : ''}`} />
                  {!collapsed && section.name}
                  {!collapsed && (
                    <span className="ml-auto">
                      <ChevronDownIcon className={`h-4 w-4 transition-transform ${openSection === section.name ? 'rotate-180' : ''}`} />
                    </span>
                  )}
                </button>
                {!collapsed && openSection === section.name && (
                  <div
                    key={section.name}
                    className="ml-9 mt-1 space-y-1 bg-white rounded shadow text-gray-800 py-3 px-3"
                  >
                    <div className="text-xs font-bold text-gray-400 mb-2 uppercase">Components for {section.name}:</div>
                    <div>
                      {section.submenu?.map((item) => (
                        <div key={item.name}>
                          <Link
                            href={item.href}
                            className={`block px-2 py-1 rounded text-base transition-colors ${
                              pathname === item.href
                                ? 'bg-blue-100 text-blue-700 font-semibold'
                                : 'hover:bg-blue-50 text-gray-800'
                            }`}
                          >
                            {item.name}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div className="mt-8 text-xs text-white/60 px-3 pt-4 border-t border-blue-500">INTERFACE</div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute bottom-4 right-4 bg-white/20 text-white rounded-full p-2 shadow"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeftIcon className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </nav>
    </motion.aside>
  );
} 