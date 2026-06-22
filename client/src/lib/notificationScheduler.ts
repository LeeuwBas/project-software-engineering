import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Optional: foreground behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function scheduleNotification(date: Date, title: string, body: string) {
  // Request permissions for notifications if they haven't been granted yet
  const notificationPermission = await Notifications.getPermissionsAsync();
  let granted = notificationPermission.granted;
  if (!granted) {
    const requestPermission = await Notifications.requestPermissionsAsync();
    granted = requestPermission.granted;
  }
  if (!granted) throw new Error("Notification permission not granted");

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  // Schedule notification with given content
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
      ...(Platform.OS === "android" ? { channelId: "default" } : {}),
    },
  });

  console.log(`Scheduled notification at ${date}`)

  return id;
}

