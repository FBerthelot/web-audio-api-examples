#Web-audio - Best Of Web 2015

Le 5 juin 2015 à eu lieu le premier Best Of Web 2015 à Paris, un rassemblement des meilleurs Meetup de l'année. Cette article fait suite à celui de [stéphane blanchon sur le déroulement de la journée](http://blog.viseo-bt.com/meilleur-du-web-a-la-conference-best-web-2015/) et celui de [Jordane Grenat sur les Api Rest](https://stackedit.io/viewer#!provider=gist&gistId=2fcfe1a2c774c13e2466&filename=restWorld-bestOfWeb.md).

Dans cet article nous allons nous intéresser à la conférence Web Audio Now by Samuel Goldszmidt & Norbert Schnell. Les deux chercheurs de l'IR-CAM nous ont présenté leurs sujets de recherche. La première présentation de Samuel Goldszmidt portait sur l'état actuel de la web audio api, avec quelques exemples comme l'écriture d'une fonction qui joue des notes et cela en 18 lignes de codes ! La seconde parlait du projet CoSiMa (j'entrerai plus en détail plus loin dans l'article).

##La web audio API
###L'histoire de l'audio dans le web
Les prémices du son dans des pages web date de 1995 et à l'époque trois types de balises était disponible: bgsound, embed et applet. Pas l'idéal mais il faut bien un début.  1997, le flash est apparue avec un player et Flash Media Server, mais il n'existait toujours pas d'API Native.
En 2008 la révolution du HTML5 et l'intégration d'une nouvelle balise <audio> et enfin en 2010 le W3C définie la Web Audio API. A l'heure où j’écris ces lignes [le document est actuellement en Editor's graph](http://webaudio.github.io/web-audio-api/) mais [reste parfaitement utilisable si IE est en dehors du Scope](http://caniuse.com/#search=web%20audio%20api). Il est important de noter que Edge supportera la Web Audio API.
###La Web Audio API en détail
L'API est Haut niveau qui permet un contrôle du son en JavaScript, elle repose sur le principe de routing modulaire. C'est à dire que le son possède une entrée auquel on va lui appliquer des nœuds audio pour obtenir le son en sortie. Un nœud audio peu par exemple correspondre à un filtre de certaines fréquences où un amplificateur, etc.

#####Outils pour les développeurs
Petit aparté: Firefox dispose d'un outil très pratique pour le web audio qui permet de visualiser tous les nœuds audio ainsi que leurs propriétés.
![image d'illustration du plugin de mozilla](http://blog.mozilla.org/hacks/files/2014/06/Web-Audio-Editor-1.png)

####Un exemple 
Voici comment on peux produire du son avec la Web Audio API :
```javascript
var audioContext = new AudioContext();
var oscillator = audioContext.createOscillator();
oscillator.connect(audioContext.destination);
oscillator.start(audioContext.currentTime);
```
Dans ce code la première chose qui est fait c'est de récupérer une instance du contexte audio, ensuite on crée un oscillateur (par défaut cet oscillateur est de type sinusoïdale et a une fréquence de 440hz, ce qui correspond au [LA](https://fr.wikipedia.org/wiki/La440)).
La troisième ligne connecte l'oscillateur à la destination du contexte audio. Concrètement avant ces deux lignes nous avions 2 nœuds : l'oscillateur et la destination du contexte audio, maintenant la sortie de l'oscillateur est branché à l'entré du nœud de destination. 

Enfin la dernière ligne démarre l’oscillateur immédiatement, notre LA est joué.

#####Attention avec le garbage collector
Les fuites mémoires sont très facile a réaliser avec l'API, en effet les référence si vous perdez la référence vers un nœud il est impossible pour vous d'aller là rechercher. Par exemple si vous exécutez le code de l'exemple au dessus dans une fonction onClick d'un bouton vous aurez a chaque clique un nouveau oscillateur de créer. Firefox vous montrera alors ce genre de graphs: 
![image d'illustration](https://raw.githubusercontent.com/FBerthelot/web-audio-api-examples/gh-pages/images/garbage_collector.png)
Vous pouvez d'ailleurs tester à [cette adresse](http://fberthelot.github.io/web-audio-api-examples/exemple1) la fuite mémoire.

Quelques librairies permettent de palier à ce problème comme 

####L'API est en avance sur le temps
Vous l'aurez sans doute remarqué sur la dernière ligne de l'exemple mais pour définir quand oscillateur commence on lui spécifie le temps actuel du contexte audio. Ce paramètre est envoyé pour la bonne raison que chaque nœud est en avance sur le temps du contexte audio. Pour faire simple l'API a le temps du buffer en avance sur contexte.
Il faut donc faire très attention de ne pas utiliser des setInterval et setTimeout, il est important d'utiliser les événements.

####Les Audio Params
Chaque nœuds possède un ensemble de fonctions qui permettent de planifier le changement de chacun de leurs attributs. Par exemple pour augmenter progressivement la fréquence de notre précédent oscillateur il faut faire : 
```javascript
//Va augmenter la fréquence de 440Hz jusqu'à 456Hz linéairement pendant 10 secondes 
oscillator.frequency.linearRampToValueAtTime(456, audioContext.currentTime + 10);
```
Ils y a pas mal de méthodes  disponible pour changer les attributs: setValueAtTime, linearRampToValueAtTime, exponentialRampToValueAtTime, setTargetAtTime, setValueCurveAtTime et cancelScheduledValues qui permet d'annuler tous les événement prévue. 

####Les différents types de nœuds
Nous avons vu jusque ici que deux types de nœuds, il en existe pleins d'autres:

 - [GainNode](https://developer.mozilla.org/fr/docs/Web/API/GainNode), ces nœud servent à amplifier ou diminuer le signal. Concrètement ils servent à contrôler le son. 
 - [Delay](http://webaudio.github.io/web-audio-api/#the-delaynode-interface), ce type de nœud ralenti l'entré avant de le propager à l'entrée. Ils peuvent servir à créer un écho;
 - [BiquadFilterNode](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode), type de nœud qui créer un filtre audio. Pour plus d'information vous pouvez allez [là](https://fr.wikipedia.org/wiki/Filtre_%28audio%29#Filtres_passe-haut_et_passe-bas);
 - [Panner node](https://developer.mozilla.org/fr/docs/Web/API/AudioListener), permet de spatialiser le son. Oui il est dors et déjà possible de faire un bon FPS en JS avec un son 3D pour permettre au joueurs de savoir d'où viennent les tirs !
 - [Convolver](http://webaudio.github.io/web-audio-api/#linear-effects-using-convolution), généralement utilisé pour faire de la réverbération, il servent à reproduire l'ambiance d'une pièce.
 - [splitter node](http://webaudio.github.io/web-audio-api/#the-channelsplitternode-interface), sert à séparer les différentes pistes d'une source audio, par exemple a partir d'une source stéréo on obtient en sortie deux sources la droite et la gauche.
 - [merger node](http://webaudio.github.io/web-audio-api/#the-channelmergernode-interface) fait exactement le contraire du nœud précédent.
 - [waveshaper](https://developer.mozilla.org/fr/docs/Web/API/WaveShaperNode), applique une distorsion aux signaux. Amis guitaristes cette effet est pour vous!
 - [compressor](http://webaudio.github.io/web-audio-api/#the-dynamicscompressornode-interface), permet de réduire le volume des parties les plus fortes et d'augmenter celles qui le sont moins.

 - [Analyser node](https://developer.mozilla.org/fr/docs/Web/API/AnalyserNode), nœud d'analyse il permet d'accéder en temps réel aux données du son. il renvoi en sortie ce qu'il a exactement en entrée. Pratique pour faire une oscilloscope !

 - [AudioBufferSourceNode](https://developer.mozilla.org/fr/docs/Web/API/AudioBufferSourceNode), nœud représentant une source audio (NB type de nœud qui n'a aucune entrée, comme l’oscillateur.). A utiliser uniquement pour les son court (inférieur à une minute).
 - [MediaElementAudioSourceNode](https://developer.mozilla.org/fr/docs/Web/API/MediaElementAudioSourceNode), comme le précédent il représente une source audio mais doit servir pour les sons longs. La source audio provient des balises `<audio>` et `<video>` .

##Conclusion
Bien que les spécifications W3C ne soit pas entièrement fini, la Web Audio API est dors et déjà très complète et implémenté dans les navigateurs récents et sur les terminaux mobile. Il est même possible dès maintenant de faire des logiciels complexes de retouche audio, à quand une version web de l'autotune ? Nous avons maintenant tous les outils nécessaire pour faire des navigateur [l'OS universel](http://www.infoworld.com/article/2609165/web-browsers/10-reasons-the-browser-is-becoming-the-universal-os.html).

###Liens connexes
* [Les slides de Samuel Goldszmidt de Best Of Web 2015](http://ouhouhsami.github.io/2015-06-05-bestofweb-paris/#1).
* [Présentation de la Web API lors de dot.js de 2014](http://lanyrd.com/2014/dotjseu/sdgppz/) ainsi que [le lien vers les slides de cette conférence](http://soledadpenades.com/files/t/20141117_dotjs/#21)
* [Le site web de cosima](http://cosima.ircam.fr/)