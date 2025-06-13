"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import {
  CalendarDays,
  MapPin,
  DollarSign,
  Users,
  Tag,
  Globe,
} from "lucide-react";

import { createTripSchema, CreateTripInput } from "./schema";
import { createTrip } from "./action";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/providers/QueryProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewTripPage() {
  const [isPending, startTransition] = useTransition();
  const { push } = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const form = useForm<CreateTripInput>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      budget: undefined,
      currency: "USD",
      isPublic: false,
      tags: [],
    },
  });

  // 🔥 Add tag functionality
  const addTag = () => {
    if (tagInput.trim() && tags.length < 5 && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
  };

  // 🔥 Form submission with server action
  const onSubmit = (data: CreateTripInput) => {
    startTransition(async () => {
      const result = await createTrip(data);

      if (result.success) {
        toast.success("Trip created successfully!");
        queryClient.invalidateQueries({ queryKey: ["trips"] });
        push(`/trips/${result.tripSlug}`);
      }
      if (result?.error) {
        console.error("Form submission error:", result.error);
        // You could add toast notifications here
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Your Dream Trip ✈️
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Plan your next adventure with detailed itineraries, interactive
            maps, and smart routing
          </p>
        </div>

        {/* Form Card */}
        <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <MapPin className="w-6 h-6 text-blue-500" />
              Trip Details
            </CardTitle>
            <CardDescription>
              Tell us about your trip and we&apos;ll help you plan the perfect
              route
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Trip Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Trip Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Montenegro Adventure 2024"
                          className="text-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Give your trip a memorable name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your trip, what you're excited about, and any special plans..."
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Share the story of your adventure
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <CalendarDays className="w-4 h-4" />
                          Start Date
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <CalendarDays className="w-4 h-4" />
                          End Date
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Budget & Currency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Budget (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1000"
                            min="0"
                            step="50"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Estimated total budget
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Currency
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">
                              🇺🇸 USD - US Dollar
                            </SelectItem>
                            <SelectItem value="EUR">🇪🇺 EUR - Euro</SelectItem>
                            <SelectItem value="GBP">
                              🇬🇧 GBP - British Pound
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Tags */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Tags
                      </FormLabel>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add tags (adventure, beach, mountains...)"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addTag();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addTag}
                            disabled={tags.length >= 5 || !tagInput.trim()}
                          >
                            Add
                          </Button>
                        </div>

                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="px-3 py-1 cursor-pointer hover:bg-red-100"
                                onClick={() => removeTag(tag)}
                              >
                                {tag} ✕
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <FormDescription>
                        Add up to 5 tags to help categorize your trip
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Public Toggle */}
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Make Trip Public
                        </FormLabel>
                        <FormDescription>
                          Allow others to discover and view your trip
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 text-lg shadow-lg"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Creating Your Trip...
                    </>
                  ) : (
                    <>🚀 Create Trip</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-8 text-gray-500">
          <p>
            After creating your trip, you&apos;ll be able to add stops and plan
            your route! 🗺️
          </p>
        </div>
      </div>
    </div>
  );
}
