// Variables globales

const objMemoire = $("#memoire");
const objEcran = $("#ecran");

// On stocke la valeur de l'écran "précédent"
let precedent = 0;

// On stocke l'affichage
let affichage = "";

// On stocke l'opération
let operation = null;

// On initialise la mémoire
let memoire;

//On stocke le moment où la touche "=" ou "Enter" est touchée, pour reset si on rappuie sur une touche numérique
let enterReset = false;

$(window).on("load", function () {
    // On écoute les clics sur les touches
    let touches = $("span");

    $.each(touches, function (index, touche) {
        $(touche).on('click', gererTouches);
    });

    // On écoute les touches du clavier
    $(document).on("keydown", gererTouches);

    // Récupération de la mémoire depuis le stockage local
    memoire = (localStorage.memoire) ? parseFloat(localStorage.memoire) : 0;
    if (memoire != 0) objMemoire.css("display", "initial");
});

/**
 * Cette fonction réagit au clic sur les touches
 */
function gererTouches(event) {
    let touche;

    // On liste les touches autorisées
    const listeTouches = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/", ".", "Enter", "Escape"];

    // On vérifie si on a l'évènement "keydown"
    if (event.type === "keydown") {
        // On compare la touche appuyée aux touches autorisées
        if (listeTouches.includes(event.key)) {
            // On empêche l'utilisation "par défaut" de la touche
            event.preventDefault();
            // On stocke la touche choisie dans la variable touche
            touche = event.key;
        }
    }
    else if (event.type === "click") {
        touche = (this.innerText);
    }

    // On vérifie si chiffre ou .
    if (parseFloat(touche) >= 0 || touche === ".") {
        // A vérifier, pas plusieurs . dans la chaîne
        // On met à jour la valeur d'affichage et on affiche sur l'écran
        affichage = enterReset ? touche.toString() : (affichage === "") ? touche.toString() : affichage + touche.toString();
        objEcran.html(affichage);
        enterReset = false;
    } else {
        switch (touche) {
            // Touche C réinitialise tout
            case "C":
            case "Escape":
                precedent = 0;
                affichage = "";
                operation = null;
                objEcran.html("0");
                enterReset = false;
                break;
            // Calculs
            case "+":
            case "-":
            case "*":
            case "/":
                // On calcule la valeur résultat de l'étape précédente
                precedent = (precedent === 0) ? parseFloat(affichage) : calculer(precedent, parseFloat(affichage), operation);
                // On met à jour l'écran
                objEcran.html(precedent);
                // On stocke l'opération
                operation = touche;
                // On réinitialise la variable d'affichage
                affichage = "";
                // La dernière touche pressée n'est pas "=" ni "Enter"
                enterReset = false;
                break;
            case "=":
            case "Enter":
                // On calcule la valeur résultat de l'étape précédente
                precedent = (precedent === 0) ? parseFloat(affichage) : calculer(precedent, parseFloat(affichage), operation);
                // On met à jour l'écran
                objEcran.html(precedent);
                // On stocke le résultat dans la variable d'affichage
                affichage = precedent;
                // On réinitialise précédent
                precedent = 0;
                // La dernière touche pressée est bien "=" ou "Enter"
                enterReset = true;
                break;
            // On gère la mémoire
            case "M+":
                // On stocke (en additionnant) à la valeur déjà en mémoire
                localStorage.memoire = (localStorage.memoire) ? parseFloat(localStorage.memoire) + parseFloat(affichage) : parseFloat(affichage);
                // On affiche le M
                objMemoire.css("display", "initial");
                break;
            case "MC":
                // On efface la mémoire
                localStorage.memoire = 0;
                // On efface le M
                objMemoire.css("display", "none");
                break;
            case "MR":
                // On récupère la valeur stockée
                memoire = (localStorage.memoire) ? parseFloat(localStorage.memoire) : 0;
                affichage = memoire;
                objEcran.html(memoire);
                break;
            default:
                break;
        }
    }
}

function calculer(nb1, nb2, operation) {
    nb1 = parseFloat(nb1);
    nb2 = parseFloat(nb2);
    let result = 0;

    switch (operation) {
        case "+":
            result = nb1 + nb2;
            break;
        case "-":
            result = nb1 - nb2;
            break;
        case "*":
            result = nb1 * nb2;
            break;
        case "/":
            result = nb1 / nb2;
            break;
        default:
            break;
    }
    return result;
}
