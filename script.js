/* Interacciones ligeras. Funciona también abriendo index.html directamente. */
(() => {
  'use strict';
  const serviceContent = {
    search: { title: 'Búsqueda personalizada', intro: 'El punto de partida no es un coche cualquiera: es el coche que encaja contigo.', points: ['Definimos contigo la marca, el modelo, el presupuesto y el equipamiento que más valoras.', 'Orientamos la búsqueda en el mercado europeo según tus preferencias de kilometraje, antigüedad y acabado.', 'Te presentamos las opciones y la información disponible para que puedas compararlas antes de decidir.'], note: 'Si todavía no tienes un modelo decidido, cuéntanos qué uso le darás y qué es imprescindible para ti.' },
    inspection: { title: 'Inspección en origen', intro: 'Conocer el estado del vehículo es un paso esencial antes de continuar con la compra.', points: ['Revisamos la información disponible del vehículo y contrastamos sus características con el anuncio.', 'Coordinamos la revisión en origen para valorar su estado y detectar detalles que convenga conocer.', 'Te explicamos lo observado para que puedas tomar la decisión con más información.'], note: 'El alcance de la inspección y la documentación disponible se concretan para cada vehículo antes de realizarla.' },
    documents: { title: 'Gestión y documentación', intro: 'Te acompañamos con los trámites para traer tu coche de Europa a España.', points: ['Revisamos qué documentación acompaña al vehículo y qué pasos requiere su importación.', 'Organizamos contigo la documentación de la operación y los trámites aplicables en España.', 'Te explicamos el avance del proceso y qué información necesitamos de ti en cada momento.'], note: 'Los trámites, costes y plazos dependen del vehículo y de su origen; se concretan para tu caso antes de seguir adelante.' },
    delivery: { title: 'Entrega en España', intro: 'El último tramo del camino: que tu próximo coche llegue a tus manos.', points: ['Coordinamos el traslado desde origen y el lugar de entrega acordado en España.', 'Te mantenemos informado de la organización del transporte y la previsión de llegada.', 'Preparamos la entrega y repasamos contigo la documentación que acompaña al coche.'], note: 'La fecha, el lugar y las condiciones de entrega se acuerdan para cada operación.' }
  };
  const serviceDialog = document.querySelector('#service-dialog');
  document.querySelectorAll('[data-service]').forEach(card => {
    const button = card.querySelector('.service-open');
    const info = serviceContent[card.dataset.service];
    button.setAttribute('aria-label', `Más información: ${info.title}`);
    card.addEventListener('click', () => {
      document.querySelector('#service-title').textContent = info.title;
      document.querySelector('#service-intro').textContent = info.intro;
      document.querySelector('#service-note').textContent = info.note;
      const list = document.querySelector('#service-points'); list.replaceChildren();
      info.points.forEach(text => { const li = document.createElement('li'); li.textContent = text; list.append(li); });
      serviceDialog.showModal();
    });
  });
  serviceDialog.querySelectorAll('.service-close,.service-return').forEach(button => button.addEventListener('click', () => serviceDialog.close()));
  serviceDialog.addEventListener('click', e => { if (e.target === serviceDialog) { const r = serviceDialog.getBoundingClientRect(); if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) serviceDialog.close(); } });
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  const closeMenu = () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menú'); };
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
  if ('IntersectionObserver' in window) {
    document.body.classList.add('motion');
    const reveals = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); reveals.unobserve(entry.target); } }), { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => reveals.observe(el));
    document.querySelectorAll('.service-grid, .trust-grid').forEach(group => [...group.children].forEach((el, i) => el.style.transitionDelay = `${i * 75}ms`));
    const sections = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) nav.querySelectorAll('a').forEach(a => { const current = a.hash === `#${entry.target.id}`; a.classList.toggle('active', current); if(current) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }); }), { rootMargin: '-15% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(el => sections.observe(el));
  }
  const progress = document.querySelector('.scroll-progress');
  let queued = false;
  const updateScroll = () => { const total = document.documentElement.scrollHeight - window.innerHeight; progress.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`; queued = false; };
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(updateScroll); } }, { passive: true });
  window.addEventListener('resize', updateScroll); updateScroll();
  document.querySelectorAll('.steps details').forEach(item => item.addEventListener('toggle', () => { if (item.open) document.querySelectorAll('.steps details').forEach(other => { if (other !== item) other.open = false; }); }));
  const dialog = document.querySelector('#contact-dialog');
  const number = String(window.VELOIR_CONFIG?.whatsapp || '').replace(/\D/g, '');
  const configured = /^[1-9]\d{7,14}$/.test(number);
  document.querySelector('#send-contact').textContent = configured ? 'Continuar en WhatsApp' : 'Preparar mensaje';
  document.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', () => { dialog.showModal(); if (!configured) document.querySelector('#contact-status').textContent = 'El WhatsApp del negocio todavía no está disponible. Puedes preparar y copiar tu consulta; no se enviará desde esta página.'; }));
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const rect = dialog.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) dialog.close(); } });
  document.querySelector('#contact-form').addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const message = `Hola, Veloir Motors. Estoy buscando un ${String(data.get('model')).trim()}.\n${data.get('budget') ? `Presupuesto aproximado: ${String(data.get('budget')).trim()}.\n` : ''}${String(data.get('message')).trim()}`;
    if (configured) { window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer'); document.querySelector('#contact-status').textContent = 'Tu mensaje está preparado. Confirma el envío en WhatsApp.'; }
    else { const output = document.querySelector('#prepared-message'); output.hidden = false; output.value = message; output.focus(); output.select(); try { await navigator.clipboard.writeText(message); document.querySelector('#contact-status').textContent = 'Mensaje copiado. No se ha enviado ninguna consulta.'; } catch { document.querySelector('#contact-status').textContent = 'Mensaje preparado. Copia el texto seleccionado; no se ha enviado ninguna consulta.'; } }
  });
})();
