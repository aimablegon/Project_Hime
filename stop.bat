cd "%~dp0"
for %%* in (.) do set CurrDirName=%%~nx*
forever stop %CurrDirName%