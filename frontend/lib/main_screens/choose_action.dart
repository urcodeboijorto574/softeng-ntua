import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:questionnaires_app/main_screens/questionnaire_list.dart';
import 'package:questionnaires_app/widgets/app_bar.dart';

class ChooseActionScreen extends StatelessWidget {
  const ChooseActionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 127, 156, 160),
      appBar: const MyAppBar(),
      body: Center(
          child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          InkWell(
            onTap: () {
              Navigator.pushAndRemoveUntil(context,
                  MaterialPageRoute(builder: (context) {
                return const QuestionnaireListScreen(
                  label: 'show statistics',
                );
              }), (route) => false);
            },
            child: Container(
              height: 200,
              width: 200,
              decoration: BoxDecoration(
                color: const Color.fromARGB(255, 9, 52, 58),
                borderRadius: BorderRadius.circular(25),
              ),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: const [
                    Icon(
                      Icons.pie_chart,
                      color: Colors.pinkAccent,
                      size: 100,
                    ),
                    Text(
                      'Show Statistics',
                      style: TextStyle(
                        color: Colors.pinkAccent,
                        fontSize: 25,
                      ),
                    )
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(
            width: 100,
          ),
          InkWell(
            onTap: () {
              Navigator.pushAndRemoveUntil(context,
                  MaterialPageRoute(builder: (context) {
                return const QuestionnaireListScreen(
                  label: 'view answers',
                );
              }), (route) => false);
            },
            child: Container(
              height: 200,
              width: 200,
              decoration: BoxDecoration(
                color: const Color.fromARGB(255, 9, 52, 58),
                borderRadius: BorderRadius.circular(25),
              ),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: const [
                    Icon(
                      Icons.question_answer,
                      color: Colors.pinkAccent,
                      size: 100,
                    ),
                    Text(
                      'View Answers',
                      style: TextStyle(
                        color: Colors.pinkAccent,
                        fontSize: 25,
                      ),
                    )
                  ],
                ),
              ),
            ),
          ),
        ],
      )),
    );
  }
}
