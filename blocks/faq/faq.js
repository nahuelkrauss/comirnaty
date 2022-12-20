export default function decorate(block) {
  [...block.children].forEach((row, i) => {
    const classes = ['q', 'a'];
    classes.forEach((c, j) => {
      const section = row.children[j];
      if (section) section.classList.add(`faq-${c}`);
    });
    // check if valid qa row (with both question and answer)
    const q = row.querySelector('.faq-q');
    const a = row.querySelector('.faq-a');
    if (q && a) {
      // setup q button
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.setAttribute('aria-expanded', false);
      button.setAttribute('aria-controls', `a${i + 1}`);
      button.id = `q${i + 1}`;
      button.className = q.className;
      button.innerHTML = q.innerHTML;
      q.replaceWith(button);
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !expanded);
      });
      // setup a region
      a.setAttribute('role', 'region');
      a.setAttribute('aria-labelledby', `q${i + 1}`);
      a.id = `a${i + 1}`;
    } else {
      row.remove();
    }
  });

  if (block.children.length) {
    const controls = document.createElement('div');
    controls.className = 'button-container faq-controls';
    // build expand/collapse buttons
    const buttonTypes = ['Expand', 'Collapse'];
    buttonTypes.forEach((type) => {
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.className = `faq-control faq-${type.toLowerCase()}`;
      button.innerHTML = `<p>${type} All</p> <span>${type === 'Expand' ? '+' : '-'}</span>`;
      button.addEventListener('click', () => {
        const qs = block.querySelectorAll('.faq-q');
        if (type === 'Expand') {
          qs.forEach((q) => q.setAttribute('aria-expanded', true));
        } else if (type === 'Collapse') {
          qs.forEach((q) => q.setAttribute('aria-expanded', false));
        }
      });
      controls.append(button);
    });
    block.prepend(controls);
  } else {
    block.remove(); // no valid qa pairs
  }
}
