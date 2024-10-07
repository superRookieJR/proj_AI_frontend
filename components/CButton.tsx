import { ThemeColors } from "@nextui-org/react"
import { MouseEventHandler } from "react"

export default function CButton({
    text,
    className,
    onClick
}:{
    text: string,
    className?: string,
    onClick?: MouseEventHandler
    
}){
    return (
        <div
            className={`px-10 py-4 rounded-md text-4xl text-white cursor-pointer text-center ${className}`}
            onClick={onClick}
        >
            <p>{text}</p>
        </div>
    )
}