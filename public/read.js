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
  var i = 0;
  var j = 0;

  firebase.auth().onAuthStateChanged(user=>{
    if(user){
        readNFT();
    }
    else{
        $(contenedorImg).empty();
        $(contenedorImg).append('<h2 id="textologin" style="color: white; position:absolute; left: 33%; top: 45%">You need to login to see your NFTs</h2>');
    }
    })

function readNFT()
{
  let id = firebase.auth().currentUser.uid;

  firebase.storage().ref(`/users/${id}/nfts/`).listAll().then(function(result) {
      if(result.items.length == 0){
        $(contenedorImg).append('<h2 id="sinnft" style="color: white; position:absolute; left: 39%; top: 45%; text-align: center">Create your first NFT!</h2>');
      }
      else{
          if(document.getElementById("sinnft")){
            $(sinnft).remove();
          }
      }
    result.items.forEach(function(imageRef) {
      // Eliminar .PNG del nombre
      var split = imageRef.name.split(".");
      var nombreFinal = split[0];

      imageRef.getDownloadURL().then(function(url) {
        i += 1;
        $(contenedorImg).append('<div class="fondo-nft"><button name="'+imageRef.name+'" class="eliminar-nft" onClick="eliminar(this)">x</button><h3 class="nombre-nft">'+nombreFinal+'</h3><img id="nft'+i+'"class="nfts-cargados" src="'+url+'"><a class="download-nft" href="'+url+'" download="'+imageRef.name+'">Download</a></div>');
      }).catch(function(error) {
        window.alert(error);
      });
    });
  }).catch(function(error) {
    window.alert(error)
  });

  i = 0;
}

function eliminar(ref)
{   
    let id = firebase.auth().currentUser.uid;
      var shouldDelete = confirm("Delete this NFT?");
        if (shouldDelete) {
        storageRef.child(`/users/${id}/nfts/${ref.name}`).delete().then(function() {
            $(contenedorImg).empty();
            readNFT();
        }).catch(function(error) {
            window.alert(error);
        });
        } else {
  // the user does not want to delete
        }   
}

function downloadall()
{  
    let id = firebase.auth().currentUser.uid;

    var zip = new JSZip();
    zip.file("Hello.txt", "Hello World\n");
    firebase.storage().ref(`/users/${id}/nfts/`).listAll().then(function(result){
        result.items.forEach(function(imageRef) {
            j += 1;
            let id = "nft" + j.toString();
            imageRef.getDownloadURL().then(function(url) {
                toDataURL(url, function(dataUrl) {
                        zip.file('img/'+id+'.png', dataUrl, {base64: false});
                })
            })
        })
    })
    zip.generateAsync({type:"base64"}).then(function (base64) {
        location.href="data:application/zip;base64," + base64;
    });
}

function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}