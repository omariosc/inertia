create table Accounts
(
    AccountId TEXT    not null
        constraint PK_Accounts
            primary key,
    Name      TEXT    not null,
    Email     TEXT    not null,
    Password  TEXT    not null,
    Salt      TEXT    not null,
    Role      INTEGER not null,
    State     INTEGER not null,
    UserType  INTEGER not null
);

create unique index IX_Accounts_Email
    on Accounts (Email);

create table Depos
(
    DepoId    INTEGER not null
        constraint PK_Depos
            primary key autoincrement,
    Name      TEXT    not null,
    Latitude  REAL    not null,
    Longitude REAL    not null
);

create table DiscountApplications
(
    DiscountApplicationId INTEGER not null
        constraint PK_DiscountApplications
            primary key autoincrement,
    AccountId             TEXT    not null
        constraint FK_DiscountApplications_Accounts_AccountId
            references Accounts
            on delete cascade,
    DisccountType         INTEGER not null,
    State                 INTEGER not null,
    Image                 BLOB
);

create unique index IX_DiscountApplications_AccountId
    on DiscountApplications (AccountId);

create table HireOptions
(
    HireOptionId    INTEGER not null
        constraint PK_HireOptions
            primary key autoincrement,
    DurationInHours INTEGER not null,
    Name            TEXT    not null,
    Cost            REAL    not null
);

create table Issues
(
    IssueId    INTEGER not null
        constraint PK_Issues
            primary key autoincrement,
    Priority   INTEGER not null,
    Title      TEXT    not null,
    Content    TEXT    not null,
    AccountId  TEXT    not null
        constraint FK_Issues_Accounts_AccountId
            references Accounts
            on delete cascade,
    DateOpened TEXT    not null,
    Resolution TEXT
);

create index IX_Issues_AccountId
    on Issues (AccountId);

create table LoginInstances
(
    LoginInstanceId INTEGER not null
        constraint PK_LoginInstances
            primary key autoincrement,
    AccessToken     TEXT    not null,
    CreatedAt       TEXT    not null,
    AccountId       TEXT    not null
        constraint FK_LoginInstances_Accounts_AccountId
            references Accounts
            on delete cascade,
    LoginState      INTEGER not null
);

create unique index IX_LoginInstances_AccessToken
    on LoginInstances (AccessToken);

create index IX_LoginInstances_AccountId
    on LoginInstances (AccountId);

create table Scooters
(
    ScooterId     INTEGER not null
        constraint PK_Scooters
            primary key autoincrement,
    SoftScooterId INTEGER not null,
    Name          TEXT    not null,
    DepoId        INTEGER not null
        constraint FK_Scooters_Depos_DepoId
            references Depos
            on delete cascade,
    Available     INTEGER not null
);

create table Orders
(
    OrderId         TEXT    not null
        constraint PK_Orders
            primary key,
    ScooterId       INTEGER not null
        constraint FK_Orders_Scooters_ScooterId
            references Scooters
            on delete cascade,
    CreatedAt       TEXT    not null,
    StartTime       TEXT    not null,
    EndTime         TEXT    not null,
    WeekNumber      INTEGER not null,
    WeekDay         INTEGER not null,
    Cost            REAL    not null,
    PreDiscountCost REAL    not null,
    Discount        REAL    not null,
    OrderState      INTEGER not null,
    AccountId       TEXT    not null
        constraint FK_Orders_Accounts_AccountId
            references Accounts
            on delete cascade
);

create table OrderHireOptions
(
    OrderHireOptionId INTEGER not null
        constraint PK_OrderHireOptions
            primary key autoincrement,
    OrderId           TEXT    not null
        constraint FK_OrderHireOptions_Orders_OrderId
            references Orders
            on delete cascade,
    HireOptionId      INTEGER not null
        constraint FK_OrderHireOptions_HireOptions_HireOptionId
            references HireOptions
            on delete cascade,
    CreatedAt         TEXT    not null
);

create index IX_OrderHireOptions_HireOptionId
    on OrderHireOptions (HireOptionId);

create index IX_OrderHireOptions_OrderId
    on OrderHireOptions (OrderId);

create index IX_Orders_AccountId
    on Orders (AccountId);

create index IX_Orders_ScooterId
    on Orders (ScooterId);

create index IX_Scooters_DepoId
    on Scooters (DepoId);

create unique index IX_Scooters_SoftScooterId
    on Scooters (SoftScooterId);
