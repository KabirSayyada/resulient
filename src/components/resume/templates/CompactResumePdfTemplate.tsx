import React from 'react';
import { ParsedResume } from '@/types/resumeStructure';

interface CompactResumePdfTemplateProps {
  resume: ParsedResume;
  className?: string;
}

export const CompactResumePdfTemplate = ({ resume, className = '' }: CompactResumePdfTemplateProps) => {
  console.log('=== CompactResumePdfTemplate Debug ===');
  console.log('Resume object:', resume);

  return (
    <div className={`bg-white p-4 max-w-2xl mx-auto font-sans text-gray-900 leading-tight ${className}`} 
         style={{ fontFamily: 'Arial, sans-serif', fontSize: '10px', lineHeight: '1.2' }}>
      
      {/* Compact Header Section */}
      <div className="text-center mb-3 pb-2 border-b-2 border-gray-400">
        {resume.contact.name && (
          <h1 className="text-lg font-bold mb-1 text-gray-900" style={{ fontSize: '16px', marginBottom: '4px' }}>
            {resume.contact.name}
          </h1>
        )}
        
        {/* Compact contact line */}
        <div className="text-xs text-gray-700" style={{ fontSize: '9px' }}>
          {[
            resume.contact.email,
            resume.contact.phone,
            resume.contact.linkedin,
            resume.contact.website,
            resume.contact.address
          ].filter(Boolean).join(' | ')}
        </div>
      </div>

      {/* Professional Summary - Compact */}
      {resume.professionalSummary && (
        <div className="mb-3">
          <h2 className="text-xs font-bold mb-1 text-gray-900 uppercase" 
              style={{ fontSize: '11px', marginBottom: '4px' }}>
            Summary
          </h2>
          <p className="text-xs text-gray-800" style={{ fontSize: '9px', lineHeight: '1.3' }}>
            {resume.professionalSummary}
          </p>
        </div>
      )}

      {/* Skills - Compact format */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold mb-1 text-gray-900 uppercase" 
              style={{ fontSize: '11px', marginBottom: '4px' }}>
            Skills
          </h2>
          <div className="text-xs text-gray-800" style={{ fontSize: '9px', lineHeight: '1.3' }}>
            {resume.skills.join(' • ')}
          </div>
        </div>
      )}

      {/* Experience - Very compact */}
      {resume.workExperience && resume.workExperience.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold mb-1 text-gray-900 uppercase" 
              style={{ fontSize: '11px', marginBottom: '4px' }}>
            Experience
          </h2>
          
          {resume.workExperience.map((exp, index) => (
            <div key={index} className="mb-2" style={{ marginBottom: '8px' }}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-xs text-gray-900" style={{ fontSize: '10px' }}>
                    {exp.position} | {exp.company}
                  </h3>
                </div>
                <div className="text-xs text-gray-600" style={{ fontSize: '8px' }}>
                  {exp.startDate} {exp.endDate && `- ${exp.endDate}`}
                </div>
              </div>
              
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul className="list-disc list-inside ml-1 text-xs text-gray-800" 
                    style={{ fontSize: '8px', lineHeight: '1.2', marginTop: '2px' }}>
                  {exp.responsibilities.slice(0, 3).map((responsibility, respIndex) => (
                    <li key={respIndex} className="leading-tight" style={{ marginBottom: '1px' }}>
                      {responsibility}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education - Compact */}
      {resume.education && resume.education.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold mb-1 text-gray-900 uppercase" 
              style={{ fontSize: '11px', marginBottom: '4px' }}>
            Education
          </h2>
          
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-1 flex justify-between items-start" style={{ marginBottom: '4px' }}>
              <div className="flex-1">
                <h3 className="font-semibold text-xs text-gray-900" style={{ fontSize: '10px' }}>
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-xs text-gray-700" style={{ fontSize: '9px' }}>
                  {edu.institution}
                </p>
              </div>
              {edu.graduationDate && (
                <div className="text-xs text-gray-600" style={{ fontSize: '8px' }}>
                  {edu.graduationDate}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects - Compact */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold mb-1 text-gray-900 uppercase" 
              style={{ fontSize: '11px', marginBottom: '4px' }}>
            Projects
          </h2>
          
          {resume.projects.slice(0, 3).map((project, index) => (
            <div key={index} className="mb-1" style={{ marginBottom: '4px' }}>
              <h3 className="font-semibold text-xs text-gray-900" style={{ fontSize: '10px' }}>
                {project.name}
              </h3>
              {project.description && (
                <p className="text-xs text-gray-800" style={{ fontSize: '8px', lineHeight: '1.2' }}>
                  {project.description.length > 100 ? `${project.description.substring(0, 100)}...` : project.description}
                </p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <p className="text-xs text-gray-600" style={{ fontSize: '8px' }}>
                  <span className="font-medium">Tech:</span> {project.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications - Very compact */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div className="mb-2">
          <h2 className="text-xs font-bold mb-1 text-gray-900 uppercase" 
              style={{ fontSize: '11px', marginBottom: '4px' }}>
            Certifications
          </h2>
          
          <div className="text-xs text-gray-800" style={{ fontSize: '8px', lineHeight: '1.2' }}>
            {resume.certifications.map((cert, index) => (
              <span key={index}>
                {cert.name}{cert.date && ` (${cert.date})`}
                {index < resume.certifications.length - 1 && ' • '}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages - Inline */}
      {resume.languages && resume.languages.length > 0 && (
        <div className="mb-2">
          <h2 className="text-xs font-bold mb-1 text-gray-900 uppercase" 
              style={{ fontSize: '11px', marginBottom: '4px' }}>
            Languages
          </h2>
          <div className="text-xs text-gray-800" style={{ fontSize: '8px', lineHeight: '1.3' }}>
            {resume.languages.join(' • ')}
          </div>
        </div>
      )}

      {/* Additional Sections - Compact */}
      {resume.additionalSections && Object.keys(resume.additionalSections).length > 0 && (
        <>
          {Object.entries(resume.additionalSections).map(([sectionName, sectionContent]) => {
            if (Array.isArray(sectionContent) && sectionContent.length > 0) {
              return (
                <div key={sectionName} className="mb-2">
                  <h2 className="text-xs font-bold mb-1 text-gray-900 uppercase" 
                      style={{ fontSize: '11px', marginBottom: '4px' }}>
                    {sectionName}
                  </h2>
                  <div className="text-xs text-gray-800" style={{ fontSize: '8px', lineHeight: '1.2' }}>
                    {sectionContent.slice(0, 3).join(' • ')}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </>
      )}
    </div>
  );
};