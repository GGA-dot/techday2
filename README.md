# TechDay Formation AIBS

Projet d'intégration **HTML local + CSV + Supabase + GitHub** pour la formation TechDay.

## Architecture

### Versioning déterministe (GitHub)
- Pages HTML, CSS, JavaScript
- Code source
- Configuration

### Versioning non-déterministe (Supabase)
- Données utilisateurs
- Modifications en temps réel
- Historique des changements

## Structure

```
techday2/
├── index.html          # Page principale
├── style.css           # Styles
├── app.js              # Logique (Supabase + CSV)
├── data.csv            # Données locales (exemple)
├── .env               # Secrets (non versionné)
└── docs/              # Documentation du projet
```

## Démarrage local

```bash
# 1. Cloner le repo
git clone https://github.com/GGA-dot/techday2.git
cd techday2

# 2. Ouvrir en local (dans un navigateur)
open index.html
# ou
python -m http.server 8000
# puis http://localhost:8000
```

## Intégration Supabase

1. Les données CSV sont chargées côté client
2. Supabase stocke les données persistantes
3. Les modifications sont synchronisées en temps réel

## Déploiement

- Code : `git push origin main` → GitHub
- Données : Supabase Cloud (pas de versioning Git)

---

**Création :** 2026-09-05  
**Équipe :** Formation AIBS TechDay  
**Stack :** HTML + JavaScript + Supabase + GitHub
