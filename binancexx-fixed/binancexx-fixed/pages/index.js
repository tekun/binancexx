import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const calculateRSI = (closes, period = 14) => {
    if (closes.length < period + 1) return null;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = closes.length - period; i < closes.length; i++) {
      const change = closes[i] - closes[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

  const calculateEMA = (closes, period) => {
    if (closes.length < period) return null;
    
    const k = 2 / (period + 1);
    let ema = closes.slice(0, period).reduce((a, b) => a + b) / period;
    
    for (let i = period; i < closes.length; i++) {
      ema = (closes[i] * k) + (ema * (1 - k));
    }
    
    return ema;
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/binance?symbol=${symbol}&interval=1h&limit=100`);
      
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      
      const candles = data.map(item => ({
        openTime: new Date(item[0]),
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5])
      }));

      const closes = candles.map(c => c.close);
      const currentPrice = closes[closes.length - 1];
      
      const rsi14 = calculateRSI(closes, 14);
      const ema9 = calculateEMA(closes, 9);
      const ema21 = calculateEMA(closes, 21);
      const ema50 = calculateEMA(closes, 50);

      const price24hAgo = closes[closes.length - 24];
      const change24h = ((currentPrice - price24hAgo) / price24hAgo * 100);

      setResults({
        symbol,
        currentPrice,
        change24h,
        indicators: { rsi14, ema9, ema21, ema50 }
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Binance MVP - Vercel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="container">
        <div className="header">
          <h1>🚀 Binance MVP - Vercel Ready</h1>
          <p>Real data via backend proxy <span className="badge">✓ CORS Fixed</span></p>
        </div>

        <div className="controls">
          <select 
            className="coin-select" 
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          >
            <option value="BTCUSDT">Bitcoin (BTC)</option>
            <option value="ETHUSDT">Ethereum (ETH)</option>
            <option value="BNBUSDT">BNB</option>
            <option value="SOLUSDT">Solana (SOL)</option>
            <option value="XRPUSDT">Ripple (XRP)</option>
          </select>

          <button className="fetch-button" onClick={fetchData} disabled={loading}>
            {loading ? '⏳ Loading...' : '🔍 Fetch Real Data'}
          </button>
        </div>

        <div id="resultsContainer">
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Fetching data from Binance...</p>
            </div>
          )}

          {error && (
            <div className="error">
              <h3>❌ Error</h3>
              <p>{error}</p>
            </div>
          )}

          {results && (
            <div className="results">
              {/* Price Info */}
              <div className="result-card">
                <h3>💰 Price Data</h3>
                <div className="data-row">
                  <span className="data-label">Symbol</span>
                  <span className="data-value">{results.symbol}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">Current Price</span>
                  <span className="data-value">${results.currentPrice.toLocaleString()}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">24h Change</span>
                  <span className={`data-value ${results.change24h >= 0 ? 'positive' : 'negative'}`}>
                    {results.change24h >= 0 ? '▲' : '▼'} {Math.abs(results.change24h).toFixed(2)}%
                  </span>
                </div>
                <div className="data-row">
                  <span className="data-label">Data Source</span>
                  <span className="data-value">Binance via Proxy ✓</span>
                </div>
              </div>

              {/* RSI */}
              <div className="result-card">
                <h3>📊 RSI Indicator</h3>
                <div className="data-row">
                  <span className="data-label">RSI (14)</span>
                  <span className="data-value">{results.indicators.rsi14?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">Status</span>
                  <span className="data-value">
                    {results.indicators.rsi14 < 30 ? '🟢 Oversold' : 
                     results.indicators.rsi14 > 70 ? '🔴 Overbought' : 
                     '🟡 Neutral'}
                  </span>
                </div>
              </div>

              {/* EMA */}
              <div className="result-card">
                <h3>📉 EMA Indicators</h3>
                <div className="data-row">
                  <span className="data-label">EMA (9)</span>
                  <span className="data-value">${results.indicators.ema9?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">EMA (21)</span>
                  <span className="data-value">${results.indicators.ema21?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">EMA (50)</span>
                  <span className="data-value">${results.indicators.ema50?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">Trend</span>
                  <span className="data-value">
                    {results.indicators.ema9 > results.indicators.ema21 && 
                     results.indicators.ema21 > results.indicators.ema50 ? 
                      '🟢 Strong Uptrend' : 
                      results.indicators.ema9 > results.indicators.ema21 ? 
                      '🟡 Uptrend' : '🔴 Downtrend'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          min-height: 100vh;
          padding: 20px;
          color: #fff;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .header h1 {
          font-size: 2.5rem;
          background: linear-gradient(to right, #f0b90b, #fcd535);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }

        .header p {
          color: #94a3b8;
          font-size: 0.9rem;
        }

        .controls {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .coin-select {
          padding: 12px 20px;
          border-radius: 10px;
          border: 2px solid #334155;
          background: rgba(30, 41, 59, 0.6);
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
        }

        .fetch-button {
          background: linear-gradient(to right, #f0b90b, #fcd535);
          color: #0f172a;
          border: none;
          padding: 12px 30px;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .fetch-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .fetch-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .results {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .result-card {
          background: rgba(30, 41, 59, 0.6);
          border: 2px solid #334155;
          border-radius: 16px;
          padding: 20px;
        }

        .result-card h3 {
          color: #f0b90b;
          margin-bottom: 15px;
          font-size: 1.2rem;
        }

        .data-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #334155;
        }

        .data-row:last-child {
          border-bottom: none;
        }

        .data-label {
          color: #94a3b8;
          font-size: 0.9rem;
        }

        .data-value {
          color: #e2e8f0;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .positive {
          color: #22c55e;
        }

        .negative {
          color: #ef4444;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #94a3b8;
        }

        .spinner {
          display: inline-block;
          width: 40px;
          height: 40px;
          border: 4px solid rgba(240, 185, 11, 0.3);
          border-top-color: #f0b90b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error {
          background: rgba(239, 68, 68, 0.15);
          border: 2px solid #ef4444;
          border-radius: 12px;
          padding: 20px;
          color: #fca5a5;
          text-align: center;
        }

        .badge {
          display: inline-block;
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid #22c55e;
          color: #22c55e;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-left: 10px;
        }
      `}</style>
    </>
  );
}
