export function writeCommandFile(questions: any) {
  let commandFile = "";

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
  iconmenu_commands:
  - 4:DIAMOND:0:%stayopen%:${text}
  - 10:RED_WOOL:0:/answer${id} 1:${choice1}
  - 12:YELLOW_WOOL:0:/answer${id} 2:${choice2}
`;

      if (choice3) {
        commandFile += `  - 14:LIME_WOOL:0:/answer${id} 3:${choice3}
`;
      }

      if (choice4) {
        commandFile += `  - 16:CYAN_WOOL:0:/answer${id} 4:${choice4}
`;
      }

      if (choice5) {
        commandFile += `  - 18:MAGENTA_WOOL:0:/answer${id} 5:${choice5}
`;
      }

      commandFile += `answer${id}:
  command: /answer${id}
  type: CALL_URL
  url: 'http://2.238.78.118/api/answer?id=${id}&player=$PlayerData%playername%&answer=$arg1'

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
  iconmenu_commands:
  - 4:DIAMOND:0:%stayopen%:${text}
  - 10:LIME_WOOL:0:/answer${id} 1:true
  - 15:RED_WOOL:0:/answer${id} 2:false

answer${id}:
  command: /answer${id}
  type: CALL_URL
  url: 'http://2.238.78.118/api/answer?id=${id}&player=$PlayerData%playername%&answer=$arg1'
`;
    } else if (type === "text") {
      text = text.replace(/`/g, "");
      commandFile += `question${id}:
  command: /question${id}
  type: ANVIL_GUI
  anvil_title: '${text}'
  anvil_slot_text: "Inserici risposta"
  anvil_commands:
  - /answer${id} $output

call_url:
  command: /answer${id}
  type: CALL_URL
  url: 'http://2.238.78.118/api/answer?id=${id}&player=$PlayerData%playername%&answer=$multiargs'
`;
    }
  }

  return commandFile;
}
