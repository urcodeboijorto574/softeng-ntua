# Software Engineering Project 2022-2023

Group: (your group goes here, example: softeng2022-00)
Members: elYYNNN, elYYNNN, ... (replace YYNNN as needed. PLEASE keep this up-to-date)
  
  
  
(your README.md content goes here)

ntelliQ
Add collection description…
Login & Logout
Add folder description…
POST
Sign Up
{{baseURL}}/signup?format=csv
Add request description…
Query Params
format
csv

Body
urlencoded
username
jimv

usermod
user

password
0

questionnairesAnswered
username
john-use1234

password
0123456789

POST
Login
{{baseURL}}/login?format=csv
Add request description…
Query Params
format
csv

Body
urlencoded
username
john-user

password
0123456789

username
TheUltraSuperAdmin

password
the-password-is-secret

username
jimv

password
123456789

username
john-admin

password
0123456789

POST
Logout
{{baseURL}}/logout?format=csv
Add request description…
Query Params
format
csv

Admin Endpoints
Add folder description…
GET
Get Healthcheck
{{baseURL}}/admin/healthcheck?format=csv
Add request description…
Query Params
format
csv

POST
Update Questionnaire
{{baseURL}}/admin/questionnaire_upd
Add request description…
Body
raw (json)
View More
json
{
    "questionnaireID": "QQ130",
    "questionnaireTitle": "My great research questionnaire",
    "keywords": [
        "footbal",
        "islands",
        "timezone"
    ],
    "questions": [
        {
            "qID": "M014",
            "qtext": "erothsh1?",
            "required": "FALSE",
            "type": "profile",
            "options": [
                {
                    "optID": "M14TXT",
                    "opttxt": "<open string>",
                    "nextqID": "M015"
                }
            ]
        },
        {
            "qID": "M015",
            "qtext": "erothsh2?",
            "required": "TRUE",
            "type": "profile",
            "options": [
                {
                    "optID": "M015A1",
                    "opttxt": "<30",
                    "nextqID": "-"
                },
                {
                    "optID": "M01A3",
                    "opttxt": "30-50",
                    "nextqID": "-"
                }
            ]
        }
    ]
}
POST
Reset All
{{baseURL}}/admin/resetall
Add request description…
Body
form-data
questionnaireID
POST
Reset Questionnaire
{{baseURL}}/admin/resetq/:questionnaireID
Add request description…
Path Variables
questionnaireID
POST
Create User
{{baseURL}}/admin/user/test-user1/test123456
Add request description…
GET
Get User
{{baseURL}}/admin/users/jimv?format=csv
Add request description…
Query Params
format
csv

DELETE
Delete User
{{baseURL}}/admin/users/deleteUser/td
Add request description…
Use case Endpoints
Add folder description…
GET
Get Questionnaire
{{baseURL}}/questionnaire/:questionnaireID?format=json
Add request description…
Query Params
format
json

Path Variables
questionnaireID
QQ001

GET
Get Question
{{baseURL}}/question/:questionnaireID/:questionID?format=csv
Add request description…
Query Params
format
csv

{ json | csv }

Path Variables
questionnaireID
QQ574

questionID
QJ1

POST
Do Answer
{{baseURL}}/doanswer/:questionnaireID/:questionID/:session/:optionID
Add request description…
Path Variables
questionnaireID
QQ000

questionID
P00

session
GYM!

optionID
P00TXT

Body
raw (json)
json
{
    "answertext": "ioannhsyan76@gmail.com"
}
POST
Do Answer 2
{{baseURL}}/doanswer/:questionnaireID/:questionID/:session/:optionID
Add request description…
Path Variables
questionnaireID
QQ000

questionID
P01

session
GYM!

optionID
P01A4

Body
raw (json)
json
{
    "answertext": ""
}
GET
Get Session's Answers
{{baseURL}}/getsessionanswers/:questionnaireID/:session?format=csv
Add request description…
Query Params
format
csv

{ json | csv }

Path Variables
questionnaireID
QQ062

session
bSHP

GET
Get Question's Answers
{{baseURL}}/getquestionanswers/:questionnaireID/:questionID?format=csv
Add request description…
Query Params
format
csv

Path Variables
questionnaireID
QQ000

questionID
General Use
Add folder description…
Questionnaire-returning Endpoints
Add folder description…
GET
Get Admin's Created Questionnaires
{{baseURL}}/questionnaire/getadmincreatedquestionnaires
Add request description…
GET
Get User's Answered Questionnaires
{{baseURL}}/questionnaire/getuseransweredquestionnaires
Add request description…
GET
Get User's Not Answered Questionnaires
{{baseURL}}/questionnaire/getusernotansweredquestionnaires
Add request description…
DELETE
Delete Questionnaire
{{baseURL}}/questionnaire/deletequestionnaire/:questionnaireID
Add request description…
Path Variables
questionnaireID
QQdel

Session-returning Endpoints
Add folder description…
GET
Get All Questionnaire's Sessions
{{baseURL}}/session/getallquestionnairesessions/:questionnaireID
Add request description…
Path Variables
questionnaireID
GET
Get All Sessions' IDs
{{baseURL}}/session/getallsessionsids
Add request description…
GET
Get User's Questionnaire's Session
{{baseURL}}/session/getuserquestionnairesession/:questionnaireID
Add request description…
Path Variables
questionnaireID
POST
Import Dummy Data
{{baseURL}}/dummy-data/import
Add request description…
DELETE
Delete Dummy Data
{{baseURL}}/dummy-data/delete
Add request description…
GET
My Test
{{baseURL}}/test
Add request description…
