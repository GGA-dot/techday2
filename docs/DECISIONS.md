---
title: Décisions durables (ADR)
status: active
last-reviewed: 2026-09-05
---

# DECISIONS.md — Architecture Decision Records

## Index des décisions

Chaque décision durable est documentée ici. Une fois « accepted », elle est immuable — pour la changer, écrire un NOUVEL ADR et marquer l'ancien « superseded ».

*(Aucune décision durable enregistrée pour le moment)*

---

## Format des ADRs

Chaque ADR va dans `docs/decisions/NNNN-titre.md` avec le format suivant :

```markdown
---
status: proposed | accepted | superseded
date: YYYY-MM-DD
---

# NNNN — Titre

## Contexte
Pourquoi nous nous posons cette question.

## Décision
Ce que nous avons décidé.

## Conséquences
Avantages et inconvénients.

## Statut
- proposed : en discussion
- accepted : validée et immuable
- superseded by NNNN-X : remplacée par une autre ADR
```
