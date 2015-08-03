#Web-audio - Best Of Web 2015

Le 5 juin 2015 a eu lieu le premier Best Of Web 2015 à Paris, un rassemblement des meilleurs Meetup de l'année. Cet article fait suite à celui de [Stéphane Blanchon sur le déroulement de la journée](http://blog.viseo-bt.com/meilleur-du-web-a-la-conference-best-web-2015/) et celui de [Jordane Grenat sur les Api Rest](http://blog.viseo-bt.com/rest-world-best-of-web-2015/).

Dans cet article nous allons nous intéresser à la conférence Web Audio Now par les chercheurs [Samuel Goldszmidt](https://twitter.com/ouhouhsami) et [Norbert Schnell](http://imtr.ircam.fr/imtr/Norbert_Schnell). Les deux chercheurs de l'IRCAM (Institut de recherche et coordination acoustique/musique) nous ont présenté leurs sujets de recherche. La première présentation de Samuel Goldszmidt portait sur l'état actuel de la Web Audio API, avec quelques exemples comme l'écriture d'une fonction qui joue des notes et cela en 18 lignes de codes ! La seconde parlait du projet CoSiMa, que je détaillerai dans un prochain billet.

##Prérequis
Avant de commencer, je pense qu'il est bon de reprendre un peu les bases de ce qu'est le son. Le son est une onde acoustique. Concrètement, nos haut-parleurs vibrent pour créer une onde acoustique. Voici une représentation du son : 
![représentation du son](http://perceptionsonoretpe.free.fr/I/images/Fig_4.png)
Plus l'amplitude du son est élevée et plus le son sera perçu comme fort. On joue donc sur l'amplitude pour régler le volume. Avec la période, il est possible de calculer la fréquence (f=1/t); généralement on obtient la valeur de la fréquence en Hertz. Plus la fréquence est élevée et plus le son est aiguë ; plus elle est faible et plus c'est grave. La musique est juste un assemblage en rythme de différents sons.

##La Web Audio API
###L'histoire de l'audio dans le web
Les prémices du son dans des pages web date de 1995. À l'époque trois types de balises était disponibles : bgsound, embed et applet. Les possibilités était très restreintes. 
En 1997, le flash est apparu avec un player et Flash Media Server, mais il n'existait toujours pas d'API native.
En 2008 c'est la révolution du HTML5 et l'intégration d'une nouvelle balise <audio>.
Enfin, en 2010 le W3C définit la Web Audio API. À l'heure où j’écris ces lignes [le document est actuellement en Editor's draft](http://webaudio.github.io/web-audio-api/) mais [reste parfaitement utilisable sur tous les navigateurs sauf IE](http://caniuse.com/#search=web%20audio%20api); Edge implémentera cependant la Web Audio API.
###La Web Audio API en détails
L'API est de haut niveau et elle permet un contrôle du son en JavaScript. Elle repose sur le principe de routing modulaire, c'est à dire que le son possède une entrée à laquelle on va appliquer des nœuds audio pour obtenir le son en sortie. Un nœud audio peut par exemple correspondre à un filtre de certaines fréquences ou à un amplificateur, etc.

#####Outils pour les développeurs
Petit aparté : Firefox dispose d'un outil très pratique pour le Web Audio qui permet de visualiser tous les nœuds audio ainsi que leurs propriétés.
![image d'illustration du plugin de mozilla](http://blog.mozilla.org/hacks/files/2014/06/Web-Audio-Editor-1.png)

####Un exemple 
Voici comment on peut produire du son avec la Web Audio API :
```javascript
var audioContext = new AudioContext();
var oscillator = audioContext.createOscillator();
oscillator.connect(audioContext.destination);
oscillator.start(audioContext.currentTime);
```
Dans ce code, la première chose qui est faite c'est de récupérer une instance du contexte audio. Ensuite, on crée un oscillateur qui est par défaut de type sinusoïdale et possède une fréquence de 440hz, ce qui correspond à la note [LA](https://fr.wikipedia.org/wiki/La440)).
La troisième ligne connecte l'oscillateur à la destination du contexte audio. Concrètement, avant ces deux lignes nous avions 2 nœuds : l'oscillateur et la destination du contexte audio ; maintenant, la sortie de l'oscillateur est branchée à l'entrée du nœud de destination. 

Enfin, comme la dernière ligne démarre l’oscillateur immédiatement, notre LA est joué.

#####Attention avec le garbage collector
Les fuites mémoires sont très facile à obtenir avec l'API. En effet, si vous perdez la référence vers un nœud il est impossible pour vous d'aller récupérer ce nœud. Par exemple, si vous exécutez le code de l'exemple au-dessus dans une fonction onClick d'un bouton, vous aurez à chaque clic un nouveau oscillateur de créé. Firefox vous montrera alors ce genre de graphiques :

![Exemple d'un graphique Firefox avec des fuites mémoires](https://raw.githubusercontent.com/FBerthelot/web-audio-api-examples/gh-pages/images/garbage_collector.png)

Vous pouvez d'ailleurs tester à [cette adresse](http://fberthelot.github.io/web-audio-api-examples/exemple1) la fuite mémoire.

####L'API est en avance sur le temps
Vous l'aurez sans doute remarqué sur la dernière ligne de l'exemple, mais pour définir quand l'oscillateur commence on lui spécifie le temps actuel du contexte audio. Ce paramètre est envoyé pour la bonne raison que chaque nœud est en avance sur le temps du contexte audio. Pour faire simple, l'API a le temps du buffer en avance sur le contexte.
Il faut donc faire très attention à ne pas utiliser des setInterval et setTimeout, il est important d'utiliser les événements.

####Les Audio Params
Chaque nœud possède un ensemble de fonctions qui permettent de planifier le changement de chacun de leurs attributs. Par exemple pour augmenter progressivement la fréquence de notre précédent oscillateur, il faut faire : 
```javascript
// Va augmenter la fréquence de 440Hz à 456Hz linéairement pendant 10 secondes 
oscillator.frequency.linearRampToValueAtTime(456, audioContext.currentTime + 10);
```
Il existe de nombreuses méthodes pour changer les attributs : [setValueAtTime](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setValueAtTime), [linearRampToValueAtTime](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/linearRampToValueAtTime), [exponentialRampToValueAtTime](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/exponentialRampToValueAtTime), [setTargetAtTime](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime), [setValueCurveAtTime](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setValueCurveAtTime) et [cancelScheduledValues](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/cancelScheduledValues).

####Les différents types de nœuds
Nous avons vu jusqu'ici que deux types de nœud. Il en existe cependant plein d'autres:

 - [GainNode](https://developer.mozilla.org/fr/docs/Web/API/GainNode), ces nœuds servent à amplifier ou diminuer le signal. Concrètement, ils servent à contrôler le son ;
 - [Delay](http://webaudio.github.io/web-audio-api/#the-delaynode-interface), ce type de nœud ralentit l'entrée avant de la propager à la sortie. Ils peuvent servir à créer un écho ;
 - [BiquadFilterNode](https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode), type de nœud qui créer un filtre audio. Pour plus d'information sur les filtres, [vous pouvez aller voir sur wikipédia](https://fr.wikipedia.org/wiki/Filtre_%28audio%29#Filtres_passe-haut_et_passe-bas);
 - [PannerNode](https://developer.mozilla.org/fr/docs/Web/API/AudioListener), permet de spatialiser le son. Il est effectivement d'ores et déjà possible de faire un bon jeu de tir en JS avec un son 3D pour permettre aux joueurs de savoir d'où viennent les coups de feu !
 - [Convolver](http://webaudio.github.io/web-audio-api/#linear-effects-using-convolution), généralement utilisés pour faire de la réverbération, ils servent à reproduire l'ambiance d'une pièce ;
 - [SplitterNode](http://webaudio.github.io/web-audio-api/#the-channelsplitternode-interface), sert à séparer les différentes pistes d'une source audio, par exemple à partir d'une source stéréo on obtient en sortie deux sources : la droite et la gauche ;
 - [MergerNode](http://webaudio.github.io/web-audio-api/#the-channelmergernode-interface) fait exactement le contraire du nœud précédent ;
 - [Waveshaper](https://developer.mozilla.org/fr/docs/Web/API/WaveShaperNode), applique une distorsion aux signaux. Amis guitaristes, cette effet est pour vous !
 - [Compressor](http://webaudio.github.io/web-audio-api/#the-dynamicscompressornode-interface), permet de réduire le volume des parties les plus fortes et d'augmenter celui de celles qui le sont moins ;

 - [AnalyserNode](https://developer.mozilla.org/fr/docs/Web/API/AnalyserNode), nœud d'analyse il permet d'accéder en temps réel aux données du son. il renvoie en sortie ce qu'il a exactement en entrée. Pratique pour faire un oscilloscope !

 - [AudioBufferSourceNode](https://developer.mozilla.org/fr/docs/Web/API/AudioBufferSourceNode), nœud représentant une source audio (NB : type de nœud qui n'a aucune entrée, comme l’oscillateur). À utiliser uniquement pour les sons courts (inférieurs à une minute) ;
 - [MediaElementAudioSourceNode](https://developer.mozilla.org/fr/docs/Web/API/MediaElementAudioSourceNode), comme le précédent il représente une source audio mais doit servir pour les sons longs. La source audio provient des balises `<audio>` et `<video>` ;

##Conclusion
Bien que les spécifications W3C ne soient pas entièrement figées, la Web Audio API est d'ores et déjà très complète et implémentée dans les navigateurs récents et sur les terminaux mobiles. Il est même possible dès maintenant de faire des logiciels complexes de retouche audio. À quand une version web de l'autotune ? Nous avons maintenant tous les outils nécessaire pour faire des navigateurs [l'OS universel](http://www.infoworld.com/article/2609165/web-browsers/10-reasons-the-browser-is-becoming-the-universal-os.html).

###Liens connexes
* [Les slides de Samuel Goldszmidt de Best Of Web 2015](http://ouhouhsami.github.io/2015-06-05-bestofweb-paris/#1).
* [Présentation de la Web API lors de dot.js de 2014](http://lanyrd.com/2014/dotjseu/sdgppz/) ainsi que [le lien vers les slides de cette conférence](http://soledadpenades.com/files/t/20141117_dotjs/#21)
* [Le site web de CoSiMa](http://cosima.ircam.fr/)