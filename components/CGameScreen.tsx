"use client";

import { useEffect, useRef, useState } from "react";
import CGameBar from "@/components/CGameBar";
import CameraController from "@/controllers/camera.controller";
import { GameController } from "@/controllers/game.controller";
import { ModeEnum } from "@/models/mode.enum";
import { MoveEnum } from "@/models/move.enum";
import { io, Socket } from 'socket.io-client';

type Mode = ModeEnum.NORMAL | ModeEnum.ENDLESS | ModeEnum.ONLINE;

export default function CGameScreen({ mode }: { mode: Mode }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const cameraController = new CameraController();
    const gameController = useRef(new GameController(9, 5, mode));
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [countdown, setCountdown] = useState<number>(5);
    const [currentRound, setCurrentRound] = useState<number>(1);
    const [hearts, setHearts] = useState<number>(3); // For endless mode hearts
    const [userMove, setUserMove] = useState<MoveEnum | null>(null); // Track user's move

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

    const socket = useSocket('http://192.168.0.103:5000');

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
        if (socket) {
            socket.on('image_classification', (data: { classification: string }) => {
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
                socket.off('image_classification');
            };
        }
    }, [socket]);

    // Capture and send the video frame as base64 to the server
    useEffect(() => {
        if (socket && videoRef.current) {
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
            
                    // Emit the base64-encoded image data to the server via socket
                    socket.emit("upload_image", { image: imageData });
                }
            };

            // Capture and send frames at regular intervals (every 1 second)
            const frameInterval = setInterval(captureAndSendFrame, 1000);

            return () => clearInterval(frameInterval); // Cleanup on unmount
        }
    }, [socket, videoRef]);

    useEffect(() => {
        if (currentRound < 5) {
            if (countdown > 0) {
                const timer = setTimeout(() => {
                    setCountdown(countdown - 1);
                }, 1000);
                return () => clearTimeout(timer);
            } else {
                // Handle end of round logic
                let player1Move: MoveEnum;

                if (userMove) {
                    player1Move = userMove; // Use the user's move if available
                } else {
                    player1Move = gameController.current.randomPlayerMove(); // Random move if none selected
                }

                const player2Move = gameController.current.randomBotMove(); // Get bot's move
                gameController.current.gameResult(player1Move, player2Move);
                setScore(); // Update scores
                setHearts(gameController.current.hearts); // Update hearts
                setCountdown(5); // Reset countdown
                setCurrentRound(gameController.current.currentRound); // Update current round
                setUserMove(null); // Reset user move for the next round
                setCurrentRound(currentRound + 1);
            }
        }
    }, [countdown, userMove]); // Add userMove to dependencies

    function setScore() {
        setPlayer1Score(gameController.current.player1Score);
        setPlayer2Score(gameController.current.player2Score);
    }

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
                <img src="/images/rabbit/rabbit_ready.png" style={{ width: '100%' }} />
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
            {currentRound < 5 &&
                <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl">{countdown}</p>
            }
            <div className="absolute bottom-5 right-5 w-64 h-64 rounded">
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover rounded"></video>
            </div>
            {mode === ModeEnum.ENDLESS && (
                <div>
                    <p>Hearts: {hearts}</p>
                </div>
            )}
        </div>
    );
}
