function Write-Log {
   param(
      [Parameter(Mandatory = $true)][ValidateSet("info", "warn", "error")][string]$Severity,
      [Parameter(Mandatory = $true)][string]$Message
   )

   switch ($Severity.ToLower()) {
      "info" {
         $color = "Cyan"; $prefix = "[INFO] " 
      }
      "warn" {
         $color = "Yellow"; $prefix = "[WARN] " 
      }
      "error" {
         $color = "Red"; $prefix = "[ERROR] " 
      }
   }

   Write-Host $prefix -ForegroundColor $color -NoNewline
   Write-Host " $Message"
}

$scriptName = Split-Path -Leaf $MyInvocation.MyCommand.Path

Write-Log "info" "Running script '$scriptName' to verify if npm install is needed"
Write-Log "info" "Checking if dir 'node_modules' exists"
if ( -not (Test-Path -Path 'node_modules' -PathType Container) ) { 
   Write-Log "warn" "node_modules dir is missing => Running 'npm install' & 'npm install --save-dev check-dependencies' & 'npm audit fix'"
   npm install
   npm install --save-dev check-dependencies
   npm audit fix
   return
}
Write-Log "info" "Checking if npm package 'check-dependencies' is installed"
if ( -not (Test-Path -Path 'node_modules/check-dependencies' -PathType Container) ) {
   Write-Log "warn" "Package 'check-dependencies' is not installed => Running 'npm install --save-dev check-dependencies' & 'npm audit fix'"
   npm install --save-dev check-dependencies
   npm audit fix 
   return
}
else {
   Write-Log "info" "Checking npm dependencies using 'check-dependencies'"
   node node_modules/check-dependencies/bin/cli --install
   return
}