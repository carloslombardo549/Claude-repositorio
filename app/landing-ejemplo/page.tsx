"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight, Star, Shield, Zap, TrendingUp, Users, Clock } from "lucide-react";

const valueProps = [
  {
    icon: TrendingUp,
    title: "Reducción de costos 18-30%",
    desc: "Optimizamos tus procesos logísticos con IA para eliminar desperdicios y reducir costos operativos significativamente.",
  },
  {
    icon: Clock,
    title: "Resultados en 90 días",
    desc: "Nuestra metodología probada garantiza mejoras visibles y medibles en los primeros tres meses de implementación.",
  },
  {
    icon: Zap,
    title: "Automatización inteligente",
    desc: "Digitalizamos y automatizamos tus cadenas de suministro con tecnología de punta adaptada a tu industria.",
  },
  {
    icon: Shield,
    title: "Sin riesgo",
    desc: "Evaluación inicial gratuita. Si no identificamos ahorros potenciales, no hay costo para tu empresa.",
  },
];

const testimonials = [
  {
    quote: "Redujimos 2.4 horas de trabajo manual por operador al día. El ROI fue evidente desde el primer mes.",
    name: "Ing. Roberto Sandoval",
    cargo: "Director de Operaciones",
    empresa: "Aceros del Norte SA",
    iniciales: "RS",
    color: "from-blue-500 to-blue-700",
  },
  {
    quote: "La plataforma nos permitió tener visibilidad completa de nuestra cadena de suministro por primera vez.",
    name: "Lic. Carmen Villanueva",
    cargo: "CFO",
    empresa: "Grupo LogiMex",
    iniciales: "CV",
    color: "from-emerald-500 to-emerald-700",
  },
];

export default function LandingEjemplo() {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", empresa: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">OptimIA Supply</span>
          </div>
          <a
            href="#contacto"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Solicitar evaluación gratuita
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Mensaje personalizado para su empresa
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">
            Descubra cómo{" "}
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              [Empresa]
            </span>{" "}
            puede optimizar su cadena de suministro en 90 días
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Empresas manufactureras y logísticas como la suya están reduciendo costos operativos entre un
            <strong className="text-white"> 18% y 30%</strong> con nuestra plataforma de optimización con IA.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#contacto"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-base font-bold transition-all hover:scale-105 shadow-lg shadow-blue-500/20"
            >
              Ver mi evaluación gratuita
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#beneficios"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-base font-medium transition-colors border border-white/20"
            >
              Conocer más
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-gray-50 border-y border-gray-200 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-gray-400 text-sm mb-6 uppercase tracking-widest font-medium">
            Empresas que ya confían en nosotros
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10">
            {["Aceros del Norte", "Grupo LogiMex", "ProducciónMx", "Cadena Fría Plus", "TechSoluciones MX"].map((empresa) => (
              <div key={empresa} className="text-gray-400 font-bold text-sm tracking-wide">
                {empresa.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section id="beneficios" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              ¿Por qué elegir OptimIA Supply?
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              No somos una consultoría tradicional. Somos una plataforma tecnológica que genera resultados reales y medibles.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {valueProps.map((vp, i) => {
              const Icon = vp.icon;
              return (
                <div
                  key={i}
                  className="flex gap-4 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{vp.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{vp.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 px-6 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "+120", label: "Empresas optimizadas" },
              { value: "24%", label: "Reducción promedio de costos" },
              { value: "$48M", label: "USD ahorrados para clientes" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-black mb-2">{stat.value}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-12">
            Lo que dicen nuestros clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold`}>
                    {t.iniciales}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.cargo} · {t.empresa}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Form */}
      <section id="contacto" className="py-20 px-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              Solicite su evaluación gratuita
            </h2>
            <p className="text-gray-500">
              Sin compromiso. En 48 horas le presentamos un diagnóstico personalizado con los ahorros potenciales para su empresa.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">¡Solicitud recibida!</h3>
              <p className="text-gray-500">
                Un especialista se comunicará con usted en las próximas 24-48 horas para coordinar su diagnóstico gratuito.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {[
                  { key: "nombre", label: "Nombre completo", placeholder: "Ej: Carlos Mendoza", type: "text" },
                  { key: "empresa", label: "Empresa", placeholder: "Ej: Grupo Industrial Monterrey", type: "text" },
                  { key: "email", label: "Correo electrónico", placeholder: "correo@empresa.com", type: "email" },
                  { key: "telefono", label: "Teléfono / WhatsApp", placeholder: "+52 81 1234 5678", type: "tel" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-gray-700 text-sm font-medium mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      required
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2"
              >
                Solicitar diagnóstico gratuito
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-gray-400 text-xs text-center">
                Al enviar acepta nuestra política de privacidad. Sus datos son confidenciales.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-6 text-center text-sm">
        <p>© 2025 OptimIA Supply · Todos los derechos reservados · México</p>
        <p className="mt-1 text-slate-600 text-xs">Esta es una landing page de demostración generada por ACAI</p>
      </footer>
    </div>
  );
}
