import { ModeEnum } from "@/models/mode.enum";
import { MoveEnum } from "@/models/move.enum";
import { ResultEnum } from "@/models/result.enum";

type Move = MoveEnum.ROCK | MoveEnum.PAPER | MoveEnum.SCRISSORS;
type Mode = ModeEnum.NORMAL | ModeEnum.ENDLESS | ModeEnum.ONLINE
type Result = ResultEnum.WIN | ResultEnum.LOSE | ResultEnum.DRAW

export class GameController{
    round: number = 0;
    currentRound: number = 1;
    player1Score: number = 0;
    player2Score: number = 0;
    countdown: number = 0;
    timer!: NodeJS.Timeout;
    mode: Mode = ModeEnum.NORMAL;
    hearts: number = 3; // Player starts with 3 hearts
    winStreak: number = 0; // To track winning streaks

    constructor(round: number, countdown: number, mode: Mode){
        this.round = round;
        this.countdown = countdown;
        this.mode = mode
    }

    gameResult(player1Move: Move, player2Move: Move) {
        const result = this.determineWinner(player1Move, player2Move);
        if (result === ResultEnum.WIN){
            this.player2Score++
        }else if(result === ResultEnum.LOSE){
            this.player1Score++
            this.hearts--
            console.log(this.hearts)
        };
    }

    randomPlayerMove(): Move {
        const moves: Move[] = [MoveEnum.ROCK, MoveEnum.PAPER, MoveEnum.SCRISSORS];
        const randomIndex = Math.floor(Math.random() * moves.length);
        return moves[randomIndex];
    }

    randomBotMove(): Move {
        const moves: Move[] = [MoveEnum.ROCK, MoveEnum.PAPER, MoveEnum.SCRISSORS];
        const randomIndex = Math.floor(Math.random() * moves.length);
        return moves[randomIndex];
    }

    determineWinner(botMove: Move, playerMove: Move): Result {
        if (playerMove === botMove){
            console.log("DRAW")
            return ResultEnum.DRAW
        }else{
            console.log("NOT_DRAW")
            switch(playerMove){
                case MoveEnum.PAPER: if(botMove === MoveEnum.ROCK) return ResultEnum.WIN; else return ResultEnum.LOSE
                case MoveEnum.ROCK: if(botMove === MoveEnum.SCRISSORS) return ResultEnum.WIN; else return ResultEnum.LOSE
                case MoveEnum.SCRISSORS: if(botMove === MoveEnum.PAPER) return ResultEnum.WIN; else return ResultEnum.LOSE
            }
        }
    }
}