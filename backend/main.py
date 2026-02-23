from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import json
from services.data_service import fetch_asset_data, parse_csv_upload
from services.pattern_service import find_similar_patterns, build_prediction_cloud
from services.backtest_service import run_backtest_steps

app = FastAPI(title="OMBcast API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to OMBcast API"}

@app.get("/api/data/{symbol}")
def get_asset_data(
    symbol: str,
    period: str = Query("5y"),
    interval: str = Query("1d")
):
    data = fetch_asset_data(symbol, period, interval)
    if data is None:
        return {"error": "Symbol not found or no data available"}
    return {"symbol": symbol, "count": len(data), "data": data}

@app.post("/api/upload")
async def upload_csv(file: UploadFile = File(...)):
    result = await parse_csv_upload(file)
    if result is None:
        return {"error": "Invalid CSV. Required columns: date, open, high, low, close"}
    return {"count": len(result["data"]), "data": result["data"], "timeframe": result["timeframe"]}

@app.post("/api/pattern")
def pattern_match(payload: dict):
    data = payload.get("data", [])
    selected_index = payload.get("selected_index")
    pattern_length = payload.get("pattern_length", 20)
    forecast_horizon = payload.get("forecast_horizon", 30)
    top_k = payload.get("top_k", 5)
    method = payload.get("method", "euclidean")

    if not data or selected_index is None:
        return {"error": "Missing data or selected_index"}

    result = find_similar_patterns(
        data=data,
        selected_index=selected_index,
        pattern_length=pattern_length,
        forecast_horizon=forecast_horizon,
        top_k=top_k,
        method=method
    )

    if "error" not in result:
        result["cloud"] = build_prediction_cloud(result["matches"])

    return result

@app.post("/api/backtest")
def backtest(payload: dict):
    data = payload.get("data", [])
    pattern_length = payload.get("pattern_length", 20)
    forecast_horizon = payload.get("forecast_horizon", 30)
    top_k = payload.get("top_k", 5)
    method = payload.get("method", "euclidean")
    step_size = payload.get("step_size", 10)
    num_tests = payload.get("num_tests", None)
    test_all = payload.get("test_all", False)

    if not data:
        return {"error": "Missing data"}

    def stream():
        for update in run_backtest_steps(
            data=data,
            pattern_length=pattern_length,
            forecast_horizon=forecast_horizon,
            top_k=top_k,
            method=method,
            step_size=step_size,
            num_tests=num_tests,
            test_all=test_all
        ):
            yield f"data: {json.dumps(update)}\n\n"

    return StreamingResponse(stream(), media_type="text/event-stream")