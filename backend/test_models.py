import asyncio
import os
from dotenv import load_dotenv
from emergentintegrations import LlmChat, UserMessage

load_dotenv()

# Test prompt with user context
CONTEXT_PROMPT = """User Query: How is my budget looking?

Relevant User Data:
User: Mohit
This Month Spending: ₹239,355
Top Categories: Salary ₹180,000, Shopping ₹22,500, Travel ₹12,056
Monthly Budget: ₹45,000
Budget Used: 532%

Based on this data, provide a helpful response that:
1. Directly answers the user's question with specific data and insights
2. Only include MCQ options when there are natural follow-up paths or decisions to make
3. Keep the response concise but informative"""

SYSTEM_MESSAGE = """You are Fibby, a smart and friendly finance companion for Indian Gen-Z users.

YOUR TONE: Professional Advisor + Friendly Gen-Z
- Mix financial expertise with approachable language
- Use "you're", "let's", "your" naturally
- Occasionally use Gen-Z expressions like "yaar", "bro", "totally" but don't overdo it
- Be encouraging and supportive
- Use emojis sparingly (1-2 per response max)

YOUR ROLE:
- Provide REAL ANSWERS with actual data and insights
- Analyze trends and give actionable advice
- Help users understand their financial situation clearly
- Guide them toward better financial decisions

RESPONSE STRUCTURE:

1. MAIN ANSWER (Required):
   - Address their question directly with specific data
   - Share insights, trends, or analysis
   - Provide actionable recommendations
   - Use numbers and percentages from the context
   - Keep it 3-4 sentences, clear and informative

2. MCQ OPTIONS (Only when relevant):
   - Include when there are natural next steps
   - When user needs to make a decision
   - When exploring different aspects of a topic
   - When there are multiple follow-up paths
   - Limit to 2-4 options max

   Format MCQs like this:
   OPTIONS:
   - [Option 1]
   - [Option 2]
   - [Option 3]"""

async def test_model(model_name: str, provider: str = "openai"):
    """Test a specific model with the same prompt"""
    print(f"\n{'='*80}")
    print(f"MODEL: {model_name.upper()}")
    print(f"{'='*80}\n")
    
    try:
        chat = LlmChat(
            api_key=os.environ.get("EMERGENT_LLM_KEY"),
            session_id=f"test_{model_name}",
            system_message=SYSTEM_MESSAGE
        ).with_model(provider, model_name)
        
        user_message = UserMessage(text=CONTEXT_PROMPT)
        response = await chat.send_message(user_message)
        
        print(f"RESPONSE:\n{response}\n")
        print(f"Length: {len(response)} characters")
        print(f"{'-'*80}\n")
        
        return response
    
    except Exception as e:
        print(f"❌ ERROR: {str(e)}\n")
        return None

async def main():
    print("\n" + "="*80)
    print("FIBBY CHAT - MODEL COMPARISON TEST")
    print("Testing Budget Query: 'How is my budget looking?'")
    print("="*80)
    
    # Test Query 1: Budget Question
    print("\n\n🔍 TEST QUERY: Budget Status")
    print("="*80)
    
    models = [
        ("gpt-4o-mini", "openai"),
        ("gpt-4o", "openai"),
        ("gpt-5.1", "openai"),
    ]
    
    results = {}
    for model_name, provider in models:
        response = await test_model(model_name, provider)
        results[model_name] = response
        await asyncio.sleep(1)  # Rate limiting
    
    # Test Query 2: Investment Question
    print("\n\n" + "="*80)
    print("🔍 TEST QUERY 2: Investment Portfolio")
    print("="*80)
    
    investment_prompt = """User Query: How is my investment portfolio performing?

Relevant User Data:
User: Mohit
Total Portfolio Value: ₹5,23,400
Total Invested: ₹4,42,000
Overall Returns: +18.4%
Holdings: 12 stocks, 5 mutual funds
Active SIPs: 3 (₹15,000/month)

Based on this data, provide a helpful response that:
1. Directly answers the user's question with specific data and insights
2. Only include MCQ options when there are natural follow-up paths or decisions to make
3. Keep the response concise but informative"""
    
    for model_name, provider in models:
        print(f"\n{'='*80}")
        print(f"MODEL: {model_name.upper()}")
        print(f"{'='*80}\n")
        
        try:
            chat = LlmChat(
                api_key=os.environ.get("EMERGENT_LLM_KEY"),
                session_id=f"test_investment_{model_name}",
                system_message=SYSTEM_MESSAGE
            ).with_model(provider, model_name)
            
            user_message = UserMessage(text=investment_prompt)
            response = await chat.send_message(user_message)
            
            print(f"RESPONSE:\n{response}\n")
            print(f"Length: {len(response)} characters")
            print(f"{'-'*80}\n")
            
            await asyncio.sleep(1)
            
        except Exception as e:
            print(f"❌ ERROR: {str(e)}\n")
    
    # Summary
    print("\n" + "="*80)
    print("📊 COMPARISON SUMMARY")
    print("="*80)
    print("\nModel Characteristics:")
    print("\n1. GPT-4o-mini:")
    print("   - Fastest response time")
    print("   - Most cost-effective")
    print("   - Good for real-time chat")
    print("   - Concise and direct answers")
    
    print("\n2. GPT-4o:")
    print("   - Balanced speed and quality")
    print("   - Better reasoning than mini")
    print("   - Good for complex queries")
    print("   - More nuanced responses")
    
    print("\n3. GPT-5.1:")
    print("   - Highest quality responses")
    print("   - Best for complex analysis")
    print("   - Slower response time")
    print("   - Most detailed insights")
    
    print("\n" + "="*80)

if __name__ == "__main__":
    asyncio.run(main())
