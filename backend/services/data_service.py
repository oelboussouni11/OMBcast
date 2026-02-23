import yfinance as yf
import pandas as pd
from fastapi import UploadFile
import io


def fetch_asset_data(symbol: str, period: str = "5y", interval: str = "1d"):
    """Fetch historical data from Yahoo Finance"""
    ticker = yf.Ticker(symbol)
    df = ticker.history(period=period, interval=interval)

    if df.empty:
        return None

    df = df.reset_index()
    df = df.rename(columns={
        "Date": "date",
        "Datetime": "date",
        "Open": "open",
        "High": "high",
        "Low": "low",
        "Close": "close",
        "Volume": "volume"
    })

    df["date"] = pd.to_datetime(df["date"]).dt.strftime("%Y-%m-%d %H:%M:%S")
    return df[["date", "open", "high", "low", "close", "volume"]].to_dict(orient="records")

def detect_timeframe(dates):
    """Detect timeframe from date differences"""
    if len(dates) < 2:
        return "unknown"
    
    diffs = []
    for i in range(1, min(10, len(dates))):
        d1 = pd.to_datetime(dates.iloc[i])
        d0 = pd.to_datetime(dates.iloc[i - 1])
        diff = (d1 - d0).total_seconds()
        if diff > 0:
            diffs.append(diff)
    
    if not diffs:
        return "unknown"
    
    avg = sum(diffs) / len(diffs)
    
    if avg <= 90:
        return "1m"
    elif avg <= 450:
        return "5m"
    elif avg <= 1200:
        return "15m"
    elif avg <= 5400:
        return "1h"
    elif avg <= 14400:
        return "4h"
    elif avg <= 172800:
        return "1d"
    else:
        return "1wk"
async def parse_csv_upload(file: UploadFile):
    """Parse user-uploaded CSV file — handles headers or no headers, any separator"""
    content = await file.read()
    text = content.decode("utf-8")

    # Detect separator
    first_line = text.strip().split("\n")[0]
    if "\t" in first_line:
        sep = "\t"
    elif ";" in first_line:
        sep = ";"
    else:
        sep = ","

    # Check if first row is a header
    first_vals = first_line.split(sep)
    has_header = any(v.strip().lower() in ["date", "open", "high", "low", "close", "time", "datetime"] for v in first_vals)

    if has_header:
        df = pd.read_csv(io.StringIO(text), sep=sep)
        df.columns = df.columns.str.strip().str.lower()
    else:
        # No header — assume: date, open, high, low, close, [extras...]
        df = pd.read_csv(io.StringIO(text), sep=sep, header=None)
        col_names = ["date", "open", "high", "low", "close"]
        # Name only the columns we need, ignore the rest
        for i, name in enumerate(col_names):
            if i < len(df.columns):
                df = df.rename(columns={df.columns[i]: name})

    required = {"date", "open", "high", "low", "close"}
    if not required.issubset(set(df.columns)):
        return None

    # Keep only what we need
    df = df[["date", "open", "high", "low", "close"]]
    df["open"] = pd.to_numeric(df["open"], errors="coerce")
    df["high"] = pd.to_numeric(df["high"], errors="coerce")
    df["low"] = pd.to_numeric(df["low"], errors="coerce")
    df["close"] = pd.to_numeric(df["close"], errors="coerce")
    df = df.dropna()

    timeframe = detect_timeframe(df["date"])
    
    return {"data": df.to_dict(orient="records"), "timeframe": timeframe}

