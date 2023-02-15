import subprocess

result = subprocess.run(['cmd', '/c', 'npm start answerTesting.js'], capture_output=True)
print(result.stdout)
# subprocess.run(['C:\\Program Files\\nodejs\\npm', 'start', 'answerTesting.js'], capture_output=True)
result = subprocess.run(['cmd', '/c', 'npm start authTesting.js'], capture_output=True)
print(result.stdout)

result = subprocess.run(['cmd', '/c', 'npm start dummyDataTesting.js'], capture_output=True)
print(result.stdout)

result = subprocess.run(['cmd', '/c', 'npm start questionnaireTesting.js'], capture_output=True)
print(result.stdout)

result = subprocess.run(['cmd', '/c', 'npm start questionnaireUpdateTesting.js'], capture_output=True)
print(result.stdout)

result = subprocess.run(['cmd', '/c', 'npm start sessionTesting.js'], capture_output=True)
print(result.stdout)

result = subprocess.run(['cmd', '/c', 'npm start useCaseEndpointsTesting.js'], capture_output=True)
print(result.stdout)

result = subprocess.run(['cmd', '/c', 'npm start userTesting.js'], capture_output=True)
print(result.stdout)

result = subprocess.run(['cmd', '/c', 'npm start superAdminTesting.js'], capture_output=True)
print(result.stdout)