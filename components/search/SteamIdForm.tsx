"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SteamIdForm.module.css";
import { ShieldCheck, MoveRight } from "lucide-react";

export function SteamIdForm() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = input.trim();
    if (!trimmed) return;

    setIsResolving(true);
    try {
      const res = await fetch(
        `/api/steam/resolve?q=${encodeURIComponent(trimmed)}`,
      );
      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error === "not_found"
            ? "Couldn't find that Steam profile. Try your Steam profile URL instead of your display name. (Copy it straight from your browser's address bar.)"
            : "Something went wrong. Try again in a moment.",
        );
        return;
      }

      router.push(`/${data.steamid}`);
    } catch {
      setError("Something went wrong. Try again in a moment.");
    } finally {
      setIsResolving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="steamInput">Steam profile</label>
      <input
        id="steamInput"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Profile URL, Steam name, or SteamID64"
      />
      <p className={styles.info}>
        <ShieldCheck size={20} color={"currentColor"} /> Your profile must be
        public. Nothing is stored.
      </p>
      <button type="submit" disabled={isResolving}>
        {isResolving ? (
          "Finding your library…"
        ) : (
          <>
            Analyse library <MoveRight size={20} color="currentColor" />
          </>
        )}
      </button>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </form>
  );
}
