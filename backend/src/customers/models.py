from pydantic import BaseModel


class Customer(BaseModel):
    user_id: str
    username: str
    total_cons_kwh: str
    total_prod_kwh: str
    combined_total: str
    total_profit_loss_eur: str
