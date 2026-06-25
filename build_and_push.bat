@echo off

cd WeTapSite\wetap-web
docker build -t wetap-web .
docker tag wetap-web:latest pedro007salo/wetap-web:latest
docker push pedro007salo/wetap-web:latest

cd ..\..\WeTapAPI
docker build -t wetap-api .
docker tag wetap-api:latest pedro007salo/wetap-api:latest
docker push pedro007salo/wetap-api:latest

echo DONE
pause
