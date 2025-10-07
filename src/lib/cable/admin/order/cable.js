import cable from "../../cable";
import { toast } from "sonner";

export const subscribeAdminOrdersChannel = () => {
  const channel = cable.subscriptions.create("Admin::OrderChannel", {
    connected: () => {
      console.log("Connected to AdminOrdersChannel");
    },
    disconnected: () => {
      console.log("Disconnected from AdminOrdersChannel");
    },
    received: (data) => {
      console.log("Order event received:", data);
    },
  });

  return channel;
};
