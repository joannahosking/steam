"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { usePlayerSummary } from "@/hooks/usePlayerSummary";
import styles from "./Header.module.css";
import { usePathname } from "next/navigation";

interface PageProps {
  params: Promise<{ steamid: string }>;
}

export function Header() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  const params = useParams();
  const steamid =
    typeof params.steamid === "string" ? params.steamid : undefined;

  const summaryQuery = usePlayerSummary(steamid);

  console.log(summaryQuery);

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="40"
          height="40"
          viewBox="708 203.5 502 502"
        >
          <path
            d="M782.06941,278.24534c97.63107,-97.63107 255.92232,-97.63107 353.55339,0c97.63107,97.63107 97.63107,255.92232 0,353.55339c-87.88062,87.88062 -224.91011,96.65729 -322.60777,26.33003l82.89857,-82.89857l-57.27565,-57.27565l-82.89857,82.89857c-70.32726,-97.69766 -61.55059,-234.72715 26.33003,-322.60777zM890.96385,556.13831l20.5061,-20.5061l-33.23402,-33.23402l-20.5061,20.5061zM949.40296,349.6394c0,9.66498 35.48705,18.58439 45.15203,18.58439c9.66498,-0.00001 17.50001,-7.83502 17.50001,-17.5c-0.00001,-9.66498 -7.83503,-17.5 -17.50001,-17.5c-9.66498,0.00001 -45.15203,6.75063 -45.15203,16.41561zM901.96892,511.89922c51.13387,51.13387 134.03828,51.13387 185.17215,0c51.13387,-51.13387 51.13387,-134.03828 0,-185.17215c-51.13387,-51.13387 -134.03828,-51.13387 -185.17215,0c-51.13387,51.13387 -51.13387,134.03828 0,185.17215zM923.45427,348.21242c39.26784,-39.26784 102.93361,-39.26784 142.20145,0c39.26784,39.26784 39.26784,102.93361 0,142.20145c-39.26784,39.26784 -102.93361,39.26784 -142.20145,0c-39.26784,-39.26784 -39.26784,-102.93361 0,-142.20145z"
            fill="var(--primary)"
          />
        </svg>
      </div>
      {summaryQuery.data && (
        <div className={styles.user}>
          <Image
            src={summaryQuery.data!.avatarUrl}
            alt=""
            width={30}
            height={30}
          />
          <span>{summaryQuery.data?.personaName}</span>
        </div>
      )}
    </div>
  );
}
