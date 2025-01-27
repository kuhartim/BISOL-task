from fastapi import FastAPI
from src.auth import auth_router
from src.customers import customers_router

app = FastAPI(
    title="Energy Data API",
    description="An API to query energy prices, customers, and usage data.",
    version="1.0.0",
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(customers_router, prefix="/customers", tags=["customers"])
