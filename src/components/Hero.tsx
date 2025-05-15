import { ComputerDesktopIcon, Squares2X2Icon, UsersIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

const cards = [
  {
    label: 'ASSET',
    value: 10,
    link: '/asset/list',
    linkLabel: 'View all assets →',
    icon: ComputerDesktopIcon,
    border: 'border-blue-500',
    iconBg: 'bg-blue-100 text-blue-500',
  },
  {
    label: 'CATEGORIES',
    value: 1,
    link: '/category/list',
    linkLabel: 'View all categories →',
    icon: Squares2X2Icon,
    border: 'border-green-400',
    iconBg: 'bg-green-100 text-green-500',
  },
  {
    label: 'USERS',
    value: 2,
    link: '/users/list',
    linkLabel: 'View all users →',
    icon: UsersIcon,
    border: 'border-cyan-400',
    iconBg: 'bg-cyan-100 text-cyan-500',
  },
  {
    label: 'MAINTAINER',
    value: 3,
    link: '/maintainer/list',
    linkLabel: 'View all maintainers →',
    icon: WrenchScrewdriverIcon,
    border: 'border-yellow-400',
    iconBg: 'bg-yellow-100 text-yellow-500',
  },
];

export default function Hero() {
  return (
    <div className="flex flex-col min-h-[80vh] px-8 py-8 w-full bg-[#f7f9fb]">
      <h1 className="text-4xl font-semibold text-blue-900 mb-10">Dashboard</h1>
      <div className="flex flex-wrap gap-8 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`flex-1 min-w-[260px] max-w-xs bg-white rounded-xl shadow-md p-6 border-t-4 ${card.border}`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${card.iconBg}`}>
              <card.icon className="w-7 h-7" />
            </div>
            <div className="text-xs font-semibold text-gray-500 mb-1">{card.label}</div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{card.value}</div>
            <Link href={card.link} className="text-sm text-blue-600 hover:underline font-medium">
              {card.linkLabel}
            </Link>
          </div>
        ))}
      </div>
      <div className="flex-1" />
      <footer className="mt-8 text-center text-xs text-gray-400">Welcome to KCL System 2025</footer>
    </div>
  );
} 