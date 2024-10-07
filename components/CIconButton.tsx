import { MouseEventHandler } from "react"

export default function CIconButton({
    src,
    className,
    onClick
}:{
    src: string,
    className?: string,
    onClick?: MouseEventHandler
}){
    return (
        <div className={` rounded-full bg-cblue p-3 cursor-pointer ${className}`} onClick={onClick}>
            <img src={src} className="w-full" />            
        </div>
    )
}