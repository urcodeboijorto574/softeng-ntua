Param(
  [string]$usermod,
  [string]$username,
  [string]$passw
)

$cmd = "./se2236 admin --usermod $usermod --username $username --passw $passw --format json"
Invoke-Expression $cmd