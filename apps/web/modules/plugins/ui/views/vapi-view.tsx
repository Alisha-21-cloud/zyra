"use client";

import {
    GlobeIcon,
    PhoneCallIcon,
    PhoneIcon,
    WorkflowIcon,
} from "lucide-react";
import { type Feature, PluginCard } from "../components/plugin-card";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { VapiConnectedView } from "../components/vapi-connected-view";

const vapiFeatures: Feature[] = [
    {
        icon: GlobeIcon,
        label: "Web voice calls",
        description: "Voice chat  directly in your app"
    },
    {
        icon: PhoneIcon,
        label: "Phone numbers",
        description: "Get dedicated business lines"
    },
    {
        icon: PhoneCallIcon,
        label: "Outbound calls",
        description: "Automated customer outreach"
    },
    {
        icon: WorkflowIcon,
        label: "Workflows",
        description: "Custom conversation flows"
    }
]

const formSchema = z.object({
    publicApiKey: z.string().min(1, { message: " Public API key is required" }),
    privateApiKey: z.string().min(1, { message: " Private API key is required" }),
});

const VapiPluginForm = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
}) => {
    const upsertSecret = useMutation(api.private.secrets.upsert);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            publicApiKey: "",
            privateApiKey: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await upsertSecret({
                service: "vapi",
                value: {
                    publicApiKey: values.publicApiKey,
                    privateApiKey: values.privateApiKey,
                }
            })
            setOpen(false);
            toast.success("Vapi Secret created");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    }

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enable Vapi</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Your API keys are safely encrypted and stored using AWS Secrets
                </DialogDescription>
                <Form{...form}>
                    <form
                        className="flex flex-col gap-y-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="publicApiKey"
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Public API key</Label>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Your public API key"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="privateApiKey"
                            render={({ field }) => (
                                <FormItem>
                                    <Label>Private API key</Label>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Your private API key"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                disabled={form.formState.isSubmitting}
                                type="submit"
                            >
                                {form.formState.isSubmitting ? "Connecting..." : "Connect"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

const VapiPluginRemoveForm = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
}) => {
    const removePlugin = useMutation(api.private.plugins.remove);

    const onSubmit = async () => {
        try {
            await removePlugin({
                service: "vapi",
            })
            setOpen(false);
            toast.success("Vapi plugin removed");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    }

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Disconnect Vapi</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to disconnect Vapi?
                </DialogDescription>
                <DialogFooter>
                    <Button onClick={onSubmit} variant="destructive">
                        Disconnect
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export const VapiView = () => {
    const vapiPlugin = useQuery(api.private.plugins.getOne, { service: "vapi" });

    const [connectOpen, setConnectOpen] = useState(false);
    const [removeOpen, setRemoveOpen] = useState(false);


    const toggleConnection = () => {
        if (vapiPlugin) {
            setRemoveOpen(true);
        } else {
            setConnectOpen(true);
        }
    }

    return (
        <>
            <VapiPluginForm open={connectOpen} setOpen={setConnectOpen} />
            <VapiPluginRemoveForm open={removeOpen} setOpen={setRemoveOpen} />
            <div className="flex min-h-screen flex-col bg-muted p-8">
                <div className="mx-auto w-full max-w-screen-md">
                    <div className="space-y-2">
                        <h1 className="text-2xl md:text-4xl">Vapi Plugin</h1>
                        <p className="text-muted-foreground">Connect Vapi to enable AI voice calls and phone support</p>
                    </div>

                    <div className="mt-8">
                        {vapiPlugin ? (
                            <VapiConnectedView onDisconnect={toggleConnection} />
                        ) : (
                            <PluginCard
                                serviceImage="/vapi.jpg"
                                serviceName="Vapi"
                                features={vapiFeatures}
                                isDisabled={vapiPlugin === undefined}
                                onSubmit={toggleConnection}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}