import NativeSelect from "@mui/material/NativeSelect";

interface Props {
    value?: string;
    onChange?: (event: React.ChangeEvent<{ value: unknown }>) => void;
}

export default function TelPrefix({ value, onChange }: Props) {
    return (
        <select className="outline-none" name="tel-prefix" id="tel-prefix" value={value} onChange={onChange}>
            <option value="+1">+1</option>
            <option value="+44">+44</option>
            <option value="+61">+61</option>
            <option value="+66">+66</option>
            <option value="+81">+81</option>
            <option value="+82">+82</option>
            <option value="+84">+84</option>
            <option value="+86">+86</option>
        </select>
    );
}