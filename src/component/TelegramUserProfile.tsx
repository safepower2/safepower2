import React from 'react';
import { useTelegramMiniApp } from '../TelegramMiniAppContext';
import './TelegramUserProfile.css';

export const TelegramUserProfile = () => {
  // Initialize Telegram Web App
  (window as any).Telegram.WebApp.ready();

  const userData = useTelegramMiniApp();

  if (!userData) {
    return (
      <div className="notification">
        <p>
          For the best experience, open inside Telegram.
          <br />
          Just go to: <a href="https://t.me/SafePower2Bot/app">t.me/SafePower2Bot/app</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="notification">
      <h3>Welcome, {userData.first_name}!</h3>
      <p>
        <strong>Username:</strong> {userData.username || 'N/A'}
      </p>
      <p>
        <strong>Full Name:</strong> {userData.first_name} {userData.last_name}
      </p>
    </div>
  );
};
