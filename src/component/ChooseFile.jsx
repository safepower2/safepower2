import axios from "axios";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { getAppId } from "../utils/helpers";
import CustomPopup from "./customPopup/CustomPopup";
import { generateUserSeed } from "./auth/Auth";

const API_BASE = "https://nillion-storage-apis-v0.onrender.com";
export default function ChooseFile({ account, myFiles, setMyFilesData, sharedFiles, setFilesSharedWithMe }) {
  const [appId, setAppId] = useState(null);
  const [userSeed, setUserSeed] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [addressForShare, setAddressForShare] = useState(false);
  const [file, setFile] = useState();
  const fileInputRef = useRef(null);
  const [uploadButtonText, setUploadButtonText] = useState("Upload");

  useEffect(() => {
    async function init() {
      setIsLoading(true);

      try {
        const appId = await getAppId();
        setAppId(appId);
        const generatedUserSeed = await generateUserSeed();
        console.log("Generated user seed:", generatedUserSeed);
        setUserSeed(generatedUserSeed);
      } catch (error) {
        console.error("Login failed:", error);
      }
      setIsLoading(false);
    }
    init();
  }, [account]);

  const handleFileUpload = async (event) => {
    setUploadButtonText("Uploading...");
    const file = event.target.files[0];
    console.log("File selected:", file);
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
        if(!addressForShare || addressForShare.trim() === "" ) {
          setMyFilesData([{name: file.name}, ...myFiles]);
        } else {
          setFilesSharedWithMe([{name: file.name}, ...sharedFiles]);
        }
        setIsShowPopup(false);
        
      } catch (error) {
        console.error("File upload failed:", error);
        alert("File upload failed: " + error.message);
      }

      setUploadButtonText("Upload");
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

  const handlePopup = (event) => {
    setIsShowPopup(true);
    const file = event.target.files[0];
    if (!file) return;
    setFile(event);
  };

  return (
    <div>
      <CustomPopup open={isShowPopup} closed={setIsShowPopup}>
        <div className="popup-container">
          <button className="btn-popup" onClick={() => handleFileUpload(file)}>
            {uploadButtonText}
          </button>
          {/* <div>
            <input
              type="checkbox"
              name="isCorrect"
              checked={isShowFiledAddress}
              onChange={(e) => setIsShowFieldAddress(e.target.checked)}
            />
            <label>Share With</label>
          </div> */}
        </div>
        <div>Share With (Optional)</div>
        <input
          type="text"
          id="address"
          placeholder="Telegram, Wallet Address, Nillion User Id"
          onChange={(e) => setAddressForShare(e.target.value)}
        />
      </CustomPopup>
      {!appId ? (
        <>{isLoading ? "Loading..." : "Fetching App Id..."}</>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handlePopup}
            className="file-input"
            style={{ display: "none" }}
          />
          <button
            style={{ }}
            className="btn-login"
            onClick={() => fileInputRef.current.click()}
          >
            Choose File
          </button>
        </div>
      )}
    </div>
  );
}

ChooseFile.propTypes = {
  account: PropTypes.string,
};
