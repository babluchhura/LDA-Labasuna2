import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Firebase Auth Users Table (as required by Cloud SQL setup skill)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Admin accounts table (secure hashed password)
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('ADMIN'),
  createdAt: timestamp('created_at').defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
});

// Member Registrations
export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  registrationId: text('registration_id').notNull().unique(),
  fullName: text('full_name').notNull(),
  fatherName: text('father_name').notNull(),
  mobileNumber: text('mobile_number').notNull(),
  email: text('email').notNull(),
  dob: text('dob').notNull(),
  gender: text('gender').notNull(),
  fullAddress: text('full_address').notNull(),
  village: text('village').notNull(),
  district: text('district').notNull(),
  state: text('state').notNull(),
  pincode: text('pincode').notNull(),
  occupation: text('occupation').notNull(),
  profilePhotoUrl: text('profile_photo_url'),
  status: text('status').notNull().default('PENDING'), // PENDING, APPROVED, REJECTED
  remarks: text('remarks'),
  termsAccepted: boolean('terms_accepted').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Admin Notifications
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(), // REGISTRATION, ENQUIRY, STATUS_CHANGE
  title: text('title').notNull(),
  message: text('message').notNull(),
  referenceId: text('reference_id'),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Contact Messages / Enquiries
export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  mobile: text('mobile').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('UNREAD'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Gallery Items
export const galleryItems = pgTable('gallery_items', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  imageUrl: text('image_url').notNull(),
  description: text('description'),
  eventDate: text('event_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

// News and Events
export const newsEvents = pgTable('news_events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  summary: text('summary').notNull(),
  content: text('content').notNull(),
  date: text('date').notNull(),
  location: text('location').notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Website Visitor Counter
export const visitorStats = pgTable('visitor_stats', {
  id: serial('id').primaryKey(),
  count: integer('count').notNull().default(1),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Real Online Donations Table
export const donations = pgTable('donations', {
  id: serial('id').primaryKey(),
  donationId: text('donation_id').notNull().unique(), // e.g. LDA-DON-2026-XXXX
  donorName: text('donor_name').notNull(),
  mobileNumber: text('mobile_number').notNull(),
  email: text('email'),
  panNumber: text('pan_number'),
  address: text('address'),
  cause: text('cause').notNull(),
  amount: integer('amount').notNull(),
  paymentMethod: text('payment_method').notNull().default('UPI'), // UPI, BANK_TRANSFER, QR_SCAN
  transactionUtr: text('transaction_utr'),
  paymentStatus: text('payment_status').notNull().default('VERIFIED'), // PENDING_VERIFICATION, VERIFIED
  isOtpVerified: boolean('is_otp_verified').notNull().default(true),
  receiptNumber: text('receipt_number').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Mobile Verification OTP Store
export const otpStore = pgTable('otp_store', {
  id: serial('id').primaryKey(),
  mobileNumber: text('mobile_number').notNull(),
  otpHash: text('otp_hash').notNull(),
  otpPlainForSimulation: text('otp_plain_for_simulation'),
  isVerified: boolean('is_verified').notNull().default(false),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
