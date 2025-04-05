import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

export default function Home() {
  const [emissions, setEmissions] = useState([]);
  const [company, setCompany] = useState("");
  const [emission, setEmission] = useState("");

  useEffect(() => {
    fetchEmissions();
  }, []);

  const fetchEmissions = async () => {
    let { data } = await supabase.from("carbon_emissions").select("*");
    setEmissions(data);
  };

  const addEmission = async () => {
    await supabase.from("carbon_emissions").insert([{ company_name: company, emission_value: emission }]);
    fetchEmissions(); // Refresh Data
  };

  return (
    <div>
      <h1>Carbon Tracker</h1>
      <input placeholder="Company Name" onChange={(e) => setCompany(e.target.value)} />
      <input placeholder="Emission (CO2)" onChange={(e) => setEmission(e.target.value)} />
      <button onClick={addEmission}>Submit</button>
      <ul>
        {emissions.map((e) => (
          <li key={e.id}>{e.company_name}: {e.emission_value} CO2</li>
        ))}
      </ul>
    </div>
  );
}
