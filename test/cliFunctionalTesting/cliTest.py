import subprocess
import json
import csv
import io
import pandas as pd

check_mark = "\u2713".encode("utf-8")

def load_variable_from_file():
    with open("token.txt", "r") as file:
        return str(file.read())

def run_login(username, password, form, output = True):
    result = subprocess.run(['python', 'se2236.py', 'login', '--username', username, '--passw', password, '--format', form], capture_output=True)

    if form == "json":
        res = json.loads(result.stdout.decode('utf-8'))
    else:
        res = csv.reader(io.StringIO(result.stdout.decode()))
    if result.returncode != 0:
        raise Exception('Login failed with return code {}'.format(result.returncode))

    if isinstance(res, dict) and len(res) == 1:
        if next(iter(res)) == "token":
            if (output):
                print("PASSED", check_mark.decode("utf-8"))
                return
        else:
            if (output):
                print("FAILED, wrong response data")
                return
    elif str(type(res)) == "<class '_csv.reader'>":
        if next(res)[0] == "token":
            if (output):
                print("PASSED", check_mark.decode("utf-8"))
                return
        else:
            if (output):
                print("FAILED, wrong response data")
                return
    else:
        if (output):
            print("FAILED, wrong response type (expected 'dict', got '" + type(res)[8:-2] + "')")
            return

    return

def run_logout(form): # (username, password, form):
    result = subprocess.run(['python', 'se2236.py', 'logout', '--format', form], capture_output=True)
    if form == "json":
        res = json.loads(result.stdout.decode('utf-8'))
    else:
        res = csv.reader(io.StringIO(result.stdout.decode())) # TEMPORARY UNTIL CSV BUG FIXED        
        
    if result.returncode != 0:
        raise Exception('Logout failed with return code {}'.format(result.returncode))
    if isinstance(res, dict) and len(res) == 2:
        if list(res.keys()) == ["status", "message"]:
            if (res["status"] == "OK" and res["message"] == "You are successfully logged out."):    # !! Already logged out
                print("PASSED", check_mark.decode("utf-8"))
                return
        else:
            print("FAILED, wrong response data")
            return
    elif str(type(res)) == "<class '_csv.reader'>":
        firstRow = next(res)
        if firstRow[0] == "status" and firstRow[1] == "message":
            print("PASSED", check_mark.decode("utf-8"))
            return
        else:
            print("FAILED, wrong response data")
            return
    else:
        print("FAILED, wrong response type (expected 'dict', got '" + type(res)[8:-2] + "')")
        return

    return

def run_healthcheck(username, form): # (username, password, form):
    result = subprocess.run(['python', 'se2236.py', 'healthcheck', '--format', form], capture_output=True)

    if result.returncode != 0:
        raise Exception('Healthcheck failed with return code {}'.format(result.returncode))

    if form == "json":
        res = json.loads(result.stdout.decode('utf-8'))
    else:
        csv_string = result.stdout.decode('utf-8')
        lines = csv_string.splitlines(False)
        reader = csv.reader(lines)
        res = list(reader)
        res = [x for x in res if x]

    if isinstance(res, dict) and len(res) == 2:
        if list(res.keys()) == ["status", "dbconnection"]:
            # print(">>> HERE <<<")
            # print(res)
            if res["status"] == "OK" and res["dbconnection"] == "mongodb+srv://jimv:<password>@cluster0.oav8j31.mongodb.net/?retryWrites=true&w=majority" and username == "TheUltraSuperAdmin":
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        elif list(res.keys()) == ["status", "message"]:
            if res["status"] == "failed" and res["message"] == "User unauthorized to continue!" and (username == "adminTestJson" or username == "adminTestCsv" or username == "userTestJson" or username == "userTestCsv"):
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        else:
            print("FAILED, wrong response data")
            return
    elif isinstance(res, list) or len(res) == 4:
        if res[0][0] == "status" and res[0][1] == "dbconnection":
            if res[1][0] == "OK" and res[1][1] == "mongodb+srv://jimv:<password>@cluster0.oav8j31.mongodb.net/?retryWrites=true&w=majority":
                if username == "TheUltraSuperAdmin":
                    print("PASSED", check_mark.decode("utf-8"))
                    return
                else:
                    print("FAILED, wrong response data")
                    return
        elif res[0][0] == "status" and res[0][1] == "message":
            if res[1][0] == "failed" and res[1][1] == "User unauthorized to continue!":
                if username == "adminTestJson" or username == "adminTestCsv" or username == "userTestJson" or username == "userTestCsv":
                    print("PASSED", check_mark.decode("utf-8"))
                    return
                else:
                    print("FAILED, wrong response data")
                    return
        else:
            print("FAILED, wrong response data")
            return
    else:
        print("FAILED, wrong response type (expected 'dict', got '" + type(res)[8:-2] + "')")
        return

    return

# NOT DONE!!!
def run_resetall():
    return
    # result = subprocess.run(['python', 'se2236.py', 'resetall', '--format', 'json'], capture_output=True)
    # # response = json.loads(result.stdout)
    # print("=====")
    # print(result.stdout.decode())
    # print("=====")

    if result.returncode != 0:
        raise Exception('Healthcheck failed with return code {}'.format(result.returncode))

    # check for the expected status code
    status_code = response.get('status_code')
    if status_code != 200:
        raise Exception('Healthcheck failed with status code {}'.format(status_code))

    # check for the expected response format
    content_type = response.get('Content-Type')
    if content_type != 'application/json':
        raise Exception('Healthcheck failed with content type {}'.format(content_type))

    # check for the expected JSON response
    json_response = response.get('json_response')
    if not json_response:
        raise Exception('Healthcheck failed with missing JSON response')

    # Add additional checks for the JSON response if needed
    # ...
    return

