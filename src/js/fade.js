document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');

      // Ignora âncoras, javascript: e links que abrem em nova aba (_blank)
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('javascript:') ||
        link.target === '_blank'
      ) {
        return; // comportamento padrão para esses casos
      }

      // Verifica se é um link que deve ativar o feed + fade
      if (link.id === 'btnSobreMim' || link.id === 'btnSobre') {
        e.preventDefault();

        // Ativa o feed
        if (typeof ativarFeed === 'function') {
          try {
            ativarFeed();
          } catch (err) {
            console.error('Erro ao ativar feed:', err);
          }
        }

        // Aplica fade-out
        document.body.classList.add('fade-out');

        // Navega após o fade
        setTimeout(function () {
          window.location.assign(href);
        }, 1000);

      } else {
        // Para os outros links, navegação normal sem fade
        // Não é necessário preventDefault nem timeout
      }
    });
  });
});