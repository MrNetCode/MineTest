export function writeBlockDBFile(questions: any) {
  const coords = [
    "x-21y67z15",
    "x-9y77z-29",
    "x23y71z-9",
    "x27y66z15",
    "x-28y79z-1",
    "x-1y80z27",
    "x-28y77z-10",
    "x22y67z11",
    "x-19y79z25",
    "x-19y77z5",
    "x-27y69z-1",
    "x11y76z29",
    "x-23y70z15",
    "x0y77z2",
    "x-12y63z-36",
    "x25y78z-7",
    "x16y80z-21",
    "x15y71z11",
    "x29y76z3",
    "x-9y76z32",
  ];

  let commandString = "";
  commandString += `    x-82y167z22:\n      launchby: player\n      command:\n        - /start\n      cancel_event: false\n`;
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const command = `/question${question.id}`;
    const coordIndex = i % coords.length;
    const coord = coords[coordIndex];
    const fullCommand = `    ${coord}:\n      launchby: player\n      command:\n        - ${command}\n      cancel_event: true\n`;
    commandString += `${fullCommand}`;
  }

  return `block:\n  world:\n${commandString}`;
}
