import { Course, GRADE_POINTS } from './types';

export const calculateGPA = (courses: Course[]): number => {
  if (courses.length === 0) return 0;
  
  const validCourses = courses.filter(course => 
    course.moduleName.trim() && course.credits > 0 && course.grade
  );
  
  if (validCourses.length === 0) return 0;
  
  const totalPoints = validCourses.reduce((sum, course) => {
    return sum + (GRADE_POINTS[course.grade] * course.credits);
  }, 0);
  
  const totalCredits = validCourses.reduce((sum, course) => sum + course.credits, 0);
  
  return totalCredits > 0 ? totalPoints / totalCredits : 0;
};

export const getGPADescription = (gpa: number): string => {
  if (gpa >= 3.8) return 'Excellent';
  if (gpa >= 3.5) return 'Very Good';
  if (gpa >= 3.0) return 'Good';
  if (gpa >= 2.5) return 'Satisfactory';
  if (gpa >= 2.0) return 'Needs Improvement';
  return 'Poor';
};

export const getGradeColor = (grade: string): string => {
  if (['A+', 'A', 'A-'].includes(grade)) return 'bg-green-100 text-green-800 border-green-200';
  if (['B+', 'B', 'B-'].includes(grade)) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (['C+', 'C', 'C-'].includes(grade)) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  if (['D+', 'D'].includes(grade)) return 'bg-orange-100 text-orange-800 border-orange-200';
  return 'bg-red-100 text-red-800 border-red-200';
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};