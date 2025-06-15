
import React from 'react';
import { ParsedResume } from '@/types/resumeStructure';

interface ATSFriendlyResumePdfTemplateProps {
  resume: ParsedResume;
  className?: string;
}

export const ATSFriendlyResumePdfTemplate = ({ resume, className = '' }: ATSFriendlyResumePdfTemplateProps) => {
  return (
    <div className={`bg-white p-6 max-w-2xl mx-auto font-sans text-gray-900 leading-tight ${className}`} 
         style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', lineHeight: '1.3' }}>
      
      {/* Header Section - Contact Information */}
      <div className="text-center mb-4 border-b border-gray-300 pb-3">
        {resume.contact.name && (
          <h1 className="text-xl font-bold mb-2 text-gray-900" style={{ fontSize: '18px', marginBottom: '8px' }}>
            {resume.contact.name}
          </h1>
        )}
        
        <div className="text-xs text-gray-700 space-y-1" style={{ fontSize: '10px' }}>
          {resume.contact.address && (
            <div>{resume.contact.address}</div>
          )}
          {resume.contact.phone && (
            <div>{resume.contact.phone}</div>
          )}
          {resume.contact.email && (
            <div>{resume.contact.email}</div>
          )}
          {resume.contact.linkedin && (
            <div>{resume.contact.linkedin}</div>
          )}
          {resume.contact.website && (
            <div>{resume.contact.website}</div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {resume.professionalSummary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold mb-2 text-gray-900 border-b border-gray-200" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-xs text-gray-800" style={{ fontSize: '10px', lineHeight: '1.4' }}>
            {resume.professionalSummary}
          </p>
        </div>
      )}

      {/* Technical Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold mb-2 text-gray-900 border-b border-gray-200" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            TECHNICAL SKILLS
          </h2>
          <div className="text-xs text-gray-800" style={{ fontSize: '10px', lineHeight: '1.4' }}>
            {resume.skills.join(' • ')}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {resume.workExperience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold mb-2 text-gray-900 border-b border-gray-200" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            PROFESSIONAL EXPERIENCE
          </h2>
          
          {resume.workExperience.map((exp, index) => (
            <div key={index} className="mb-3" style={{ marginBottom: '10px' }}>
              <div className="flex justify-between items-start mb-1">
                <div className="flex-1">
                  <h3 className="font-semibold text-xs text-gray-900" style={{ fontSize: '11px' }}>
                    {exp.position}
                  </h3>
                  <p className="text-xs text-gray-700" style={{ fontSize: '10px' }}>
                    {exp.company}{exp.location && ` – ${exp.location}`}
                  </p>
                </div>
                {(exp.startDate || exp.endDate) && (
                  <div className="text-xs text-gray-600 text-right" style={{ fontSize: '10px' }}>
                    {exp.startDate} {exp.endDate && `– ${exp.endDate}`}
                  </div>
                )}
              </div>
              
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul className="list-disc list-inside ml-2 text-xs text-gray-800 space-y-1" 
                    style={{ fontSize: '10px', lineHeight: '1.3' }}>
                  {exp.responsibilities.map((responsibility, respIndex) => (
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

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold mb-2 text-gray-900 border-b border-gray-200" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            EDUCATION
          </h2>
          
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-2 flex justify-between items-start" style={{ marginBottom: '8px' }}>
              <div className="flex-1">
                <h3 className="font-semibold text-xs text-gray-900" style={{ fontSize: '11px' }}>
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-xs text-gray-700" style={{ fontSize: '10px' }}>
                  {edu.institution}{edu.location && ` – ${edu.location}`}
                </p>
                {edu.gpa && (
                  <p className="text-xs text-gray-600" style={{ fontSize: '9px' }}>
                    GPA: {edu.gpa}
                  </p>
                )}
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
          <h2 className="text-sm font-bold mb-2 text-gray-900 border-b border-gray-200" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            PROJECTS
          </h2>
          
          {resume.projects.map((project, index) => (
            <div key={index} className="mb-2" style={{ marginBottom: '8px' }}>
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-xs text-gray-900 flex-1" style={{ fontSize: '11px' }}>
                  {project.name}
                </h3>
                {project.date && (
                  <div className="text-xs text-gray-600" style={{ fontSize: '10px' }}>
                    {project.date}
                  </div>
                )}
              </div>
              {project.description && (
                <p className="text-xs text-gray-800 mb-1" style={{ fontSize: '10px', lineHeight: '1.3' }}>
                  {project.description}
                </p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <p className="text-xs text-gray-600" style={{ fontSize: '9px' }}>
                  <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                </p>
              )}
              {project.url && (
                <p className="text-xs text-gray-600" style={{ fontSize: '9px' }}>
                  <span className="font-medium">URL:</span> {project.url}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold mb-2 text-gray-900 border-b border-gray-200" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            CERTIFICATIONS
          </h2>
          
          {resume.certifications.map((cert, index) => (
            <div key={index} className="mb-1 flex justify-between items-start" style={{ marginBottom: '6px' }}>
              <div className="flex-1">
                <h3 className="font-semibold text-xs text-gray-900" style={{ fontSize: '10px' }}>
                  {cert.name}
                </h3>
                {cert.issuer && cert.issuer !== 'Unknown' && (
                  <p className="text-xs text-gray-700" style={{ fontSize: '9px' }}>
                    {cert.issuer}
                  </p>
                )}
              </div>
              <div className="text-xs text-gray-600 text-right" style={{ fontSize: '9px' }}>
                {cert.date && <div>{cert.date}</div>}
                {cert.expirationDate && <div>Expires: {cert.expirationDate}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {resume.achievements.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold mb-2 text-gray-900 border-b border-gray-200" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            ACHIEVEMENTS
          </h2>
          <ul className="list-disc list-inside ml-2 text-xs text-gray-800 space-y-1" 
              style={{ fontSize: '10px', lineHeight: '1.3' }}>
            {resume.achievements.map((achievement, index) => (
              <li key={index} className="leading-tight">
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {resume.languages && resume.languages.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold mb-2 text-gray-900 border-b border-gray-200" 
              style={{ fontSize: '12px', marginBottom: '6px' }}>
            LANGUAGES
          </h2>
          <div className="text-xs text-gray-800" style={{ fontSize: '10px', lineHeight: '1.4' }}>
            {resume.languages.join(' • ')}
          </div>
        </div>
      )}

      {/* All Additional Sections */}
      {resume.additionalSections && Object.keys(resume.additionalSections).length > 0 && (
        <>
          {Object.entries(resume.additionalSections).map(([sectionName, sectionContent]) => {
            if (Array.isArray(sectionContent) && sectionContent.length > 0) {
              return (
                <div key={sectionName} className="mb-4">
                  <h2 className="text-sm font-bold mb-2 text-gray-900 border-b border-gray-200" 
                      style={{ fontSize: '12px', marginBottom: '6px' }}>
                    {sectionName.toUpperCase()}
                  </h2>
                  <ul className="list-disc list-inside ml-2 text-xs text-gray-800 space-y-1" 
                      style={{ fontSize: '10px', lineHeight: '1.3' }}>
                    {sectionContent.map((item, index) => (
                      <li key={index} className="leading-tight">
                        {item}
                      </li>
                    ))}
                  </ul>
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
