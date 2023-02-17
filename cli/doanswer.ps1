Param(
  [string]$question_id,
  [string]$option_id
)

$cmd = "./se2236 doanswer --questionnaire_id MM000 --question_id $question_id --session_id 1234 --option_id $option_id --format json"
Invoke-Expression $cmd