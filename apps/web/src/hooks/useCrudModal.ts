import { useState, useCallback } from 'react';

export function useCrudModal<T = unknown>(onSuccessCallback?: () => void) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<T | null>(null);

  const handleAdd = useCallback(() => {
    setEditData(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((record: T) => {
    setEditData(record);
    setModalOpen(true);
  }, []);

  const handleModalSuccess = useCallback(() => {
    setModalOpen(false);
    onSuccessCallback?.();
  }, [onSuccessCallback]);

  const handleCancel = useCallback(() => {
    setModalOpen(false);
  }, []);

  return {
    modalOpen,
    editData,
    handleAdd,
    handleEdit,
    handleModalSuccess,
    handleCancel,
  };
}
