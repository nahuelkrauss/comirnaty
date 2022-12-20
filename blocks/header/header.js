import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

function decorateNavigation(section) {
  const as = section.querySelectorAll('a[href]');
  const active = [...as].find((a) => {
    const { pathname } = new URL(a.href);
    return pathname === window.location.pathname;
  });
  if (active) active.classList.add('active');
}

function decorateVaccineFinder(section) {
  const btn = section.querySelector('a, button');
  if (btn) btn.classList.add('button');
}

function decorateLinks(section) {
  // add link classes
  const as = section.querySelectorAll('a');
  as.forEach((a) => {
    const parent = a.parentElement;
    const li = a.closest('li');
    if (parent.nodeName === 'STRONG') {
      a.classList.add('primary');
      parent.replaceWith(a);
      li.classList.add('primary-container');
    } else if (parent.nodeName === 'EM') {
      a.classList.add('secondary');
      parent.replaceWith(a);
      li.classList.add('secondary-container');
    }
  });
  // setup menus
  const [alwaysShow, hamburgerLinks] = section.querySelectorAll('ul');
  alwaysShow.children[alwaysShow.children.length - 1].classList.add('split');
  const separator = alwaysShow.nextElementSibling;
  if (hamburgerLinks) {
    // readd hamburger links to "always show" menu
    hamburgerLinks.querySelectorAll('li').forEach((li) => {
      const clone = li.cloneNode(true);
      clone.classList.add('fullscreen');
      alwaysShow.append(clone);
    });
    // build section for hamburger menu
    const hamburgerWrapper = document.createElement('div');
    hamburgerWrapper.className = 'nav-hamburger-links';
    if (separator && separator !== hamburgerLinks) {
      hamburgerWrapper.append(separator);
      hamburgerWrapper.append(document.createElement('hr'));
    }
    hamburgerWrapper.append(hamburgerLinks);
    section.parentElement.append(hamburgerWrapper);
  }
}

async function fillBanner(banner) {
  const resp = await fetch('/top-banner.plain.html');

  if (resp.ok) {
    const html = await resp.text();
    banner.innerHTML = html;
    const section = banner.querySelector('div');
    section.classList.add('header-banner-section');
    const button = banner.querySelector('a');
    const div = document.createElement('div');
    div.classList = 'header-banner-cta';
    const buttonContainer = button.closest('p');
    buttonContainer.classList.add('button-container');
    button.classList.add('button', 'primary');
    div.append(buttonContainer);
    banner.append(div);
  }
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const config = readBlockConfig(block);
  block.textContent = '';

  const banner = document.createElement('div');
  banner.classList.add('header-banner');
  block.append(banner);
  fillBanner(banner);

  // fetch nav content
  const navPath = config.nav || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.innerHTML = html;

    const classes = ['brand', 'navigation', 'vaccine-finder', 'links'];
    classes.forEach((e, j) => {
      const section = nav.children[j];
      if (section) section.classList.add(`nav-${e}`);
    });

    const navigation = nav.querySelector('.nav-navigation');
    if (navigation) decorateNavigation(navigation);

    const vaccineFinder = nav.querySelector('.nav-vaccine-finder');
    if (vaccineFinder) decorateVaccineFinder(vaccineFinder);

    const links = nav.querySelector('.nav-links');
    if (links) decorateLinks(links);

    // hamburger for mobile
    const hamburger = document.createElement('button');
    hamburger.setAttribute('type', 'button');
    hamburger.className = 'nav-hamburger';
    hamburger.innerHTML = `<div class="nav-hamburger-icon"></div>
      <p class="nav-hamburger-text">Menu</p>`;
    hamburger.addEventListener('click', () => {
      const expanded = nav.getAttribute('aria-expanded') === 'true';
      nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      hamburger.querySelector('.nav-hamburger-text').textContent = expanded ? 'Menu' : 'Close';
    });
    nav.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'false');

    decorateIcons(nav);
    block.append(nav);
  }
}
