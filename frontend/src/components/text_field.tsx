import MenuItem from "@mui/material/MenuItem";
import NativeSelect from "@mui/material/NativeSelect";
import TelPrefix from "./prefix/tel_prefix";

interface Props {
    label: string;
    placeHolder?: string;
    telForm?: boolean;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
}

export default function TextFieldComponent({
    label,
    placeHolder,
    telForm = true,
    required,
    disabled,
    error,
    helperText,
}: Props) {
    const telPrefix = telForm ? "+1 (US)" : "";

    return (
        <div className="flex flex-col w-full h-fit gap-3">
            <h3 className="text-primary-900 font-bold">{label}</h3>
            <div
                className={`flex p-4 gap-2.5 text-primary-900 text-[1rem] rounded-[0.25rem] border border-gray-200 ${
                    disabled ? "" : "hover:border-gray-400"
                } active:outline-primary-600`}
            >
                {telForm && (
                   <TelPrefix />
                )}
                <input
                    className="w-full h-full bg-transparent outline-none"
                    type="text"
                    placeholder={placeHolder}
                    disabled={disabled}
                />
            </div>
        </div>
    );
}
