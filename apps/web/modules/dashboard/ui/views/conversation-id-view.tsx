"use client";

import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react"
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react";
import {
    AIConversation,
    AIConversationContent,
    AIConversationScrollButton
} from "@workspace/ui/components/ai/conversation";
import {
    AIInput,
    AIInputButton,
    AIInputSubmit,
    AIInputTextarea,
    AIInputToolbar,
    AIInputTools
} from "@workspace/ui/components/ai/input";
import {
    AIMessage,
    AIMessageContent
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { Form, FormField } from "@workspace/ui/components/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";

const formSchema = z.object({
    message: z.string().min(1, "Message is required"),
})

export const ConversationIdView = ({
    conversationId,
}: {
    conversationId: Id<"conversations">;
}) => {
    const conversation = useQuery(api.private.conversations.getOne, {
        conversationId,
    });

    const messages = useThreadMessages(
        api.private.messages.getMany,
        conversation?.threadId ? { threadId: conversation.threadId } : "skip",
        { initialNumItems: 10 }
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
        },
    });

    const createMessage = useMutation(api.private.messages.create);
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await createMessage({
                conversationId,
                prompt: values.message,
            });

            form.reset();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex h-full flex-col bg-muted">
            <header className="flex items-center justify-between border-b bg-background p-2.5">
                <Button
                    size="sm"
                    variant="ghost"
                >
                    <MoreHorizontalIcon />
                </Button>
            </header>
            <AIConversation className="max-h-[calc(100vh-180px)]">
                <AIConversationContent>
                    {toUIMessages(messages.results ?? [])?.map((message) => (
                        <AIMessage
                            from={message.role === "user" ? "assistant" : "user"}
                            key={message.id}
                        >
                            <AIMessageContent>
                                <AIResponse>
                                    {message.content}
                                </AIResponse>
                            </AIMessageContent>
                            {message.role === "user" && (
                                <DicebearAvatar
                                    seed={conversation?.contactSessionId ?? "user"}
                                    size={32}
                                />
                            )}
                        </AIMessage>
                    ))}
                </AIConversationContent>
                <AIConversationScrollButton />
            </AIConversation>

            <div className="p-2">
                <Form {...form}>
                    <AIInput onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField 
                            control={form.control}
                            disabled={conversation?.status === "resolved"}
                            name="message"
                            render={({ field }) => (
                                <AIInputTextarea  
                                    disabled={
                                        conversation?.status === "resolved" ||
                                        form.formState.isSubmitting
                                        // TODO:  OR if enhancing prompt
                                    }
                                    onChange={field.onChange}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            form.handleSubmit(onSubmit)();
                                        }
                                    }}
                                    placeholder={
                                        conversation?.status === "resolved"
                                            ? "This Conversation has been resolved."
                                            : "Type your response as an operator"
                                    }
                                    value={field.value}
                                />
                            )}
                        />
                        <AIInputToolbar>
                            <AIInputTools>
                                <AIInputButton>
                                    <Wand2Icon />
                                    Enhance
                                </AIInputButton>
                            </AIInputTools>
                            <AIInputSubmit
                                disabled={
                                    conversation?.status === "resolved" ||
                                    !form.formState.isValid ||
                                    form.formState.isSubmitting
                                    // TODO : OR if is enhancing prompt
                                }
                                status="ready"
                                type="submit"
                            />
                        </AIInputToolbar>
                    </AIInput>
                </Form>
            </div>
        </div>
    )
};
