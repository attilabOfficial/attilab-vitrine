(FR) Vitrine connectée
==================

La vitrine connectée est un prototype réalisé pour montrer les compétences et les capacités d'[Attilab](https://attilab.io), agence d'innovation digitale. Le but de ce prototype est d'afficher une vitrine qu'il est possible de contrôler au clavier ou via une télécommande fonctionnant grâce à la technologie Bluetooth Low Energy.

![Vitrine](https://lh3.googleusercontent.com/-t5nB1leZA4Q/V2psjNN-rEI/AAAAAAAAJ1E/pw1tjUuMFy8eJzW2zMSy2bkAkyc6SEQOgCLcB/s512/Capture+d%2527%25C3%25A9cran+de+2016-06-22+12%253A45%253A54.png "vitrine.png") ![Remote](https://lh3.googleusercontent.com/4aQUJKMxbQz7Sql2MeTxXMcKHJhikwFu8PirCS7aD_NdCvJCrk_LQIsxLxRI7xCJWNA9uRIe=s288 "Capture d'écran de 2016-06-22 12:49:04.png")

La vitrine connectée se présente tout d'abord sous la forme d'un menu à tuiles, chacune de ces tuiles amenant sur une application différente. Voici la liste des tuiles actives à ce jour :

 - **Catalogue** : affiche un catalogue virtuel dont il est possible de tourner les pages avec la télécommande, le clavier ou à l'aide d'un Leap Motion.

 - **Roue de la fortune** : mini-jeu fonctionnant avec le Leap Motion. Faites tournez la roue avec votre doigt et arrêtez de tourner pour découvrir votre gain !
 - **Robot** : contrôlez à distance un Parrot Jumping Sumo et observez le retour vidéo !

 - **Domotique** : allumez ou éteingez vos prises Chacon DiO !

 - **Camera** : affiche à l'écran le retour vidéo de la caméra et permet de prendre des photos via l'application

 - **À propos** : affiche le site web d'Attilab

Dépendances
----------

**Serveur (Vitrine)**

- Node.js
- Appareil compatible Bluetooth Low Energy
- [Leap Motion](https://www.leapmotion.com/setup)
- [UV4L](http://www.linux-projects.org/uv4l/installation/)

**Client (Télécommande)**

- Apache Cordova pour compiler et installer l'application
- Appareil compatible Bluetooth Low Energy

Installation
------------

Dans le dossier **server** du projet, effectuez la commande suivante :

    npm install

Guide de démarrage
------------

Sur le serveur, lancez le script **server.js** situé dans le dossier **server** à l'aide de la commande suivante. *(Des droits administrateurs peuvent être nécessaire afin d'utiliser le Bluetooth LE)*

    npm run

Puis ouvrez la page **index.html** située dans le dossier **server/vitrine** avec votre navigateur favori. Cela aura pour effet d'afficher la page de téléchargement de l'application jusqu'à ce qu'un client se connecte.

Sur le client, activez le Bluetooth et démarrez simplement l'application, une fenêtre va s'afficher indiquant que le client est en attente d'une connexion (il recherche un appareil portant le nom **raspberrypi**, modifiable dans le fichier **client/www/js/index.js**). Si le serveur n'est pas trouvé, vérifiez que votre appareil est compatible Bluetooth LE et que le mode est bien configuré sur BLUETOOTH (fichiers **constants.js**).

(EN) Connected showcase
=====================

The connected showcase is a prototype that aims to show some of the skills and capabilities that we have at [Attilab](https://attilab.io) (digital innovation agency). This prototype displays a showcase that you can control using your keyboard or the remote control which uses Bluetooth Low Energy.

![Vitrine](https://lh3.googleusercontent.com/-t5nB1leZA4Q/V2psjNN-rEI/AAAAAAAAJ1E/pw1tjUuMFy8eJzW2zMSy2bkAkyc6SEQOgCLcB/s512/Capture+d%2527%25C3%25A9cran+de+2016-06-22+12%253A45%253A54.png "vitrine.png") ![Remote](https://lh3.googleusercontent.com/4aQUJKMxbQz7Sql2MeTxXMcKHJhikwFu8PirCS7aD_NdCvJCrk_LQIsxLxRI7xCJWNA9uRIe=s288 "Capture d'écran de 2016-06-22 12:49:04.png")

The connected showcase starts on a tile menu from which each tile brings to a specific application. Here is the list of active tiles :

 - **Catalog** *(Catalogue)* : displays a virtual catalog that you may control using the remote control, the keyboard or a Leap Motion.

 - **Wheel of fortune** *(Roue de la fortune)* : game working with the Leap Motion. Make the wheel spin using your finger and stop to discover your gift!

 - **Robot** : control remotely a Parrot Jumping Sumo and watch the video stream.

 - **Automation** *(Domotique)* : Control your Chacon DiO outlets!

 - **Camera** : Display camera and take photos with the application

 - **About**  *(À propos)* : displays Attilab's website

Dependencies
----------

**Server (Showcase)**

- Node.js
- Bluetooth Low Energy compatible device
- [Leap Motion](https://www.leapmotion.com/setup)
- [UV4L](http://www.linux-projects.org/uv4l/installation/)

**Client (Remote Control)**

- Apache Cordova to build and install the application
- Bluetooth Low Energy compatible device

Installation
------------

In the **server** folder, run the following command

    npm install

Getting started
------------

On the server run the script called **server.js** which is in the folder **server** using the following command. *(Admin rights might be necessary to use the Bluetooth)*

    npm run

Then, open the **index.html** webpage which is in the folder **server/vitrine** with your favourite browser. This will display a download page until a client is connected.

On the client, enable the bluetooth and start the application, a window will be displayed until the client is connected to the showcase (it looks for a device called **raspberrypi**, which you can change in the file **client/www/js/index.js**). If no connexion is found, check that your device is Bluetooth LE capable and that the mode is on BLUETOOTH (files **constants.js**).
