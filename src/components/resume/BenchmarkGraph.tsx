
import { ChartContainer } from "@/components/ui/chart";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <div className="w-full flex flex-col items-center my-6">
      <div className="font-semibold text-sm text-indigo-800 mb-2 text-center px-3">
        Where you stand vs. estimated <span className="font-bold">{numSimilar.toLocaleString()}</span> {numSimilar === 1 ? 'resume' : 'resumes'} in this industry
      </div>
      <div className="w-full max-w-md h-44 rounded-xl bg-indigo-50 p-2 relative z-0">
        <ChartContainer config={{
          resumes: { label: "Competitive Resumes", color: "#a78bfa" },
          user: { label: "You", color: "#d946ef" }
        }}>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={data} margin={{ 
              top: 20, 
              right: isMobile ? 10 : 20, 
              bottom: 20, 
              left: isMobile ? 10 : 20 
            }}>
              <XAxis
                dataKey="percentile"
                type="number"
                domain={[0, 100]}
                ticks={isMobile ? [0, 50, 100] : [0, 20, 40, 60, 80, 100]}
                tickFormatter={t => `${100 - t}`}
                label={{
                  value: "Percentile (Top ⟶ Bottom)",
                  position: "insideBottom",
                  offset: -5,
                  style: { fill: "#6D28D9", fontSize: isMobile ? 10 : 12 }
                }}
                stroke="#ddd"
                axisLine={false}
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ fontSize: 12, backgroundColor: "white", border: "1px solid #e2e8f0" }} 
                formatter={(_, n) => [_, n === "resumes" ? "Resumes" : "You"]}
              />
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
                  fontSize: isMobile ? 11 : 13
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
      <div className="mt-4 text-center text-xs text-indigo-700 bg-indigo-50 px-3 py-1 rounded shadow-sm max-w-md w-full z-10 relative">
        <strong>Top {formatPercentile(percentile)}%</strong> — you're outperforming nearly <strong>{Math.round((100 - percentile) / 100 * numSimilar).toLocaleString()}</strong> others!
      </div>
      {isMobile && (
        <div className="mt-2 text-xs text-center text-blue-700 bg-blue-50 px-3 py-1 rounded shadow-sm max-w-md w-full">
          Charts display better on desktop devices
        </div>
      )}
    </div>
  );
};

export default BenchmarkGraph;
