from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from .utils import verify_password, create_access_token
from ..utils import get_db_connection
from .models import UserLogin, Token

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/login", response_model=Token, summary="User Login", description="Authenticate a user and return an access token.")
def login(user: UserLogin):
    """
    Authenticates a user and returns an access token.

    - **username**: The username of the user.
    - **password**: The password of the user.

    Returns:
    - **access_token**: A JWT token for authenticated requests.
    - **token_type**: The type of token (e.g., "bearer").
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Fetch user from the database
        cursor.execute("SELECT * FROM users WHERE username = ?",
                       (user.username,))
        db_user = cursor.fetchone()

        # Verify user and password
        if not db_user or not verify_password(user.password, db_user["hashed_password"]):
            raise HTTPException(
                status_code=400, detail="Incorrect username or password"
            )

        # Create access token
        access_token = create_access_token(data={"sub": user.username})
        return {"access_token": access_token, "token_type": "bearer"}

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500, detail="An unexpected error occurred during login.")

    finally:
        conn.close()
