#Web-audio Worker- Best Of Web 2015

Le 5 juin 2015 a eu lieu le premier Best Of Web 2015 à Paris, un rassemblement des meilleurs Meetups de l'année. Cet article fait suite à l'article de [présentation de la Web Audio API](https://github.com/FBerthelot/web-audio-api-examples/blob/gh-pages/the_post.md). Ici nous nous intéressons à un nœud spécifique de la Web-Audio API, les Audio Workers.

Une des fonctionnalités les plus attendues par les développeurs qui font du web audio sont les Audio Workers. Nous allons voir ici ce qu'apportent ces nœuds, en quoi ils sont différents des autres et surtout pourquoi la communauté JS est autant excitée à ce sujet.

##Avant-propos
Les Audio Workers sont toujours en cours de spécification, aucun navigateur ne les supporte actuellement. Cette article peut donc potentiellement décrire certaines fonctionnalités qui seront totalement différentes dans le futur. D'ailleurs si vous avez des idées pour améliorer les spécifications n'hésitez pas à aller en discuter sur [le fil github associé](https://github.com/WebAudio/web-audio-api/issues).

##Le principe
Les Audio Workers sont des nœuds personnalisés, c'est à dire qu'ici nous avons le droit de modifier le signal bit par bit. Il est aussi possible de créer des paramètres spécifiques à ces nœuds, et tout comme les autres nœuds nous pouvons utiliser toutes les fonctions disponibles pour les audio params comme [linearRampToValueAtTime](http://webaudio.github.io/web-audio-api/#methods-3) par exemple.

De plus les Web Workers possèdent un système de messagerie. Il est en effet possible d'envoyer des messages à chaque nœud du même type. Le système de messagerie suggère que chaque instance partage un tronc commun, et il s'appelle le [AudioWorkerGlobalScope](http://webaudio.github.io/web-audio-api/#idl-def-AudioWorkerGlobalScope).

##Comparaison avec ce que l'on a déjà
###ScriptProcessorNode
Actuellement pour avoir un nœud qui fait des traitements spécifiques nous avions le nœud ScriptProcessorNode. Ce nœud, à l’instar de l'AnalyserNode, fonctionne avec un buffer. Tandis que le buffer de l'AnalyserNode est en lecture seule, celui du ScripProcessorNode est en écriture. Voici un exemple de code pour multiplier l'amplitude par 2 d'un signal :
```javascript
// Création du ScriptProcessorNode avec un buffer de 4096, 1 entrée et 1 sortie
var ScriptProcessorNode = audioCtx.createScriptProcessor(4096, 1, 1);

ScriptProcessorNode.onaudioprocess = function(audioProcessingEvent){
  var inputBuffer = audioProcessingEvent.inputBuffer;
  var outputBuffer = audioProcessingEvent.outputBuffer;
  //Parcours de channel de la source audio (par exemple: gauche et droite en stéréo)
  for (var i=0; i < outputBuffer.numberOfChannels; i++) {
    var inputData = inputBuffer.getChannelData(i);
    var outputData = outputBuffer.getChannelData(i);
    
    //Parcours de l'ensemble du buffer 
    for (var j=0; j < inputBuffer.length; j++) {
      outputData[j] = inputData[j] * 2; //Multiplication de l'amplitude par 2      
    }
  }
}
```
Avec ce genre de nœud on peut réellement faire tous les traitements que l'on souhaite sur le signal. À ce stade, à part la modularité que peut apporter le système des audio params, l'apport des Audio ne saute pas aux yeux.

###La même chose mais avec un Web Worker
Le module des web workers permet d'inclure directement le nom du fichier contenant le code de notre nœud, le code est donc séparé en deux fichiers : 

Main.js
```javascript
//Chargement du nœud dans l'audio contexte
audioContext.createAudioWorker("nodeFactory.js").then( function(factory) 
    {
      //Instanciation d'un nouveau nœud 
      var node = factory.createNode();
      
      //On peux utiliser les fonctions sur les audio params comme pour les autres nœuds
      node.amplitudeMultiplier.setValueAtTime(0, audioContext.currentTime);
      node.amplitudeMultiplier.linearRampToValueAtTime(10, audioContext.currentTime + 10);
      
      node.connect(output); 
      input.connect(node);
    }
  );
```
nodeFactory.js
```javascript
this.addParameter( "amplitudeMultiplier", 8 );
onaudioprocess= function (e) {
  // De même, parcours des channels
  for (var i=0; i< e.inputs[0].length; i++) {
    var inputBuffer = e.inputs[0][i];
    var outputBuffer = e.outputs[0][i];
    var bufferLength = inputBuffer.length;
    //Parcours du buffer
    for (var j=0; j<bufferLength; j++) {
      outputBuffer[j] = inputBuffer[j] * e.parameters.amplitudeMultiplier;
    }
  }
};
```
A première vue, il n'y a pas de grandes différences avec le ScriptProcessorNode, sauf qu'il y a une couche d'abstraction supplémentaire ici. Cela rend le code plus joli lors de la création de nouveau type de nœuds, mais rien de plus.

##Une histoire de file d'exécution
Comme nous l'avons vu dans l'article précédent, la web audio api n'est pas exécutée dans le même file d’exécution que celui du rendu et même que celui de l’exécution du JS en général.
Or, le code à l’intérieur du ScriptProcessorNode est exécuté dans la file d’exécution principale et cela soulève de gros problèmes de performance. En effet ce code sera impacté par les performances de Rendering, d’exécution du reste du JS, et autre code de la page. Cela signifie qu'un bug sonore peut survenir si en même temps on demande au navigateur de nous afficher un tableau de 1000 lignes.

Les codes à l’intérieur des Web Audio Worker quant à eux s’exécutent dans la file d’exécution réservée à l'audio. La possibilité de bug audio à cause d'un rendering gourmand est alors nulle !

###Asynchronisme incompatible avec l'Audio
Quand un ScriptProcessorNode cherche à redéfinir sa sortie, la modification se fait de manière asynchrone. Comme le nœud ne peut pas simplement attendre, le nœud insère de la latence. En effet, le nœud attend une certaine volumétrie de données (la taille du buffer) et ensuite fait les appels asynchrones entre les différentes files d'exécution. Ensuite le nœud ajoute encore de la latence pour avoir le temps de traiter les données.

Pour illustrer le propos, [le développeur de Google Chris Wilson](https://plus.google.com/+ChrisWilson/posts) explique que ce type de nœud inclus une latence d'environ 23ms pour un buffer de 512 bits et plus de 50ms pour un buffer de 1024 bits (qui est la valeur pas défaut).

Avec les Web Audio Worker, le code est directement exécuté dans la file d’exécution de l'audio. Il n'y a pas d'appel transverse, donc l'appel aux fonctions peut se faire de façon synchrone. La seule latence sera le temps d’exécution de notre code.

##Conclusion
Les Web Audio Workers apporteront beaucoup plus de flexibilité dans notre manière d'écrire du code avec la Web Audio API et apporteront aussi beaucoup plus de performance. Le seul regret que l'on peut avoir est que le code dans les scriptProcessorNode ne soit pas exécuté dans la bonne file d'exécution. Cela aurait résolu pas mal de problèmes de performance. A cause de ça, le scriptProcessorNode sera amené à disparaître. Il est d'ailleurs déjà *"deprecated"* dans la spécification. Mais c'est vrai qu'il est difficile de faire une spécification parfaite dès le départ. 

####Liens utiles
- [La spécification W3C](http://webaudio.github.io/web-audio-api/#the-audioworker-interface)
- [L'explication de ce qu'est les web-audio par Chris wilson](https://plus.google.com/+ChrisWilson/posts/QapzKucPp6Y)  
-  [Un shim existe déjà !](https://github.com/mohayonao/audio-worker-shim) En revanche il utilise le ScriptProcessorNode.
- [Un détournement de la web audio API amusant](https://sudoroom.org/serial-over-webaudio/)
