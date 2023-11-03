# Vulkain Scraper  

Need [NodeJS](https://nodejs.org/en/download/current) installed on your machine.
Need an FR System (Windows, Linux, Mac OS).
## Install :
```bash
cd vulkain-scraper
npm i 
```
## Modify
You can modify the file ```app.js``` (with VS Code) and change the scrapper config.
```javascript
const CSV_NAME = 'concessionnaire_auto_lyon.csv';
const PAGE = 'https://www.google.com/search?q=concessionnaire+auto+lyon+inurl%3Acontact';
const BLACKLIST = [
    'pappers.fr',
    'tripadvisor.fr',
    'thefork.fr',
    'petitfute.com',
    'facebook.com',
    'linternaute.com',
];
```
## Run in your terminal
```bash
node app.js
```
## Result

```bash
Scrap de la page n°: 36 sur 40 : https://www.tdsautoservice.fr/contact-garage-auto-rillieux-la-pape.html
Scrap de la page n°: 37 sur 40 : https://occasion.chanas-auto.com/contact.html
Scrap de la page n°: 38 sur 40 : https://diagnosticautolyon.fr/contact/
Scrap de la page n°: 39 sur 40 : https://www.vroomly.com/garages/garage-auto-contact-38400-cachin/
Scrap de la page n°: 40 sur 40 : https://www.vroomly.com/garages/contact-auto-92230-jaures/
Nombre de mail trouvé : 50 %
Nombre de tel trouvé : 67.5 %
Le fichier CSV a été créé avec succès.
```

