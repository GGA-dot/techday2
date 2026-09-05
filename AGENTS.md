# AGENTS.md — Règles de travail du projet Techday2

## Règles strictes

### Communication
- Répondre en français, clair, pas-à-pas, sans jargon inutile
- Guider étape par étape les manipulations externes

### Déploiement / Git
- Ne JAMAIS déployer ni pousser sans feu vert explicite de l'utilisateur
- Un commit par étape, message clair
- TOUJOURS `git pull --rebase origin main` avant de pousser
- Ne jamais force-push
- Finir les messages de commit par `Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>`
- Clés/API/mots de passe UNIQUEMENT dans .env — jamais dans le code
- Ne jamais écraser la base de données lors d'un déploiement

### Mémoire de projet — À JOUR À CHAQUE CHANGEMENT
- `docs/JOURNAL.md` : une ligne DATÉE après chaque changement (fait + prochaine étape)
- `docs/ROADMAP.md` : cocher ce qui est fait, ajouter/retirer dans « À faire »
- `docs/DECISIONS.md` : un ADR pour toute décision durable ; une fois « accepted », c'est immuable
- Chaque page garde sa frontmatter et on BUMPE « last-reviewed » lors d'une modif substantielle

### Rituel de fin de session
- Y a-t-il une décision durable ? → DECISIONS
- Bloqué > 30 min ? → JOURNAL
- TOUJOURS : une ligne datée dans JOURNAL (fait + prochaine étape)

### Façon de travailler
- Vérifier avant d'affirmer (tester, regarder le rendu)
- Rapporter fidèlement (si ça échoue, le dire)
- Poser des questions plutôt que deviner
