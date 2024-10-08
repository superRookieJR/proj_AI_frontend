// "use client"

// import { useEffect, useRef, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import CGameBar from "@/components/CGameBar";
// import CameraController from "@/controllers/camera.controller";
// import { GameController } from "@/controllers/game.controller";
// import { ModeEnum } from "@/models/mode.enum";
// import { MoveEnum } from "@/models/move.enum";
// import CButton from "./CButton";
// import { useRouter } from "next/navigation";

// interface Players{
//     player: number,
//     username: string,
//     score: number
// }

// export default function CGameOnlineScreen({
//   roomId,
//   username
// }: {
//   roomId: string;
//   username: string;
// }) {
//   const route = useRouter();
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const cameraController = new CameraController();
//   const gameController = useRef(new GameController(9, 5, ModeEnum.ONLINE));
//   const [countdown, setCountdown] = useState<number>(5);
//   const [currentRound, setCurrentRound] = useState<number>(1);
//   const [user1Move, setUser1Move] = useState<MoveEnum | null>(null);
//   const [user2Move, setUser2Move] = useState<MoveEnum | null>(null);
//   const [isWaiting, setIsWaiting] = useState(true); 
//   const [endGame, setEndGame] = useState(false);
//   const [player1Name, setPlayer1Name] = useState<string>();
//   const [player2Name, setPlayer2Name] = useState<string>();
//   const [player1Score, setPlayer1Score] = useState<number>(0);
//   const [player2Score, setPlayer2Score] = useState<number>(0);
//   const [isFirst, setIsFirst] = useState(false);
  
//   function useSocket(serverPath: string){
//         const [socket, setSocket] = useState<Socket>();

//         useEffect(() => {
//         // Connect to the Socket.IO server
//             const socketIo = io(serverPath);

//             setSocket(socketIo);

//             // Cleanup on unmount
//             return () => {
//                 if (socketIo) socketIo.disconnect();
//             };
//         }, [serverPath]);

//         return socket;
//     };

//   const socketIo = useSocket('http://172.20.10.4:3001');
//   const socketModel = useSocket('http://172.20.10.4:5001');

//   const checkIsRoomCorrect = (room_id: string): boolean => {
//     return roomId == room_id
//   }

//   useEffect(() => {
//     if(socketIo){
//         socketIo.emit("joinRoom", roomId, username);

//         socketIo.on("syncPlayer", (room_id, object) => {
//             if(checkIsRoomCorrect(room_id)){
//                 setPlayer1Name(object[0].username)
//                 setPlayer2Name(object[1].username)
//                 setPlayer1Score(object[0].score)
//                 setPlayer2Score(object[1].score)
//                 console.log("yeah")
//             }
//         })

//         socketIo.on("isFirst", (room_id, bool) => {
//             if(checkIsRoomCorrect(room_id)){
//                 setIsFirst(bool)
//             }
//         })

        
//         socketIo.on("startGame", (room_id) => {
//             if(checkIsRoomCorrect(room_id)){
//                 setIsWaiting(false)
//             }
//         })
//     }
//     // });
//   }, [socketIo]);

//   useEffect(() => {
//     const initializeCamera = async () => {
//       await cameraController.openCamera(videoRef);
//     };

//     initializeCamera();
//   }, []);

//   useEffect(() => {
//     if (socketModel) {
//         socketModel.on('image_classification', (data: { classification: string }) => {
//             // Update the user's move based on the classification received
            
//             const preData = data.classification

//             if(data.classification == '0'){
//                 isFirst ? setUser1Move(MoveEnum.PAPER) : setUser1Move(MoveEnum.PAPER)
//             }else if(data.classification == '1'){
//                 isFirst ? setUser1Move(MoveEnum.ROCK) : setUser1Move(MoveEnum.ROCK)
//             }else if(data.classification == '2'){
//                 isFirst ? setUser1Move(MoveEnum.SCRISSORS) : setUser1Move(MoveEnum.SCRISSORS)
//             }
//         });

//         // Cleanup the listener on unmount
//         return () => {
//             socketModel.off('image_classification');
//         };
//     }
// }, [socketModel]);

// // Capture and send the video frame as base64 to the server
// useEffect(() => {
//     if (socketModel && videoRef.current) {
//         const video = videoRef.current;

//         const captureAndSendFrame = () => {
//             const canvas = document.createElement("canvas");
//             const context = canvas.getContext("2d");

//             if (context && video) {
//                 // Set the canvas to the video's dimensions
//                 canvas.width = video.videoWidth;
//                 canvas.height = video.videoHeight;
        
//                 // Draw the current video frame onto the canvas
//                 context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
//                 // Convert the canvas to a base64-encoded image (PNG format)
//                 let imageData = canvas.toDataURL("image/png");
        
//                 // Remove the 'data:image/png;base64,' part of the base64 string
//                 imageData = imageData.replace(/^data:image\/png;base64,/, '');
        
