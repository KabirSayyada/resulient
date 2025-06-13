
import React from 'react';
import { ParsedResume } from '@/types/resumeStructure';

interface ExecutiveATSTemplateProps {
  resume: ParsedResume;
  className?: string;
}

export const ExecutiveATSTemplate = ({ resume, className = '' }: ExecutiveATSTemplateProps) => {
  return (
    <div className={`bg-white p-6 max-w-2xl mx-auto font-sans text-gray-900 leading-tight ${className}`} 
         style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', lineHeight: '1.3' }}>
      
      {/* Header Section - Executive style */}
      <div className="mb-4 pb-4 border-b border-gray-800">
        {resume.contact.name && (
          <h1 className="text-2xl font-bold mb-2 text-gray-900 uppercase tracking-wide" 
              style={{ fontSize: '20px', marginBottom: '8px' }}>
            {resume.contact.name}
          </h1>
        )}
        
        <div className="text-xs text-gray-700 font-medium" style={{ fontSize: '10px' }}>
          {[resume.contact.email, resume.contact.phone, resume.contact.linkedin, resume.contact.address]
            .filter(Boolean)
            .join(' | ')}
        </div>
      </div>

      {/* Professional Summary */}
      {resume.professionalSummary && (
        <div className="mb-5">
          <h2 className="text-sm font-bold mb-2 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            Executive Summary
          </h2>
          <p className="text-xs text-gray-800 font-medium" style={{ fontSize: '10px', lineHeight: '1.4' }}>
            {resume.professionalSummary}
          </p>
        </div>
      )}

      {/* Core Competencies/Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold mb-2 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            Core Competencies
          </h2>
          <div className="grid grid-cols-3 gap-1 text-xs" style={{ fontSize: '10px' }}>
            {resume.skills.slice(0, 18).map((skill, index) => (
              <div key={index} className="text-gray-700 font-medium">
                • {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {resume.workExperience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold mb-2 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            Professional Experience
          </h2>
          
          {resume.workExperience.map((exp, index) => (
            <div key={index} className="mb-4" style={{ marginBottom: '16px' }}>
              <div className="flex justify-between items-start mb-1">
                <div className="flex-1">
                  <h3 className="font-bold text-xs text-gray-900 uppercase" style={{ fontSize: '11px' }}>
                    {exp.position}
                  </h3>
                  <p className="text-xs text-gray-700 font-semibold" style={{ fontSize: '10px' }}>
                    {exp.company}
                  </p>
                </div>
                {(exp.startDate || exp.endDate) && (
                  <div className="text-xs text-gray-600 font-medium" style={{ fontSize: '10px' }}>
                    {exp.startDate} {exp.endDate && `– ${exp.endDate}`}
                  </div>
                )}
              </div>
              
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul className="text-xs text-gray-800 space-y-1 ml-2" 
                    style={{ fontSize: '10px', lineHeight: '1.3' }}>
                  {exp.responsibilities.slice(0, 4).map((responsibility, respIndex) => (
                    <li key={respIndex} className="flex items-start">
                      <span className="text-gray-500 mr-2">▪</span>
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold mb-2 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            Education
          </h2>
          
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-2 flex justify-between items-start" style={{ marginBottom: '8px' }}>
              <div className="flex-1">
                <h3 className="font-bold text-xs text-gray-900" style={{ fontSize: '11px' }}>
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-xs text-gray-700 font-medium" style={{ fontSize: '10px' }}>
                  {edu.institution}
                </p>
              </div>
              {edu.graduationDate && (
                <div className="text-xs text-gray-600 font-medium" style={{ fontSize: '10px' }}>
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
          <h2 className="text-sm font-bold mb-2 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            Key Projects
          </h2>
          
          {resume.projects.slice(0, 2).map((project, index) => (
            <div key={index} className="mb-3" style={{ marginBottom: '10px' }}>
              <h3 className="font-bold text-xs text-gray-900" style={{ fontSize: '11px' }}>
                {project.name}
              </h3>
              {project.description && (
                <p className="text-xs text-gray-800" style={{ fontSize: '10px', lineHeight: '1.3' }}>
                  {project.description.substring(0, 130)}
                  {project.description.length > 130 ? '...' : ''}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div className="mb-2">
          <h2 className="text-sm font-bold mb-2 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            Professional Certifications
          </h2>
          
          {resume.certifications.slice(0, 4).map((cert, index) => (
            <div key={index} className="mb-1 flex justify-between items-start" style={{ marginBottom: '4px' }}>
              <div className="flex-1">
                <h3 className="font-medium text-xs text-gray-900" style={{ fontSize: '10px' }}>
                  {cert.name}
                </h3>
                {cert.issuer !== 'Unknown' && (
                  <p className="text-xs text-gray-700" style={{ fontSize: '9px' }}>
                    {cert.issuer}
                  </p>
                )}
              </div>
              {cert.date && (
                <div className="text-xs text-gray-600 font-medium" style={{ fontSize: '9px' }}>
                  {cert.date}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
