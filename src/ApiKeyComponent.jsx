// ApiKeyComponent.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApiKeyComponent = ({ defaultApiKeyStatus = 'Not Set', fetchData, setApiKeyStatus }) => {
  const [localApiKeyStatus, setLocalApiKeyStatus] = useState(defaultApiKeyStatus);

  useEffect(() => {
    // Load API key status from local storage on component mount
    const storedApiKeyStatus = localStorage.getItem('apiKeyStatus');
    setLocalApiKeyStatus(storedApiKeyStatus || defaultApiKeyStatus);
  }, [defaultApiKeyStatus]);

  const handleSetApiKey = () => {
    const newApiKey = prompt('Enter your API key:');
    if (newApiKey) {
      axios
        .post('https://www.geckuss.com/setApiKey', { newApiKey })
        .then(() => {
          setLocalApiKeyStatus('Set');
          localStorage.setItem('apiKeyStatus', 'Set');
          fetchData();
          setApiKeyStatus('Set'); // Communicate to the parent component
        })
        .catch((error) => {
          console.error('Error setting API key:', error);
          setLocalApiKeyStatus('Error Setting');
          localStorage.setItem('apiKeyStatus', 'Error Setting');
          setApiKeyStatus('Error Setting'); // Communicate to the parent component
        });
    }
  };

  return (
    <button
      className={`action-button ${localApiKeyStatus === 'Set' ? 'set-api-key' : 'unset-api-key'}`}
      onClick={handleSetApiKey}
    >
      Set API Key
    </button>
  );
};

export default ApiKeyComponent;
