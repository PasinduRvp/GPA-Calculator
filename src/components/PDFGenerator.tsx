import React, { useState } from 'react';
import { FileDown, User, GraduationCap, Calendar, Award, File } from 'lucide-react';
import jsPDF from 'jspdf';
import { Course, StudentInfo, GRADE_POINTS } from '../types';
import { getGPADescription } from '../utils';

interface PDFGeneratorProps {
  courses: Course[];
  gpa: number;
}

export const PDFGenerator: React.FC<PDFGeneratorProps> = ({ courses, gpa }) => {
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    name: '',
    school: '',
    studentId: '',
    semester: '',
    academicYear: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Updated color palette to match GPACalculatorForm
  const colors = {
    primary: [26, 61, 99],    // #1A3D63 - Dark blue
    light: [179, 207, 229],   // #B3CFE5 - Light blue
    medium: [74, 127, 167],   // #4A7FA7 - Medium blue
    dark: [10, 25, 49]        // #0A1931 - Very dark blue
  };

  const validCourses = courses.filter(course => 
    course.moduleName.trim() && course.credits > 0 && course.grade
  );

  const getGradeColor = (grade: string) => {
    const gradeColors: { [key: string]: [number, number, number] } = {
      'A+': colors.primary,        // Primary dark blue for excellent grades
      'A': colors.primary,         // Primary dark blue
      'A-': colors.medium,        // Medium blue
      'B+': colors.medium,        // Medium blue
      'B': [115, 147, 156],       // Teal blue
      'B-': [115, 147, 156],      // Teal blue
      'C+': [138, 138, 138],      // Medium gray
      'C': [83, 92, 95],          // Dark blue-gray
      'D': [100, 100, 100],       // Gray
      'F': [120, 80, 80]         // Dark red
    };
    return gradeColors[grade] || colors.medium;
  };

  const getPerformanceColor = (gpa: number): [number, number, number] => {
    if (gpa >= 3.7) return colors.primary;     // Excellent - Primary dark blue
    if (gpa >= 3.3) return colors.medium;     // Good - Medium blue
    if (gpa >= 3.0) return [115, 147, 156];  // Satisfactory - Teal blue
    if (gpa >= 2.0) return [138, 138, 138];  // Below Average - Medium gray
    return [120, 80, 80];                    // Poor - Dark red
  };

  const generatePDF = async () => {
  if (validCourses.length === 0) {
    alert('Please add at least one course before generating a report.');
    return;
  }

  setIsGenerating(true);
  
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    let yPosition = 15;

    // Calculate available space for courses
    const maxCoursesPerPage = Math.floor((pageHeight - 180) / 8);
    const displayCourses = validCourses.slice(0, maxCoursesPerPage);

    // Header with dark blue (#1A3D63)
    doc.setFillColor(26, 61, 99); // #1A3D63
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255); // White text
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('ACADEMIC TRANSCRIPT', pageWidth / 2, 18, { align: 'center' });
    
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text('Official GPA Report', pageWidth / 2, 28, { align: 'center' });

    yPosition = 50;
    doc.setTextColor(0, 0, 0); // Black text for content

    // Student Information with light blue background (#B3CFE5 with 30% opacity)
    doc.setFillColor(179, 207, 229, 0.3); // #B3CFE5 with opacity
    doc.roundedRect(margin, yPosition - 3, pageWidth - 2 * margin, 32, 3, 3, 'F');
    
    doc.setDrawColor(74, 127, 167); // #4A7FA7 border
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPosition - 3, pageWidth - 2 * margin, 32, 3, 3, 'S');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(138, 138, 138); // #0A1931
    doc.text('STUDENT INFORMATION', margin + 5, yPosition + 3);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(74, 127, 167); // #4A7FA7

    let infoY = yPosition + 12;
    const leftCol = margin + 5;
    const rightCol = pageWidth / 2 + 5;

    // Student info layout
    if (studentInfo.name) {
      doc.text(`Name: ${studentInfo.name}`, leftCol, infoY);
    }
    if (studentInfo.studentId) {
      doc.text(`ID: ${studentInfo.studentId}`, rightCol, infoY);
    }
    infoY += 8;

    if (studentInfo.school) {
      doc.text(`Institution: ${studentInfo.school}`, leftCol, infoY);
    }
    if (studentInfo.semester) {
      doc.text(`Semester: ${studentInfo.semester}`, rightCol, infoY);
    }
    infoY += 8;

    if (studentInfo.academicYear) {
      doc.text(`Academic Year: ${studentInfo.academicYear}`, leftCol, infoY);
    }
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, rightCol, infoY);
    
    yPosition += 40;

    // GPA Summary with performance-based colors
    const [r, g, b] = getPerformanceColor(gpa);
    doc.setFillColor(r, g, b, 0.15);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 28, 3, 3, 'F');
    
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(1.5);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 28, 3, 3, 'S');

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(r, g, b);
    doc.text('GPA', margin + 5, yPosition + 8);

    doc.setFontSize(20);
    doc.text(`${gpa.toFixed(3)}`, pageWidth - margin - 35, yPosition + 12);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('/ 4.0', pageWidth - margin - 15, yPosition + 12);

    doc.setFontSize(10);
    doc.text(`Level: ${getGPADescription(gpa)}`, margin + 5, yPosition + 18);

    const totalCredits = displayCourses.reduce((sum, course) => sum + course.credits, 0);
    doc.text(`Credits: ${totalCredits}`, margin + 5, yPosition + 25);
    doc.text(`Courses: ${displayCourses.length}`, pageWidth - margin - 50, yPosition + 25);

    yPosition += 35;

    // Course Table
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(10, 25, 49); // #0A1931
    doc.text('COURSE DETAILS', margin, yPosition);
    yPosition += 10;

    // Table Header with dark blue (#1A3D63)
    doc.setFillColor(26, 61, 99); // #1A3D63
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255); // White text
    doc.text('MODULE NAME', margin + 3, yPosition + 6);
    doc.text('CREDITS', margin + 100, yPosition + 6);
    doc.text('GRADE', margin + 125, yPosition + 6);
    doc.text('POINTS', margin + 150, yPosition + 6);
    
    yPosition += 10;

    // Table Rows
    doc.setFont('helvetica', 'normal');
    displayCourses.forEach((course, index) => {
      const points = GRADE_POINTS[course.grade];
      const isEvenRow = index % 2 === 0;
      
      if (isEvenRow) {
        doc.setFillColor(179, 207, 229, 0.5); // #B3CFE5 with opacity
        doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
      }

      // Course name
      doc.setTextColor(255, 255, 255); // #FFFFFF
      doc.setFontSize(8);
      const maxNameLength = 30;
      const displayName = course.moduleName.length > maxNameLength 
        ? course.moduleName.substring(0, maxNameLength) + '...'
        : course.moduleName;
      doc.text(displayName, margin + 3, yPosition + 5.5);

      // Credits
      doc.setTextColor(74, 127, 167); // #4A7FA7
      doc.text(course.credits.toString(), margin + 105, yPosition + 5.5);

      // Grade with custom colors
      const [gradeR, gradeG, gradeB] = getGradeColor(course.grade);
      doc.setTextColor(gradeR, gradeG, gradeB);
      doc.setFont('helvetica', 'bold');
      doc.text(course.grade, margin + 130, yPosition + 5.5);

      // Points
      doc.setTextColor(74, 127, 167); // #4A7FA7
      doc.setFont('helvetica', 'normal');
      doc.text(points.toFixed(1), margin + 155, yPosition + 5.5);
      
      yPosition += 8;
    });

    // Truncation warning if needed
    if (validCourses.length > displayCourses.length) {
      yPosition += 5;
      doc.setFontSize(8);
      doc.setTextColor(74, 127, 167); // #4A7FA7
      doc.setFont('helvetica', 'italic');
      doc.text(`Note: Showing ${displayCourses.length} of ${validCourses.length} courses (limited to fit single page)`, margin, yPosition);
      yPosition += 8;
    }

    // Footer with light blue background (#B3CFE5 with 30% opacity)
    const footerY = pageHeight - 25;
    doc.setFillColor(179, 207, 229, 0.3); // #B3CFE5 with opacity
    doc.rect(0, footerY - 5, pageWidth, 30, 'F');
    
    // Performance Scale Legend
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(74, 127, 167); // #4A7FA7
    doc.text('GPA SCALE:', margin, footerY);
    doc.setFont('helvetica', 'normal');
    doc.text('A+/A (4.0) | A- (3.7) | B+ (3.3) | B (3.0) | B- (2.7) | C+ (2.3) | C (2.0) | D (1.0) | F (0.0)', margin + 22, footerY);
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(74, 127, 167); // #4A7FA7
    doc.text('This document was generated electronically and is valid without signature.', pageWidth / 2, footerY + 8, { align: 'center' });
    doc.text(`Generated by GPA Calculator on ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 15, { align: 'center' });

    // Save PDF
    const fileName = studentInfo.name 
      ? `${studentInfo.name.replace(/\s+/g, '_')}_Academic_Transcript.pdf`
      : `Academic_Transcript_${new Date().toISOString().split('T')[0]}.pdf`;
    
    doc.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  } finally {
    setIsGenerating(false);
  }
};

  return (
    <div className="bg-[#F6FAFD] rounded-xl shadow-lg p-4 border border-[#B3CFE5] h-fit">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[#0A1931]">
        <div className="p-2 rounded-lg bg-[#1A3D63] text-[#F6FAFD]">
          <File size={20} />
        </div>
        Generate Academic Transcript
      </h2>
      
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-[#0A1931]">
              <User size={16} className="text-[#1A3D63]" />
              Student Name
            </label>
            <input
              type="text"
              value={studentInfo.name}
              onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
              className="w-full px-4 py-3 border border-[#B3CFE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] focus:border-transparent transition-all duration-200"
              placeholder="Enter Name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-[#0A1931]">
              <Award size={16} className="text-[#1A3D63]" />
              Student ID
            </label>
            <input
              type="text"
              value={studentInfo.studentId}
              onChange={(e) => setStudentInfo({ ...studentInfo, studentId: e.target.value })}
              className="w-full px-4 py-3 border border-[#B3CFE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] focus:border-transparent transition-all duration-200"
              placeholder="Enter Your ID"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-[#0A1931]">
            <GraduationCap size={16} className="text-[#1A3D63]" />
            School/University
          </label>
          <input
            type="text"
            value={studentInfo.school}
            onChange={(e) => setStudentInfo({ ...studentInfo, school: e.target.value })}
            className="w-full px-4 py-3 border border-[#B3CFE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] focus:border-transparent transition-all duration-200"
            placeholder="Enter School/University Name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-[#0A1931]">
              <Calendar size={16} className="text-[#1A3D63]" />
              Semester
            </label>
            <input
              type="text"
              value={studentInfo.semester}
              onChange={(e) => setStudentInfo({ ...studentInfo, semester: e.target.value })}
              className="w-full px-4 py-3 border border-[#B3CFE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] focus:border-transparent transition-all duration-200"
              placeholder=""
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-[#0A1931]">
              <Calendar size={16} className="text-[#1A3D63]" />
              Academic Year
            </label>
            <input
              type="text"
              value={studentInfo.academicYear}
              onChange={(e) => setStudentInfo({ ...studentInfo, academicYear: e.target.value })}
              className="w-full px-4 py-3 border border-[#B3CFE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] focus:border-transparent transition-all duration-200"
              placeholder=""
            />
          </div>
        </div>
        
        <button
          onClick={generatePDF}
          disabled={isGenerating || validCourses.length === 0}
          className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform ${
            isGenerating || validCourses.length === 0
              ? 'cursor-not-allowed scale-95 bg-[#1A3D63] opacity-60'
              : 'shadow-lg hover:shadow-xl hover:scale-105 bg-[#1A3D63] hover:bg-[#0A1931]'
          } text-[#F6FAFD]`}
        >
          <FileDown size={20} />
          {isGenerating ? 'Generating Single-Page Transcript...' : 'Download Academic Transcript'}
        </button>
        
        {validCourses.length === 0 && (
          <div className="border border-[#B3CFE5] rounded-lg p-4 bg-[#F6FAFD]">
            <p className="text-sm text-center font-medium text-[#4A7FA7]">
              ⚠️ Please Add Courses With Grades To Download Your Transcript
            </p>
          </div>
        )}

        {validCourses.length > 25 && (
          <div className="border border-[#B3CFE5] rounded-lg p-4 bg-[#F6FAFD]">
            <p className="text-sm text-center font-medium text-[#4A7FA7]">
              ℹ️ Note: Only the first ~25 courses will be shown to ensure single-page layout
            </p>
          </div>
        )}
      </div>
    </div>
  );
};