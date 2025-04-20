/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import logoImg from "../../public/logo-itk.png";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import SimpleBackdrop from "./components/SimpleBackdrop/SimpleBackDrop";
import { io, Socket } from "socket.io-client";
const RiveDemo = dynamic(() => import("./components/robotITK"), {
  ssr: false, // Disable server-side rendering
});

let socket: Socket;

type Props = {};

export default function Main({}: Props) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    const socket = io(
      "https://backend-itk-581518296545.asia-southeast1.run.app"
    );

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    // Handle cleanup
    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setOpen(true);
    try {
      const response = await axios.post(
        "https://backend-itk-581518296545.asia-southeast1.run.app/api/login",
        {
          name: username,
          password,
        }
      );
      if (response.status == 200) {
        console.log(response.data.payload.name.name);

        localStorage.setItem(
          "username",
          response.data.payload.name.name || "Anonymous"
        );
        router.replace("/main/planner");
      } else {
        // setError(response.data.message || "LogIn Failed !!!");
        toast.error(response.data.message || "LogIn Failed!!!");
      }
    } catch (e: any) {
      if (e.response) {
        toast.error("username หรือ password ไม่ถูกต้อง");
      } else if (e.request) {
        toast.error("No response from the server.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setOpen(false);
    }
  };
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "red",
            color: "white",
          },
        }}
      />
      <div className="bg-white-100 to-cyan-100 flex ">
        <div className="min-h-screen w-1/2 flex justify-center items-center">
          <img src={logoImg.src} className="flex justify-center w-96 h-72" />
        </div>
        <div className="min-h-screen w-1/2  bg-gradient-to-r from-sky-200 flex items-center justify-center">
          <div className="flex justify-end items-center mx-4">
            <div className="card bg-base-100 shadow-xl">
              <div className="h-[600px] sm:h-[500px]">
                <RiveDemo />
              </div>
              <div className="card-body">
                {/* <form onSubmit={handleLogin}> */}
                <h1 className="card-title justify-center my-2 font-bold text-2xl">
                  INTAKAN ENGINEERING LTD PARTNERSHIP
                </h1>
                <div className="card-actions justify-end">
                  <label className="input input-bordered input-lg flex items-center gap-2 my-2 ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4 opacity-70"
                    >
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <div></div>
                    <input
                      type="text"
                      className="grow"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </label>

                  <label className="input input-bordered input-lg flex items-center gap-2 my-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4 opacity-70"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      type="password"
                      className="grow"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                </div>
                <button
                  className="btn btn-info font-bold text-lg"
                  onClick={handleLogin}
                >
                  LOG IN
                </button>
                {/* </form> */}
              </div>
            </div>
          </div>
        </div>
        <SimpleBackdrop open={open} setOpen={setOpen} />
      </div>
    </>
  );
}
