import 'dart:html';

import 'package:flutter/material.dart';
import 'package:questionnaires_app/widgets/alert_dialog.dart';

class MyAppBar extends StatelessWidget with PreferredSizeWidget {
  final double elevation;
  final double height;
  const MyAppBar({
    super.key,
    this.elevation = 4,
    this.height = 100,
  });

  @override
  Size get preferredSize => Size.fromHeight(height);

  @override
  Widget build(BuildContext context) {
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
                tapYes: () {
                  Navigator.pop(context);
                  Navigator.pushReplacementNamed(context, '/welcome_screen');
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
