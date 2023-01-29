from flask import Flask, request, jsonify


app = Flask(__name__)

@app.route('/endpoint', methods=['POST'])
def endpoint():
    import json
    import csv

    # Get the request data as a string
    data_string = request.get_data().decode('utf-8')

    # Try to parse the data as JSON
    try:
        data = json.loads(data_string)
    except json.JSONDecodeError:
        print("Did not receive json")
        # Data is not in JSON format, try to parse it as CSV
        try:
            # Parse the CSV string and return the data as a list of dictionaries
            data = [{k: v for k, v in row.items()} for row in csv.DictReader(data_string.splitlines())]
        except csv.Error:
            print("Did not receive csv")
            # Data is not in CSV format, handle the error
            pass
    
    return 'Endpoint: {}'.format(data)

@app.route('/admin/healthcheck', methods=['GET'])
def healthcheck():
    import random
    if (random.randint(0, 1) == 0):
        return jsonify(status="OK", dbconnection="[connection_string]")
    else:
        return jsonify(status="failed", dbconnection="[connection_string]")

@app.route('/admin/resetall', methods=['POST'])
def resetall():
    import random
    if (random.randint(0, 1) == 0):
        return jsonify(status="OK")
    else:
        return jsonify(status="failed", reason = "YOU SHALL NOT RESET!!")

@app.route('/admin/resetq/<qID>', methods=['POST'])
def reset_questionnaire(qID):
    import random
    if (random.randint(0, 1) == 0):
        return jsonify(status="OK")
    else:
        return jsonify(status="failed", reason = "YOU SHALL NOT RESET!!")


if __name__ == '__main__':
    app.run(host='localhost', port=8000)
