import unittest
import requests
import subprocess

requests.packages.urllib3.disable_warnings()

def save_variable_to_file(variable):
    with open("token.txt", "w") as file:
        file.write(str(variable))
    
    return

# reading from a file
def load_variable_from_file():
    with open("token.txt", "r") as file:
        return str(file.read())
    
    return 

def getCookie():
    return {"jwt" : load_variable_from_file()}

class TestEndpoint(unittest.TestCase):
    def test_endpoint(self):
        url = "https://localhost:9103/intelliq_api/logout?format=json"
        vescookie = getCookie()
        response = requests.post(url, verify = False, cookies = vescookie)
        data = response.json()
        self.assertIsInstance(data, dict, "Response is not a dictionary")

if __name__ == "__main__":
    # result = subprocess.run(['python', 'cli.py', 'login', '--username', "TheUltraSuperAdmin", '--passw', "the-password-is-secret", '--format', "json"], capture_output=True)
    # print(result)
    suite = unittest.TestLoader().loadTestsFromTestCase(TestEndpoint)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    print(f"Logout Unit Test Result:\t\t\t{result}")