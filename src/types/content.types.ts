// Dùng cho HomePage
export interface ILessonInfo {
  lessonId: number;
  title: string;
  objectives: string;
  content: string;
  createdAt: string;
}

export interface IChapter {
  chapterId: number;
  chapterName: string;
  grade: number;
  description: string;
  lessons: ILessonInfo[];
}

// Dùng cho LessonPage
export interface IResource {
  id: number;
  title: string;
  type: 'video' | 'pdf';
  url: string;
}

export interface ILessonDetail {
  id: number;
  title: string;
  objectives: string;
  resources: IResource[];
}