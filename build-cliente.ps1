cd C:\Users\corzo\Desktop\ServiceApp2
npm run build
Remove-Item -Recurse -Force '.next\standalone\.next\node_modules\better-sqlite3-90e2652d1716b047' -ErrorAction SilentlyContinue
Copy-Item -Recurse -Force 'node_modules\better-sqlite3' '.next\standalone\node_modules\better-sqlite3'
Copy-Item -Recurse 'node_modules\better-sqlite3' '.next\standalone\.next\node_modules\better-sqlite3-90e2652d1716b047'
Copy-Item -Recurse -Force '.next\static' '.next\standalone\.next\static'
Copy-Item -Recurse -Force 'node' '.next\standalone\node'
Set-Content '.next\standalone\iniciar.bat' '@echo off
title ServiceApp
echo Iniciando aplicacion...
start http://localhost:3000
node\node-v24.14.0-win-x64\node.exe server.js
pause'
Write-Host 'Listo para entregar al cliente' -ForegroundColor Green
