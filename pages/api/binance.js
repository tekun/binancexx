// API Proxy untuk Binance - bypass CORS
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { symbol = 'BTCUSDT', interval = '1h', limit = 100 } = req.query;

  try {
    // Fetch dari Binance
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Binance API error');
    }

    const data = await response.json();
    
    // Return data
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch data from Binance' });
  }
}
