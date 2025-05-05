import { DatabaseService } from "../db";

const checkUserExists = async (username: string, userEmail: string): Promise<boolean> => {
  console.log('Received username:', username);

  // Query the database
  const userCountResponse = await DatabaseService.checkUserExists(username, userEmail);
  console.log('Response Result', userCountResponse);
  // Return true if a user is found, false otherwise
  return userCountResponse;
};

export default checkUserExists;
