"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function WeeklyChart({
  data,
}: {
  data: { semana: string; contactos: number; respuestas: number; reuniones: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorContactos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorRespuestas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorReuniones" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4d" />
        <XAxis dataKey="semana" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#0d1428", border: "1px solid #1e2d4d", borderRadius: "8px", color: "#e2e8f0" }}
          cursor={{ stroke: "#253660" }}
        />
        <Area type="monotone" dataKey="contactos" stroke="#3b82f6" strokeWidth={2} fill="url(#colorContactos)" />
        <Area type="monotone" dataKey="respuestas" stroke="#10b981" strokeWidth={2} fill="url(#colorRespuestas)" />
        <Area type="monotone" dataKey="reuniones" stroke="#a855f7" strokeWidth={2} fill="url(#colorReuniones)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
