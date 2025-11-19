
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
  resourceName?: string; 
}

export interface ILessonDetail {
  id: number;
  title: string;
  objectives: string;
  content?: string;
  resources: IResource[];
}

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

export interface ICreateChapterRequest {
  chapterName: string;
  grade: number;
  description?: string;
}

export interface IUpdateChapterRequest {
  id: number;
  chapterName: string;
  grade: number;
  description?: string;
}

export interface IResource {
  id: number;
  title: string;
  type: 'video' | 'pdf' | 'document' | 'link';
  url: string;
  description?: string;
  isCompleted?: boolean;
  lessonId: number;
}

export interface IResourceRequest {
  lessonId: number;
  resourceTitle: string;
  resourceType: 'video' | 'pdf' | 'document' | 'link';
  resourceUrl: string;
  resourceDescription?: string;
}

export interface IResourceResponse {
  resourceId: number;
  lessonId: number;
  resourceTitle: string;
  resourceType?: string; 
  resourceUrl?: string;
  resourceDescription?: string;
  isCompleted?: boolean; 
  completedAt?: string; 
}


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
  isCompleted: response.isCompleted || false,
  lessonId: response.lessonId,
});