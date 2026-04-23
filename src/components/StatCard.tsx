import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'amber' | 'slate';
}

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600' },
  green: { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600' },
  red: { bg: 'bg-red-50', icon: 'bg-red-100 text-red-600' },
  amber: { bg: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600' },
  slate: { bg: 'bg-slate-50', icon: 'bg-slate-100 text-slate-600' },
};

export default function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const colors = colorMap[color];
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-500 font-medium truncate">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colors.icon} shrink-0 ml-3`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
