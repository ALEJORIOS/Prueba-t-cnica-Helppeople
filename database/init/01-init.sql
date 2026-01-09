SET QUOTED_IDENTIFIER ON;

SET ANSI_NULLS ON;
GO

IF NOT EXISTS (
    SELECT *
    FROM sys.databases
    WHERE
        name = 'HelppeopleDB'
)
BEGIN
CREATE DATABASE HelppeopleDB;
END
GO

USE HelppeopleDB;
GO

IF NOT EXISTS (
    SELECT *
    FROM sys.schemas
    WHERE
        name = 'Catalog'
)
BEGIN EXEC ('CREATE SCHEMA Catalog');

END

IF NOT EXISTS (
    SELECT *
    FROM sys.tables t
        INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE
        s.name = 'Catalog'
        AND t.name = 'Categories'
)
BEGIN
CREATE TABLE Catalog.Categories (
    Id INT PRIMARY KEY IDENTITY (1, 1),
    Name NVARCHAR (255) NOT NULL,
    Description NVARCHAR (MAX) NULL,
    Active BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE (),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE ()
);

END

IF NOT EXISTS (
    SELECT *
    FROM sys.tables t
        INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE
        s.name = 'Catalog'
        AND t.name = 'Products'
)
BEGIN
CREATE TABLE Catalog.Products (
    Id INT PRIMARY KEY IDENTITY (1, 1),
    CategoryId INT NOT NULL,
    Name NVARCHAR (255) NOT NULL,
    Description NVARCHAR (MAX) NULL,
    SKU NVARCHAR (100) NULL,
    Price DECIMAL(18, 2) NOT NULL,
    Stock INT NOT NULL DEFAULT 0,
    Active BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE (),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE (),
    CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryId) REFERENCES Catalog.Categories (Id)
);

END

IF NOT EXISTS (
    SELECT *
    FROM sys.indexes
    WHERE
        name = 'IX_Products_SKU'
        AND object_id = OBJECT_ID ('Catalog.Products')
)
BEGIN
SET
    QUOTED_IDENTIFIER ON;

CREATE UNIQUE NONCLUSTERED INDEX IX_Products_SKU ON Catalog.Products (SKU)
WHERE
    SKU IS NOT NULL;

END

IF NOT EXISTS (
    SELECT *
    FROM sys.indexes
    WHERE
        name = 'IX_Categories_Name'
        AND object_id = OBJECT_ID ('Catalog.Categories')
)
BEGIN
SET
    QUOTED_IDENTIFIER ON;

CREATE UNIQUE NONCLUSTERED INDEX IX_Categories_Name ON Catalog.Categories (Name);

END

IF NOT EXISTS (
    SELECT *
    FROM sys.triggers
    WHERE
        name = 'TR_Categories_UpdatedAt'
)
BEGIN EXEC (
    '
        CREATE TRIGGER TR_Categories_UpdatedAt 
        ON Catalog.Categories 
        AFTER UPDATE
        AS 
        BEGIN
            SET NOCOUNT ON;
            UPDATE Catalog.Categories 
            SET UpdatedAt = GETDATE()
            FROM Catalog.Categories c 
            INNER JOIN inserted i ON c.Id = i.Id;
        END
    '
);

END

IF NOT EXISTS (
    SELECT *
    FROM sys.triggers
    WHERE
        name = 'TR_Products_UpdatedAt'
)
BEGIN EXEC (
    '
        CREATE TRIGGER TR_Products_UpdatedAt 
        ON Catalog.Products 
        AFTER UPDATE
        AS 
        BEGIN
            SET NOCOUNT ON;
            UPDATE Catalog.Products 
            SET UpdatedAt = GETDATE()
            FROM Catalog.Products p 
            INNER JOIN inserted i ON p.Id = i.Id;
        END
    '
);

END

PRINT 'Base de datos HelppeopleDB inicializada correctamente';
GO