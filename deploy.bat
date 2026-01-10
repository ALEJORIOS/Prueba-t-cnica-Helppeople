@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   Inicializador de Base de Datos
echo ========================================
echo.

echo [1/6] Limpiando contenedores anteriores...
docker-compose down -v
echo.

echo [2/6] Iniciando SQL Server...
docker-compose up -d database
if errorlevel 1 (
    echo ERROR: No se pudo iniciar el contenedor
    echo Verifica que Docker Desktop este corriendo
    pause
    exit /b 1
)
echo.

echo [3/6] Esperando que SQL Server este listo...
echo       Esto puede tomar 30-60 segundos...
timeout /t 45 /nobreak >nul
echo.

echo [4/6] Detectando nombre del contenedor...
for /f "tokens=*" %%i in ('docker ps --filter "ancestor=mcr.microsoft.com/mssql/server:2022-latest" --format "{{.Names}}"') do (
    set CONTAINER_NAME=%%i
)

if not defined CONTAINER_NAME (
    echo ERROR: No se encontro el contenedor de SQL Server
    echo.
    echo Contenedores activos:
    docker ps
    echo.
    pause
    exit /b 1
)

echo       Contenedor encontrado: %CONTAINER_NAME%
echo.

echo [5/6] Ejecutando migracion inicial...
docker exec %CONTAINER_NAME% /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Password10*" -C -i /docker-entrypoint-initdb.d/01-init.sql

if errorlevel 1 (
    echo.
    echo ERROR: Fallo la migracion
    echo.
    echo Posibles causas:
    echo - El archivo SQL tiene errores de sintaxis
    echo - La contraseña es incorrecta
    echo - SQL Server aun no esta completamente listo
    echo.
    echo Logs del contenedor:
    docker logs %CONTAINER_NAME% --tail 20
    echo.
    pause
    exit /b 1
)
echo.

echo [5.5/6] Verificando tablas creadas...
docker exec %CONTAINER_NAME% /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Password10*" -C -Q "USE HelppeopleDB; SELECT name as 'Tablas Creadas' FROM sys.tables;"
echo.

echo [6/6] Iniciando todos los servicios...
docker-compose up -d --build frontend backend
echo.

echo ========================================
echo   INICIALIZACIÓN COMPLETADA
echo ========================================
echo.
echo Servicios disponibles:
echo   Frontend:  http://localhost:3002
echo   Backend:   http://localhost:3000
echo   Database:  localhost:1433
echo.
echo Para ver los logs:
echo   docker-compose logs -f
echo.
pause