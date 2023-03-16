// Import the speakeasy and dotenv libraries
import speakeasy from "speakeasy"
import dotenv from "dotenv"

// Load environment variables from a .env file
dotenv.config()

// Set the secret key (in this example, it's a base32 string)
const secret: any = process.env.TOTP_KEY

// Define a function to generate a TOTP token
export function generateTOTP() {
  // Get the current time in seconds since the epoch
  const current_time = Math.floor(Date.now() / 1000);
  
  // Calculate the TOTP token for the current time using the secret key
  const totp_token = speakeasy.totp({
    secret: secret,
    encoding: 'base32',
    time: current_time
  });
  
  // Return the TOTP token
  return totp_token;
}
