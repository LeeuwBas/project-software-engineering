import { initializeApiManager } from "./api/APIBridge";
import { syncServer } from "./StorageSync";

export function scheduleCacheFlush() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0);

    const flushTimer = midnight.getTime() - now.getTime();

    console.log(`start cache refresh time out, ${flushTimer/1000} seconds until midnight`)

    setTimeout(() => {
        flushCache();
        scheduleCacheFlush();
    }, flushTimer)
}

async function flushCache() {
    await initializeApiManager();
    await syncServer(true);
}
