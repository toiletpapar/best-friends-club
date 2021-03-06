export enum Team {
  FIRSTTEAM = 'FIRSTTEAM',
  SECONDTEAM = 'SECONDTEAM',
  ASSASSIN = 'ASSASSIN',
  BYSTANDER = 'BYSTANDER',
  UNKNOWN = 'UNKNOWN'
}

export enum GameState {
  FIRSTTEAMWIN = 'FIRSTTEAMWIN',
  SECONDTEAMWIN = 'SECONDTEAMWIN',
  PLAYING = 'PLAYING'
}
export interface Card {
  faction: Team;
  revealed: boolean;
  word: string;
}

export interface GameData {
  id: string;
  name: string;
  board: Card[];
  gameState: GameState;
  currentTurn: Team.FIRSTTEAM | Team.SECONDTEAM;
  score: Score;
}

export interface Score {
  firstTeamScore: number;
  secondTeamScore: number;
}

import { PRNG } from '../PRNG/index'
import { dictionary } from '../data/codenames.json'

class CodenamesGame {
  private static NUM_CARDS: number = 25
  private static NUM_FIRSTTEAM_AGENTS: number = 9
  private static NUM_SECONDTEAM_AGENTS: number = 8
  private static NUM_BYSTANDERS: number = 7
  private static NUM_ASSASSINS: number = 1

  private id: string
  private name: string
  private prng: PRNG
  private board: Card[]
  private gameState: GameState
  private currentTurn: Team.FIRSTTEAM | Team.SECONDTEAM
  private score: Score

  public constructor(name: string) {
    this.prng = new PRNG()
    this.id = this.prng.getID()
    this.name = name
    this.setupGame()
  }

  private initializeBoard = (): Card[] => {
    const words = this.prng.getRandomNumberSet(0, dictionary.length - 1, CodenamesGame.NUM_CARDS)
    const agents = this.prng.getRandomNumberSet(0, CodenamesGame.NUM_CARDS - 1, CodenamesGame.NUM_CARDS)
    const board: Card[] = []

    agents.forEach((value, index): void => {
      if (index < CodenamesGame.NUM_FIRSTTEAM_AGENTS) {
        board[value] = {
          faction: Team.FIRSTTEAM,
          revealed: false,
          word: dictionary[words[index]]
        }
      } else if (index < CodenamesGame.NUM_FIRSTTEAM_AGENTS + CodenamesGame.NUM_SECONDTEAM_AGENTS) {
        board[value] = {
          faction: Team.SECONDTEAM,
          revealed: false,
          word: dictionary[words[index]]
        }
      } else if (index < CodenamesGame.NUM_FIRSTTEAM_AGENTS + CodenamesGame.NUM_SECONDTEAM_AGENTS + CodenamesGame.NUM_BYSTANDERS) {
        board[value] = {
          faction: Team.BYSTANDER,
          revealed: false,
          word: dictionary[words[index]]
        }
      } else if (index < CodenamesGame.NUM_FIRSTTEAM_AGENTS + CodenamesGame.NUM_SECONDTEAM_AGENTS + CodenamesGame.NUM_BYSTANDERS + CodenamesGame.NUM_ASSASSINS) {
        board[value] = {
          faction: Team.ASSASSIN,
          revealed: false,
          word: dictionary[words[index]]
        }
      }
    })

    return board
  }

  public setupGame = (): CodenamesGame => {
    this.board = this.initializeBoard()
    this.gameState = GameState.PLAYING
    this.currentTurn = Team.FIRSTTEAM
    this.score = {
      firstTeamScore: 0,
      secondTeamScore: 0
    }

    return this
  }

  public passTurn = (): CodenamesGame => {
    if (this.gameState !== GameState.PLAYING) {
      console.warn('The game is already finished')
      return this
    }

    if (this.currentTurn === Team.FIRSTTEAM) {
      this.currentTurn = Team.SECONDTEAM
    } else {
      this.currentTurn = Team.FIRSTTEAM
    }

    return this
  }

  public revealCard = (word: string): CodenamesGame => {
    if (this.gameState !== GameState.PLAYING) {
      console.warn('The game is already finished')
      return this
    }

    const index = this.board.findIndex((card): boolean => card.word === word)

    if (index === -1) {
      console.warn(`CodenamesGame.revealCard: Unable to find word ${word} in board.`)
      return this
    }

    const card = this.board[index]

    // Update the state of the board
    this.board = [
      ...this.board.slice(0, index),
      {
        ...card,
        revealed: true
      },
      ...this.board.slice(index + 1)
    ]

    // Update the score
    if (card.faction === Team.FIRSTTEAM) {
      this.score = {
        ...this.score,
        firstTeamScore: this.score.firstTeamScore + 1
      }

      this.currentTurn = Team.FIRSTTEAM
    } else if (card.faction === Team.SECONDTEAM) {
      this.score = {
        ...this.score,
        secondTeamScore: this.score.secondTeamScore + 1
      }

      this.currentTurn = Team.SECONDTEAM
    } else if (card.faction === Team.BYSTANDER) {
      this.passTurn()
    } else if (card.faction === Team.ASSASSIN) {
      this.gameState = this.currentTurn === Team.SECONDTEAM ? GameState.FIRSTTEAMWIN : GameState.SECONDTEAMWIN
    }

    // Update game state
    if (this.score.firstTeamScore === CodenamesGame.NUM_FIRSTTEAM_AGENTS) {
      this.gameState = GameState.FIRSTTEAMWIN
    } else if (this.score.secondTeamScore === CodenamesGame.NUM_SECONDTEAM_AGENTS) {
      this.gameState = GameState.SECONDTEAMWIN
    }

    return this
  }

  private getClientBoardState = (): Card[] => {
    return this.board.map((card): Card => {
      if (!card.revealed) {
        return {
          ...card,
          faction: Team.UNKNOWN
        }
      }

      return card
    })
  }

  public getState = (): GameData => {
    return {
      id: this.id,
      name: this.name,
      board: this.getClientBoardState(),
      gameState: this.gameState,
      currentTurn: this.currentTurn,
      score: this.score
    }
  }

  public getSpymasterState = (): GameData => {
    return {
      id: this.id,
      name: this.name,
      board: this.board,
      gameState: this.gameState,
      currentTurn: this.currentTurn,
      score: this.score
    }
  }
}

export {
  CodenamesGame,
}
