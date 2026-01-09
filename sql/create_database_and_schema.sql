-- Crea la Base de Datos
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'HelppeopleDB')
BEGIN
    CREATE DATABASE HelppeopleDB;
END
GO

-- Usa la BD
USE HelppeopleDB;
GO

-- Crea el esquema
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Catalog')
BEGIN
    EXEC('CREATE SCHEMA Catalog');
END
GO
