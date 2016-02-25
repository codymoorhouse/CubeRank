API
===


Relations
=========
/matches/{id}                    Retrieve specific match information. (RU)




/orgs                            View all organizations. (CR)

/orgs/{id}                       Basic information about the organization. (RUD)

/orgs/{id}/leagues               Which leagues belong to the organization. (CR)

/orgs/{id}/tournaments           Which tournaments belong to the organization. (CR)

/orgs/{id}/users                 Which users belong to the organization. (RU)




/leagues/{id}                    Basic information about the league.

/leagues/{id}/matches            Retrieve which matches belong to the league. 

/leagues/{id}/tournaments        Which tournaments belong to the league.

/leagues/{id}/users              Retrieve users and user rank assoicated with the league.

/leagues/{id}/users?max={num}    Retrieve users with a maximum rank of {num} value.

/leagues/{id}/users?min={num}    Retrieve users with a minimum rank of {num} value.

/leagues/{id}/users?min={num}    Retrieve users with rank between min and max.

                   &max={num}



/teams/{id}                      See which users belong to the team.




/tournaments/{id}                Basic information about the tournament.

/tournaments/{id}/matches        Which matches belong to the tournament.

/tournaments/{id}/matches?curr   Retrieve which matches that have no result.

/tournaments/{id}/matches?done   Retrieve which matches that have a result.




/users/{id}                      Basic information about a user.

/users/{id}/leagues              Which leagues a user belongs to.

/users/{id}/matches              Which matches a user belongs to.

/users/{id}/matches?recent       Show the most recent match for a user.

/users/{id}/orgs                 Which organizations a user belongs to. (R)

/users/{id}/teams                Which teams a user belongs to.

/users/{id}/tournaments          Which tournaments a user belongs to




Considerations
==============
/login                           Used to authenticate on website.

** Should we let ranks be updated?
