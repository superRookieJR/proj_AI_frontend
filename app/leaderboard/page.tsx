"use client"

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Normal(){
    interface ScoreData {
        username: string;
        score: number;
    }

    const [data, setData] = useState<ScoreData[]>([]);
    const [isLoading, setLoading] = useState(true);
    const route = useRouter();

    useEffect(() => {
        fetch('https://proj-ai-backend.onrender.com/score/topscore')
        .then((response) => response.json())
        .then((data) => {
            setData(data.data);
            setLoading(false)
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            setLoading(false)
        });
    }, []);

    return(
        <div>
            <div className=" absolute w-2/3 flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <img src="/images/leaderboard_title.svg" width="50%" className="mx-auto mb-5" />
                <div className={isLoading ? "mx-auto leaderboard_board leaderboard_board_loading" : "mx-auto leaderboard_board leaderboard_board_empty"}>
                    <table className="w-full text-center mt-8">
                        <tr className=" font-extrabold text-lg">
                            <td></td>
                            <td>No</td>
                            <td>Username</td>
                            <td>Score</td>
                        </tr>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    {index <= 2 && <img src={index == 0 ? "/images/first_medal.svg" : index == 1 ? "/images/second_medal.svg" : index == 2 ? "/images/third_medal.svg" : ""} width={30} className="mx-auto" />}
                                </td>
                                <td>{index + 1}</td>
                                <td>{item.username}</td>
                                <td>{item.score}</td>
                            </tr>
                        ))}
                    </table>
                    {/* <img src={isLoading ? "/images/leaderboard_loading_board.svg" : "/images/leaderboard_empty_board.svg"} width="100%" className="mx-auto" /> */}
                </div>
            </div>
            <div className=" absolute bottom-5 left-5">
                <img src="/images/back_button.svg" width="60%" className="cursor-pointer button_custom" onClick={() => route.push('/')} />
            </div>
        </div>
    )
}