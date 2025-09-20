# Word Dictionary Chrome Extension

A beautiful Chrome extension that provides English and Hindi meanings for selected text and saves them to Google Docs.

## Features

- 🔍 **Text Selection**: Simply select any text on any webpage to get meanings
- 🌍 **Bilingual Support**: Get meanings in both English and Hindi
- 📝 **Google Docs Integration**: Save words with meanings to your personal dictionary
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations
- ⚡ **Fast Performance**: Quick API responses and efficient caching

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension should now appear in your extensions list

## Setup Google Docs Integration

To enable Google Docs saving functionality:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Docs API and Google Drive API
4. Create OAuth 2.0 credentials for a Chrome extension
5. Add your extension ID to the authorized origins
6. Replace `YOUR_GOOGLE_CLIENT_ID` in `manifest.json` with your actual client ID

## How to Use

1. **Select Text**: Highlight any word or phrase on a webpage
2. **View Meanings**: A modal will automatically appear showing English and Hindi meanings
3. **Save to Google Docs**: Click the "Save to Google Docs" button to add the word to your personal dictionary
4. **Access Your Dictionary**: All saved words are stored in a Google Doc called "My Dictionary"

## File Structure

```
word-dictionary-extension/
├── manifest.json          # Extension configuration
├── content.js            # Main functionality script
├── content.css           # Modal and UI styles
├── background.js         # Google Docs API integration
├── popup.html           # Extension popup interface
├── popup.css            # Popup styles
├── popup.js             # Popup functionality
├── icons/               # Extension icons
│   ├── icon16.svg
│   ├── icon32.svg
│   ├── icon48.svg
│   └── icon128.svg
└── README.md           # This file
```

## APIs Used

- **Dictionary API**: [Free Dictionary API](https://dictionaryapi.dev/) for English meanings
- **Google Translate API**: For Hindi translations
- **Google Docs API**: For saving words to documents
- **Google Drive API**: For document management

## Customization

You can customize the extension by:

- Modifying the CSS in `content.css` for different styling
- Adding more languages in the translation logic
- Changing the modal behavior in `content.js`
- Updating the popup interface in `popup.html`

## Privacy

This extension:
- Only processes text you explicitly select
- Requires explicit permission for Google Docs access
- Does not store or transmit personal data beyond selected words
- Uses secure HTTPS APIs for all external requests

## Troubleshooting

**Modal not appearing**: Make sure the extension is enabled and try refreshing the page.

**Google Docs not saving**: Ensure you've connected your Google account through the popup and have proper API credentials set up.

**Meanings not loading**: Check your internet connection and verify the APIs are accessible.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.