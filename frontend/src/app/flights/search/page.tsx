"use client";
import Item from "@/components/item";
import SelectShowList from "@/components/select";
import TextFieldComponent from "@/components/text_field";
import { TelArray } from "@/data/mockTelPrefix";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";

export default function Page() {
    function handleTextFieldChange(value: unknown) {
        if (value === undefined) return;
        if (typeof value === "string") {
            console.warn("Expected an object but received a string.");
            return;
        }

        const val = value as { tel: string; text: string };
        console.log("TextField value changed:", val.text);
        console.log("TelField value changed:", val.tel);

        setTelValue(val.tel);
        setTextValue(val.text);
    }

    const [selectValue, setSelectValue] = useState("");
    const telValueDefault = TelArray[0];
    const [telValue, setTelValue] = useState(telValueDefault);
    const [textValue, setTextValue] = useState("");

    return (
        <div className="flex flex-col p-8 pr-16 pl-16 self-center">
            <Item prefix={<span>✈️</span>} label="Flight Search" />
            <SelectShowList
                labelId="flight-search"
                id="flight-search-select"
                value={selectValue}
                onChange={(
                    event:
                        | React.ChangeEvent<HTMLInputElement>
                        | React.ChangeEvent<{ value: unknown }>
                        | (Event & {
                              target: { value: string; name?: string };
                          }),
                ) => {
                    // Handles MUI Select event signature
                    const value = event.target.value ?? "";
                    setSelectValue(value as string);
                }}
            >
                <MenuItem value="one">One</MenuItem>
                <MenuItem value="two">Two</MenuItem>
                <MenuItem value="three">Three</MenuItem>
            </SelectShowList>
            <TextFieldComponent
                label="Destination"
                textValue={textValue}
                telValue={telValue}
                onChange={handleTextFieldChange}
                telForm={true}
            />
        </div>
    );
}
