'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Kriteria, Alternatif, Penilaian } from '@/lib/supabase'
import ProtectedPage from '@/components/ProtectedPage'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import EmptyState from '@/components/ui/EmptyState'
import { useAuth } from '@/lib/auth-context'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'

export default function PenilaianPage() {
  const [kriteriaList, setKriteriaList] = useState<Kriteria[]>([])
  const [alternatifList, setAlternatifList] = useState<Alternatif[]>([])
  const [penilaianMap, setPenilaianMap] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

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
    setMessage(null)
    try {
      // Build upsert payload for all current scores
      const upserts = []
      for (const [key, nilai] of Object.entries(penilaianMap)) {
        const [altId, kriId] = key.split('-').map(Number)
        if (nilai > 0) {
          upserts.push({ alternatif_id: altId, kriteria_id: kriId, nilai })
        }
      }

      // Delete rows that are now zero/empty (removed by user)
      const activeKeys = new Set(
        upserts.map((u) => `${u.alternatif_id}-${u.kriteria_id}`)
      )
      const keysToDelete = Object.keys(penilaianMap).filter(
        (k) => !activeKeys.has(k)
      )
      for (const key of keysToDelete) {
        const [altId, kriId] = key.split('-').map(Number)
        await supabase
          .from('penilaian')
          .delete()
          .eq('alternatif_id', altId)
          .eq('kriteria_id', kriId)
      }

      // Upsert remaining scores atomically
      if (upserts.length > 0) {
        const { error } = await supabase
          .from('penilaian')
          .upsert(upserts, { onConflict: 'alternatif_id,kriteria_id' })
        if (error) throw error
      }

      setMessage({ type: 'success', text: 'Matriks penilaian berhasil disimpan!' })
      setTimeout(() => setMessage(null), 4000)
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Gagal menyimpan matriks penilaian' })
    } finally {
      setSaving(false)
    }
  }

  const canSave = alternatifList.length > 0 && kriteriaList.length > 0
  const { isGuest } = useAuth()

  return (
    <ProtectedPage>
      <PageHeader
        title="Matriks Penilaian"
        description="Input skor penilaian untuk setiap alternatif berdasarkan kriteria yang telah ditentukan"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Penilaian' },
        ]}
        icon={
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        }
      />

      <div className="px-4 md:px-8 pb-8">
        {message && (
          <div className="mb-6">
            <Alert
              type={message.type}
              message={message.text}
              onClose={() => setMessage(null)}
            />
          </div>
        )}

        {loading ? (
          <Card>
            <LoadingSkeleton count={4} height="md" />
          </Card>
        ) : !canSave ? (
          <Card>
            <EmptyState
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6H6m0 0H0m0 6h6m0 0h6" />
                </svg>
              }
              title="Data Tidak Lengkap"
              description={
                alternatifList.length === 0 ? 
                'Tambahkan mata kuliah terlebih dahulu' :
                'Tambahkan kriteria penilaian terlebih dahulu'
              }
            />
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-300">Petunjuk Input</p>
                  <p className="text-sm text-blue-800 dark:text-blue-400 mt-1">Masukkan skor evaluasi dari 0 hingga 5 untuk setiap kombinasi alternatif dan kriteria. Nilai akan digunakan untuk perhitungan normalisasi dan scoring SAW.</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">Tabel Matriks Keputusan (X)</h2>
                <p className="text-sm text-slate-600 mt-1">{alternatifList.length} alternatif × {kriteriaList.length} kriteria</p>
              </div>
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-56 bg-slate-50">
                        Alternatif
                      </th>
                      {kriteriaList.map((k) => (
                        <th key={k.id} className="px-3 py-4 text-center min-w-28 bg-slate-50">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xs font-bold text-slate-700">C{k.id}</span>
                            <span className="text-[10px] text-slate-500 font-normal break-words max-w-20">{k.nama_kriteria}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${k.jenis === 'benefit' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                              {k.bobot}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {alternatifList.map((alt) => (
                      <tr key={alt.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 font-semibold text-slate-800 bg-slate-50">
                          {alt.nama_mata_kuliah}
                        </td>
                        {kriteriaList.map((k) => {
                          const key = `${alt.id}-${k.id}`
                          const nilai = penilaianMap[key] || 0
                          return (
                            <td key={k.id} className="px-3 py-3 text-center">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="5"
                                value={nilai || ''}
                                onChange={(e) => handleChangeScore(alt.id, k.id, e.target.value)}
                                placeholder="0"
                                className="w-full px-2 py-1.5 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-center text-sm font-semibold text-slate-900 placeholder-slate-400 transition-all"
                              />
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                    
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
                {isGuest && (
                  <Alert
                    type="info"
                    message="Mode tamu hanya dapat melihat data. Login sebagai admin untuk menyimpan perubahan."
                  />
                )}
                <Button
                  onClick={handleSave}
                  loading={saving}
                  disabled={!canSave || isGuest}
                  size="lg"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  }
                >
                  Simpan Matriks Penilaian
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </ProtectedPage>
  )
}
