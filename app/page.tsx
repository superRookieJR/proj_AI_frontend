"use client"

import { useRouter } from "next/navigation";

export default function Home() {
  const route = useRouter();

  return (
    <div>
      <div className=" absolute w-2/3 flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <img src="/images/title.svg" width="50%" className="mx-auto mb-10" />
        <img src="/images/normal_button.svg" width="30%" className="mx-auto mb-5 cursor-pointer button_custom" />
        <img src="/images/endless_button.svg" width="30%" className="mx-auto cursor-pointer button_custom" />
      </div>
      <div className=" absolute bottom-5 left-5">
        <img src="/images/leaderboard_button.svg" width="60%" className="cursor-pointer button_custom" onClick={() => route.push('/leaderboard')} />
      </div>
    </div>
  );
}