
import React from 'react';
import { ParsedResume } from '@/types/resumeStructure';

interface ProfessionalATSTemplateProps {
  resume: ParsedResume;
}

export const ProfessionalATSTemplate = ({ resume }: ProfessionalATSTemplateProps) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 font-serif text-gray-800">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {resume.contact.name || 'Your Name'}
        </h1>
        <div className="text-gray-600 text-sm">
          {[
            resume.contact.email,
            resume.contact.phone,
            resume.contact.linkedin,
            resume.contact.address
          ].filter(Boolean).join(' | ')}
        </div>
      </div>

      {/* Summary */}
      {resume.professionalSummary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
            EXECUTIVE SUMMARY
          </h2>
          <p className="text-gray-700 text-center italic leading-relaxed">
            "{resume.professionalSummary}"
          </p>
        </div>
      )}

      {/* Core Competencies */}
      {resume.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
            CORE COMPETENCIES
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            {resume.skills.slice(0, 15).map((skill, index) => (
              <div key={index} className="text-gray-700 py-2 border-b border-gray-200">
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {resume.workExperience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="space-y-8">
            {resume.workExperience.map((exp, index) => (
              <div key={index} className="border-l-4 border-gray-300 pl-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-600 font-semibold">{exp.company}</p>
                  </div>
                  <div className="text-gray-500 text-sm font-semibold">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </div>
                </div>
                {exp.responsibilities && (
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
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            EDUCATION
          </h2>
          <div className="space-y-4">
            {resume.education.map((edu, index) => (
              <div key={index} className="text-center border-b border-gray-200 pb-4">
                <h3 className="font-bold text-gray-900 text-lg">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-gray-600 font-semibold">{edu.institution}</p>
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