def run_questionnaire_upd(username, title, idCheck, source, form, show = True):
    result = subprocess.run(['python', 'se2236.py', 'questionnaire_upd', '--source', source, '--format', form], capture_output=True)

    if not show:
        return

    if result.returncode != 0:
        print("FAILED, returned code " + str(result.returncode))
        return
        # raise Exception('Questionnaire_upd failed with return code {}'.format(result.returncode))

    if form == "json":
        res = json.loads(result.stdout.decode('utf-8'))
        if list(res.keys()) == ["status"]:
            if res["status"] == "OK" and (username == "adminTestJson" or username == "adminTestCsv"):
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        elif list(res.keys()) == ["status", "message"]:
            if res["status"] == "failed" and res["message"] == "User unauthorized to continue!" and (username == "TheUltraSuperAdmin" or username == "userTestJson" or username == "userTestCsv"):
                print("PASSED", check_mark.decode("utf-8"))
                return
            elif res["status"] == "failed" and res["message"] == "Invalid input data. A questionnaire id must have 5 characters" and len(title) != 5:
                print("PASSED", check_mark.decode("utf-8"))
                return
            elif res["status"] == "failed" and res["message"] == "All IDs must be unique" and idCheck == True:
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        else:
            print("FAILED!, wrong response data")
            return
    else:
        csv_string = result.stdout.decode('utf-8')
        lines = csv_string.splitlines(False)
        reader = csv.reader(lines)
        res = list(reader)
        res = [x for x in res if x]

    if isinstance(res, list):
        if res[0][0] == "status" and res[1][0] == "OK" and username in ["adminTestJson", "adminTestCsv"]:
            print("PASSED", check_mark.decode("utf-8"))
            return
        elif res[0][0] == "status" and res[0][1] == "message" and res[1][0] == "failed" and res[1][1] == "User unauthorized to continue!" and username not in ["adminTestJson", "adminTestCsv"]:
            print("PASSED", check_mark.decode("utf-8"))
            return
        elif res[0][0] == "status" and res[0][1] == "message" and res[1][0] == "failed" and res[1][1] == "All IDs must be unique" and idCheck == True:
            print("PASSED", check_mark.decode("utf-8"))
            return
        else:
            print("FAILED, wrong response data")
            return
    else:
        print("FAILED, wrong response type (expected 'dict', got '" + type(res)[8:-2] + "')")
        return

    return

def run_questionnaire(userConnected, questionnaire_id, form):
    result = subprocess.run(['python', 'se2236.py', 'questionnaire', '--questionnaire_id', questionnaire_id, '--format', form], capture_output=True)

    if result.returncode != 0:
        raise Exception('Healthcheck failed with return code {}'.format(result.returncode))

    if form == "json":
        res = json.loads(result.stdout.decode('utf-8'))
    else:
        csv_string = result.stdout.decode('utf-8')
        lines = csv_string.splitlines(False)
        reader = csv.reader(lines)
        res = list(reader)
        res = [x for x in res if x]

    if isinstance(res, dict) and len(res) == 2:
        if list(res.keys()) == ["status", "data"]:
            if res["status"] == "OK" and isinstance(res["data"], dict) and userConnected in ["adminTestJson", "adminTestCsv"]:
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        elif list(res.keys()) == ["status", "message"]:
            if res["status"] == "failed" and res["message"] == "User unauthorized to continue!" and userConnected not in ["adminTestJson", "adminTestCsv"]:
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        else:
            print("FAILED, wrong response data")
            return
    
    if isinstance(res, list):
        if res[0][0] == "status" and res[1][0] == "OK" and userConnected in ["adminTestJson", "adminTestCsv"]:
            print("PASSED", check_mark.decode("utf-8"))
            return
        elif res[0][0] == "status" and res[0][1] == "message" and res[1][0] == "failed" and res[1][1] == "User unauthorized to continue!" and userConnected not in ["adminTestJson", "adminTestCsv"]:
            print("PASSED", check_mark.decode("utf-8"))
            return
        else:
            print("FAILED, wrong response data")
            return
    else:
        print("FAILED, wrong response type (expected 'dict', got '" + type(res)[8:-2] + "')")
        return

    return

def run_question(userConnected, questionnaire_id, question_id, form):
    result = subprocess.run(['python', 'se2236.py', 'question', '--questionnaire_id', questionnaire_id, '--question_id', question_id, '--format', form], capture_output=True)

    if result.returncode != 0:
        raise Exception('Question failed with return code {}'.format(result.returncode))

    if form == "json":
        res = json.loads(result.stdout.decode('utf-8'))
    else:
        csv_string = result.stdout.decode('utf-8')
        lines = csv_string.splitlines(False)
        reader = csv.reader(lines)
        res = list(reader)
        res = [x for x in res if x]

    if isinstance(res, dict):
        if list(res.keys()) == ["status", "data"]:
            if res["status"] == "OK" and isinstance(res["data"], dict) and userConnected in ["adminTestJson", "adminTestCsv"]:
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        elif list(res.keys()) == ["status", "message"]:
            if res["status"] == "failed" and res["message"] == "User unauthorized to continue!" and userConnected not in ["adminTestJson", "adminTestCsv"]:
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        else:
            print("FAILED, wrong response data")
            return
    
    if isinstance(res, list):

        if res[0][0] == "status" and res[1][0] == "OK" and userConnected in ["adminTestJson", "adminTestCsv"]:
            print("PASSED", check_mark.decode("utf-8"))
            return
        elif res[0][0] == "status" and res[0][1] == "message" and res[1][0] == "failed" and res[1][1] == "User unauthorized to continue!" and userConnected not in ["adminTestJson", "adminTestCsv"]:
            print("PASSED", check_mark.decode("utf-8"))
            return
        else:
            print("FAILED, wrong response data")
            return
    else:
        print("FAILED, wrong response type (expected 'dict', got '" + type(res)[8:-2] + "')")
        return

    return

