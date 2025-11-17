export interface ILessonInfo {
  id: number;
  title: string;
}

export interface ILessonResponse {
  lessonId: number;
  title: string;
  objectives?: string;
  content?: string;
  createdById?: number;
  createdAt: string;
}

export interface ILessonDetail {
  id: number;
  title: string;
  objectives: string;
  content?: string;
  resources: IResource[];
}

// ============================================
// CHAPTER
// ============================================
export interface IChapter {
  id: number;
  name: string;
  grade: number;
  description: string;
  lessons: ILessonInfo[];
}

export interface IChapterResponse {
  chapterId: number;
  chapterName: string;
  grade: number;
  description?: string;
  lessons: ILessonResponse[];
}

// ============================================
// RESOURCE
// ============================================
export interface IResource {
  id: number;
  title: string;
  type: 'video' | 'pdf' | 'document' | 'link';
  url: string;
  description?: string;
}

export interface IResourceResponse {
  resourceId: number;
  lessonId: number;
  resourceTitle: string;
  resourceType?: string; // 'video' | 'pdf' | 'document' | 'link'
  resourceUrl?: string;
  resourceDescription?: string;
}

// ============================================
// HELPER: Convert Response to Frontend Model
// ============================================
export const mapChapterResponse = (response: IChapterResponse): IChapter => ({
  id: response.chapterId,
  name: response.chapterName,
  grade: response.grade,
  description: response.description || '',
  lessons: response.lessons.map(l => ({
    id: l.lessonId,
    title: l.title,
  })),
});

export const mapResourceResponse = (response: IResourceResponse): IResource => ({
  id: response.resourceId,
  title: response.resourceTitle,
  type: (response.resourceType as any) || 'document',
  url: response.resourceUrl || '',
  description: response.resourceDescription,
});