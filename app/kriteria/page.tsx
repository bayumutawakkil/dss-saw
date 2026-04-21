'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Kriteria } from '@/lib/supabase'
import KriteriaForm from '@/components/forms/KriteriaForm'
import ProtectedPage from '@/components/ProtectedPage'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function KriteriaPage() {
  const [kriteriaList, setKriteriaList] = useState<Kriteria[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Kriteria | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const loadKriteria = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('kriteria').select('*').order('id')
      if (error) throw error
      setKriteriaList(data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadKriteria()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin hapus kriteria ini?')) return
    
    setDeletingId(id)
    try {
      const { error } = await supabase.from('kriteria').delete().eq('id', id)
      if (error) throw error
      await loadKriteria()
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus data')
    } finally {
      setDeletingId(null)
    }
  }

  const totalBobot = kriteriaList.reduce((sum, k) => sum + k.bobot, 0)

  return (
    <ProtectedPage>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Kelola Kriteria</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Daftar kriteria dan bobot yang digunakan dalam perhitungan SAW
            </p>
          </div>
        </div>

        {/* Form Tambah/Edit */}
        <KriteriaForm 
          onSuccess={() => {
            loadKriteria()
            setEditingItem(null)
          }}
          editingItem={editingItem}
        />

        {/* Validasi total bobot */}
        <div className={`mb-5 rounded-xl px-5 py-4 flex items-center gap-3 border ${
          Math.abs(totalBobot - 1) < 0.001
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-amber-50 border-amber-200'
        }`}>
          <svg className={`w-5 h-5 shrink-0 ${Math.abs(totalBobot - 1) < 0.001 ? 'text-emerald-500' : 'text-amber-500'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p className={`text-sm font-medium ${Math.abs(totalBobot - 1) < 0.001 ? 'text-emerald-700' : 'text-amber-700'}`}>
            Total bobot semua kriteria:{' '}
            <strong>{totalBobot.toFixed(2)}</strong>
            {Math.abs(totalBobot - 1) < 0.001
              ? ' — Valid (jumlah bobot = 1.0)'
              : ' — Perhatian: jumlah bobot harus = 1.0'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Daftar Kriteria</h2>
            <span className="text-xs text-slate-400">{kriteriaList.length} kriteria</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-12">ID</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Kriteria</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Bobot (W)</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Jenis</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Proporsi</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : kriteriaList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    Belum ada data kriteria
                  </td>
                </tr>
              ) : (
                kriteriaList.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 text-slate-400 font-mono text-xs">C{k.id}</td>
                    <td className="px-5 py-4 font-medium text-slate-800">{k.nama_kriteria}</td>
                    <td className="px-5 py-4 text-center font-mono font-semibold text-indigo-600">{k.bobot}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        k.jenis === 'benefit'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {k.jenis === 'benefit' ? 'Benefit' : 'Cost'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-indigo-500 transition-all"
                            style={{ width: `${k.bobot * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 w-10 text-right">{(k.bobot * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => setEditingItem(k)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-xs font-semibold transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(k.id)}
                          disabled={deletingId === k.id}
                          className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 rounded text-xs font-semibold transition"
                        >
                          {deletingId === k.id ? 'Hapus...' : 'Hapus'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedPage>
  )
}
