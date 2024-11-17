import { useEffect, useState } from "react";
import { TelegramMiniAppProvider } from "./TelegramMiniAppContext";
import { TelegramUserProfile } from "./component/TelegramUserProfile";
import "./App.css";
import Auth from "./component/auth/Auth";
import ListManager from "./component/listManager/ListManager";

const App = () => {
  const [myFiles, setMyFilesData] = useState([]);
  const [sharedFiles, setFilesSharedWithMe] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setMyFilesData([
      { name: "top secret file" },
      { name: "another file" },
      { name: "some confidential file" },
    ]);
  }, []);

  useEffect(() => {
    setFilesSharedWithMe([
      { name: "shared business stuff" },
      { name: "among the family stuff" },
    ]);
  }, []);

  return (
    <TelegramMiniAppProvider>
      <TelegramUserProfile />
      <div className="container">
        <Auth loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        {loggedIn && <ListManager data={ {myFiles, sharedFiles} } title={"My Files"} />}
      </div>
    </TelegramMiniAppProvider>
  );
};

export default App;
