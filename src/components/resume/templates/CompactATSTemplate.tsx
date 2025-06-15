
import React from 'react';
import { ParsedResume } from '@/types/resumeStructure';

interface CompactATSTemplateProps {
  resume: ParsedResume;
}

export const CompactATSTemplate = ({ resume }: CompactATSTemplateProps) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 font-sans text-gray-800 text-sm leading-tight">
      {/* Compact Header */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-300">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {resume.contact.name || 'Your Name'}
          </h1>
          <div className="text-xs text-gray-600">
            {resume.contact.email} | {resume.contact.phone}
          </div>
        </div>
        <div className="text-xs text-gray-600 text-right">
          {resume.contact.linkedin && <div>{resume.contact.linkedin}</div>}
          {resume.contact.address && <div>{resume.contact.address}</div>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-4">
          {/* Summary */}
          {resume.professionalSummary && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Summary
              </h2>
              <p className="text-xs text-gray-700 leading-relaxed">
                {resume.professionalSummary}
              </p>
            </div>
          )}

          {/* Experience */}
          {resume.workExperience.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Experience
              </h2>
              <div className="space-y-3">
                {resume.workExperience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-xs text-gray-600">{exp.company}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </div>
                    </div>
                    {exp.responsibilities && (
                      <ul className="list-disc list-inside text-xs text-gray-700 mt-1 space-y-0.5">
                        {exp.responsibilities.slice(0, 3).map((resp, idx) => (
                          <li key={idx}>{resp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Skills */}
          {resume.skills.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Skills
              </h2>
              <div className="space-y-1">
                {resume.skills.slice(0, 12).map((skill, index) => (
                  <div key={index} className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resume.education.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Education
              </h2>
              <div className="space-y-2">
                {resume.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="text-xs font-semibold text-gray-900">
                      {edu.degree}
                    </h3>
                    {edu.field && (
                      <p className="text-xs text-gray-600">{edu.field}</p>
                    )}
                    <p className="text-xs text-gray-600">{edu.institution}</p>
                    {edu.graduationDate && (
                      <p className="text-xs text-gray-500">{edu.graduationDate}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resume.projects.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Projects
              </h2>
              <div className="space-y-2">
                {resume.projects.slice(0, 3).map((project, index) => (
                  <div key={index}>
                    <h3 className="text-xs font-semibold text-gray-900">{project.name}</h3>
                    <p className="text-xs text-gray-700">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resume.certifications.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Certifications
              </h2>
              <div className="space-y-1">
                {resume.certifications.slice(0, 4).map((cert, index) => (
                  <div key={index}>
                    <h3 className="text-xs font-semibold text-gray-900">{cert.name}</h3>
                    {cert.issuer && cert.issuer !== 'Unknown' && (
                      <p className="text-xs text-gray-600">{cert.issuer}</p>
                    )}
                    {cert.date && (
                      <p className="text-xs text-gray-500">{cert.date}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {resume.achievements.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Achievements
              </h2>
              <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5">
                {resume.achievements.slice(0, 3).map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages */}
          {resume.languages && resume.languages.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Languages
              </h2>
              <div className="space-y-1">
                {resume.languages.slice(0, 4).map((language, index) => (
                  <div key={index} className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                    {language}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Sections */}
          {resume.additionalSections && Object.keys(resume.additionalSections).length > 0 && (
            <>
              {Object.entries(resume.additionalSections).slice(0, 2).map(([sectionName, sectionContent]) => {
                if (Array.isArray(sectionContent) && sectionContent.length > 0) {
                  return (
                    <div key={sectionName}>
                      <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                        {sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}
                      </h2>
                      <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5">
                        {sectionContent.slice(0, 3).map((item, index) => (
                          <li key={index}>{item}</li>
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
      </div>
    </div>
  );
};