def run_doanswer(questionnaire_id, question_id, session_id, option_id, username, form, show = True):
    result = subprocess.run(['python', 'se2236.py', 'doanswer', '--questionnaire_id', questionnaire_id, '--question_id', question_id,
                             '--session_id', session_id, '--option_id', option_id, '--format', form], capture_output=True)

    if not show:
        return

    if result.returncode != 0:
        raise Exception('Healthcheck failed with return code {}'.format(result.returncode))

    if form == "json":
        res = json.loads(result.stdout.decode('utf-8'))
    else:
        csv_string = result.stdout.decode('utf-8')
        lines = csv_string.splitlines(False)
        reader = csv.reader(lines)
        res = list(reader)
        res = [x for x in res if x]

    if isinstance(res, dict):
        if list(res.keys()) == ["status", "message"]:
            if res["status"] == "OK" and res["message"] == "Answer submitted!" and username in ["userTestJson", "userTestCsv"]:
                print("PASSED", check_mark.decode("utf-8"))
                return
            elif res["status"] == "failed" and username not in ["userTestJson", "userTestCsv"]:
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        else:
            print("FAILED, wrong response data")
            return
    
    if isinstance(res, list):
        if res[0][0] == "status" and res[1][0] == "OK" and username not in ["adminTestJson", "adminTestCsv"]:
            print("PASSED", check_mark.decode("utf-8"))
            return
        elif res[0][0] == "status" and res[0][1] == "message" and res[1][0] == "failed" and res[1][1] == "User unauthorized to continue!" and username in ["adminTestJson", "adminTestCsv"]:
            print("PASSED", check_mark.decode("utf-8"))
            return
        else:
            print("FAILED, wrong response data")
            return
    else:
        print("FAILED, wrong response type (expected 'dict', got '" + type(res)[8:-2] + "')")
        return

    return

def run_resetq(userConnected, questionnaire_id, form):
    result = subprocess.run(['python', 'se2236.py', 'resetq', '--questionnaire_id', questionnaire_id, '--format', form], capture_output=True)

    if result.returncode != 0:
        raise Exception('Healthcheck failed with return code {}'.format(result.returncode))

    if form == "json":
        res = json.loads(result.stdout.decode('utf-8'))
    else:
        csv_string = result.stdout.decode('utf-8')
        lines = csv_string.splitlines(False)
        reader = csv.reader(lines)
        res = list(reader)
        res = [x for x in res if x]

    if isinstance(res, dict):
        if list(res.keys()) == ["status"]:
            if res["status"] == "OK" and userConnected in ["adminTestJson", "adminTestCsv"]:
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        elif list(res.keys()) == ["status", "message"]:
            if res["status"] == "failed" and res["message"] == "User unauthorized to continue!" and userConnected not in ["adminTestJson", "adminTestCsv"]:
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        else:
            print("FAILED, wrong response data")
            return
        
    elif isinstance(res, list):
        if res[0][0] == "status" and res[1][0] == "OK" and userConnected in ["adminTestJson", "adminTestCsv"]:
            print("PASSED", check_mark.decode("utf-8"))
            return
        elif res[0][0] == "status" and res[0][1] == "message" and res[1][0] == "failed" and res[1][1] == "User unauthorized to continue!" and userConnected not in ["adminTestJson", "adminTestCsv"]:
            print("PASSED", check_mark.decode("utf-8"))
            return
        else:
            print("FAILED, wrong response data")
            return
    else:
        print("FAILED, wrong response type (expected 'dict', got '" + type(res)[8:-2] + "')")
        return
    
    return

def run_getsessionanswers(userConnected, questionnaire_id, session_id, form):
    result = subprocess.run(['python', 'se2236.py', 'getsessionanswers', '--questionnaire_id', questionnaire_id, '--session_id', session_id, '--format', form], capture_output=True)

    if result.returncode != 0:
        raise Exception('Getsessionanswers failed with return code {}'.format(result.returncode))

    if form == "json":
        res = json.loads(result.stdout.decode('utf-8'))
    else:
        csv_string = result.stdout.decode('utf-8')
        lines = csv_string.splitlines(False)
        reader = csv.reader(lines)
        res = list(reader)
        res = [x for x in res if x]


    if isinstance(res, dict):
        if list(res.keys()) == ["status", "data"]:
            if res["status"] == "OK" and isinstance(res["data"], dict) and userConnected in ["adminTestJson", "adminTestCsv"]:
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        elif list(res.keys()) == ["status", "message"]:
            if res["status"] == "failed" and res["message"] == "User unauthorized to continue!" and userConnected not in ["adminTestJson", "adminTestCsv"]:
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        else:
            print("FAILED, wrong response data")
            return
    
    if isinstance(res, list):
        if res[0][0] == "status" and res[1][0] == "OK" and userConnected in ["adminTestJson", "adminTestCsv"]:
            print("PASSED", check_mark.decode("utf-8"))
            return
        elif res[0][0] == "status" and res[0][1] == "message" and res[1][0] == "failed" and res[1][1] == "User unauthorized to continue!" and userConnected not in ["adminTestJson", "adminTestCsv"]:
            print("PASSED", check_mark.decode("utf-8"))
            return
        else:
            print("FAILED, wrong response data")
            return
    else:
        print("FAILED, wrong response type (expected 'list', got '" + type(res)[8:-2] + "')")
        return

    return

