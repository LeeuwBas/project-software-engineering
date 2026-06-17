import { initializeApiManager } from "./api/APIBridge";
import { syncServer } from "./StorageSync";

export function scheduleCacheFlush() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0);

    const flushTimer = midnight.getMilliseconds() - now.getMilliseconds();

    setTimeout(() => {
        flushCache();
        scheduleCacheFlush();
    }, flushTimer)
}

async function flushCache() {
    await initializeApiManager();
    await syncServer(true);
}
