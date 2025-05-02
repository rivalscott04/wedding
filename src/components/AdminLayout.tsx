import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Home,
  Users,
  Settings,
  Calendar,
  MessageSquare,
  Menu as MenuIcon,
  X,
  Database
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { AdminToaster } from '@/components/ui/admin-toaster';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/guests', label: 'Tamu Undangan', icon: Users },
    { href: '/admin/guests-data', label: 'Data Tamu API', icon: Database },
    { href: '/admin/messages', label: 'Ucapan & Doa', icon: MessageSquare },
    { href: '/admin/events', label: 'Atur Acara', icon: Calendar },
    { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
  ];

  const NavLinks = () => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-xs sm:text-sm rounded-md",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Icon className="mr-2 h-4 w-4 sm:mr-3 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminToaster />
      <div className="flex flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-col w-64 bg-white border-r min-h-screen p-4 sticky top-0">
          <div className="mb-8 px-4 py-4">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Undangan Pernikahan</p>
          </div>
          <NavLinks />
        </div>

        {/* Mobile Sidebar (Sheet) */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-[250px] sm:w-[300px] overflow-y-auto max-h-screen">
            <SheetHeader className="mb-4">
              <SheetTitle className="text-base">Admin Panel</SheetTitle>
              <SheetDescription className="text-xs">Undangan Pernikahan</SheetDescription>
            </SheetHeader>
            <div className="pb-20">
              <NavLinks />
            </div>
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile header */}
          <div className="md:hidden bg-white border-b p-3 sticky top-0 z-10 flex items-center justify-between">
            <h1 className="text-base font-bold">Admin Panel</h1>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="h-8 w-8"
            >
              <MenuIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <main className="flex-1 p-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
