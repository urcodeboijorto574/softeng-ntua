from flask import Flask, request

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

if __name__ == '__main__':
    app.run(host='localhost', port=8000)
