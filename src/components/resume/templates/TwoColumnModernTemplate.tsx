import { TemplateProps } from "@/types/templateTypes";
import { applyColorScheme } from "@/utils/templateColorSchemes";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award } from "lucide-react";

export const TwoColumnModernTemplate = ({ resume, colorScheme }: TemplateProps) => {
  const colors = applyColorScheme(colorScheme);

  return (
    <div className="bg-white flex max-w-4xl mx-auto" style={{ minHeight: '11in' }}>
      {/* Left Sidebar */}
      <div className="w-1/3 p-6 text-white" style={{ backgroundColor: colors.primary }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">{resume.contact.name}</h1>
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h2 className="text-sm font-bold mb-3 uppercase tracking-wider border-b border-white/30 pb-1">
            Contact
          </h2>
          <div className="space-y-2 text-xs">
            {resume.contact.email && (
              <div className="flex items-start gap-2">
                <Mail className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span className="break-all">{resume.contact.email}</span>
              </div>
            )}
            {resume.contact.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 flex-shrink-0" />
                <span>{resume.contact.phone}</span>
              </div>
            )}
            {resume.contact.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span>{resume.contact.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold mb-3 uppercase tracking-wider border-b border-white/30 pb-1">
              Skills
            </h2>
            <div className="space-y-2">
              {resume.skills.slice(0, 8).map((skill, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span>{skill}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div className="bg-white rounded-full h-1" style={{ width: '85%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold mb-3 uppercase tracking-wider border-b border-white/30 pb-1 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </h2>
            {resume.education.map((edu, idx) => (
              <div key={idx} className="mb-3 text-xs">
                <p className="font-semibold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                <p className="opacity-90">{edu.institution}</p>
                {edu.graduationDate && (
                  <p className="opacity-75 text-[10px] mt-1">{edu.graduationDate}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {resume.certifications && resume.certifications.length > 0 && (
          <div>
            <h2 className="text-sm font-bold mb-3 uppercase tracking-wider border-b border-white/30 pb-1 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certifications
            </h2>
            {resume.certifications.map((cert, idx) => (
              <div key={idx} className="mb-2 text-xs">
                <p className="font-semibold">{cert.name}</p>
                <p className="opacity-75 text-[10px]">{cert.issuer}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Main Content */}
      <div className="flex-1 p-8">
        {/* Summary */}
        {resume.professionalSummary && (
          <div className="mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">{resume.professionalSummary}</p>
          </div>
        )}

        {/* Work Experience */}
        {resume.workExperience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
              <Briefcase className="h-5 w-5" />
              Professional Experience
            </h2>
              {resume.workExperience.map((exp, idx) => (
                <div key={idx} className="mb-5 relative pl-4 border-l-2" style={{ borderColor: colors.accent }}>
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-base">{exp.position}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
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
                        <span className="mr-2" style={{ color: colors.primary }}>•</span>
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
                <p className="text-sm text-gray-700">{project.description}</p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: colors.accent, color: colors.text }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {resume.achievements && resume.achievements.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-3" style={{ color: colors.primary }}>
              Key Achievements
            </h2>
            <ul className="space-y-1">
              {resume.achievements.map((achievement, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex">
                  <span className="mr-2" style={{ color: colors.primary }}>★</span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
