//import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js'

const firebaseConfig = {
  apiKey: "AIzaSyBl0bv-_A2e1YbDWnj6kzKRSRE7Re9Zk8s",
  authDomain: "nft-generator-cc796.firebaseapp.com",
  projectId: "nft-generator-cc796",
  storageBucket: "nft-generator-cc796.appspot.com",
  messagingSenderId: "662280302227",
  appId: "1:662280302227:web:d2a8ea3b8ec042779de766"
};

firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();
var storageRef = firebase.storage().ref();
//const db = getFirestore(app);
//var storageRef = firebase.storage();

//const fs = require("fs");
//const myArgs = process.argv.slice(2);
//const {loadImage } = require("canvas");
//const console = require("console");

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var edition = document.getElementById("totalNFT").value; //Cantidad de imagenes a crear
var nombreColeccion = document.getElementById("coleccionNombre").value;
var metadata = [];
var attributes = [];
var hash = [];
var rarity_element = [];
var promedio_rareza = 0;
var rareza_total;
var cant=0;
var empezarDesde = 0;  //Numero incial de edicion
var borrar = false;
var login = false;

empezarDesde = empezarDesde - 1; //NO CAMBIAR

var input_layer = document.getElementById("inputLayer");
var layerCounter = parseInt(input_layer.value);
const layerImages = [];
var layersImg = [];
var NFTlisto;
var sinImagen = 0;

function aleatorizar()
{
  edition = document.getElementById("totalNFT").value;
  nombreColeccion = document.getElementById("coleccionNombre").value;
  if(nombreColeccion == "" || nombreColeccion == " ")
  {
    window.alert("Please enter a collection name");
  }
  else{
  if(edition > 0 && edition <= 10000)
  {
    if(layerCounter>=1)
    {
    ctx.clearRect(0,0,350,350);
    //GUARDAR IMAGENES
    for( let i=0; i<=layerCounter-1; i++)
    {
        let idInputLayer = "imageLayer" + ((i+1).toString());
        let inputImgLayer = document.getElementById(idInputLayer);
        layersImg[i] = [];

        if(inputImgLayer.files.length>=1)
        {
          sinImagen = 0;
          for( let j=0; j<inputImgLayer.files.length; j++)
          {
              var fReader = new FileReader();
              layersImg[i][j] = new Image();
              
              fReader.onloadend = function(event)
              {
                  layersImg[i][j].src = event.target.result;
              }
              if (inputImgLayer.files[j]) {
                  fReader.readAsDataURL(inputImgLayer.files[j]);
                }
  
          }
        }
        else
        {
          sinImagen = 1;
          window.alert("Please upload at least 1 image per layer");
          break;
        }

    }
      if(sinImagen == 0)
      {
          NFTlisto = new Image();
          for(let j=0; j<=layerCounter; j++)
          {
            drawLayer(j, edition);
          }
          console.log("Creando edicion " + edition);
      }
    
      }
      else
      {
          window.alert("Please create at least 1 layer");
      }
  }
  else
  {
    window.alert("Please enter a valid amount of total NFTs (1-10000)");
  }
  }
}

const drawLayer = async (_layer, _edition) => {

    let idInputLayer = "imageLayer" + ((_layer+1).toString());
    let inputImgLayer = document.getElementById(idInputLayer);

    if(_layer != layerCounter)
    {
      let numAleatorio = Math.floor(Math.random() * (inputImgLayer.files.length - 0)); //Entre 0 Y la cantidad de fotos total
      let element = layersImg[_layer][numAleatorio];
      ctx.globalCompositeOperation = 'source-over';
      console.log("Cargando "+ _edition);
      //ctx.globalCompositeOperation = 'destination';
      layersImg[_layer][numAleatorio].onload = function() {
        ctx.drawImage(layersImg[_layer][numAleatorio], 0, 0, 350, 350);
        document.getElementById("upload").disabled = false;
        NFTlisto.src = canvas.toDataURL('image/png');
        //onFileChange();
      };
      //console.log("Rareza: "+rarity_element[i]);
      cant+=1;
      borrar = false;
    }
};

firebase.auth().onAuthStateChanged(user=>{
  if(user){
    login = true;
  }
  else{
    login = false;
  }
})

  function upload()
  {
    if(login == true)
    {
          document.body.style.cursor = "wait";
    document.getElementById("upload").style.cursor = "wait"
    edition = document.getElementById("totalNFT").value;
    nombreColeccion = document.getElementById("coleccionNombre").value;
      let id = firebase.auth().currentUser.uid;

      let imgRef = firebase.storage().ref(`/users/${id}/nfts/${nombreColeccion} #${edition}.png`);
      imgRef.putString(NFTlisto.src.split(/,(.+)/)[1], 'base64', metadata).then(snapshot => {
        document.getElementById("uploaded").style.display = "block";
        document.getElementById("nouploaded").style.display = "none";
        document.getElementById("upload").style.cursor = "pointer"
        document.body.style.cursor = "default";
        setTimeout(ocultarUploaded, 5000);
      }).catch(error => {
        document.getElementById("nouploaded").style.display = "block";
      });
    }
    else{
      window.alert("Please login to upload you NFT");
    }

  }

  function ocultarUploaded(){
    document.getElementById("uploaded").style.display = "none";
  }

function sumarLayer()
{
    layerCounter += 1;
    input_layer.value = layerCounter;
    $(contenedorLayers).append('<div class="square layer'+layerCounter+'"><input class="inputLayer" type="text" id="inputLayer'+layerCounter+'" name="layer'+layerCounter+'" value="Layer '+layerCounter+'"><input class="addImageLayer" type="file" multiple="true" id="imageLayer'+layerCounter+'" accept="image/png, image/jpeg"></div>');

}

function restarLayer()
{
    $('.layer'+layerCounter).remove();
    layerCounter -= 1;
    if(layerCounter <= 0)
    {
        layerCounter = 0;
    }
    input_layer.value = layerCounter;
}

/*
function sumarRarity()
{
    rarityCounter += 1;
    input_rarity.value = rarityCounter;
    $(contenedorRarities).append('<div class="square rarity'+rarityCounter+'"><input class="inputRarity" type="text" id="rarity'+rarityCounter+'" name="rarity'+rarityCounter+'" value="Rarity '+rarityCounter+'"><h4>Probability</h4><input class="probability" type="text" id="probability'+rarityCounter+'" name="probability'+rarityCounter+'" value="20"><input class="addImageRarity" type="file" id="imageRarity'+rarityCounter+'" accept="image/png, image/jpeg"></div>');
}

function restarRarity()
{
    $('.rarity'+rarityCounter).remove();
    rarityCounter -= 1;
    if(rarityCounter <= 0)
    {
        rarityCounter = 0;
    }
    input_rarity.value = rarityCounter;
}*/
