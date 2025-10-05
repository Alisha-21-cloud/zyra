"use client";

import {
    CheckCircleIcon,
    PhoneIcon,
    XCircleIcon,
} from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table";
import { useVapiPhoneNumbers } from "../../hooks/use-vapi-data";

export const VapiPhoneNumbersTab = () => {
    const { data: phoneNumbers, isLoading} = useVapiPhoneNumbers();
    
    return (
        <div className="border-t bg-background">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-6 py-4">
                            Phone Number
                        </TableHead>
                        <TableHead className="px-6 py-4">
                            Name
                        </TableHead>
                        <TableHead className="px-6 py-4">
                            Status
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(() => {
                        if (isLoading) {
                            return (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="px-6 py-8 text-center text-muted-foreground"
                                    >
                                        Loading phone numbers...
                                    </TableCell>
                                </TableRow>
                            )
                        }

                        if (phoneNumbers.length === 0) {
                            return (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="px-6 py-8 text-center text-muted-foreground"
                                    >
                                        No phone numbers configured.
                                    </TableCell>
                                </TableRow>
                            )
                        }

                        return phoneNumbers.map((phone) => (
                            <TableRow className="hover:bg-muted/50" key={phone.id}>
                                <TableCell className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <PhoneIcon className="size-4 text-muted-foreground" />
                                        <span className="font-mono">
                                            {phone.number || "Not configured"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    {phone.name || "No name"}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Badge
                                        className="capitalize"
                                        variant={
                                            phone.status === "active" ? "default" : "destructive"
                                        }
                                    >
                                        {phone.status === "active" && (
                                            <CheckCircleIcon className="mr-1 size-3" />
                                        )}
                                        {phone.status !== "active" && (
                                            <XCircleIcon className="mr-1 size-3" />
                                        )}
                                        {phone.status || "Unknown"}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    })()}
                </TableBody>
            </Table>
        </div>
    )
}