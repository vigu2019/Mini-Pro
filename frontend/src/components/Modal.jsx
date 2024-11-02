// components/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 max-h-full rounded-lg shadow-lg overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
            <button
                className="text-gray-500 hover:text-gray-700"
                onClick={onClose}
            >
                &#10005;
            </button>
            </div>
            <div className="p-6 space-y-4">{children}</div>
        </div>
        </div>
    );
};

export default Modal;
