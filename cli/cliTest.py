import subprocess
import json
import csv

def run_login(username, password, form):
    result = subprocess.run(['python', 'cli0302.py', 'login', '--username', username, '--passw', password, '--format', form], capture_output=True)
    # response = json.loads(result.stdout)
    # print(result.stdout.decode('utf-8')+"\n====================")
    res = json.loads(result.stdout.decode('utf-8'))
    if result.returncode != 0:
        raise Exception('Login failed with return code {}'.format(result.returncode))
    if isinstance(res, dict) and len(res) == 1:
        if next(iter(res)) == "token":
            print("PASSED")
        else:
            print("FAILED, wrong response data")
    else:
        print(type(res))
        print("FAILED, wrong response type (expected 'dict', got '" + type(res)[8:-2] + "')")

    return

def run_logout(username, password, form):
    run_login(username, password, form)
    result = subprocess.run(['python', 'cli0302.py', 'logout', '--format', form], capture_output=True)
    # response = json.loads(result.stdout)
    # print(result.stdout.decode('utf-8')+"\n====================")
    if form == "json":
        res = json.loads(result.stdout.decode('utf-8'))
    else:
        csv_reader = csv.reader(result.stdout.decode('utf-8').splitlines())
        for row in csv_reader:
            print(row)
        
    if result.returncode != 0:
        raise Exception('Logout failed with return code {}'.format(result.returncode))
    if isinstance(res, dict) and len(res) == 1:
        if next(iter(res)) == "status" and next(iter(res)) == "message":
            if (res["status"] == "OK" and res["message"] == "You are successfully logged out."):    # !! Already logged out
                print("PASSED")
        else:
            print("FAILED, wrong response data")
    else:
        print(type(res))
        print("FAILED, wrong response type (expected 'dict', got '" + type(res)[8:-2] + "')")

    return

def run_healthcheck():
    result = subprocess.run(['python', 'cli.py', 'healthcheck', '--format', 'json'], capture_output=True)
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

if __name__ == '__main__':
    usernames = ['TheUltraSuperAdmin']
    passwords = ['the-password-is-secret']
    forms = ['json', 'csv']

    
    
    try:
        for i in range(len(usernames)):
            for form in forms:
                print('Login test ' + str(i + 1) + " (format = " + form + ")", end = ":\t")
                run_login(usernames[i], passwords[i], form)
        print('====== Login Testing completed! ======')

        for i in range(len(usernames)):
            for form in forms:
                print('Logout test ' + str(i + 1) + " (format = " + form + ")", end = ":\t")
                run_logout(usernames[i], passwords[i], form)
        print('====== Login Testing completed! ======')

    except Exception as e:
        print('Healthcheck failed: {}'.format(e))
