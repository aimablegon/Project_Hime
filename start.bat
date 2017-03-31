cd "%~dp0"
for %%* in (.) do set CurrDirName=%%~nx*
set NODE_PATH=../common/node_modules
forever start --uid %CurrDirName% --append -w app.js