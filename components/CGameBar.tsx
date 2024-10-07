export default function CGameBar({
    player1Score,
    player1Name,
    player2Score,
    player2Name,
    currentRound
}: {
    player1Score: number | 0,
    player1Name: string,
    player2Score: number | 0,
    player2Name: string,
    currentRound: number | 0,
}){
    return(
        <div>
            <div className="absolute w-2/3 h-36 left-1/2 top-4 -translate-x-1/2 inline-flex justify-between items-center rounded-full z-40">
                <button className="btn btn-circle mr-2">
                    <p className="text-white font-bold text-xs">restart</p>
                </button>
                <div className="p-1 inline-flex justify-start w-1/2 h-1/2 bg-cred rounded-full">
                    <img src="/images/bot_profile.svg" className=" rounded-full aspect-square object-cover" />
                    <div className="text-start flex flex-col justify-center ml-4 text-white">
                        <p className="text-sm">{player1Score}</p>
                        <p className="text-sm">{player1Name}</p>
                    </div>
                </div>
                <div className="p-1 inline-flex justify-end w-1/2 h-1/2 bg-cblue rounded-full">
                    <div className="text-end flex flex-col justify-center mr-4 text-white">
                        <p className="text-sm">{player2Score}</p>
                        <p className="text-sm">{player2Name}</p>
                    </div>
                    <img src="/favicon.ico" className="rounded-full aspect-square object-cover" />
                </div>
                <button className="btn btn-circle ml-2">
                    <p className="text-white font-bold text-xs">menu</p>
                </button>
            </div>
            <div className="absolute w-36 h-36 left-1/2 top-4 -translate-x-1/2 p-5 text-center font-extrabold rounded-full bg-cyellow text-white z-50">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <p className="text-md">ROUND</p>
                    <p className="text-4xl">{currentRound}</p>
                    <p className="text-md text-cnavy">NORMAL</p>
                </div>
            </div>
        </div>
    )
}