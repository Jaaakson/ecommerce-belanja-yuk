IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE TABLE [LtCategory] (
        [IdCategory] nvarchar(36) NOT NULL,
        [CategoryName] nvarchar(100) NOT NULL,
        [DateIn] datetime2 NOT NULL,
        [UserIn] nvarchar(36) NOT NULL,
        [DateUp] datetime2 NULL,
        [UserUp] nvarchar(36) NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_LtCategory] PRIMARY KEY ([IdCategory])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE TABLE [LtGender] (
        [IdGender] nvarchar(36) NOT NULL,
        [GenderName] nvarchar(50) NOT NULL,
        [DateIn] datetime2 NOT NULL,
        [UserIn] nvarchar(36) NOT NULL,
        [DateUp] datetime2 NULL,
        [UserUp] nvarchar(36) NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_LtGender] PRIMARY KEY ([IdGender])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE TABLE [LtPayment] (
        [IdPayment] nvarchar(36) NOT NULL,
        [PaymentName] nvarchar(100) NOT NULL,
        [DateIn] datetime2 NOT NULL,
        [UserIn] nvarchar(36) NOT NULL,
        [DateUp] datetime2 NULL,
        [UserUp] nvarchar(36) NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_LtPayment] PRIMARY KEY ([IdPayment])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE TABLE [MsUser] (
        [IdUser] nvarchar(36) NOT NULL,
        [UserName] nvarchar(100) NOT NULL,
        [Email] nvarchar(100) NOT NULL,
        [PhoneNumber] nvarchar(50) NOT NULL,
        [Firstname] nvarchar(100) NOT NULL,
        [LastName] nvarchar(200) NULL,
        [DOB] datetime2 NULL,
        [IdGender] nvarchar(36) NOT NULL,
        [DateIn] datetime2 NOT NULL,
        [UserIn] nvarchar(36) NOT NULL,
        [DateUp] datetime2 NULL,
        [UserUp] nvarchar(36) NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_MsUser] PRIMARY KEY ([IdUser]),
        CONSTRAINT [FK_MsUser_LtGender_IdGender] FOREIGN KEY ([IdGender]) REFERENCES [LtGender] ([IdGender]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE TABLE [MsUserPassword] (
        [IdUserPassword] nvarchar(36) NOT NULL,
        [IdUser] nvarchar(36) NOT NULL,
        [PasswordHash] nvarchar(200) NOT NULL,
        [DateIn] datetime2 NOT NULL,
        [UserIn] nvarchar(36) NOT NULL,
        [DateUp] datetime2 NULL,
        [UserUp] nvarchar(36) NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_MsUserPassword] PRIMARY KEY ([IdUserPassword]),
        CONSTRAINT [FK_MsUserPassword_MsUser_IdUser] FOREIGN KEY ([IdUser]) REFERENCES [MsUser] ([IdUser]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE TABLE [MsUserSeller] (
        [IdUserSeller] nvarchar(36) NOT NULL,
        [IdUser] nvarchar(36) NOT NULL,
        [SellerName] nvarchar(100) NOT NULL,
        [SellerDesc] nvarchar(1000) NULL,
        [Address] nvarchar(500) NULL,
        [SellerCode] nvarchar(100) NULL,
        [PhoneNumber] nvarchar(50) NULL,
        [DateIn] datetime2 NOT NULL,
        [UserIn] nvarchar(36) NOT NULL,
        [DateUp] datetime2 NULL,
        [UserUp] nvarchar(36) NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_MsUserSeller] PRIMARY KEY ([IdUserSeller]),
        CONSTRAINT [FK_MsUserSeller_MsUser_IdUser] FOREIGN KEY ([IdUser]) REFERENCES [MsUser] ([IdUser]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE TABLE [TrBuyerTransaction] (
        [IdBuyerTransaction] nvarchar(36) NOT NULL,
        [IdUser] nvarchar(36) NOT NULL,
        [IdPayment] nvarchar(36) NOT NULL,
        [FinalPrice] decimal(18,2) NOT NULL,
        [Rating] int NULL,
        [RatingComment] nvarchar(1000) NULL,
        [DateIn] datetime2 NOT NULL,
        [UserIn] nvarchar(36) NOT NULL,
        [DateUp] datetime2 NULL,
        [UserUp] nvarchar(36) NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_TrBuyerTransaction] PRIMARY KEY ([IdBuyerTransaction]),
        CONSTRAINT [FK_TrBuyerTransaction_LtPayment_IdPayment] FOREIGN KEY ([IdPayment]) REFERENCES [LtPayment] ([IdPayment]) ON DELETE NO ACTION,
        CONSTRAINT [FK_TrBuyerTransaction_MsUser_IdUser] FOREIGN KEY ([IdUser]) REFERENCES [MsUser] ([IdUser]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE TABLE [TrHomeAddress] (
        [IdhomeAddress] nvarchar(36) NOT NULL,
        [IdUser] nvarchar(36) NOT NULL,
        [Provinsi] nvarchar(100) NOT NULL,
        [KotaKabupaten] nvarchar(100) NOT NULL,
        [Kecamatan] nvarchar(100) NOT NULL,
        [KodePos] nvarchar(10) NOT NULL,
        [HomeAddressDesc] nvarchar(2000) NOT NULL,
        [IsPrimaryAddress] bit NOT NULL,
        [DateIn] datetime2 NOT NULL,
        [UserIn] nvarchar(36) NOT NULL,
        [DateUp] datetime2 NULL,
        [UserUp] nvarchar(36) NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_TrHomeAddress] PRIMARY KEY ([IdhomeAddress]),
        CONSTRAINT [FK_TrHomeAddress_MsUser_IdUser] FOREIGN KEY ([IdUser]) REFERENCES [MsUser] ([IdUser]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE TABLE [MsProduct] (
        [IdProduct] nvarchar(36) NOT NULL,
        [IdUserSeller] nvarchar(36) NOT NULL,
        [ProductName] nvarchar(200) NOT NULL,
        [ProductDesc] nvarchar(2000) NULL,
        [IdCategory] nvarchar(36) NOT NULL,
        [Price] decimal(18,2) NOT NULL,
        [DiscountProduct] decimal(18,0) NULL,
        [Qty] int NOT NULL,
        [DateIn] datetime2 NOT NULL,
        [UserIn] nvarchar(36) NOT NULL,
        [DateUp] datetime2 NULL,
        [UserUp] nvarchar(36) NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_MsProduct] PRIMARY KEY ([IdProduct]),
        CONSTRAINT [FK_MsProduct_LtCategory_IdCategory] FOREIGN KEY ([IdCategory]) REFERENCES [LtCategory] ([IdCategory]) ON DELETE NO ACTION,
        CONSTRAINT [FK_MsProduct_MsUserSeller_IdUserSeller] FOREIGN KEY ([IdUserSeller]) REFERENCES [MsUserSeller] ([IdUserSeller]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE TABLE [TrBuyerCart] (
        [IdBuyerCart] nvarchar(36) NOT NULL,
        [IdUser] nvarchar(36) NOT NULL,
        [IdProduct] nvarchar(36) NOT NULL,
        [Qty] int NOT NULL,
        [DateIn] datetime2 NOT NULL,
        [UserIn] nvarchar(36) NOT NULL,
        [DateUp] datetime2 NULL,
        [UserUp] nvarchar(36) NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_TrBuyerCart] PRIMARY KEY ([IdBuyerCart]),
        CONSTRAINT [FK_TrBuyerCart_MsProduct_IdProduct] FOREIGN KEY ([IdProduct]) REFERENCES [MsProduct] ([IdProduct]) ON DELETE NO ACTION,
        CONSTRAINT [FK_TrBuyerCart_MsUser_IdUser] FOREIGN KEY ([IdUser]) REFERENCES [MsUser] ([IdUser]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE TABLE [TrBuyerTransactionDetail] (
        [IdBuyerTransactionDetail] nvarchar(36) NOT NULL,
        [IdBuyerTransaction] nvarchar(36) NOT NULL,
        [IdProduct] nvarchar(36) NOT NULL,
        [Qty] int NOT NULL,
        [PriceProduct] decimal(18,2) NOT NULL,
        [DiscountProduct] decimal(18,0) NULL,
        [Rating] int NULL,
        [RatingComment] nvarchar(1000) NULL,
        [DateIn] datetime2 NOT NULL,
        [UserIn] nvarchar(36) NOT NULL,
        [DateUp] datetime2 NULL,
        [UserUp] nvarchar(36) NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_TrBuyerTransactionDetail] PRIMARY KEY ([IdBuyerTransactionDetail]),
        CONSTRAINT [FK_TrBuyerTransactionDetail_MsProduct_IdProduct] FOREIGN KEY ([IdProduct]) REFERENCES [MsProduct] ([IdProduct]) ON DELETE NO ACTION,
        CONSTRAINT [FK_TrBuyerTransactionDetail_TrBuyerTransaction_IdBuyerTransaction] FOREIGN KEY ([IdBuyerTransaction]) REFERENCES [TrBuyerTransaction] ([IdBuyerTransaction]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE TABLE [TrProductImages] (
        [IdProductImages] nvarchar(36) NOT NULL,
        [IdProduct] nvarchar(36) NOT NULL,
        [ProductImage] nvarchar(max) NOT NULL,
        [DateIn] datetime2 NOT NULL,
        [UserIn] nvarchar(36) NOT NULL,
        [DateUp] datetime2 NULL,
        [UserUp] nvarchar(36) NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_TrProductImages] PRIMARY KEY ([IdProductImages]),
        CONSTRAINT [FK_TrProductImages_MsProduct_IdProduct] FOREIGN KEY ([IdProduct]) REFERENCES [MsProduct] ([IdProduct]) ON DELETE NO ACTION
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_MsProduct_IdCategory] ON [MsProduct] ([IdCategory]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_MsProduct_IdUserSeller] ON [MsProduct] ([IdUserSeller]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_MsUser_Email] ON [MsUser] ([Email]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_MsUser_IdGender] ON [MsUser] ([IdGender]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_MsUser_PhoneNumber] ON [MsUser] ([PhoneNumber]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_MsUser_UserName] ON [MsUser] ([UserName]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_MsUserPassword_IdUser] ON [MsUserPassword] ([IdUser]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_MsUserSeller_IdUser] ON [MsUserSeller] ([IdUser]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_MsUserSeller_SellerCode] ON [MsUserSeller] ([SellerCode]) WHERE [SellerCode] IS NOT NULL');
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_TrBuyerCart_IdProduct] ON [TrBuyerCart] ([IdProduct]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_TrBuyerCart_IdUser_IdProduct] ON [TrBuyerCart] ([IdUser], [IdProduct]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_TrBuyerTransaction_IdPayment] ON [TrBuyerTransaction] ([IdPayment]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_TrBuyerTransaction_IdUser] ON [TrBuyerTransaction] ([IdUser]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_TrBuyerTransactionDetail_IdBuyerTransaction] ON [TrBuyerTransactionDetail] ([IdBuyerTransaction]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_TrBuyerTransactionDetail_IdProduct] ON [TrBuyerTransactionDetail] ([IdProduct]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_TrHomeAddress_IdUser] ON [TrHomeAddress] ([IdUser]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_TrProductImages_IdProduct] ON [TrProductImages] ([IdProduct]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260802061231_InitialCreate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260802061231_InitialCreate', N'10.0.10');
END;

COMMIT;
GO

