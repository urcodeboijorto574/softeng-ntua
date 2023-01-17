import argparse
import requests

baseUrl = "http://localhost:8000/"

loginEndpoint = "http://localhost:8000/endpoint"

def login(username, password, form):
    print("Will sent username:", username, "and password:", password)
    if form == "json":
        print("=== json ===")
        print(isinstance(username, str))
        data = {"username": username, "password": password}
        headers = {"Content-Type": "application/json"}
        response = requests.post(loginEndpoint, json=data, headers=headers)
    elif form == "csv":
        print("=== csv ===")
        data = f"{username},{password}"
        headers = {"Content-Type": "text/csv"}
        response = requests.post(loginEndpoint, data=data, headers=headers)
    else:
        raise ValueError("Invalid format specified. Must be 'json' or 'csv'.")

    
    return response

def logout():
    print("Will logout")
    return

def healthcheck():
    healthUrl = baseUrl + "admin/healthcheck"
    print("Will perform a healthcheck at", healthUrl)
    response = requests.get(healthUrl)
    if response.status_code == 200:
        data = response.json()
        status = data['status']
        dbconnection = data['dbconnection']
        if status == "OK":
            print(f"Connection successful: {dbconnection}")
        else:
            print(f"Connection failed: {dbconnection}")
    else:
        print("Error: Unable to reach endpoint")
    
    return

def resetall():
    print("Will resetall")
    responseUrl = baseUrl + "admin/resetall"
    response = requests.post(responseUrl)
    if response.status_code == 200:
        data = response.json()
        status = data['status']
        if status == "OK":
            print("Data reset successful")
        else:
            reason = data['reason']
            print(f"Data reset failed: {reason}")
    else:
        print("Error: Unable to reach endpoint")
    
    return

def questionnaire_upd(source, form):
    updUrl = baseUrl + "admin/" + source
    print("Will update at source:", updUrl)

    if (form == "json"):
        print("=== json ===")
    elif (form == "csv"):
        print("=== csv ===")
    else:
        print("Wrong format")
    
    
    return

def resetq(questionnaire_id, form):
    resetqUrl = baseUrl + f"admin/resetq/{questionnaire_id}"
    print("Will reset questionnaire at", resetqUrl)
    response = requests.post(resetqUrl)
    if response.status_code == 200:
        data = response.json()
        status = data['status']
        if status == "OK":
            print("Data reset successful")
        else:
            reason = data['reason']
            print(f"Data reset failed: {reason}")
    else:
        print("Error: Unable to reach endpoint")
    
    return

def questionnaire(questionnaire_id):
    print("Will get questionnaire with id:", questionnaire_id)
    return

def question(questionnaire_id, question_id):
    print("Will get from questionnaire with id:", questionnaire_id,
          "question with id:", question_id)
    return

def doanswer(questionnaire_id, question_id, session_id, option_id):
    print("Will answer from questionnaire with id:", questionnaire_id,
          "question with id:", question_id, "of session with id:", session_id,
          "and option with id:", option_id)
    return

def getsessionanswers(questionnaire_id, session_id):
    print("Will get session answers of questionnaire with id:", questionnaire_id,
          "and session with id:", session_id)
    return

def getquestionanswers(questionnaire_id, question_id):
    print("Will get question answers of questionnaire with id:", questionnaire_id,
          "and question with id:", question_id)
    return

def admin(username, password):
    print("Will sent username:", username, "and password:", password)
    return




parser = argparse.ArgumentParser()

subparser = parser.add_subparsers(dest = "command")

### LOGIN PARSER ###
login_parser = subparser.add_parser("login", help = "login")
login_parser.add_argument("--username", nargs = 1)
login_parser.add_argument("--passw", nargs = 1)
login_parser.add_argument("--format", nargs = 1)
####################

### LOGOUT PARSER ###
logout_parser = subparser.add_parser("logout", help = "logout")
logout_parser.add_argument("--format", nargs = 1)
#####################

### HEALTHCHECK PARSER ###
healthcheck_parser = subparser.add_parser("healthcheck", help = "healthcheck")
healthcheck_parser.add_argument("--format", nargs = 1)
##########################

### RESETALL PARSER ###
resetall_parser = subparser.add_parser("resetall", help = "resetall")
resetall_parser.add_argument("--format", nargs = 1)
#######################

### QUESTIONNAIRE_UPD PARSER ###
questionnaire_upd_parser = subparser.add_parser("questionnaire_upd", help = "questionnaire_upd")
questionnaire_upd_parser.add_argument("--source", nargs = 1)
questionnaire_upd_parser.add_argument("--format", nargs = 1)
################################

