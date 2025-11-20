import type { ApiResponse } from '../../types/api.types';
import axiosInstance from '../constant/axiosInstance';
import type { IResourceResponse, IResourceRequest } from '../../types/content.types';
import { cloudinaryService } from './cloudinary.service';

export const resourceService = {
    resourceEndpoint: '/resources',
    
    async getAllResources(): Promise<ApiResponse<IResourceResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<IResourceResponse[]>>(
        this.resourceEndpoint
      );
      return response.data;
    } catch (error: any) {
      console.error('Get all resources error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Fetching resources failed');
      }
      throw new Error('Network Error occurred!');
    }
  },

  async getResourceById(id: number): Promise<ApiResponse<IResourceResponse>> {
    try {
      const response = await axiosInstance.get<ApiResponse<IResourceResponse>>(
        `${this.resourceEndpoint}/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Get resource by ID error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Fetching resource failed');
      }
      throw new Error('Network Error occurred!');
    }
  },

  async getResourcesByLessonId(lessonId: number): Promise<ApiResponse<IResourceResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<IResourceResponse[]>>(
        `${this.resourceEndpoint}/lesson/${lessonId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Get resources by lesson ID error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Fetching resources failed');
      }
      throw new Error('Network Error occurred!');
    }
  },

  /**
   * Create a new resource with optional file upload
   * @param data - Resource data (without resourceUrl if uploading file)
   * @param file - Optional file to upload to Cloudinary
   * @returns Created resource response
   */
  async createResource(
    data: Omit<IResourceRequest, 'resourceUrl'> & { resourceUrl?: string },
    file?: File
  ): Promise<ApiResponse<IResourceResponse>> {
    try {
      let resourceUrl = data.resourceUrl || '';

      // If file is provided, upload it based on resource type
      if (file) {
        if (data.resourceType === 'video') {
          const uploadResponse = await cloudinaryService.uploadVideo(file);
          resourceUrl = uploadResponse.data;
        } else if (data.resourceType === 'image') {
          const uploadResponse = await cloudinaryService.uploadImage(file);
          resourceUrl = uploadResponse.data;
        } else if (data.resourceType === 'pdf' || data.resourceType === 'document') {
          const uploadResponse = await cloudinaryService.uploadRawFile(file);
          resourceUrl = uploadResponse.data;
        } else {
          // For 'link' type or fallback, upload as raw file
          const uploadResponse = await cloudinaryService.uploadRawFile(file);
          resourceUrl = uploadResponse.data;
        }
      }

      // Create resource with the uploaded URL
      const resourceData: IResourceRequest = {
        ...data,
        resourceUrl,
      };

      const response = await axiosInstance.post<ApiResponse<IResourceResponse>>(
        this.resourceEndpoint,
        resourceData
      );
      return response.data;
    } catch (error: any) {
      console.error('Create resource error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Creating resource failed');
      }
      throw new Error('Network Error occurred!');
    }
  },

  /**
   * Update an existing resource with optional file upload
   * @param id - Resource ID to update
   * @param data - Updated resource data (without resourceUrl if uploading new file)
   * @param file - Optional new file to upload to Cloudinary
   * @returns Updated resource response
   */
  async updateResource(
    id: number,
    data: Omit<IResourceRequest, 'resourceUrl'> & { resourceUrl?: string },
    file?: File
  ): Promise<ApiResponse<IResourceResponse>> {
    try {
      let resourceUrl = data.resourceUrl || '';
      console.log(file);

      // If file is provided, upload it based on resource type
      if (file) {
        if (data.resourceType === 'video') {
          const uploadResponse = await cloudinaryService.uploadVideo(file);
          resourceUrl = uploadResponse.data;
        } else if (data.resourceType === 'image') {
          const uploadResponse = await cloudinaryService.uploadImage(file);
          resourceUrl = uploadResponse.data;
        } else if (data.resourceType === 'pdf' || data.resourceType === 'document') {
          const uploadResponse = await cloudinaryService.uploadRawFile(file);
          resourceUrl = uploadResponse.data;
        } else {
          const uploadResponse = await cloudinaryService.uploadRawFile(file);
          resourceUrl = uploadResponse.data;
        }
      }

      // Update resource with the new URL or existing URL
      const resourceData: IResourceRequest = {
        ...data,
        resourceUrl,
      };

      const response = await axiosInstance.put<ApiResponse<IResourceResponse>>(
        `${this.resourceEndpoint}/${id}`,
        resourceData
      );
      return response.data;
    } catch (error: any) {
      console.error('Update resource error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Updating resource failed');
      }
      throw new Error('Network Error occurred!');
    }
  },

  async deleteResource(id: number, resourceUrl?: string): Promise<ApiResponse<boolean>> {
    try {
      // Optionally delete from Cloudinary if URL is provided
      if (resourceUrl && resourceUrl.includes('cloudinary.com')) {
        try {
          await cloudinaryService.deleteResource(resourceUrl);
        } catch (cloudinaryError) {
          console.warn('Failed to delete from Cloudinary, proceeding with database deletion:', cloudinaryError);
        }
      }

      const response = await axiosInstance.delete<ApiResponse<boolean>>(
        `${this.resourceEndpoint}/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Delete resource error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Deleting resource failed');
      }
      throw new Error('Network Error occurred!');
    }
  },

  // Dùng endpoint [HttpPut("/mark/{id}")]
  async markResourceAsCompleted(id: number): Promise<ApiResponse<boolean>> {
    try {
      const response = await axiosInstance.put<ApiResponse<boolean>>(
        `${this.resourceEndpoint}/mark/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Mark resource completed error:', error);
      const apiError = error.response?.data as ApiResponse<any>;
      if (apiError) {
        throw new Error(apiError.message || 'Marking resource failed');
      }
      throw new Error('Network Error occurred!');
    }
  },
};