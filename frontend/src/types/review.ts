export interface Review {
  id: string;
  uid: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  /** 1-5, integer. */
  rating: number;
  comment?: string;
  createdAt: number;
}
