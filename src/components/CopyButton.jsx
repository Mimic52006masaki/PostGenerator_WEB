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
                style={{
                    padding: "5px 12px",
                    backgroundColor: copied ? "green" : "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    margin: "5px"
                }}
            >
                [{label}]
            </button>
        </div>
    )
}
