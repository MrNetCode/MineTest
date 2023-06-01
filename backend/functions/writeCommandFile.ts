export function writeCommandFile(questions: any, testId: any) {
  let commandFile = `start:
  command: /start
  type: RUN_CONSOLE
  runcmd:
  - 'httpsend POST http://172.17.0.1/api/test/start?testId=${testId} {}'
  permission-required: false
  register: true

teststart:
  command: /teststart
  type: RUN_CONSOLE
  runcmd:
  - 'execute positioned -81.62 167.32 22.25 run tp @a[distance=..35] 19.50 66.00 24.50'
  - 'difficulty peaceful'
  - 'title @a title {"text":"Test Started","bold":true,"color":"green"}'
  permission-required: true
  register: true
`;

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const id = question.id;
    let text = question.text;
    const type = question.type;
    const choice1 = question.choice1;
    const choice2 = question.choice2;
    const choice3 = question.choice3;
    const choice4 = question.choice4;
    const choice5 = question.choice5;

    if (type === "multi") {
      text = text.replace(/`/g, "");
      commandFile += `question${id}:
  command: /question${id}
  type: ICON_MENU
  text:
  - 'POSITION:ITEM_NAME:ITEMDATA:COMMAND/MESSAGE:TITLE:DESCRIPTION;MULTILINES'
  - 'ITEM_NAME can also be ITEM_NAME;ENCHANTMENT_NAME;LEVEL'
  iconmenu_title: 'Question'
  iconmenu_size: 27
  permission-required: false
  iconmenu_commands:
  - 4:DIAMOND:0:%stayopen%:${text}
  - 9:RED_WOOL:0:/answer${id} 1:${choice1}
  - 11:YELLOW_WOOL:0:/answer${id} 2:${choice2}
`;

      if (choice3) {
        commandFile += `  - 13:LIME_WOOL:0:/answer${id} 3:${choice3}
`;
      }

      if (choice4) {
        commandFile += `  - 15:CYAN_WOOL:0:/answer${id} 4:${choice4}
`;
      }

      if (choice5) {
        commandFile += `  - 17:MAGENTA_WOOL:0:/answer${id} 5:${choice5}
`;
      }

      commandFile += `answer${id}:
  command: /answer${id}
  type: 
  - CALL_URL
  - RUN_COMMAND
  url: 'http://172.17.0.1/api/answer?id=${id}&player=$player&answer=$arg1&testId=${testId}'
  runcmd:
  - /setmeta ${i+1}
  permission-required: false
`;
    } else if (type === "true-false") {
      text = text.replace(/`/g, "");
      commandFile += `question${id}:
  command: /question${id}
  type: ICON_MENU
  text:
  - 'POSITION:ITEM_NAME:ITEMDATA:COMMAND/MESSAGE:TITLE:DESCRIPTION;MULTILINES'
  - 'ITEM_NAME can also be ITEM_NAME;ENCHANTMENT_NAME;LEVEL'
  iconmenu_title: 'Question'
  iconmenu_size: 27
  permission-required: false
  iconmenu_commands:
  - 4:DIAMOND:0:%stayopen%:${text}
  - 10:LIME_WOOL:0:/answer${id} 1:true
  - 16:RED_WOOL:0:/answer${id} 0:false

answer${id}:
  command: /answer${id}
  type: 
  - CALL_URL
  - RUN_COMMAND
  url: 'http://172.17.0.1/api/answer?id=${id}&player=$player&answer=$arg1&testId=${testId}'
  runcmd:
  - /setmeta ${i+1}
  permission-required: false
`;
    } else if (type === "text") {
      text = text.replace(/`/g, "");
      commandFile += `question${id}:
      command: /question${id}
      type: ICON_MENU
      text:
      - 'POSITION:ITEM_NAME:ITEMDATA:COMMAND/MESSAGE:TITLE:DESCRIPTION;MULTILINES'
      - 'ITEM_NAME can also be ITEM_NAME;ENCHANTMENT_NAME;LEVEL'
      iconmenu_title: 'Question'
      iconmenu_size: 27
      permission-required: false
      iconmenu_commands:
      - 4:DIAMOND:0:%stayopen%:${text}
      - 13:LIME_WOOL:0:/book ${id} ${testId} ${text};/setmeta ${i+1}:&rClicca Qui Per Rispondere
    
`;
    }
  }

  return commandFile;
}
