'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Kriteria, Alternatif, Penilaian } from '@/lib/supabase'
import ProtectedPage from '@/components/ProtectedPage'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function PenilaianPage() {
  const [kriteriaList, setKriteriaList] = useState<Kriteria[]>([])
  const [alternatifList, setAlternatifList] = useState<Alternatif[]>([])
  const [penilaianMap, setPenilaianMap] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const loadData = async () => {
    setLoading(true)
    try {
      const [{ data: kriteria }, { data: alternatif }, { data: penilaian }] = await Promise.all([
        supabase.from('kriteria').select('*').order('id'),
        supabase.from('alternatif').select('*').order('id'),
        supabase.from('penilaian').select('*'),
      ])

      setKriteriaList(kriteria ?? [])
      setAlternatifList(alternatif ?? [])

      // Build map of existing scores
      const map: Record<string, number> = {}
      ;(penilaian ?? []).forEach((p: Penilaian) => {
        map[`${p.alternatif_id}-${p.kriteria_id}`] = p.nilai
      })
      setPenilaianMap(map)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleChangeScore = (altId: number, kriId: number, value: string) => {
    const key = `${altId}-${kriId}`
    const numValue = parseFloat(value) || 0
    setPenilaianMap({
      ...penilaianMap,
      [key]: numValue,
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      // First delete all existing penilaian
      await supabase.from('penilaian').delete().gt('id', 0)

      // Then insert all current scores
      const inserts = []
      for (const [key, nilai] of Object.entries(penilaianMap)) {
        const [altId, kriId] = key.split('-').map(Number)
        if (nilai > 0) {
          inserts.push({
            alternatif_id: altId,
            kriteria_id: kriId,
            nilai,
          })
        }
      }

      if (inserts.length > 0) {
        const { error } = await supabase.from('penilaian').insert(inserts)
        if (error) throw error
      }

      setMessage('✓ Matriks berhasil disimpan')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error(err)
      setMessage('✗ Gagal menyimpan matriks')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <ProtectedPage>
        <div className="p-8 text-center">Loading...</div>
      </ProtectedPage>
    )
  }

  return (
    <ProtectedPage>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Matriks Keputusan</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Berikan skor evaluasi (skala 1-5) untuk setiap alternatif berdasarkan parameter kriteria.
          </p>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm border ${
            message.includes('✓') 
              ? 'bg-green-100 text-green-700 border-green-300' 
              : 'bg-red-100 text-red-700 border-red-300'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-40">
                    Alternatif
                  </th>
                  {kriteriaList.map((k) => (
                    <th key={k.id} className="px-4 py-3 text-center">
                      <div>
                        <p className="text-xs font-bold text-slate-600">C{k.id}</p>
                        <p className="text-[10px] text-slate-500 font-normal truncate max-w-24">{k.nama_kriteria}</p>
                        <p className="text-[10px] font-semibold text-indigo-500">W: {k.bobot}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alternatifList.map((alt) => (
                  <tr key={alt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {alt.nama_mata_kuliah}
                    </td>
                    {kriteriaList.map((k) => {
                      const key = `${alt.id}-${k.id}`
                      const nilai = penilaianMap[key] || 0
                      return (
                        <td key={k.id} className="px-4 py-3 text-center">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="5"
                            value={nilai}
                            onChange={(e) => handleChangeScore(alt.id, k.id, e.target.value)}
                            className="w-24 px-2 py-1 border border-slate-300 rounded text-center text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="0"
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
          >
            {saving ? 'Menyimpan...' : 'Simpan Matriks'}
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-400 max-w-2xl">
          * Masukkan skor untuk setiap alternatif pada kriteria yang sesuai (skala 1-5). Nilai akan digunakan untuk perhitungan normalisasi dan scoring SAW.
        </p>
      </div>
    </ProtectedPage>
  )
}
