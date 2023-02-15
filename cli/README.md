# Python script for interacting with an API with functions to handle HTTP requests and responses
This code is a Python script that interacts with the API. It has functions to make HTTP GET and POST requests to the API and to handle the responses.

### Summary
The script is designed to interact with an API located at "https://localhost:9103/intelliq_api/" that can return data in either JSON or CSV format. The script has functions to make HTTP GET and POST requests to the API and to handle the responses.

The script defines several functions to handle HTTP requests, including functions to log in and out of the questionnaire system, reset data, update and retrieve questionnaires and questions, submit answers, and retrieve session and question answers. There are also functions to modify or create users and retrieve information about users.

There are several helper functions that handle saving and loading variables from files, obtaining a JWT token, handling unknown arguments, making POST and GET requests to the API, and printing the response.

The script uses the `argparse` module in Python to define an argument parser for the command-line interface. The parser has subparsers to handle subcommands for each of the supported functions, and each subcommand has its own parser that defines the expected arguments.

Finally, the script has a `main` function that parses the command-line arguments using the `argparse` parser and calls the appropriate function based on the subcommand provided by the user.

Overall, the script is a comprehensive tool for interacting with the API, providing users with the ability to perform a wide range of actions and handle the responses in a variety of formats.

# Overview of the API and Supported Formats
The API is located at "https://localhost:9103/intelliq_api/" and can return data in either JSON or CSV format, specified in the form parameter passed to the API.

# The script defines several functions
### HTTP Request Functions
`login(username, password, form)`: sends a POST request to the server to log in to the questionnaire system. The username and password are passed as arguments to the function, along with the form argument, which specifies the format of the response from the server.

`logout(form)`: sends a POST request to the server to log out of the questionnaire system. The form argument specifies the format of the response from the server.

`healthcheck(form)`: sends a GET request to the server to check the health of the questionnaire system. The form argument specifies the format of the response from the server.

`resetall(form)`: sends a POST request to the server to reset all data in the questionnaire system. The form argument specifies the format of the response from the server.

`questionnaire_upd(source, form)`: sends a POST request to the server to update a questionnaire. The source argument specifies the path to the file containing the updated questionnaire. The form argument specifies the format of the response from the server.

`resetq(questionnaire_id, form)`: sends a POST request to the server to reset a specific questionnaire. The questionnaire_id argument specifies the ID of the questionnaire to reset, and the form argument specifies the format of the response from the server.

`questionnaire(questionnaire_id, form)`: sends a GET request to the server to retrieve a specific questionnaire. The questionnaire_id argument specifies the ID of the questionnaire to retrieve, and the form argument specifies the format of the response from the server.

`question(questionnaire_id, question_id, form)`: sends a GET request to the server to retrieve a specific question from a specific questionnaire. The questionnaire\_id argument specifies the ID of the questionnaire containing the question, the question\_id argument specifies the ID of the question to retrieve, and the form argument specifies the format of the response from the server.

`doanswer(questionnaire_id, question_id, session_id, option_id, form)`: sends a POST request to the server to submit an answer to a specific question in a specific session of a specific questionnaire. The questionnaire\_id, question\_id, session\_id, and option\_id arguments specify the IDs of the questionnaire, question, session, and answer option, respectively. The form argument specifies the format of the response from the server.

`getsessionanswers(questionnaire_id, session_id, form)`: sends a GET request to the server to retrieve all answers for a specific session of a specific questionnaire. The questionnaire\_id and session\_id arguments specify the IDs of the questionnaire and session, respectively, and the form argument specifies the format of the response from the server.

`getquestionanswers(questionnaire_id, question_id, form)`: sends a GET request to the server to retrieve all answers for a specific question in a specific questionnaire. The questionnaire\_id and question\_id arguments specify the IDs of the questionnaire and question, respectively, and the form argument specifies the format of the response from the server.

`deleteq(questionnaire_id, form)`: sends a DELETE request to the server to delete a specific questionnaire. The questionnaire_id argument specifies the ID of the questionnaire to delete, and the form argument specifies the format of the response from

`usermodReq(usermod, username, passw, form)`: Sends a request to modify or create the user with the given username and passw using the information contained in the usermod dictionary. It returns the response object after sending the request.

`usersReq(username, form)`: takes a username and a form parameter, constructs a URL for retrieving information about the user with that username, retrieves data from that URL using a GET request with an authentication cookie obtained from getCookie(), and then handles the response using the handleResponse function.

### Help Functions
`save_variable_to_file()` saves a variable to a file.

`load_variable_from_file()` loads the variable from a file.

`getCookie()` loads a JWT token from a file and returns it as a dictionary.

`unknownArgsHandler()` prints an error message and exits the program if the script is called with unrecognized arguments.

`handlePost()` makes a POST request to the API, with an optional JSON payload or headers.

`handleGet()` makes a GET request to the API.

`handleResponse()` prints the response from the API, either as a formatted JSON string or as a CSV.

### Parsing Functions
The code defines an argument parser using the `argparse` module in Python. The `argparse` module makes it easy to write user-friendly command-line interfaces.

The parser is created with the `ArgumentParser` class from the `argparse` module, and a subparser is added to handle subcommands using `add_subparsers` method.

Each subcommand has its own parser that is added to the subparser. For example, the `login` subcommand has a `login`_parser defined that adds `--username`, `--passw`, and `--format` arguments to the subcommand.

Each subcommand is added as a add_parser method to the subparser, with its `help` description specified in the `help` argument. Arguments for each subcommand are added using the add_argument method.

The `known` variable is a list of strings that correspond to the expected arguments for the parser, which can be used to validate that the user has provided all the necessary arguments.

### Main Function
The `main()` function is the entry point for the command line interface. It first checks if the required number of arguments are passed and if the first argument is valid (one of the pre-defined commands).

The arguments are then parsed based on the command passed and appropriate validation checks are made for each command. If any of the validation checks fail, an error message is printed and the program exits. If all the validation checks pass, the relevant function for the command is called with the arguments passed.

The program exits with a status code of 1 if an error occurs during execution. The status code is used to indicate the success or failure of the program to other programs that invoke it.