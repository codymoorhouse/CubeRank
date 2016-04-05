USE CubeRank;

DROP TABLE IF EXISTS `CubeRank`.`tournament_user`;
DROP TABLE IF EXISTS `CubeRank`.`league_user`;
DROP TABLE IF EXISTS `CubeRank`.`organization_user`; 
DROP TABLE IF EXISTS `CubeRank`.`team_user`;
DROP TABLE IF EXISTS `CubeRank`.`matches`;
DROP TABLE IF EXISTS `CubeRank`.`tournaments`; 
DROP TABLE IF EXISTS `CubeRank`.`teams`;
DROP TABLE IF EXISTS `CubeRank`.`leagues`;
DROP TABLE IF EXISTS `CubeRank`.`organizations`;
DROP TABLE IF EXISTS `CubeRank`.`users`;
           
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
       username VARCHAR(100) UNIQUE,
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
       random BIT,
       match_for_third BIT,

       INDEX (league_id),
       FOREIGN KEY (league_id) REFERENCES leagues (id)
       ON UPDATE CASCADE ON DELETE CASCADE,

       PRIMARY KEY (id)
) ENGINE InnoDB;

CREATE TABLE matches(
       id INT UNSIGNED AUTO_INCREMENT NOT NULL,
       match_date DATETIME NOT NULL,	
	   username1 VARCHAR(100),
	   username2 VARCHAR(100),

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

CREATE TABLE tournament_user(
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


CREATE TABLE organization_user (

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


CREATE TABLE league_user (
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

INSERT INTO `CubeRank`.`organizations` (`id`, `oname`, `description`) VALUES ('1', 'NHL', 'National Hockey League');
INSERT INTO `CubeRank`.`organizations` (`id`, `oname`, `description`) VALUES ('2', 'WHL', 'Western Hockey League');
INSERT INTO `CubeRank`.`organizations` (`id`, `oname`, `description`) VALUES ('3', 'FIFA', 'Fédération Internationale de Football Association');
INSERT INTO `CubeRank`.`organizations` (`id`, `oname`, `description`) VALUES ('4', 'NFL', 'National Football League');
INSERT INTO `CubeRank`.`organizations` (`id`, `oname`, `description`) VALUES ('5', 'CFL', 'Canadian Football League');

INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('1', 'Guest', 'Guest', 'guest@email', 'GUEST', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('2', 'Alan', 'Yong', 'yonga@mymacewan.ca', 'yonga', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('3', 'Cody', 'Moorhouse', 'moorhousec2@mymacewan.ca', 'moorhousec2', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('4', 'John', 'Mulvany-Robbins', 'mulvanyrobbinsj@mymacewan.ca', 'mulvanyrobbinsj', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('5', 'Adam', 'Epp', 'eppa5@mymacewan.ca', 'eppa', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('6', 'WHL', 'Owner', 'iownwhl@whl.ca', 'whl_owner', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('7', 'FIFA', 'Owner', 'iownfifa@fifa.ca', 'fifa_owner', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('8', 'NFL', 'Owner', 'iownnfl@nfl.ca', 'nfl_owner', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('9', 'CFL', 'Owner', 'iowncfl@cfl.ca', 'cfl_owner', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('10', 'NHL', 'Admin', 'iadminnhl@nhl.ca', 'nhl_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('11', 'WHL', 'Admin', 'iadminwhl@whl.ca', 'whl_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('12', 'FIFA', 'Admin', 'iadminfifa@fifa.ca', 'fifa_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('13', 'NFL', 'Admin', 'iadminnfl@nfl.ca', 'nfl_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('14', 'CFL', 'Admin', 'iadmincfl@cfl.ca', 'cfl_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('15', 'NHL', 'Member', 'iadminnhl@nhl.ca', 'nhl_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('16', 'WHL', 'Member', 'imemberwhl@whl.ca', 'whl_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('17', 'FIFA', 'Member', 'imemberifa@fifa.ca', 'fifa_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('18', 'NFL', 'Member', 'imembernfl@nfl.ca', 'nfl_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('19', 'CFL', 'Member', 'imembercfl@cfl.ca', 'cfl_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('20', 'NHL_L1', 'Admin', 'nhl_l1_admin@nhl.ca', 'nhl_l1_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('21', 'NHL_L2', 'Admin', 'nhl_l2_admin@nhl.ca', 'nhl_l2_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('22', 'NHL_L3', 'Admin', 'nhl_l3_admin@nhl.ca', 'nhl_l3_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('23', 'NHL_L1', 'Member', 'nhl_l1_member@nhl.ca', 'nhl_l1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('24', 'NHL_L2', 'Member', 'nhl_l2_member@nhl.ca', 'nhl_l2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('25', 'NHL_L3', 'Member', 'nhl_l3_member@nhl.ca', 'nhl_l3_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('26', 'WHL_L1', 'Admin', 'whl_l1_admin@whl.ca', 'whl1_league_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('27', 'WHL_L2', 'Admin', 'whl_l2_admin@whl.ca', 'whl2_league_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('28', 'WHL_L3', 'Admin', 'whl_l3_admin@whl.ca', 'whl3_league_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('29', 'WHL_L1', 'Member', 'whl_l1_member@whl.ca', 'whl_l1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('30', 'WHL_L2', 'Member', 'whl_l2_member@whl.ca', 'whl_l2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('31', 'WHL_L3', 'Member', 'whl_l3_member@whl.ca', 'whl_l3_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('32', 'FIFA_L1', 'Admin', 'fifa_l1_admin@fifa.ca', 'fifa_l1_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('33', 'FIFA_L2', 'Admin', 'fifa_l2_admin@fifa.ca', 'fifa_l2_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('34', 'FIFA_L3', 'Admin', 'fifa_l3_admin@fifa.ca', 'fifa_l3_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('35', 'FIFA_L1', 'Member', 'fifa_l1_member@fifa.ca', 'fifa_l1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('36', 'FIFA_L2', 'Member', 'fifa_l2_member@fifa.ca', 'fifa_l2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('37', 'FIFA_L3', 'Member', 'fifa_l3_member@fifa.ca', 'fifa_l3_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('38', 'NFL_L1', 'Admin', 'nfl_l1_admin@nhl.ca', 'nfl_l1_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('39', 'NFL_L2', 'Admin', 'nfl_l2_admin@nhl.ca', 'nfl_l2_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('40', 'NFL_L3', 'Admin', 'nfl_l3_admin@nhl.ca', 'nfl_l3_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('41', 'NFL_L1', 'Member', 'nfl_l1_member@nhl.ca', 'nfl_l1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('42', 'NFL_L2', 'Member', 'nfl_l2_member@nhl.ca', 'nfl_l2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('43', 'NFL_L3', 'Member', 'nfl_l3_member@nhl.ca', 'nfl_l3_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('44', 'CFL_L1', 'Admin', 'cfl_l1_admin@nhl.ca', 'cfl_l1_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('45', 'CFL_L2', 'Admin', 'cfl_l2_admin@nhl.ca', 'cfl_l2_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('46', 'CFL_L3', 'Admin', 'cfl_l3_admin@nhl.ca', 'cfl_l3_admin', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('47', 'CFL_L1', 'Member', 'cfl_l1_member@nhl.ca', 'cfl_l1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('48', 'CFL_L2', 'Member', 'cfl_l2_member@nhl.ca', 'cfl_l2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('49', 'CFL_L3', 'Member', 'cfl_l3_member@nhl.ca', 'cfl_l3_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('50', 'NHL_L1_T1', 'Member', 'nhl_l1_t1_member@nhl.ca', 'nhl_l1_t1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('51', 'NHL_L1_T2', 'Member', 'nhl_l1_t2_member@nhl.ca', 'nhl_l1_t2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('52', 'NHL_L2_T1', 'Member', 'nhl_l2_t1_member@nhl.ca', 'nhl_l2_t1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('53', 'NHL_L2_T2', 'Member', 'nhl_l2_t2_member@nhl.ca', 'nhl_l2_t2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('54', 'NHL_L3_T1', 'Member', 'nhl_l3_t1_member@nhl.ca', 'nhl_l3_t1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('55', 'NHL_L3_T2', 'Member', 'nhl_l3_t2_member@nhl.ca', 'nhl_l3_t2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('56', 'WHL_L1_T1', 'Member', 'whl_l1_t1_member@nhl.ca', 'whl_l1_t1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('57', 'WHL_L1_T2', 'Member', 'whl_l1_t2_member@nhl.ca', 'whl_l1_t2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('58', 'WHL_L2_T1', 'Member', 'whl_l2_t1_member@nhl.ca', 'whl_l2_t1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('59', 'WHL_L2_T2', 'Member', 'whl_l2_t2_member@nhl.ca', 'whl_l2_t2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('60', 'WHL_L3_T1', 'Member', 'whl_l3_t1_member@nhl.ca', 'whl_l3_t1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('61', 'WHL_L3_T2', 'Member', 'whl_l3_t2_member@nhl.ca', 'whl_l3_t2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('62', 'FIFA_L1_T1', 'Member', 'fifa_l1_t1_member@nhl.ca', 'fifa_l1_t1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('63', 'FIFA_L1_T2', 'Member', 'fifa_l1_t2_member@nhl.ca', 'fifa_l1_t2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('64', 'FIFA_L2_T1', 'Member', 'fifa_l2_t1_member@nhl.ca', 'fifa_l2_t1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('65', 'FIFA_L2_T2', 'Member', 'fifa_l2_t2_member@nhl.ca', 'fifa_l2_t2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('66', 'FIFA_L3_T1', 'Member', 'fifa_l3_t1_member@nhl.ca', 'fifa_l3_t1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('67', 'FIFA_L3_T2', 'Member', 'fifa_l3_t2_member@nhl.ca', 'fifa_l3_t2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('68', 'NFL_L1_T1', 'Member', 'nfl_l1_t1_member@nhl.ca', 'nfl_l1_t1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('69', 'NFL_L1_T2', 'Member', 'nfl_l1_t2_member@nhl.ca', 'nfl_l1_t2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('70', 'NFL_L2_T1', 'Member', 'nfl_l2_t1_member@nhl.ca', 'nfl_l2_t1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('71', 'NFL_L2_T2', 'Member', 'nfl_l2_t2_member@nhl.ca', 'nfl_l2_t2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('72', 'NFL_L3_T1', 'Member', 'nfl_l3_t1_member@nhl.ca', 'nfl_l3_t1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('73', 'NFL_L3_T2', 'Member', 'nfl_l3_t2_member@nhl.ca', 'nfl_l3_t2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('74', 'CFL_L1_T1', 'Member', 'cfl_l1_t1_member@nhl.ca', 'cfl_l1_t1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('75', 'CFL_L1_T2', 'Member', 'cfl_l1_t2_member@nhl.ca', 'cfl_l1_t2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('76', 'CFL_L2_T1', 'Member', 'cfl_l2_t1_member@nhl.ca', 'cfl_l2_t1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('77', 'CFL_L2_T2', 'Member', 'cfl_l2_t2_member@nhl.ca', 'cfl_l2_t2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('78', 'CFL_L3_T1', 'Member', 'cfl_l3_t1_member@nhl.ca', 'cfl_l3_t1_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');
INSERT INTO `CubeRank`.`users` (`id`, `fName`, `lName`, `email`, `username`, `password`) VALUES ('79', 'CFL_L3_T2', 'Member', 'cfl_l3_t2_member@nhl.ca', 'cfl_l3_t2_member', '$2a$05$DU./A5Y7DP0zkVY958o4BuwU41WZ2/xSQKKvIcF74MUpMKKxmC1Bm');

INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '1', '1');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '1', '2');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '1', '3');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '1', '4');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '1', '5');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '2', '1');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '2', '2');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '2', '3');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '2', '4');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '2', '5');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '3', '1');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '3', '2');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '3', '3');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '3', '4');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '3', '5');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '4', '1');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '4', '2');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '4', '3');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '4', '4');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '4', '5');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '5', '1');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '6', '2');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '7', '3');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '8', '4');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('O', '9', '5');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '10', '1');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '11', '2');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '12', '3');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '13', '4');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '14', '5');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '15', '1');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '16', '2');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '17', '3');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '18', '4');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '19', '5');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '20', '1');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '21', '1');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '22', '1');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '23', '1');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '24', '1');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '25', '1');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '26', '2');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '27', '2');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '28', '2');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '29', '2');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '30', '2');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '31', '2');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '32', '3');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '33', '3');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '34', '3');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '35', '3');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '36', '3');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '37', '3');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '38', '4');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '39', '4');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '40', '4');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '41', '4');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '42', '4');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '43', '4');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '44', '5');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '45', '5');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('A', '46', '5');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '47', '5');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '48', '5');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '49', '5');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '50', '1');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '51', '1');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '52', '1');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '53', '1');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '54', '1');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '55', '1');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '56', '2');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '57', '2');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '58', '2');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '59', '2');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '60', '2');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '61', '2');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '62', '3');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '63', '3');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '64', '3');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '65', '3');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '66', '3');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '67', '3');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '68', '4');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '69', '4');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '70', '4');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '71', '4');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '72', '4');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '73', '4');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '74', '5');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '75', '5');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '76', '5');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '77', '5');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '78', '5');
INSERT INTO `CubeRank`.`organization_user` (`user_role`, `user_id`, `organization_id`) VALUES ('M', '79', '5');


