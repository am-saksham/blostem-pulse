from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from ..core.security import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def get_current_user_role(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None or role is None:
            raise credentials_exception
        return role
    except JWTError:
        raise credentials_exception

def require_sales_manager(role: str = Depends(get_current_user_role)):
    if role != "sales_manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation not permitted. Sales Manager role required."
        )
    return role

# Simple primitive rate limiter logic using dict (ideally Redis for enterprise)
from time import time
RATE_LIMIT_STORE = {}

async def rate_limit(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    current_time = time()
    
    if client_ip not in RATE_LIMIT_STORE:
        RATE_LIMIT_STORE[client_ip] = []
        
    requests = RATE_LIMIT_STORE[client_ip]
    requests = [t for t in requests if t > current_time - 60] # within last 60s
    
    if len(requests) >= 100: # 100 requests per minute
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded"
        )
        
    requests.append(current_time)
    RATE_LIMIT_STORE[client_ip] = requests
