import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Yormand Dental Clinic database...");

  // ---------- Admin user ----------
  const adminEmail = process.env.ADMIN_EMAIL || "admin@yormand.tj";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const hashed = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashed,
      name: "Yormand Admin",
      role: "SUPER_ADMIN",
    },
  });

  // ---------- Site settings ----------
  await prisma.siteSetting.upsert({
    where: { id: "settings" },
    update: {},
    create: {
      id: "settings",
      data: JSON.stringify({
        clinicName: "Yormand Dental Clinic",
        logo: "",
        favicon: "",
        phone: "+992 88 787 6006",
        whatsapp: "",
        telegram: "",
        instagram: "[Official Instagram link to be confirmed by clinic — aggregated sources suggest @Yormand.dentalclinic]",
        email: "",
        address: "Pulodi Street 4, Dushanbe, Tajikistan",
        workingHours: "Daily, approximately 08:00–21:00 (to be confirmed)",
        googleMapsLink: "",
        yandexMapsLink: "",
        landmark: "Approx. 193m from Alisher Navoi Park",
      }),
    },
  });

  // ---------- Social links ----------
  await prisma.socialLink.createMany({
    data: [
      { platform: "instagram", url: "[to be confirmed]", visible: false, order: 1 },
      { platform: "whatsapp", url: "[to be confirmed]", visible: false, order: 2 },
      { platform: "telegram", url: "[to be confirmed]", visible: false, order: 3 },
    ],
  });

  // ---------- Homepage sections ----------
  const sections = [
    { key: "hero", order: 1 },
    { key: "trust", order: 2 },
    { key: "services", order: 3 },
    { key: "about", order: 4 },
    { key: "doctors", order: 5 },
    { key: "gallery", order: 6 },
    { key: "reviews", order: 7 },
    { key: "beforeafter", order: 8 },
    { key: "cta", order: 9 },
  ];
  for (const s of sections) {
    await prisma.homepageSection.upsert({
      where: { key: s.key },
      update: {},
      create: { key: s.key, order: s.order, visible: true, dataJson: "{}" },
    });
  }

  // ---------- Services (from confirmed Yandex-listed categories) ----------
  type SeedService = {
    slug: string;
    category: string;
    featured?: boolean;
    tj: string; ru: string; en: string;
  };

  const services: SeedService[] = [
    { slug: "caries-treatment", category: "General Dentistry", featured: true, tj: "Табобати кариес", ru: "Лечение кариеса", en: "Caries Treatment" },
    { slug: "root-canal", category: "Endodontics", featured: true, tj: "Табобати каналҳо", ru: "Лечение каналов", en: "Root Canal Treatment" },
    { slug: "filling", category: "General Dentistry", tj: "Пломба", ru: "Пломбирование", en: "Dental Filling" },
    { slug: "periodontal-treatment", category: "General Dentistry", tj: "Табобати периодонтит", ru: "Лечение периодонтита", en: "Periodontal Treatment" },
    { slug: "gum-disease-treatment", category: "General Dentistry", tj: "Табобати бемориҳои милк", ru: "Лечение заболеваний десен", en: "Gum Disease Treatment" },
    { slug: "tooth-restoration", category: "General Dentistry", tj: "Реставратсияи дандон", ru: "Реставрация зуба", en: "Tooth Restoration" },
    { slug: "teeth-whitening", category: "Aesthetic Dentistry", featured: true, tj: "Сафедкунии дандон", ru: "Отбеливание зубов", en: "Teeth Whitening" },
    { slug: "veneers", category: "Aesthetic Dentistry", featured: true, tj: "Винирҳо", ru: "Виниры", en: "Veneers" },
    { slug: "lumineers", category: "Aesthetic Dentistry", tj: "Люминирҳо", ru: "Люминиры", en: "Lumineers" },
    { slug: "braces", category: "Orthodontics", featured: true, tj: "Брекетҳо", ru: "Брекеты", en: "Braces" },
    { slug: "aligners", category: "Orthodontics", tj: "Элайнерҳо", ru: "Элайнеры", en: "Clear Aligners" },
    { slug: "crowns", category: "Prosthetics", tj: "Коронка", ru: "Коронки", en: "Dental Crowns" },
    { slug: "dentures", category: "Prosthetics", tj: "Протезирование", ru: "Протезирование", en: "Dentures / Prosthetics" },
    { slug: "denture-repair", category: "Prosthetics", tj: "Таъмири протезҳо", ru: "Ремонт протезов", en: "Denture Repair" },
    { slug: "dental-implants", category: "Implantology & Surgery", featured: true, tj: "Имплантатсия", ru: "Имплантация", en: "Dental Implants" },
    { slug: "tooth-extraction", category: "Implantology & Surgery", featured: true, tj: "Хориҷ кардани дандон", ru: "Удаление зубов", en: "Tooth Extraction" },
    { slug: "maxillofacial-surgery", category: "Implantology & Surgery", tj: "Ҷарроҳии maxillofacial", ru: "Челюстно-лицевая хирургия", en: "Maxillofacial Surgery" },
    { slug: "cyst-treatment", category: "Implantology & Surgery", tj: "Табобати киста", ru: "Лечение кисты", en: "Cyst Treatment" },
    { slug: "x-ray", category: "Diagnostics", tj: "Рентгенография", ru: "Рентгенография", en: "X-Ray" },
    { slug: "ct-scan", category: "Diagnostics", tj: "Томографияи компютерӣ", ru: "Компьютерная томография", en: "CT Scan" },
    { slug: "dental-hygiene", category: "Dental Hygiene", featured: true, tj: "Гигиенаи даҳон", ru: "Гигиена полости рта", en: "Dental Hygiene / Cleaning" },
  ];

  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        category: s.category,
        featured: !!s.featured,
        active: true,
        order: i,
        price: null,
        priceVisible: false,
        translations: {
          create: [
            { locale: "tj", title: s.tj, shortDescription: "", fullDescription: "" },
            { locale: "ru", title: s.ru, shortDescription: "", fullDescription: "" },
            { locale: "en", title: s.en, shortDescription: "", fullDescription: "" },
          ],
        },
      },
    });
  }

  // ---------- Doctors ----------
  // NOTE: Per research, only partial/unverified doctor info exists in public sources.
  // These are seeded as clearly-marked PLACEHOLDER profiles for the clinic to confirm
  // and complete via the Admin Panel — no biography or credential details are invented.
  type SeedDoctor = { slug: string; name: string; specializationRu?: string; note: string };
  const doctors: SeedDoctor[] = [
    { slug: "asadulloeva-adiba", name: "Асадуллоева Адиба", specializationRu: "Стоматолог-терапевт", note: "Mentioned positively in a patient review (attentive with anxious patients). Full profile pending clinic confirmation." },
    { slug: "shukurov-saidahmad", name: "Шукуров Саидахмад", specializationRu: "Стоматолог", note: "Mentioned in a patient review for attentiveness and professionalism. Full profile pending clinic confirmation." },
    { slug: "abdulaev-behruz", name: "Абдулаев Бехруз Абдулаевич", specializationRu: "Стоматолог-хирург-имплантолог", note: "Aggregated source states TSMU graduate (2013). Details pending clinic confirmation." },
    { slug: "doctor-placeholder-1", name: "[Doctor name to be confirmed]", note: "A doctor's profile (therapist/endodontist, education referenced 2018–2023 and 2023–2025, ~3 years experience) appeared in aggregated sources without a full confirmed name. Placeholder pending clinic confirmation." },
  ];

  for (let i = 0; i < doctors.length; i++) {
    const d = doctors[i];
    await prisma.doctor.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        slug: d.slug,
        isPlaceholder: true,
        order: i,
        active: true,
        translations: {
          create: [
            { locale: "tj", fullName: d.name, specialization: d.specializationRu || "[Тахассус тасдиқ нашудааст]", biography: d.note },
            { locale: "ru", fullName: d.name, specialization: d.specializationRu || "[Специализация не подтверждена]", biography: d.note },
            { locale: "en", fullName: d.name, specialization: d.specializationRu || "[Specialization to be confirmed]", biography: d.note },
          ],
        },
      },
    });
  }

  // ---------- Reviews (real, sourced from Yandex Maps aggregation, clearly attributed) ----------
  const reviews = [
    { reviewerName: "Yandex Maps reviewer", rating: 5, content: "Modern equipment, clean clinic and attentive specialists.", source: "Yandex Maps review", approved: true, order: 1 },
    { reviewerName: "Yandex Maps reviewer", rating: 5, content: "Very clean and well-organized clinic; staff explained the treatment process clearly.", source: "Yandex Maps review", approved: true, order: 2 },
  ];
  for (const r of reviews) {
    await prisma.review.create({ data: r });
  }

  // ---------- SEO defaults ----------
  const pages = ["home", "about", "services", "doctors", "gallery", "reviews", "prices", "appointment", "contact"];
  for (const p of pages) {
    await prisma.seoEntry.upsert({
      where: { pageKey: p },
      update: {},
      create: {
        pageKey: p,
        seoTitle: `Yormand Dental Clinic — ${p}`,
        seoDescription: "Premium dental clinic in Dushanbe, Tajikistan.",
        robots: "index,follow",
      },
    });
  }

  console.log("Seed complete.");
  console.log(`Admin login: ${adminEmail} / ${adminPassword} (CHANGE THIS PASSWORD IMMEDIATELY)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
