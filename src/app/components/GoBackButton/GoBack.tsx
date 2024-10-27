"use client";
import { useRouter } from "next/navigation"; // Import from "next/navigation" in the app directory
import { log } from "node:console";

const GoBackButton = () => {
  const router = useRouter();

  const handleGoBack = () => {
    console.log("CHECK LOG");

    router.back(); // This will navigate the user to the previous page
  };

  return (
    <button className="btn btn-circle btn-outline" onClick={handleGoBack}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export default GoBackButton;
