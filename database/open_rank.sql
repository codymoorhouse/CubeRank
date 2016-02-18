/*
	This database script is brought to you by the talent of 
	John Robbins ;)

	If you have a current database called open_rank (such as the one
	created by running this script) this script will drop it, along with
	all its table rows before creating this one in its place.

	This should be used to initialize the Database ONLY.  
*/


DROP DATABASE IF EXISTS open_rank;
CREATE DATABASE open_rank;
USE open_rank;

CREATE TABLE Organization(
       OID INT UNSIGNED AUTO_INCREMENT NOT NULL,
       oName VARCHAR (30),
       description VARCHAR(128),
       PRIMARY KEY (OID)

) ENGINE InnoDB;

/* 
   The very basics for users for now.  We can add more later if needed
*/

CREATE TABLE Users(
       UID INT UNSIGNED AUTO_INCREMENT NOT NULL,
       fName VARCHAR(16),
       lName VARCHAR(16),
       email VARCHAR(60),
       username VARCHAR(100),
       password VARCHAR(100),
       PRIMARY KEY (UID)
) ENGINE InnoDB;

/*
	Again, very basics for leagues. Can add more later 	
*/

CREATE TABLE League(
       LID BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
       title VARCHAR(30),
       description VARCHAR(128),
       OID INT UNSIGNED NOT NULL,
       INDEX (OID),
       FOREIGN KEY (OID) REFERENCES Organization (OID)
       ON UPDATE CASCADE ON DELETE CASCADE,
       PRIMARY KEY (LID)

) ENGINE InnoDB;

/*
	A team belongs to a single league.  A user can play in multiple 
	leagues, but will have to form a new team to play in a different
	league.  Can be a team of one.  See comments for Member table below
*/

CREATE TABLE Team(
       TID BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
       title VARCHAR(30),
       rank SMALLINT UNSIGNED NOT NULL,
       LID BIGINT UNSIGNED NOT NULL,
       INDEX (LID),
       FOREIGN KEY (LID) REFERENCES League (LID)
       ON UPDATE CASCADE ON DELETE CASCADE,
       PRIMARY KEY (TID)

) ENGINE InnoDB;


CREATE TABLE Contest(  /* called contest because TID was taken */
       CID BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
       title VARCHAR(30),
       LID BIGINT UNSIGNED NOT NULL,
       INDEX (LID),
       FOREIGN KEY (LID) REFERENCES League (LID)
       ON UPDATE CASCADE ON DELETE CASCADE,
       PRIMARY KEY (CID)

) ENGINE InnoDB;


CREATE TABLE Placed( /* many-to-many relationship between Team and Tournament*/
       TID BIGINT UNSIGNED NOT NULL,
       CID BIGINT UNSIGNED NOT NULL,
       placed SMALLINT,
       INDEX (TID),
       FOREIGN KEY (TID) REFERENCES Team (TID)
       ON UPDATE CASCADE ON DELETE CASCADE,
       INDEX (CID),
       FOREIGN KEY (CID) REFERENCES Contest (CID)
       ON UPDATE CASCADE ON DELETE CASCADE

) ENGINE InnoDB;


/*  
    Small change to the schema here.  User now has to belong to a team in
    the database to belong to a league or play in a tournament.  A user 
    can be a team of one. 

*/
CREATE TABLE Member( /* many-to-many relationship between Team and User*/
       UID INT UNSIGNED NOT NULL,
       TID BIGINT UNSIGNED NOT NULL,
       INDEX (UID),
       FOREIGN KEY (UID) REFERENCES Users (UID)
       ON UPDATE CASCADE ON DELETE CASCADE,
       INDEX (TID),
       FOREIGN KEY (TID) REFERENCES Team (TID)
       ON UPDATE CASCADE ON DELETE CASCADE


) ENGINE InnoDB;
