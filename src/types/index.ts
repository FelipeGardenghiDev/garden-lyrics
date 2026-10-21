export type SectionType =
  | 'intro'
  | 'verse'
  | 'pre-chorus'
  | 'chorus'
  | 'bridge'
  | 'solo'
  | 'outro';

export interface LyricSection {
  id: string;
  type: SectionType;
  label: string;
  lines: string[];
}

export interface LyricProject {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  sections: LyricSection[];
  notes?: string;
}

export interface VoiceMemo {
  id: string;
  name: string;
  audioBlobUrl: string;
  durationSec: number;
  timestamp: string;
}
