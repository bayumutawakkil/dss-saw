import { supabase } from '@/lib/supabase'
import type { Alternatif } from '@/lib/supabase'

async function getAlternatif(): Promise<Alternatif[]> {
  const { data, error } = await supabase.from('alternatif').select('*').order('id')
  if (error) throw error
  return data ?? []
}

export default async function AlternatifPage() {
  const alternatifList = await getAlternatif()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Kelola Alternatif</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Daftar mata kuliah yang akan dievaluasi menggunakan metode SAW
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Daftar Mata Kuliah</h2>
          <span className="text-xs text-slate-400">{alternatifList.length} mata kuliah</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left">
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">ID</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Mata Kuliah</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Kode</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {alternatifList.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4 font-mono text-xs text-slate-400">A{a.id}</td>
                <td className="px-5 py-4 font-medium text-slate-800">{a.nama_mata_kuliah}</td>
                <td className="px-5 py-4 text-center">
                  <span className="inline-block bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg px-3 py-1 text-xs font-mono font-semibold">
                    MK-{String(a.id).padStart(3, '0')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
