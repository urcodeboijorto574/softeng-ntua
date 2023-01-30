import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:http/http.dart';
import 'package:questionnaires_app/widgets/snackbar.dart';

class UserSignupScreen extends StatefulWidget {
  const UserSignupScreen({super.key});

  @override
  State<UserSignupScreen> createState() => _UserSignupScreenState();
}

class _UserSignupScreenState extends State<UserSignupScreen> {
  late String username;
  late String password;
  late String fullName;

  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final GlobalKey<ScaffoldMessengerState> _scaffoldKey =
      GlobalKey<ScaffoldMessengerState>();

  bool passwordVisible = false;
  bool processing = false;

  String _localhost() {
    return 'http://127.0.0.1:3000/intelliq_api/signup';
  }

  Future<void> signUpUser() async {
    final url = Uri.parse(_localhost());
    Response response = await post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
        'Accept': '*/*',
        'Allow': '*'
      },
      body: jsonEncode(<String, String>{
        'username': username,
        'password': password,
        'usermod': 'user',
      }),
    );

    if (response.statusCode == 200) {
      _formKey.currentState!.reset();
      Navigator.pushReplacementNamed(context, '/user_login');
    } else {
      MyMessageHandler.showSnackbar(
          _scaffoldKey, jsonDecode(response.body)['message']);
    }
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        backgroundColor: const Color.fromARGB(255, 9, 52, 58),
        body: Form(
          key: _formKey,
          child: Padding(
            padding: const EdgeInsets.all(25.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  height: 604,
                  width: 500,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.8),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(25),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 40),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'User Sign Up',
                                style: TextStyle(
                                  color: Color.fromARGB(255, 9, 52, 58),
                                  fontSize: 30,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              IconButton(
                                onPressed: () {
                                  Navigator.pushReplacementNamed(
                                      context, '/welcome_screen');
                                },
                                icon: const Icon(
                                  Icons.home,
                                  color: Color.fromARGB(255, 9, 52, 58),
                                  size: 40,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Column(
                          children: [
                            Padding(
                              padding: const EdgeInsets.only(bottom: 15),
                              child: SizedBox(
                                width: 1000,
                                child: TextFormField(
                                  style: const TextStyle(fontSize: 15),
                                  validator: (value) {
                                    if (value!.isEmpty) {
                                      return 'Please enter your full name';
                                    } else {
                                      return null;
                                    }
                                  },
                                  onChanged: (value) {
                                    fullName = value;
                                  },
                                  decoration: InputDecoration(
                                    labelText: 'Full Name',
                                    hintText: 'Enter your full name',
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(25),
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(25),
                                      borderSide: const BorderSide(
                                        color: Color.fromARGB(255, 9, 52, 58),
                                        width: 2,
                                      ),
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(25),
                                      borderSide: const BorderSide(
                                        color: Colors.pinkAccent,
                                        width: 2,
                                      ),
                                    ),
                                    floatingLabelStyle: const TextStyle(
                                      color: Colors.pinkAccent,
                                    ),
                                  ),
                                  cursorColor: Colors.pinkAccent,
                                ),
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.only(bottom: 15),
                              child: SizedBox(
                                width: 1000,
                                child: TextFormField(
                                  style: const TextStyle(fontSize: 15),
                                  validator: (value) {
                                    if (value!.isEmpty) {
                                      return 'Please enter your username';
                                    } else {
                                      return null;
                                    }
                                  },
                                  onChanged: (value) {
                                    username = value;
                                  },
                                  decoration: InputDecoration(
                                    labelText: 'Username',
                                    hintText: 'Enter your username',
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(25),
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(25),
                                      borderSide: const BorderSide(
                                        color: Color.fromARGB(255, 9, 52, 58),
                                        width: 2,
                                      ),
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(25),
                                      borderSide: const BorderSide(
                                        color: Colors.pinkAccent,
                                        width: 2,
                                      ),
                                    ),
                                    floatingLabelStyle: const TextStyle(
                                      color: Colors.pinkAccent,
                                    ),
                                  ),
                                  cursorColor: Colors.pinkAccent,
                                ),
                              ),
                            ),
                            SizedBox(
                              width: 1000,
                              child: TextFormField(
                                style: const TextStyle(fontSize: 15),
                                validator: (value) {
                                  if (value!.isEmpty) {
                                    return 'Please enter your password';
                                  } else {
                                    return null;
                                  }
                                },
                                onChanged: (value) {
                                  password = value;
                                },
                                obscureText: !passwordVisible,
                                decoration: InputDecoration(
                                  suffixIcon: Padding(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 8),
                                    child: IconButton(
                                      onPressed: () {
                                        setState(() {
                                          passwordVisible = !passwordVisible;
                                        });
                                      },
                                      icon: Icon(
                                        passwordVisible
                                            ? Icons.visibility
                                            : Icons.visibility_off,
                                        color: const Color.fromARGB(
                                            255, 9, 52, 58),
                                      ),
                                    ),
                                  ),
                                  labelText: 'Password',
                                  hintText: 'Enter your password',
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(25),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(25),
                                    borderSide: const BorderSide(
                                      color: Color.fromARGB(255, 9, 52, 58),
                                      width: 2,
                                    ),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(25),
                                    borderSide: const BorderSide(
                                      color: Colors.pinkAccent,
                                      width: 2,
                                    ),
                                  ),
                                  floatingLabelStyle: const TextStyle(
                                    color: Colors.pinkAccent,
                                  ),
                                ),
                                cursorColor: Colors.pinkAccent,
                              ),
                            ),
                          ],
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text('Already have a user account?'),
                            TextButton(
                              onPressed: () {
                                Navigator.pushReplacementNamed(
                                    context, '/user_login');
                              },
                              child: const Text(
                                'Log in',
                                style: TextStyle(
                                  color: Color.fromARGB(255, 9, 52, 58),
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 15),
                          child: Container(
                            height: 60,
                            width: 400,
                            decoration: BoxDecoration(
                              color: const Color.fromARGB(255, 9, 52, 58),
                              borderRadius: BorderRadius.circular(15),
                            ),
                            child: MaterialButton(
                              onPressed: () async {
                                if (_formKey.currentState!.validate()) {
                                  setState(() {
                                    processing = true;
                                  });

                                  await signUpUser();

                                  setState(() {
                                    processing = false;
                                  });
                                }
                              },
                              child: processing
                                  ? const Center(
                                      child: CircularProgressIndicator(
                                        color: Colors.white,
                                      ),
                                    )
                                  : Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.start,
                                      children: const [
                                        Text(
                                          'Sign Up',
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontSize: 20,
                                          ),
                                        ),
                                      ],
                                    ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
