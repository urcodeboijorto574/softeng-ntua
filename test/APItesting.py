import subprocess

result = subprocess.run(['cmd', '/c', 'npm start answerTesting.js'], shell = True)
print(result.stdout)
# subprocess.run(['C:\\Program Files\\nodejs\\npm', 'start', 'answerTesting.js'], shell = True)
result = subprocess.run(['cmd', '/c', 'npm start authTesting.js'], shell = True)
print(result.stdout)

result = subprocess.run(['cmd', '/c', 'npm start dummyDataTesting.js'], shell = True)
print(result.stdout)

result = subprocess.run(['cmd', '/c', 'npm start questionnaireTesting.js'], shell = True)
print(result.stdout)

result = subprocess.run(['cmd', '/c', 'npm start questionnaireUpdateTesting.js'], shell = True)
print(result.stdout)

result = subprocess.run(['cmd', '/c', 'npm start sessionTesting.js'], shell = True)
print(result.stdout)

result = subprocess.run(['cmd', '/c', 'npm start useCaseEndpointsTesting.js'], shell = True)
print(result.stdout)

result = subprocess.run(['cmd', '/c', 'npm start userTesting.js'], shell = True)
print(result.stdout)

result = subprocess.run(['cmd', '/c', 'npm start superAdminTesting.js'], shell = True)
print(result.stdout)