<div align="center"> 
    Indsæt banner billed 
    <!-- <img src="" style="width: 100%;"> -->
</div>

# LKbh § 107 - Bookning af vikar tider (backend)

Dette er repository'et for vores backend-del af 2. semesters eksamensprojekt.

I dette projekt har vi samarbejdet med LKbh § 107 om at udviklet en hjemmeside, hvor det bliver gjort nemmere for både vikarer og driftsansvarlige at håntere booking og overblik over arbejders tider for vikarer.

Dette er repository'et for backend-delen, som tager sig af de forskellige ruter og handlinger, som vores frontend ønsker at føre videre til databasen. Dette kan være handlinger, der kræver kendskab til og information om alle vikarer i databasen eller oprettelse af nye vagter, som tiden skrider frem.

Vores online database der er hoster gennem Azure og kan findes [her](https://lkbh-semester-projekt-backend.azurewebsites.net/).

Frontend-/hjemmeside-delen af projektet kan findes [her](https://github.com/MarkusIngerslev/LKBH-semester-projekt-frontend.git).

## Indhold

1. [Installation af backend](#installation-af-backend)
2. [Installation af nødvendige node packages](#installation-af-nødvendige-node-packages)
3. [Benyttelse af backend](#benyttelse-af-backend)

    - [Opsætning af dotenv](#opsætning-af-dotenv)
    - [Opsætning af database](#opsætning-af-database)
        - [Struktur af MySQL database](#struktur-af-mysql-database)

4. [Kør program](#kør-program)

    - [npm start](#npm-start)
        - [npm run dev](#npm-run-dev)
        - [npm run watch](#npm-run-watch)

5. [Slutning](#slutning)

## Installation af backend

For at clone backend projektet skal du blot gøre følgende:

1. Åben din terminal, enten `powershell`, `bash ` eller dit foretrukkende valg.

2. Naviger til den mappe, hvor du gerne vil gemme projektet. _Du kan enten gøre dette være at bruge `cd`-kommandoen, eller åbne en terminal direkte fra den endelige mappe._

```bash
cd din/målmappe
```

3. Når du er i den mappe som projektet skal placeres, så skal du bruge følgende kammando til at clone projektet fra GitHub:

```bash
git clone https://github.com/MarkusIngerslev/LKBH-semester-projekt-backend.git
```

4. Du har nu clonet projektet. Hvis du ønsker at åbne det clonet program med det samme, kan du gøre følgende:

```bash
code lkbh-semester-projekt-backend
```

## Installation af nødvendige node packages

Nu efter du har clonet programmet og åbnet det, så er det vigtigt at du også har de nødvendige `node packages` som programmet bruger. For at downloade disse `packages` så skal du åbne terminalen i din editer, og skrive følgende kommando.

```bash
npm i
```

Eller;

```bash
npm i cors express mysql2 dotenv nodemon
```

De to kommandoer gør det samme, den eneste forskellen er at `npm i` eller `npm install`, så downloader du kun de packages, som er lavet som `dependencies` i `package.json`. Hvor at ved kommandoen `npm i cors express mysql dotenv nodemon`, så downloader du specifikke packages du selv diffinere.

## Benyttelse af backend

Efter du nu har clonet og downloaded de nødvendige packages til backend programmet, så manglers der nu kun at laves forbindelse til MySQL databasen.

### Opsætning af dotenv

For at lave forbindelse til databasen, bruges der en `.env` fil. For at lave denne fil kan du skrive følgende i din terminal:

```bash
touch .env
```

Den nye fil du har lavet kan nu bruges til localt at skabe forbindelse til en database / server.

For at gøre dette skal du i den nye fil indsætte følgende data:

```javascript
MYSQL_HOST=(adresse for din server) localhost
MYSQL_DATABASE=lkbhlocaldb
MYSQL_PASSWORD=(kodeord til databasen)
MYSQL_USER=root
MYSQL_PORT=3306
```

Det er så vigtigt at du ændre i de forskellige felter, så de passer til dine egne værdier.

### Opsætning af database

I dette eksempel så laver vi en local MySQL database.

Først start ud med at skrive følgende kommandoer.

```sql
CREATE DATABASE IF NOT EXISTS lkbhlocaldb
    CHARACTER SET utf8
    COLLATE utf8_general_ci;

USE lkbhlocaldb;
```

Der nu blevet oprettet en local MySQL databse med navnet `lkbhlocaldb`, og det er denne database som vi arbejder i `USE lkbhlocaldb`.

### Struktur af MySQL database

Nu da vi har en database at arbejde i, så kan vi nu indsætte alt vores `sql`-kode og få oprette selve tabellerne samt deres data og deres relationer.

Alt dette kan gøres ved at nu at køre følgende `sql`-kommandoer:

```sql
CREATE TABLE Substitutes (
    EmployeeID int NOT NULL AUTO_INCREMENT,
    FirstName varchar(255) NOT NULL,
    LastName varchar(255) NOT NULL,
    DateOfBirth date NOT NULL,
    Mail varchar(255) NOT NULL,
    Number int NOT NULL,
    IsAdmin boolean,
    Username varchar(255) NOT NULL,
    PasswordHash varchar(64) NOT NULL,
    PRIMARY KEY (EmployeeID)
);

CREATE TABLE Shifts (
    ShiftID int NOT NULL AUTO_INCREMENT,
    Date date NOT NULL,
    ShiftStart datetime NOT NULL,
    ShiftEnd datetime NOT NULL,
    EmployeeID int ,
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

-- Trigger to automaticly change "shiftIsTaken", when EmployeeID is either null or has a value
CREATE TRIGGER set_shift_taken
BEFORE INSERT ON shifts
FOR EACH ROW
BEGIN
    IF NEW.EmployeeID IS NOT NULL THEN
        SET NEW.ShiftIsTaken = 1;
    ELSE
        SET NEW.ShiftIsTaken = 0;
    END IF;
END;

-- Trigger to automaticly change "shiftIsTaken", when EmployeeID is opdated
CREATE TRIGGER update_shift_taken
BEFORE UPDATE ON shifts
FOR EACH ROW
BEGIN
    IF NEW.EmployeeID IS NOT NULL THEN
        SET NEW.ShiftIsTaken = TRUE;
    ELSE
        SET NEW.ShiftIsTaken = FALSE;
    END IF;
END;

-- Trigger to automaticly drop "shiftinterests" where "ShiftID" match "ShiftID
-- from "shifts" where there is a "EmployeeID" value other then null
CREATE TRIGGER after_shifts_update
AFTER UPDATE ON shifts
FOR EACH ROW
BEGIN
    IF NEW.EmployeeID IS NOT NULL AND OLD.EmployeeID IS NULL THEN
        -- EmployeeID has been set to a non-null value
        DELETE FROM shiftinterest
        WHERE ShiftID = NEW.ShiftID;
    END IF;
END;

-- Trigger to allways set IsAdmin to false unless admin is set to true in request
CREATE TRIGGER set_is_admin
BEFORE INSERT ON substitutes
FOR EACH ROW
BEGIN
    IF NEW.IsAdmin IS NOT NULL AND NEW.IsAdmin = true THEN
        SET NEW.IsAdmin = 1;
    ELSE
        SET NEW.IsAdmin = 0;
    END IF;
END;

-- Trigger for updating and deleting relatet shifts and shiftinterests from deletet substitut.
CREATE TRIGGER Before_Delete_Substitute
BEFORE DELETE ON Substitutes
FOR EACH ROW
BEGIN
    -- Update Shifts-tabel
    UPDATE Shifts
    SET EmployeeID = NULL
    WHERE  EmployeeID = OLD.EmployeeID;

    -- Delete relatet rows from shiftinterests
    DELETE FROM ShiftInterest
    WHERE EmployeeID = OLD.EmployeeID;
end;

-- Insert 20 unique substitutes
INSERT INTO Substitutes (FirstName, LastName, DateOfBirth, Mail, Number, IsAdmin, Username, PasswordHash)
VALUES
    ('Anders', 'Nielsen', '1990-01-01', 'anders.nielsen@example.com', 12345678, false, 'andersn', SHA2('password1', 256)),
    ('Mette', 'Pedersen', '1992-05-15', 'mette.pedersen@example.com', 23456789, false, 'mettep', SHA2('password2', 256)),
    ('Lars', 'Madsen', '1985-07-20', 'lars.madsen@example.com', 34567890, false, 'larsm', SHA2('password3', 256)),
    ('Maja', 'Olsen', '1993-03-10', 'maja.olsen@example.com', 45678901, false, 'majao', SHA2('password4', 256)),
    ('Claus', 'Christensen', '1988-11-25', 'claus.christensen@example.com', 56789012, false, 'clausc', SHA2('password5', 256)),
    ('Anna', 'Jensen', '1994-08-12', 'anna.jensen@example.com', 67890123, false, 'annaj', SHA2('password6', 256)),
    ('Peter', 'Rasmussen', '1987-02-28', 'peter.rasmussen@example.com', 78901234, false, 'peter', SHA2('password7', 256)),
    ('Louise', 'Hansen', '1991-06-05', 'louise.hansen@example.com', 89012345, false, 'louiseh', SHA2('password8', 256)),
    ('Nikolaj', 'Olesen', '1986-09-18', 'nikolaj.olesen@example.com', 90123456, false, 'nikolajo', SHA2('password9', 256)),
    ('Sofie', 'Thomsen', '1995-04-25', 'sofie.thomsen@example.com', 12345098, false, 'sofiet', SHA2('password10', 256)),
    ('Kristian', 'Poulsen', '1989-12-08', 'kristian.poulsen@example.com', 23456789, false, 'kristianp', SHA2('password11', 256)),
    ('Laura', 'Johansen', '1990-03-15', 'laura.johansen@example.com', 34567890, false, 'lauraj', SHA2('password12', 256)),
    ('Rasmus', 'Mortensen', '1983-07-22', 'rasmus.mortensen@example.com', 45678901, false, 'rasmusm', SHA2('password13', 256)),
    ('Maria', 'Andersen', '1992-11-11', 'maria.andersen@example.com', 56789012, false, 'mariam', SHA2('password14', 256)),
    ('Mikkel', 'Larsen', '1984-05-30', 'mikkel.larsen@example.com', 67890123, false, 'mikkel', SHA2('password15', 256)),
    ('Camilla', 'Christiansen', '1993-09-09', 'camilla.christiansen@example.com', 78901234, false, 'camillac', SHA2('password16', 256)),
    ('Andreas', 'Olsen', '1988-01-26', 'andreas.olsen@example.com', 89012345, false, 'andreaso', SHA2('password17', 256)),
    ('Nina', 'Rasmussen', '1996-04-03', 'nina.rasmussen@example.com', 90123456, false, 'ninar', SHA2('password18', 256)),
    ('Christian', 'Hansen', '1985-08-20', 'christian.hansen@example.com', 12345098, false, 'christianh', SHA2('password19', 256)),
    ('Lene', 'Jensen', '1997-12-16', 'lene.jensen@example.com', 23456789, false, 'lenej', SHA2('password20', 256));

-- Insert 1 unique administrator as a substitute
INSERT INTO Substitutes (FirstName, LastName, DateOfBirth, Mail, Number, IsAdmin, Username, PasswordHash)
VALUES
    ('Nicolai', 'Viking', '1970-01-10', 'nicolai.viking@example.com', 87654321, true, 'nicolain', SHA2('adminpassword', 256));


INSERT INTO Shifts (Date, ShiftStart, ShiftEnd, EmployeeID, ShiftIsTaken)
VALUES
    ('2023-12-06', '2023-12-06 13:00:00', '2023-12-06 21:00:00', 6, true),
    ('2023-12-07', '2023-12-07 14:00:00', '2023-12-07 22:00:00', NULL, false),
    ('2023-12-08', '2023-12-08 15:00:00', '2023-12-08 23:00:00', 8, true),
    ('2023-12-09', '2023-12-09 16:00:00', '2023-12-09 00:00:00', NULL, false),
    ('2023-12-10', '2023-12-10 17:00:00', '2023-12-10 01:00:00', 10, true),
    ('2023-12-11', '2023-12-11 18:00:00', '2023-12-11 02:00:00', NULL, false),
    ('2023-12-12', '2023-12-12 19:00:00', '2023-12-12 03:00:00', 12, true),
    ('2023-12-13', '2023-12-13 20:00:00', '2023-12-13 04:00:00', NULL, false),
    ('2023-12-14', '2023-12-14 21:00:00', '2023-12-14 05:00:00', 14, true),
    ('2023-12-15', '2023-12-15 22:00:00', '2023-12-15 06:00:00', NULL, false),
    ('2023-12-16', '2023-12-16 23:00:00', '2023-12-16 07:00:00', 16, true),
    ('2023-12-17', '2023-12-17 00:00:00', '2023-12-17 08:00:00', NULL, false),
    ('2023-12-18', '2023-12-18 01:00:00', '2023-12-18 09:00:00', 18, true),
    ('2023-12-19', '2023-12-19 02:00:00', '2023-12-19 10:00:00', NULL, false),
    ('2023-12-20', '2023-12-20 03:00:00', '2023-12-20 11:00:00', 20, true),
    ('2023-12-21', '2023-12-21 04:00:00', '2023-12-21 12:00:00', NULL, false),
    ('2023-12-22', '2023-12-22 05:00:00', '2023-12-22 13:00:00', 2, true),
    ('2023-12-23', '2023-12-23 06:00:00', '2023-12-23 14:00:00', NULL, false),
    ('2023-12-24', '2023-12-24 07:00:00', '2023-12-24 15:00:00', 4, true),
    ('2023-12-25', '2023-12-25 08:00:00', '2023-12-25 16:00:00', NULL, false),
    ('2024-01-15', '2024-01-15 09:00:00', '2024-01-15 17:00:00', 6, true),
    ('2024-01-16', '2024-01-16 10:00:00', '2024-01-16 18:00:00', NULL, false),
    ('2024-01-17', '2024-01-17 11:00:00', '2024-01-17 19:00:00', 8, true),
    ('2024-01-18', '2024-01-18 12:00:00', '2024-01-18 20:00:00', NULL, false),
    ('2024-01-19', '2024-01-19 13:00:00', '2024-01-19 21:00:00', 10, true),
    ('2024-01-20', '2024-01-20 14:00:00', '2024-01-20 22:00:00', NULL, false),
    ('2024-01-21', '2024-01-21 15:00:00', '2024-01-21 23:00:00', 12, true),
    ('2024-01-22', '2024-01-22 16:00:00', '2024-01-22 00:00:00', NULL, false),
    ('2024-01-23', '2024-01-23 17:00:00', '2024-01-23 01:00:00', 14, true),
    ('2024-01-24', '2024-01-24 18:00:00', '2024-01-24 02:00:00', NULL, false),
    ('2024-01-25', '2024-01-25 19:00:00', '2024-01-25 03:00:00', 16, true),
    ('2024-01-26', '2024-01-26 20:00:00', '2024-01-26 04:00:00', NULL, false),
    ('2024-01-27', '2024-01-27 21:00:00', '2024-01-27 05:00:00', 18, true),
    ('2024-01-28', '2024-01-28 22:00:00', '2024-01-28 06:00:00', NULL, false),
    ('2024-01-29', '2024-01-29 23:00:00', '2024-01-29 07:00:00', 20, true),
    ('2024-01-30', '2024-01-30 00:00:00', '2024-01-30 08:00:00', NULL, false),
    ('2024-01-31', '2024-01-31 01:00:00', '2024-01-31 09:00:00', 2, true),
    ('2024-02-01', '2024-02-01 02:00:00', '2024-02-01 10:00:00', NULL, false),
    ('2024-02-02', '2024-02-02 03:00:00', '2024-02-02 11:00:00', 4, true),
    ('2024-02-03', '2024-02-03 04:00:00', '2024-02-03 12:00:00', NULL, false),
    ('2024-02-04', '2024-02-04 05:00:00', '2024-02-04 13:00:00', 6, true),
    ('2024-02-05', '2024-02-05 06:00:00', '2024-02-05 14:00:00', NULL, false),
    ('2024-02-06', '2024-02-06 07:00:00', '2024-02-06 15:00:00', 8, true),
    ('2024-02-07', '2024-02-07 08:00:00', '2024-02-07 16:00:00', NULL, false),
    ('2024-02-08', '2024-02-08 09:00:00', '2024-02-08 17:00:00', 10, true),
    ('2024-02-09', '2024-02-09 10:00:00', '2024-02-09 18:00:00', NULL, false),
    ('2024-02-10', '2024-02-10 11:00:00', '2024-02-10 19:00:00', 12, true),
    ('2024-02-11', '2024-02-11 12:00:00', '2024-02-11 20:00:00', NULL, false),
    ('2024-02-12', '2024-02-12 13:00:00', '2024-02-12 21:00:00', 14, true),
    ('2024-02-13', '2024-02-13 14:00:00', '2024-02-13 22:00:00', NULL, false),
    ('2024-02-14', '2024-02-14 15:00:00', '2024-02-14 23:00:00', 16, true),
    ('2024-02-15', '2024-02-15 16:00:00', '2024-02-15 00:00:00', NULL, false),
    ('2024-02-16', '2024-02-16 17:00:00', '2024-02-16 01:00:00', 18, true),
    ('2024-02-17', '2024-02-17 18:00:00', '2024-02-17 02:00:00', NULL, false),
    ('2024-02-18', '2024-02-18 19:00:00', '2024-02-18 03:00:00', 20, true),
    ('2024-02-19', '2024-02-19 20:00:00', '2024-02-19 04:00:00', NULL, false),
    ('2024-02-20', '2024-02-20 21:00:00', '2024-02-20 05:00:00', 2, true),
    ('2024-02-21', '2024-02-21 22:00:00', '2024-02-21 06:00:00', NULL, false),
    ('2024-02-22', '2024-02-22 23:00:00', '2024-02-22 07:00:00', 4, true),
    ('2024-02-23', '2024-02-23 00:00:00', '2024-02-23 08:00:00', NULL, false),
    ('2023-12-06', '2023-12-06 11:30:00', '2023-12-06 20:30:00', 7, true),
    ('2023-12-07', '2023-12-07 12:30:00', '2023-12-07 21:30:00', NULL, false),
    ('2023-12-08', '2023-12-08 13:30:00', '2023-12-08 22:30:00', 9, true),
    ('2023-12-09', '2023-12-09 14:30:00', '2023-12-09 23:30:00', NULL, false),
    ('2023-12-10', '2023-12-10 15:30:00', '2023-12-10 00:30:00', 11, true),
    ('2023-12-11', '2023-12-11 16:30:00', '2023-12-11 01:30:00', NULL, false),
    ('2023-12-12', '2023-12-12 17:30:00', '2023-12-12 02:30:00', 13, true),
    ('2023-12-13', '2023-12-13 18:30:00', '2023-12-13 03:30:00', NULL, false),
    ('2023-12-14', '2023-12-14 19:30:00', '2023-12-14 04:30:00', 15, true),
    ('2023-12-15', '2023-12-15 20:30:00', '2023-12-15 05:30:00', NULL, false),
    ('2023-12-16', '2023-12-16 21:30:00', '2023-12-16 06:30:00', 17, true),
    ('2023-12-17', '2023-12-17 22:30:00', '2023-12-17 07:30:00', NULL, false),
    ('2023-12-18', '2023-12-18 23:30:00', '2023-12-18 08:30:00', 19, true),
    ('2023-12-19', '2023-12-19 00:30:00', '2023-12-19 09:30:00', NULL, false),
    ('2023-12-20', '2023-12-20 01:30:00', '2023-12-20 10:30:00', 1, true),
    ('2023-12-21', '2023-12-21 02:30:00', '2023-12-21 11:30:00', NULL, false),
    ('2023-12-22', '2023-12-22 03:30:00', '2023-12-22 12:30:00', 3, true),
    ('2023-12-23', '2023-12-23 04:30:00', '2023-12-23 13:30:00', NULL, false),
    ('2023-12-24', '2023-12-24 05:30:00', '2023-12-24 14:30:00', 5, true),
    ('2023-12-25', '2023-12-25 06:30:00', '2023-12-25 15:30:00', NULL, false),
    ('2024-01-15', '2024-01-15 08:30:00', '2024-01-15 16:30:00', 7, true),
    ('2024-01-16', '2024-01-16 09:30:00', '2024-01-16 17:30:00', NULL, false),
    ('2024-01-17', '2024-01-17 10:30:00', '2024-01-17 18:30:00', 9, true),
    ('2024-01-18', '2024-01-18 11:30:00', '2024-01-18 19:30:00', NULL, false),
    ('2024-01-19', '2024-01-19 12:30:00', '2024-01-19 20:30:00', 11, true),
    ('2024-01-20', '2024-01-20 13:30:00', '2024-01-20 21:30:00', NULL, false),
    ('2024-01-21', '2024-01-21 14:30:00', '2024-01-21 22:30:00', 13, true),
    ('2024-01-22', '2024-01-22 15:30:00', '2024-01-22 23:30:00', NULL, false),
    ('2024-01-23', '2024-01-23 16:30:00', '2024-01-23 00:30:00', 15, true),
    ('2024-01-24', '2024-01-24 17:30:00', '2024-01-24 01:30:00', NULL, false),
    ('2024-01-25', '2024-01-25 18:30:00', '2024-01-25 02:30:00', 17, true),
    ('2024-01-26', '2024-01-26 19:30:00', '2024-01-26 03:30:00', NULL, false),
    ('2024-01-27', '2024-01-27 20:30:00', '2024-01-27 04:30:00', 19, true),
    ('2024-01-28', '2024-01-28 21:30:00', '2024-01-28 05:30:00', NULL, false),
    ('2024-01-29', '2024-01-29 22:30:00', '2024-01-29 06:30:00', 1, true),
    ('2024-01-30', '2024-01-30 23:30:00', '2024-01-30 07:30:00', NULL, false),
    ('2024-01-31', '2024-01-31 00:30:00', '2024-01-31 08:30:00', 3, true),
    ('2024-02-01', '2024-02-01 01:30:00', '2024-02-01 09:30:00', NULL, false),
    ('2024-02-02', '2024-02-02 02:30:00', '2024-02-02 10:30:00', 5, true),
    ('2024-02-03', '2024-02-03 03:30:00', '2024-02-03 11:30:00', NULL, false),
    ('2024-02-04', '2024-02-04 04:30:00', '2024-02-04 12:30:00', 7, true),
    ('2024-02-05', '2024-02-05 05:30:00', '2024-02-05 13:30:00', NULL, false),
    ('2024-02-06', '2024-02-06 06:30:00', '2024-02-06 14:30:00', 9, true),
    ('2024-02-07', '2024-02-07 07:30:00', '2024-02-07 15:30:00', NULL, false),
    ('2024-02-08', '2024-02-08 08:30:00', '2024-02-08 16:30:00', 11, true),
    ('2024-02-09', '2024-02-09 09:30:00', '2024-02-09 17:30:00', NULL, false),
    ('2024-02-10', '2024-02-10 10:30:00', '2024-02-10 18:30:00', 13, true),
    ('2024-02-11', '2024-02-11 11:30:00', '2024-02-11 19:30:00', NULL, false),
    ('2024-02-12', '2024-02-12 12:30:00', '2024-02-12 20:30:00', 15, true),
    ('2024-02-13', '2024-02-13 13:30:00', '2024-02-13 21:30:00', NULL, false),
    ('2024-02-14', '2024-02-14 14:30:00', '2024-02-14 22:30:00', 17, true),
    ('2024-02-15', '2024-02-15 15:30:00', '2024-02-15 23:30:00', NULL, false),
    ('2024-02-16', '2024-02-16 16:30:00', '2024-02-16 00:30:00', 19, true),
    ('2024-02-17', '2024-02-17 17:30:00', '2024-02-17 01:30:00', NULL, false),
    ('2024-02-18', '2024-02-18 18:30:00', '2024-02-18 02:30:00', 1, true),
    ('2024-02-19', '2024-02-19 19:30:00', '2024-02-19 03:30:00', NULL, false),
    ('2024-02-20', '2024-02-20 20:30:00', '2024-02-20 04:30:00', 3, true),
    ('2024-02-21', '2024-02-21 21:30:00', '2024-02-21 05:30:00', NULL, false),
    ('2024-02-22', '2024-02-22 22:30:00', '2024-02-22 06:30:00', 5, true),
    ('2024-02-23', '2024-02-23 23:30:00', '2024-02-23 07:30:00', NULL, false);

-- Test Data to check shiftinterest with to different shifts
INSERT INTO shiftinterest (ShiftID, EmployeeID) VALUES (2, 3), (2,5), (2,7);
INSERT INTO shiftinterest (ShiftID, EmployeeID) VALUES (4, 4), (4,6), (4,8);
```

## Kør program

For at køre backend programmet skal du igen terminalen, efterfølgende er der 3 forskellige måder at køre programmet set nedenfor.

### npm start

Den første måde er gennem brugen af `node app.js`. Dette er den grundlæggende måde at køre programmet. Ulempen ved at gøre det på denne måde, er at hvis du støder på en `error`, eller der skulle ske noget som gjorde at backend crasher, så ville du være nød til at starte programmet igen.

```bash
node app.js
```

Eller;

```bash
npm start
```

#### npm run dev

Den anden måde at gennem brugen af `node scriptet dev`. I dette script anvendes `package nodemon`, som er en pakke der hjælper med automatisk at restarte applikationen når der sker en ændring i en files mappe. Selve scriptet der bruge nodemon ser således ud `"dev": "nodemon app.js"` og kan bruges ved at skrive følgende:

```bash
npm run dev
```

#### npm run watch

Den tredje måde er gennem brugen af `node scriptet watch`. Watch er en nye node måde at automatisk restarte applikationen når der sker en ændring i en files mappe. I grove træk så gør den det samme som `nodemon`. Men siden at `watch` stadig er tidlig beta er der stadig nogle fejl som kan forekomme. Scriptet der bruge watch ser således ud `"watch": "node --watch app.js"` og kan bruges ved at skrive følgende:

```bash
npm run watch
```

## Slutning

**Tillykke du har nu clonet, opsat både backend og MySQL databasen og kan nu køre programmet! 🎉**

_Dette program er udarbejdet af Jon Lundby Nielsen, Magnus Carstensen, Markus Ingerslev Olsen & Palle Jensen fra Dat23V2._
