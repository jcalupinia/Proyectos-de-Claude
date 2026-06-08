import type { ReactNode } from 'react';
import {
  Download, FileSpreadsheet, CalendarRange, FolderCheck,
  ShieldCheck, Layers, ArrowRight, Bot, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuroraText } from '@/components/magicui/aurora-text';
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { Marquee } from '@/components/magicui/marquee';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { BentoGrid, BentoCard } from '@/components/magicui/bento-grid';
import { BorderBeam } from '@/components/magicui/border-beam';
import { DotPattern } from '@/components/magicui/dot-pattern';
import { BlurFade } from '@/components/magicui/blur-fade';
import { OrbitingCircles } from '@/components/magicui/orbiting-circles';
import { Particles } from '@/components/magicui/particles';
import { cn } from '@/lib/utils';

const stats = [
  { value: 120, suffix: '/min', label: 'comprobantes descargados' },
  { value: 85, suffix: '%', label: 'menos errores manuales' },
  { value: 60, suffix: '%', label: 'menos tiempo de gestión' },
];

const trust = [
  'Comprobantes recibidos', 'Comprobantes emitidos', 'Reporte por fechas',
  'Consolidación', 'Año completo', 'Exportable a Excel', 'SRI Ecuador',
];

const features = [
  {
    Icon: Download, name: 'Descarga por lotes',
    description: 'Miles de comprobantes en una sola corrida, sin abrir el portal uno por uno.',
    className: 'col-span-3 lg:col-span-2', cta: 'Ver más',
    grad: 'from-primary/25 to-transparent',
  },
  {
    Icon: CalendarRange, name: 'Reporte por fechas',
    description: 'Rangos personalizados, por mes o año completo.',
    className: 'col-span-3 lg:col-span-1', cta: 'Ver más',
    grad: 'from-secondary/25 to-transparent',
  },
  {
    Icon: Layers, name: 'Consolidación',
    description: 'Une documentos dispersos en un consolidado limpio.',
    className: 'col-span-3 lg:col-span-1', cta: 'Ver más',
    grad: 'from-secondary/20 to-transparent',
  },
  {
    Icon: FolderCheck, name: 'Carpeta organizada',
    description: 'Define dónde se guardan las descargas y mantén todo ordenado por RUC y periodo.',
    className: 'col-span-3 lg:col-span-2', cta: 'Ver más',
    grad: 'from-primary/20 to-transparent',
  },
];

