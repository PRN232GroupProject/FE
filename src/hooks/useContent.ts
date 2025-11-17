import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chapterService } from '../services/features/chapter.service';
import { lessonService } from '../services/features/lesson.service';
import { resourceService } from '../services/features/resource.service';
import {
  mapChapterResponse,
  mapLessonDetailResponse,
  mapResourceResponse,
} from '../utils/dataMappers';

export const CONTENT_QUERY_KEY = 'content';

/**
 * Hook cho trang LessonListPage.tsx
 * Lấy tất cả Chapters (và các lessons lồng trong nó)
 */
export const useChapters = () => {
  return useQuery({
    queryKey: [CONTENT_QUERY_KEY, 'chapters'],
    queryFn: async () => {
      const response = await chapterService.getAllChapters();
      // Map data ở đây để UI luôn nhận được type IChapter
      return response.data.map(mapChapterResponse);
    },
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });
};

/**
 * Hook cho trang LessonPage.tsx
 * Lấy chi tiết 1 bài học (gồm objectives, content, và resources)
 */
export const useLessonDetail = (lessonId: number) => {
  const queryKey = [CONTENT_QUERY_KEY, 'lesson', lessonId];

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const response = await lessonService.getLessonById(lessonId);
      // Map data từ ILessonResponse (BE) sang ILessonDetail (FE)
      return mapLessonDetailResponse(response.data);
    },
    enabled: !!lessonId, // Chỉ chạy query khi lessonId > 0
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook cho trang LessonPage.tsx (hoặc component ResourceCard)
 * Đánh dấu 1 tài liệu là "Đã hoàn thành"
 */
export const useMarkResourceCompleted = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resourceId: number) =>
      resourceService.markResourceAsCompleted(resourceId),
    onSuccess: (_response, resourceId) => {
      console.log('Resource marked as completed:', resourceId);

      // Làm mới (invalidate) tất cả cache liên quan đến content
      // để UI tự cập nhật trạng thái "đã xem"
      queryClient.invalidateQueries({ queryKey: [CONTENT_QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Failed to mark resource:', error.message);
    },
  });
};

export const useAllResources = () => {
  return useQuery({
    queryKey: [CONTENT_QUERY_KEY, 'allResources'],
    queryFn: async () => {
      const response = await resourceService.getAllResources();
      return response.data.map(mapResourceResponse);
    },
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });
};