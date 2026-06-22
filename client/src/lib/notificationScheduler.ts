import * as Notifications from "expo-notifications";
import { Platform } from "react-native";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


/**
 * Function that schedules a notification with the OS to be displayed at a later date.
 * @param date - JavaScript data object that specifies the time and date when the notification will be scheduled.
 * @param title - Title of the notification that will be displayed (keep it short).
 * @param body - Body text of the notification.
 * @returns the notification ID that can be used to later interact with the scheduled notification.
 */
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

