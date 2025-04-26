const fs = require('fs');
const path = require('path');
const https = require('https');

// Create directory if it doesn't exist
const assetsDir = path.join(__dirname, '../frontend/public/assets/images/icons');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Simple SVG icons - we'll embed these directly as strings
const icons = [
  {
    name: 'blockchain',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      <path d="M6 11h4"></path>
      <path d="M14 11h4"></path>
    </svg>`
  },
  {
    name: 'ethereum',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2L2 12l10 10 10-10z"></path>
      <path d="M12 22v-9"></path>
      <path d="M12 13V2"></path>
    </svg>`
  },
  {
    name: 'solana',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 8h12a4 4 0 1 0 0-8H4v8z"></path>
      <path d="M4 16h12a4 4 0 1 1 0-8H4v8z"></path>
      <path d="M4 24h12a4 4 0 1 0 0-8H4v8z"></path>
    </svg>`
  },
  {
    name: 'nft',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 2h4l4 10-4 10h-4l-4-10z"></path>
      <path d="M2 12h20"></path>
      <path d="M14 2v20"></path>
    </svg>`
  },
  {
    name: 'wallet',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
      <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
      <path d="M18 12a2 2 0 0 0 0 4h2v-4z"></path>
    </svg>`
  },
  {
    name: 'code',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>`
  },
  {
    name: 'security',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>`
  },
  {
    name: 'escrow',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <circle cx="15.5" cy="8.5" r="1.5"></circle>
      <path d="M17 16.5c-1.4 1.4-3.1 2-4.9 2s-3.6-.6-4.9-2"></path>
    </svg>`
  }
];

// Save SVG files
async function saveIcons() {
  console.log('Creating SVG icons...');
  
  icons.forEach(icon => {
    const filePath = path.join(assetsDir, `${icon.name}.svg`);
    fs.writeFileSync(filePath, icon.svg);
    console.log(`Created: ${filePath}`);
  });
  
  console.log('All SVG icons created!');
}

saveIcons(); 