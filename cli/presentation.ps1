.\usersUser.ps1 | Out-Null

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

# Run getquestionnaire
Write-Host "Press Enter to show questionnaire"
$null = Read-Host

.\getquestionnaire.ps1

# Run doanswerPresentation
Write-Host "Press Enter to login as user"
$null = Read-Host

.\login.ps1 -username "userTestJson" -passw "userTestJson123" | Out-Null

# Run doanswerPresentation
Write-Host "Press Enter to answer"
$null = Read-Host

.\doanswerPresentation.ps1

# Run getquestionanswers
Write-Host "Press Enter to get question answers"
$null = Read-Host

.\getquestionanswers.ps1

# Run resetall
Write-Host "Press Enter to resetall"
$null = Read-Host

.\resetall.ps1

# Run questionnaire_upd
Write-Host "Press Enter to update questionnaire"
$null = Read-Host

.\questionnaire_upd.ps1

# Run getquestionnaire
Write-Host "Press Enter to show questionnaire"
$null = Read-Host

.\getquestionnaire.ps1