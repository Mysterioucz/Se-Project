import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import Button from "@/src/components/Button";
import SelectComponent, { SelectEvent } from "@/src/components/select";
import { MenuItem } from "@mui/material";
import ReportPiorityMarker from "./ReportPriorityMarker";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    reportId: string;
}

interface ReportDetail {
    id: string;
    bookingId: string;
    passenger: {
        email: string;
        phone: string;
        firstName: string;
        lastName: string;
    };
    problemType: string;
    description: string;
    attachment: string | null;
    status: string;
    priority: "normal" | "high";
    submitted: string;
    lastUpdate: string;
}

export default function ReportModal({ isOpen, onClose, reportId }: ReportModalProps) {
    const [data, setData] = useState<ReportDetail | null>(null);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!reportId) return;
        const fetchDetail = async () => {
            try {
                const res = await fetch(`/api/v1/reports/${reportId}`);
                const detail = await res.json();
                setData(detail);
                setStatus(detail.status);
            } catch (err) {
                console.error("Failed to fetch report:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [reportId]);

    const setStatusChange = (event: SelectEvent) => {
        setStatus(event.target.value as string);
    };

    if (loading) {
        return (
            <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center">
                <div className="bg-white p-4 rounded-md">Loading report details...</div>
            </Dialog>
        );
    }

    if (!data) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
            <div className="relative z-[10000] flex flex-col w-[49.25rem] max-h-[90vh] overflow-hidden rounded-[0.5rem] border-[0.25rem] border-primary-300 bg-white shadow-xl">
                {/* Header */}
                <div className="flex w-full h-[4.5625rem] p-[0.75rem] items-center gap-[0.5rem] bg-primary-300">
                    <div className="font-sarabun text-white text-[2rem] font-bold">Report Details</div>
                    <div className="flex flex-1 justify-end">
                        <Button text="Exit" styleType="red-critical" size="md" onClick={onClose} />
                    </div>
                </div>

                {/* Body */}
                <div className="overflow-y-auto w-full p-4">
                    <div className="text-primary-600 font-semibold text-[1.125rem]">
                        Report ID: <span className="text-black font-normal">{data.id}</span>
                    </div>
                    <div className="text-primary-600 font-semibold text-[1.125rem] mt-2">
                        Booking ID: <span className="text-black font-normal">{data.bookingId}</span>
                    </div>

                    <div className="mt-4 bg-primary-50 rounded p-3">
                        <div className="font-sarabun text-primary-900 text-[1.5rem] font-semibold">Main Passenger Info</div>
                        <div className="mt-2 text-black font-sarabun">
                            <div>Email: {data.passenger.email}</div>
                            <div>Phone: {data.passenger.phone}</div>
                            <div>Name: {data.passenger.firstName} {data.passenger.lastName}</div>
                        </div>
                    </div>

                    <div className="mt-4 bg-primary-50 rounded p-3">
                        <div className="font-sarabun text-primary-900 text-[1.5rem] font-semibold">Problem Details</div>
                        <div className="mt-2">Type: {data.problemType}</div>
                        <div className="mt-2">Description:</div>
                        <div className="border rounded p-2 bg-white max-h-48 overflow-y-auto">{data.description}</div>
                        {data.attachment && (
                            <div className="mt-3">
                                <Button text={data.attachment} styleType="fill" size="md" onClick={() => {}} />
                            </div>
                        )}
                    </div>

                    <div className="mt-4 bg-primary-50 rounded p-3">
                        <div className="font-sarabun text-primary-900 text-[1.5rem] font-semibold">Status and Priority</div>
                        <div className="flex items-center justify-between mt-2">
                            <div>
                                Status: <span className="text-black">{data.status}</span>
                            </div>
                            <ReportPiorityMarker priority={data.priority} />
                        </div>
                        <SelectComponent
                            labelId="update-status-select"
                            id="update-status-select"
                            value={status}
                            onChange={setStatusChange}
                            placeholder={data.status}
                            width="w-[16rem]"
                            height="h-[2.188rem]"
                        >
                            <MenuItem value="Opened">Opened</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                            <MenuItem value="Resolved">Resolved</MenuItem>
                        </SelectComponent>
                    </div>

                    <div className="mt-4 bg-primary-50 rounded p-3">
                        <div className="font-sarabun text-primary-900 text-[1.5rem] font-semibold">Timeline</div>
                        <div>Submitted: {data.submitted}</div>
                        <div>Last Update: {data.lastUpdate}</div>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
