import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart';
import 'package:questionnaires_app/main_screens/questionnaire_list.dart';
import 'package:questionnaires_app/main_screens/user_homescreen.dart';
import 'package:questionnaires_app/objects/answer.dart';
import 'package:questionnaires_app/widgets/alert_dialog.dart';
import 'package:questionnaires_app/widgets/app_bar.dart';
import 'package:questionnaires_app/widgets/snackbar.dart';

bool? isSubmitted = false;

String generateRandomString(int len) {
  var r = Random();
  const _chars =
      'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';
  return List.generate(len, (index) => _chars[r.nextInt(_chars.length)]).join();
}

class AnswersOverviewScreen extends StatefulWidget {
  final List<Answer> answers;
  final String questionnaireTitle;
  final String label;

  const AnswersOverviewScreen(
      {super.key,
      required this.answers,
      required this.questionnaireTitle,
      required this.label});

  @override
  State<AnswersOverviewScreen> createState() => _AnswersOverviewScreenState();
}

class _AnswersOverviewScreenState extends State<AnswersOverviewScreen> {
  bool processing = false;

  final storage = const FlutterSecureStorage();
  final GlobalKey<ScaffoldMessengerState> _scaffoldKey =
      GlobalKey<ScaffoldMessengerState>();

  String _localhost1() {
    return 'https://127.0.0.1:9103/intelliq_api/doanswer';
  }

  String _localhost2() {
    return 'https://127.0.0.1:9103/intelliq_api/session/getallsessionsids';
  }

  Future<List> _getAllSessionIDs() async {
    List<String> sessions = [];

    final url = Uri.parse(_localhost2());

    // var jwt = await storage.read(key: "jwt");
    // if (jwt == null) {
    //   throw Exception('Something went wrong!');
    // }

    Response response = await get(
      url,
      // headers: <String, String>{'X-OBSERVATORY-AUTH': jwt},
    );

    if (response.statusCode == 200) {
      for (int i = 0;
          i < jsonDecode(response.body)['data']['sessionsIDs'].length;
          i++) {
        sessions.add(
            jsonDecode(response.body)['data']['sessionsIDs'][i]['sessionID']);
      }
      return sessions;
    } else if (response.statusCode == 402) {
      return [];
    } else if (response.statusCode == 401) {
      throw Exception(jsonDecode(response.body)['message']);
    } else {
      throw Exception('Something went wrong!');
    }
  }

