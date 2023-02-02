import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/src/widgets/placeholder.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart';
import 'package:questionnaires_app/main_screens/answers_overview.dart';
import 'package:questionnaires_app/main_screens/questionnaire_list.dart';
import 'package:questionnaires_app/widgets/app_bar.dart';
import 'package:questionnaires_app/widgets/snackbar.dart';

import '../widgets/alert_dialog.dart';

class UserHomeScreen extends StatefulWidget {
  const UserHomeScreen({
    super.key,
  });

  @override
  State<UserHomeScreen> createState() => _UserHomeScreenState();
}

class _UserHomeScreenState extends State<UserHomeScreen> {
  final GlobalKey<ScaffoldMessengerState> _scaffoldKey =
      GlobalKey<ScaffoldMessengerState>();

  final storage = const FlutterSecureStorage();

  String _localhost() {
    return 'http://127.0.0.1:3000/intelliq_api/logout';
  }

  Future<void> logOutUser() async {
    final url = Uri.parse(_localhost());

    // var jwt = await storage.read(key: "jwt");
    // if (jwt == null) throw Exception('Something went wrong!');

    Response response = await post(
      url,
      // headers: <String, String>{'X-OBSERVATORY-AUTH': jwt},
      body: jsonEncode(<String, String>{}),
    );

    if (response.statusCode == 200) {
      await storage.delete(key: "jwt");
      isLoggedOut = true;

      Navigator.pop(context);
      Navigator.pushReplacementNamed(context, '/welcome_screen');
    } else {
      Navigator.pop(context);
      MyMessageHandler.showSnackbar(
          _scaffoldKey, jsonDecode(response.body)['message']);
    }
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: ScaffoldMessenger(
        key: _scaffoldKey,
        child: Scaffold(
          backgroundColor: const Color.fromARGB(255, 127, 156, 160),
          appBar: AppBar(
            elevation: 4,
            toolbarHeight: 80,
            backgroundColor: const Color.fromARGB(255, 9, 52, 58),
            leading: const Icon(
              Icons.question_mark_outlined,
              color: Colors.pinkAccent,
              size: 50,
            ),
            title: const Padding(
              padding: EdgeInsets.only(bottom: 15),
              child: Text(
                'IntelliQ',
                style: TextStyle(
                  color: Colors.pinkAccent,
                  fontWeight: FontWeight.bold,
                  fontSize: 30,
                  letterSpacing: 2,
                ),
              ),
            ),
            bottom: const TabBar(
              indicatorColor: Colors.pinkAccent,
              indicatorWeight: 8,
              tabs: [
                Tab(
                  child: Text(
                    'Questionnaires',
                    style: TextStyle(
                      color: Colors.pinkAccent,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Tab(
                  child: Text(
                    'My Sessions',
                    style: TextStyle(
                      color: Colors.pinkAccent,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                )
              ],
            ),
            actions: [
              Padding(
                padding: const EdgeInsets.all(15),
                child: IconButton(
                  onPressed: () async {
                    MyAlertDialog.show(
                      context: context,
                      title: 'Log Out',
                      content: 'Are you sure you want to log out?',
                      tapNo: () {
                        Navigator.pop(context);
                      },
                      tapYes: () async {
                        await logOutUser();
                      },
                    );
                  },
                  icon: const Icon(
                    Icons.logout,
                    color: Colors.pinkAccent,
                    size: 30,
                  ),
                ),
              )
            ],
          ),
          body: const TabBarView(
            children: [
              QuestionnaireListScreen(
                label: 'answer questionnaire',
              ),
              QuestionnaireListScreen(
                label: 'answered questionnaires',
              ),
            ],
          ),
        ),
      ),
    );
  }
}
