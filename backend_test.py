#!/usr/bin/env python3
"""
Backend API Testing for Fibby Finance App - Spending Matrix
Tests all spending analytics endpoints with different time periods
"""

import requests
import json
from datetime import datetime, timedelta
import sys

# Configuration
BASE_URL = "https://fibby-app.preview.emergentagent.com/api"
TEST_USER_ID = "693d2626a878e575aaf43c0a"

def test_api_endpoint(endpoint, expected_fields=None, description=""):
    """Test a single API endpoint and validate response"""
    print(f"\n{'='*60}")
    print(f"Testing: {description}")
    print(f"Endpoint: {endpoint}")
    print(f"{'='*60}")
    
    try:
        response = requests.get(f"{BASE_URL}{endpoint}", timeout=30)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
        data = response.json()
        print(f"✅ SUCCESS: Got 200 response")
        print(f"Response type: {type(data)}")
        
        if isinstance(data, list):
            print(f"Number of items: {len(data)}")
            if len(data) > 0:
                print(f"Sample item: {json.dumps(data[0], indent=2, default=str)}")
                
                # Validate expected fields if provided
                if expected_fields:
                    sample_item = data[0]
                    missing_fields = []
                    for field in expected_fields:
                        if field not in sample_item:
                            missing_fields.append(field)
                    
                    if missing_fields:
                        print(f"❌ MISSING FIELDS: {missing_fields}")
                        return False
                    else:
                        print(f"✅ All expected fields present: {expected_fields}")
            else:
                print("⚠️  WARNING: Empty response array")
        else:
            print(f"Response: {json.dumps(data, indent=2, default=str)}")
            
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ REQUEST FAILED: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ JSON DECODE FAILED: {e}")
        print(f"Raw response: {response.text}")
        return False
    except Exception as e:
        print(f"❌ UNEXPECTED ERROR: {e}")
        return False

def main():
    """Run all backend API tests for Spending Matrix"""
    print("🚀 Starting Fibby Backend API Tests - Spending Matrix")
    print(f"Base URL: {BASE_URL}")
    print(f"Test User ID: {TEST_USER_ID}")
    
    test_results = []
    
    # Test 1: 1 Week Period (Daily Breakdown)
    result = test_api_endpoint(
        f"/analytics/spending-by-period?user_id={TEST_USER_ID}&period=1wk",
        expected_fields=["month", "day", "month_num", "year", "date", "amount"],
        description="1 Week Period - Daily Breakdown (7 bars expected)"
    )
    test_results.append(("1 Week Daily Breakdown", result))
    
    # Test 2: 1 Month Period (Weekly Breakdown)  
    result = test_api_endpoint(
        f"/analytics/spending-by-period?user_id={TEST_USER_ID}&period=1mnth",
        expected_fields=["month", "week_num", "week_start", "week_end", "date", "amount"],
        description="1 Month Period - Weekly Breakdown (4-5 bars expected)"
    )
    test_results.append(("1 Month Weekly Breakdown", result))
    
    # Test 3: 6 Months Period (Monthly Breakdown) - Default behavior
    result = test_api_endpoint(
        f"/analytics/spending-by-period?user_id={TEST_USER_ID}&period=6mnth",
        expected_fields=["month", "month_num", "year", "amount"],
        description="6 Months Period - Monthly Breakdown (6 bars expected)"
    )
    test_results.append(("6 Months Monthly Breakdown", result))
    
    # Test 4: 1 Year Period (Bi-Monthly Breakdown)
    result = test_api_endpoint(
        f"/analytics/spending-by-period?user_id={TEST_USER_ID}&period=1yr",
        expected_fields=["month", "period_start", "period_end", "start_month", "start_year", "amount"],
        description="1 Year Period - Bi-Monthly Breakdown (6 bars expected, labels like 'Feb-Mar')"
    )
    test_results.append(("1 Year Bi-Monthly Breakdown", result))
    
    # Test 5: Category Breakdown with Date Range
    start_date = "2025-12-01T00:00:00"
    end_date = "2025-12-08T00:00:00"
    result = test_api_endpoint(
        f"/transactions/category-breakdown?user_id={TEST_USER_ID}&start_date_str={start_date}&end_date_str={end_date}",
        expected_fields=["_id", "total", "count"],
        description="Category Breakdown with Date Range Filter"
    )
    test_results.append(("Category Breakdown with Date Range", result))
    
    # Test 6: Merchant Leaderboard with Date Range
    result = test_api_endpoint(
        f"/transactions/merchant-leaderboard?user_id={TEST_USER_ID}&start_date_str={start_date}&end_date_str={end_date}&limit=10",
        expected_fields=["_id", "total", "count", "category"],
        description="Merchant Leaderboard with Date Range Filter (Top 10)"
    )
    test_results.append(("Merchant Leaderboard with Date Range", result))
    
    # Summary
    print(f"\n{'='*60}")
    print("🏁 TEST SUMMARY")
    print(f"{'='*60}")
    
    passed = 0
    failed = 0
    
    for test_name, result in test_results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{status}: {test_name}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal Tests: {len(test_results)}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    
    if failed == 0:
        print("\n🎉 ALL TESTS PASSED! Spending Matrix APIs are working correctly.")
        return True
    else:
        print(f"\n⚠️  {failed} TEST(S) FAILED. Please check the issues above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)