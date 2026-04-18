# SPM — Audience & Pricing Method

Ce document est la **référence méthodologique interne** pour SPM (Skalevskyi publicité mobile) : estimation des contacts mensuels, lecture du CPM, positionnement par rapport aux autres canaux, et cadre linguistique pour la vente et le marketing. Il sert à **préserver le contexte** pour les futures validations tarifaires, les négociations et les décisions de copy (hero, offres), sans se substituer au produit technique.

---

## 1. Status and scope

| Élément | Statut |
|--------|--------|
| Nature | Spécification méthodologique / audit interne |
| Code et runtime | **Non normatif** : ce document ne modifie pas le comportement du site ni du calculateur |
| Valeurs contacts (produit vs implémentation) | **Produit (affichage utilisateur)** : **corridor** par format — plages mensuelles défendables (ex. 60k–100k, 100k–150k, 130k–200k) via i18n ; seule vérité **messaging** pour l’audience. **Implémentation interne** : constantes numériques éventuelles dans le code (`INDICATIVE_MONTHLY_CONTACTS`, ex. 30k / 45k / 60k) — **non normatives** pour le récit produit ; ne pas les présenter comme référence canonique. **Hero** : cadrage marketing avec plafond indicatif (ex. jusqu’à 200k) et texte d’appui, aligné sur le corridor. |
| Rôle | Conserver la logique de **validation prix**, de **défense** face aux clients et d’**alignement** avec les bonnes pratiques OOH françaises |

Les **plages corridor** (i18n) structurent la communication publique et la vente. Les constantes internes du moteur, si présentes dans le code, sont **décrites** ici uniquement comme couche technique — **pas** comme vérité produit pour les contacts.

En cas de tension sur le **comportement** (prix, API, écran) : **l’implémentation** fait foi ; ce document méthodologique reste aligné sur **`/SPEC/CALCULATOR_CURRENT_STATE.md`**. Pour le **message** sur l’audience, le **corridor + i18n** prime sur toute constante interne non exposée à l’utilisateur.

**Référence :** plages affichées, règle produit visibilité, contact→lead — **`/SPEC/CALCULATOR_CURRENT_STATE.md`** ; détail technique config — `src/lib/calculator/config.ts`. Ce fichier reste **méthodologique**.

### 1.b Méthodologie vs libellés produit (site)

| Couche | Rôle | Source de vérité |
|--------|------|------------------|
| **Méthodologie interne** (ce document) | Raisonner sur **contacts**, **contacts visibles**, **OTS**, CPM explicatif, défense prix — langage **professionnel OOH** et vente. | Non normatif pour le runtime. |
| **Copy / UI du site** | Ce que voit l’utilisateur : **plages corridor** + **libellés i18n** (FR/EN/UA). Les clés actuelles peuvent dire **« vues »**, **« views »**, **« перегляди »** là où implémenté (`offres`, `parcours`) tout en gardant les **mêmes fourchettes numériques**. | **`/SPEC/CALCULATOR_CURRENT_STATE.md`** §6 + fichiers **`src/i18n/locales/*`**. |

**Règle :** en cas de tension entre une formulation **méthodologique** (éviter « vues » non qualifiée en audit interne) et le **texte publié** sur le site, **le site / i18n** font foi pour la **communication utilisateur** ; ce document reste le cadre **interne** pour négociation et cohérence avec les bonnes pratiques OOH, sans imposer une réécriture du copy tant que les **chiffres** restent ceux du corridor.

---

## 2. Canonical operating scenario

**Contexte produit.** SPM est une offre **B2B locale** d’affichage mobile OOH sur **un véhicule brandé**, avec un **parcours récurrent en semaine** sur le littoral montpelliérain.

**Hypothèses d’exploitation documentées (scénario canonique interne, non codées telles quelles dans le moteur) :**

