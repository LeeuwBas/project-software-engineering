import { getSyncData, setStatBulk } from '@/lib/storage';
import { getAPI, postAPI } from '@/lib/api/ApiManager';
import { internalAuth } from '@/lib/auth/AuthService';
import { formatDate } from '@/lib/utils';

/**
 * Loads a period of three months from the server to local storage, such that a cache is present.
 *
 * @param includeGoals Weather goals should be loaded too.
 */
export async function loadServer(includeGoals: boolean) {
    if (internalAuth.accessToken === null || internalAuth.isGuest) {
        return;
    }

    console.log('Loading from server...');

    if (includeGoals) {
        await Promise.all([syncStats(false), syncStats(true)]);
    } else {
        await loadStats();
    }
}

async function loadStats(goals: boolean = false) {
    const now = new Date();
    const then = new Date();
    then.setDate(then.getDate() - 60); // Load past 60 days.
    const endpoint =
        (goals ? `/api/goals/bulk/` : `/api/stats/bulk/`) +
        `?start_date=${formatDate(then)}&end_date=${formatDate(now)}`;

    const response = await getAPI(endpoint);
    if (response) {
        await setStatBulk(response, goals);
    }
}

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
    } else {
        await syncStats();
    }
}

async function syncStats(goals: boolean = false) {
    const syncData = await getSyncData(goals);
    const endpoint = goals ? `/api/goals/bulk/` : `/api/stats/bulk/`;
    await postAPI(endpoint, syncData).then(
        (response) => {
            console.log(`Synced stats (goals=${goals}) with response:`, response);
        },
        (reason) => {
            console.log(`Failed to sync stats: ${reason}`);
        }
    );
}