def run_getquestionanswers(userConnected, questionnaire_id, question_id, form):
    result = subprocess.run(['python', 'se2236.py', 'getquestionanswers', '--questionnaire_id', questionnaire_id, '--question_id', question_id, '--format', form], capture_output=True)

    if result.returncode != 0:
        raise Exception('Getsessionanswers failed with return code {}'.format(result.returncode))

    if form == "json":
        res = json.loads(result.stdout.decode('utf-8'))
    else:
        csv_string = result.stdout.decode('utf-8')
        lines = csv_string.splitlines(False)
        reader = csv.reader(lines)
        res = list(reader)
        res = [x for x in res if x]

    if isinstance(res, dict):
        if list(res.keys()) == ["status", "data"]:
            if res["status"] == "OK" and isinstance(res["data"], dict) and userConnected in ["adminTestJson", "adminTestCsv"]:
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        elif list(res.keys()) == ["status", "message"]:
            if res["status"] == "failed" and res["message"] == "User unauthorized to continue!" and userConnected not in ["adminTestJson", "adminTestCsv"]:
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        else:
            print("FAILED, wrong response data")
            return

    if isinstance(res, list):
        # print("RES:", res)
        # print(res[0][0], res[1][0], res[0][1], res[1][1], username)

        if res[0][0] == "status" and res[1][0] == "OK" and userConnected in ["adminTestJson", "adminTestCsv"]:
            print("PASSED", check_mark.decode("utf-8"))
            return
        elif res[0][0] == "status" and res[0][1] == "message" and res[1][0] == "failed" and res[1][1] == "User unauthorized to continue!" and userConnected not in ["adminTestJson", "adminTestCsv"]:
            print("PASSED", check_mark.decode("utf-8"))
            return
        else:
            print("FAILED, wrong response data")
            return
    else:
        print("FAILED, wrong response type (expected 'list', got '" + type(res)[8:-2] + "')")
        return

    return

def run_delete(questionnaire_id, form):
    result = subprocess.run(['python', 'se2236.py', 'deleteq', '--questionnaire_id', questionnaire_id, '--format', form], capture_output=True)

    if result.returncode != 0:
        raise Exception('Getsessionanswers failed with return code {}'.format(result.returncode))

    return

def run_usermod(role, username, password, form):
    result = subprocess.run(['python', 'se2236.py', 'admin', '--usermod', role, '--username', username, '--passw', password, '--format', form], capture_output=True)
    # response = json.loads(result.stdout)
    # print(result.stdout.decode('utf-8')+"\n====================")
    # print(">>> HERE <<<")
    # print(result.stdout.decode())
    if result.returncode != 0:
        raise Exception('usermod failed with return code {}'.format(result.returncode))

    if form == "json":
        # print(result.stdout.decode('utf-8'))
        res = json.loads(result.stdout.decode('utf-8'))

        keys = list(res.keys())
        if keys == ["status"]:
            if res["status"] == "OK" and (username == "adminTestJson" or username == "userTestJson"):
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        elif keys == ["status", "message"]:
            if res["status"] == "failed" and res["message"] == "Username taken! Please provide a new username." and (username == "existingAdminTest" or username == "existingUserTest"):
                print("PASSED", check_mark.decode("utf-8"))
                return
            elif res["status"] == "failed" and res["message"] == "Invalid input data. A password must have at least 8 characters" and len(password):
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        else:
            print("FAILED, wrong response data")
            return

    elif form == "csv":
        csv_string = result.stdout.decode('utf-8')
        lines = csv_string.splitlines(False)
        reader = csv.reader(lines)
        res = list(reader)
        res = [x for x in res if x]

        if len(res) == 2:
            if res[0][0] == "status" and res[1][0] == "OK" and (username == "adminTestCsv" or username == "userTestCsv"):
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        elif len(res) == 4:
            if res[0][0] == "status" and res[1][0] == "failed" and res[1][0] == "message" and res[1][1] == "Username taken! Please provide a new username." and (username == "existingAdminTest" or username == "existingUserTest"):
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        else:
            print("FAILED, wrong response data")
            return
    else:
        print("FAILED, wrong input data")
        return
    
    # print("TYPE =", type(res))
    # if str(type(res)) == "<class '_csv.reader'>":
    #     print("GOOD")

    # if isinstance(res, dict) and len(res) == 2:
    #     if list(res.keys()) == ["status", "dbconnection"]:
    #         if res["status"] == "OK" and username == "jimv":
    #             print("PASSED", check_mark.decode("utf-8"))
    #         else:
    #             print("FAILED, wrong response data")
    #     elif list(res.keys()) == ["status", "message"]:
    #         if res["status"] == "failed" and res["message"] == "User unauthorized to continue!" and username == "TheUltraSuperAdmin":
    #             print("PASSED", check_mark.decode("utf-8"))
    #         else:
    #             print("FAILED, wrong response data")
    #     else:
    #         print("FAILED, wrong response data")
    # elif isinstance(res, list) or len(res) == 4:
    #     if res[0][0] == "status" and res[0][1] == "dbconnection":
    #         if res[1][0] == "OK" and res[1][1] == "mongodb+srv://jimv:<password>@cluster0.oav8j31.mongodb.net/?retryWrites=true&w=majority":
    #             if username == "TheUltraSuperAdmin":
    #                 print("PASSED", check_mark.decode("utf-8"))
    #             else:
    #                 print("FAILED, wrong response data")
    #     elif res[0][0] == "status" and res[0][1] == "message":
    #         if res[1][0] == "failed" and res[1][1] == "User unauthorized to continue!":
    #             if username == "jimv":
    #                 print("PASSED", check_mark.decode("utf-8"))
    #             else:
    #                 print("FAILED, wrong response data")
    #     else:
    #         print("FAILED, wrong response data")
    # else:
    #     print("FAILED, wrong response type (expected 'dict', got '" + type(res)[8:-2] + "')")

    return

