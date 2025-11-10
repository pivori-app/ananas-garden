import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const { data: notifications, refetch } = trpc.notifications.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const { data: unreadCount } = trpc.notifications.unreadCount.useQuery(
    undefined,
    { enabled: isAuthenticated, refetchInterval: 30000 } // Refresh every 30s
  );

  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  if (!isAuthenticated) {
    return null;
  }

  const handleNotificationClick = (id: number) => {
    if (id) {
      markAsReadMutation.mutate({ notificationId: id });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "delivery":
        return "🚚";
      case "promotion":
        return "🎁";
      case "birthday":
        return "🎂";
      case "referral":
        return "👥";
      default:
        return "🔔";
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount && unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount && unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {unreadCount} non {unreadCount > 1 ? "lues" : "lue"}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications && notifications.length > 0 ? (
          <>
            {notifications.map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                onClick={() => handleNotificationClick(notif.id)}
              >
                <div className="flex items-start gap-2 w-full">
                  <span className="text-lg">{getNotificationIcon(notif.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(notif.createdAt)}
                    </p>
                  </div>
                  {!notif.read && (
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/notifications">
                <div className="w-full text-center cursor-pointer text-sm text-primary">
                  Voir toutes les notifications
                </div>
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Aucune notification
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
