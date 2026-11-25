import { useEffect, useState } from 'preact/hooks';
import {
  BUDGET_RANGES,
  PROJECT_TYPES,
  TIMELINE_OPTIONS,
} from '@/lib/form-schema';

const FEATURE_CHIPS = [
  'Roles y permisos de usuario',
  'Inspecciones de campo / SSOMA',
  'Actas digitales de EPPs con firma',
  'Reportes PDF / Excel automáticos',
  'App móvil Android / iOS',
  'Alertas por WhatsApp / Correo',
  'Integración con APIs o SUNAT',
  'Optimización SEO / SEM',
];

interface Props {
  initialService?: string;
}

export default function QuoteWizard({ initialService = '' }: Props) {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState<string>(
    initialService || PROJECT_TYPES[0],
  );
  const [features, setFeatures] = useState<string[]>([]);
  const [problemSummary, setProblemSummary] = useState('');
  const [timeline, setTimeline] = useState<string>(TIMELINE_OPTIONS[1]);
  const [budgetRange, setBudgetRange] = useState<string>(BUDGET_RANGES[0]);
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('wsaico-quote-draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.projectType && !initialService) setProjectType(parsed.projectType);
        if (Array.isArray(parsed.features)) setFeatures(parsed.features);
        if (parsed.problemSummary) setProblemSummary(parsed.problemSummary);
        if (parsed.timeline) setTimeline(parsed.timeline);
        if (parsed.budgetRange) setBudgetRange(parsed.budgetRange);
      }
    } catch {}
  }, [initialService]);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        'wsaico-quote-draft',
        JSON.stringify({ projectType, features, problemSummary, timeline, budgetRange }),
      );
    } catch {}
  }, [projectType, features, problemSummary, timeline, budgetRange]);

  const toggleFeature = (item: string) => {
    setFeatures((prev) =>
      prev.includes(item) ? prev.filter((f) => f !== item) : [...prev, item],
    );
  };

  const nextStep = () => {
    setErrorMsg('');
    if (step === 2 && problemSummary.trim().length < 10) {
      setErrorMsg('Describe brevemente qué proceso deseas resolver (al menos 10 caracteres).');
      return;
    }
    setStep((s) => Math.min(4, s + 1));
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setErrorMsg('');

    if (fullName.trim().length < 2 || whatsapp.trim().length < 6 || !email.includes('@')) {
      setErrorMsg('Completa tu nombre, número de WhatsApp y correo electrónico válido.');
      return;
    }

    setSubmitting(true);
    try {
      const turnstileInput = document.querySelector<HTMLInputElement>(
        'input[name="cf-turnstile-response"]',
      );

      const res = await fetch('/api/cotizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType,
          features,
          problemSummary,
          timeline,
          budgetRange,
          fullName,
          company,
          whatsapp,
          email,
          turnstileToken: turnstileInput?.value || '',
          sourceUrl: window.location.href,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrorMsg(json.message || 'Ocurrió un error al enviar la solicitud.');
        setSubmitting(false);
        return;
      }

      sessionStorage.removeItem('wsaico-quote-draft');
      window.location.href = '/gracias';
    } catch {
      setErrorMsg('Error de conexión. Intenta nuevamente o escríbenos por WhatsApp.');
      setSubmitting(false);
    }
  };

  const progress = (step / 4) * 100;

  return (
    <form onSubmit={handleSubmit} class="spotlight-card p-6 sm:p-9" noValidate>
      {/* Barra de progreso */}
      <div class="mb-8">
        <div class="flex items-center justify-between font-mono text-xs text-[var(--text-muted)]">
          <span>PASO 0{step} DE 04</span>
          <span>{Math.round(progress)}% COMPLETADO</span>
        </div>
        <div class="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-surface-2)]">
          <div
            class="h-full rounded-full bg-[var(--accent-primary)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Paso 1 */}
      {step === 1 && (
        <div>
          <h2 class="text-xl font-bold text-[var(--text-primary)]">
            ¿Qué tipo de solución estás buscando?
          </h2>
          <p class="mt-1.5 text-sm text-[var(--text-muted)]">
            Elige la opción que más se acerque a tu necesidad principal.
          </p>

          <div class="mt-6 grid gap-3 sm:grid-cols-2">
            {PROJECT_TYPES.map((type) => {
              const active = projectType === type;
              return (
                <button
                  type="button"
                  key={type}
                  onClick={() => setProjectType(type)}
                  class={`rounded-xl border p-4 text-left text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-soft)] text-[var(--text-primary)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)]/50 text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Paso 2 */}
      {step === 2 && (
        <div class="space-y-6">
          <div>
            <h2 class="text-xl font-bold text-[var(--text-primary)]">
              Alcance y funcionalidades clave
            </h2>
            <p class="mt-1.5 text-sm text-[var(--text-muted)]">
              Marca los módulos que te interesan y describe brevemente tu situación actual.
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            {FEATURE_CHIPS.map((chip) => {
              const selected = features.includes(chip);
              return (
                <button
                  type="button"
                  key={chip}
                  onClick={() => toggleFeature(chip)}
                  class={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    selected
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)]/50 text-[var(--text-secondary)] hover:border-[var(--border-accent)]'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          <div>
            <label for="problemSummary" class="block text-sm font-semibold text-[var(--text-primary)]">
              ¿Qué problema actual quieres resolver? *
            </label>
            <textarea
              id="problemSummary"
              rows={4}
              value={problemSummary}
              onInput={(e) => setProblemSummary((e.target as HTMLTextAreaElement).value)}
              placeholder="Ej.: Actualmente llevamos las inspecciones de seguridad y entrega de EPPs en hojas de cálculo y formatos físicos, y necesitamos digitalizarlo..."
              class="mt-2 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-canvas)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:border-[var(--accent-primary)] focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Paso 3 */}
      {step === 3 && (
        <div class="space-y-6">
          <div>
            <h2 class="text-xl font-bold text-[var(--text-primary)]">
              Plazo estimado y rango referencial
            </h2>
            <p class="mt-1.5 text-sm text-[var(--text-muted)]">
              Esto me ayuda a proponer una arquitectura y plan de entregas acorde a tus tiempos.
            </p>
          </div>

          <div>
            <p class="text-sm font-semibold text-[var(--text-primary)]">¿Cuándo te gustaría iniciar?</p>
            <div class="mt-3 grid gap-2.5 sm:grid-cols-2">
              {TIMELINE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setTimeline(opt)}
                  class={`rounded-xl border p-3.5 text-left text-sm font-medium cursor-pointer ${
                    timeline === opt
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-soft)] text-[var(--text-primary)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)]/50 text-[var(--text-secondary)]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p class="text-sm font-semibold text-[var(--text-primary)]">
              Inversión referencial (opcional)
            </p>
            <div class="mt-3 grid gap-2.5 sm:grid-cols-2">
              {BUDGET_RANGES.map((range) => (
                <button
                  type="button"
                  key={range}
                  onClick={() => setBudgetRange(range)}
                  class={`rounded-xl border p-3.5 text-left text-sm font-medium cursor-pointer ${
                    budgetRange === range
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-soft)] text-[var(--text-primary)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)]/50 text-[var(--text-secondary)]'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Paso 4 */}
      {step === 4 && (
        <div class="space-y-5">
          <div>
            <h2 class="text-xl font-bold text-[var(--text-primary)]">
              ¿Dónde te envío la propuesta?
            </h2>
            <p class="mt-1.5 text-sm text-[var(--text-muted)]">
              Te responderé directamente en menos de 24 horas hábiles.
            </p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="fullName" class="block text-xs font-semibold text-[var(--text-secondary)]">
                Nombre completo *
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onInput={(e) => setFullName((e.target as HTMLInputElement).value)}
                class="mt-1.5 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-canvas)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
              />
            </div>

            <div>
              <label for="company" class="block text-xs font-semibold text-[var(--text-secondary)]">
                Empresa o rubro (opcional)
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onInput={(e) => setCompany((e.target as HTMLInputElement).value)}
                class="mt-1.5 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-canvas)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
              />
            </div>

            <div>
              <label for="whatsapp" class="block text-xs font-semibold text-[var(--text-secondary)]">
                WhatsApp / Celular *
              </label>
              <input
                id="whatsapp"
                type="tel"
                required
                placeholder="+51 9..."
                value={whatsapp}
                onInput={(e) => setWhatsapp((e.target as HTMLInputElement).value)}
                class="mt-1.5 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-canvas)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
              />
            </div>

            <div>
              <label for="email" class="block text-xs font-semibold text-[var(--text-secondary)]">
                Correo electrónico *
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                class="mt-1.5 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-canvas)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <p role="alert" class="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMsg}
        </p>
      )}

      {/* Navegación del wizard */}
      <div class="mt-8 flex items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-6">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => {
              setErrorMsg('');
              setStep((s) => Math.max(1, s - 1));
            }}
            class="btn-secondary cursor-pointer"
          >
            Anterior
          </button>
        ) : (
          <span />
        )}

        {step < 4 ? (
          <button type="button" onClick={nextStep} class="btn-primary cursor-pointer">
            Continuar
          </button>
        ) : (
          <button type="submit" disabled={submitting} class="btn-primary cursor-pointer disabled:opacity-60">
            {submitting ? 'Enviando solicitud...' : 'Enviar solicitud de cotización'}
          </button>
        )}
      </div>
    </form>
  );
}
