import React from 'react';
import { AppleColors, AppleTypography, AppleSpacing, AppleBorderRadius, AppleTransitions } from '../styles/appleDesignSystem';

// Apple HIG Button Component
export const AppleButton = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  onPress, 
  className = '',
  ...props 
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    borderRadius: AppleBorderRadius.button,
    fontFamily: AppleTypography.fontFamily.primary,
    fontWeight: AppleTypography.fontWeight.semibold,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${AppleTransitions.normal} ${AppleTransitions.ease}`,
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    ...props.style,
  };

  const variants = {
    primary: {
      backgroundColor: disabled ? AppleColors.system.fill.quaternary : AppleColors.primary.blue,
      color: '#FFFFFF',
      '&:hover': disabled ? {} : {
        backgroundColor: '#0056CC',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)',
      },
      '&:active': disabled ? {} : {
        transform: 'translateY(0)',
        boxShadow: '0 2px 6px rgba(0, 122, 255, 0.2)',
      }
    },
    secondary: {
      backgroundColor: 'transparent',
      color: disabled ? AppleColors.system.label.quaternary : AppleColors.primary.blue,
      border: `1px solid ${disabled ? AppleColors.system.separator.transparent : AppleColors.primary.blue}`,
      '&:hover': disabled ? {} : {
        backgroundColor: AppleColors.primary.blue,
        color: '#FFFFFF',
      }
    },
    tertiary: {
      backgroundColor: 'transparent',
      color: disabled ? AppleColors.system.label.quaternary : AppleColors.system.label.secondary,
      '&:hover': disabled ? {} : {
        backgroundColor: AppleColors.system.background.secondary,
        color: AppleColors.system.label.primary,
      }
    }
  };

  const sizes = {
    small: {
      padding: `${AppleSpacing.xs} ${AppleSpacing.md}`,
      fontSize: AppleTypography.fontSize.footnote,
      minHeight: '32px',
    },
    medium: {
      padding: `${AppleSpacing.sm} ${AppleSpacing.lg}`,
      fontSize: AppleTypography.fontSize.body,
      minHeight: '44px',
    },
    large: {
      padding: `${AppleSpacing.md} ${AppleSpacing.xl}`,
      fontSize: AppleTypography.fontSize.headline,
      minHeight: '52px',
    }
  };

  const styles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
    opacity: disabled ? 0.6 : 1,
  };

  return (
    <button
      className={className}
      style={styles}
      onClick={disabled ? undefined : onPress}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Apple HIG Card Component
export const AppleCard = ({ 
  children, 
  variant = 'default', 
  onPress, 
  className = '',
  ...props 
}) => {
  const baseStyles = {
    backgroundColor: AppleColors.system.background.primary,
    borderRadius: AppleBorderRadius.card,
    border: `1px solid ${AppleColors.system.separator.transparent}`,
    transition: `all ${AppleTransitions.normal} ${AppleTransitions.ease}`,
    ...props.style,
  };

  const variants = {
    default: {
      padding: AppleSpacing.component.padding,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      '&:hover': onPress ? {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transform: 'translateY(-2px)',
      } : {}
    },
    elevated: {
      padding: AppleSpacing.component.padding,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      '&:hover': onPress ? {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        transform: 'translateY(-4px)',
      } : {}
    },
    compact: {
      padding: AppleSpacing.sm,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    }
  };

  const styles = {
    ...baseStyles,
    ...variants[variant],
    cursor: onPress ? 'pointer' : 'default',
  };

  const Component = onPress ? 'button' : 'div';
  const componentProps = onPress ? { onClick: onPress, type: 'button' } : {};

  return (
    <Component
      className={className}
      style={styles}
      {...componentProps}
      {...props}
    >
      {children}
    </Component>
  );
};

// Apple HIG Input Component
export const AppleInput = ({ 
  placeholder, 
  value, 
  onChange, 
  type = 'text', 
  variant = 'default', 
  error, 
  className = '',
  ...props 
}) => {
  const baseStyles = {
    width: '100%',
    backgroundColor: AppleColors.system.background.secondary,
    border: `1px solid ${error ? AppleColors.semantic.error : AppleColors.system.separator.transparent}`,
    borderRadius: AppleBorderRadius.input,
    padding: `${AppleSpacing.sm} ${AppleSpacing.md}`,
    fontFamily: AppleTypography.fontFamily.primary,
    fontSize: AppleTypography.fontSize.body,
    color: AppleColors.system.label.primary,
    transition: `all ${AppleTransitions.fast} ${AppleTransitions.ease}`,
    outline: 'none',
    '&:focus': {
      borderColor: AppleColors.primary.blue,
      backgroundColor: AppleColors.system.background.primary,
      boxShadow: `0 0 0 3px ${AppleColors.primary.blue}20`,
    },
    '&:hover': {
      borderColor: AppleColors.system.separator.opaque,
    },
    ...props.style,
  };

  const variants = {
    default: {},
    search: {
      paddingLeft: '40px',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(AppleColors.system.label.quaternary)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '12px center',
      backgroundSize: '16px',
    }
  };

  const styles = {
    ...baseStyles,
    ...variants[variant],
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        className={className}
        style={styles}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
      {error && (
        <div style={{
          color: AppleColors.semantic.error,
          fontSize: AppleTypography.fontSize.footnote,
          marginTop: AppleSpacing.xs,
          marginLeft: AppleSpacing.sm,
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

// Apple HIG Text Component
export const AppleText = ({ 
  children, 
  variant = 'body', 
  weight = 'regular', 
  color = 'primary', 
  align = 'left', 
  className = '',
  ...props 
}) => {
  const textVariants = {
    largeTitle: AppleTypography.fontSize.largeTitle,
    title1: AppleTypography.fontSize.title1,
    title2: AppleTypography.fontSize.title2,
    title3: AppleTypography.fontSize.title3,
    headline: AppleTypography.fontSize.headline,
    body: AppleTypography.fontSize.body,
    callout: AppleTypography.fontSize.callout,
    subhead: AppleTypography.fontSize.subhead,
    footnote: AppleTypography.fontSize.footnote,
    caption1: AppleTypography.fontSize.caption1,
    caption2: AppleTypography.fontSize.caption2,
  };

  const weightVariants = {
    regular: AppleTypography.fontWeight.regular,
    medium: AppleTypography.fontWeight.medium,
    semibold: AppleTypography.fontWeight.semibold,
    bold: AppleTypography.fontWeight.bold,
    heavy: AppleTypography.fontWeight.heavy,
  };

  const colorVariants = {
    primary: AppleColors.system.label.primary,
    secondary: AppleColors.system.label.secondary,
    tertiary: AppleColors.system.label.tertiary,
    quaternary: AppleColors.system.label.quaternary,
    blue: AppleColors.primary.blue,
    green: AppleColors.primary.green,
    red: AppleColors.primary.red,
    orange: AppleColors.primary.orange,
  };

  const styles = {
    fontFamily: AppleTypography.fontFamily.primary,
    fontSize: textVariants[variant],
    fontWeight: weightVariants[weight],
    color: colorVariants[color],
    lineHeight: AppleTypography.lineHeight.normal,
    letterSpacing: AppleTypography.letterSpacing.normal,
    textAlign: align,
    margin: 0,
    padding: 0,
    ...props.style,
  };

  return (
    <span
      className={className}
      style={styles}
      {...props}
    >
      {children}
    </span>
  );
};

// Apple HIG List Item Component
export const AppleListItem = ({ 
  children, 
  onPress, 
  accessory, 
  className = '',
  ...props 
}) => {
  const styles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${AppleSpacing.md} ${AppleSpacing.lg}`,
    backgroundColor: AppleColors.system.background.primary,
    borderBottom: `1px solid ${AppleColors.system.separator.transparent}`,
    cursor: onPress ? 'pointer' : 'default',
    transition: `background-color ${AppleTransitions.fast} ${AppleTransitions.ease}`,
    '&:hover': onPress ? {
      backgroundColor: AppleColors.system.background.secondary,
    } : {},
    '&:active': onPress ? {
      backgroundColor: AppleColors.system.background.tertiary,
    } : {},
    ...props.style,
  };

  const Component = onPress ? 'button' : 'div';
  const componentProps = onPress ? { onClick: onPress, type: 'button' } : {};

  return (
    <Component
      className={className}
      style={styles}
      {...componentProps}
      {...props}
    >
      <div style={{ flex: 1 }}>
        {children}
      </div>
      {accessory && (
        <div style={{ marginLeft: AppleSpacing.md }}>
          {accessory}
        </div>
      )}
    </Component>
  );
};

