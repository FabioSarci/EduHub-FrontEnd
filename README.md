# EduHub - Piattaforma di E-Learning

EduHub è una piattaforma di e-learning moderna e intuitiva che permette a studenti e docenti di gestire corsi, materiali didattici e quiz in modo semplice ed efficace. Sviluppata con React, TypeScript e Vite, offre un'esperienza utente fluida e reattiva.

## Caratteristiche Principali

- 👥 Gestione utenti con ruoli (studenti e docenti)
- 📚 Gestione corsi e materiali didattici
- ✍️ Sistema di quiz e valutazioni
- 🎨 Interfaccia moderna con Tailwind CSS
- 🔒 Autenticazione sicura con JWT

## Prerequisiti

- Node.js (versione 18 o superiore)
- npm o yarn
- Git

## Installazione

1. Clona il repository:
```bash
git clone https://github.com/FabioSarci/EduHub-FrontEnd
cd eduhub
```

2. Installa le dipendenze:
```bash
npm install
# oppure
yarn install
```

3. Crea un file `.env` nella root del progetto:
```env
VITE_STORAGE_URL=http://localhost:7001
```

4. Avvia il server di sviluppo:
```bash
npm run dev
# oppure
yarn dev
```

## Tecnologie Utilizzate

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Radix UI
- Lucide React

## Struttura del Progetto

```
src/
├── components/     # Componenti riutilizzabili
├── contexts/      # Context React per la gestione dello stato
├── hooks/         # Custom hooks
├── interfaces/    # Interfacce TypeScript
├── lib/          # Utility e configurazioni
└── pages/        # Componenti pagina
```

## Script Disponibili

- `npm run dev` - Avvia il server di sviluppo
- `npm run build` - Compila il progetto per la produzione
- `npm run lint` - Esegue il linting del codice
- `npm run preview` - Visualizza l'anteprima della build di produzione

## Contribuire

Le pull request sono benvenute. Per modifiche importanti, apri prima un issue per discutere cosa vorresti cambiare.

## Licenza

[MIT](https://choosealicense.com/licenses/mit/)
