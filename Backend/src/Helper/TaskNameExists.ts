import { DatabaseService } from "../db";

const checkTaskNameExists = async (taskName: string): Promise<boolean> => {
  console.log('Received taskName:', taskName);

  // Query the database
  const taskCountResponse = await DatabaseService.checkTaskNameExists(taskName);
  console.log('Response Result', taskCountResponse);
  // Return true if a task is found, false otherwise
  return taskCountResponse;
};

export default checkTaskNameExists;
