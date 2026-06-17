import { initializeApiManager } from "./api/APIBridge";
import { syncServer } from "./StorageSync";

export let nextTimer = new Date();

export function scheduleCacheFlush() {
    const now = new Date();
    nextTimer = new Date();
    nextTimer.setHours(24, 0, 0);

    const flushTimer = nextTimer.getTime() - now.getTime();

    console.log(`start cache refresh time out, ${flushTimer/1000} seconds until midnight`)

    setTimeout(() => {
        flushCache();
    }, flushTimer)
}

export async function flushCache() {
    await initializeApiManager();
    await syncServer(true);
    scheduleCacheFlush();
}
