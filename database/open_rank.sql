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

CREATE TABLE organization(
       id INT UNSIGNED AUTO_INCREMENT NOT NULL,
       oname VARCHAR (30),
       description VARCHAR(128),
       PRIMARY KEY (id)

) ENGINE InnoDB;

/* 
   The very basics for users for now.  We can add more later if needed
*/

CREATE TABLE users(
       id INT UNSIGNED AUTO_INCREMENT NOT NULL,
       fName VARCHAR(16),
       lName VARCHAR(16),
       email VARCHAR(60),
       username VARCHAR(100),
       password VARCHAR(100),
       PRIMARY KEY (id)
) ENGINE InnoDB;

/*
	Again, very basics for leagues. Can add more later 	
*/

CREATE TABLE league(
       id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
       title VARCHAR(30),
       description VARCHAR(128),
       oid INT UNSIGNED NOT NULL,
       INDEX (oid),
       FOREIGN KEY (oid) REFERENCES organization (id)
       ON UPDATE CASCADE ON DELETE CASCADE,
       PRIMARY KEY (id)

) ENGINE InnoDB;

/*
	A team belongs to a single league.  A user can play in multiple 
	leagues, but will have to form a new team to play in a different
	league.  Can be a team of one.  See comments for Member table below
*/

CREATE TABLE team(
       id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
       title VARCHAR(30),
       rank SMALLINT UNSIGNED NOT NULL,
       LID BIGINT UNSIGNED NOT NULL,
       INDEX (lid),
       FOREIGN KEY (lid) REFERENCES league (id)
       ON UPDATE CASCADE ON DELETE CASCADE,
       PRIMARY KEY (id)

) ENGINE InnoDB;


CREATE TABLE tournament(
       id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL,
       title VARCHAR(30),
       lid BIGINT UNSIGNED NOT NULL,
       INDEX (lid),
       FOREIGN KEY (lid) REFERENCES league (id)
       ON UPDATE CASCADE ON DELETE CASCADE,
       PRIMARY KEY (id)
) ENGINE InnoDB;


CREATE TABLE team_tournmanent( /* many-to-many relationship between Team and Tournament*/
       team_id BIGINT UNSIGNED NOT NULL,
       tournament_id BIGINT UNSIGNED NOT NULL,
       placed SMALLINT,
       INDEX (team_id),
       FOREIGN KEY (team_id) REFERENCES team (team_id)
       ON UPDATE CASCADE ON DELETE CASCADE,
       INDEX (tournament_id),
       FOREIGN KEY (tournament_id) REFERENCES contest (id)
       ON UPDATE CASCADE ON DELETE CASCADE

) ENGINE InnoDB;


/*  
    Small change to the schema here.  User now has to belong to a team in
    the database to belong to a league or play in a tournament.  A user 
    can be a team of one. 

*/
CREATE TABLE team_user( /* many-to-many relationship between Team and User*/
       user_id INT UNSIGNED NOT NULL,
       team_id BIGINT UNSIGNED NOT NULL,
       INDEX (user_id),
       FOREIGN KEY (user_id) REFERENCES users (id)
       ON UPDATE CASCADE ON DELETE CASCADE,
       INDEX (team_id),
       FOREIGN KEY (team_id) REFERENCES team (id)
       ON UPDATE CASCADE ON DELETE CASCADE

) ENGINE InnoDB;
