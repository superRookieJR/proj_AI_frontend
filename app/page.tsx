"use client"

import CButton from "@/components/CButton";
import CIconButton from "@/components/CIconButton";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const route = useRouter();
  const [onlineMode, setOnlineMode] = useState(0)

  return (
    <div>
      <div className=" absolute w-2/3 flex flex-col items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className=" w-3/5 text-8xl font-extrabold inline-flex flex-wrap justify-center gap-x-5">
          <p className="text-cred">ROCK</p>
          <p className="text-cyellow">PAPER</p>
          <p className="text-cgreen">SCRISSORS</p>
        </div>
        <div className="relative w-3/12">
          <img src="/images/icon/scissors.png" className="absolute z-20 -right-8 -top8 w-3/12"/>
          <CButton text="normal" className=" bg-cnavy mt-8 mb-4 w-full py-6" onClick={(e) => route.push('/game/normal')} />
        </div>
        <CButton text="endless" className=" bg-cnavy mb-4 w-3/12 py-6" onClick={(e) => route.push('/game/endless')} />
        <div className="relative w-3/12">
          <img src="/images/icon/clown.png" className="absolute z-20 -left-12 -top-14 w-4/12"/>
          <CButton text="leaderboard" className="absolute z-10 bg-cblue w-full" onClick={(e) => route.push('/game/online/test')} />
        </div>
      </div>
      <div className=" absolute top-5 right-5">
        <CIconButton src="/icons/network.png" className="w-5/6" onClick={(e) => (document.getElementById('my_modal_1')  as HTMLDialogElement)!.showModal()} />
      </div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-3xl">Online mode</h3>
          <div className="flex w-full">
            <div className="card grid w-1/2 flex-grow place-items-center">
              <input type="number" placeholder="room id" className="input input-bordered input-md w-full mb-2" />
              <CButton text="join" className=" bg-cgreen w-full text-base" onClick={(e) => route.push('/game/endless')} />
            </div>
            <div className="divider divider-horizontal">OR</div>
            <div className="card grid w-1/2 flex-grow place-items-center">
              <CButton text="create room" className=" bg-cnavy w-full text-base" onClick={(e) => route.push('/game/endless')} />
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}