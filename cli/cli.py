import argparse
import requests
import sys
import json
import pandas as pd
from io import StringIO

baseUrl = "http://localhost:8000/"

loginEndpoint = "http://localhost:8000/endpoint"

def unknownArgsHandler(unknown):
    print("Error: Unrecognized arguments passed.\nGot: ")
    for i in range(len(unknown) - 1):
        print(unknown[i], end = ", ")
    print(unknown[-1])
    print("\nWhile expecting at least one of:")
    print("--usermod, --username, --passw, --users")
    print("\nExiting...")
    exit()

# login: NOT DONE
def login(username, password, form):
    """"""
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

    if response.status_code == 200:
        if form == "json":
            print("form:", form)
            json_data = response.json()
            json_formatted_str = json.dumps(json_data, indent=2)
            print(json_formatted_str)
        else:
            print("form:", form)
            csv_data = response.content.decode('utf-8')
            print(csv_data)
            df = pd.read_csv(StringIO(csv_data))
            print(df.to_string())
    else:
        print("Error: Unable to reach endpoint")
    
    return response

# logout: NOT DONE
def logout(form):
    """ Posts with no body and expect a response.
        If status == 200: success
        Else: gives reason"""
    print("Will logout")
    logoutUrl = baseUrl + "logout"
    response = requests.post(logoutUrl)
    if response.status_code == 200:
        if form == "json":
            print("form:", form)
            json_data = response.json()
            json_formatted_str = json.dumps(json_data, indent=2)
            print(json_formatted_str)
        else:
            print("form:", form)
            csv_data = response.content.decode('utf-8')
            print(csv_data)
            df = pd.read_csv(StringIO(csv_data))
            print(df.to_string())
    else:
        print("Error: Unable to reach endpoint")

    return

# login -> returned response with json containing username and a field blah 

# healthcheck: DONE
def healthcheck(form):
    """ Performs healthcheck.
        If status_code == 200:
            If status == OK: prints dbconnection
            Else: prints dbconnection
        Else: gives reason"""
    #healthUrl = baseUrl + "admin/healthcheck"
    healthUrl = "http://127.0.0.1:3000/intelliq_api/admin/healthcheck?format=" + form
    print("Will perform a healthcheck at", healthUrl)
    response = requests.get(healthUrl)
    if response.status_code == 200:
        if form == "json":
            print("form:", form)
            json_data = response.json()
            json_formatted_str = json.dumps(json_data, indent=2)
            print(json_formatted_str)
        else:
            print("form:", form)
            csv_data = response.content.decode('utf-8')
            print(csv_data)
            df = pd.read_csv(StringIO(csv_data))
            print(df.to_string())
    else:
        print("Error: Unable to reach endpoint")
    
    return

# resetall: TO CHECK
def resetall(form):
    print("Will resetall")
    resetallUrl = baseUrl + "admin/resetall"
    response = requests.post(resetallUrl)
    if response.status_code == 200:
        if form == "json":
            print("form:", form)
            json_data = response.json()
            json_formatted_str = json.dumps(json_data, indent=2)
            print(json_formatted_str)
        else:
            print("form:", form)
            csv_data = response.content.decode('utf-8')
            print(csv_data)
            df = pd.read_csv(StringIO(csv_data))
            print(df.to_string())
    else:
        print("Error: Unable to reach endpoint")
    
    return

# questionnaire_upd: TO CHECK
def questionnaire_upd(source, form):
    #Just uploads a json, WHY DO WE NEED FORMAT???
    updUrl = baseUrl + "admin/questionnaire_upd"
    print("Will update at source:", updUrl)
    with open(source) as json_file:
        json_data = json.load(json_file)
        print("Will sent:\n", json_data)
        headers = {"Content-Type": "application/json"}
        response = requests.post(loginEndpoint, json=json_data, headers=headers)
    if response.status_code == 200:
        if form == "json":
            print("form:", form)
            json_data = response.json()
            json_formatted_str = json.dumps(json_data, indent=2)
            print(json_formatted_str)
        else:
            print("form:", form)
            csv_data = response.content.decode('utf-8')
            print(csv_data)
            df = pd.read_csv(StringIO(csv_data))
            print(df.to_string())
    else:
        print("Error: Unable to reach endpoint")
    
    return

# resetq: TO CHECK
def resetq(questionnaire_id, form):
    resetqUrl = baseUrl + f"admin/resetq/{questionnaire_id}"
    print("Will reset questionnaire at", resetqUrl)
    response = requests.post(resetqUrl)
    if response.status_code == 200:
        if form == "json":
            print("form:", form)
            json_data = response.json()
            json_formatted_str = json.dumps(json_data, indent=2)
            print(json_formatted_str)
        else:
            print("form:", form)
            csv_data = response.content.decode('utf-8')
            print(csv_data)
            df = pd.read_csv(StringIO(csv_data))
            print(df.to_string())
    else:
        print("Error: Unable to reach endpoint")
    
    return

