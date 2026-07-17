import Link from "next/link";
import { getBlogPosts } from "./data";
import BlogClient from "./BlogClient";
import styles from "./style.module.css";

export default async function BlogPage() {
  const data = getBlogPosts();

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <h1 className={styles.title}>Back To Home</h1>
        </Link>
        <p className={styles.subtitle}>
          Thoughts on web development and beyond
        </p>
      </header>

      <BlogClient initialPosts={data} />
    </main>
  );
}
