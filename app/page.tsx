import Link from "next/link";

const highlights = [
  {
    title: "Fast by default",
    description:
      "Built with Next.js for smooth navigation and modern performance.",
  },
  {
    title: "Clear storytelling",
    description:
      "Thoughtful sections and strong calls to action guide visitors naturally.",
  },
  {
    title: "Ready to grow",
    description:
      "A clean foundation that scales as your content and product expand.",
  },
];

const stats = [
  { label: "Articles published", value: "10+" },
  { label: "Design focus", value: "Responsive" },
  { label: "Framework", value: "Next.js" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-20 lg:px-8">
        <nav className="flex items-center justify-between">
          <div className="text-lg font-semibold tracking-tight">
            Northstar Studio
          </div>
          <Link
            href="/Blog"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium transition hover:border-cyan-400 hover:text-cyan-300"
          >
            Read the blog
          </Link>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-300">
              Modern web experiences
            </span>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Create a home page that feels polished, useful, and memorable.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              This landing page brings together a strong hero section, feature
              highlights, and a simple path into your content so visitors know
              exactly where to go next.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/Blog"
                className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Explore blog
              </Link>
              <a
                href="#features"
                className="rounded-full border border-white/20 px-5 py-3 font-semibold text-white transition hover:border-white/40"
              >
                See highlights
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                What this page delivers
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>• Clear first impression with a confident hero section</li>
                <li>• Structured content blocks that feel easy to scan</li>
                <li>• A direct route to your blog and deeper content</li>
              </ul>
            </div>
          </div>
        </div>

        <div id="features" className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-6"
            >
              <h2 className="text-xl font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-slate-900 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Fresh content
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Stories, ideas, and practical insights
              </h2>
            </div>
            <Link
              href="/Blog"
              className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Visit the blog →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
              >
                <p className="text-2xl font-semibold text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
