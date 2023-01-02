import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';

class UserSignupScreen extends StatefulWidget {
  const UserSignupScreen({super.key});

  @override
  State<UserSignupScreen> createState() => _UserSignupScreenState();
}

class _UserSignupScreenState extends State<UserSignupScreen> {
  late String email;
  late String password;
  late String fullName;

  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  bool passwordVisible = false;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
                                    return 'Please enter your email';
                                  } else {
                                    return null;
                                  }
                                },
                                onChanged: (value) {
                                  email = value;
                                },
                                keyboardType: TextInputType.emailAddress,
                                decoration: InputDecoration(
                                  labelText: 'Email',
                                  hintText: 'Enter your email',
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
                                  padding:
                                      const EdgeInsets.symmetric(horizontal: 8),
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
                                      color:
                                          const Color.fromARGB(255, 9, 52, 58),
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
                            onPressed: () {
                              if (_formKey.currentState!.validate()) {
                                print(fullName);
                                print(email);
                                print(password);

                                Navigator.pushReplacementNamed(
                                    context, '/user_login');
                              }
                            },
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.start,
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
    );
  }
}
