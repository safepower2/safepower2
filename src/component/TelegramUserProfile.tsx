import React from 'react';
import { useTelegramMiniApp } from '../TelegramMiniAppContext';

export const TelegramUserProfile = () => {
  // First, ensure the Telegram Web App is initialized
  (window as any).Telegram.WebApp.ready();

  const userData = useTelegramMiniApp();

  if (!userData) {
    return (
      <div>
        For the best experience open inside Telegram. <br />
        Just go to: <a href="https://t.me/SafePower2Bot/app">t.me/SafePower2Bot/app</a>.
      </div>
    );
  }

  return (
    <div>
      <h3>Telegram Profile</h3>
      <p>
        Username: <strong>{userData.username}</strong>
      </p>
      <p>
        Full Name:{' '}
        <strong>
          {userData.first_name} {userData.last_name}
        </strong>
      </p>
    </div>
  );
};
