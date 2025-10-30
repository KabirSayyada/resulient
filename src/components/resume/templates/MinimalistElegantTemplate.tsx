import { TemplateProps } from "@/types/templateTypes";
import { applyColorScheme } from "@/utils/templateColorSchemes";

export const MinimalistElegantTemplate = ({ resume, colorScheme }: TemplateProps) => {
  const colors = applyColorScheme(colorScheme);

  return (
    <div className="bg-white p-12 max-w-4xl mx-auto font-serif text-gray-800" style={{ minHeight: '11in' }}>
      {/* Header */}
      <div className="text-center mb-12 pb-6 border-b" style={{ borderColor: colors.muted }}>
        <h1 className="text-5xl font-light mb-4 tracking-wide" style={{ color: colors.text }}>
          {resume.contact.name}
        </h1>
        <div className="flex justify-center gap-4 text-sm text-gray-600 font-sans">
          {resume.contact.email && <span>{resume.contact.email}</span>}
          {resume.contact.phone && <span>•</span>}
          {resume.contact.phone && <span>{resume.contact.phone}</span>}
          {resume.contact.address && <span>•</span>}
          {resume.contact.address && <span>{resume.contact.address}</span>}
        </div>
      </div>

      {/* Summary */}
      {resume.professionalSummary && (
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <p className="text-base text-gray-700 leading-relaxed italic">{resume.professionalSummary}</p>
        </div>
      )}

      {/* Work Experience */}
      {resume.workExperience.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-light mb-6 tracking-wide uppercase text-center" style={{ color: colors.primary }}>
            Experience
          </h2>
          {resume.workExperience.map((exp, idx) => (
            <div key={idx} className="mb-8">
              <div className="flex justify-between items-baseline mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{exp.position}</h3>
                  <p className="text-base font-sans" style={{ color: colors.secondary }}>
                    {exp.company}
                  </p>
                </div>
                <span className="text-sm text-gray-500 font-sans whitespace-nowrap ml-4">
                  {exp.startDate} — {exp.endDate || 'Present'}
                </span>
              </div>
              {exp.location && (
                <p className="text-sm text-gray-500 mb-3 font-sans">{exp.location}</p>
              )}
              <div className="space-y-2 font-sans">
                {exp.responsibilities.map((item, i) => (
                  <p key={i} className="text-sm text-gray-700 leading-relaxed pl-4">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-light mb-6 tracking-wide uppercase text-center" style={{ color: colors.primary }}>
            Education
          </h2>
          {resume.education.map((edu, idx) => (
            <div key={idx} className="mb-4 text-center">
              <h3 className="text-lg font-semibold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
              <p className="text-base font-sans" style={{ color: colors.secondary }}>
                {edu.institution}
              </p>
              {edu.graduationDate && (
                <p className="text-sm text-gray-500 font-sans mt-1">{edu.graduationDate}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-light mb-6 tracking-wide uppercase text-center" style={{ color: colors.primary }}>
            Expertise
          </h2>
          <div className="flex flex-wrap justify-center gap-3 font-sans">
            {resume.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-4 py-1 text-sm border"
                style={{ borderColor: colors.muted, color: colors.text }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {resume.achievements && resume.achievements.length > 0 && (
        <div>
          <h2 className="text-2xl font-light mb-6 tracking-wide uppercase text-center" style={{ color: colors.primary }}>
            Achievements
          </h2>
          <div className="space-y-2 font-sans max-w-2xl mx-auto">
            {resume.achievements.map((achievement, idx) => (
              <p key={idx} className="text-sm text-gray-700 leading-relaxed text-center">
                {achievement}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
