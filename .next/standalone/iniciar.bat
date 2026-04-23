@echo off
title ServiceApp
echo Iniciando aplicacion...
start http://localhost:3000
node\node-v24.14.0-win-x64\node.exe server.js
pause
