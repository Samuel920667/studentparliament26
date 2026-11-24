// src/data/senators.ts
export interface SenatorRecord {
  id: string;
  name: string;
  department: string;
  phone: string;
  whatsappNumber: string;
  /**
   * Path inside /public/senators (e.g. "/senators/samuel-peters.jpg").
   * Leave undefined until the senator's photo is added.
   */
  photo?: string;
}

export const SENATORS_2026_2027: readonly SenatorRecord[] = [
  {
    id: "ayuba-raphael",
    name: "Ayuba Raphael",
    department: "Accounting",
    phone: "09011719695",
    whatsappNumber: "2349011719695",
    photo: "/senators/ayuba-raphael.jpg",
  },
  {
    id: "ugeh-cyril-odiakachukwu",
    name: "Ugeh Cyril Odiakachukwu",
    department: "College of Medicine",
    phone: "09019109512",
    whatsappNumber: "2349019109512",
    photo: "/senators/ugeh-cyril-odiakachukwu.jpg",
  },
  {
    id: "favour-nathaniel-mmasichukwu",
    name: "Favour Nathaniel Mmasichukwu",
    department: "Mass Communication",
    phone: "07039530330",
    whatsappNumber: "2347039530330",
    photo: "/senators/favour-nathaniel-mmasichukwu.jpg",
  },
  {
    id: "esther-odih",
    name: "Esther David Odih",
    department: "Political Science and Diplomacy",
    phone: "09158310171",
    whatsappNumber: "2349158310171",
    photo: "/senators/esther-odih.jpg",
  },
  {
    id: "akura-philip-vertor",
    name: "Akura Philip Vertor",
    department: "Public Administration",
    phone: "08062900649",
    whatsappNumber: "2348062900649",
    // photo: "/senators/akura-philip-vertor.jpg",
  },
  {
    id: "aguoru-johnbosco-chukwuka",
    name: "Aguoru Johnbosco Chukwuka",
    department: "Software Engineering",
    phone: "09137941884",
    whatsappNumber: "2349137941884",
    // photo: "/senators/aguoru-johnbosco-chukwuka.jpg",
  },
  {
    id: "sadare-doyinsola-ayomide",
    name: "Sadare Doyinsola Ayomide",
    department: "Nursing",
    phone: "09073263822",
    whatsappNumber: "2349073263822",
    photo: "/senators/sadare-doyinsola-ayomide.jpg",
  },
  {
    id: "mustapha-anisa-esther",
    name: "Mustapha Anisa Esther",
    department: "Biochemistry",
    phone: "08097405547",
    whatsappNumber: "2348097405547",
    photo: "/senators/mustapha-anisa-esther.jpg",
  },
  {
    id: "tibangs-ayuba",
    name: "Tibangs Ayuba",
    department: "Educational Foundations",
    phone: "07083299621",
    whatsappNumber: "2347083299621",
    // photo: "/senators/tibangs-ayuba.jpg",
  },
  {
    id: "anosike-chisom-naomi",
    name: "Anosike Chisom Naomi",
    department: "Economics",
    phone: "07052521934",
    whatsappNumber: "2347052521934",
    photo: "/senators/anosike-chisom-naomi.jpg",
  },
  {
    id: "ani-williams-chioma",
    name: "Ani Williams Chioma",
    department: "Pharmaceutical Sciences",
    phone: "08028443498",
    whatsappNumber: "2348028443498",
    photo: "/senators/ani-williams-chioma.jpg",
  },
  {
    id: "longshal-blaise-longgap",
    name: "Longshal Blaise Longgap",
    department: "Philosophy",
    phone: "09126754501",
    whatsappNumber: "2349126754501",
    photo: "/senators/longshal-blaise-longgap.jpg",
  },
  {
    id: "chukwuemeka-favour-chinemerem",
    name: "Chukwuemeka Favour Chinemerem",
    department: "Medical Laboratory Science",
    phone: "08163185164",
    whatsappNumber: "2348163185164",
    // photo: "/senators/chukwuemeka-favour-chinemerem.jpg",
  },
  {
    id: "ajayi-oluwafemi-christiana",
    name: "Ajayi Oluwafemi Christiana",
    department: "History and International Relations",
    phone: "07037320134",
    whatsappNumber: "2347037320134",
    photo: "/senators/ajayi-oluwafemi-christiana.jpg",
  },
  {
    id: "adekolu-jane-bukola",
    name: "Adekolu Jane Bukola",
    department: "Industrial Chemistry",
    phone: "08139084267",
    whatsappNumber: "2348139084267",
    photo: "/senators/adekolu-jane-bukola.jpg",
  },
  {
    id: "ogueri-nzubechi-stephanie",
    name: "Ogueri Nzubechi Stephanie",
    department: "Microbiology",
    phone: "08136549319",
    whatsappNumber: "2348136549319",
    photo: "/senators/ogueri-nzubechi-stephanie.jpg",
  },
  {
    id: "charity-law",
    name: "Charity Yerima Adamu",
    department: "Faculty of Law",
    phone: "08100036394",
    whatsappNumber: "2348100036394",
    photo: "/senators/charity-law.jpg",
  },
  {
    id: "samuel-peters",
    name: "Samuel Peters",
    department: "Computer Science",
    phone: "08069010564",
    whatsappNumber: "2348069010564",
    photo: "/senators/samuel-peters.jpg",
  },
  {
    id: "ituma-chiedozie-benedict",
    name: "Ituma Chiedozie Benedict",
    department: "Computer Engineering",
    phone: "07057517653",
    whatsappNumber: "2347057517653",
    photo: "/senators/ituma-chiedozie-benedict.jpg",
  },
  {
    id: "akor-simon",
    name: "Akor Simon",
    department: "Electrical and Electronics Engineering",
    phone: "07026484665",
    whatsappNumber: "2347026484665",
    photo: "/senators/akor-simon.jpg",
  },
  {
    id: "akiode-oreoluwa-esther",
    name: "Akiode Oreoluwa Esther",
    department: "Business Administration",
    phone: "08113249437",
    whatsappNumber: "2348113249437",
    // photo: "/senators/akiode-oreoluwa-esther.jpg",
  },
];

export function buildSenatorWhatsAppLink(senator: SenatorRecord): string {
  const message = encodeURIComponent(
    `Hello Sen. ${senator.name}, I am reaching out from ${senator.department} via the SDP Portal.`
  );

  return `https://wa.me/${senator.whatsappNumber}?text=${message}`;
}