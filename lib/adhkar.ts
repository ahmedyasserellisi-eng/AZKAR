import type { AzkarType, Dhikr } from "./types";

// Starter, source-labeled content. Expand this dataset only after verifying
// every Arabic text and takhrij against a trusted reference.
const common = [
  {
    id: "001",
    text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...",
    repetitions: 1,
    source: "آية الكرسي — سورة البقرة: 255"
  },
  {
    id: "002",
    text: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    repetitions: 3,
    source: "سورة الإخلاص"
  },
  {
    id: "003",
    text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    repetitions: 3,
    source: "سورة الفلق"
  },
  {
    id: "004",
    text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
    repetitions: 3,
    source: "سورة الناس"
  },
  {
    id: "005",
    text: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ",
    repetitions: 4,
    source: "سنن أبي داود — يُراجع تخريج النص عند اعتماد المحتوى النهائي"
  },
  {
    id: "006",
    text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ نَبِيًّا",
    repetitions: 3,
    source: "سنن أبي داود والترمذي — يُراجع التخريج عند اعتماد المحتوى النهائي"
  }
] as const;

const evening = [
  common[0], common[1], common[2], common[3],
  {
    id: "e005",
    text: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ...",
    repetitions: 4,
    source: "سنن أبي داود — يُراجع تخريج النص عند اعتماد المحتوى النهائي"
  },
  common[5]
] as const;

function toDhikr(type: AzkarType, items: readonly { id: string; text: string; repetitions: number; source: string }[]): Dhikr[] {
  return items.map((item, index) => ({ ...item, id: `${type}-${item.id}`, type, order: index + 1 }));
}

export const adhkar: Record<AzkarType, Dhikr[]> = {
  morning: toDhikr("morning", common),
  evening: toDhikr("evening", evening)
};

export function getAdhkar(type: AzkarType) { return adhkar[type]; }
