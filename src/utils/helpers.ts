import axios from 'axios';

export const API_BASE = 'https://nillion-storage-apis-v0.onrender.com';


export async function getAppId() {
  const storedAppId = localStorage.getItem('app_id');
  if (storedAppId) {
    return storedAppId;
  }

  // TODO: Move the code next to the backend, and query the backend for the app_id

  const safePower2_nillion_seed = 'SomeFixedSeed';

  const userResponse = await axios.post(`${API_BASE}/api/user`, {
    nillion_seed: safePower2_nillion_seed,
  });
  const nillionUserId = userResponse.data.nillion_user_id;

  const appResponse = await fetch(`${API_BASE}/api/apps/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nillion_user_id: nillionUserId }),
  });

  if (!appResponse.ok) {
    throw new Error('Failed to register app');
  }

  const appData = await appResponse.json();
  const appId = appData.app_id;

  localStorage.setItem('app_id', appId);

  return appId;
}
