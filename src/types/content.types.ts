// Dùng cho HomePage
export interface ILessonInfo {
  id: number;
  title: string;
}

export interface IChapter {
  id: number;
  name: string;
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