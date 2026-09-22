export type ThemeId = 'vibrant' | 'ocean' | 'sunset' | 'emerald';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  emoji: string;
  background: string;
  topBanner: string;
  brandGradient: string;
  primaryColor: string;
  secondaryColor: string;
  accentBg: string;
  badgeBg: string;
  cardBorderHover: string;
  buttonGradient: string;
  ambientClass: string;
  headerTextColor: string;
  subTextColor: string;
  accentGlow: string;
  barGradients: [string, string];
  lineColors: {
    sugar: string;
    sbp: string;
    bmi: string;
  };
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  vibrant: {
    id: 'vibrant',
    name: 'นีออน ไวโอเล็ต (Electric Violet)',
    tagline: 'สดใส ทันสมัย สไตล์ไฮเทค',
    emoji: '🔮',
    background: 'bg-slate-50/95',
    topBanner: 'from-violet-950 via-indigo-900 to-slate-900',
    brandGradient: 'from-violet-600 via-indigo-500 to-pink-500',
    primaryColor: '#6366F1',
    secondaryColor: '#EC4899',
    accentBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badgeBg: 'bg-gradient-to-r from-violet-600 to-pink-500 text-white',
    cardBorderHover: 'hover:border-indigo-300 hover:shadow-indigo-500/15',
    buttonGradient: 'bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white',
    ambientClass: 'from-violet-50/50 via-indigo-50/30 to-pink-50/30',
    headerTextColor: 'text-indigo-950',
    subTextColor: 'text-indigo-600',
    accentGlow: 'rgba(99, 102, 241, 0.25)',
    barGradients: ['#8B5CF6', '#EC4899'],
    lineColors: {
      sugar: '#EC4899',
      sbp: '#6366F1',
      bmi: '#06B6D4',
    },
  },
  ocean: {
    id: 'ocean',
    name: 'โอเชียน บรีซ (Ocean Breeze)',
    tagline: 'ฟ้าน้ำทะเล สดชื่น กระปรี้กระเปร่า',
    emoji: '🐬',
    background: 'bg-sky-50/30',
    topBanner: 'from-sky-950 via-cyan-900 to-teal-950',
    brandGradient: 'from-cyan-500 via-sky-600 to-teal-400',
    primaryColor: '#0284C7',
    secondaryColor: '#14B8A6',
    accentBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    badgeBg: 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white',
    cardBorderHover: 'hover:border-cyan-300 hover:shadow-cyan-500/15',
    buttonGradient: 'bg-gradient-to-r from-cyan-600 via-sky-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white',
    ambientClass: 'from-sky-50/50 via-cyan-50/30 to-teal-50/20',
    headerTextColor: 'text-cyan-950',
    subTextColor: 'text-cyan-600',
    accentGlow: 'rgba(6, 182, 212, 0.25)',
    barGradients: ['#06B6D4', '#10B981'],
    lineColors: {
      sugar: '#F43F5E',
      sbp: '#0284C7',
      bmi: '#14B8A6',
    },
  },
  sunset: {
    id: 'sunset',
    name: 'ซันเซ็ต โกลว์ (Sunset Glow)',
    tagline: 'ส้มคอรัลและชมพู สนุกสนานอบอุ่น',
    emoji: '🌅',
    background: 'bg-rose-50/25',
    topBanner: 'from-rose-950 via-orange-950 to-amber-950',
    brandGradient: 'from-rose-500 via-orange-500 to-amber-400',
    primaryColor: '#F43F5E',
    secondaryColor: '#F59E0B',
    accentBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeBg: 'bg-gradient-to-r from-rose-500 to-orange-500 text-white',
    cardBorderHover: 'hover:border-rose-300 hover:shadow-rose-500/15',
    buttonGradient: 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white',
    ambientClass: 'from-rose-50/50 via-orange-50/30 to-amber-50/25',
    headerTextColor: 'text-rose-950',
    subTextColor: 'text-rose-600',
    accentGlow: 'rgba(244, 63, 94, 0.25)',
    barGradients: ['#F43F5E', '#F59E0B'],
    lineColors: {
      sugar: '#F43F5E',
      sbp: '#F97316',
      bmi: '#F59E0B',
    },
  },
  emerald: {
    id: 'emerald',
    name: 'เฟรช มินต์ (Fresh Mint)',
    tagline: 'เขียวมรกต พลังชีวิตและธรรมชาติ',
    emoji: '🌿',
    background: 'bg-emerald-50/25',
    topBanner: 'from-emerald-950 via-teal-950 to-slate-900',
    brandGradient: 'from-emerald-500 via-teal-500 to-lime-400',
    primaryColor: '#10B981',
    secondaryColor: '#84CC16',
    accentBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeBg: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
    cardBorderHover: 'hover:border-emerald-300 hover:shadow-emerald-500/15',
    buttonGradient: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white',
    ambientClass: 'from-emerald-50/50 via-teal-50/30 to-lime-50/20',
    headerTextColor: 'text-emerald-950',
    subTextColor: 'text-emerald-600',
    accentGlow: 'rgba(16, 185, 129, 0.25)',
    barGradients: ['#10B981', '#84CC16'],
    lineColors: {
      sugar: '#EF4444',
      sbp: '#10B981',
      bmi: '#84CC16',
    },
  },
};
