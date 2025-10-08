// Elementos DOM
const imageUpload = document.getElementById('imageUpload');
const blendModeSelect = document.getElementById('blendMode');
const colorPicker = document.getElementById('colorPicker');
const colorText = document.getElementById('colorText');
const currentModeDisplay = document.getElementById('currentMode');
const canvasOriginal = document.getElementById('canvasOriginal');
const canvasBlended = document.getElementById('canvasBlended');
const originalPlaceholder = document.getElementById('originalPlaceholder');
const blendedPlaceholder = document.getElementById('blendedPlaceholder');
const exportBtn = document.getElementById('exportBtn');

// Estado da aplicação
let originalImage = null;
let blendMode = 'multiply';
let blendColor = '#dc0404';
let fullSizeCanvas = null; // Canvas em tamanho original para exportação

// Mapeamento de valores para labels
const modeLabels = {
    'normal': 'Normal',
    'darken': 'Darken',
    'multiply': 'Multiply',
    'colorBurn': 'Color Burn',
    'linearBurn': 'Linear Burn',
    'lighten': 'Lighten',
    'screen': 'Screen',
    'colorDodge': 'Color Dodge',
    'linearDodge': 'Linear Dodge (Add)',
    'overlay': 'Overlay',
    'softLight': 'Soft Light',
    'hardLight': 'Hard Light',
    'vividLight': 'Vivid Light',
    'linearLight': 'Linear Light',
    'pinLight': 'Pin Light',
    'hardMix': 'Hard Mix',
    'difference': 'Difference',
    'exclusion': 'Exclusion',
    'subtract': 'Subtract',
    'divide': 'Divide'
};

// Função para aplicar modo de blending
function applyBlendMode(mode, a, b) {
    a = a / 255;
    b = b / 255;
    let result = 0;

    switch(mode) {
        case 'normal':
            result = b;
            break;
        case 'darken':
            result = Math.min(a, b);
            break;
        case 'multiply':
            result = a * b;
            break;
        case 'colorBurn':
            result = b === 0 ? 0 : Math.max(0, 1 - (1 - a) / b);
            break;
        case 'linearBurn':
            result = Math.max(0, a + b - 1);
            break;
        case 'lighten':
            result = Math.max(a, b);
            break;
        case 'screen':
            result = 1 - (1 - a) * (1 - b);
            break;
        case 'colorDodge':
            result = b === 1 ? 1 : Math.min(1, a / (1 - b));
            break;
        case 'linearDodge':
            result = Math.min(1, a + b);
            break;
        case 'overlay':
            result = a < 0.5 ? 2 * a * b : 1 - 2 * (1 - a) * (1 - b);
            break;
        case 'softLight':
            result = b < 0.5 
                ? 2 * a * b + a * a * (1 - 2 * b)
                : 2 * a * (1 - b) + Math.sqrt(a) * (2 * b - 1);
            break;
        case 'hardLight':
            result = b < 0.5 ? 2 * a * b : 1 - 2 * (1 - a) * (1 - b);
            break;
        case 'vividLight':
            if (b < 0.5) {
                result = b === 0 ? 0 : Math.max(0, 1 - (1 - a) / (2 * b));
            } else {
                result = b === 1 ? 1 : Math.min(1, a / (2 * (1 - b)));
            }
            break;
        case 'linearLight':
            result = Math.max(0, Math.min(1, a + 2 * b - 1));
            break;
        case 'pinLight':
            result = b < 0.5 ? Math.min(a, 2 * b) : Math.max(a, 2 * (b - 0.5));
            break;
        case 'hardMix':
            result = a + b < 1 ? 0 : 1;
            break;
        case 'difference':
            result = Math.abs(a - b);
            break;
        case 'exclusion':
            result = a + b - 2 * a * b;
            break;
        case 'subtract':
            result = Math.max(0, a - b);
            break;
        case 'divide':
            result = b === 0 ? 1 : Math.min(1, a / b);
            break;
        default:
            result = a;
    }

    return Math.round(result * 255);
}

// Função para processar imagem em tamanho específico
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
    
    // Extrair RGB da cor de blending
    const rgb = {
        r: parseInt(blendColor.slice(1, 3), 16),
        g: parseInt(blendColor.slice(3, 5), 16),
        b: parseInt(blendColor.slice(5, 7), 16)
    };
    
    // Aplicar blending em cada pixel
    for (let i = 0; i < data.length; i += 4) {
        data[i] = applyBlendMode(blendMode, data[i], rgb.r);
        data[i + 1] = applyBlendMode(blendMode, data[i + 1], rgb.g);
        data[i + 2] = applyBlendMode(blendMode, data[i + 2], rgb.b);
    }
    
    // Colocar os pixels processados de volta
    ctx.putImageData(imageData, 0, 0);
    
    return canvas;
}

// Função para processar e exibir as imagens
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

// Event Listeners
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
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

blendModeSelect.addEventListener('change', (e) => {
    blendMode = e.target.value;
    currentModeDisplay.textContent = modeLabels[blendMode];
    processImage();
});

colorPicker.addEventListener('input', (e) => {
    blendColor = e.target.value;
    colorText.value = blendColor;
    processImage();
});

colorText.addEventListener('input', (e) => {
    const value = e.target.value;
    // Validar formato hex
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
        blendColor = value;
        colorPicker.value = blendColor;
        processImage();
    }
});

// Event listener para abrir color picker ao clicar no input
colorText.addEventListener('click', () => {
    colorPicker.click();
});

// Event listener para exportar
exportBtn.addEventListener('click', () => {
    if (!fullSizeCanvas) return;
    
    const link = document.createElement('a');
    link.download = `blending-${blendMode}-${Date.now()}.png`;
    link.href = fullSizeCanvas.toDataURL('image/png');
    link.click();
});

// Inicializar display do modo atual
currentModeDisplay.textContent = modeLabels[blendMode];