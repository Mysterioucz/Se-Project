export default function Page() {
    const [panelData, setPanelData] = useState<PanelData>({
        adultCount: 1,
        childCount: 0,
        infantCount: 0,
        seatClass: "",
    });

    const handlePanelDataChange = (
        key: keyof PanelData,
        value: number | string
    ) => {
        setPanelData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

	const session = useSession();
    return (
		<>
			<></>
			
		</>
    );
}
