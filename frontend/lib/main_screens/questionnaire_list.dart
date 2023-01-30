// ignore_for_file: void_checks

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:questionnaires_app/main_screens/choose_action.dart';
import 'package:questionnaires_app/main_screens/question_screen.dart';

import 'package:http/http.dart';
import 'package:questionnaires_app/main_screens/session_list.dart';
import 'package:questionnaires_app/main_screens/statistics_screen.dart';
import 'package:questionnaires_app/objects/question.dart';
import 'package:questionnaires_app/widgets/app_bar.dart';

class QuestionnaireListScreen extends StatefulWidget {
  final String label;
  const QuestionnaireListScreen({super.key, required this.label});

  @override
  State<QuestionnaireListScreen> createState() =>
      _QuestionnaireListScreenState();
}

class _QuestionnaireListScreenState extends State<QuestionnaireListScreen> {
  late List questionnaires;
  late Future<List> questionnaireTitles;

  final storage = const FlutterSecureStorage();

  String _localhost1() {
    return 'http://127.0.0.1:3000/intelliq_api/questionnaire/getallquestionnaires';
  }

  Future<List> _getAllQuestionnaires() async {
    List<String> titles = [];

    final url = Uri.parse(_localhost1());
    var jwt = await storage.read(key: "jwt");
    Response response = await get(
      url,
      headers: <String, String>{'Authorization': 'Bearer ${jwt!}'},
    );

    if (response.statusCode == 200) {
      questionnaires = jsonDecode(response.body)['data']['questionnaires'];

      for (int i = 0; i < questionnaires.length; i++) {
        titles.add(questionnaires[i]['questionnaireTitle']);
      }
      return titles;
    } else if (response.statusCode == 402) {
      throw Exception('No questionnaires yet!');
    } else {
      throw Exception('Failed to load the questionnaires!');
    }
  }

  String _localhost2() {
    return 'http://127.0.0.1:3000/intelliq_api/questionnaire/userquestionnaires';
  }

  Future<List> _getUserQuestionnaires() async {
    List<String> titles = [];

    final url = Uri.parse(_localhost2());
    var jwt = await storage.read(key: "jwt");
    Response response = await get(
      url,
      headers: <String, String>{'Authorization': 'Bearer ${jwt!}'},
    );

    if (response.statusCode == 200) {
      questionnaires = jsonDecode(response.body)['data']['questionnaires'];

      for (int i = 0; i < questionnaires.length; i++) {
        titles.add(questionnaires[i]['questionnaireTitle']);
      }
      return titles;
    } else if (response.statusCode == 402) {
      throw Exception('No questionnaires yet!');
    } else {
      throw Exception('Failed to load the questionnaires!');
    }
  }

  void answerQuestionnaire(int index) {
    Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(
          builder: (context) => QuestionScreen(
            questionnaireID: questionnaires[index]['questionnaireID'],
            questionnaireTitle: questionnaires[index]['questionnaireTitle'],
            answers: [],
            questions: questionnaires[index]['questions'],
            index: 1,
            question: Question(
                qID: questionnaires[index]['questions'][0]['qID'],
                qtext: questionnaires[index]['questions'][0]['qtext'],
                required_: questionnaires[index]['questions'][0]['required'],
                type: questionnaires[index]['questions'][0]['type'],
                options: questionnaires[index]['questions'][0]['options']),
          ),
        ),
        (route) => false);
  }

  void showStatistics(int index) {
    Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(
          builder: (context) => StatisticsScreen(
            questionnaireTitle: questionnaires[index]['questionnaireTitle'],
            questions: questionnaires[index]['questions'],
          ),
        ),
        (route) => false);
  }

  void showSessions(int index) {
    Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(
          builder: (context) => SessionListScreen(
            questionnaireID: questionnaires[index]['questionnaireID'],
            questions: questionnaires[index]['questions'],
            questionnaireTitle: questionnaires[index]['questionnaireTitle'],
          ),
        ),
        (route) => false);
  }

  @override
  void initState() {
    super.initState();
    setState(() {
      if (widget.label == 'answer questionnaire') {
        questionnaireTitles = _getAllQuestionnaires();
      } else if (widget.label == 'answered questionnaires') {
        questionnaireTitles = _getUserQuestionnaires();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List>(
      future: questionnaireTitles,
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          return ListView.builder(
            itemCount: snapshot.data!.length,
            itemBuilder: (context, index) {
              return InkWell(
                onTap: () {
                  if (widget.label == 'answer questionnaire') {
                    answerQuestionnaire(index);
                  } else if (widget.label == 'show statistics') {
                    showStatistics(index);
                  } else if (widget.label == 'view answers') {
                    showSessions(index);
                  }
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
    );
  }
}
