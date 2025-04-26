const fs = require('fs');
const path = require('path');
const https = require('https');

// Create directory if it doesn't exist
const assetsDir = path.join(__dirname, '../frontend/public/assets/images');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// List of images to download
const imageUrls = [
  // Freelancer profile images
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    filename: 'freelancer1.jpg',
    category: 'profiles'
  },
  {
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop',
    filename: 'freelancer2.jpg',
    category: 'profiles'
  },
  {
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop',
    filename: 'freelancer3.jpg',
    category: 'profiles'
  },
  {
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
    filename: 'freelancer4.jpg',
    category: 'profiles'
  },
  {
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop',
    filename: 'freelancer5.jpg',
    category: 'profiles'
  },
  {
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop',
    filename: 'freelancer6.jpg',
    category: 'profiles'
  },
  
  // Web3 related project images
  {
    url: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=600&auto=format&fit=crop',
    filename: 'project1.jpg',
    category: 'projects'
  },
  {
    url: 'https://images.unsplash.com/photo-1642052502780-8ee67c2c714c?q=80&w=600&auto=format&fit=crop',
    filename: 'project2.jpg',
    category: 'projects'
  },
  {
    url: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=600&auto=format&fit=crop',
    filename: 'project3.jpg',
    category: 'projects'
  },
  {
    url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop',
    filename: 'project4.jpg',
    category: 'projects'
  },
  
  // Hero background images
  {
    url: 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?q=80&w=1200&auto=format&fit=crop',
    filename: 'hero-bg.jpg',
    category: 'backgrounds'
  },
  {
    url: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200&auto=format&fit=crop',
    filename: 'cta-bg.jpg',
    category: 'backgrounds'
  },
  {
    url: 'https://images.unsplash.com/photo-1642052502672-04ad9982d4c2?q=80&w=1200&auto=format&fit=crop',
    filename: 'pattern-bg.jpg',
    category: 'backgrounds'
  }
];

// Create category subdirectories
const categories = [...new Set(imageUrls.map(img => img.category))];
categories.forEach(category => {
  const categoryDir = path.join(assetsDir, category);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }
});

// Download function
const downloadImage = (url, filePath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      // Handle redirect
      if (response.statusCode === 302 || response.statusCode === 301) {
        downloadImage(response.headers.location, filePath)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      // Handle successful response
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filePath);
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${filePath}`);
          resolve();
        });
        
        file.on('error', (err) => {
          fs.unlink(filePath, () => {}); // Delete the file on error
          console.error(`Error writing file: ${filePath}`, err);
          reject(err);
        });
      } else {
        console.error(`Failed to download ${url}, status code: ${response.statusCode}`);
        reject(new Error(`HTTP status code ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.error(`Failed to download ${url}`, err);
      reject(err);
    });
  });
};

// Download all images
async function downloadAllImages() {
  console.log('Starting image downloads...');
  
  for (const image of imageUrls) {
    const filePath = path.join(assetsDir, image.category, image.filename);
    try {
      await downloadImage(image.url, filePath);
    } catch (error) {
      console.error(`Failed to download ${image.url}:`, error.message);
    }
  }
  
  console.log('All downloads completed!');
}

downloadAllImages(); 