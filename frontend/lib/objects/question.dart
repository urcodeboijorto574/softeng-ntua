class Question {
  final String qId;
  final String qtext;
  final bool required_;
  final String type;
  final List<String> options;

  const Question({
    required this.qId,
    required this.qtext,
    required this.required_,
    required this.type,
    required this.options,
  });

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      qId: json['qId'],
      qtext: json['qtext'],
      required_: json['required'],
      type: json['type'],
      options: json['options'],
    );
  }
}
