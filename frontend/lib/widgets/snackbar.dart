import 'package:flutter/material.dart';

class MyMessageHandler {
  static void showSnackbar(var _scaffoldKey, String message,
      {Color color = Colors.red}) {
    _scaffoldKey.currentState!.hideCurrentSnackBar();
    _scaffoldKey.currentState!.showSnackBar(
      SnackBar(
        duration: const Duration(seconds: 2),
        backgroundColor: color,
        content: Text(
          message,
          textAlign: TextAlign.center,
          style: const TextStyle(
            fontSize: 18,
            color: Colors.white,
          ),
        ),
      ),
    );
  }
}
