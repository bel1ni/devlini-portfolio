export type AboutSection = "story" | "skill" | "highlight" | "learning";

export type AboutProfile = {
  positioning: string;
  intro: string;
  availability_open: boolean;
  availability_headline: string;
  availability_note: string;
  roles: string[];
};

export type AboutEntry = {
  id: string;
  section: AboutSection;
  title: string | null;
  body: string | null;
  tag: string | null;
  url: string | null;
  items: string[];
  position: number;
};
