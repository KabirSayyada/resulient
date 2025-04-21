
import { ChartContainer } from "@/components/ui/chart";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";

interface BenchmarkGraphProps {
  percentile: number; // e.g. 22 (top 22%)
  numSimilar: number; // e.g. 15000
}

const formatPercentile = (num: number) =>
  num < 1 ? "<1" : num > 99 ? ">99" : num.toString();

const createDistributionData = (numSimilar: number, userPercentile: number) => {
  // Simulate a simple bell curve distribution for resumes in the industry
  // The x-axis: percentiles (0 to 100), the y-axis: count estimates
  // User's position = 100 - percentile (since lower percentile = better)
  const data = [];
  for (let p = 0; p <= 100; p += 5) {
    // simple normal curve, peak at 50th percentile
    const peak = numSimilar / 8; // height of peak ~12.5% get highest
    const spread = 23; // how wide the curve is
    // Normal-like distribution, not precise:
    const y = Math.round(
      peak * Math.exp(-0.5 * Math.pow((p - 50) / spread, 2))
    );
    data.push({ percentile: p, resumes: y });
  }
  // User position (x on chart)
  const userP = Math.max(0, Math.min(100, 100 - userPercentile)); // graph goes left (top) to right (worst)
  return { data, userP };
};

export const BenchmarkGraph = ({
  percentile,
  numSimilar
}: BenchmarkGraphProps) => {
  const { data, userP } = createDistributionData(numSimilar, percentile);

  return (
    <div className="w-full flex flex-col items-center my-4">
      <div className="font-semibold text-sm text-indigo-800 mb-1">
        Where you stand vs. estimated <span className="font-bold">{numSimilar.toLocaleString()}</span> {numSimilar === 1 ? 'resume' : 'resumes'} in this industry
      </div>
      <div className="w-full max-w-md h-40 rounded-xl bg-indigo-50">
        <ChartContainer config={{
          resumes: { label: "Competitive Resumes", color: "#a78bfa" },
          user: { label: "You", color: "#d946ef" }
        }}>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={data}>
              <XAxis
                dataKey="percentile"
                type="number"
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                tickFormatter={t => `${100 - t}`}
                label={{
                  value: "Percentile (Top ⟶ Bottom)",
                  position: "insideBottom",
                  offset: -6,
                  style: { fill: "#6D28D9", fontSize: 13 }
                }}
                stroke="#ddd"
                axisLine={false}
              />
              <YAxis hide />
              <Tooltip contentStyle={{ fontSize: 12 }} formatter={(_, n) => [_, n === "resumes" ? "Resumes" : "You"]}/>
              <Area
                type="monotone"
                dataKey="resumes"
                stroke="#a78bfa"
                fill="url(#benchmark-gradient)"
                fillOpacity={1}
              />
              <ReferenceLine
                x={userP}
                stroke="#d946ef"
                strokeDasharray="6 2"
                label={{
                  value: "You",
                  position: "top",
                  fill: "#d946ef",
                  fontWeight: 600,
                  fontSize: 13
                }}
              />
              <defs>
                <linearGradient id="benchmark-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.7}/>
                  <stop offset="90%" stopColor="#f3e8ff" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      <div className="mt-0.5 text-xs text-indigo-700">
        <strong>Top {formatPercentile(percentile)}%</strong> — you're outperforming nearly <strong>{Math.round((100 - percentile) / 100 * numSimilar).toLocaleString()}</strong> others!
      </div>
    </div>
  );
};

export default BenchmarkGraph;
