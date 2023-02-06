import subprocess
import json
import csv


check_mark = "\u2713".encode("utf-8")

def load_variable_from_file():
    with open("token.txt", "r") as file:
        return str(file.read())

def run_login(username, password, form, output = True):
    result = subprocess.run(['python', 'cli0502.py', 'login', '--username', username, '--passw', password, '--format', form], capture_output=True)
    # response = json.loads(result.stdout)
    # print(result.stdout.decode('utf-8')+"\n====================")
    res = json.loads(result.stdout.decode('utf-8'))
    if result.returncode != 0:
        raise Exception('Login failed with return code {}'.format(result.returncode))
    if isinstance(res, dict) and len(res) == 1:
        if next(iter(res)) == "token":
            if (output):
                print("PASSED", check_mark.decode("utf-8"))
        else:
            if (output):
                print("FAILED, wrong response data")
    else:
        if (output):
            print("FAILED, wrong response type (expected 'dict', got '" + type(res)[8:-2] + "')")

    return

def run_logout(username, password, form):
    run_login(username, password, form, False)
    result = subprocess.run(['python', 'cli0502.py', 'logout', '--format', form], capture_output=True)
    # response = json.loads(result.stdout)
    # print(result.stdout.decode('utf-8')+"\n====================")
    if form == "json":
        res = json.loads(result.stdout.decode('utf-8'))
    else:        
        res = json.loads(result.stdout.decode('utf-8')) # TEMPORARY UNTIL CSV BUG FIXED        
        # csv_reader = csv.reader(result.stdout.decode('utf-8').splitlines())
        # for row in csv_reader:
        #     print(row)
        
    if result.returncode != 0:
        raise Exception('Logout failed with return code {}'.format(result.returncode))
    if isinstance(res, dict) and len(res) == 2:
        if list(res.keys()) == ["status", "message"]:
            if (res["status"] == "OK" and res["message"] == "You are successfully logged out."):    # !! Already logged out
                print("PASSED", check_mark.decode("utf-8"))
        else:
            print("FAILED, wrong response data")
    else:
        print("FAILED, wrong response type (expected 'dict', got '" + type(res)[8:-2] + "')")

    return

def run_healthcheck(username, password, form):
    run_login(username, password, form, False)
    result = subprocess.run(['python', 'cli0502.py', 'healthcheck', '--format', 'json'], capture_output=True)
    # response = json.loads(result.stdout)
    # print("=====")
    # print(result.stdout.decode())
    # print("=====")

    if result.returncode != 0:
        raise Exception('Healthcheck failed with return code {}'.format(result.returncode))

    if form == "json":
        res = json.loads(result.stdout.decode('utf-8'))
    else:
        res = json.loads(result.stdout.decode('utf-8')) # TEMPORARY UNTIL CSV BUG FIXED        
        # csv_reader = csv.reader(result.stdout.decode('utf-8').splitlines())
        # for row in csv_reader:
        #     print(row)

    if isinstance(res, dict) and len(res) == 2:
        if list(res.keys()) == ["status", "message"]:
            if res["status"] == "no operation" and res["message"] == "I'm a teapot" and username == "TheUltraSuperAdmin":
                print("PASSED", check_mark.decode("utf-8"))
            elif res["status"] == "failed" and res["message"] == "User unauthorized to continue!" and username == "jimv":
                print("PASSED", check_mark.decode("utf-8"))
            else:
                print("FAILED, wrong response data")
        else:
            print("FAILED, wrong response data")
    else:
        print("FAILED, wrong response type (expected 'dict', got '" + type(res)[8:-2] + "')")

    return

# NOT DONE!!!
def run_resetall():
    result = subprocess.run(['python', 'cli0302.py', 'resetall', '--format', 'json'], capture_output=True)
    # response = json.loads(result.stdout)
    print("=====")
    print(result.stdout.decode())
    print("=====")

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

def run_questionnaire_upd(username, password, source, form):
    run_login(username, password, form, False)
    result = subprocess.run(['python', 'cli0502.py', 'questionnaire_upd', '--source', source, '--format', form], capture_output=True)

    if result.returncode != 0:
        raise Exception('Questionnaire_upd failed with return code {}'.format(result.returncode))

    if form == "json":
        res = json.loads(result.stdout.decode('utf-8'))
    else:
        res = json.loads(result.stdout.decode('utf-8')) # TEMPORARY UNTIL CSV BUG FIXED        
        # csv_reader = csv.reader(result.stdout.decode('utf-8').splitlines())
        # for row in csv_reader:
        #     print(row)

    if isinstance(res, dict) and len(res) == 2:
        if list(res.keys()) == ["status", "message"]:
            if res["status"] == "no operation" and res["message"] == "I'm a teapot" and username == "jimv":
                print("PASSED", check_mark.decode("utf-8"))
            elif res["status"] == "failed" and res["message"] == "User unauthorized to continue!" and username == "TheUltraSuperAdmin":
                print("PASSED", check_mark.decode("utf-8"))
            else:
                print("FAILED, wrong response data")
        else:
            print("FAILED, wrong response data")
    else:
        print("FAILED, wrong response type (expected 'dict', got '" + type(res)[8:-2] + "')")

    return

if __name__ == '__main__':
    usernames = ['TheUltraSuperAdmin', 'jimv']
    passwords = ['the-password-is-secret', '123456789']
    sources = ['jtest.json']
    forms = ['json', 'csv']
    
    for i in range(len(usernames)):
        for form in forms:
            print('Login test ' + str(i + 1) + " (format = " + form + ")", end = ":\t\t\t")
            run_login(usernames[i], passwords[i], form, True)
    print('=============== Login Testing completed! ===============')

    for i in range(len(usernames)):
        for form in forms:
            print('Logout test ' + str(i + 1) + " (format = " + form + ")", end = ":\t\t\t")
            run_logout(usernames[i], passwords[i], form)
    print('=============== Logout Testing completed! ==============')

    for i in range(len(usernames)):
        for form in forms:
            print('Healthcheck test ' + str(i + 1) + " (format = " + form + ")", end = ":\t\t")
            run_healthcheck(usernames[i], passwords[i], form)
    print('============ Healthcheck Testing completed! ============')
    
    for i in range(len(usernames)):
        for j in range(len(sources)):
            for form in forms:
                print('Questionnaire_upd test ' + str(i*len(sources) + j + 1) + " (format = " + form + ")", end = ":\t")
                run_questionnaire_upd(usernames[i], passwords[i], sources[j], form)
    print('======== Questionnaire_upd Testing completed! ========')

    try:
        print("e")

    except Exception as e:
        print('Healthcheck failed: {}'.format(e))
