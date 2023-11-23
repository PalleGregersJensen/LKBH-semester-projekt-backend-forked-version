CREATE TABLE Substitutes (
    EmployeeID int NOT NULL AUTO_INCREMENT,
    FirstName varchar(255),
    LastName varchar(255),
    DateOfBirth date,
    Mail varchar(255),
    Number int,
    Username varchar(255),
    PasswordHash varchar(64),
    PRIMARY KEY (EmployeeID)
);

CREATE TABLE Shifts (
    ShiftID int NOT NULL AUTO_INCREMENT,
    Date date,
    ShiftStart datetime,
    ShiftEnd datetime,
    EmployeeID int,
    ShiftIsTaken boolean,
    PRIMARY KEY (ShiftID),
    FOREIGN KEY (EmployeeID) REFERENCES Substitutes(EmployeeID)
);

CREATE TABLE ShiftInterest (
    ShiftID int,
    EmployeeID int,
    PRIMARY KEY (ShiftID, EmployeeID),
    FOREIGN KEY (ShiftID) REFERENCES Shifts(ShiftID),
    FOREIGN KEY (EmployeeID) REFERENCES Substitutes(EmployeeID)
);
