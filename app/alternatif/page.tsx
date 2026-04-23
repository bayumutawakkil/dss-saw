'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Alternatif } from '@/lib/supabase'
import AlternatifForm from '@/components/forms/AlternatifForm'
import ProtectedPage from '@/components/ProtectedPage'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import Modal from '@/components/ui/Modal'
import Alert from '@/components/ui/Alert'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'

export default function AlternatifPage() {
  const [alternatifList, setAlternatifList] = useState<Alternatif[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Alternatif | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<Alternatif | null>(null)

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

  const handleDeleteClick = (a: Alternatif) => {
    setItemToDelete(a)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return
    
    setDeletingId(itemToDelete.id)
    try {
      const { error } = await supabase.from('alternatif').delete().eq('id', itemToDelete.id)
      if (error) throw error
      await loadAlternatif()
      setShowDeleteModal(false)
      setItemToDelete(null)
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus data')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <ProtectedPage>
      <PageHeader
        title="Kelola Alternatif"
        description="Atur daftar mata kuliah atau alternatif yang akan dievaluasi"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Alternatif' },
        ]}
        actions={
          <Button
            variant="primary"
            onClick={() => {
              setEditingItem(null)
              setShowFormModal(true)
            }}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Tambah Mata Kuliah
          </Button>
        }
        icon={
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        }
      />

      <div className="px-4 md:px-8 pb-8">

        {/* Data Alternatif */}
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Daftar Mata Kuliah</h2>
              <p className="text-sm text-slate-600 mt-1">Total {alternatifList.length} mata kuliah terdaftar</p>
            </div>
          </div>

          {loading ? (
            <LoadingSkeleton count={4} height="md" />
          ) : alternatifList.length === 0 ? (
            <EmptyState
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              title="Belum Ada Alternatif"
              description="Tambahkan mata kuliah pertama Anda menggunakan form di atas"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Kode</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Mata Kuliah</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {alternatifList.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <code className="px-2 py-1 bg-slate-100 rounded text-slate-700 text-xs font-bold">A{a.id}</code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-emerald-600">📚</span>
                          </div>
                          <span className="font-medium text-slate-800">{a.nama_mata_kuliah}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          Aktif
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setEditingItem(a)
                              setShowFormModal(true)
                            }}
                            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteClick(a)}
                            disabled={deletingId === a.id}
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
        title="Hapus Alternatif"
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
          Apakah Anda yakin ingin menghapus alternatif <strong>{itemToDelete?.nama_mata_kuliah}</strong>?
        </p>
        <Alert
          type="warning"
          message="Tindakan ini tidak dapat dibatalkan dan akan menghapus semua penilaian terkait alternatif ini."
        />
      </Modal>

      {/* Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false)
          setEditingItem(null)
        }}
        title={editingItem ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah Baru'}
        size="sm"
      >
        <div className="max-h-[70vh] overflow-y-auto">
          <AlternatifForm
            onSuccess={() => {
              loadAlternatif()
              setEditingItem(null)
              setShowFormModal(false)
            }}
            editingItem={editingItem}
          />
        </div>
      </Modal>
    </ProtectedPage>
  )
}
