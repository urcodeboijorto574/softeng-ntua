// ignore_for_file: void_checks

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:questionnaires_app/main_screens/question_screen.dart';

import 'package:http/http.dart';
import 'package:questionnaires_app/objects/question.dart';

class QuestionnaireListToAnswerScreen extends StatefulWidget {
  const QuestionnaireListToAnswerScreen({super.key});

  @override
  State<QuestionnaireListToAnswerScreen> createState() =>
      _QuestionnaireListToAnswerScreenState();
}

class _QuestionnaireListToAnswerScreenState
    extends State<QuestionnaireListToAnswerScreen> {
  late List questionnaires;
  late Future<List> questionnaireTitles;

  String _localhost() {
    return 'http://127.0.0.1:3000/intelliq_api/questionnaire/getAllQuestionnaires';
  }

  Future<List> _getAllQuestionnaires() async {
    List<String> titles = [];

    final url = Uri.parse(_localhost());
    Response response = await get(url);

    if (response.statusCode == 200) {
      questionnaires = jsonDecode(response.body)['data']['questionnaires'];

      for (int i = 0; i < questionnaires.length; i++) {
        titles.add(questionnaires[i]['questionnaireTitle']);
      }
      return titles;
    } else {
      throw Exception('Failed to load the questionnaires');
    }
  }

  @override
  void initState() {
    super.initState();
    setState(() {
      questionnaireTitles = _getAllQuestionnaires();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 127, 156, 160),
      appBar: AppBar(
        toolbarHeight: 100,
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
      body: FutureBuilder<List>(
        future: questionnaireTitles,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return ListView.builder(
              itemCount: snapshot.data!.length,
              itemBuilder: (context, index) {
                return InkWell(
                  onTap: () {
                    Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(
                          builder: (context) => QuestionScreen(
                            questionnaireID: questionnaires[index]
                                ['questionnaireID'],
                            questionnaireTitle: questionnaires[index]
                                ['questionnaireTitle'],
                            answers: [],
                            questions: questionnaires[index]['questions'],
                            index: 1,
                            question: Question(
                                qID: questionnaires[index]['questions'][0]
                                    ['qID'],
                                qtext: questionnaires[index]['questions'][0]
                                    ['qtext'],
                                required_: questionnaires[index]['questions'][0]
                                    ['required'],
                                type: questionnaires[index]['questions'][0]
                                    ['type'],
                                options: questionnaires[index]['questions'][0]
                                    ['options']),
                          ),
                        ),
                        (route) => false);
                  },
                  child: Card(
                    child: Row(
                      children: [
                        const Icon(
                          FontAwesomeIcons.question,
                          size: 40,
                        ),
                        Padding(
                          padding: const EdgeInsets.only(bottom: 10, left: 15),
                          child: Text(
                            snapshot.data![index],
                            style: const TextStyle(
                              fontSize: 20,
                            ),
                          ),
                        )
                      ],
                    ),
                  ),
                );
              },
            );
          } else if (snapshot.hasError) {
            return Center(
              child: Text('${snapshot.error}'),
            );
          }

          return const Center(
              child: CircularProgressIndicator(
            color: Colors.pinkAccent,
          ));
        },
      ),
    );
  }
}