  Future<void> _sendAnswer(Answer single_answer, String session) async {
    final url = Uri.parse(
        '${_localhost1()}/${single_answer.questionnaireID}/${single_answer.questionID}/$session/${single_answer.options[single_answer.optionIndex]['optID']}');

    // var jwt = await storage.read(key: "jwt");
    // if (jwt == null) {
    //   throw Exception('Something went wrong!');
    // }

    Response response = await post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
        'Accept': '*/*',
        'Allow': '*',
        // 'X-OBSERVATORY-AUTH': jwt
      },
      body: jsonEncode(<String, String>{
        'answertext': single_answer.answertxt,
      }),
    );

    if (response.statusCode == 200) {
      return;
    } else if (response.statusCode == 401) {
      throw Exception(jsonDecode(response.body)['message']);
    } else {
      throw Exception('Something went wrong!');
    }
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        backgroundColor: const Color.fromARGB(255, 9, 52, 58),
        appBar: MyAppBar(
          elevation: 0,
          height: 90,
          scaffoldKey: _scaffoldKey,
        ),
        body: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              width: 1000,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.8),
                borderRadius: BorderRadius.circular(10),
              ),
              child: ListView.builder(
                itemCount: widget.answers.length + 2,
                itemBuilder: ((context, index) {
                  if (index == 0) {
                    return Column(
                      children: [
                        widget.label == 'submit answers'
                            ? Padding(
                                padding:
                                    const EdgeInsets.only(top: 10, right: 10),
                                child: SizedBox(
                                  height: 40,
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.end,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Padding(
                                        padding:
                                            const EdgeInsets.only(right: 20),
                                        child: InkWell(
                                          onTap: () async {
                                            MyAlertDialog.show(
                                              context: context,
                                              title: 'Leave Questionnaire',
                                              content:
                                                  'Are you sure you want to leave the questionnaire? Your progress will be lost!',
                                              tapNo: () {
                                                Navigator.pop(context);
                                              },
                                              tapYes: () {
                                                Navigator.pop(context);
                                                Navigator.pushAndRemoveUntil(
                                                    context, MaterialPageRoute(
                                                        builder: (context) {
                                                  return const UserHomeScreen();
                                                }), (route) => false);
                                              },
                                            );
                                          },
                                          child: Row(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.center,
                                            children: const [
                                              Padding(
                                                padding:
                                                    EdgeInsets.only(top: 14),
                                                child: Icon(
                                                  Icons.close,
                                                  color: Colors.pink,
                                                ),
                                              ),
                                              SizedBox(width: 5),
                                              Text(
                                                'Cancel',
                                                style: TextStyle(
                                                  fontSize: 18,
                                                  color: Colors.pink,
                                                ),
                                              )
                                            ],
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              )
                            : const SizedBox(
                                height: 50,
                              ),
                        Center(
                          child: Text(
                            widget.questionnaireTitle,
                            style: const TextStyle(
                              color: Colors.black,
                              fontWeight: FontWeight.bold,
                              fontSize: 30,
                            ),
                          ),
                        ),
                      ],
                    );
                  } else if (index == widget.answers.length + 1) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 60, top: 60),
                      child: Center(
                        child: Container(
                          height: 60,
                          width: 400,
                          decoration: BoxDecoration(
                            color: const Color.fromARGB(255, 9, 52, 58),
                            borderRadius: BorderRadius.circular(15),
                          ),
                          child: widget.label == 'submit answers'
                              ? MaterialButton(
                                  onPressed: () async {
                                    setState(() {
                                      processing = true;
                                    });

                                    try {
                                      bool isValid = false;
                                      List<dynamic> sessions =
                                          await _getAllSessionIDs();
                                      String sessionID = ' ';

                                      while (!isValid) {
                                        sessionID = generateRandomString(4);

                                        if (sessions.isEmpty) {
                                          isValid = true;
                                        }

                                        for (int i = 0;
                                            i < sessions.length;
                                            i++) {
                                          if (sessions[i] == sessionID) {
                                            isValid = false;
                                            break;
                                          }
                                          isValid = true;
                                        }
                                      }

                                      for (int i = 0;
                                          i < widget.answers.length;
                                          i++) {
                                        await _sendAnswer(
                                            widget.answers[i], sessionID);
                                      }

                                      isSubmitted = true;

                                      Navigator.pushAndRemoveUntil(context,
                                          MaterialPageRoute(builder: (context) {
                                        return const UserHomeScreen();
                                      }), (route) => false);
                                    } catch (e) {
                                      MyMessageHandler.showSnackbar(
                                          _scaffoldKey, e.toString());
                                    }

                                    setState(() {
                                      processing = false;
                                    });
                                  },
                                  child: processing
                                      ? const Center(
                                          child: CircularProgressIndicator(
                                            color: Colors.white,
                                          ),
                                        )
                                      : Column(
                                          mainAxisAlignment:
                                              MainAxisAlignment.start,
                                          children: const [
                                            Text(
                                              'Submit',
                                              style: TextStyle(
                                                color: Colors.white,
                                                fontSize: 20,
                                              ),
                                            ),
                                          ],
                                        ),
                                )
                              : widget.label == 'view my session'
                                  ? MaterialButton(
                                      onPressed: () {
                                        Navigator.pushAndRemoveUntil(context,
                                            MaterialPageRoute(
                                                builder: (context) {
                                          return const UserHomeScreen();
                                        }), (route) => false);
                                      },
                                      child: processing
                                          ? const Center(
                                              child: CircularProgressIndicator(
                                                color: Colors.white,
                                              ),
                                            )
                                          : Column(
                                              mainAxisAlignment:
                                                  MainAxisAlignment.start,
                                              children: const [
                                                Text(
                                                  'Back to Questionnaires',
                                                  style: TextStyle(
                                                    color: Colors.white,
                                                    fontSize: 20,
                                                  ),
                                                ),
                                              ],
                                            ),
                                    )
                                  : MaterialButton(
                                      onPressed: () {
                                        Navigator.pop(context);
                                      },
                                      child: processing
                                          ? const Center(
                                              child: CircularProgressIndicator(
                                                color: Colors.white,
                                              ),
                                            )
                                          : Column(
                                              mainAxisAlignment:
                                                  MainAxisAlignment.start,
                                              children: const [
                                                Text(
                                                  'Back to Sessions',
                                                  style: TextStyle(
                                                    color: Colors.white,
                                                    fontSize: 20,
                                                  ),
                                                ),
                                              ],
                                            ),
                                    ),
                        ),
                      ),
                    );
                  } else {
                    return Padding(
                      padding:
                          const EdgeInsets.only(top: 60, left: 100, right: 100),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '$index. ${widget.answers[index - 1].questiontxt}',
                            style: const TextStyle(
                              color: Colors.black,
                              fontSize: 22,
                              fontWeight: FontWeight.w400,
                            ),
                          ),
                          widget.answers[index - 1].answertxt == ' '
                              ? Padding(
                                  padding: const EdgeInsets.only(top: 10),
                                  child: ListView.builder(
                                    shrinkWrap: true,
                                    itemCount: widget
                                        .answers[index - 1].options.length,
                                    itemBuilder: (context, index2) {
                                      return RadioListTile(
                                        value: index2 + 1,
                                        groupValue: widget.answers[index - 1]
                                                .optionIndex +
                                            1,
                                        title: Text(widget.answers[index - 1]
                                            .options[index2]['opttxt']),
                                        activeColor: const Color.fromARGB(
                                            255, 9, 52, 58),
                                        onChanged: (int? value) {},
                                      );
                                    },
                                  ),
                                )
                              : Padding(
                                  padding: const EdgeInsets.only(top: 10),
                                  child: Container(
                                    width: 500,
                                    height: 60,
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(25),
                                      border: Border.all(
                                        width: 2,
                                        color: const Color.fromARGB(
                                            255, 9, 52, 58),
                                      ),
                                    ),
                                    child: Padding(
                                      padding: const EdgeInsets.only(
                                          left: 15, top: 5),
                                      child: Text(
                                        widget.answers[index - 1].answertxt,
                                        style: const TextStyle(
                                          color: Colors.black,
                                          fontSize: 15,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                        ],
                      ),
                    );
                  }
                }),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
