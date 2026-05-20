import requests

def test_endpoints():
    base_url = "http://127.0.0.1:5000"
    endpoints = [
        "/healthz",
        "/api/settings/account",
        "/api/settings/bots",
        "/api/settings/billing",
        "/api/leads/list",
        "/api/analytics/metrics",
        "/api/integrations/list"
    ]
    
    print("Testing Backend Endpoints...")
    for ep in endpoints:
        try:
            res = requests.get(f"{base_url}{ep}")
            print(f"[{res.status_code}] {ep}")
        except Exception as e:
            print(f"[ERROR] {ep}: {e}")

if __name__ == "__main__":
    test_endpoints()
