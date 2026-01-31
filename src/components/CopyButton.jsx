import React, { useState } from 'react'

export default function CopyButton({ label, content }) {
    const [copied, setCopied] = useState(false);
    const [index, setIndex] = useState(0);

    const handleCopy = () => {
        if (!content || content.length === 0) return;

        const text = content[index];

        navigator.clipboard.writeText(text)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => console.error("コピー失敗"));
        setIndex((prev) => (prev + 1) % content.length);
    };

    return (
        <div>
            <button
                onClick={handleCopy}
                className={`py-3 px-6 ${copied ? 'bg-green-500' : 'bg-blue-500'} hover:${copied ? 'bg-green-600' : 'bg-blue-600'} text-white border-2 border-gray-500 rounded-lg cursor-pointer font-semibold text-sm transition-all duration-200 shadow-xl hover:shadow-lg hover:-translate-y-0.5`}
            >
                {label}
            </button>
        </div>
    )
}

