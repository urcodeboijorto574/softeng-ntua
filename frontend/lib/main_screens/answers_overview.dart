import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:questionnaires_app/objects/answer.dart';

class AnswersOverviewScreen extends StatefulWidget {
  final List<Answer> answers;
  final String questionnaireTitle;

  const AnswersOverviewScreen(
      {super.key, required this.answers, required this.questionnaireTitle});

  @override
  State<AnswersOverviewScreen> createState() => _AnswersOverviewScreenState();
}

class _AnswersOverviewScreenState extends State<AnswersOverviewScreen> {
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
                          onPressed: () {},
                          child: Column(
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
                        (widget.answers[index - 1].options.length == 1 &&
                                widget.answers[index - 1].options[0]
                                        ['opttxt'] ==
                                    '<open string>')
                            ? SizedBox()
                            : Padding(
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
