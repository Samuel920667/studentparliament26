// src/data/site.ts
export interface NavItem {
  label: string;
  href: string;
}

export interface ClerkContact {
  role: string;
  name: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappHref: string;
}

export const SITE_CONFIG = {
  shortName: "SDP.",
  fullName: "Student Delegatory Parliament",
  institution: "Veritas University Abuja",
  session: "2026/2027 Legislative Session",
  year: "2026",
  tagline: "YOUR VOICE. YOUR RIGHT. YOUR PARLIAMENT.",
  description:
    "A student petition drafting platform by the Student Delegatory Parliament.",
  disclaimer:
    "This portal generates formal petition documents addressed to the Office of the Dean of Student Affairs through the Student Delegatory Parliament. It does not automatically submit petitions.",
} as const;

export const SOCIAL_LINKS = {
  instagram: {
    label: "Instagram",
    href: "https://instagram.com/veritasstudentsenate?mdxt=MXNmdWcyY21uYmhuMQ%3D%3D&utm_source=qr",
  },
} as const;

export const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About the SDP", href: "/about" },
  { label: "Senator Directory", href: "/senators" },
  { label: "Contact Us", href: "/contact" },
  { label: "Leadership", href: "/leadership" },
];

export const CLERK_OFFICE: {
  primary: ClerkContact;
  deputy: ClerkContact;
} = {
  primary: {
    role: "Clerk of the Senate",
    name: "Nzubechi Ogueri",
    phoneDisplay: "+234 813 654 9319",
    phoneHref: "tel:+2348136549319",
    whatsappHref:
      "https://wa.me/2348136549319?text=Hello%20Clerk%2C%20I%20have%20an%20enquiry%20regarding%20the%20SDP%20Petition%20Portal.",
  },
  deputy: {
    role: "Deputy Clerk of the Senate",
    name: "Ayuba Raphael",
    phoneDisplay: "+234 901 171 9695",
    phoneHref: "tel:+2349011719695",
    whatsappHref:
      "https://wa.me/2349011719695?text=Hello%20Deputy%20Clerk%2C%20I%20have%20an%20enquiry%20regarding%20the%20SDP%20Petition%20Portal.",
  },
};