INSERT INTO `CubeRank`.`leagues` (`id`, `title`, `description`, `organization_id`) VALUES ('1', 'guestLeague', 'for guests', '1');
INSERT INTO `CubeRank`.`leagues` (`id`, `title`, `description`, `organization_id`) VALUES ('2', 'NHL2', 'NHL League 2', '1');
INSERT INTO `CubeRank`.`leagues` (`id`, `title`, `description`, `organization_id`) VALUES ('3', 'NHL3', 'NHL League 3', '1');
INSERT INTO `CubeRank`.`leagues` (`id`, `title`, `description`, `organization_id`) VALUES ('4', 'WHL1', 'WHL League 1', '2');
INSERT INTO `CubeRank`.`leagues` (`id`, `title`, `description`, `organization_id`) VALUES ('5', 'WHL2', 'WHL League 2', '2');
INSERT INTO `CubeRank`.`leagues` (`id`, `title`, `description`, `organization_id`) VALUES ('6', 'WHL3', 'WHL League 3', '2');
INSERT INTO `CubeRank`.`leagues` (`id`, `title`, `description`, `organization_id`) VALUES ('7', 'FIFA1', 'FIFA League 1', '3');
INSERT INTO `CubeRank`.`leagues` (`id`, `title`, `description`, `organization_id`) VALUES ('8', 'FIFA2', 'FIFA League 2', '3');
INSERT INTO `CubeRank`.`leagues` (`id`, `title`, `description`, `organization_id`) VALUES ('9', 'FIFA3', 'FIFA League 3', '3');
INSERT INTO `CubeRank`.`leagues` (`id`, `title`, `description`, `organization_id`) VALUES ('10', 'NFL1', 'NFL League 1', '4');
INSERT INTO `CubeRank`.`leagues` (`id`, `title`, `description`, `organization_id`) VALUES ('11', 'NFL2', 'NFL League 2', '4');
INSERT INTO `CubeRank`.`leagues` (`id`, `title`, `description`, `organization_id`) VALUES ('12', 'NFL3', 'NFL League 3', '4');
INSERT INTO `CubeRank`.`leagues` (`id`, `title`, `description`, `organization_id`) VALUES ('13', 'CFL1', 'CFL League 1', '5');
INSERT INTO `CubeRank`.`leagues` (`id`, `title`, `description`, `organization_id`) VALUES ('14', 'CFL2', 'CFL League 2', '5');
INSERT INTO `CubeRank`.`leagues` (`id`, `title`, `description`, `organization_id`) VALUES ('15', 'CFL3', 'CFL League 3', '5');

INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('100', 'A', '1', '1');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('100', 'A', '1', '2');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('100', 'A', '1', '3');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('100', 'A', '1', '4');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('100', 'A', '1', '5');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('100', 'A', '1', '6');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('100', 'A', '1', '7');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('100', 'A', '1', '8');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('100', 'A', '1', '9');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('100', 'A', '1', '10');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('100', 'A', '1', '11');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('100', 'A', '1', '12');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('100', 'A', '1', '13');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('100', 'A', '1', '14');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('100', 'A', '1', '15');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('200', 'A', '2', '1');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('200', 'A', '2', '2');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('200', 'A', '2', '3');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('200', 'A', '2', '4');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('200', 'A', '2', '5');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('200', 'A', '2', '6');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('200', 'A', '2', '7');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('200', 'A', '2', '8');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('200', 'A', '2', '9');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('200', 'A', '2', '10');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('200', 'A', '2', '11');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('200', 'A', '2', '12');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('200', 'A', '2', '13');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('200', 'A', '2', '14');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('200', 'A', '2', '15');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('300', 'A', '3', '1');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('300', 'A', '3', '2');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('300', 'A', '3', '3');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('300', 'A', '3', '4');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('300', 'A', '3', '5');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('300', 'A', '3', '6');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('300', 'A', '3', '7');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('300', 'A', '3', '8');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('300', 'A', '3', '9');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('300', 'A', '3', '10');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('300', 'A', '3', '11');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('300', 'A', '3', '12');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('300', 'A', '3', '13');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('300', 'A', '3', '14');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('300', 'A', '3', '15');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('400', 'A', '4', '1');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('400', 'A', '4', '2');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('400', 'A', '4', '3');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('400', 'A', '4', '4');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('400', 'A', '4', '5');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('400', 'A', '4', '6');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('400', 'A', '4', '7');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('400', 'A', '4', '8');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('400', 'A', '4', '9');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('400', 'A', '4', '10');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('400', 'A', '4', '11');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('400', 'A', '4', '12');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('400', 'A', '4', '13');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('400', 'A', '4', '14');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('400', 'A', '4', '15');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '5', '1');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '5', '2');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '5', '3');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '6', '1');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '6', '2');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '6', '3');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '7', '1');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '7', '2');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '7', '3');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '8', '4');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '8', '5');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '8', '6');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '9', '4');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '9', '5');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '9', '6');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '10', '4');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '10', '5');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '10', '6');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '11', '7');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '11', '8');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '11', '9');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '12', '7');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '12', '8');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '12', '9');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '13', '7');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '13', '8');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '13', '9');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '14', '10');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '14', '11');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '14', '12');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '15', '10');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '15', '11');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '15', '12');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '16', '10');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '16', '11');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '16', '12');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '17', '13');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '17', '14');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '17', '15');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '18', '13');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '18', '14');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '18', '15');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '19', '13');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '19', '14');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '19', '15');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '20', '1');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '21', '2');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '22', '3');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '23', '1');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '24', '2');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '25', '3');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '26', '4');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '27', '5');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '28', '6');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '29', '4');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '30', '5');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '31', '6');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '32', '7');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '33', '8');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '34', '9');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '35', '7');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '36', '8');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '37', '9');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '38', '10');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '39', '11');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '40', '12');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '41', '10');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '42', '11');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '43', '12');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '44', '13');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '45', '14');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'A', '46', '15');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '47', '13');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '48', '14');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '49', '15');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '50', '1');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '51', '1');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '52', '2');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '53', '2');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '54', '3');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '55', '3');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '56', '4');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '57', '4');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '58', '5');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '59', '5');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '60', '6');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '61', '6');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '62', '7');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '63', '7');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '64', '8');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '65', '8');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '66', '9');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '67', '9');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '68', '10');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '69', '10');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '70', '11');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '71', '11');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '72', '12');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '73', '12');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '74', '13');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '75', '13');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '76', '14');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '77', '14');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '78', '15');
INSERT INTO `CubeRank`.`league_user` (`user_rank`, `user_role`, `user_id`, `league_id`) VALUES ('1000', 'M', '79', '15');


INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('1', 'NHL1 Tournament 1', '1');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('2', 'NHL1 Tournament 2', '1');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('3', 'NHL2 Tournament 1', '2');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('4', 'NHL2 Tournament 2', '2');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('5', 'NHL3 Tournament 1', '3');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('6', 'NHL3 Tournament 2', '3');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('7', 'WHL1 Tournament 1', '4');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('8', 'WHL1 Tournament 2', '4');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('9', 'WHL2 Tournament 1', '5');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('10', 'WHL2 Tournament 2', '5');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('11', 'WHL3 Tournament 1', '6');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('12', 'WHL3 Tournament 2', '6');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('13', 'FIFA1 Tournament 1', '7');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('14', 'FIFA1 Tournament 2', '7');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('15', 'FIFA2 Tournament 1', '8');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('16', 'FIFA2 Tournament 2', '8');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('17', 'FIFA2 Tournament 1', '9');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('18', 'FIFA2 Tournament 2', '9');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('19', 'NFL1 Tournament 1', '10');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('20', 'NFL1 Tournament 2', '10');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('21', 'NFL2 Tournament 1', '11');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('22', 'NFL2 Tournament 2', '11');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('23', 'NFL3 Tournament 1', '12');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('24', 'NFL3 Tournament 2', '12');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('25', 'CFL1 Tournament 1', '13');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('26', 'CFL1 Tournament 2', '13');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('27', 'CFL2 Tournament 1', '14');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('28', 'CFL2 Tournament 2', '14');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('29', 'CFL3 Tournament 1', '15');
INSERT INTO `CubeRank`.`tournaments` (`id`, `title`, `league_id`) VALUES ('30', 'CFL3 Tournament 2', '15');

INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '1', '50');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '2', '51');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '3', '52');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '4', '53');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '5', '54');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '6', '55');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '7', '56');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '8', '57');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '9', '58');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '10', '59');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '11', '60');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '12', '61');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '13', '62');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '14', '63');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '15', '64');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '16', '65');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '17', '66');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '18', '67');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '19', '68');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '20', '69');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '21', '70');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '22', '71');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '23', '72');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '24', '73');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '25', '74');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '26', '75');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '27', '76');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '28', '77');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '29', '78');
INSERT INTO `CubeRank`.`tournament_user` (`user_rank`, `tournament_id`, `user_id`) VALUES ('1000', '30', '79');

INSERT INTO `CubeRank`.`matches` (`id`, `match_date`, `match_result`, `league_id`, `user1_id`, `user2_id`) VALUES ('1', '2016-03-9 13:00:00', '1', '1', '1', '2');
INSERT INTO `CubeRank`.`matches` (`id`, `match_date`, `match_result`, `league_id`, `user1_id`, `user2_id`) VALUES ('2', '2016-03-9 14:00:00', '2', '2', '1', '2');
INSERT INTO `CubeRank`.`matches` (`id`, `match_date`, `match_result`, `league_id`, `user1_id`, `user2_id`) VALUES ('3', '2016-03-9 15:00:00', '0', '3', '1', '2');
INSERT INTO `CubeRank`.`matches` (`id`, `match_date`, `match_result`, `league_id`, `tournament_id`, `user1_id`, `user2_id`) VALUES ('4', '2016-03-9 13:00:00', '1', '4', '1', '2', '3');
INSERT INTO `CubeRank`.`matches` (`id`, `match_date`, `match_result`, `league_id`, `tournament_id`, `user1_id`, `user2_id`) VALUES ('5', '2016-03-9 14:00:00', '2', '5', '2', '2', '3');
INSERT INTO `CubeRank`.`matches` (`id`, `match_date`, `match_result`, `league_id`, `tournament_id`, `user1_id`, `user2_id`) VALUES ('6', '2016-03-9 15:00:00', '0', '6', '3', '2', '3');
INSERT INTO `CubeRank`.`matches` (`id`, `match_date`, `match_result`, `league_id`, `tournament_id`, `user1_id`, `user2_id`) VALUES ('7', '2016-03-9 13:00:00', '1', '7', '3', '3', '4');
INSERT INTO `CubeRank`.`matches` (`id`, `match_date`, `match_result`, `league_id`, `user1_id`, `user2_id`) VALUES ('8', '2016-03-9 14:00:00', '2', '8', '3', '4');
INSERT INTO `CubeRank`.`matches` (`id`, `match_date`, `match_result`, `league_id`, `user1_id`, `user2_id`) VALUES ('9', '2016-03-9 15:00:00', '0', '9', '3', '4');
INSERT INTO `CubeRank`.`matches` (`id`, `match_date`, `match_result`, `league_id`, `tournament_id`, `user1_id`, `user2_id`) VALUES ('10', '2016-03-9 13:00:00', '1', '1', '2', '4', '1');
INSERT INTO `CubeRank`.`matches` (`id`, `match_date`, `match_result`, `league_id`, `user1_id`, `user2_id`) VALUES ('11', '2016-02-9 14:00:00', '2', '1', '4', '1');
INSERT INTO `CubeRank`.`matches` (`id`, `match_date`, `match_result`, `league_id`, `user1_id`, `user2_id`) VALUES ('12', '2016-04-9 15:00:00', NULL, '1', '4', '1');
INSERT INTO `CubeRank`.`matches` (`id`, `match_date`, `league_id`, `user1_id`, `user2_id`) VALUES ('14', '2016-04-9 15:00:00', '1', '4', '1');
INSERT INTO `CubeRank`.`matches` (`id`, `match_date`, `league_id`, `tournament_id`, `user1_id`, `user2_id`) VALUES ('13', '2016-04-10 15:00:00', '1', '2', '4', '1');
