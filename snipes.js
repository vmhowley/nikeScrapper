const { chromium, firefox, webkit } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth');
firefox.use(stealth())
;(async () => {
  // Lanzar el navegador (puedes usar chromium, firefox o webkit)
  const browser = await firefox.launch({ headless: false,
    proxy: {
      server:'us.922s5.net:6300',
      username: '23991357',
      password: 'rUNzyYraLl'
    }
   });  // Usa false para ver el navegador en acción
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }, // Tamaño de pantalla similar a un usuario real
    permissions: ['geolocation'],  // Simula permisos típicos de un usuario real
    geolocation: { longitude: -122.4194, latitude: 37.7749 },  // Ubicación geográfica simulada
    locale: 'en-US',  // Idioma del navegador
    colorScheme: 'light',  // Modo de color (claro u oscuro)
  });
  const page = await context.newPage();
 
  await page.addInitScript(() => {
    // Eliminar navigator.webdriver
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined,
    });

    // Cambiar otros rastros visibles del navegador automatizado
    window.chrome = {
      runtime: {},  // Simula el objeto chrome.runtime como si estuviera en un navegador real
    };

    // Eliminar detecciones del plugin de automatización
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3],  // Devuelve un array de plugins simulados
    });

    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],  // Idiomas que un usuario típico tendría
    });
  });
  // Simulación de una pequeña demora para imitar interacciones humanas
  await page.waitForTimeout(1000);

  // Navegar a la página de BrowserScan
  await page.goto('https://www.browserscan.net/bot-detection', { waitUntil: 'networkidle' });

  // Esperar a que la página cargue completamente
  await page.waitForTimeout(3000);

  // Tomar una captura de pantalla de la página para ver cómo es detectada
  await page.screenshot({ path: 'browserscan-result.png' });

  // Cerrar el navegador
  await browser.close();
})();
