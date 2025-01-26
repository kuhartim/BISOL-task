from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from decimal import Decimal
import sqlite3

DATABASE_FILE = "./data.db"

app = FastAPI(
    title="Energy Data API",
    description="An API to query energy prices, customers, and usage data.",
    version="1.0.0",
)


class CustomerAggregation(BaseModel):
    user_id: str
    name: str
    total_cons_kwh: str
    total_prod_kwh: str
    combined_total: str
    total_profit_loss_eur: str


def get_db_connection():
    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    return conn


@app.get("/customers", response_model=List[CustomerAggregation], summary="Get All Customers with Aggregated Usage and Profit/Loss")
def get_customers():
    """
    Returns a list of all customers with their total consumption (`total_cons_kwh`),
    total production (`total_prod_kwh`), combined total (`combined_total`), and
    total profit/loss (`total_profit_loss`) across all timestamps.
    All values are returned as strings to preserve exact precision.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            c.user_id,
            c.name,
            e.cons,
            e.prod,
            p.price
        FROM customers c
        LEFT JOIN energy_usage e ON c.user_id = e.user_id
        LEFT JOIN energy_prices p ON e.price_timestamp = p.timestamp_utc
    """)

    rows = cursor.fetchall()
    conn.close()

    # Dictionary to store aggregated data for each customer
    customer_data = {}

    for row in rows:
        user_id = row["user_id"]
        name = row["name"]
        cons = Decimal(row["cons"]) if row["cons"] else Decimal("0.0")
        prod = Decimal(row["prod"]) if row["prod"] else Decimal("0.0")
        price = Decimal(row["price"]) if row["price"] else Decimal("0.0")

        if user_id not in customer_data:
            customer_data[user_id] = {
                "user_id": user_id,
                "name": name,
                "total_cons_kwh": Decimal("0.0"),
                "total_prod_kwh": Decimal("0.0"),
                "combined_total": Decimal("0.0"),
                "total_profit_loss": Decimal("0.0")
            }

        customer_data[user_id]["total_cons_kwh"] += cons
        customer_data[user_id]["total_prod_kwh"] += prod
        customer_data[user_id]["combined_total"] += (prod - cons)
        customer_data[user_id]["total_profit_loss"] += (prod - cons) * price

    result = []
    for data in customer_data.values():
        result.append({
            "user_id": data["user_id"],
            "name": data["name"],
            "total_cons_kwh": str(data["total_cons_kwh"]),
            "total_prod_kwh": str(data["total_prod_kwh"]),
            "combined_total": str(data["combined_total"]),
            "total_profit_loss_eur": str(data["total_profit_loss"]),
        })

    return result
