import 'dart:convert';
import 'dart:html';

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart';
import 'package:questionnaires_app/widgets/alert_dialog.dart';
import 'package:questionnaires_app/widgets/snackbar.dart';

bool isLoggedOut = false;

class MyAppBar extends StatelessWidget with PreferredSizeWidget {
  final double elevation;
  final double height;
  final GlobalKey<ScaffoldMessengerState> scaffoldKey;
  const MyAppBar({
    super.key,
    this.elevation = 4,
    this.height = 100,
    required this.scaffoldKey,
  });

  @override
  Size get preferredSize => Size.fromHeight(height);

  @override
  Widget build(BuildContext context) {
    const storage = FlutterSecureStorage();

    String _localhost() {
      return 'https://127.0.0.1:3000/intelliq_api/logout';
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
            scaffoldKey, jsonDecode(response.body)['message']);
      }
    }

    return AppBar(
      elevation: elevation,
      toolbarHeight: height,
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
    );
  }
}
