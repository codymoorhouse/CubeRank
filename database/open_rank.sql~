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

CREATE TABLE organizations(
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

CREATE TABLE leagues(
       id INT UNSIGNED AUTO_INCREMENT NOT NULL,
       title VARCHAR(30),
       description VARCHAR(128),
       organization_id INT UNSIGNED NOT NULL,

       INDEX (organization_id),
       FOREIGN KEY (organization_id) REFERENCES organizations (id)
       ON UPDATE CASCADE ON DELETE CASCADE,

       PRIMARY KEY (id)
) ENGINE InnoDB;

/*
	A team belongs to a single league.  A user can play in multiple 
	leagues, but will have to form a new team to play in a different
	league.  Can be a team of one.  See comments for Member table below
*/

CREATE TABLE teams(
       id INT UNSIGNED AUTO_INCREMENT NOT NULL,
       title VARCHAR(30),
       rank SMALLINT UNSIGNED NOT NULL,
       league_id INT UNSIGNED NOT NULL,

       INDEX (league_id),
       FOREIGN KEY (league_id) REFERENCES leagues (id)
       ON UPDATE CASCADE ON DELETE CASCADE,

       PRIMARY KEY (id)
) ENGINE InnoDB;


CREATE TABLE tournaments(
       id INT UNSIGNED AUTO_INCREMENT NOT NULL,
       title VARCHAR(30),
       league_id INT UNSIGNED NOT NULL,

       INDEX (league_id),
       FOREIGN KEY (league_id) REFERENCES leagues (id)
       ON UPDATE CASCADE ON DELETE CASCADE,

       PRIMARY KEY (id)
) ENGINE InnoDB;

CREATE TABLE matches(
       id INT UNSIGNED AUTO_INCREMENT NOT NULL,
		
       /* 0 - Tie, 1 - User 1 wins, 2 User 2 wins, NULL - incomplete match */
       match_result SMALLINT UNSIGNED NULL,

	   league_id INT UNSIGNED NOT NULL,
       INDEX (league_id),
       FOREIGN KEY (league_id) REFERENCES leagues (id)
       ON UPDATE CASCADE ON DELETE CASCADE,
       
       tournament_id INT UNSIGNED NULL,
       INDEX (tournament_id),
       FOREIGN KEY (tournament_id) REFERENCES tournaments (id)
       ON UPDATE CASCADE ON DELETE CASCADE,

	   user1_id INT UNSIGNED NOT NULL,
       INDEX (user1_id),
       FOREIGN KEY (user1_id) REFERENCES users (id)
       ON UPDATE CASCADE ON DELETE CASCADE,

	   user2_id INT UNSIGNED NOT NULL,
       INDEX (user2_id),
       FOREIGN KEY (user2_id) REFERENCES users (id)
       ON UPDATE CASCADE ON DELETE CASCADE,

       PRIMARY KEY (id)
) ENGINE InnoDB;

CREATE TABLE tournmanent_user(
       user_rank INT UNSIGNED,

       tournament_id INT UNSIGNED NOT NULL,
       INDEX (tournament_id),
       FOREIGN KEY (tournament_id) REFERENCES tournaments (id)
       ON UPDATE CASCADE ON DELETE CASCADE,

       user_id INT UNSIGNED NOT NULL,
       INDEX (user_id),
       FOREIGN KEY (user_id) REFERENCES users (id)
       ON UPDATE CASCADE ON DELETE CASCADE

) ENGINE InnoDB;


/*  
    Small change to the schema here.  User now has to belong to a team in
    the database to belong to a league or play in a tournament.  A user 
    can be a team of one. 

*/
CREATE TABLE team_user( /* many-to-many relationship between Team and User*/

       user_id INT UNSIGNED NOT NULL,
       INDEX (user_id),
       FOREIGN KEY (user_id) REFERENCES users (id)
       ON UPDATE CASCADE ON DELETE CASCADE,

       team_id INT UNSIGNED NOT NULL,
       INDEX (team_id),
       FOREIGN KEY (team_id) REFERENCES teams (id)
       ON UPDATE CASCADE ON DELETE CASCADE

) ENGINE InnoDB;


CREATE TABLE user_organization(

       /* 'O' - Owner, 'A' - Admin, 'M' - Member */
       user_role CHAR,       		     
       
       user_id INT UNSIGNED NOT NULL,
       INDEX (user_id),
       FOREIGN KEY (user_id) REFERENCES users (id)
       ON UPDATE CASCADE ON DELETE CASCADE,

       organization_id INT UNSIGNED NOT NULL,
       INDEX (organization_id),
       FOREIGN KEY (organization_id) REFERENCES organizations (id)
       ON UPDATE CASCADE ON DELETE CASCADE

) ENGINE InnoDB;


CREATE TABLE user_league(
       user_rank INT UNSIGNED,
       
       /* 'A' - Admin, 'M' - Member */
       user_role CHAR,	     
      
	   user_id INT UNSIGNED NOT NULL,
       INDEX (user_id),
       FOREIGN KEY (user_id) REFERENCES users (id)
       ON UPDATE CASCADE ON DELETE CASCADE,

       league_id INT UNSIGNED NOT NULL,
       INDEX (league_id),
       FOREIGN KEY (league_id) REFERENCES leagues (id)
       ON UPDATE CASCADE ON DELETE CASCADE

) ENGINE InnoDB;
