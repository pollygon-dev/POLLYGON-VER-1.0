window.WebcamWindow = function WebcamWindow() {
    return React.createElement('div', {
      className: 'p-4 bg-white/80 backdrop-blur-sm'
    }, 
      React.createElement('div', {
        className: 'relative'
      }, [
        React.createElement('img', {
          key: 'webcam',
          src: 'img/flan.gif', // Replace with your actual GIF path
          alt: 'Webcam Feed',
          style: {
            width: '800px',  // Match your GIF dimensions
            height: '450px',
            objectFit: 'cover'
          },
          className: 'rounded-lg border-2 border-pink-200'
        }),
        // Decorative overlay
        React.createElement('div', {
          key: 'overlay',
          className: 'absolute inset-0 bg-gradient-to-b from-pink-100/10 to-transparent pointer-events-none rounded-lg'
        }),
        // Record indicator
        React.createElement('div', {
          key: 'indicator',
          className: 'absolute top-4 right-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full'
        }, [
          React.createElement('div', {
            key: 'dot',
            className: 'w-2 h-2 rounded-full bg-red-500 animate-pulse'
          }),
          React.createElement('span', {
            key: 'text',
            className: 'text-white text-xs'
          }, 'REC')
        ])
      ])
    );
  };