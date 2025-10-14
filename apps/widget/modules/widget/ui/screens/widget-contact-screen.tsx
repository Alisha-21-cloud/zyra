import { ArrowLeftIcon, Check, CopyIcon, PhoneIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { WidgetHeader } from "../components/widget-header";
import { useAtomValue, useSetAtom } from "jotai";
import { screenAtom, widgetSettingsAtom } from "../../atoms/widget-atom";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export const WidgetContactScreen = () => {
    const setScreen = useSetAtom(screenAtom);
    const widgetSettings = useAtomValue(widgetSettingsAtom);

    const phoneNumber = widgetSettings?.vapiSettings?.phoneNumber;

    const [copied, setCopied] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    const handleCopy = async () => {
        if (!phoneNumber) {
            return;
        }

        try {

            await navigator.clipboard.writeText(phoneNumber);
            setCopied(true)
        } catch (error) {
            console.error(error)
        } finally {
            timeoutRef.current = setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <>
            <WidgetHeader>
                <div className="flex items-center gap-x-2">
                    <Button
                        variant="transparent"
                        size="icon"
                        onClick={() => setScreen("selection")}
                    >
                        <ArrowLeftIcon />
                    </Button>
                    <p>Contact Us</p>
                </div>
            </WidgetHeader>
            {!phoneNumber ? (
                <div className="flex h-full flex-col items-center justify-center gap-y-4">
                    <p className="text-muted-foreground">Contact information not available</p>
                </div>
            ) : (
                <div className="flex h-full flex-col items-center justify-center gap-y-4">
                    <div className="flex items-center justify-center rounded-full border bg-white p-3">
                        <PhoneIcon className="size-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">Available 24/7</p>
                    <p className="font-bold text-2xl">{phoneNumber}</p>
                </div>
            )}
            <div className="border-t bg-background p-4">
                <Button
                    className="w-full"
                    onClick={handleCopy}
                    size="lg"
                    variant="outline"
                >
                    {copied ? (
                        <>
                            <Check className="size-4 mr-2" />
                            Copied
                        </>
                    ) : (
                        <>
                            <CopyIcon className="size-4 mr-2" />
                            Copy Number
                        </>
                    )}
                </Button>
                <Button asChild className="w-full" size="lg" disabled={!phoneNumber}>
                    <Link href={`tel:${phoneNumber}`}>
                        <PhoneIcon />
                        Call Now
                    </Link>
                </Button>
            </div>
        </>
    )
}