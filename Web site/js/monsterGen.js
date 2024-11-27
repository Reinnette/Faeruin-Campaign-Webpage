// JavaScript Document
GetEnemiesBlock();

function GetEnemiesBlock(){
    let allEnimiesStatBlocks = document.getElementsByClassName("bloc");

    for(let count = 0; count < allEnimiesStatBlocks.length; count++){
        GenerateEnemyCode(count, allEnimiesStatBlocks[count].getElementsByClassName("jaune")[0].getElementsByTagName("div")[0]);
    }
}

function GenerateEnemyCode(count, EnemyStats){

    let text = "EnimiesList["+ count + "] = new Enemy(";//""Name"", 999, 999, new Speeds(20,50,0), new Stats(10,14,10,11,12,11), [""N/A""], [""N/A""], [""N/A""], [""N/A""], [""N/A""], 999, [""], [""]);"

    const enemyName = EnemyStats.getElementsByTagName("h1")[0].innerText;
    text += "\"" + enemyName + "\", ";  

    let innerStats = EnemyStats.getElementsByClassName("red")[0];
    let baseStats = innerStats.getElementsByClassName("carac");
    
    let stats = "new Stats(";

    for(let count = 0; baseStats.length > 0; count++){
        let statValue = baseStats[0].innerText.substring(4,6);
        stats += statValue;
        
        if(baseStats.length != 1){stats+=",";}

        baseStats[0].remove();
    }
    stats += "),";

    baseStats = innerStats.innerText.split("\n");
    
    let hasST = false;
    let index = 0;
    let currentSearch = "Armor Class";
    baseStats.forEach(child =>{if(child.includes(currentSearch)) {hasST=true; index = baseStats.indexOf(child);}});
    if(hasST){ text += baseStats[index].split(currentSearch)[1].split(" ")[1] + ", "; }else{text += "N/A, ";}
    hasST = false;

    currentSearch = "Hit Points";
    baseStats.forEach(child =>{if(child.includes(currentSearch)) {hasST=true; index = baseStats.indexOf(child);}});
    if(hasST){ text += baseStats[index].split(currentSearch)[1].split(" ")[1] + ", "; }else{text += "N/A, ";}
    hasST = false;

    currentSearch = "Speed";
    baseStats.forEach(child =>{if(child.includes(currentSearch)) {hasST=true; index = baseStats.indexOf(child);}});
    if(hasST){ text += baseStats[index].split(currentSearch)[1].split(" ")[1] + ", " + stats; }else{text += "N/A, "+ stats;}
    hasST = false;

    currentSearch = "Damage Resistances";
    baseStats.forEach(child =>{if(child.includes(currentSearch)) {hasST=true; index = baseStats.indexOf(child);}});
    if(hasST){ text += "[\"" + baseStats[index].split(currentSearch)[1] + "\"], "; }else{text += "[\"N/A\"], ";}
    hasST = false;

    currentSearch = "Damage Immunities";
    baseStats.forEach(child =>{if(child.includes(currentSearch)) {hasST=true; index = baseStats.indexOf(child);}});
    if(hasST){ text += "[\"" + baseStats[index].split(currentSearch)[1] + "\"], "; }else{text += "[\"N/A\"], ";}
    hasST = false;

    currentSearch = "Condition Immunities";
    baseStats.forEach(child =>{if(child.includes(currentSearch)) {hasST=true; index = baseStats.indexOf(child);}});
    if(hasST){ text += "[\"" + baseStats[index].split(currentSearch)[1] + "\"], "; }else{text += "[\"N/A\"], ";}
    hasST = false;

    currentSearch = "Saving Throws";
    baseStats.forEach(child =>{if(child.includes(currentSearch)) {hasST=true; index = baseStats.indexOf(child);}});
    if(hasST){ text += "[\"" + baseStats[index].split(currentSearch)[1] + "\"], "; }else{text += "[\"N/A\"], ";}
    hasST = false;
        
    currentSearch = "Skills";
    baseStats.forEach(child =>{if(child.includes(currentSearch)) {hasST=true; index = baseStats.indexOf(child);}});
    if(hasST){ text += "[\"" + baseStats[index].split(currentSearch)[1] + "\"],"; }else{text += "[\"N/A\"], ";}
    hasST = false;

    currentSearch = "Senses ";
    baseStats.forEach(child =>{if(child.includes(currentSearch)) {hasST=true; index = baseStats.indexOf(child);}});
    if(hasST){ text += "[\"" + baseStats[index].split(currentSearch)[1] + "\"], "; }else{text += "[\"N/A\"], ";}
    hasST = false;

    currentSearch = "Languages ";
    baseStats.forEach(child =>{if(child.includes(currentSearch)) {hasST=true; index = baseStats.indexOf(child);}});
    if(hasST){ text += "[\"" + baseStats[index].split(currentSearch)[1] + "\"], "; }else{text += "[\"N/A\"], ";}
    hasST = false;

    currentSearch = "Challenge ";
    baseStats.forEach(child =>{if(child.includes(currentSearch)) {hasST=true; index = baseStats.indexOf(child);}});
    if(hasST){ text += "[\"" + baseStats[index].split(currentSearch)[1] + "\"], "; }else{text += "[\"N/A\"], ";}
    hasST = false;

    let abilities = EnemyStats.getElementsByClassName("sansSerif")[0].children;

    text += " [";

    let isActions = false;
    let hasAbility = false;
    for(let count = 4; count < abilities.length; count++){

        if(abilities[count].innerText.includes("Actions")){
            if(hasAbility){
                text = text.substring(0,text.length-1);
            }

            text += "], [";
            isActions=true;
        }

        if(abilities[count].nodeName != "P"){continue;}

        let abilityName = abilities[count].innerText.split(".")[0];

        if (isActions && abilityName != ""){
            text += "GetAction(\"" + abilityName + "\")";
            if(count != abilities.length-1){text += ",";}
        } else if (abilityName != ""){
            hasAbility = true;
            text += "GetAbility(\"" + abilityName + "\"),";
        }
    }
    
    text += "]); ";


    let statHeaderRow = document.createElement("p");
    statHeaderRow.innerHTML = text;
    document.getElementsByClassName("cols2")[0].appendChild(statHeaderRow);
}