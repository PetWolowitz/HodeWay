from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """
    Application settings.
    Loads environment variables with type checking using Pydantic.
    """
    #Project name
    PROJECT_NAME: str = "HodeWay"

    # Database settings 
    DATABASE_URL: str

    # JWT settings 
    SECRET_KEY: str
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # API settings 
    API_V1_STR: str = '/api/v1'

    class Config:
        env_file = ".env"
        

@lru_cache()
def get_settings() -> Settings:
    """
    Returns cached settings instance to avoid loading .env file on each request
    """
    return Settings()

settings = get_settings()