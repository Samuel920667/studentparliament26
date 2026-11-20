// src/data/leadership.ts
export type OrbitalSlot =
  | "top"
  | "upper-left"
  | "upper-right"
  | "mid-left"
  | "mid-right"
  | "lower-left"
  | "lower-right";

export interface PrincipalOfficer {
  id: string;
  name: string;
  office: string;
  department: string;
  phone: string;
  whatsappNumber: string;
  photo: string;
  responsibility: string;
  slot?: OrbitalSlot;
}

export const SENATE_PRESIDENT: PrincipalOfficer = {
  id: "samuel-peters",
  name: "Samuel Peters",
  office: "President of the Senate",
  department: "Computer Science",
  phone: "08069010564",
  whatsappNumber: "2348069010564",
  photo: "/senators/samuel-peters.jpg",
  responsibility:
    "Presides over all plenary sittings of the Student Delegatory Parliament, represents the Student Senate before university management, and safeguards the constitutional mandate of the House.",
};

export const PRINCIPAL_OFFICERS: readonly PrincipalOfficer[] = [
  {
    id: "ituma-chiedozie-benedict",
    name: "Ituma Chiedozie Benedict",
    office: "Deputy President of the Senate",
    department: "Computer Engineering",
    phone: "07057517653",
    whatsappNumber: "2347057517653",
    photo: "/senators/ituma-chiedozie-benedict.jpg",
    responsibility:
      "Assists the President of the Senate in presiding over legislative sittings, chairs the Standing Committee on Ethics, and acts as Presiding Officer whenever the President is unavailable.",
    slot: "top",
  },
  {
    id: "ogueri-nzubechi-stephanie",
    name: "Ogueri Nzubechi Stephanie",
    office: "Clerk of the Senate",
    department: "Microbiology",
    phone: "08136549319",
    whatsappNumber: "2348136549319",
    photo: "/senators/ogueri-nzubechi-stephanie.jpg",
    responsibility:
      "Maintains official parliamentary records, minutes, bills, and student petitions, and serves as the primary administrative channel between students and the Senate.",
    slot: "upper-left",
  },
  {
    id: "ayuba-raphael",
    name: "Ayuba Raphael",
    office: "Deputy Clerk of the Senate",
    department: "Accounting",
    phone: "09011719695",
    whatsappNumber: "2349011719695",
    photo: "/senators/ayuba-raphael.jpg",
    responsibility:
      "Supports the Office of the Clerk in documenting plenary resolutions, coordinating committee filings, and handling incoming student correspondence.",
    slot: "upper-right",
  },
  {
    id: "favour-nathaniel-mmasichukwu",
    name: "Favour Nathaniel Mmasichukwu",
    office: "Majority Leader",
    department: "Mass Communication",
    phone: "07039530330",
    whatsappNumber: "2347039530330",
    photo: "/senators/favour-nathaniel-mmasichukwu.jpg",
    responsibility:
      "Leads the legislative agenda on the Senate floor, coordinates motions and bills sponsored by the majority caucus, and builds consensus during plenary debates.",
    slot: "mid-left",
  },
  {
    id: "anosike-chisom-naomi",
    name: "Anosike Chisom Naomi",
    office: "Minority Leader",
    department: "Economics",
    phone: "07052521934",
    whatsappNumber: "23470521934",
    photo: "/senators/anosike-chisom-naomi.jpg",
    responsibility:
      "Represents minority viewpoints across constituencies, ensures balanced scrutiny of executive proposals, and upholds inclusive debate in the chamber.",
    slot: "mid-right",
  },
  {
    id: "yerima-charity",
    name: "Yerima Charity",
    office: "Chief Whip of the Senate",
    department: "Faculty of Law",
    phone: "08100036394",
    whatsappNumber: "2348100036394",
    photo: "/senators/charity-law.jpg",
    responsibility:
      "Enforces parliamentary discipline, tracks Senator attendance and decorum during sittings, and ensures adherence to the Standing House Orders.",
    slot: "lower-left",
  },
  {
    id: "longshal-blaise-longgap",
    name: "Longshal Blaise Longgap",
    office: "Sergeant-at-Arms",
    department: "Philosophy",
    phone: "09126754501",
    whatsappNumber: "2349126754501",
    photo: "/senators/longshal-blaise-longgap.jpg",
    responsibility:
      "Custodian of the Senate Mace responsible for maintaining order, security, and ceremonial protocol throughout all parliamentary sittings.",
    slot: "lower-right",
  },
];

export function buildOfficerWhatsAppLink(officer: PrincipalOfficer): string {
  const message = encodeURIComponent(
    `Hello ${officer.office} (${officer.name}), I am reaching out via the Veritas University SDP Portal.`
  );

  return `https://wa.me/${officer.whatsappNumber}?text=${message}`;
}