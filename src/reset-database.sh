# Resets the database, just run in command line with ./reset-database.sh
# Will ask for the CubeRank_admin password, which is 'password'

mysql -u CubeRank_admin -p CubeRank < ../database/CubeRank.sql