//                 // Emit the base64-encoded image data to the server via socketModel
//                 socketModel.emit("upload_image", { image: imageData });
//             }
//         };

//         // Capture and send frames at regular intervals (every 1 second)
//         const frameInterval = setInterval(captureAndSendFrame, 1000);

//         return () => clearInterval(frameInterval); // Cleanup on unmount
//     }
// }, [socketModel, videoRef]);









// useEffect(() => {
//     if (currentRound < 5) {
//         if (countdown > 0) {
//             const timer = setTimeout(() => {
//                 setCountdown(countdown - 1);
//             }, 1000);
//             return () => clearTimeout(timer);
//         } else {
//             isFirst ? setUser1Move(user1Move ? user1Move : gameController.current.randomPlayerMove()) : setUser2Move(user2Move ? user2Move : gameController.current.randomPlayerMove())
            
//             if(isFirst){
//                 socketIo?.emit("firstPlayerMove", user1Move?.toString)
//             }else{
//                 socketIo?.emit("firstPlayerMove", user2Move?.toString)
//             }

            

//             gameController.current.gameResult(user1Move, user2Move);
//             setScore(); // Update scores
//             setBotMove(null); // Update hearts
//             setCountdown(5); // Reset countdown
//             setCurrentRound(gameController.current.currentRound); // Update current round
//             setUserMove(null); // Reset user move for the next rousnd
//             setCurrentRound(currentRound + 1);
//         }
//     }else if(currentRound == 5){
//         (document.getElementById('my_modal_1')  as HTMLDialogElement)!.showModal()
//         setEndGame(true)
//     }
// }, [countdown]); // Add userMove to dependencies

// function newGmae(){
//     (document.getElementById('my_modal_1')  as HTMLDialogElement)!.close()
//     setBotMove(null)
//     setUserMove(null)
//     gameController.current.player1Score = 0
//     gameController.current.player2Score = 0
//     setScore(); // Update scores
//     setHearts(gameController.current.hearts); // Update hearts
//     setBotMove(null); // Update hearts
//     setCountdown(5); // Reset countdown
//     setUserMove(null); // Reset user move for the next round
//     setCurrentRound(1);
//     gameController.current.hearts = 3
// }

// function setScore() {
//     setPlayer1Score(gameController.current.player1Score);
//     setPlayer2Score(gameController.current.player2Score);
// }











//   return isWaiting ? (<div><p>Waiting for other player...</p></div>) : (
//     <div>
//         <CGameBar 
//             player1Score={player1Score} 
//             player2Score={player2Score} 
//             player1Name={player1Name?? "Null"}
//             player2Name={player2Name?? "Null"}
//             currentRound={currentRound}
//         />
//         {/* <div className="absolute w-2/5 bottom-0 left-1/2 -translate-x-1/2">
//             {botMove === null &&
//                 <img src="/images/rabbit/rabbit_ready.png" style={{ width: '100%' }} />
//             }
//             {botMove === MoveEnum.SCRISSORS &&
//                 <img src="/images/rabbit/rabbit_scissors.png" style={{ width: '60%' }} />
//             }
//             {botMove === MoveEnum.ROCK &&
//                 <img src="/images/rabbit/rabbit_rock.png" style={{ width: '60%' }} />
//             }
//             {botMove === MoveEnum.PAPER &&
//                 <img src="/images/rabbit/rabbit_normalFace_paper.png" style={{ width: '60%' }} />
//             }
//         </div> */}
//         <div className="absolute w-1/5 bottom-0 left-1/2 -translate-x-1/2">
//             {user1Move === MoveEnum.SCRISSORS &&
//                 <img src="/images/hand/hand_scissors.png" style={{ width: '60%' }} />
//             }
//             {user1Move === MoveEnum.ROCK &&
//                 <img src="/images/hand/hand_rock.png" style={{ width: '60%' }} />
//             }
//             {user1Move === MoveEnum.PAPER &&
//                 <img src="/images/hand/hand_paper.png" style={{ width: '60%' }} />
//             }
//         </div>
//         <dialog id="my_modal_1" className="modal">
//             <div className="modal-box text-center">
//                 {/* <form method="dialog">
//                     <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
//                 </form> */}
//                 <p className="font-bold text-3xl">{gameController.current.player1Score > gameController.current.player2Score ? "Game Over" : "You Won"}</p>
//                 <p className="font-bold text-8xl text-cblue-light">{gameController.current.player2Score}</p>
//                 <div className="flex w-full mt-5">
//                     <div className="card grid w-full flex-grow place-items-center">
//                         <CButton text="Exit" className=" bg-cred w-full text-base" onClick={(e) => route.push('/')} />
//                     </div>
//                 </div>
//             </div>
//         </dialog>
//         {currentRound < 5 &&
//             <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl">{countdown}</p>
//         }
//         <div className="absolute bottom-5 right-5 w-64 h-64 rounded">
//             <video ref={videoRef} autoPlay muted className="w-full h-full object-cover rounded"></video>
//         </div>
//     </div>
//     )
// };
