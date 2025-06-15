
import React from 'react';
import { ParsedResume } from '@/types/resumeStructure';

interface TechATSTemplateProps {
  resume: ParsedResume;
}

export const TechATSTemplate = ({ resume }: TechATSTemplateProps) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 font-mono text-gray-800">
      {/* Header */}
      <div className="border-l-4 border-green-500 pl-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {resume.contact.name || 'Your Name'}
        </h1>
        <div className="text-green-600 text-sm space-y-1">
          {resume.contact.email && <div>📧 {resume.contact.email}</div>}
          {resume.contact.phone && <div>📱 {resume.contact.phone}</div>}
          {resume.contact.linkedin && <div>🔗 {resume.contact.linkedin}</div>}
          {resume.contact.address && <div>📍 {resume.contact.address}</div>}
        </div>
      </div>

      {/* Summary */}
      {resume.professionalSummary && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-green-500 pb-1">
            // ABOUT
          </h2>
          <p className="text-gray-700 bg-gray-50 p-4 rounded border-l-4 border-green-200">
            {resume.professionalSummary}
          </p>
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-green-500 pb-1">
            // TECH_STACK
          </h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
            <div className="mb-2">const skills = [</div>
            <div className="ml-4">
              {resume.skills.slice(0, 12).map((skill, index) => (
                <div key={index} className="text-yellow-300">
                  "{skill}"{index < resume.skills.slice(0, 12).length - 1 ? ',' : ''}
                </div>
              ))}
            </div>
            <div>];</div>
          </div>
        </div>
      )}

      {/* Experience */}
      {resume.workExperience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-green-500 pb-1">
            // EXPERIENCE
          </h2>
          <div className="space-y-6">
            {resume.workExperience.map((exp, index) => (
              <div key={index} className="border border-gray-200 rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-green-600 font-semibold">{exp.company}</p>
                  </div>
                  <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </span>
                </div>
                {exp.responsibilities && (
                  <div className="mt-3">
                    {exp.responsibilities.map((resp, idx) => (
                      <div key={idx} className="text-gray-700 mb-1 flex">
                        <span className="text-green-500 mr-2">{'>'}</span>
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Volunteer Experience */}
      {resume.volunteerExperience && resume.volunteerExperience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-green-500 pb-1">
            // VOLUNTEER_WORK
          </h2>
          <div className="space-y-6">
            {resume.volunteerExperience.map((exp, index) => (
              <div key={index} className="border border-gray-200 rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-green-600 font-semibold">{exp.company}</p>
                  </div>
                  <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </span>
                </div>
                {exp.responsibilities && (
                  <div className="mt-3">
                    {exp.responsibilities.map((resp, idx) => (
                      <div key={idx} className="text-gray-700 mb-1 flex">
                        <span className="text-green-500 mr-2">{'>'}</span>
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-green-500 pb-1">
            // PROJECTS
          </h2>
          <div className="space-y-4">
            {resume.projects.map((project, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded border-l-4 border-green-200">
                <h3 className="font-bold text-gray-900">{project.name}</h3>
                {project.description && (
                  <p className="text-gray-700 mt-2">{project.description}</p>
                )}
                {project.technologies && (
                  <p className="text-green-600 text-sm mt-1">
                    Tech: {project.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-green-500 pb-1">
            // EDUCATION
          </h2>
          <div className="space-y-3">
            {resume.education.map((edu, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded border-l-4 border-green-200">
                <h3 className="font-bold text-gray-900">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-green-600">{edu.institution}</p>
                {edu.graduationDate && (
                  <p className="text-gray-500 text-sm">{edu.graduationDate}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-green-500 pb-1">
            // CERTIFICATIONS
          </h2>
          <div className="space-y-2">
            {resume.certifications.map((cert, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded border-l-4 border-green-200">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-gray-900">{cert.name}</span>
                    {cert.issuer && cert.issuer !== 'Unknown' && (
                      <p className="text-green-600 text-sm">{cert.issuer}</p>
                    )}
                  </div>
                  {cert.date && (
                    <span className="text-gray-500 text-sm">{cert.date}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {resume.achievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-green-500 pb-1">
            // ACHIEVEMENTS
          </h2>
          <div className="space-y-1">
            {resume.achievements.map((achievement, index) => (
              <div key={index} className="text-gray-700 flex">
                <span className="text-green-500 mr-2">{'>'}</span>
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {resume.languages && resume.languages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-green-500 pb-1">
            // LANGUAGES
          </h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
            <div className="mb-2">const languages = [</div>
            <div className="ml-4">
              {resume.languages.map((lang, index) => (
                <div key={index} className="text-yellow-300">
                  "{lang}"{index < resume.languages.length - 1 ? ',' : ''}
                </div>
              ))}
            </div>
            <div>];</div>
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
                  <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-green-500 pb-1">
                    // {sectionName.toUpperCase()}
                  </h2>
                  <div className="space-y-1">
                    {sectionContent.map((item, index) => (
                      <div key={index} className="text-gray-700 flex">
                        <span className="text-green-500 mr-2">{'>'}</span>
                        <span>{item}</span>
                      </div>
                    ))}
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
