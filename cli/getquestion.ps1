param([string]$question_id)

$cmd = "./se2236 question --questionnaire_id MM000 --question_id $question_id --format json"
Invoke-Expression $cmd