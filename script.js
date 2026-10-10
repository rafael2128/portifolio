
document.addEventListener("DOMContentLoaded", function () {
    const alternarTema = document.getElementById("alternarTema");
    const botaoMenu = document.getElementById("botaoMenu");
    const menu = document.getElementById("menu");
    const anoAtual = document.getElementById("anoAtual");

    if (anoAtual) {
        anoAtual.textContent = new Date().getFullYear();
    }

    // Mantém o tema escolhido pelo visitante.
    const temaSalvo = localStorage.getItem("tema-portfolio");

    if (temaSalvo === "claro") {
        document.body.classList.add("tema-claro");
    }

    function atualizarBotaoTema() {
        if (!alternarTema) return;

        const temaClaro = document.body.classList.contains("tema-claro");

        alternarTema.textContent = temaClaro ? "☾" : "☼";
        alternarTema.setAttribute(
            "aria-label",
            temaClaro ? "Ativar tema escuro" : "Ativar tema claro"
        );
    }

    atualizarBotaoTema();

    alternarTema.addEventListener("click", function () {
        document.body.classList.toggle("tema-claro");

        const temaClaro = document.body.classList.contains("tema-claro");

        localStorage.setItem(
            "tema-portfolio",
            temaClaro ? "claro" : "escuro"
        );

        atualizarBotaoTema();
    });

    // Abre e fecha o menu em telas menores.
    botaoMenu.addEventListener("click", function () {
        const aberto = menu.classList.toggle("aberto");

        botaoMenu.setAttribute("aria-expanded", String(aberto));
        botaoMenu.setAttribute(
            "aria-label",
            aberto ? "Fechar menu" : "Abrir menu"
        );

        botaoMenu.textContent = aberto ? "×" : "☰";
    });

    menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            menu.classList.remove("aberto");
            botaoMenu.setAttribute("aria-expanded", "false");
            botaoMenu.setAttribute("aria-label", "Abrir menu");
            botaoMenu.textContent = "☰";
        });
    });

    // Destaca no menu a seção que está sendo visualizada.
    const secoes = document.querySelectorAll("main section[id]");
    const linksMenu = menu.querySelectorAll('a[href^="#"]');

    if ("IntersectionObserver" in window) {
        const observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (!entrada.isIntersecting) return;

                linksMenu.forEach(function (link) {
                    link.classList.toggle(
                        "ativo",
                        link.getAttribute("href") === "#" + entrada.target.id
                    );
                });
            });
        }, {
            rootMargin: "-35% 0px -55% 0px"
        });

        secoes.forEach(function (secao) {
            observador.observe(secao);
        });
    }

    // Exibe os detalhes dos projetos em uma janela.
    const janelaProjeto = document.getElementById("janelaProjeto");
    const tituloJanela = document.getElementById("tituloJanela");
    const descricaoJanela = document.getElementById("descricaoJanela");
    const tecnologiasJanela = document.getElementById("tecnologiasJanela");

    document.querySelectorAll(".botao-detalhes").forEach(function (botao) {
        botao.addEventListener("click", function () {
            tituloJanela.textContent = botao.dataset.titulo;
            descricaoJanela.textContent = botao.dataset.descricao;
            tecnologiasJanela.textContent = botao.dataset.tecnologias;

            janelaProjeto.showModal();
        });
    });

    function fecharJanela() {
        if (janelaProjeto.open) {
            janelaProjeto.close();
        }
    }

    document.getElementById("fecharJanela").addEventListener("click", fecharJanela);
    document.getElementById("concluirJanela").addEventListener("click", fecharJanela);

    janelaProjeto.addEventListener("click", function (evento) {
        if (evento.target === janelaProjeto) {
            fecharJanela();
        }
    });

    // Formata o telefone enquanto o visitante digita.
    const telefone = document.getElementById("telefone");

    telefone.addEventListener("input", function () {
        let numeros = telefone.value.replace(/\D/g, "").slice(0, 11);

        if (numeros.length > 10) {
            numeros = numeros.replace(
                /^(\d{2})(\d{5})(\d{0,4}).*/,
                function (_, ddd, parte1, parte2) {
                    return "(" + ddd + ") " + parte1 +
                        (parte2 ? "-" + parte2 : "");
                }
            );
        } else if (numeros.length > 6) {
            numeros = numeros.replace(
                /^(\d{2})(\d{4})(\d{0,4}).*/,
                function (_, ddd, parte1, parte2) {
                    return "(" + ddd + ") " + parte1 +
                        (parte2 ? "-" + parte2 : "");
                }
            );
        } else if (numeros.length > 2) {
            numeros = numeros.replace(/^(\d{2})(\d*)/, "($1) $2");
        } else if (numeros.length > 0) {
            numeros = "(" + numeros;
        }

        telefone.value = numeros;
    });

    // Valida o formulário. O envio real exige um servidor ou serviço de formulários.
    const formulario = document.getElementById("formularioContato");
    const retorno = document.getElementById("retornoFormulario");

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        retorno.className = "retorno-formulario";

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();

        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!nome || !email || !mensagem) {
            retorno.textContent =
                "Preencha seu nome, e-mail e mensagem antes de continuar.";
            retorno.classList.add("erro");
            return;
        }

        if (!emailValido) {
            retorno.textContent = "Confira o formato do e-mail informado.";
            retorno.classList.add("erro");
            return;
        }

        retorno.textContent =
            "Tudo certo! Esta é uma demonstração: a mensagem não foi enviada.";
        retorno.classList.add("sucesso");
    });
});
