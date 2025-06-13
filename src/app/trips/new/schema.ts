import { z } from "zod";

export const createTripSchema = z
  .object({
    title: z
      .string()
      .min(3, "Trip title must be at least 3 characters")
      .max(100, "Title too long"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description too long"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    budget: z.number().min(0, "Budget must be positive").optional(),
    currency: z.enum(["USD", "EUR", "GBP"], {
      errorMap: () => ({ message: "Select a currency" }),
    }),
    isPublic: z.boolean().default(false).optional(),
    tags: z
      .array(z.string())
      .max(5, "Maximum 5 tags allowed")
      .default([])
      .optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start < end;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export type CreateTripInput = z.infer<typeof createTripSchema>;

export const addNewStopSchema = z.object({
  stopType: z.enum(["start", "stop", "end"]),
  location: z.string().min(1, "Location is required"),
  lat: z.number().min(-90, "Invalid latitude").max(90, "Invalid latitude"),
  lng: z.number().min(-180, "Invalid longitude").max(180, "Invalid longitude"),
  country: z.string().min(1, "Country is required"),
  countryCode: z.string().min(1, "Country code is required"),
  city: z.string().min(1, "City is required"),
});

export type AddNewStopInput = z.infer<typeof addNewStopSchema>;
