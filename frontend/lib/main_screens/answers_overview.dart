import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:http/http.dart';
import 'package:questionnaires_app/main_screens/questionnaire_list.dart';
import 'package:questionnaires_app/objects/answer.dart';

String generateRandomString(int len) {
  var r = Random();
  const _chars =
      'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';
  return List.generate(len, (index) => _chars[r.nextInt(_chars.length)]).join();
}

class AnswersOverviewScreen extends StatefulWidget {
  final List<Answer> answers;
  final String questionnaireTitle;

  const AnswersOverviewScreen(
      {super.key, required this.answers, required this.questionnaireTitle});

  @override
  State<AnswersOverviewScreen> createState() => _AnswersOverviewScreenState();
}

class _AnswersOverviewScreenState extends State<AnswersOverviewScreen> {
  bool processing = false;

  String _localhost() {
    return 'http://127.0.0.1:3000/intelliq_api/doanswer';
  }

  Future<int> _sendAnswer(Answer single_answer, String session) async {
    final url = Uri.parse(
        '${_localhost()}/${single_answer.questionnaireID}/${single_answer.questionID}/$session/${single_answer.options[single_answer.optionIndex]['optID']}');
    Response response = await post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
        'Accept': '*/*',
        'Allow': '*'
      },
      body: jsonEncode(<String, String>{
        'text': single_answer.answertxt,
      }),
    );

    if (response.statusCode == 201) {
      return 0;
    } else {
      throw Exception('Failed to send answer');
    }
  }

  @override
  Widget build(BuildContext context) {
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
            width: 1000,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.8),
              borderRadius: BorderRadius.circular(10),
            ),
            child: ListView.builder(
              itemCount: widget.answers.length + 2,
              itemBuilder: ((context, index) {
                if (index == 0) {
                  return Padding(
                    padding: const EdgeInsets.only(top: 30),
                    child: Center(
                      child: Text(
                        widget.questionnaireTitle,
                        style: const TextStyle(
                          color: Colors.black,
                          fontWeight: FontWeight.bold,
                          fontSize: 30,
                        ),
                      ),
                    ),
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
                        child: MaterialButton(
                          onPressed: () async {
                            setState(() {
                              processing = true;
                            });

                            int result;
                            String sessionID = generateRandomString(4);

                            for (int i = 0; i < widget.answers.length; i++) {
                              result = await _sendAnswer(
                                  widget.answers[i], sessionID);
                            }

                            Navigator.pushAndRemoveUntil(context,
                                MaterialPageRoute(builder: (context) {
                              return const QuestionnaireListScreen(
                                label: 'answer questionnaire',
                              );
                            }), (route) => false);

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
                                  mainAxisAlignment: MainAxisAlignment.start,
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
                        ),
                      ),
                    ),
                  );
                } else {
                  return Padding(
                    padding: const EdgeInsets.only(top: 60, left: 100),
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
                                  itemCount:
                                      widget.answers[index - 1].options.length,
                                  itemBuilder: (context, index2) {
                                    return RadioListTile(
                                      value: index2 + 1,
                                      groupValue: widget
                                              .answers[index - 1].optionIndex +
                                          1,
                                      title: Padding(
                                        padding:
                                            const EdgeInsets.only(bottom: 8),
                                        child: Text(widget.answers[index - 1]
                                            .options[index2]['opttxt']),
                                      ),
                                      activeColor:
                                          const Color.fromARGB(255, 9, 52, 58),
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
                                      color:
                                          const Color.fromARGB(255, 9, 52, 58),
                                    ),
                                  ),
                                  child: Padding(
                                    padding:
                                        const EdgeInsets.only(left: 15, top: 5),
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
    );
  }
}
