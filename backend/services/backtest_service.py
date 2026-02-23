import numpy as np
import random
from services.pattern_service import find_similar_patterns, build_prediction_cloud


def run_backtest_steps(
    data: list,
    pattern_length: int = 20,
    forecast_horizon: int = 30,
    top_k: int = 5,
    method: str = "euclidean",
    step_size: int = 10,
    num_tests: int = None,
    test_all: bool = False
):
    closes = np.array([c["close"] for c in data], dtype=float)
    total = len(data)

    min_start = pattern_length * 3
    max_end = total - forecast_horizon

    all_points = list(range(min_start, max_end))

    if len(all_points) == 0:
        yield {"type": "error", "message": "Not enough data for backtest"}
        return

    if test_all:
        test_points = all_points
    elif num_tests and num_tests > 0:
        num_tests = min(num_tests, len(all_points))
        test_points = sorted(random.sample(all_points, num_tests))
    else:
        test_points = list(range(min_start, max_end, step_size))

    total_tests = len(test_points)

    if total_tests == 0:
        yield {"type": "error", "message": "Not enough data for backtest"}
        return

    results = []

    for i, test_index in enumerate(test_points):
        result = find_similar_patterns(
            data=data,
            selected_index=test_index,
            pattern_length=pattern_length,
            forecast_horizon=forecast_horizon,
            top_k=top_k,
            method=method
        )

        if "error" in result or not result["matches"]:
            progress = round((i + 1) / total_tests * 100, 1)
            yield {"type": "progress", "progress": progress, "current": i + 1, "total": total_tests}
            continue

        cloud = build_prediction_cloud(result["matches"])
        if not cloud:
            progress = round((i + 1) / total_tests * 100, 1)
            yield {"type": "progress", "progress": progress, "current": i + 1, "total": total_tests}
            continue

        base_price = closes[test_index - 1]
        actual_future = []
        for step in range(forecast_horizon):
            idx = test_index + step
            if idx >= total:
                break
            pct = (closes[idx] - base_price) / base_price * 100
            actual_future.append(pct)

        hits = 0
        total_steps = min(len(cloud), len(actual_future))

        for j in range(total_steps):
            actual = actual_future[j]
            if cloud[j]["min"] <= actual <= cloud[j]["max"]:
                hits += 1

        accuracy = hits / total_steps if total_steps > 0 else 0

        if len(cloud) > 0 and len(actual_future) > 0:
            predicted_dir = 1 if cloud[-1]["median"] > 0 else -1
            actual_dir = 1 if actual_future[-1] > 0 else -1
            direction_correct = predicted_dir == actual_dir
        else:
            direction_correct = False

        results.append({
            "test_index": test_index,
            "date": data[test_index]["date"] if "date" in data[test_index] else None,
            "matches_found": len(result["matches"]),
            "range_accuracy": round(accuracy * 100, 2),
            "direction_correct": direction_correct
        })

        progress = round((i + 1) / total_tests * 100, 1)
        yield {"type": "progress", "progress": progress, "current": i + 1, "total": total_tests}

    if not results:
        yield {"type": "error", "message": "No backtest results generated"}
        return

    avg_range_acc = np.mean([r["range_accuracy"] for r in results])
    dir_acc = np.mean([r["direction_correct"] for r in results]) * 100

    yield {
        "type": "result",
        "total_tests": len(results),
        "avg_range_accuracy": round(float(avg_range_acc), 2),
        "direction_accuracy": round(float(dir_acc), 2),
        "method": method,
        "pattern_length": pattern_length,
        "forecast_horizon": forecast_horizon,
        "details": results
    }