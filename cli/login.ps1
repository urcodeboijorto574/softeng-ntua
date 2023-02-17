Param(
  [string]$username,
  [string]$passw
)

$cmd = "./se2236 login --username $username --passw $passw --format json"
Invoke-Expression $cmd