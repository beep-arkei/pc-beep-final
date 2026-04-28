import { supabase } from './supabase';

/**
 * Uploads a file to the 'product-images' bucket and returns the public URL.
 * @param file The file to upload
 * @returns The public URL of the uploaded file
 */
export const uploadToSupabase = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file);

  if (uploadError) {
    if (uploadError.message === 'Bucket not found') {
      try {
        // Attempt to auto-create the bucket (requires storage.buckets insert permission)
        const { error: createError } = await supabase.storage.createBucket('product-images', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB
        });
        
        if (createError) {
          console.warn('Could not auto-create bucket (likely permission issue):', createError);
        } else {
          // Retry the upload if bucket creation was successful
          const { error: retryError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);
          
          if (!retryError) {
            const { data } = supabase.storage
              .from('product-images')
              .getPublicUrl(filePath);
            return data.publicUrl;
          }
        }
      } catch (e) {
        console.error('Failed to auto-create bucket:', e);
      }
      
      throw new Error('Storage bucket "product-images" not found. Please create a PUBLIC bucket named "product-images" in your Supabase dashboard (Storage -> New Bucket).');
    }
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

/**
 * Uploads a file to the 'chat-attachments' bucket and returns the public URL.
 */
export const uploadChatAttachment = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `attachments/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('chat-attachments')
    .upload(filePath, file);

  if (uploadError) {
    if (uploadError.message === 'Bucket not found') {
      try {
        const { error: createError } = await supabase.storage.createBucket('chat-attachments', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (!createError) {
          const { error: retryError } = await supabase.storage
            .from('chat-attachments')
            .upload(filePath, file);
          
          if (!retryError) {
            const { data } = supabase.storage
              .from('chat-attachments')
              .getPublicUrl(filePath);
            return data.publicUrl;
          }
        }
      } catch (e) {
        console.error('Failed to auto-create bucket:', e);
      }
    }
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('chat-attachments')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

/**
 * Uploads a file to the 'refund-evidence' bucket and returns the public URL.
 */
export const uploadRefundEvidence = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `refunds/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('refund-evidence')
    .upload(filePath, file);

  if (uploadError) {
    if (uploadError.message === 'Bucket not found') {
      try {
        const { error: createError } = await supabase.storage.createBucket('refund-evidence', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (!createError) {
          const { error: retryError } = await supabase.storage
            .from('refund-evidence')
            .upload(filePath, file);
          
          if (!retryError) {
            const { data } = supabase.storage
              .from('refund-evidence')
              .getPublicUrl(filePath);
            return data.publicUrl;
          }
        }
      } catch (e) {
        console.error('Failed to auto-create bucket:', e);
      }
    }
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('refund-evidence')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

/**
 * Uploads a file to the 'promo-banners' bucket and returns the public URL.
 */
export const uploadPromotionBanner = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `promos/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('promo-banners')
    .upload(filePath, file);

  if (uploadError) {
    if (uploadError.message === 'Bucket not found') {
      try {
        const { error: createError } = await supabase.storage.createBucket('promo-banners', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (!createError) {
          const { error: retryError } = await supabase.storage
            .from('promo-banners')
            .upload(filePath, file);
          
          if (!retryError) {
            const { data } = supabase.storage
              .from('promo-banners')
              .getPublicUrl(filePath);
            return data.publicUrl;
          }
        }
      } catch (e) {
        console.error('Failed to auto-create bucket:', e);
      }
    }
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('promo-banners')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1588702547319-b5c482789688?q=80&w=1000&auto=format&fit=crop';

/**
 * Returns an optimized image URL using Supabase's image transformation API.
 * @param url The original image URL
 * @param options Transformation options (width, height, quality)
 * @returns The optimized URL
 */
export const getOptimizedImageUrl = (
  url: string | undefined | null,
  options: { width?: number; height?: number; quality?: number } = {}
): string => {
  if (!url || url.includes('picsum.photos')) {
    return DEFAULT_PLACEHOLDER;
  }

  // If we already have a transformation or it's not a standard Supabase public URL, return as is
  if (!url.includes('supabase.co/storage/v1/object/public/')) {
    return url;
  }

  // Check if we should even transform. Some projects don't have this enabled.
  // We'll return the original URL if no specific dimensions are requested.
  if (!options.width && !options.height) {
    return url;
  }

  const { width, height, quality = 80 } = options;
  
  // Convert object URL to render URL
  const renderUrl = url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
  
  const params = new URLSearchParams();
  if (width) params.append('width', width.toString());
  if (height) params.append('height', height.toString());
  params.append('quality', quality.toString());
  params.append('resize', 'contain');

  return `${renderUrl}?${params.toString()}`;
};
