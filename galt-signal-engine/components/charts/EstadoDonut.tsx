"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface DatumEstado {
  name: string;
  value: number;
  color: string;
}

export function EstadoDonut({ data }: { data: DatumEstado[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            isAnimationActive={false}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid var(--color-ink-200)", fontSize: 12 }}
            formatter={(value, name) => [`${value} empresas`, String(name)]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
