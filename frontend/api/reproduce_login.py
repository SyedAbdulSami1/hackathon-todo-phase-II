import requests
import sys

def test_login():
    url = "http://localhost:8000/api/auth/login"
    # We'll use the credentials the user mentioned: sami2 / ssssssss
    # But first we might need to register it if it doesn't exist, 
    # though the user says they registered and it saved to DB.
    
    data = {
        "username": "sami2",
        "password": "ssssssss"
    }
    
    print(f"Attempting login to {url} with {data}")
    
    try:
        # FastAPI OAuth2PasswordRequestForm expects form data
        response = requests.post(url, data=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            print("Login successful!")
            json_data = response.json()
            print(f"User: {json_data.get('user')}")
            print(f"Token: {json_data.get('token')}")
        else:
            print("Login failed!")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login()
