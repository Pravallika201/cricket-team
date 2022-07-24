const express = require("express");

const app = express();


const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = join.path(__dirname, "cricketTeam.db");

const db = null;

const initializeDbServer = async () => {
  try {
    db = await open({
      fileName: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server running at http://localhost:3000/");
    );
  } catch (e) {
    console.log(`DB error: ${e.message}`);
    process.exit(1);
  }
};
initializeDbServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const playersQuery = `
            select *
            from cricket_team;`;

  const playersArray = await db.all(playersQuery);

  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});

app.get("/players/:player_id/", async (request, response) => {
  const { player_id } = request.params;

  const getPlayerQuery = `
         select *
         from cricket_team
         where player_id = ${player_id};`;
  const player = await db.get(getPlayerQuery);
  response.send(convertDbObjectToResponseObject(player));
});

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const postPlayerQuery = `
         insert into cricket_team(player_name, jersey_number, role)
         values ('${playerName}', ${jerseyNumber}, '${role}');`;
  const player = await db.run(postPlayerQuery);
  response.send("Player Added to Team");
});

app.put("/players/:player_id/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const { player_id } = request.params;

  const putPlayerQuery = `
          update
             cricket_team
          set
             player_name = '${playerName}',
             jersey_number = ${jerseyNumber},
             role = '${role}'
          where
             player_id = ${playerId};`;
  await db.run(putPlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:player_id/", async (request, response) => {
  const { player_id } = request.params;

  const deletePlayerQuery = `
        delete from
            cricket_team
        where
            player_id = ${playerId};`;

  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
