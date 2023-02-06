class Question {
  final String qID;
  final String qtext;
  final String required_;
  final String type;
  final List<dynamic> options;

  const Question({
    required this.qID,
    required this.qtext,
    required this.required_,
    required this.type,
    required this.options,
  });

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      qID: json['qID'],
      qtext: json['qtext'],
      required_: json['required'],
      type: json['type'],
      options: json['options'],
    );
  }
}
