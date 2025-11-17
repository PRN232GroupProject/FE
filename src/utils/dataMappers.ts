import type {
  IChapter,
  IChapterResponse,
  ILessonDetail,
  ILessonResponse,
  IResource,
  IResourceResponse,
} from '../types/content.types';
import type {
  ITest,
  ITestResult,
  ITestResultResponse,
} from '../types/test.types';


export const mapChapterResponse = (response: IChapterResponse): IChapter => ({
  id: response.chapterId,
  name: response.chapterName,
  grade: response.grade,
  description: response.description || '',
  lessons: (response.lessons || []).map((l) => ({
    id: l.lessonId,
    title: l.title,
  })),
});

export const mapResourceResponse = (
  response: IResourceResponse
): IResource => ({
  id: response.resourceId,
  title: response.resourceTitle,
  type: (response.resourceType as any) || 'document',
  url: response.resourceUrl || '',
  description: response.resourceDescription,
  // Thêm trạng thái hoàn thành (nếu có)
  // isCompleted: response.isCompleted || false, 
});

export const mapLessonDetailResponse = (
  response: ILessonResponse & { resources?: IResourceResponse[] }
): ILessonDetail => ({
  id: response.lessonId,
  title: response.title,
  objectives: response.objectives || '',
  content: response.content || '',
  resources: (response.resources || []).map(mapResourceResponse),
});


export const mapTestResponse = (response: any): ITest => ({
  id: response.id,
  name: response.name,
  type: response.type,
  duration: response.duration,
  totalQuestions: response.totalQuestions,
  chapterId: response.chapterId,
  chapterName: response.chapterName,
  grade: response.grade,
  difficulty: response.difficulty,
  description: response.description,
  // ...
});

export const mapTestResultResponse = (
  response: ITestResultResponse
): ITestResult => ({
  score: response.score,
  totalCorrect: response.totalCorrect,
  sessionDetails: {
    id: response.sessionId,
    testName: response.testName,
    startTime: response.startTime,
    endTime: response.endTime,
  },
  answers: response.answers, 
});