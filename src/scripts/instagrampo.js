lucide.createIcons();
document.querySelectorAll("svg").forEach(svg => {
    svg.setAttribute('width', 27)
    svg.setAttribute('height', 25)
})

var contentPosts = document.getElementById("posts");
var btnCriar = $('#btnCriar');
var modal = null;
var corpoModal = null;
var footerModal = null;


$(document).ready(function(){
    modal = new ModalJS({
        title: 'Criar novo post',
        //body: 'Carregando ...',
        theme: 'dark',
        // custom_buttons: [{}]
        close_btn_text: "Fechar",
        close_on_out_click: true,
        draggable: false,
        hide_close_btn: true,
        //onclose: function(){}
    })
})



//modal.show()
//modal.hide()

var posts = [
    {
        imagemPublicante: "src/images/meninoNey.jpeg",
        imagemPublicacao: "https://i.pinimg.com/564x/6d/03/6e/6d036e066ab0387b33323e66aa4bd29f.jpg",
        tempoPublicado: "14 min",
        publicador: "neymarjr"
    },
    {
        imagemPublicante: "src/images/ronaldo.jpeg",
        imagemPublicacao: "https://media.tenor.com/3EPeIwLRLxwAAAAM/a7.gif",
        tempoPublicado: "1 hora",
        publicador: "ronaldo"
    },
    {
        imagemPublicante: "src/images/sydney.jpeg",
        imagemPublicacao: "src/images/Posts/Sydney.jpeg",
        tempoPublicado: "50 min",
        publicador: "sydneysweeney"
    },
]

posts.forEach((post, index) => {
    contentPosts.innerHTML += `
        <div class="posts-content">
            <div class="post-header">
                <img src="${post.imagemPublicante}" alt="">
                <b><span>${post.publicador} - </span></b><span style="color: rgba(255, 255, 255, 0.7);"> &nbsp; ${post.tempoPublicado}</span>
            </div>
            <div class="image-post">
                <img src="${post.imagemPublicacao}">
            </div>
        </div>
        `
});

btnCriar.on('click', function(){
    modal.show();
    carregarElementoInputImage();
})

function carregarElementoInputImage(){
    corpoModal = $('.modaljs-modal-body');

    footerModal = $('.modaljs-modal-button');
    footerModal.remove();

    corpoModal.empty();

    corpoModal.html(`
        <div class="divInputImage">
            <img src="src/images/photos.png" class="imgPhotos">
            <span>Selecione uma imagem</span>
            <label class="btnInputImage">
                Selecionar do dispositivo
                <input class="inputImage" type="file" />
            </label>
        <div>
    `);

    
}