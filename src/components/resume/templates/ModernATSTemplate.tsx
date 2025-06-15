
import React from 'react';
import { ParsedResume } from '@/types/resumeStructure';

interface ModernATSTemplateProps {
  resume: ParsedResume;
  className?: string;
}

export const ModernATSTemplate = ({ resume, className = '' }: ModernATSTemplateProps) => {
  return (
    <div className={`bg-white p-8 max-w-4xl mx-auto font-sans text-gray-900 leading-relaxed ${className}`}>
      
      {/* Header Section with modern layout */}
      <div className="mb-8 pb-6 border-b-2 border-blue-600">
        {resume.contact.name && (
          <h1 className="text-3xl font-bold mb-4 text-blue-800">
            {resume.contact.name}
          </h1>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="space-y-1">
            {resume.contact.email && <div>📧 {resume.contact.email}</div>}
            {resume.contact.phone && <div>📱 {resume.contact.phone}</div>}
          </div>
          <div className="space-y-1">
            {resume.contact.linkedin && <div>🔗 {resume.contact.linkedin}</div>}
            {resume.contact.address && <div>📍 {resume.contact.address}</div>}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {resume.professionalSummary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-3">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-200">
            {resume.professionalSummary}
          </p>
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-3">
            TECHNICAL SKILLS
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {resume.workExperience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-3">
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="space-y-6">
            {resume.workExperience.map((exp, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-blue-600 font-semibold">{exp.company}</p>
                  </div>
                  <div className="text-gray-500 text-sm bg-white px-2 py-1 rounded">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </div>
                </div>
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mt-3">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-3">
            EDUCATION
          </h2>
          <div className="space-y-4">
            {resume.education.map((edu, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-200">
                <h3 className="font-bold text-gray-900">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-blue-600 font-semibold">{edu.institution}</p>
                {edu.graduationDate && (
                  <p className="text-gray-500 text-sm">{edu.graduationDate}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-3">
            PROJECTS
          </h2>
          <div className="space-y-4">
            {resume.projects.map((project, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-200">
                <h3 className="font-bold text-gray-900">{project.name}</h3>
                {project.description && (
                  <p className="text-gray-700 mt-2">{project.description}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">Technologies: </span>
                    <span className="text-sm text-blue-600 font-medium">
                      {project.technologies.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-3">
            CERTIFICATIONS
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              {resume.certifications.map((cert, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-gray-900">{cert.name}</span>
                    {cert.issuer && cert.issuer !== 'Unknown' && (
                      <span className="text-blue-600 ml-2">- {cert.issuer}</span>
                    )}
                  </div>
                  {cert.date && (
                    <span className="text-gray-500 text-sm">{cert.date}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievements */}
      {resume.achievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-3">
            ACHIEVEMENTS
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {resume.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Additional Sections */}
      {resume.additionalSections && Object.keys(resume.additionalSections).length > 0 && (
        <>
          {Object.entries(resume.additionalSections).map(([sectionName, sectionContent]) => {
            if (Array.isArray(sectionContent) && sectionContent.length > 0) {
              return (
                <div key={sectionName} className="mb-8">
                  <h2 className="text-xl font-bold mb-4 text-blue-800 border-l-4 border-blue-600 pl-3">
                    {sectionName.toUpperCase()}
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {sectionContent.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
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
