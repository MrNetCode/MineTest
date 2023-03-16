export function usernameValidator(username: string, email: any = undefined ) {
  const usernamePattern = /^[a-zA-Z0-9-_\.]{3,30}$/gm;
  const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  if (!username) {
    return 1;
  }

  if (email && !emailRegex.test(email)) {
    return 1;
  }

  if (
    !usernamePattern.test(username) ||
    username.includes("__") ||
    username.includes("--") ||
    username.includes("..") ||
    username.startsWith("-") ||
    username.startsWith("_") ||
    username.startsWith(".") ||
    username.endsWith("-") ||
    username.endsWith("_") ||
    username.endsWith(".") ||
    username.indexOf("__") !== -1 ||
    username.indexOf("--") !== -1 ||
    username.indexOf("..") !== -1 ||
    username.includes("_-") ||
    username.includes("-_") ||
    username.includes(".-") ||
    username.includes("-.") ||
    username.includes("_.") ||
    username.includes("._")
  ) {
    return 1;
  } else {
    return 0;
  }
}
