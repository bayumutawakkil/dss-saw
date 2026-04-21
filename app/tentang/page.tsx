export default function TentangPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Tentang Kami</h1>
        <p className="text-slate-500 mt-1 text-sm">Informasi aplikasi dan pengembang</p>
      </div>

      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">SPK SAW — Sistem Penunjang Keputusan</h2>
              <p className="text-xs text-slate-400">Versi 1.0.0</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Aplikasi ini dikembangkan untuk membantu pengambilan keputusan akademik menggunakan
            metode <strong>Simple Additive Weighting (SAW)</strong>. Tujuan utamanya adalah meranking
            mata kuliah berdasarkan performa semester sehingga dapat memberikan rekomendasi yang
            objektif dan terukur.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Stack Teknologi</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { nama: 'Next.js 14', desc: 'App Router + Server Components', color: 'bg-black text-white' },
              { nama: 'Tailwind CSS', desc: 'Utility-first CSS framework', color: 'bg-sky-500 text-white' },
              { nama: 'Supabase', desc: 'PostgreSQL Backend-as-a-Service', color: 'bg-emerald-500 text-white' },
              { nama: 'TypeScript', desc: 'Type-safe JavaScript', color: 'bg-blue-600 text-white' },
            ].map((tech) => (
              <div key={tech.nama} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${tech.color}`}>{tech.nama}</span>
                <span className="text-xs text-slate-500">{tech.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Kriteria SAW yang Digunakan</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-indigo-600 w-8">C1</span>
              <span>Range Nilai Semester 3 — Bobot: <strong>0.5</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-indigo-600 w-8">C2</span>
              <span>Range Kesulitan — Bobot: <strong>0.2</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-indigo-600 w-8">C3</span>
              <span>Bobot SKS — Bobot: <strong>0.3</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
