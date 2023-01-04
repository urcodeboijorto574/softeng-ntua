import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:questionnaires_app/objects/question.dart';

class QuestionScreen extends StatefulWidget {
  final String qId;
  final int index;
  const QuestionScreen({super.key, required this.qId, required this.index});

  @override
  State<QuestionScreen> createState() => _QuestionScreenState();
}

class _QuestionScreenState extends State<QuestionScreen> {
  int selectedItem = 0;

  final Question question = const Question(
    qId: 'Q0',
    qtext: 'What is your favourite KPOP group?',
    required_: true,
    type: 'question',
    options: [
      '{"optId": "OP0", "opttxt": "BTS", "nextqId": "Q1"}',
      '{"optId": "OP1", "opttxt": "EXO", "nextqId": "Q2"}',
      '{"optId": "OP2", "opttxt": "Stray Kids", "nextqId": "Q3"}'
    ],
  );

  @override
  Widget build(BuildContext context) {
    final opt1 = jsonDecode(question.options[0]);
    final opt2 = jsonDecode(question.options[1]);
    final opt3 = jsonDecode(question.options[2]);

    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 9, 52, 58),
      appBar: AppBar(
        elevation: 0,
        toolbarHeight: 90,
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
              onPressed: () {
                Navigator.pushReplacementNamed(context, '/welcome_screen');
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
      body: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            height: MediaQuery.of(context).size.height * 0.8,
            width: 1000,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.8),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Padding(
              padding: const EdgeInsets.all(90),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${widget.index}. ${question.qtext}',
                    style: const TextStyle(
                      color: Colors.black,
                      fontSize: 22,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(top: 10),
                    child: Column(
                      children: [
                        RadioListTile(
                          value: 1,
                          groupValue: selectedItem,
                          onChanged: (int? value) {
                            setState(() {
                              selectedItem = value!;
                            });
                          },
                          title: Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: Text('${opt1['opttxt']}'),
                          ),
                        ),
                        RadioListTile(
                          value: 2,
                          groupValue: selectedItem,
                          onChanged: (int? value) {
                            setState(() {
                              selectedItem = value!;
                            });
                          },
                          title: Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: Text('${opt2['opttxt']}'),
                          ),
                        ),
                        RadioListTile(
                          value: 3,
                          groupValue: selectedItem,
                          onChanged: (int? value) {
                            setState(() {
                              selectedItem = value!;
                            });
                          },
                          title: Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: Text('${opt3['opttxt']}'),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Row(
                    children: [
                      Container(
                        height: 50,
                        width: 100,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.8),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: const Color.fromARGB(255, 9, 52, 58),
                            width: 2,
                          ),
                        ),
                        child: const Padding(
                          padding: EdgeInsets.only(bottom: 8, left: 20),
                          child: Text(
                            'Next',
                            style: TextStyle(
                              color: Color.fromARGB(255, 9, 52, 58),
                              fontSize: 20,
                            ),
                          ),
                        ),
                      ),
                    ],
                  )
                ],
              ),
            ),
          ),
        ],
      ),
    );
    ;
  }
}
