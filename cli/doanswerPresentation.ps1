# Run getquestion
Write-Host "Press Enter to get question"
$null = Read-Host

.\login.ps1 -username "admin-vass" -passw "test1234" | Out-Null
.\getquestion.ps1 "M01"
.\login.ps1 -username "userTestJson" -passw "userTestJson123" | Out-Null

# Run getquestion
Write-Host "Give your answer: "
$answer = Read-Host

.\doanswer.ps1 -question_id "M01" -option_id $answer

# =============================================================================

Write-Host "Press Enter to get question"
$null = Read-Host

.\login.ps1 -username "admin-vass" -passw "test1234" | Out-Null
.\getquestion.ps1 "M02"
.\login.ps1 -username "userTestJson" -passw "userTestJson123" | Out-Null

# Run getquestion
Write-Host "Give your answer: "
$answer = Read-Host

.\doanswer.ps1 -question_id "M02" -option_id $answer

# =============================================================================

Write-Host "Press Enter to get question"
$null = Read-Host

.\login.ps1 -username "admin-vass" -passw "test1234" | Out-Null
.\getquestion.ps1 "M03"
.\login.ps1 -username "userTestJson" -passw "userTestJson123" | Out-Null

# Run getquestion
Write-Host "Give your answer: "
$answer = Read-Host

.\doanswer.ps1 -question_id "M03" -option_id $answer

