'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Alternatif } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'

interface AlternatifFormProps {
  onSuccess: () => void
  editingItem?: Alternatif | null
}

export default function AlternatifForm({ onSuccess, editingItem }: AlternatifFormProps) {
  const [namaMataKuliah, setNamaMataKuliah] = useState(editingItem?.nama_mata_kuliah || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      if (!namaMataKuliah.trim()) {
        setError('Nama mata kuliah harus diisi')
        setLoading(false)
        return
      }

      if (editingItem) {
        const { error: updateError } = await supabase
          .from('alternatif')
          .update({ nama_mata_kuliah: namaMataKuliah })
          .eq('id', editingItem.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('alternatif')
          .insert({ nama_mata_kuliah: namaMataKuliah })
        if (insertError) throw insertError
      }

      setSuccess(true)
      setNamaMataKuliah('')
      setTimeout(() => onSuccess(), 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && (
        <Alert
          type="success"
          message={editingItem ? 'Alternatif berhasil diperbarui' : 'Alternatif berhasil ditambahkan'}
          onClose={() => setSuccess(false)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nama Mata Kuliah / Alternatif"
          placeholder="Contoh: Basis Data, Pemrograman Web"
          value={namaMataKuliah}
          onChange={(e) => setNamaMataKuliah(e.target.value)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />

        <Button type="submit" loading={loading} fullWidth>
          {editingItem ? 'Update Alternatif' : 'Tambah Alternatif'}
        </Button>
      </form>
    </div>
  )
}
