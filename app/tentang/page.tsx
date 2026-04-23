import ProtectedPage from '@/components/ProtectedPage'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'

const developers = [
  {
    name: 'Nama Pengembang 1',
    role: 'Full Stack Developer',
    nim: '2210000001',
    avatar: '1',
    color: 'bg-indigo-100 dark:bg-indigo-900/40',
    textColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    name: 'Nama Pengembang 2',
    role: 'UI/UX Designer',
    nim: '2210000002',
    avatar: '2',
    color: 'bg-emerald-100 dark:bg-emerald-900/40',
    textColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    name: 'Nama Pengembang 3',
    role: 'Backend Developer',
    nim: '2210000003',
    avatar: '3',
    color: 'bg-amber-100 dark:bg-amber-900/40',
    textColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    name: 'Nama Pengembang 4',
    role: 'Database Engineer',
    nim: '2210000004',
    avatar: '4',
    color: 'bg-purple-100 dark:bg-purple-900/40',
    textColor: 'text-purple-600 dark:text-purple-400',
  },
]

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

export default function TentangPage() {
  return (
    <ProtectedPage>
      <PageHeader
        title="Tentang SPK SAW"
        description="Sistem Penunjang Keputusan berbasis Simple Additive Weighting untuk pengambilan keputusan yang objektif dan terukur."
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Tentang' },
        ]}
        icon={
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      <div className="px-4 md:px-6 pb-8 space-y-6">

        {/* Apa itu SPK */}
        <Card>
          <SectionHeader
            icon={
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            }
            title="Apa itu Sistem Penunjang Keputusan?"
            subtitle="Tentang DSS dan tujuannya"
          />
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              Sistem Penunjang Keputusan (SPK) atau <strong className="text-slate-800 dark:text-slate-200">Decision Support System (DSS)</strong> adalah sistem berbasis komputer yang dirancang untuk membantu pengambilan keputusan dengan menyediakan analisis data, model bisnis, dan simulasi.
            </p>
            <p>
              SPK bertujuan meningkatkan efektivitas pengambilan keputusan dengan memberikan informasi yang terstruktur, akurat, dan relevan — menggabungkan data, model analitis, dan pengetahuan untuk menghasilkan rekomendasi yang objektif.
            </p>
          </div>
        </Card>

        {/* Algoritma SAW */}
        <Card>
          <SectionHeader
            icon={
              <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            }
            title="Algoritma Simple Additive Weighting (SAW)"
            subtitle="Metode perhitungan yang digunakan"
          />

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
            SAW adalah metode pengambilan keputusan multi-kriteria yang sederhana namun efektif — mengalikan setiap nilai bobot dengan rating yang telah dinormalisasi, kemudian menjumlahkannya untuk menghasilkan skor akhir.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Keunggulan */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800">
              <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-3">Keunggulan Metode SAW</h3>
              <ul className="space-y-2">
                {[
                  'Mudah diimplementasikan dan dipahami',
                  'Mendukung banyak kriteria dan alternatif',
                  'Skor transparan dan dapat dilacak',
                  'Pembobotan fleksibel sesuai preferensi',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Langkah */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Langkah Perhitungan</h3>
              <ol className="space-y-2">
                {[
                  { label: 'Normalisasi', desc: 'Benefit: xij / max — Cost: min / xij' },
                  { label: 'Pembobotan', desc: 'Kalikan normalisasi × bobot kriteria' },
                  { label: 'Penjumlahan', desc: 'Jumlahkan semua hasil perkalian' },
                  { label: 'Ranking', desc: 'Urutkan dari skor tertinggi' },
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-700 dark:text-slate-200">{step.label}:</strong> {step.desc}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Card>

        {/* Fitur Utama */}
        <Card>
          <SectionHeader
            icon={
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            }
            title="Fitur-Fitur Utama"
            subtitle="Apa saja yang bisa dilakukan di sistem ini"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { judul: 'Kelola Kriteria', desc: 'Tambah, edit, dan hapus kriteria dengan bobot yang dapat dikonfigurasi' },
              { judul: 'Kelola Alternatif', desc: 'Mengelola daftar alternatif yang akan dievaluasi dalam sistem' },
              { judul: 'Matriks Penilaian', desc: 'Input skor evaluasi untuk setiap kombinasi alternatif dan kriteria' },
              { judul: 'Laporan Hasil', desc: 'Detail lengkap perhitungan SAW dengan normalisasi dan skor akhir' },
              { judul: 'Leaderboard', desc: 'Visualisasi ranking alternatif berdasarkan skor SAW' },
              { judul: 'Dashboard', desc: 'Pantau statistik utama, status bobot, dan peringkat teratas' },
            ].map((fitur) => (
              <div key={fitur.judul} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600 hover:border-amber-200 dark:hover:border-amber-700 transition-colors">
                <h3 className="text-sm font-semibold text-slate-800">{fitur.judul}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">{fitur.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Stack Teknologi */}
        <Card>
          <SectionHeader
            icon={
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
            }
            title="Stack Teknologi"
            subtitle="Teknologi yang digunakan dalam pengembangan"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { nama: 'Next.js 14', desc: 'React Framework' },
              { nama: 'TypeScript', desc: 'Type Safety' },
              { nama: 'Tailwind CSS', desc: 'Styling' },
              { nama: 'Supabase', desc: 'Backend & Auth' },
              { nama: 'PostgreSQL', desc: 'Database' },
              { nama: 'React Hooks', desc: 'State Mgmt' },
              { nama: 'Vercel', desc: 'Hosting' },
              { nama: 'Git', desc: 'Version Control' },
            ].map((tech) => (
              <div key={tech.nama} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{tech.nama}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Cara Penggunaan */}
        <Card>
          <SectionHeader
            icon={
              <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            }
            title="Cara Penggunaan"
            subtitle="Langkah-langkah menggunakan sistem"
          />
          <ol className="space-y-3">
            {[
              { step: 'Tentukan kriteria penilaian beserta bobot masing-masing. Pastikan total bobot = 1.00' },
              { step: 'Masukkan daftar alternatif yang ingin dievaluasi (misalnya: mata kuliah, produk, dll)' },
              { step: 'Isi matriks penilaian dengan skor untuk setiap kombinasi alternatif dan kriteria' },
              { step: 'Sistem akan otomatis menghitung normalisasi, bobot, dan skor akhir SAW' },
              { step: 'Lihat laporan lengkap dan visualisasi hasil ranking di halaman Laporan & Leaderboard' },
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-xs font-bold text-purple-700 dark:text-purple-300 flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-0.5">{item.step}</p>
              </li>
            ))}
          </ol>
        </Card>

        {/* Tim Pengembang */}
        <Card>
          <SectionHeader
            icon={
              <div className="w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            }
            title="Tim Pengembang"
            subtitle="Dikembangkan oleh mahasiswa Universitas Andalas"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {developers.map((dev, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40"
              >
                <div className={`w-12 h-12 rounded-xl ${dev.color} flex items-center justify-center text-xl flex-shrink-0`}>
                  {dev.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{dev.name}</p>
                  <p className={`text-xs font-medium mt-0.5 ${dev.textColor}`}>{dev.role}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-mono">{dev.nim}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Kontak */}
        <div className="bg-gradient-to-r from-blue-900 to-cyan-700 rounded-2xl p-6 md:p-8 text-white">
          <h2 className="text-lg font-bold mb-2">Punya Pertanyaan atau Masukan?</h2>
          <p className="text-blue-100 text-sm mb-5 leading-relaxed">
            Kami terus mengembangkan sistem ini. Jika Anda memiliki saran, pertanyaan, atau menemukan bug, silakan hubungi tim pengembang kami.
          </p>
          <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-2">
            <svg className="w-4 h-4 text-blue-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-blue-100">support@spksaw.dev</span>
            <span className="hidden sm:block text-blue-400">·</span>
            <span className="text-xs text-blue-300">Respons dalam 24 jam kerja</span>
          </div>
          <p className="text-xs text-blue-300/60 mt-5 pt-4 border-t border-white/10">
            © 2026 SPK SAW System · Universitas Andalas
          </p>
        </div>

      </div>
    </ProtectedPage>
  )
}
