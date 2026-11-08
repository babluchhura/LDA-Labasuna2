import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../src/db/index.ts';
import { admins, galleryItems, newsEvents, visitorStats } from '../src/db/schema.ts';

export async function seedDatabaseIfEmpty() {
  try {
    // 1. Ensure Admin Account Exists
    const existingAdmins = await db.select().from(admins).where(eq(admins.username, 'labasuna@00'));
    if (existingAdmins.length === 0) {
      const defaultPassword = process.env.ADMIN_PASSWORD || 'labasuna@00';
      const passwordHash = await bcrypt.hash(defaultPassword, 10);
      await db.insert(admins).values({
        username: 'labasuna@00',
        passwordHash,
        role: 'SUPER_ADMIN',
      });
      console.log('✓ Seeded default admin account: labasuna@00');
    }

    // 2. Ensure Visitor Stats Exist
    const stats = await db.select().from(visitorStats);
    if (stats.length === 0) {
      await db.insert(visitorStats).values({ count: 1248 });
      console.log('✓ Seeded initial visitor count');
    }

    // 3. Ensure Initial News & Events
    const events = await db.select().from(newsEvents);
    if (events.length === 0) {
      await db.insert(newsEvents).values([
        {
          title: 'Free Health & Eye Checkup Camp at Lathore',
          category: 'Health Awareness',
          summary: 'LDA organised a comprehensive free health camp providing consultations and free medicines for 450+ villagers.',
          content: 'Liberal Democratic Association (LDA), spearheaded by Advocate & Social Worker Laba Suna, conducted an extensive health screening camp in Lathore, Nuapada/Balangir border region. Specialist doctors, ophthalmologists, and general physicians provided free consultations, eye checks, and distributed essential prescribed medicines.',
          date: '2026-10-18',
          location: 'Community Hall, Lathore, Odisha',
          imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
        },
        {
          title: 'Educational Kit & Book Distribution Drive',
          category: 'Education Support',
          summary: 'Over 300 underprivileged primary students received notebooks, geometry sets, and uniforms.',
          content: 'To foster quality education among tribal and rural children, LDA distributed complete academic kits comprising backpacks, notebooks, stationary, and textbooks to students across 5 remote schools in Western Odisha.',
          date: '2026-09-25',
          location: 'Govt. Nodal School, Lathore Region, Odisha',
          imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
        },
        {
          title: 'Legal Literacy & Rights Awareness Seminar',
          category: 'Social Work',
          summary: 'Advocate Laba Suna delivered an informative address on basic constitutional rights, land tenancy, and welfare schemes.',
          content: 'A public legal awareness seminar was hosted to educate rural citizens about their fundamental legal rights, Right to Information (RTI), welfare entitlements under government schemes, and legal remedies available for the marginalized.',
          date: '2026-08-15',
          location: 'LDA Central Office, Lathore, Odisha',
          imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
        },
      ]);
      console.log('✓ Seeded news & events');
    }

    // 4. Ensure Initial Gallery Items
    const gallery = await db.select().from(galleryItems);
    if (gallery.length === 0) {
      await db.insert(galleryItems).values([
        {
          title: 'Community Relief & Grain Distribution',
          category: 'Social Work',
          description: 'Distributing food ration packets and blankets to elderly and destitute families.',
          eventDate: '2026-10-05',
          imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
        },
        {
          title: 'Rural Cleanliness & Sanitation Drive',
          category: 'Community Events',
          description: 'Youth volunteers and LDA members participating in clean village campaign.',
          eventDate: '2026-09-12',
          imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
        },
        {
          title: 'Girl Child Education Workshop',
          category: 'Education Activities',
          description: 'Inspiring rural parents to support secondary education and career skills for daughters.',
          eventDate: '2026-08-28',
          imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
        },
        {
          title: 'Blood Donation & Preventive Care Camp',
          category: 'Health Awareness',
          description: 'Voluntary blood donation camp with over 80 units collected for local district hospital.',
          eventDate: '2026-07-20',
          imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
        },
        {
          title: 'Tribal Farmers Empowerment Meet',
          category: 'Public Welfare Programmes',
          description: 'Guidance on organic agricultural techniques, subsidies, and fair pricing mechanisms.',
          eventDate: '2026-06-14',
          imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
        },
        {
          title: 'Legal Aid & Free Legal Counseling Desk',
          category: 'Social Work',
          description: 'Advocate Laba Suna offering pro bono counseling to dispute parties and needy persons.',
          eventDate: '2026-05-19',
          imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
        },
      ]);
      console.log('✓ Seeded gallery items');
    }
  } catch (err) {
    console.error('Error during database seed initialization:', err);
  }
}
