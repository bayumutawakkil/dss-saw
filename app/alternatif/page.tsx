'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Alternatif } from '@/lib/supabase'
import AlternatifForm from '@/components/forms/AlternatifForm'
import ProtectedPage from '@/components/ProtectedPage'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AlternatifPage() {
  const [alternatifList, setAlternatifList] = useState<Alternatif[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Alternatif | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const loadAlternatif = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('alternatif').select('*').order('id')
      if (error) throw error
      setAlternatifList(data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAlternatif()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin hapus alternatif ini?')) return
    
    setDeletingId(id)
    try {
      const { error } = await supabase.from('alternatif').delete().eq('id', id)
      if (error) throw error
      await loadAlternatif()
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus data')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <ProtectedPage>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Kelola Alternatif</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Daftar mata kuliah yang akan dievaluasi menggunakan metode SAW
          </p>
        </div>

        {/* Form Tambah/Edit */}
        <AlternatifForm
          onSuccess={() => {
            loadAlternatif()
            setEditingItem(null)
          }}
          editingItem={editingItem}
        />

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
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : alternatifList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                    Belum ada data alternatif
                  </td>
                </tr>
              ) : (
                alternatifList.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-slate-400">A{a.id}</td>
                    <td className="px-5 py-4 font-medium text-slate-800">{a.nama_mata_kuliah}</td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-block bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg px-3 py-1 text-xs font-mono font-semibold">
                        MK-{String(a.id).padStart(3, '0')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => setEditingItem(a)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-xs font-semibold transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          disabled={deletingId === a.id}
                          className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 rounded text-xs font-semibold transition"
                        >
                          {deletingId === a.id ? 'Hapus...' : 'Hapus'}
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
