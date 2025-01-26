import sqlite3
import pandas as pd

DATABASE_FILE = "../data.db"


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
        CREATE TABLE IF NOT EXISTS customers (
            user_id TEXT PRIMARY KEY,
            name TEXT NOT NULL        
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
            FOREIGN KEY (user_id) REFERENCES customers(user_id)
        );
    """)

    conn.commit()
    conn.close()


def load_csv_into_db():
    df = pd.read_csv("data.csv", dtype=str)

    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()

    # Dictionary to store data from differnt columns
    customer_data = {}

    for _, row in df.iterrows():
        timestamp_utc = row["timestamp_utc"]
        price = row["SIPX_EUR_kWh"]

        cursor.execute("""
            INSERT OR IGNORE INTO energy_prices (timestamp_utc, price)
            VALUES (?, ?)
        """, (timestamp_utc, price))

        for col in df.columns:
            if "_cons_kWh" in col or "_prod_kWh" in col:
                customer_id = col.split("_")[0]

                cursor.execute("""
                    INSERT OR IGNORE INTO customers (user_id, name)
                    VALUES (?, ?)
                """, (customer_id, f"Customer {customer_id}"))

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
