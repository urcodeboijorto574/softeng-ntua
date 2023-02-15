import subprocess
import os

with open(os.devnull, 'w') as devnull:
    result = subprocess.run(["python", "loginTest.py"], stderr=devnull, check=True)
    result = subprocess.run(["python", "logoutTest.py"], stderr=devnull, check=True)
    result = subprocess.run(["python", "healthcheckTest.py"], stderr=devnull, check=True)
    result = subprocess.run(["python", "questionnaire_updTest.py"], stderr=devnull, check=True)
    result = subprocess.run(["python", "resetqTest.py"], stderr=devnull, check=True)
    result = subprocess.run(["python", "questionnaireTest.py"], stderr=devnull, check=True)
    result = subprocess.run(["python", "questionTest.py"], stderr=devnull, check=True)
    result = subprocess.run(["python", "doanswerTest.py"], stderr=devnull, check=True)
    result = subprocess.run(["python", "getsessionanswersTest.py"], stderr=devnull, check=True)
    result = subprocess.run(["python", "getquestionanswersTest.py"], stderr=devnull, check=True)
    result = subprocess.run(["python", "deleteTest.py"], stderr=devnull, check=True)
    result = subprocess.run(["python", "usermodTest.py"], stderr=devnull, check=True)
    result = subprocess.run(["python", "usersTest.py"], stderr=devnull, check=True)
    