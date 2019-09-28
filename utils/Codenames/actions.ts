export enum Actions {
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  USER_JOIN = 'USER_JOIN',
  USER_LEAVE = 'USER_LEAVE'
}

export interface Action {
  type: Actions;
}

export interface ChatAction extends Action {
  type: Actions.CHAT_MESSAGE;
  message: string;
  timestamp: number;
  user: string;
}

export interface UserJoinAction extends Action {
  type: Actions.USER_JOIN;
  user: string;
  timestamp: number;
}

export interface UserLeaveAction extends Action {
  type: Actions.USER_LEAVE;
  user: string;
}

const createMessage = (message: string, timestamp: number, user: string): ChatAction => {
  return {
    type: Actions.CHAT_MESSAGE,
    message,
    timestamp,
    user
  }
}

const createUserJoin = (user: string, timestamp: number): UserJoinAction => {
  return {
    type: Actions.USER_JOIN,
    user,
    timestamp
  }
}

const createUserLeave = (user: string): UserLeaveAction => {
  return {
    type: Actions.USER_LEAVE,
    user
  }
}

export {
  createMessage,
  createUserJoin,
  createUserLeave
}