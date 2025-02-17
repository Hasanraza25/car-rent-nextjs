import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req) {
  const {
    userId,
    carId,
    carName,
    pickupCity,
    pickupLocation,
    dropOffCity,
    dropoffLocation,
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
    days,
    userName,
    userPhone,
    userAddress,
    userCity,
    userEmail,
  } = await req.json();

  try {
    const reservation = {
      _type: "reservation",
      userId,
      carId,
      carName,
      pickupLocation: pickupCity,
      dropoffLocation: dropOffCity,
      pickupDate,
      dropoffDate,
      days,
      userName,
      userPhone,
      userAddress,
      userCity,
      status: "confirmed",
    };

    const result = await client.create(reservation);

    const reservationUrl = `${process.env.BASE_URL}/reservations/${result._id}`;

    // In your API route (/api/reservations/create-reservation)
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const dropoffDateTime = new Date(`${dropoffDate}T${dropoffTime}`);

    // Check if the date objects are valid
    if (isNaN(pickupDateTime.getTime()) || isNaN(dropoffDateTime.getTime())) {
      throw new Error("Invalid date or time format");
    }
    // Before creating Date objects, validate time format
    const isValidTime = (time) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
    if (!isValidTime(pickupTime)) throw new Error("Invalid pickup time format");
    if (!isValidTime(dropoffTime))
      throw new Error("Invalid dropoff time format");

    // Format the dates to a more user-friendly format
    const formattedPickupDate = pickupDateTime.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const formattedDropoffDate = dropoffDateTime.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Send confirmation email with detailed instructions
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Reservation Confirmation",
      html: `<p>Dear ${userName},</p>&nbsp;
          <p>Thank you for choosing our car rental service. We are pleased to confirm your reservation. Below are the details of your reservation:</p>&nbsp;
          <p>Your reserved car is a <strong>${carName}</strong>. You will pick it up from our location at <strong>${pickupLocation}</strong> in ${pickupCity} on <strong>${formattedPickupDate}</strong> and return it to <strong>${dropoffLocation}</strong> in ${dropOffCity} on <strong>${formattedDropoffDate}</strong>. The rental period is for <strong>${days} days</strong>.</p>
          &nbsp;
          <p>To ensure a smooth and efficient process, please bring the following documents when you come to pick up the car:</p>
        
        <ul>
          <li><strong>Valid Driver’s License:</strong> A government-issued driver's license (not expired). If you are an international traveler, an International Driving Permit (IDP) may be required.</li>
          <li><strong>Credit Card Used for Booking:</strong> The same credit card used for payment must be presented at pickup. A security deposit may be required.</li>
          <li><strong>Reservation Confirmation Email:</strong> A printed or digital copy of this email.</li>
          <li><strong>Proof of Insurance (if applicable):</strong> If using personal insurance, bring documentation confirming coverage for rental cars.</li>
          <li><strong>Government-Issued ID (if required):</strong> Some locations require an additional form of identification such as a passport or national ID.</li>
          <li><strong>Additional Driver’s Documents (if applicable):</strong> If adding extra drivers, they must present their driver’s license and ID.</li>
        </ul>
  &nbsp;
        <p><strong>Important Information:</strong></p>
        <ul>
          <li><strong>Fuel Policy:</strong> Please return the car with the same fuel level as at pickup to avoid additional charges.</li>
          <li><strong>Late Return Fees:</strong> A late fee may apply if the vehicle is returned past the agreed drop-off time.</li>
          <li><strong>Emergency Contact:</strong> In case of any issues, contact our support team at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a>.</li>
          <li><strong>Reservation Details:</strong> You can view your reservation details <a href="${reservationUrl}" target="_blank">here</a>.</li>
        </ul>
  &nbsp;
        <p>Please arrive at least 15 minutes before your scheduled pickup time to allow for a smooth handover process. Our staff will guide you through the necessary paperwork and vehicle inspection.</p>&nbsp;
        <p>If you have any questions or need to make changes to your reservation, feel free to contact us.</p>
        <p>We look forward to serving you and hope you have a great experience with our car rental service.</p>
  &nbsp;
        <p>Best regards,<br>Morent Team</p>`,
    });
    return NextResponse.json({
      reservation: result,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
