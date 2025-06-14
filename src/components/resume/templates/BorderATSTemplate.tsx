
import React from 'react';
import { ParsedResume } from '@/types/resumeStructure';

interface BorderATSTemplateProps {
  resume: ParsedResume;
}

export const BorderATSTemplate = ({ resume }: BorderATSTemplateProps) => {
  return (
    <div className="max-w-4xl mx-auto bg-white border-4 border-gray-800 p-8 font-sans text-gray-800">
      {/* Header with border */}
      <div className="border-b-2 border-gray-800 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {resume.contact.name || 'Your Name'}
        </h1>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            {resume.contact.email && <div>Email: {resume.contact.email}</div>}
            {resume.contact.phone && <div>Phone: {resume.contact.phone}</div>}
          </div>
          <div>
            {resume.contact.linkedin && <div>LinkedIn: {resume.contact.linkedin}</div>}
            {resume.contact.address && <div>Address: {resume.contact.address}</div>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {resume.professionalSummary && (
        <div className="mb-8">
          <div className="border-2 border-gray-300 p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3 bg-gray-800 text-white px-2 py-1 inline-block">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-gray-700 leading-relaxed mt-3">
              {resume.professionalSummary}
            </p>
          </div>
        </div>
      )}

      {/* Experience */}
      {resume.workExperience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 bg-gray-800 text-white px-2 py-1 inline-block">
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="space-y-6 mt-4">
            {resume.workExperience.map((exp, index) => (
              <div key={index} className="border-2 border-gray-300 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-600 font-semibold">{exp.company}</p>
                  </div>
                  <div className="text-gray-500 text-sm border border-gray-300 px-2 py-1">
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

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 bg-gray-800 text-white px-2 py-1 inline-block">
            CORE SKILLS
          </h2>
          <div className="border-2 border-gray-300 p-4 mt-4">
            <div className="grid grid-cols-3 gap-2">
              {resume.skills.slice(0, 18).map((skill, index) => (
                <div key={index} className="border border-gray-300 p-2 text-center text-sm">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 bg-gray-800 text-white px-2 py-1 inline-block">
            EDUCATION
          </h2>
          <div className="space-y-4 mt-4">
            {resume.education.map((edu, index) => (
              <div key={index} className="border-2 border-gray-300 p-4">
                <h3 className="font-bold text-gray-900">
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
