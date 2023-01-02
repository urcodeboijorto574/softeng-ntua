import 'package:flutter/material.dart';
import 'package:questionnaires_app/auth/admin_login.dart';
import 'package:questionnaires_app/auth/admin_signup.dart';
import 'package:questionnaires_app/auth/user_login.dart';
import 'package:questionnaires_app/auth/user_signup.dart';

import 'main_screens/welcome_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.cyan,
        fontFamily: 'NotoNastalic',
      ),
      initialRoute: '/welcome_screen',
      routes: {
        '/welcome_screen': (context) => const WelcomeScreen(),
        '/user_signup': (context) => const UserSignupScreen(),
        '/user_login': (context) => const UserLoginScreen(),
        '/admin_signup': (context) => const AdminSignupScreen(),
        '/admin_login': (context) => const AdminLoginScreen(),
      },
    );
  }
}
