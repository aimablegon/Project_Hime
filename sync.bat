cd "%~dp0"
for %%* in (.) do set CurrDirName=%%~nx*
node ../common/node_modules/sequelize-auto/bin/sequelize-auto -o "./service/models" -d %CurrDirName% -h i-make.kr -u root -p 3306 -x acac1202 -e mysql