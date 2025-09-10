import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { useAtomValue, useSetAtom } from "jotai";
import { HomeIcon, InboxIcon } from "lucide-react"
import { screenAtom } from "../../atoms/widget-atom";

export const WidgetFooter = () => {
    const screen = useAtomValue(screenAtom);
    const setScreen = useSetAtom(screenAtom);

    return(
        <footer className="flex items-center justify-between border-t bg-background">
            <Button
                className="h-14 flex-1 rounded-none"
                onClick={() => setScreen("selection")}
                size="icon"
                variant="ghost"
            >
                <HomeIcon
                    className={cn("size-5", screen === "selection" && "text-primary")} 
                />
            </Button>
            <Button
                className="h-14 flex-1 rounded-none"
                onClick={() => setScreen("inbox")}
                size="icon"
                variant="ghost"
            >
                <InboxIcon
                    className={cn("size-5", screen === "inbox" && "text-primary")} 
                />
            </Button>
        </footer>
    )
}