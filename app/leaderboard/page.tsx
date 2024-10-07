"use client"

import ScoreInterface from "@/models/score.interface";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Normal(){
    const [tab, setTab] = useState<0 | 1 | 2>(0);
    const [data, setData] = useState<ScoreInterface[]>([]);
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
            <div className=" absolute w-2/3 flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className=" text-8xl font-extrabold text-neutral">LEADERBOARD</p>
                {!isLoading &&
                    <>
                        <div role="tablist" className=" w-3/5 mx-auto tabs tabs-boxed">
                            <a role="tab" className={tab == 0 ? "tab tab-active" : "tab"} onClick={(e) => setTab(0)}>online</a>
                            <a role="tab" className={tab == 1 ? "tab tab-active" : "tab"} onClick={(e) => setTab(1)}>normal</a>
                            <a role="tab" className={tab == 2 ? "tab tab-active" : "tab"} onClick={(e) => setTab(2)}>endless</a>
                        </div>
                        <table className=" w-3/5 mx-auto p-16 bg-secondary text-center mt-3">
                            <tr className=" font-extrabold text-lg bg-accent rounded-lg">
                                <td></td>
                                <td>No</td>
                                <td>Username</td>
                                <td>Score</td>
                            </tr>
                            {data && data.map((item, index) => (
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
                    </>
                }
                {isLoading &&
                    <p className="rounded-xl text-3xl font-extrabold text-primary mt-8">Loading...</p>
                }
            </div>
            <div className=" absolute bottom-5 left-5">
                <p className=" w-fit p-4 rounded-xl text-2xl font-extrabold text-white bg-accent button_custom cursor-pointer" onClick={(e) => route.back()}>BACK</p>
            </div>
        </div>
    )
}