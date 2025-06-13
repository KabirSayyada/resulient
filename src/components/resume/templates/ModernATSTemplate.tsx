
import React from 'react';
import { ParsedResume } from '@/types/resumeStructure';

interface ModernATSTemplateProps {
  resume: ParsedResume;
  className?: string;
}

export const ModernATSTemplate = ({ resume, className = '' }: ModernATSTemplateProps) => {
  return (
    <div className={`bg-white p-6 max-w-2xl mx-auto font-sans text-gray-900 leading-tight ${className}`} 
         style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', lineHeight: '1.3' }}>
      
      {/* Header Section with modern layout */}
      <div className="mb-4 pb-3 border-b-2 border-blue-600">
        {resume.contact.name && (
          <h1 className="text-2xl font-bold mb-2 text-blue-800" style={{ fontSize: '20px', marginBottom: '8px' }}>
            {resume.contact.name}
          </h1>
        )}
        
        <div className="flex flex-wrap text-xs text-gray-700 gap-2" style={{ fontSize: '10px' }}>
          {resume.contact.email && <span className="bg-gray-100 px-2 py-1 rounded">{resume.contact.email}</span>}
          {resume.contact.phone && <span className="bg-gray-100 px-2 py-1 rounded">{resume.contact.phone}</span>}
          {resume.contact.linkedin && <span className="bg-gray-100 px-2 py-1 rounded">{resume.contact.linkedin}</span>}
          {resume.contact.address && <span className="bg-gray-100 px-2 py-1 rounded">{resume.contact.address}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {resume.professionalSummary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold mb-2 text-blue-700 uppercase" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            Professional Summary
          </h2>
          <p className="text-xs text-gray-800 bg-blue-50 p-3 rounded" style={{ fontSize: '10px', lineHeight: '1.4' }}>
            {resume.professionalSummary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {resume.workExperience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold mb-2 text-blue-700 uppercase" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            Professional Experience
          </h2>
          
          {resume.workExperience.map((exp, index) => (
            <div key={index} className="mb-3 pl-4 border-l-2 border-blue-200" style={{ marginBottom: '10px' }}>
              <div className="flex justify-between items-start mb-1">
                <div className="flex-1">
                  <h3 className="font-bold text-xs text-gray-900" style={{ fontSize: '11px' }}>
                    {exp.position}
                  </h3>
                  <p className="text-xs text-blue-600 font-medium" style={{ fontSize: '10px' }}>
                    {exp.company}
                  </p>
                </div>
                {(exp.startDate || exp.endDate) && (
                  <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded" style={{ fontSize: '10px' }}>
                    {exp.startDate} {exp.endDate && `- ${exp.endDate}`}
                  </div>
                )}
              </div>
              
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul className="list-disc list-inside ml-2 text-xs text-gray-800 space-y-1" 
                    style={{ fontSize: '10px', lineHeight: '1.3' }}>
                  {exp.responsibilities.slice(0, 4).map((responsibility, respIndex) => (
                    <li key={respIndex} className="leading-tight">
                      {responsibility}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold mb-2 text-blue-700 uppercase" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            Technical Skills
          </h2>
          <div className="flex flex-wrap gap-1">
            {resume.skills.slice(0, 15).map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                    style={{ fontSize: '9px' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold mb-2 text-blue-700 uppercase" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            Education
          </h2>
          
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-2 flex justify-between items-start bg-gray-50 p-2 rounded" 
                 style={{ marginBottom: '8px' }}>
              <div className="flex-1">
                <h3 className="font-bold text-xs text-gray-900" style={{ fontSize: '11px' }}>
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-xs text-gray-700" style={{ fontSize: '10px' }}>
                  {edu.institution}
                </p>
              </div>
              {edu.graduationDate && (
                <div className="text-xs text-gray-600" style={{ fontSize: '10px' }}>
                  {edu.graduationDate}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold mb-2 text-blue-700 uppercase" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            Projects
          </h2>
          
          {resume.projects.slice(0, 3).map((project, index) => (
            <div key={index} className="mb-2 bg-blue-50 p-2 rounded" style={{ marginBottom: '8px' }}>
              <h3 className="font-bold text-xs text-gray-900" style={{ fontSize: '11px' }}>
                {project.name}
              </h3>
              {project.description && (
                <p className="text-xs text-gray-800" style={{ fontSize: '10px', lineHeight: '1.3' }}>
                  {project.description.substring(0, 120)}
                  {project.description.length > 120 ? '...' : ''}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div className="mb-2">
          <h2 className="text-sm font-bold mb-2 text-blue-700 uppercase" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            Certifications
          </h2>
          
          <div className="grid grid-cols-2 gap-2">
            {resume.certifications.slice(0, 4).map((cert, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded">
                <h3 className="font-medium text-xs text-gray-900" style={{ fontSize: '10px' }}>
                  {cert.name}
                </h3>
                {cert.issuer !== 'Unknown' && (
                  <p className="text-xs text-gray-600" style={{ fontSize: '9px' }}>
                    {cert.issuer}
                  </p>
                )}
                {cert.date && (
                  <p className="text-xs text-gray-500" style={{ fontSize: '9px' }}>
                    {cert.date}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
