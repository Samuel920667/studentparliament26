// src/data/gallery.ts
export interface GalleryPhoto {
  id: string;
  src?: string;
  alt: string;
}

export const GALLERY_PHOTOS: readonly GalleryPhoto[] = [
  {
    id: "photo-1",
    src: "/gallery/photo-1.jpg",
    alt: "Meet the SDP: a collage of Student Delegatory Parliament members",
  },
  {
    id: "photo-2",
    src: "/gallery/photo-2.jpg",
    alt: "Portrait collage of SDP members with the parliament emblem",
  },
  {
    id: "photo-3",
    src: "/gallery/photo-3.jpg",
    alt: "Black-and-white portrait collage of Student Delegatory Parliament members",
  },
  {
    id: "photo-4",
    src: "/gallery/photo-4.jpg",
    alt: "Student Delegatory Parliament members together outdoors on campus",
  },
  {
    id: "photo-5",
    src: "/gallery/photo-5.jpg",
    alt: "SDP representatives meeting with university staff in an office",
  },
  {
    id: "photo-6",
    src: "/gallery/photo-6.jpg",
    alt: "SDP members gathered around an office desk",
  },
  {
    id: "photo-7",
    src: "/gallery/photo-7.jpg",
    alt: "SDP members and university staff posing together in an office",
  },
];