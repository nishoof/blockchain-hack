// Global design tokens - single source of truth for the app
// Import: import { colors, font, radius, spacing } from '../styles/tokens'

export const colors = {
  // Cherry palette
  red:       '#c94040', // primary CTA, accents — cherry
  redLight:  '#fce8e8', // tag/icon backgrounds — blush
  redMid:    '#f2c4c4', // borders, outlines — petal
  redDark:   '#8c2a2a', // hover states — deep
  redDeep:   '#4a0f0f', // stem

  // Backgrounds
  bg:        '#fff9f8', // page background
  bgSurface: '#fce8e8', // tinted surface — blush
  white:     '#ffffff', // cards

  // Text
  inkDark:   '#1f0a0a', // headings, primary text — ink
  inkMid:    '#6b4040', // body text
  inkLight:  '#9a6060', // muted, secondary text

  // Semantic
  confirmed: '#4caf50', // live dot, tx confirmed
}

export const font = {
  family: "'Geist', sans-serif",
  weight: {
    light:   300,
    regular: 400,
    medium:  500,
  },
  size: {
    xs:      '10px', // labels, eyebrows
    sm:      '11px', // tags, captions
    base:    '13px', // body, buttons
    md:      '15px', // card titles
    lg:      '22px', // section headings
    xl:      '32px', // page headings
    hero:    '42px', // hero headline
    counter: '52px', // impact counter
  },
}

export const radius = {
  sm:   '4px',   // tags
  md:   '8px',   // inputs
  lg:   '12px',  // cards
  pill: '999px', // buttons
}

export const spacing = {
  xs:  '4px',
  sm:  '8px',
  md:  '16px',
  lg:  '24px',
  xl:  '32px',
  xxl: '52px',
}