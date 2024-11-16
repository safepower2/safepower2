import {TelegramMiniAppProvider} from './TelegramMiniAppContext';
import {TelegramUserProfile} from './components/TelegramUserProfile';
import "./App.css";
import Auth from "./component/auth/Auth";
import ChooseFile from "./component/ChooseFile";

const App = () => {
  return (
    <TelegramMiniAppProvider>
      <TelegramUserProfile />
      <Auth />
      <ChooseFile />
    </TelegramMiniAppProvider>
  );
};

export default App;
