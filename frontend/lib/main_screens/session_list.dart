// ignore_for_file: void_checks

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:questionnaires_app/main_screens/admin_questionnaire_list.dart';
import 'package:questionnaires_app/main_screens/answers_overview.dart';
import 'package:questionnaires_app/main_screens/question_screen.dart';

import 'package:http/http.dart';
import 'package:questionnaires_app/main_screens/questionnaire_list.dart';
import 'package:questionnaires_app/main_screens/statistics_screen.dart';
import 'package:questionnaires_app/objects/answer.dart';
import 'package:questionnaires_app/objects/question.dart';
import 'package:questionnaires_app/widgets/app_bar.dart';
import 'package:questionnaires_app/widgets/snackbar.dart';

class SessionListScreen extends StatefulWidget {
  final String questionnaireTitle;
  final String questionnaireID;
  final List<dynamic> questions;
  const SessionListScreen(
      {super.key,
      required this.questionnaireID,
      required this.questions,
      required this.questionnaireTitle});

  @override
  State<SessionListScreen> createState() => _SessionListScreenState();
}

class _SessionListScreenState extends State<SessionListScreen> {
  late List sessions;
  late Future<List> sessionsTitles;

  final storage = const FlutterSecureStorage();

  final GlobalKey<ScaffoldMessengerState> _scaffoldKey =
      GlobalKey<ScaffoldMessengerState>();

  String _localhost() {
    return 'http://127.0.0.1:3000/intelliq_api/sessions/getallsessions/${widget.questionnaireID}';
  }

  Future<List> _getAllSessions() async {
    List<String> titles = [];

    final url = Uri.parse(_localhost());

    var jwt = await storage.read(key: "jwt");
    if (jwt == null) throw Exception('Something went wrong!');

    Response response = await get(
      url,
      headers: <String, String>{'Authorization': 'Bearer $jwt'},
    );

    if (response.statusCode == 200) {
      sessions = jsonDecode(response.body)['data'];

      for (int i = 0; i < sessions.length; i++) {
        titles.add(sessions[i]['sessionID']);
      }
      return titles;
    } else if (response.statusCode == 402) {
      return [];
    } else if (response.statusCode == 401) {
      MyMessageHandler.showSnackbar(
          _scaffoldKey, jsonDecode(response.body)['message']);
      return [];
    } else {
      MyMessageHandler.showSnackbar(_scaffoldKey, 'Something went wrong!');
      return [];
    }
  }

  void viewAnswers(int index) {
    List<Answer> answers = [];
    List<dynamic> questions = [];
    int optIndex = 0;

    for (int i = 0; i < sessions[index]['answers'].length; i++) {
      for (int j = 0; j < widget.questions.length; j++) {
        if (sessions[index]['answers'][i]['qID'] ==
            widget.questions[j]['qID']) {
          questions.add(widget.questions[j]);
          break;
        }
      }
    }

    for (int i = 0; i < sessions[index]['answers'].length; i++) {
      for (int j = 0; j < questions[i]['options'].length; j++) {
        if (sessions[index]['answers'][i]['optID'] ==
            questions[i]['options'][j]['optID']) {
          optIndex = j;

          answers.add(Answer(
            questionnaireID: widget.questionnaireID,
            questionID: questions[i]['qID'],
            options: questions[i]['options'],
            questiontxt: questions[i]['qtext'],
            optionIndex: optIndex,
            answertxt: sessions[index]['answers'][i]['answertext'],
          ));
          break;
        }
      }
    }

    Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(
          builder: (context) => AnswersOverviewScreen(
            answers: answers,
            questionnaireTitle: widget.questionnaireTitle,
            label: 'view answers',
          ),
        ),
        (route) => true);
  }

  @override
  void initState() {
    super.initState();
    setState(() {
      sessionsTitles = _getAllSessions();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 127, 156, 160),
      appBar: MyAppBar(
        scaffoldKey: _scaffoldKey,
      ),
      body: FutureBuilder<List>(
        future: sessionsTitles,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return ListView.builder(
              itemCount: snapshot.data!.length,
              itemBuilder: (context, index) {
                return InkWell(
                  onTap: () {
                    viewAnswers(index);
                  },
                  child: Card(
                    child: Row(
                      children: [
                        const Padding(
                          padding: EdgeInsets.only(left: 10),
                          child: Icon(
                            Icons.assignment_rounded,
                            size: 40,
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.only(bottom: 10, left: 15),
                          child: Text(
                            'Session ${snapshot.data![index]}',
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
              child: Text('${snapshot.error}'.split(':')[1]),
            );
          }

          return const Center(
              child: CircularProgressIndicator(
            color: Colors.pinkAccent,
          ));
        },
      ),
      floatingActionButton: Padding(
        padding: const EdgeInsets.all(40.0),
        child: FloatingActionButton.extended(
          onPressed: () {
            Navigator.pushAndRemoveUntil(context,
                MaterialPageRoute(builder: (context) {
              return const AdminQuestionnaireList(
                label: 'view answers',
              );
            }), (route) => false);
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
    );
  }
}
