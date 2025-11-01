"use client";

import { ChangeEvent, useId } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface AttachmentInputProps {
    label: string;
    value: File | null; 
    onChange: (file: File | null) => void; 
    placeholder?: string;
    containerClassName?: string; 
    accept?: string;
}

export default function AttachmentInput({
    label,
    value,
    onChange,
    placeholder = "Add your file here",
    containerClassName = "",
    accept = "image/*"
}: AttachmentInputProps) {

    const uniqueId = useId();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            onChange(file); 
        } else {
            onChange(null);
        }
  
        event.target.value = ''; 
    };

    return (
        <div className={`flex flex-col gap-2 ${containerClassName}`}>
            <label className="font-semibold text-gray-700 text-lg">{label}</label>

            <label
                htmlFor={uniqueId} 
                className="w-full p-3 rounded-md text-md cursor-pointer flex justify-center items-center gap-2 bg-primary-400 text-white font-semibold hover:bg-primary-700 transition-colors"
            >
                <AttachFileIcon className="w-6 h-6" />
                <span>
                    {value ? value.name : placeholder}
                </span>
            </label>
            <input
                id={uniqueId} 
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}