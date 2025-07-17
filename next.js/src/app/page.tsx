import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div className={styles.ctas}>
          <a
            href="/"
            target="_self"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Home
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://goldlabel.pro/abgeschottet"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to Goldlabel.pro →
        </a>
      </footer>
    </div>
  );
}
