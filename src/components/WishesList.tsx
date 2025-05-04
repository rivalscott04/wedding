
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { apiMessageService } from "@/api/apiMessageService";
import { Message } from "@/types/message";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface WishesListProps {
  wishes?: any[];
}

// Format time function
const formatTime = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: id
    });
  } catch (error) {
    return "baru saja";
  }
};

export function WishesList({ wishes: initialWishes }: WishesListProps) {
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch messages from database
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messages = await apiMessageService.getMessages();
        console.log("Fetched messages from API:", messages);
        setAllMessages(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Set up polling for real-time updates
    const intervalId = setInterval(fetchMessages, 5000); // Poll every 5 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Update when initialWishes changes (when a new message is added)
  useEffect(() => {
    if (initialWishes && initialWishes.length > 0) {
      // Add new wishes to the existing messages
      setAllMessages(prev => {
        // Create a new array with initialWishes at the beginning
        const newMessages = [...initialWishes, ...prev];

        // Remove duplicates based on message content and name
        return newMessages.filter((wish, index, self) =>
          index === self.findIndex((w) =>
            (w.message === wish.message && w.name === wish.name)
          )
        );
      });
    }
  }, [initialWishes]);

  // Sort by timestamp/created_at (newest first)
  const sortedWishes = [...allMessages].sort((a, b) => {
    const dateA = new Date(a.timestamp || a.created_at);
    const dateB = new Date(b.timestamp || b.created_at);
    return dateB.getTime() - dateA.getTime();
  });

  if (isLoading) {
    return (
      <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-6 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-2">
        {[1, 2, 3].map((_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (sortedWishes.length === 0) {
    return (
      <div className="mt-8 sm:mt-10 text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">Belum ada ucapan. Jadilah yang pertama memberikan ucapan!</p>
      </div>
    );
  }

  return (
    <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-6 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-2">
      {sortedWishes.map((wish, index) => (
        <motion.div
          key={`${wish.name}-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-retirement-light/30 rounded-lg p-3 sm:p-4 border border-retirement-muted/20"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium text-retirement-dark text-sm sm:text-base">{wish.name}</div>
            <div className="text-2xs sm:text-xs text-slate-500">
              {formatTime(wish.timestamp || wish.created_at)}
            </div>
          </div>
          <p className="text-slate-700 text-xs sm:text-sm">{wish.message}</p>
        </motion.div>
      ))}
    </div>
  );
}

