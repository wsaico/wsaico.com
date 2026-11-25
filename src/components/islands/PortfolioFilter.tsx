import { useState } from 'preact/hooks';

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  problem: string;
  result: string;
  category: string;
  stack: string[];
  liveUrl?: string;
  liveCtaLabel?: string;
}

interface Props {
  projects: ProjectItem[];
}

export default function PortfolioFilter({ projects }: Props) {
  const categories = ['Todos', ...Array.from(new Set(projects.map((p) => p.category)))];
  const [selected, setSelected] = useState('Todos');

  const filtered =
    selected === 'Todos' ? projects : projects.filter((p) => p.category === selected);

  return (
    <div>
      <div class="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar proyectos por categoría">
        {categories.map((cat) => {
          const active = selected === cat;
          return (
            <button
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelected(cat)}
              class={`rounded-full px-4 py-2 font-mono text-xs font-semibold transition-colors cursor-pointer ${
                active
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-accent)]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div class="mt-10 grid gap-6 lg:grid-cols-2">
        {filtered.map((project) => (
          <article key={project.id} class="spotlight-card flex flex-col justify-between p-6 sm:p-8">
            <div>
              <div class="flex items-center justify-between gap-2">
                <span class="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 py-1 font-mono text-[11px] font-semibold text-[var(--accent-primary)]">
                  {project.category}
                </span>
                {project.liveUrl && (
                  <span class="font-mono text-[11px] font-medium text-emerald-400">
                    En vivo
                  </span>
                )}
              </div>

              <h2 class="mt-4 text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
                <a href={`/proyectos/${project.id}`} class="hover:text-[var(--accent-primary)] transition-colors">
                  {project.title}
                </a>
              </h2>
              <p class="mt-1 text-sm font-medium text-[var(--text-secondary)]">{project.subtitle}</p>

              <div class="mt-5 space-y-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)]/60 p-4 text-sm">
                <p>
                  <span class="font-mono text-[11px] font-semibold text-[var(--text-subtle)] uppercase">
                    Problema:{' '}
                  </span>
                  <span class="text-[var(--text-muted)]">{project.problem}</span>
                </p>
                <p>
                  <span class="font-mono text-[11px] font-semibold text-[var(--accent-primary)] uppercase">
                    Resultado:{' '}
                  </span>
                  <span class="text-[var(--text-secondary)]">{project.result}</span>
                </p>
              </div>
            </div>

            <div class="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-5">
              <div class="flex flex-wrap gap-1.5">
                {project.stack.slice(0, 4).map((tech) => (
                  <span key={tech} class="rounded-md border border-[var(--border-subtle)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-muted)]">
                    {tech}
                  </span>
                ))}
              </div>
              <div class="flex items-center gap-3">
                <a href={`/proyectos/${project.id}`} class="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                  Ver caso
                </a>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="rounded-full bg-[var(--accent-primary)] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[var(--accent-primary-hover)]"
                  >
                    {project.liveCtaLabel ?? 'Probar plataforma'}
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
