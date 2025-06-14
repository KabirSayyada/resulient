
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
        
        <div className="flex flex-wrap text-sm text-gray-700 gap-4">
          {resume.contact.email && <span className="bg-gray-100 px-3 py-1 rounded">{resume.contact.email}</span>}
          {resume.contact.phone && <span className="bg-gray-100 px-3 py-1 rounded">{resume.contact.phone}</span>}
          {resume.contact.linkedin && <span className="bg-gray-100 px-3 py-1 rounded">{resume.contact.linkedin}</span>}
          {resume.contact.address && <span className="bg-gray-100 px-3 py-1 rounded">{resume.contact.address}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {resume.professionalSummary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-blue-700 uppercase">
            Professional Summary
          </h2>
          <p className="text-gray-800 bg-blue-50 p-4 rounded leading-relaxed">
            {resume.professionalSummary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {resume.workExperience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6 text-blue-700 uppercase">
            Professional Experience
          </h2>
          
          {resume.workExperience.map((exp, index) => (
            <div key={index} className="mb-6 pl-6 border-l-4 border-blue-200">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{exp.position}</h3>
                  <p className="text-blue-600 font-semibold text-lg">{exp.company}</p>
                </div>
                {(exp.startDate || exp.endDate) && (
                  <div className="text-gray-600 bg-gray-100 px-3 py-1 rounded font-medium">
                    {exp.startDate} {exp.endDate && `- ${exp.endDate}`}
                  </div>
                )}
              </div>
              
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul className="list-disc list-inside ml-4 text-gray-800 space-y-2">
                  {exp.responsibilities.map((responsibility, respIndex) => (
                    <li key={respIndex} className="leading-relaxed">
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
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-blue-700 uppercase">
            Technical Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6 text-blue-700 uppercase">
            Education
          </h2>
          
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-4 flex justify-between items-start bg-gray-50 p-4 rounded">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-gray-700 text-lg">{edu.institution}</p>
              </div>
              {edu.graduationDate && (
                <div className="text-gray-600 font-medium">
                  {edu.graduationDate}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6 text-blue-700 uppercase">
            Projects
          </h2>
          
          {resume.projects.map((project, index) => (
            <div key={index} className="mb-4 bg-blue-50 p-4 rounded">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{project.name}</h3>
              {project.description && (
                <p className="text-gray-800 mb-2 leading-relaxed">{project.description}</p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <p className="text-blue-600 font-medium">
                  Technologies: {project.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6 text-blue-700 uppercase">
            Certifications
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resume.certifications.map((cert, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-1">{cert.name}</h3>
                {cert.issuer !== 'Unknown' && (
                  <p className="text-gray-600 mb-1">{cert.issuer}</p>
                )}
                {cert.date && (
                  <p className="text-gray-500 text-sm">{cert.date}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
