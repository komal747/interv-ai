import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import { TrendingUp, Target, Award, Clock } from "lucide-react";

interface ReportsProps {
  history: any[];
}

export function Reports({ history }: ReportsProps) {
  // Prepare data for charts
  const chartData = history.map((item, index) => ({
    name: `S${index + 1}`,
    score: item.score,
    date: new Date(item.date).toLocaleDateString(),
  }));

  const averageScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length) 
    : 0;

  const stats = [
    { label: "Average Score", value: `${averageScore}%`, icon: Target, color: "text-accent" },
    { label: "Total Sessions", value: history.length, icon: TrendingUp, color: "text-success" },
    { label: "Highest Score", value: `${history.length > 0 ? Math.max(...history.map(h => h.score)) : 0}%`, icon: Award, color: "text-yellow-500" },
    { label: "Practice Time", value: `${history.length * 15}m`, icon: Clock, color: "text-purple-500" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-6 py-32"
    >
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-text-main mb-2">Performance Reports</h1>
        <p className="text-text-muted">Detailed analytics of your interview journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bento-card">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-2 rounded-lg bg-bg border border-border`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{stat.label}</p>
            </div>
            <p className="text-3xl font-bold text-text-main">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bento-card h-[400px]">
          <h3 className="text-lg font-bold text-text-main mb-8">Score Progression</h3>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1e1e1e", border: "1px solid #333", borderRadius: "12px" }}
                itemStyle={{ color: "#7c3aed" }}
              />
              <Area type="monotone" dataKey="score" stroke="#7c3aed" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bento-card h-[400px]">
          <h3 className="text-lg font-bold text-text-main mb-8">Session Distribution</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1e1e1e", border: "1px solid #333", borderRadius: "12px" }}
                cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }}
              />
              <Bar dataKey="score" fill="#7c3aed" radius={[6, 6, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bento-card">
        <h3 className="text-lg font-bold text-text-main mb-6">Skill Breakdown</h3>
        <div className="space-y-6">
          {[
            { skill: "Technical Accuracy", level: 85 },
            { skill: "Communication", level: 72 },
            { skill: "Problem Solving", level: 90 },
            { skill: "Confidence", level: 65 },
          ].map((s, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-text-main">{s.skill}</span>
                <span className="text-accent">{s.level}%</span>
              </div>
              <div className="h-2 w-full bg-bg border border-border rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${s.level}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="h-full bg-accent"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
