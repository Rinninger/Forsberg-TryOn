
import React from 'react';
import type { ClothingItem } from '../types';
import ImageUploader from './ImageUploader';

interface DressingRoomProps {
  clothingItems: ClothingItem[];
  onClothingUpload: (base64: string, file: File) => void;
  selectedClothingId: string | null;
  onSelectClothing: (item: ClothingItem) => void;
}

const DressingRoom: React.FC<DressingRoomProps> = ({
  clothingItems,
  onClothingUpload,
  selectedClothingId,
  onSelectClothing,
}) => {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-2xl font-bold text-white border-b-2 border-zinc-700 pb-2 mb-4">2. Add to Wardrobe</h2>
        <ImageUploader 
          onImageUpload={onClothingUpload} 
          title="Upload Clothing" 
          id="clothing-uploader"
          className="h-40"
        />
      </div>
      <div className="flex flex-col flex-grow min-h-0">
        <h2 className="text-2xl font-bold text-white border-b-2 border-zinc-700 pb-2 mb-4">3. Select Item</h2>
        {clothingItems.length === 0 ? (
          <div className="flex-grow flex items-center justify-center bg-black/50 rounded-lg">
             <p className="text-zinc-500 text-center">Your wardrobe is empty. <br/> Add some clothes to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3 pr-2 overflow-y-auto flex-grow max-h-[400px]">
            {clothingItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectClothing(item)}
                className={`relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-4 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/50
                  ${selectedClothingId === item.id ? 'border-white scale-105' : 'border-transparent hover:border-zinc-700'}
                `}
              >
                <img
                  src={`data:${item.image.mimeType};base64,${item.image.data}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                 {selectedClothingId === item.id && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DressingRoom;