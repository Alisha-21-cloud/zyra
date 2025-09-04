"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { LoaderIcon } from "lucide-react";
import { contactSessionIdAtomFamily, errorMessageAtom, loadingMessageAtom, organizationIdAtom, screenAtom } from "@/modules/widget/atoms/widget-atom";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { useEffect, useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type InitStep = "org" | "session" | "settings" | "vapi" | "done";

export const WidgetLoadingScreen = ({ organizationId }: { organizationId: string | null }) => {
    const [step, setStep] = useState<InitStep>("org");
    const [sessionValid, setSessionValid] = useState(false);

    const loadingMessage = useAtomValue(loadingMessageAtom);
    const setOrganizationId = useSetAtom(organizationIdAtom);
    const setLoadingMessage = useSetAtom(loadingMessageAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const setSCreen = useSetAtom(screenAtom);

    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));

    const validateOrganization = useAction(api.public.organizations.validate)
    useEffect(() => {
        if (step != "org") {
            return;
        }

        setLoadingMessage("Finding Organization ID...");

        if (!organizationId) {
            setErrorMessage("Organization ID is required");
            setSCreen("error")
            return;
        }

        setLoadingMessage("Verifying Organization...");

        validateOrganization({ organizationId })
            .then((result) => {
                if (result.valid) {
                    setOrganizationId(organizationId);
                    setStep("session");
                } else {
                    setErrorMessage(result.reason || "Invalid Configuration");
                    setSCreen("error")
                }
            })
            .catch(() => {
                setErrorMessage("Unable to validate organization");
                setSCreen("error")
            })
    }, [step, organizationId, setErrorMessage, setSCreen, setOrganizationId, setStep, validateOrganization, setLoadingMessage]);

    const validateContactSession = useMutation(api.public.contactSessions.validate);
    useEffect(() => {
        if (step != "session") {
            return;
        }

        setLoadingMessage("Finding Contact Session ID...");

        if (!contactSessionId) {
            setSessionValid(false);
            setStep("done")
            return;
        }

        setLoadingMessage("Validating Contact Session...");

        validateContactSession({
            contactSessionId,
        })
            .then((result) => {
                setSessionValid(result.valid);
                setStep("done");
            })
            .catch(() => {
                setSessionValid(false);
                setStep("done");
            })

    }, [step, contactSessionId, validateContactSession, setSessionValid, setStep, setLoadingMessage]);

    useEffect(() => {
        if (step !== "done") {
            return;
        }

        const hasValidSession = contactSessionId && sessionValid;
        setSCreen(hasValidSession ? "selection" : "auth");
    }, [step, contactSessionId, sessionValid, setSCreen]);


    return (
        <>
            <WidgetHeader>
                <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
                    <p className="text-3xl">
                        Hi there! 👋
                    </p>
                    <p className="text-lg">
                        Let&apos;s get you started
                    </p>
                </div>
            </WidgetHeader>
            <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
                <LoaderIcon className="animate-spin" />
                <p className="text-sm">
                    {loadingMessage || "Loading..."}
                </p>
            </div>
        </>
    )
}