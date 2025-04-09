"use client"

import CButton from "@/components/CButton";
import CIconButton from "@/components/CIconButton";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const route = useRouter();
  const [roomID, setRoomID] = useState('');

  function generateRoomNumber() {
    let roomNumber = '';
    const characters = '0123456789';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      roomNumber += characters[randomIndex];
    }
    return roomNumber;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full px-4 md:px-0 md:w-2/3 flex flex-col items-center text-center">
        <div className="w-full md:w-3/5 text-5xl md:text-8xl font-extrabold inline-flex flex-wrap justify-center gap-x-4">
          <p className="text-cred">ROCK</p>
          <p className="text-cyellow">PAPER</p>
          <p className="text-cgreen">SCISSORS</p>
        </div>

        <div className="relative w-full max-w-xs mt-10">
          <img src="/images/icon/scissors.png" className="absolute z-20 -right-5 -top-5 w-1/4 md:w-3/12" />
          <CButton text="normal" className="bg-cnavy mt-8 mb-4 w-full py-4 md:py-6" onClick={() => route.push('/game/normal')} />
        </div>

        <CButton text="endless" className="bg-cnavy mb-4 w-full max-w-xs py-4 md:py-6" onClick={() => route.push('/game/endless')} />

        <div className="relative w-full max-w-xs mb-10">
          <img src="/images/icon/clown.png" className="absolute z-20 -left-10 -top-10 w-1/3 md:w-4/12" />
          <CButton text="leaderboard" className="absolute z-10 bg-cblue w-full text-lg md:text-2xl" onClick={() => route.push('/leaderboard')} />
        </div>
      </div>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-2xl md:text-3xl mb-4">Online mode</h3>
          <div className="flex flex-col md:flex-row w-full gap-4">
            <div className="card grid w-full md:w-1/2 flex-grow place-items-center">
              <input
                type="number"
                placeholder="room id"
                id="room_id"
                onChange={(e) => setRoomID(e.currentTarget.value)}
                className="input input-bordered input-md w-full mb-2"
              />
              <CButton text="join" className="bg-cgreen w-full text-base" onClick={() => route.push(`/game/online/${roomID}`)} />
            </div>

            <div className="divider md:divider-horizontal">OR</div>

            <div className="card grid w-full md:w-1/2 flex-grow place-items-center">
              <CButton
                text="create room"
                className="bg-cnavy w-full text-base"
                onClick={() => {
                  const newRoom = generateRoomNumber();
                  route.push(`/game/online/${newRoom}`);
                }}
              />
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}