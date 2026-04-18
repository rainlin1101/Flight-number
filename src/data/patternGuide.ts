interface PatternGuideSection {
  title: string;
  bullets: string[];
  example?: string;
}

export const patternGuideSections: PatternGuideSection[] = [
  {
    title: 'TC1（北米）',
    bullets: [
      'TC1のエリア、つまりアメリカ方面の便名は1始まり',
      '羽田発は偶数',
      '羽田着は奇数',
      '復路は往路より1小さい',
    ],
    example: 'NH102 → NH101',
  },
  {
    title: 'その他の国際線',
    bullets: [
      '北米以外の国際線は、羽田発は奇数',
      '羽田着は偶数',
      '復路は往路より1大きい',
    ],
    example: 'NH219 → NH220',
  },
  {
    title: '地域番号の見方',
    bullets: [
      '中国大陸は9始まり',
      'アジア（中国大陸以外）は8始まり',
      '北米は1始まり',
      'ヨーロッパは2始まり',
    ],
  },
];
