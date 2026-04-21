'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Kriteria } from '@/lib/supabase'
import KriteriaForm from '@/components/forms/KriteriaForm'
import ProtectedPage from '@/components/ProtectedPage'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import EmptyState from '@/components/ui/EmptyState'
import Modal from '@/components/ui/Modal'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function KriteriaPage() {
  const [kriteriaList, setKriteriaList] = useState<Kriteria[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Kriteria | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<Kriteria | null>(null)

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

  const handleDeleteClick = (k: Kriteria) => {
    setItemToDelete(k)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return
    
    setDeletingId(itemToDelete.id)
    try {
      const { error } = await supabase.from('kriteria').delete().eq('id', itemToDelete.id)
      if (error) throw error
      await loadKriteria()
      setShowDeleteModal(false)
      setItemToDelete(null)
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus data')
    } finally {
      setDeletingId(null)
    }
  }

  const totalBobot = kriteriaList.reduce((sum, k) => sum + k.bobot, 0)
  const isBobotValid = Math.abs(totalBobot - 1) < 0.001

  return (
    <ProtectedPage>
      <PageHeader
        title="Kelola Kriteria"
        description="Atur kriteria dan bobot yang digunakan dalam perhitungan SAW"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Kriteria' },
        ]}
        icon={
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      />

      <div className="px-8 pb-8">
        {/* Form Tambah/Edit */}
        <KriteriaForm 
          onSuccess={() => {
            loadKriteria()
            setEditingItem(null)
          }}
          editingItem={editingItem}
        />

        {/* Validasi total bobot */}
        <Card className="mb-6">
          <div className="flex items-center gap-4">
            {isBobotValid ? (
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <div className="flex-1">
              <h3 className={`font-semibold ${isBobotValid ? 'text-emerald-900' : 'text-amber-900'}`}>
                Status Total Bobot: <span className="font-mono">{totalBobot.toFixed(3)}</span>
              </h3>
              <p className={`text-sm mt-1 ${isBobotValid ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isBobotValid 
                  ? '✓ Semua kriteria sudah terkonfigurasi dengan valid. Total bobot = 1.00'
                  : '⚠ Jumlah bobot kriteria harus tepat 1.00 untuk perhitungan yang akurat'}
              </p>
            </div>
          </div>
        </Card>

        {/* Data Kriteria */}
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Daftar Kriteria</h2>
              <p className="text-sm text-slate-600 mt-1">Total {kriteriaList.length} kriteria terdaftar</p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block">
                <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
          ) : kriteriaList.length === 0 ? (
            <EmptyState
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4a1 1 0 011-1h16a1 1 0 011 1v2.757a1 1 0 01-.855.993l-1.848.369a1 1 0 00-.611.894v10.846a1 1 0 001 1H7a1 1 0 001-1V9.013a1 1 0 00-.611-.894l-1.848-.369A1 1 0 013 6.757V4z" />
                </svg>
              }
              title="Belum Ada Kriteria"
              description="Tambahkan kriteria pertama Anda menggunakan form di atas"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Kriteria</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Bobot</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Jenis</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Proporsi</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kriteriaList.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-indigo-600">C{k.id}</span>
                          </div>
                          <span className="font-medium text-slate-800">{k.nama_kriteria}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="px-2 py-1 bg-slate-100 rounded text-slate-800 font-semibold">{k.bobot.toFixed(2)}</code>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold ${
                          k.jenis === 'benefit'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}>
                          {k.jenis === 'benefit' ? '📈 Benefit' : '📉 Cost'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-100 rounded-full h-2 max-w-xs">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600"
                              style={{ width: `${k.bobot * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-600 w-12 text-right">{(k.bobot * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setEditingItem(k)}
                            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteClick(k)}
                            disabled={deletingId === k.id}
                            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Hapus Kriteria"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              loading={deletingId !== null}
              onClick={handleConfirmDelete}
            >
              Hapus
            </Button>
          </>
        }
      >
        <p className="text-slate-700 mb-4">
          Apakah Anda yakin ingin menghapus kriteria <strong>{itemToDelete?.nama_kriteria}</strong>?
        </p>
        <Alert
          type="warning"
          message="Tindakan ini tidak dapat dibatalkan dan akan menghapus semua penilaian terkait kriteria ini."
        />
      </Modal>
    </ProtectedPage>
  )
}
