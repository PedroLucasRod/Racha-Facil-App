from jose import jwt

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwiZXhwIjoxNzg2NTM5MzAwfQ.IJ56KviEjyDekPGO3r9NgVnPITax3gKYP16FzOh3tvg"

header = jwt.get_unverified_header(token)
payload = jwt.get_unverified_claims(token)

print("HEADER")
print(header)

print("\nPAYLOAD")
print(payload)