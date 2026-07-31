import Image from "next/image";
import concernedape from "@/components/search/assets/concernedape.jpg";
import st4ck from "@/components/search/assets/st4ck.jpg";
import woogiemonster from "@/components/search/assets/woogiemonster.jpg";
import { ChevronRight, CornerLeftUp } from "lucide-react";
import styles from "@/components/search/ExampleProfiles.module.css";

export function ExampleProfiles() {
  return (
    <section className={styles.container}>
      <h2>Don't have a public profile?</h2>
      <p>Try one of these.</p>
      <ul className={styles.userList}>
        <li className={styles.userLink}>
          <a href="/76561197984010167">
            <Image
              src={concernedape}
              alt="ConcernedApe"
              width={50}
              height={50}
            />
            <div>
              <h3>ConcernedApe</h3>
              <p>Creator of Stardew Valley</p>
            </div>
            <ChevronRight size={30} color={"var(--text-muted)"} />
          </a>
        </li>
        <li className={styles.userLink}>
          <a href="/76561198023414915">
            <Image src={st4ck} alt="St4ck" width={50} height={50} />
            <div>
              <h3>St4ck</h3>
              <p>Most XP leader</p>
            </div>
            <ChevronRight size={30} color={"var(--text-muted)"} />
          </a>
        </li>
        <li className={styles.userLink}>
          <a href="/76561198006584703">
            <Image
              src={woogiemonster}
              alt="WoogieMonster"
              width={50}
              height={50}
            />
            <div>
              <h3>WoogieMonster</h3>
              <p>Playtime leader</p>
            </div>
            <ChevronRight size={30} color={"var(--text-muted)"} />
          </a>
        </li>
      </ul>
      <p className={styles.tooltip}><CornerLeftUp size={16} color={'currentColor'} /> Click a profile to explore</p>
    </section>
  );
}
