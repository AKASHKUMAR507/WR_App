import { create } from "zustand";

const usePhotoStore = create((set) => ({
  photos: [],
  setPhotos: (newPhoto) => { set((state) => ({ photos: [...state.photos, newPhoto] })) },
  resetPhotos: () => { set({ photos: [] }) },
  removePhotoByIndex: (index) => { set((state) => ({ photos: state.photos.flat(10).filter((_, i) => i !== index) })) },
}));

function getFileSize(photos) {
  if (photos?.length < 0) return 0;

  const totalSize = photos?.reduce((accumulator, photo) => accumulator + photo.size, 0);
  const fileSizeKB = totalSize / (1024 * 1024);
  return fileSizeKB.toFixed(2);
}

export default usePhotoStore;
export { getFileSize }
