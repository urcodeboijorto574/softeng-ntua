class Answer {
  final String questionnaireID;
  final String questionID;
  final String questiontxt;
  final int optionIndex;
  final List<dynamic> options;
  final String answertxt;

  const Answer({
    required this.questionnaireID,
    required this.questionID,
    required this.questiontxt,
    required this.optionIndex,
    required this.options,
    required this.answertxt,
  });
}
