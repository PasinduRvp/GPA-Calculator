import React, { useState, useEffect } from 'react';
import { GPACalculatorForm } from './components/GPACalculatorForm';
import { GPAOverview } from './components/GPAOverview';
import { ModulesList } from './components/ModulesList';
import { PDFGenerator } from './components/PDFGenerator';
import { Course } from './types';
import { calculateGPA, generateId } from './utils';
import calculatorImage from './assets/images/cal1.png';
import calculator2Image from './assets/images/cal2.png';

function App() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: generateId(),
      moduleName: '',
      credits: 0,
      grade: ''
    }
  ]);
  const [gpa, setGPA] = useState<number>(0);

  useEffect(() => {
    const calculatedGPA = calculateGPA(courses);
    setGPA(calculatedGPA);
  }, [courses]);

  return (
    <div className="min-h-screen bg-[#F6FAFD]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-5 relative">
          <div className="flex items-center justify-between md:flex-row">
            {/* Left image */}
            <div className="w-48 h-38 flex-shrink-0">
              <img 
                src={calculatorImage} 
                alt="Calculator 1" 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Center content */}
            <div className="flex-1 flex flex-col items-center mx-4">
              <div className="inline-flex items-center justify-center p-4 rounded-xl bg-[#1A3D63] mb-3">
                <h1 className="text-2xl md:text-2xl font-bold text-[#F6FAFD]">
                  Academic Performance Dashboard
                </h1>
              </div>
              <p className="text-lg text-[#4A7FA7] max-w-xl">
                A Comprehensive Tool To Calculate, Track, & Document Your Academic Progress With Precision.
              </p>
            </div>

            {/* Right image */}
            <div className="w-58 h-28 flex-shrink-0">
              <img 
                src={calculatorImage} 
                alt="Calculator 2" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </header>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Top Left: GPA Calculator Form */}
          <div className="order-1">
            <GPACalculatorForm 
              courses={courses} 
              setCourses={setCourses} 
              gpa={gpa} 
            />
          </div>

          {/* Top Right: GPA Overview */}
          <div className="order-2">
            <GPAOverview 
              gpa={gpa} 
              courses={courses} 
            />
          </div>

          {/* Bottom Left: Modules List */}
          <div className="order-3 lg:order-4">
            <ModulesList 
              courses={courses} 
              setCourses={setCourses} 
            />
          </div>

          {/* Bottom Right: PDF Generator */}
          <div className="order-4 lg:order-3">
            <PDFGenerator 
              courses={courses} 
              gpa={gpa} 
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-[#B3CFE5]">
          <p className="text-[#4A7FA7] text-xl font-bold">
            Pasindu Vidanapathirana {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
