$(document).ready(function () {
    cardapio.eventos.init();
    //     console.log('Ola turma')
})

var cardapio = {};
var MEU_CARRINHO = [];

cardapio.eventos = {

    init: () => {
        // console.log('iniciou')
        cardapio.metodos.obterItensCardapio();
    }
}

cardapio.metodos = {

    //obtem a lista de itens do cardápio
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {
        var filtro = MENU[categoria]
        console.log(filtro)
        if (!vermais) {
            $("#itensCardapio").html('')
            $("#btnVerMais").removeClass('hidden');
        }
        //$("#itensCardapio").html('')

        $.each(filtro, (i, e) => {
            console.log(e.name);
            // let temp = cardapio.templates.item;
            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${id}/g, e.id)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))

            //botão ver mais foi clicado (12 itens)
            if (vermais && i >= 8 && i < 12) {
                $("#itensCardapio").append(temp)
            }
            //paginação inicial (8 itens)
            if (!vermais && i < 8) {
                $("#itensCardapio").append(temp)
            }
            // $("#itensCardapio").append(temp)
        })

        //remove o ativo
        $(".container-menu a").removeClass('active');

        //seta o menu para ativo
        $("#menu-" + categoria).addClass('active')

    },

    //clique no botão ver mais
    verMais: () => {
        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1]; // [menu-][burgers]
        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass('hidden');
    },

    diminuirQuantidade: (id) => {
        let qntdAtual = parseInt($('#qntd-carrinho-' + id).text())
        if (qntdAtual > 0) {
            $('#qntd-carrinho-' + id).text(qntdAtual - 1)
        }
    },

    aumentarQuantidade: (id) => {
        let qntdAtual = parseInt($('#qntd-carrinho-' + id).text())
        $('#qntd-carrinho-' + id).text(qntdAtual + 1)
    },

    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {

            //obter a categoria ativ
            var categoria = $(".container-menu").attr('id').split('menu-')[1];
            ///obtem a lista de itens
            let filtro = MENU[categoria];
            //obtem o item
            let item = $.grep(filtro, (e, i) => { return e.id == id });


            if (item.lenght > 0) {
                //validar se já existe item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id });
                //caso já exista o item no carrinho, só altera a quantidade
                if(existe.lenght >0){
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id ==id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }
                //caso não exista o item no carrinho, adiciona ele
                else{
                    item[0].qntd= qntdAtual;
                    MEU_CARRINHO.push(item[0])
                }
            }

        }
    },

    //atualiza o badge de totais dos botões "Meu carrinho"
    atualizarBadgeTotal:() =>{
        var total = 0;

        $.each(MEU_CARRINHO, (i,e) => {
            total += e.qntd
        })
        if (total > 0){
            $("botao-carrinho").removeClass('hidden')
            $(".container-total-carrinho").addClass('hidden');
        }
        else{
            $(".botao-carrinho").addClass('hidden')
            $(".container-total-carrinho").html(total);
        }
        $(".badge-total-carrinho").html(total);
    }

}

cardapio.templates = {
    item: `
    <div class="col-3 mb-5">
        <div class="card card-item" id="\${id}">
        <div class="img-produto">
            <img src="\${img}" />
        </div>
        <p class="title-produto text-center mt-4">
            <b>\${name}</b>
        </p>
        <p class="price-produto text-center">
            <b>R$ \${price}</b>
        </p>

        <div class="add-carrinho">
            <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
            <span class="btn-numero-itens" id="qntd-carrinho-\${id}">0</span>
            <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
            <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
        </div>
        </div>
    </div>`

}