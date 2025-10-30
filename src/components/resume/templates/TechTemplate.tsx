import { TemplateProps } from "@/types/templateTypes";
import { applyColorScheme } from "@/utils/templateColorSchemes";
import { Code, Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

export const TechTemplate = ({ resume, colorScheme }: TemplateProps) => {
  const colors = applyColorScheme(colorScheme);

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto font-sans text-gray-800" style={{ minHeight: '11in' }}>
      {/* Header */}
      <div className="border-b-4 pb-4 mb-6" style={{ borderColor: colors.primary }}>
        <h1 className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
          {resume.contact.name}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          {resume.contact.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span>{resume.contact.email}</span>
            </div>
          )}
          {resume.contact.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{resume.contact.phone}</span>
            </div>
          )}
          {resume.contact.address && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{resume.contact.address}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-sm mt-2">
          {resume.contact.linkedin && (
            <a href={resume.contact.linkedin} className="flex items-center gap-1 hover:underline" style={{ color: colors.primary }}>
              <Linkedin className="h-3 w-3" />
              <span>{resume.contact.linkedin}</span>
            </a>
          )}
          {resume.contact.website && (
            <a href={resume.contact.website} className="flex items-center gap-1 hover:underline" style={{ color: colors.primary }}>
              <Globe className="h-3 w-3" />
              <span>{resume.contact.website}</span>
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Skills & Education */}
        <div className="col-span-1 space-y-6">
          {/* Technical Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: colors.primary }}>
                <Code className="h-4 w-4" />
                Technical Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs rounded text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resume.education.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: colors.primary }}>
                Education
              </h2>
              {resume.education.map((edu, idx) => (
                <div key={idx} className="mb-3">
                  <h3 className="font-semibold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                  <p className="text-xs text-gray-600">{edu.institution}</p>
                  {edu.graduationDate && (
                    <p className="text-xs text-gray-500">{edu.graduationDate}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {resume.certifications && resume.certifications.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: colors.primary }}>
                Certifications
              </h2>
              {resume.certifications.map((cert, idx) => (
                <div key={idx} className="mb-2">
                  <p className="font-semibold text-xs">{cert.name}</p>
                  <p className="text-xs text-gray-600">{cert.issuer}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Experience & Projects */}
        <div className="col-span-2 space-y-6">
          {/* Work Experience */}
          {resume.workExperience.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>
                Professional Experience
              </h2>
              {resume.workExperience.map((exp, idx) => (
                <div key={idx} className="mb-5">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-base">{exp.position}</h3>
                    <span className="text-xs text-gray-500">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold mb-2" style={{ color: colors.secondary }}>
                    {exp.company}
                    {exp.location && <span className="text-gray-500 font-normal"> • {exp.location}</span>}
                  </p>
                  <ul className="space-y-1">
                    {exp.responsibilities.map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 flex">
                        <span className="mr-2" style={{ color: colors.primary }}>▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>
                Projects
              </h2>
              {resume.projects.map((project, idx) => (
                <div key={idx} className="mb-4">
                  <h3 className="font-bold text-base">{project.name}</h3>
                  <p className="text-sm text-gray-700 mb-1">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: colors.accent, color: colors.text }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