// Apple HIG Navigation Bar Component
export const AppleNavigationBar = ({ 
  title, 
  leftButton, 
  rightButton, 
  className = '',
  ...props 
}) => {
  const styles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${AppleSpacing.md} ${AppleSpacing.lg}`,
    backgroundColor: AppleColors.system.background.primary,
    borderBottom: `1px solid ${AppleColors.system.separator.transparent}`,
    minHeight: '44px',
    ...props.style,
  };

  return (
    <nav
      className={className}
      style={styles}
      {...props}
    >
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
        {leftButton}
      </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <AppleText variant="headline" weight="semibold" color="primary">
          {title}
        </AppleText>
      </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        {rightButton}
      </div>
    </nav>
  );
};

// Apple HIG Tab Bar Component
export const AppleTabBar = ({ 
  tabs, 
  activeTab, 
  onTabPress, 
  className = '',
  ...props 
}) => {
  const styles = {
    display: 'flex',
    backgroundColor: AppleColors.system.background.primary,
    borderTop: `1px solid ${AppleColors.system.separator.transparent}`,
    paddingBottom: 'env(safe-area-inset-bottom)',
    ...props.style,
  };

  return (
    <div
      className={className}
      style={styles}
      {...props}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabPress(tab.id)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: `${AppleSpacing.sm} ${AppleSpacing.xs}`,
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: `all ${AppleTransitions.fast} ${AppleTransitions.ease}`,
            color: activeTab === tab.id ? AppleColors.primary.blue : AppleColors.system.label.quaternary,
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: AppleSpacing.xs }}>
            {tab.icon}
          </div>
          <AppleText variant="caption1" color={activeTab === tab.id ? 'blue' : 'quaternary'}>
            {tab.title}
          </AppleText>
        </button>
      ))}
    </div>
  );
};

// Export all components
export {
  AppleButton,
  AppleCard,
  AppleInput,
  AppleText,
  AppleListItem,
  AppleNavigationBar,
  AppleTabBar,
};
