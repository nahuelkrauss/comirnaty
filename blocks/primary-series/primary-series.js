function decorateDoses(section) {
  const cols = [...section.firstElementChild.children];
  // rewrap doses cols
  cols.forEach((col) => {
    const wrapper = document.createElement('div');
    let type;
    if (col.querySelector('strong')) {
      type = 'dose';
      const num = col.innerHTML.split(' ')[0];
      col.innerHTML = col.innerHTML.replace(num, `<span>${num}</span>`);
    } else if (col.querySelector('em')) {
      type = 'days';
      col.innerHTML = col.textContent;
    }
    wrapper.className = `primary-series-doses-${type}`;
    wrapper.append(col);
    section.firstElementChild.append(wrapper);
  });
}

/**
 * loads and decorates the primary series
 * @param {Element} block The primary series block element
 */
export default async function decorate(block) {
  const sections = ['doses', 'info'];
  sections.forEach((s, i) => {
    const section = block.children[i];
    if (section) section.classList.add(`primary-series-${s}`);
  });

  const doses = block.querySelector('.primary-series-doses');
  if (doses) decorateDoses(doses);
}
