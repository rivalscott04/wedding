import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Calendar, Settings } from 'lucide-react';
import { apiGuestService } from '@/api/apiGuestService';
import { apiMessageService } from '@/api/apiMessageService';

export default function AdminDashboard() {
  // Fetch guest count
  const { data: guestCount, isLoading: isLoadingGuests } = useQuery({
    queryKey: ['guestCount'],
    queryFn: () => apiGuestService.getGuestCount()
  });

  // Fetch message count
  const { data: messageCount, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messageCount'],
    queryFn: async () => {
      const messages = await apiMessageService.getMessages();
      return messages.length;
    }
  });

  const dashboardCards = [
    {
      title: 'Tamu Undangan',
      description: 'Kelola daftar tamu undangan pernikahan',
      icon: Users,
      value: isLoadingGuests ? '...' : guestCount,
      link: '/admin/guests',
      linkText: 'Kelola Tamu'
    },
    {
      title: 'Ucapan & Doa',
      description: 'Lihat ucapan dan doa dari tamu',
      icon: MessageSquare,
      value: isLoadingMessages ? '...' : messageCount,
      link: '/admin/messages',
      linkText: 'Lihat Ucapan'
    },
    {
      title: 'Detail Acara',
      description: 'Atur detail acara pernikahan',
      icon: Calendar,
      value: '',
      link: '/admin/events',
      linkText: 'Atur Acara'
    },
    {
      title: 'Pengaturan',
      description: 'Konfigurasi undangan pernikahan',
      icon: Settings,
      value: '',
      link: '/admin/settings',
      linkText: 'Pengaturan'
    }
  ];

  return (
    <AdminLayout>
      <div className="w-full px-2 sm:px-4 py-4 sm:py-6">
        <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 px-2">Dashboard Admin</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 py-3 sm:px-6 sm:py-4">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-2 sm:py-3">
                  <div className="text-xl sm:text-2xl font-bold">{card.value}</div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
                <CardFooter className="px-4 sm:px-6 py-3 sm:py-4">
                  <Button asChild variant="outline" size="sm" className="w-full text-xs sm:text-sm h-8 sm:h-9">
                    <Link to={card.link}>{card.linkText}</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
