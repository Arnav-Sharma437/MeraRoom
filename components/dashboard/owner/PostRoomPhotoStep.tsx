'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Loader from '@/components/ui/Loader';

export interface PhotoItem {
  id: string;
  preview: string;
  url: string | null;
  uploading: boolean;
  progress: number;
}

interface PostRoomPhotoStepProps {
  images: PhotoItem[];
  setImages: React.Dispatch<React.SetStateAction<PhotoItem[]>>;
  error?: string;
}

export default function PostRoomPhotoStep({ images, setImages, error }: PostRoomPhotoStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const uploadImage = async (file: File, itemId: string): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post<{ success: boolean; url?: string; data?: { url: string } }>(
        '/api/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / (e.total ?? 1));
            setUploadProgress((prev) => ({ ...prev, [itemId]: percent }));
          },
        }
      );
      const url = res.data.url ?? res.data.data?.url;
      return url ?? null;
    } catch {
      toast.error(`Failed to upload ${file.name}`);
      return null;
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';

    if (images.length + files.length > 10) {
      toast.error('Maximum 10 photos allowed');
      return;
    }

    const valid = files.filter((f) => {
      if (!f.type.startsWith('image/')) {
        toast.error(`${f.name} is not an image`);
        return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name} exceeds 5MB`);
        return false;
      }
      return true;
    });

    const previews: PhotoItem[] = valid.map((f) => ({
      id: `${Date.now()}-${f.name}`,
      preview: URL.createObjectURL(f),
      url: null,
      uploading: true,
      progress: 0,
    }));

    setImages((prev) => [...prev, ...previews]);

    for (let i = 0; i < valid.length; i++) {
      const file = valid[i];
      const item = previews[i];
      const url = await uploadImage(file, item.id);
      setImages((current) =>
        current.map((img) =>
          img.id === item.id ? { ...img, url, uploading: false, progress: 100 } : img
        )
      );
      if (!url) {
        setImages((current) => current.filter((img) => img.id !== item.id));
      }
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const uploadedUrls = images.filter((i) => i.url).map((i) => i.url!);

  return (
    <div>
      <h3 className="font-semibold mb-1">Add Photos</h3>
      <p className="text-gray-500 text-sm mb-4">Good photos get 3x more inquiries</p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {images.length === 0 ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-[#16A34A]/40 rounded-2xl p-10 text-center cursor-pointer hover:border-[#16A34A] hover:bg-[#F0FDF4] dark:hover:bg-[#0F2E1E]/20 transition-default"
        >
          <Upload size={40} className="mx-auto text-[#16A34A]/40" />
          <p className="text-gray-500 text-sm mt-2 font-medium">Tap to upload photos</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG · Max 5MB each · Up to 10 photos</p>
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, index) => (
            <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-[#111A11]">
              <Image
                src={img.preview}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
              {img.uploading && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                  <Loader size="sm" className="border-white border-t-transparent" />
                  <span className="text-white text-xs mt-2">
                    {uploadProgress[img.id] ?? 0}%
                  </span>
                </div>
              )}
              {img.url && (
                <>
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors group">
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 bg-[#D4AF37] text-[#0F2E1E] text-[10px] font-bold rounded-full px-2 py-0.5">
                      Cover
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
          {images.length < 10 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-[#16A34A]/40 flex flex-col items-center justify-center text-[#16A34A] hover:bg-[#F0FDF4] dark:hover:bg-[#0F2E1E]/20"
            >
              <Plus size={28} />
              <span className="text-xs mt-1">Add more</span>
            </button>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      <p className="text-xs text-gray-400 mt-2 sr-only">{uploadedUrls.length} uploaded</p>
    </div>
  );
}
