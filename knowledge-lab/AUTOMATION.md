# Automatisation du Knowledge Lab — mode d'emploi

Ce document est le playbook suivi par la tâche planifiée qui publie automatiquement
2 nouveaux articles par semaine sur le Knowledge Lab de gomandconsult.com. Il est
conçu pour être exécuté par une session Claude fraîche, sans mémoire des sessions
précédentes — tout ce qui est nécessaire doit donc se trouver ici ou dans les
fichiers qu'il référence.

Dépôt : `https://github.com/Gomand-Consult/Gomand-Consult-Web` (branche `main`).
Le site est un site statique HTML déployé automatiquement par Netlify à chaque
push sur `main` — il n'y a pas de build à lancer. En revanche, **toute
publication passe par une Pull Request** : le propriétaire du site relit et
merge lui-même avant que l'article soit en ligne (voir étape 9).

## Étapes à suivre à chaque exécution

1. **Cloner le dépôt** dans un répertoire de travail temporaire.
2. **Lire `knowledge-lab/_backlog.json`.** Prendre le premier sujet avec
   `"status": "todo"` (les sujets sont déjà ordonnés selon la rotation des
   4 catégories — ne pas sauter l'ordre). Si le backlog ne contient plus aucun
   sujet `"todo"` ou qu'il en reste moins de 4, générer 6 à 8 nouveaux sujets
   avant de continuer (voir section "Renouveler le backlog" plus bas), puis
   reprendre le premier `"todo"`.
3. **Rédiger l'article** en suivant strictement le gabarit ci-dessous, avec le
   titre, la catégorie, l'angle (`angle`) et le lien CTA (`cta_service`) définis
   dans le backlog pour ce sujet.
4. **Créer le fichier** `knowledge-lab/<slug>.html` (le `slug` est celui du
   backlog).
5. **Mettre à jour `knowledge-lab.html` :**
   - Ajouter le nouvel article en tête de la grille `.card-grid` ("Derniers
     articles") et retirer la 4ᵉ carte actuelle de la grille (elle ne disparaît
     pas du site, elle bascule uniquement dans la section Archives).
   - Ajouter une entrée en tête de la section Archives (`.method-list`), avec
     la date au format `JJ.MM.AA` et la catégorie en légende. Ne jamais retirer
     d'entrée des Archives — cette liste grandit indéfiniment.
   - Mettre à jour le bloc JSON-LD `hasPart` de la page pour qu'il reflète
     exactement les 4 articles actuellement dans la grille "Derniers articles"
     (pas plus).
6. **Mettre à jour `sitemap.xml`** : ajouter une ligne `<url>` pour le nouvel
   article, juste après `knowledge-lab.html`, avec `priority` `0.5`.
7. **Mettre à jour `llms.txt`** : ajouter une ligne dans la section
   `## Knowledge Lab`, juste après la ligne `[Knowledge Lab](...)`, avec le
   titre et un résumé d'une phrase.
8. **Mettre à jour `knowledge-lab/_backlog.json`** : passer le sujet publié en
   `"status": "published"` avec la date du jour en `"published_date"`
   (`AAAA-MM-JJ`).
9. **Ne jamais commit/push directement sur `main`.** Créer une branche dédiée
   nommée `article/<slug>`, y commit tous les changements (message au format
   `Publie l'article "<titre court>" (Knowledge Lab)`), la pousser, puis ouvrir
   une Pull Request vers `main` avec :
   - Titre : `Knowledge Lab : <titre court de l'article>`
   - Description : le résumé de l'article (`angle` du backlog), la catégorie,
     et la liste des fichiers modifiés.
   Puis **s'arrêter** — ne pas merger la PR. La revue et le merge sont faits
   par le propriétaire du site (ou sur sa demande explicite). C'est le
   fonctionnement voulu par le client : chaque article est relu avant d'être
   visible publiquement.

## Gabarit exact d'un article

Copier la structure d'un article existant, par exemple
`knowledge-lab/nom-marque-reputation-par-ou-commencer.html` ou
`knowledge-lab/branding-oriente-roi.html`, et l'adapter :

- `<title>` : `"<Titre> — Gomand Consult"`
- `<meta name="description">` et tous les `og:`/`twitter:` équivalents :
  1 à 2 phrases, ton direct, qui donnent envie de cliquer sans être putaclic.
- `<link rel="canonical">` et `og:url` : `https://gomandconsult.com/knowledge-lab/<slug>.html`
- `og:image` : voir `image_by_category` dans `_backlog.json` selon la catégorie
  de l'article.
- JSON-LD `BlogPosting` : `datePublished`/`dateModified` = date du jour de
  publication, `articleSection` = catégorie exacte du backlog.
- JSON-LD `BreadcrumbList` : 3 niveaux (Accueil / Knowledge Lab / titre court).
- `breadcrumb` dans le corps : `<a href="../knowledge-lab.html">Knowledge Lab</a> / <titre court>`
- Hero : `eyebrow` = catégorie, `h1` = titre complet, `lede` = accroche de 1 à 2
  phrases, ligne signature `Par Anthony Gomand · <date en toutes lettres> · Environ
  X min de lecture` (X ≈ nombre de mots / 130, arrondi).
- Corps : 700 à 1000 mots, 3 à 5 sous-titres `<h2>`, au moins une liste
  (`<ul>` ou `<ol>`) quelque part, un paragraphe de conclusion qui fait un lien
  interne naturel (pas forcé) vers `cta_service`.
- Section `.cta-band` standard identique à celle des autres articles (titre +
  phrase + bouton "Prenons un café" vers `../contact.html`).
- Header et footer : copier-coller exact depuis un article existant (ne jamais
  les réinventer).

## Ton et style — voix d'Anthony Gomand

- Français de Belgique (`fr-BE`), direct, sans jargon marketing inutile.
- Première personne pour les passages méthode ("Je construis...", "Je fais
  répondre mes clients à...") — c'est un consultant qui parle de sa pratique
  réelle, pas un média généraliste.
- Toujours relier une idée abstraite à un effet business mesurable ou à une
  situation concrète de PME/indépendant belge.
- Éviter les tournures creuses ("dans le monde d'aujourd'hui", "il est
  important de noter que"). Aller directement à l'observation ou à l'exemple.
- Terrain PME/indépendant en Wallonie et à Bruxelles, jamais un ton corporate
  ou startup.

## Rotation des catégories

Ordre fixe, cyclique : Branding & identité → Stratégie & ROI → Digitalisation
→ PME & terrain → (repeat). Le backlog est déjà pré-ordonné dans cet ordre —
il suffit de prendre les sujets `"todo"` dans l'ordre où ils apparaissent.

## Renouveler le backlog

Quand il reste moins de 4 sujets `"todo"`, générer 6 à 8 nouveaux sujets en
respectant la rotation des 4 catégories, inspirés des pages `services/*.html`
et des articles déjà publiés (éviter les doublons de sujet). Pour chaque
nouveau sujet, définir : `category`, `title`, `slug` (kebab-case, sans accents),
`angle` (2-3 phrases de brief) et `cta_service` (page de service la plus
pertinente). Les ajouter à la fin du tableau `topics` dans `_backlog.json`
avec `"status": "todo"`.

## Ce qu'il ne faut jamais faire

- Ne jamais publier deux articles sur un sujet quasi identique à un article
  déjà présent dans `_backlog.json` (`published` ou `todo`).
- Ne jamais casser la structure JSON-LD ou oublier de mettre à jour
  `sitemap.xml` — c'est ce qui permet au site d'être bien référencé.
- Ne jamais laisser un article de moins de 600 mots ou de plus de 1300 mots.
- Ne jamais changer le design/CSS du site dans le cadre de cette tâche : le
  scope est strictement la publication d'articles et la mise à jour des
  fichiers listés ci-dessus.
