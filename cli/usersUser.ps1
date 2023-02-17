Param(
  [string]$username
)

$cmd = "./se2236 admin --users $username --format json"
Invoke-Expression $cmd