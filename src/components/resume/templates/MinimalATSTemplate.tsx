
import React from 'react';
import { ParsedResume } from '@/types/resumeStructure';

interface MinimalATSTemplateProps {
  resume: ParsedResume;
  className?: string;
}

export const MinimalATSTemplate = ({ resume, className = '' }: MinimalATSTemplateProps) => {
  return (
    <div className={`bg-white p-8 max-w-2xl mx-auto font-serif text-gray-900 leading-relaxed ${className}`} 
         style={{ fontFamily: 'Georgia, serif', fontSize: '11px', lineHeight: '1.4' }}>
      
      {/* Header Section - Clean and minimal */}
      <div className="text-center mb-6 pb-4">
        {resume.contact.name && (
          <h1 className="text-2xl font-light mb-3 text-gray-900 tracking-wide" 
              style={{ fontSize: '22px', marginBottom: '12px', fontWeight: '300' }}>
            {resume.contact.name}
          </h1>
        )}
        
        <div className="text-xs text-gray-600 space-y-1" style={{ fontSize: '10px' }}>
          {[resume.contact.email, resume.contact.phone, resume.contact.linkedin, resume.contact.address]
            .filter(Boolean)
            .map((contact, index) => (
              <div key={index}>{contact}</div>
            ))}
        </div>
        <div className="w-16 h-px bg-gray-300 mx-auto mt-4"></div>
      </div>

      {/* Professional Summary */}
      {resume.professionalSummary && (
        <div className="mb-6">
          <h2 className="text-sm font-medium mb-3 text-gray-800 tracking-wider" 
              style={{ fontSize: '11px', marginBottom: '8px', fontWeight: '500' }}>
            SUMMARY
          </h2>
          <p className="text-xs text-gray-700 italic leading-relaxed" style={{ fontSize: '10px', lineHeight: '1.5' }}>
            {resume.professionalSummary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {resume.workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium mb-3 text-gray-800 tracking-wider" 
              style={{ fontSize: '11px', marginBottom: '8px', fontWeight: '500' }}>
            EXPERIENCE
          </h2>
          
          {resume.workExperience.map((exp, index) => (
            <div key={index} className="mb-4" style={{ marginBottom: '16px' }}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-xs font-medium text-gray-900" style={{ fontSize: '11px' }}>
                  {exp.position}
                </h3>
                {(exp.startDate || exp.endDate) && (
                  <div className="text-xs text-gray-500" style={{ fontSize: '9px' }}>
                    {exp.startDate} {exp.endDate && `– ${exp.endDate}`}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600 mb-2" style={{ fontSize: '10px' }}>
                {exp.company}
              </p>
              
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul className="text-xs text-gray-700 space-y-1 ml-4" 
                    style={{ fontSize: '10px', lineHeight: '1.4' }}>
                  {exp.responsibilities.slice(0, 3).map((responsibility, respIndex) => (
                    <li key={respIndex} className="list-disc">
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
        <div className="mb-6">
          <h2 className="text-sm font-medium mb-3 text-gray-800 tracking-wider" 
              style={{ fontSize: '11px', marginBottom: '8px', fontWeight: '500' }}>
            SKILLS
          </h2>
          <p className="text-xs text-gray-700 leading-relaxed" style={{ fontSize: '10px', lineHeight: '1.5' }}>
            {resume.skills.slice(0, 20).join(' • ')}
          </p>
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium mb-3 text-gray-800 tracking-wider" 
              style={{ fontSize: '11px', marginBottom: '8px', fontWeight: '500' }}>
            EDUCATION
          </h2>
          
          {resume.education.map((edu, index) => (
            <div key={index} className="flex justify-between items-baseline mb-2" style={{ marginBottom: '8px' }}>
              <div>
                <h3 className="text-xs font-medium text-gray-900" style={{ fontSize: '11px' }}>
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-xs text-gray-600" style={{ fontSize: '10px' }}>
                  {edu.institution}
                </p>
              </div>
              {edu.graduationDate && (
                <div className="text-xs text-gray-500" style={{ fontSize: '9px' }}>
                  {edu.graduationDate}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium mb-3 text-gray-800 tracking-wider" 
              style={{ fontSize: '11px', marginBottom: '8px', fontWeight: '500' }}>
            PROJECTS
          </h2>
          
          {resume.projects.slice(0, 2).map((project, index) => (
            <div key={index} className="mb-3" style={{ marginBottom: '12px' }}>
              <h3 className="text-xs font-medium text-gray-900 mb-1" style={{ fontSize: '11px' }}>
                {project.name}
              </h3>
              {project.description && (
                <p className="text-xs text-gray-700 leading-relaxed" style={{ fontSize: '10px', lineHeight: '1.4' }}>
                  {project.description.substring(0, 100)}
                  {project.description.length > 100 ? '...' : ''}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Achievements - Show ALL achievements */}
      {resume.achievements && resume.achievements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium mb-3 text-gray-800 tracking-wider" 
              style={{ fontSize: '11px', marginBottom: '8px', fontWeight: '500' }}>
            AWARDS & ACHIEVEMENTS
          </h2>
          <ul className="text-xs text-gray-700 space-y-1 ml-4" 
              style={{ fontSize: '10px', lineHeight: '1.4' }}>
            {resume.achievements.map((achievement, index) => (
              <li key={index} className="list-disc">
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-medium mb-3 text-gray-800 tracking-wider" 
              style={{ fontSize: '11px', marginBottom: '8px', fontWeight: '500' }}>
            CERTIFICATIONS
          </h2>
          
          {resume.certifications.slice(0, 3).map((cert, index) => (
            <div key={index} className="flex justify-between items-baseline mb-1" style={{ marginBottom: '4px' }}>
              <div>
                <span className="text-xs font-medium text-gray-900" style={{ fontSize: '10px' }}>
                  {cert.name}
                </span>
                {cert.issuer !== 'Unknown' && (
                  <span className="text-xs text-gray-600 ml-2" style={{ fontSize: '9px' }}>
                    — {cert.issuer}
                  </span>
                )}
              </div>
              {cert.date && (
                <div className="text-xs text-gray-500" style={{ fontSize: '9px' }}>
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
