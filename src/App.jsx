import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef();

  // Unsplash com termos de arte - FUNCIONA DE VERDADE
  const artTerms = [
    'abstract painting', 'graphic design', 'modern art', 'contemporary art',
    'street art', 'pop art', 'minimalist art', 'conceptual art',
    'illustration', 'typography', 'digital art', 'mixed media',
    'art installation', 'surrealism', 'expressionism', 'cubism'
  ];

  const getRandomImage = () => {
    const randomTerm = artTerms[Math.floor(Math.random() * artTerms.length)];
    // Unsplash funciona SEM API key para imagens aleatórias
    return `https://source.unsplash.com/featured/1600x900/?${randomTerm}&${Date.now()}`;
  };

  const loadNewImage = () => {
    const newImage = getRandomImage();
    console.log('Loading:', newImage);
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
    if (!imageUrl) return;
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
      console.error('Download failed');
    }
  };

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {imageUrl ? (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30 scale-110"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <img 
            src={imageUrl} 
            alt="Art Inspiration"
            className="absolute inset-0 m-auto max-w-full max-h-full object-contain z-10"
            onError={loadNewImage}
          />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⟳</div>
            <p>Loading art...</p>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3 flex gap-4 z-20">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-white text-2xl hover:scale-110 transition"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button 
          onClick={loadNewImage}
          className="text-white text-2xl hover:scale-110 transition"
        >
          ⏭️
        </button>
        <button 
          onClick={downloadImage}
          className="text-white text-2xl hover:scale-110 transition"
        >
          📥
        </button>
      </div>
    </div>
  );
}

export default App;
