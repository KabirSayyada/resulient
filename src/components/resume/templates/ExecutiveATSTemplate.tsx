
import React from 'react';
import { ParsedResume } from '@/types/resumeStructure';

interface ExecutiveATSTemplateProps {
  resume: ParsedResume;
  className?: string;
}

export const ExecutiveATSTemplate = ({ resume, className = '' }: ExecutiveATSTemplateProps) => {
  return (
    <div className={`bg-white p-8 max-w-4xl mx-auto font-sans text-gray-900 leading-relaxed ${className}`}>
      
      {/* Header Section - Executive style */}
      <div className="mb-8 pb-6 border-b-2 border-gray-800">
        {resume.contact.name && (
          <h1 className="text-3xl font-bold mb-4 text-gray-900 uppercase tracking-wide">
            {resume.contact.name}
          </h1>
        )}
        
        <div className="text-sm text-gray-700 font-medium">
          {[resume.contact.email, resume.contact.phone, resume.contact.linkedin, resume.contact.address]
            .filter(Boolean)
            .join(' | ')}
        </div>
      </div>

      {/* Professional Summary */}
      {resume.professionalSummary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2">
            Executive Summary
          </h2>
          <p className="text-gray-800 font-medium leading-relaxed">
            {resume.professionalSummary}
          </p>
        </div>
      )}

      {/* Core Competencies/Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2">
            Core Competencies
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {resume.skills.map((skill, index) => (
              <div key={index} className="text-gray-700 font-medium flex items-center">
                <span className="text-gray-500 mr-2">•</span>
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {resume.workExperience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2">
            Professional Experience
          </h2>
          
          {resume.workExperience.map((exp, index) => (
            <div key={index} className="mb-8">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 uppercase tracking-wide">{exp.position}</h3>
                  <p className="text-gray-700 font-semibold text-lg">{exp.company}</p>
                </div>
                {(exp.startDate || exp.endDate) && (
                  <div className="text-gray-600 font-medium">
                    {exp.startDate} {exp.endDate && `– ${exp.endDate}`}
                  </div>
                )}
              </div>
              
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul className="text-gray-800 space-y-2 ml-4">
                  {exp.responsibilities.map((responsibility, respIndex) => (
                    <li key={respIndex} className="flex items-start leading-relaxed">
                      <span className="text-gray-500 mr-3 mt-1">•</span>
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Volunteer Experience */}
      {resume.volunteerExperience && resume.volunteerExperience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2">
            Community Leadership
          </h2>
          
          {resume.volunteerExperience.map((exp, index) => (
            <div key={index} className="mb-8">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 uppercase tracking-wide">{exp.position}</h3>
                  <p className="text-gray-700 font-semibold text-lg">{exp.company}</p>
                </div>
                {(exp.startDate || exp.endDate) && (
                  <div className="text-gray-600 font-medium">
                    {exp.startDate} {exp.endDate && `– ${exp.endDate}`}
                  </div>
                )}
              </div>
              
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul className="text-gray-800 space-y-2 ml-4">
                  {exp.responsibilities.map((responsibility, respIndex) => (
                    <li key={respIndex} className="flex items-start leading-relaxed">
                      <span className="text-gray-500 mr-3 mt-1">•</span>
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
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2">
            Education
          </h2>
          
          {resume.education.map((edu, index) => (
            <div key={index} className="mb-4 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-gray-700 font-semibold">{edu.institution}</p>
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
          <h2 className="text-xl font-bold mb-6 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2">
            Key Projects
          </h2>
          
          {resume.projects.map((project, index) => (
            <div key={index} className="mb-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{project.name}</h3>
              {project.description && (
                <p className="text-gray-800 mb-3 leading-relaxed">{project.description}</p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <p className="text-gray-600 font-medium">
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
          <h2 className="text-xl font-bold mb-6 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2">
            Professional Certifications
          </h2>
          
          {resume.certifications.map((cert, index) => (
            <div key={index} className="mb-3 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                {cert.issuer !== 'Unknown' && (
                  <p className="text-gray-700">{cert.issuer}</p>
                )}
              </div>
              {cert.date && (
                <div className="text-gray-600 font-medium">
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
