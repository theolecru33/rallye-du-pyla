/* Rallye du Pyla : interactions du prototype */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var contenu = document.getElementById('contenu');
  var pied = document.querySelector('.site-footer');

  /* ----- Header : filet au scroll, masquage à la descente ----- */
  var lastY = window.scrollY;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    if (!reduceMotion && !header.classList.contains('menu-open')) {
      if (y > lastY && y > 400) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
    }
    lastY = y;
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
  }
  function openMenu() {
    header.classList.add('menu-open');
    header.classList.remove('header-hidden');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fermer le menu');
    document.body.style.overflow = 'hidden';
    if (contenu) { contenu.setAttribute('inert', ''); }
    if (pied) { pied.setAttribute('inert', ''); }
  }
  burger.addEventListener('click', function () {
    if (header.classList.contains('menu-open')) { closeMenu(); } else { openMenu(); }
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) { closeMenu(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('menu-open')) {
      closeMenu();
      burger.focus();
    }
  });
  /* Si la fenêtre repasse en desktop, le menu mobile se referme */
  var mqDesktop = window.matchMedia('(min-width: 901px)');
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
  var EVENEMENTS = [
    { debut: '2026-05-03', fin: null, titre: 'Rallye Pyla Coffee', heure: '9h à 12h', lieu: 'Place Daniel Meller, Pyla-sur-Mer', statut: 'libre' },
    { debut: '2026-06-07', fin: null, titre: 'Rallye Pyla Coffee', heure: '9h à 12h', lieu: 'Place Daniel Meller, Pyla-sur-Mer', statut: 'libre' },
    { debut: '2026-06-20', fin: null, titre: 'La Noctambule', heure: 'Balade au crépuscule, puis soirée', lieu: 'Pyla-sur-Mer', statut: 'libre' },
    { debut: '2026-07-05', fin: null, titre: 'Rallye Pyla Coffee', heure: '9h à 12h', lieu: 'Place Daniel Meller, Pyla-sur-Mer', statut: 'libre' },
    { debut: '2026-08-02', fin: null, titre: 'Apéro Capot', heure: '9h à 15h', lieu: 'Place Daniel Meller, Pyla-sur-Mer', statut: 'libre' },
    { debut: '2026-09-06', fin: null, titre: 'Rallye Pyla Coffee', heure: '9h à 12h', lieu: 'Place Daniel Meller, Pyla-sur-Mer', statut: 'libre' },
    { debut: '2026-09-17', fin: '2026-09-20', titre: 'GT Tour 2026 · session 1', heure: 'Accueil le jeudi de 16h à 17h', lieu: 'Au départ de Vichy', statut: 'ouvert' },
    { debut: '2026-10-01', fin: '2026-10-04', titre: 'GT Tour 2026 · session 2', heure: 'Accueil le jeudi de 16h à 17h', lieu: 'Au départ de Vichy', statut: 'ouvert' }
  ];

  var calGrille = document.getElementById('cal-grille');
  var calTitre = document.getElementById('cal-titre');
  var calDetail = document.getElementById('cal-detail');

  if (calGrille && calTitre && calDetail) {
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

    function formatDate(ev) {
      var debut = versDate(ev.debut);
      if (!ev.fin) {
        return majuscule(JOURS[debut.getDay()]) + ' ' + debut.getDate() + ' ' + MOIS[debut.getMonth()] + ' ' + debut.getFullYear();
      }
      var fin = versDate(ev.fin);
      return 'Du ' + JOURS[debut.getDay()] + ' ' + debut.getDate() + ' au ' + JOURS[fin.getDay()] + ' ' + fin.getDate() + ' ' + MOIS[fin.getMonth()] + ' ' + fin.getFullYear();
    }

    var moisAffiche = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), 1);
    var jourSelectionne = null;

    function afficheDetail(d) {
      var evs = d ? evenementsDuJour(d) : [];
      if (!evs.length) {
        calDetail.innerHTML = '<p class="cal-detail-vide">Choisissez une date marquée pour voir le rendez-vous. Les jours verts sont en entrée libre, les jours rouges sur inscription.</p>';
        return;
      }
      var html = '';
      evs.forEach(function (ev) {
        var passe = estPasse(ev);
        var badge, classe;
        if (passe) { badge = 'Passé'; classe = 'badge-annonce'; }
        else if (ev.statut === 'ouvert') { badge = 'Inscriptions ouvertes'; classe = 'badge-ouvert'; }
        else { badge = 'Entrée libre'; classe = 'badge-libre'; }
        html += '<span class="badge ' + classe + '">' + badge + '</span>';
        html += '<p class="cal-detail-titre">' + ev.titre + '</p>';
        html += '<p class="cal-detail-infos">' + formatDate(ev) + '<br>' + ev.heure + '<br>' + ev.lieu + '</p>';
        if (passe) {
          html += '<a class="text-link" href="#galerie">Revoir en photos <span aria-hidden="true">&rarr;</span></a>';
        } else if (ev.statut === 'ouvert') {
          html += '<a class="text-link" href="mailto:rallyedupyla@gmail.com?subject=Inscription%20GT%20Tour%202026">Demander le dossier <span aria-hidden="true">&rarr;</span></a>';
        }
      });
      calDetail.innerHTML = html;
    }

    function rendreMois() {
      calTitre.textContent = majuscule(MOIS[moisAffiche.getMonth()]) + ' ' + moisAffiche.getFullYear();
      calGrille.innerHTML = '';
      var annee = moisAffiche.getFullYear();
      var mois = moisAffiche.getMonth();
      var nbJours = new Date(annee, mois + 1, 0).getDate();
      var decalage = (new Date(annee, mois, 1).getDay() + 6) % 7; /* semaine qui commence le lundi */

      for (var v = 0; v < decalage; v++) {
        var vide = document.createElement('div');
        vide.className = 'cal-vide';
        calGrille.appendChild(vide);
      }
      for (var j = 1; j <= nbJours; j++) {
        var d = new Date(annee, mois, j);
        var evs = evenementsDuJour(d);
        var cellule = document.createElement('button');
        cellule.type = 'button';
        cellule.className = 'cal-jour';
        cellule.textContent = j;
        if (memeJour(d, aujourdhui)) { cellule.classList.add('aujourdhui'); }
        if (evs.length) {
          var ev = evs[0];
          cellule.classList.add('evenement');
          cellule.classList.add(estPasse(ev) ? 'passe' : ev.statut);
          cellule.setAttribute('aria-label', JOURS[d.getDay()] + ' ' + j + ' ' + MOIS[mois] + ' : ' + ev.titre);
          if (jourSelectionne && memeJour(d, jourSelectionne)) { cellule.classList.add('selection'); }
          (function (date) {
            cellule.addEventListener('click', function () {
              jourSelectionne = date;
              rendreMois();
              afficheDetail(date);
            });
          })(d);
        } else {
          cellule.setAttribute('aria-label', JOURS[d.getDay()] + ' ' + j + ' ' + MOIS[mois] + ', pas de rendez-vous');
          cellule.disabled = true;
        }
        calGrille.appendChild(cellule);
      }
    }

    document.getElementById('cal-prev').addEventListener('click', function () {
      moisAffiche = new Date(moisAffiche.getFullYear(), moisAffiche.getMonth() - 1, 1);
      rendreMois();
    });
    document.getElementById('cal-suivant').addEventListener('click', function () {
      moisAffiche = new Date(moisAffiche.getFullYear(), moisAffiche.getMonth() + 1, 1);
      rendreMois();
    });

    /* Au chargement : on présélectionne le prochain rendez-vous à venir */
    var prochain = null;
    EVENEMENTS.forEach(function (ev) {
      if (!estPasse(ev) && (!prochain || versDate(ev.debut) < versDate(prochain.debut))) { prochain = ev; }
    });
    if (prochain) {
      jourSelectionne = versDate(prochain.debut);
      moisAffiche = new Date(jourSelectionne.getFullYear(), jourSelectionne.getMonth(), 1);
    }
    rendreMois();
    afficheDetail(jourSelectionne);
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

  /* ----- Année du footer ----- */
  var annee = document.getElementById('annee');
  if (annee) { annee.textContent = String(new Date().getFullYear()); }
})();
