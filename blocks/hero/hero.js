export default function decorate(block) {
  const sections = ['image', 'text'];
  sections.forEach((section, i) => {
    if (block.children[i]) block.children[i].classList.add(`hero-${section}`);
  });

  const text = block.querySelector('.hero-text');
  if (text) {
    const pictures = text.querySelectorAll('picture');
    pictures.forEach((picture) => {
      const p = picture.closest('p');
      p.className = 'picture-wrapper';
    });

    const asterisks = [...text.querySelectorAll('p')].filter((p) => p.textContent.startsWith('*'));
    asterisks.forEach((asterisk) => {
      asterisk.innerHTML = asterisk.innerHTML.replace('*', '');
      asterisk.classList.add('asterisk');
    });
  }
}
