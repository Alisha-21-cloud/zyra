import z from "zod";
import { widgetSettingsSchema } from "./schemas";

export type FormSchema = z.infer<typeof widgetSettingsSchema>;