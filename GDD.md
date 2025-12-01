## Grupo 13 - Crepusculones

Integrantes:
* Marta de Miguel Tapia
* Ángel Younes Karim Mérida
* Sara Mesa Pacheco
* Claudia Morago Amigo
* Iris Muñoz Montero

**ÍNDICE**
  * [Aspectos generales](#aspectos-generales)
  * [Imagen y diseño visual](#imagen-y-dise-o-visual)
  * [Sonido](#sonido)
  * [Jugabilidad](#jugabilidad)
  * [Controles](#controles)
  * [Narrativa](#narrativa)
  * [Comunicación](#comunicaci-n)
  * [Diagramas de flujo](#diagramas-de-flujo)
  * [Referencias](#referencias)
  * [Assets](#assets)

## Aspectos generales
Ambientado en Halloween, _Crepusculones_ es un juego de fiesta, acción y estrategia con  multijugador local y en línea 1 vs 1 con vista cenital. Dirigido a un público de entre 13 y 24 años. El juego busca ser un pasatiempo divertido para los jugadores que busquen adrenalina y diversión con un amigo.

## Imagen y diseño visual
El estilo del juego es Pixel Art 2D. Se busca una estética pequeña pero detallada, con sprites simples y reconocibles.
Se usará una paleta de colores fríos y oscuros para dar la estética de misterio, a excepción de algunos elementos,  como los caramelos o los personajes,  que tendrán colores más vivos, con la finalidad de que destaquen sobre el fondo. 
<br>
A continuación, se presentan los dos personajes diseñados y los objetos implementados en el juego:
<br>
![Personaje 1](/imagenes/vampiresa_front.png)
![Personaje 2](/imagenes/zombie_front.png)
![Caramelo](/imagenes/caramelo.png)
![Calabaza 1](/imagenes/obj_calabaza_1.png)
![Calabaza 2](/imagenes/obj_calabaza_2.png)
![Calabaza 3](/imagenes/obj_calabaza_3.png)
![Piedra](/imagenes/obj_piedra.png)
<br>

Además de los personajes, también se han diseñado las pantallas:
<br>
![Pantalla de inicio](/imagenes/pantalla_de_inicio_2.png)
![Pantalla de juego](/imagenes/pantalla_de_juego.png)
![Pantalla de pausa](/imagenes/pantalla_de_pausa.png)
![Pantalla de ajustes](/imagenes/pantalla_de_ajustes.png)
![Pantalla de créditos](/imagenes/pantalla_de_creditos.png)
<br>

También se ha creado un logo para la empresa ficticia de la que se forma parte:
<br>
![Logo empresa](/imagenes/logo_empresa.png)
<br>
El estilo artístico está inspirado en los juegos clásicos  de 8 bits. Culturalmente se basa en la temática de Halloween, y hace un guiño a algunas obras de la cultura pop como la película _Crepúsculo_ o el videojuego _Minecraft_.

## Sonido
Los sonidos y la música es de temática Halloween. Busca ser divertida y acorde con la temática del juego. Todas las músicas son coherentes entre ellas para no generar disonancia.
Se han introducido 4 canciones en total: una para el menú de inicio, de carácter divertido y misterioso que representa la temática global del juego; una para la escena de juego, más energética y que inspira la urgencia de una partida contrarreloj; una para el menú de ajustes, que sirve de sonido de ambiente más que de música, pues es una pantalla en la que el jugador suele quedarse pensando más que viviendo una emoción; y finalmente una para los créditos, que tiene un tono calmado y de clausura dentro de lo que es la temática, ya que suele ser la que los jugadores visitan en última estancia.
Adicionalmente se añadieron 2 efectos de sonido dentro del juego: el sonido de pulsar los botones de la interfaz, que es de estilo 8 bits al igual que los propios botones y un sonido de aviso de cuando se está acabando el tiempo en las rondas, pues es un recurso ampliamente usado en juegos de este estilo para provocar tensión en las partidas que tienen un tiempo limitado.
Se planean añadir en las próximas fases sonidos para los distintos objetos y para otros aspectos de la interfaz entre otras cosas.
Los sonidos pertenecen a la página de sonidos de libre uso Freesound, como se indica en los créditos. 

## Jugabilidad
Una partida se compone de 3 rondas. En cada ronda, el tiempo de aparición de los objetos se reduce para que la duración sea menor. La primera ronda dura 45 segundos, y en cada una de las siguientes se disminuyen 10 segundos respecto a la duración anterior. 
Varios objetos aparecerán en el mapa que los jugadores pueden coger y lanzar según su naturaleza. Existen 2 tipos de objetos:
1. Caramelos: aparecen una vez por ronda. Los jugadores compiten por llevarlo a su cesta lo antes posible.
2. Objetos del mapa: estos podrán ser recogidos por los jugadores y lanzados para aturdir a su enemigo por unos segundos, ya sea para generar una estrategia o para hacer que el enemigo suelte el ítem o caramelo que está sosteniendo.

El objetivo es recolectar la mayor cantidad de caramelos por ronda. El jugador ganador será el que consiga el mayor número de rondas ganadas.

## Controles
El juego está diseñado para que puedan jugar 2 jugadores en local, con el mismo teclado
* Jugador izquierda: usará W A S D para moverse y E para recoger los caramelos y los objetos.
* Jugador derecha: usará I J K L para moverse y O para recoger los caramelos y los objetos.
Para lanzar los objetos se debe presionar la tecla para recoger y estar andando hacia la dirección donde se quiera tirar el objeto, si no, sólo sotará dicho objeto.

## Narrativa
Un año más llega la noche de Halloween al pequeño pueblo de Nocturnia. Como cada año, los muertos salen de sus tumbas, los monstruos abandonan sus escondites y los niños salen en la búsqueda de caramelos. 
<br>
En el centro del pueblo brilla con intensidad el Foco del Crepúsculo, un artefacto legendario capaz de repeler cualquier entidad maligna. Mientras el foco brille el pueblo estará protegido, pero los monstruos no se lo van a poner fácil.
<br>
Cansados de vivir escondidos en las sombras, Fer, el alfa de los licántropos, y Selenya, la condesa de los vampiros, intentarán robar el foco y sumir a Nocturnia en absoluta penumbra. 
<br>
Frente a ellos, dos intrépidos amigos defenderán la luz, llevándose algún caramelo por el camino: Luna, una valiente niña disfrazada de fantasma, y Noel, un niño asustadizo disfrazado de zombi.
<br>
¿Podrán defender el pueblo? ¿O por una vez vencerán los monstruos? 

## Comunicación
El juego va a ser promocionado mediante las redes sociales como TikTok, Instagram y Twitter. Se enseñarán clips del proceso de desarrollo y de mini partidas para generar interés. También se alentará a los jugadores a compartir sus experiencias jugando bajo el eslogan: “¿Defenderás al pueblo? ¿O vencerán los monstruos?”, se realizarán campañas de votos para elegir equipos favoritos (licántropos, vampiros, fantasmas o zombis) y se promoverá compartir los resultados de las partidas o duelos para decidir equipos ganadores. En resumen se va a basar la promoción del juego en una estrategia de creación de comunidad orgánica en redes sociales. 
La campaña de lanzamiento inicial del juego “Crepusculones: sólo un monstruo puede ganar” consiste en votaciones semanales para elegir los equipos más fuertes, contadores que muestran los equipos en cabeza y eventos especiales para decidir victorias finales. También se considera hacer retos especiales como: “Gana con más de 10 caramelos” o “Gana sin que te roben”.
<br>
Mediante esta estrategia se espera crear expectación a la salida del juego, generar viralidad y mantener la comunidad atraída.


## Diagramas de flujo
Se han planeado dos diagramas de flujo. Uno de ellos muestra cómo el jugador puede moverse entre las escenas planteadas para el juego y otra muestra de forma visual la jugabilidad. 
![Escenas](/imagenes/ddf_3.png)

![Jugabilidad](/imagenes/ddf_4.png)

## Referencias
[Película Crepúsculo](https://es.wikipedia.org/wiki/Crep%C3%BAsculo_(pel%C3%ADcula_de_2008))    
[Zombi del videojuego Minecraft](https://minecraft.fandom.com/es/wiki/Zombi)     
[Videojuego de laberintos Bomberman](https://es.wikipedia.org/wiki/Bomberman)   
[Juego de Google Halloween 2022](https://doodles.google/doodle/halloween-2022/)          
[Assets de Halloween](https://craftpix.net/freebies/free-halloween-decorations-characters-and-items-pixel-art/?srsltid=AfmBOorreBU5S1y4a6NEnGLx1VxytknQ80rhrRatrEtu-gE1UsJa5OCL)

## Assets
Personajes, escenario y objetos realizados por el equipo.
<br>
Pantallas de menú, pausa, ajustes y créditos han sido realizadas con assets gratuitos de Canva.
<br>
Música del juego ha sido seleccionada de FreeSound.
<br>