| Paramètre | Hypothèse |
|-----------|-----------|
| Matin (jours ouvrés) | Montpellier → Port Marianne / Pérols → Carnon → La Grande-Motte ; fenêtre indicative **06:15–07:00** |
| Soir (retour) | La Grande-Motte → Carnon → Palavas → Port Marianne → Montpellier ; fenêtre indicative **16:00–17:00** |
| Complément | Déplacements aléatoires en semaine dans Montpellier et proche périphérie |
| Distance journalière | Ordre de grandeur **70–100 km/jour** |
| Fréquence | Environ **25 jours actifs / mois** |
| Kilométrage mensuel | **Environ 1 200–1 500 km/mois** (hypothèse métier explicite ; **non « corrigée »** par ce document) |

Ces paramètres servent à raisonner sur l’exposition ; ils ne sont pas des garanties de performance mesurée.

---

## 3. Terminology

| Terme | Définition opérationnelle |
|-------|---------------------------|
| **Trafic brut (gross traffic)** | Volume de véhicules ou de flux observé sur un segment (données ouvertes, comptages), **sans** ajuster pour la visibilité du message. |
| **Contacts** | Personnes ou véhicules potentiellement exposés au message selon un modèle simplifié (estimation). **Ne pas confondre** avec des « vues » digitales ou des impressions certifiées. |
| **Contacts visibles (visible contacts)** | Sous-ensemble des contacts pour lesquels une **visibilité réaliste** du support (angle, distance, occlusion) est prise en compte. |
| **OTS (opportunities to see)** | Occasions où une exposition au message est **possible** dans des conditions données ; proche du langage professionnel OOH, distinct d’une « vue » garantie. |
| **Estimation indicative** | Fourchette ou ordre de grandeur communiqué avec transparence sur les hypothèses ; **pas** un engagement chiffré. |
| **Estimation conservative** | Choix de paramètres **prudents** (visibilité, répétition, couverture) pour limiter le sur-promesse. |
| **Conditions de pointe (peak conditions)** | Scénarios (trafic dense, météo favorable, format maximal, répétition forte) qui **majorent** l’exposition possible ; à cadrer explicitement comme plafond, pas comme défaut. |
| **CPM** | Métrique **explicative** alignée sur le **corridor** et les plages affichées : `CPM = (prix mensuel / contacts mensuels) × 1000` en ne retenant pour le **discours produit** que des **contacts** cohérents avec ce corridor — **pas** dérivés des seules constantes moteur internes. **Sur le site**, la ligne CPM du calculateur est une **copie statique** par locale (ex. FR **≈ 4 € pour 1000 vues** — voir `calculatorEstimatedCostCpmValue` dans `offres.ts`), **non** recalculée dynamiquement à partir du moteur. |

**Principe rédactionnel (méthodologie interne).** Pour les **documents internes** et la **vente**, privilégier **contacts estimés**, **contacts visibles**, **OTS**, et qualifier toute métrique de type « vue ». **Sur le landing**, les **libellés publiés** suivent l’**i18n** actuelle (voir §1.b) : l’écart de vocabulaire **ne** contredit **pas** le corridor tant que les **plages chiffrées** et le **prix** restent alignés sur le runtime.

---

## 4. External methodological references

**Mobimétrie / CESP / Ipsos (France).** La mesure d’audience de la **communication extérieure** en France repose sur une logique professionnelle : l’audience **ne se devine pas** ; elle s’appuie sur **mobilité, trafic, conditions d’exposition et d’ajustement de visibilité**. Le CESP encadre l’audit de la mesure ; Ipsos opère la méthode Mobimétrie pour le marché OOH. SPM **s’inspire** de cette logique (trafic + visibilité) mais **n’est pas** un produit Mobimétrie certifié.

**Données locales ouvertes.** Les jeux **département Hérault** et **Montpellier Méditerranée Métropole** fournissent des **comptages routiers** utilisables comme **entrées** pour segmenter le trafic le long d’axes ou de zones — sous réserve de rapprochement géographique et temporel avec le parcours réel.

**Transparence.** SPM utilise une **approximation locale simplifiée**, explicable en négociation, et **ne revendique pas** une mesure auditée équivalente à un panel national.

---

## 5. SPM audience model

### Formule structurante (niveau conceptuel)

```
Estimated monthly visible contacts
= Σ(segment traffic × exposure coefficient × visibility coefficient × package surface factor × active days)
+ supplementary urban circulation contribution
```

