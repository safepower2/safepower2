import React, { useState } from 'react';
import './ListManager.css';
import downloadIcon from '../../assets/download.png';
import PropTypes from 'prop-types';

export default function ListManager({ myFiles, sharedFiles }) {
  const [activeTab, setActiveTab] = useState('myFiles');

  const renderList = (data) => {
    return data && data.length > 0 ? (
      data.map((item, index) => (
        <div className="listmanager-list-item" key={index}>
          <div>{item.name}</div>
          <div>
            <span onClick={() => {}}>
              <img src={downloadIcon} width={22} alt="Download" />
            </span>
          </div>
        </div>
      ))
    ) : (
      <div className="listmanager-no-files">No files to display.</div>
    );
  };

  return (
    <div className="listmanager-tab-container">
      {/* Tab Headers */}
      <div className="listmanager-tab-headers">
        <button
          className={
            activeTab === 'myFiles'
              ? 'listmanager-tab listmanager-active'
              : 'listmanager-tab'
          }
          onClick={() => setActiveTab('myFiles')}
        >
          My Files
        </button>
        <button
          className={
            activeTab === 'sharedFiles'
              ? 'listmanager-tab listmanager-active'
              : 'listmanager-tab'
          }
          onClick={() => setActiveTab('sharedFiles')}
        >
          Files Shared With Me
        </button>
      </div>

      {/* Tab Content */}
      <div className="listmanager-tab-content">
        {activeTab === 'myFiles' && (
          <>
            <h2>My Files</h2>
            {renderList(myFiles)}
          </>
        )}
        {activeTab === 'sharedFiles' && (
          <>
            <h2>Files Shared With Me</h2>
            {renderList(sharedFiles)}
          </>
        )}
      </div>
    </div>
  );
}

ListManager.propTypes = {
  myFiles: PropTypes.array,
  sharedFiles: PropTypes.array,
};