
declare global {
  interface Window {
    hmSend: any; // 或者根据实际情况指定正确的类型
  }
  interface Navigator {
    // getUserMedia?: (constraints: MediaStreamConstraints, successCallback: (stream: MediaStream) => void, errorCallback: (error: any) => void) => void;
    // webkitGetUserMedia?: (constraints: MediaStreamConstraints, successCallback: (stream: MediaStream) => void, errorCallback: (error: any) => void) => void;
    // mozGetUserMedia?: (constraints: MediaStreamConstraints, successCallback: (stream: MediaStream) => void, errorCallback: (error: any) => void) => void;
    // msGetUserMedia?: (constraints: MediaStreamConstraints, successCallback: (stream: MediaStream) => void, errorCallback: (error: any) => void) => void;
  }
}