| Variable | Rôle (langage clair) |
|----------|----------------------|
| `segment traffic` | Volume de trafic (ou proxy) sur un **tronçon ou une zone** d’exposition. |
| `exposure coefficient` | Part du trafic **réellement exposé** au véhicule (fenêtre horaire, sens, cohabitation avec d’autres flux). |
| `visibility coefficient` | Ajustement **visibilité** (distance, angle, vitesse, météo, obstruction) — le trafic ≠ la visibilité du message. |
| `package surface factor` | Levier lié au **format** (surface latérale, arrière, covering) : impact qualitatif sur les contacts **visibles**, pas une constante universelle imposée par ce document. |
| `active days` | Nombre de jours de diffusion retenus (ex. ~25 / mois dans le scénario canonique). |
| `supplementary urban circulation contribution` | Apport des **courses urbaines** aléatoires en complément du corridor principal. |

### Formule simplifiée (communication interne)

```
Monthly contacts ≈ average effective daily contact volume × active days/month
```

« Effective daily contact volume » agrège déjà exposition et visibilité dans une seule grandeur moyenne — utile pour ordres de grandeur, moins pour l’audit segment par segment.

---

## 6. Route logic

Découpage logique en **zones d’exposition** (pas nécessairement des tronçons cartographiques nominatifs) :

| Zone | Caractère d’exposition |
|------|------------------------|
| **Montpellier urbain** (centre, Malbosc, Port Marianne, etc.) | Forte densité, arrêts, intersections ; exposition **répétée** possible ; concurrence visuelle élevée. |
| **Liaisons / Pérols / voies structurantes** | Flux **plus rapides** ; exposition latérale selon voie ; fenêtres matin/soir différentes. |
| **Corridor littoral** (Carnon, Palavas, La Grande-Motte) | Trafic touristique et résidentiel **saisonnier** ; visibilité longue sur certaines portions ; sens matin vs soir complémentaires. |

**Matin vs soir.** Le matin cible souvent flux « entrée » vers emplois / écoles / littoral ; le soir inverse les sens et les comportements (fatigue, luminosité). Les **trajets aléatoires** en ville ajoutent de la **couverture locale** sans être équivalents au corridor longue distance en intensité par kilomètre.

---

## 7. Package visibility logic

Hiérarchie **qualitative** (sans figer des coefficients « vérité finale » dans ce document) :

| Offre | Lecture visibilité |
|-------|-------------------|
| **BASIC** | Privilégie l’**arrière** ; surface utile plus limitée pour les prises latérales — **contacts visibles** typiquement plus bas **à parité de parcours**. |
| **PRO** | **Latéral renforcé** ; meilleure saisie des flux perpendiculaires ou défilants — hausse attendue des contacts visibles vs BASIC. |
| **EXCLUSIVE** | **Full wrap** + effet « propriété » du message sur le véhicule ; visibilité maximale sur l’ensemble des faces — **levier le plus fort** sur la couche « visible contacts ». |

Le **package surface factor** est un **levier de modélisation** : PRO et EXCLUSIVE doivent, toutes choses égales par ailleurs, **dominer** BASIC en contacts visibles ; les ordres de grandeur exacts relèvent de calibration future (données, validation terrain).

---

## 8. Audience layers (product corridor → supporting narrative → internal implementation)

**Distinction obligatoire** entre trois couches — ne pas les mélanger dans une même phrase de garantie.

| Couche | BASIC | PRO | EXCLUSIVE | Nature |
|--------|-------|-----|-----------|--------|
| **1) Corridor produit (canonique, affichage utilisateur)** | **~60k–100k** | **~100k–150k** | **~130k–200k** | **Seule vérité messaging** pour l’audience : plages i18n (calculateur, Parcours, copy approuvé). Voir `/SPEC/CALCULATOR_CURRENT_STATE.md` §6. |
| **2) Récit et métriques d’appui (CPM, plafonds marketing)** | — | — | **Jusqu’à ~200k** (hero / conditions favorables) | **Explication directionnelle** : CPM statique corridor-aligned sur le site ; plafonds **indicatifs** avec caveat (trafic, format, saison) — **pas** certification. |
| **3) Implémentation interne (moteur / code)** | **30 000** | **45 000** | **60 000** | Constantes techniques éventuelles (`INDICATIVE_MONTHLY_CONTACTS`) — **non** utilisées comme vérité produit ni pour le messaging utilisateur ; peuvent servir à des besoins techniques internes uniquement. |

