document.addEventListener('DOMContentLoaded', () => {
  const authBtn = document.getElementById('auth-btn');
  const authStatus = document.getElementById('auth-status');

  // Check authentication status on popup open
  checkAuthStatus();

  authBtn.addEventListener('click', handleAuth);

  async function checkAuthStatus() {
    try {
      const token = await getAuthToken(false); // Don't show interactive dialog
      if (token) {
        updateAuthUI(true);
      } else {
        updateAuthUI(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      updateAuthUI(false);
    }
  }

  async function handleAuth() {
    authBtn.disabled = true;
    authStatus.textContent = 'Connecting...';
    authStatus.className = 'auth-status';

    try {
      const token = await getAuthToken(true); // Show interactive dialog
      if (token) {
        updateAuthUI(true);
      } else {
        throw new Error('Failed to get authentication token');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      updateAuthUI(false, 'Connection failed');
    } finally {
      authBtn.disabled = false;
    }
  }

  function updateAuthUI(isConnected, errorMessage = '') {
    if (isConnected) {
      authBtn.textContent = '✓ Connected to Google Docs';
      authStatus.textContent = 'Ready to save words';
      authStatus.className = 'auth-status connected';
    } else {
      authBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"></path>
          <path d="M14.5 2v4h4"></path>
        </svg>
        Connect Google Docs
      `;
      authStatus.textContent = errorMessage || 'Not connected';
      authStatus.className = errorMessage ? 'auth-status error' : 'auth-status';
    }
  }

  function getAuthToken(interactive = false) {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive }, (token) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(token);
        }
      });
    });
  }
});