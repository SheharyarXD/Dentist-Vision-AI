import { Link, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Scan,
  BarChart3,
  LineChart,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/analysis', label: 'Radiograph Analysis', icon: Scan },
  { path: '/visual', label: 'Visual Analysis', icon: BarChart3 },
  { path: '/metrics', label: 'Training Metrics', icon: LineChart },
  { path: '/model', label: 'Model Info', icon: BrainCircuit },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border z-40 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Stethoscope className="w-5 h-5 text-primary" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 min-w-0"
          >
            <h1 className="text-sm font-bold tracking-tight truncate">DentalVisionAI</h1>
            <p className="text-[10px] text-sidebar-foreground/60 truncate">AI-Powered Diagnosis</p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200 group
                ${isActive
                  ? 'text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-sidebar-primary rounded-lg"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
              <Icon className="w-5 h-5 relative z-10 shrink-0" />
              {!collapsed && (
                <span className="relative z-10 truncate">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute right-2 w-1.5 h-1.5 rounded-full bg-sidebar-primary-foreground/80"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 py-3 border-t border-sidebar-border shrink-0">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full py-2 rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </motion.aside>
  );
}
