# 🚀 Binance MVP - Vercel Ready

MVP sederhana untuk fetch data dari Binance tanpa CORS error.

## ✨ Features
- ✅ Fetch real-time data dari Binance
- ✅ Backend proxy (bye CORS!)
- ✅ Simple indicators (RSI, EMA)
- ✅ Siap deploy ke Vercel

## 🏃‍♂️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local
```bash
npm run dev
```

Buka: http://localhost:3000

### 3. Deploy ke Vercel

#### Option A: Via GitHub (Recommended)
1. Push repo ini ke GitHub
2. Import di Vercel: https://vercel.com/new
3. Deploy! (otomatis)

#### Option B: Via CLI
```bash
npm install -g vercel
vercel
```

## 📁 Structure

```
├── pages/
│   ├── api/
│   │   └── binance.js      # API proxy (bypass CORS)
│   └── index.html          # Frontend UI
└── package.json
```

## 🔧 Cara Kerja

1. **Frontend** hit `/api/binance?symbol=BTCUSDT`
2. **Backend proxy** fetch ke Binance API
3. **Return data** ke frontend (no CORS!)

## 🎯 API Usage

```javascript
// Fetch BTC data
fetch('/api/binance?symbol=BTCUSDT&interval=1h&limit=100')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Parameters:
- `symbol`: BTCUSDT, ETHUSDT, dll (default: BTCUSDT)
- `interval`: 1m, 5m, 15m, 1h, 4h, 1d (default: 1h)
- `limit`: 1-1000 (default: 100)

## 🔮 Next Steps (Otomasi)

Kalau mau otomasi, tinggal tambahin:
1. Vercel Cron Jobs (scheduled tasks)
2. Atau GitHub Actions (taruh hasil di repo)

Mau lanjut ke sini? 🚀
