#!/usr/bin/env python3
"""Script to reset goals data in MongoDB"""
import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from mock_data import generate_mock_goals

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def reset_goals():
    """Clear existing goals and add new mock goals"""
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Get the user
    user = await db.users.find_one({"email": "mohit@example.com"})
    if not user:
        print("No user found!")
        return
    
    user_id = str(user["_id"])
    print(f"Found user: {user_id}")
    
    # Delete all existing goals
    result = await db.goals.delete_many({"user_id": user_id})
    print(f"Deleted {result.deleted_count} existing goals")
    
    # Add new mock goals
    goals = generate_mock_goals(user_id)
    if goals:
        result = await db.goals.insert_many(goals)
        print(f"Added {len(result.inserted_ids)} new goals")
    
    # Verify
    all_goals = await db.goals.find({"user_id": user_id}).to_list(100)
    print(f"\nTotal goals now: {len(all_goals)}")
    for goal in all_goals:
        print(f"  - {goal['name']}: {goal['icon']}")
    
    client.close()
    print("\n✅ Goals reset complete!")

if __name__ == "__main__":
    asyncio.run(reset_goals())
