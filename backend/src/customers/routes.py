from typing import List, Optional
from datetime import datetime
from decimal import Decimal
from fastapi import APIRouter, HTTPException, Depends
from .models import Customer
from ..utils import get_db_connection
from ..auth.utils import get_current_username
from sqlite3 import DatabaseError

router = APIRouter()


@router.get("/", response_model=List[Customer], summary="Get All Customers with Aggregated Usage and Profit/Loss")
def get_customers():
    """
    Returns a list of all customers with their total consumption (`total_cons_kwh`),
    total production (`total_prod_kwh`), combined total (`combined_total`), and
    total profit/loss (`total_profit_loss`) across all timestamps.
    All values are returned as strings to preserve exact precision.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT 
                u.user_id,
                u.username,
                e.cons,
                e.prod,
                p.price
            FROM users u
            LEFT JOIN energy_usage e ON u.user_id = e.user_id
            LEFT JOIN energy_prices p ON e.price_timestamp = p.timestamp_utc
        """)

        rows = cursor.fetchall()
        conn.close()
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail="Database error occurred")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="An unexpected error occurred")

    if not rows:
        raise HTTPException(status_code=404, detail="No customers found")

    # Dictionary to store aggregated data for each customer
    customer_data = {}

    for row in rows:
        user_id = row["user_id"]
        username = row["username"]
        cons = Decimal(row["cons"]) if row["cons"] else Decimal("0.0")
        prod = Decimal(row["prod"]) if row["prod"] else Decimal("0.0")
        price = Decimal(row["price"]) if row["price"] else Decimal("0.0")

        if user_id not in customer_data:
            customer_data[user_id] = {
                "user_id": user_id,
                "username": username,
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
            "username": data["username"],
            "total_cons_kwh": str(data["total_cons_kwh"]),
            "total_prod_kwh": str(data["total_prod_kwh"]),
            "combined_total": str(data["combined_total"]),
            "total_profit_loss_eur": str(data["total_profit_loss"]),
        })

    return result


@router.get("/data", summary="Get User Data")
def get_user_data(
    current_username: str = Depends(get_current_username),
    from_timestamp: Optional[datetime] = None,
    to_timestamp: Optional[datetime] = None
):
    """
    Returns the data of the currently authenticated user.
    """

    print(from_timestamp, to_timestamp, current_username)

    rows = []
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
            SELECT
                u.username,
                p.timestamp_utc as timestamp,
                e.cons,
                e.prod,
                p.price
            FROM users u
            LEFT JOIN energy_usage e ON u.user_id = e.user_id
            LEFT JOIN energy_prices p ON e.price_timestamp = p.timestamp_utc
            WHERE u.username = ?
        """
        params = [current_username]

        if from_timestamp:
            query += " AND p.timestamp_utc >= ?"
            params.append(from_timestamp.isoformat())

        if to_timestamp:
            query += " AND p.timestamp_utc <= ?"
            params.append(to_timestamp.isoformat())

        cursor.execute(query, params)

        rows = cursor.fetchall()
        conn.close()
    except DatabaseError:
        raise HTTPException(status_code=500, detail="Database error occurred")
    except Exception:
        raise HTTPException(
            status_code=500, detail="An unexpected error occurred")

    if not rows:
        raise HTTPException(
            status_code=404, detail="No data found for the user")

    # return list of dictionaries
    return rows
