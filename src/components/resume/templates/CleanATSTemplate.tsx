
import React from 'react';
import { ParsedResume } from '@/types/resumeStructure';

interface CleanATSTemplateProps {
  resume: ParsedResume;
}

export const CleanATSTemplate = ({ resume }: CleanATSTemplateProps) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 font-sans text-gray-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-normal text-gray-900 mb-3">
          {resume.contact.name || 'Your Name'}
        </h1>
        <div className="text-gray-600 text-sm leading-relaxed">
          {resume.contact.email && <div>{resume.contact.email}</div>}
          {resume.contact.phone && <div>{resume.contact.phone}</div>}
          {resume.contact.linkedin && <div>{resume.contact.linkedin}</div>}
          {resume.contact.address && <div>{resume.contact.address}</div>}
        </div>
      </div>

      {/* Summary */}
      {resume.professionalSummary && (
        <div className="mb-8">
          <h2 className="text-lg font-normal text-gray-900 mb-3">
            Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {resume.professionalSummary}
          </p>
        </div>
      )}

      {/* Experience */}
      {resume.workExperience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-normal text-gray-900 mb-4">
            Experience
          </h2>
          <div className="space-y-6">
            {resume.workExperience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-medium text-gray-900">{exp.position}</h3>
                  <span className="text-gray-500 text-sm">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{exp.company}</p>
                {exp.responsibilities && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
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

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-normal text-gray-900 mb-3">
            Skills
          </h2>
          <p className="text-gray-700">
            {resume.skills.join(', ')}
          </p>
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-normal text-gray-900 mb-4">
            Education
          </h2>
          <div className="space-y-3">
            {resume.education.map((edu, index) => (
              <div key={index}>
                <h3 className="font-medium text-gray-900">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-gray-600">{edu.institution}</p>
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
          <h2 className="text-lg font-normal text-gray-900 mb-4">
            Projects
          </h2>
          <div className="space-y-4">
            {resume.projects.map((project, index) => (
              <div key={index}>
                <h3 className="font-medium text-gray-900">{project.name}</h3>
                <p className="text-gray-700">{project.description}</p>
                {project.technologies && (
                  <p className="text-gray-500 text-sm mt-1">
                    Technologies: {project.technologies.join(', ')}
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
