'use client'
import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

export default function TimeSlider({ label, value, setValue }: { label: string, value: number[], setValue: React.Dispatch<React.SetStateAction<number[]>> }) {
    const marks = [
        { value: 0 },
        { value: 4 },
        { value: 8 },
        { value: 12 },
        { value: 16 },
        { value: 20 },
        { value: 24 }
    ];

    const handleChange = (event: Event, newValue: number[]) => {
        if (newValue[1] - newValue[0] > 0) {
            setValue(newValue); // Update the slider value
        }
    };

    function valuetext(value: number) {
        return `${value}:00`;
    }

    return (
        <div className="flex flex-col w-full bg-white font-sans rounded-sm ">
            <h2 className="text-primary-900 text-xl font-bold mx-3 mt-3">{label}</h2>
            <p className="text-lg text-primary-900 ml-3 mt-1 mb-3">{`${value[0]}:00 - ${value[1]}:00`}</p>

            <Box className="mx-1 mb-2" sx={{ padding: '0 12px' }}>
                <Slider
                    getAriaLabel={() => 'Arrival time range'}
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="off"
                    getAriaValueText={valuetext}
                    step={4}
                    marks={marks}
                    min={0}
                    max={24}
                    disableSwap
                    sx={{
                        color: '#30A2C5', // primary-400
                        height: '6px',
                        '& .MuiSlider-thumb': {
                            width: 24,
                            height: 24,
                            backgroundColor: '#30A2C5', // primary-400
                            border: '2px solid #fff',
                            '&:hover, &.Mui-focusVisible': {
                                boxShadow: '0 0 0 6px rgba(56, 178, 172, 0.16)',
                            },
                        },
                        '& .MuiSlider-track': {
                            border: 'none',
                        },
                        '& .MuiSlider-rail': {
                            opacity: 1,
                            backgroundColor: '#B8E4EF', // primary-100
                        },
                        '& .MuiSlider-mark': {
                            backgroundColor: '#30A2C5', // primary-400
                            height: '10px',
                            width: '2px',
                            '&.MuiSlider-markActive': {
                                opacity: 1,
                                backgroundColor: 'currentColor',
                            },
                        },
                        '& .MuiSlider-markLabel': {
                            color: '#5F696C', // gray-400
                            fontSize: '0.875rem'
                        }
                    }}
                />
            </Box>
        </div>
    );
}
