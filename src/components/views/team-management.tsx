import { DownloadCloud } from "lucide-react";
import { Button } from "../ui/button";

export default function TeamManagement() {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h4 className="text-xl font-semibold">Team Members</h4>
                    <p>Invite your colleagues to work faster and collaborate together.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant={'outline'}>
                        <DownloadCloud />
                        Export CSV
                    </Button>
                    <Button>Invite new member</Button>
                </div>
            </div>
            <div className="bg-white p-3 shadow">

            </div>

        </div>
    )
}
