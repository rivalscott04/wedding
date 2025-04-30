import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/AdminLayout';
import { apiMessageService } from '@/api/apiMessageService';
import { Message } from '@/types/message';
import { useToast } from '@/hooks/use-admin-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Search, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';


export default function AdminMessages() {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: () => apiMessageService.getMessages()
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: (id: number) => {
      return apiMessageService.deleteMessage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast({
        title: "Ucapan Berhasil Dihapus",
        description: "Ucapan telah dihapus dari sistem.",
        variant: "success"
      });
    }
  });

  // Handle delete with toast confirmation
  const handleDeleteMessage = (message: Message) => {
    toast({
      title: "Konfirmasi Hapus",
      description: `Apakah Anda yakin ingin menghapus ucapan dari ${message.name}?`,
      action: (
        <div className="flex gap-2 mt-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              message.id && deleteMessageMutation.mutate(message.id);
              toast({
                title: "Menghapus ucapan",
                description: "Ucapan sedang dihapus..."
              });
            }}
          >
            Hapus
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.dismiss()}
          >
            Batal
          </Button>
        </div>
      ),
    });
  };

  // Filter messages based on search query
  const filteredMessages = messages?.filter(message =>
    message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: id });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <AdminLayout>
      <div className="w-full px-1 sm:px-4 py-2 sm:py-6">
        <Card className="mb-3 sm:mb-8 shadow-sm">
          <CardHeader className="px-3 py-2 sm:px-6 sm:py-6">
            <CardTitle className="text-base sm:text-xl">Ucapan & Doa</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Lihat dan kelola ucapan dan doa dari tamu undangan
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3">
            <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2 sm:left-2.5 sm:top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari ucapan atau nama..."
                  className="pl-6 sm:pl-8 text-xs sm:text-sm h-8 sm:h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-md border bg-white shadow-sm overflow-x-auto mb-3 sm:mb-6">
          <Table className="min-w-[400px] w-full">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm w-[25%]">Nama</TableHead>
                <TableHead className="py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm w-[45%]">Ucapan</TableHead>
                <TableHead className="hidden sm:table-cell py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm w-[20%]">Tanggal</TableHead>
                <TableHead className="text-right py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm w-[10%]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 sm:py-10 text-[10px] sm:text-sm">
                    Memuat data ucapan...
                  </TableCell>
                </TableRow>
              ) : filteredMessages?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 sm:py-10 text-[10px] sm:text-sm">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <MessageSquare className="h-6 w-6 sm:h-10 sm:w-10 mb-1 sm:mb-2 text-muted" />
                      <p>Belum ada ucapan dari tamu</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMessages?.map((message) => (
                  <TableRow key={message.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">
                      <div>
                        {message.name}
                        <div className="sm:hidden text-[8px] sm:text-xs text-muted-foreground mt-0.5">
                          {formatDate(message.created_at)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[150px] sm:max-w-[200px] md:max-w-md truncate py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">
                      {message.message}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell py-1 px-1 sm:py-3 sm:px-4 text-[10px] sm:text-sm">
                      {formatDate(message.created_at)}
                    </TableCell>
                    <TableCell className="text-right py-1 px-0.5 sm:py-3 sm:px-4 text-[10px] sm:text-sm">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteMessage(message)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-5 w-5 sm:h-8 sm:w-8 p-0.5"
                      >
                        <Trash2 className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
