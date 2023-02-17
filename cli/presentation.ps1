.\loginSuper.ps1 | Out-Null
.\resetall.ps1 | Out-Null
.\usermod.ps1 -usermod "admin" -username "admin-vass" -passw "test1234" | Out-Null
.\usermod.ps1 -usermod "user" -username "userTestJson" -passw "userTestJson123" | Out-Null
.\login.ps1 -username "admin-vass" -passw "test1234" | Out-Null
.\resetq.ps1 | Out-Null
.\questionnaire_upd.ps1 | Out-Null

# Wait for user input
Write-Host "Press Enter to begin"
$null = Read-Host

# Login with Super Admin
Write-Host "Press Enter to login with Super Admin"
$null = Read-Host

.\loginSuper.ps1

# Run healthcheck
Write-Host "Press Enter to run healthcheck"
$null = Read-Host

.\healthcheck.ps1

Write-Host "Press Enter to login as questionnaire's admin"
$null = Read-Host

.\login.ps1 -username "admin-vass" -passw "test1234" | Out-Null

# Run getquestionnaire
Write-Host "Press Enter to show questionnaire"
$null = Read-Host

.\getquestionnaire.ps1

# Run doanswerPresentation
Write-Host "Press Enter to login as user"
$null = Read-Host

.\login.ps1 -username "userTestJson" -passw "userTestJson123"

# Run doanswerPresentation
Write-Host "Press Enter to answer"
$null = Read-Host

.\doanswerPresentation.ps1
.\login -username "admin-vass" -passw "test1234"

# Run getquestionanswers
Write-Host "Choose question to show answers: "
$question_id = Read-Host

.\getquestionanswers.ps1 -question_id $question_id

# Run resetall
Write-Host "Press Enter to resetall"
$null = Read-Host

.\loginSuper.ps1 | Out-Null
.\resetall.ps1

# Run questionnaire_upd
Write-Host "Press Enter to update questionnaire"
$null = Read-Host

.\loginSuper.ps1 | Out-Null
.\usermod.ps1 -usermod "admin" -username "admin-vass" -passw "test1234" | Out-Null
.\login.ps1 -username "admin-vass" -passw "test1234" | Out-Null
.\questionnaire_upd.ps1

# Run getquestionnaire
Write-Host "Press Enter to show questionnaire"
$null = Read-Host

.\getquestionnaire.ps1