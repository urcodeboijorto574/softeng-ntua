import argparse
import requests
import sys
import json
import pandas as pd
from io import StringIO
import urllib3
import csv
# H TEXNOLOGIA LOGISMIKOU EINAI TO KALUTERO MA8HMA !!!11!!1!!1! #not
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
requests.packages.urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

baseUrl = "https://localhost:9103/intelliq_api/"

# writing to a file
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
    # return load_variable_from_file()

def unknownArgsHandler(unknown):
    print("Error: Unrecognized arguments passed.\nGot: ")
    for i in range(len(unknown) - 1):
        print(unknown[i], end = ", ")
    print(unknown[-1])
    print("\nWhile expecting at least one of:")
    print("--usermod, --username, --passw, --users")
    print("\nExiting...")
    exit()

def handlePost(url, verify, vescookie = False, json_data = {}, headers = {}):
    try:
        if (json_data == {} and headers == {}):
            response = requests.post(url, cookies=vescookie, verify = False, timeout=10)
        elif isinstance(json_data, str):
            response = requests.post(url, cookies=vescookie, data = json_data,
                                    headers = headers, verify = False,
                                    timeout=10)
        else:
            response = requests.post(url, cookies=vescookie, json = json_data,
                                    headers = headers, verify = False,
                                    timeout=10)
    except requests.exceptions.ReadTimeout:
        print("Timeout error, the server took more than 10 seconds to respond")
        exit()

    return response

def handleGet(url, vescookie):
    try:
        # print(">>> HERE <<<")
        response = requests.get(url, cookies=vescookie, verify = False, timeout=10)
    except requests.exceptions.ReadTimeout:
        print("Timeout error, the server took more than 10 seconds to respond")
        exit()

    return response

def handleResponse(response, form):
    if form == "json":
        # print("form:", form)
        json_data = response.json()
        json_formatted_str = json.dumps(json_data, indent=2)
        print(json_formatted_str)
    else:
        # print("\n\nform:", form)
        # print("\n")
        #print(response.content)
        # csv_data = response.content.decode('utf-8')
        # reader = csv.reader(csv_data.splitlines())
        # for row in reader:
        #     print(row[0].key)
        #     print(row[0].value)
        # decoded_content = response.content.decode('utf-8')
        # reader = csv.reader(decoded_content.splitlines(), delimiter=',')
        # for row in reader:
        #     print(row)

        # csv_data = response.content.decode('utf-8')
        csv_data = response.text
        # parsed_data = json.loads(csv_data)
        print(csv_data)
        # df = pd.read_csv(StringIO(csv_data))
        # print(df.to_string())

    return

# login: NOT DONE
def login(username, password, form):
    """"""
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    #json_data = {'username' : username, 'password' : password}
    data = "username=" + username + "&password=" + password
    loginUrl = baseUrl + "login" + "?format=" + form
    cert_path = "cert.pem"
    response = handlePost(loginUrl, verify=cert_path, json_data = data, headers = headers)
    # print(">>> Cookie:", response.cookies["jwt"])
    jwt = response.cookies["jwt"]
    save_variable_to_file(jwt)
    handleResponse(response, form)
    
    return response

# logout: NOT DONE
def logout(form):
    """ Posts with no body and expect a response.
        If status == 200: success
        Else: gives reason"""
    logoutUrl = baseUrl + "logout?format=" + form
    response = handlePost(logoutUrl, verify = False)
    jwt = response.cookies["jwt"]
    save_variable_to_file(jwt)
    handleResponse(response, form)

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
    healthUrl = baseUrl + "admin/healthcheck?format=" + form

    vescookie = getCookie()
    # print(vescookie)

    response = handleGet(healthUrl, vescookie)
    handleResponse(response, form)
    
    return

# resetall: TO CHECK
def resetall(form):
    print("Will resetall")
    resetallUrl = baseUrl + "admin/resetall" + "?format=" + form
    vescookie = getCookie()
    response = handlePost(resetallUrl)
    handleResponse(response, form)
    
    return

# questionnaire_upd: TO CHECK
def questionnaire_upd(source, form):
    #Just uploads a json, WHY DO WE NEED FORMAT???
    updUrl = baseUrl + "admin/questionnaire_upd" + "?format=" + form
    vescookie = getCookie()
    with open(source) as json_file:
        json_data = json.load(json_file)
        response = handlePost(updUrl, False, vescookie, json_data)
        handleResponse(response, form)
    
    return

