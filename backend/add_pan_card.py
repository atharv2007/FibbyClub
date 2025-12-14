import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# Connect to MongoDB
mongo_url = os.getenv('MONGO_URL')
client = MongoClient(mongo_url)
db = client['financeApp']

# User ID
user_id = "693d2626a878e575aaf43c0a"

print("=" * 60)
print("STEP 1: Checking current user document")
print("=" * 60)

user = db.users.find_one({"user_id": user_id})
if user:
    print(f"✓ Found user: {user.get('name', 'Unknown')}")
    print(f"Current PAN Card: {user.get('pan_card', 'NOT SET')}")
else:
    print("✗ User not found!")
    exit(1)

print("\n" + "=" * 60)
print("STEP 2: Adding PAN Card to user document")
print("=" * 60)

# Add PAN card to user document
result = db.users.update_one(
    {"user_id": user_id},
    {"$set": {"pan_card": "ABCDE1234F"}}
)

if result.modified_count > 0:
    print("✓ PAN Card added successfully!")
else:
    print("⚠ User already had this PAN Card value")

# Verify
user = db.users.find_one({"user_id": user_id})
print(f"Updated PAN Card: {user.get('pan_card')}")

print("\n" + "=" * 60)
print("STEP 3: Checking user's bank accounts")
print("=" * 60)

bank_accounts = list(db.bank_accounts.find({"user_id": user_id}))
print(f"Found {len(bank_accounts)} bank account(s)")

for idx, account in enumerate(bank_accounts, 1):
    print(f"\n  Account {idx}:")
    print(f"    Bank: {account.get('bank_name')}")
    print(f"    Account Number: {account.get('account_number')}")
    print(f"    Current PAN Link: {account.get('pan_card', 'NOT SET')}")

print("\n" + "=" * 60)
print("STEP 4: Linking PAN Card to all bank accounts")
print("=" * 60)

# Update all bank accounts with the PAN card
result = db.bank_accounts.update_many(
    {"user_id": user_id},
    {"$set": {"pan_card": "ABCDE1234F"}}
)

print(f"✓ Updated {result.modified_count} bank account(s)")

print("\n" + "=" * 60)
print("STEP 5: Verification - Final State")
print("=" * 60)

# Verify all accounts now have the PAN
bank_accounts = list(db.bank_accounts.find({"user_id": user_id}))
print(f"\nAll bank accounts now linked to PAN: ABCDE1234F")

for idx, account in enumerate(bank_accounts, 1):
    print(f"\n  Account {idx}:")
    print(f"    Bank: {account.get('bank_name')}")
    print(f"    Account Number: {account.get('account_number')}")
    print(f"    PAN Card: {account.get('pan_card', 'ERROR - NOT SET!')}")

print("\n" + "=" * 60)
print("✅ PAN CARD SETUP COMPLETE!")
print("=" * 60)

client.close()