**Note sur les anciens documents.** Des valeurs du type **110k / 150k / 200k** ont pu apparaître comme placeholders ; elles ne sont pas canoniques. **200k** n’est acceptable en communication **que** comme **plafond indicatif** qualifié (couche 2), jamais comme garantie. Les constantes **30k / 45k / 60k** ne doivent **pas** être présentées comme la référence audience côté produit (couche 3 uniquement).

---

## 9. CPM logic

**Prix de base mensuels actuels (implémentés) :**

| Package | Prix €/mois |
|---------|-------------|
| BASIC | 300 |
| PRO | 490 |
| EXCLUSIVE | 690 |

**Formule (illustrative) :**

```
CPM = (monthly price / monthly contacts) × 1000
```

Pour le **discours produit** et l’UI, les « contacts mensuels » du dénominateur doivent être ceux du **corridor** (couche 1), **pas** des constantes moteur internes.

### CPM corridor (aligné messaging et UI)

Exemples **non exhaustifs** en raisonnant au **milieu de corridor** défendable (ordre de grandeur) — **référence pour la vente et le site** :

| Illustration | Contacts retenus | Prix (€) | CPM indicatif (€) |
|--------------|------------------|------------|-------------------|
| BASIC, milieu de fourchette ~80k | 80 000 | 300 | ~3,75 |
| PRO, milieu ~125k | 125 000 | 490 | ~3,92 |
| EXCLUSIVE, milieu ~165k | 165 000 | 690 | ~4,18 |

Le calculateur affiche une **ligne CPM statique** (copy par locale, ex. FR ≈ 4 € pour 1000 vues), **alignée** sur cette logique corridor — **non** calculée à partir de constantes internes 30k/45k/60k.

Le **CPM baisse** si les contacts retenus augmentent **à prix fixe**. L’objectif n’est pas de « vendre » le CPM le plus bas, mais d’**expliciter** que le chiffre repose sur le **corridor** et des hypothèses de contacts cohérentes avec les plages affichées.

### Annexe — référence interne uniquement (non messaging)

Si l’on appliquait la formule aux seules constantes techniques **30k / 45k / 60k** (hors vérité produit pour l’audience), on obtiendrait des CPM **plus élevés** (~10–11,5 €) — **non utilisés** dans le messaging public ni comme ligne CPM sur le site. Ne pas confondre avec le CPM corridor ci-dessus.

| Package | Prix (€) | Contacts (interne, non messaging) | CPM (€) |
|---------|----------|-----------------------------------|---------|
| BASIC | 300 | 30 000 | **10,00** |
| PRO | 490 | 45 000 | **10,89** (arrondi) |
| EXCLUSIVE | 690 | 60 000 | **11,50** (arrondi) |

---

## 10. Positioning versus other channels

**OOH / panneaux.** SPM se compare utilement par **contacts visibles locaux**, **récurrence** du parcours et **présence physique** dans un territoire ciblé — logique proche des discussions d’affichage, avec une unité de mesure **discutable** mais **parlante** si qualifiée.

**Meta / Google / programmatic.** Ce sont des **médias différents** : intention de recherche ou de feed, enchères, ciblage algorithmique, mesure d’impressions **non équivalente** aux contacts OOH mobiles. **Interdire** l’équation « même métrique = même valeur ».

**Usage du CPM.** Le CPM reste un **langage commun** en réunion pour **situer** le coût ; il doit être présenté comme **directionnel**, avec des contacts explicités comme **corridor / plages affichées** (couche 1), pas comme constantes moteur (couche 3).

---

## 11. Sales-safe language

### Approved phrasing

**Français**

