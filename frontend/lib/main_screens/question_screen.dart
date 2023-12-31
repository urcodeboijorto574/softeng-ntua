import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:questionnaires_app/main_screens/answers_overview.dart';
import 'package:questionnaires_app/main_screens/questionnaire_list.dart';
import 'package:questionnaires_app/main_screens/user_homescreen.dart';
import 'package:questionnaires_app/objects/answer.dart';
import 'package:questionnaires_app/objects/question.dart';
import 'package:questionnaires_app/widgets/alert_dialog.dart';
import 'package:questionnaires_app/widgets/app_bar.dart';
import 'package:questionnaires_app/widgets/snackbar.dart';

class QuestionScreen extends StatefulWidget {
  final String questionnaireTitle;
  final List<Answer> answers;
  final String questionnaireID;
  final List<dynamic> questions;
  final Question question;
  final int index;
  const QuestionScreen({
    super.key,
    required this.questions,
    required this.index,
    required this.question,
    required this.answers,
    required this.questionnaireID,
    required this.questionnaireTitle,
  });

  @override
  State<QuestionScreen> createState() => _QuestionScreenState();
}

class _QuestionScreenState extends State<QuestionScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final GlobalKey<ScaffoldMessengerState> _scaffoldKey =
      GlobalKey<ScaffoldMessengerState>();

  int selectedItem = 0;
  String answer = ' ';
  late Question nextQuestion;
  bool processing = false;

  @override
  Widget build(BuildContext context) {
    final optionsLength = widget.question.options.length;

    void _showNextQuestion(int optIndex, bool saveAnswer) {
      for (int i = 0; i < widget.questions.length; i++) {
        if (widget.question.options[optIndex]['nextqID'] ==
            widget.questions[i]['qID']) {
          nextQuestion = Question(
              qID: widget.questions[i]['qID'],
              qtext: widget.questions[i]['qtext'],
              required_: widget.questions[i]['required'],
              type: widget.questions[i]['type'],
              options: widget.questions[i]['options']);
          break;
        }
      }

      if (saveAnswer) {
        widget.answers.add(Answer(
          questionnaireID: widget.questionnaireID,
          questionID: widget.question.qID,
          options: widget.question.options,
          questiontxt: widget.question.qtext,
          optionIndex: optIndex,
          answertxt: answer,
        ));
      }

      Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(
            builder: (context) => QuestionScreen(
              questionnaireTitle: widget.questionnaireTitle,
              questionnaireID: widget.questionnaireID,
              answers: widget.answers,
              questions: widget.questions,
              index: widget.index + 1,
              question: nextQuestion,
            ),
          ),
          (route) => false);
    }

    void _showOverview(int optIndex, bool saveAnswer) {
      if (saveAnswer) {
        widget.answers.add(Answer(
          questionnaireID: widget.questionnaireID,
          questionID: widget.question.qID,
          options: widget.question.options,
          questiontxt: widget.question.qtext,
          optionIndex: optIndex,
          answertxt: answer,
        ));
      }

      Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(
            builder: (context) => AnswersOverviewScreen(
              answers: widget.answers,
              questionnaireTitle: widget.questionnaireTitle,
              label: 'submit answers',
            ),
          ),
          (route) => false);
    }

    void _clickNext() {
      setState(() {
        processing = true;
      });

      if (widget.question.options.length == 1 &&
          widget.question.options[0]['opttxt'] == '<open string>') {
        if (widget.question.required_ == 'TRUE' &&
            !_formKey.currentState!.validate()) {
          MyMessageHandler.showSnackbar(_scaffoldKey,
              'The question is required. Please answer before going to the next one!');
        } else {
          _formKey.currentState!.reset();
          if (widget.question.options[0]['nextqID'] == '-') {
            if (answer == ' ') {
              _showOverview(0, false);
            } else {
              _showOverview(0, true);
            }
          } else {
            if (answer == ' ') {
              _showNextQuestion(0, false);
            } else {
              _showNextQuestion(0, true);
            }
          }
        }
      } else {
        if (widget.question.required_ == 'TRUE' && selectedItem == 0) {
          MyMessageHandler.showSnackbar(_scaffoldKey,
              'The question is required. Please answer before going to the next one!');
        } else {
          if (widget.question.options[selectedItem - 1]['nextqID'] == '-') {
            _showOverview(selectedItem - 1, true);
          } else {
            _showNextQuestion(selectedItem - 1, true);
          }
        }
      }
      setState(() {
        processing = false;
      });
    }

    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Form(
        key: _formKey,
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
                height: MediaQuery.of(context).size.height * 0.8,
                width: 1000,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.8),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Padding(
                  padding: const EdgeInsets.only(left: 100, top: 10, right: 10),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        height: 60,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Padding(
                              padding: const EdgeInsets.only(right: 20),
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
                                      Navigator.pushAndRemoveUntil(context,
                                          MaterialPageRoute(builder: (context) {
                                        return const UserHomeScreen();
                                      }), (route) => false);
                                    },
                                  );
                                },
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: const [
                                    Padding(
                                      padding: EdgeInsets.only(top: 9),
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
                      Padding(
                        padding: const EdgeInsets.only(right: 90),
                        child: SizedBox(
                          height: MediaQuery.of(context).size.height * 0.5,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '${widget.index}. ${widget.question.qtext}',
                                style: const TextStyle(
                                  color: Colors.black,
                                  fontSize: 22,
                                  fontWeight: FontWeight.w400,
                                ),
                              ),
                              (widget.question.options.length == 1 &&
                                      widget.question.options[0]['opttxt'] ==
                                          '<open string>')
                                  ? Padding(
                                      padding: const EdgeInsets.symmetric(
                                          vertical: 20),
                                      child: SizedBox(
                                        width: 500,
                                        child: TextFormField(
                                          style: const TextStyle(fontSize: 15),
                                          validator: (value) {
                                            if (value!.isEmpty) {
                                              return 'The question is required.';
                                            } else {
                                              return null;
                                            }
                                          },
                                          onChanged: (value) {
                                            answer = value;
                                          },
                                          decoration: InputDecoration(
                                            labelText: 'Write your answer',
                                            hintText: 'Write your answer',
                                            border: OutlineInputBorder(
                                              borderRadius:
                                                  BorderRadius.circular(25),
                                            ),
                                            enabledBorder: OutlineInputBorder(
                                              borderRadius:
                                                  BorderRadius.circular(25),
                                              borderSide: const BorderSide(
                                                color: Color.fromARGB(
                                                    255, 9, 52, 58),
                                                width: 2,
                                              ),
                                            ),
                                            focusedBorder: OutlineInputBorder(
                                              borderRadius:
                                                  BorderRadius.circular(25),
                                              borderSide: const BorderSide(
                                                color: Colors.pinkAccent,
                                                width: 2,
                                              ),
                                            ),
                                            floatingLabelBehavior:
                                                FloatingLabelBehavior.never,
                                          ),
                                          cursorColor: Colors.pinkAccent,
                                        ),
                                      ),
                                    )
                                  : Padding(
                                      padding: const EdgeInsets.only(top: 10),
                                      child: ListView.builder(
                                        shrinkWrap: true,
                                        itemCount: optionsLength,
                                        itemBuilder: (context, index) {
                                          return RadioListTile(
                                            value: index + 1,
                                            groupValue: selectedItem,
                                            onChanged: (int? value) {
                                              setState(() {
                                                selectedItem = value!;
                                              });
                                            },
                                            title: Padding(
                                              padding: const EdgeInsets.only(
                                                  bottom: 5),
                                              child: Text(widget.question
                                                  .options[index]['opttxt']),
                                            ),
                                            activeColor: const Color.fromARGB(
                                                255, 9, 52, 58),
                                          );
                                        },
                                      ),
                                    ),
                            ],
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            Padding(
                              padding: const EdgeInsets.only(right: 100),
                              child: Container(
                                height: 60,
                                width: 140,
                                decoration: BoxDecoration(
                                  color: const Color.fromARGB(255, 9, 52, 58),
                                  borderRadius: BorderRadius.circular(15),
                                ),
                                child: processing
                                    ? const Center(
                                        child: CircularProgressIndicator(
                                          color: Colors.pinkAccent,
                                        ),
                                      )
                                    : MaterialButton(
                                        onPressed: () {
                                          try {
                                            _clickNext();
                                          } catch (e) {
                                            setState(() {
                                              processing = false;
                                            });
                                            MyMessageHandler.showSnackbar(
                                                _scaffoldKey, e.toString());
                                          }
                                        },
                                        child: Column(
                                          mainAxisAlignment:
                                              MainAxisAlignment.start,
                                          children: const [
                                            Text(
                                              'Next',
                                              textAlign: TextAlign.center,
                                              style: TextStyle(
                                                color: Colors.pinkAccent,
                                                fontSize: 22,
                                                fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                              ),
                            ),
                          ],
                        ),
                      )
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
