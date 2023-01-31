// ignore_for_file: void_checks

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:questionnaires_app/main_screens/answers_overview.dart';
import 'package:questionnaires_app/main_screens/choose_action.dart';
import 'package:questionnaires_app/main_screens/question_screen.dart';

import 'package:http/http.dart';
import 'package:questionnaires_app/main_screens/session_list.dart';
import 'package:questionnaires_app/main_screens/statistics_screen.dart';
import 'package:questionnaires_app/objects/answer.dart';
import 'package:questionnaires_app/objects/question.dart';
import 'package:questionnaires_app/widgets/app_bar.dart';
import 'package:questionnaires_app/widgets/snackbar.dart';

class QuestionnaireListScreen extends StatefulWidget {
  final String label;
  const QuestionnaireListScreen({super.key, required this.label});

  @override
  State<QuestionnaireListScreen> createState() =>
      _QuestionnaireListScreenState();
}

class _QuestionnaireListScreenState extends State<QuestionnaireListScreen> {
  late List questionnaires;
  late Future<List>? questionnaireTitles;

  final storage = const FlutterSecureStorage();

  final GlobalKey<ScaffoldMessengerState> _scaffoldKey =
      GlobalKey<ScaffoldMessengerState>();

  String _localhost1() {
    return 'http://127.0.0.1:3000/intelliq_api/questionnaire/getallquestionnaires';
  }

  Future<List> _getRestQuestionnaires() async {
    List<String> titles = [];
    List allquestionnaires;
    List answeredquestionnaires;

    final url1 = Uri.parse(_localhost1());

    var jwt = await storage.read(key: "jwt");
    if (jwt == null) throw Exception('Something went wrong!');

    Response response1 = await get(
      url1,
      headers: <String, String>{'Authorization': 'Bearer $jwt'},
    );

    if (response1.statusCode == 200) {
      allquestionnaires = jsonDecode(response1.body)['data']['questionnaires'];
    } else if (response1.statusCode == 402) {
      throw Exception('No questionnaires yet!');
    } else if (response1.statusCode == 401) {
      throw Exception(jsonDecode(response1.body)['message']);
    } else {
      throw Exception('Something went wrong!');
    }

    final url2 = Uri.parse(_localhost2());

    Response response2 = await get(
      url2,
      headers: <String, String>{'Authorization': 'Bearer $jwt'},
    );

    if (response2.statusCode == 200) {
      answeredquestionnaires = jsonDecode(response2.body)['data'];
    } else if (response2.statusCode == 402) {
      throw Exception('No questionnaires answered yet!');
    } else if (response2.statusCode == 401) {
      throw Exception(jsonDecode(response2.body)['message']);
    } else {
      throw Exception('Something went wrong!');
    }
    int temp = 0;
    questionnaires = [];

    for (int i = 0; i < answeredquestionnaires.length; i++) {
      while (allquestionnaires[temp]['questionnaireID'] !=
          answeredquestionnaires[i]['questionnaireID']) {
        questionnaires.add(allquestionnaires[temp]);
        temp++;
      }
      temp++;
    }

    for (int i = temp; i < allquestionnaires.length; i++) {
      questionnaires.add(allquestionnaires[i]);
    }

    for (int i = 0; i < questionnaires.length; i++) {
      titles.add(questionnaires[i]['questionnaireTitle']);
    }
    return titles;
  }

  String _localhost2() {
    return 'http://127.0.0.1:3000/intelliq_api/questionnaire/userquestionnaires';
  }

