
import React from 'react';
import { ParsedResume } from '@/types/resumeStructure';

interface CreativeATSTemplateProps {
  resume: ParsedResume;
}

export const CreativeATSTemplate = ({ resume }: CreativeATSTemplateProps) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 font-sans text-gray-800 leading-relaxed">
      {/* Header with creative accent */}
      <div className="text-center mb-8 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        <h1 className="text-3xl font-light text-gray-900 mt-4 tracking-wide">
          {resume.contact.name || 'Your Name'}
        </h1>
        <div className="mt-3 text-gray-600 space-x-3">
          {resume.contact.email && <span>{resume.contact.email}</span>}
          {resume.contact.phone && <span>•</span>}
          {resume.contact.phone && <span>{resume.contact.phone}</span>}
          {resume.contact.linkedin && <span>•</span>}
          {resume.contact.linkedin && <span>{resume.contact.linkedin}</span>}
        </div>
        {resume.contact.address && (
          <div className="text-gray-500 mt-1">{resume.contact.address}</div>
        )}
      </div>

      {/* Professional Summary */}
      {resume.professionalSummary && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
            <h2 className="text-xl font-medium text-gray-800">Professional Summary</h2>
          </div>
          <p className="text-gray-700 leading-relaxed pl-9">{resume.professionalSummary}</p>
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
            <h2 className="text-xl font-medium text-gray-800">Core Competencies</h2>
          </div>
          <div className="pl-9 flex flex-wrap gap-2">
            {resume.skills.slice(0, 15).map((skill, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {resume.workExperience.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
            <h2 className="text-xl font-medium text-gray-800">Professional Experience</h2>
          </div>
          <div className="pl-9 space-y-6">
            {resume.workExperience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-purple-600 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-gray-500 text-sm">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </div>
                </div>
                {exp.responsibilities && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
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
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
            <h2 className="text-xl font-medium text-gray-800">Education</h2>
          </div>
          <div className="pl-9 space-y-3">
            {resume.education.map((edu, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-900">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-purple-600">{edu.institution}</p>
                {edu.graduationDate && (
                  <p className="text-gray-500 text-sm">{edu.graduationDate}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