def run_users(userConnected, username, form):
    result = subprocess.run(['python', 'se2236.py', 'admin', '--users', username, '--format', form], capture_output=True)
    # response = json.loads(result.stdout)
    # print(result.stdout.decode('utf-8')+"\n====================")
    # print(">>> HERE <<<")
    # print(result.stdout.decode())
    if result.returncode != 0:
        raise Exception('usermod failed with return code {}'.format(result.returncode))

    if form == "json":
        # print(result.stdout.decode('utf-8'))
        res = json.loads(result.stdout.decode('utf-8'))
        # print(">>> RES:", res)

        keys = list(res.keys())
        if keys == ["status", "user"]:
            # print(res["status"], res["user"]["role"], res["user"]["username"])
            if res["status"] == "OK" and res["user"]["role"] in ["admin", "user"] and res["user"]["username"] == "adminTestJson" and userConnected == "TheUltraSuperAdmin":
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        elif keys == ["status", "message"]:
            if res["status"] == "failed" and res["message"] == "User unauthorized to continue!" and userConnected != "TheUltraSuperAdmin":
                print("PASSED", check_mark.decode("utf-8"))
                return
            # elif res["status"] == "failed" and res["message"] == "Invalid input data. A password must have at least 8 characters" and len(password):
            #     print("PASSED", check_mark.decode("utf-8"))
            else:
                print("FAILED, wrong response data")
                return 
        else:
            print("FAILED, wrong response data")
            return

    elif form == "csv":
        csv_string = result.stdout.decode('utf-8')
        lines = csv_string.splitlines(False)
        reader = csv.reader(lines)
        res = list(reader)
        res = [x for x in res if x]
        # print(">>> RES:", res)

        if len(res) == 2:
            if res[0][0] == "status" and res[1][0] == "OK" and res[0][1] == "username" and res[1][1] == username and res[0][2] == "role" and res[1][2] in ["admin", "user"] and userConnected == "TheUltraSuperAdmin":
                print("PASSED", check_mark.decode("utf-8"))
                return
            if res[0][0] == "status" and res[1][0] == "OK" and res[0][1] == "username" and res[1][1] == username and res[0][2] == "role" and res[1][2] in ["admin", "user"] and userConnected == "TheUltraSuperAdmin":
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        elif len(res) == 2:
            if res[0][0] == "status" and res[1][0] == "failed" and res[1][0] == "message" and res[1][1] == "User unauthorized to continue!" and userConnected != "TheUltraSuperAdmin":
                print("PASSED", check_mark.decode("utf-8"))
                return
            else:
                print("FAILED, wrong response data")
                return
        else:
            print("FAILED, wrong response data")
            return
    else:
        print("FAILED, wrong input data")
        return

    return


