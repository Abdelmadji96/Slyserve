import {mediaDevices} from 'react-native-webrtc';

export default class VideoCallClass {
  static async getStream(isFront) {
    //let isFront = true;
    const sourceInfos = await mediaDevices.enumerateDevices();
    console.log(sourceInfos);
    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
      if (
        sourceInfos[i].kind == 'videoinput' &&
        sourceInfos[i].facing == (isFront ? 'front' : 'environment')
      ) {
        videoSourceId = sourceInfos[i].deviceId;
      }
    }
    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: {
        height: {min: 480, ideal: 720, max: 1080},
        width: {min: 640, ideal: 1280, max: 1920},
        frameRate: 30,
        facingMode: isFront ? 'user' : 'environment',
        deviceId: videoSourceId,
      },
    });
    if (typeof stream != 'boolean') return stream;
    return null;
  }
}
