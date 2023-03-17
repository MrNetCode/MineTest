// This function validates the username and email using regular expressions
export function usernameValidator(username: string, email: any = undefined) {
  // Define a regular expression to check the format of the username
  const usernamePattern = /^[a-zA-Z0-9-_\.]{3,30}$/gm;

  // Define a regular expression to check the format of the email address
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  // If username is not provided, return an error code
  if (!username) {
    return 1;
  }

  // If email is provided but doesn't match the email regex, return an error code
  if (email && !emailRegex.test(email)) {
    return 1;
  }

  // Check if the username matches the pattern and doesn't include any prohibited characters or patterns
  if (
    !usernamePattern.test(username) || // Does not match the pattern
    username.includes("__") || // Contains "__"
    username.includes("--") || // Contains "--"
    username.includes("..") || // Contains ".."
    username.startsWith("-") || // Starts with "-"
    username.startsWith("_") || // Starts with "_"
    username.startsWith(".") || // Starts with "."
    username.endsWith("-") || // Ends with "-"
    username.endsWith("_") || // Ends with "_"
    username.endsWith(".") || // Ends with "."
    username.indexOf("__") !== -1 || // Contains "__"
    username.indexOf("--") !== -1 || // Contains "--"
    username.indexOf("..") !== -1 || // Contains ".."
    username.includes("_-") || // Contains "_-"
    username.includes("-_") || // Contains "-_"
    username.includes(".-") || // Contains ".-"
    username.includes("-.") || // Contains "-."
    username.includes("_.") || // Contains "_."
    username.includes("._") // Contains "._"
  ) {
    return 1;
  } else {
    return 0;
  }
}
