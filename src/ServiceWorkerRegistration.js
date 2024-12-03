export function register(config) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('Service Worker registered:', registration);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // New content is available; notify the user
                    console.log('New content is available; please refresh.');
                    if (config && config.onUpdate) {
                      config.onUpdate(registration);
                    }
                  } else {
                    console.log('Content is cached for offline use.');
                    if (config && config.onSuccess) {
                      config.onSuccess(registration);
                    }
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.error('Error during service worker registration:', error);
        });
    });
  }
}
