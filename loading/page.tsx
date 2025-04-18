import React from 'react';

export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-700 animate-spin"></div>
        </div>
    );
}