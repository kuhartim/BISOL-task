from pydantic import BaseModel


class User(BaseModel):
    user_id: str
    username: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserInDB(User):
    hashed_password: str


class Token(BaseModel):
    access_token: str
    token_type: str
