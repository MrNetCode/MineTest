import speakeasy from "speakeasy"
import dotenv from "dotenv"

dotenv.config()

// Set the secret key (in this example, it's a base32 string)
const secret: any = process.env.TOTP_KEY


export function generateTOTP() {
  // Convert the secret key to bytes
  
  // Get the current time in seconds since the epoch
  const current_time = Math.floor(Date.now() / 1000);
  
  // Calculate the TOTP token for the current time
  const totp_token = speakeasy.totp({
    secret: secret,
    encoding: 'base32',
    time: current_time
  });
  
  // Return the TOTP token
  return totp_token;
}
