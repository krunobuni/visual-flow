import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef();

  // Sites de arte que não bloqueiam hotlinking
  const artSources = [
    // Wikimedia Commons - milhões de obras de arte
    () => `https://commons.wikimedia.org/wiki/Special:Random/File?${Date.now()}`,
    
    // Museum APIs sem chave
    () => `https://collectionapi.metmuseum.org/public/collection/v1/objects/${Math.floor(Math.random() * 500000)}`,
    
    // Raw images de museus
    () => `https://images.metmuseum.org/CRDImages/ep/original/EP${Math.floor(100 + Math.random() * 900)}.jpg`,
    
    // Imagens do Rijksmuseum
    () => `https://www.rijksmuseum.nl/api/en/collection/SK-C-5?key=0&format=json&imgonly=true`,
  ];

  const getRandomImage = async () => {
    try {
      // Tenta várias fontes até uma funcionar
      for (let source of artSources) {
        const url = source();
        const response = await fetch(url, { mode: 'no-cors' });
        if (response.ok) return url;
      }
    } catch (e) {}
    
    // Fallback - Unsplash com termos específicos
    const terms = ['abstract', 'painting', 'design', 'art', 'graphic', 'illustration', 'drawing'];
    const term = terms[Math.floor(Math.random() * terms.length)];
    return `https://source.unsplash.com/1600x900/?${term}&t=${Date.now()}`;
  };

  const loadNewImage = async () => {
    const newImage = await getRandomImage();
    setImageUrl(newImage);
  };

  useEffect(() => {
    loadNewImage();
    
    if (isPlaying) {
      intervalRef.current = setInterval(loadNewImage, 5000);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const downloadImage = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `art-${Date.now()}.jpg`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {imageUrl && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30 scale-110"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <img 
            src={imageUrl} 
            alt="Art"
            className="absolute inset-0 m-auto max-w-full max-h-full object-contain z-10"
            onError={loadNewImage}
          />
        </>
      )}
      
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3 flex gap-4 z-20">
        <button onClick={() => setIsPlaying(!isPlaying)} className="text-white text-2xl">
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button onClick={loadNewImage} className="text-white text-2xl">
          ⏭️
        </button>
        <button onClick={downloadImage} className="text-white text-2xl">
          📥
        </button>
      </div>
    </div>
  );
}

export default App;
