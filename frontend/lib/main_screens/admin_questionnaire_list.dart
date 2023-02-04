import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/src/widgets/placeholder.dart';
import 'package:questionnaires_app/main_screens/choose_action.dart';
import 'package:questionnaires_app/main_screens/questionnaire_list.dart';
import 'package:questionnaires_app/widgets/app_bar.dart';

class AdminQuestionnaireList extends StatefulWidget {
  final String label;
  const AdminQuestionnaireList({super.key, required this.label});

  @override
  State<AdminQuestionnaireList> createState() => _AdminQuestionnaireListState();
}

class _AdminQuestionnaireListState extends State<AdminQuestionnaireList> {
  final GlobalKey<ScaffoldMessengerState> _scaffoldKey =
      GlobalKey<ScaffoldMessengerState>();
  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        backgroundColor: const Color.fromARGB(255, 127, 156, 160),
        appBar: MyAppBar(
          scaffoldKey: _scaffoldKey,
        ),
        body: QuestionnaireListScreen(
          label: widget.label,
        ),
        floatingActionButton: Padding(
          padding: const EdgeInsets.all(40.0),
          child: FloatingActionButton.extended(
            onPressed: () {
              Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(
                      builder: (context) => const ChooseActionScreen()),
                  (route) => false);
            },
            label: const Padding(
              padding: EdgeInsets.only(bottom: 10),
              child: Text(
                'Back',
                style: TextStyle(
                  color: Color.fromARGB(255, 9, 52, 58),
                  fontWeight: FontWeight.w600,
                  fontSize: 15,
                ),
              ),
            ),
            icon: const Icon(
              Icons.arrow_back,
              color: Color.fromARGB(255, 9, 52, 58),
            ),
            backgroundColor: Colors.pink,
          ),
        ),
      ),
    );
  }
}
