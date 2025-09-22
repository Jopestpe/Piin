const tela = document.getElementById("quadro");
const ctx = tela.getContext("2d");
const tipo_particula = document.getElementById("tipo_particula");

tela.style.imageRendering = "pixelated";

let particula = 1;
var ponteiro_x, ponteiro_y = 0;
var adicionando = false;
const largura = tela.width;
const altura = tela.height;
const grade = [];

const PARTICULAS = {
    0: {
        densidade: 1,
        cor: () => [0, 0, 0, 255],
        atualizar: function(y, x) {}
    },
    1: {
        densidade: 25,
        cor: () => variar_cor([222, 205, 111, 255], 10),
        atualizar: function(y, x) { atualizar_particula_queda(x,y, 25) }
    },
    2: {
        densidade: 10,
        cor: () => variar_cor([0, 100, 255, 255], 20),
        atualizar: function(y, x) { atualizar_particula_queda_agua(x,y, 10) }
    }
};

function variar_cor(base, variacao=20) {
    return [
        Math.min(255, Math.max(0, base[0] + Math.floor(Math.random()*variacao - variacao/2))),
        Math.min(255, Math.max(0, base[1] + Math.floor(Math.random()*variacao - variacao/2))),
        Math.min(255, Math.max(0, base[2] + Math.floor(Math.random()*variacao - variacao/2))),
        base[3]
    ];
}

function atualizar_particula_queda(x,y,densidade){
    if (Pprop(x,y+1,"densidade") < densidade) {
        trocar_pixel(y,x,y+1,x);
    } else {
        const dir = Math.random() < 0.5 ? -1 : 1;
        if (x+dir >= 0 && x+dir < largura 
        && Pprop(x+dir,y,"densidade") < densidade
        && Pprop(x+dir,y+1,"densidade") < densidade
        ){
            trocar_pixel(y, x, y, x+dir);
        } 
    }
}

function atualizar_particula_queda_agua(x,y,densidade){
    if (Pprop(x,y+1,"densidade") < densidade) {
        trocar_pixel(y,x,y+1,x);
    } else {
        const dir = Math.random() < 0.5 ? -1 : 1;
        if (x+dir >= 0 && x+dir < largura 
        && Pprop(x+dir,y,"densidade") < densidade
        ){
            trocar_pixel(y, x, y, x+dir);
        } 
    }
}

function criar_grade(){
    for (let y = 0; y < altura; y++) {
        grade[y] = [];
        for (let x = 0; x < largura; x++) {
            grade[y][x] = {
                tipo: 0,
                cor: PARTICULAS[0].cor()
            };
        }
    }
}

function trocar_pixel(y_origem,x_origem,y_destino,x_destino){
    let particula_destino = grade[y_destino][x_destino];
    grade[y_destino][x_destino] = grade[y_origem][x_origem];
    grade[y_origem][x_origem] = particula_destino;
}

function adicionar(x, y){
    const tipo = particula;
    grade[y][x] = {
        tipo: tipo,
        cor: PARTICULAS[tipo].cor()
    };
}

function atualizar(){
    for (let y = altura - 2; y >= 0; y--) {
        for (let x = 0; x < largura; x++) {
            PARTICULAS[grade[y][x].tipo].atualizar(y, x);
        }
    }
}

function Pprop(x,y,propriedade){
    let particula = PARTICULAS[grade[y][x].tipo];
    return particula[propriedade];
}

function desenhar(){
    const img = ctx.createImageData(largura, altura);
    for (let y = 0; y < altura; y++) {
        for (let x = 0; x < largura; x++) {
            const i = (y * largura + x) * 4;
            const celula = grade[y][x];
            if(celula !== 0){
                const cor = celula.cor;
                img.data[i]   = cor[0];
                img.data[i+1] = cor[1];
                img.data[i+2] = cor[2];
                img.data[i+3] = cor[3];
            }
        }
    }
    ctx.putImageData(img, 0, 0);
}

function repitir(){
    if(adicionando){ adicionar(ponteiro_x, ponteiro_y) }
    atualizar();
    desenhar();
    requestAnimationFrame(repitir);
}

criar_grade();
repitir();

function posicao_mouse(evento) {
    const rect = tela.getBoundingClientRect();
    const scaleX = tela.width / rect.width;
    const scaleY = tela.height / rect.height;
    ponteiro_x = Math.floor((evento.clientX - rect.left) * scaleX);
    ponteiro_y = Math.floor((evento.clientY - rect.top) * scaleY);
}

tela.addEventListener("mousedown", evento => {
    adicionando = true;
    posicao_mouse(evento);
});

tela.addEventListener("mousemove", evento => {
    posicao_mouse(evento);
});

tela.addEventListener("mouseup", () => {
    adicionando = false;
});

tela.addEventListener("mouseleave", () => {
    adicionando = false;
});

tipo_particula.addEventListener("change", () => {
    particula = parseInt(tipo_particula.value);
});

document.getElementById('reiniciar').addEventListener('click', function() {
    criar_grade();
});

