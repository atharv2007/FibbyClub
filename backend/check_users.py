import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

# Connect to MongoDB
mongo_url = os.getenv('MONGO_URL')
db_name = os.getenv('DB_NAME', 'test_database')
client = MongoClient(mongo_url)
db = client[db_name]
print(f"Connected to MongoDB database: {db_name}\n")

print("=" * 60)
print("Checking all users in database")
print("=" * 60)

# Also check with the specific ObjectId
specific_user_id = "693d2626a878e575aaf43c0a"
print(f"\nSearching for user with _id as string: {specific_user_id}")
user_by_str = db.users.find_one({"_id": specific_user_id})
print(f"Found by string: {user_by_str is not None}")

print(f"\nSearching for user with _id as ObjectId: {specific_user_id}")
try:
    user_by_oid = db.users.find_one({"_id": ObjectId(specific_user_id)})
    print(f"Found by ObjectId: {user_by_oid is not None}")
except:
    print("Invalid ObjectId format")

users = list(db.users.find({}))
print(f"\nFound {len(users)} user(s) total:\n")

for idx, user in enumerate(users, 1):
    print(f"User {idx}:")
    print(f"  _id: {user.get('_id')} (type: {type(user.get('_id')).__name__})")
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
