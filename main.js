const { app, BrowserWindow } = require('electron');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 700,
    height: 520,
    webPreferences: {
      nodeIntegration: true // Permitir el uso de Node.js en la aplicación
    },
    autoHideMenuBar: true
  });

  mainWindow.loadFile('src/index.html'); // Cargar la página principal de la aplicación
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(); // Crear una ventana si no existe ninguna
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit(); // Salir de la aplicación cuando todas las ventanas estén cerradas
});