# questionnaire: TO CHECK
def questionnaire(questionnaire_id, form):
    print("Will get questionnaire with id:", questionnaire_id)
    questionnaireUrl = baseUrl + f"admin/questionnaire/{questionnaire_id}"
    response = requests.get(questionnaireUrl)
    if response.status_code == 200:
        if form == "json":
            print("form:", form)
            json_data = response.json()
            json_formatted_str = json.dumps(json_data, indent=2)
            print(json_formatted_str)
        else:
            print("form:", form)
            csv_data = response.content.decode('utf-8')
            print(csv_data)
            df = pd.read_csv(StringIO(csv_data))
            print(df.to_string())
    else:
        print("Error: Unable to reach endpoint")
    
    return

# question: TO DISCUSS & CHECK
def question(questionnaire_id, question_id, form):
    print("Will get from questionnaire with id:", questionnaire_id,
          "question with id:", question_id)
    questionUrl = baseUrl + f"admin/question/{questionnaire_id}/{question_id}"
    response = requests.get(questionUrl)
    if response.status_code == 200:
        if form == "json":
            print("form:", form)
            json_data = response.json()
            json_formatted_str = json.dumps(json_data, indent=2)
            print(json_formatted_str)
        else:
            print("form:", form)
            csv_data = response.content.decode('utf-8')
            print(csv_data)
            df = pd.read_csv(StringIO(csv_data))
            print(df.to_string())
    else:
        print("Error: Unable to reach endpoint")

    return

# doanswer: TO DISCUSS & CHECK
def doanswer(questionnaire_id, question_id, session_id, option_id, form):
    print("Will answer from questionnaire with id:", questionnaire_id,
          "question with id:", question_id, "of session with id:", session_id,
          "and option with id:", option_id)
    doanswerUrl = baseUrl + f"/doanswer/{questionnaire_id}/{question_id}/{session_id}/{option_id}"
    json_data = {
        "questionnaireID" : questionnaire_id,
        "questionID" : question_id,
        "session" : session_id,
        "optionID" : option_id
    }
    
    response = requests.post(doanswerUrl, json = json_data)
    if response.status_code == 200:
        if form == "json":
            json_data = response.json()
            print(json_data)
        else:
            csv_data = response.content.decode('utf-8')
            print(csv_data)
    else:
        print("Error: Unable to reach endpoint")
    
    return

# getsessionanswers: TO DISCUSS & CHECK
def getsessionanswers(questionnaire_id, session_id, form):
    print("Will get session answers of questionnaire with id:", questionnaire_id,
          "and session with id:", session_id)
    getsessionanswersUrl = baseUrl + f"getsessionanswers/{questionnaire_id}/{session_id}"
    response = requests.get(getsessionanswersUrl)
    if response.status_code == 200:
        if form == "json":
            print("form:", form)
            json_data = response.json()
            json_formatted_str = json.dumps(json_data, indent=2)
            print(json_formatted_str)
        else:
            print("form:", form)
            csv_data = response.content.decode('utf-8')
            print(csv_data)
            df = pd.read_csv(StringIO(csv_data))
            print(df.to_string())
    else:
        print("Error: Unable to reach endpoint")

    return

# getquestionanswers: TO DISCUSS & CHECK
def getquestionanswers(questionnaire_id, question_id, form):
    print("Will get question answers of questionnaire with id:", questionnaire_id,
          "and question with id:", question_id)
    getquestionanswers = baseUrl + f"getquestionanswers/{questionnaire_id}/{question_id}"
    response = requests.get(getquestionanswers)
    if response.status_code == 200:
        if form == "json":
            print("form:", form)
            json_data = response.json()
            json_formatted_str = json.dumps(json_data, indent=2)
            print(json_formatted_str)
        else:
            print("form:", form)
            csv_data = response.content.decode('utf-8')
            print(csv_data)
            df = pd.read_csv(StringIO(csv_data))
            print(df.to_string())
    else:
        print("Error: Unable to reach endpoint")

    return

# admin: NOT DONE
def admin(args):
    print("HERE")
    # print("Will sent username:", username, "and password:", password)
    if args.usermod:
        print("user modification")
    if args.username:
        print("username :", args.username)
    if args.passw:
        print("password :", args.passw)
    if args.users:
        print("users :", args.users)

    return

parser = argparse.ArgumentParser()#add_help=False)

subparser = parser.add_subparsers(dest = "command")

# def loginParser():
#     ### LOGIN PARSER ###
#     login_parser = subparser.add_parser("login", help = "login")
#     login_parser.add_argument("--username", nargs = 1)
#     login_parser.add_argument("--passw", nargs = 1)
#     login_parser.add_argument("--format", nargs = 1)
#     ####################
#     return

### LOGIN PARSER ###
login_parser = subparser.add_parser("login", help = "login")
login_parser.add_argument("--username", nargs = 1)
login_parser.add_argument("--passw", nargs = 1)
login_parser.add_argument("--format", nargs = 1)
####################

