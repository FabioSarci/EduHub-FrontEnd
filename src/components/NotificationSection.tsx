import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { INotification } from "@/interfaces/Notification";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

export function NotificationSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<INotification | null>(null);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("ACCESS_TOKEN");
      if (token && user?.id) {
        try {
          const response = await axios.get(`http://localhost:7001/user-notifications/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setNotifications(response.data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    fetchNotifications();
  }, [user?.id]);

  const handleNotificationClick = (notification: INotification) => {
    setSelectedNotification(notification);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Data non disponibile";
    try {
      // Prova prima a parsare la data
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Data non valida";
      }
      return date.toLocaleString('it-IT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Data non valida";
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative">
            <Bell className="h-5 w-5 text-cyan-800" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 bg-white" align="end">
          <ScrollArea className="h-[300px] p-4">
            {notifications
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="cursor-pointer p-3 hover:bg-cyan-50 border-b border-cyan-100 last:border-0"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-cyan-800">{notification.object}</span>
                    <span className="text-sm text-cyan-600 truncate">{notification.body}</span>
                    <span className="text-xs text-cyan-400">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-cyan-800">{selectedNotification?.object}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-cyan-600">{selectedNotification?.body}</p>
            <p className="text-sm text-cyan-400">
              Ricevuta il: {formatDate(selectedNotification?.createdAt)}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 