import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger'
}) => {
    if (!isOpen) return null;

    const colors = {
        danger: {
            icon: 'text-red-600',
            button: 'bg-red-600 hover:bg-red-700 text-white',
            bgIcon: 'bg-red-100'
        },
        warning: {
            icon: 'text-yellow-600',
            button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
            bgIcon: 'bg-yellow-100'
        },
        info: {
            icon: 'text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
            bgIcon: 'bg-blue-100'
        }
    };

    const style = colors[variant];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                    <div className={`w-12 h-12 rounded-full ${style.bgIcon} flex items-center justify-center mb-4`}>
                        <AlertCircle className={`w-6 h-6 ${style.icon}`} />
                    </div>

                    <h2 className="text-xl font-bold text-stone-800 mb-2">{title}</h2>
                    <p className="text-stone-600 mb-6">{message}</p>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-stone-600 hover:bg-stone-100 font-medium text-sm transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${style.button}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
