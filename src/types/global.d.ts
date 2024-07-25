
declare global {
  interface Window {
    socket: any;
    peer:any;
  }

  interface Navigator {
    // getUserMedia?: (constraints: MediaStreamConstraints, successCallback: (stream: MediaStream) => void, errorCallback: (error: any) => void) => void;
    // webkitGetUserMedia?: (constraints: MediaStreamConstraints, successCallback: (stream: MediaStream) => void, errorCallback: (error: any) => void) => void;
    // mozGetUserMedia?: (constraints: MediaStreamConstraints, successCallback: (stream: MediaStream) => void, errorCallback: (error: any) => void) => void;
    // msGetUserMedia?: (constraints: MediaStreamConstraints, successCallback: (stream: MediaStream) => void, errorCallback: (error: any) => void) => void;
  }
}
