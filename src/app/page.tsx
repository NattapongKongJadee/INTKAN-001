import React from "react";
import { RiveDemo } from "@/app/components/robotITK";
import Link from "next/link";
import logoImg from "../../public/logo-itk.png";
// import { Provider } from "react-redux";
// import Image from "next/image";
// import logo from "../../public/logo-removebg.png";

type Props = {};

export default function Main({}: Props) {
  return (
    <div className="bg-white-100 to-cyan-100 flex ">
      <div className="min-h-screen w-1/2 flex justify-center items-center">
        <img src={logoImg.src} className="flex justify-center w-96 h-72" />
      </div>
      <div className="min-h-screen w-1/2  bg-gradient-to-r from-sky-200 flex items-center justify-center">
        <div className="flex justify-end items-center mx-4">
          <div className="card bg-base-100 shadow-xl">
            <div style={{ height: 600 }}>
              <RiveDemo />
            </div>
            <div className="card-body">
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
                  <input type="text" className="grow" placeholder="Username" />
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
                  <input type="password" className="grow" />
                </label>
              </div>
              <Link href="/main/job-management" passHref legacyBehavior>
                <button className="btn btn-info font-bold text-lg">
                  LOG IN
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
