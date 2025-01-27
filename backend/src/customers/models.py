from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class Customer(BaseModel):
    user_id: int
    username: str
    total_cons_kwh: str = Field(..., description="Total consumption in kWh")
    total_prod_kwh: str = Field(..., description="Total production in kWh")
    combined_total: str = Field(...,
                                description="Combined total (production - consumption) in kWh")
    total_profit_loss_eur: str = Field(...,
                                       description="Total profit/loss in EUR")


class UserData(BaseModel):
    username: str
    timestamp: datetime
    cons: Optional[float] = Field(None, description="Consumption in kWh")
    prod: Optional[float] = Field(None, description="Production in kWh")
    price: Optional[float] = Field(None, description="Price in EUR/kWh")
