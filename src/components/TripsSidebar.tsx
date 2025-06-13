"use client";
import { useTrips } from "@/hooks/useTrips";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, CalendarDays, Users, MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function TripsSidebar() {
  const [mounted, setMounted] = useState(false);
  const { data: trips, isLoading, error } = useTrips();
  const { data: session } = useSession();

  const { state } = useSidebar();
  const pathname = usePathname();

  const isCollapsed = state === "collapsed";

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default";
      case "admin":
        return "secondary";
      case "companion":
        return "outline";
      default:
        return "outline";
    }
  };

  // Show skeleton while mounting or loading
  if (!mounted || isLoading) {
    return <TripsSidebarSkeleton />;
  }

  return (
    <TooltipProvider>
      <Sidebar className="border-r" collapsible="icon" variant="floating">
        <SidebarRail />
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-between">
            {!isCollapsed ? (
              <>
                <h2 className="text-lg font-semibold">Your Trips</h2>
                <Button size="sm" asChild>
                  <Link href="/trips/new">
                    <Plus className="w-4 h-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <div className="flex justify-center w-full">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" asChild>
                      <Link href="/trips/new">
                        <Plus className="w-4 h-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Create Trip</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {error ? (
              <div className="p-4 text-center">
                {!isCollapsed ? (
                  <>
                    <p className="text-sm text-red-600 mb-2">
                      Failed to load trips
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.location.reload()}
                      >
                        ⚠️
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Failed to load trips - Click to retry</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            ) : !trips || trips.length === 0 ? (
              <div className="p-4 text-center">
                {!isCollapsed ? (
                  <div className="mb-4">
                    <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-3">No trips yet</p>
                    <Button size="sm" asChild>
                      <Link href="/trips/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Trip
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center mx-auto">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>No trips yet - Create your first trip</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            ) : (
              trips.map((trip) => {
                const userRole = trip.participants?.find(
                  (p) => p.userId === session?.user?.id
                )?.role;
                const isSelected = pathname === `/trips/${trip.id}`;

                if (isCollapsed) {
                  return (
                    <SidebarMenuItem key={trip.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={isSelected}
                            className={cn(
                              "w-full justify-center p-3 m-auto",
                              isSelected &&
                                "bg-accent border shadow rounded-full"
                            )}
                          >
                            <Link href={`/trips/${trip.id}`}>
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={undefined} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                                  {trip.title.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <div className="space-y-1">
                            <p className="font-medium">{trip.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(trip.startDate)} -{" "}
                              {formatDate(trip.endDate)}
                            </p>
                            <p className="text-xs">
                              {trip.participants?.length || 0} participants
                            </p>
                            {userRole && (
                              <Badge
                                variant={getRoleBadgeVariant(userRole)}
                                className="text-xs"
                              >
                                {userRole}
                              </Badge>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={trip.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isSelected}
                      className={cn(
                        "w-full justify-start p-3 h-auto",
                        isSelected && "bg-accent"
                      )}
                    >
                      <Link href={`/trips/${trip.slug}`}>
                        <div className="flex-1 space-y-2">
                          {/* Trip title and role */}
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium text-sm line-clamp-2 pr-2">
                              {trip.title}
                            </h3>
                            {userRole && (
                              <Badge
                                variant={getRoleBadgeVariant(userRole)}
                                className="text-xs shrink-0"
                              >
                                {userRole}
                              </Badge>
                            )}
                          </div>

                          {/* Date range */}
                          <div className="flex items-center text-xs text-muted-foreground">
                            <CalendarDays className="w-3 h-3 mr-1" />
                            <span>
                              {formatDate(trip.startDate)} -{" "}
                              {formatDate(trip.endDate)}
                            </span>
                          </div>

                          {/* Participants */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Users className="w-3 h-3 mr-1" />
                              <span>{trip.participants?.length || 0}</span>
                            </div>

                            {trip.participants &&
                              trip.participants.length > 0 && (
                                <div className="flex -space-x-1">
                                  {trip.participants
                                    .slice(0, 3)
                                    .map((participant) => (
                                      <Avatar
                                        key={participant.id}
                                        className="w-5 h-5 border border-background"
                                      >
                                        <AvatarImage
                                          src={
                                            participant.user.image || undefined
                                          }
                                        />
                                        <AvatarFallback className="text-xs">
                                          {participant.user.name
                                            ?.charAt(0)
                                            .toUpperCase() || "U"}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                  {trip.participants.length > 3 && (
                                    <div className="w-5 h-5 bg-muted rounded-full border border-background flex items-center justify-center">
                                      <span className="text-xs">
                                        +{trip.participants.length - 3}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })
            )}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
}

// Separate skeleton component with exact same structure
function TripsSidebarSkeleton() {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 bg-muted rounded animate-pulse" />
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {Array.from({ length: 3 }).map((_, i) => (
            <SidebarMenuItem key={i}>
              <div className="w-full p-3 space-y-2">
                {/* Title and role skeleton - match exact layout */}
                <div className="flex items-start justify-between">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                </div>

                {/* Date skeleton */}
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-muted rounded animate-pulse mr-1" />
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                </div>

                {/* Participants skeleton */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-muted rounded animate-pulse mr-1" />
                    <div className="h-3 w-4 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="flex -space-x-1">
                    <div className="w-5 h-5 bg-muted rounded-full animate-pulse" />
                    <div className="w-5 h-5 bg-muted rounded-full animate-pulse" />
                    <div className="w-5 h-5 bg-muted rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
