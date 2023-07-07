import twilio from "twilio"
import { config } from "./config.js"

const twilioAccount = config.twilio.twilioId;
const twilioToken = config.twilio.twilioToken;

export const twilioPhone = config.twilio.twilioPhone;

export const twilioClient = twilio(twilioAccount,twilioToken);