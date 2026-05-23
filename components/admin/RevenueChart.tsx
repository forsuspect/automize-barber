"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/utils/format";
import styles from "./Charts.module.css";

export function RevenueChart() {
  const { appointments } = useApp();

  const data = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayLabel = d.toLocaleDateString("pt-BR", { weekday: "short" });
    const revenue = appointments
      .filter(
        (a) =>
          a.date === dateStr &&
          (a.status === "confirmado" || a.status === "completado")
      )
      .reduce((sum, a) => sum + a.price, 0);
    return { name: dayLabel, faturamento: revenue };
  });

  return (
    <div className={styles.chartCard}>
      <h3 className={styles.chartTitle}>Faturamento — últimos 7 dias</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c9a962" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#c9a962" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#4a4a4a"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#4a4a4a"
            fontSize={12}
            tickLine={false}
            tickFormatter={(v) => `R$${v}`}
          />
          <Tooltip
            contentStyle={{
              background: "#1a1a1a",
              border: "1px solid rgba(201,169,98,0.2)",
              borderRadius: "12px",
            }}
            formatter={(value) => [
              formatCurrency(Number(value)),
              "Faturamento",
            ]}
          />
          <Area
            type="monotone"
            dataKey="faturamento"
            stroke="#c9a962"
            fill="url(#goldGrad)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
