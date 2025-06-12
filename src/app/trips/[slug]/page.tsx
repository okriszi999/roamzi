"use client";

import { useTrip } from "@/hooks/useTrip";
import { CalendarDays, MapPin, Users, Settings, Share } from "lucide-react";
import { useParams } from "next/navigation";
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

export default function Trip() {
  const { slug } = useParams() as { slug: string };
  const {
    data: trip,
    isLoading,
    error,
  } = useTrip({
    slug,
  });

  if (isLoading || !trip) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl font-bold">
                  {trip.title.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{trip.title}</h1>
                <p className="text-blue-100 opacity-90">
                  {trip.description || "Ready for your next adventure?"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="secondary" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Trip stats row */}
          <div className="flex items-center space-x-8 mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-5 h-5 text-blue-200" />
              <span className="text-blue-100">
                {new Date(trip.startDate).toLocaleDateString()} -{" "}
                {new Date(trip.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-200" />
              <span className="text-blue-100">
                {trip.participants?.length || 0} participants
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Content Cards */}
      <div className="container mx-auto px-6 py-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Trip Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Trip Details
              </CardTitle>
              <CardDescription>
                View and manage your trip information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Duration</h4>
                <p className="text-gray-600">
                  {Math.ceil(
                    (new Date(trip.endDate).getTime() -
                      new Date(trip.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Created</h4>
                <p className="text-gray-600">
                  {new Date(trip.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Status</h4>
                <Badge variant="secondary">Planning</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Participants Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Participants ({trip.participants?.length || 0})
              </CardTitle>
              <CardDescription>
                Manage who&apos;s joining this adventure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trip.participants && trip.participants.length > 0 ? (
                trip.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={participant.user.image || undefined}
                        />
                        <AvatarFallback>
                          {participant.user.name?.charAt(0).toUpperCase() ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {participant.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {participant.user.email}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {participant.role}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No participants yet
                </p>
              )}
              <Button variant="outline" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Invite Friends
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Itinerary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Trip Itinerary
            </CardTitle>
            <CardDescription>Plan your stops and activities</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mock Map */}
            <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-64 overflow-hidden mb-6">
              {/* Background pattern to look like a map */}
              <div className="absolute inset-0 opacity-20">
                <svg
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Connected line between points */}
              <svg className="absolute inset-0 w-full h-full">
                <line
                  x1="25%"
                  y1="30%"
                  x2="75%"
                  y2="70%"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                  className="animate-pulse"
                />
              </svg>

              {/* Start Point - Pulsing Dot */}
              <div
                className="absolute"
                style={{
                  left: "25%",
                  top: "30%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="relative">
                  {/* Outer pulsing ring */}
                  <div className="absolute inset-0 w-8 h-8 bg-green-400 rounded-full animate-ping opacity-75"></div>
                  {/* Inner solid dot */}
                  <div className="relative w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                {/* Label */}
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white px-3 py-1 rounded-full shadow-md border">
                    <span className="text-xs font-medium text-gray-700">
                      Start
                    </span>
                  </div>
                </div>
              </div>

              {/* End Point - Pulsing Dot */}
              <div
                className="absolute"
                style={{
                  left: "75%",
                  top: "70%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="relative">
                  {/* Outer pulsing ring */}
                  <div className="absolute inset-0 w-8 h-8 bg-red-400 rounded-full animate-ping opacity-75"></div>
                  {/* Inner solid dot */}
                  <div className="relative w-4 h-4 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                {/* Label */}
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white px-3 py-1 rounded-full shadow-md border">
                    <span className="text-xs font-medium text-gray-700">
                      Destination
                    </span>
                  </div>
                </div>
              </div>

              {/* Mock city labels */}
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-xs font-medium text-gray-600">
                  San Francisco
                </span>
              </div>
              <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-xs font-medium text-gray-600">
                  Los Angeles
                </span>
              </div>
            </div>

            {/* Trip stops list */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">San Francisco, CA</p>
                    <p className="text-xs text-gray-500">Starting point</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">Day 1</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">Los Angeles, CA</p>
                    <p className="text-xs text-gray-500">Final destination</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">Day 3</span>
              </div>
            </div>

            {/* Add stop button */}
            <div className="mt-6 pt-4 border-t">
              <Button variant="outline" className="w-full">
                <MapPin className="w-4 h-4 mr-2" />
                Add Stop Between
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