- « Nous générons une **estimation indicative** de **contacts visibles** mensuels selon le format et l’intensité du parcours. »
- « Selon le format, la couverture mensuelle peut aller d’un **niveau conservateur** à des **scénarios de forte exposition**. »
- « Dans des **conditions favorables**, l’exposition mensuelle peut atteindre **jusqu’à 200 000 contacts estimés** — chiffre **non garanti**, fonction du trafic et du format. »

**Ukrainian**

- « Ми надаємо **індикативну оцінку** **місячних видимих контактів** залежно від формату та інтенсивності маршруту. »
- « Залежно від формату, місячне охоплення може коливатися від **консервативного рівня** до **сценаріїв підвищеної експозиції**. »
- « За **сприятливих умов** місячна експозиція може сягати **до 200 000 оцінених контактів** — це **не гарантія**, залежить від трафіку та формату. »

### Avoid

- « 200 000 vues garanties » / « 200 000 переглядів гарантовано »
- « Audience certifiée » / « аудиторія сертифікована » (sans cadre CESP/Mobimétrie équivalent)
- « Équivalent exact à Google Ads » / « точний аналог Google Ads »
- Toute formulation suggérant une **mesure auditée** ou **certifiée** si ce n’est pas le cas
- « Vues » non qualifiées à la place de **contacts visibles** ou **OTS**

---

## 12. Recommended use in product and sales

- L’**UI calculateur et Parcours** doivent rester **alignés sur les plages corridor** (i18n) pour toute affirmation sur la portée audience ; ne pas exposer les constantes internes 30k/45k/60k comme chiffres produit.
- Les **supports commerciaux** présentent la **fourchette corridor** (couche 1) avec méthode et hypothèses.
- Le **hero copy** ne doit utiliser **« jusqu’à / до »** vers un plafond élevé que si le texte précise **indicatif**, **non garanti**, et renvoie à la variabilité (trafic, format, saison).

---

## 13. Open questions / next validation steps

- Extraction **trafic par segment routier** aligné sur le tracé réel (au-delà des agrégats zoniers).
- **Ajustement saisonnier** littoral vs mois hors saison.
- Prise en compte d’**arrêts / exposition statique** (parking, files).
- Lissage **jours ouvrés uniquement** vs **moyenne mensuelle** calendaire.
- Éventuelle **mise à jour des contacts du calculateur** après validation prix et terrain.
- Documentation d’une **grille de coefficients** visibilité/format si une calibration est validée.

---

## 14. Sources

Liens de référence (méthodes et données ouvertes — vérifier la disponibilité des URL au moment de la consultation) :

- **CESP — Communication extérieure (audience)** : [https://www.cesp.org/audits/audience/communication-exterieure/](https://www.cesp.org/audits/audience/communication-exterieure/)
- **CESP — Mobimétrie (présentation)** : [https://www.cesp.org/mobimetrie-nouvelle-mesure-daudience-de-la-communication-exterieure-auditee-par-le-cesp/](https://www.cesp.org/mobimetrie-nouvelle-mesure-daudience-de-la-communication-exterieure-auditee-par-le-cesp/)
- **Ipsos — Étude de l’audience Out Of Home** : [https://www.ipsos.com/fr-fr/etude-de-laudience-out-home](https://www.ipsos.com/fr-fr/etude-de-laudience-out-home)
- **data.gouv.fr — Exemple jeu Hérault (trafic)** : [https://www.data.gouv.fr/datasets/trafic-de-lherault-2024](https://www.data.gouv.fr/datasets/trafic-de-lherault-2024) (les millésimes peuvent évoluer ; rechercher « trafic Hérault » sur data.gouv.fr)
- **data.gouv.fr — Comptages sur voirie départementale (ressource nationale)** : [https://www.data.gouv.fr/datasets/comptages-routiers-sur-la-voirie-departementale](https://www.data.gouv.fr/datasets/comptages-routiers-sur-la-voirie-departementale)
- **Montpellier Méditerranée Métropole — Open Data, comptage véhicules** : [https://data.montpellier3m.fr/dataset/comptage-v%C3%A9hicules-particuliers-de-montpellier](https://data.montpellier3m.fr/dataset/comptage-v%C3%A9hicules-particuliers-de-montpellier)
