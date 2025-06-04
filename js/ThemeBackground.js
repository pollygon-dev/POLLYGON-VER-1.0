// js/ThemeBackground.js
window.ThemeBackground = function ThemeBackground() {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  React.useEffect(() => {
    // Initial theme check
    const darkThemeClass = document.body.classList.contains('dark-theme');
    setIsDarkTheme(darkThemeClass);

    // Observer for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkTheme(document.body.classList.contains('dark-theme'));
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const lightModeStyle = {
    backgroundColor: '#edf6ff',
    backgroundImage: `
      linear-gradient(30deg, #ffe9f2 12%, transparent 12.5%, transparent 87%, #ffe9f2 87.5%, #ffe9f2),
      linear-gradient(150deg, #ffe9f2 12%, transparent 12.5%, transparent 87%, #ffe9f2 87.5%, #ffe9f2),
      linear-gradient(30deg, #ffe9f2 12%, transparent 12.5%, transparent 87%, #ffe9f2 87.5%, #ffe9f2),
      linear-gradient(150deg, #ffe9f2 12%, transparent 12.5%, transparent 87%, #ffe9f2 87.5%, #ffe9f2),
      linear-gradient(60deg, #ffe9f277 25%, transparent 25.5%, transparent 75%, #ffe9f277 75%, #ffe9f277),
      linear-gradient(60deg, #ffe9f277 25%, transparent 25.5%, transparent 75%, #ffe9f277 75%, #ffe9f277)
    `,
    backgroundSize: '80px 140px',
    backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px',
    opacity: 1
  };

  const darkModeStyle = {
    backgroundColor: '#1a1a1a',
    backgroundImage: `
      linear-gradient(30deg, #3e353b 12%, transparent 12.5%, transparent 87%, #3e353b 87.5%, #3e353b),
      linear-gradient(150deg, #3e353b 12%, transparent 12.5%, transparent 87%, #3e353b 87.5%, #3e353b),
      linear-gradient(30deg, #3e353b 12%, transparent 12.5%, transparent 87%, #3e353b 87.5%, #3e353b),
      linear-gradient(150deg, #3e353b 12%, transparent 12.5%, transparent 87%, #3e353b 87.5%, #3e353b),
      linear-gradient(60deg, #3e353b77 25%, transparent 25.5%, transparent 75%, #3e353b77 75%, #3e353b77),
      linear-gradient(60deg, #3e353b77 25%, transparent 25.5%, transparent 75%, #3e353b77 75%, #3e353b77)
    `,
    backgroundSize: '80px 140px',
    backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px',
    opacity: 1
  };

  return React.createElement(React.Fragment, null, [
    React.createElement('div', {
      key: 'background',
      className: "fixed inset-0",
      style: isDarkTheme ? darkModeStyle : lightModeStyle
    }),
    React.createElement('div', {
      key: 'logo',
      className: "floating-logo"
    }, React.createElement('img', {
      src: "img/dev@4x.png",
      alt: "Polly-gon Logo"
    }))
  ]);
};