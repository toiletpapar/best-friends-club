export enum CodenameAction {
  CHAT_MESSAGE = 'CHAT_MESSAGE'
}

interface Action {
  type: CodenameAction;
}

interface ChatAction extends Action {
  type: CodenameAction.CHAT_MESSAGE;
  message: string;
  timestamp: number;
  user: string;
}

const createMessage = (message: string, timestamp: number, user: string): ChatAction => {
  return {
    type: CodenameAction.CHAT_MESSAGE,
    message,
    timestamp,
    user
  }
}

export {
  createMessage
}