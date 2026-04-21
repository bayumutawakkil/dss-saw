import ProtectedPage from '@/components/ProtectedPage'

export default function TentangPage() {
  return (
    <ProtectedPage>
      <div className="p-8 max-w-5xl">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Tentang SPK SAW</h1>
          </div>
          <p className="text-lg text-slate-600 leading-relaxed">
            Sistem Penunjang Keputusan berbasis Simple Additive Weighting yang dirancang untuk membantu pengambilan keputusan objektif dengan menganalisis berbagai kriteria secara sistematis dan terukur.
          </p>
        </div>

        <div className="space-y-8">
          {/* Apa itu SPK */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Apa itu Sistem Penunjang Keputusan?</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Sistem Penunjang Keputusan (SPK) atau Decision Support System (DSS) adalah sistem berbasis komputer yang dirancang untuk membantu pengambilan keputusan dengan menyediakan analisis data, model bisnis, dan simulasi untuk mendukung proses pengambilan keputusan.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  SPK bertujuan untuk meningkatkan efektivitas pengambilan keputusan dengan memberikan informasi yang terstruktur, akurat, dan relevan. Sistem ini menggabungkan data, model analitis, dan pengetahuan untuk menghasilkan rekomendasi yang objektif.
                </p>
              </div>
            </div>
          </div>

          {/* Algoritma SAW */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Algoritma Simple Additive Weighting (SAW)</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Simple Additive Weighting (SAW) adalah metode pengambilan keputusan multi-kriteria yang paling sederhana namun sangat efektif. Metode ini mengalikan setiap nilai bobot dengan rating yang telah dinormalisasi dari setiap alternatif untuk setiap atribut, kemudian menjumlahkannya.
                </p>
                
                <div className="bg-slate-50 rounded-xl p-4 my-4 border border-slate-200">
                  <h3 className="font-semibold text-slate-800 mb-3">Keunggulan Metode SAW:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="inline-block w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center text-sm font-semibold text-emerald-700 flex-shrink-0">1</span>
                      <span className="text-slate-700">Mudah diimplementasikan dan dipahami oleh semua pengguna</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-block w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center text-sm font-semibold text-emerald-700 flex-shrink-0">2</span>
                      <span className="text-slate-700">Mampu mengakomodasi berbagai jumlah kriteria dan alternatif</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-block w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center text-sm font-semibold text-emerald-700 flex-shrink-0">3</span>
                      <span className="text-slate-700">Menghasilkan skor yang transparan dan dapat dilacak</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-block w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center text-sm font-semibold text-emerald-700 flex-shrink-0">4</span>
                      <span className="text-slate-700">Fleksibel dalam pembobotan kriteria sesuai preferensi</span>
                    </li>
                  </ul>
                </div>

                <h3 className="font-semibold text-slate-800 mb-3">Langkah-Langkah Perhitungan SAW:</h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-700">
                  <li><strong>Normalisasi Matriks Keputusan:</strong> Mengubah nilai raw data menjadi nilai normalisasi (0-1) untuk benefit: r_ij = x_ij / max(x_ij) dan cost: r_ij = min(x_ij) / x_ij</li>
                  <li><strong>Pembobotan:</strong> Mengalikan setiap nilai normalisasi dengan bobot kriteria yang telah ditetapkan</li>
                  <li><strong>Penjumlahan Terbobot:</strong> Menjumlahkan hasil perkalian untuk mendapatkan skor akhir setiap alternatif</li>
                  <li><strong>Ranking:</strong> Mengurutkan alternatif berdasarkan skor akhir dari tertinggi ke terendah</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Fitur Utama */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Fitur-Fitur Utama</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      judul: 'Kelola Kriteria',
                      desc: 'Tambah, edit, dan hapus kriteria penilaian dengan bobot yang dapat dikonfigurasi sesuai preferensi',
                    },
                    {
                      judul: 'Kelola Alternatif',
                      desc: 'Mengelola daftar lengkap alternatif atau opsi yang akan dievaluasi dalam sistem',
                    },
                    {
                      judul: 'Matriks Penilaian',
                      desc: 'Masukkan skor evaluasi untuk setiap kombinasi alternatif dan kriteria dalam format tabel interaktif',
                    },
                    {
                      judul: 'Laporan Hasil',
                      desc: 'Lihat detail lengkap perhitungan SAW dengan normalisasi, bobot, dan skor akhir',
                    },
                    {
                      judul: 'Leaderboard',
                      desc: 'Visualisasi ranking alternatif berdasarkan skor SAW dengan grafik yang mudah dipahami',
                    },
                    {
                      judul: 'Dashboard Ringkasan',
                      desc: 'Pantau statistik utama, status validasi bobot, dan peringkat teratas dalam satu layar',
                    },
                  ].map((fitur) => (
                    <div key={fitur.judul} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50 transition-all">
                      <h3 className="font-semibold text-slate-800 mb-2">{fitur.judul}</h3>
                      <p className="text-sm text-slate-600">{fitur.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stack Teknologi */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Stack Teknologi</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { nama: 'Next.js 14', desc: 'React Framework', icon: '⚛️' },
                { nama: 'TypeScript', desc: 'Type Safety', icon: '🔷' },
                { nama: 'Tailwind CSS', desc: 'Styling', icon: '🎨' },
                { nama: 'Supabase', desc: 'Backend', icon: '🗄️' },
                { nama: 'PostgreSQL', desc: 'Database', icon: '🐘' },
                { nama: 'React Hooks', desc: 'State Mgmt', icon: '🪝' },
                { nama: 'Vercel', desc: 'Hosting', icon: '▲' },
                { nama: 'Git', desc: 'Version Control', icon: '🌳' },
              ].map((tech) => (
                <div key={tech.nama} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200 hover:shadow-md transition-shadow">
                  <p className="text-sm font-bold text-slate-800 mb-1">{tech.nama}</p>
                  <p className="text-xs text-slate-600">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cara Penggunaan */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Cara Penggunaan</h2>
                <ol className="space-y-3">
                  {[
                    'Tentukan kriteria penilaian beserta bobot masing-masing. Pastikan total bobot = 1.00',
                    'Masukkan daftar alternatif yang ingin dievaluasi (misalnya: mata kuliah, produk, dll)',
                    'Isi matriks penilaian dengan skor untuk setiap kombinasi alternatif dan kriteria',
                    'Sistem akan secara otomatis menghitung normalisasi, bobot, dan skor akhir SAW',
                    'Lihat laporan lengkap dengan grafik dan visualisasi hasil ranking',
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-700 flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-slate-700 pt-0.5">{step}</p>
                    </div>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Kontak & Support */}
          <div className="bg-gradient-to-r from-blue-900 to-cyan-700 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-3">Punya Pertanyaan atau Masukan?</h2>
            <p className="text-blue-100 mb-6">
              Kami terus mengembangkan sistem ini untuk memberikan pengalaman terbaik dalam pengambilan keputusan. Jika Anda memiliki saran, pertanyaan, atau menemukan bug, silakan hubungi tim pengembang kami.
            </p>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-100">
                Hubungi: <span className="text-white font-semibold">support@spksaw.dev</span>
              </p>
              <p className="text-sm text-blue-200 mt-2">
                Respons time: Biasanya dalam 24 jam kerja
              </p>
            </div>
            <p className="text-xs text-blue-200 mt-8 pt-6 border-t border-white/10">
              © 2026 SPK SAW System. Semua hak dilindungi. Dikembangkan untuk pengambilan keputusan yang lebih baik dan lebih objektif.
            </p>
          </div>
        </div>
      </div>
    </ProtectedPage>
  )
}
