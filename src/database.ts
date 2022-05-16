import mysql, { Connection } from "promise-mysql";

let retriedToConnectAmount = 0;
export const createConnection = async (): Promise<Connection> => {
  const maximumRetryConnectionCreationAttempts = 10;

  console.log("Creating database connection.");
  try {
    const connection = await mysql.createConnection({
      host: "34.88.153.108",
      user: "root",
      password: "", // TODO: Can't have password's here. Fix.
      database: "first_test_db",
    });
    console.log("Database connection created successfully.");
    retriedToConnectAmount = 0; // This is useless/doesn't do anything?
    return connection;
  } catch (exception) {
    retriedToConnectAmount++;
    if (retriedToConnectAmount <= maximumRetryConnectionCreationAttempts) {
      console.log(
        `Trying again to form a database connection. Attempt number ${
          retriedToConnectAmount + 1
        }.`
      );
      return await createConnection();
    } else {
      console.log(
        `Couldn't connect to database after ${retriedToConnectAmount} retries.`
      );
      console.log(exception);

      return null;
    }
  }
};

export const queryAllThrowData = async (connection: Connection) => {
  console.log("Querying for all throw data.");

  if (connection) {
    const query =
      "select t.*, u.firstName, u.lastName from throwData t left join user u on t.userId = u.userId;";

    const allThrowData: Array<any> = await connection.query(query);
    console.log(
      "All throw data queried successfully. Rows returned: " +
        allThrowData.length
    );
    return allThrowData;
  } else {
    console.log("Cannot query database. No database connection.");
    return [];
  }
};
