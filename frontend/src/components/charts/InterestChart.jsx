import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = ['#2563EB', '#0EA5E9', '#22C55E', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#64748B'];

export default function InterestChart({ data = [], type = 'pie' }) {
  if (type === 'bar') {
    return (
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} interval={0} angle={-18} textAnchor="end" height={70} />
            <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#0EA5E9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3}>
            {data.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
