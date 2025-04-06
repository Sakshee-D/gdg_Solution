'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../utils/supabase';

export default function MarketScreen() {
  const [companies, setCompanies] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanyCarbonScores();
  }, []);

  const fetchCompanyCarbonScores = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('carbon_scores') // Assuming you have a table named 'carbon_scores'
      .select('company_name, carbon_score')
      .order('carbon_score', { ascending: false }) // Order by carbon score (high to low)
      .limit(10);

    if (error) {
      console.error('Error fetching company carbon scores:', error);
      setError('Failed to load company data.');
      setLoading(false);
      return;
    }

    if (data) {
      setCompanies(data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleSell = (companyName) => {
    alert(`Sell option clicked for ${companyName}`);
    // Implement your sell logic here
  };

  const handleBuy = (companyName) => {
    alert(`Buy option clicked for ${companyName}`);
    // Implement your buy logic here
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h2>Marketplace</h2>
      {loading ? (
        <p>Loading company data...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : companies.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', backgroundColor: 'white' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Company Name</th>
              <th style={tableHeaderStyle}>Carbon Score</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.company_name} style={tableRowStyle}>
                <td style={tableCellStyle}>{company.company_name}</td>
                <td style={tableCellStyle}>{company.carbon_score}</td>
                <td style={tableCellStyle}>
                  <button style={sellButtonStyle} onClick={() => handleSell(company.company_name)}>Sell</button>
                  <button style={buyButtonStyle} onClick={() => handleBuy(company.company_name)}>Buy</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No company data available.</p>
      )}
      <button onClick={() => router.back()} style={backButtonStyle}>Back to Dashboard</button>
    </div>
  );
}

const tableHeaderStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #ddd',
  textAlign: 'left',
};

const tableRowStyle = {
  borderBottom: '1px solid #eee',
};

const tableCellStyle = {
  padding: '0.75rem',
};

const sellButtonStyle = {
  backgroundColor: '#e74c3c',
  color: 'white',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginRight: '0.5rem',
};

const buyButtonStyle = {
  backgroundColor: '#27ae60',
  color: 'white',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const backButtonStyle = {
  marginTop: '2rem',
  padding: '0.75rem 1.5rem',
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};