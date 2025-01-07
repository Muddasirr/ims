'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import Login from "./Login/page";
import Header from "./dashboard/Header/page";

export default function Home() {

  const router= useRouter();
  
  return (
   <>
<Login/>
  
   </>
    
  );
}




