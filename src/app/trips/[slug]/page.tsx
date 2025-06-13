"use client";

import { useTrip } from "@/hooks/useTrip";
import {
  CalendarDays,
  MapPin,
  Users,
  Settings,
  Share,
  ChevronLeft,
  MoreVertical,
  Navigation,
  Calendar,
  Plus,
  ArrowDown,
  Ruler,
  Car,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TripMap } from "@/components/TripMap";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { TripWithParticipantsAndStops } from "@/server/db/schema/trip.schema";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { selectedStopIdAtom } from "@/lib/atoms/map.atoms";
import { formattedRouteInfoAtom, routeInfoAtom } from "@/lib/atoms/route.atoms";
import AddNewStopDialog from "@/components/dialogs/AddNewStopDialog";

export default function Trip() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [isSharing, setIsSharing] = useState(false);
  const [routeInfo] = useAtom(formattedRouteInfoAtom);
  const [, setRouteInfo] = useAtom(routeInfoAtom);

  useEffect(() => {
    setRouteInfo({
      distance: 0,
      duration: 0,
      isLoading: true,
    });

    return () => {
      setRouteInfo({
        distance: 0,
        duration: 0,
        isLoading: false,
      });
    };
  }, [slug, setRouteInfo]);

  const {
    data: trip,
    isLoading,
    error,
  } = useTrip({
    slug,
  });

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: trip?.title,
          text: `Check out my trip: ${trip?.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    } finally {
      setIsSharing(false);
    }
  };

  // Loading state
  if (isLoading || !trip) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4">
          <div className="flex gap-4 h-12 mb-4">
            <Skeleton className="h-full w-24" />
            <Skeleton className="h-full w-32 ml-auto" />
          </div>
          {/* Responsive loading skeletons */}
          <div className="flex flex-col lg:flex-row gap-4">
            <Skeleton className="h-64 lg:h-96 lg:flex-1" />
            <div className="lg:w-2/5 space-y-4">
              <Skeleton className="h-48" />
              <Skeleton className="h-44" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="text-center py-8">
            <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Trip not found</h2>
            <p className="text-gray-600 mb-6">
              The trip you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button onClick={() => router.push("/trips")}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Trips
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tripDuration = Math.ceil(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation - Responsive */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/trips")}
            className="text-gray-600"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Back to Trips</span>
            <span className="sm:hidden">Back</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              disabled={isSharing}
              className="hidden sm:flex"
            >
              <Share className="w-4 h-4 mr-2" />
              {isSharing ? "Sharing..." : "Share"}
            </Button>

            {/* Mobile share button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              disabled={isSharing}
              className="sm:hidden"
            >
              <Share className="w-4 h-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Trip Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="w-4 h-4 mr-2" />
                  Manage Members
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Delete Trip
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Main Content - Responsive Layout */}
      <div className="p-4">
        <div className="flex flex-col-reverse lg:flex-row gap-4 min-h-[calc(100vh-120px)]">
          {/* Map Section - Stacks on mobile, 60% on desktop */}
          <Card className="lg:flex-1 order-2 lg:order-1">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-lg sm:text-xl">
                    {trip.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {trip.description || "Your adventure route"}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="self-start sm:self-auto"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Navigate
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-2">
              <div className="h-64 sm:h-80 lg:h-[calc(100vh-280px)]">
                <TripMap
                  stops={trip.stops} // 🔥 Pass all stops instead of just start/end
                  className="h-full w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sidebar - Stacks on mobile, 40% on desktop */}
          <div className="lg:w-2/5 flex flex-col gap-4 order-1 lg:order-2">
            {/* Trip Overview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Trip Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats grid - responsive */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <CalendarDays className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-semibold text-sm sm:text-base">
                      {tripDuration} days
                    </p>
                  </div>
                  <div className="text-center">
                    <Users className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Travelers</p>
                    <p className="font-semibold text-sm sm:text-base">
                      {trip.participants?.length || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <Ruler className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="font-semibold text-sm sm:text-base">
                      {routeInfo.distance.includes("0.0")
                        ? "Calculating..."
                        : routeInfo.distance}
                    </p>
                  </div>
                  <div className="text-center">
                    <Car className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Drive-time</p>
                    <p className="font-semibold text-sm sm:text-base">
                      {routeInfo.duration.includes("0.0")
                        ? "Calculating..."
                        : routeInfo.duration}
                    </p>
                  </div>
                </div>

                {/* Dates section */}
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Departure</span>
                    <span className="font-medium text-sm">
                      {new Date(trip.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Return</span>
                    <span className="font-medium text-sm">
                      {new Date(trip.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action buttons - responsive grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                  <AddNewStopDialog>
                    <Button size="sm" variant="outline" className="w-full">
                      <Plus className="w-4 h-4" />
                      <span className="text-xs">Add Stop</span>
                    </Button>
                  </AddNewStopDialog>

                  <Button size="sm" variant="outline">
                    <Users className="w-4 h-4" />
                    <span className="text-xs">Invite</span>
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Schedule</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trip Members */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Trip Members</span>
                  <Badge variant="outline" className="text-xs">
                    {trip.participants?.length || 0}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Members list - responsive height */}
                <div className="space-y-3 max-h-48 lg:max-h-64 xl:max-h-80 overflow-y-auto">
                  {trip.participants && trip.participants.length > 0 ? (
                    trip.participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center gap-3"
                      >
                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                          <AvatarImage
                            src={participant.user.image || undefined}
                          />
                          <AvatarFallback className="text-xs">
                            {participant.user.name?.charAt(0).toUpperCase() ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {participant.user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {participant.user.email}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs hidden sm:inline-flex"
                        >
                          {participant.role}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No members yet</p>
                      <p className="text-gray-400 text-xs">
                        Invite friends to join
                      </p>
                    </div>
                  )}
                </div>

                <Button variant="outline" className="w-full mt-4" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Invite Friends</span>
                  <span className="sm:hidden">Invite</span>
                </Button>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Itinerary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trip.stops.length ? (
                    <Itinetary stops={trip.stops} />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No stops yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Itinetary({
  stops,
}: {
  stops: TripWithParticipantsAndStops["stops"];
}) {
  const [selectedStopId, setSelectedStopId] = useAtom(selectedStopIdAtom); // 🔥 Jotai state

  // Sort stops by order for proper display
  const sortedStops = [...stops].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-2 overflow-auto h-62">
      {sortedStops.map((stop, index) => (
        <div key={stop.id} className="flex flex-col items-center">
          <button
            onClick={() => setSelectedStopId(stop.id)} // 🔥 Update Jotai state
            className={cn(
              `w-full h-12 p-2 grid place-items-center rounded text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer`,
              {
                "bg-green-100 text-green-800 hover:bg-green-200":
                  stop.type === "start",
                "bg-gray-100 text-gray-800 hover:bg-gray-200":
                  stop.type === "stop",
                "bg-red-100 text-red-800 hover:bg-red-200": stop.type === "end",
                // 🔥 Highlight selected stop
                "ring-2 ring-blue-500": selectedStopId === stop.id,
              }
            )}
          >
            <span className="truncate">{stop.title}</span>
          </button>
          {index < sortedStops.length - 1 && (
            <ArrowDown className="text-muted-foreground mt-2 text-center" />
          )}
        </div>
      ))}
    </div>
  );
}
