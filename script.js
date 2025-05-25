// CONFIGURAÇÃO DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCo-I1P3avI_eklYTkhog75DdoU08h6Ja8",
  authDomain: "app-marmitas-template.firebaseapp.com",
  databaseURL: "https://app-marmitas-template-default-rtdb.firebaseio.com",
  projectId: "app-marmitas-template",
  storageBucket: "app-marmitas-template.appspot.com",
  messagingSenderId: "396302593735",
  appId: "1:396302593735:web:ca38c08ea93f9ab80098e2"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener("DOMContentLoaded", () => {
  const telas = document.querySelectorAll(".tela");
  const botoesNavegacao = document.querySelectorAll("nav#menu-principal button");
  const botoesVerDetalhes = document.querySelectorAll(".btn-ver-detalhes");
  const botaoVoltarCardapio = document.querySelector(".btn-voltar-cardapio");
  const botoesAdicionarCarrinho = document.querySelectorAll(".btn-adicionar-carrinho");
  const btnAdicionarDetalhe = document.querySelector(".btn-adicionar-carrinho-detalhe");

  let carrinho = [];

  // AVISO DE HORÁRIO
  const header = document.querySelector("header");
  const avisoHorario = document.createElement("p");
  avisoHorario.style.fontSize = "14px";
  avisoHorario.style.margin = "10px 0 0";
  avisoHorario.style.color = "#fff";
  avisoHorario.textContent = "Pedidos são aceitos de segunda a sábado, das 10:30 às 13:30.";
  header.appendChild(avisoHorario);

  function mostrarTela(id) {
    telas.forEach(t => t.classList.remove("ativa"));
    document.getElementById(id).classList.add("ativa");
  }

  botoesNavegacao.forEach(botao => {
    botao.addEventListener("click", () => {
      const destino = botao.getAttribute("data-tela");
      mostrarTela(destino);
    });
  });

  botoesVerDetalhes.forEach(botao => {
    botao.addEventListener("click", () => {
      const id = botao.dataset.itemid;
      preencherDetalhesItem(id);
      mostrarTela("tela-detalhes-item");
    });
  });

  if (botaoVoltarCardapio) {
    botaoVoltarCardapio.addEventListener("click", () => mostrarTela("tela-cardapio"));
  }

  // Campo de quantidade ao lado dos botões de adicionar
  botoesAdicionarCarrinho.forEach(botao => {
    botao.insertAdjacentHTML("beforebegin", `
      <input type="number" min="1" value="1" class="quantidade-input" style="width: 50px; margin-right: 5px;">
    `);
    const inputQuantidade = botao.previousElementSibling;

    botao.addEventListener("click", () => {
      const id = botao.dataset.itemid;
      const quantidade = parseInt(inputQuantidade.value) || 1;
      const item = buscarItemPorId(id);
      if (item) {
        for (let i = 0; i < quantidade; i++) carrinho.push(item);
        atualizarCarrinho();
        mostrarTela("tela-carrinho");
      }
    });
  });

  // Campo de quantidade na tela de detalhes
  const inputQtdDetalhe = document.createElement("input");
  inputQtdDetalhe.type = "number";
  inputQtdDetalhe.min = "1";
  inputQtdDetalhe.value = "1";
  inputQtdDetalhe.style = "width: 50px; margin-right: 10px;";
  btnAdicionarDetalhe.parentNode.insertBefore(inputQtdDetalhe, btnAdicionarDetalhe);

  btnAdicionarDetalhe.addEventListener("click", () => {
    const nome = document.getElementById("detalhe-nome").textContent;
    const preco = parseFloat(document.getElementById("detalhe-preco").textContent.replace("R$ ", "").replace(",", "."));
    const quantidade = parseInt(inputQtdDetalhe.value) || 1;

    for (let i = 0; i < quantidade; i++) {
      carrinho.push({ nome, preco });
    }

    atualizarCarrinho();
    mostrarTela("tela-carrinho");
  });

  function buscarItemPorId(id) {
    const itens = {
      marmitaP: { nome: "Marmita Pequena", preco: 15 },
      marmitaM: { nome: "Marmita Média", preco: 18 },
      marmitaG: { nome: "Marmita Grande", preco: 22 },
      refriLata: { nome: "Refrigerante Lata", preco: 5 },
      cerveja: { nome: "Cerveja", preco: 7 },
      agua: { nome: "Água Mineral", preco: 3 }
    };
    return itens[id] || null;
  }

  // FUNÇÃO CORRIGIDA
  function preencherDetalhesItem(id) {
    const nome = document.getElementById("detalhe-nome");
    const desc = document.getElementById("detalhe-descricao-longa");
    const preco = document.getElementById("detalhe-preco");
    const imagem = document.getElementById("detalhe-imagem");
    const ingredientes = document.getElementById("detalhe-ingredientes");

    if (id === "marmitaP") {
      nome.textContent = "Marmita Tradicional (Pequena)";
      desc.textContent = "Arroz, feijão, carne e salada.";
      preco.textContent = "R$ 15,00";
      imagem.src = "https://i.postimg.cc/gJRCtpFM/Marmita-P.jpg";
      ingredientes.textContent = "Ingredientes: Arroz, Feijão, Carne, Salada";
    } else if (id === "marmitaM") {
      nome.textContent = "Marmita Tradicional (Média)";
      desc.textContent = "Arroz, feijão, carne, acompanhamento e salada.";
      preco.textContent = "R$ 18,00";
      imagem.src = "https://i.postimg.cc/Kj2ddWmm/Marmita-M.jpg";
      ingredientes.textContent = "Ingredientes: Arroz, Feijão, Carne, Acompanhamento, Salada";
    } else if (id === "marmitaG") {
      nome.textContent = "Marmita Tradicional (Grande)";
      desc.textContent = "Arroz, feijão, duas carnes, acompanhamento e salada.";
      preco.textContent = "R$ 22,00";
      imagem.src = "https://i.postimg.cc/tRd0h9zJ/Marmita-G.jpg";
      ingredientes.textContent = "Ingredientes: Arroz, Feijão, 2 Carnes, Acompanhamento, Salada";
    }
  }

  function atualizarCarrinho() {
    const container = document.getElementById("carrinho-itens");
    container.innerHTML = "";
    let total = 0;

    if (carrinho.length === 0) {
      container.innerHTML = "<p>Seu carrinho está vazio.</p>";
    } else {
      carrinho.forEach(item => {
        const p = document.createElement("p");
        p.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
        container.appendChild(p);
        total += item.preco;
      });

      container.innerHTML += `
        <hr><h3>Finalizar Pedido</h3>
        <label>Nome: <input type="text" id="cliente-nome" required></label><br>
        <label>Tipo de Pedido:
          <select id="pedido-tipo">
            <option value="retirada">Retirada</option>
            <option value="entrega">Entrega</option>
          </select>
        </label><br>
        <div id="campo-endereco" style="display:none;">
          <label>Endereço: <input type="text" id="cliente-endereco"></label><br>
          <label>Número: <input type="text" id="cliente-numero"></label><br>
          <label>Bairro: <input type="text" id="cliente-bairro"></label><br>
          <label>Ponto de Referência: <input type="text" id="cliente-referencia"></label><br>
          <label>Celular/WhatsApp: <input type="tel" id="cliente-whatsapp"></label><br>
        </div>
        <label>Pagamento:
          <select id="cliente-pagamento">
            <option value="pix">PIX</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="cartao">Cartão</option>
          </select>
        </label><br>
        <div id="campo-troco" style="display:none;">
          <label>Troco para quanto? <input type="text" id="cliente-troco"></label><br>
        </div>
        <label>Agendar Entrega/Retirada:
          <select id="cliente-agendamento">
            <option value="agora">Agora</option>
            <option value="10:30">10:30</option>
            <option value="11:00">11:00</option>
            <option value="11:30">11:30</option>
            <option value="12:00">12:00</option>
            <option value="12:30">12:30</option>
            <option value="13:00">13:00</option>
            <option value="13:30">13:30</option>
          </select>
        </label><br>
        <small style="color:#777;">Se "Agora", o pedido será entregue/retirado assim que estiver pronto.</small><br><br>
        <button id="btn-finalizar" class="btn-principal btn-grande">Finalizar Pedido</button>
        <button id="btn-voltar" class="btn-secundario">Voltar ao Cardápio</button>
      `;

      document.getElementById("pedido-tipo").addEventListener("change", e => {
        document.getElementById("campo-endereco").style.display = e.target.value === "entrega" ? "block" : "none";
      });

      document.getElementById("cliente-pagamento").addEventListener("change", e => {
        document.getElementById("campo-troco").style.display = e.target.value === "dinheiro" ? "block" : "none";
      });

      document.getElementById("btn-finalizar").addEventListener("click", () => finalizarPedido(total));
      document.getElementById("btn-voltar").addEventListener("click", () => mostrarTela("tela-cardapio"));
    }

    document.getElementById("carrinho-total").textContent = total.toFixed(2);
  }

  function horarioValido() {
  return true; // desativa a restrição de horário só para testes
}

  function finalizarPedido(total) {
    if (!horarioValido()) {
      alert("Pedidos são aceitos apenas de segunda a sábado, das 10:30 às 13:30.");
      return;
    }

    const pedido = {
      id: `pedido_${Date.now()}`,
      data: new Date().toLocaleString("pt-BR"),
      status: "pendente",
      total: total.toFixed(2),
      itens: carrinho,
      cliente: {
        nome: document.getElementById("cliente-nome")?.value || "",
        tipo: document.getElementById("pedido-tipo")?.value || "",
        endereco: document.getElementById("cliente-endereco")?.value || "",
        numero: document.getElementById("cliente-numero")?.value || "",
        bairro: document.getElementById("cliente-bairro")?.value || "",
        referencia: document.getElementById("cliente-referencia")?.value || "",
        whatsapp: document.getElementById("cliente-whatsapp")?.value || "",
        pagamento: document.getElementById("cliente-pagamento")?.value || "",
        troco: document.getElementById("cliente-troco")?.value || "",
        agendamento: document.getElementById("cliente-agendamento")?.value || "agora"
      }
    };

    firebase.database().ref("pedidos/" + pedido.id).set(pedido)
      .then(() => {
        alert("Pedido enviado com sucesso!");
        carrinho = [];
        atualizarCarrinho();
        mostrarTela("tela-cardapio");
      })
      .catch(error => {
        alert("Erro ao enviar pedido: " + error.message);
      });
  }

  mostrarTela("tela-cardapio");
});