import { useAllCourses, useUserData } from "@/lib/utils";
import type { UsersRecord } from "@/services/backend/pbTypes";
import { Button } from "../ui/button";
import { useState, useRef, useEffect } from "react";

export function Attendance() {
  const userData = useUserData() as UsersRecord | null;
  const allCourses = useAllCourses();
  const filteredCourses = allCourses?.items.filter((course) =>
    userData?.courses.includes(course.id)
  );

  // State & refs for capturing image
  const [capturing, setCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [faceapi, setFaceapi] = useState<any>(null);

  // Dynamically import face-api.js on component mount in the browser
  useEffect(() => {
    (async () => {
      const module = await import("face-api.js");
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
      if (distance < 0.6) {
        alert("Face verified: attendance marked.");
      } else {
        alert("Face verification failed. Please try again.");
      }
    } else {
      alert("Could not detect faces properly in one or both images.");
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
              <Button onClick={handleAttendance}>Mark Attendance</Button>
            </td>
            <td className="px-6 py-4">
              <span className="px-2 py-1 text-xs font-semibold leading-tight text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100 rounded-full dark:rounded-none">
                Absent
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Video element to display camera stream if capturing */}
      {capturing && (
        <div className="mt-4 flex flex-col items-center ">
          <video ref={videoRef} style={{ width: "100%", maxWidth: "400px" }} autoPlay />
          <Button onClick={captureAndCompare} className="mt-2">
            Capture & Verify
          </Button>
        </div>
      )}

      {/* Hidden canvas element used for capturing frame */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}