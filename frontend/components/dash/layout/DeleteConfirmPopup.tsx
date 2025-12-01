import React from 'react'
import { AlertTriangle } from 'lucide-react'

interface DeleteConfirmPopupProps {
    isOpen: boolean
    linkTitle: string
    onConfirm: () => void
    onCancel: () => void
    loading?: boolean
}

const DeleteConfirmPopup: React.FC<DeleteConfirmPopupProps> = ({
    isOpen,
    linkTitle,
    onConfirm,
    onCancel,
    loading = false
}) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Delete Link?</h3>
                        <p className="text-sm text-gray-500">This action cannot be undone</p>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-700 mb-1">You're about to delete:</p>
                    <p className="font-semibold text-gray-900 truncate">{linkTitle || 'Untitled Link'}</p>
                </div>

                <p className="text-sm text-gray-600">
                    This will permanently delete the link and all its analytics data.
                </p>

                <div className="flex gap-3 pt-2">
                    <button className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                        
                    <button className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmPopup