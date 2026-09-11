import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost } from "../data";
import styles from "../style.module.css";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Temporary: keep individual blog posts disabled with the blog route.
  if (process.env.NEXT_PUBLIC_BLOG_ENABLED !== "true") {
    notFound();
  }

  const { id } = await params;
  const post = getBlogPost(Number(id));

  if (!post) {
    notFound();
    return null;
  }

  return (
    <main className={styles.container}>
      <Link href="/Blog" className={styles.backLink}>
        ← Back to blog
      </Link>

      <article>
        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.subtitle}>
          By {post.author} • {post.date}
        </p>
        <p className={styles.content}>{post.body}</p>
        <p className={styles.content}>
          This post is rendered from the local blog data source inside the app.
        </p>
      </article>
    </main>
  );
}
