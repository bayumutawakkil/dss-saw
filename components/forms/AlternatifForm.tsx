'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Alternatif } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface AlternatifFormProps {
  onSuccess: () => void
  editingItem?: Alternatif | null
}

export default function AlternatifForm({ onSuccess, editingItem }: AlternatifFormProps) {
  const [namaMataKuliah, setNamaMataKuliah] = useState(editingItem?.nama_mata_kuliah || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!namaMataKuliah) {
        setError('Nama mata kuliah harus diisi')
        setLoading(false)
        return
      }

      if (editingItem) {
        // Update
        const { error: updateError } = await supabase
          .from('alternatif')
          .update({
            nama_mata_kuliah: namaMataKuliah,
          })
          .eq('id', editingItem.id)

        if (updateError) throw updateError
      } else {
        // Create
        const { error: insertError } = await supabase
          .from('alternatif')
          .insert({
            nama_mata_kuliah: namaMataKuliah,
          })

        if (insertError) throw insertError
      }

      setNamaMataKuliah('')
      onSuccess()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal menyimpan data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        {editingItem ? 'Edit Alternatif' : 'Tambah Alternatif Baru'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nama Mata Kuliah</label>
          <input
            type="text"
            value={namaMataKuliah}
            onChange={(e) => setNamaMataKuliah(e.target.value)}
            placeholder="Masukkan nama mata kuliah"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">{error}</div>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            {loading ? (editingItem ? 'Updating...' : 'Menambah...') : editingItem ? 'Update' : 'Tambah'}
          </button>
        </div>
      </div>
    </form>
  )
}
