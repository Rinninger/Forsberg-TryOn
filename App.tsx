
import React, { useState, useCallback, useEffect } from 'react';
import { ClothingItem, GeneratedImage, ImageFile } from './types';
import { generateTryOnImage } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ImageSlider from './components/ImageSlider';
import DressingRoom from './components/DressingRoom';
import { LoadingIcon, SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<ImageFile | null>(null);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [selectedClothing, setSelectedClothing] = useState<ClothingItem | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [latestGeneratedImage, setLatestGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClothingFromUrl = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const clothingImageUrl = params.get('clothingImageUrl');
        const clothingName = params.get('clothingName') || 'Product';

        if (clothingImageUrl) {
          // To prevent CORS issues in a production environment, 
          // you might need to fetch the image via a proxy server.
          const response = await fetch(clothingImageUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch image. Status: ${response.status}`);
          }
          const blob = await response.blob();
          
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            if (base64String) {
              const initialClothingItem: ClothingItem = {
                id: `shop-product-${crypto.randomUUID()}`,
                name: clothingName,
                image: {
                  data: base64String,
                  mimeType: blob.type,
                },
              };
              setClothingItems(prev => [initialClothingItem, ...prev]);
              setSelectedClothing(initialClothingItem);
            }
          };
          reader.onerror = () => {
             setError("Could not read the clothing image from the shop.");
          };
          reader.readAsDataURL(blob);
        }
      } catch (err) {
        console.error("Error loading clothing from URL:", err);
        setError("Could not load the clothing image from the shop.");
      }
    };

    loadClothingFromUrl();
  }, []); // The empty dependency array ensures this runs only once on mount.


  const handlePersonUpload = useCallback((base64: string, file: File) => {
    setPersonImage({
      data: base64,
      mimeType: file.type,
      name: file.name,
    });
    setLatestGeneratedImage(null); // Reset when a new person is uploaded
  }, []);

  const handleClothingUpload = useCallback((base64: string, file: File) => {
    const newClothingItem: ClothingItem = {
      id: crypto.randomUUID(),
      name: file.name,
      image: {
        data: base64,
        mimeType: file.type,
      },
    };
    setClothingItems(prev => [newClothingItem, ...prev]);
  }, []);

  const handleGenerateClick = async () => {
    if (!personImage || !selectedClothing) {
      setError("Please upload a person's photo and select a clothing item.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setLatestGeneratedImage(null);

    try {
      const generatedImageBase64 = await generateTryOnImage(personImage, selectedClothing.image);
      const newGeneratedImage: GeneratedImage = {
        id: crypto.randomUUID(),
        personImage: personImage.data,
        clothingItem: selectedClothing,
        generatedImage: generatedImageBase64,
      };
      setLatestGeneratedImage(generatedImageBase64);
      setGeneratedImages(prev => [newGeneratedImage, ...prev]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
    } finally {
      setIsLoading(false);
    }
  };

  const isGenerateButtonDisabled = !personImage || !selectedClothing || isLoading;

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header />
      <main className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Main Studio Panel */}
          <div className="lg:col-span-3 bg-zinc-900 rounded-2xl shadow-xl p-6 flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white border-b-2 border-zinc-700 pb-2">1. Upload Your Photo</h2>
            <ImageUploader 
              onImageUpload={handlePersonUpload} 
              title="Upload Person"
              id="person-uploader"
              className="h-64"
            />
            
            <div className="mt-4 flex-grow flex flex-col">
              <h2 className="text-2xl font-bold text-white border-b-2 border-zinc-700 pb-2 mb-4">Result</h2>
              <div className="w-full flex-grow bg-black rounded-lg overflow-hidden relative min-h-[400px] flex items-center justify-center">
                {isLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-20">
                    <LoadingIcon className="w-16 h-16 text-white" />
                    <p className="mt-4 text-xl font-semibold animate-pulse">Generating your new look...</p>
                  </div>
                )}
                {!personImage && (
                   <p className="text-zinc-500">Upload a photo to see results here</p>
                )}
                {personImage && (latestGeneratedImage ? (
                  <ImageSlider 
                    beforeImage={`data:${personImage.mimeType};base64,${personImage.data}`}
                    afterImage={`data:image/png;base64,${latestGeneratedImage}`}
                  />
                ) : (
                  <img src={`data:${personImage.mimeType};base64,${personImage.data}`} alt="Person" className="object-contain h-full w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Dressing Room Panel */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-zinc-900 rounded-2xl shadow-xl p-6">
                <DressingRoom
                  clothingItems={clothingItems}
                  onClothingUpload={handleClothingUpload}
                  selectedClothingId={selectedClothing?.id || null}
                  onSelectClothing={setSelectedClothing}
                />
            </div>
            <button
                onClick={handleGenerateClick}
                disabled={isGenerateButtonDisabled}
                className={`w-full flex items-center justify-center gap-3 text-xl font-bold py-4 px-6 rounded-lg transition-all duration-300
                ${isGenerateButtonDisabled 
                  ? 'bg-zinc-800 cursor-not-allowed text-zinc-500'
                  : 'bg-white text-black hover:bg-zinc-200 active:scale-95 shadow-lg'
                }`}
              >
                <SparklesIcon className="w-7 h-7" />
                Generate Try-On
              </button>
              {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center">{error}</p>}
              
             <div className="bg-zinc-900 rounded-2xl shadow-xl p-6 mt-2">
                <h2 className="text-2xl font-bold text-white border-b-2 border-zinc-700 pb-2 mb-4">Generated Outfits</h2>
                {generatedImages.length === 0 ? (
                  <p className="text-zinc-500 text-center py-8">Your generated outfits will appear here.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2">
                    {generatedImages.map((img) => (
                      <div key={img.id} className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-2 border-zinc-800 hover:border-white transition-colors">
                        <img 
                          src={`data:image/png;base64,${img.generatedImage}`} 
                          alt={`Outfit with ${img.clothingItem.name}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;