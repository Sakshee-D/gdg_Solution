'use client';

import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { useRouter } from "next/navigation";
import EmissionDashboard from "../EmissonDashboard";

export default function Home() {
  const [emissions, setEmissions] = useState([]);
  const [company, setCompany] = useState("");
  const [emissionDate, setEmissionDate] = useState("");
  const [entries, setEntries] = useState({
    Electricity: { emission: "", fuelType: "", category: "" },
    Transport: { emission: "", fuelType: "", category: "" },
    Manufacturing: { emission: "", fuelType: "", category: "" },
  });

  const router = useRouter();

  const fetchEmissions = async (filterCompany) => {
    const { data } = await supabase.from("carbon_emissions").select("*");
    if (data) {
      if (filterCompany) {
        const filtered = data.filter((e) => e.name === filterCompany);
        setEmissions(filtered);
      } else {
        setEmissions(data);
      }
    }
  };


  const addEmission = async () => {
    if (!company || !emissionDate) {
      alert("Please fill company name and emission date");
      return;
    }

    const records = Object.entries(entries)
      .filter(([_, values]) => values.emission && values.fuelType && values.category)
      .map(([source, values]) => ({
        name: company,
        emission_date: emissionDate,
        source,
        emission_value: values.emission,
        fuel_type: values.fuelType,
        category: values.category,
      }));

    if (records.length === 0) {
      alert("Please fill in at least one complete emission entry.");
      return;
    }

    await supabase.from("carbon_emissions").insert(records);
    fetchEmissions(company); // Filter by company just added

    setCompany("");
    setEmissionDate("");
    setEntries({
      Electricity: { emission: "", fuelType: "", category: "" },
      Transport: { emission: "", fuelType: "", category: "" },
      Manufacturing: { emission: "", fuelType: "", category: "" },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div
      style={{
        backgroundImage: "url('/forest.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "2rem",
        color: "#333",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "130px", /* Adjusted to make space for the text */
          zIndex: 1000,
          color: "#555",
          fontSize: "0.9rem",
        }}
      >
        Wait for 2 mins
      </div>
      <button
        onClick={signOut}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          backgroundColor: "#e74c3c",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        Sign Out
      </button>

      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "2rem",
          borderRadius: "16px",
          maxWidth: "700px",
          margin: "0 auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>🌍 Carbon Emission Tracker</h1>

        <input
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={inputStyle}
        />

        <input
          type="date"
          value={emissionDate}
          onChange={(e) => setEmissionDate(e.target.value)}
          style={inputStyle}
        />

        {["Electricity", "Transport", "Manufacturing"].map((source) => (
          <div
            key={source}
            style={{
              marginTop: "2rem",
              padding: "1rem",
              backgroundColor: "#f8f9fa",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "#2c3e50" }}>{source} Emissions</h3>

            <input
              type="number"
              placeholder={`Emission from ${source} (CO2)`}
              value={entries[source].emission}
              onChange={(e) =>
                setEntries((prev) => ({
                  ...prev,
                  [source]: { ...prev[source], emission: e.target.value },
                }))
              }
              style={inputStyle}
            />

            <select
              value={entries[source].fuelType}
              onChange={(e) =>
                setEntries((prev) => ({
                  ...prev,
                  [source]: { ...prev[source], fuelType: e.target.value },
                }))
              }
              style={inputStyle}
            >
              <option value="">Select Fuel Type</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="Natural Gas">Natural Gas</option>
              <option value="Coal">Coal</option>
              <option value="Renewable">Renewable</option>
            </select>

            <select
              value={entries[source].category}
              onChange={(e) =>
                setEntries((prev) => ({
                  ...prev,
                  [source]: { ...prev[source], category: e.target.value },
                }))
              }
              style={inputStyle}
            >
              <option value="">Select Category</option>
              <option value="Scope 1">Scope 1 - Direct</option>
              <option value="Scope 2">Scope 2 - Indirect</option>
              <option value="Scope 3">Scope 3 - Value Chain</option>
            </select>
          </div>
        ))}

        <button
          onClick={addEmission}
          style={{
            marginTop: "2rem",
            width: "100%",
            backgroundColor: "#27ae60",
            color: "white",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Submit Emissions
        </button>

        <button
          onClick={() => router.push("/suggestions")}
          style={{
            backgroundColor: "#2980b9",
            color: "white",
            padding: "10px 20px",
            borderRadius: "6px",
            marginTop: "20px",
            width: "100%",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          View Emission Suggestions
        </button>


        <ul style={{ marginTop: "2rem", paddingLeft: "1rem" }}>
          {emissions.map((e) => (
            <li key={e.id} style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
              <strong>{e.name}</strong> — {e.emission_value} CO2<br />
              📅 {e.emission_date} | 🏭 {e.source} | ⛽ {e.fuel_type} | 🗂️ {e.category}
            </li>
          ))}
        </ul>
      </div>

      <EmissionDashboard />
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};
