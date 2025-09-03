import Item from "@/components/Item";

export default function Page(){
    return <div className="flex flex-col w-full h-full">
        <Item
            prefixIcon={<span>✈️</span>}
            title="Flight Search"
        />
    </div>
}