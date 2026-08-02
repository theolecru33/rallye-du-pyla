# Rallye du Pyla, maquette de site

Proposition de refonte du site du [Rallye du Pyla](https://www.rallyedupyla.fr), club automobile du Bassin d'Arcachon.

**Aperçu en ligne : https://theolecru33.github.io/rallye-du-pyla/**

Maquette réalisée par [BassinWebFlow](https://bassinwebflow.fr). Elle n'est pas contractuelle et ne remplace pas le site officiel du club.

## Ce que c'est

Une page unique, en HTML, CSS et JavaScript purs. Pas de framework, pas de dépendance, pas de requête vers un service tiers : les polices sont auto-hébergées, rien ne sort du serveur qui héberge la page.

Contenu et photos proviennent du site officiel du club et de la presse. Les tarifs, dates et coordonnées sont ceux publiés par le club.

## Ce qui fonctionne

La maquette est volontairement inerte : **tous les boutons ouvrent une fenêtre expliquant qu'il s'agit d'un prototype**. Deux exceptions, laissées actives pour la démonstration :

- le **panier**, qui est un vrai tiroir de boutique (quantités, retrait d'article, jauge de livraison offerte, total recalculé) ;
- les **liens vers les réseaux sociaux** du club.

Restent également vivants les mécanismes propres à la maquette : le menu mobile, le calendrier que l'on feuillette mois par mois, et l'agrandissement des photos de la galerie.

## Organisation

```
index.html              la page
assets/css/onepage.css  toute la mise en forme
assets/js/onepage.js    calendrier, panier, menu, galerie
assets/fonts/           Fraunces, Hanken Grotesk, Inter, en woff2
assets/img/             photos et logos
```

## Développer en local

Un simple serveur de fichiers suffit :

```bash
python -m http.server 8317
```

Puis ouvrir http://localhost:8317/

Le CSS et le JS portent un numéro de version dans leur URL (`onepage.css?v=66`). **Il faut l'incrémenter à chaque modification**, sinon le navigateur continue de servir l'ancienne version depuis son cache.

## Accessibilité et responsive

La page a été auditée et corrigée sur ces points : cibles tactiles d'au moins 40px, contrastes vérifiés sur les photos du diaporama, navigation au clavier, `prefers-reduced-motion` respecté, aucun débordement horizontal de 320 à 1920px.
