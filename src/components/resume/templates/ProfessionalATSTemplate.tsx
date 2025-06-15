
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

      {/* Volunteer Experience */}
      {resume.volunteerExperience && resume.volunteerExperience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            VOLUNTEER EXPERIENCE
          </h2>
          <div className="space-y-8">
            {resume.volunteerExperience.map((exp, index) => (
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

      {/* Projects */}
      {resume.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            KEY PROJECTS
          </h2>
          <div className="space-y-6">
            {resume.projects.map((project, index) => (
              <div key={index} className="border-l-4 border-gray-300 pl-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h3>
                {project.description && (
                  <p className="text-gray-700 mb-3">{project.description}</p>
                )}
                {project.technologies && (
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold">Technologies:</span> {project.technologies.join(', ')}
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

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            PROFESSIONAL CERTIFICATIONS
          </h2>
          <div className="space-y-3">
            {resume.certifications.map((cert, index) => (
              <div key={index} className="text-center border-b border-gray-200 pb-3">
                <h3 className="font-bold text-gray-900">{cert.name}</h3>
                {cert.issuer && cert.issuer !== 'Unknown' && (
                  <p className="text-gray-600">{cert.issuer}</p>
                )}
                {cert.date && (
                  <p className="text-gray-500 text-sm">{cert.date}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {resume.achievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            ACHIEVEMENTS & HONORS
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2 text-center" style={{ listStylePosition: 'inside' }}>
            {resume.achievements.map((achievement, index) => (
              <li key={index} className="leading-relaxed">{achievement}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {resume.languages && resume.languages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
            LANGUAGES
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            {resume.languages.map((language, index) => (
              <div key={index} className="text-gray-700 py-2 border-b border-gray-200">
                {language}
              </div>
            ))}
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
                  <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                    {sectionName.toUpperCase()}
                  </h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 text-center" style={{ listStylePosition: 'inside' }}>
                    {sectionContent.map((item, index) => (
                      <li key={index} className="leading-relaxed">{item}</li>
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
