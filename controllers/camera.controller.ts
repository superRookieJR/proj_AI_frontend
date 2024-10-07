import { RefObject } from "react";

export default class CameraController {
    openCamera = async (videoRef: RefObject<HTMLVideoElement>) => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing the camera:", error);
                alert("Unable to access the camera");
            }
        } else {
            alert("Your browser does not support camera access");
        }
    }
}
