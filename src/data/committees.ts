export interface CommitteeChairperson {
  name: string;
  role: string;
  department: string;
  photo?: string;
}

export interface CommitteeItem {
  id: string;
  number: string;
  name: string;
  focus: string;
  chairNote?: string;
  chairperson?: CommitteeChairperson;
  summary: string;
  mandates: readonly string[];
  gridSpan: string;
}

export const STANDING_COMMITTEES: readonly CommitteeItem[] = [
  {
    id: "budget-and-planning",
    number: "01",
    name: "Committee on Budget & Planning",
    focus: "Financial Oversight",
    summary:
      "Oversees student government finances and reviews all Student Representative Assembly (SRA) budget proposals before they go to the full Senate.",
    mandates: [
      "Assesses SRA budget proposals to ensure allocations are reasonable, justifiable, and cost effective.",
      "Enforces strict compliance against deficit budgets so finances stay balanced.",
      "Verifies required executive signatures and rejects proposals that fail constitutional criteria.",
      "Defers final budget approval strictly to the full Student Senate.",
    ],
    gridSpan: "lg:col-span-3",
  },
  {
    id: "welfare-and-security",
    number: "02",
    name: "Committee on Welfare & Security",
    focus: "Student Protection",
    chairNote: "Appointed on merit in consultation with the Chief Whip",
    chairperson: {
      name: "Sadare Doyinsola Ayomide",
      role: "Committee Chairperson",
      department: "Nursing",
      photo: "/senators/sadare-doyinsola-ayomide.jpg",
    },
    summary:
      "Safeguards student welfare and campus security, ensuring every student complaint is received and investigated.",
    mandates: [
      "Investigates welfare and security challenges affecting students across campus.",
      "Maintains a strict stance against any form of abuse by staff or security personnel.",
      "Monitors compliance with university directives on curfews and welfare matters.",
      "Submits regular investigative reports to the Senate and the Office of the Clerk.",
    ],
    gridSpan: "lg:col-span-3",
  },
  {
    id: "health-and-sanitation",
    number: "03",
    name: "Committee on Health & Sanitation",
    focus: "Quality Assurance",
    chairNote: "Appointed on merit; led by health and medical constituencies",
    chairperson: {
      name: "Chukwuemeka Favour Chinemerem",
      role: "Committee Chairperson",
      department: "Medical Laboratory Science",
      photo: "/senators/chukwuemeka-favour-chinemerem.jpg",
    },
    summary:
      "Enforces campus health and hygiene standards with zero tolerance for negligence.",
    mandates: [
      "Investigates health risks, clinical mistreatment, and inadequate medical responses.",
      "Conducts sanitation checks on restrooms, water quality, and campus health hazards.",
      "Coordinates with the University Medical Director on student healthcare operations.",
      "Reports findings directly to the Student Senate and the Clerk.",
    ],
    gridSpan: "lg:col-span-2",
  },
  {
    id: "environment",
    number: "04",
    name: "Committee on Environment",
    focus: "Campus Standards",
    chairNote: "Appointed on merit by the Student Senate",
    chairperson: {
      name: "Mustapha Anisa Esther",
      role: "Committee Chairperson",
      department: "Biochemistry",
      photo: "/senators/mustapha-anisa-esther.jpg",
    },
    summary:
      "Monitors physical campus conditions and advances environmental cleanliness and sustainability.",
    mandates: [
      "Investigates environmental hazards affecting the Veritas University community.",
      "Addresses littering, erosion control, tap area sanitation, and drainage repairs.",
      "Promotes green life initiatives with student executives and university management.",
      "Submits comprehensive environmental reports to the Senate and Clerk.",
    ],
    gridSpan: "lg:col-span-2",
  },
  {
    id: "ethics",
    number: "05",
    name: "Committee on Ethics",
    focus: "Discipline & Integrity",
    chairNote: "Chaired by the Deputy President of the Senate",
    chairperson: {
      name: "Ituma Chiedozie Benedict",
      role: "Chairperson & Deputy Senate President",
      department: "Computer Engineering",
      photo: "/senators/ituma-chiedozie-benedict.jpg",
    },
    summary:
      "Serves as the parliamentary disciplinary panel, upholding impartiality and ethical conduct.",
    mandates: [
      "Upholds constitutional discipline in line with the VUA Constitution and Student Handbook.",
      "Liaises with the University Disciplinary Committee to support fair investigations.",
      "Investigates offences or contempt of parliament and recommends sanctions to the Senate.",
      "Handles formal impeachment proceedings subject to final House approval.",
    ],
    gridSpan: "lg:col-span-2",
  },
];