### LOGOUT PARSER ###
logout_parser = subparser.add_parser("logout", help = "logout")
# Why format is needed in logout???
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
admin_parser.add_argument("--usermod", help="modify user", action="store_true")
admin_parser.add_argument("--username", help="username")
admin_parser.add_argument("--passw", help="password")
admin_parser.add_argument("--users", help="list of users")
####################




known = ["command", "--usermod", "--username", "--passw",
         "source", "--questionnaire_id", "--question_id",
         "--session_id", "--option_id", "--users", "format"]

#args, unknown = parser.parse_known_args(known)

try:
    args = parser.parse_args()

#args, unknown = parser.parse_known_args(known)

    if '--format' not in sys.argv:
        parser.error("Incorrect format, it should be --format json")
except Exception as e:
    exit()

print(vars(args))

unknown = [arg for arg in vars(args) if arg not in known]

print(unknown)

if len(unknown) != 0:
    unknownArgsHandler(unknown)

allowed_formats = ["json", "csv"]

if args.format[0] not in allowed_formats:
    print("Wrong format: Expecting \"json\" or \"csv\"")
    exit()

allowed_commands = ["login", "logout", "healthcheck", "resetall",
                    "questionnaire_upd", "resetq", "questionnaire",
                    "question", "doanswer", "getsessionanswers",
                    "getquestionanswers", "admin"]

if args.command not in allowed_commands:
    print("Wrong scope")
    exit()

if (args.command == "login"):
    login(args.username[0], args.passw[0], args.format[0])

elif (args.command == "logout"):
    logout(args.format[0])

elif (args.command == "healthcheck"):
    healthcheck(args.format[0])

elif (args.command == "resetall"):
    resetall(args.format[0])

elif (args.command == "questionnaire_upd"):
    questionnaire_upd(args.source[0], args.format[0])

elif (args.command == "resetq"):
    resetq(args.questionnaire_id[0], args.format[0])

elif (args.command == "questionnaire"):
    questionnaire(args.questionnaire_id[0], args.format[0])

elif (args.command == "question"):
    question(args.questionnaire_id[0], args.question_id[0], args.format[0])

elif (args.command == "doanswer"):
    doanswer(args.questionnaire_id[0], args.question_id[0],
             args.session_id[0], args.option_id[0], args.format[0])
    
elif (args.command == "getsessionanswers"):
    if args.questionnaire_id and args.session_id and args.format:
        getsessionanswers(args.questionnaire_id[0], args.session_id[0], args.format[0])
    else:
        print("getsessionanswers requires --questionnaire_id and --session_id and --format")

elif (args.command == "getquestionanswers"):
    if args.questionnaire_id and args.question_id and args.format:
        getquestionanswers(args.questionnaire_id[0], args.question_id[0], args.format[0])
    else:
        print("getquestionanswers requires --questionnaire_id and --question_id and --format")

elif args.command == "admin":
    if args.usermod:
        if args.username and args.passw:
            print("user modification for username :", args.username, "with password :", args.passw)
        else:
            print("usermod requires --username and --passw")
    elif args.username:
        if args.passw:
            print("username :", args.username, "with password :", args.passw)
        else:
            print("username requires --passw")
    elif args.passw:
        print("password :", args.passw)
    elif args.users:
        print("users :", args.users)
    else:
        print("invalid option")
else:
    print("Error in scope")






'''
#admin_parser = subparser.add_parser("admin", help = "admin")
#admin_subparsers = admin_parser.add_subparsers(dest = "command")


admin_parser = subparser.add_parser("admin", help = "admin")
#admin_parser.add_argument("--usermod", help="modify user", action="store_true")

admin_subparsers = admin_parser.add_subparsers(dest = "subcommand")

adminUserMod_parser = admin_subparsers.add_parser("--usermod", help = "adminUserMod")
#adminUserMod_parser.add_argument("--usermod", help="modify user", action="store_true")
adminUserMod_parser.add_argument("--username", help="username")
adminUserMod_parser.add_argument("--passw", help="password")
adminUserMod_parser.add_argument("--users", help="list of users")


usermod_parser = admin_subparsers.add_parser("usermod", help="modify user")
usermod_parser.add_argument("--username", help="username")
usermod_parser.add_argument("--passw", help="password")

users_parser = admin_subparsers.add_parser("users", help="list of users")
users_parser.add_argument("--users", help="list of users")
'''
####################
'''
####################
#adminUpd_parser = admin_subparsers.add_parser("questionnaire_upd", help = "questionnaire_upd")
#adminUpd_parser.add_argument("--source", nargs = 1)
#adminUpd_parser.add_argument("--format", nargs = 1) 

####################
'''
'''
### ADMINUSERMOD PARSER ###
adminUserMod_parser = admin_subparsers.add_parser("--usermod", help = "adminUserMod", dest = "adminUserMod")
#adminUserMod_parser.add_argument("--usermod", nargs = 0)
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
'''