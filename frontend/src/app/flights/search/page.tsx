'use client';
import Item from "@/components/item";
import SelectShowList from "@/components/select";
import TextFieldComponent from "@/components/text_field";
import { Checkbox } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";

export default function Page(){
    const [selectValue, setSelectValue] = useState('')

    return (
        <div className="flex flex-col w-full h-full">
            <Item prefix={<span>✈️</span>} label="Flight Search" />
            <SelectShowList
                labelId="flight-search"
                id="flight-search-select"
                value={selectValue}
                onChange={(event) => {
                    // Handles MUI Select event signature
                    const value =
                        event?.target?.value ?? (event as any)?.value ?? "";
                    setSelectValue(value as string);
                }}
            >
                <MenuItem value="one">One</MenuItem>
                <MenuItem value="two">Two</MenuItem>
                <MenuItem value="three">Three</MenuItem>
            </SelectShowList>
            <TextFieldComponent label="Destination" />
        </div>
    );
}