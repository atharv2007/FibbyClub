#!/usr/bin/env python3
"""Script to view chat history from MongoDB"""
import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import json
from datetime import datetime

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def view_chat_history():
    """View all chat conversations from MongoDB"""
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("\n" + "="*80)
    print("CHAT HISTORY COLLECTION - MongoDB")
    print("="*80)
    
    # Get all conversations
    conversations = await db.chat_conversations.find().to_list(100)
    
    if not conversations:
        print("\n❌ No conversations found in the database yet.")
        print("\nThe chat_conversations collection is empty.")
        print("Conversations will be saved when the frontend calls the save API.")
    else:
        print(f"\nTotal Conversations: {len(conversations)}")
        print("\n" + "-"*80)
        
        for idx, conv in enumerate(conversations, 1):
            print(f"\n📝 Conversation #{idx}")
            print(f"{'='*80}")
            print(f"User ID: {conv.get('user_id')}")
            print(f"Conversation ID: {conv.get('conversation_id')}")
            print(f"Title: {conv.get('title')}")
            print(f"Created At: {conv.get('created_at')}")
            print(f"Updated At: {conv.get('updated_at')}")
            print(f"Total Messages: {len(conv.get('messages', []))}")
            
            # Show messages
            messages = conv.get('messages', [])
            if messages:
                print(f"\n{'Messages:':^80}")
                print("-"*80)
                
                for msg_idx, msg in enumerate(messages, 1):
                    role = msg.get('role', '').upper()
                    content = msg.get('content', '')
                    timestamp = msg.get('timestamp', '')
                    
                    # Truncate long messages for display
                    if len(content) > 200:
                        content = content[:200] + "..."
                    
                    print(f"\n[{msg_idx}] {role} ({timestamp})")
                    print(f"    {content}")
                    
                    # Show card info if available
                    if msg.get('card_type'):
                        print(f"    📊 Card Type: {msg.get('card_type')}")
            
            print("\n" + "="*80)
    
    # Show collection stats
    print(f"\n📊 Collection Statistics:")
    print(f"Collection Name: chat_conversations")
    print(f"Total Documents: {len(conversations)}")
    
    # Show raw document structure (first one)
    if conversations:
        print(f"\n🔍 Sample Document Structure (Raw JSON):")
        print("-"*80)
        sample = conversations[0]
        # Convert ObjectId to string for JSON serialization
        sample['_id'] = str(sample['_id'])
        print(json.dumps(sample, indent=2, default=str))
    
    client.close()
    print("\n" + "="*80 + "\n")

if __name__ == "__main__":
    asyncio.run(view_chat_history())
