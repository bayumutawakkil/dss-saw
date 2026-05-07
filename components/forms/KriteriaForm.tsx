'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Kriteria } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Alert from '@/components/ui/Alert'

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
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      if (!namaKriteria.trim() || !bobot) {
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

      // Cek duplikasi nama kriteria
      const { data: existingKriteria, error: checkError } = await supabase
        .from('kriteria')
        .select('id, nama_kriteria')
        .ilike('nama_kriteria', namaKriteria.trim())

      if (checkError) throw checkError

      if (existingKriteria && existingKriteria.length > 0) {
        // Jika edit, pastikan bukan data yang sama
        if (!editingItem || existingKriteria.some(k => k.id !== editingItem.id)) {
          setError(`Kriteria dengan nama "${namaKriteria}" sudah ada. Gunakan nama yang berbeda.`)
          setLoading(false)
          return
        }
      }

      // Cek total bobot setelah penambahan/update
      const { data: allKriteria, error: fetchError } = await supabase
        .from('kriteria')
        .select('id, bobot')

      if (fetchError) throw fetchError

      let totalBobot = 0
      if (allKriteria) {
        totalBobot = allKriteria.reduce((sum, k) => {
          // Jika edit, skip bobot lama dari item yang sedang diedit
          if (editingItem && k.id === editingItem.id) return sum
          return sum + k.bobot
        }, 0)
      }

      // Tambahkan bobot baru
      totalBobot += bobotNum

      // Validasi total bobot tidak boleh lebih dari 1
      if (totalBobot > 1.001) { // Toleransi kecil untuk floating point
        setError(`Total bobot akan menjadi ${totalBobot.toFixed(3)} (melebihi 1.00). Kurangi bobot atau sesuaikan kriteria lain terlebih dahulu.`)
        setLoading(false)
        return
      }

      if (editingItem) {
        const { error: updateError } = await supabase
          .from('kriteria')
          .update({ nama_kriteria: namaKriteria, bobot: bobotNum, jenis })
          .eq('id', editingItem.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('kriteria')
          .insert({ nama_kriteria: namaKriteria, bobot: bobotNum, jenis })
        if (insertError) throw insertError
      }

      setSuccess(true)
      setNamaKriteria('')
      setBobot('')
      setJenis('benefit')
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
          message={editingItem ? 'Kriteria berhasil diperbarui' : 'Kriteria berhasil ditambahkan'}
          onClose={() => setSuccess(false)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nama Kriteria"
          placeholder="Contoh: Nilai Rata-Rata"
          value={namaKriteria}
          onChange={(e) => setNamaKriteria(e.target.value)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Bobot (0.00 - 1.00)"
            type="number"
            step="0.01"
            min="0"
            max="1"
            placeholder="0.25"
            helpText="Jumlah semua bobot harus = 1.00"
            value={bobot}
            onChange={(e) => setBobot(e.target.value)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <Select
            label="Jenis Kriteria"
            value={jenis}
            onChange={(e) => setJenis(e.target.value as 'benefit' | 'cost')}
            options={[
              { value: 'benefit', label: 'Benefit (Semakin tinggi semakin baik)' },
              { value: 'cost', label: 'Cost (Semakin rendah semakin baik)' },
            ]}
          />
        </div>

        <Button type="submit" loading={loading} fullWidth>
          {editingItem ? 'Update Kriteria' : 'Tambah Kriteria'}
        </Button>
      </form>
    </div>
  )
}
