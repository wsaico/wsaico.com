import { useState } from 'preact/hooks';

export interface BlogPostSummary {
  id: string;
  title: string;
  description: string;
  category: string;
  pubDateFormatted: string;
}

interface Props {
  posts: BlogPostSummary[];
}

export default function BlogSearch({ posts }: Props) {
  const categories = ['Todas', ...Array.from(new Set(posts.map((p) => p.category)))];
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [query, setQuery] = useState('');

  const filtered = posts.filter((post) => {
    const matchesCat = selectedCategory === 'Todas' || post.category === selectedCategory;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.description.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div>
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              class={`rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-accent)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="search"
          aria-label="Buscar artículos"
          placeholder="Buscar por tema, SSOMA, SEO..."
          value={query}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          class="w-full rounded-full border border-[var(--border-strong)] bg-[var(--bg-canvas)] px-4 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:border-[var(--accent-primary)] focus:outline-none md:w-72"
        />
      </div>

      <div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <article key={post.id} class="spotlight-card group flex flex-col justify-between p-6">
            <div>
              <div class="flex items-center justify-between gap-2 font-mono text-[11px]">
                <span class="font-semibold text-[var(--accent-primary)]">{post.category}</span>
                <span class="text-[var(--text-subtle)]">{post.pubDateFormatted}</span>
              </div>
              <h2 class="mt-3.5 text-lg font-bold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                <a href={`/blog/${post.id}`}>{post.title}</a>
              </h2>
              <p class="mt-2.5 text-sm leading-relaxed text-[var(--text-muted)]">{post.description}</p>
            </div>
            <a href={`/blog/${post.id}`} class="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-primary)]">
              Leer artículo →
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
