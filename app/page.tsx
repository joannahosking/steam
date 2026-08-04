import type { Metadata } from "next";
import { SteamIdForm } from "@/components/search/SteamIdForm";
import { ExampleProfiles } from "@/components/search/ExampleProfiles";
import Image from "next/image";
import screenshot from "@/app/assets/screenshot.jpg";
import { ChartPie, Star, ChartLine, CircleQuestionMark } from "lucide-react";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Steam Dashboard: See Your Backlog, Genres & Playtime",
  description:
    "Enter your Steam profile to see a visual breakdown of your game library: genres you actually play, backlog completion, and personalized suggestions for what to play next.",
  openGraph: {
    title: "Steam Library Dashboard",
    description:
      "Visualize your Steam library: genres, backlog, and playtime stats.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Steam Library Dashboard",
    description:
      "Visualize your Steam library: genres, backlog, and playtime stats.",
  },
};

export default function HomePage() {
  return (
    <main>
      <section className={styles.hero}>
        <h1>Analyse your Steam Library</h1>
        <p>
          <strong>Discover how you really play.</strong>
        </p>

        <p>
          See your favourite genres, uncover your backlog, and get
          recommendations from the games you already own.
        </p>

        <SteamIdForm />
      </section>

      <ExampleProfiles />

      <section className={styles.features}>
        <figure className={styles.screenshot}>
          <Image
            src={screenshot}
            alt="Screenshot of the dashboard"
            width={800}
            height={450}
            sizes="(min-width: 850px) 800px, calc(100vw - 4rem)"
          />
        </figure>
        <ul>
          <li>
            <div>
              <ChartLine size={20} color={"var(--green)"} />
            </div>
            <div>
              <h3>Understand your library</h3>
              <p>
                See your backlog, favourite genres and hidden gems you may have
                forgotten.
              </p>
            </div>
          </li>
          <li>
            <div>
              <Star size={20} color={"var(--orange)"} />
            </div>
            <div>
              <h3>Find your next game</h3>
              <p>
                Recommendations are from your own library, based on the games
                you've already enjoyed.
              </p>
            </div>
          </li>
          <li>
            <div>
              <ChartPie size={20} color={"var(--coral)"} />
            </div>
            <div>
              <h3>Visualise your habits</h3>
              <p>
                Beautiful charts that show where your time goes and what games
                you enjoy.
              </p>
            </div>
          </li>
        </ul>
      </section>

      <section className={styles.faq}>
        <h2>Frequently Asked Questions</h2>
        <ul>
          <li>
            <CircleQuestionMark size={24} color={"var(--text-muted)"} />
            <div>
              <h3>What is this project?</h3>
              <p>
                This tool analyses public Steam libraries to help you understand
                gaming habits. It recommends games you already own, helping you
                rediscover your library.
              </p>
            </div>
          </li>
          <li>
            <CircleQuestionMark size={24} color={"var(--text-muted)"} />
            <div>
              <h3>Does my Steam profile need to be public?</h3>
              <p>
                Yes. The tool relies on Steam's publicly available library
                information to analyze your profile, so it only works with
                public profiles.
              </p>
            </div>
          </li>
          <li>
            <CircleQuestionMark size={24} color={"var(--text-muted)"} />
            <div>
              <h3>How are recommendations chosen?</h3>
              <p>
                Recommendations are generated based on the games you've already
                played and your library's characteristics.
              </p>
            </div>
          </li>
          <li>
            <CircleQuestionMark size={24} color={"var(--text-muted)"} />
            <div>
              <h3>Why is my library missing games?</h3>
              <p>
                The tool can only analyse your public Steam profile. Hidden or
                private games won't appear in your dashboard.
              </p>
            </div>
          </li>
          <li>
            <CircleQuestionMark size={24} color={"var(--text-muted)"} />
            <div>
              <h3>Do you store my data?</h3>
              <p>
                No. Your profile is analysed to generate your dashboard and
                isn't stored afterwards.
              </p>
            </div>
          </li>
          <li>
            <CircleQuestionMark size={24} color={"var(--text-muted)"} />
            <div>
              <h3>Are you affiliated with Steam or Valve?</h3>
              <p>
                No. The tool is an independent project that uses publicly
                available Steam data.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </main>
  );
}
