from passlib.context import CryptContext

try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    test_pass = "mypassword123"
    hashed = pwd_context.hash(test_pass)
    print(f"Hashing successful: {hashed}")
    
    verified = pwd_context.verify(test_pass, hashed)
    print(f"Verification successful: {verified}")
except Exception as e:
    print(f"ERROR during hashing: {e}")
