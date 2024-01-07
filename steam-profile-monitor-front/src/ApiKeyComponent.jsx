// ApiKeyComponent.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApiKeyComponent = ({ defaultApiKeyStatus = 'Not Set', fetchData }) => {
  const [apiKeyStatus, setApiKeyStatus] = useState(defaultApiKeyStatus);

  useEffect(() => {
    // Load API key status from local storage on component mount
    const storedApiKeyStatus = localStorage.getItem('apiKeyStatus');
    setApiKeyStatus(storedApiKeyStatus || defaultApiKeyStatus);
  }, [defaultApiKeyStatus]);

  const handleSetApiKey = () => {
    const newApiKey = prompt('Enter your API key:');
    if (newApiKey) {
      axios
        .post('http://129.151.218.86:3000/setApiKey', { newApiKey })
        .then(() => {
          setApiKeyStatus('Set');
          localStorage.setItem('apiKeyStatus', 'Set');
          fetchData();
        })
        .catch((error) => {
          console.error('Error setting API key:', error);
          setApiKeyStatus('Error Setting');
          localStorage.setItem('apiKeyStatus', 'Error Setting');
        });
    }
  };

  return (
    <button
      className={`action-button ${apiKeyStatus === 'Set' ? 'set-api-key' : 'unset-api-key'}`}
      onClick={handleSetApiKey}
    >
      Set API Key
    </button>
  );
};

export default ApiKeyComponent;
