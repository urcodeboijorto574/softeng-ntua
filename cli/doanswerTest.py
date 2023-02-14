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
        questionnaire_id = "UTEST"
        question_id = "U01"
        session_id = "1234"
        option_id = "U01A1"
        doanswerUrl = baseUrl + f"doanswer/{questionnaire_id}/{question_id}/{session_id}/{option_id}"  + "?format=json"
        answerJson = {
            "questionnaireID" : questionnaire_id,
            "questionID"      : question_id,
            "session"         : session_id,
            "optionID"        : option_id
        }

        vescookie = getCookie()
        response = requests.post(url = doanswerUrl, json = answerJson, cookies = vescookie, verify = False)
        
        data = response.json()
        self.assertIsInstance(data, dict, "Response is not a dictionary")


if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(TestEndpoint)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    print(f"Doanswer Unit Test Result:\t\t\t{result}")