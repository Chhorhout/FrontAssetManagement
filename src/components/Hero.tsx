"use client";

import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { ComputerDesktopIcon, Squares2X2Icon, UsersIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface Asset {
  id: number;
  name: string;
  categoryId: number;
  status: 'active' | 'maintenance' | 'retired';
  location: string;
  lastUpdated: string;
}

interface Category {
  id: number;
  name: string;
}

interface ChartData {
  assetsByCategory: Array<{
    name: string;
    count: number;
  }>;
  assetsByStatus: Array<{
    status: string;
    count: number;
  }>;
  monthlyAssets: Array<{
    month: string;
    count: number;
  }>;
}

export default function Hero() {
  const [counts, setCounts] = useState({
    asset: 0,
    category: 0,
    user: 0,
    maintainer: 0,
    supplier: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData>({
    assetsByCategory: [],
    assetsByStatus: [],
    monthlyAssets: [],
  });
  const [recentAssets, setRecentAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    async function fetchData() {
      try {
        const [assets, categoriesData, users, maintainers, suppliers] = await Promise.all([
          fetch('http://localhost:5119/api/assets').then(res => res.json()),
          fetch('http://localhost:5119/api/categories').then(res => res.json()),
          fetch('http://localhost:5119/api/users').then(res => res.json()),
          fetch('http://localhost:5119/api/maintainer').then(res => res.json()),
          fetch('http://localhost:5119/api/supplier').then(res => res.json()),
        ]);
        setCategories(categoriesData);
        // Process data for charts
        const assetsByCategory = categoriesData.map((category: Category) => ({
          name: category.name,
          count: assets.filter((asset: Asset) => asset.categoryId === category.id).length
        }));

        const assetsByStatus = [
          { status: 'Active', count: assets.filter((a: Asset) => a.status === 'active').length },
          { status: 'Maintenance', count: assets.filter((a: Asset) => a.status === 'maintenance').length },
          { status: 'Retired', count: assets.filter((a: Asset) => a.status === 'retired').length }
        ];

        // Get last 6 months of data
        const last6Months = Array.from({ length: 6 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return date.toLocaleString('default', { month: 'short' });
        }).reverse();

        const monthlyAssets = last6Months.map(month => ({
          month,
          count: assets.filter((asset: Asset) => {
            const assetDate = new Date(asset.lastUpdated);
            return assetDate.toLocaleString('default', { month: 'short' }) === month;
          }).length
        }));

        // Get 5 most recent assets
        const sortedAssets = [...assets].sort((a, b) => 
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        ).slice(0, 5);

        setRecentAssets(sortedAssets);
        setChartData({
          assetsByCategory,
          assetsByStatus,
          monthlyAssets
        });

        setCounts({
          asset: assets.length,
          category: categoriesData.length,
          user: users.length,
          maintainer: maintainers.length,
          supplier: suppliers.length,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Chart configurations
  const barChartData = {
    labels: chartData.assetsByCategory.map(item => item.name),
    datasets: [
      {
        label: 'Assets by Category',
        data: chartData.assetsByCategory.map(item => item.count),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartData = {
    labels: chartData.assetsByStatus.map(item => item.status),
    datasets: [
      {
        data: chartData.assetsByStatus.map(item => item.count),
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(234, 179, 8, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: chartData.monthlyAssets.map(item => item.month),
    datasets: [
      {
        label: 'Assets Added',
        data: chartData.monthlyAssets.map(item => item.count),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const cards = [
    {
      label: 'ASSET',
      value: counts.asset,
      link: '/asset/list',
      linkLabel: 'View all assets →',
      icon: ComputerDesktopIcon,
      border: 'border-blue-500',
      iconBg: 'bg-blue-100 text-blue-500',
    },
    {
      label: 'CATEGORIES',
      value: counts.category,
      link: '/category/list',
      linkLabel: 'View all categories →',
      icon: Squares2X2Icon,
      border: 'border-green-400',
      iconBg: 'bg-green-100 text-green-500',
    },
    {
      label: 'USERS',
      value: counts.user,
      link: '/users/list',
      linkLabel: 'View all users →',
      icon: UsersIcon,
      border: 'border-cyan-400',
      iconBg: 'bg-cyan-100 text-cyan-500',
    },
    {
      label: 'MAINTAINER',
      value: counts.maintainer,
      link: '/maintainer/list',
      linkLabel: 'View all maintainers →',
      icon: WrenchScrewdriverIcon,
      border: 'border-yellow-400',
      iconBg: 'bg-yellow-100 text-yellow-500',
    },
    {
      label: 'SUPPLIER',
      value: counts.supplier,
      link: '/supplier/list',
      linkLabel: 'View all suppliers →',
      icon: ShoppingBagIcon,
      border: 'border-purple-400',
      iconBg: 'bg-purple-100 text-purple-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      }
    }
  };

  const numberVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      }
    }
  };

  const LoadingSkeleton = () => (
    <div className="flex-1 min-w-[260px] max-w-xs bg-white rounded-xl shadow-md p-6 border-t-4 border-gray-200">
      <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse mb-4" />
      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
    </div>
  );

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-[80vh] px-8 py-8 w-full bg-[#f7f9fb]"
    >
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-semibold text-blue-900 mb-10"
      >
        Dashboard
      </motion.h1>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex flex-wrap gap-8 mb-8"
      >
        {isLoading ? (
          Array(5).fill(0).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))
        ) : (
          cards.map((card) => (
            <motion.div
              key={card.label}
              variants={cardVariants}
              whileHover="hover"
              className={`flex-1 min-w-[260px] max-w-xs bg-white rounded-xl shadow-md p-6 border-t-4 ${card.border} hover:shadow-xl transition-shadow duration-300`}
            >
              <motion.div 
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${card.iconBg}`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <card.icon className="w-7 h-7" />
              </motion.div>
              <div className="text-xs font-semibold text-gray-500 mb-1">{card.label}</div>
              <motion.div 
                variants={numberVariants}
                className="text-3xl font-bold text-gray-800 mb-2"
              >
                {card.value}
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link href={card.link} className="text-sm text-blue-600 hover:underline font-medium">
                  {card.linkLabel}
                </Link>
              </motion.div>
            </motion.div>
          ))
        )}
      </motion.div>
      <div className="flex-1" />
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center text-xs text-gray-400"
      >
        Welcome to KCL System 2025
      </motion.footer>
    </motion.div>
  );
} 