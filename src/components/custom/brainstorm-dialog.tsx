import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger
} from "@/components/ui/drawer"
import { ArrowLeft, Clock, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import BrainstormChatView from "./brainstorm-chat-view"
import BrainstormHistoryView from "./brainstorm-history-view"
import BrainstormSelect from "./brainstorm-select"
import { OutlinedIcon, WhiteIcon } from "./brianstorm-icons"
import { useBrainstormStore } from "@/lib/stores/brainstorm"
import { mainClient } from "@/lib/axios"
import { API_ENDPOINTS } from "@/lib/constants"

export default function BrainstormDialog({ outlined = false }) {
  const { businessData, setBusinessData } = useBrainstormStore()
  const [currentView, setCurrentView] = useState<'chat' | 'history'>('chat');

  useEffect(() => {
    if (!businessData) {
      mainClient.get(API_ENDPOINTS.Analytics.GetBusinessData)
        .then(r => {
          setBusinessData(r.data.result)
        })
    }
  }, [businessData])

  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant={outlined ? 'outline' : 'default'}>
          {outlined ? <OutlinedIcon /> : <WhiteIcon />}
          <span>Brainstorm</span>
        </Button>

      </DrawerTrigger>
      <DrawerContent className="p-0">
        <DrawerHeader className="p-4 border-b">
          {currentView === 'chat' ? (
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <OutlinedIcon />
                <div className="font-semibold">Brainstorm</div>
              </div>
              <DrawerClose className="cursor-pointer"><X /></DrawerClose>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <ArrowLeft className=" cursor-pointer" onClick={() => setCurrentView('chat')} />
              <div className="font-semibold">Brainstorm Library</div>
            </div>
          )}
        </DrawerHeader>
        <div className="flex items-center justify-between border-b p-4">
          <BrainstormSelect />
          <Clock className="size-5 cursor-pointer" onClick={() => setCurrentView('history')} />
        </div>

        {currentView === 'chat' && (
          <BrainstormChatView />
        )}

        {currentView === 'history' && (
          <BrainstormHistoryView
            setCurrentView={setCurrentView}
          />
        )}

      </DrawerContent>
    </Drawer>
  )
}
