"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Folder, 
  Settings, 
  LogOut, 
  Plus, 
  ChevronRight,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Projects', href: '/projects', icon: Folder },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <aside className="w-64 h-screen border-r bg-white/50 backdrop-blur-xl flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
          <Layers className="text-white h-5 w-5" />
        </div>
        <span className="font-bold text-lg tracking-tight">TaskManager</span>
      </div>

      <nav className="flex-grow px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {item.label}
              {isActive && <ChevronRight className="ml-auto h-3 w-3" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-4">
        <div className="flex items-center gap-3 px-2">
          <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {user.full_name?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate">{user.full_name}</span>
            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={logout} 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
