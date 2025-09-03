import Item from "@/components/Item";
import SelectShowList from "@/components/Select";
import MenuItem from "@mui/material/MenuItem";

export default function Page(){
    return <div className="flex flex-col w-full h-full">
        <Item
            prefixIcon={<span>✈️</span>}
            title="Flight Search"
        />
        <SelectShowList
            labelId="flight-search"
            id="flight-search-select"
            value="Test1234455"
        >
            <MenuItem value="one">One</MenuItem>
            <MenuItem value="two">Two</MenuItem>
            <MenuItem value="three">Three</MenuItem>
        </SelectShowList>
    </div>
}