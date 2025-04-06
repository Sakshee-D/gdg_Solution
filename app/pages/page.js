'use client';

import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [emissions, setEmissions] = useState([]);
  const [company, setCompany] = useState("");
  const [emission, setEmission] = useState("");
  const [emissionDate, setEmissionDate] = useState("");
  const [source, setSource] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [category, setCategory] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchEmissions();
  }, []);

  const fetchEmissions = async () => {
    const { data } = await supabase.from("carbon_emissions").select("*");
    setEmissions(data);
  };

  const addEmission = async () => {
    if (!company || !emission || !emissionDate || !source || !fuelType || !category) {
      alert("Please fill in all fields");
      return;
    }

    await supabase.from("carbon_emissions").insert([
      {
        company_name: company,
        emission_value: emission,
        emission_date: emissionDate,
        source,
        fuel_type: fuelType,
        category,
      },
    ]);

    // Reset fields
    setCompany("");
    setEmission("");
    setEmissionDate("");
    setSource("");
    setFuelType("");
    setCategory("");

    fetchEmissions();
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
        position: "relative",
        color: "#333",
      }}
    >
      {/* Sign Out Button in Top-Right Corner */}
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

      {/* Main Content Box */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "2rem",
          borderRadius: "12px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <h1>🌍 Carbon Tracker</h1>

        <input
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={{ marginBottom: "1rem", width: "100%" }}
        />
        <input
          type="number"
          placeholder="Emission (CO2)"
          value={emission}
          onChange={(e) => setEmission(e.target.value)}
          style={{ marginBottom: "1rem", width: "100%" }}
        />
        <input
          type="date"
          value={emissionDate}
          onChange={(e) => setEmissionDate(e.target.value)}
          style={{ marginBottom: "1rem", width: "100%" }}
        />
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={{ marginBottom: "1rem", width: "100%" }}
        >
          <option value="">Select Source</option>
          <option value="Electricity">Electricity</option>
          <option value="Transport">Transport</option>
          <option value="Manufacturing">Manufacturing</option>
        </select>
        <select
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
          style={{ marginBottom: "1rem", width: "100%" }}
        >
          <option value="">Select Fuel Type</option>
          <option value="Diesel">Diesel</option>
          <option value="Petrol">Petrol</option>
          <option value="Natural Gas">Natural Gas</option>
          <option value="Coal">Coal</option>
          <option value="Renewable">Renewable</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginBottom: "1rem", width: "100%" }}
        >
          <option value="">Select Category</option>
          <option value="Scope 1">Scope 1 - Direct</option>
          <option value="Scope 2">Scope 2 - Indirect</option>
          <option value="Scope 3">Scope 3 - Value Chain</option>
        </select>

        <button onClick={addEmission} style={{ marginTop: "1rem" }}>
          Submit
        </button>

        <ul style={{ marginTop: "2rem", paddingLeft: "1rem" }}>
          {emissions.map((e) => (
            <li key={e.id} style={{ marginBottom: "1rem" }}>
              <strong>{e.company_name}</strong> — {e.emission_value} CO2
              <br />
              📅 {e.emission_date} | 🏭 {e.source} | ⛽ {e.fuel_type} | 🗂️ {e.category}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
