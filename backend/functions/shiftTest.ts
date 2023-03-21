// import the database connection
import { connection } from '../functions/DB_Connection';

export async function shiftTestOrderAndSaveToDB(tests: any) {
  try {
    // Sort tests by their original order number
    tests.sort((a: any, b: any) => a.order - b.order);
  
    // Loop through tests and update their order number to be sequential starting from 1
    for (let i = 0; i < tests.length; i++) {
      tests[i].order = i + 1;
    }

    // start a transaction to ensure atomicity
    await (await connection).beginTransaction();
    
    // loop through the tests and update the order in the database
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
       const query = `UPDATE questions SET \`order\` = ? WHERE id = ?`;
      const params = [i + 1, test.id];
      await (await connection).query(query, params);
    }

    // commit the transaction
    await (await connection).commit();

    // return the updated tests
    return tests;

  } catch (error: any) {
    // rollback the transaction if there's an error
    await (await connection).rollback();
    console.error(`Failed to update test orders: ${error.message}`);
  }
}
