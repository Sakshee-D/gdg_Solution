'use client';

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import supabase from "../utils/supabase";
import dayjs from "dayjs";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384", "#AA00FF"];

export default function EmissionDashboard() {
  const [emissions, setEmissions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [totalMonth, setTotalMonth] = useState(0);
  const [totalYear, setTotalYear] = useState(0);

  useEffect(() => {
    fetchEmissions();
  }, []);

  const fetchEmissions = async () => {
    const { data } = await supabase.from("carbon_emissions").select("*");
    if (!data) return;

    setEmissions(data);
    processDashboardData(data);
  };

  const processDashboardData = (data) => {
    const now = dayjs();
    let monthTotal = 0;
    let yearTotal = 0;

    const byMonth = {};
    const byCategory = {};
    const byCompany = {};

    data.forEach((entry) => {
      const date = dayjs(entry.emission_date);
      const monthKey = date.format("YYYY-MM");

      // Monthly
      byMonth[monthKey] = (byMonth[monthKey] || 0) + Number(entry.emission_value);

      // Category
      byCategory[entry.category] = (byCategory[entry.category] || 0) + Number(entry.emission_value);

      // Company
      byCompany[entry.company_name] = (byCompany[entry.company_name] || 0) + Number(entry.emission_value);

      // Totals
      if (date.year() === now.year()) {
        yearTotal += Number(entry.emission_value);
        if (date.month() === now.month()) {
          monthTotal += Number(entry.emission_value);
        }
      }
    });

    setMonthlyData(Object.entries(byMonth).map(([month, emissions]) => ({ month, emissions })));
    setCategoryData(Object.entries(byCategory).map(([category, value]) => ({ category, value })));
    setCompanyData(Object.entries(byCompany).map(([company, value]) => ({ company, value })));

    setTotalMonth(monthTotal);
    setTotalYear(yearTotal);
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <h2>📈 Emission Dashboard</h2>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Total Emissions This Month:</strong> {totalMonth} CO2
        <br />
        <strong>Total Emissions This Year:</strong> {totalYear} CO2
      </div>

      <h3>📅 Emissions Over Time</h3>
      <BarChart width={600} height={300} data={monthlyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="emissions" fill="#8884d8" />
      </BarChart>

      <h3>🗂️ Category Breakdown</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={categoryData}
          dataKey="value"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#82ca9d"
          label
        >
          {categoryData.map((_, index) => (
            <Cell key={`cell-cat-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <h3>🏢 Company-wise Emissions</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={companyData}
          dataKey="value"
          nameKey="company"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {companyData.map((_, index) => (
            <Cell key={`cell-comp-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <table style={{ marginTop: "1rem", width: "100%", backgroundColor: "#fff", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Company</th>
            <th style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Total Emissions (CO2)</th>
          </tr>
        </thead>
        <tbody>
          {companyData.map((c, i) => (
            <tr key={i}>
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>{c.company}</td>
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>{c.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