### RESETQ PARSER ###
resetq_parser = subparser.add_parser("resetq", help = "resetq")
resetq_parser.add_argument("--questionnaire_id", nargs = 1)
resetq_parser.add_argument("--format", nargs = 1)
#####################

### QUESTIONNAIRE PARSER ###
questionnaire_parser = subparser.add_parser("questionnaire", help = "questionnaire")
questionnaire_parser.add_argument("--questionnaire_id", nargs = 1)
questionnaire_parser.add_argument("--format", nargs = 1)
############################

### QUESTION PARSER ###
question_parser = subparser.add_parser("question", help = "question")
question_parser.add_argument("--questionnaire_id", nargs = 1)
question_parser.add_argument("--question_id", nargs = 1)
question_parser.add_argument("--format", nargs = 1)
####################

### DOANSWER PARSER ###
doanswer_parser = subparser.add_parser("doanswer", help = "doanswer")
doanswer_parser.add_argument("--questionnaire_id", nargs = 1)
doanswer_parser.add_argument("--question_id", nargs = 1)
doanswer_parser.add_argument("--session_id", nargs = 1)
doanswer_parser.add_argument("--option_id", nargs = 1)
doanswer_parser.add_argument("--format", nargs = 1)
#######################

### GETSESSIONANSWERS PARSER ###
getsessionanswers_parser = subparser.add_parser("getsessionanswers", help = "getsessionanswers")
getsessionanswers_parser.add_argument("--questionnaire_id", nargs = 1)
getsessionanswers_parser.add_argument("--session_id", nargs = 1)
getsessionanswers_parser.add_argument("--format", nargs = 1)
################################

### GETQUESTIONANSWERS PARSER ###
getquestionanswers_parser = subparser.add_parser("getquestionanswers", help = "getquestionanswers")
getquestionanswers_parser.add_argument("--questionnaire_id", nargs = 1)
getquestionanswers_parser.add_argument("--question_id", nargs = 1)
getquestionanswers_parser.add_argument("--format", nargs = 1)
#################################

### ADMIN PARSER ###
admin_parser = subparser.add_parser("admin", help = "admin")
admin_subparsers = admin_parser.add_subparsers()
####################

####################
adminUpd_parser = admin_subparsers.add_parser("questionnaire_upd", help = "questionnaire_upd")
adminUpd_parser.add_argument("--source", nargs = 1)
adminUpd_parser.add_argument("--format", nargs = 1) 

####################

### ADMINUSERMOD PARSER ###
adminUserMod_parser = admin_subparsers.add_parser("--usermod", help = "adminUserMod")
adminUserMod_parser.add_argument("--username", nargs = 1)
adminUserMod_parser.add_argument("--passw", nargs = 1)
adminUserMod_parser.add_argument("--format", nargs = 1)
###########################

### ADMINUSERNAME PARSER ###
adminUsername_parser = admin_subparsers.add_parser("--username", help = "adminUsername")
adminUsername_parser.add_argument("--username", nargs = 1)
adminUsername_parser.add_argument("--format", nargs = 1)
############################

### ADMINPASSWORD PARSER ###
adminPassword_parser = admin_subparsers.add_parser("--passw", help = "adminPassword")
adminPassword_parser.add_argument("--format", nargs = 1)
############################

### ADMINUSERS PARSER ###
adminUsers_parser = admin_subparsers.add_parser("--users", help = "adminUsers")
adminUsers_parser.add_argument("--format", nargs = 1)
#########################

args = parser.parse_args()

print(args)

if (args.command == "login"):
    login(args.username[0], args.passw[0], args.format[0])

if (args.command == "logout"):
    logout()

if (args.command == "healthcheck"):
    healthcheck()

if (args.command == "resetall"):
    resetall()

if (args.command == "questionnaire_upd"):
    questionnaire_upd(args.source[0], args.format[0])

if (args.command == "resetq"):
    resetq(args.questionnaire_id[0], args.format[0])

if (args.command == "questionnaire"):
    questionnaire(args.questionnaire_id[0], args.format[0])

if (args.command == "question"):
    question(args.questionnaire_id[0], args.question_id[0], args.format[0])

if (args.command == "doanswer"):
    doanswer(args.questionnaire_id[0], args.question_id[0],
             args.session_id[0], args.option_id[0], args.format[0])
    
if (args.command == "getsessionanswers"):
    getsessionanswers(args.questionnaire_id[0], args.session_id[0], args.format[0])
    
if (args.command == "getquestionanswers"):
    getquestionanswers(args.questionnaire_id[0], args.question_id[0], args.format[0])
    
if (args.command == "admin"):
    admin(args)





