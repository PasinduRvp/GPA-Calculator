import React from 'react';
import { Calculator, MenuSquareIcon, Trash2 } from 'lucide-react';
import { Course, GRADE_POINTS } from '../types';
import { getGradeColor } from '../utils';

interface ModulesListProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

export const ModulesList: React.FC<ModulesListProps> = ({ courses, setCourses }) => {
  const validCourses = courses.filter(course => 
    course.moduleName.trim() && course.credits > 0 && course.grade
  );

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const getModuleGPA = (course: Course): number => {
    return GRADE_POINTS[course.grade] || 0;
  };

  return (
    <div className="bg-[#F6FAFD] rounded-xl shadow-lg p-6 h-fit border border-[#B3CFE5]">
      <h2 className="text-2xl font-bold text-[#0A1931] mb-6 flex items-center gap-2">
        <div className="p-2 rounded-lg bg-[#B3CFE5] text-[#1A3D63]">
          <MenuSquareIcon size={20} />
        </div>
        Modules ({validCourses.length})
      </h2>
      
      {validCourses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#4A7FA7]">No Modules Added Yet</p>
          <p className="text-sm text-[#B3CFE5] mt-1">Add Some Courses To See Them Here</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {validCourses.map((course) => (
            <div key={course.id} className="flex items-center justify-between p-4 bg-[#F6FAFD] rounded-lg hover:bg-[#B3CFE5]/30 transition-colors border border-[#B3CFE5]">
              <div className="flex-1">
                <h3 className="font-semibold text-[#0A1931]">{course.moduleName}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-[#4A7FA7]">
                    {course.credits} {course.credits === 1 ? 'Credit' : 'Credits'}
                  </span>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getGradeColor(course.grade)}`}>
                    {course.grade}
                  </span>
                  <span className="text-sm font-medium text-[#1A3D63]">
                    {getModuleGPA(course).toFixed(1)} GPA
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => deleteCourse(course.id)}
                className="p-2 text-[#1A3D63] hover:bg-[#B3CFE5] rounded-md transition-colors ml-4"
                title="Delete module"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};