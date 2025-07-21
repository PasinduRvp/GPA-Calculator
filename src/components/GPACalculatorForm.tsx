import React from 'react';
import { Plus, XCircle, Calculator } from 'lucide-react';
import { Course, GRADES } from '../types';
import { generateId } from '../utils';

interface GPACalculatorFormProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  gpa: number;
}

export const GPACalculatorForm: React.FC<GPACalculatorFormProps> = ({
  courses,
  setCourses,
  gpa
}) => {
  React.useEffect(() => {
    setCourses([
      { id: generateId(), moduleName: '', credits: 0, grade: '' },
      { id: generateId(), moduleName: '', credits: 0, grade: '' },
      { id: generateId(), moduleName: '', credits: 0, grade: '' },
      { id: generateId(), moduleName: '', credits: 0, grade: '' }
    ]);
  }, []);

  const addCourse = () => {
    setCourses([...courses, {
      id: generateId(),
      moduleName: '',
      credits: 0,
      grade: ''
    }]);
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const clearAllGrades = () => {
    setCourses(courses.map(course => ({ ...course, grade: '' })));
  };

  return (
    <div className="bg-[#F6FAFD] rounded-lg shadow-md p-2 border border-[#B3CFE5]">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="p-1.5 rounded-md bg-[#1A3D63] text-[#F6FAFD]">
          <Calculator size={28} />
        </div>
        <h1 className="text-xl font-bold text-[#0A1931]">
          GPA Calculator
        </h1>
      </div>
      
      <div className="overflow-x-auto mb-4">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1A3D63] text-[#F6FAFD] text-sm">
              <th className="text-left p-2">Module</th>
              <th className="text-left p-2">Credits</th>
              <th className="text-left p-2">Grade</th>
              <th className="text-left p-2"></th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-[#B3CFE5] hover:bg-[#B3CFE5]/10">
                <td className="p-2">
                  <input
                    type="text"
                    value={course.moduleName}
                    onChange={(e) => updateCourse(course.id, 'moduleName', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-[#B3CFE5] rounded focus:outline-none focus:ring-1 focus:ring-[#4A7FA7]"
                    placeholder="Module"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={course.credits || ''}
                    onChange={(e) => updateCourse(course.id, 'credits', parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 text-sm border border-[#B3CFE5] rounded focus:outline-none focus:ring-1 focus:ring-[#4A7FA7]"
                    min="0"
                    max="10"
                    placeholder="0"
                  />
                </td>
                <td className="p-2">
                  <select
                    value={course.grade}
                    onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-[#B3CFE5] rounded focus:outline-none focus:ring-1 focus:ring-[#4A7FA7] bg-white"
                  >
                    <option value="">Grade</option>
                    {GRADES.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="text-[#1A3D63] hover:text-rose-600 transition-colors"
                    title="Remove"
                  >
                    <XCircle size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={addCourse}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[#1A3D63] text-[#F6FAFD] rounded-md hover:bg-[#0A1931] shadow-sm"
        >
          <Plus size={16} /> Add Module
        </button>
        <button
          onClick={clearAllGrades}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[#B3CFE5] text-[#0A1931] rounded-md hover:bg-[#4A7FA7] hover:text-[#F6FAFD] border border-[#B3CFE5]"
        >
          Clear Grades
        </button>
      </div>

      <div className="text-center">
        <div className="inline-block bg-[#1A3D63] text-[#F6FAFD] px-4 py-2 rounded-full shadow-sm">
          <span className="text-sm font-medium">GPA : </span>
          <span className="text-xl font-bold">{gpa.toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
};