const { chromium, webkit, firefox } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth');
const fs = require('node:fs');
chromium.use(stealth());


(async () => {
    // Inicia el navegador
    const browser = await chromium.launch({ headless: false,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15',
      viewport: { width: 1280, height: 720 }, // Tamaño de pantalla similar a un usuario real
      permissions: ['geolocation'],  // Simula permisos típicos de un usuario real
      geolocation: { longitude: -122.4194, latitude: 37.7749 },  // Ubicación geográfica simulada
      locale: 'en-US',  // Idioma del navegador
    });
      const context = await browser.newContext({
       
    });
    const page = await context.newPage();
   

    // URL de la página de producto específico en Nike (asegúrate de pegar la URL del producto exacto que deseas)
    const productUrl = 'https://www.nike.com/launch/t/ld-1000-game-royal-and-opti-yellow'; // Cambia esto a la URL del producto
     await page.goto(productUrl);
     await page.waitForLoadState('networkidle'); // Espera hasta que no haya más actividad de red
    if (fs.existsSync('cookies.json')) {
        const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
        await page.context().addCookies(cookies);
        console.log('Cookies cargadas');
      }else{
          const cookies = await page.context().cookies();
          fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
          console.log('Cookies guardadas');
        }

        const sizeToSelect = '10'; // Cambia a la talla que desees
    const isAvailable = await page.$(`button[id=size_item_radio${sizeToSelect}]`); // Selector del botón para agregar al carrito

    if (isAvailable) {
        console.log('El producto está disponible. Seleccionando talla...');

        // Selecciona la talla que deseas (ajusta el selector dependiendo de la estructura del HTML)
        page.waitForTimeout(1000)
        
        await page.click(`button[id=size_item_radio${sizeToSelect}]`);
        
        // Espera un poco para asegurarse de que el botón de compra esté habilitado
        
        // Añadir al carrito
        await page.waitForTimeout(1000)
        await page.click('.buying-tools-cta-button'); // Botón de añadir al carrito
        console.log('Producto añadido al carrito con éxito.');
        await page.waitForTimeout(5000)

        // Opcional: Navegar al carrito para verificar que el producto fue añadido
        await page.waitForSelector('.cart-item'); // Verifica que haya un ítem en el carrito
        const itemInCart = await page.$('.cart-item');
        if (itemInCart) {
            console.log('El producto está en el carrito.');
        } else {
            console.log('El producto no se añadió correctamente.');
        }
    } else {
        console.log('El producto no está disponible.');
    }

 // Cierra el navegador
 await browser.close();

})();
