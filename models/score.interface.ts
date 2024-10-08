interface UserData{
    username: string,
    score: number
}

export default interface ScoreInterface{
    normal: UserData[];
    endless: UserData[]
}