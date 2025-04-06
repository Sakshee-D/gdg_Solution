'use client';

import { useEffect, useState } from "react";
import { getEmissionAdvice } from "../../utils/gemini"; // go up one level
import supabase from "../../utils/supabase";

export default function SuggestionPage() {
  const [emissions, setEmissions] = useState([]);
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmissions = async () => {
      const { data } = await supabase.from("carbon_emissions").select("*");
      setEmissions(data || []);
    };

    fetchEmissions();
  }, []);

  useEffect(() => {
    const fetchAdvice = async () => {
      if (emissions.length === 0) return;

      try {
        const result = await getEmissionAdvice(emissions);
        setAdvice(result);
      } catch (err) {
        console.error("Gemini Error:", err);
        setAdvice("Failed to get advice.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();
  }, [emissions]);

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h2>🌱 Emission Suggestions</h2>
      {loading ? (
        <p>Loading Gemini advice...</p>
      ) : (
        <pre style={{ whiteSpace: "pre-wrap", background: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
          {advice}
        </pre>
      )}
    </div>
  );
}
