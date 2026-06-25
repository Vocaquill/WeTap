@echo off

echo ===================================================
echo Stopping and removing old containers...
echo ===================================================
docker stop wetap-web wetap-api wetap-db >nul 2>&1
docker rm wetap-web wetap-api wetap-db >nul 2>&1

echo.
echo ===================================================
echo Creating Docker network (if not exists)...
echo ===================================================
docker network create wetap_net >nul 2>&1

echo.
echo ===================================================
echo Building WeTap Web Application (Local)...
echo ===================================================
cd WeTapSite\wetap-web
docker build -t wetap-web:latest .

echo.
echo ===================================================
echo Building WeTap API (Local)...
echo ===================================================
cd ..\..\WeTapAPI
docker build -t wetap-api:latest .

echo.
echo ===================================================
echo Starting Containers...
echo ===================================================
cd ..

echo Starting Database...
docker run -d --name wetap-db --network wetap_net --network-alias db --restart unless-stopped -e POSTGRES_DB=wetap -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -v wetap-db-data:/var/lib/postgresql/data postgres:18

echo Starting API...
docker run -d --name wetap-api --network wetap_net --network-alias api --restart unless-stopped -p 8080:8080 -e ASPNETCORE_ENVIRONMENT=Production -e ConnectionStrings__DefaultConnection="Host=db;Database=wetap;Username=postgres;Password=postgres" -v wetap-media:/app/media wetap-api:latest

echo Starting Web Site...
docker run -d --name wetap-web --network wetap_net --restart unless-stopped -p 8081:80 wetap-web:latest

echo.
echo ===================================================
echo Application is running!
echo Web: http://localhost:8081
echo API: http://localhost:8080
echo ===================================================
pause