# resetq: TO CHECK
def resetq(questionnaire_id, form):
    resetqUrl = baseUrl + f"admin/resetq/{questionnaire_id}" + "?format=" + form
    print("Will reset questionnaire at", resetqUrl)
    response = handlePost(resetqUrl)
    handleResponse(response, form)
    
    return

# questionnaire: TO CHECK
def questionnaire(questionnaire_id, form):
    print("Will get questionnaire with id:", questionnaire_id)
    questionnaireUrl = baseUrl + f"questionnaire/{questionnaire_id}" + "?format=" + form
    response = handleGet(questionnaireUrl)
    handleResponse(response, form)
    
    return

# question: TO DISCUSS & CHECK
def question(questionnaire_id, question_id, form):
    print("Will get from questionnaire with id:", questionnaire_id,
          "question with id:", question_id)
    questionUrl = baseUrl + f"question/{questionnaire_id}/{question_id}" + "?format=" + form
    response = handleGet(questionUrl)
    handleResponse(response, form)

    return

# doanswer: TO DISCUSS & CHECK
def doanswer(questionnaire_id, question_id, session_id, option_id, form):
    # print("Will answer from questionnaire with id:", questionnaire_id,
    #       "question with id:", question_id, "of session with id:", session_id,
    #       "and option with id:", option_id)
    doanswerUrl = baseUrl + f"doanswer/{questionnaire_id}/{question_id}/{session_id}/{option_id}"  + "?format=" + form
    json_data = {
        "questionnaireID" : questionnaire_id,
        "questionID" : question_id,
        "session" : session_id,
        "optionID" : option_id
    }
    response = handlePost(doanswerUrl, json_data)
    handleResponse(response, form)
    
    return

# getsessionanswers: TO DISCUSS & CHECK
def getsessionanswers(questionnaire_id, session_id, form):
    print("Will get session answers of questionnaire with id:", questionnaire_id,
          "and session with id:", session_id)
    getsessionanswersUrl = baseUrl + f"getsessionanswers/{questionnaire_id}/{session_id}" + "?format=" + form
    response = handleGet(getsessionanswersUrl)
    handleResponse(response, form)

    return

# getquestionanswers: TO DISCUSS & CHECK
def getquestionanswers(questionnaire_id, question_id, form):
    print("Will get question answers of questionnaire with id:", questionnaire_id,
          "and question with id:", question_id)
    getquestionanswers = baseUrl + f"getquestionanswers/{questionnaire_id}/{question_id}" + "?format=" + form
    response = handleGet(getquestionanswers)
    handleResponse(response, form)

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
admin_parser.add_argument("--format", nargs = 1)
####################




known = ["command", "usermod", "username", "passw",
         "source", "questionnaire_id", "question_id",
         "session_id", "option_id", "users", "format"]

#args, unknown = parser.parse_known_args(known)

try:
    args = parser.parse_args()
    #args, unknown = parser.parse_known_args(known)
    if '--format' not in sys.argv:
        parser.error("Incorrect format, it should be --format json")
except Exception as e:
    exit()

# print(vars(args))

unknown = [arg for arg in vars(args) if arg not in known]

# print(unknown)

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
    print("Invalid scope")
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
    print("In admin")
    if args.usermod and args.username and args.passw and not args.users:
        print("user modification for username :", args.username, "with password :", args.passw)

    elif args.username and args.passw and not args.usermod and not args.users:
        print("username :", args.username, "with password :", args.passw)

    elif args.passw and not args.usermod and not args.username and not args.users:
        print("password :", args.passw)
        
    elif args.users and args.username and not args.usermod and not args.passw:
        print("users :", args.users)
    
    else:
        print("Invalid parameters for admin scope")


    '''
    if args.usermod:
        if args.users:
            print("Invalid parameter. Expected only --username and --passw")
        if args.username and args.passw:
            print("user modification for username :", args.username, "with password :", args.passw)
        else:
            print("usermod requires --username and --passw")
    elif args.username:
        if args.users:
            print("Invalid parameter. Expected only --passw")
        if args.passw:
            print("username :", args.username, "with password :", args.passw)
        else:
            print("username requires --passw")
    elif args.passw:
        if args.users:
            print("Invalid parameter. Expected no parameters")
        print("password :", args.passw)
    elif args.users:
        if args.username:
            print("users :", args.users)
    else:
        print("invalid option")
else:
    print("Error in scope")
'''





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