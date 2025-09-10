"use client";
import SelectComponent from "@/src/components/select";
import { useState } from "react";

// test
export default function Page() {
    const [selectedOption, setSelectedOption] = useState("Option 1");
    return (
        <div>
            <div className="flex p-6">
                <SelectComponent
                    id="demo-simple-select"
                    labelId="demo-simple-select-label"
                    value={selectedOption}
                    onChange={(event: any) => setSelectedOption(event.target.value)}
                >
                    <option value="Option 1">Option 1</option>
                    <option value="Option 2">Option 2</option>
                    <option value="Option 3">Option 3</option>
                </SelectComponent>
            </div>
        </div>
    );
}
