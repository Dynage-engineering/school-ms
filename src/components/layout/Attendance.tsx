import { useAllCourses, useUserData } from "@/lib/utils";
import type { UsersRecord } from "@/services/backend/pbTypes";
import { useState, useRef, useEffect } from "react";

export function Attendance() {
  const userData = useUserData() as UsersRecord | null;
  const allCourses = useAllCourses();
  const filteredCourses = allCourses?.items.filter((course) =>
    userData?.courses.includes(course.id)
  );

  // State & refs for capturing image
  const [capturing, setCapturing] = useState(false);
  const [marked, setMarked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [faceapi, setFaceapi] = useState<any>(null);

  // Dynamically import face-api.js on component mount in the browser
  useEffect(() => {
    (async () => {
      const module = await import("face-api.js");
      console.log(module);
      setFaceapi(module);
      // Load models once face-api is loaded
      const modelUrl = "/models";
      await module.nets.ssdMobilenetv1.loadFromUri(modelUrl);
      await module.nets.faceLandmark68Net.loadFromUri(modelUrl);
      await module.nets.faceRecognitionNet.loadFromUri(modelUrl);
    })();
  }, []);

  // Open webcam stream
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCapturing(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera.");
    }
  };

  // Capture a frame from the video and compare against the avatar
  const captureAndCompare = async () => {
    if (!videoRef.current || !canvasRef.current || !userData?.avatar) return;
    setMarked(true);
    // if (!faceapi) {
    //   console.error("face-api not loaded yet");
    //   alert("Face API is still loading. Please try again in a moment.");
    //   return;
    // }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    // Stop webcam streaming
    const stream = video.srcObject as MediaStream;
    stream.getTracks().forEach((track) => track.stop());
    setCapturing(false);

    // Convert captured image to a Face-API image element
    const capturedDataUrl = canvas.toDataURL("image/jpeg");
    const capturedImg = await faceapi.fetchImage(capturedDataUrl);

    // Fetch the user's avatar image using the stored URL
    const avatarImg = await faceapi.fetchImage(userData.avatar);

    // Detect single face and compute descriptors for both images
    const capturedDetection = await faceapi
      .detectSingleFace(capturedImg)
      .withFaceLandmarks()
      .withFaceDescriptor();
    const avatarDetection = await faceapi
      .detectSingleFace(avatarImg)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (capturedDetection && avatarDetection) {
      const distance = faceapi.euclideanDistance(
        capturedDetection.descriptor,
        avatarDetection.descriptor
      );
      // A threshold around 0.6 typically indicates a match
      console.log({ distance });
      if (distance < 0.6) {
        console.log("Face verified: attendance marked.");
        setMarked(true);
      } else {
        console.log("Face verification failed. Please try again.");
      }
    } else {
      console.log("Could not detect faces properly in one or both images.");
    }
  };

  // When "Mark Attendance" is clicked, open camera
  const handleAttendance = async () => {
    await openCamera();
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <h1 className="font-bold">Select Course: </h1>
      <select
        name="course"
        id="course"
        className="w-1/2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
      >
        <option value="" disabled selected>
          Select Course
        </option>
        {filteredCourses?.map((course) => (
          <option key={course.id} value={course.id}>
            {course.course_name}
          </option>
        ))}
      </select>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Student Full Name
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {userData?.fullname}
            </th>
            <td className="px-6 py-4">
              <button
                data-modal-target="popup-modal"
                data-modal-toggle="popup-modal"
                className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
                onClick={handleAttendance}
              >
                Mark Attendance
              </button>
              {/* <Button onClick={handleAttendance}></Button> */}
            </td>
            <td className="px-6 py-4">
              <span className={`px-2 py-1 text-xs font-semibold leading-tight ${marked ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100" }  dark:bg-green-700 dark:text-green-100 rounded-full dark:rounded-none`}>
                {marked ? "Present" : "Absent"}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Video element to display camera stream if capturing */}

      <div
        id="popup-modal"
        tabIndex={-1}
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <button
              type="button"
              className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="popup-modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <svg
                className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to mark this attendance now?
              </h3>
              {/* {capturing && ( */}
              <div className="mt-4 flex flex-col items-center fixed left-0 top-0 w-full h-full bg-gray-900 bg-opacity-90 z-50">
                <video
                  ref={videoRef}
                  className="w-64 h-64 rounded-full object-cover"
                  autoPlay
                />
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  onClick={captureAndCompare}
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                >
                  Capture & Verify
                </button>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  No, cancel
                </button>
            
              </div>
              {/* )} */}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas element used for capturing frame */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
