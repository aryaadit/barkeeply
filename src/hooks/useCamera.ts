import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export interface CameraPhoto {
  dataUrl: string;
  format: string;
}

export async function takePhoto(): Promise<CameraPhoto | null> {
  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    if (photo.dataUrl) {
      return {
        dataUrl: photo.dataUrl,
        format: photo.format,
      };
    }
    return null;
  } catch (error) {
    console.error('Error taking photo:', error);
    return null;
  }
}

export async function pickFromGallery(): Promise<CameraPhoto | null> {
  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });

    if (photo.dataUrl) {
      return {
        dataUrl: photo.dataUrl,
        format: photo.format,
      };
    }
    return null;
  } catch (error) {
    console.error('Error picking from gallery:', error);
    return null;
  }
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
