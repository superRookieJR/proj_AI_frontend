"use client";

import { useEffect, useRef, useState } from "react";
import CGameBar from "@/components/CGameBar";
import CameraController from "@/controllers/camera.controller";
import { GameController } from "@/controllers/game.controller";
import { ModeEnum } from "@/models/mode.enum";
import { MoveEnum } from "@/models/move.enum";
import { io, Socket } from 'socket.io-client';
import CButton from "./CButton";
import { useRouter } from "next/navigation";
import axios from 'axios';

type Mode = ModeEnum.NORMAL | ModeEnum.ENDLESS | ModeEnum.ONLINE;

export default function CGameScreen({
    mode,
} : { 
    mode: Mode,
}) {
    const route = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const cameraController = new CameraController();
    const gameController = useRef(new GameController(9, 5, mode));
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [countdown, setCountdown] = useState<number>(5);
    const [currentRound, setCurrentRound] = useState<number>(1);
    const [hearts, setHearts] = useState<number>(3); // For endless mode hearts
    const [userMove, setUserMove] = useState<MoveEnum | null>(null); // Track user's move
    const [botMove, setBotMove] = useState<MoveEnum | null>(null);
    const [endGmae, setEndGame] = useState(false)
    const [isWaiting, setIsWaiting] = useState(true); // New state for waiting screen
    const [userName, setUsername] = useState('')

    function useSocket(serverPath: string){
        const [socket, setSocket] = useState<Socket>();

        useEffect(() => {
        // Connect to the Socket.IO server
            const socketIo = io(serverPath);

            setSocket(socketIo);

            // Cleanup on unmount
            return () => {
                if (socketIo) socketIo.disconnect();
            };
        }, [serverPath]);

        return socket;
    };

    const socketModel = useSocket('http://10.107.5.42:5000');

    useEffect(() => {
        const initializeCamera = async () => {
            await cameraController.openCamera(videoRef);
        };

        initializeCamera();

        if (mode === ModeEnum.ENDLESS) {
            setHearts(gameController.current.hearts);
        }
    }, []);

    useEffect(() => {
        if (socketModel) {
            socketModel.on('image_classification', (data: { classification: string }) => {
                // Update the user's move based on the classification received
                
                const preData = data.classification

                if(data.classification == '0'){
                    setUserMove(MoveEnum.PAPER)
                }else if(data.classification == '1'){
                    setUserMove(MoveEnum.ROCK)   
                }else if(data.classification == '2'){
                    setUserMove(MoveEnum.SCRISSORS)
                }
            });

            // Cleanup the listener on unmount
            return () => {
                socketModel.off('image_classification');
            };
        }
    }, [socketModel]);

    // Capture and send the video frame as base64 to the server
    useEffect(() => {
        if (socketModel && videoRef.current) {
            const video = videoRef.current;

            const captureAndSendFrame = () => {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                if (context && video) {
                    // Set the canvas to the video's dimensions
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
            
                    // Draw the current video frame onto the canvas
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
                    // Convert the canvas to a base64-encoded image (PNG format)
                    let imageData = canvas.toDataURL("image/png");
            
                    // Remove the 'data:image/png;base64,' part of the base64 string
                    imageData = imageData.replace(/^data:image\/png;base64,/, '');
            
                    // Emit the base64-encoded image data to the server via socketModel
                    socketModel.emit("upload_image", { image: imageData });
                }
            };

            // Capture and send frames at regular intervals (every 1 second)
            const frameInterval = setInterval(captureAndSendFrame, 1000);

            return () => clearInterval(frameInterval); // Cleanup on unmount
        }
    }, [socketModel, videoRef]);

    useEffect(() => {
        if ((mode === ModeEnum.NORMAL || mode === ModeEnum.ONLINE) ? currentRound < 5 : hearts != 0) {
            if (countdown > 0) {
                const timer = setTimeout(() => {
                    setCountdown(countdown - 1);
                }, 1000);
                return () => clearTimeout(timer);
            } else {
                // Handle end of round logic
                const player1Move = gameController.current.randomBotMove(); // Get bot's move

                setBotMove(player1Move)

                let player2Move: MoveEnum;

                if (userMove) {
                    player2Move = userMove; // Use the user's move if available
                } else {
                    player2Move = gameController.current.randomPlayerMove(); // Random move if none selected
                }

                gameController.current.gameResult(player1Move, player2Move);
                setScore(); // Update scores
                setHearts(gameController.current.hearts); // Update hearts
                setCountdown(5); // Reset countdown
                setCurrentRound(gameController.current.currentRound); // Update current round
                setUserMove(null); // Reset user move for the next rousnd
                setCurrentRound(currentRound + 1);
            }
        }else if(mode == ModeEnum.NORMAL ? currentRound == 5 : hearts == 0)  {
            (document.getElementById('my_modal_1')  as HTMLDialogElement)!.showModal()
            setEndGame(true)
        }
    }, [countdown, userMove]); // Add userMove to dependencies

    function newGmae(){
        (document.getElementById('my_modal_1')  as HTMLDialogElement)!.close()
        setBotMove(null)
        setUserMove(null)
        gameController.current.player1Score = 0
        gameController.current.player2Score = 0
        setScore(); // Update scores
        setHearts(gameController.current.hearts); // Update hearts
        setBotMove(null); // Update hearts
        setCountdown(5); // Reset countdown
        setUserMove(null); // Reset user move for the next round
        setCurrentRound(1);
        gameController.current.hearts = 3
    }

    function setScore() {
        setPlayer1Score(gameController.current.player1Score);
        setPlayer2Score(gameController.current.player2Score);
    }

   async function saveScore(){
        await axios.post(mode == ModeEnum.NORMAL ? 'http://10.107.1.111:3001/score/normal' : 'http://10.107.1.111:3001/score/endless', {
            username: userName,
            score: gameController.current.player2Score,
        })
   };

    return (
        <div>
            <CGameBar 
                player1Score={player1Score} 
                player2Score={player2Score} 
                player1Name="BOT"
                player2Name="USER"
                currentRound={currentRound}
            />
            <div className="absolute w-2/5 bottom-0 left-1/2 -translate-x-1/2">
                {botMove === null &&
                    <img src="/images/rabbit/rabbit_ready.png" style={{ width: '100%' }} />
                }
                {botMove === MoveEnum.SCRISSORS &&
                    <img src="/images/rabbit/rabbit_scissors.png" style={{ width: '100%' }} />
                }
                {botMove === MoveEnum.ROCK &&
                    <img src="/images/rabbit/rabbit_rock.png" style={{ width: '100%' }} />
                }
                {botMove === MoveEnum.PAPER &&
                    <img src="/images/rabbit/rabbit_normalFace_paper.png" style={{ width: '100%' }} />
                }
            </div>
            <div className="absolute w-1/5 bottom-0 left-1/2 -translate-x-1/2">
                {userMove === MoveEnum.SCRISSORS &&
                    <img src="/images/hand/hand_scissors.png" style={{ width: '60%' }} />
                }
                {userMove === MoveEnum.ROCK &&
                    <img src="/images/hand/hand_rock.png" style={{ width: '60%' }} />
                }
                {userMove === MoveEnum.PAPER &&
                    <img src="/images/hand/hand_paper.png" style={{ width: '60%' }} />
                }
            </div>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box text-center">
                    {/* <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form> */}
                    <p className="font-bold text-3xl">{gameController.current.player1Score > gameController.current.player2Score ? "Game Over" : "You Won"}</p>
                    <p className="font-bold text-8xl text-cblue-light">{gameController.current.player2Score}</p>
                    <div className="flex w-full mt-5">
                        <div className="card grid w-1/2 flex-grow place-items-center">
                            <CButton text="Play Again" className=" bg-cgreen w-full text-base" onClick={(e) => {
                                newGmae()
                                setEndGame(false)
                            }} />
                        </div>
                        <div className="divider divider-horizontal">OR</div>
                        <div className="card grid w-1/2 flex-grow place-items-center">
                            <CButton text="Exit" className=" bg-cred w-full text-base" onClick={(e) => route.push('/')} />
                        </div>
                    </div>
                    <div className="flex w-full mt-5">
                    <div className="card grid w-1/2 flex-grow place-items-center">
                        <input type="text" placeholder="username" onChange={(e) => setUsername(e.currentTarget.value)} className="input input-bordered input-md w-full mb-2" />    
                        <div className="card grid w-1/2 flex-grow place-items-center mt-2">
                            <CButton text="save" className=" bg-cnavy w-full text-base" onClick={(e) => {
                                saveScore()
                                route.push('/')
                            }} />
                        </div>
                    </div>
                    </div>
                </div>
            </dialog>
            {currentRound < 5 &&
                <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl">{countdown}</p>
            }
            <div className="absolute bottom-5 right-5 w-64 h-64 rounded">
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover rounded"></video>
            </div>
            {mode === ModeEnum.ENDLESS && (
                <div className="absolute top-44 left-1/2 -translate-x-1/2 inline-flex justify-center gap-x-2">
                    {
                        Array.from({length: hearts}).map((num, index) => <img key={index} src="/icons/heart.png" className="w-1/12" />)
                    }
                </div>
            )}
        </div>
    );
}
