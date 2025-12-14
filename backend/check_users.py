import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# Connect to MongoDB
mongo_url = os.getenv('MONGO_URL')
client = MongoClient(mongo_url)
db = client['financeApp']

print("=" * 60)
print("Checking all users in database")
print("=" * 60)

users = list(db.users.find({}))
print(f"\nFound {len(users)} user(s):\n")

for idx, user in enumerate(users, 1):
    print(f"User {idx}:")
    print(f"  _id: {user.get('_id')}")
    print(f"  user_id: {user.get('user_id', 'NOT SET')}")
    print(f"  name: {user.get('name', 'NOT SET')}")
    print(f"  email: {user.get('email', 'NOT SET')}")
    print(f"  pan_card: {user.get('pan_card', 'NOT SET')}")
    print()

print("=" * 60)
print("Checking all bank accounts")
print("=" * 60)

bank_accounts = list(db.bank_accounts.find({}))
print(f"\nFound {len(bank_accounts)} bank account(s):\n")

for idx, account in enumerate(bank_accounts, 1):
    print(f"Account {idx}:")
    print(f"  _id: {account.get('_id')}")
    print(f"  user_id: {account.get('user_id')}")
    print(f"  bank_name: {account.get('bank_name')}")
    print(f"  account_number: {account.get('account_number')}")
    print(f"  balance: {account.get('balance')}")
    print(f"  pan_card: {account.get('pan_card', 'NOT SET')}")
    print()

client.close()
