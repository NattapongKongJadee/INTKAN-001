import React, { ReactNode } from "react";
import { BiSolidCalendar } from "react-icons/bi";
import { FaPeopleArrows } from "react-icons/fa";
import { AiFillPicture } from "react-icons/ai";
import { SideBarDesktop, SideBartItem } from "../components/sidebar-desktop";
import { FaPowerOff } from "react-icons/fa6";
import Link from "next/link";
import { IoSettingsSharp } from "react-icons/io5";

type Props = {
  children: ReactNode;
};

export default function SideBarMain({ children }: Props) {
  return (
    <div className="flex flex-row ">
      <SideBarDesktop>
        <Link href={"/main/planner"}>
          <SideBartItem
            icon={<BiSolidCalendar size={20} />}
            text="ตารางาน"
            // active
          />
        </Link>
        <Link href={"/main/role"}>
          <SideBartItem
            icon={<FaPeopleArrows size={20} />}
            text="หน้าที่"
            active
          />
        </Link>
        <Link href={"/main/image-database"}>
          <SideBartItem
            icon={<AiFillPicture size={20} />}
            text="ฐานข้อมูลรูปภาพ"
          />
        </Link>
        <hr className="my-3" />
        <SideBartItem icon={<IoSettingsSharp size={20} />} text="ตั้งค่า" />
        <Link href={"/"}>
          <SideBartItem icon={<FaPowerOff size={20} />} text="Log Out" />
        </Link>
      </SideBarDesktop>

      <main className="flex flex-col p-2 ml-2">
        {" "}
        {/* Main content area */}
        {children} {/* Where page-specific content will go */}
      </main>
    </div>
  );
}
