export function writeSchedulerFile(questions: any) {
  const coords = [
    "-21 67 15",
    "-9 77 -29",
    "23 71 -9",
    "27 66 15",
    "-28 79 -1",
    "-1 80 27",
    "-28 77 -10",
    "22 67 11",
    "-19 79 25",
    "-19 77 5",
    "-27 69 -1",
    "11 76 29",
    "-23 70 15",
    "0 77 2",
    "-12 63 -36",
    "25 78 -7",
    "16 80 -21",
    "15 71 11",
    "29 76 3",
    "-9 76 32",
  ];

  let schedulerString = `scheduler:
  Test:
    date: start
    commands:
`;

  for (let i = 0; i < questions.length; i++) {
    schedulerString += `      - setblock ${coords[i]} orange_shulker_box
`;
  }

  return schedulerString;
}
