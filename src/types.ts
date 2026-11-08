export interface Member {
  id: number;
  registrationId: string;
  fullName: string;
  fatherName: string;
  mobileNumber: string;
  email: string;
  dob: string;
  gender: string;
  fullAddress: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  occupation: string;
  profilePhotoUrl?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  remarks?: string | null;
  termsAccepted: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  referenceId?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  description?: string | null;
  eventDate?: string | null;
  createdAt: string;
}

export interface NewsEvent {
  id: number;
  title: string;
  category: string;
  summary: string;
  content: string;
  date: string;
  location: string;
  imageUrl?: string | null;
  createdAt: string;
}

export interface AdminStats {
  totalMembers: number;
  pendingMembers: number;
  approvedMembers: number;
  rejectedMembers: number;
  visitorCount: number;
  unreadNotificationsCount: number;
  totalContactsCount: number;
  unreadContactsCount: number;
  totalDonationsCount?: number;
  totalDonationAmount?: number;
  recentMembers: Member[];
}

export interface Donation {
  id: number;
  donationId: string;
  donorName: string;
  mobileNumber: string;
  email?: string | null;
  panNumber?: string | null;
  address?: string | null;
  cause: string;
  amount: number;
  paymentMethod: string;
  transactionUtr?: string | null;
  paymentStatus: string;
  isOtpVerified: boolean;
  receiptNumber: string;
  createdAt: string;
}
