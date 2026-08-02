/* Rallye du Pyla : interactions du prototype */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var contenu = document.getElementById('contenu');
  var pied = document.querySelector('.site-footer');

  /* ----- Header : sticky partout, simple filet au scroll ----- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----- Menu mobile ----- */
  function closeMenu() {
    header.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    document.body.style.overflow = '';
    if (contenu) { contenu.removeAttribute('inert'); }
    if (pied) { pied.removeAttribute('inert'); }
    replierOnglets();
  }
  function openMenu() {
    header.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fermer le menu');
    document.body.style.overflow = 'hidden';
    if (contenu) { contenu.setAttribute('inert', ''); }
    if (pied) { pied.setAttribute('inert', ''); }
  }
  burger.addEventListener('click', function () {
    if (header.classList.contains('menu-open')) { closeMenu(); } else { openMenu(); }
  });
  /* Onglets depliables du tiroir mobile : le lien de tete ouvre son panneau
     au lieu de naviguer. En desktop il garde son comportement d'origine. */
  var declencheurs = document.querySelectorAll('.has-mega > a');
  Array.prototype.forEach.call(declencheurs, function (a) {
    a.setAttribute('aria-expanded', 'false');
    a.addEventListener('click', function (e) {
      if (mqDesktop.matches) { return; }
      e.preventDefault();
      e.stopPropagation();
      var li = a.parentElement;
      var ouvert = !li.classList.contains('open');
      /* un seul panneau a la fois, sinon le tiroir deborde de l'ecran */
      Array.prototype.forEach.call(declencheurs, function (autre) {
        autre.parentElement.classList.remove('open');
        autre.setAttribute('aria-expanded', 'false');
      });
      if (ouvert) {
        li.classList.add('open');
        a.setAttribute('aria-expanded', 'true');
      }
    });
  });
  function replierOnglets() {
    Array.prototype.forEach.call(declencheurs, function (a) {
      a.parentElement.classList.remove('open');
      a.setAttribute('aria-expanded', 'false');
    });
  }

  nav.addEventListener('click', function (e) {
    var lien = e.target.closest('a');
    if (!lien) { return; }
    /* le lien de tete d'un onglet deplie le panneau, il ne ferme pas le tiroir */
    if (!mqDesktop.matches && lien.parentElement.classList.contains('has-mega')) { return; }
    closeMenu();
  });
  /* Les reseaux, la connexion et le panier vivent dans le panneau sur mobile :
     on le referme avant d'ouvrir le tiroir ou de partir sur un lien externe. */
  var actions = document.querySelector('.header-actions');
  if (actions) {
    actions.addEventListener('click', function () {
      if (header.classList.contains('menu-open')) { closeMenu(); }
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('menu-open')) {
      closeMenu();
      burger.focus();
    }
  });
  /* Si la fenêtre repasse en desktop, le menu mobile se referme.
     Le seuil doit coller au CSS (bascule burger a 1080px) : avec 901px,
     ouvrir le menu entre 901 et 1080 puis elargir laissait la page inerte. */
  var mqDesktop = window.matchMedia('(min-width: 1081px)');
  if (mqDesktop.addEventListener) {
    mqDesktop.addEventListener('change', function (e) {
      if (e.matches) { closeMenu(); }
    });
  }

  /* ----- Apparitions au scroll ----- */
  if ('IntersectionObserver' in window && !reduceMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ----- Calendrier interactif ----- */
  var JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

  /* Source : rallyedupyla.fr. Statuts : libre (entrée libre), ouvert (inscriptions), passe. */
  var PHOTO_COFFEE = { image: 'coffee-place-matin.jpg', alt: 'Porsche 911 et voitures anciennes rassemblées un dimanche matin, place Daniel Meller' };
  var RESUME_COFFEE = 'Chaque premier dimanche du mois, les belles mécaniques se retrouvent entre verdure et bord de plage, autour d’un petit-déjeuner.';
  var EVENEMENTS = [
    { debut: '2026-05-03', fin: null, titre: 'Rallye Pyla Coffee', heure: '9h à 12h', lieu: 'Place Daniel Meller, Pyla-sur-Mer', statut: 'libre', image: PHOTO_COFFEE.image, alt: PHOTO_COFFEE.alt, resume: RESUME_COFFEE },
    { debut: '2026-06-07', fin: null, titre: 'Rallye Pyla Coffee', heure: '9h à 12h', lieu: 'Place Daniel Meller, Pyla-sur-Mer', statut: 'libre', image: PHOTO_COFFEE.image, alt: PHOTO_COFFEE.alt, resume: RESUME_COFFEE },
    { debut: '2026-06-20', fin: null, titre: 'La Noctambule', heure: 'Balade au crépuscule, puis soirée', lieu: 'Pyla-sur-Mer', statut: 'libre', image: 'noctambule-plaque.jpg', alt: 'Plaque de rallye de La Noctambule tenue à deux mains', resume: 'Un itinéraire tracé à la tombée du jour, puis un cocktail chic et champêtre au cœur du Pyla, entre passionnés.' },
    { debut: '2026-07-05', fin: null, titre: 'Rallye Pyla Coffee', heure: '9h à 12h', lieu: 'Place Daniel Meller, Pyla-sur-Mer', statut: 'libre', image: PHOTO_COFFEE.image, alt: PHOTO_COFFEE.alt, resume: RESUME_COFFEE },
    { debut: '2026-08-02', fin: null, titre: 'Apéro Capot', heure: '9h à 15h', lieu: 'Place Daniel Meller, Pyla-sur-Mer', statut: 'libre', image: 'apero-capot.jpg', alt: 'Apéritif dressé sur le capot d’une voiture ancienne, verres de rosé sur nappe blanche', resume: 'Nappes sur les capots, ambiance élégante et champêtre : en 2024, 250 voitures de prestige étaient au rendez-vous.' },
    { debut: '2026-09-06', fin: null, titre: 'Rallye Pyla Coffee', heure: '9h à 12h', lieu: 'Place Daniel Meller, Pyla-sur-Mer', statut: 'libre', image: PHOTO_COFFEE.image, alt: PHOTO_COFFEE.alt, resume: RESUME_COFFEE },
    { debut: '2026-09-17', fin: '2026-09-20', titre: 'GT Tour 2026 · session 1', heure: 'Accueil le jeudi de 16h à 17h', lieu: 'Au départ de Vichy', statut: 'ouvert', image: 'gt-tour-montagne.jpg', alt: 'Corvette jaune et cabriolet rouge sur une route de montagne dans la brume', resume: 'Quatre jours de routes choisies, de tables gastronomiques et de nuits cinq étoiles, en petit comité.' },
    { debut: '2026-10-01', fin: '2026-10-04', titre: 'GT Tour 2026 · session 2', heure: 'Accueil le jeudi de 16h à 17h', lieu: 'Au départ de Vichy', statut: 'ouvert', image: 'gt-tour-brume.jpg', alt: 'GT alignées dans la brume sur une route de col pendant le GT Tour', resume: 'Même programme, second départ : 880 km au départ de Vichy, douze à quinze équipages, pas un de plus.' }
  ];

  var calGrille = document.getElementById('cal-grille');
  var calTitre = document.getElementById('cal-titre');
  var calVedette = document.getElementById('cal-vedette');

  if (calGrille && calTitre && calVedette) {
    var aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);

    function versDate(iso) {
      var p = iso.split('-');
      return new Date(+p[0], +p[1] - 1, +p[2]);
    }
    function memeJour(a, b) {
      return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }
    function evenementsDuJour(d) {
      return EVENEMENTS.filter(function (ev) {
        var debut = versDate(ev.debut);
        var fin = ev.fin ? versDate(ev.fin) : debut;
        return d >= debut && d <= fin;
      });
    }
    function estPasse(ev) {
      var fin = ev.fin ? versDate(ev.fin) : versDate(ev.debut);
      return fin < aujourdhui;
    }
    function majuscule(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

    var moisAffiche = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), 1);
    var jourSelectionne = null;

    function prochainEvenement() {
      var p = null;
      EVENEMENTS.forEach(function (ev) {
        if (!estPasse(ev) && (!p || versDate(ev.debut) < versDate(p.debut))) { p = ev; }
      });
      return p;
    }

    /* La vedette sert aussi de panneau de détail : cliquer une date la remplace. */
    function afficheVedette(d) {
      var evs = d ? evenementsDuJour(d) : [];
      if (!evs.length) {
        calVedette.innerHTML = '<p class="cal-vedette-vide">Choisissez une date marquée dans le calendrier pour voir le rendez-vous.</p>';
        return;
      }
      var ev = evs[0];
      var passe = estPasse(ev);

      var badge, classeBadge;
      if (passe) { badge = 'Passé'; classeBadge = 'badge-annonce'; }
      else if (ev.statut === 'ouvert') { badge = 'Inscriptions ouvertes'; classeBadge = 'badge-ouvert'; }
      else { badge = 'Entrée libre'; classeBadge = 'badge-libre'; }

      var lien, libelle;
      if (passe) { lien = '#galerie'; libelle = 'Revoir en photos'; }
      else { lien = 'mailto:rallyedupyla@gmail.com?subject=' + encodeURIComponent('Inscription ' + ev.titre); libelle = 'S’inscrire'; }

      var debut = versDate(ev.debut);
      var grosJour, sousTitre;
      if (ev.fin) {
        var fin = versDate(ev.fin);
        var memeMois = fin.getMonth() === debut.getMonth() && fin.getFullYear() === debut.getFullYear();
        if (memeMois) {
          grosJour = debut.getDate() + ' au ' + fin.getDate();
          sousTitre = MOIS[debut.getMonth()] + ' ' + debut.getFullYear();
        } else {
          /* a cheval sur deux mois : sans le mois de debut on lisait « 30 au 3 octobre » */
          grosJour = debut.getDate() + ' ' + MOIS[debut.getMonth()] + ' au ' + fin.getDate() + ' ' + MOIS[fin.getMonth()];
          sousTitre = debut.getFullYear() === fin.getFullYear()
            ? String(debut.getFullYear())
            : debut.getFullYear() + ' / ' + fin.getFullYear();
        }
      } else {
        grosJour = majuscule(JOURS[debut.getDay()]) + ' ' + debut.getDate();
        sousTitre = MOIS[debut.getMonth()] + ' ' + debut.getFullYear();
      }

      calVedette.innerHTML =
        '<div class="cal-vedette-split">' +
          '<img src="assets/img/' + ev.image + '" alt="' + ev.alt + '" loading="lazy">' +
          '<div class="cal-vedette-corps">' +
            '<p class="cal-vedette-jour">' + grosJour + '</p>' +
            '<p class="cal-vedette-mois">' + sousTitre + '</p>' +
            '<p class="cal-vedette-titre">' + ev.titre + '</p>' +
            (ev.resume ? '<p class="cal-vedette-resume">' + ev.resume + '</p>' : '') +
            '<p class="cal-vedette-infos">' + ev.heure + ' <span class="sep" aria-hidden="true">·</span> ' + ev.lieu + '</p>' +
            '<div class="cal-vedette-actions">' +
              '<span class="badge ' + classeBadge + '">' + badge + '</span>' +
              '<a class="btn btn-dark" href="' + lien + '">' + libelle + ' <span class="chevron" aria-hidden="true">&rsaquo;</span></a>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    function rendreMois() {
      calTitre.textContent = majuscule(MOIS[moisAffiche.getMonth()]) + ' ' + moisAffiche.getFullYear();
      calGrille.innerHTML = '';
      var annee = moisAffiche.getFullYear();
      var mois = moisAffiche.getMonth();
      var decalage = (new Date(annee, mois, 1).getDay() + 6) % 7; /* semaine qui commence le lundi */
      var premiereCase = new Date(annee, mois, 1 - decalage);

      /* Toujours 6 semaines : les jours des mois voisins sont affichés en grisé, hauteur constante */
      for (var i = 0; i < 42; i++) {
        var d = new Date(premiereCase.getFullYear(), premiereCase.getMonth(), premiereCase.getDate() + i);
        var horsMois = d.getMonth() !== mois;
        var evs = evenementsDuJour(d);
        var cellule = document.createElement('button');
        cellule.type = 'button';
        cellule.className = 'cal-jour';
        cellule.textContent = d.getDate();
        if (memeJour(d, aujourdhui)) { cellule.classList.add('aujourdhui'); }

        if (horsMois) {
          cellule.classList.add('hors-mois');
          /* un rendez-vous du mois voisin reste signale, sinon il parait libre */
          if (evs.length) { cellule.classList.add('evenement-voisin'); }
          cellule.disabled = true;
          cellule.setAttribute('aria-hidden', 'true');
        } else if (evs.length) {
          var ev = evs[0];
          cellule.classList.add('evenement');
          cellule.classList.add(estPasse(ev) ? 'passe' : ev.statut);
          cellule.setAttribute('aria-label', JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + MOIS[mois] + ' : ' + ev.titre);
          if (jourSelectionne && memeJour(d, jourSelectionne)) { cellule.classList.add('selection'); }
          (function (date) {
            cellule.addEventListener('click', function () {
              jourSelectionne = date;
              rendreMois();
              afficheVedette(date);
              /* la grille est reconstruite : sans ca le focus clavier retombe sur body */
              var reprise = calGrille.querySelector('.cal-jour.selection');
              if (reprise) { reprise.focus(); }
            });
          })(d);
        } else {
          cellule.setAttribute('aria-label', JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + MOIS[mois] + ', pas de rendez-vous');
          cellule.disabled = true;
        }
        calGrille.appendChild(cellule);
      }
    }

    var calPrec = document.getElementById('cal-prev');
    var calSuiv = document.getElementById('cal-suivant');
    if (calPrec) {
      calPrec.addEventListener('click', function () {
        moisAffiche = new Date(moisAffiche.getFullYear(), moisAffiche.getMonth() - 1, 1);
        rendreMois();
      });
    }
    if (calSuiv) {
      calSuiv.addEventListener('click', function () {
        moisAffiche = new Date(moisAffiche.getFullYear(), moisAffiche.getMonth() + 1, 1);
        rendreMois();
      });
    }

    /* Au chargement : on présélectionne le prochain rendez-vous à venir */
    var prochain = prochainEvenement();
    if (prochain) {
      jourSelectionne = versDate(prochain.debut);
      moisAffiche = new Date(jourSelectionne.getFullYear(), jourSelectionne.getMonth(), 1);
    }
    rendreMois();
    afficheVedette(jourSelectionne);

  }

  /* ----- Lightbox galerie ----- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && typeof lightbox.showModal === 'function') {
    document.querySelectorAll('.mosaic-tile').forEach(function (tile) {
      tile.addEventListener('click', function () {
        var img = tile.querySelector('img');
        lightboxImg.src = tile.getAttribute('data-full');
        lightboxImg.alt = img ? img.alt : '';
        lightbox.showModal();
      });
    });
    lightboxClose.addEventListener('click', function () {
      lightbox.close();
    });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) { lightbox.close(); }
    });
    lightbox.addEventListener('close', function () {
      lightboxImg.removeAttribute('src');
    });
  } else {
    document.documentElement.classList.add('no-dialog');
  }

  /* ----- Formulaire de contact : compose un courriel pre-rempli ----- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var feedback = document.getElementById('contact-feedback');
      var champEmail = document.getElementById('cf-email');
      var email = champEmail.value.trim();

      if (!email || email.indexOf('@') < 1 || email.indexOf('.') < 0) {
        champEmail.focus();
        if (feedback) {
          feedback.hidden = false;
          feedback.textContent = 'Indiquez un courriel valide pour que nous puissions vous répondre.';
        }
        return;
      }

      var nom = document.getElementById('cf-nom').value.trim();
      var objet = document.getElementById('cf-objet').value;
      var message = document.getElementById('cf-message').value.trim();
      var corps = (message || '[votre message]') + '\n\n' + (nom ? nom + '\n' : '') + email;
      var lien = 'mailto:rallyedupyla@gmail.com'
        + '?subject=' + encodeURIComponent('Rallye du Pyla • ' + objet)
        + '&body=' + encodeURIComponent(corps);

      if (feedback) {
        feedback.hidden = false;
        feedback.textContent = 'Votre messagerie s’ouvre avec le message pré-rempli. À très vite !';
      }
      window.location.href = lien;
    });
  }

  /* ----- Prototype : rien n'est actif, tout ouvre la pop-up ----- */
  var proto = document.getElementById('proto');
  var protoUtilisable = proto && typeof proto.showModal === 'function';

  function ouvrirProto() {
    if (protoUtilisable && !proto.open) { proto.showModal(); }
  }

  /* ==========================================================================
     Panier : le seul dispositif reellement actif de la maquette.
     Tiroir lateral, quantites, retrait, jauge de livraison offerte.
     ========================================================================== */
  var PRODUITS = [
    { nom: 'Polo Homme', prix: 45, image: 'boutique-polo-homme.jpg', variante: 'Taille L' },
    { nom: 'Sweat-shirt', prix: 65, image: 'boutique-sweat.jpg', variante: 'Taille M' },
    { nom: 'Tee \u00ab Porsche \u00bb', prix: 5, image: 'boutique-tee-porsche.jpg', variante: 'Taille L' },
    { nom: 'Polo Femme', prix: 45, image: 'boutique-polo-femme.jpg', variante: 'Taille S' }
  ];
  var LIVRAISON = 15;
  var SEUIL_FRANCO = 80;

  var panier = document.getElementById('panier');
  var voile = document.getElementById('voile');
  var panierCorps = document.getElementById('panier-corps');
  var cartCompteur = document.getElementById('cart-compteur');
  var lignesPanier = [];

  function euros(n) { return String(n).replace('.', ',') + ' \u20ac'; }

  /* deux articles tires au hasard dans la boutique */
  function tirageInitial() {
    var pioche = PRODUITS.slice();
    for (var i = pioche.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = pioche[i]; pioche[i] = pioche[j]; pioche[j] = t;
    }
    lignesPanier = pioche.slice(0, 2).map(function (p) {
      return { produit: p, qte: 1 };
    });
  }

  function sousTotal() {
    return lignesPanier.reduce(function (s, l) { return s + l.produit.prix * l.qte; }, 0);
  }
  function nombreArticles() {
    return lignesPanier.reduce(function (s, l) { return s + l.qte; }, 0);
  }

  function dessinerPanier() {
    if (!panierCorps) { return; }

    if (!lignesPanier.length) {
      panierCorps.innerHTML = '<div class="panier-vide">' +
        '<p class="panier-vide-titre">Votre panier est vide</p>' +
        '<p>Les polos, sweats et tee-shirts du club vous attendent \u00e0 la boutique.</p>' +
        '</div>';
    } else {
      panierCorps.innerHTML = lignesPanier.map(function (l, i) {
        var p = l.produit;
        return '<article class="panier-article">' +
                 '<img src="assets/img/' + p.image + '" alt="" loading="lazy">' +
                 '<div>' +
                   '<div class="panier-article-haut">' +
                     '<div>' +
                       '<p class="panier-article-nom">' + p.nom + '</p>' +
                       '<p class="panier-article-variante">' + p.variante + '</p>' +
                     '</div>' +
                     '<p class="panier-article-prix">' + euros(p.prix * l.qte) + '</p>' +
                   '</div>' +
                   '<div class="panier-article-bas">' +
                     '<div class="compteur">' +
                       '<button type="button" data-qte="-1" data-i="' + i + '" aria-label="Retirer un article"' + (l.qte <= 1 ? ' disabled' : '') + '>&minus;</button>' +
                       '<span>' + l.qte + '</span>' +
                       '<button type="button" data-qte="1" data-i="' + i + '" aria-label="Ajouter un article"' + (l.qte >= 9 ? ' disabled' : '') + '>+</button>' +
                     '</div>' +
                     '<button type="button" class="panier-retirer" data-retirer="' + i + '">Retirer</button>' +
                   '</div>' +
                 '</div>' +
               '</article>';
      }).join('');
    }

    var st = sousTotal();
    var n = nombreArticles();
    var vide = !lignesPanier.length;
    var franco = st >= SEUIL_FRANCO;
    var frais = (vide || franco) ? 0 : LIVRAISON;

    var maj = function (id, valeur) { var e = document.getElementById(id); if (e) { e.textContent = valeur; } };
    maj('panier-compte', n === 0 ? 'Aucun article' : (n + (n > 1 ? ' articles' : ' article')));
    maj('panier-sous-total', euros(st));
    /* panier vide : ne pas annoncer une livraison offerte, ce serait contredire la jauge */
    maj('panier-livraison', vide ? '\u00c0 calculer' : (frais === 0 ? 'Offerte' : euros(frais)));
    maj('panier-total', euros(st + frais));
    if (cartCompteur) {
      cartCompteur.textContent = String(n);
      cartCompteur.hidden = n === 0;
    }
    var boutonPanier = document.getElementById('ouvrir-panier');
    if (boutonPanier) {
      boutonPanier.setAttribute('aria-label', n === 0
        ? 'Voir le panier, vide'
        : 'Voir le panier, ' + n + (n > 1 ? ' articles' : ' article'));
    }

    var blocJauge = document.getElementById('panier-jauge');
    if (blocJauge) { blocJauge.hidden = vide; }

    var texte = document.getElementById('panier-jauge-texte');
    var barre = document.getElementById('panier-jauge-barre');
    if (texte && barre) {
      var reste = Math.max(0, SEUIL_FRANCO - st);
      texte.textContent = reste === 0 ? 'Livraison offerte, c\u2019est acquis.' : 'Plus que ' + euros(reste) + ' pour la livraison offerte';
      texte.classList.toggle('atteint', reste === 0);
      barre.style.width = Math.min(100, Math.round((st / SEUIL_FRANCO) * 100)) + '%';
    }
  }

  if (panierCorps) {
    panierCorps.addEventListener('click', function (e) {
      var q = e.target.closest('[data-qte]');
      if (q) {
        var i = +q.getAttribute('data-i');
        lignesPanier[i].qte = Math.min(9, Math.max(1, lignesPanier[i].qte + (+q.getAttribute('data-qte'))));
        dessinerPanier();
        return;
      }
      var r = e.target.closest('[data-retirer]');
      if (r) {
        lignesPanier.splice(+r.getAttribute('data-retirer'), 1);
        dessinerPanier();
      }
    });
  }

  /* Le tiroir est masque par une translation, pas par display:none : ses boutons
     restent donc tabulables. On utilise inert, qui sort a la fois du parcours
     clavier et de l'arbre d'accessibilite, la ou aria-hidden seul laissait le
     focus partir hors ecran. */
  function ouvrirPanier() {
    if (!panier || !voile) { return; }
    voile.hidden = false;
    void voile.offsetWidth; /* on force un reflow, sinon la transition ne part pas */
    voile.classList.add('visible');
    panier.classList.add('ouvert');
    panier.removeAttribute('inert');
    if (contenu) { contenu.setAttribute('inert', ''); }
    if (pied) { pied.setAttribute('inert', ''); }
    document.body.style.overflow = 'hidden';
    var fermeture = document.getElementById('panier-fermer');
    if (fermeture) { fermeture.focus(); }
  }
  function fermerPanier() {
    if (!panier || !voile) { return; }
    panier.classList.remove('ouvert');
    panier.setAttribute('inert', '');
    if (contenu) { contenu.removeAttribute('inert'); }
    if (pied) { pied.removeAttribute('inert'); }
    voile.classList.remove('visible');
    setTimeout(function () { voile.hidden = true; }, 300);
    document.body.style.overflow = '';
    var ouvrant = document.getElementById('ouvrir-panier');
    if (ouvrant) { ouvrant.focus(); }
  }

  if (panier) {
    tirageInitial();
    dessinerPanier();
    var pf = document.getElementById('panier-fermer');
    if (pf) { pf.addEventListener('click', fermerPanier); }
    if (voile) { voile.addEventListener('click', fermerPanier); }
    var pv = document.getElementById('panier-vider');
    if (pv) { pv.addEventListener('click', function () { lignesPanier = []; dessinerPanier(); }); }
    var pc = document.getElementById('panier-commander');
    if (pc) { pc.addEventListener('click', function () { fermerPanier(); ouvrirProto(); }); }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panier.classList.contains('ouvert')) { fermerPanier(); }
    });
  }

  /* Aucun bouton du site ne fonctionne : tout renvoie a la pop-up.
     Restent actifs : le panier, les reseaux, et la mecanique propre a la
     maquette (ouvrir le menu, feuilleter le calendrier, agrandir une photo,
     sauter au contenu). Sans elle il n'y a plus aucune navigation mobile
     et le lien d'evitement enfermerait le visiteur au clavier. */
  var MECANIQUE = '#burger, .skip-link, #calendrier, .mosaic-tile, .lightbox';

  function estAutorise(cible) {
    if (cible.closest('.bwf') || cible.closest('.panier')) { return true; }
    if (cible.closest(MECANIQUE)) { return true; }
    /* en mobile, le lien de tete d'un onglet deplie son panneau : c'est de la
       mecanique de menu, pas un bouton du site */
    if (!mqDesktop.matches && cible.parentElement && cible.parentElement.classList.contains('has-mega')) { return true; }
    if (cible.classList.contains('header-icon') && !cible.classList.contains('header-cart')) { return true; }
    return false;
  }

  document.addEventListener('click', function (e) {
    var cible = e.target.closest('a, button, [type="submit"]');
    if (!cible) { return; }
    if (estAutorise(cible)) { return; }

    e.preventDefault();
    e.stopPropagation();

    if (cible.classList.contains('header-cart')) { ouvrirPanier(); return; }

    /* un clic depuis le menu mobile le referme, sinon il reste ouvert derriere */
    if (header.classList.contains('menu-open')) { closeMenu(); }
    ouvrirProto();
  }, true);

  /* meme chose au clavier : entree ou espace sur un bouton */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') { return; }
    var cible = e.target.closest && e.target.closest('a, button, [type="submit"]');
    if (!cible || estAutorise(cible)) { return; }
    /* espace sur un lien doit faire defiler la page, c'est le comportement natif */
    if (e.key === ' ' && cible.tagName === 'A') { return; }
    e.preventDefault();
    if (cible.classList.contains('header-cart')) { ouvrirPanier(); } else { ouvrirProto(); }
  }, true);

  if (proto) {
    ['proto-fermer', 'proto-continuer'].forEach(function (id) {
      var b = document.getElementById(id);
      if (b) { b.addEventListener('click', function () { proto.close(); }); }
    });
    proto.addEventListener('click', function (e) {
      if (e.target === proto) { proto.close(); }
    });
  }

  /* ----- Mega-menus : ouverture au survol, petit delai avant fermeture ----- */
  var megaItems = document.querySelectorAll('.has-mega');
  var megaTimer;
  megaItems.forEach(function (li) {
    li.addEventListener('mouseenter', function () {
      clearTimeout(megaTimer);
      megaItems.forEach(function (o) { if (o !== li) { o.classList.remove('open'); } });
      li.classList.add('open');
    });
    li.addEventListener('mouseleave', function () {
      clearTimeout(megaTimer);
      megaTimer = setTimeout(function () { li.classList.remove('open'); }, 260);
    });
  });

  /* ----- Diaporama du hero (fond qui défile tout seul toutes les 4 s) ----- */
  var slides = document.querySelectorAll('.hero-slides img');
  if (slides.length > 1 && !reduceMotion) {
    var slideIndex = 0;
    setInterval(function () {
      slides[slideIndex].classList.remove('is-active');
      slideIndex = (slideIndex + 1) % slides.length;
      slides[slideIndex].classList.add('is-active');
    }, 4500);
  }

  /* ----- Année du footer ----- */
  var annee = document.getElementById('annee');
  if (annee) { annee.textContent = String(new Date().getFullYear()); }
})();
