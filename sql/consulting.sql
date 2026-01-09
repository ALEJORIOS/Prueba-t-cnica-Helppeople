SELECT * FROM Catalog.Categories;
GO
SELECT * FROM Catalog.Products;
GO
DELETE FROM Catalog.Products WHERE Id >= 0;
--INSERT INTO Catalog.Categories(Name, Description, Active, CreatedAt, UpdatedAt) VALUES('CAT2', 'CATDESC2', 1, GETDATE(), GETDATE())