if __name__ == '__main__':
    usernamess = ['TheUltraSuperAdmin', 'the-password-is-secret']
    usernames = {"adminJson" : ["adminTestJson", "adminTestJson123"],
                 "adminCsv"  : ["adminTestCsv", "adminTestCsv123"],
                 "userJson"  : ["userTestJson", "userTestJson123"],
                 "userCsv"   : ["userTestCsv", "userTestCsv123"]}
    passwords = ['the-password-is-secret', '123456789']
    sources = ['jtest.json']
    forms = ['json', 'csv']
    i = 1

    # ====================================================================================
    # ================================== START TESTING ===================================
    # ====================================================================================

    def toPrint(i, message, form):
        if form == "json":
            K = 68
        else:
            K = 69
        return "Test" + str(i).ljust(2, ' ') + " - " + message + "(format = " + form + ")" + "."*(K - len(message))

    try:
        # Super admin Testing
        if True:
            message = toPrint(i, "Login with super admin test ", forms[0])
            print(message, end="")
            run_login(usernamess[0], usernamess[1], forms[0], True)
            i += 1

            # print("Test", str(i).ljust(2, ' ').rjust(2, ' '), end = " - ")
            # toPrint = "Logout with super admin test (format = " + forms[0] + "):"

            message = toPrint(i, "Logout with super admin test ", forms[0])
            print(message, end="")
            # print(toPrint, end = "."*(78 - len(toPrint)))
            run_logout(forms[0])
            i += 1

            # print("Test", str(i).ljust(2, ' ').rjust(2, ' '), end = " - ")
            # print("Login with super admin test (format = " + forms[1] + ")", end = ":\t\t\t\t\t")

            message = toPrint(i, "Login with super admin test ", forms[1])
            print(message, end="")
            run_login(usernamess[0], usernamess[1], forms[0], True)
            i += 1

            # print("Test", str(i).ljust(2, ' ').rjust(2, ' '), end = " - ")
            # print("Logout with super admin test (format = " + forms[1] + ")", end = ":\t\t\t\t\t")

            message = toPrint(i, "Logout with super admin test ", forms[1])
            print(message, end="")
            run_logout(forms[0])
            i += 1

            run_login("TheUltraSuperAdmin", "the-password-is-secret", forms[0], False)

            # Healthcheck test
            # print("Test", str(i).ljust(2, ' '), end = " - ")
            # print("Healthcheck test with super admin (should be authorized) (format = " + forms[0] + ")", end = ":\t")

            message = toPrint(
                i, "Healthcheck test with super admin (should be authorized) ", forms[0])
            print(message, end="")
            run_healthcheck("TheUltraSuperAdmin", forms[0])
            i += 1

            # print("Test", str(i).ljust(2, ' '), end = " - ")
            # print("Healthcheck test with super admin (should be authorized) (format = " + forms[1] + ")", end = ":\t")

            message = toPrint(
                i, "Healthcheck test with super admin (should be authorized) ", forms[1])
            print(message, end="")
            run_healthcheck("TheUltraSuperAdmin", forms[1])
            i += 1

            print('================================== Super admin Testing completed! ==================================')

        # Creating Admin/User Testing
        if True:
            # Create admin with json format
            # print("Test", str(i).ljust(2, ' '), end = " - ")
            # print("Create admin test (format = " + forms[0] + ")", end = ":\t\t\t\t\t\t")
            
            message = toPrint(i, "Create admin test ", forms[0])
            print(message, end = "")
            run_usermod("admin", usernames["adminJson"][0], usernames["adminJson"][1], forms[0])
            i += 1
            
            # Create admin with csv format
            # print("Test", str(i).ljust(2, ' '), end = " - ")
            # print("Create admin test (format = " + forms[1] + ")", end = ":\t\t\t\t\t\t")
            
            message = toPrint(i, "Create admin test ", forms[1])
            print(message, end = "")
            run_usermod("admin", usernames["adminCsv"][0], usernames["adminCsv"][1], forms[1])
            i += 1

            # Create user with json format
            # print("Test", str(i).ljust(2, ' '), end = " - ")
            # print("Create user test (format = " + forms[0] + ")", end = ":\t\t\t\t\t\t")

            message = toPrint(i, "Create user test ", forms[0])
            print(message, end = "")
            run_usermod("user", usernames["userJson"][0], usernames["userJson"][1], forms[0])
            i += 1

            # Create user with csv format
            # print("Test", str(i).ljust(2, ' '), end = " - ")
            # print("Create user test (format = " + forms[1] + ")", end = ":\t\t\t\t\t\t")

            message = toPrint(i, "Create user test ", forms[1])
            print(message, end = "")
            run_usermod("user", usernames["userCsv"][0], usernames["userCsv"][1], forms[1])
            i += 1

            message = toPrint(i, "Users test with super admin (should be authorized) ", forms[0])
            print(message, end = "")
            run_users("TheUltraSuperAdmin", "adminTestJson", forms[0])
            i += 1

            message = toPrint(i, "Users test with super admin (should be authorized) ", forms[1])
            print(message, end = "")
            run_users("TheUltraSuperAdmin", "userTestJson", forms[1])
            i += 1

            print('============================== Creating Admin/User Testing completed! ==============================')

        # ====================================================================================
        # At this point 2 admins and 2 users are created. We will use them for further testing
        # ====================================================================================

        # Admin Testing with json format
        if True:
            # ======================= Admin Testing with json format only ========================

            message = toPrint(i, "Login test with admin ", forms[0])
            print(message, end = "")
            run_login(usernames["adminJson"][0], usernames["adminJson"][1], forms[0], True)
            i += 1

            message = toPrint(i, "Logout test with admin ", forms[0])
            print(message, end = "")
            run_logout(forms[0])
            i += 1

            run_login(usernames["adminJson"][0], usernames["adminJson"][1], forms[0], False)

            message = toPrint(i, "Healthcheck test with admin (should not be authorized) ", forms[0])
            print(message, end = "")
            run_healthcheck(usernames["adminJson"][0], forms[0])
            i += 1

            run_delete("UTEST", forms[0])

            message = toPrint(i, "Questionnaire_upd test with admin (should be authorized) ", forms[0])
            print(message, end = "")
            run_questionnaire_upd(usernames["adminJson"][0], "UTEST", False, "jtest.txt", forms[0])
            i += 1

            message = toPrint(i, "Questionnaire_upd test with admin (duplicate IDs, should reject) ", forms[0])
            print(message, end = "")
            run_questionnaire_upd(usernames["adminJson"][0], "UTEST", True, "jtest.txt", forms[0])
            i += 1

            message = toPrint(i, "Questionnaire test with admin (should be authorized) ", forms[0])
            print(message, end = "")
            run_questionnaire(usernames["adminJson"][0], "UTEST", forms[0])
            i += 1

            message = toPrint(i, "Question test with admin (should be authorized) ", forms[0])
            print(message, end = "")
            run_question(usernames["adminJson"][0], "UTEST", "U01", forms[0])
            i += 1

            message = toPrint(i, "Doanswer test with admin (should not be authorized) ", forms[0])
            print(message, end = "")
            run_doanswer("UTEST", "U01", "1234", "U01A1", usernames["adminJson"][0], forms[0])
            i += 1

            run_login(usernames["userJson"][0], usernames["userJson"][1], forms[0], False)
            run_doanswer("UTEST", "U01", "1234", "U01A1", usernames["userJson"][0], forms[0], False)
            run_login(usernames["adminJson"][0], usernames["adminJson"][1], forms[0], False)

            message = toPrint(i, "Getsessionanswers test with admin (should be authorized) ", forms[0])
            print(message, end = "")
            run_getsessionanswers(usernames["adminJson"][0], "UTEST", "1234", forms[0])
            i += 1

            message = toPrint(i, "Getquestionanswers test with admin (should be authorized) ", forms[0])
            print(message, end = "")
            run_getquestionanswers(usernames["adminJson"][0], "UTEST", "U01", forms[0])
            i += 1

            message = toPrint(i, "Resetq test with admin (should be authorized) ", forms[0])
            print(message, end = "")
            run_resetq(usernames["adminJson"][0], "UTEST", forms[0])
            i += 1

            print("============================= Admin Testing with json format Completed  ============================")

        # Admin Testing with csv format
        if True:
            # =====================================================================================
            # ======================== Admin Testing with csv format only  ========================

            # Login admin with csv format
            # print("Test", str(i).ljust(2, ' '), end = " - ")
            # print("Login test with admin (format = " + forms[1] + ")", end = ":\t\t\t\t\t\t")

            message = toPrint(i, "Login test with admin ", forms[1])
            print(message, end = "")
            run_login(usernames["adminCsv"][0], usernames["adminCsv"][1], forms[1], True)
            i += 1

            # Logout admin with csv format
            # print("Test", str(i).ljust(2, ' '), end = " - ")
            # print("Logout test with admin (format = " + forms[1] + ")", end = ":\t\t\t\t\t")

            message = toPrint(i, "Logout test with admin ", forms[1])
            print(message, end = "")
            run_logout(forms[1])
            i += 1

            run_login(usernames["adminCsv"][0], usernames["adminCsv"][1], forms[1], False)

            # Healthcheck admin with json format
            # print("Test", str(i).ljust(2, ' '), end = " - ")
            # print("Healthcheck test with admin (should not be authorized) (format = " + forms[1] + ")", end = ":\t")

            message = toPrint(i, "Healthcheck test with admin (should not be authorized) ", forms[1])
            print(message, end = "")
            run_healthcheck(usernames["adminCsv"][0], forms[1])
            i += 1

            # Questionnaire_upd admin with json format
            # print("Test", str(i).ljust(2, ' '), end = " - ")
            # print("Questionnaire_upd test with admin (should be authorized) (format = " + forms[1] + ")", end = ":\t")

            run_delete("CTEST", forms[0])

            #!!!!!!!!!!!!!!!!
            message = toPrint(i, "Questionnaire_upd test with admin (should be authorized) ", forms[1])
            print(message, end = "")
            run_questionnaire_upd(usernames["adminCsv"][0], "CTEST", False, "ctest.txt", forms[1])
            i += 1

            message = toPrint(i, "Questionnaire_upd test with admin (duplicate IDs, should reject) ", forms[1])
            print(message, end = "")
            run_questionnaire_upd(usernames["adminCsv"][0], "CTEST", True, "ctest.txt", forms[1])
            i += 1

            message = toPrint(i, "Questionnaire test with admin (should be authorized) ", forms[1])
            print(message, end = "")
            run_questionnaire(usernames["adminCsv"][0], "CTEST", forms[1])
            i += 1
            
            # adminJson: ADJ01, Q01, 1234, a
            message = toPrint(i, "Question test with admin (should be authorized) ", forms[1])
            print(message, end = "")
            run_question(usernames["adminCsv"][0], "CTEST", "C01", forms[1])
            i += 1

            message = toPrint(i, "Doanswer test with admin (should not be authorized) ", forms[1])
            print(message, end = "")
            run_doanswer("CTEST", "C01", "1234", "C01A1", usernames["adminCsv"][0], forms[1])
            i += 1

            run_login(usernames["userCsv"][0], usernames["userCsv"][1], forms[1], False)
            run_doanswer("CTEST", "C01", "1234", "C01A1", usernames["adminCsv"][0], forms[1], False)
            run_login(usernames["adminCsv"][0], usernames["adminCsv"][1], forms[1], False)

            message = toPrint(i, "Getsessionanswers test with admin (should be authorized) ", forms[1])
            print(message, end = "")
            run_getsessionanswers(usernames["adminCsv"][0], "CTEST", "1234", forms[1])
            i += 1

            message = toPrint(i, "Getquestionanswers test with admin (should be authorized) ", forms[1])
            print(message, end = "")
            run_getquestionanswers(usernames["adminCsv"][0], "CTEST", "C01", forms[1])
            i += 1

            message = toPrint(i, "Resetq test with admin (should be authorized) ", forms[1])
            print(message, end = "")
            run_resetq(usernames["adminCsv"][0], "CTEST", forms[1])
            i += 1

            print("============================= Admin Testing with csv format Completed  =============================")

        # user Testing with json format
        if True:
            # =====================================================================================
            # ======================== User Testing with json format only =========================

            message = toPrint(i, "Login test with user ", forms[0])
            print(message, end = "")
            run_login(usernames["userJson"][0], usernames["userJson"][1], forms[0], True)
            i += 1

            message = toPrint(i, "Logout test with user ", forms[0])
            print(message, end = "")
            run_logout(forms[1])
            i += 1

            run_login(usernames["userJson"][0], usernames["userJson"][1], forms[0], False)

            message = toPrint(i, "Healthcheck test with user (should not be authorized) ", forms[0])
            print(message, end = "")
            run_healthcheck(usernames["userJson"][0], forms[0])
            i += 1

            message = toPrint(i, "Questionnaire_upd test with user (should not be authorized) ", forms[0])
            print(message, end = "")
            run_questionnaire_upd(usernames["userJson"][0], "UTEST", False, "jtest.txt", forms[0])
            i += 1

            message = toPrint(i, "Questionnaire test with user (should not be authorized) ", forms[0])
            print(message, end = "")
            run_questionnaire(usernames["userJson"][0], "UTEST", forms[0])
            i += 1

            # userJson: ADJ01, Q01, 1234, a
            message = toPrint(i, "Question test with user (should not be authorized) ", forms[0])
            print(message, end = "")
            run_question(usernames["userJson"][0], "UTEST", "U01", forms[0])
            i += 1

            run_login(usernames["adminJson"][0], usernames["adminJson"][1], forms[0], False)
            run_delete("UTEST", forms[0])
            run_questionnaire_upd(usernames["adminJson"][0], "UTEST", False, "jtest.txt", forms[0], False)
            run_login(usernames["userJson"][0], usernames["userJson"][1], forms[0], False)
            
            message = toPrint(i, "Doanswer test with user (should be authorized) ", forms[0])
            print(message, end = "")
            run_doanswer("UTEST", "U01", "1234", "U01A1", usernames["userJson"][0], forms[0])
            i += 1

            message = toPrint(i, "Getsessionanswers test with user (should not be authorized) ", forms[0])
            print(message, end = "")
            run_getsessionanswers(usernames["userJson"][0], "UTEST", "1234", forms[0])
            i += 1

            message = toPrint(i, "Getquestionanswers test with user (should not be authorized) ", forms[0])
            print(message, end = "")
            run_getquestionanswers(usernames["userJson"][0], "UTEST", "U01", forms[0])
            i += 1

            message = toPrint(i, "Resetq test with user (should not be authorized) ", forms[0])
            print(message, end = "")
            run_resetq(usernames["userJson"][0], "UTEST", forms[0])
            i += 1

            print("============================= user Testing with json format Completed  =============================")

        # user Testing with csv format
        if True:
            # =====================================================================================
            # ========================= User Testing with csv format only  ========================

            message = toPrint(i, "Login test with user ", forms[1])
            print(message, end = "")
            run_login(usernames["userCsv"][0], usernames["userCsv"][1], forms[1], True)
            i += 1

            message = toPrint(i, "Logout test with user ", forms[1])
            print(message, end = "")
            run_logout(forms[1])
            i += 1

            run_login(usernames["userCsv"][0], usernames["userCsv"][1], forms[1], False)

            message = toPrint(i, "Healthcheck test with user (should not be authorized) ", forms[1])
            print(message, end = "")
            run_healthcheck(usernames["userCsv"][0], forms[1])
            i += 1

            message = toPrint(i, "Questionnaire_upd test with user (should not be authorized) ", forms[1])
            print(message, end = "")
            run_questionnaire_upd(usernames["userCsv"][0], "CTEST", False, "jtest.txt", forms[1])
            i += 1

            message = toPrint(i, "Questionnaire test with user (should not be authorized) ", forms[1])
            print(message, end = "")
            run_questionnaire(usernames["userCsv"][0], "CTEST", forms[1])
            i += 1

            message = toPrint(i, "Question test with user (should not be authorized) ", forms[1])
            print(message, end = "")
            run_question(usernames["userCsv"][0], "CTEST", "C01", forms[1])
            i += 1

            run_login(usernames["adminJson"][0], usernames["adminJson"][1], forms[1], False)
            run_delete("CTEST", forms[1])
            run_questionnaire_upd(usernames["adminJson"][0], "CTEST", False, "jtest.txt", forms[1], False)
            run_login(usernames["userCsv"][0], usernames["userCsv"][1], forms[1], False)
            
            message = toPrint(i, "Doanswer test with user (should be authorized) ", forms[1])
            print(message, end = "")
            run_doanswer("CTEST", "C01", "1234", "C01A1", usernames["userCsv"][0], forms[1])
            i += 1

            message = toPrint(i, "Getsessionanswers test with user (should not be authorized) ", forms[1])
            print(message, end = "")
            run_getsessionanswers(usernames["userCsv"][0], "CTEST", "1234", forms[1])
            i += 1

            message = toPrint(i, "Getquestionanswers test with user (should not be authorized) ", forms[1])
            print(message, end = "")
            run_getquestionanswers(usernames["userCsv"][0], "CTEST", "C01", forms[1])
            i += 1

            message = toPrint(i, "Resetq test with user (should not be authorized) ", forms[1])
            print(message, end = "")
            run_resetq(usernames["userCsv"][0], "CTEST", forms[1])
            i += 1

            print("============================== user Testing with csv format Completed  =============================")

    except Exception as e:
        print('Healthcheck failed: {}'.format(e))
