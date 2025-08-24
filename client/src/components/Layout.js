import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  SFHouse,
  SFBuilding2, 
  SFArrowUpRight, 
  SFMenu, 
  SFX,
  SFDocText,
  SFPersonCircle,
  SFGearshape,
  SFLogout,
  SFChevronDown,
  SFChartLine,
  SFPerson2,
  SFChartBar
} from './SFSymbols';
import { useAuth } from '../contexts/AuthContext';
import { AppleTypography, AppleSpacing, AppleBorderRadius, AppleTransitions, AppleShadows } from '../styles/appleDesignSystem';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const profileDropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: SFHouse },
    { name: 'Trusts', href: '/trusts', icon: SFBuilding2 },
    { name: 'Transfers', href: '/transfers', icon: SFArrowUpRight },
    { name: 'Documents', href: '/documents', icon: SFDocText },
    { name: 'AI Insights', href: '/ai-insights', icon: SFChartBar, badge: 'AI' },
    { name: 'Clients', href: '/clients', icon: SFPerson2, badge: 'Core' },
    { name: 'Professional', href: '/professional', icon: SFChartBar, badge: 'Pro' },
    { name: 'Pricing', href: '/pricing', icon: SFChartLine, badge: 'Pro' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--system-background-grouped, #F2F2F7)',
      fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: 'var(--label-primary, #000000)'
    }}>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }} 
          onClick={() => setSidebarOpen(false)} 
        />
        <div style={{ 
          position: 'fixed', 
          inset: '0 0 0 0', 
          left: 0, 
          display: 'flex', 
          width: '256px', 
          flexDirection: 'column', 
          backgroundColor: 'var(--system-background-primary, #FFFFFF)',
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1), 0 20px 40px rgba(0, 0, 0, 0.15)',
          borderRight: '1px solid var(--separator-transparent, #C6C6C8)'
        }}>
          <div style={{ 
            display: 'flex', 
            height: '64px', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: `0 ${AppleSpacing.lg}`,
            borderBottom: '1px solid var(--separator-transparent, #C6C6C8)',
            backgroundColor: 'var(--system-background-primary, #FFFFFF)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: AppleSpacing.md }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: 'linear-gradient(135deg, var(--system-blue, #007AFF), var(--system-indigo, #5856D6))',
                borderRadius: AppleBorderRadius.medium,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <SFBuilding2 size={24} color="#FFFFFF" />
              </div>
              <span style={{ 
                fontSize: AppleTypography.fontSize.title3, 
                fontWeight: AppleTypography.fontWeight.semibold, 
                color: 'var(--label-primary, #000000)' 
              }}>TrustStack</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{ 
                color: 'var(--label-quaternary, #8E8E93)',
                padding: AppleSpacing.xs,
                borderRadius: AppleBorderRadius.small,
                transition: `all ${AppleTransitions.fast} ${AppleTransitions.ease}`,
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: 'none'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--system-background-secondary, #F2F2F7)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <SFX size={24} />
            </button>
          </div>
          <nav style={{ 
            flex: 1, 
            padding: `${AppleSpacing.md} ${AppleSpacing.md}`, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: AppleSpacing.xs 
          }}>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: `${AppleSpacing.sm} ${AppleSpacing.md}`,
                      fontSize: AppleTypography.fontSize.subhead,
                      fontWeight: AppleTypography.fontWeight.medium,
                      borderRadius: AppleBorderRadius.medium,
                      transition: `all ${AppleTransitions.fast} ${AppleTransitions.ease}`,
                      textDecoration: 'none',
                      color: isActive(item.href) ? 'var(--system-blue, #007AFF)' : 'var(--label-secondary, #3C3C43)',
                      backgroundColor: isActive(item.href) ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
                      borderRight: isActive(item.href) ? '2px solid var(--system-blue, #007AFF)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(item.href)) {
                        e.target.style.backgroundColor = 'var(--system-background-secondary, #F2F2F7)';
                        e.target.style.color = 'var(--label-primary, #000000)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item.href)) {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'var(--label-secondary, #3C3C43)';
                      }
                    }}
                  >
                    <Icon 
                      size={20} 
                      color={isActive(item.href) ? 'var(--system-blue, #007AFF)' : 'var(--label-quaternary, #8E8E93)'}
                      style={{ marginRight: AppleSpacing.md }}
                    />
                    <span style={{ flex: 1 }}>{item.name}</span>
                    {item.badge && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: `${AppleSpacing.xs} ${AppleSpacing.sm}`,
                        fontSize: AppleTypography.fontSize.caption1,
                        fontWeight: AppleTypography.fontWeight.medium,
                        borderRadius: AppleBorderRadius.full,
                        backgroundColor: item.badge === 'New' ? 'rgba(52, 199, 89, 0.2)' :
                                       item.badge === 'Core' ? 'rgba(0, 122, 255, 0.2)' :
                                       item.badge === 'Pro' ? 'rgba(255, 149, 0, 0.2)' :
                                       'var(--system-background-secondary, #F2F2F7)',
                        color: item.badge === 'New' ? 'var(--system-green, #34C759)' :
                               item.badge === 'Core' ? 'var(--system-blue, #007AFF)' :
                               item.badge === 'Pro' ? 'var(--system-orange, #FF9500)' :
                               'var(--label-quaternary, #8E8E93)',
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1, 
          backgroundColor: 'var(--system-background-primary, #FFFFFF)',
          borderRight: '1px solid var(--separator-transparent, #C6C6C8)',
          boxShadow: AppleShadows.small.boxShadow
        }}>
          <div style={{ 
            display: 'flex', 
            height: '64px', 
            alignItems: 'center', 
            padding: `0 ${AppleSpacing.lg}`,
            borderBottom: '1px solid var(--separator-transparent, #C6C6C8)',
            backgroundColor: 'var(--system-background-primary, #FFFFFF)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: AppleSpacing.md }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: 'linear-gradient(135deg, var(--system-blue, #007AFF), var(--system-indigo, #5856D6))',
                borderRadius: AppleBorderRadius.medium,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <SFBuilding2 size={24} color="#FFFFFF" />
              </div>
              <span style={{ 
                fontSize: AppleTypography.fontSize.title3, 
                fontWeight: AppleTypography.fontWeight.semibold, 
                color: 'var(--label-primary, #000000)' 
              }}>TrustStack</span>
            </div>
          </div>
          <nav style={{ 
            flex: 1, 
            padding: `${AppleSpacing.md} ${AppleSpacing.md}`, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: AppleSpacing.xs 
          }}>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: `${AppleSpacing.sm} ${AppleSpacing.md}`,
                      fontSize: AppleTypography.fontSize.subhead,
                      fontWeight: AppleTypography.fontWeight.medium,
                      borderRadius: AppleBorderRadius.medium,
                      transition: `all ${AppleTransitions.fast} ${AppleTransitions.ease}`,
                      textDecoration: 'none',
                      color: isActive(item.href) ? 'var(--system-blue, #007AFF)' : 'var(--label-secondary, #3C3C43)',
                      backgroundColor: isActive(item.href) ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
                      borderRight: isActive(item.href) ? '2px solid var(--system-blue, #007AFF)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(item.href)) {
                        e.target.style.backgroundColor = 'var(--system-background-secondary, #F2F2F7)';
                        e.target.style.color = 'var(--label-primary, #000000)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item.href)) {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'var(--label-secondary, #3C3C43)';
                      }
                    }}
                  >
                    <Icon 
                      size={20} 
                      color={isActive(item.href) ? 'var(--system-blue, #007AFF)' : 'var(--label-quaternary, #8E8E93)'}
                      style={{ marginRight: AppleSpacing.md }}
                    />
                    <span style={{ flex: 1 }}>{item.name}</span>
                    {item.badge && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: `${AppleSpacing.xs} ${AppleSpacing.sm}`,
                        fontSize: AppleTypography.fontSize.caption1,
                        fontWeight: AppleTypography.fontWeight.medium,
                        borderRadius: AppleBorderRadius.full,
                        backgroundColor: item.badge === 'New' ? 'rgba(52, 199, 89, 0.2)' :
                                       item.badge === 'Core' ? 'rgba(0, 122, 255, 0.2)' :
                                       item.badge === 'Pro' ? 'rgba(255, 149, 0, 0.2)' :
                                       'var(--system-background-secondary, #F2F2F7)',
                        color: item.badge === 'New' ? 'var(--system-green, #34C759)' :
                               item.badge === 'Core' ? 'var(--system-blue, #007AFF)' :
                               item.badge === 'Pro' ? 'var(--system-orange, #FF9500)' :
                               'var(--label-quaternary, #8E8E93)',
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>
      </div>
        
      {/* Main content */}
      <div style={{ marginLeft: '256px' }}> {/* Equivalent to lg:pl-64 */}
        {/* Top bar */}
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 40, 
          backgroundColor: 'var(--system-background-primary, #FFFFFF)',
          borderBottom: '1px solid var(--separator-transparent, #C6C6C8)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: '0 0.5px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ 
            display: 'flex', 
            height: '64px', 
            alignItems: 'center', 
            padding: `0 ${AppleSpacing.lg}` 
          }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ 
                display: 'none', // Hidden on large screens
                color: 'var(--label-quaternary, #8E8E93)',
                padding: AppleSpacing.xs,
                borderRadius: AppleBorderRadius.small,
                transition: `all ${AppleTransitions.fast} ${AppleTransitions.ease}`,
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: 'none'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--system-background-secondary, #F2F2F7)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <SFMenu size={24} />
            </button>
            
            {/* Profile Section - Extreme Right */}
            <div style={{ flex: 1 }}></div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'relative' }} ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: AppleSpacing.sm,
                    padding: AppleSpacing.xs,
                    borderRadius: AppleBorderRadius.medium,
                    backgroundColor: profileDropdownOpen ? 'var(--system-background-secondary, #F2F2F7)' : 'transparent',
                    transition: `all ${AppleTransitions.fast} ${AppleTransitions.ease}`,
                    cursor: 'pointer',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => { if (!profileDropdownOpen) e.currentTarget.style.backgroundColor = 'var(--system-background-secondary, #F2F2F7)'; }}
                  onMouseLeave={(e) => { if (!profileDropdownOpen) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    background: 'linear-gradient(135deg, var(--system-blue, #007AFF), var(--system-indigo, #5856D6))',
                    borderRadius: AppleBorderRadius.full, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <SFPersonCircle size={16} color="#FFFFFF" />
                  </div>
                  <span style={{ 
                    fontSize: AppleTypography.fontSize.subhead, 
                    fontWeight: AppleTypography.fontWeight.medium, 
                    color: 'var(--label-primary, #000000)' 
                  }}>
                    {user?.firstName || user?.email?.split('@')[0] || 'Profile'}
                  </span>
                  <SFChevronDown 
                    size={16} 
                    color="var(--label-quaternary, #8E8E93)"
                    style={{
                      transition: `transform ${AppleTransitions.fast} ${AppleTransitions.ease}`,
                      transform: profileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  />
                </button>
                
                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div style={{ 
                    position: 'absolute', 
                    right: 0, 
                    marginTop: AppleSpacing.xs, 
                    width: '192px', 
                    backgroundColor: 'var(--system-background-primary, #FFFFFF)',
                    borderRadius: AppleBorderRadius.medium, 
                    boxShadow: AppleShadows.medium.boxShadow, 
                    border: '1px solid var(--separator-transparent, #C6C6C8)',
                    padding: `${AppleSpacing.xs} 0`,
                    zIndex: 50 
                  }}>
                    <div style={{ 
                      padding: `${AppleSpacing.sm} ${AppleSpacing.md}`, 
                      borderBottom: '1px solid var(--separator-transparent, #C6C6C8)' 
                    }}>
                      <p style={{ 
                        fontSize: AppleTypography.fontSize.subhead, 
                        fontWeight: AppleTypography.fontWeight.medium, 
                        color: 'var(--label-primary, #000000)' 
                      }}>
                        {user?.firstName || user?.email?.split('@')[0] || 'User'}
                      </p>
                      <p style={{ 
                        fontSize: AppleTypography.fontSize.footnote, 
                        color: 'var(--label-secondary, #3C3C43)' 
                      }}>{user?.email}</p>
                    </div>
                    
                    <button
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: `${AppleSpacing.sm} ${AppleSpacing.md}`,
                        fontSize: AppleTypography.fontSize.body,
                        color: 'var(--label-primary, #000000)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: AppleSpacing.sm,
                        transition: `background-color ${AppleTransitions.fast} ${AppleTransitions.ease}`
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--system-background-secondary, #F2F2F7)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <SFGearshape size={16} color="var(--label-secondary, #3C3C43)" />
                      <span style={{ color: 'var(--label-primary, #000000)' }}>Profile Settings</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: `${AppleSpacing.sm} ${AppleSpacing.md}`,
                        fontSize: AppleTypography.fontSize.body,
                        color: 'var(--system-red, #FF3B30)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: AppleSpacing.sm,
                        transition: `background-color ${AppleTransitions.fast} ${AppleTransitions.ease}`
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 59, 48, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <SFLogout size={16} color="var(--system-red, #FF3B30)" />
                      <span style={{ color: 'var(--system-red, #FF3B30)' }}>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
          
        {/* Page content */}
        <main style={{ padding: `${AppleSpacing.lg} 0` }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: `0 ${AppleSpacing.lg}` }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
