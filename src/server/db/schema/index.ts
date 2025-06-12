import * as tripSchema from "./trip.schema";
import * as authSchema from "./auth.schema";

// Trip schema exports
export const trips = tripSchema.trips;
export const participants = tripSchema.participants;
export const tripsRelations = tripSchema.tripsRelations;
export const tripParticipantsRelations = tripSchema.participantsRelations;
export const stops = tripSchema.stops;
export const stopsRelations = tripSchema.stopsRelations;

// Auth schema exports
export const users = authSchema.users;
export const accounts = authSchema.accounts;
export const sessions = authSchema.sessions;
export const verificationTokens = authSchema.verificationTokens;
export const authenticators = authSchema.authenticators;
