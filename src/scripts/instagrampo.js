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
let canvasBlended = null;
let modoSelecionado = "normal";


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

function nhonho(){
    som = new Audio('/src/AICHAVES.mp3');
    som.play();
    som = null;
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

        limparCorpoModal();
        modalElement.first().get(0).style.setProperty("width", "700px", "important");
        corpoModal.html(`
            <div id="contentModalFilter">
                <div id="visualizacaoImagem">
                    <canvas id="canvasBlended" class="canvas"></canvas>
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
        
        $('.filtro').on('click', function(){
            modoSelecionado = $(this).children().eq(1).text().toLowerCase();
            processImage();
        });

        canvasBlended = document.getElementById('canvasBlended');

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
    });
}

const presetColors = {
    aden: "#FAE2D0",
    clarendon: "#F0F0FF",
    crema: "#FFD8A8",
    gingham: "#E0D6FF",
    juno: "#FFE8E0",
    lark: "#E6F0FF",
    ludwig: "#FFF0E0",
    moon: "#D0D0D0",
    perpetua: "#CDE4FF",
    reyes: "#FFD8D0",
    slumber: "#F4E8E0",
    normal: "#FFFFFF"
};


function processImageAtSize(img, targetWidth, targetHeight) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    // Desenhar imagem
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    
    // Obter dados dos pixels
    const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const data = imageData.data;
    
    let baseColor = presetColors["aden"] || "#FFFFFF";

    const rgb = {
        r: parseInt(baseColor.slice(1, 3), 16),
        g: parseInt(baseColor.slice(3, 5), 16),
        b: parseInt(baseColor.slice(5, 7), 16)
    };
    

    // Aplicar blending com a cor fixa

    

    if(modoSelecionado == "clarendon"){
        for (let i = 0; i < data.length; i += 4) {
            data[i] = applyBlendMode(modoSelecionado, data[i], 105);
            data[i + 1] = applyBlendMode(modoSelecionado, data[i + 1], 145);
            data[i + 2] = applyBlendMode(modoSelecionado, data[i + 2], 175);
        }
    }
    else if(modoSelecionado == "crema"){
        for (let i = 0; i < data.length; i += 4) {
            data[i] = applyBlendMode(modoSelecionado, data[i], 125);
            data[i + 1] = applyBlendMode(modoSelecionado, data[i + 1], 127);
            data[i + 2] = applyBlendMode(modoSelecionado, data[i + 2], 118);
        }
    }
    else if(modoSelecionado == "gingham"){
        for (let i = 0; i < data.length; i += 4) {
            data[i] = applyBlendMode(modoSelecionado, data[i], 39);
            data[i + 1] = applyBlendMode(modoSelecionado, data[i + 1], 37);
            data[i + 2] = applyBlendMode(modoSelecionado, data[i + 2], 37);
        }
    }
    else if(modoSelecionado == "juno"){
        for (let i = 0; i < data.length; i += 4) {
            data[i] = applyBlendMode(modoSelecionado, data[i], 149);
            data[i + 1] = applyBlendMode(modoSelecionado, data[i + 1], 167);
            data[i + 2] = applyBlendMode(modoSelecionado, data[i + 2], 153);
        }
    }
    else if(modoSelecionado == "lark"){
        for (let i = 0; i < data.length; i += 4) {
            data[i] = applyBlendMode(modoSelecionado, data[i], 46);
            data[i + 1] = applyBlendMode(modoSelecionado, data[i + 1], 46);
            data[i + 2] = applyBlendMode(modoSelecionado, data[i + 2], 46);
        }
    }
    else if(modoSelecionado == "ludwig"){
        for (let i = 0; i < data.length; i += 4) {
            data[i] = applyBlendMode(modoSelecionado, data[i], 165);
            data[i + 1] = applyBlendMode(modoSelecionado, data[i + 1], 136);
            data[i + 2] = applyBlendMode(modoSelecionado, data[i + 2], 136);
        }
    }
    else if(modoSelecionado == "moon"){
        for (let i = 0; i < data.length; i += 4) {
            data[i] = applyBlendMode(modoSelecionado, data[i], 39);
            data[i + 1] = applyBlendMode(modoSelecionado, data[i + 1], 37);
            data[i + 2] = applyBlendMode(modoSelecionado, data[i + 2], 37);
        }
    }
    else if(modoSelecionado == "reyes"){
        for (let i = 0; i < data.length; i += 4) {
            data[i] = applyBlendMode(modoSelecionado, data[i], 62);
            data[i + 1] = applyBlendMode(modoSelecionado, data[i + 1], 60);
            data[i + 2] = applyBlendMode(modoSelecionado, data[i + 2], 45);
        }
    }
    else if(modoSelecionado == "perpetua"){
        for (let i = 0; i < data.length; i += 4) {
            data[i] = applyBlendMode(modoSelecionado, data[i], 101);
            data[i + 1] = applyBlendMode(modoSelecionado, data[i + 1], 131);
            data[i + 2] = applyBlendMode(modoSelecionado, data[i + 2], 139);
        }
    }
    else if(modoSelecionado == "slumber"){
        for (let i = 0; i < data.length; i += 4) {
            data[i] = applyBlendMode(modoSelecionado, data[i], 174);
            data[i + 1] = applyBlendMode(modoSelecionado, data[i + 1], 180);
            data[i + 2] = applyBlendMode(modoSelecionado, data[i + 2], 151);
        }
    }
    else{
        for (let i = 0; i < data.length; i += 4) {
            data[i] = applyBlendMode(modoSelecionado, data[i], data[i]);
            data[i + 1] = applyBlendMode(modoSelecionado, data[i + 1], data[i+1]);
            data[i + 2] = applyBlendMode(modoSelecionado, data[i + 2], data[i+2]);
        }
    }
    

    
    // Colocar os pixels processados de volta
    ctx.putImageData(imageData, 0, 0);
    
    return canvas;
}


function processImage() {
    if (!originalImage) return;

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
    canvasBlended.width = previewWidth;
    canvasBlended.height = previewHeight;
    
    // Processar preview com blending
    const previewBlended = processImageAtSize(originalImage, previewWidth, previewHeight);
    ctxBlended.drawImage(previewBlended, 0, 0);
    
    // Processar imagem em tamanho ORIGINAL para exportação
    fullSizeCanvas = processImageAtSize(originalImage, originalImage.width, originalImage.height);

    // Mostrar canvas e esconder placeholders
    canvasBlended.classList.add('active');
}

function applyBlendMode(mode, a, b) {
    a = a / 255;
    b = b / 255;
    let result = 0;

    canvasBlended.style.filter = 'grayscale(0%)';
    switch(mode) {
        case 'normal': 
            result = b;
            break;
        case 'clarendon': 
             result = (a < 0.8) 
                ? 2 * a * b 
                : 1 - 2 * (1 - a) * (1 - b);
            result = Math.pow(result, 1.20); 
            break;
        case 'crema': 
            result = b < 0.5 ? 2 * a * b : 1 - 2 * (1 - a) * (1 - b);
            break;
        case 'gingham': 
            result = Math.min(1, a + b);
            break;
        case 'moon':
            result = Math.max(a, b);
            canvasBlended.style.filter = 'grayscale(100%)';
            break;
        case 'lark': 
            result = b === 1 ? 1 : Math.min(1, a / (1 - b));
            break;
        case 'reyes': 
            result = Math.min(1, a + b);
            break;
        case 'juno': 
            result = a < 0.5 ? 2 * a * b : 1 - 2 * (1 - a) * (1 - b);
            break;
        case 'slumber': 
            result = b < 0.5 
                ? 2 * a * b + a * a * (1 - 2 * b)
                : 2 * a * (1 - b) + Math.sqrt(a) * (2 * b - 1);
            break;
        case 'ludwig': 
            result = a < 0.5 ? 2 * a * b : 1 - 2 * (1 - a) * (1 - b);
            break;
        case 'aden': 
            result = Math.pow(a, 0.96) * 0.88 + 0.05; 
            break;
        case 'perpetua': 
            result = b < 0.5 
                ? 2 * a * b + a * a * (1 - 2 * b)
                : 2 * a * (1 - b) + Math.sqrt(a) * (2 * b - 1);
            break;
        default: 
            result = b;
            break;
    }

    return Math.round(result * 255);
}