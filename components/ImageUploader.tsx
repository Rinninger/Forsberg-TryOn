
import React, { useState, useRef, useCallback, DragEvent } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (base64: string, file: File) => void;
  title: string;
  id: string;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, title, id, className = '' }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setPreview(reader.result as string);
        onImageUpload(base64String, file);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files);
    }
  };

  return (
    <div
      onClick={handleAreaClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative w-full border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer transition-all duration-300 ${isDragging ? 'border-white bg-zinc-800/50' : 'hover:border-zinc-500 hover:bg-zinc-900/30'} ${className}`}
    >
      <input
        type="file"
        id={id}
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={(e) => handleFileChange(e.target.files)}
      />
      {preview ? (
        <img src={preview} alt={`${title} preview`} className="w-full h-full object-contain rounded-lg" />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-zinc-500 p-4 text-center">
            <UploadIcon className="w-12 h-12 mb-2" />
            <p className="font-semibold">Click to upload or drag & drop</p>
            <p className="text-sm">{title}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;