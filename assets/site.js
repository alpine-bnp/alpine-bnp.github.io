const menu = document.querySelector('.menu-button');
const navigation = document.querySelector('#navigation');
if (menu && navigation) {
  const openLabel = menu.textContent;
  const closeLabel = menu.dataset.closeLabel;
  const setOpen = open => {
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? closeLabel : openLabel;
    navigation.classList.toggle('is-open', open);
  };
  menu.addEventListener('click', () => setOpen(menu.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', event => {
    const anchor = event.target.closest('a');
    if (!anchor) return;
    setOpen(false);
    const destination = document.querySelector(anchor.getAttribute('href'));
    if (destination) {
      destination.setAttribute('tabindex', '-1');
      destination.focus({ preventScroll: true });
      destination.addEventListener('blur', () => destination.removeAttribute('tabindex'), { once: true });
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      menu.focus();
    }
  });
  window.matchMedia('(max-width: 760px)').addEventListener('change', () => setOpen(false));
}
