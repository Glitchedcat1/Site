// sync.js

const SYNC_URL_1 = "https://mathhelpog1.netlify.app/sync"; // URL to sync with the first website
const SYNC_URL_2 = "https://mathhelpog2.netlify.app/sync"; // URL to sync with the second website

// Sync Timer State
async function syncTimerState(endTime, disabled) {
    const syncData = { endTime, disabled };

    try {
        // Sync with the first website
        await fetch(SYNC_URL_1, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(syncData)
        });

        // Sync with the second website
        await fetch(SYNC_URL_2, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(syncData)
        });
    } catch (error) {
        console.error("Error syncing timer state:", error);
    }
}
