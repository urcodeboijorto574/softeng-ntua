import subprocess

subprocess.run(['npm', 'start', 'answerTesting.js'], capture_output=True)
subprocess.run(['npm', 'start', 'authTesting.js'], capture_output=True)
subprocess.run(['npm', 'start', 'dummyDataTesting.js'], capture_output=True)
subprocess.run(['npm', 'start', 'questionnaireTesting.js'], capture_output=True)
subprocess.run(['npm', 'start', 'questionnaireUpdateTesting.js'], capture_output=True)
subprocess.run(['npm', 'start', 'sessionTesting.js'], capture_output=True)
subprocess.run(['npm', 'start', 'useCaseEndpointsTesting.js'], capture_output=True)
subprocess.run(['npm', 'start', 'userTesting.js'], capture_output=True)
subprocess.run(['npm', 'start', 'superAdminTesting.js'], capture_output=True)