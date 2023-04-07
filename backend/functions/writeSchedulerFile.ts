export function writeSchedulerFile(questions: any) {
  const coords = [
    "x23y71z-9",
    "x-27y69z-1",
    "x-21y67z15",
    "x-23y70z15",
    "x27y66z15",
    "x22y67z11",
    "x-9y77z-29",
    "x-28y77z-10",
    "x-28y79z-1",
    "x-19y77z5",
    "x-19y79z25",
    "x-1y80z27",
    "x11y76z29",
    "x25y78z-7",
    "x29y76z4",
    "x16y80z-21",
    "x-7y83z27",
    "x-12y63z-37",
    "x0y77z2",
  ];

  let commandString = "";

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
