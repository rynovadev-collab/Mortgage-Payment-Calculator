"use client";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  calculateMortgageScenario,
  formatMortgageDuration,
} from "@/utils/mortgageEngine";
const gbp = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);
const precise = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
function payment(principal: number, annualRate: number, months: number) {
  const r = annualRate / 1200;
  if (!r) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}
function Field({
  label,
  value,
  set,
  min = 0,
  max = 10000000,
  step = 1,
  suffix = "",
}: {
  label: string;
  value: number;
  set: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold mb-2">{label}</span>
      <div className="flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden">
        <input
          className="w-full px-4 py-3 outline-none focus:ring-2 focus:ring-teal"
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => set(Number(e.target.value))}
        />
        {suffix && <span className="pr-4 text-slate-500">{suffix}</span>}
      </div>
    </label>
  );
}
export default function MortgageTool() {
  const [amount, setAmount] = useState(250000),
    [rate, setRate] = useState(4),
    [years, setYears] = useState(30),
    [extra, setExtra] = useState(200),
    [lump, setLump] = useState(0),
    [showSchedule, setShowSchedule] = useState(false);
  const valid =
    Number.isFinite(amount) &&
    amount > 0 &&
    amount <= 100000000 &&
    rate >= 0 &&
    rate <= 50 &&
    years >= 1 &&
    years <= 50 &&
    extra >= 0 &&
    lump >= 0 &&
    lump <= amount;
  const results = useMemo(() => {
    if (!valid) return null;
    const months = Math.round(years * 12),
      basePayment = payment(amount, rate, months);
    const base = calculateMortgageScenario({
      mortgageAmount: amount,
      annualRate: rate,
      termMonths: months,
      monthlyPayment: basePayment,
    });
    const over = calculateMortgageScenario({
      mortgageAmount: amount,
      annualRate: rate,
      termMonths: months,
      monthlyPayment: basePayment,
      monthlyOverpayment: extra,
      lumpSum: lump,
    });
    return { basePayment, base, over };
  }, [amount, rate, years, extra, lump, valid]);
  const chart = useMemo(() => {
    if (!results) return [];
    const a = results.base.schedule,
      b = results.over.schedule;
    const points = [];
    for (let m = 0; m <= a.length; m += Math.max(1, Math.ceil(a.length / 60))) {
      points.push({
        year: Math.round((m / 12) * 10) / 10,
        standard: m === 0 ? amount : (a[m - 1]?.balance ?? 0),
        overpayment: m === 0 ? amount - lump : (b[m - 1]?.balance ?? 0),
      });
    }
    if (
      points[points.length - 1]?.year !==
      Math.round((a.length / 12) * 10) / 10
    )
      points.push({
        year: Math.round((a.length / 12) * 10) / 10,
        standard: 0,
        overpayment: 0,
      });
    return points;
  }, [results, amount, lump]);
  const totals = useMemo(() => {
    if (!results) return [];
    let principal = 0,
      interest = 0;
    return results.base.schedule
      .filter((_, i) => i % 3 === 0 || i === results.base.schedule.length - 1)
      .map((r) => {
        principal = amount - r.balance;
        interest = results.base.schedule
          .slice(0, r.month)
          .reduce((s, x) => s + x.interest, 0);
        return {
          year: Math.round((r.month / 12) * 10) / 10,
          principal,
          interest,
        };
      });
  }, [results, amount]);
  return (
    <section id="calculator" className="max-w-6xl mx-auto px-5 -mt-5 relative">
      <div className="grid lg:grid-cols-[350px_1fr] gap-6">
        <div className="bg-white rounded-2xl shadow-lg border p-6 h-fit">
          <h2 className="text-xl font-extrabold mb-5">Your mortgage details</h2>
          <div className="space-y-5">
            <Field
              label="Mortgage amount (£)"
              value={amount}
              set={setAmount}
              step={1000}
            />
            <Field
              label="Annual interest rate (%)"
              value={rate}
              set={setRate}
              step={0.1}
              max={50}
            />
            <Field
              label="Mortgage term (years)"
              value={years}
              set={setYears}
              max={50}
            />
            <div className="border-t pt-5">
              <p className="font-bold mb-4">Optional overpayments</p>
              <div className="space-y-5">
                <Field
                  label="Extra monthly payment (£)"
                  value={extra}
                  set={setExtra}
                  step={25}
                />
                <Field
                  label="One-off lump sum (£)"
                  value={lump}
                  set={setLump}
                  step={1000}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-5">
          {!results ? (
            <div className="bg-white p-6 rounded-xl border text-red-700">
              Enter valid values: positive mortgage amount, interest rate 0–50%,
              term 1–50 years and a lump sum no larger than the mortgage
              balance.
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow-lg border p-6">
                <p className="text-sm font-semibold text-slate-600">
                  Estimated monthly mortgage repayment
                </p>
                <p className="text-4xl md:text-5xl font-extrabold text-navy mt-2">
                  {precise(results.basePayment)}
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Standard capital-and-interest repayment, excluding
                  overpayments
                </p>
                <div className="grid sm:grid-cols-3 gap-4 mt-7">
                  {[
                    {
                      label: "Total interest",
                      value: gbp(results.base.totalInterest),
                    },
                    {
                      label: "Total repayments",
                      value: gbp(results.base.totalPaid),
                    },
                    {
                      label: "Mortgage term",
                      value: formatMortgageDuration(results.base.months),
                    },
                  ].map((x) => (
                    <div className="bg-slate-50 p-4 rounded-xl" key={x.label}>
                      <p className="text-xs text-slate-600">{x.label}</p>
                      <p className="font-extrabold text-xl mt-1">{x.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="font-extrabold text-xl">
                  Your overpayment comparison
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Assumes the original monthly payment stays the same after the
                  lump sum
                </p>
                <div className="grid sm:grid-cols-3 gap-4 mt-5">
                  {[
                    {
                      label: "Interest saved",
                      value: gbp(
                        Math.max(
                          0,
                          results.base.totalInterest -
                            results.over.totalInterest,
                        ),
                      ),
                    },
                    {
                      label: "Time saved",
                      value: formatMortgageDuration(
                        Math.max(0, results.base.months - results.over.months),
                      ),
                    },
                    {
                      label: "Monthly payment including extra",
                      value: precise(results.basePayment + extra),
                    },
                  ].map((x) => (
                    <div className="rounded-xl bg-cyan-50 p-4" key={x.label}>
                      <p className="text-xs text-slate-700">{x.label}</p>
                      <p className="font-extrabold text-lg mt-1 text-navy">
                        {x.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="font-extrabold text-xl mb-4">
                  Remaining mortgage balance
                </h2>
                <div
                  className="h-72"
                  aria-label="Mortgage balance comparison chart"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="year"
                        label={{
                          value: "Years",
                          position: "insideBottom",
                          offset: -5,
                        }}
                      />
                      <YAxis
                        tickFormatter={(v) => `£${Math.round(v / 1000)}k`}
                        width={65}
                      />
                      <Tooltip formatter={(v) => gbp(Number(v))} />
                      <Legend verticalAlign="top" />
                      <Line
                        type="monotone"
                        dataKey="standard"
                        name="Standard"
                        stroke="#0f2e4d"
                        dot={false}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="overpayment"
                        name="With overpayments"
                        stroke="#0891a5"
                        dot={false}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="font-extrabold text-xl mb-4">
                  Principal repaid vs interest paid
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={totals}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis
                        tickFormatter={(v) => `£${Math.round(v / 1000)}k`}
                        width={65}
                      />
                      <Tooltip formatter={(v) => gbp(Number(v))} />
                      <Legend />
                      <Area
                        dataKey="principal"
                        name="Principal repaid"
                        stroke="#0f2e4d"
                        fill="#0f2e4d"
                        fillOpacity={0.25}
                      />
                      <Area
                        dataKey="interest"
                        name="Interest paid"
                        stroke="#0891a5"
                        fill="#0891a5"
                        fillOpacity={0.25}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white rounded-2xl border p-6">
                <button
                  className="font-bold text-teal underline"
                  onClick={() => setShowSchedule(!showSchedule)}
                  aria-expanded={showSchedule}
                >
                  {showSchedule ? "Hide" : "Show"} amortisation schedule
                </button>
                {showSchedule && (
                  <div className="overflow-x-auto mt-5 max-h-96 overflow-y-auto">
                    <table className="w-full text-sm text-right">
                      <thead className="sticky top-0 bg-slate-100">
                        <tr>
                          {[
                            "Month",
                            "Payment",
                            "Interest",
                            "Principal",
                            "Balance",
                          ].map((h) => (
                            <th className="p-2" key={h}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.over.schedule.map((r) => (
                          <tr key={r.month} className="border-b">
                            <td className="p-2">{r.month}</td>
                            <td className="p-2">{precise(r.payment)}</td>
                            <td className="p-2">{precise(r.interest)}</td>
                            <td className="p-2">{precise(r.principal)}</td>
                            <td className="p-2">{precise(r.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
