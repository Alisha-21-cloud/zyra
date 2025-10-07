import { useAction } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@workspace/backend/_generated/api";

type PhoneNumbers = typeof api.private.vapi.getPhoneNumbers._returnType;
type Assistants = typeof api.private.vapi.getAssistants._returnType;

export const useVapiAssistants = (): {
    data: Assistants;
    isLoading: boolean;
    error: Error | null;
} => {
    const [data, setData] = useState<Assistants>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const getAssistants = useAction(api.private.vapi.getAssistants);

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const result = await getAssistants();
                if (cancelled) {
                    return;
                }
                setData(result);
                setError(null);
            } catch (error) {
                if (cancelled) {
                    return;
                }
                setError(error as Error);
                toast.error("Failed to fetch assistants");
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        fetchData();

        return () => {
            cancelled = true;
        }
    }, []);

    return { data, isLoading, error };
}

export const useVapiPhoneNumbers = (): {
    data: PhoneNumbers;
    isLoading: boolean;
    error: Error | null;
} => {
    const [data, setData] = useState<PhoneNumbers>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const getPhoneNumbers = useAction(api.private.vapi.getPhoneNumbers);

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const result = await getPhoneNumbers();
                if (cancelled) {
                    return;
                }
                setData(result);
                setError(null);
            } catch (error) {
                if (cancelled) {
                    return;
                }
                setError(error as Error);
                toast.error("Failed to fetch phone numbers");
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        fetchData();
        return () => {
            cancelled = true;
        }
    }, []);

    return { data, isLoading, error };
}