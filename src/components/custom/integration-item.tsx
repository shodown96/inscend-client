"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { AppIcon } from "@/types";
import { useState, type ReactNode } from "react";

export default function IntegrationItem({
    title,
    description,
    icon: Icon,
    dialog,
    integrated,
}: {
    title: string,
    description: string,
    integrated: boolean,
    dialog: {
        title: string,
        description: string,
        children: () => ReactNode | ReactNode[]
    }
    icon: AppIcon,
}) {
    const [open, setOpen] = useState(false); // connect modal
    const [disconnectOpen, setDisconnectOpen] = useState(false); // disconnect modal
    const [enabled, setEnabled] = useState(integrated);

    const handleCheckChange = (checked: boolean) => {
        // setEnabled(checked);

        if (checked) {
            // User turned ON → show connect modal
            setOpen(true);
        } else {
            // User turned OFF → show disconnect confirmation
            setDisconnectOpen(true);
        }
    };

    // When user cancels disconnect → revert switch to ON
    const cancelDisconnect = () => {
        setDisconnectOpen(false);
        setEnabled(true);
    };

    // When user confirms disconnect → keep switch OFF
    const confirmDisconnect = () => {
        setDisconnectOpen(false);
        // optional: trigger parent callback for actual disconnect logic
    };

    return (
        <>
            {/* CARD */}
            <div className="w-full flex items-center justify-between gap-4 bg-[#3A384D0A] p-4 rounded-xl">
                <div className="flex items-center gap-4">
                    <Icon className="size-14" />
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <p className="text-sm">
                            {description}
                        </p>
                    </div>
                </div>

                {enabled ? (
                    <Button onClick={() => setOpen(true)} size={'sm'}>Manage integration</Button>
                ) : (
                    <Switch
                        className="cursor-pointer"
                        checked={enabled}
                        onCheckedChange={handleCheckChange}
                    />
                )}
            </div>

            {/* CONNECT MODAL */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{dialog.title}</DialogTitle>
                        <DialogDescription>
                            {dialog.description}
                        </DialogDescription>
                    </DialogHeader>

                    {dialog.children()}

                    {/* <DialogFooter className="mt-4">
                        <Button onClick={() => setOpen(false)}>Continue</Button>
                    </DialogFooter> */}
                </DialogContent>
            </Dialog>

            {/* DISCONNECT CONFIRMATION MODAL */}
            <Dialog open={disconnectOpen} onOpenChange={setDisconnectOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Disconnect {title}?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to disconnect this integration?
                            This may remove syncing and related features.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="mt-4 flex justify-end gap-3">
                        <Button variant="outline" onClick={cancelDisconnect}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDisconnect}>
                            Disconnect
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
