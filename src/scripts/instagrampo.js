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
var modalElement = null;

var inputImagem = null;
let originalImage = null;


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
        onclose: function(){
            modalElement.first().get(0).style.setProperty("width", "370px", "important");
        }
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
    modalElement = $('.modaljs-modal');
    carregarElementoInputImage();
})

function limparCorpoModal(){
    corpoModal.empty();
}

function carregarElementoInputImage(){
    corpoModal = $('.modaljs-modal-body');

    footerModal = $('.modaljs-modal-button');
    footerModal.remove();

    limparCorpoModal();

    corpoModal.html(`
        <div class="divInputImage">
            <img src="src/images/photos.png" class="imgPhotos">
            <span>Selecione uma imagem</span>
            <label class="btnInputImage">
                Selecionar do dispositivo
                <input class="inputImage" type="file" accept=".jpg, .jpeg, .png" />
            </label>
        <div>
    `);
    
    inputImagem = $('.inputImage');

    inputImagem.on('change', function(e){
        const file = e.target.files[0];
        console.log(file)

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    originalImage = img;
                    processImage();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }


        limparCorpoModal();
        modalElement.first().get(0).style.setProperty("width", "700px", "important");
        corpoModal.html(`
            <div id="contentModalFilter">
                <div id="visualizacaoImagem">
                    <img src="src/images/photos.png">
                </div>
                <div id="filtrosContainer">
                    <div class="filtro">
                        <img src="src/images/filtrosInstagram/Aden.jpg" alt="Filtro Aden">
                        <p>Aden</p>
                    </div>
                    <div class="filtro">
                        <img src="src/images/filtrosInstagram/Clarendon.jpg" alt="Filtro Clarendon">
                        <p>Clarendon</p>
                    </div>
                    <div class="filtro">
                        <img src="src/images/filtrosInstagram/Crema.jpg" alt="Filtro Crema">
                        <p>Crema</p>
                    </div>
                    <div class="filtro">
                        <img src="src/images/filtrosInstagram/Gingham.jpg" alt="Filtro Gingham">
                        <p>Gingham</p>
                    </div>
                    <div class="filtro">
                        <img src="src/images/filtrosInstagram/Juno.jpg" alt="Filtro Juno">
                        <p>Juno</p>
                    </div>
                    <div class="filtro">
                        <img src="src/images/filtrosInstagram/Lark.jpg" alt="Filtro Lark">
                        <p>Lark</p>
                    </div>
                    <div class="filtro">
                        <img src="src/images/filtrosInstagram/Ludwig.jpg" alt="Filtro Ludwig">
                        <p>Ludwig</p>
                    </div>
                    <div class="filtro">
                        <img src="src/images/filtrosInstagram/Moon.jpg" alt="Filtro Moon">
                        <p>Moon</p>
                    </div>
                    <div class="filtro">
                        <img src="src/images/filtrosInstagram/Normal.jpg" alt="Filtro Normal">
                        <p>Original</p>
                    </div>
                    <div class="filtro">
                        <img src="src/images/filtrosInstagram/Perpetua.jpg" alt="Filtro Perpetua">
                        <p>Perpetua</p>
                    </div>
                    <div class="filtro">
                        <img src="src/images/filtrosInstagram/Reyes.jpg" alt="Filtro Reyes">
                        <p>Reyes</p>
                    </div>
                    <div class="filtro">
                        <img src="src/images/filtrosInstagram/Slumber.jpg" alt="Filtro Slumber">
                        <p>Slumber</p>
                    </div>
                </div>
            </div>
        `)
    });
}


function processImage() {
    if (!originalImage) return;

    const ctxOriginal = canvasOriginal.getContext('2d');
    const ctxBlended = canvasBlended.getContext('2d');

    // Calcular dimensões para preview (mantendo aspect ratio)
    const maxWidth = 400;
    const maxHeight = 400;
    let previewWidth = originalImage.width;
    let previewHeight = originalImage.height;

    if (previewWidth > maxWidth || previewHeight > maxHeight) {
        const ratio = Math.min(maxWidth / previewWidth, maxHeight / previewHeight);
        previewWidth = Math.floor(previewWidth * ratio);
        previewHeight = Math.floor(previewHeight * ratio);
    }

    // Configurar canvas de preview
    canvasOriginal.width = previewWidth;
    canvasOriginal.height = previewHeight;
    canvasBlended.width = previewWidth;
    canvasBlended.height = previewHeight;

    // Desenhar preview da imagem original
    ctxOriginal.drawImage(originalImage, 0, 0, previewWidth, previewHeight);
    
    // Processar preview com blending
    const previewBlended = processImageAtSize(originalImage, previewWidth, previewHeight);
    ctxBlended.drawImage(previewBlended, 0, 0);
    
    // Processar imagem em tamanho ORIGINAL para exportação
    fullSizeCanvas = processImageAtSize(originalImage, originalImage.width, originalImage.height);

    // Mostrar canvas e esconder placeholders
    canvasOriginal.classList.add('active');
    canvasBlended.classList.add('active');
    originalPlaceholder.classList.add('hidden');
    blendedPlaceholder.classList.add('hidden');
    exportBtn.classList.remove('hidden');
}