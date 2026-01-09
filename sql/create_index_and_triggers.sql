-- Crea los índices
-- Este índice se crea para que el SKU no se repita
CREATE UNIQUE NONCLUSTERED INDEX IX_Products_SKU ON Catalog.Products (SKU)
WHERE
    SKU IS NOT NULL;

-- Este Índice es para que los nombres de las categorías no se repitan
CREATE UNIQUE NONCLUSTERED INDEX IX_Categories_Name ON Catalog.Categories (Name);
GO

-- Triggers
-- Los pongo para que los campos UpdatedAt de ambas tablas se actualicen autom�ticamente
CREATE TRIGGER TR_Categories_UpdatedAt ON Catalog.Categories AFTER UPDATE
AS BEGIN
    SET NOCOUNT ON;
    UPDATE Catalog.Categories SET UpdatedAt = GETDATE()
    FROM Catalog.Categories c INNER JOIN inserted i ON c.Id = i.Id;
END;
GO

CREATE TRIGGER TR_Products_UpdatedAt ON Catalog.Products AFTER UPDATE
AS BEGIN
    SET NOCOUNT ON;
    UPDATE Catalog.Products SET UpdatedAt = GETDATE()
    FROM Catalog.Products p INNER JOIN inserted i ON p.Id = i.Id;
END;
GO