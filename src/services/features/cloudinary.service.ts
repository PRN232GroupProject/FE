import axiosInstance from '../constant/axiosInstance';
import type { ApiResponse } from '../../types/api.types';

/**
 * Cloudinary Service
 * Handles file uploads (images, videos, raw files) to Cloudinary via backend API
 */
class CloudinaryService {
  /**
   * Upload a single image to Cloudinary
   * @param file - The image file to upload
   * @returns API response with the uploaded image URL
   */
  async uploadImage(file: File): Promise<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<ApiResponse<string>>(
      '/media/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  /**
   * Upload multiple images to Cloudinary
   * @param files - Array of image files to upload
   * @returns API response with array of uploaded image URLs
   */
  async uploadImages(files: File[]): Promise<ApiResponse<string[]>> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await axiosInstance.post<ApiResponse<string[]>>(
      '/media/images',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  /**
   * Upload a single video to Cloudinary
   * @param file - The video file to upload
   * @returns API response with the uploaded video URL
   */
  async uploadVideo(file: File): Promise<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<ApiResponse<string>>(
      '/media/video',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  /**
   * Upload multiple videos to Cloudinary
   * @param files - Array of video files to upload
   * @returns API response with array of uploaded video URLs
   */
  async uploadVideos(files: File[]): Promise<ApiResponse<string[]>> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await axiosInstance.post<ApiResponse<string[]>>(
      '/media/videos',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  /**
   * Upload a raw file (PDFs, documents, etc.) to Cloudinary
   * @param file - The raw file to upload
   * @returns API response with the uploaded file URL
   */
  async uploadRawFile(file: File): Promise<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<ApiResponse<string>>(
      '/media/raw-file',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  /**
   * Upload multiple raw files to Cloudinary
   * @param files - Array of raw files to upload
   * @returns API response with array of uploaded file URLs
   */
  async uploadRawFiles(files: File[]): Promise<ApiResponse<string[]>> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await axiosInstance.post<ApiResponse<string[]>>(
      '/media/raw-files',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  /**
   * Delete a resource from Cloudinary by URL
   * @param url - The Cloudinary URL of the resource to delete
   * @returns API response confirming deletion
   */
  async deleteResource(url: string): Promise<ApiResponse<string>> {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      '/media/resource',
      {
        params: { url },
      }
    );

    return response.data;
  }

  /**
   * Delete multiple resources from Cloudinary by URLs
   * @param urls - Array of Cloudinary URLs to delete
   * @returns API response confirming deletion
   */
  async deleteResources(urls: string[]): Promise<ApiResponse<string>> {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      '/media/resources',
      {
        data: { urls },
      }
    );

    return response.data;
  }
}

export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
