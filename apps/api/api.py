import json
import os

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Insight Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

OUTPUT_DIR = "output"


@app.get("/api/dashboard")
def get_dashboard(time_window: str = "7d", channel: str = "all"):
    """
    Serve a pre-computed dashboard payload.

    Query Parameters
    ----------------
    time_window : "24h" | "7d" | "30d"   (default: "7d")
    channel     : "all" | "chat" | "call" | "email"  (default: "all")
    """
    time_window = time_window.lower()
    channel     = channel.lower()

    filename = f"dashboard_{time_window}_{channel}.json"
    filepath = os.path.join(OUTPUT_DIR, filename)

    if not os.path.exists(filepath):
        raise HTTPException(
            status_code=404,
            detail=f"No dashboard file found for time_window='{time_window}' and channel='{channel}'. "
                   f"Valid time windows: 24h, 7d, 30d. Valid channels: all, chat, call, email."
        )

    with open(filepath, encoding="utf-8") as f:
        return json.load(f)


if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
