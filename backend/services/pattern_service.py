import numpy as np
from dtaidistance import dtw


def normalize_pattern(prices):
    """Convert prices to % changes — compare shape, not absolute price"""
    prices = np.array(prices, dtype=float)
    return (prices - prices[0]) / prices[0] * 100


def euclidean_distance(a, b):
    """Simple distance between two normalized patterns"""
    return np.sqrt(np.sum((a - b) ** 2))


def dtw_distance(a, b):
    """Dynamic Time Warping — handles stretched/compressed patterns"""
    return dtw.distance(a.tolist(), b.tolist())


def find_similar_patterns(
    data: list,
    selected_index: int,
    pattern_length: int,
    forecast_horizon: int = 30,
    top_k: int = 5,
    method: str = "euclidean"
):
    """
    Core engine of OMBcast.
    
    - data: list of candle dicts with 'close' prices
    - selected_index: the index the user selected (model is blind after this)
    - pattern_length: how many candles back to form the reference pattern
    - forecast_horizon: how many candles after each match to collect
    - top_k: number of best matches to return
    - method: 'euclidean' or 'dtw'
    """
    closes = np.array([c["close"] for c in data], dtype=float)

    # Extract reference pattern
    ref_start = selected_index - pattern_length
    if ref_start < 0:
        return {"error": "Not enough data before selected point"}

    ref_pattern = normalize_pattern(closes[ref_start:selected_index])

    # Scan all history BEFORE ref_start (no data leakage)
    results = []
    search_end = ref_start - pattern_length  # ensure no overlap with reference

    for i in range(0, search_end + 1):
        window = closes[i:i + pattern_length]

        if len(window) < pattern_length:
            continue

        norm_window = normalize_pattern(window)

        if method == "dtw":
            dist = dtw_distance(ref_pattern, norm_window)
        else:
            dist = euclidean_distance(ref_pattern, norm_window)

        # Collect what happened AFTER this match
        future_start = i + pattern_length
        future_end = min(future_start + forecast_horizon, ref_start)
        future_prices = closes[future_start:future_end]

        if len(future_prices) < 2:
            continue

        # Normalize future as % change from the last candle of the match
        future_normalized = ((future_prices - closes[future_start - 1]) / closes[future_start - 1] * 100).tolist()

        results.append({
            "match_start": i,
            "match_end": i + pattern_length,
            "distance": float(dist),
            "future": future_normalized,
            "future_length": len(future_normalized)
        })

    # Sort by distance and take top K
    results.sort(key=lambda x: x["distance"])
    top_matches = results[:top_k]

    return {
        "reference_start": ref_start,
        "reference_end": selected_index,
        "method": method,
        "total_matches_scanned": len(results),
        "matches": top_matches
    }

def build_prediction_cloud(matches: list):
    """
    Takes top-K matches and builds a prediction cloud.
    Returns min, max, median, p25, p75 at each future step.
    """
    if not matches:
        return {"error": "No matches to build cloud from"}

    max_len = max(m["future_length"] for m in matches)
    cloud = []

    for step in range(max_len):
        values = []
        for m in matches:
            if step < len(m["future"]):
                values.append(m["future"][step])

        if not values:
            continue

        arr = np.array(values)
        cloud.append({
            "step": step + 1,
            "min": float(np.min(arr)),
            "max": float(np.max(arr)),
            "median": float(np.median(arr)),
            "p25": float(np.percentile(arr, 25)),
            "p75": float(np.percentile(arr, 75)),
            "num_samples": len(values)
        })

    return cloud