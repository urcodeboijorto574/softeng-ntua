import unittest
import requests
import subprocess
import os
# import urllib3
# from urllib3.exceptions import InsecureRequestWarning
# import warnings

# warnings.filterwarnings("ignore", category=InsecureRequestWarning)
# warnings.filterwarnings('ignore')
# warnings.simplefilter("ignore", InsecureRequestWarning)
# urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
# requests.packages.urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
requests.packages.urllib3.disable_warnings()

baseUrl = "https://localhost:9103/intelliq_api/"

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
        import uuid
        updUrl = baseUrl + "admin/questionnaire_upd?format=json"
        vescookie = getCookie()
        
        try:
            files = {
            'file': (os.path.basename("jtest.txt"), open("jtest.txt", 'rb'), 'application/octet-stream')
            }
            response = requests.post(updUrl, cookies=vescookie, files = files, verify = False, timeout=10)
        except requests.exceptions.ReadTimeout:
            print("Timeout error, the server took more than 10 seconds to respond")
            exit()
        
        data = response.json()
        self.assertIsInstance(data, dict, "Response is not a dictionary")


if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(TestEndpoint)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    print(f"Questionnaire_upd Unit Test Result:\t\t{result}")