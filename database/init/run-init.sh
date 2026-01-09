#!/bin/bash

echo "Esperando que SQL Server esté listo..."
sleep 20

echo "Ejecutando script de inicialización..."
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Password10* -i /docker-entrypoint-initdb.d/01-init.sql

echo "Migración completada!"