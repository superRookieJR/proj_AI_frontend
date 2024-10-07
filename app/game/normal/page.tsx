import CGameScreen from "@/components/CGameScreen";
import { ModeEnum } from "@/models/mode.enum";

export default function Normal(){
    return <CGameScreen mode={ModeEnum.NORMAL}></CGameScreen>
}