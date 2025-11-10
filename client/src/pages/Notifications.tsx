import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Bell, Check, CheckCheck } from "lucide-react";
import { useLocation } from "wouter";

export default function Notifications() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: notifications, refetch } = trpc.notifications.list.useQuery();
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => refetch(),
  });
  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => refetch(),
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage"></div>
      </div>
    );
  }

  if (!user) {
    setLocation("/");
    return null;
  }

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
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="container max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl text-charcoal mb-2">Notifications</h1>
            <p className="text-charcoal/70">
              {unreadCount > 0
                ? `Vous avez ${unreadCount} notification${unreadCount > 1 ? "s" : ""} non ${unreadCount > 1 ? "lues" : "lue"}`
                : "Toutes vos notifications sont lues"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {notifications && notifications.length > 0 ? (
            notifications.map((notif) => (
              <Card
                key={notif.id}
                className={`transition-all hover:shadow-md cursor-pointer ${
                  !notif.read ? "border-l-4 border-l-sage bg-white" : "bg-white/50"
                }`}
                onClick={() => {
                  if (!notif.read) {
                    markAsReadMutation.mutate({ notificationId: notif.id });
                  }
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{getNotificationIcon(notif.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className={`font-semibold text-lg ${!notif.read ? "text-charcoal" : "text-charcoal/70"}`}>
                            {notif.title}
                          </h3>
                          <p className="text-charcoal/70 mt-1">{notif.message}</p>
                          <p className="text-sm text-charcoal/50 mt-2">{formatDate(notif.createdAt)}</p>
                        </div>
                        {!notif.read && (
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-sage" />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsReadMutation.mutate({ notificationId: notif.id });
                              }}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-16 h-16 mx-auto text-charcoal/20 mb-4" />
                <h3 className="font-semibold text-xl text-charcoal mb-2">Aucune notification</h3>
                <p className="text-charcoal/70">
                  Vous recevrez ici des notifications sur vos commandes, promotions et plus encore.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
