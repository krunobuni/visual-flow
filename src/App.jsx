import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef();

  const categories = [
    'abstract art', 'graphic design', 'modern painting', 'street art',
    'digital illustration', 'pop art', 'minimalist design', 'contemporary art'
  ];

  const getRandomImage = () => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return `https://source.unsplash.com/1600x900/?${randomCategory}&t=${Date.now()}`;
  };

  const loadNewImage = () => {
    setImageUrl(getRandomImage());
  };

  useEffect(() => {
    loadNewImage();
    
    if (isPlaying) {
      intervalRef.current = setInterval(loadNewImage, 10000);
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
      link.download = `inspiration-${Date.now()}.jpg`;
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
            alt="Visual Inspiration"
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