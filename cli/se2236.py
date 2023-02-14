import argparse
import requests
import sys
import json
import urllib3
import os

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

def unknownArgsHandler(unknown):
    print("Error: Unrecognized arguments passed.\nGot: ")
    for i in range(len(unknown) - 1):
        print(unknown[i], end = ", ")
    print(unknown[-1])
    print("\nWhile expecting at least one of:")
    print("--usermod, --username, --passw, --users")
    print("\nExiting...")
    sys.exit(1)

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
        return
    except Exception as e:
        print("Unexpected error occurred")
        return

    return response

def handleGet(url, vescookie):
    try:
        response = requests.get(url, cookies = vescookie, verify = False, timeout=10)
    except requests.exceptions.ReadTimeout:
        print("Timeout error, the server took more than 10 seconds to respond")
        return
    except Exception as e:
        print("Unexpected error occurred")
        return

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
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    data = "username=" + username + "&password=" + password
    loginUrl = baseUrl + "login" + "?format=" + form
    cert_path = "cert.pem"
    cert_path = False
    
    response = handlePost(loginUrl, verify = cert_path, json_data = data, headers = headers)
    
    jwt = response.cookies["jwt"]
    save_variable_to_file(jwt)
    
    handleResponse(response, form)
    
    return response

# logout: NOT DONE
def logout(form):
    logoutUrl = baseUrl + "logout?format=" + form
    vescookie = getCookie()
    if vescookie["jwt"] in ["loggedout", ""]:
        print("The user is not signed in!")
        return
    
    response = handlePost(logoutUrl, verify = False, vescookie = vescookie)
    
    jwt = response.cookies["jwt"]
    save_variable_to_file(jwt)
    
    handleResponse(response, form)

    return

# healthcheck: DONE
def healthcheck(form):
    healthUrl = baseUrl + "admin/healthcheck?format=" + form
    vescookie = getCookie()

    response = handleGet(healthUrl, vescookie)
    
    handleResponse(response, form)
    
    return

# resetall: TO CHECK
def resetall(form):    
    resetallUrl = baseUrl + "admin/resetall" + "?format=" + form
    vescookie = getCookie()
    
    response = handlePost(resetallUrl, verify = False, vescookie = vescookie)
    
    handleResponse(response, form)
    
    return

# questionnaire_upd: DONE
def questionnaire_upd(source, form):
    updUrl = baseUrl + "admin/questionnaire_upd" + "?format=" + form
    vescookie = getCookie()
    try:
        files = {'file': (os.path.basename(source), open(source, 'rb'), 'application/octet-stream')}
        response = requests.post(updUrl, cookies=vescookie, files = files, verify = False, timeout=10)
    except requests.exceptions.ReadTimeout:
        print("Timeout error, the server took more than 10 seconds to respond")
        return
    except Exception as e:
        print("No such file exists!")
        return

    handleResponse(response, form)
    
    return

# resetq: DONE
def resetq(questionnaire_id, form):
    resetqUrl = baseUrl + f"admin/resetq/{questionnaire_id}" + "?format=" + form
    vescookie = getCookie()
    
    response = handlePost(resetqUrl, False, vescookie=vescookie)
    
    handleResponse(response, form)
    
    return

# questionnaire: DONE
def questionnaire(questionnaire_id, form):
    questionnaireUrl = baseUrl + f"questionnaire/{questionnaire_id}" + "?format=" + form
    vescookie = getCookie()
    
    response = handleGet(questionnaireUrl, vescookie = vescookie)
    
    handleResponse(response, form)
    
    return

# question: DONE
def question(questionnaire_id, question_id, form):
    questionUrl = baseUrl + f"question/{questionnaire_id}/{question_id}" + "?format=" + form
    vescookie = getCookie()
    
    response = handleGet(questionUrl, vescookie = vescookie)
    
    handleResponse(response, form)

    return

# doanswer: DONE
def doanswer(questionnaire_id, question_id, session_id, option_id, form):
    doanswerUrl = baseUrl + f"doanswer/{questionnaire_id}/{question_id}/{session_id}/{option_id}"  + "?format=" + form
    answerJson = {
        "questionnaireID" : questionnaire_id,
        "questionID"      : question_id,
        "session"         : session_id,
        "optionID"        : option_id
    }
    if option_id[-3:] == "TXT":
        answerText = input("Give your answer: ")
        answerJson = {"answertext" : answerText}
    vescookie = getCookie()
    
    response = handlePost(doanswerUrl, json_data = answerJson, verify = False, vescookie = vescookie)
    
    handleResponse(response, form)
    
    return

