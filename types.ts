
export interface ImageFile {
  data: string; // base64 encoded
  mimeType: string;
  name: string;
}

export interface ClothingItem {
  id: string;
  name: string;
  image: {
    data: string; // base64
    mimeType: string;
  };
}

export interface GeneratedImage {
  id: string;
  personImage: string; // base64 of original person
  clothingItem: ClothingItem;
  generatedImage: string; // base64 of new image
}