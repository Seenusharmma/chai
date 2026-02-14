import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
}

const defaultOptions: CompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    const compressedFile = await imageCompression(file, mergedOptions);
    console.log(`Image compressed: ${file.size / 1024 / 1024}MB -> ${compressedFile.size / 1024 / 1024}MB`);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    return file;
  }
}

export async function getCompressedImageUrl(
  file: File,
  options: CompressionOptions = {}
): Promise<string> {
  const compressedFile = await compressImage(file, options);
  return URL.createObjectURL(compressedFile);
}
