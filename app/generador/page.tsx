"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Wand2, Copy, Check, RefreshCw, ChevronDown, Linkedin, Mail, MessageCircle } from "lucide-react";

const variaciones = [
  {
    id: 1,
    tipo: "Principal",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    mensaje: `Hola Carlos,

Vi que Grupo Industrial Monterrey está expandiendo sus operaciones en el norte de México — felicitaciones por el crecimiento.

Me comunico porque trabajamos con empresas manufactureras como la suya para reducir costos operativos entre un 18-30% mediante optimización inteligente de procesos y automatización de cadena de suministro.

Recientemente ayudamos a una empresa similar a eliminar 2.4 horas de trabajo manual diario por operador, lo que representó un ahorro de $1.2M USD anuales.

¿Tendría 20 minutos esta semana para mostrarle los resultados específicos que logramos en empresas de su sector?

Saludos,
[Tu nombre]`,
  },
  {
    id: 2,
    tipo: "Concisa",
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    mensaje: `Carlos, buen día.

Soy [nombre] de [empresa]. Trabajamos con directores generales en manufactura para reducir costos operativos 18-30% con IA.

Un cliente similar ahorró $1.2M USD el año pasado.

¿15 minutos esta semana para contarle cómo?`,
  },
  {
    id: 3,
    tipo: "Con prueba social",
    badge: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    mensaje: `Estimado Carlos,

Empresas manufactureras como Aceros del Norte y ProducciónMx confían en nuestra plataforma para optimizar su cadena de suministro. En promedio, sus directores reportan 23% de reducción en costos en los primeros 90 días.

Dado el tamaño y trayectoria de Grupo Industrial Monterrey, creo que podríamos generar resultados similares o superiores.

¿Le parece si agendamos una llamada rápida para explorar si hay fit? Tengo disponibilidad el martes o miércoles de la próxima semana.`,
  },
];

const cargos = ["CEO", "CFO", "Director de Operaciones", "Director General", "VP Tecnología", "Gerente de Compras", "Director Comercial"];
const industrias = ["Manufactura", "Logística", "Salud", "Construcción", "Tecnología", "Distribución", "Farmacéutica"];
const tonos = ["Profesional", "Casual", "Directo", "Consultivo"];
const canales = ["LinkedIn", "Email", "WhatsApp"];

export default function GeneradorPage() {
  const [form, setForm] = useState({
    empresa: "Grupo Industrial Monterrey",
    cargo: "CEO",
    industria: "Manufactura",
    propuesta: "Reducción de costos operativos 18-30% mediante automatización inteligente de procesos de manufactura y optimización de cadena de suministro con IA",
    tono: "Profesional",
    canal: "LinkedIn",
  });
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [activeVar, setActiveVar] = useState(0);

  const handleGenerate = () => {
    setLoading(true);
    setGenerated(false);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 1800);
  };

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const canalIcons: Record<string, React.ElementType> = { LinkedIn: Linkedin, Email: Mail, WhatsApp: MessageCircle };
  const CanalIcon = canalIcons[form.canal] || Linkedin;

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Generador de Mensajes</h1>
          <p className="text-slate-400 mt-1">Crea mensajes de outreach personalizados con IA en segundos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Form */}
          <div className="bg-[#0d1428] border border-slate-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">1</div>
              Configura el mensaje
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">Empresa objetivo</label>
                <input
                  type="text"
                  value={form.empresa}
                  onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Nombre de la empresa"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1.5">Cargo del contacto</label>
                  <div className="relative">
                    <select
                      value={form.cargo}
                      onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                      className="w-full appearance-none bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 pr-8 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    >
                      {cargos.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1.5">Industria</label>
                  <div className="relative">
                    <select
                      value={form.industria}
                      onChange={(e) => setForm({ ...form, industria: e.target.value })}
                      className="w-full appearance-none bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 pr-8 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    >
                      {industrias.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">Propuesta de valor principal</label>
                <textarea
                  value={form.propuesta}
                  onChange={(e) => setForm({ ...form, propuesta: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Describe el beneficio principal que ofreces..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1.5">Tono</label>
                  <div className="relative">
                    <select
                      value={form.tono}
                      onChange={(e) => setForm({ ...form, tono: e.target.value })}
                      className="w-full appearance-none bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 pr-8 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    >
                      {tonos.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1.5">Canal</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {canales.map((canal) => {
                      const Icon = canalIcons[canal] || Linkedin;
                      return (
                        <button
                          key={canal}
                          onClick={() => setForm({ ...form, canal })}
                          className={`flex flex-col items-center gap-1 py-2 rounded-lg text-xs transition-all border ${
                            form.canal === canal
                              ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                              : "bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-300 hover:border-slate-600"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {canal}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-60 text-white py-3 rounded-lg text-sm font-semibold transition-all duration-200 mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generando con IA...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generar mensaje
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-[#0d1428] border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">2</div>
                Variaciones generadas
              </h2>
              <div className="flex items-center gap-1.5 bg-slate-800 rounded-lg p-1">
                <CanalIcon className="w-3.5 h-3.5 text-slate-400 ml-1" />
                <span className="text-slate-400 text-xs pr-1">{form.canal}</span>
              </div>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
                  <Wand2 className="w-5 h-5 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-slate-400 text-sm animate-pulse">Analizando contexto y generando mensajes...</div>
              </div>
            )}

            {!loading && generated && (
              <div className="space-y-4">
                {/* Tabs */}
                <div className="flex gap-2">
                  {variaciones.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => setActiveVar(i)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        activeVar === i ? v.badge : "bg-transparent border-slate-700 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {v.tipo}
                    </button>
                  ))}
                </div>

                {/* Message Content */}
                <div className="relative bg-slate-800/40 border border-slate-700 rounded-xl p-5">
                  <button
                    onClick={() => handleCopy(variaciones[activeVar].id, variaciones[activeVar].mensaje)}
                    className="absolute top-3 right-3 flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    {copiedId === variaciones[activeVar].id ? (
                      <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> Copiar</>
                    )}
                  </button>
                  <pre className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans pr-20">
                    {variaciones[activeVar].mensaje}
                  </pre>
                </div>

                {/* Tips */}
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-blue-400 text-xs font-medium mb-2">Sugerencias de IA</p>
                  <ul className="text-slate-400 text-xs space-y-1">
                    <li>• Personaliza [Tu nombre] con tu nombre real antes de enviar</li>
                    <li>• El mejor horario para LinkedIn es martes-jueves 9-11am</li>
                    <li>• Haz seguimiento después de 5 días si no hay respuesta</li>
                  </ul>
                </div>
              </div>
            )}

            {!loading && !generated && (
              <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                <Wand2 className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">Configura los parámetros y haz clic en "Generar mensaje"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
