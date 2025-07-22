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

  // Professional PDF color palette - more readable and professional
  const pdfColors = {
    // Main colors - darker and more professional
    header: [41, 72, 119],        // #294877 - Professional dark blue
    primary: [55, 88, 136],       // #375888 - Refined blue
    secondary: [85, 115, 158],    // #55739E - Medium professional blue
    accent: [115, 140, 175],      // #738CAF - Light professional blue
    
    // Text colors - high contrast for readability
    darkText: [33, 37, 41],       // #21252B - Almost black
    mediumText: [73, 80, 87],     // #495057 - Medium gray
    lightText: [108, 117, 125],   // #6C757D - Light gray
    
    // Background colors - subtle and clean
    lightBg: [248, 249, 250],     // #F8F9FA - Very light gray
    accentBg: [233, 236, 239],    // #E9ECEF - Light gray
    tableBg: [222, 226, 230],     // #DEE2E6 - Table gray
    
    // Status colors - professional grade colors
    excellent: [40, 123, 105],    // #287B69 - Professional teal
    good: [72, 118, 160],         // #4876A0 - Professional blue
    satisfactory: [115, 140, 175], // #738CAF - Medium blue
    warning: [184, 134, 11],      // #B8860B - Professional gold
    poor: [153, 69, 69]           // #994545 - Professional red
  };

  const validCourses = courses.filter(course => 
    course.moduleName.trim() && course.credits > 0 && course.grade
  );

  const getGradeColor = (grade: string) => {
    const gradeColors: { [key: string]: [number, number, number] } = {
      'A+': pdfColors.excellent,      // Excellent - Professional teal
      'A': pdfColors.excellent,       // Excellent - Professional teal
      'A-': pdfColors.good,          // Good - Professional blue
      'B+': pdfColors.good,          // Good - Professional blue
      'B': pdfColors.satisfactory,   // Satisfactory - Medium blue
      'B-': pdfColors.satisfactory,  // Satisfactory - Medium blue
      'C+': pdfColors.warning,       // Warning - Professional gold
      'C': pdfColors.warning,        // Warning - Professional gold
      'D': pdfColors.mediumText,     // Below average - Medium gray
      'F': pdfColors.poor           // Poor - Professional red
    };
    return gradeColors[grade] || pdfColors.mediumText;
  };

  const getPerformanceColor = (gpa: number): [number, number, number] => {
    if (gpa >= 3.7) return pdfColors.excellent;      // Excellent - Professional teal
    if (gpa >= 3.3) return pdfColors.good;          // Good - Professional blue
    if (gpa >= 3.0) return pdfColors.satisfactory;  // Satisfactory - Medium blue
    if (gpa >= 2.0) return pdfColors.warning;       // Below Average - Professional gold
    return pdfColors.poor;                          // Poor - Professional red
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

    // Header with professional dark blue
    doc.setFillColor(...pdfColors.header);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255); // White text
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('ACADEMIC TRANSCRIPT', pageWidth / 2, 18, { align: 'center' });
    
    doc.setFontSize(15);
    doc.setFont('helvetica', 'normal');
    doc.text('Official GPA Report', pageWidth / 2, 28, { align: 'center' });

    yPosition = 50;

    // Student Information with clean professional styling
    doc.setFillColor(233, 236, 239);
    doc.roundedRect(margin, yPosition - 3, pageWidth - 2 * margin, 32, 3, 3, 'F');
    
    doc.setDrawColor(...pdfColors.accent);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPosition - 3, pageWidth - 2 * margin, 32, 3, 3, 'S');

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0,0,0);
    doc.text('STUDENT INFORMATION', margin + 5, yPosition + 3);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...pdfColors.mediumText);

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
    doc.setFillColor(233, 236, 239); // Very subtle background
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 28, 3, 3, 'F');
    
    doc.setDrawColor(41, 72, 119);
    doc.setLineWidth(1.2);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 28, 3, 3, 'S');

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('GPA', margin + 5, yPosition + 8);

    doc.setFontSize(20);
    doc.text(`${gpa.toFixed(3)}`, pageWidth - margin - 35, yPosition + 12);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...pdfColors.mediumText);
    doc.text('/ 4.0', pageWidth - margin - 15, yPosition + 12);

    doc.setFontSize(10);
    doc.setTextColor(...pdfColors.darkText);
    doc.text(`Level: ${getGPADescription(gpa)}`, margin + 5, yPosition + 18);

    const totalCredits = displayCourses.reduce((sum, course) => sum + course.credits, 0);
    doc.setTextColor(...pdfColors.mediumText);
    doc.text(`Credits: ${totalCredits}`, margin + 5, yPosition + 25);
    doc.text(`Courses: ${displayCourses.length}`, pageWidth - margin - 50, yPosition + 25);

    yPosition += 40;

    // Course Table
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...pdfColors.darkText);
    doc.text('COURSE DETAILS', margin, yPosition);
    yPosition += 5;

    // Table Header with professional styling
    doc.setFillColor(...pdfColors.primary);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255); // White text
    doc.text('MODULE NAME', margin + 3, yPosition + 6);
    doc.text('CREDITS', margin + 100, yPosition + 6);
    doc.text('GRADE', margin + 125, yPosition + 6);
    doc.text('POINTS', margin + 150, yPosition + 6);
    
    yPosition += 10;

    // Table Rows with professional styling
    doc.setFont('helvetica', 'normal');
    displayCourses.forEach((course, index) => {
      const points = GRADE_POINTS[course.grade];
      const isEvenRow = index % 2 === 0;
      
      if (isEvenRow) {
        doc.setFillColor(233, 236, 239);
        doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
      }

      // Course name
      doc.setTextColor(...pdfColors.darkText);
      doc.setFontSize(10);
      const maxNameLength = 30;
      const displayName = course.moduleName.length > maxNameLength 
        ? course.moduleName.substring(0, maxNameLength) + '...'
        : course.moduleName;
      doc.text(displayName, margin + 3, yPosition + 5.5);

      // Credits
      doc.setTextColor(...pdfColors.mediumText);
      doc.text(course.credits.toString(), margin + 105, yPosition + 5.5);

      // Grade with professional colors
      const [gradeR, gradeG, gradeB] = getGradeColor(course.grade);
      doc.setTextColor(gradeR, gradeG, gradeB);
      doc.setFont('helvetica', 'bold');
      doc.text(course.grade, margin + 130, yPosition + 5.5);

      // Points
      doc.setTextColor(...pdfColors.mediumText);
      doc.setFont('helvetica', 'normal');
      doc.text(points.toFixed(1), margin + 155, yPosition + 5.5);
      
      yPosition += 8;
    });

    // Truncation warning if needed
    if (validCourses.length > displayCourses.length) {
      yPosition += 5;
      doc.setFontSize(8);
      doc.setTextColor(...pdfColors.lightText);
      doc.setFont('helvetica', 'italic');
      doc.text(`Note: Showing ${displayCourses.length} of ${validCourses.length} courses (limited to fit single page)`, margin, yPosition);
      yPosition += 8;
    }

    // Footer with subtle professional styling
    const footerY = pageHeight - 25;
    doc.setFillColor(...pdfColors.lightBg);
    doc.rect(0, footerY - 5, pageWidth, 30, 'F');
    
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...pdfColors.lightText);
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