  Future<List> _getUserQuestionnaires() async {
    List<String> titles = [];

    final url = Uri.parse(_localhost2());
    var jwt = await storage.read(key: "jwt");
    if (jwt == null) throw Exception('Something went wrong!');

    Response response = await get(
      url,
      headers: <String, String>{'Authorization': 'Bearer $jwt'},
    );

    if (response.statusCode == 200) {
      questionnaires = jsonDecode(response.body)['data'];

      for (int i = 0; i < questionnaires.length; i++) {
        titles.add(questionnaires[i]['questionnaireTitle']);
      }
      return titles;
    } else if (response.statusCode == 402) {
      throw Exception('No questionnaires answered yet!');
    } else if (response.statusCode == 401) {
      throw Exception(jsonDecode(response.body)['message']);
    } else {
      throw Exception('Something went wrong!');
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

  String _localhost3() {
    return 'http://127.0.0.1:3000/intelliq_api/sessions/getsession';
  }

  Future<dynamic> getSession(String questionnaireID) async {
    final url = Uri.parse('${_localhost3()}/$questionnaireID');
    var jwt = await storage.read(key: "jwt");
    if (jwt == null) throw Exception('Something went wrong!');

    Response response = await get(
      url,
      headers: <String, String>{'Authorization': 'Bearer $jwt'},
    );

    if (response.statusCode == 200) {
      dynamic session = jsonDecode(response.body)['data'];

      return session;
    } else if (response.statusCode == 402) {
      throw Exception('No session found');
    } else if (response.statusCode == 401) {
      throw Exception(jsonDecode(response.body)['message']);
    } else {
      throw Exception('Something went wrong!');
    }
  }

  void showMySession(dynamic mySession, dynamic questionnaire) {
    List<Answer> answers = [];
    List<dynamic> questions = [];
    int optIndex = 0;

    for (int i = 0; i < mySession['answers'].length; i++) {
      for (int j = 0; j < questionnaire['questions'].length; j++) {
        if (mySession['answers'][i]['qID'] ==
            questionnaire['questions'][j]['qID']) {
          questions.add(questionnaire['questions'][j]);
          break;
        }
      }
    }

    for (int i = 0; i < mySession['answers'].length; i++) {
      for (int j = 0; j < questions[i]['options'].length; j++) {
        if (mySession['answers'][i]['optID'] ==
            questions[i]['options'][j]['optID']) {
          optIndex = j;

          answers.add(Answer(
            questionnaireID: questionnaire['questionnaireID'],
            questionID: questions[i]['qID'],
            options: questions[i]['options'],
            questiontxt: questions[i]['qtext'],
            optionIndex: optIndex,
            answertxt: mySession['answers'][i]['answertext'],
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
            questionnaireTitle: questionnaire['questionnaireTitle'],
            label: 'view my session',
          ),
        ),
        (route) => true);
  }

  @override
  void initState() {
    super.initState();
    setState(() {
      if (widget.label == 'answered questionnaires') {
        questionnaireTitles = _getUserQuestionnaires();
      } else if (widget.label == 'answer questionnaire') {
        questionnaireTitles = _getRestQuestionnaires();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        backgroundColor: const Color.fromARGB(255, 127, 156, 160),
        body: FutureBuilder<List<dynamic>>(
          future: questionnaireTitles,
          builder: (context, AsyncSnapshot<List> snapshot) {
            if (snapshot.hasData) {
              return ListView.builder(
                itemCount: snapshot.data!.length,
                itemBuilder: (context, index) {
                  return InkWell(
                    onTap: () async {
                      if (widget.label == 'answer questionnaire') {
                        answerQuestionnaire(index);
                      } else if (widget.label == 'show statistics') {
                        showStatistics(index);
                      } else if (widget.label == 'view answers') {
                        showSessions(index);
                      } else if (widget.label == 'answered questionnaires') {
                        try {
                          dynamic session = await getSession(
                              questionnaires[index]['questionnaireID']);

                          showMySession(session, questionnaires[index]);
                        } on Exception catch (e) {
                          MyMessageHandler.showSnackbar(
                              _scaffoldKey, e.toString());
                        }
                      }
                    },
                    child: Card(
                      child: Row(
                        children: [
                          widget.label == 'answered questionnaires'
                              ? const Icon(
                                  Icons.done,
                                  size: 40,
                                )
                              : const Icon(
                                  FontAwesomeIcons.question,
                                  size: 40,
                                ),
                          Padding(
                            padding:
                                const EdgeInsets.only(bottom: 10, left: 15),
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
                child: Text('${snapshot.error}'.split(':')[1]),
              );
            }

            return const Center(
                child: CircularProgressIndicator(
              color: Colors.pinkAccent,
            ));
          },
        ),
      ),
    );
  }
}
