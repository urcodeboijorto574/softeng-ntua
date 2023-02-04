import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';

import 'package:pie_chart/pie_chart.dart';
import 'package:questionnaires_app/main_screens/questionnaire_list.dart';

class StatisticsScreen extends StatefulWidget {
  final String questionnaireTitle;
  final List<dynamic> questions;
  const StatisticsScreen(
      {super.key, required this.questionnaireTitle, required this.questions});

  @override
  State<StatisticsScreen> createState() => _StatisticsScreenState();
}

class _StatisticsScreenState extends State<StatisticsScreen> {
  Map<String, double> dataMap(int index) {
    Map<String, double> temp_map = {};
    Map<String, double> temp = {};

    for (int i = 0; i < widget.questions[index]['options'].length; i++) {
      temp = {
        widget.questions[index]['options'][i]['opttxt']: widget.questions[index]
            ['options'][i]['wasChosenBy']
      };
      temp_map.addEntries(temp.entries);
    }
    return temp_map;
  }

  num wasAnsweredBy(int index) {
    num count = 0;

    for (int i = 0; i < widget.questions[index]['options'].length; i++) {
      count += widget.questions[index]['options'][i]['wasChosenBy'];
    }
    return count;
  }

  final colorList = <Color>[
    Colors.pink,
    Colors.cyan,
    const Color.fromARGB(255, 218, 110, 146),
    const Color.fromARGB(255, 9, 52, 58),
  ];

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
              itemCount: widget.questions.length + 2,
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
                } else if (index == widget.questions.length + 1) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 60, top: 80),
                    child: Center(
                      child: Container(
                        height: 60,
                        width: 400,
                        decoration: BoxDecoration(
                          color: const Color.fromARGB(255, 9, 52, 58),
                          borderRadius: BorderRadius.circular(15),
                        ),
                        child: MaterialButton(
                          onPressed: () {
                            Navigator.pushAndRemoveUntil(
                                context,
                                MaterialPageRoute(
                                  builder: (context) =>
                                      const QuestionnaireListScreen(
                                          label: 'show statistics'),
                                ),
                                (route) => false);
                          },
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.start,
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
                          '$index. ${widget.questions[index - 1]['qtext']}',
                          style: const TextStyle(
                            color: Colors.black,
                            fontSize: 22,
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.only(top: 40, bottom: 10),
                          child: PieChart(
                            dataMap: dataMap(index - 1),
                            animationDuration:
                                const Duration(milliseconds: 800),
                            chartLegendSpacing: 32,
                            centerText:
                                'Total Answers: ${wasAnsweredBy(index - 1)}',
                            chartRadius: 300,
                            initialAngleInDegree: 0,
                            chartType: ChartType.disc,
                            colorList: colorList,
                            legendOptions: const LegendOptions(
                              showLegendsInRow: false,
                              legendPosition: LegendPosition.right,
                              showLegends: true,
                              legendShape: BoxShape.circle,
                              legendTextStyle: TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            chartValuesOptions: const ChartValuesOptions(
                              showChartValueBackground: true,
                              showChartValues: true,
                              showChartValuesInPercentage: true,
                              showChartValuesOutside: false,
                              decimalPlaces: 1,
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