# getsessionanswers: DONE
def getsessionanswers(questionnaire_id, session_id, form):
    getsessionanswersUrl = baseUrl + f"getsessionanswers/{questionnaire_id}/{session_id}" + "?format=" + form
    vescookie = getCookie()
    
    response = handleGet(getsessionanswersUrl, vescookie = vescookie)
    
    handleResponse(response, form)

    return

# getquestionanswers: DONE
def getquestionanswers(questionnaire_id, question_id, form):
    getquestionanswers = baseUrl + f"getquestionanswers/{questionnaire_id}/{question_id}" + "?format=" + form
    vescookie = getCookie()
    
    response = handleGet(getquestionanswers, vescookie = vescookie)
    
    handleResponse(response, form)

    return

def deleteq(questionnaire_id, form):
    deleteqUrl = baseUrl + f"questionnaire/deletequestionnaire/{questionnaire_id}"
    vescookie = getCookie()
    try:
        response = requests.delete(deleteqUrl, cookies=vescookie, verify = False, timeout=10)
    except requests.exceptions.ReadTimeout:
        print("Timeout error, the server took more than 10 seconds to respond")
        return
    
    handleResponse(response, form)
    
    return

# usermodReq: DONE
def usermodReq(usermod, username, passw, form):
    usermodUrl = baseUrl + f"admin/{usermod}/{username}/{passw}" + "?format=" + form
    vescookie = getCookie()
    
    response = handlePost(usermodUrl, verify = False, vescookie = vescookie)
    
    handleResponse(response, form)

    return

# usersReq: DONE
def usersReq(username, form):
    usermodUrl = baseUrl + f"admin/users/{username}" + "?format=" + form
    vescookie = getCookie()
    
    response = handleGet(usermodUrl, vescookie = vescookie)
    
    handleResponse(response, form)

    return

parser = argparse.ArgumentParser()#add_help=False)

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

### DELETE QUESTIONNAIRE PARSER ###
questionnaire_parser = subparser.add_parser("deleteq", help = "deleteq")
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
admin_parser.add_argument("--usermod", help="modify user")#, action="store_true")
admin_parser.add_argument("--username", help="username")
admin_parser.add_argument("--passw", help="password")
admin_parser.add_argument("--users", help="list of users")
admin_parser.add_argument("--format", nargs = 1)
####################

