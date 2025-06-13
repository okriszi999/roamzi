import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddNewStopInput, addNewStopSchema } from "@/app/trips/new/schema";
import { Button } from "../ui/button";
import { LocationSearch } from "./LocationSearch";
import { CurrentLocationButton } from "./CurrentLocationButton";
import { Card } from "../ui/card";
import { Trash2 } from "lucide-react";
import { NewTripStop } from "@/server/db/schema/trip.schema";

const DEFAULT_VALUES: Partial<AddNewStopInput> = {
  stopType: "start" as const,
  location: "",
};

export default function AddNewStopDialog({
  children,
}: React.PropsWithChildren) {
  const [stops, setStops] = useState<NewTripStop[]>([]);

  const addStopForm = useForm<AddNewStopInput>({
    resolver: zodResolver(addNewStopSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      ...{ stopType: !listHasType("start") ? "start" : "stop" },
    },
    mode: "onChange",
  });

  // 🔥 Remove useCallback and just use regular function
  function addStop(data: AddNewStopInput) {
    console.log("🎯 Adding stop with data:", data);

    const newStop: Stop = {
      id: crypto.randomUUID(),
      stopType: data.stopType,
      location: data.location,
      lat: data.lat,
      lng: data.lng,
      city: data.city,
      country: data.country,
      countryCode: data.countryCode,
    };

    console.log("📝 Adding stop to list:", newStop);

    setStops((prev) => {
      const updated = [...prev, newStop];
      console.log("� Updated stops list:", updated);
      return updated;
    });

    // 🔥 Reset form after adding
    addStopForm.reset(DEFAULT_VALUES);
    console.log("✅ Form reset after adding stop");
  }

  function removeStop(stopId: string) {
    setStops((prev) => prev.filter((stop) => stop.id !== stopId));
    console.log("🗑️ Removed stop:", stopId);
  }

  function submitStopsList() {
    if (stops.length === 0) {
      console.warn("⚠️ No stops to submit!");
      return;
    }

    console.log("🚀 Submitting stops list:", stops);
    // Do your thing with the stops list here bro!
  }

  function listHasType(type: "start" | "stop" | "end") {
    return stops.some((s) => s.stopType === type);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Plan Your Trip</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Add Stop</h3>
            <Form {...addStopForm}>
              <form
                onSubmit={addStopForm.handleSubmit(addStop)}
                className="space-y-4"
              >
                <FormField
                  control={addStopForm.control}
                  name="stopType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem
                            value="start"
                            disabled={listHasType("start")}
                          >
                            Start
                          </SelectItem>
                          <SelectItem value="stop">Stop</SelectItem>
                          <SelectItem value="end" disabled={listHasType("end")}>
                            End
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addStopForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <LocationSearch
                            value={field.value || ""}
                            onChange={field.onChange}
                            onLocationSelect={(location) => {
                              console.log(
                                "📍 Location selected:",
                                location.displayName
                              );
                              field.onChange(location.displayName);
                              addStopForm.setValue("lat", location.lat);
                              addStopForm.setValue("lng", location.lng);
                              addStopForm.setValue("country", location.country);
                              addStopForm.setValue(
                                "countryCode",
                                location.countryCode
                              );
                              addStopForm.setValue("city", location.city);
                            }}
                          />
                          <CurrentLocationButton form={addStopForm} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!addStopForm.watch("location")}
                  onClick={() =>
                    console.log(
                      "🖱️ Submit button clicked, current stops:",
                      stops.length
                    )
                  }
                >
                  Add to Trip
                </Button>
              </form>
            </Form>
          </div>

          {stops.length > 0 && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Trip Stops ({stops.length})</h3>
                <Button onClick={submitStopsList}>Save Trip</Button>
              </div>

              <div className="space-y-2">
                {stops.map((stop, index) => (
                  <Card key={stop.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-sm">{stop.location}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {stop.type}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStop(stop.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 🔥 Debug info */}
          <div className="text-xs text-gray-500">
            Current stops count: {stops.length} | Location value: "
            {addStopForm.watch("location")}"
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
