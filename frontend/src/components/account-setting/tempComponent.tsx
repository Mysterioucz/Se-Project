// This file will be delete after Global COmponents are done
import { TextField, Select, MenuItem, FormControl } from "@mui/material";
import React from "react";

const INPUT_STYLE = {
    color: 'var(--color-gray-500)',
    fontFamily: 'var(--font-sans)',
    fontSize: '16px',
};

const LABEL_STYLE = {
    fontFamily: 'var(--font-sans)',
};

// Temp. Function for Tex Field Component
export function TextField_Temp() {
    return (
        <TextField
            defaultValue="Fetch from DB"
            fullWidth
            variant="outlined"
            size="small"
            sx={{
                '& .MuiInputBase-input': { ...INPUT_STYLE },
                '& .MuiOutlinedInput-root': {
                    height: '40px',
                    '& fieldset': {
                        borderColor: 'var(--color-gray-300)',
                    },
                    '&:hover fieldset': {
                        borderColor: 'var(--color-primary-500)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'var(--color-primary-500)',
                    },
                },
                '& .MuiInputLabel-root': { ...LABEL_STYLE },
            }}
        />
    );
}

// Temp. Function for Dropdown Component
const SELECT_STYLE = {
    height: '40px',
    fontFamily: 'var(--font-sans)',
    fontSize: '16px',
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--color-gray-300)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--color-primary-500)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--color-primary-500)',
    },
    '& .MuiSelect-select': {
        padding: '8px 14px',
    },
};

const MENU_ITEM_STYLE = (selected: boolean) => ({
    fontFamily: 'var(--font-sans)',
    fontSize: '16px',
    fontWeight: selected ? 600 : 400,
    color: selected ? 'var(--color-primary-600)' : 'var(--color-gray-700)',
});

// TODO: I think this will be fetching from backend (not const like this in frontend)
const LANG_OPTIONS = [
    { value: 'th', label: 'Thai' },
    { value: 'en', label: 'English' },
    { value: 'cn', label: 'Chinese' },
    { value: 'fr', label: 'French' },
    { value: 'jp', label: 'Japanese' },
];

export function DropdownSelector_Temp() {
    const [value, setValue] = React.useState('en'); // default English

    return (
        <FormControl fullWidth size="small">
            <Select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                sx={SELECT_STYLE}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            maxHeight: 120,
                        },
                    },
                }}
            >
                {LANG_OPTIONS.map((opt) => (
                    <MenuItem
                        key={opt.value}
                        value={opt.value}
                        sx={MENU_ITEM_STYLE(value === opt.value)}
                    >
                        {opt.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
