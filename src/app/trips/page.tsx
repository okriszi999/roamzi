"use client";
import { MapPin, Users, Calendar } from "lucide-react";

export default function TripsPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-md">
        <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <MapPin className="w-8 h-8 text-muted-foreground" />
        </div>

        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Select a Trip
        </h2>

        <p className="text-muted-foreground mb-6">
          Choose a trip from the sidebar to view details, manage participants,
          and plan your adventure.
        </p>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-muted/50">
            <Calendar className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Plan dates</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Invite friends</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <MapPin className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Add stops</p>
          </div>
        </div>
      </div>
    </div>
  );
}
