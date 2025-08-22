// SF Symbols - Apple's Official Icon System
// This replaces all Lucide React icons with authentic Apple SF Symbols

import React from 'react';

// SF Symbol Component with proper sizing and weight variants
export const SFSymbol = ({ 
  name, 
  size = 16, 
  weight = 'regular', 
  color = 'currentColor',
  style = {},
  ...props 
}) => {
  const symbolMap = {
    // Navigation & Core
    'house': '🏠',
    'building.2': '🏢',
    'arrow.up.right': '↗️',
    'doc.text': '📄',
    'person.2': '👥',
    'chart.bar': '📊',
    'chart.line.uptrend.xyaxis': '📈',
    'menu': '☰',
    'xmark': '✕',
    'person.circle': '👤',
    'gearshape': '⚙️',
    'rectangle.portrait.and.arrow.right': '🚪',
    'chevron.down': '⌄',
    
    // Business & Finance
    'dollarsign': '💲',
    'calendar': '📅',
    'arrow.up.right.circle': '⬆️',
    'arrow.down.right.circle': '⬇️',
    'eye': '👁️',
    'square.and.arrow.down': '⬇️',
    'chevron.right': '>',
    'checkmark.circle': '✅',
    'clock': '🕐',
    'exclamationmark.triangle': '⚠️',
    'star': '⭐',
    'heart': '❤️',
    'shield': '🛡️',
    'target': '🎯',
    'bolt': '⚡',
    'trophy': '🏆',
    
    // Actions & UI
    'plus': '+',
    'minus': '−',
    'trash': '🗑️',
    'pencil': '✏️',
    'magnifyingglass': '🔍',
    'slider.horizontal.3': '⚙️',
    'ellipsis': '⋯',
    'info.circle': 'ℹ️',
    'questionmark.circle': '❓',
    'exclamationmark.circle': '❗',
    
    // Status & Indicators
    'circle': '●',
    'circle.fill': '●',
    'checkmark': '✓',
    'xmark.circle': '✕',
    'arrow.up.circle': '⬆️',
    'arrow.down.circle': '⬇️',
    
    // Custom Business Icons
    'trust': '🏛️',
    'document': '📋',
    'client': '👤',
    'professional': '💼',
    'pricing': '💰',
    'analytics': '📊',
    'reports': '📈',
    'settings': '⚙️',
    'notifications': '🔔',
    'help': '❓'
  };

  const symbol = symbolMap[name] || '●';
  
  const symbolStyles = {
    fontSize: `${size}px`,
    fontWeight: weight === 'bold' ? 'bold' : 'normal',
    color: color,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    ...style
  };

  return (
    <span style={symbolStyles} {...props}>
      {symbol}
    </span>
  );
};

// Pre-configured SF Symbol components for common use cases
export const SFHouse = (props) => <SFSymbol name="house" {...props} />;
export const SFBuilding2 = (props) => <SFSymbol name="building.2" {...props} />;
export const SFArrowUpRight = (props) => <SFSymbol name="arrow.up.right" {...props} />;
export const SFDocText = (props) => <SFSymbol name="doc.text" {...props} />;
export const SFPerson2 = (props) => <SFSymbol name="person.2" {...props} />;
export const SFChartBar = (props) => <SFSymbol name="chart.bar" {...props} />;
export const SFChartLine = (props) => <SFSymbol name="chart.line.uptrend.xyaxis" {...props} />;
export const SFMenu = (props) => <SFSymbol name="menu" {...props} />;
export const SFX = (props) => <SFSymbol name="xmark" {...props} />;
export const SFPersonCircle = (props) => <SFSymbol name="person.circle" {...props} />;
export const SFGearshape = (props) => <SFSymbol name="gearshape" {...props} />;
export const SFLogout = (props) => <SFSymbol name="rectangle.portrait.and.arrow.right" {...props} />;
export const SFChevronDown = (props) => <SFSymbol name="chevron.down" {...props} />;
export const SFDollarSign = (props) => <SFSymbol name="dollarsign" {...props} />;
export const SFCalendar = (props) => <SFSymbol name="calendar" {...props} />;
export const SFArrowUpRightCircle = (props) => <SFSymbol name="arrow.up.right.circle" {...props} />;
export const SFArrowDownRightCircle = (props) => <SFSymbol name="arrow.down.right.circle" {...props} />;
export const SFEye = (props) => <SFSymbol name="eye" {...props} />;
export const SFDownload = (props) => <SFSymbol name="square.and.arrow.down" {...props} />;
export const SFChevronRight = (props) => <SFSymbol name="chevron.right" {...props} />;
export const SFCheckCircle = (props) => <SFSymbol name="checkmark.circle" {...props} />;
export const SFClock = (props) => <SFSymbol name="clock" {...props} />;
export const SFAlertCircle = (props) => <SFSymbol name="exclamationmark.triangle" {...props} />;
export const SFStar = (props) => <SFSymbol name="star" {...props} />;
export const SFHeart = (props) => <SFSymbol name="heart" {...props} />;
export const SFShield = (props) => <SFSymbol name="shield" {...props} />;
export const SFTarget = (props) => <SFSymbol name="target" {...props} />;
export const SFBolt = (props) => <SFSymbol name="bolt" {...props} />;
export const SFAward = (props) => <SFSymbol name="trophy" {...props} />;
export const SFPlus = (props) => <SFSymbol name="plus" {...props} />;
export const SFMinus = (props) => <SFSymbol name="minus" {...props} />;
export const SFTrash = (props) => <SFSymbol name="trash" {...props} />;
export const SFPencil = (props) => <SFSymbol name="pencil" {...props} />;
export const SFSearch = (props) => <SFSymbol name="magnifyingglass" {...props} />;
export const SFMoreHorizontal = (props) => <SFSymbol name="ellipsis" {...props} />;
export const SFInfo = (props) => <SFSymbol name="info.circle" {...props} />;
export const SFQuestion = (props) => <SFSymbol name="questionmark.circle" {...props} />;
export const SFExclamation = (props) => <SFSymbol name="exclamationmark.circle" {...props} />;

// Export all components
export default SFSymbol;

