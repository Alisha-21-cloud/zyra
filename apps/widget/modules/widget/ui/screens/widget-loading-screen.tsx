"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { LoaderIcon } from "lucide-react";
import { contactSessionIdAtomFamily, errorMessageAtom, loadingMessageAtom, organizationIdAtom, screenAtom, vapiSecretsAtom, widgetSettingsAtom } from "@/modules/widget/atoms/widget-atom";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { useEffect, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type InitStep = "org" | "session" | "settings" | "vapi" | "done";

export const WidgetLoadingScreen = ({ organizationId }: { organizationId: string | null }) => {
    const [step, setStep] = useState<InitStep>("org");
    const [sessionValid, setSessionValid] = useState(false);

    const loadingMessage = useAtomValue(loadingMessageAtom);
    const setWidgetSettings = useSetAtom(widgetSettingsAtom);
    const setOrganizationId = useSetAtom(organizationIdAtom);
    const setLoadingMessage = useSetAtom(loadingMessageAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const setScreen = useSetAtom(screenAtom);
    const setVapiSecrets = useSetAtom(vapiSecretsAtom)

    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));

    const validateOrganization = useAction(api.public.organizations.validate)
    useEffect(() => {
        if (step != "org") {
            return;
        }

        setLoadingMessage("Finding Organization ID...");

        if (!organizationId) {
            setErrorMessage("Organization ID is required");
            setScreen("error")
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
                    setScreen("error")
                }
            })
            .catch(() => {
                setErrorMessage("Unable to validate organization");
                setScreen("error")
            })
    }, [step, organizationId, setErrorMessage, setScreen, setOrganizationId, setStep, validateOrganization, setLoadingMessage]);

    const validateContactSession = useMutation(api.public.contactSessions.validate);
    useEffect(() => {
        if (step != "session") {
            return;
        }

        setLoadingMessage("Finding Contact Session ID...");

        if (!contactSessionId) {
            setSessionValid(false);
            setStep("settings");
            return;
        }

        setLoadingMessage("Validating Contact Session...");

        validateContactSession({
            contactSessionId,
        })
            .then((result) => {
                setSessionValid(result.valid);
                setStep("settings");
            })
            .catch(() => {
                setSessionValid(false);
                setStep("settings");
            })

    }, [step, contactSessionId, validateContactSession, setSessionValid, setStep, setLoadingMessage]);

    // step 3 : Load widget settings
    const widgetSettings = useQuery(api.public.widgetSettings.getByOrganizationId, 
        organizationId ? {
            organizationId,
        } : "skip",
    );
    useEffect(() => {
        if (step !== "settings") {
            return;
        }

        setLoadingMessage("Loading Widget Settings...");

        if(widgetSettings !== undefined) {
            setWidgetSettings(widgetSettings);
            setStep("vapi");
        }
    }, [
        step,
        widgetSettings,
        setStep,
        setWidgetSettings,
        setLoadingMessage,
    ])

    // step 4: load vapi secrets
    const getVapiSecrets = useAction(api.public.secrets.getVapiSecrets);
    useEffect(() => {
        if (step !== "vapi") {
            return;
        }

        if (!organizationId) {
            setErrorMessage("Organization ID is required");
            setScreen("error")
            return;
        }

        setLoadingMessage("Loading voice features...");
        getVapiSecrets({ organizationId })
            .then((secrets) => {
                setVapiSecrets(secrets);
                setStep("done");
            })
            .catch(() => {
                setVapiSecrets(null);
                setStep("done");
            })
    }, [
        step,
        organizationId,
        getVapiSecrets,
        setVapiSecrets,
        setStep,
        setLoadingMessage,
    ])

    useEffect(() => {
        if (step !== "done") {
            return;
        }

        const hasValidSession = contactSessionId && sessionValid;
        setScreen(hasValidSession ? "selection" : "auth");
    }, [step, contactSessionId, sessionValid, setScreen]);


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