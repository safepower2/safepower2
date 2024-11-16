import axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const API_BASE = "https://nillion-storage-apis-v0.onrender.com";
export default function ChooseFile() {
    const [appId, setAppId] = useState(null);
    const [userSeed, setUserSeed] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedAppId = localStorage.getItem("app_id");
        const storedUserSeed = localStorage.getItem("user_seed");
        if (storedAppId && storedUserSeed) {
          setAppId(storedAppId);
          setUserSeed(storedUserSeed);
        }
      }, []);
    
      const handleLogin = async () => {
        setIsLoading(true);
        const newUserSeed = uuidv4();
        try {
          const userResponse = await axios.post(`${API_BASE}/api/user`, {
            nillion_seed: newUserSeed,
          });
          const nillionUserId = userResponse.data.nillion_user_id;
    
          const appResponse = await fetch(`${API_BASE}/api/apps/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ nillion_user_id: nillionUserId }),
          });
    
          if (!appResponse.ok) {
            throw new Error("Failed to register app");
          }
    
          const appData = await appResponse.json();
          const newAppId = appData.app_id;
    
          setAppId(newAppId);
          setUserSeed(newUserSeed);
          localStorage.setItem("app_id", newAppId);
          localStorage.setItem("user_seed", newUserSeed);
        } catch (error) {
          console.error("Login failed:", error);
        }
        setIsLoading(false);
      };
    
      const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onload = async (e) => {
          const blob = new Blob([e.target.result], { type: file.type });
          try {
            const response = await axios.post(
              `${API_BASE}/api/apps/${appId}/secrets`,
              {
                secret: {
                  nillion_seed: userSeed,
                  secret_value: await blobToBase64(blob),
                  secret_name: file.name,
                },
                permissions: {
                  retrieve: [],
                  update: [],
                  delete: [],
                  compute: {},
                },
              }
            );
            console.log("File uploaded:", response.data);
          } catch (error) {
            console.error("File upload failed:", error);
          }
        };
        reader.readAsArrayBuffer(file);
      };
    
      const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };
    

  return (
    <div className="login-container">
    {!appId ? (
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="login-button"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    ) : (
      <div className="user-info">
        <p>App ID: {appId}</p>
        <p>User Seed: {userSeed}</p>
        <input
          type="file"
          onChange={handleFileUpload}
          className="file-input"
        />
      </div>
    )}
  </div>
  )
}
