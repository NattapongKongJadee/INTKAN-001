"use client";
import { IoIosAddCircle } from "react-icons/io";
import CardRole from "@/app/view/app/card-role/card-role";
import { motion, AnimatePresence } from "framer-motion";

import { v4 as uuidv4 } from "uuid";

import { useState } from "react";
interface Box {
  // name: string;
  id: any;
  title: string;
  description: string;
  boxColor: string;
}

export default function Role() {
  const [cardBox, setCardBox] = useState<Box[]>([]);
  const handleAdd = () => {
    // if (cardBox.length <= 2) {
    const containerBoxes = [...cardBox, []];
    const newItem = {
      id: uuidv4(),
      title: "TEST",
      description: "Lorem ipsum",
      boxColor: "white",
    };
    setCardBox((prevBoxes: Box[]) => [...prevBoxes, newItem]);
    console.log(cardBox.length);
    // } else {
    // notifyPageExceeed();
    // return;
    // }
  };

  return (
    // <div className=" flex items-center bg-neutral-100 w-1/2">
    <div className="flex flex-row h-screen w-[90vw]">
      <div className="flex flex-col w-[70vw]  ml-4 my-4  bg-neutral-100  rounded-lg shadow-xl relative">
        <div
          className="bg-orange-global rounded-lg p-2 inline-flex items-center shadow-md"
          style={{ maxWidth: "fit-content" }}
        >
          <IoIosAddCircle
            className="cursor-pointer"
            size={30}
            color="white"
            onClick={handleAdd}
          />
          <button className="text-lg text-white">เพิ่มงาน</button>
          <div className="grid grid-cols-2 gap-4 items-start">
            {cardBox.map((data, i) => (
              <div className="relative  mb-4 ">
                <AnimatePresence>
                  <motion.div
                    key={data.id}
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.15,
                      transition: { duration: 0.65 },
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardRole
                      title={data.title}
                      description={data.description}
                      boxColor={data.boxColor}
                      // handleDelete={() => handleDeleteBox(i)}
                      // handleDelete={openDelete}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex row w-[30vw]  ml-4 my-4 p-4 bg-red-300  rounded-lg shadow-xl"></div>
    </div>
  );
}
