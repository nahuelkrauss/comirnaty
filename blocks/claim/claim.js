/*
 * Fragment Block
 * Include content from one Helix page in another.
 * https://www.hlx.live/developer/block-collection/fragment
 */

import {
    decorateMain,
  } from '../../scripts/scripts.js';
  
  import {
    loadBlocks,
  } from '../../scripts/lib-franklin.js';
  
  /**
   * Loads a fragment.
   * @param {string} path The path to the fragment
   * @returns {HTMLElement} The root element of the fragment
   */
  async function loadFragment(path) {
    if (path && path.startsWith('/')) {
      const resp = await fetch(`${path}.plain.html`);
      if (resp.ok) {
        const main = document.createElement('main');
        main.innerHTML = await resp.text();
        decorateMain(main);
        await loadBlocks(main);
        return main;
      }
    }
    return null;
  }
  
  export default async function decorate(block) {
    const url = new URL(window.location.href);
    const showClaims = url.searchParams.get('showclaims');
    const link = block.querySelector('a');
    const path = link ? link.getAttribute('href') : block.textContent.trim();
    const fragment = await loadFragment(path);
    if (fragment) {
      //we want the content and not the extra info published in that page
      for(let i = 1;i < fragment.children.length;i++){
        if(fragment.children[i].nodeName == 'DIV'){
          fragment.children[i].remove();
        }
      }
      if (fragment) {   
        block.closest('.section').classList.add(...fragment.classList);
        if(showClaims){
          const claimSection = fragment.querySelector('.section');
          claimSection.classList.add('highlight-claim');
          const claimDataNode = document.createElement('div');
          const claimDataLinkNode = document.createElement('a');
          claimDataLinkNode.setAttribute('href',claimSection.dataset.link);
          claimDataLinkNode.innerHTML = 'Claim = '+claimSection.dataset.claim;
          claimDataNode.appendChild(claimDataLinkNode);
          claimSection.appendChild(claimDataNode);
        }
        block.closest('.claim-wrapper').replaceWith(...fragment.childNodes);
      }
    }
  }