known = ["command", "usermod", "username", "passw",
         "source", "questionnaire_id", "question_id",
         "session_id", "option_id", "users", "format"]

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Error: at least 1 argument is required")
        sys.exit(1)
    try:
        knownCommands = ["login", "logout", "healthcheck", "resetall", "questionnaire_upd",
                         "resetq", "questionnaire", "deleteq", "question", "doanswer", "getsessionanswers",
                         "getquestionanswers", "admin", "usermod"]
        if sys.argv[1] not in knownCommands:
            print("Unknown scope \"" + sys.argv[1] + "\".\nExpected one of", knownCommands)
            sys.exit(1)

        if sys.argv[1] == "login":
            if len(sys.argv) != 8:
                print("Invalid number of arguments passed! Exiting...")
                sys.exit(1)
            if sys.argv[2] not in ["--username", "--passw"] or sys.argv[4] not in ["--username", "--passw"] or sys.argv[2] == sys.argv[4]:
                print(">>> HERE <<<")
                print(sys.argv[2] not in ["--username", "--passw"])
                print(sys.argv[4] not in ["--username", "--passw"])
                print("Invalid arguments passed! Exiting...")
                sys.exit(1)
        elif sys.argv[1] == "logout":
            if len(sys.argv) != 4:
                print("Invalid number of arguments passed! Exiting...")
                sys.exit(1)
        elif sys.argv[1] == "healthcheck":
            if len(sys.argv) != 4:
                print("Invalid number of arguments passed! Exiting...")
                sys.exit(1)
        elif sys.argv[1] == "resetall":
            if len(sys.argv) != 4:
                print("Invalid number of arguments passed! Exiting...")
                sys.exit(1)
        elif sys.argv[1] == "questionnaire_upd":
            if len(sys.argv) != 6:
                print("Invalid number of arguments passed! Exiting...")
                sys.exit(1)
            if sys.argv[2] != "--source":
                print("Invalid arguments passed! Exiting...")
                sys.exit(1)
        elif sys.argv[1] == "resetq":
            if len(sys.argv) != 6:
                print("Invalid number of arguments passed! Exiting...")
                sys.exit(1)
            if sys.argv[2] != "--questionnaire_id":
                print("Invalid arguments passed! Exiting...")
                sys.exit(1)
        elif sys.argv[1] == "questionnaire":
            if len(sys.argv) != 6:
                print("Invalid number of arguments passed! Exiting...")
                sys.exit(1)
            if sys.argv[2] != "--questionnaire_id":
                print("Invalid arguments passed! Exiting...")
                sys.exit(1)
        elif sys.argv[1] == "question":
            if len(sys.argv) != 8:
                print("Invalid number of arguments passed! Exiting...")
                sys.exit(1)
            if sys.argv[2] not in ["--questionnaire_id", "--question_id"] or sys.argv[4] not in ["--questionnaire_id", "--question_id"] or sys.argv[2] == sys.argv[4]:
                print("Invalid arguments passed! Exiting...")
                sys.exit(1)
        elif sys.argv[1] == "doanswer":
            if len(sys.argv) != 12:
                print("Invalid number of arguments passed! Exiting...")
                sys.exit(1)
            if (sys.argv[2] not in ["--questionnaire_id", "--question_id", "--session_id", "--option_id"] or
                sys.argv[4] not in ["--questionnaire_id", "--question_id", "--session_id", "--option_id"] or
                sys.argv[6] not in ["--questionnaire_id", "--question_id", "--session_id", "--option_id"] or
                sys.argv[8] not in ["--questionnaire_id", "--question_id", "--session_id", "--option_id"] or
                sys.argv[2] in [sys.argv[4], sys.argv[6], sys.argv[8]] or sys.argv[4] in [sys.argv[6], sys.argv[8]] or sys.argv[6] == sys.argv[8]):
                print("Invalid arguments passed! Exiting...")
                sys.exit(1)
        elif sys.argv[1] == "getsessionanswers":
            if len(sys.argv) != 8:
                print("Invalid number of arguments passed! Exiting...")
                sys.exit(1)
            if sys.argv[2] not in ["--questionnaire_id", "--session_id"] or sys.argv[4] not in ["--questionnaire_id", "--session_id"] or sys.argv[2] == sys.argv[4]:
                print("Invalid arguments passed! Exiting...")
                sys.exit(1)
        elif sys.argv[1] == "getquestionanswers":
            if len(sys.argv) != 8:
                print("Invalid number of arguments passed! Exiting...")
                sys.exit(1)
            if sys.argv[2] not in ["--questionnaire_id", "--question_id"] or sys.argv[4] not in ["--questionnaire_id", "--question_id"] or sys.argv[2] == sys.argv[4]:
                print("Invalid arguments passed! Exiting...")
                sys.exit(1)
        elif sys.argv[1] == "admin":
            if len(sys.argv) != 6 and len(sys.argv) != 10:
                print("Invalid number of arguments passed! Exiting...")
                sys.exit(1)
            if len(sys.argv) == 6:
                if sys.argv[2] != "--users":
                    print("Invalid arguments passed! Exiting...")
                    sys.exit(1)
            if len(sys.argv) == 10:
                if (sys.argv[2] not in ["--usermod", "--username", "--passw"] or
                    sys.argv[4] not in ["--usermod", "--username", "--passw"] or 
                    sys.argv[6] not in ["--usermod", "--username", "--passw"] or
                    sys.argv[2] in [sys.argv[4], sys.argv[6]] or sys.argv[4] == sys.argv[6]):
                    print("Invalid arguments passed! Exiting...")
                    sys.exit(1)

        args = parser.parse_args()
        
        if len(sys.argv[1:]) < 2:
            print("Error: at least 1 argument is required")
            sys.exit(1)
        
        if '--format' not in sys.argv:
            parser.error("Incorrect format, it should be --format json")
        
        unknown = [arg for arg in vars(args) if arg not in known]

        if len(unknown) != 0:
            unknownArgsHandler(unknown)

        allowed_formats = ["json", "csv"]

        if args.format[0] not in allowed_formats:
            print("Wrong format: Expecting \"json\" or \"csv\"")
            sys.exit(1)

        allowed_commands = ["login", "logout", "healthcheck", "resetall",
                            "questionnaire_upd", "resetq", "questionnaire",
                            "deleteq", "question", "doanswer", "getsessionanswers",
                            "getquestionanswers", "admin"]

        if args.command not in allowed_commands:
            print("Invalid scope")
            sys.exit(1)

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

        elif (args.command == "deleteq"):
            deleteq(args.questionnaire_id[0], args.format[0])

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
            if args.usermod and args.username and args.passw and not args.users:
                usermodReq(args.usermod, args.username, args.passw, args.format[0])
            elif args.users and not args.username and not args.usermod and not args.passw:
                usersReq(args.users, args.format[0])
            else:
                print("Invalid parameters for admin scope")

    except ValueError as e:
        print("Exception!")
        sys.exit(1)