function OrbitIcon({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-full items-center justify-center rounded-full border border-border bg-card/90 shadow-lg backdrop-blur">
      {children}
    </div>
  );
}

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  return (
    <div className="text-center sm:text-left">
      <div className="font-bold text-3xl sm:text-4xl text-foreground tabular-nums">
        <NumberTicker value={value} className="text-foreground" />{suffix}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo: patrón de puntos + glow */}
      <DotPattern
        className={cn('[mask-image:radial-gradient(70vw_circle_at_50%_0%,white,transparent)]', 'fill-muted-foreground/25')}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-secondary/15 blur-[120px]" />
      </div>

      {/* NAV flotante */}
      <header className="fixed inset-x-0 top-4 z-50 mx-auto w-[min(1100px,92vw)]">
        <nav className="flex items-center justify-between rounded-full border border-border bg-card/70 px-5 py-2.5 backdrop-blur-xl">
          <a href="#" className="flex items-center gap-2 font-bold">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Bot className="size-5" /></span>
            ROBOT AUDIT <span className="text-primary">SRI</span>
          </a>
          <div className="hidden items-center gap-7 text-sm text-muted-foreground sm:flex">
            <a href="#funciones" className="transition-colors hover:text-foreground">Funciones</a>
            <a href="#descargar" className="transition-colors hover:text-foreground">Descargar</a>
          </div>
          <Button size="sm" asChild><a href="#descargar">Probar gratis</a></Button>
        </nav>
      </header>

      {/* HERO */}
      <main className="relative z-10">
        <section className="relative mx-auto w-[min(1100px,92vw)] pt-36 pb-20 text-center sm:pt-44">
          <Particles className="absolute inset-0 -z-0" quantity={90} ease={70} color="#F59E0B" refresh />
          <BlurFade delay={0.05} inView>
            <div className="mx-auto flex w-fit items-center rounded-full border border-border bg-card/60 px-1 backdrop-blur">
              <AnimatedShinyText className="inline-flex items-center gap-2 px-3 py-1 text-sm">
                <Sparkles className="size-3.5 text-primary" /> Compatible con el portal del SRI Ecuador
              </AnimatedShinyText>
            </div>
          </BlurFade>

          <BlurFade delay={0.12} inView>
            <h1 className="mx-auto mt-7 max-w-4xl text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
              Controla tus comprobantes <AuroraText colors={['#F59E0B', '#FBBF24', '#8B5CF6', '#F59E0B']}>en minutos.</AuroraText>
            </h1>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              El robot que descarga, organiza y audita automáticamente tus comprobantes
              del SRI. Sin trabajo manual, sin comprobantes perdidos.
            </p>
          </BlurFade>

          <BlurFade delay={0.28} inView>
            <div id="descargar" className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ShimmerButton background="hsl(38 92% 50%)" shimmerColor="#1a1205" className="font-semibold text-[#1a1205]">
                <Download className="size-4" /> Descargar ROBOT_AUDIT_SRI
              </ShimmerButton>
              <Button variant="outline" size="lg">Ver cómo funciona <ArrowRight className="size-4" /></Button>
            </div>
          </BlurFade>

          {/* Stats */}
          <BlurFade delay={0.36} inView>
            <div className="mx-auto mt-14 flex max-w-3xl flex-col items-center justify-center gap-8 sm:flex-row sm:gap-14">
              {stats.map((s) => <Stat key={s.label} {...s} />)}
            </div>
          </BlurFade>

          {/* Preview: robot con íconos orbitando (animado) + BorderBeam */}
          <BlurFade delay={0.44} inView>
            <div className="relative mx-auto mt-16 flex h-[26rem] max-w-3xl items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-background shadow-2xl">
              {/* robot central */}
              <img
                src="/img/robot-audit.svg"
                alt="Robot de auditoría descargando y revisando comprobantes del SRI"
                width={260} height={180}
                className="relative z-10 w-48 drop-shadow-[0_0_30px_rgba(245,158,11,0.25)]"
              />
              {/* anillo exterior */}
              <OrbitingCircles radius={170} iconSize={46} duration={22}>
                <OrbitIcon><Download className="size-5 text-primary" /></OrbitIcon>
                <OrbitIcon><FileSpreadsheet className="size-5 text-secondary" /></OrbitIcon>
                <OrbitIcon><CalendarRange className="size-5 text-primary" /></OrbitIcon>
                <OrbitIcon><ShieldCheck className="size-5 text-secondary" /></OrbitIcon>
              </OrbitingCircles>
              {/* anillo interior (sentido inverso) */}
              <OrbitingCircles radius={108} iconSize={38} duration={16} reverse>
                <OrbitIcon><Layers className="size-4 text-secondary" /></OrbitIcon>
                <OrbitIcon><FolderCheck className="size-4 text-primary" /></OrbitIcon>
                <OrbitIcon><Bot className="size-4 text-primary" /></OrbitIcon>
              </OrbitingCircles>
              <BorderBeam size={240} duration={10} colorFrom="#F59E0B" colorTo="#8B5CF6" />
            </div>
          </BlurFade>
        </section>

        {/* MARQUEE de confianza */}
        <section className="relative border-y border-border py-6">
          <Marquee pauseOnHover className="[--duration:28s]">
            {trust.map((t) => (
              <div key={t} className="mx-6 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ShieldCheck className="size-4 text-primary" /> {t}
              </div>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background" />
        </section>

        {/* FUNCIONES — Bento Grid */}
        <section id="funciones" className="mx-auto w-[min(1100px,92vw)] py-24">
          <BlurFade delay={0.05} inView>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">Todo lo que un contador necesita</h2>
              <p className="mt-4 text-muted-foreground">Una herramienta de escritorio para mantener tus comprobantes del SRI bajo control.</p>
            </div>
          </BlurFade>

          <BlurFade delay={0.12} inView>
            <BentoGrid className="mt-12 grid-cols-3 auto-rows-[16rem]">
              {features.map((f) => (
                <BentoCard
                  key={f.name}
                  name={f.name}
                  description={f.description}
                  Icon={f.Icon}
                  href="#descargar"
                  cta={f.cta}
                  className={f.className}
                  background={<div className={cn('absolute inset-0 bg-gradient-to-br opacity-60', f.grad)} />}
                />
              ))}
            </BentoGrid>
          </BlurFade>
        </section>

        {/* CTA FINAL */}
        <section className="mx-auto w-[min(1100px,92vw)] pb-28">
          <BlurFade delay={0.05} inView>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-8 py-16 text-center sm:py-20">
              <DotPattern className="[mask-image:radial-gradient(40rem_circle_at_center,white,transparent)] fill-primary/20" />
              <div className="relative">
                <h2 className="text-balance text-3xl font-bold sm:text-5xl">Empieza a auditar <AuroraText colors={['#F59E0B', '#8B5CF6']}>hoy mismo</AuroraText></h2>
                <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Instálalo en tu equipo y ten tus comprobantes del SRI bajo control en minutos.</p>
                <div className="mt-9 flex justify-center">
                  <ShimmerButton background="hsl(38 92% 50%)" shimmerColor="#1a1205" className="font-semibold text-[#1a1205]">
                    <Download className="size-4" /> Descargar ahora
                  </ShimmerButton>
                </div>
              </div>
              <BorderBeam size={260} duration={12} colorFrom="#F59E0B" colorTo="#8B5CF6" />
            </div>
          </BlurFade>
        </section>
      </main>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        © 2024 Audit Consulting · ROBOT AUDIT SRI — Hecho para profesionales contables del Ecuador.
      </footer>
    </div>
  );
}
