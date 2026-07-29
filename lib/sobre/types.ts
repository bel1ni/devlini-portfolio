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

// Linha crua do banco, com os campos em inglês (usada no editor para editar os
// dois idiomas). A leitura pública já entrega localizado via getAboutData.
export type AboutProfileRow = AboutProfile & {
  positioning_en: string | null;
  intro_en: string | null;
  availability_headline_en: string | null;
  availability_note_en: string | null;
  roles_en: string[];
};

export type AboutEntryRow = AboutEntry & {
  title_en: string | null;
  body_en: string | null;
  tag_en: string | null;
};
