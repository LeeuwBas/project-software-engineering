import { getSyncData } from '@/lib/storage';
import { postAPI } from '@/lib/api/ApiManager';
import { internalAuth } from '@/lib/auth/AuthService';

/**
 * Sends all local unsynced data to the server. in order to synchronize.
 *
 * @param includeGoals Weather goals should be synced too.
 */
export async function syncServer(includeGoals: boolean) {
    if (internalAuth.accessToken === null || internalAuth.isGuest) {
        return;
    }

    console.log('syncing...');

    if (includeGoals) {
        await Promise.all([syncStats(), syncStats(true)]);
    }
    await syncStats();
}

async function syncStats(goals: boolean = false) {
    const syncData = await getSyncData(goals);
    const promises: Promise<void>[] = [];
    for (const key of Object.keys(syncData)) {
        const endpoint = goals ? `/api/goals/${key}` : `/api/stats/${key}`;
        promises.push(
            postAPI(endpoint, { ['stats']: syncData[key] }).then(
                (response) => {
                    console.log(
                        `Synced stats for ${key} (goals=${goals}) with response:`,
                        response
                    );
                },
                (reason) => {
                    console.log(`Failed to sync stats for ${key}: ${reason}`);
                }
            )
        );
    }

    // Wait for all API calls at the end to not sync everything serial.
    await Promise.allSettled(promises);
}
