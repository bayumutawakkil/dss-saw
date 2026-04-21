'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Kriteria } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface KriteriaFormProps {
  onSuccess: () => void
  editingItem?: Kriteria | null
}

export default function KriteriaForm({ onSuccess, editingItem }: KriteriaFormProps) {
  const [namaKriteria, setNamaKriteria] = useState(editingItem?.nama_kriteria || '')
  const [bobot, setBobot] = useState(editingItem?.bobot.toString() || '')
  const [jenis, setJenis] = useState<'benefit' | 'cost'>(editingItem?.jenis || 'benefit')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!namaKriteria || !bobot) {
        setError('Semua field harus diisi')
        setLoading(false)
        return
      }

      const bobotNum = parseFloat(bobot)
      if (isNaN(bobotNum) || bobotNum <= 0 || bobotNum > 1) {
        setError('Bobot harus antara 0 dan 1')
        setLoading(false)
        return
      }

      if (editingItem) {
        // Update
        const { error: updateError } = await supabase
          .from('kriteria')
          .update({
            nama_kriteria: namaKriteria,
            bobot: bobotNum,
            jenis,
          })
          .eq('id', editingItem.id)

        if (updateError) throw updateError
      } else {
        // Create
        const { error: insertError } = await supabase
          .from('kriteria')
          .insert({
            nama_kriteria: namaKriteria,
            bobot: bobotNum,
            jenis,
          })

        if (insertError) throw insertError
      }

      setNamaKriteria('')
      setBobot('')
      setJenis('benefit')
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
        {editingItem ? 'Edit Kriteria' : 'Tambah Kriteria Baru'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kriteria</label>
          <input
            type="text"
            value={namaKriteria}
            onChange={(e) => setNamaKriteria(e.target.value)}
            placeholder="Masukkan nama kriteria"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bobot (0-1)</label>
            <input
              type="number"
              step="0.01"
              value={bobot}
              onChange={(e) => setBobot(e.target.value)}
              placeholder="0.25"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jenis</label>
            <select
              value={jenis}
              onChange={(e) => setJenis(e.target.value as 'benefit' | 'cost')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="benefit">Benefit (Semakin tinggi semakin baik)</option>
              <option value="cost">Cost (Semakin rendah semakin baik)</option>
            </select>
          </div>
        </div>

        {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">{error}</div>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            {loading ? (editingItem ? 'Updating...' : 'Menambah...') : editingItem ? 'Update' : 'Tambah'}
          </button>
        </div>
      </div>
    </form>
  )
}
