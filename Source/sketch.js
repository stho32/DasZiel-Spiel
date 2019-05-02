var objekte = [];
var aktoren = [];
var aktiverAktor = -1;

const DefaultSchalengroesse = 100;
const fontSize = 20;

var quelle = Schale(60,60,"Quelle", 40);
var schritt1 = Schale(260,60,"Schritt 1", 0);
var schritt2 = Schale(460,60,"Schritt 2", 0);
var ziel = Schale(660,60,"Ziel", 0);

var aktor1 = Aktor(quelle, schritt1, 1, 6);
var aktor2 = Aktor(schritt1, schritt2, 1, 6);
var aktor3 = Aktor(schritt2, ziel, 1, 6);

objekte.push(quelle);
objekte.push(schritt1);
objekte.push(schritt2);
objekte.push(ziel);
objekte.push(aktor1);
objekte.push(aktor2);
objekte.push(aktor3);

aktoren.push(aktor1);
aktoren.push(aktor2);
aktoren.push(aktor3);

function setup() {
    createCanvas(725, 125);
}

function draw() {
    background(153);
    objekte.forEach((objekt) => {
        objekt.draw();
    });
}

function Schale(centerX,centerY,name,bestand) {
    var publicApi = {};

    publicApi.x = centerX - (DefaultSchalengroesse/2);
    publicApi.y = centerY - (DefaultSchalengroesse/2);
    publicApi.centerX = centerX;
    publicApi.centerY = centerY;
    publicApi.name = name;
    publicApi.bestand = bestand;

    publicApi.DockingPointRight = {};
    publicApi.DockingPointRight.x = centerX + (DefaultSchalengroesse/2) +20;
    publicApi.DockingPointRight.y = centerY;

    publicApi.DockingPointLeft = {};
    publicApi.DockingPointLeft.x = centerX - (DefaultSchalengroesse/2) -20;
    publicApi.DockingPointLeft.y = centerY;

    publicApi.draw = function() {
        fill(255);
        rect(publicApi.x, publicApi.y, DefaultSchalengroesse, DefaultSchalengroesse);

        fill(0);
        textAlign(CENTER, CENTER);
        textSize(fontSize/2);
        text(publicApi.name, publicApi.centerX, publicApi.y+(fontSize/2));

        textAlign(CENTER, CENTER);
        textSize(fontSize);
        text(publicApi.bestand, publicApi.centerX, publicApi.centerY);
    }

    return publicApi;
}

function Aktor(schaleQuelle, schaleZiel, durchsatzMin, durchsatzMax) {
    var publicApi = {};

    publicApi.schaleQuelle = schaleQuelle;
    publicApi.schaleZiel = schaleZiel;
    publicApi.durchsatzMin = durchsatzMin; 
    publicApi.durchsatzMax = durchsatzMax;
    publicApi.LetzterDurchsatz = "";
    publicApi.IstAktiv = false;

    publicApi.draw = function() {
        var quelle = publicApi.schaleQuelle.DockingPointRight;
        var ziel = publicApi.schaleZiel.DockingPointLeft;
        strokeWeight(50);
        if ( publicApi.IstAktiv ) {
            stroke("red");
        } else {
            stroke(255);
        }
        line(quelle.x, quelle.y, ziel.x, ziel.y);
        strokeWeight(1);
        stroke(0);
        ZeigerNachLinks(ziel.x+20,ziel.y,10);

        // Kapazität einblenden
        fill(0);
        textAlign(LEFT, CENTER);
        textSize(fontSize/2);
        text("Kapazität " + durchsatzMin + "-" + durchsatzMax, quelle.x, quelle.y-15);

        // Kapazität einblenden
        fill(0);
        textAlign(LEFT, CENTER);
        textSize(fontSize/2);
        text(publicApi.LetzterDurchsatz, quelle.x, quelle.y);
    };

    publicApi.Deaktiviere = function() {
        publicApi.IstAktiv = false;
    };

    publicApi.Aktiviere = function() {
        publicApi.IstAktiv = true;
    };

    publicApi.FuehreAktionAus = function() {
        var moeglicherDurchsatz = 
            Math.trunc(
                Math.random() * 
                (publicApi.durchsatzMax-publicApi.durchsatzMin) + 
                publicApi.durchsatzMin);

        var kann = moeglicherDurchsatz;
        var hat = publicApi.schaleQuelle.bestand;
        var macht = moeglicherDurchsatz;

        if ( publicApi.schaleQuelle.bestand < moeglicherDurchsatz ) {
            macht = publicApi.schaleQuelle.bestand;
        }

        publicApi.schaleQuelle.bestand = publicApi.schaleQuelle.bestand -macht;
        publicApi.schaleZiel.bestand = publicApi.schaleZiel.bestand +macht;

        publicApi.LetzterDurchsatz = "k:" + kann + " h:" + hat + " m:" + macht;
    }

    return publicApi;
}

function ZeigerNachLinks(x,y,size) {
    x1 = x-size;
    x2 = x+size;
    x3 = x-size;

    y1 = y-size;
    y2 = y;
    y3 = y+size;

    fill("red");
    triangle(x1, y1, x2, y2, x3, y3);
}

function mouseClicked() {
    /* nächsten Aktor wählen */
    aktiverAktor = aktiverAktor + 1;
    if (aktiverAktor > aktoren.length-1) {
        aktiverAktor = 0;
    } 

    aktoren.forEach((a) => {a.Deaktiviere();})
    aktoren[aktiverAktor].Aktiviere();
    aktoren[aktiverAktor].FuehreAktionAus();

}
