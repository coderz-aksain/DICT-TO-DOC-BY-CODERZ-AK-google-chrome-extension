// Background script for handling Google Docs API integration
const GOOGLE_DOCS_API_URL = 'https://docs.googleapis.com/v1/documents';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveToGoogleDocs') {
    handleSaveToGoogleDocs(request.content, request.word)
      .then(result => {
        sendResponse({ success: true, result });
      })
      .catch(error => {
        console.error('Error saving to Google Docs:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Keep the message channel open for async response
  }
});

async function handleSaveToGoogleDocs(content, word) {
  try {
    // Get auth token
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Authentication failed');
    }
    
    // Get or create the dictionary document
    const docId = await getOrCreateDictionaryDoc(token);
    
    // Append content to the document
    await appendToDocument(token, docId, content);
    
    return { success: true, docId };
  } catch (error) {
    throw error;
  }
}

async function getAuthToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(token);
      }
    });
  });
}

async function getOrCreateDictionaryDoc(token) {
  try {
    // First, try to find existing dictionary document
    const searchResponse = await fetch(
      'https://www.googleapis.com/drive/v3/files?q=name="My Dictionary" and mimeType="application/vnd.google-apps.document"',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    const searchData = await searchResponse.json();
    
    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }
    
    // Create new document if not found
    const createResponse = await fetch('https://docs.googleapis.com/v1/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'My Dictionary'
      })
    });
    
    const createData = await createResponse.json();
    return createData.documentId;
    
  } catch (error) {
    throw new Error('Failed to create/find dictionary document');
  }
}

async function appendToDocument(token, docId, content) {
  try {
    // Get document to find the end index
    const getResponse = await fetch(`${GOOGLE_DOCS_API_URL}/${docId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const doc = await getResponse.json();
    const endIndex = doc.body.content[doc.body.content.length - 1].endIndex - 1;
    
    // Append content to the document
    const updateResponse = await fetch(`${GOOGLE_DOCS_API_URL}/${docId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: {
                index: endIndex
              },
              text: `\n${content}\n`
            }
          }
        ]
      })
    });
    
    if (!updateResponse.ok) {
      throw new Error('Failed to update document');
    }
    
    return true;
  } catch (error) {
    throw new Error('Failed to append content to document');
  }
}

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Word Dictionary Extension installed');
});