import React from 'react';
import { ParsedResume } from '@/types/resumeStructure';

interface CompactResumePdfTemplateProps {
  resume: ParsedResume;
  className?: string;
}

export const CompactResumePdfTemplate = ({ resume, className = '' }: CompactResumePdfTemplateProps) => {
  console.log('=== CompactResumePdfTemplate Debug ===');
  console.log('Resume object:', resume);

  return (
    <div className={`bg-white text-gray-900 ${className}`} 
         style={{ 
           fontFamily: 'Arial, sans-serif', 
           fontSize: '11px', 
           lineHeight: '1.4',
           padding: '20px',
           maxWidth: '210mm',
           margin: '0 auto'
         }}>
      
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #666' }}>
        {resume.contact.name && (
          <h1 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            margin: '0 0 8px 0',
            color: '#1a1a1a'
          }}>
            {resume.contact.name}
          </h1>
        )}
        
        {/* Contact Information */}
        <div style={{ fontSize: '10px', color: '#555', lineHeight: '1.3' }}>
          {[
            resume.contact.email,
            resume.contact.phone,
            resume.contact.linkedin,
            resume.contact.website,
            resume.contact.address
          ].filter(Boolean).join(' | ')}
        </div>
      </div>

      {/* Professional Summary */}
      {resume.professionalSummary && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            margin: '0 0 6px 0',
            color: '#1a1a1a',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Professional Summary
          </h2>
          <p style={{ 
            fontSize: '10px', 
            lineHeight: '1.4', 
            margin: '0',
            color: '#333'
          }}>
            {resume.professionalSummary}
          </p>
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            margin: '0 0 6px 0',
            color: '#1a1a1a',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Core Skills
          </h2>
          <div style={{ 
            fontSize: '10px', 
            lineHeight: '1.4',
            color: '#333'
          }}>
            {resume.skills.join(' • ')}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {resume.workExperience && resume.workExperience.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            margin: '0 0 8px 0',
            color: '#1a1a1a',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Professional Experience
          </h2>
          
          {resume.workExperience.map((exp, index) => (
            <div key={index} style={{ marginBottom: '12px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '4px'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '11px', 
                    fontWeight: '600',
                    margin: '0',
                    color: '#1a1a1a'
                  }}>
                    {exp.position} | {exp.company}
                  </h3>
                </div>
                <div style={{ 
                  fontSize: '9px', 
                  color: '#666',
                  marginLeft: '8px',
                  whiteSpace: 'nowrap'
                }}>
                  {exp.startDate} {exp.endDate && `- ${exp.endDate}`}
                </div>
              </div>
              
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <div style={{ marginLeft: '12px' }}>
                  {exp.responsibilities.slice(0, 3).map((responsibility, respIndex) => (
                    <div key={respIndex} style={{ 
                      fontSize: '9px', 
                      lineHeight: '1.3',
                      marginBottom: '2px',
                      color: '#444',
                      display: 'flex',
                      alignItems: 'flex-start'
                    }}>
                      <span style={{ marginRight: '6px', fontSize: '8px' }}>•</span>
                      <span>{responsibility}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            margin: '0 0 6px 0',
            color: '#1a1a1a',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Education
          </h2>
          
          {resume.education.map((edu, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '6px'
            }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  fontSize: '10px', 
                  fontWeight: '600',
                  margin: '0 0 2px 0',
                  color: '#1a1a1a'
                }}>
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p style={{ 
                  fontSize: '9px', 
                  margin: '0',
                  color: '#555'
                }}>
                  {edu.institution}
                </p>
              </div>
              {edu.graduationDate && (
                <div style={{ 
                  fontSize: '9px', 
                  color: '#666',
                  marginLeft: '8px',
                  whiteSpace: 'nowrap'
                }}>
                  {edu.graduationDate}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            margin: '0 0 6px 0',
            color: '#1a1a1a',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Key Projects
          </h2>
          
          {resume.projects.slice(0, 2).map((project, index) => (
            <div key={index} style={{ marginBottom: '8px' }}>
              <h3 style={{ 
                fontSize: '10px', 
                fontWeight: '600',
                margin: '0 0 2px 0',
                color: '#1a1a1a'
              }}>
                {project.name}
              </h3>
              {project.description && (
                <p style={{ 
                  fontSize: '9px', 
                  lineHeight: '1.3',
                  margin: '0 0 2px 0',
                  color: '#444'
                }}>
                  {project.description.length > 120 ? `${project.description.substring(0, 120)}...` : project.description}
                </p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <p style={{ 
                  fontSize: '8px', 
                  margin: '0',
                  color: '#666'
                }}>
                  <span style={{ fontWeight: '500' }}>Technologies:</span> {project.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bottom Section - Certifications and Languages */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Certifications */}
        {resume.certifications && resume.certifications.length > 0 && (
          <div style={{ flex: 1 }}>
            <h2 style={{ 
              fontSize: '12px', 
              fontWeight: 'bold', 
              margin: '0 0 6px 0',
              color: '#1a1a1a',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Certifications
            </h2>
            <div style={{ 
              fontSize: '9px', 
              lineHeight: '1.3',
              color: '#444'
            }}>
              {resume.certifications.map((cert, index) => (
                <span key={index}>
                  {cert.name}{cert.date && ` (${cert.date})`}
                  {index < resume.certifications.length - 1 && ' • '}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {resume.languages && resume.languages.length > 0 && (
          <div style={{ flex: 1 }}>
            <h2 style={{ 
              fontSize: '12px', 
              fontWeight: 'bold', 
              margin: '0 0 6px 0',
              color: '#1a1a1a',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Languages
            </h2>
            <div style={{ 
              fontSize: '9px', 
              lineHeight: '1.3',
              color: '#444'
            }}>
              {resume.languages.join(' • ')}
            </div>
          </div>
        )}
      </div>

      {/* Additional Sections */}
      {resume.additionalSections && Object.keys(resume.additionalSections).length > 0 && (
        <div style={{ marginTop: '14px' }}>
          {Object.entries(resume.additionalSections).map(([sectionName, sectionContent]) => {
            if (Array.isArray(sectionContent) && sectionContent.length > 0) {
              return (
                <div key={sectionName} style={{ marginBottom: '10px' }}>
                  <h2 style={{ 
                    fontSize: '12px', 
                    fontWeight: 'bold', 
                    margin: '0 0 4px 0',
                    color: '#1a1a1a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {sectionName}
                  </h2>
                  <div style={{ 
                    fontSize: '9px', 
                    lineHeight: '1.3',
                    color: '#444'
                  }}>
                    {sectionContent.slice(0, 3).join(' • ')}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};