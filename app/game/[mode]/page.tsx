export default function Page({params}){
    const mode = params.mode

    return(
        <div>
            {mode}
            <div>
                <div className="absolute w-2/3 left-1/2 -translate-x-1/2 inline-flex justify-between bg-orange-300">
                    <div className="p-3">
                        <div>star</div>
                        <div>AI</div>
                    </div>
                    <div className="p-3">
                        <div>star</div>
                        <div>USERNAME</div>
                    </div>
                </div>
                <div className="absolute w-1/6 left-1/2 -translate-x-1/2 p-5 text-center bg-green-400">
                    <p>ROUND</p>
                    <p>1</p>
                </div>
            </div>
        </div>
    )
}