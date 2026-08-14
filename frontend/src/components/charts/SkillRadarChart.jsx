import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';

export default function SkillRadarChart({ data = [] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 24, right: 36, bottom: 24, left: 36 }}>
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
          <Radar dataKey="score" name="Skill Score" stroke="#2563EB" fill="#2563EB" fillOpacity={0.18} strokeWidth={3} />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
