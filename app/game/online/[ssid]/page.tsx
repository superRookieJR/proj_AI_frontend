export default function Page({
    params
} : { params: { ssid: string } }) {
    return <div>{params.ssid}</div>
}