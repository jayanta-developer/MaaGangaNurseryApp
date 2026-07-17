import styles from './style.module.css';

const posts = [
  {
    id: 1,
    title: 'Getting Started with Next.js',
    excerpt: 'Learn the fundamentals of the App Router and Server Components.',
    date: 'July 10, 2026',
    author: 'Aria Chen',
  },
  {
    id: 2,
    title: 'Why Server Components Matter',
    excerpt: 'A deep dive into rendering strategies and performance.',
    date: 'July 5, 2026',
    author: 'Marcus Lee',
  },
  {
    id: 3,
    title: 'Building Forms with Server Actions',
    excerpt: 'Ditch the boilerplate and mutate data directly from the server.',
    date: 'June 28, 2026',
    author: 'Priya Nair',
  },
];

export default function BlogPage() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>The Blog</h1>
        <p className={styles.subtitle}>Thoughts on web development and beyond</p>
      </header>

      <section className={styles.grid}>
        {posts.map((post) => (
          <article key={post.id} className={styles.card}>
            <h2 className={styles.cardTitle}>{post.title}</h2>
            <p className={styles.excerpt}>{post.excerpt}</p>
            <div className={styles.meta}>
              <span>{post.author}</span>
              <span>{post.date}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
