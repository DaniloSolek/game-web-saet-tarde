console.log('game.js loaded');

const canvas = document.querySelector('#game');
const contexto = canvas.getContext('2d');

var playerImage = new Image();
playerImage.src = "./images/bird-asa-baixo.png";

var chaoImage = new Image();
chaoImage.src = "./images/chao.png";

var fundoImage = new Image();
fundoImage.src = "./images/fundo.png";

var canoChaoImage = new Image();
canoChaoImage.src = "./images/cano-chao.png";

var canoCeuImage = new Image();
canoCeuImage.src = "./images/cano-ceu.png";

var gameoverImage = new Image();
gameoverImage.src = "./images/game-over.png";

var player = {
    x:50,
    y:50,
    altura:24,
    largura:32,
    velocidade:0,
    gravidade:0.3,
    desenha(){
            contexto.drawImage(playerImage, this.x, this.y);
    },
    atualiza(){
        this.velocidade = this.velocidade + this.gravidade;
        this.y = this.y + this.velocidade;
    },
    pula(){
        this.velocidade = -5;
    }
}

var chao = {
    x:0,
    y:368,
    desenha(){
        contexto.drawImage(chaoImage, this.x, this.y);
        contexto.drawImage(chaoImage, this.x+224, this.y);
    },
    atualiza(){

    }
}

var fundo = {
    x:0,
    y:164,
    desenha(){
        contexto.drawImage(fundoImage, this.x, this.y);
        contexto.drawImage(fundoImage, this.x+276, this.y);
    },
    atualiza(){

    }
}

function newCano(){
    var cano = {
        x:250,
        y:0,
        largura:52,
        altura:400,
        espaco:100,
        marginMin:140,
        marginPerc:(Math.random()*1.5) + 1,
        desenha(){
            margin = this.marginMin * this.marginPerc;
            contexto.drawImage(canoCeuImage, this.x, this.y - this.margin);
            contexto.drawImage(canoChaoImage, this.x, this.y + this.altura - this.margin + this.espaco);
        },
        atualiza(){
            this.x = this.x - 1;
        }
    }
    return cano;
}

function removeCano(){
    canoLista.forEach(cano => {
        if(cano.x <= -52){
            canoLista.shift();  
        }
    })
}

let frame = 0;
let canoLista = [];

function criaCanos(frame){
    if(frame % 150 == 0){
        canoLista.push(newCano())
    }
    canoLista.forEach(cano => {
        cano.desenha()
        cano.atualiza()
    })
}

function colisaoChao(){
    if(player.y + player.altura >= chao.y){
        telaAtiva = telaGameOver;
    }
}

function colisaoCano(){
    var frentePlayer = player.x + player.largura;
    var atrasPlayer = player.x;
    var topoPlayer = player.y;
    var baixoPlayer = player.y + player.altura;

    var temColisao = canoLista.some(cano => {
        if(frentePlayer >= cano.x && atrasPlayer < cano.x + cano.largura){
            var margin = cano.marginMin * cano.marginPerc;
            var alturaEspaco = cano.altura + cano.y - margin;
            if(topoPlayer >= alturaEspaco && baixoPlayer < alturaEspaco + cano.espaco){
                return false;
            }
            return true;
        }
    })

    if(temColisao){
        telaAtiva = telaGameOver;
    }
}

var telaJogo = {
    desenha(frame){
        fundo.desenha()
        criaCanos(frame);
        canoLista.forEach((cano)=>{
            cano.desenha();
            cano.atualiza();
        })
        removeCano();
        chao.desenha()
        player.desenha()
    },
    atualiza(frame){
        player.atualiza()
    }
}

var telaInicio = {
    desenha(frame){

    },
    atualiza(frame){

    }
}

var telaGameOver = {
    desenha(frame){
        fundo.desenha()
        chao.desenha()
        gameover.desenha()
    },
    atualiza(frame){

    }
}

var telaAtiva = telaJogo;

var gameover = {
    x:50,
    y:100,
    desenha(){
        contexto.drawImage(gameoverImage, this.x, this.y);
    }
}

function loop(){
    frame++
    contexto.clearRect(0,0,320,480)
    colisaoChao()
    colisaoCano()
    telaAtiva.desenha(frame)
    telaAtiva.atualiza(frame)
    requestAnimationFrame(loop)
}

loop();

document.addEventListener("keypress", function(event){
    if(event.key == " "){
        player.pula()
    }
})