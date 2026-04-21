import ProtectedPage from '@/components/ProtectedPage'

export default function TentangPage() {
  return (
    <ProtectedPage>
      <div className="p-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              Tentang Aplikasi
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Sistem Penunjang Keputusan SAW</h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Sistem ini dirancang untuk memberikan rekomendasi pemilihan alternatif terbaik. Dibangun menggunakan algoritma matematis <strong>Simple Additive Weighting (SAW)</strong>, sistem ini mengukur berbagai kriteria untuk menghasilkan leaderboard yang objektif.
          </p>
        </div>

        <div className="space-y-6">
          {/* Tentang Aplikasi */}
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
              Aplikasi ini dikembangkan untuk membantu pengambilan keputusan menggunakan metode <strong>Simple Additive Weighting (SAW)</strong>. Tujuan utamanya adalah memberikan rekomendasi yang objektif dan terukur berdasarkan multiple criteria decision making (MCDM).
            </p>
          </div>

          {/* Fitur Utama */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-800 mb-4">Fitur Utama</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  judul: 'Kelola Kriteria',
                  desc: 'Tambah, edit, dan hapus kriteria beserta bobot penilaiannya secara dinamis',
                  icon: '⚙️',
                },
                {
                  judul: 'Kelola Alternatif',
                  desc: 'Atur daftar alternatif/opsi yang akan dievaluasi dalam sistem',
                  icon: '📋',
                },
                {
                  judul: 'Matriks Penilaian',
                  desc: 'Masukkan skor untuk setiap alternatif pada masing-masing kriteria',
                  icon: '📊',
                },
                {
                  judul: 'Laporan Hasil',
                  desc: 'Lihat hasil perhitungan SAW dengan detail normalisasi dan final score',
                  icon: '📈',
                },
              ].map((fitur) => (
                <div key={fitur.judul} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-2xl">{fitur.icon}</div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">{fitur.judul}</h4>
                    <p className="text-xs text-slate-600 mt-1">{fitur.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stack Teknologi */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-800 mb-4">Stack Teknologi</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { nama: 'Next.js 14', desc: 'React Framework', color: 'bg-black text-white' },
                { nama: 'TypeScript', desc: 'Type Safety', color: 'bg-blue-600 text-white' },
                { nama: 'Tailwind CSS', desc: 'Styling', color: 'bg-cyan-500 text-white' },
                { nama: 'Supabase', desc: 'Backend', color: 'bg-emerald-600 text-white' },
              ].map((tech) => (
                <div key={tech.nama} className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                  <p className={`text-xs font-bold px-2 py-1 rounded-lg ${tech.color} inline-block`}>
                    {tech.nama}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Algoritma SAW */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-800 mb-4">Algoritma Simple Additive Weighting (SAW)</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p>
                SAW merupakan salah satu metode pengambilan keputusan multi-kriteria yang paling sederhana dan paling sering digunakan. Langkah-langkahnya:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li><strong>Normalisasi Matriks:</strong> Ubah nilai mentah menjadi nilai normalisasi (0-1)</li>
                <li><strong>Pembobotan:</strong> Kalikan setiap nilai normalisasi dengan bobot kriteria</li>
                <li><strong>Penjumlahan:</strong> Jumlahkan semua hasil perkalian untuk mendapat skor akhir</li>
                <li><strong>Ranking:</strong> Urutkan alternatif berdasarkan skor akhir tertinggi</li>
              </ol>
            </div>
          </div>

          {/* Kontak & Support */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 p-6">
            <h3 className="text-base font-bold text-slate-800 mb-2">Pertanyaan atau Umpan Balik?</h3>
            <p className="text-sm text-slate-600 mb-4">
              Kami terus mengembangkan sistem ini untuk memberikan pengalaman terbaik. Jika Anda memiliki saran atau menemukan bug, silakan hubungi tim pengembang.
            </p>
            <p className="text-xs text-slate-500">
              © 2026 SPK SAW System — Semua hak dilindungi. Dikembangkan dengan ❤️ untuk pengambilan keputusan yang lebih baik.
            </p>
          </div>
        </div>
      </div>
    </ProtectedPage>
  )
}
