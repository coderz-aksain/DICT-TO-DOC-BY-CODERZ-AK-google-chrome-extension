class WordDictionaryModal {
  constructor() {
    this.modal = null;
    this.selectedText = '';
    this.isLoading = false;
    this.init();
  }

  init() {
    this.createModal();
    this.attachEventListeners();
  }

  createModal() {
    // Create modal container
    this.modal = document.createElement('div');
    this.modal.id = 'word-dictionary-modal';
    this.modal.className = 'word-dict-modal-hidden';
    
    this.modal.innerHTML = `
      <div class="word-dict-modal-backdrop">
        <div class="word-dict-modal-content">
          <div class="word-dict-modal-header">
<h2 class="word-dict-modal-title">
  Dict To Doc By 
  <a href="https://www.linkedin.com/in/ayush-kumar-sain-8a63a1202/" target="_blank">Coderz Ak</a>
</h2>            <button class="word-dict-close-btn" aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="word-dict-modal-body">
            <div class="word-dict-selected-word">
              <h3 id="selected-word"></h3>
            </div>
            
            <div class="word-dict-loading" id="loading-spinner">
              <div class="word-dict-spinner"></div>
              <p>Looking up meanings...</p>
            </div>
            
            <div class="word-dict-meanings" id="meanings-container">
              <div class="word-dict-meaning-section">
                <h4>🇬🇧 English Meaning</h4>
                <div id="english-meaning" class="word-dict-meaning-content"></div>
              </div>
              
              <div class="word-dict-meaning-section">
                <h4>🇮🇳 Hindi Meaning</h4>
                <div id="hindi-meaning" class="word-dict-meaning-content"></div>
              </div>
            </div>
            
            <div class="word-dict-error" id="error-message">
              <p>Sorry, couldn't find the meaning for this word.</p>
            </div>
          </div>
          
          <div class="word-dict-modal-footer">
            <button class="word-dict-btn word-dict-btn-secondary" id="close-modal-btn">
              Close
            </button>
            <button class="word-dict-btn word-dict-btn-primary" id="save-to-docs-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
              Save to Google Docs
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);
  }

  attachEventListeners() {
    // Text selection listener
    document.addEventListener('mouseup', (e) => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      if (selectedText && selectedText.length > 0) {
        this.selectedText = selectedText;
        this.showModal();
        this.lookupWord(selectedText);
      }
    });

    // Modal event listeners
    this.modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('word-dict-modal-backdrop')) {
        this.hideModal();
      }
    });

    this.modal.querySelector('.word-dict-close-btn').addEventListener('click', () => {
      this.hideModal();
    });

    this.modal.querySelector('#close-modal-btn').addEventListener('click', () => {
      this.hideModal();
    });

    this.modal.querySelector('#save-to-docs-btn').addEventListener('click', () => {
      this.saveToGoogleDocs();
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modal.classList.contains('word-dict-modal-hidden')) {
        this.hideModal();
      }
    });
  }

  showModal() {
    this.modal.classList.remove('word-dict-modal-hidden');
    this.modal.classList.add('word-dict-modal-visible');
    document.getElementById('selected-word').textContent = this.selectedText;
    
    // Show loading state
    document.getElementById('loading-spinner').style.display = 'flex';
    document.getElementById('meanings-container').style.display = 'none';
    document.getElementById('error-message').style.display = 'none';
  }

  hideModal() {
    this.modal.classList.remove('word-dict-modal-visible');
    this.modal.classList.add('word-dict-modal-hidden');
    
    // Clear previous content
    document.getElementById('english-meaning').innerHTML = '';
    document.getElementById('hindi-meaning').innerHTML = '';
  }

  async lookupWord(word) {
    try {
      this.isLoading = true;
      
      // Get English meaning
      const englishMeaning = await this.getEnglishMeaning(word);
      
      // Get Hindi meaning
      const hindiMeaning = await this.getHindiMeaning(word);
      
      this.displayMeanings(englishMeaning, hindiMeaning);
      
    } catch (error) {
      console.error('Error looking up word:', error);
      this.showError();
    } finally {
      this.isLoading = false;
      document.getElementById('loading-spinner').style.display = 'none';
    }
  }

  async getEnglishMeaning(word) {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      
      if (!response.ok) {
        throw new Error('Word not found');
      }
      
      const data = await response.json();
      const entry = data[0];
      
      let meanings = [];
      entry.meanings.forEach(meaning => {
        meaning.definitions.forEach(def => {
          meanings.push({
            partOfSpeech: meaning.partOfSpeech,
            definition: def.definition,
            example: def.example
          });
        });
      });
      
      return meanings.slice(0, 3); // Limit to 3 meanings
    } catch (error) {
      console.error('Error fetching English meaning:', error);
      return [];
    }
  }

  async getHindiMeaning(word) {
    try {
      // Using Google Translate API for Hindi translation
      // Note: You'll need to set up Google Translate API key
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(word)}`);
      
      if (!response.ok) {
        throw new Error('Translation failed');
      }
      
      const data = await response.json();
      const translation = data[0][0][0];
      
      return translation;
    } catch (error) {
      console.error('Error fetching Hindi meaning:', error);
      return 'Hindi meaning not available';
    }
  }

  displayMeanings(englishMeanings, hindiMeaning) {
    const englishContainer = document.getElementById('english-meaning');
    const hindiContainer = document.getElementById('hindi-meaning');
    
    // Display English meanings
    if (englishMeanings.length > 0) {
      englishContainer.innerHTML = englishMeanings.map(meaning => `
        <div class="word-dict-definition">
          <span class="word-dict-part-of-speech">${meaning.partOfSpeech}</span>
          <p class="word-dict-definition-text">${meaning.definition}</p>
          ${meaning.example ? `<p class="word-dict-example"><em>Example: ${meaning.example}</em></p>` : ''}
        </div>
      `).join('');
    } else {
      englishContainer.innerHTML = '<p>English meaning not available</p>';
    }
    
    // Display Hindi meaning
    hindiContainer.innerHTML = `<p class="word-dict-hindi-text">${hindiMeaning}</p>`;
    
    // Show meanings container
    document.getElementById('meanings-container').style.display = 'block';
  }

  showError() {
    document.getElementById('error-message').style.display = 'block';
    document.getElementById('meanings-container').style.display = 'none';
  }

  async saveToGoogleDocs() {
    try {
      const englishMeaning = document.getElementById('english-meaning').textContent;
      const hindiMeaning = document.getElementById('hindi-meaning').textContent;
      
      const content = `
Word: ${this.selectedText}
English Meaning: ${englishMeaning}
Hindi Meaning: ${hindiMeaning}

      `;
      
      // Send message to background script to handle Google Docs API
      chrome.runtime.sendMessage({
        action: 'saveToGoogleDocs',
        content: content,
        word: this.selectedText
      }, (response) => {
        if (response.success) {
          this.showSuccessMessage();
        } else {
          this.showErrorMessage('Failed to save to Google Docs');
        }
      });
      
    } catch (error) {
      console.error('Error saving to Google Docs:', error);
      this.showErrorMessage('Failed to save to Google Docs');
    }
  }

  showSuccessMessage() {
    const successMsg = document.createElement('div');
    successMsg.className = 'word-dict-success-message';
    successMsg.textContent = '✓ Saved to Google Docs successfully!';
    
    this.modal.querySelector('.word-dict-modal-footer').appendChild(successMsg);
    
    setTimeout(() => {
      successMsg.remove();
    }, 3000);
  }

  showErrorMessage(message) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'word-dict-error-message';
    errorMsg.textContent = `✗ ${message}`;
    
    this.modal.querySelector('.word-dict-modal-footer').appendChild(errorMsg);
    
    setTimeout(() => {
      errorMsg.remove();
    }, 3000);
  }
}

// Initialize the extension when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new WordDictionaryModal();
  });
} else {
  new WordDictionaryModal();
}