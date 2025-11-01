"use client";

import React, { ChangeEvent, useId } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';

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

    const handleRemoveFile = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        onChange(null);
    };

    return (
        <div className={`flex flex-col gap-2 ${containerClassName}`}>
            <label className="font-semibold text-gray-700 text-lg">{label}</label>

            <label
                htmlFor={uniqueId} 
                className="w-full p-3 rounded-md text-md cursor-pointer flex justify-center items-center gap-2 bg-primary-400 text-white font-semibold hover:bg-primary-700 transition-colors"
            >
                {!value ? (
                    <>
                        <AttachFileIcon className="w-6 h-6" />
                        <span>{placeholder}</span>
                    </>
                ) : (
                    // ถ้ามีไฟล์แล้ว
                    <>
                        <span>{value.name}</span>
                        <CloseIcon 
                            className="w-5 h-5 hover:text-gray-200"
                            onClick={handleRemoveFile}
                        />
                    </>
                )}

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