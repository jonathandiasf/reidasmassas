/* Copyright 2025 O Rei das Massas */

document.addEventListener('DOMContentLoaded', () => {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const listaCarrinho = document.getElementById('lista-carrinho');
  const listaCarrinhoResumo = document.getElementById('lista-carrinho-resumo');
  const totalEl = document.getElementById('total');
  const totalResumoEl = document.getElementById('total-resumo');
  const telefoneRestaurante = '5531993390836';

  // Formata valores para moeda BR
  const formatarMoeda = valor => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }

  function atualizarCarrinho() {
    // Calcula total uma vez
    let total = carrinho.reduce((sum, item) => sum + item.preco, 0);

    // Atualiza carrinho principal (página index)
    if (listaCarrinho) {
      listaCarrinho.innerHTML = '';

      if (carrinho.length === 0) {
        listaCarrinho.innerHTML = '<li>Carrinho vazio 🛒</li>';
      } else {
        carrinho.forEach((item, index) => {
          const li = document.createElement('li');

          // Nome e preço
          const textoItem = document.createElement('span');
          textoItem.textContent = `${item.nome} - ${formatarMoeda(item.preco)}`;

          // Botão remover
          const botaoRemover = document.createElement('button');
          botaoRemover.textContent = '✖';
          botaoRemover.classList.add('remover-item');
          botaoRemover.addEventListener('click', () => {
            carrinho.splice(index, 1);
            salvarCarrinho();
            atualizarCarrinho();
          });

          li.appendChild(textoItem);
          li.appendChild(botaoRemover);
          listaCarrinho.appendChild(li);
        });
      }
    }

    // Atualiza carrinho resumo (página extras)
    if (listaCarrinhoResumo) {
      listaCarrinhoResumo.innerHTML = '';

      if (carrinho.length === 0) {
        listaCarrinhoResumo.innerHTML = '<li>Carrinho vazio 🛒</li>';
      } else {
        carrinho.forEach((item) => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span>${item.nome}</span>
            <span>${formatarMoeda(item.preco)}</span>
          `;
          listaCarrinhoResumo.appendChild(li);
        });
      }
    }

    // Atualiza totais
    if (totalEl) totalEl.textContent = formatarMoeda(total);
    if (totalResumoEl) totalResumoEl.textContent = formatarMoeda(total);
  }

  function adicionarItem(nome, preco) {
    carrinho.push({ nome, preco });
    salvarCarrinho();
    atualizarCarrinho();
  }

  function finalizarPedido() {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    let mensagem = 'Olá, gostaria de fazer o seguinte pedido:\n';
    carrinho.forEach(item => {
      mensagem += `• ${item.nome} - ${formatarMoeda(item.preco)}\n`;
    });
    mensagem += `\nTotal: ${totalEl.textContent}`;

    const link = `https://wa.me/${telefoneRestaurante}?text=${encodeURIComponent(mensagem)}`;
    window.open(link, '_blank');
  }

  // Adiciona eventos aos botões de "Adicionar"
  document.querySelectorAll('.btn-adicionar').forEach(btn => {
    btn.addEventListener('click', () => {
      const nome = btn.dataset.nome;
      const preco = parseFloat(btn.dataset.preco);
      adicionarItem(nome, preco);
    });
  });

  // Adiciona eventos aos botões de "Adicionar Extra"
  document.querySelectorAll('.btn-adicionar-extra').forEach(btn => {
    btn.addEventListener('click', () => {
      const nome = `Extra: ${btn.dataset.nome}`;
      const preco = parseFloat(btn.dataset.preco);
      adicionarItem(nome, preco);

      // Efeito visual de confirmação
      btn.style.background = '#4CAF50';
      btn.textContent = 'Adicionado!';
      setTimeout(() => {
        btn.style.background = '#fdd835';
        btn.textContent = 'Adicionar';
      }, 1000);
    });
  });

  // Botão de finalizar pedido
  document.getElementById('finalizar-pedido')?.addEventListener('click', finalizarPedido);

  // ===== MENU MOBILE CORRIGIDO =====
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      menu.classList.toggle('active');

      // Muda o ícone do hambúrguer
      if (menu.classList.contains('active')) {
        menuToggle.innerHTML = '✖';
        menuToggle.setAttribute('aria-label', 'Fechar menu');
      } else {
        menuToggle.innerHTML = '&#9776;';
        menuToggle.setAttribute('aria-label', 'Abrir menu');
      }
    });

    // Fecha menu ao clicar em link
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        menuToggle.innerHTML = '&#9776;';
        menuToggle.setAttribute('aria-label', 'Abrir menu');
      });
    });

    // Fecha menu ao clicar fora dele
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
        menu.classList.remove('active');
        menuToggle.innerHTML = '&#9776;';
        menuToggle.setAttribute('aria-label', 'Abrir menu');
      }
    });
  }

  // Inicializa carrinho
  atualizarCarrinho();
});