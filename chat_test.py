#!/usr/bin/env python3
"""
Chat Feature Test Suite for Fibby
Testing the /api/chat/message endpoint with JSON response format
"""

import requests
import json
import sys
from datetime import datetime

# Configuration
BACKEND_URL = "https://credpulse.preview.emergentagent.com/api"
USER_ID = "693d2626a878e575aaf43c0a"

def test_chat_endpoint():
    """Test the chat endpoint with different query types"""
    
    print("🧪 TESTING CHAT FEATURE WITH JSON RESPONSE FORMAT")
    print("=" * 60)
    
    # Test scenarios as specified in the review request
    test_scenarios = [
        {
            "name": "Budget/Spending Query",
            "message": "How is my budget?",
            "expected_card_types": ["budget_status", "spending_breakdown"],
            "description": "Should return budget summary with card data"
        },
        {
            "name": "Investment Query", 
            "message": "How is my portfolio performing?",
            "expected_card_types": ["portfolio"],
            "description": "Should return portfolio performance with metrics"
        },
        {
            "name": "General Question",
            "message": "What is a SIP?",
            "expected_card_types": [None],
            "description": "Should return educational explanation without card"
        },
        {
            "name": "Simple Balance Query",
            "message": "What's my balance?",
            "expected_card_types": ["budget_status", "spending_breakdown", None],
            "description": "Should return short 1 sentence summary"
        }
    ]
    
    all_tests_passed = True
    test_results = []
    
    for i, scenario in enumerate(test_scenarios, 1):
        print(f"\n📋 TEST {i}: {scenario['name']}")
        print(f"Query: '{scenario['message']}'")
        print(f"Expected: {scenario['description']}")
        print("-" * 40)
        
        try:
            # Make API request
            payload = {
                "user_id": USER_ID,
                "message": scenario["message"]
            }
            
            response = requests.post(
                f"{BACKEND_URL}/chat/message",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code != 200:
                print(f"❌ FAILED: HTTP {response.status_code}")
                print(f"Response: {response.text}")
                all_tests_passed = False
                test_results.append({
                    "test": scenario["name"],
                    "status": "FAILED",
                    "error": f"HTTP {response.status_code}: {response.text}"
                })
                continue
            
            # Parse response
            try:
                data = response.json()
            except json.JSONDecodeError as e:
                print(f"❌ FAILED: Invalid JSON response")
                print(f"Raw response: {response.text}")
                all_tests_passed = False
                test_results.append({
                    "test": scenario["name"],
                    "status": "FAILED", 
                    "error": f"JSON decode error: {str(e)}"
                })
                continue
            
            # Print full response for debugging
            print(f"Full Response: {json.dumps(data, indent=2)}")
            
            # Validate response structure
            validation_results = validate_chat_response(data, scenario)
            
            if validation_results["passed"]:
                print(f"✅ PASSED: {scenario['name']}")
                print(f"Response: {data.get('response', 'N/A')[:100]}...")
                if data.get('card'):
                    print(f"Card Type: {data['card'].get('type', 'N/A')}")
                print(f"Options Count: {len(data.get('options', []))}")
                
                test_results.append({
                    "test": scenario["name"],
                    "status": "PASSED",
                    "response_length": len(data.get('response', '')),
                    "has_card": bool(data.get('card')),
                    "card_type": data.get('card', {}).get('type') if data.get('card') else None,
                    "options_count": len(data.get('options', []))
                })
            else:
                print(f"❌ FAILED: {scenario['name']}")
                for issue in validation_results["issues"]:
                    print(f"  - {issue}")
                all_tests_passed = False
                
                test_results.append({
                    "test": scenario["name"],
                    "status": "FAILED",
                    "error": "; ".join(validation_results["issues"])
                })
                
        except requests.exceptions.RequestException as e:
            print(f"❌ FAILED: Network error - {str(e)}")
            all_tests_passed = False
            test_results.append({
                "test": scenario["name"],
                "status": "FAILED",
                "error": f"Network error: {str(e)}"
            })
        except Exception as e:
            print(f"❌ FAILED: Unexpected error - {str(e)}")
            all_tests_passed = False
            test_results.append({
                "test": scenario["name"],
                "status": "FAILED", 
                "error": f"Unexpected error: {str(e)}"
            })
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed_count = sum(1 for r in test_results if r["status"] == "PASSED")
    total_count = len(test_results)
    
    print(f"Total Tests: {total_count}")
    print(f"Passed: {passed_count}")
    print(f"Failed: {total_count - passed_count}")
    
    if all_tests_passed:
        print("\n🎉 ALL CHAT TESTS PASSED!")
    else:
        print("\n❌ SOME CHAT TESTS FAILED!")
        print("\nFailed Tests:")
        for result in test_results:
            if result["status"] == "FAILED":
                print(f"  - {result['test']}: {result.get('error', 'Unknown error')}")
    
    return all_tests_passed, test_results

def validate_chat_response(data, scenario):
    """Validate the chat response structure and content"""
    issues = []
    
    # Check required fields
    if "response" not in data:
        issues.append("Missing 'response' field")
    
    if "options" not in data:
        issues.append("Missing 'options' field")
    
    # Check response field content
    response_text = data.get("response", "")
    if not response_text or not isinstance(response_text, str):
        issues.append("Response field is empty or not a string")
    
    # Critical check: Response should NOT contain raw JSON
    if response_text and ("{" in response_text or "}" in response_text):
        # Allow some JSON-like content but flag if it looks like raw JSON structure
        if any(keyword in response_text.lower() for keyword in ["cardtype", "metrics", "summary"]):
            issues.append("Response contains raw JSON structure - should be clean text only")
    
    # Check options array
    options = data.get("options", [])
    if not isinstance(options, list):
        issues.append("Options field is not an array")
    elif len(options) == 0:
        issues.append("Options array is empty - should provide relevant follow-up options")
    
    # Check card data structure if present
    card = data.get("card")
    if card is not None:
        if not isinstance(card, dict):
            issues.append("Card field is not an object")
        elif "type" not in card:
            issues.append("Card missing 'type' field")
        else:
            card_type = card.get("type")
            # Validate card type matches expected types for the scenario
            if scenario["expected_card_types"] and card_type not in scenario["expected_card_types"]:
                if None not in scenario["expected_card_types"]:  # Only flag if None is not expected
                    issues.append(f"Unexpected card type '{card_type}', expected one of {scenario['expected_card_types']}")
    
    # Response length validation based on query complexity
    if scenario["name"] == "Simple Balance Query" and len(response_text) > 200:
        issues.append("Simple query response is too long - should be 1 sentence")
    elif scenario["name"] == "General Question" and len(response_text) < 50:
        issues.append("General question response is too short - should be educational")
    
    # Check for empty or generic responses
    if response_text and len(response_text.strip()) < 10:
        issues.append("Response is too short or generic")
    
    # Check for parsing errors in response
    if "error" in response_text.lower() or "failed" in response_text.lower():
        issues.append("Response indicates an error occurred")
    
    return {
        "passed": len(issues) == 0,
        "issues": issues
    }

def test_user_initialization():
    """Test if the user exists and has data"""
    print("\n🔍 TESTING USER DATA INITIALIZATION")
    print("-" * 40)
    
    try:
        # Initialize user data
        response = requests.post(f"{BACKEND_URL}/users/init", timeout=10)
        print(f"User Init Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ User initialized: {data.get('user_id', 'N/A')}")
            return True
        else:
            print(f"❌ User initialization failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ User initialization error: {str(e)}")
        return False

def main():
    """Main test execution"""
    print("🚀 STARTING FIBBY CHAT FEATURE TESTS")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"User ID: {USER_ID}")
    print(f"Timestamp: {datetime.now().isoformat()}")
    
    # Initialize user data first
    user_ready = test_user_initialization()
    if not user_ready:
        print("❌ Cannot proceed without user data")
        sys.exit(1)
    
    # Run chat tests
    success, results = test_chat_endpoint()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()