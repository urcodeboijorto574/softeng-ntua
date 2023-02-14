import unittest
import requests
# import urllib3
# from urllib3.exceptions import InsecureRequestWarning
# import warnings

# warnings.filterwarnings("ignore", category=InsecureRequestWarning)
# warnings.filterwarnings('ignore')
# warnings.simplefilter("ignore", InsecureRequestWarning)
# urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
# requests.packages.urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
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

class TestEndpoint(unittest.TestCase):
    def test_endpoint(self):
        url = "https://localhost:9103/intelliq_api/login?format=json"
        response = requests.post(url, data = "username=TheUltraSuperAdmin&password=the-password-is-secret", verify = False, headers = {'Content-Type': 'application/x-www-form-urlencoded'})
        jwt = response.cookies["jwt"]
        save_variable_to_file(jwt)
        data = response.json()
        self.assertIsInstance(data, dict, "Response is not a dictionary")

if __name__ == "__main__":
    # unittest.main(argv=[''], exit = False)
    suite = unittest.TestLoader().loadTestsFromTestCase(TestEndpoint)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    print(f"Login Unit Test Result:\t\t\t\t{result}")
