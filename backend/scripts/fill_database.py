import sqlite3
import pandas as pd
import os
from passlib.context import CryptContext
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_FILE = os.path.join(BASE_DIR, "..\data.db")
DATA_FILE = os.path.join(BASE_DIR, "data.csv")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def initialize_db():
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS energy_prices (
            timestamp_utc TEXT PRIMARY KEY,
            price TEXT NOT NULL
        );
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            hashed_password TEXT NOT NULL    
        );
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS energy_usage (
            price_timestamp TEXT,
            user_id TEXT,
            cons TEXT NOT NULL,
            prod TEXT NOT NULL,
            PRIMARY KEY (price_timestamp, user_id),
            FOREIGN KEY (price_timestamp) REFERENCES energy_prices(timestamp_utc),
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        );
    """)

    conn.commit()
    conn.close()


def load_csv_into_db():
    df = pd.read_csv(DATA_FILE, dtype=str)

    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()

    # Dictionary to store data from differnt columns
    customer_data = {}

    for _, row in df.iterrows():
        timestamp_utc = row["timestamp_utc"]
        price = row["SIPX_EUR_kWh"]

        # Convert timestamp to ISO 8601 format
        timestamp_utc = datetime.fromisoformat(timestamp_utc).isoformat()

        cursor.execute("""
            INSERT OR IGNORE INTO energy_prices (timestamp_utc, price)
            VALUES (?, ?)
        """, (timestamp_utc, price))

        for col in df.columns:
            if "_cons_kWh" in col or "_prod_kWh" in col:
                customer_id = col.split("_")[0]

                # Check if user already exists
                cursor.execute("""
                    SELECT 1 FROM users WHERE user_id = ?
                """, (customer_id,))
                user_exists = cursor.fetchone()

                if not user_exists:
                    cursor.execute("""
                        INSERT INTO users (user_id, username, hashed_password)
                        VALUES (?, ?, ?)
                    """, (customer_id, customer_id, hash_password("password")))

                # Initialize the dictionary if data for the timestamp is not present
                if timestamp_utc not in customer_data:
                    customer_data[timestamp_utc] = {}
                if customer_id not in customer_data[timestamp_utc]:
                    customer_data[timestamp_utc][customer_id] = {
                        "cons": "0.0", "prod": "0.0"}

                # Update cons and prod values
                if "_cons_kWh" in col:
                    customer_data[timestamp_utc][customer_id]["cons"] = row[col]
                elif "_prod_kWh" in col:
                    customer_data[timestamp_utc][customer_id]["prod"] = row[col]

    # Insert data into the database
    for timestamp_utc, customers in customer_data.items():
        for customer_id, values in customers.items():
            cursor.execute("""
                INSERT OR REPLACE INTO energy_usage (price_timestamp, user_id, cons, prod)
                VALUES (?, ?, ?, ?)
            """, (timestamp_utc, customer_id, values["cons"], values["prod"]))

    conn.commit()
    conn.close()


initialize_db()
load_csv_into_db()
