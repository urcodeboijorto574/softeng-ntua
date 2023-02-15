# Testing

## Contents

- Functional testing for all the endpoints that are implemented by the API (using mocha package)
- Functional testing of the endpoints through the CLI
- Unit testing of the endpoints through the CLI

## Node packages

```sh
  {
  "dependencies": {
    "chai": "^4.3.7",
    "chai-http": "^4.3.0",
    "mocha": "^10.2.0"
  },
  "scripts": {
    "start": "mocha --timeout 100000 --exit"
  }
}
```

## Installation:

Without the backend server running, type the following to your command line (in the directory ./test) for the functional testing of the API:

```sh
npm install
```

```sh
python APItesting.py
```

When running the backend server, type the following in your command line (in the directory ./test) for the functional and unit testing of the CLI:

```sh
pip install requests
pip install urllib3
```

```sh
cd cliFunctionalTesting
python cliTest.py
```

```sh
cd cliUnitTesting
python unitTest.py
```
