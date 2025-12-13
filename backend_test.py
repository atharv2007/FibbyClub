#!/usr/bin/env python3
"""
Comprehensive Backend Test Suite for Fibby Investment APIs
Tests all investment-related endpoints with the specified user ID.
"""

import requests
import json
import sys
from typing import Dict, Any, List

# Configuration
BASE_URL = "https://fibby-app.preview.emergentagent.com/api"
TEST_USER_ID = "693d2626a878e575aaf43c0a"

class InvestmentAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.user_id = TEST_USER_ID
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if response_data and isinstance(response_data, dict):
            print(f"   Sample Data: {json.dumps(response_data, indent=2)[:200]}...")
        print()
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "response_data": response_data
        })
    
    def make_request(self, endpoint: str, params: Dict = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        try:
            url = f"{self.base_url}{endpoint}"
            response = self.session.get(url, params=params, timeout=30)
            
            if response.status_code == 200:
                try:
                    data = response.json()
                    return True, data, response.status_code
                except json.JSONDecodeError:
                    return False, f"Invalid JSON response: {response.text[:100]}", response.status_code
            else:
                return False, f"HTTP {response.status_code}: {response.text[:100]}", response.status_code
                
        except requests.exceptions.RequestException as e:
            return False, f"Request failed: {str(e)}", 0
    
    def test_user_initialization(self):
        """Test 1: Initialize user to ensure investment data is created"""
        print("🔄 Initializing user to ensure investment data exists...")
        
        success, data, status_code = self.make_request("/users/init", method="POST")
        
        if success and isinstance(data, dict):
            if data.get("status") == "success" and data.get("user_id"):
                self.log_test("User Initialization", True, 
                            f"User initialized successfully. User ID: {data.get('user_id')}")
                return True
            else:
                self.log_test("User Initialization", False, 
                            f"Unexpected response format: {data}")
                return False
        else:
            self.log_test("User Initialization", False, f"Failed: {data}")
            return False
    
    def make_post_request(self, endpoint: str, data: Dict = None) -> tuple:
        """Make HTTP POST request"""
        try:
            url = f"{self.base_url}{endpoint}"
            response = self.session.post(url, json=data, timeout=30)
            
            if response.status_code == 200:
                try:
                    response_data = response.json()
                    return True, response_data, response.status_code
                except json.JSONDecodeError:
                    return False, f"Invalid JSON response: {response.text[:100]}", response.status_code
            else:
                return False, f"HTTP {response.status_code}: {response.text[:100]}", response.status_code
                
        except requests.exceptions.RequestException as e:
            return False, f"Request failed: {str(e)}", 0
    
    def test_portfolio_summary(self):
        """Test 2: Portfolio Summary API"""
        print("📊 Testing Portfolio Summary API...")
        
        success, data, status_code = self.make_request("/investments/portfolio", 
                                                     {"user_id": self.user_id})
        
        if success and isinstance(data, dict):
            required_fields = [
                "total_value", "total_invested", "total_pnl", "total_returns_percentage",
                "asset_allocation", "holdings_count", "mf_count", "other_count"
            ]
            
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields:
                # Verify asset_allocation structure
                asset_allocation = data.get("asset_allocation", {})
                expected_assets = ["equity", "mutual_funds", "crypto", "fixed_income", "real_estate", "insurance", "nps"]
                missing_assets = [asset for asset in expected_assets if asset not in asset_allocation]
                
                if not missing_assets:
                    self.log_test("Portfolio Summary", True, 
                                f"All fields present. Total Value: ₹{data['total_value']}, P&L: ₹{data['total_pnl']}", 
                                data)
                    return True
                else:
                    self.log_test("Portfolio Summary", False, 
                                f"Missing asset allocation fields: {missing_assets}")
                    return False
            else:
                self.log_test("Portfolio Summary", False, 
                            f"Missing required fields: {missing_fields}")
                return False
        else:
            self.log_test("Portfolio Summary", False, f"Failed: {data}")
            return False
    
    def test_stock_holdings(self):
        """Test 3: Stock Holdings API"""
        print("📈 Testing Stock Holdings API...")
        
        success, data, status_code = self.make_request("/investments/holdings", 
                                                     {"user_id": self.user_id})
        
        if success and isinstance(data, list):
            if len(data) == 6:  # Expected 6 stock holdings
                # Check structure of first holding
                if data:
                    holding = data[0]
                    required_fields = [
                        "tradingsymbol", "exchange", "quantity", "average_price", 
                        "last_price", "pnl", "day_change", "day_change_percentage"
                    ]
                    
                    missing_fields = [field for field in required_fields if field not in holding]
                    
                    if not missing_fields:
                        self.log_test("Stock Holdings", True, 
                                    f"Found {len(data)} holdings with correct structure", 
                                    data[0])
                        return True
                    else:
                        self.log_test("Stock Holdings", False, 
                                    f"Missing fields in holding: {missing_fields}")
                        return False
                else:
                    self.log_test("Stock Holdings", False, "Empty holdings array")
                    return False
            else:
                self.log_test("Stock Holdings", False, 
                            f"Expected 6 holdings, got {len(data)}")
                return False
        else:
            self.log_test("Stock Holdings", False, f"Failed: {data}")
            return False
    
    def test_mutual_funds(self):
        """Test 4: Mutual Funds API"""
        print("🏦 Testing Mutual Funds API...")
        
        success, data, status_code = self.make_request("/investments/mutual-funds", 
                                                     {"user_id": self.user_id})
        
        if success and isinstance(data, list):
            if len(data) == 4:  # Expected 4 mutual funds
                if data:
                    fund = data[0]
                    required_fields = [
                        "folio", "fund", "quantity", "average_price", 
                        "last_price", "pnl", "is_sip"
                    ]
                    
                    missing_fields = [field for field in required_fields if field not in fund]
                    
                    if not missing_fields:
                        self.log_test("Mutual Funds", True, 
                                    f"Found {len(data)} mutual funds with correct structure", 
                                    data[0])
                        return True
                    else:
                        self.log_test("Mutual Funds", False, 
                                    f"Missing fields in mutual fund: {missing_fields}")
                        return False
                else:
                    self.log_test("Mutual Funds", False, "Empty mutual funds array")
                    return False
            else:
                self.log_test("Mutual Funds", False, 
                            f"Expected 4 mutual funds, got {len(data)}")
                return False
        else:
            self.log_test("Mutual Funds", False, f"Failed: {data}")
            return False
    
    def test_active_sips(self):
        """Test 5: Active SIPs API"""
        print("💰 Testing Active SIPs API...")
        
        success, data, status_code = self.make_request("/investments/sips", 
                                                     {"user_id": self.user_id})
        
        if success and isinstance(data, list):
            if len(data) == 3:  # Expected 3 SIP investments
                if data:
                    sip = data[0]
                    required_fields = ["sip_amount", "sip_date", "is_sip"]
                    
                    missing_fields = [field for field in required_fields if field not in sip]
                    
                    # Verify is_sip is True for all
                    all_sips = all(s.get("is_sip") == True for s in data)
                    
                    if not missing_fields and all_sips:
                        self.log_test("Active SIPs", True, 
                                    f"Found {len(data)} active SIPs with correct structure", 
                                    data[0])
                        return True
                    else:
                        issues = []
                        if missing_fields:
                            issues.append(f"Missing fields: {missing_fields}")
                        if not all_sips:
                            issues.append("Some SIPs have is_sip=False")
                        
                        self.log_test("Active SIPs", False, "; ".join(issues))
                        return False
                else:
                    self.log_test("Active SIPs", False, "Empty SIPs array")
                    return False
            else:
                self.log_test("Active SIPs", False, 
                            f"Expected 3 SIPs, got {len(data)}")
                return False
        else:
            self.log_test("Active SIPs", False, f"Failed: {data}")
            return False
    
    def test_other_investments(self):
        """Test 6: Other Investments API"""
        print("🏛️ Testing Other Investments API...")
        
        success, data, status_code = self.make_request("/investments/other", 
                                                     {"user_id": self.user_id})
        
        if success and isinstance(data, list):
            if data:
                investment = data[0]
                required_fields = [
                    "type", "name", "amount_invested", "current_value", 
                    "returns", "returns_percentage"
                ]
                
                missing_fields = [field for field in required_fields if field not in investment]
                
                # Check for expected investment types
                investment_types = set(inv.get("type") for inv in data)
                expected_types = {"crypto", "fd", "bond", "real_estate", "nps", "ppf", "insurance"}
                
                if not missing_fields:
                    self.log_test("Other Investments", True, 
                                f"Found {len(data)} other investments with types: {investment_types}", 
                                data[0])
                    return True
                else:
                    self.log_test("Other Investments", False, 
                                f"Missing fields in investment: {missing_fields}")
                    return False
            else:
                self.log_test("Other Investments", False, "Empty other investments array")
                return False
        else:
            self.log_test("Other Investments", False, f"Failed: {data}")
            return False
    
    def test_filtered_other_investments(self):
        """Test 7: Filtered Other Investments API (crypto filter)"""
        print("🪙 Testing Filtered Other Investments API (crypto)...")
        
        success, data, status_code = self.make_request("/investments/other", 
                                                     {"user_id": self.user_id, "investment_type": "crypto"})
        
        if success and isinstance(data, list):
            if data:
                # Verify all returned items are crypto
                all_crypto = all(inv.get("type") == "crypto" for inv in data)
                
                if all_crypto:
                    self.log_test("Filtered Other Investments (Crypto)", True, 
                                f"Found {len(data)} crypto investments, all correctly filtered", 
                                data[0])
                    return True
                else:
                    non_crypto = [inv.get("type") for inv in data if inv.get("type") != "crypto"]
                    self.log_test("Filtered Other Investments (Crypto)", False, 
                                f"Found non-crypto investments: {non_crypto}")
                    return False
            else:
                self.log_test("Filtered Other Investments (Crypto)", False, 
                            "No crypto investments found (this might be expected)")
                return True  # This could be valid if no crypto investments exist
        else:
            self.log_test("Filtered Other Investments (Crypto)", False, f"Failed: {data}")
            return False
    
    def test_investment_recommendations(self):
        """Test 8: Investment Recommendations API (AI + Rule-based Ensemble)"""
        print("🤖 Testing Investment Recommendations API...")
        
        success, data, status_code = self.make_request("/investments/recommendations", 
                                                     {"user_id": self.user_id})
        
        if success and isinstance(data, list):
            if len(data) <= 5:  # Should return up to 5 recommendations
                if data:
                    recommendation = data[0]
                    required_fields = [
                        "type", "title", "description", "asset_class", "priority"
                    ]
                    
                    missing_fields = [field for field in required_fields if field not in recommendation]
                    
                    # Check for mix of AI and rule-based recommendations
                    rec_types = set(rec.get("type") for rec in data)
                    has_ai = "ai" in rec_types
                    has_rule = "rule" in rec_types
                    
                    # Verify sorting by priority
                    priorities = [rec.get("priority", 0) for rec in data]
                    is_sorted = priorities == sorted(priorities, reverse=True)
                    
                    if not missing_fields:
                        details = f"Found {len(data)} recommendations. Types: {rec_types}. "
                        if has_ai and has_rule:
                            details += "✅ Has both AI and rule-based recommendations. "
                        elif has_ai:
                            details += "⚠️ Only AI recommendations found. "
                        elif has_rule:
                            details += "⚠️ Only rule-based recommendations found. "
                        
                        if is_sorted:
                            details += "✅ Properly sorted by priority."
                        else:
                            details += "⚠️ Not sorted by priority."
                        
                        self.log_test("Investment Recommendations", True, details, data[0])
                        return True
                    else:
                        self.log_test("Investment Recommendations", False, 
                                    f"Missing fields in recommendation: {missing_fields}")
                        return False
                else:
                    self.log_test("Investment Recommendations", False, 
                                "Empty recommendations array")
                    return False
            else:
                self.log_test("Investment Recommendations", False, 
                            f"Too many recommendations returned: {len(data)} (max 5)")
                return False
        else:
            self.log_test("Investment Recommendations", False, f"Failed: {data}")
            return False
    
    def run_all_tests(self):
        """Run all investment API tests"""
        print("🚀 Starting Fibby Investment APIs Test Suite")
        print("=" * 60)
        
        # Override make_request for POST requests in initialization
        def make_post_for_init():
            try:
                url = f"{self.base_url}/users/init"
                response = self.session.post(url, timeout=30)
                
                if response.status_code == 200:
                    try:
                        data = response.json()
                        return True, data, response.status_code
                    except json.JSONDecodeError:
                        return False, f"Invalid JSON response: {response.text[:100]}", response.status_code
                else:
                    return False, f"HTTP {response.status_code}: {response.text[:100]}", response.status_code
                    
            except requests.exceptions.RequestException as e:
                return False, f"Request failed: {str(e)}", 0
        
        # Test 1: Initialize user
        print("🔄 Initializing user to ensure investment data exists...")
        success, data, status_code = make_post_for_init()
        
        if success and isinstance(data, dict):
            if data.get("status") == "success":
                self.log_test("User Initialization", True, 
                            f"User initialized successfully. User ID: {data.get('user_id')}")
            else:
                self.log_test("User Initialization", False, 
                            f"Unexpected response format: {data}")
        else:
            self.log_test("User Initialization", False, f"Failed: {data}")
        
        # Run all other tests
        test_methods = [
            self.test_portfolio_summary,
            self.test_stock_holdings,
            self.test_mutual_funds,
            self.test_active_sips,
            self.test_other_investments,
            self.test_filtered_other_investments,
            self.test_investment_recommendations
        ]
        
        for test_method in test_methods:
            try:
                test_method()
            except Exception as e:
                test_name = test_method.__name__.replace("test_", "").replace("_", " ").title()
                self.log_test(test_name, False, f"Test crashed: {str(e)}")
        
        # Summary
        print("=" * 60)
        print("📋 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total*100):.1f}%")
        
        if passed == total:
            print("\n🎉 ALL TESTS PASSED! Investment APIs are working correctly.")
        else:
            print(f"\n⚠️ {total - passed} test(s) failed. Check details above.")
            
            # Show failed tests
            failed_tests = [result for result in self.test_results if not result["success"]]
            if failed_tests:
                print("\nFailed Tests:")
                for test in failed_tests:
                    print(f"  ❌ {test['test']}: {test['details']}")
        
        return passed == total

def main():
    """Main test execution"""
    tester = InvestmentAPITester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()