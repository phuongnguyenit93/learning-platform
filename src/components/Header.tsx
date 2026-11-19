import { NavLink, useLocation } from 'react-router-dom';
import { GOOGLE_SIGN_IN_URL } from '../data/auth';
import { topicFromPathname } from '../data/topicRoutes';
import { useLanguage } from '../state/LanguageContext';
import { useAuth } from '../state/useAuth';
import { useTheme } from '../state/ThemeContext';

const javaLogo = new URL('../assets/logos/java.svg', import.meta.url).href;

const labels = {
  vi: {
    home: 'Trang chủ',
    learning: 'Learning',
    sop: 'SOP',
    project: 'Project',
    myCv: 'About Me',
    search: 'Tìm kiếm...',
    searchLabel: 'Tìm kiếm toàn portal',
    signIn: 'Đăng nhập Google',
    googleNotConfigured: 'Chưa cấu hình Google',
    authUnavailable: 'Không thể kết nối đăng nhập',
    checkingAuth: 'Đang kiểm tra đăng nhập',
    retryAuth: 'Thử lại',
    signedInAs: 'Đăng nhập với tài khoản',
    logout: 'Đăng xuất',
    loggingOut: 'Đang đăng xuất',
    logoutFailed: 'Đăng xuất thất bại. Hãy thử lại.',
  },
  en: {
    home: 'Home',
    learning: 'Learning',
    sop: 'SOP',
    project: 'Project',
    myCv: 'About Me',
    search: 'Search...',
    searchLabel: 'Search the portal',
    signIn: 'Sign in with Google',
    googleNotConfigured: 'Google sign-in not configured',
    authUnavailable: 'Sign-in service unavailable',
    checkingAuth: 'Checking sign-in',
    retryAuth: 'Retry',
    signedInAs: 'Signed in as',
    logout: 'Log out',
    loggingOut: 'Signing out',
    logoutFailed: 'Could not log out. Please try again.',
  },
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true" focusable="false">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.27 5.48-4.81 7.18l7.73 6C44.37 38.03 46.98 31.88 46.98 24.55Z" />
      <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.6.27-3.14.77-4.59l-7.98-6.2A23.92 23.92 0 0 0 0 24c0 3.87.93 7.51 2.56 10.78l7.97-6.19Z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48Z" />
    </svg>
  );
}

export function Header() {
  const { pathname } = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { status, user, googleLoginEnabled, isLoggingOut, logoutFailed, logout, refresh } = useAuth();
  const text = labels[language];
  const topicSlug = topicFromPathname(pathname);
  const isJavaLearning = topicSlug === 'java';
  const topicLabel = topicSlug === null ? null : topicSlug === 'java' ? 'Java' : topicSlug.charAt(0).toUpperCase() + topicSlug.slice(1);
  const isMyCv = pathname === '/about-me' || pathname === '/about-me/';

  return (
    <header className="topbar">
      <div className={`topbar__brand${isMyCv ? ' topbar__brand--cv' : ''}`}>
        <span className="topbar__brand-icon" aria-hidden="true">
          {isJavaLearning ? <img src={javaLogo} alt="" /> : '☕'}
        </span>
        {isMyCv ? (
          <span className="topbar__brand-name">Nguyen Do Dinh Phuong</span>
        ) : topicLabel ? (
          <span>{topicLabel} <strong>Learning</strong></span>
        ) : (
          <span>Learning <strong>Platform</strong></span>
        )}
      </div>

      <nav className="topbar__nav" aria-label="Primary navigation">
        <NavLink to="/" end className={({ isActive }) => `topbar__nav-link${isActive ? ' is-active' : ''}`}>
          {text.home}
        </NavLink>
        <NavLink to="/learning" className={({ isActive }) => `topbar__nav-link${isActive ? ' is-active' : ''}`}>
          {text.learning}
        </NavLink>
        <NavLink to="/sop" className={({ isActive }) => `topbar__nav-link${isActive ? ' is-active' : ''}`}>
          {text.sop}
        </NavLink>
        <NavLink to="/project" className={({ isActive }) => `topbar__nav-link${isActive ? ' is-active' : ''}`}>
          {text.project}
        </NavLink>
        <NavLink to="/about-me" className={({ isActive }) => `topbar__nav-link${isActive ? ' is-active' : ''}`}>
          {text.myCv}
        </NavLink>
      </nav>

      <div className="topbar__actions">
        <label className="global-search" aria-label={text.searchLabel}>
          <span className="global-search__icon" aria-hidden="true">⌕</span>
          <input type="search" placeholder={text.search} />
          <span className="global-search__shortcut">⌘K</span>
        </label>

        <div className="header-auth">
          {status === 'authenticated' && user ? (
            <div className="header-auth__account">
              <div className="header-auth__identity" title={`${text.signedInAs}: ${user.email}`}>
                {user.avatarUrl ? (
                  <img className="header-auth__avatar" src={user.avatarUrl} alt="" referrerPolicy="no-referrer" />
                ) : (
                  <span className="header-auth__avatar header-auth__avatar--fallback" aria-hidden="true">
                    {(user.displayName || user.email).charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="header-auth__name">{user.displayName || user.email}</span>
              </div>
              <button
                type="button"
                className="header-auth__logout"
                onClick={() => void logout()}
                disabled={isLoggingOut}
                title={isLoggingOut ? text.loggingOut : text.logout}
                aria-label={isLoggingOut ? text.loggingOut : text.logout}
              >
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="m16 17 5-5-5-5M21 12H9" />
                </svg>
                <span className="header-auth__logout-label">{isLoggingOut ? text.loggingOut : text.logout}</span>
              </button>
              {logoutFailed && <span className="header-auth__feedback" role="alert">{text.logoutFailed}</span>}
            </div>
          ) : status === 'anonymous' && googleLoginEnabled ? (
            <a className="header-auth__google" href={GOOGLE_SIGN_IN_URL}>
              <GoogleIcon />
              <span>{text.signIn}</span>
            </a>
          ) : status === 'loading' ? (
            <span className="header-auth__loading" role="status">{text.checkingAuth}…</span>
          ) : (
            <div className="header-auth__disabled">
              <button className="header-auth__google" type="button" disabled title={googleLoginEnabled === false ? text.googleNotConfigured : text.authUnavailable}>
                <GoogleIcon />
                <span>{text.signIn}</span>
              </button>
              <span className="header-auth__reason" role="status">
                {googleLoginEnabled === false ? text.googleNotConfigured : text.authUnavailable}
              </span>
              {status === 'unavailable' && (
                <button type="button" className="header-auth__retry" onClick={refresh} title={text.retryAuth} aria-label={text.retryAuth}>↻</button>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          className={`language-toggle language-toggle--${language}`}
          onClick={toggleLanguage}
          aria-label="Toggle Vietnamese and English"
          aria-pressed={language === 'en'}
        >
          <span className="language-toggle__label">VI</span>
          <span className="language-toggle__track" aria-hidden="true">
            <span className="language-toggle__thumb" />
          </span>
          <span className="language-toggle__label">EN</span>
        </button>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          <span aria-hidden="true">{theme === 'dark' ? '☾' : '☀'}</span>
        </button>
      </div>
    </header>
  );
}
