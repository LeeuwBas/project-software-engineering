import { scheduleNotification } from './notificationScheduler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { getUserName } from './settings';

const userName = getUserName();

const waterLastStorageKey = 'water_last_schedule_date';
const waterIdStorageKey = 'water_last_notification_id';

/**
 * Function that sets a water notification at 18:00 to remind the user
 * to drink their water.
 */
export async function setWaterNotifaction() {
    try {
        const today = new Date();
        const lastScheduleDay = await AsyncStorage.getItem(waterLastStorageKey);
        today.setHours(0, 0, 0, 0);

        if (lastScheduleDay) {
            const lastScheduledDateObject = new Date(lastScheduleDay);
            lastScheduledDateObject.setHours(0, 0, 0, 0);

            if (lastScheduledDateObject.toISOString() === today.toISOString()) {
                console.log('Water notification already handled');
                return;
            }
        }

        const scheduleDate = new Date();
        scheduleDate.setHours(18, 0, 0, 0);

        const id = await scheduleNotification(
            scheduleDate,
            'Water time!',
            `Hey ${userName}! Time for a glass of water!`
        );
        await AsyncStorage.setItem(waterLastStorageKey, scheduleDate.toISOString());
        await AsyncStorage.setItem(waterIdStorageKey, id);
    } catch (error) {
        console.error('Failed scheduling notification: ', error);
    }
}

/**
 * Cancels water notification that has been scheduled using setWaterNotification().
 */
export async function cancelWaterNotification() {
    try {
        const notificationId = (await AsyncStorage.getItem(waterIdStorageKey)) ?? '';
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        console.log('Water notification canceled for the rest of the day.');
    } catch (error) {
        console.error('Failed scheduling notification: ', error);
    }
}

const sleepLastStorageKey = 'sleep_last_schedule_date';

/**
 * Schedules a notification at 22:00 reminding the user of their sleep.
 */
export async function setSleepNotification() {
    try {
        const today = new Date();
        const lastScheduleDay = (await AsyncStorage.getItem(sleepLastStorageKey)) ?? '';

        today.setHours(0, 0, 0, 0);

        if (lastScheduleDay) {
            const lastScheduledDateObject = new Date(lastScheduleDay);
            lastScheduledDateObject.setHours(0, 0, 0, 0);

            if (lastScheduledDateObject.toISOString() === today.toISOString()) {
                console.log('Sleep notification already handled');
                return;
            }
        }

        const scheduleDate = new Date();
        scheduleDate.setHours(22, 0, 0, 0);

        await scheduleNotification(
            scheduleDate,
            `Hi ${userName}!`,
            'Sleep is self-care too. Start winding down for bedtime'
        );
        await AsyncStorage.setItem(sleepLastStorageKey, scheduleDate.toISOString());
    } catch (error) {
        console.error('Failed scheduling notification: ', error);
    }
}

const morningLastStorageKey = 'morning_last_schedule_date';

export async function setMorningNotification() {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const lastScheduleDay = (await AsyncStorage.getItem(morningLastStorageKey)) ?? '';

        tomorrow.setHours(0, 0, 0, 0);

        if (lastScheduleDay) {
            const lastScheduledDateObject = new Date(lastScheduleDay);
            lastScheduledDateObject.setHours(0, 0, 0, 0);

            if (lastScheduledDateObject.toISOString() === tomorrow.toISOString()) {
                console.log('Morning notification already handled');
                return;
            }
        }

        const scheduleDate = tomorrow;
        scheduleDate.setHours(10, 0, 0, 0);

        await scheduleNotification(
            scheduleDate,
            `Good Morning ${userName}!`,
            'I hope you slept well! Good luck today!'
        );
        await AsyncStorage.setItem(morningLastStorageKey, scheduleDate.toISOString());
    } catch (error) {
        console.error('Failed scheduling notification: ', error);
    }
}
