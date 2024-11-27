const elements = ["p", "p", "hr", "p", "p", "p", "hr", "table", "hr", "p", "p", "p", "p", "hr", "p", "br", "p", "hr", "p"];
const elmText = ["Name", "Alignment", "", "Armor Class", "Hit Points", "Speed", "", "", "", "Damage Resistances", "Damage Immunities", "Condition Immunities", "Senses", "Languages", "Challenge", "", "Abilities",  "", "Actions", "Action1"];
const stats = ["STR","DEX","CON","INT","WIS","CHA"];
let EnimiesList = [];
let AbilitiesList = [];
let ActionsList = [];
const dmgTypes = ["Bludgeoning", "Piercing", "Slashing", "Fire", "Lightning", "Thunder", "Posion"];
const dmgTypesMagical = ["Bludgeoning(non-Magical)", "Piercing(non-Magical)", "Slashing(non-Magical)", "Fire(non-Magical)", "Lightning(non-Magical)", "Thunder(non-Magical)", "Posion(non-Magical)"];
const conditions = ["exhaustion", "grappled", "paralyzed", "petrified", "poisoned", "prone", "restrained", "unconscious"];

let CombineListText = "";



DefineAbilities();
DefineActions();
DefineEnemy();
GenerateAllStatBlocks();

function GenerateAllStatBlocks(){
    for (let count = 0; count < EnimiesList.length; count++) {
        GenerateStatBlock(EnimiesList[count]);
    }
}

function GenerateStatBlock(Enemy) {
    let parentElm = document.getElementsByTagName("main")[0];

    let mainDivElm = document.createElement("div");
    parentElm.appendChild(mainDivElm);

    //This adds the brown bar at the top of the stat block
    mainDivElm.appendChild(GenerateElement("hr", "stat-block-cap", ""));

    let statBlockMain = GenerateElement("div", "stat-block-main", "");
    mainDivElm.appendChild(statBlockMain);

    for (let count = 0; count < elements.length; count++) {
        if ((count == 10 || count == 11) && elmText[11] == null) {continue;}

        let statBlockText = GenerateElement(elements[count],"",GetFullText(elmText[count], Enemy));

        statBlockMain.appendChild(statBlockText);

        if(elements[count] == "table"){
            GenerateStatRow(statBlockText,"th",Enemy);
            GenerateStatRow(statBlockText,"td",Enemy);
        }
    }

    //This adds the brown bar at the top of the stat block
    mainDivElm.appendChild(GenerateElement("hr","stat-block-cap",""));
}  

function GenerateStatRow(parent,type,Enemy){
    let statHeaderRow = document.createElement("tr");
    parent.appendChild(statHeaderRow);
    
    for (let statsCount = 0; statsCount < 6; statsCount++) {
        statHeaderRow.appendChild(GenerateElement(type, "", "")).appendChild(GenerateElement("p", "", type == "th" ? stats[statsCount] : GetFullText(stats[statsCount], Enemy)));
    }
}

function GenerateElement(type,elmStyle,text){
    let newElm = document.createElement(type);
    
    if(elmStyle != ""){newElm.classList.add(elmStyle);}

    if(text != ""){newElm.innerHTML = text;}

    return newElm;
} 


function GetFullText(text, Enemy){
    CombineListText = "";
    if (text == elmText[0]) {
        return text + ": " + Enemy.Name;
    } else if (text == elmText[1]) {
        return text + ": ";
    } else if (text == elmText[3]) {
        return text + ": " + Enemy.AC;
    } else if (text == elmText[4]) {
        return text + ": " + Enemy.HP;
    } else if (text == elmText[5]) {
        return text + ": " + Enemy.Speed.Walk + "ft., fly " + Enemy.Speed.Fly + "ft., climb " + Enemy.Speed.Climb + "ft., swim " + Enemy.Speed.Swim + "ft."
    } else if (text == elmText[9]) {
        return (Enemy.ConImmList == null ? "Saving Throws" : text) + ": " + Enemy.DmgResList;
    } else if (text == elmText[10]) {
        return (Enemy.ConImmList == null ? "Skills" : text) + ": " + Enemy.DmgImmList;
    } else if (text == elmText[11]) {
        return text + ": " + Enemy.ConImmList;
    } else if (text == elmText[12]) {
        return text + ": " + Enemy.SensesList;
    } else if (text == elmText[13]) {
        return text + ": " + Enemy.LanguagesList;
    } else if (text == elmText[14]) {
        return text + ": " + Enemy.CR;
    } else if (text == elmText[16]) {
        if(Enemy.AbilitiesList == null){return text;}       

        if(Enemy.AbilitiesList.constructor == Array && Enemy.AbilitiesList.length >= 1){
            Enemy.AbilitiesList.forEach(CombineAbilityList);
        }else{
            CombineListText = CombineAbilityList(Enemy.AbilitiesList[0]);
        }
        
        return text + ": " + CombineListText;
    } else if (text == elmText[18]) {
        if(Enemy.ActList == null){return text;}        

        if(Enemy.ActList.constructor == Array && Enemy.ActList.length > 1){
            Enemy.ActList.forEach(CombineActionList);
        }else{
            CombineListText = CombineActionList(Enemy.ActList[0]);
        }
        
        return text + ": " + CombineListText;
    } else if (text == stats[0]) {
        return Enemy.Stats.STR;
    } else if (text == stats[1]) {
        return Enemy.Stats.DEX;
    } else if (text == stats[2]) {
        return Enemy.Stats.CON;
    } else if (text == stats[3]) {
        return Enemy.Stats.INT;
    } else if (text == stats[4]) {
        return Enemy.Stats.WIS;
    } else if (text == stats[5]) {
        return Enemy.Stats.CHA;
    } else {
        return text;
    }
}

function CombineAbilityList(item){
    if (item == null) {
        return;
    }

    return CombineListText = CombineListText + "<br><br><b>" + item.Name + "</b>: " + item.Desc;
}

function CombineActionList(item){
    if(item == null){return;}

    if(item.toHit != null)
    {
        CombineListText = CombineListText + "<br><br><b>" + item.Name + "</b> " + item.Desc + ": +" + item.toHit + " to hit, reach " + item.Reach + " ft., Hit:" + item.DmgDie + " "+ item.DmgType + " Damage";
    }
    else{
        CombineListText = CombineListText + "<br><br><b>" + item.Name + "</b>: " + item.Desc
    }


    return CombineListText;
}

function DefineAbilities(){
    AbilitiesList[0] = new Abilities("Air Form", "The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 inch wide without squeezing.");
    AbilitiesList[1] = new Abilities("Dive Attack", "If the aarakocra is flying and dives at least 30 feet straight toward a target and then hits it with a melee weapon attack, the attack deals an extra 3 (1d6) damage to the target.");
    AbilitiesList[2] = new Abilities("Amphibious", "The aboleth can breathe air and water.");
    AbilitiesList[3] = new Abilities("Mucous Cloud", "While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or that hits it with a melee attack while within 5 feet of it must make a DC 14 Constitution saving throw. On a failure, the creature is diseased for 1d4 hours. The diseased creature can breathe only underwater.");
    AbilitiesList[4] = new Abilities("Probing Telepathy", "If a creature communicates telepathically with the aboleth, the aboleth learns the creature's greatest desires if the aboleth can see the creature.");

    //AbilitiesList[1] = new Abilities("", "");
}

function DefineActions(){
    ActionsList[0] = new Actions("Multiattack2", "Uses Two base attack (Attacks that dont recharge)",null,null,null,null,null,null);
    ActionsList[1] = new Actions("Multiattack3", "Uses Three base attack (Attacks that dont recharge)",null,null,null,null,null,null);
    ActionsList[2] = new Actions("Multiattack4", "Uses Four base attack (Attacks that dont recharge)",null,null,null,null,null,null);
    ActionsList[3] = new Actions("Slam", "Melee Weapon Attack",8,5,14,"Bludgeoning",null,null);
    ActionsList[4] = new Actions("Whirlwind", "(Recharge 4-6) Each creature in the creatures space must make a DC 13 Strength saving throw. On a failure, a target takes 15 (3d8 + 2) bludgeoning damage and is flung up 20 feet away from the elemental in a random direction and knocked prone. If a thrown target strikes an object, such as a wall or floor, the target takes 3 (1d6) bludgeoning damage for every 10 feet it was thrown. If the target is thrown at another creature, that creature must succeed on a DC 13 Dexterity saving throw or take the same damage and be knocked prone. If the saving throw is successful, the target takes half the bludgeoning damage and isn't flung away or knocked prone.",null,null,null,null,null,null);
    ActionsList[5] = new Actions("Talon", "Melee Weapon Attack",4,5,4,"Slashing",null,null);
    ActionsList[6] = new Actions("Javelin", "Melee or Ranged Weapon Attack",4,5,5,"Piercing",null,null);
    ActionsList[7] = new Actions("Tentacle", "Desc",999,999,999,"",null,null);
    ActionsList[8] = new Actions("Tail", "Melee Weapon Attack",9,10,15,"Bludgeoning",null,null);

    //ActionsList[99] = new Actions("Name", "Desc",999,999,999,"",null,null);
}

function DefineEnemy(){
    EnimiesList[0] = new Enemy("Aarakocra", 12, 13, 20, new Stats(10,14,10,11,12,11),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +5"],["passive Perception 15"], ["Auran, Aarakocra"], ["1/4 (50 XP)"], [GetAbility("Dive Attack")], [GetAction("Talon"),GetAction("Javelin")]);

EnimiesList[1] = new Enemy("Aboleth", 17, 135, 10, new Stats(21,9 ,15,18,15,18),["N/A"], ["N/A"], ["N/A"], [" Con +6, Int +8, Wis +6"], [" History +12, Perception +10"],["darkvision 120 ft., passive Perception 20"], ["Deep Speech, telepathy 120 ft."], ["10 (5900 XP)"], [GetAbility("Amphibious"),GetAbility("Mucous Cloud"),GetAbility("Probing Telepathy")], [GetAction("Multiattack"),GetAction("Tentacle"),GetAction("Tail"),GetAction("Enslave (3/Day)"),GetAction("The aboleth can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Swipe")], [GetAction("Psychic Drain (Costs 2 Actions)")]);

EnimiesList[2] = new Enemy("Abominable Yeti", 15, 137, 40, new Stats(24,10,22,9 ,13,9 ),["N/A"], [" cold"], ["N/A"], ["N/A"], [" Perception +5, Stealth +4"],["darkvision 60 ft., passive Perception 15"], ["Yeti"], ["9 (5000 XP)"], [GetAbility("Fear of Fire"),GetAbility("Keen Smell"),GetAbility("Snow Camouflage")], [GetAction("Multiattack"),GetAction("Claw"),GetAction("Chilling Gaze"),GetAction("Cold Breath (Recharge 6)")]);

EnimiesList[3] = new Enemy("Acolyte", 10, 9, 30, new Stats(10,10,10,10,14,11),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Medicine +4, Religion +2"],["passive Perception 12"], ["any one language (usually Common)"], ["1/4 (50 XP)"], [GetAbility("Spellcasting")], [GetAction("Club")]);

EnimiesList[4] = new Enemy("Adult Black Dragon", 19, 195, 40, new Stats(23,14,21,14,13,17),["N/A"], [" acid"], ["N/A"], [" Dex +7, Con +10, Wis +6, Cha +8"], [" Perception +11, Stealth +7"],["blindsight 60 ft., darkvision 120 ft., passive Perception 21"], ["Common, Draconic"], ["14 (11500 XP)"], [GetAbility("Amphibious"),GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Acid Breath (Recharge 5-6)"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[5] = new Enemy("Adult Blue Dracolich", 19, 225, 40, new Stats(25,10,23,16,15,19),[" necrotic"], [" lightning, poison"], [" charmed, exhaustion, frightened, paralyzed, poisoned"], [" Dex +6, Con +12, Wis +8, Cha +10"], [" Perception +14, Stealth +6"],["blindsight 60 ft., darkvision 120 ft., passive Perception 24"], ["Common, Draconic"], ["17 (18000 XP)"], [GetAbility("Legendary Resistance (3/Day)"),GetAbility("Magic Resistance")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Lightning Breath (Recharge 5–6)"),GetAction("The dracolich can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[6] = new Enemy("Adult Blue Dragon", 19, 225, 40, new Stats(25,10,23,16,15,19),["N/A"], [" lightning"], ["N/A"], [" Dex +5, Con +11, Wis +7, Cha +9"], [" Perception +12, Stealth +5"],["blindsight 60 ft., darkvision 120 ft., passive Perception 22"], ["Common, Draconic"], ["16 (15000 XP)"], [GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Lightning Breath (Recharge 5-6)"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[7] = new Enemy("Adult Brass Dragon", 18, 172, 40, new Stats(23,10,21,14,13,17),["N/A"], [" fire"], ["N/A"], [" Dex +5, Con +10, Wis +6, Cha +8"], [" History +7, Perception +11, Persuasion +8, Stealth +5"],["blindsight 60 ft., darkvision 120 ft., passive Perception 21"], ["Common, Draconic"], ["13 (10000 XP)"], [GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Fire Breath"),GetAction("Sleep Breath"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[8] = new Enemy("Adult Bronze Dragon", 19, 212, 40, new Stats(25,10,23,16,15,19),["N/A"], [" lightning"], ["N/A"], [" Dex +5, Con +11, Wis +7, Cha +9"], [" Insight +7, Perception +12, Stealth +5"],["blindsight 60 ft., darkvision 120 ft., passive Perception 22"], ["Common, Draconic"], ["15 (13000 XP)"], [GetAbility("Amphibious"),GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Lightning Breath"),GetAction("Repulsion Breath"),GetAction("Change Shape"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[9] = new Enemy("Adult Copper Dragon", 18, 184, 40, new Stats(23,12,21,18,15,17),["N/A"], [" acid"], ["N/A"], [" Dex +6, Con +10, Wis +7, Cha +8"], [" Deception +8, Perception +12, Stealth +6"],["blindsight 60 ft., darkvision 120 ft., passive Perception 22"], ["Common, Draconic"], ["14 (11500 XP)"], [GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Acid Breath"),GetAction("Slowing Breath"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[10] = new Enemy("Adult Gold Dragon", 19, 256, 40, new Stats(27,14,25,16,15,24),["N/A"], [" fire"], ["N/A"], [" Dex +8, Con +13, Wis +8, Cha +13"], [" Insight +8, Perception +14, Persuasion +13, Stealth +8"],["blindsight 60 ft., darkvision 120 ft., passive Perception 24"], ["Common, Draconic"], ["17 (18000 XP)"], [GetAbility("Amphibious"),GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Fire Breath"),GetAction("Weakening Breath"),GetAction("Change Shape"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[11] = new Enemy("Adult Green Dragon", 19, 207, 40, new Stats(23,12,21,18,15,17),["N/A"], [" poison"], [" poisoned"], [" Dex +6, Con +10, Wis +7, Cha +8"], [" Deception +8, Insight +7, Perception +12, Persuasion +8, Stealth +6"],["blindsight 60 ft., darkvision 120 ft., passive Perception 22"], ["Common, Draconic"], ["15 (13000 XP)"], [GetAbility("Amphibious"),GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Poison Breath (Recharge 5-6)"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[12] = new Enemy("Adult Red Dragon", 19, 256, 40, new Stats(27,10,25,16,13,21),["N/A"], [" fire"], ["N/A"], [" Dex +6, Con +13, Wis +7, Cha +11"], [" Perception +13, Stealth +6"],["blindsight 60 ft., darkvision 120 ft., passive Perception 23"], ["Common, Draconic"], ["17 (18000 XP)"], [GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Fire Breath (Recharge 5-6)"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[13] = new Enemy("Adult Silver Dragon", 19, 243, 40, new Stats(27,10,25,16,13,21),["N/A"], [" cold"], ["N/A"], [" Dex +5, Con +12, Wis +6, Cha +10"], [" Arcana +8, History +8, Perception +11, Stealth +5"],["blindsight 60 ft., darkvision 120 ft., passive Perception 21"], ["Common, Draconic"], ["16 (15000 XP)"], [GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Cold Breath"),GetAction("Paralyzing Breath"),GetAction("Change Shape"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[14] = new Enemy("Adult White Dragon", 18, 200, 40, new Stats(22,10,22,8 ,12,12),["N/A"], [" cold"], ["N/A"], [" Dex +5, Con +11, Wis +6, Cha +6"], [" Perception +11, Stealth +5"],["blindsight 60 ft., darkvision 120 ft., passive Perception 21"], ["Common, Draconic"], ["13 (10000 XP)"], [GetAbility("Ice Walk"),GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Cold Breath (Recharge 5-6)"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[15] = new Enemy("Air Elemental", 15, 90, 0, new Stats(14,20,14,6 ,10,6 ),[" lightning, thunder; bludgeoning, piercing, and slashing from nonmagical attacks"], [" poison"], [" exhaustion, grappled, paralyzed, petrified, poisoned, prone, restrained, unconscious"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["Auran"], ["5 (1800 XP)"], [GetAbility("Air Form")], [GetAction("Multiattack"),GetAction("Slam"),GetAction("Whirlwind (Recharge 4-6)")]);

EnimiesList[16] = new Enemy("Allosaurus", 13, 51, 60, new Stats(19,13,17,2 ,12,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +5"],["passive Perception 15"], ["—"], ["2 (450 XP)"], [GetAbility("Pounce")], [GetAction("Bite"),GetAction("Claw")]);

EnimiesList[17] = new Enemy("Ancient Black Dragon", 22, 367, 40, new Stats(27,14,25,16,15,19),["N/A"], [" acid"], ["N/A"], [" Dex +9, Con +14, Wis +9, Cha +11"], [" Perception +16, Stealth +9"],["blindsight 60 ft., darkvision 120 ft., passive Perception 26"], ["Common, Draconic"], ["21 (33000 XP)"], [GetAbility("Amphibious"),GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Acid Breath (Recharge 5-6)"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[18] = new Enemy("Ancient Blue Dragon", 22, 481, 40, new Stats(29,10,27,18,17,21),["N/A"], [" lightning"], ["N/A"], [" Dex +7, Con +15, Wis +10, Cha +12"], [" Perception +17, Stealth +7"],["blindsight 60 ft., darkvision 120 ft., passive Perception 27"], ["Common, Draconic"], ["23 (50000 XP)"], [GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Lightning Breath (Recharge 5-6)"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[19] = new Enemy("Ancient Brass Dragon", 20, 297, 40, new Stats(27,10,25,16,15,19),["N/A"], [" fire"], ["N/A"], [" Dex +6, Con +13, Wis +8, Cha +10"], [" History +9, Perception +14, Persuasion +10, Stealth +6"],["blindsight 60 ft., darkvision 120 ft., passive Perception 24"], ["Common, Draconic"], ["20 (25000 XP)"], [GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Fire Breath"),GetAction("Sleep Breath"),GetAction("Change Shape"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[20] = new Enemy("Ancient Bronze Dragon", 22, 444, 40, new Stats(29,10,27,18,17,21),["N/A"], [" lightning"], ["N/A"], [" Dex +7, Con +15, Wis +10, Cha +12"], [" Insight +10, Perception +17, Stealth +7"],["blindsight 60 ft., darkvision 120 ft., passive Perception 27"], ["Common, Draconic"], ["22 (41000 XP)"], [GetAbility("Amphibious"),GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Lightning Breath"),GetAction("Repulsion Breath"),GetAction("Change Shape"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[21] = new Enemy("Ancient Copper Dragon", 21, 350, 40, new Stats(27,12,25,20,17,19),["N/A"], [" acid"], ["N/A"], [" Dex +8, Con +14, Wis +10, Cha +11"], [" Deception +11, Perception +17, Stealth +8"],["blindsight 60 ft., darkvision 120 ft., passive Perception 27"], ["Common, Draconic"], ["21 (33000 XP)"], [GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Acid Breath"),GetAction("Slowing Breath"),GetAction("Change Shape"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[22] = new Enemy("Ancient Gold Dragon", 22, 546, 40, new Stats(30,14,29,18,17,28),["N/A"], [" fire"], ["N/A"], [" Dex +9, Con +16, Wis +10, Cha +16"], [" Insight +10, Perception +17, Persuasion +16, Stealth +9"],["blindsight 60 ft., darkvision 120 ft., passive Perception 27"], ["Common, Draconic"], ["24 (62000 XP)"], [GetAbility("Amphibious"),GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Fire Breath"),GetAction("Weakening Breath"),GetAction("Change Shape"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[23] = new Enemy("Ancient Green Dragon", 21, 385, 40, new Stats(27,12,25,20,17,19),["N/A"], [" poison"], [" poisoned"], [" Dex +8, Con +14, Wis +10, Cha +11"], [" Deception +11, Insight +10, Perception +17, Persuasion +11, Stealth +8"],["blindsight 60 ft., darkvision 120 ft., passive Perception 27"], ["Common, Draconic"], ["22 (41000 XP)"], [GetAbility("Amphibious"),GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Poison Breath (Recharge 5-6)"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[24] = new Enemy("Ancient Red Dragon", 22, 546, 40, new Stats(30,10,29,18,15,23),["N/A"], [" fire"], ["N/A"], [" Dex +7, Con +16, Wis +9, Cha +13"], [" Perception +16, Stealth +7"],["blindsight 60 ft., darkvision 120 ft., passive Perception 26"], ["Common, Draconic"], ["24 (62000 XP)"], [GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Fire Breath (Recharge 5-6)"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[25] = new Enemy("Ancient Silver Dragon", 22, 487, 40, new Stats(30,10,29,18,15,23),["N/A"], [" cold"], ["N/A"], [" Dex +7, Con +16, Wis +9, Cha +13"], [" Arcana +11, History +11, Perception +16, Stealth +7"],["blindsight 60 ft., darkvision 120 ft., passive Perception 26"], ["Common, Draconic"], ["23 (50000 XP)"], [GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Cold Breath"),GetAction("Paralyzing Breath"),GetAction("Change Shape"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[26] = new Enemy("Ancient White Dragon", 20, 333, 40, new Stats(26,10,26,10,13,14),["N/A"], [" cold"], ["N/A"], [" Dex +6, Con +14, Wis +7, Cha +8"], [" Perception +13, Stealth +6"],["blindsight 60 ft., darkvision 120 ft., passive Perception 23"], ["Common, Draconic"], ["20 (25000 XP)"], [GetAbility("Ice Walk"),GetAbility("Legendary Resistance (3/Day)")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Cold Breath (Recharge 5-6)"),GetAction("The dragon can take 3 legendary actions, choosing from the options below"),GetAction("Detect"),GetAction("Tail Attack")], [GetAction("Wing Attack (Costs 2 Actions)")]);

EnimiesList[27] = new Enemy("Androsphinx", 17, 199, 40, new Stats(22,10,20,16,18,23),["N/A"], [" psychic; bludgeoning, piercing and slashing from nonmagical attacks"], [" charmed, frightened"], [" Dex +6, Con +11, Int +9, Wis +10"], [" Arcana +9, Perception +10, Religion +15"],["truesight 120 ft., passive Perception 20"], ["Common, Sphinx"], ["17 (18000 XP)"], [GetAbility("Inscrutable"),GetAbility("Magic Weapons"),GetAbility("Spellcasting")], [GetAction("Multiattack"),GetAction("Claw"),GetAction("Roar (3/Day)"),GetAction("First Roar"),GetAction("Second Roar"),GetAction("Third Roar"),GetAction("The sphinx can take 3 legendary actions, choosing from the options below"),GetAction("Claw Attack")], [GetAction("Teleport (Costs 2 Actions)")], [GetAction("Cast a Spell (Costs 3 Actions)")]);

EnimiesList[28] = new Enemy("Animated Armor", 18, 33, 25, new Stats(14,11,13,1 ,3 ,1 ),["N/A"], [" poison, psychic"], [" blinded, charmed, deafened, exhaustion, frightened, paralyzed, petrified, poisoned"], ["N/A"], ["N/A"], ["blindsight 60 ft. (blind beyond this radius), passive Perception 6"], ["—"], ["1 (200 XP)"], [GetAbility("Antimagic Susceptibility"),GetAbility("False")], [GetAction("Multiattack"),GetAction("Slam")]);

EnimiesList[29] = new Enemy("Ankheg", 14, 39, 30, new Stats(17,11,13,1 ,13,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., tremorsense 60 ft., passive Perception 11"], ["—"], ["2 (450 XP)"], [], [GetAction("Bite"),GetAction("Acid Spray (Recharge 6)")]);

EnimiesList[30] = new Enemy("Ankylosaurus", 15, 68, 30, new Stats(19,11,15,2 ,12,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 11"], ["—"], ["3 (700 XP)"], [], [GetAction("Tail")]);

EnimiesList[31] = new Enemy("Ape", 12, 19, 30, new Stats(16,14,14,6 ,12,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Athletics +5, Perception +3"],["passive Perception 13"], ["—"], ["1/2 (100 XP)"], [], [GetAction("Multiattack"),GetAction("Fist"),GetAction("Rock")]);

EnimiesList[32] = new Enemy("Arcanaloth", 17, 104, 30, new Stats(17,12,14,20,16,17),[" cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks"], [" acid, poison"], [" charmed, poisoned"], [" Dex +5, Int +9, Wis +7, Cha +7"], [" Arcana +13, Deception +9, Insight +9, Perception +7"],["truesight 120 ft., passive Perception 17"], ["all, telepathy 120 ft."], ["12 (8400 XP)"], [GetAbility("Innate Spellcasting"),GetAbility("Magic Resistance"),GetAbility("Magic Weapons"),GetAbility("Spellcasting")], [GetAction("Claws"),GetAction("Teleport")]);

EnimiesList[33] = new Enemy("Archmage", 12, 99, 30, new Stats(10,14,12,20,15,16),[" damage from spells; nonmagical bludgeoning, piercing, and slashing (from stoneskin)"], ["N/A"], ["N/A"], [" Int +9, Wis +6"], [" Arcana +13, History +13"],["passive Perception 12"], ["any six languages"], ["12 (8400 XP)"], [GetAbility("Magic Resistance"),GetAbility("Spellcasting"),GetAbility("* The archmage casts these spells on itself before combat")], [GetAction("Dagger")]);

EnimiesList[34] = new Enemy("Assassin", 15, 78, 30, new Stats(11,16,14,13,11,10),[" poison"], ["N/A"], ["N/A"], [" Dex +6, Int +4"], [" Acrobatics +6, Deception +3, Perception +3, Stealth +9"],["passive Perception 13"], ["Thieves' cant plus any two languages"], ["8 (3900 XP)"], [GetAbility("Assassinate"),GetAbility("Evasion"),GetAbility("Sneak Attack")], [GetAction("Multiattack"),GetAction("Shortsword"),GetAction("Light Crossbow")]);

EnimiesList[35] = new Enemy("Awakened Shrub", 9, 10, 20, new Stats(3 ,8 ,11,10,10,6 ),[" piercing"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 10"], ["one language known by its creator"], ["0 (10 XP)"], [GetAbility("False Appearance")], [GetAction("Rake")]);

EnimiesList[36] = new Enemy("Awakened Tree", 13, 59, 20, new Stats(19,6 ,15,10,10,7 ),[" bludgeoning, piercing"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 10"], ["one language known by its creator"], ["2 (450 XP)"], [GetAbility("False Appearance")], [GetAction("Slam")]);

EnimiesList[37] = new Enemy("Axe Beak", 11, 19, 50, new Stats(14,12,12,2 ,10,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 10"], ["—"], ["1/4 (50 XP)"], [], [GetAction("Beak")]);

EnimiesList[38] = new Enemy("Azer", 17, 39, 30, new Stats(17,12,15,12,13,10),["N/A"], [" fire, poison"], [" poisoned"], [" Con +4"], ["N/A"], ["passive Perception 11"], ["Ignan"], ["2 (450 XP)"], [GetAbility("Heated Body"),GetAbility("Heated Weapons"),GetAbility("Illumination")], [GetAction("Warhammer")]);

EnimiesList[39] = new Enemy("Baboon", 12, 3, 30, new Stats(8 ,14,11,4 ,12,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 11"], ["—"], ["0 (10 XP)"], [GetAbility("Pack Tactics")], [GetAction("Bite")]);

EnimiesList[40] = new Enemy("Badger", 10, 3, 20, new Stats(4 ,11,12,2 ,12,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 30 ft., passive Perception 11"], ["—"], ["0 (10 XP)"], [GetAbility("Keen Smell")], [GetAction("Bite")]);

EnimiesList[41] = new Enemy("Balor", 19, 262, 40, new Stats(26,15,22,20,16,22),[" cold, lightning; bludgeoning, piercing, and slashing from nonmagical attacks"], [" fire, poison"], [" poisoned"], [" Str +14, Con +12, Wis +9, Cha +12"], ["N/A"], ["truesight 120 ft., passive Perception 13"], ["Abyssal, telepathy 120 ft."], ["19 (22000 XP)"], [GetAbility("Death Throes"),GetAbility("Fire Aura"),GetAbility("Magic Resistance"),GetAbility("Magic Weapons")], [GetAction("Multiattack"),GetAction("Longsword"),GetAction("Whip"),GetAction("Teleport")]);

EnimiesList[42] = new Enemy("Bandit", 12, 11, 30, new Stats(11,12,12,10,10,10),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 10"], ["any one language (usually Common)"], ["1/8 (25 XP)"], [], [GetAction("Scimitar"),GetAction("Light Crossbow")]);

EnimiesList[43] = new Enemy("Bandit Captain", 15, 65, 30, new Stats(15,16,14,14,11,14),["N/A"], ["N/A"], ["N/A"], [" Str +4, Dex +5, Wis +2"], [" Athletics +4, Deception +4"],["passive Perception 10"], ["any two languages"], ["2 (450 XP)"], [], [GetAction("Multiattack"),GetAction("Scimitar"),GetAction("Dagger"),GetAction("Parry")]);

EnimiesList[44] = new Enemy("Banshee", 12, 58, 0, new Stats(1 ,14,10,12,11,17),[" acid, fire, lightning, thunder; bludgeoning, piercing, and slashing from nonmagical attacks"], [" cold, necrotic, poison"], [" charmed, exhaustion, frightened, grappled, paralyzed, petrified, poisoned, prone, restrained"], [" Wis +2, Cha +5"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["Common, Elvish"], ["4 (1100 XP)"], [GetAbility("Detect Life"),GetAbility("Incorporeal Movement")], [GetAction("Corrupting Touch"),GetAction("Horrifying Visage"),GetAction("Wail (1/Day)")]);

EnimiesList[45] = new Enemy("Barbed Devil", 15, 110, 30, new Stats(16,17,18,12,14,14),[" cold; bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered"], [" fire, poison"], [" poisoned"], [" Str +6, Con +7, Wis +5, Cha +5"], [" Deception +5, Insight +5, Perception +8"],["darkvision 120 ft., passive Perception 18"], ["Infernal, telepathy 120 ft."], ["5 (1800 XP)"], [GetAbility("Barbed Hide"),GetAbility("Devil's Sight"),GetAbility("Magic Resistance")], [GetAction("Multiattack"),GetAction("Claw"),GetAction("Tail"),GetAction("Hurl Flame")]);

EnimiesList[46] = new Enemy("Barlgura", 15, 68, 40, new Stats(18,15,16,7 ,14,9 ),[" cold, fire, lightning"], [" poison"], [" poisoned"], [" Dex +5, Con +6"], [" Perception +5, Stealth +5"],["blindsight 30 ft., darkvision 120 ft., passive Perception 15"], ["Abyssal, telepathy 120 ft."], ["5 (1800 XP)"], [GetAbility("Innate Spellcasting"),GetAbility("Reckless"),GetAbility("Running Leap")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Fist")]);

EnimiesList[47] = new Enemy("Basilisk", 15, 52, 20, new Stats(16,8 ,15,2 ,8 ,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 9"], ["—"], ["3 (700 XP)"], [GetAbility("Petrifying Gaze")], [GetAction("Bite")]);

EnimiesList[48] = new Enemy("Bat", 12, 1, 5, new Stats(2 ,15,8 ,2 ,12,4 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["blindsight 60 ft., passive Perception 11"], ["—"], ["0 (10 XP)"], [GetAbility("Echolocation"),GetAbility("Keen Hearing")], [GetAction("Bite")]);

EnimiesList[49] = new Enemy("Bearded Devil", 13, 52, 30, new Stats(16,15,15,9 ,11,11),[" cold; bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered"], [" fire, poison"], [" poisoned"], [" Str +5, Con +4, Wis +2"], ["N/A"], ["darkvision 120 ft., passive Perception 10"], ["Infernal, telepathy 120 ft."], ["3 (700 XP)"], [GetAbility("Devil's Sight"),GetAbility("Magic Resistance"),GetAbility("Steadfast")], [GetAction("Multiattack"),GetAction("Beard"),GetAction("Glaive")]);

EnimiesList[50] = new Enemy("Behir", 17, 168, 50, new Stats(23,16,18,7 ,14,12),["N/A"], [" lightning"], ["N/A"], ["N/A"], [" Perception +6, Stealth +7"],["darkvision 90 ft., passive Perception 16"], ["Draconic"], ["11 (7200 XP)"], [], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Constrict"),GetAction("Lightning Breath (Recharge 5-6)"),GetAction("Swallow")]);

EnimiesList[51] = new Enemy("Beholder", 18, 180, 0, new Stats(10,14,18,17,15,17),["N/A"], ["N/A"], [" prone"], [" Int +8, Wis +7, Cha +8"], [" Perception +12"],["darkvision 120 ft., passive Perception 22"], ["Deep Speech, Undercommon"], ["13 (10000 XP)"], [GetAbility("Antimagic Cone")], [GetAction("Bite"),GetAction("Eye Rays"),GetAction("1- Charm Ray"),GetAction("2- Paralyzing Ray"),GetAction("3- Fear Ray"),GetAction("4- Slowing Ray"),GetAction("5- Enervation Ray"),GetAction("6- Telekinetic Ray"),GetAction("7- Sleep Ray"),GetAction("8- Petrification Ray"),GetAction("9- Disintegration Ray"),GetAction("10- Death Ray"),GetAction("The beholder can take 3 legendary actions, using the Eye Ray option below"),GetAction("Eye Ray")]);

EnimiesList[52] = new Enemy("Beholder Zombie", 15, 93, 0, new Stats(10,8 ,16,3 ,8 ,5 ),["N/A"], [" poison"], [" poisoned"], [" Wis +2"], ["N/A"], ["darkvision 60 ft., passive Perception 9"], ["understands Deep Speech and Undercommon but can't speak"], ["5 (1800 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[53] = new Enemy("Berserker", 13, 67, 30, new Stats(16,12,17,9 ,11,9 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 10"], ["any one language (usually Common)"], ["2 (450 XP)"], [GetAbility("Reckless")], [GetAction("Greataxe")]);

EnimiesList[54] = new Enemy("Black Bear", 11, 19, 40, new Stats(15,10,14,2 ,12,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3"],["passive Perception 13"], ["—"], ["1/2 (100 XP)"], [GetAbility("Keen Smell")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claws")]);

EnimiesList[55] = new Enemy("Black Dragon Wyrmling", 17, 33, 30, new Stats(15,14,13,10,11,13),["N/A"], [" acid"], ["N/A"], [" Dex +4, Con +3, Wis +2, Cha +3"], [" Perception +4, Stealth +4"],["blindsight 10 ft., darkvision 60 ft., passive Perception 14"], ["Draconic"], ["2 (450 XP)"], [GetAbility("Amphibious")], [GetAction("Bite"),GetAction("Acid Breath (Recharge 5–6)")]);

EnimiesList[56] = new Enemy("Black Pudding", 7, 85, 20, new Stats(16,5 ,16,1 ,6 ,1 ),["N/A"], [" acid, cold, lightning, slashing"], [" blinded, charmed, deafened, exhaustion, frightened, prone"], ["N/A"], ["N/A"], ["blindsight 60 ft. (blind beyond this radius), passive Perception 8"], ["—"], ["4 (1100 XP)"], [GetAbility("Amorphous"),GetAbility("Corrosive Form"),GetAbility("Spider Climb")], [GetAction("Pseudopod"),GetAction("Split")]);

EnimiesList[57] = new Enemy("Blink Dog", 13, 22, 40, new Stats(12,17,12,10,13,11),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3, Stealth +5"],["passive Perception 13"], ["Blink Dog, understands Sylvan but can't speak it"], ["1/4 (50 XP)"], [GetAbility("Keen Hearing and Smell")], [GetAction("Bite"),GetAction("Teleport (Recharge 4-6)")]);

EnimiesList[58] = new Enemy("Blood Hawk", 12, 7, 10, new Stats(6 ,14,10,3 ,14,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +4"],["passive Perception 14"], ["—"], ["1/8 (25 XP)"], [GetAbility("Keen Sight"),GetAbility("Pack Tactics")], [GetAction("Beak")]);

EnimiesList[59] = new Enemy("Blue Dragon Wyrmling", 17, 52, 30, new Stats(17,10,15,12,11,15),["N/A"], [" lightning"], ["N/A"], [" Dex +2, Con +4, Wis +2, Cha +4"], [" Perception +4, Stealth +2"],["blindsight 10 ft., darkvision 60 ft., passive Perception 14"], ["Draconic"], ["3 (700 XP)"], [], [GetAction("Bite"),GetAction("Lightning Breath (Recharge 5-6)")]);

EnimiesList[60] = new Enemy("Blue Slaad", 15, 123, 30, new Stats(20,15,18,7 ,7 ,9 ),[" acid, cold, fire, lightning, thunder"], ["N/A"], ["N/A"], ["N/A"], [" Perception + 1"],["darkvision 60 ft., passive Perception 11"], ["Slaad, telepathy 60 ft."], ["7 (2900 XP)"], [GetAbility("Magic Resistance"),GetAbility("Regeneration")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw")]);

EnimiesList[61] = new Enemy("Boar", 11, 11, 40, new Stats(13,11,12,2 ,9 ,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 9"], ["—"], ["1/4 (50 XP)"], [GetAbility("Charge"),GetAbility("Relentless (Recharges after a Short or Long Rest)")], [GetAction("Tusk")]);

EnimiesList[62] = new Enemy("Bone Devil", 19, 142, 40, new Stats(18,16,18,13,14,16),[" cold; bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered"], [" fire, poison"], [" poisoned"], [" Int +5, Wis +6, Cha +7"], [" Deception +7, Insight +6"],["darkvision 120 ft., passive Perception 12"], ["Infernal, telepathy 120 ft."], ["9 (5000 XP)"], [GetAbility("Devil's Sight"),GetAbility("Magic Resistance")], [GetAction("Multiattack"),GetAction("Claw"),GetAction("Sting")]);

EnimiesList[63] = new Enemy("Bone Naga", 15, 58, 30, new Stats(15,16,12,15,15,16),["N/A"], [" poison"], [" charmed, exhaustion, paralyzed, poisoned"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 12"], ["Common plus one other language"], ["4 (1100 XP)"], [GetAbility("Spellcasting")], [GetAction("Bite")]);

EnimiesList[64] = new Enemy("Brass Dragon Wyrmling", 16, 16, 30, new Stats(15,10,13,10,11,13),["N/A"], [" fire"], ["N/A"], [" Dex +2, Con +3, Wis +2, Cha +3"], [" Perception +4, Stealth +2"],["blindsight 10 ft., darkvision 60 ft., passive Perception 14"], ["Draconic"], ["1 (200 XP)"], [], [GetAction("Bite"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Fire Breath"),GetAction("Sleep Breath")]);

EnimiesList[65] = new Enemy("Bronze Dragon Wyrmling", 17, 32, 30, new Stats(17,10,15,12,11,15),["N/A"], [" lightning"], ["N/A"], [" Dex +2, Con +4, Wis +2, Cha +4"], [" Perception +4, Stealth +2"],["blindsight 10 ft., darkvision 60 ft., passive Perception 14"], ["Draconic"], ["2 (450 XP)"], [GetAbility("Amphibious")], [GetAction("Bite"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Lightning Breath"),GetAction("Repulsion Breath")]);

EnimiesList[66] = new Enemy("Brown Bear", 11, 34, 40, new Stats(19,10,16,2 ,13,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3"],["passive Perception 13"], ["—"], ["1 (200 XP)"], [GetAbility("Keen Smell")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claws")]);

EnimiesList[67] = new Enemy("Bugbear", 16, 27, 30, new Stats(15,14,13,8 ,11,9 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Stealth +6, Survival +2"],["darkvision 60 ft., passive Perception 10"], ["Common, Goblin"], ["1 (200 XP)"], [GetAbility("Brute"),GetAbility("Surprise Attack")], [GetAction("Morningstar"),GetAction("Javelin")]);

EnimiesList[68] = new Enemy("Bugbear Chief", 17, 65, 30, new Stats(17,14,14,11,12,11),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Intimidation +2, Stealth +6, Survival +3"],["darkvision 60 ft., passive Perception 11"], ["Common, Goblin"], ["3 (700 XP)"], [GetAbility("Brute"),GetAbility("Heart of Hruggek"),GetAbility("Surprise Attack")], [GetAction("Multiattack"),GetAction("Morningstar"),GetAction("Javelin")]);

EnimiesList[69] = new Enemy("Bulette", 17, 94, 40, new Stats(19,11,21,2 ,10,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +6"],["darkvision 60 ft., tremorsense 60 ft., passive Perception 16"], ["—"], ["5 (1800 XP)"], [GetAbility("Standing Leap")], [GetAction("Bite"),GetAction("Deadly Leap")]);

EnimiesList[70] = new Enemy("Bullywug", 15, 11, 20, new Stats(12,12,13,7 ,10,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Stealth +3"],["passive Perception 10"], ["Bullywug"], ["1/4 (50 XP)"], [GetAbility("Amphibious"),GetAbility("Speak with Frogs and Toads"),GetAbility("Swamp Camouflage"),GetAbility("Standing Leap")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Spear")]);

EnimiesList[71] = new Enemy("Cambion", 19, 82, 30, new Stats(18,18,16,14,12,16),[" cold, fire, lightning, poison; bludgeoning, piercing, and slashing from nonmagical attacks"], ["N/A"], ["N/A"], [" Str +7, Con +6, Int +5, Cha +6"], [" Deception +6, Intimidation +6, Perception +4, Stealth +7"],["darkvision 60 ft., passive Perception 14"], ["Abyssal, Common, Infernal"], ["5 (1800 XP)"], [GetAbility("Fiendish Blessing"),GetAbility("Innate Spellcasting")], [GetAction("Multiattack"),GetAction("Spear"),GetAction("Fire Ray"),GetAction("Fiendish Charm")]);

EnimiesList[72] = new Enemy("Camel", 9, 15, 50, new Stats(16,8 ,14,2 ,8 ,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 9"], ["—"], ["1/8 (25 XP)"], [], [GetAction("Bite")]);

EnimiesList[73] = new Enemy("Carrion Crawler", 13, 51, 30, new Stats(14,13,16,1 ,12,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3"],["darkvision 60 ft., passive Perception 13"], ["—"], ["2 (450 XP)"], [GetAbility("Keen Smell"),GetAbility("Spider Climb")], [GetAction("Multiattack"),GetAction("Tentacles"),GetAction("Bite")]);

EnimiesList[74] = new Enemy("Cat", 12, 2, 40, new Stats(3 ,15,10,3 ,12,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3, Stealth +4"],["passive Perception 13"], ["—"], ["0 (10 XP)"], [GetAbility("Keen Smell")], [GetAction("Claws")]);

EnimiesList[75] = new Enemy("Centaur", 12, 45, 50, new Stats(18,14,14,9 ,13,11),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Athletics +6, Perception +3, Survival +3"],["passive Perception 13"], ["Elvish, Sylvan"], ["2 (450 XP)"], [GetAbility("Charge")], [GetAction("Multiattack"),GetAction("Pike"),GetAction("Hooves"),GetAction("Longbow")]);

EnimiesList[76] = new Enemy("Chain Devil", 16, 85, 30, new Stats(18,15,18,11,12,14),[" cold; bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered"], [" fire, poison"], [" poisoned"], [" Con +7, Wis +4, Cha +5"], ["N/A"], ["darkvision 120 ft., passive Perception 11"], ["Infernal, telepathy 120 ft."], ["8 (3900 XP)"], [GetAbility("Devil's Sight"),GetAbility("Magic Resistance")], [GetAction("Multiattack"),GetAction("Chain"),GetAction("Animate Chains (Recharges after a Short or Long Rest)"),GetAction("Unnerving Mask")]);

EnimiesList[77] = new Enemy("Chasme", 15, 84, 20, new Stats(15,15,12,11,14,10),[" cold, fire, lightning"], [" poison"], [" poisoned"], [" Dex +5, Wis +5"], [" Perception +5"],["blindsight 10 ft., darkvision 120 ft., passive Perception 15"], ["Abyssal, telepathy 120 ft."], ["6 (2300 XP)"], [GetAbility("Drone"),GetAbility("Magic Resistance"),GetAbility("Spider Climb")], [GetAction("Proboscis")]);

EnimiesList[78] = new Enemy("Chimera", 14, 114, 30, new Stats(19,11,19,3 ,14,10),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +8"],["darkvision 60 ft., passive Perception 18"], ["understands Draconic but can't speak"], ["6 (2300 XP)"], [], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Horns"),GetAction("Claws"),GetAction("Fire Breath (Recharge 5-6)")]);

EnimiesList[79] = new Enemy("Chuul", 16, 93, 30, new Stats(19,10,16,5 ,11,5 ),["N/A"], [" poison"], [" poisoned"], ["N/A"], [" Perception +4"],["darkvision 60 ft., passive Perception 14"], ["understands Deep Speech but can't speak"], ["4 (1100 XP)"], [GetAbility("Amphibious"),GetAbility("Sense Magic")], [GetAction("Multiattack"),GetAction("Pincer"),GetAction("Tentacles")]);

EnimiesList[80] = new Enemy("Clay Golem", 14, 133, 20, new Stats(20,9 ,18,3 ,8 ,1 ),["N/A"], [" acid, poison, psychic; bludgeoning, piercing and slashing from nonmagical attacks that aren't adamantine"], [" charmed, exhaustion, frightened, paralyzed, petrified, poisoned"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 9"], ["understands the languages of its creator but can't speak"], ["9 (5000 XP)"], [GetAbility("Acid Absorption"),GetAbility("Berserk"),GetAbility("Immutable Form"),GetAbility("Magic Resistance"),GetAbility("Magic Weapons")], [GetAction("Multiattack"),GetAction("Slam"),GetAction("Haste (Recharge 5-6)")]);

EnimiesList[81] = new Enemy("Cloaker", 14, 78, 10, new Stats(17,15,12,13,12,14),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Stealth +5"],["darkvision 60 ft., passive Perception 11"], ["Deep Speech, Undercommon"], ["8 (3900 XP)"], [GetAbility("Damage Transfer"),GetAbility("False Appearance"),GetAbility("Light Sensitivity")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Tail"),GetAction("Moan"),GetAction("Phantasms (Recharges after a Short or Long Rest)")]);

EnimiesList[82] = new Enemy("Cloud Giant", 14, 200, 40, new Stats(27,10,22,12,16,16),["N/A"], ["N/A"], ["N/A"], [" Con +10, Wis +7, Cha +7"], [" Insight +7, Perception +7"],["passive Perception 17"], ["Common, Giant"], ["9 (5000 XP)"], [GetAbility("Keen Smell"),GetAbility("InnateSpellcasting")], [GetAction("Multiattack"),GetAction("Morningstar"),GetAction("Rock")]);

EnimiesList[83] = new Enemy("Cockatrice", 11, 27, 20, new Stats(6 ,12,12,2 ,13,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 11"], ["—"], ["1/2 (100 XP)"], [], [GetAction("Bite")]);

EnimiesList[84] = new Enemy("Commoner", 10, 4, 30, new Stats(10,10,10,10,10,10),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 10"], ["any one language (usually Common)"], ["0 (10 XP)"], [], [GetAction("Club")]);

EnimiesList[85] = new Enemy("Constrictor Snake", 12, 13, 30, new Stats(15,14,12,1 ,10,3 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["blindsight 10 ft., passive Perception 10"], ["—"], ["1/4 (50 XP)"], [], [GetAction("Bite"),GetAction("Constrict")]);

EnimiesList[86] = new Enemy("Copper Dragon Wyrmling", 16, 22, 30, new Stats(15,12,13,14,11,13),["N/A"], [" acid"], ["N/A"], [" Dex +3, Con +3, Wis +2, Cha +3"], [" Perception +4, Stealth +3"],["blindsight 10 ft., darkvision 60 ft., passive Perception 14"], ["Draconic"], ["1 (200 XP)"], [], [GetAction("Bite"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Acid Breath"),GetAction("Slowing Breath")]);

EnimiesList[87] = new Enemy("Couatl", 19, 97, 30, new Stats(16,20,17,18,20,18),[" radiant"], [" psychic; bludgeoning, piercing, and slashing from nonmagical attacks"], ["N/A"], [" Con +5, Wis +7, Cha +6"], ["N/A"], ["truesight 120 ft., passive Perception 15"], ["all, telepathy 120 ft."], ["4 (1100 XP)"], [GetAbility("Innate Spellcasting"),GetAbility("Magic Weapons"),GetAbility("Shielded Mind")], [GetAction("Bite"),GetAction("Constrict"),GetAction("Change Shape")]);

EnimiesList[88] = new Enemy("Crab", 11, 2, 20, new Stats(2 ,11,10,1 ,8 ,2 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Stealth +2"],["blindsight 30 ft., passive Perception 9"], ["—"], ["0 (10 XP)"], [GetAbility("Amphibious")], [GetAction("Claw")]);

EnimiesList[89] = new Enemy("Crawling Claw", 12, 2, 20, new Stats(13,14,11,5 ,10,4 ),["N/A"], [" poison"], [" charmed, exhaustion, poisoned"], ["N/A"], ["N/A"], ["blindsight 30 ft. (blind beyond this radius), passive Perception 10"], ["understands Common but can't speak"], ["0 (10 XP)"], [GetAbility("Turn Immunity")], [GetAction("Claw")]);

EnimiesList[90] = new Enemy("Crocodile", 12, 19, 20, new Stats(15,10,13,2 ,10,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Stealth +2"],["passive Perception 10"], ["—"], ["1/2 (100 XP)"], [GetAbility("Hold Breath")], [GetAction("Bite")]);

EnimiesList[91] = new Enemy("Cult Fanatic", 13, 33, 30, new Stats(11,14,12,10,13,14),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Deception +4, Persuasion +4, Religion +2"],["passive Perception 11"], ["any one language (usually Common)"], ["2 (450 XP)"], [GetAbility("Dark Devotion"),GetAbility("Spellcasting")], [GetAction("Multiattack"),GetAction("Dagger")]);

EnimiesList[92] = new Enemy("Cultist", 12, 9, 30, new Stats(11,12,10,10,11,10),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Deception +2, Religion +2"],["passive Perception 10"], ["any one language (usually Common)"], ["1/8 (25 XP)"], [GetAbility("Dark Devotion")], [GetAction("Scimitar")]);

EnimiesList[93] = new Enemy("Cyclops", 14, 138, 30, new Stats(22,11,20,8 ,6 ,10),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 8"], ["Giant"], ["6 (2300 XP)"], [GetAbility("Poor Depth Perception")], [GetAction("Multiattack"),GetAction("Greatclub"),GetAction("Rock")]);

EnimiesList[94] = new Enemy("Dao", 18, 187, 30, new Stats(23,12,24,12,13,14),["N/A"], ["N/A"], [" petrified"], [" Int +5, Wis +5, Cha +6"], ["N/A"], ["darkvision 120 ft., passive Perception 11"], ["Terran"], ["11 (7200 XP)"], [GetAbility("Earth Glide"),GetAbility("Elemental Demise"),GetAbility("Innate Spellcasting"),GetAbility("Sure-Footed")], [GetAction("Multiattack"),GetAction("Fist"),GetAction("Maul")]);

EnimiesList[95] = new Enemy("Darkmantle", 11, 22, 10, new Stats(16,12,13,2 ,10,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Stealth +3"],["blindsight 60 ft., passive Perception 10"], ["—"], ["1/2 (100 XP)"], [GetAbility("Echolocation"),GetAbility("False Appearance")], [GetAction("Crush"),GetAction("Darkness Aura (1/Day)")]);

EnimiesList[96] = new Enemy("Death Dog", 12, 39, 40, new Stats(15,14,14,3 ,13,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +5, Stealth +4"],["darkvision 120 ft., passive Perception 15"], ["—"], ["1 (200 XP)"], [GetAbility("Two-Headed")], [GetAction("Multiattack"),GetAction("Bite")]);

EnimiesList[97] = new Enemy("Death Knight", 20, 180, 30, new Stats(20,11,20,12,16,18),["N/A"], [" necrotic, poison"], [" exhaustion, frightened, poisoned"], [" Dex +6, Wis +9, Cha +10"], ["N/A"], ["darkvision 120 ft., passive Perception 13"], ["Abyssal, Common"], ["17 (18000 XP)"], [GetAbility("Magic Resistance"),GetAbility("Marshal Undead"),GetAbility("Spellcasting")], [GetAction("Multiattack"),GetAction("Longsword"),GetAction("Hellfire Orb (1/Day)"),GetAction("Parry")]);

EnimiesList[98] = new Enemy("Death Slaad", 18, 170, 30, new Stats(20,15,19,15,10,16),[" acid, cold, fire, lightning, thunder"], ["N/A"], ["N/A"], ["N/A"], [" Arcana +6, Perception +8"],["blindsight 60 ft., darkvision 60 ft., passive Perception 18"], ["Slaad, telepathy 60 ft."], ["10 (5900 XP)"], [GetAbility("Shapechanger"),GetAbility("Innate Spellcasting"),GetAbility("Magic Resistance"),GetAbility("Magic Weapons"),GetAbility("Regeneration")], [GetAction("Multiattack"),GetAction("Bite (Slaad Form Only)"),GetAction("Claws (Slaad Form Only)"),GetAction("Greatsword")]);

EnimiesList[99] = new Enemy("Death Tyrant", 19, 187, 0, new Stats(10,14,14,19,15,19),["N/A"], [" poison"], [" charmed, exhaustion, paralyzed, petrified, poisoned, prone"], [" Str +5, Con +7, Int +9, Wis +7, Cha +9"], [" Perception +12"],["darkvision 120 ft., passive Perception 22"], ["Deep Speech, Undercommon"], ["14 (11500 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[100] = new Enemy("Deep Gnome (Svirfneblin)", 15, 16, 20, new Stats(15,14,14,12,10,9 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Investigation +3, Perception +2, Stealth +4"],["darkvision 120 ft., passive Perception 12"], ["Gnomish, Terran, Undercommon"], ["1/2 (100 XP)"], [GetAbility("Stone Camouflage"),GetAbility("Gnome Cunning"),GetAbility("Innate Spellcasting")], [GetAction("War Pick"),GetAction("Poisoned Dart")]);

EnimiesList[101] = new Enemy("Deer", 13, 4, 50, new Stats(11,16,11,2 ,14,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 12"], ["—"], ["0 (10 XP)"], [], [GetAction("Bite")]);

EnimiesList[102] = new Enemy("Demilich", 20, 80, 0, new Stats(1 ,20,10,20,17,20),[" bludgeoning, piercing, and slashing from magic weapons"], [" necrotic, poison, psychic; bludgeoning, piercing, and slashing from nonmagical attacks"], [" charmed, deafened, exhaustion, frightened, paralyzed, petrified, poisoned, prone, stunned"], [" Con +6, Int +11, Wis +9, Cha +11"], ["N/A"], ["truesight 120 ft., passive Perception 13"], ["—"], ["18 (20000 XP)"], [GetAbility("Avoidance"),GetAbility("Legendary Resistance (3/Day)"),GetAbility("Turn Immunity")], [GetAction("Howl (Recharge 5-6)"),GetAction("Life Drain"),GetAction("The demilich can take 3 legendary actions, choosing from the options below"),GetAction("Flight"),GetAction("Cloud of Dust")], [GetAction("Energy Drain (Costs 2 Actions)")], [GetAction("Vile Curse (Costs 3 Actions)")]);

EnimiesList[103] = new Enemy("Deva", 17, 136, 30, new Stats(18,18,18,17,20,20),[" radiant; bludgeoning, piercing, and slashing from nonmagical attacks"], ["N/A"], [" charmed, exhaustion, frightened"], [" Wis +9, Cha +9"], [" Insight +9, Perception +9"],["darkvision 120 ft., passive Perception 19"], ["all, telepathy 120 ft."], ["10 (5900 XP)"], [GetAbility("Angelic Weapons"),GetAbility("Innate Spellcasting"),GetAbility("Magic Resistance")], [GetAction("Multiattack"),GetAction("Mace"),GetAction("Healing Touch (3/Day)"),GetAction("Change Shape")]);

EnimiesList[104] = new Enemy("Dire Wolf", 14, 37, 50, new Stats(17,15,15,3 ,12,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3, Stealth +4"],["passive Perception 13"], ["—"], ["1 (200 XP)"], [GetAbility("Keen Hearing and Smell"),GetAbility("Pack Tactics")], [GetAction("Bite")]);

EnimiesList[105] = new Enemy("Displacer Beast", 13, 85, 40, new Stats(18,15,16,6 ,12,8 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 11"], ["—"], ["3 (700 XP)"], [GetAbility("Avoidance"),GetAbility("Displacement")], [GetAction("Multiattack"),GetAction("Tentacle")]);

EnimiesList[106] = new Enemy("Djinni", 17, 161, 30, new Stats(21,15,22,15,16,20),["N/A"], [" lightning, thunder"], ["N/A"], [" Dex +6, Wis +7, Cha +9"], ["N/A"], ["darkvision 120 ft., passive Perception 13"], ["Auran"], ["11 (7200 XP)"], [GetAbility("Elemental Demise"),GetAbility("Innate Spellcasting")], [GetAction("Multiattack"),GetAction("Scimitar"),GetAction("Create Whirlwind")]);

EnimiesList[107] = new Enemy("Doppelganger", 14, 52, 30, new Stats(11,18,14,11,12,14),["N/A"], ["N/A"], [" charmed"], ["N/A"], [" Deception +6, Insight +3"],["darkvision 60 ft., passive Perception 11"], ["Common"], ["3 (700 XP)"], [GetAbility("Shapechanger"),GetAbility("Ambusher"),GetAbility("Surprise Attack")], [GetAction("Multiattack"),GetAction("Slam"),GetAction("Read Thoughts")]);

EnimiesList[108] = new Enemy("Draft Horse", 10, 19, 40, new Stats(18,10,12,2 ,11,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 10"], ["—"], ["1/4 (50 XP)"], [], [GetAction("Hooves")]);

EnimiesList[109] = new Enemy("Dragon Turtle", 20, 341, 20, new Stats(25,10,20,10,12,12),[" fire"], ["N/A"], ["N/A"], [" Dex +6, Con +11, Wis +7"], ["N/A"], ["darkvision 120 ft., passive Perception 11"], ["Aquan, Draconic"], ["17 (18000 XP)"], [GetAbility("Amphibious")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail"),GetAction("Steam Breath (Recharge 5-6)")]);

EnimiesList[110] = new Enemy("Dretch", 11, 18, 20, new Stats(11,11,12,5 ,8 ,3 ),[" cold, fire, lightning"], [" poison"], [" poisoned"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 9"], ["Abyssal, telepathy 60 ft. (works only with creatures that understand Abyssal)"], ["1/4 (50 XP)"], [], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claws"),GetAction("Fetid Cloud (1/Day)")]);

EnimiesList[111] = new Enemy("Drider", 19, 123, 30, new Stats(16,16,18,13,14,12),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +5, Stealth +9"],["darkvision 120 ft., passive Perception 15"], ["Elvish, Undercommon"], ["6 (2300 XP)"], [GetAbility("Fey Ancestry"),GetAbility("Innate Spellcasting"),GetAbility("Spider Climb"),GetAbility("Sunlight Sensitivity"),GetAbility("Web Walker")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Longsword"),GetAction("Longbow")]);

EnimiesList[112] = new Enemy("Drow", 15, 13, 30, new Stats(10,14,10,11,11,12),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +2, Stealth +4"],["darkvision 120 ft., passive Perception 12"], ["Elvish, Undercommon"], ["1/4 (50 XP)"], [GetAbility("Fey Ancestry"),GetAbility("Innate Spellcasting"),GetAbility("Sunlight Sensitivity")], [GetAction("Shortsword"),GetAction("Hand Crossbow")]);

EnimiesList[113] = new Enemy("Drow Elite Warrior", 18, 71, 30, new Stats(13,18,14,11,13,12),["N/A"], ["N/A"], ["N/A"], [" Dex +7, Con +5, Wis +4"], [" Perception +4, Stealth +10"],["darkvision 120 ft., passive Perception 14"], ["Elvish, Undercommon"], ["5 (1800 XP)"], [GetAbility("Fey Ancestry"),GetAbility("Innate Spellcasting"),GetAbility("Sunlight Sensitivity")], [GetAction("Multiattack"),GetAction("Shortsword"),GetAction("Hand Crossbow"),GetAction("Parry")]);

EnimiesList[114] = new Enemy("Drow Mage", 12, 45, 30, new Stats(9 ,14,10,17,13,12),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Arcana +6, Deception +5, Perception +4, Stealth +5"],["darkvision 120 ft., passive Perception 14"], ["Elvish, Undercommon"], ["7 (2900 XP)"], [GetAbility("Fey Ancestry"),GetAbility("Innate Spellcasting"),GetAbility("Spellcasting"),GetAbility("Sunlight Sensitivity")], [GetAction("Staff"),GetAction("Summon Demon (1/Day)")]);

EnimiesList[115] = new Enemy("Drow Priestess of Lolth", 16, 71, 30, new Stats(10,14,12,13,17,18),["N/A"], ["N/A"], ["N/A"], [" Con +4, Wis +6, Cha +7"], [" Insight +6, Perception +6, Religion +4, Stealth +5"],["darkvision 120 ft., passive Perception 16"], ["Elvish, Undercommon"], ["8 (3900 XP)"], [GetAbility("Fey Ancestry"),GetAbility("Innate Spellcasting"),GetAbility("Spellcasting"),GetAbility("Sunlight Sensitivity")], [GetAction("Multiattack"),GetAction("Scourge"),GetAction("Summon Demon (1/Day)")]);

EnimiesList[116] = new Enemy("Druid", 11, 27, 30, new Stats(10,12,13,12,15,11),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Medicine +4, Nature +3, Perception +4"],["passive Perception 14"], ["Druidic plus any two languages"], ["2 (450 XP)"], [GetAbility("Spellcasting")], [GetAction("Quarterstaff")]);

EnimiesList[117] = new Enemy("Dryad", 11, 22, 30, new Stats(10,12,11,14,15,18),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +4, Stealth +5"],["darkvision 60 ft., passive Perception 14"], ["Elvish, Sylvan"], ["1 (200 XP)"], [GetAbility("Innate Spellcasting"),GetAbility("Magic Resistance"),GetAbility("Speak with Beasts and Plants"),GetAbility("Tree Stride")], [GetAction("Club"),GetAction("Fey Charm")]);

EnimiesList[118] = new Enemy("Duergar", 16, 26, 25, new Stats(14,11,14,11,10,9 ),[" poison"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 120 ft., passive Perception 10"], ["Dwarvish, Undercommon"], ["1 (200 XP)"], [GetAbility("Duergar Resilience"),GetAbility("Sunlight Sensitivity")], [GetAction("Enlarge (Recharges after a Short or Long Rest)"),GetAction("War Pick"),GetAction("Javelin"),GetAction("Invisibility (Recharges after a Short or Long Rest)")]);

EnimiesList[119] = new Enemy("Duodrone", 15, 11, 30, new Stats(11,13,12,6 ,10,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["truesight 120 ft., passive Perception 10"], ["Modron"], ["1/4 (50 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[120] = new Enemy("Dust Mephit", 12, 17, 30, new Stats(5 ,14,10,9 ,11,10),["N/A"], [" poison"], [" poisoned"], ["N/A"], [" Perception +2, Stealth +4"],["darkvision 60 ft., passive Perception 12"], ["Auran, Terran"], ["1/2 (100 XP)"], [GetAbility("Death Burst"),GetAbility("Innate Spellcasting (1/Day)")], [GetAction("Claws"),GetAction("Blinding Breath (Recharge 6)")]);

EnimiesList[121] = new Enemy("Eagle", 12, 3, 10, new Stats(6 ,15,10,2 ,14,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +4"],["passive Perception 14"], ["—"], ["0 (10 XP)"], [GetAbility("Keen Sight")], [GetAction("Talons")]);

EnimiesList[122] = new Enemy("Earth Elemental", 17, 126, 30, new Stats(20,8 ,20,5 ,10,5 ),[" bludgeoning, piercing, and slashing from nonmagical attacks"], [" poison"], [" exhaustion, paralyzed, petrified, poisoned, unconscious"], ["N/A"], ["N/A"], ["darkvision 60 ft., tremorsense 60 ft., passive Perception 10"], ["Terran"], ["5 (1800 XP)"], [GetAbility("Earth Glide"),GetAbility("Siege Monster")], [GetAction("Multiattack"),GetAction("Slam")]);

EnimiesList[123] = new Enemy("Efreeti", 17, 200, 40, new Stats(22,12,24,16,15,16),["N/A"], [" fire"], ["N/A"], [" Int +7, Wis +6, Cha +7"], ["N/A"], ["darkvision 120 ft., passive Perception 12"], ["Ignan"], ["11 (7200 XP)"], [GetAbility("Elemental Demise"),GetAbility("Innate Spellcasting")], [GetAction("Multiattack"),GetAction("Scimitar"),GetAction("Hurl Flame")]);

EnimiesList[124] = new Enemy("Elephant", 12, 76, 40, new Stats(22,9 ,17,3 ,11,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 10"], ["—"], ["4 (1100 XP)"], [GetAbility("Trampling Charge")], [GetAction("Gore"),GetAction("Stomp")]);

EnimiesList[125] = new Enemy("Elk", 10, 13, 50, new Stats(16,10,12,2 ,10,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 10"], ["—"], ["1/4 (50 XP)"], [GetAbility("Charge")], [GetAction("Ram"),GetAction("Hooves")]);

EnimiesList[126] = new Enemy("Empyrean", 22, 313, 50, new Stats(30,21,30,21,22,27),["N/A"], [" bludgeoning, piercing, and slashing from nonmagical attacks"], ["N/A"], [" Str +17, Int +12, Wis +13, Cha +15"], [" Insight +13, Persuasion +15"],["truesight 120 ft., passive Perception 16"], ["all"], ["23 (50000 XP)"], [GetAbility("Innate Spellcasting"),GetAbility("Legendary Resistance (3/Day)"),GetAbility("Magic Resistance"),GetAbility("Magic Weapons")], [GetAction("Maul"),GetAction("Bolt"),GetAction("The empyrean can take 3 legendary actions, choosing from the options below"),GetAction("Attack"),GetAction("Bolster")], [GetAction("Trembling Strike (Costs 2 Actions)")]);

EnimiesList[127] = new Enemy("Erinyes", 18, 153, 30, new Stats(18,16,18,14,14,18),[" cold; bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered"], [" fire, poison"], [" poisoned"], [" Dex +7, Con +8, Wis +6, Cha +8"], ["N/A"], ["truesight 120 ft., passive Perception 12"], ["Infernal, telepathy 120 ft."], ["12 (8400 XP)"], [GetAbility("Hellish Weapons"),GetAbility("Magic Resistance")], [GetAction("Multiattack"),GetAction("Longsword"),GetAction("Longbow"),GetAction("Parry")]);

EnimiesList[128] = new Enemy("Ettercap", 13, 44, 30, new Stats(14,15,13,7 ,12,8 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3, Stealth +4, Survival +3"],["darkvision 60 ft., passive Perception 13"], ["—"], ["2 (450 XP)"], [GetAbility("Spider Climb"),GetAbility("Web Sense"),GetAbility("Web Walker")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claws"),GetAction("Web (Recharge 5-6)")]);

EnimiesList[129] = new Enemy("Ettin", 12, 85, 40, new Stats(21,8 ,17,6 ,10,8 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +4"],["darkvision 60 ft., passive Perception 14"], ["Giant, Orc"], ["4 (1100 XP)"], [GetAbility("Two Heads"),GetAbility("Wakeful")], [GetAction("Multiattack"),GetAction("Battleaxe"),GetAction("Morningstar")]);

EnimiesList[130] = new Enemy("Faerie Dragon", 15, 14, 10, new Stats(3 ,20,13,14,12,16),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Arcana +4, Perception +3, Stealth +7"],["darkvision 60 ft., passive Perception 13"], ["Draconic, Sylvan"], ["1 (200 XP)"], [GetAbility("Innate Spellcasting"),GetAbility("Limited Telepathy"),GetAbility("Magic Resistance"),GetAbility("Superior Invisibility")], [GetAction("Bite"),GetAction("Euphoria Breath (Recharge 5-6)"),GetAction("1-4"),GetAction("5-6")]);

EnimiesList[131] = new Enemy("Fire Elemental", 13, 102, 50, new Stats(10,17,16,6 ,10,7 ),[" bludgeoning, piercing, and slashing from nonmagical attacks"], [" fire, poison"], [" exhaustion, grappled, paralyzed, petrified, poisoned, prone, restrained, unconscious"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["Ignan"], ["5 (1800 XP)"], [GetAbility("Fire Form"),GetAbility("Illumination"),GetAbility("Water Susceptibility")], [GetAction("Multiattack"),GetAction("Touch")]);

EnimiesList[132] = new Enemy("Fire Giant", 18, 162, 30, new Stats(25,9 ,23,10,14,13),["N/A"], [" fire"], ["N/A"], [" Dex +3, Con +10, Cha +5"], [" Athletics +11, Perception +6"],["passive Perception 16"], ["Giant"], ["9 (5000 XP)"], [], [GetAction("Multiattack"),GetAction("Greatsword"),GetAction("Rock")]);

EnimiesList[133] = new Enemy("Fire Snake", 14, 22, 30, new Stats(12,14,11,7 ,10,8 ),[" bludgeoning, piercing, and slashing from nonmagical attacks"], [" fire"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["understands Ignan but can't speak"], ["1 (200 XP)"], [GetAbility("Heated Body")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Tail")]);

EnimiesList[134] = new Enemy("Flameskull", 13, 40, 0, new Stats(1 ,17,14,16,10,11),[" lightning, necrotic, piercing"], [" cold, fire, poison"], [" charmed, frightened, paralyzed, poisoned, prone"], ["N/A"], [" Arcana +5, Perception +2"],["darkvision 60 ft., passive Perception 12"], ["Common"], ["4 (1100 XP)"], [GetAbility("Illumination"),GetAbility("Magic Resistance"),GetAbility("Rejuvenation"),GetAbility("Spellcasting")], [GetAction("Multiattack"),GetAction("Fire Ray")]);

EnimiesList[135] = new Enemy("Flesh Golem", 9, 93, 30, new Stats(19,9 ,18,6 ,10,5 ),["N/A"], [" lightning, poison; bludgeoning, piercing, and slashing from nonmagical attacks that aren't adamantine"], [" charmed, exhaustion, frightened, paralyzed, petrified, poisoned"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["understands the languages of its creator but can't speak"], ["5 (1800 XP)"], [GetAbility("Berserk"),GetAbility("Aversion of Fire"),GetAbility("Immutable Form"),GetAbility("Lightning Absorption"),GetAbility("Magic Resistance"),GetAbility("Magic Weapons")], [GetAction("Multiattack"),GetAction("Slam")]);

EnimiesList[136] = new Enemy("Flumph", 12, 7, 5, new Stats(6 ,15,10,14,14,11),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Arcana +4, History +4, Religion +4"],["darkvision 60 ft., passive Perception 12"], ["understands Undercommon but can't speak, telepathy 60 ft."], ["1/8 (25 XP)"], [GetAbility("Advanced Telepathy"),GetAbility("Prone Deficiency"),GetAbility("Telepathic Shroud")], [GetAction("Tendrils"),GetAction("Stench Spray (1/Day)")]);

EnimiesList[137] = new Enemy("Flying Snake", 14, 5, 30, new Stats(4 ,18,11,2 ,12,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["blindsight 10 ft., passive Perception 11"], ["—"], ["1/8 (25 XP)"], [GetAbility("Flyby")], [GetAction("Bite")]);

EnimiesList[138] = new Enemy("Flying Sword", 17, 17, 0, new Stats(12,15,11,1 ,5 ,1 ),["N/A"], [" poison, psychic"], [" blinded, charmed, deafened, frightened, paralyzed, petrified, poisoned"], [" Dex +4"], ["N/A"], ["blindsight 60 ft. (blind beyond this radius), passive Perception 7"], ["—"], ["1/4 (50 XP)"], [GetAbility("Antimagic Susceptibility"),GetAbility("False Appearance")], [GetAction("Longsword")]);

EnimiesList[139] = new Enemy("Fomorian", 14, 149, 30, new Stats(23,10,20,9 ,14,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +8, Stealth +3"],["darkvision 120 ft., passive Perception 18"], ["Giant, Undercommon"], ["8 (3900 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[140] = new Enemy("Frog", 11, 1, 20, new Stats(1 ,13,8 ,1 ,8 ,3 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +1, Stealth +3"],["darkvision 30 ft., passive Perception 11"], ["—"], ["0 (0 XP)"], [GetAbility("Amphibious"),GetAbility("Standing Leap"),]);

EnimiesList[141] = new Enemy("Frost Giant", 15, 138, 40, new Stats(23,9 ,21,9 ,10,12),["N/A"], [" cold"], ["N/A"], [" Con +8, Wis +3, Cha +4"], [" Athletics +9, Perception +3"],["passive Perception 13"], ["Giant"], ["8 (3900 XP)"], [], [GetAction("Multiattack"),GetAction("Greataxe"),GetAction("Rock")]);

EnimiesList[142] = new Enemy("Galeb Duhr", 16, 85, 15, new Stats(20,14,20,11,12,11),[" bludgeoning, piercing, and slashing from nonmagical attacks"], [" poison"], [" exhaustion, paralyzed, poisoned, petrified"], ["N/A"], ["N/A"], ["darkvision 60 ft., tremorsense 60 ft., passive Perception 11"], ["Terran"], ["6 (2300 XP)"], [GetAbility("False Appearance"),GetAbility("Rolling Charge")], [GetAction("Slam"),GetAction("Animate Boulders (1/Day)")]);

EnimiesList[143] = new Enemy("Gargoyle", 15, 52, 30, new Stats(15,11,16,6 ,11,7 ),[" bludgeoning, piercing, and slashing from nonmagical attacks that aren't adamantine"], [" poison"], [" exhaustion, petrified, poisoned"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["Terran"], ["2 (450 XP)"], [GetAbility("False Appearance")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claws")]);

EnimiesList[144] = new Enemy("Gas Spore", 5, 1, 0, new Stats(5 ,1 ,3 ,1 ,1 ,1 ),["N/A"], [" poison"], [" blinded, deafened, frightened, paralyzed, poisoned, prone"], ["N/A"], ["N/A"], ["blindsight 30 ft. (blind beyond this radius), passive Perception 5"], ["—"], ["1/2 (100 XP)"], [GetAbility("Death Burst"),GetAbility("Eerie Resemblance")], [GetAction("Touch")]);

EnimiesList[145] = new Enemy("Gelatinous Cube", 6, 84, 15, new Stats(14,3 ,20,1 ,6 ,1 ),["N/A"], ["N/A"], [" blinded, charmed, deafened, exhaustion, frightened, prone"], ["N/A"], ["N/A"], ["blindsight 60 ft. (blind beyond this radius), passive Perception 8"], ["—"], ["2 (450 XP)"], [GetAbility("Ooze Cube"),GetAbility("Transparent")], [GetAction("Pseudopod"),GetAction("Engulf")]);

EnimiesList[146] = new Enemy("Ghast", 13, 36, 30, new Stats(16,17,10,11,10,8 ),[" necrotic"], [" poison"], [" charmed, exhaustion, poisoned"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["Common"], ["2 (450 XP)"], [GetAbility("Stench"),GetAbility("Turning Defiance")], [GetAction("Bite"),GetAction("Claws")]);

EnimiesList[147] = new Enemy("Ghost", 11, 45, 0, new Stats(7 ,13,10,10,12,17),[" acid, fire, lightning, thunder; bludgeoning, piercing, and slashing from nonmagical attacks"], [" cold, necrotic, poison"], [" charmed, exhaustion, frightened, grappled, paralyzed, petrified, poisoned, prone, restrained"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 11"], ["the languages it knew in life"], ["4 (1100 XP)"], [GetAbility("Ethereal Sight"),GetAbility("Incorporeal Movement")], [GetAction("Withering Touch"),GetAction("Etherealness"),GetAction("Horrifying Visage"),GetAction("Possession (Recharge 6)")]);

EnimiesList[148] = new Enemy("Ghoul", 12, 22, 30, new Stats(13,15,10,7 ,10,6 ),["N/A"], [" poison"], [" charmed, exhaustion, poisoned"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["Common"], ["1 (200 XP)"], [], [GetAction("Bite"),GetAction("Claws")]);

EnimiesList[149] = new Enemy("Giant Ape", 12, 157, 40, new Stats(23,14,18,7 ,12,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Athletics +9, Perception +4"],["passive Perception 14"], ["—"], ["7 (2900 XP)"], [], [GetAction("Multiattack"),GetAction("Fist"),GetAction("Rock")]);

EnimiesList[150] = new Enemy("Giant Badger", 10, 13, 30, new Stats(13,10,15,2 ,12,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 30 ft., passive Perception 11"], ["—"], ["1/4 (50 XP)"], [GetAbility("Keen Smell")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claws")]);

EnimiesList[151] = new Enemy("Giant Bat", 13, 22, 10, new Stats(15,16,11,2 ,12,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["blindsight 60 ft., passive Perception 11"], ["—"], ["1/4 (50 XP)"], [GetAbility("Echolocation"),GetAbility("Keen Hearing")], [GetAction("Bite")]);

EnimiesList[152] = new Enemy("Giant Boar", 12, 42, 40, new Stats(17,10,16,2 ,7 ,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 8"], ["—"], ["2 (450 XP)"], [GetAbility("Charge"),GetAbility("Relentless (Recharges after a Short or Long Rest)")], [GetAction("Tusk")]);

EnimiesList[153] = new Enemy("Giant Centipede", 13, 4, 30, new Stats(5 ,14,12,1 ,7 ,3 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["blindsight 30 ft., passive Perception 8"], ["—"], ["1/4 (50 XP)"], [], [GetAction("Bite")]);

EnimiesList[154] = new Enemy("Giant Constrictor Snake", 12, 60, 30, new Stats(19,14,12,1 ,10,3 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +2"],["blindsight 10 ft., passive Perception 12"], ["—"], ["2 (450 XP)"], [], [GetAction("Bite"),GetAction("Constrict")]);

EnimiesList[155] = new Enemy("Giant Crab", 15, 13, 30, new Stats(13,15,11,1 ,9 ,3 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Stealth +4"],["blindsight 30 ft., passive Perception 9"], ["—"], ["1/8 (25 XP)"], [GetAbility("Amphibious")], [GetAction("Claw")]);

EnimiesList[156] = new Enemy("Giant Crocodile", 14, 85, 30, new Stats(21,9 ,17,2 ,10,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Stealth +5"],["passive Perception 10"], ["—"], ["5 (1800 XP)"], [GetAbility("Hold Breath")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Tail")]);

EnimiesList[157] = new Enemy("Giant Eagle", 13, 26, 10, new Stats(16,17,13,8 ,14,10),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +4"],["passive Perception 14"], ["Giant Eagle understands Common and Auran but can't speak them"], ["1 (200 XP)"], [GetAbility("Keen Sight")], [GetAction("Multiattack"),GetAction("Beak"),GetAction("Talons")]);

EnimiesList[158] = new Enemy("Giant Elk", 14, 42, 60, new Stats(19,16,14,7 ,14,10),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +4"],["passive Perception 14"], ["Giant Elk understands Common, Elvish, and Sylvan but can't speak them"], ["2 (450 XP)"], [GetAbility("Charge")], [GetAction("Ram"),GetAction("Hooves")]);

EnimiesList[159] = new Enemy("Giant Fire Beetle", 13, 4, 30, new Stats(8 ,10,12,1 ,7 ,3 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["blindsight 30 ft., passive Perception 8"], ["—"], ["0 (10 XP)"], [GetAbility("Illumination")], [GetAction("Bite")]);

EnimiesList[160] = new Enemy("Giant Frog", 11, 18, 30, new Stats(12,13,11,2 ,10,3 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +2, Stealth +3"],["darkvision 30 ft., passive Perception 12"], ["—"], ["1/4 (50 XP)"], [GetAbility("Amphibious"),GetAbility("Standing Leap")], [GetAction("Bite"),GetAction("Swallow")]);

EnimiesList[161] = new Enemy("Giant Goat", 11, 19, 40, new Stats(17,11,12,3 ,12,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 11"], ["—"], ["1/2 (100 XP)"], [GetAbility("Charge"),GetAbility("Sure-Footed")], [GetAction("Ram")]);

EnimiesList[162] = new Enemy("Giant Hyena", 12, 45, 50, new Stats(16,14,14,2 ,12,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3"],["passive Perception 13"], ["—"], ["1 (200 XP)"], [GetAbility("Rampage")], [GetAction("Bite")]);

EnimiesList[163] = new Enemy("Giant Lizard", 12, 19, 30, new Stats(15,12,13,2 ,10,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 30 ft., passive Perception 10"], ["—"], ["1/4 (50 XP)"], [], [GetAction("Bite")]);

EnimiesList[164] = new Enemy("Giant Octopus", 11, 52, 10, new Stats(17,13,13,4 ,10,4 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +4, Stealth +5"],["darkvision 60 ft., passive Perception 14"], ["—"], ["1 (200 XP)"], [GetAbility("Hold Breath"),GetAbility("Underwater Camouflage"),GetAbility("Water Breathing")], [GetAction("Tentacles"),GetAction("Ink Cloud (Recharges after a Short or Long Rest)")]);

EnimiesList[165] = new Enemy("Giant Owl", 12, 19, 5, new Stats(13,15,12,8 ,13,10),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +5, Stealth +4"],["darkvision 120 ft., passive Perception 15"], ["Giant Owl understands Common, Elvish, and Sylvan but can't speak them"], ["1/4 (50 XP)"], [GetAbility("Flyby"),GetAbility("Keen Hearing and Sight")], [GetAction("Talons")]);

EnimiesList[166] = new Enemy("Giant Poisonous Snake", 14, 11, 30, new Stats(10,18,13,2 ,10,3 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +2"],["blindsight 10 ft., passive Perception 12"], ["—"], ["1/4 (50 XP)"], [], [GetAction("Bite")]);

EnimiesList[167] = new Enemy("Giant Rat", 12, 7, 30, new Stats(7 ,15,11,2 ,10,4 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["—"], ["1/8 (25 XP)"], [GetAbility("Keen Smell"),GetAbility("Pack Tactics")], [GetAction("Bite")]);

EnimiesList[168] = new Enemy("Giant Scorpion", 15, 52, 40, new Stats(15,13,15,1 ,9 ,3 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["blindsight 60 ft., passive Perception 9"], ["—"], ["3 (700 XP)"], [], [GetAction("Multiattack"),GetAction("Claw"),GetAction("Sting")]);

EnimiesList[169] = new Enemy("Giant Sea Horse", 13, 16, 0, new Stats(12,15,11,2 ,12,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 11"], ["—"], ["1/2 (100 XP)"], [GetAbility("Charge"),GetAbility("Water Breathing")], [GetAction("Ram")]);

EnimiesList[170] = new Enemy("Giant Shark", 13, 126, 0, new Stats(23,11,21,1 ,10,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3"],["blindsight 60 ft., passive Perception 13"], ["—"], ["5 (1800 XP)"], [GetAbility("Blood Frenzy"),GetAbility("Water Breathing")], [GetAction("Bite")]);

EnimiesList[171] = new Enemy("Giant Spider", 14, 26, 30, new Stats(14,16,12,2 ,11,4 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Stealth +7"],["blindsight 10 ft., darkvision 60 ft., passive Perception 10"], ["—"], ["1 (200 XP)"], [GetAbility("Spider Climb"),GetAbility("Web Sense"),GetAbility("Web Walker")], [GetAction("Bite"),GetAction("Web (Recharge 5-6)")]);

EnimiesList[172] = new Enemy("Giant Toad", 11, 39, 20, new Stats(15,13,13,2 ,10,3 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 30 ft., passive Perception 10"], ["—"], ["1 (200 XP)"], [GetAbility("Amphibious"),GetAbility("Standing Leap")], [GetAction("Bite"),GetAction("Swallow")]);

EnimiesList[173] = new Enemy("Giant Vulture", 10, 22, 10, new Stats(15,10,15,6 ,12,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3"],["passive Perception 13"], ["understands Common but can't speak"], ["1 (200 XP)"], [GetAbility("Keen Sight and Smell"),GetAbility("Pack Tactics")], [GetAction("Multiattack"),GetAction("Beak"),GetAction("Talons")]);

EnimiesList[174] = new Enemy("Giant Wasp", 12, 13, 10, new Stats(10,14,10,1 ,10,3 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 10"], ["—"], ["1/2 (100 XP)"], [], [GetAction("Sting")]);

EnimiesList[175] = new Enemy("Giant Weasel", 13, 9, 40, new Stats(11,16,10,4 ,12,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3, Stealth +5"],["darkvision 60 ft., passive Perception 13"], ["—"], ["1/8 (25 XP)"], [GetAbility("Keen Hearing and Smell")], [GetAction("Bite")]);

EnimiesList[176] = new Enemy("Giant Wolf Spider", 13, 11, 40, new Stats(12,16,13,3 ,12,4 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3, Stealth +7"],["blindsight 10 ft., darkvision 60 ft., passive Perception 13"], ["—"], ["1/4 (50 XP)"], [GetAbility("Spider Climb"),GetAbility("Web Sense"),GetAbility("Web Walker")], [GetAction("Bite")]);

EnimiesList[177] = new Enemy("Gibbering Mouther", 9, 67, 10, new Stats(10,8 ,16,3 ,10,6 ),["N/A"], ["N/A"], [" prone"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["—"], ["2 (450 XP)"], [GetAbility("Aberrant Ground"),GetAbility("Gibbering")], [GetAction("Multiattack"),GetAction("Bites"),GetAction("Blinding Spittle (Recharge 5-6)")]);

EnimiesList[178] = new Enemy("Githyanki Knight", 18, 91, 30, new Stats(16,14,15,14,14,15),["N/A"], ["N/A"], ["N/A"], [" Con +5, Int +5, Wis +5"], ["N/A"], ["passive Perception 12"], ["Gith"], ["8 (3900 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[179] = new Enemy("Githyanki Warrior", 17, 49, 30, new Stats(15,14,12,13,13,10),["N/A"], ["N/A"], ["N/A"], [" Con +3, Int +3, Wis +3"], ["N/A"], ["passive Perception 11"], ["Gith"], ["3 (700 XP)"], [GetAbility("Innate Spellcasting (Psionics)")], [GetAction("Multiattack"),GetAction("Greatsword")]);

EnimiesList[180] = new Enemy("Githzerai Monk", 14, 38, 30, new Stats(12,15,12,13,14,10),["N/A"], ["N/A"], ["N/A"], [" Str +3, Dex +4, Int +3, Wis +4"], [" Insight +4, Perception +4"],["passive Perception 14"], ["Gith"], ["2 (450 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[181] = new Enemy("Githzerai Zerth", 17, 84, 30, new Stats(13,18,15,16,17,12),["N/A"], ["N/A"], ["N/A"], [" Str +4, Dex +7, Int +6, Wis +6"], ["N/A"], ["passive Perception 16"], ["Gith"], ["6 (2300 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[182] = new Enemy("Glabrezu", 17, 157, 40, new Stats(20,15,21,19,17,16),[" cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks"], [" poison"], [" poisoned"], [" Str +9, Con +9, Wis +7, Cha +7"], ["N/A"], ["truesight 120 ft., passive Perception 13"], ["Abyssal, telepathy 120 ft."], ["9 (5000 XP)"], [GetAbility("Innate Spellcasting"),GetAbility("Magic Resistance")], [GetAction("Multiattack"),GetAction("Pincer"),GetAction("Fist")]);

EnimiesList[183] = new Enemy("Gladiator", 16, 112, 30, new Stats(18,15,16,10,12,15),["N/A"], ["N/A"], ["N/A"], [" Str +7, Dex +5, Con +6"], [" Athletics +10, Intimidation +5"],["passive Perception 11"], ["any one language (usually Common)"], ["5 (1800 XP)"], [GetAbility("Brave"),GetAbility("Brute")], [GetAction("Multiattack"),GetAction("Spear"),GetAction("Shield Bash"),GetAction("Parry")]);

EnimiesList[184] = new Enemy("Gnoll", 15, 22, 30, new Stats(14,12,11,6 ,10,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["Gnoll"], ["1/2 (100 XP)"], [GetAbility("Rampage")], [GetAction("Bite"),GetAction("Spear"),GetAction("Longbow")]);

EnimiesList[185] = new Enemy("Gnoll Fang of Yeenoghu", 14, 65, 30, new Stats(17,15,15,10,11,13),["N/A"], ["N/A"], ["N/A"], [" Con +4, Wis +2, Cha +3"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["Abyssal, Gnoll"], ["4 (1100 XP)"], [GetAbility("Rampage")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw")]);

EnimiesList[186] = new Enemy("Gnoll Pack Lord", 15, 49, 30, new Stats(16,14,13,8 ,11,9 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["Gnoll"], ["2 (450 XP)"], [GetAbility("Rampage")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Glaive"),GetAction("Longbow"),GetAction("Incite Rampage (Recharge 5-6)")]);

EnimiesList[187] = new Enemy("Goat", 10, 4, 40, new Stats(12,10,11,2 ,10,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 10"], ["—"], ["0 (10 XP)"], [GetAbility("Charge"),GetAbility("Sure-Footed")], [GetAction("Ram")]);

EnimiesList[188] = new Enemy("Goblin", 15, 7, 30, new Stats(8 ,14,10,10,8 ,8 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Stealth +6"],["darkvision 60 ft., passive Perception 9"], ["Common, Goblin"], ["1/4 (50 XP)"], [GetAbility("Nimble Escape")], [GetAction("Scimitar"),GetAction("Shortbow")]);

EnimiesList[189] = new Enemy("Goblin Boss", 17, 21, 30, new Stats(10,14,10,10,8 ,10),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Stealth +6"],["darkvision 60 ft., passive Perception 9"], ["Common, Goblin"], ["1 (200 XP)"], [GetAbility("Nimble Escape")], [GetAction("Multiattack"),GetAction("Scimitar"),GetAction("Javelin"),GetAction("Redirect Attack")]);

EnimiesList[190] = new Enemy("Gold Dragon Wyrmling", 17, 60, 30, new Stats(19,14,17,14,11,16),["N/A"], [" fire"], ["N/A"], [" Dex +4, Con +5, Wis +2, Cha +5"], [" Perception +4, Stealth +4"],["blindsight 10 ft., darkvision 60 ft., passive Perception 14"], ["Draconic"], ["3 (700 XP)"], [GetAbility("Amphibious")], [GetAction("Bite"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Fire Breath"),GetAction("Weakening Breath")]);

EnimiesList[191] = new Enemy("Gorgon", 19, 114, 40, new Stats(20,11,18,2 ,12,7 ),["N/A"], ["N/A"], [" petrified"], ["N/A"], [" Perception +4"],["darkvision 60 ft., passive Perception 14"], ["—"], ["5 (1800 XP)"], [GetAbility("Trampling Charge")], [GetAction("Gore"),GetAction("Hooves"),GetAction("Petrifying Breath (Recharge 5-6)")]);

EnimiesList[192] = new Enemy("Goristro", 19, 310, 40, new Stats(25,11,25,6 ,13,14),[" cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks"], [" poison"], [" poisoned"], [" Str +13, Dex +6, Con +13, Wis +7"], [" Perception +7"],["darkvision 120 ft., passive Perception 17"], ["Abyssal"], ["17 (18000 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[193] = new Enemy("Gray Ooze", 8, 22, 10, new Stats(12,6 ,16,1 ,6 ,2 ),[" acid, cold, fire"], ["N/A"], [" blinded, charmed, deafened, exhaustion, frightened, prone"], ["N/A"], [" Stealth +2"],["blindsight 60 ft. (blind beyond this radius), passive Perception 8"], ["—"], ["1/2 (100 XP)"], [GetAbility("Amorphous"),GetAbility("Corrode Metal"),GetAbility("False Appearance")], [GetAction("Pseudopod")]);

EnimiesList[194] = new Enemy("Gray Slaad", 18, 127, 30, new Stats(17,17,16,13,8 ,14),[" acid, cold, fire, lightning, thunder"], ["N/A"], ["N/A"], ["N/A"], [" Arcana +5, Perception +7"],["blindsight 60 ft., darkvision 60 ft., passive Perception 17"], ["Slaad, telepathy 60 ft."], ["9 (5000 XP)"], [GetAbility("Shapechanger"),GetAbility("Innate Spellcasting"),GetAbility("Magic Resistance"),GetAbility("Magic Weapons"),GetAbility("Regeneration")], [GetAction("Multiattack"),GetAction("Bite (Slaad Form Only)"),GetAction("Claws (Slaad Form Only)"),GetAction("Greatsword")]);

EnimiesList[195] = new Enemy("Green Dragon Wyrmling", 17, 38, 30, new Stats(15,12,13,14,11,13),["N/A"], [" poison"], [" poisoned"], [" Dex +3, Con +3, Wis +2, Cha +3"], [" Perception +4, Stealth +3"],["blindsight 10 ft., darkvision 60 ft., passive Perception 14"], ["Draconic"], ["2 (450 XP)"], [GetAbility("Amphibious")], [GetAction("Bite"),GetAction("Poison Breath (Recharge 5-6)")]);

EnimiesList[196] = new Enemy("Green Hag", 17, 82, 30, new Stats(18,12,16,13,14,14),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Arcana +3, Deception +4, Perception +4, Stealth +3"],["darkvision 60 ft., passive Perception 14"], ["Common, Draconic, Sylvan"], ["3 (700 XP)"], [GetAbility("Amphibious"),GetAbility("Innate Spellcasting"),GetAbility("Mimicry")], [GetAction("Claws"),GetAction("Illusory Appearance"),GetAction("Invisible Passage")]);

EnimiesList[197] = new Enemy("Green Slaad", 16, 127, 30, new Stats(18,15,16,11,8 ,12),[" acid, cold, fire, lightning, thunder"], ["N/A"], ["N/A"], ["N/A"], [" Arcana +3, Perception +2"],["blindsight 30 ft., darkvision 60 ft., passive Perception 12"], ["Slaad, telepathy 60 ft."], ["8 (3900 XP)"], [GetAbility("Shapechanger"),GetAbility("Innate Spellcasting"),GetAbility("Magic Resistance"),GetAbility("Regeneration")], [GetAction("Multiattack"),GetAction("Bite (Slaad Form Only)"),GetAction("Claw (Slaad Form Only)"),GetAction("Staff"),GetAction("Hurl Flame")]);

EnimiesList[198] = new Enemy("Grell", 12, 55, 10, new Stats(15,14,13,12,11,9 ),["N/A"], [" lightning"], [" blinded, prone"], ["N/A"], [" Perception +4, Stealth +6"],["blindsight 60 ft. (blind beyond this radius), passive Perception 14"], ["Grell"], ["3 (700 XP)"], [], [GetAction("Multiattack"),GetAction("Tentacles"),GetAction("Beak")]);

EnimiesList[199] = new Enemy("Grick", 14, 27, 30, new Stats(14,14,11,3 ,14,5 ),[" bludgeoning, piercing, and slashing damage from nonmagical attacks"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 12"], ["—"], ["2 (450 XP)"], [GetAbility("Stone Camouflage")], [GetAction("Multiattack"),GetAction("Tentacles"),GetAction("Beak")]);

EnimiesList[200] = new Enemy("Grick alpha", 18, 75, 30, new Stats(18,16,15,4 ,14,9 ),[" bludgeoning, piercing, and slashing damage from nonmagical attacks"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 12"], ["—"], ["7 (2900 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[201] = new Enemy("Griffon", 12, 59, 30, new Stats(18,15,16,2 ,13,8 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +5"],["darkvision 60 ft., passive Perception 15"], ["—"], ["2 (450 XP)"], [GetAbility("Keen Sight")], [GetAction("Multiattack"),GetAction("Beak"),GetAction("Claws")]);

EnimiesList[202] = new Enemy("Grimlock", 11, 11, 30, new Stats(16,12,12,9 ,8 ,6 ),["N/A"], ["N/A"], [" blinded"], ["N/A"], [" Athletics +5, Perception +3, Stealth +3"],["blindsight 30 ft. or 10 ft. while deafened (blind beyond this radius), passive Perception 13"], ["Undercommon"], ["1/4 (50 XP)"], [GetAbility("Blind Senses"),GetAbility("Keen Hearing and Smell"),GetAbility("Stone Camouflage")], [GetAction("Spiked Bone Club")]);

EnimiesList[203] = new Enemy("Guard", 16, 11, 30, new Stats(13,12,12,10,11,10),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +2"],["passive Perception 12"], ["any one language (usually Common)"], ["1/8 (25 XP)"], [], [GetAction("Spear")]);

EnimiesList[204] = new Enemy("Guardian Naga", 18, 127, 40, new Stats(19,18,16,16,19,18),["N/A"], [" poison"], [" charmed, poisoned"], [" Dex +8, Con +7, Int +7, Wis +8, Cha +8"], ["N/A"], ["darkvision 60 ft., passive Perception 14"], ["Celestial, Common"], ["10 (5900 XP)"], [GetAbility("Rejuvenation"),GetAbility("Spellcasting")], [GetAction("Bite"),GetAction("Spit Poison")]);

EnimiesList[205] = new Enemy("Gynosphinx", 17, 136, 40, new Stats(18,15,16,18,18,18),[" bludgeoning, piercing, and slashing from nonmagical attacks"], [" psychic"], [" charmed, frightened"], ["N/A"], [" Arcana +12, History +12, Perception +8, Religion +8"],["truesight 120 ft., passive Perception 18"], ["Common, Sphinx"], ["11 (7200 XP)"], [GetAbility("Inscrutable"),GetAbility("Magic Weapons"),GetAbility("Spellcasting")], [GetAction("Multiattack"),GetAction("Claw"),GetAction("The sphinx can take 3 legendary actions, choosing from the options below"),GetAction("Claw Attack")], [GetAction("Teleport (Costs 2 Actions)")], [GetAction("Cast a Spell (Costs 3 Actions)")]);

EnimiesList[206] = new Enemy("Half-Ogre", 12, 30, 30, new Stats(17,10,14,7 ,9 ,10),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 9"], ["Common, Giant"], ["1 (200 XP)"], [], [GetAction("Battleaxe"),GetAction("Javelin")]);

EnimiesList[207] = new Enemy("Half-Red Dragon Veteran", 18, 65, 30, new Stats(16,13,14,10,11,10),[" fire"], ["N/A"], ["N/A"], ["N/A"], [" Athletics +5, Perception +2"],["blindsight 10 ft., darkvision 60 ft., passive Perception 12"], ["Common, Draconic"], ["5 (1800 XP)"], [], [GetAction("Multiattack"),GetAction("Longsword"),GetAction("Shortsword"),GetAction("Heavy Crossbow"),GetAction("Fire")]);

EnimiesList[208] = new Enemy("Harpy", 11, 38, 20, new Stats(12,13,12,7 ,10,13),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 10"], ["Common"], ["1 (200 XP)"], [], [GetAction("Multiattack"),GetAction("Claws"),GetAction("Club"),GetAction("Luring Song")]);

EnimiesList[209] = new Enemy("Hawk", 13, 1, 10, new Stats(5 ,16,8 ,2 ,14,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +4"],["passive Perception 14"], ["—"], ["0 (10 XP)"], [GetAbility("Keen Sight")], [GetAction("Talons")]);

EnimiesList[210] = new Enemy("Hell Hound", 15, 45, 50, new Stats(17,12,14,6 ,13,6 ),["N/A"], [" fire"], ["N/A"], ["N/A"], [" Perception +5"],["darkvision 60 ft., passive Perception 15"], ["understands Infernal but can't speak"], ["3 (700 XP)"], [GetAbility("Keen Hearing and Smell"),GetAbility("Pack Tactics")], [GetAction("Bite"),GetAction("Fire Breath (Recharge 5-6)"),]);

EnimiesList[211] = new Enemy("Helmed Horror", 20, 60, 30, new Stats(18,13,16,10,10,10),[" bludgeoning, piercing, and slashing from nonmagical attacks that aren't adamantine"], [" force, necrotic, poison"], [" blinded, charmed, deafened, frightened, paralyzed, petrified, poisoned, stunned"], ["N/A"], [" Perception +4"],["blindsight 60 ft. (blind beyond this radius), passive Perception 14"], ["understands the languages of its creator but can't speak"], ["4 (1100 XP)"], [GetAbility("Magic Resistance"),GetAbility("Spell Immunity")], [GetAction("Multiattack"),GetAction("Longsword")]);

EnimiesList[212] = new Enemy("Hezrou", 16, 136, 30, new Stats(19,17,20,5 ,12,13),[" cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks"], [" poison"], [" poisoned"], [" Str +7, Con +8, Wis +4"], ["N/A"], ["darkvision 120 ft., passive Perception 11"], ["Abyssal, telepathy 120 ft."], ["8 (3900 XP)"], [GetAbility("Magic Resistance"),GetAbility("Stench")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw")]);

EnimiesList[213] = new Enemy("Hill Giant", 13, 105, 40, new Stats(21,8 ,19,5 ,9 ,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +2"],["passive Perception 12"], ["Giant"], ["5 (1800 XP)"], [], [GetAction("Multiattack"),GetAction("Greatclub"),GetAction("Rock")]);

EnimiesList[214] = new Enemy("Hippogriff", 11, 19, 40, new Stats(17,13,13,2 ,12,8 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +5"],["passive Perception 15"], ["—"], ["1 (200 XP)"], [GetAbility("Keen Sight")], [GetAction("Multiattack"),GetAction("Beak"),GetAction("Claws")]);

EnimiesList[215] = new Enemy("Hobgoblin", 18, 11, 30, new Stats(13,12,12,10,10,9 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["Common, Goblin"], ["1/2 (100 XP)"], [GetAbility("Martial Advantage")], [GetAction("Longsword"),GetAction("Longbow")]);

EnimiesList[216] = new Enemy("Hobgoblin Captain", 17, 39, 30, new Stats(15,14,14,12,10,13),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["Common, Goblin"], ["3 (700 XP)"], [GetAbility("Martial Advantage")], [GetAction("Multiattack"),GetAction("Greatsword"),GetAction("Javelin"),GetAction("Leadership (Recharges after a Short or Long Rest)")]);

EnimiesList[217] = new Enemy("Hobgoblin Warlord", 20, 97, 30, new Stats(16,14,16,14,11,15),["N/A"], ["N/A"], ["N/A"], [" Int +5, Wis +3, Cha +5"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["Common, Goblin"], ["6 (2300 XP)"], [GetAbility("Martial Advantage")], [GetAction("Multiattack"),GetAction("Longsword"),GetAction("Shield Bash"),GetAction("Javelin"),GetAction("Leadership (Recharges after a Short or Long Rest)"),GetAction("Parry")]);

EnimiesList[218] = new Enemy("Homunculus", 13, 5, 20, new Stats(4 ,15,11,10,10,7 ),["N/A"], [" poison"], [" charmed, poisoned"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["understands the languages of its creator but can't speak"], ["0 (10 XP)"], [GetAbility("Telepathic Bond")], [GetAction("Bite")]);

EnimiesList[219] = new Enemy("Hook Horror", 15, 75, 30, new Stats(18,10,15,6 ,12,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3"],["blindsight 60 ft., darkvision 120 ft., passive Perception 13"], ["Hook Horror"], ["3 (700 XP)"], [GetAbility("Echolocation"),GetAbility("Keen Hearing")], [GetAction("Multiattack"),GetAction("Hook")]);

EnimiesList[220] = new Enemy("Horned Devil", 18, 178, 20, new Stats(22,17,21,12,16,17),[" cold; bludgeoning, piercing, and slashing from nonmagical attacks not made with silvered weapons"], [" fire, poison"], [" poisoned"], [" Str +10, Dex +7, Wis +7, Cha +7"], ["N/A"], ["darkvision 120 ft., passive Perception 13"], ["Infernal, telepathy 120 ft."], ["11 (7200 XP)"], [GetAbility("Devil's Sight"),GetAbility("Magic Resistance")], [GetAction("Multiattack"),GetAction("Fork"),GetAction("Tail"),GetAction("Hurl Flame")]);

EnimiesList[221] = new Enemy("Hunter Shark", 12, 45, 0, new Stats(18,13,15,1 ,10,4 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +2"],["blindsight 30 ft., passive Perception 12"], ["—"], ["2 (450 XP)"], [GetAbility("Blood Frenzy"),GetAbility("Water Breathing")], [GetAction("Bite")]);

EnimiesList[222] = new Enemy("Hydra", 15, 172, 30, new Stats(20,12,20,2 ,10,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +6"],["darkvision 60 ft., passive Perception 16"], ["—"], ["8 (3900 XP)"], [GetAbility("Hold Breath"),GetAbility("Multiple Heads"),GetAbility("Reactive Heads"),GetAbility("Wakeful")], [GetAction("Multiattack"),GetAction("Bite")]);

EnimiesList[223] = new Enemy("Hyena", 11, 5, 50, new Stats(11,13,12,2 ,12,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3"],["passive Perception 13"], ["—"], ["0 (10 XP)"], [GetAbility("Pack Tactics")], [GetAction("Bite")]);

EnimiesList[224] = new Enemy("Ice Devil", 18, 180, 40, new Stats(21,14,18,18,15,18),[" bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered"], [" cold, fire, poison"], [" poisoned"], [" Dex +7, Con +9, Wis +7, Cha +9"], ["N/A"], ["blindsight 60 ft., darkvision 120 ft., passive Perception 12"], ["Infernal, telepathy 120 ft."], ["14 (11500 XP)"], [GetAbility("Devil's Sight"),GetAbility("Magic Resistance")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claws"),GetAction("Tail"),GetAction("Wall of Ice (Recharge 6)")]);

EnimiesList[225] = new Enemy("Ice Mephit", 11, 21, 30, new Stats(7 ,13,10,9 ,11,12),["N/A"], [" cold, poison"], [" poisoned"], ["N/A"], [" Perception +2, Stealth +3"],["darkvision 60 ft., passive Perception 12"], ["Aquan, Auran"], ["1/2 (100 XP)"], [GetAbility("Death Burst"),GetAbility("False Appearance"),GetAbility("Innate Spellcasting (1/Day)")], [GetAction("Claws"),GetAction("Frost Breath (Recharge 6)")]);

EnimiesList[226] = new Enemy("Imp", 13, 10, 20, new Stats(6 ,17,13,11,12,14),[" cold; bludgeoning, piercing, and slashing from nonmagical attacks not made with silvered weapons"], [" fire, poison"], [" poisoned"], ["N/A"], [" Deception +4, Insight +3, Persuasion +4, Stealth +5"],["darkvision 120 ft., passive Perception 11"], ["Infernal, Common"], ["1 (200 XP)"], [GetAbility("Shapechanger"),GetAbility("Devil's Sight"),GetAbility("Magic Resistance")], [GetAction("Sting (Bite in Beast Form)"),GetAction("Invisibility")]);

EnimiesList[227] = new Enemy("Intellect Devourer", 12, 21, 40, new Stats(6 ,14,13,12,11,10),[" bludgeoning, piercing, and slashing from nonmagical attacks"], ["N/A"], [" blinded"], ["N/A"], [" Perception +2, Stealth +4"],["blindsight 60 ft. (blind beyond this radius), passive Perception 12"], ["understands Deep Speech but can't speak, telepathy 60 ft."], ["2 (450 XP)"], [GetAbility("Detect Sentience")], [GetAction("Multiattack"),GetAction("Claws"),GetAction("Devour Intellect"),GetAction("Body Thief")]);

EnimiesList[228] = new Enemy("Invisible Stalker", 14, 104, 50, new Stats(16,19,14,10,15,11),[" bludgeoning, piercing, and slashing from nonmagical attacks"], [" poison"], [" exhaustion, grappled, paralyzed, petrified, poisoned, prone, restrained, unconscious"], ["N/A"], [" Perception +8, Stealth +10"],["darkvision 60 ft., passive Perception 18"], ["Auran, understands Common but doesn't speak it"], ["6 (2300 XP)"], [GetAbility("Invisibility"),GetAbility("Faultless Tracker")], [GetAction("Multiattack"),GetAction("Slam")]);

EnimiesList[229] = new Enemy("Iron Golem", 20, 210, 30, new Stats(24,9 ,20,3 ,11,1 ),["N/A"], [" fire, poison, psychic; bludgeoning, piercing, and slashing from nonmagical attacks that aren't adamantine"], [" charmed, exhaustion, frightened, paralyzed, petrified, poisoned"], ["N/A"], ["N/A"], ["darkvision 120 ft., passive Perception 10"], ["understands the languages of its creator but can't speak"], ["16 (15000 XP)"], [GetAbility("Fire Absorption"),GetAbility("Immutable Form"),GetAbility("Magic Resistance"),GetAbility("Magic Weapons")], [GetAction("Multiattack"),GetAction("Slam"),GetAction("Sword"),GetAction("Poison Breath (Recharge 6)")]);

EnimiesList[230] = new Enemy("Jackal", 12, 3, 40, new Stats(8 ,15,11,3 ,12,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3"],["passive Perception 13"], ["—"], ["0 (10 XP)"], [GetAbility("Keen Hearing and Smell"),GetAbility("Pack Tactics")], [GetAction("Bite")]);

EnimiesList[231] = new Enemy("Jackalwere", 12, 18, 40, new Stats(11,15,11,13,11,10),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Deception +4, Perception +2, Stealth +4"],["passive Perception 12"], ["Common (can't speak in jackal form)"], ["1/2 (100 XP)"], [GetAbility("Shapechanger"),GetAbility("Keen Hearing and Smell"),GetAbility("Pack Tactics")], [GetAction("Bite (Jackal or Hybrid Form Only)"),GetAction("Scimitar (Human or Hybrid Form Only)"),GetAction("Sleep Gaze")]);

EnimiesList[232] = new Enemy("Kenku", 13, 13, 30, new Stats(10,16,10,11,10,10),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Deception +4, Perception +2, Stealth +5"],["passive Perception 12"], ["understands Auran and Common but speaks only through the use of its Mimicry trait"], ["1/4 (50 XP)"], [GetAbility("Ambusher"),GetAbility("Mimicry")], [GetAction("Shortsword"),GetAction("Shortbow")]);

EnimiesList[233] = new Enemy("Killer Whale", 12, 90, 0, new Stats(19,10,13,3 ,12,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3"],["blindsight 120 ft., passive Perception 13"], ["—"], ["3 (700 XP)"], [GetAbility("Echolocation"),GetAbility("Hold Breath"),GetAbility("Keen Hearing")], [GetAction("Bite")]);

EnimiesList[234] = new Enemy("Knight", 18, 52, 30, new Stats(16,11,14,11,11,15),["N/A"], ["N/A"], ["N/A"], [" Con +4, Wis +2"], ["N/A"], ["passive Perception 10"], ["any one language (usually Common)"], ["3 (700 XP)"], [GetAbility("Brave")], [GetAction("Multiattack"),GetAction("Greatsword"),GetAction("Heavy Crossbow"),GetAction("Leadership (Recharges after a Short or Long Rest)"),GetAction("Parry")]);

EnimiesList[235] = new Enemy("Kobold", 12, 5, 30, new Stats(7 ,15,9 ,8 ,7 ,8 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 8"], ["Common, Draconic"], ["1/8 (25 XP)"], [GetAbility("Sunlight Sensitivity"),GetAbility("Pack Tactics")], [GetAction("Dagger"),GetAction("Sling")]);

EnimiesList[236] = new Enemy("Kraken", 18, 472, 20, new Stats(30,11,25,22,18,20),["N/A"], [" lightning; bludgeoning, piercing, and slashing from nonmagical attacks"], [" frightened, paralyzed"], [" Str +17, Dex +7, Con +14, Int +13, Wis +11"], ["N/A"], ["truesight 120 ft., passive Perception 14"], ["understands Abyssal, Celestial, Infernal, and Primordial but can't speak, telepathy 120 ft."], ["23 (50000 XP)"], [GetAbility("Amphibious"),GetAbility("Freedom of Movement"),GetAbility("Siege Monster")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Tentacle"),GetAction("Fling"),GetAction("Lightning Storm"),GetAction("The kraken can take 3 legendary actions, choosing from the options below"),GetAction("Tentacle Attack or Fling")], [GetAction("Lightning Storm (Costs 2 Actions)")], [GetAction("Ink Cloud (Costs 3 Actions)")]);

EnimiesList[237] = new Enemy("Kuo-toa", 13, 18, 30, new Stats(13,10,11,11,10,8 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +4"],["darkvision 120 ft., passive Perception 14"], ["Undercommon"], ["1/4 (50 XP)"], [GetAbility("Amphibious"),GetAbility("Otherworldly Perception"),GetAbility("Slippery"),GetAbility("Sunlight Sensitivity")], [GetAction("Bite"),GetAction("Spear"),GetAction("Net"),GetAction("Sticky Shield")]);

EnimiesList[238] = new Enemy("Kuo-toa Archpriest", 13, 97, 30, new Stats(16,14,16,13,16,14),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +9, Religion +6"],["darkvision 120 ft., passive Perception 19"], ["Undercommon"], ["6 (2300 XP)"], [GetAbility("Amphibious"),GetAbility("Otherworldly Perception"),GetAbility("Slippery"),GetAbility("Sunlight Sensitivity"),GetAbility("Spellcasting")], [GetAction("Multiattack"),GetAction("Scepter"),GetAction("Unarmed Strike")]);

EnimiesList[239] = new Enemy("Kuo-toa Whip", 11, 65, 30, new Stats(14,10,14,12,14,11),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +6, Religion +4"],["darkvision 120 ft., passive Perception 16"], ["Undercommon"], ["1 (200 XP)"], [GetAbility("Amphibious"),GetAbility("Otherworldly Perception"),GetAbility("Slippery"),GetAbility("Sunlight Sensitivity"),GetAbility("Spellcasting")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Pincer Staff")]);

EnimiesList[240] = new Enemy("Lamia", 13, 97, 30, new Stats(16,13,15,14,15,16),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Deception +7, Insight +4, Stealth +3"],["darkvision 60 ft., passive Perception 12"], ["Abyssal, Common"], ["4 (1100 XP)"], [GetAbility("Innate Spellcasting")], [GetAction("Multiattack"),GetAction("Claws"),GetAction("Dagger"),GetAction("Intoxicating Touch")]);

EnimiesList[241] = new Enemy("Lemure", 7, 13, 15, new Stats(10,5 ,11,1 ,11,3 ),[" cold"], [" fire, poison"], [" charmed, frightened, poisoned"], ["N/A"], ["N/A"], ["darkvision 120 ft., passive Perception 10"], ["understands Infernal but can't speak"], ["0 (10 XP)"], [GetAbility("Devil's Sight"),GetAbility("Hellish Rejuvenation")], [GetAction("Fist")]);

EnimiesList[242] = new Enemy("Lich", 17, 135, 30, new Stats(11,16,16,20,14,16),[" cold, lightning, necrotic"], [" poison; bludgeoning, piercing, and slashing from nonmagical attacks"], [" charmed, exhaustion, frightened, paralyzed, poisoned"], [" Con +10, Int +12, Wis +9"], [" Arcana +19, History +12, Insight +9, Perception +9"],["truesight 120 ft., passive Perception 19"], ["Common plus up to five other languages"], ["21 (33000 XP)"], [GetAbility("Legendary Resistance (3/Day)"),GetAbility("Rejuvenation"),GetAbility("Spellcasting"),GetAbility("Turn Resistance")], [GetAction("Paralyzing Touch"),GetAction("The lich can take 3 legendary actions, choosing from the options below"),GetAction("Cantrip")], [GetAction("Paralyzing Touch (Costs 2 Actions)")], [GetAction("Frightening Gaze (Costs 2 Actions)")], [GetAction("Disrupt Life (Costs 3 Actions)")]);

EnimiesList[243] = new Enemy("Lion", 12, 26, 50, new Stats(17,15,13,3 ,12,8 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3, Stealth +6"],["passive Perception 13"], ["—"], ["1 (200 XP)"], [GetAbility("Keen Smell"),GetAbility("Pack Tactics"),GetAbility("Pounce"),GetAbility("Running Leap")], [GetAction("Bite"),GetAction("Claw")]);

EnimiesList[244] = new Enemy("Lizard", 10, 2, 20, new Stats(2 ,11,10,1 ,8 ,3 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 30 ft., passive Perception 9"], ["—"], ["0 (10 XP)"], [], [GetAction("Bite")]);

EnimiesList[245] = new Enemy("Lizard King/Queen", 15, 78, 30, new Stats(17,12,15,11,11,15),["N/A"], ["N/A"], [" frightened"], [" Con +4, Wis +2"], [" Perception +4, Stealth +5, Survival +4"],["darkvision 60 ft., passive Perception 14"], ["Abyssal, Draconic"], ["4 (1100 XP)"], [GetAbility("Hold Breath"),GetAbility("Skewer")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claws"),GetAction("Trident")]);

EnimiesList[246] = new Enemy("Lizardfolk", 15, 22, 30, new Stats(15,10,13,7 ,12,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3, Stealth +4, Survival +5"],["passive Perception 13"], ["Draconic"], ["1/2 (100 XP)"], [GetAbility("Hold Breath")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Heavy Club"),GetAction("Javelin"),GetAction("Spiked Shield")]);

EnimiesList[247] = new Enemy("Lizardfolk Shaman", 13, 27, 30, new Stats(15,10,13,10,15,8 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +4, Stealth +4, Survival +6"],["passive Perception 14"], ["Draconic"], ["2 (450 XP)"], [GetAbility("Hold Breath"),GetAbility("Spellcasting (Lizardfolk Form Only)")], [GetAction("Multiattack (Lizardfolk Form Only)"),GetAction("Bite"),GetAction("Claws (Lizardfolk Form Only)"),GetAction("Change Shape (Recharges after a Short or Long Rest)")]);

EnimiesList[248] = new Enemy("Mage", 12, 40, 30, new Stats(9 ,14,11,17,12,11),["N/A"], ["N/A"], ["N/A"], [" Int +6, Wis +4"], [" Arcana +6, History +6"],["passive Perception 11"], ["any four languages"], ["6 (2300 XP)"], [GetAbility("Spellcasting")], [GetAction("Dagger")]);

EnimiesList[249] = new Enemy("Magma Mephit", 11, 22, 30, new Stats(8 ,12,12,7 ,10,10),["N/A"], [" fire, poison"], [" poisoned"], ["N/A"], [" Stealth +3"],["darkvision 60 ft., passive Perception 10"], ["Ignan, Terran"], ["1/2 (100 XP)"], [GetAbility("Death Burst"),GetAbility("False Appearance"),GetAbility("Innate Spellcasting (1/Day)")], [GetAction("Claws"),GetAction("Fire Breath (Recharge 6)")]);

EnimiesList[250] = new Enemy("Magmin", 14, 9, 30, new Stats(7 ,15,12,8 ,11,10),[" bludgeoning, piercing, and slashing from nonmagical attacks"], [" fire"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["Ignan"], ["1/2 (100 XP)"], [GetAbility("Death Burst"),GetAbility("Ignited Illumination")], [GetAction("Touch")]);

EnimiesList[251] = new Enemy("Mammoth", 13, 126, 40, new Stats(24,9 ,21,3 ,11,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 10"], ["—"], ["6 (2300 XP)"], [GetAbility("Trampling Charge")], [GetAction("Gore"),GetAction("Stomp")]);

EnimiesList[252] = new Enemy("Manes", 9, 9, 20, new Stats(10,9 ,13,3 ,8 ,4 ),[" cold, fire, lightning"], [" poison"], [" charmed, frightened, poisoned"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 9"], ["understands Abyssal but can't speak"], ["1/8 (25 XP)"], [], [GetAction("Claws")]);

EnimiesList[253] = new Enemy("Manticore", 14, 68, 30, new Stats(17,16,17,7 ,12,8 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 11"], ["Common"], ["3 (700 XP)"], [GetAbility("Tail Spike Regrowth")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Tail Spike")]);

EnimiesList[254] = new Enemy("Marid", 17, 229, 30, new Stats(22,12,26,18,17,18),[" acid, cold, lightning"], ["N/A"], ["N/A"], [" Dex +5, Wis +7, Cha +8"], ["N/A"], ["blindsight 30 ft., darkvision 120 ft., passive Perception 13"], ["Aquan"], ["11 (7200 XP)"], [GetAbility("Amphibious"),GetAbility("Elemental Demise"),GetAbility("Innate Spellcasting")], [GetAction("Multiattack"),GetAction("Trident"),GetAction("Water jet")]);

EnimiesList[255] = new Enemy("Marilith", 18, 189, 40, new Stats(18,20,20,18,16,20),[" cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks"], [" poison"], [" poisoned"], [" Str +9, Con +10, Wis +8, Cha +10"], ["N/A"], ["truesight 120 ft., passive Perception 13"], ["Abyssal, telepathy 120 ft."], ["16 (15000 XP)"], [GetAbility("Magic Resistance"),GetAbility("Magic Weapons"),GetAbility("Reactive")], [GetAction("Multiattack"),GetAction("Longsword"),GetAction("Tail"),GetAction("Teleport"),GetAction("Parry")]);

EnimiesList[256] = new Enemy("Mastiff", 12, 5, 40, new Stats(13,14,12,3 ,12,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3"],["passive Perception 13"], ["—"], ["1/8 (25 XP)"], [GetAbility("Keen Hearing and Smell")], [GetAction("Bite")]);

EnimiesList[257] = new Enemy("Medusa", 15, 127, 30, new Stats(10,15,16,12,13,15),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Deception +5, Insight +4, Perception +4, Stealth +5"],["darkvision 60 ft., passive Perception 14"], ["Common"], ["6 (2300 XP)"], [GetAbility("Petrifying Gaze")], [GetAction("Multiattack"),GetAction("Snake Hair"),GetAction("Shortsword"),GetAction("Longbow")]);

EnimiesList[258] = new Enemy("Merfolk", 11, 11, 10, new Stats(10,13,12,11,11,12),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +2"],["passive Perception 12"], ["Aquan, Common"], ["1/8 (25 XP)"], [GetAbility("Amphibious")], [GetAction("Spear")]);

EnimiesList[259] = new Enemy("Merrow", 13, 45, 10, new Stats(18,10,15,8 ,10,9 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["Abyssal, Aquan"], ["2 (450 XP)"], [GetAbility("Amphibious")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claws"),GetAction("Harpoon")]);

EnimiesList[260] = new Enemy("Mezzoloth", 18, 75, 40, new Stats(18,11,16,7 ,10,11),[" cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks"], [" acid, poison"], [" poisoned"], ["N/A"], [" Perception +3"],["blindsight 60 ft., darkvision 60 ft., passive Perception 13"], ["Abyssal, Infernal, telepathy 60 ft."], ["5 (1800 XP)"], [GetAbility("Innate Spellcasting"),GetAbility("Magic Resistance"),GetAbility("Magic Weapons")], [GetAction("Multiattack"),GetAction("Claws"),GetAction("Trident"),GetAction("Teleport")]);

EnimiesList[261] = new Enemy("Mimic", 12, 58, 15, new Stats(17,12,15,5 ,13,8 ),["N/A"], [" acid"], [" prone"], ["N/A"], [" Stealth +5"],["darkvision 60 ft., passive Perception 11"], ["—"], ["2 (450 XP)"], [GetAbility("Shapechanger"),GetAbility("Adhesive (Object Form Only)"),GetAbility("False Appearance (Object Form Only)"),GetAbility("Grappler")], [GetAction("Pseudopod"),GetAction("Bite")]);

EnimiesList[262] = new Enemy("Mind Flayer", 15, 71, 30, new Stats(11,12,12,19,17,17),["N/A"], ["N/A"], ["N/A"], [" Int +7, Wis +6, Cha +6"], [" Arcana +7, Deception +6, Insight +6, Perception +6, Persuasion +6, Stealth +4"],["darkvision 120 ft., passive Perception 16"], ["Deep Speech, Undercommon, telepathy 120 ft."], ["7 (2900 XP)"], [GetAbility("Magic Resistance"),GetAbility("Innate Spellcasting (Psionics)")], [GetAction("Tentacles"),GetAction("Extract Brain"),GetAction("Mind Blast (Recharge 5–6)")]);

EnimiesList[263] = new Enemy("Minotaur", 14, 76, 40, new Stats(18,11,16,6 ,16,9 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +7"],["darkvision 60 ft., passive Perception 17"], ["Abyssal"], ["3 (700 XP)"], [GetAbility("Charge"),GetAbility("Labyrinthine Recall"),GetAbility("Reckless")], [GetAction("Greataxe"),GetAction("Gore")]);

EnimiesList[264] = new Enemy("Minotaur Skeleton", 12, 67, 40, new Stats(18,11,15,6 ,8 ,5 ),["N/A"], [" poison"], [" exhaustion, poisoned"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 9"], ["understands Abyssal but can't speak"], ["2 (450 XP)"], [GetAbility("Charge")], [GetAction("Greataxe"),GetAction("Gore")]);

EnimiesList[265] = new Enemy("Monodrone", 15, 5, 30, new Stats(10,13,12,4 ,10,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["truesight 120 ft., passive Perception 10"], ["Modron"], ["1/8 (25 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[266] = new Enemy("Mud Mephit", 11, 27, 20, new Stats(8 ,12,12,9 ,11,7 ),["N/A"], [" poison"], [" poisoned"], ["N/A"], [" Stealth +3"],["darkvision 60 ft., passive Perception 10"], ["Aquan, Terran"], ["1/4 (50 XP)"], [GetAbility("Death Burst"),GetAbility("False Appearance")], [GetAction("Fists"),GetAction("Mud Breath (Recharge 6)")]);

EnimiesList[267] = new Enemy("Mule", 10, 11, 40, new Stats(14,10,13,2 ,10,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 10"], ["—"], ["1/8 (25 XP)"], [GetAbility("Beast of Burden"),GetAbility("Sure-Footed")], [GetAction("Hooves")]);

EnimiesList[268] = new Enemy("Mummy", 11, 58, 20, new Stats(16,8 ,15,6 ,10,12),[" bludgeoning, piercing, and slashing from nonmagical attacks"], [" necrotic, poison"], [" charmed, exhaustion, frightened, paralyzed, poisoned"], [" Wis +2"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["the languages it knew in life"], ["3 (700 XP)"], [], [GetAction("Multiattack"),GetAction("Rotting Fist"),GetAction("Dreadful Glare")]);

EnimiesList[269] = new Enemy("Mummy Lord", 17, 97, 20, new Stats(18,10,17,11,18,16),["N/A"], [" necrotic, poison; bludgeoning, piercing, and slashing from nonmagical attacks"], [" charmed, exhaustion, frightened, paralyzed, poisoned"], [" Con +8, Int +5, Wis +9, Cha +8"], [" History +5, Religion +5"],["darkvision 60 ft., passive Perception 14"], ["the languages it knew in life"], ["15 (13000 XP)"], [GetAbility("Magic Resistance"),GetAbility("Rejuvenation"),GetAbility("Spellcasting")], [GetAction("Multiattack"),GetAction("Rotting Fist"),GetAction("Dreadful Glare"),GetAction("The mummy lord can take 3 legendary actions, choosing from the options below"),GetAction("Attack"),GetAction("Blinding Dust")], [GetAction("Blasphemous Word (Costs 2 Actions)")], [GetAction("Channel Negative Energy (Costs 2 Actions)")], [GetAction("Whirlwind of Sand (Costs 2 Actions)")]);

EnimiesList[270] = new Enemy("Myconid adult", 12, 22, 20, new Stats(10,10,12,10,13,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 120 ft., passive Perception 11"], ["—"], ["1/2 (100 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[271] = new Enemy("Myconid Sovereign", 13, 60, 30, new Stats(12,10,14,13,15,10),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 120 ft., passive Perception 12"], ["—"], ["2 (450 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[272] = new Enemy("Myconid sprout", 10, 7, 10, new Stats(8 ,10,10,8 ,11,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 120 ft., passive Perception 10"], ["—"], ["0 (10 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[273] = new Enemy("Nalfeshnee", 18, 184, 20, new Stats(21,10,22,19,12,15),[" cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks"], [" poison"], [" poisoned"], [" Con +11, Int +9, Wis +6, Cha +7"], ["N/A"], ["truesight 120 ft., passive Perception 11"], ["Abyssal, telepathy 120 ft."], ["13 (10000 XP)"], [GetAbility("Magic Resistance")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Horror Nimbus (Recharge 5-6)"),GetAction("Teleport")]);

EnimiesList[274] = new Enemy("Needle Blight", 12, 11, 30, new Stats(12,12,13,4 ,8 ,3 ),["N/A"], ["N/A"], [" blinded, deafened"], ["N/A"], ["N/A"], ["blindsight 60 ft. (blind beyond this radius), passive Perception 9"], ["understands Common but can't speak"], ["1/4 (50 XP)"], [], [GetAction("Claws"),GetAction("Needles")]);

EnimiesList[275] = new Enemy("Night Hag", 17, 112, 30, new Stats(18,15,16,16,14,16),[" cold, fire; bludgeoning, piercing, and slashing from nonmagical attacks not made with silvered weapons"], ["N/A"], [" charmed"], ["N/A"], [" Deception +7, Insight +6, Perception +6, Stealth +6"],["darkvision 120 ft., passive Perception 16"], ["Abyssal, Common, Infernal, Primordial"], ["5 (1800 XP)"], [GetAbility("Innate Spellcasting"),GetAbility("Magic Resistance")], [GetAction("Claws (Hag Form Only)"),GetAction("Change Shape"),GetAction("Etherealness"),GetAction("Nightmare Haunting (1/Day)")]);

EnimiesList[276] = new Enemy("Nightmare", 13, 68, 60, new Stats(18,15,16,10,13,15),["N/A"], [" fire"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 11"], ["understands Abyssal, Common, and Infernal but can't speak"], ["3 (700 XP)"], [GetAbility("Confer Fire Resistance"),GetAbility("Illumination")], [GetAction("Hooves"),GetAction("Ethereal Stride")]);

EnimiesList[277] = new Enemy("Noble", 15, 9, 30, new Stats(11,12,11,12,14,16),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Deception +5, Insight +4, Persuasion +5"],["passive Perception 12"], ["any two languages"], ["1/8 (25 XP)"], [], [GetAction("Rapier"),GetAction("Parry")]);

EnimiesList[278] = new Enemy("Nothic", 15, 45, 30, new Stats(14,16,16,13,10,8 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Arcana +3, Insight +4, Perception +2, Stealth +5"],["truesight 120 ft., passive Perception 12"], ["Undercommon"], ["2 (450 XP)"], [GetAbility("Keen Sight")], [GetAction("Multiattack"),GetAction("Claw"),GetAction("Rotting Gaze"),GetAction("Weird Insight")]);

EnimiesList[279] = new Enemy("Nycaloth", 18, 123, 40, new Stats(20,11,19,12,10,15),[" cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks"], [" acid, poison"], [" poisoned"], ["N/A"], [" Intimidation +6, Perception +4, Stealth +4"],["blindsight 60 ft., darkvision 60 ft., passive Perception 14"], ["Abyssal, Infernal, telepathy 60 ft."], ["9 (5000 XP)"], [GetAbility("Innate Spellcasting"),GetAbility("Magic Resistance"),GetAbility("Magic Weapons")], [GetAction("Multiattack"),GetAction("Claw"),GetAction("Greataxe"),GetAction("Teleport")]);

EnimiesList[280] = new Enemy("Ochre Jelly", 8, 45, 10, new Stats(15,6 ,14,2 ,6 ,1 ),[" acid"], [" lightning, slashing"], [" blinded, charmed, deafened, exhaustion, frightened, prone"], ["N/A"], ["N/A"], ["blindsight 60 ft. (blind beyond this radius), passive Perception 8"], ["—"], ["2 (450 XP)"], [GetAbility("Amorphous"),GetAbility("Spider Climb")], [GetAction("Pseudopod"),GetAction("Split")]);

EnimiesList[281] = new Enemy("Octopus", 12, 3, 5, new Stats(4 ,15,11,3 ,10,4 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +2, Stealth +4"],["darkvision 30 ft., passive Perception 12"], ["—"], ["0 (10 XP)"], [GetAbility("Hold Breath"),GetAbility("Underwater Camouflage"),GetAbility("Water Breathing")], [GetAction("Tentacles"),GetAction("Ink Cloud (Recharges after a Short or Long Rest)")]);

EnimiesList[282] = new Enemy("Ogre", 11, 59, 40, new Stats(19,8 ,16,5 ,7 ,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 8"], ["Common, Giant"], ["2 (450 XP)"], [], [GetAction("Greatclub"),GetAction("Javelin")]);

EnimiesList[283] = new Enemy("Ogre Zombie", 8, 85, 30, new Stats(19,6 ,18,3 ,6 ,5 ),["N/A"], [" poison"], [" poisoned"], [" Wis +0"], ["N/A"], ["darkvision 60 ft., passive Perception 8"], ["understands Common and Giant but can't speak"], ["2 (450 XP)"], [GetAbility("Undead Fortitude")], [GetAction("Morningstar")]);

EnimiesList[284] = new Enemy("Oni", 16, 110, 30, new Stats(19,11,16,14,12,15),["N/A"], ["N/A"], ["N/A"], [" Dex +3, Con +6, Wis +4, Cha +5"], [" Arcana +5, Deception +8, Perception +4"],["darkvision 60 ft., passive Perception 14"], ["Common, Giant"], ["7 (2900 XP)"], [GetAbility("Innate Spellcasting"),GetAbility("Magic Weapons"),GetAbility("Regeneration")], [GetAction("Multiattack"),GetAction("Claw (Oni Form Only)"),GetAction("Glaive"),GetAction("Change Shape")]);

EnimiesList[285] = new Enemy("Orc", 13, 15, 30, new Stats(16,12,16,7 ,11,10),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Intimidation +2"],["darkvision 60 ft., passive Perception 10"], ["Common, Orc"], ["1/2 (100 XP)"], [GetAbility("Aggressive")], [GetAction("Greataxe"),GetAction("Javelin")]);

EnimiesList[286] = new Enemy("Orc Eye of Gruumsh", 16, 45, 30, new Stats(16,12,16,9 ,13,12),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Intimidation +3, Religion +1"],["darkvision 60 ft., passive Perception 11"], ["Common, Orc"], ["2 (450 XP)"], [GetAbility("Aggressive"),GetAbility("Gruumsh's Fury"),GetAbility("Spellcasting")], [GetAction("Spear")]);

EnimiesList[287] = new Enemy("Orc War Chief", 16, 93, 30, new Stats(18,12,18,11,11,16),["N/A"], ["N/A"], ["N/A"], [" Str +6, Con +6, Wis +2"], [" Intimidation +5"],["darkvision 60 ft., passive Perception 10"], ["Common, Orc"], ["4 (1100 XP)"], [GetAbility("Aggressive"),GetAbility("Gruumsh's Fury")], [GetAction("Multiattack"),GetAction("Greataxe"),GetAction("Spear"),GetAction("Battle Cry (1/Day)")]);

EnimiesList[288] = new Enemy("Orog", 18, 42, 30, new Stats(18,12,18,12,11,12),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Intimidation +5, Survival +2"],["darkvision 60 ft., passive Perception 10"], ["Common, Orc"], ["2 (450 XP)"], [GetAbility("Aggressive")], [GetAction("Multiattack"),GetAction("Greataxe"),GetAction("Javelin")]);

EnimiesList[289] = new Enemy("Otyugh", 14, 114, 30, new Stats(16,11,19,6 ,13,6 ),["N/A"], ["N/A"], ["N/A"], [" Con +7"], ["N/A"], ["darkvision 120 ft., passive Perception 11"], ["Otyugh"], ["5 (1800 XP)"], [GetAbility("Limited Telepathy")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Tentacle"),GetAction("Tentacle Slam")]);

EnimiesList[290] = new Enemy("Owl", 11, 1, 5, new Stats(3 ,13,8 ,2 ,12,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3, Stealth +3"],["darkvision 120 ft., passive Perception 13"], ["—"], ["0 (10 XP)"], [GetAbility("Flyby"),GetAbility("Keen Hearing and Sight")], [GetAction("Talons")]);

EnimiesList[291] = new Enemy("Owlbear", 13, 59, 40, new Stats(20,12,17,3 ,12,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3"],["darkvision 60 ft., passive Perception 13"], ["—"], ["3 (700 XP)"], [GetAbility("Keen Sight and Smell")], [GetAction("Multiattack"),GetAction("Beak"),GetAction("Claws")]);

EnimiesList[292] = new Enemy("Panther", 12, 13, 50, new Stats(14,15,10,3 ,14,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +4, Stealth +6"],["passive Perception 14"], ["—"], ["1/4 (50 XP)"], [GetAbility("Keen Smell"),GetAbility("Pounce")], [GetAction("Bite"),GetAction("Claw")]);

EnimiesList[293] = new Enemy("Pegasus", 12, 59, 60, new Stats(18,15,16,10,15,13),["N/A"], ["N/A"], ["N/A"], [" Dex +4, Wis +4, Cha +3"], [" Perception +6"],["passive Perception 16"], ["understands Celestial, Common, Elvish, and Sylvan but can't speak"], ["2 (450 XP)"], [], [GetAction("Hooves")]);

EnimiesList[294] = new Enemy("Pentadrone", 16, 32, 40, new Stats(15,14,12,10,10,13),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +4"],["truesight 120 ft., passive Perception 14"], ["Madron"], ["2 (450 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[295] = new Enemy("Peryton", 13, 33, 20, new Stats(16,12,13,9 ,12,10),[" bludgeoning, piercing, and slashing from nonmagical attacks"], ["N/A"], ["N/A"], ["N/A"], [" Perception +5"],["passive Perception 15"], ["understands Common and Elvish but can't speak"], ["2 (450 XP)"], [GetAbility("Dive Attack"),GetAbility("Flyby"),GetAbility("Keen Sight and Smell")], [GetAction("Multiattack"),GetAction("Gore"),GetAction("Talons")]);

EnimiesList[296] = new Enemy("Phase Spider", 13, 32, 30, new Stats(15,15,12,6 ,10,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Stealth +6"],["darkvision 60 ft., passive Perception 10"], ["—"], ["3 (700 XP)"], [GetAbility("Ethereal Jaunt"),GetAbility("Spider Climb"),GetAbility("Web Walker")], [GetAction("Bite")]);

EnimiesList[297] = new Enemy("Piercer", 15, 22, 5, new Stats(10,13,16,1 ,7 ,3 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Stealth +5"],["blindsight 30 ft., darkvision 60 ft., passive Perception 8"], ["—"], ["1/2 (100 XP)"], [GetAbility("False Appearance"),GetAbility("Spider Climb")], [GetAction("Drop")]);

EnimiesList[298] = new Enemy("Pit Fiend", 19, 300, 30, new Stats(26,14,24,22,18,24),[" cold; bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered"], [" fire, poison"], [" poisoned"], [" Dex +8, Con +13, Wis +10"], ["N/A"], ["truesight 120 ft., passive Perception 14"], ["Infernal, telepathy 120 ft."], ["20 (25000 XP)"], [GetAbility("Fear Aura"),GetAbility("Magic Resistance"),GetAbility("Magic Weapons"),GetAbility("Innate Spellcasting")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Mace"),GetAction("Tail")]);

EnimiesList[299] = new Enemy("Pixie", 15, 1, 10, new Stats(2 ,20,8 ,10,14,15),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +4, Stealth +7"],["passive Perception 14"], ["Sylvan"], ["1/4 (50 XP)"], [GetAbility("Magic Resistance"),GetAbility("Innate Spellcasting")], [GetAction("Superior Invisibility")]);

EnimiesList[300] = new Enemy("Planetar", 19, 200, 40, new Stats(24,20,24,19,22,25),[" radiant; bludgeoning, piercing, and slashing from nonmagical attacks"], ["N/A"], [" charmed, exhaustion, frightened"], [" Con +12, Wis +11, Cha +12"], [" Perception +11"],["truesight 120 ft., passive Perception 21"], ["all, telepathy 120 ft."], ["16 (15000 XP)"], [GetAbility("Angelic Weapons"),GetAbility("Divine Awareness"),GetAbility("Innate Spellcasting"),GetAbility("Magic Resistance")], [GetAction("Multiattack"),GetAction("Greatsword"),GetAction("Healing Touch (4/Day)")]);

EnimiesList[301] = new Enemy("Plesiosaurus", 13, 68, 20, new Stats(18,15,16,2 ,12,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3, Stealth +4"],["passive Perception 13"], ["—"], ["2 (450 XP)"], [GetAbility("Hold Breath")], [GetAction("Bite")]);

EnimiesList[302] = new Enemy("Poisonous Snake", 13, 2, 30, new Stats(2 ,16,11,1 ,10,3 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["blindsight 10 ft., passive Perception 10"], ["—"], ["1/8 (25 XP)"], [], [GetAction("Bite")]);

EnimiesList[303] = new Enemy("Polar Bear", 12, 42, 40, new Stats(20,10,16,2 ,13,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3"],["passive Perception 13"], ["—"], ["2 (450 XP)"], [GetAbility("Keen Smell")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claws")]);

EnimiesList[304] = new Enemy("Pony", 10, 11, 40, new Stats(15,10,13,2 ,11,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 10"], ["—"], ["1/8 (25 XP)"], [], [GetAction("Hooves")]);

EnimiesList[305] = new Enemy("Priest", 13, 27, 30, new Stats(10,10,12,13,16,13),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Medicine +7, Persuasion +3, Religion +5"],["passive Perception 13"], ["any two languages"], ["2 (450 XP)"], [GetAbility("Divine Eminence"),GetAbility("Spellcasting")], [GetAction("Mace")]);

EnimiesList[306] = new Enemy("Pseudodragon", 13, 7, 15, new Stats(6 ,15,13,10,12,10),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3, Stealth +4"],["blindsight 10 ft., darkvision 60 ft., passive Perception 13"], ["understands Common and Draconic but can't speak"], ["1/4 (50 XP)"], [GetAbility("Keen Senses"),GetAbility("Magic Resistance"),GetAbility("Limited Telepathy")], [GetAction("Bite"),GetAction("Sting")]);

EnimiesList[307] = new Enemy("Pteranodon", 13, 13, 10, new Stats(12,15,10,2 ,9 ,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +1"],["passive Perception 11"], ["—"], ["1/4 (50 XP)"], [GetAbility("Flyby")], [GetAction("Bite")]);

EnimiesList[308] = new Enemy("Purple Worm", 18, 247, 50, new Stats(28,7 ,22,1 ,8 ,4 ),["N/A"], ["N/A"], ["N/A"], [" Con +11, Wis +4"], ["N/A"], ["blindsight 30 ft., tremorsense 60 ft., passive Perception 9"], ["—"], ["15 (13000 XP)"], [GetAbility("Tunneler")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Tail Stinger")]);

EnimiesList[309] = new Enemy("Quadrone", 16, 22, 30, new Stats(12,14,12,10,10,11),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +2"],["truesight 120 ft., passive Perception 12"], ["Madron"], ["1 (200 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[310] = new Enemy("Quaggoth", 13, 45, 30, new Stats(17,12,16,6 ,12,7 ),["N/A"], [" poison"], [" poisoned"], ["N/A"], [" Athletics +5"],["darkvision 120 ft., passive Perception 10"], ["Undercommon"], ["2 (450 XP)"], [GetAbility("Wounded Fury")], [GetAction("Multiattack"),GetAction("Claw")]);

EnimiesList[311] = new Enemy("Quaggoth spore servant", 13, 45, 20, new Stats(17,12,16,2 ,6 ,1 ),["N/A"], [" poison"], [" blinded, charmed, frightened, paralyzed, poisoned"], ["N/A"], ["N/A"], ["blindsight 30 ft. (blind beyond this radius), passive Perception 8"], ["—"], ["1 (200 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[312] = new Enemy("Quasit", 13, 7, 40, new Stats(5 ,17,10,7 ,10,10),[" cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks"], [" poison"], [" poisoned"], ["N/A"], [" Stealth +5"],["darkvision 120 ft., passive Perception 10"], ["Abyssal, Common"], ["1 (200 XP)"], [GetAbility("Shapechanger"),GetAbility("Magic Resistance")], [GetAction("Claws (Bite in Beast Form)"),GetAction("Scare (1/Day)"),GetAction("Invisibility")]);

EnimiesList[313] = new Enemy("Quipper", 13, 1, 0, new Stats(2 ,16,9 ,1 ,7 ,2 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 8"], ["—"], ["0 (10 XP)"], [GetAbility("Blood Frenzy"),GetAbility("Water Breathing")], [GetAction("Bite")]);

EnimiesList[314] = new Enemy("Rakshasa", 16, 110, 40, new Stats(14,17,18,13,16,20),["N/A"], [" bludgeoning, piercing, and slashing from nonmagical attacks"], ["N/A"], ["N/A"], [" Deception +10, Insight +8"],["darkvision 60 ft., passive Perception 13"], ["Common, Infernal"], ["13 (10000 XP)"], [GetAbility("Limited Magic Immunity"),GetAbility("Innate Spellcasting")], [GetAction("Multiattack"),GetAction("Claw")]);

EnimiesList[315] = new Enemy("Rat", 10, 1, 20, new Stats(2 ,11,9 ,2 ,10,4 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 30 ft., passive Perception 10"], ["—"], ["0 (10 XP)"], [GetAbility("Keen Smell")], [GetAction("Bite")]);

EnimiesList[316] = new Enemy("Raven", 12, 1, 10, new Stats(2 ,14,8 ,2 ,12,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3"],["passive Perception 13"], ["—"], ["0 (10 XP)"], [GetAbility("Mimicry")], [GetAction("Beak")]);

EnimiesList[317] = new Enemy("Red Dragon Wyrmling", 17, 75, 30, new Stats(19,10,17,12,11,15),["N/A"], [" fire"], ["N/A"], [" Dex +2, Con +5, Wis +2, Cha +4"], [" Perception +4, Stealth +2"],["blindsight 10 ft., darkvision 60 ft., passive Perception 14"], ["Draconic"], ["4 (1100 XP)"], [], [GetAction("Bite"),GetAction("Fire Breath (Recharge 5-6)")]);

EnimiesList[318] = new Enemy("Red Slaad", 14, 93, 30, new Stats(16,12,16,6 ,6 ,7 ),[" acid, cold, fire, lightning, thunder"], ["N/A"], ["N/A"], ["N/A"], [" Perception + 1"],["darkvision 60 ft., passive Perception 11"], ["Slaad, telepathy 60 ft."], ["5 (1800 XP)"], [GetAbility("Magic Resistance"),GetAbility("Regeneration")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw")]);

EnimiesList[319] = new Enemy("Reef Shark", 12, 22, 0, new Stats(14,13,13,1 ,10,4 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +2"],["blindsight 30 ft., passive Perception 12"], ["—"], ["1/2 (100 XP)"], [GetAbility("Pack Tactics"),GetAbility("Water Breathing")], [GetAction("Bite")]);

EnimiesList[320] = new Enemy("Remorhaz", 17, 195, 30, new Stats(24,13,21,4 ,10,5 ),["N/A"], [" cold, fire"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., tremorsense 60 ft., passive Perception 10"], ["—"], ["11 (7200 XP)"], [GetAbility("Heated Body")], [GetAction("Bite"),GetAction("Swallow")]);

EnimiesList[321] = new Enemy("Revenant", 13, 136, 30, new Stats(18,14,18,13,16,18),[" necrotic, psychic"], [" poison"], [" charmed, exhaustion, frightened, paralyzed, poisoned, stunned"], [" Str +7, Con +7, Wis +6, Cha +7"], ["N/A"], ["darkvision 60 ft., passive Perception 13"], ["the languages it knew in life"], ["5 (1800 XP)"], [GetAbility("Regeneration"),GetAbility("Rejuvenation"),GetAbility("Turn Immunity"),GetAbility("Vengeful Tracker")], [GetAction("Multiattack"),GetAction("Fist"),GetAction("Vengeful Glare")]);

EnimiesList[322] = new Enemy("Rhinoceros", 11, 45, 40, new Stats(21,8 ,15,2 ,12,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 11"], ["—"], ["2 (450 XP)"], [GetAbility("Charge")], [GetAction("Gore")]);

EnimiesList[323] = new Enemy("Riding Horse", 10, 13, 60, new Stats(16,10,12,2 ,11,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 10"], ["—"], ["1/4 (50 XP)"], [], [GetAction("Hooves")]);

EnimiesList[324] = new Enemy("Roc", 15, 248, 20, new Stats(28,10,20,3 ,10,9 ),["N/A"], ["N/A"], ["N/A"], [" Dex +4, Con +9, Wis +4, Cha +3"], [" Perception +4"],["passive Perception 14"], ["—"], ["11 (7200 XP)"], [GetAbility("Keen Sight")], [GetAction("Multiattack"),GetAction("Beak"),GetAction("Talons")]);

EnimiesList[325] = new Enemy("Roper", 20, 93, 10, new Stats(18,8 ,17,7 ,16,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +6, Stealth +5"],["darkvision 60 ft., passive Perception 16"], ["—"], ["5 (1800 XP)"], [GetAbility("False Appearance"),GetAbility("Grasping Tendrils"),GetAbility("Spider Climb")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Tendril"),GetAction("Reel")]);

EnimiesList[326] = new Enemy("Rug of Smothering", 12, 33, 10, new Stats(17,14,10,1 ,3 ,1 ),["N/A"], [" poison, psychic"], [" blinded, charmed, deafened, frightened, paralyzed, petrified, poisoned"], ["N/A"], ["N/A"], ["blindsight 60 ft. (blind beyond this radius), passive Perception 6"], ["—"], ["2 (450 XP)"], [GetAbility("Antimagic Susceptibility"),GetAbility("Damage Transfer"),GetAbility("False Appearance")], [GetAction("Smother")]);

EnimiesList[327] = new Enemy("Rust Monster", 14, 27, 40, new Stats(13,12,13,2 ,13,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 11"], ["—"], ["1/2 (100 XP)"], [GetAbility("Iron Scent"),GetAbility("Rust Metal")], [GetAction("Bite"),GetAction("Antennae")]);

EnimiesList[328] = new Enemy("Saber-Toothed Tiger", 12, 52, 40, new Stats(18,14,15,3 ,12,8 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3, Stealth +6"],["passive Perception 13"], ["—"], ["2 (450 XP)"], [GetAbility("Keen Smell"),GetAbility("Pounce")], [GetAction("Bite"),GetAction("Claw")]);

EnimiesList[329] = new Enemy("Sahuagin", 12, 22, 30, new Stats(13,11,12,12,13,9 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +5"],["darkvision 120 ft., passive Perception 15"], ["Sahuagin"], ["1/2 (100 XP)"], [GetAbility("Blood Frenzy"),GetAbility("Limited Amphibiousness"),GetAbility("Shark Telepathy")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claws"),GetAction("Spear")]);

EnimiesList[330] = new Enemy("Sahuagin Baron", 16, 76, 30, new Stats(19,15,16,14,13,17),["N/A"], ["N/A"], ["N/A"], [" Dex +5, Con +6, Int +5, Wis +4"], [" Perception +7"],["darkvision 120 ft., passive Perception 17"], ["Sahuagin"], ["5 (1800 XP)"], [GetAbility("Blood Frenzy"),GetAbility("Limited Amphibiousness"),GetAbility("Shark Telepathy")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claws"),GetAction("Trident")]);

EnimiesList[331] = new Enemy("Sahuagin Priestess", 12, 33, 30, new Stats(13,11,12,12,14,13),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +6, Religion +3"],["darkvision 120 ft., passive Perception 16"], ["Sahuagin"], ["2 (450 XP)"], [GetAbility("Blood Frenzy"),GetAbility("Limited Amphibiousness"),GetAbility("Shark Telepathy"),GetAbility("Spellcasting")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claws")]);

EnimiesList[332] = new Enemy("Salamander", 15, 90, 30, new Stats(18,14,15,11,10,12),[" bludgeoning, piercing, and slashing from nonmagical attacks"], [" fire"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["Ignan"], ["5 (1800 XP)"], [GetAbility("Heated Body"),GetAbility("Heated Weapons")], [GetAction("Multiattack"),GetAction("Spear"),GetAction("Tail")]);

EnimiesList[333] = new Enemy("Satyr", 14, 31, 40, new Stats(12,16,11,12,10,14),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +2, Performance +6, Stealth +5"],["passive Perception 12"], ["Common, Elvish, Sylvan"], ["1/2 (100 XP)"], [GetAbility("Magic Resistance")], [GetAction("Ram"),GetAction("Shortsword"),GetAction("Shortbow")]);

EnimiesList[334] = new Enemy("Scarecrow", 11, 36, 30, new Stats(11,13,11,10,10,13),[" bludgeoning, piercing, and slashing from nonmagical attacks"], [" poison"], [" charmed, exhaustion, frightened, paralyzed, poisoned, unconscious"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["understands the languages of its creator but can't speak"], ["1 (200 XP)"], [GetAbility("False Appearance")], [GetAction("Multiattack"),GetAction("Claw"),GetAction("Terrifying Glare")]);

EnimiesList[335] = new Enemy("Scorpion", 11, 1, 10, new Stats(2 ,11,8 ,1 ,8 ,2 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["blindsight 10 ft., passive Perception 9"], ["—"], ["0 (10 XP)"], [], [GetAction("Sting")]);

EnimiesList[336] = new Enemy("Scout", 13, 16, 30, new Stats(11,14,12,11,13,11),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Nature +4, Perception +5, Stealth +6, Survival +5"],["passive Perception 15"], ["any one language (usually Common)"], ["1/2 (100 XP)"], [GetAbility("Keen Hearing and Sight")], [GetAction("Multiattack"),GetAction("Shortsword"),GetAction("Longbow")]);

EnimiesList[337] = new Enemy("Sea Hag", 14, 52, 30, new Stats(16,13,16,12,12,13),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 11"], ["Aquan, Common, Giant"], ["2 (450 XP)"], [GetAbility("Amphibious"),GetAbility("Horrific Appearance")], [GetAction("Claws"),GetAction("Death Glare"),GetAction("Illusory Appearance")]);

EnimiesList[338] = new Enemy("Sea Horse", 11, 1, 0, new Stats(1 ,12,8 ,1 ,10,2 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 10"], ["—"], ["0 (0 XP)"], [GetAbility("Water Breathing"),]);

EnimiesList[339] = new Enemy("Shadow", 12, 16, 40, new Stats(6 ,14,13,6 ,10,8 ),[" acid, cold, fire, lightning, thunder; bludgeoning, piercing, and slashing from nonmagical attacks"], [" necrotic, poison"], [" exhaustion, frightened, grappled, paralyzed, petrified, poisoned, prone, restrained"], ["N/A"], [" Stealth +4 (+6 in dim light or darkness)"],["darkvision 60 ft., passive Perception 10"], ["—"], ["1/2 (100 XP)"], [GetAbility("Amorphous"),GetAbility("Shadow Stealth"),GetAbility("Sunlight Weakness")], [GetAction("Strength Drain")]);

EnimiesList[340] = new Enemy("Shadow Demon", 13, 66, 30, new Stats(1 ,17,12,14,13,14),[" acid, fire, necrotic, thunder; bludgeoning, piercing, and slashing from nonmagical attacks"], [" cold, lightning, poison"], [" exhaustion, grappled, paralyzed, petrified, poisoned, prone, restrained"], [" Dex +5, Cha +4"], [" Stealth +7"],["darkvision 120 ft., passive Perception 11"], ["Abyssal, telepathy 120 ft."], ["4 (1100 XP)"], [GetAbility("Incorporeal Movement"),GetAbility("Light Sensitivity"),GetAbility("Shadow Stealth")], [GetAction("Claws")]);

EnimiesList[341] = new Enemy("Shambling Mound", 15, 136, 20, new Stats(18,8 ,16,5 ,10,5 ),[" cold, fire"], [" lightning"], [" blinded, deafened, exhaustion"], ["N/A"], [" Stealth +2"],["blindsight 60 ft. (blind beyond this radius), passive Perception 10"], ["—"], ["5 (1800 XP)"], [GetAbility("Lightning Absorption")], [GetAction("Multiattack"),GetAction("Slam"),GetAction("Engulf")]);

EnimiesList[342] = new Enemy("Shield Guardian", 17, 142, 30, new Stats(18,8 ,18,7 ,10,3 ),["N/A"], [" poison"], [" charmed, exhaustion, frightened, paralyzed, poisoned"], ["N/A"], ["N/A"], ["blindsight 10 ft., darkvision 60 ft., passive Perception 10"], ["understands commands given in any language but can't speak"], ["7 (2900 XP)"], [GetAbility("Bound"),GetAbility("Regeneration"),GetAbility("Spell Storing")], [GetAction("Multiattack"),GetAction("Fist"),GetAction("Shield")]);

EnimiesList[343] = new Enemy("Shrieker", 5, 13, 0, new Stats(1 ,1 ,10,1 ,3 ,1 ),["N/A"], ["N/A"], [" blinded, deafened, frightened"], ["N/A"], ["N/A"], ["blindsight 30 ft. (blind beyond this radius), passive Perception 6"], ["—"], ["0 (10 XP)"], [GetAbility("False Appearance"),GetAbility("Shriek"),]);

EnimiesList[344] = new Enemy("Silver Dragon Wyrmling", 17, 45, 30, new Stats(19,10,17,12,11,15),["N/A"], [" cold"], ["N/A"], [" Dex +2, Con +5, Wis +2, Cha +4"], [" Perception +4, Stealth +2"],["blindsight 10 ft., darkvision 60 ft., passive Perception 14"], ["Draconic"], ["2 (450 XP)"], [], [GetAction("Bite"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Cold Breath"),GetAction("Paralyzing Breath")]);

EnimiesList[345] = new Enemy("Skeleton", 13, 13, 30, new Stats(10,14,15,6 ,8 ,5 ),["N/A"], [" poison"], [" exhaustion, poisoned"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 9"], ["understands the languages it knew in life but can't speak"], ["1/4 (50 XP)"], [], [GetAction("Shortsword"),GetAction("Shortbow")]);

EnimiesList[346] = new Enemy("Slaad Tadpole", 12, 10, 30, new Stats(7 ,15,10,3 ,5 ,3 ),[" acid, cold, fire, lightning, thunder"], ["N/A"], ["N/A"], ["N/A"], [" Stealth +4"],["darkvision 60 ft., passive Perception 7"], ["understands Slaad but can't speak"], ["1/8 (25 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[347] = new Enemy("Smoke Mephit", 12, 22, 30, new Stats(6 ,14,12,10,10,11),["N/A"], [" fire, poison"], [" poisoned"], ["N/A"], [" Perception +2, Stealth +4"],["darkvision 60 ft., passive Perception 12"], ["Auran, Ignan"], ["1/4 (50 XP)"], [GetAbility("Death Burst"),GetAbility("Innate Spellcasting (1/Day)")], [GetAction("Claws"),GetAction("Cinder Breath (Recharge 6)")]);

EnimiesList[348] = new Enemy("Solar", 21, 243, 50, new Stats(26,22,26,25,25,30),[" radiant; bludgeoning, piercing, and slashing from nonmagical attacks"], [" necrotic, poison"], [" charmed, exhaustion, frightened, poisoned"], [" Int +14, Wis +14, Cha +17"], [" Perception +14"],["truesight 120 ft., passive Perception 24"], ["all, telepathy 120 ft."], ["21 (33000 XP)"], [GetAbility("Angelic Weapons"),GetAbility("Divine Awareness"),GetAbility("Innate Spellcasting"),GetAbility("Magic Resistance")], [GetAction("Multiattack"),GetAction("Greatsword"),GetAction("Slaying Longbow"),GetAction("Flying Sword"),GetAction("Healing Touch (4/Day)"),GetAction("The solar can take 3 legendary actions, choosing from the options below"),GetAction("Teleport")], [GetAction("Searing Burst (Costs 2 Actions)")], [GetAction("Blinding Gaze (Costs 3 Actions)")]);

EnimiesList[349] = new Enemy("Spectator", 14, 39, 0, new Stats(8 ,14,14,13,14,11),["N/A"], ["N/A"], [" prone"], ["N/A"], [" Perception +6"],["darkvision 120 ft., passive Perception 16"], ["Deep Speech, Undercommon, telepathy 120 ft."], ["3 (700 XP)"], [], [GetAction("Bite"),GetAction("Eye Rays"),GetAction("1- Confusion Ray"),GetAction("2- Paralyzing Ray"),GetAction("3- Fear Ray"),GetAction("4- Wounding Ray"),GetAction("Create Food and Water"),GetAction("Spell Reflection")]);

EnimiesList[350] = new Enemy("Specter", 12, 22, 0, new Stats(1 ,14,11,10,10,11),[" acid, cold, fire, lightning, thunder; bludgeoning, piercing, and slashing from nonmagical attacks"], [" necrotic, poison"], [" charmed, exhaustion, grappled, paralyzed, petrified, poisoned, prone, restrained, unconscious"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["understands the languages it knew in life but can't speak"], ["1 (200 XP)"], [GetAbility("Incorporeal Movement"),GetAbility("Sunlight Sensitivity")], [GetAction("Life Drain")]);

EnimiesList[351] = new Enemy("Spider", 12, 1, 20, new Stats(2 ,14,8 ,1 ,10,2 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Stealth +4"],["darkvision 30 ft., passive Perception 10"], ["—"], ["0 (10 XP)"], [GetAbility("Spider Climb"),GetAbility("Web Sense"),GetAbility("Web Walker")], [GetAction("Bite")]);

EnimiesList[352] = new Enemy("Spined Devil", 13, 22, 20, new Stats(10,15,12,11,14,8 ),[" cold; bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered"], [" fire, poison"], [" poisoned"], ["N/A"], ["N/A"], ["darkvision 120 ft., passive Perception 12"], ["Infernal, telepathy 120 ft."], ["2 (450 XP)"], [GetAbility("Devil's Sight"),GetAbility("Flyby"),GetAbility("Limited Spines"),GetAbility("Magic Resistance")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Fork"),GetAction("Tail Spine")]);

EnimiesList[353] = new Enemy("Spirit Naga", 15, 75, 40, new Stats(18,17,14,16,15,16),["N/A"], [" poison"], [" charmed, poisoned"], [" Dex +6, Con +5, Wis +5, Cha +6"], ["N/A"], ["darkvision 60 ft., passive Perception 12"], ["Abyssal, Common"], ["8 (3900 XP)"], [GetAbility("Rejuvenation"),GetAbility("Spellcasting")], [GetAction("Bite")]);

EnimiesList[354] = new Enemy("Sprite", 15, 2, 10, new Stats(3 ,18,10,14,13,11),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3, Stealth +8"],["passive Perception 13"], ["Common, Elvish, Sylvan"], ["1/4 (50 XP)"], [], [GetAction("Longsword"),GetAction("Shortbow"),GetAction("Heart Sight"),GetAction("Invisibility")]);

EnimiesList[355] = new Enemy("Spy", 12, 27, 30, new Stats(10,15,10,12,14,16),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Deception +5, Insight +4, Investigation +5, Perception +6, Persuasion +5, Sleight of Hand +4, Stealth +4"],["passive Perception 16"], ["any two languages"], ["1 (200 XP)"], [GetAbility("Cunning Action"),GetAbility("Sneak Attack (1/Turn)")], [GetAction("Multiattack"),GetAction("Shortsword"),GetAction("Hand Crossbow")]);

EnimiesList[356] = new Enemy("Steam Mephit", 10, 21, 30, new Stats(5 ,11,10,11,10,12),["N/A"], [" fire, poison"], [" poisoned"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["Aquan, Ignan"], ["1/4 (50 XP)"], [GetAbility("Death Burst"),GetAbility("Innate Spellcasting (1/Day)")], [GetAction("Claws"),GetAction("Steam Breath (Recharge 6)")]);

EnimiesList[357] = new Enemy("Stirge", 14, 2, 10, new Stats(4 ,16,11,2 ,8 ,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 9"], ["—"], ["1/8 (25 XP)"], [], [GetAction("Blood Drain")]);

EnimiesList[358] = new Enemy("Stone Giant", 17, 126, 40, new Stats(23,15,20,10,12,9 ),["N/A"], ["N/A"], ["N/A"], [" Dex +5, Con +8, Wis +4"], [" Athletics +12, Perception +4"],["darkvision 60 ft., passive Perception 14"], ["Giant"], ["7 (2900 XP)"], [GetAbility("Stone Camouflage")], [GetAction("Multiattack"),GetAction("Greatclub"),GetAction("Rock"),GetAction("Rock Catching")]);

EnimiesList[359] = new Enemy("Stone Golem", 17, 178, 30, new Stats(22,9 ,20,3 ,11,1 ),["N/A"], [" poison, psychic; bludgeoning, piercing, and slashing from nonmagical attacks that aren't adamantine"], [" charmed, exhaustion, frightened, paralyzed, petrified, poisoned"], ["N/A"], ["N/A"], ["darkvision 120 ft., passive Perception 10"], ["understands the languages of its creator but can't speak"], ["10 (5900 XP)"], [GetAbility("Immutable Form"),GetAbility("Magic Resistance"),GetAbility("Magic Weapons")], [GetAction("Multiattack"),GetAction("Slam"),GetAction("Slow (Recharge 5-6)")]);

EnimiesList[360] = new Enemy("Storm Giant", 16, 230, 50, new Stats(29,14,20,16,18,18),[" cold"], [" lightning, thunder"], ["N/A"], [" Str +14, Con +10, Wis +9, Cha +9"], [" Arcana +8, Athletics +14, History +8, Perception +9"],["passive Perception 19"], ["Common, Giant"], ["13 (10000 XP)"], [GetAbility("Amphibious"),GetAbility("Innate Spellcasting")], [GetAction("Multiattack"),GetAction("Greatsword"),GetAction("Rock"),GetAction("Lightning Strike (Recharge 5-6)")]);

EnimiesList[361] = new Enemy("Succubus", 15, 66, 30, new Stats(8 ,17,13,15,12,20),[" cold, fire, lightning, poison; bludgeoning, piercing, and slashing from nonmagical attacks"], ["N/A"], ["N/A"], ["N/A"], [" Deception +9, Insight +5, Perception +5, Persuasion +9, Stealth +7"],["darkvision 60 ft., passive Perception 15"], ["Abyssal, Common, Infernal, telepathy 60 ft."], ["4 (1100 XP)"], [GetAbility("Telepathic Bond"),GetAbility("Shapechanger")], [GetAction("Claw (Fiend Form Only)"),GetAction("Charm"),GetAction("Draining Kiss"),GetAction("Etherealness")]);

EnimiesList[362] = new Enemy("Swarm of Bats", 12, 22, 0, new Stats(5 ,15,10,2 ,12,4 ),[" bludgeoning, piercing, slashing"], ["N/A"], [" charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned"], ["N/A"], ["N/A"], ["blindsight 60 ft., passive Perception 11"], ["—"], ["1/4 (50 XP)"], [GetAbility("Echolocation"),GetAbility("Keen Hearing"),GetAbility("Swarm")], [GetAction("Bites")]);

EnimiesList[363] = new Enemy("Swarm of Insects", 12, 22, 20, new Stats(3 ,13,10,1 ,7 ,1 ),[" bludgeoning, piercing, slashing"], ["N/A"], [" charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned"], ["N/A"], ["N/A"], ["blindsight 10 ft., passive Perception 8"], ["—"], ["1/2 (100 XP)"], [GetAbility("Swarm")], [GetAction("Bites")]);

EnimiesList[364] = new Enemy("Swarm of Poisonous Snakes", 14, 36, 30, new Stats(8 ,18,11,1 ,10,3 ),[" bludgeoning, piercing, slashing"], ["N/A"], [" charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned"], ["N/A"], ["N/A"], ["blindsight 10 ft., passive Perception 10"], ["—"], ["2 (450 XP)"], [GetAbility("Swarm")], [GetAction("Bites")]);

EnimiesList[365] = new Enemy("Swarm of Quippers", 13, 28, 0, new Stats(13,16,9 ,1 ,7 ,2 ),[" bludgeoning, piercing, slashing"], ["N/A"], [" charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 8"], ["—"], ["1 (200 XP)"], [GetAbility("Blood Frenzy"),GetAbility("Swarm"),GetAbility("Water Breathing")], [GetAction("Bites")]);

EnimiesList[366] = new Enemy("Swarm of Rats", 10, 24, 30, new Stats(9 ,11,9 ,2 ,10,3 ),[" bludgeoning, piercing, slashing"], ["N/A"], [" charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned"], ["N/A"], ["N/A"], ["darkvision 30 ft., passive Perception 10"], ["—"], ["1/4 (50 XP)"], [GetAbility("Keen Smell"),GetAbility("Swarm")], [GetAction("Bites")]);

EnimiesList[367] = new Enemy("Swarm of Ravens", 12, 24, 10, new Stats(6 ,14,8 ,3 ,12,6 ),[" bludgeoning, piercing, slashing"], ["N/A"], [" charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned"], ["N/A"], [" Perception +5"],["passive Perception 15"], ["—"], ["1/4 (50 XP)"], [GetAbility("Swarm")], [GetAction("Beaks")]);

EnimiesList[368] = new Enemy("Tarrasque", 25, 676, 40, new Stats(30,11,30,3 ,11,11),["N/A"], [" fire, poison; bludgeoning, piercing and slashing from nonmagical attacks"], [" charmed, frightened, paralyzed, poisoned"], [" Int +5, Wis +9, Cha +9"], ["N/A"], ["blindsight 120 ft., passive Perception 10"], ["—"], ["30 (155000 XP)"], [GetAbility("Legendary Resistance (3/Day)"),GetAbility("Magic Resistance"),GetAbility("Reflective Carapace"),GetAbility("Siege Monster")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Horns"),GetAction("Tail"),GetAction("Frightful Presence"),GetAction("Swallow"),GetAction("The tarrasque can take 3 legendary actions, choosing from the options below"),GetAction("Attack"),GetAction("Move")], [GetAction("Chomp (Costs 2 Actions)")]);

EnimiesList[369] = new Enemy("Thri-kreen", 15, 33, 40, new Stats(12,15,13,8 ,12,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3, Stealth +4, Survival +3"],["darkvision 60 ft., passive Perception 13"], ["Thri-kreen"], ["1 (200 XP)"], [GetAbility("Chameleon Carapace"),GetAbility("Standing Leap")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claws")]);

EnimiesList[370] = new Enemy("Thug", 11, 32, 30, new Stats(15,11,14,10,10,11),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Intimidation +2"],["passive Perception 10"], ["any one language (usually Common)"], ["1/2 (100 XP)"], [GetAbility("Pack Tactics")], [GetAction("Multiattack"),GetAction("Mace"),GetAction("Heavy Crossbow")]);

EnimiesList[371] = new Enemy("Tiger", 12, 37, 40, new Stats(17,15,14,3 ,12,8 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3, Stealth +6"],["darkvision 60 ft., passive Perception 13"], ["—"], ["1 (200 XP)"], [GetAbility("Keen Smell"),GetAbility("Pounce")], [GetAction("Bite"),GetAction("Claw")]);

EnimiesList[372] = new Enemy("Treant", 16, 138, 30, new Stats(23,8 ,21,12,16,12),[" bludgeoning, piercing"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 13"], ["Common, Druidic, Elvish, Sylvan"], ["9 (5000 XP)"], [GetAbility("False Appearance"),GetAbility("Siege Monster")], [GetAction("Multiattack"),GetAction("Slam"),GetAction("Rock"),GetAction("Animate Trees (1/Day)")]);

EnimiesList[373] = new Enemy("Tribal Warrior", 12, 11, 30, new Stats(13,11,12,8 ,11,8 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 10"], ["any one language"], ["1/8 (25 XP)"], [GetAbility("Pack Tactics")], [GetAction("Spear")]);

EnimiesList[374] = new Enemy("Triceratops", 13, 95, 50, new Stats(22,9 ,17,2 ,11,5 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 10"], ["—"], ["5 (1800 XP)"], [GetAbility("Trampling Charge")], [GetAction("Gore"),GetAction("Stomp")]);

EnimiesList[375] = new Enemy("Tridrone", 15, 16, 30, new Stats(12,13,12,9 ,10,9 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["truesight 120 ft., passive Perception 10"], ["Modron"], ["1/2 (100 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[376] = new Enemy("Troglodyte", 11, 13, 30, new Stats(14,10,14,6 ,10,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Stealth +2"],["darkvision 60 ft., passive Perception 10"], ["Troglodyte"], ["1/4 (50 XP)"], [GetAbility("Chameleon Skin"),GetAbility("Stench"),GetAbility("Sunlight Sensitivity")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw")]);

EnimiesList[377] = new Enemy("Troll", 15, 84, 30, new Stats(18,13,20,7 ,9 ,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +2"],["darkvision 60 ft., passive Perception 12"], ["Giant"], ["5 (1800 XP)"], [GetAbility("Keen Smell"),GetAbility("Regeneration")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw")]);

EnimiesList[378] = new Enemy("Twig Blight", 13, 4, 20, new Stats(6 ,13,12,4 ,8 ,3 ),["N/A"], ["N/A"], [" blinded, deafened"], ["N/A"], [" Stealth +3"],["blindsight 60 ft. (blind beyond this radius), passive Perception 9"], ["understands Common but can't speak"], ["1/8 (25 XP)"], [GetAbility("False Appearance")], [GetAction("Claws")]);

EnimiesList[379] = new Enemy("Tyrannosaurus Rex", 13, 136, 50, new Stats(25,10,19,2 ,12,9 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +4"],["passive Perception 14"], ["—"], ["8 (3900 XP)"], [], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Tail")]);

EnimiesList[380] = new Enemy("Ultroloth", 19, 153, 30, new Stats(16,16,18,18,15,19),[" cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks"], [" acid, poison"], [" charmed, frightened, poisoned"], ["N/A"], [" Intimidation +9, Perception +7, Stealth +8"],["truesight 120 ft., passive Perception 17"], ["Abyssal, Infernal, telepathy 120 ft."], ["13 (10000 XP)"], [GetAbility("Innate Spellcasting"),GetAbility("Magic Resistance"),GetAbility("Magic Weapons")], [GetAction("Multiattack"),GetAction("Longsword"),GetAction("Hypnotic Gaze"),GetAction("Teleport")]);

EnimiesList[381] = new Enemy("Umber Hulk", 18, 93, 30, new Stats(20,13,16,9 ,10,10),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 120 ft., tremorsense 60 ft., passive Perception 10"], ["Umber Hulk"], ["5 (1800 XP)"], [GetAbility("Confusing Caze"),GetAbility("Tunneler")], [GetAction("Multiattack"),GetAction("Claw"),GetAction("Mandibles")]);

EnimiesList[382] = new Enemy("Unicorn", 12, 67, 50, new Stats(18,14,15,11,17,16),["N/A"], [" poison"], [" charmed, paralyzed, poisoned"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 13"], ["Celestial, Elvish, Sylvan, telepathy 60 ft."], ["5 (1800 XP)"], [GetAbility("Charge"),GetAbility("Innate Spellcasting"),GetAbility("Magic Resistance"),GetAbility("Magic Weapons")], [GetAction("Multiattack"),GetAction("Hooves"),GetAction("Horn"),GetAction("Healing Touch (3/Day)"),GetAction("Teleport (1/Day)"),GetAction("The unicorn can take 3 legendary actions, choosing from the options below"),GetAction("Hooves")], [GetAction("Shimmering Shield (Costs 2 Actions)")], [GetAction("Heal Self (Costs 3 Actions)")]);

EnimiesList[383] = new Enemy("Vampire", 16, 144, 30, new Stats(18,18,18,17,15,18),[" necrotic; bludgeoning, piercing, and slashing from nonmagical attacks"], ["N/A"], ["N/A"], [" Dex +9, Wis +7, Cha +9"], [" Perception +7, Stealth +9"],["darkvision 120 ft., passive Perception 17"], ["the languages it knew in life"], ["13 (10000 XP)"], [GetAbility("Shapechanger"),GetAbility("Legendary Resistance (3/Day)"),GetAbility("Misty Escape"),GetAbility("Regeneration"),GetAbility("Spider Climb"),GetAbility("Vampire Weaknesses"),GetAbility("Forbiddance"),GetAbility("Harmed by Running Water"),GetAbility("Stake to the Heart"),GetAbility("Sunlight Hypersensitivity")], [GetAction("Multiattack (Vampire Form Only)"),GetAction("Unarmed Strike (Vampire Form Only)"),GetAction("Bite (Bat or Vampire Form Only)"),GetAction("Charm"),GetAction("Children ofthe Night (1/Day)"),GetAction("The vampire can take 3 legendary actions, choosing from the options below"),GetAction("Move"),GetAction("Unarmed Strike")], [GetAction("Bite (Costs 2 Actions)")]);

EnimiesList[384] = new Enemy("Vampire Spawn", 15, 82, 30, new Stats(16,16,16,11,10,12),[" necrotic; bludgeoning, piercing, and slashing from nonmagical attacks"], ["N/A"], ["N/A"], [" Dex +6, Wis +3"], [" Perception +3, Stealth +6"],["darkvision 60 ft., passive Perception 13"], ["the languages it knew in life"], ["5 (1800 XP)"], [GetAbility("Regeneration"),GetAbility("Spider Climb"),GetAbility("Vampire Weaknesses"),GetAbility("Forbiddance"),GetAbility("Harmed by Running Water"),GetAbility("Stake to the Heart"),GetAbility("Sunlight Hypersensitivity")], [GetAction("Multiattack"),GetAction("Claws"),GetAction("Bite")]);

EnimiesList[385] = new Enemy("Veteran", 17, 58, 30, new Stats(16,13,14,10,11,10),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Athletics +5, Perception +2"],["passive Perception 12"], ["any one language (usually Common)"], ["3 (700 XP)"], [], [GetAction("Multiattack"),GetAction("Longsword"),GetAction("Shortsword"),GetAction("Heavy Crossbow")]);

EnimiesList[386] = new Enemy("Vine Blight", 12, 26, 10, new Stats(15,8 ,14,5 ,10,3 ),["N/A"], ["N/A"], [" blinded, deafened"], ["N/A"], [" Stealth + 1"],["blindsight 60 ft. (blind beyond this radius), passive Perception 10"], ["Common"], ["1/2 (100 XP)"], [GetAbility("False Appearance")], [GetAction("Constrict"),GetAction("Entangling Plants (Recharge 5-6)")]);

EnimiesList[387] = new Enemy("Violet Fungus", 5, 18, 5, new Stats(3 ,1 ,10,1 ,3 ,1 ),["N/A"], ["N/A"], [" blinded, deafened, frightened"], ["N/A"], ["N/A"], ["blindsight 30 ft. (blind beyond this radius), passive Perception 6"], ["—"], ["1/4 (50 XP)"], [GetAbility("False Appearance")], [GetAction("Multiattack"),GetAction("Rotting Touch")]);

EnimiesList[388] = new Enemy("Vrock", 15, 104, 40, new Stats(17,15,18,8 ,13,8 ),[" cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks"], [" poison"], [" poisoned"], [" Dex +5, Wis +4, Cha +2"], ["N/A"], ["darkvision 120 ft., passive Perception 11"], ["Abyssal, telepathy 120 ft."], ["6 (2300 XP)"], [GetAbility("Magic Resistance")], [GetAction("Multiattack"),GetAction("Beak"),GetAction("Talons"),GetAction("Spores (Recharge 6)"),GetAction("Stunning Screech (1/Day)")]);

EnimiesList[389] = new Enemy("Vulture", 10, 5, 10, new Stats(7 ,10,13,2 ,12,4 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3"],["passive Perception 13"], ["—"], ["0 (10 XP)"], [GetAbility("Keen Sight and Smell"),GetAbility("Pack Tactics")], [GetAction("Beak")]);

EnimiesList[390] = new Enemy("Warhorse", 11, 19, 60, new Stats(18,12,13,2 ,12,7 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["passive Perception 11"], ["—"], ["1/2 (100 XP)"], [GetAbility("Trampling Charge")], [GetAction("Hooves")]);

EnimiesList[391] = new Enemy("Warhorse Skeleton", 13, 22, 60, new Stats(18,12,15,2 ,8 ,5 ),["N/A"], [" poison"], [" exhaustion, poisoned"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 9"], ["—"], ["1/2 (100 XP)"], [], [GetAction("Hooves")]);

EnimiesList[392] = new Enemy("Water Elemental", 14, 114, 30, new Stats(18,14,18,5 ,10,8 ),[" acid; bludgeoning, piercing, and slashing from nonmagical attacks"], [" poison"], [" exhaustion, grappled, paralyzed, petrified, poisoned, prone, restrained, unconscious"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 10"], ["Aquan"], ["5 (1800 XP)"], [GetAbility("Water Form"),GetAbility("Freeze")], [GetAction("Multiattack"),GetAction("Slam"),GetAction("Whelm (Recharge 4-6)")]);

EnimiesList[393] = new Enemy("Water Weird", 13, 58, 0, new Stats(17,16,13,11,10,10),[" fire; bludgeoning, piercing, and slashing from nonmagical attacks"], [" poison"], [" exhaustion, grappled, paralyzed, poisoned, restrained, prone, unconscious"], ["N/A"], ["N/A"], ["blindsight 30 ft., passive Perception 10"], ["understands Aquan but doesn't speak"], ["3 (700 XP)"], [GetAbility("Invisible in Water"),GetAbility("Water Bound")], [GetAction("Constrict")]);

EnimiesList[394] = new Enemy("Weasel", 13, 1, 30, new Stats(3 ,16,8 ,2 ,12,3 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3, Stealth +5"],["passive Perception 13"], ["—"], ["0 (10 XP)"], [GetAbility("Keen Hearing and Smell")], [GetAction("Bite")]);

EnimiesList[395] = new Enemy("Werebear", 10, 135, 30, new Stats(19,10,17,11,12,12),["N/A"], [" bludgeoning, piercing, and slashing from nonmagical attacks not made with silvered weapons"], ["N/A"], ["N/A"], [" Perception +7"],["passive Perception 17"], ["Common (can't speak in bear form)"], ["5 (1800 XP)"], [GetAbility("Shapechanger"),GetAbility("Keen Smell")], [GetAction("Multiattack"),GetAction("Bite (Bear or Hybrid Form Only)"),GetAction("Claw (Bear or Hybrid Form Only)"),GetAction("Greataxe (Humanoid or Hybrid Form Only)")]);

EnimiesList[396] = new Enemy("Wereboar", 10, 78, 30, new Stats(17,10,15,10,11,8 ),["N/A"], [" bludgeoning, piercing, and slashing damage from nonmagical attacks that aren't silvered"], ["N/A"], ["N/A"], [" Perception +2"],["passive Perception 12"], ["Common (can't speak in boar form)"], ["4 (1100 XP)"], [GetAbility("Shapechanger"),GetAbility("Charge (Boar or Hybrid Form Only)"),GetAbility("Relentless (Recharges after a Short or Long Rest)")], [GetAction("Multiattack (Humanoid or Hybrid Form Only)"),GetAction("Maul (Humanoid or Hybrid Form Only)"),GetAction("Tusks (Boar or Hybrid Form Only)")]);

EnimiesList[397] = new Enemy("Wererat", 12, 33, 30, new Stats(10,15,12,11,10,8 ),["N/A"], [" bludgeoning, piercing, and slashing from nonmagical attacks not made with silvered weapons"], ["N/A"], ["N/A"], [" Perception +2, Stealth +4"],["darkvision 60 ft. (rat form only), passive Perception 12"], ["Common (can't speak in rat form)"], ["2 (450 XP)"], [GetAbility("Shapechanger"),GetAbility("Keen Smell")], [GetAction("Multiattack (Humanoid or Hybrid Form Only)"),GetAction("Bite (Rat or Hybrid Form Only)"),GetAction("Shortsword (Humanoid or Hybrid Form Only)"),GetAction("Hand Crossbow (Humanoid or Hybrid Form Only)")]);

EnimiesList[398] = new Enemy("Weretiger", 12, 120, 30, new Stats(17,15,16,10,13,11),["N/A"], [" bludgeoning, piercing, and slashing from nonmagical attacks not made with silvered weapons"], ["N/A"], ["N/A"], [" Perception +5, Stealth +4"],["darkvision 60 ft., passive Perception 15"], ["Common (can't speak in tiger form)"], ["4 (1100 XP)"], [GetAbility("Shapechanger"),GetAbility("Keen Hearing and Smell"),GetAbility("Pounce (Tiger or Hybrid Form Only)")], [GetAction("Multiattack (Humanoid or Hybrid Form Only)"),GetAction("Bite (Tiger or Hybrid Form Only)"),GetAction("Claw (Tiger or Hybrid Form Only)"),GetAction("Scimitar (Humanoid or Hybrid Form Only)"),GetAction("Longbow (Humanoid or Hybrid Form Only)")]);

EnimiesList[399] = new Enemy("Werewolf", 11, 58, 30, new Stats(15,13,14,10,11,10),["N/A"], [" bludgeoning, piercing, and slashing damage from nonmagical attacks that aren't silvered"], ["N/A"], ["N/A"], [" Perception +4, Stealth +3"],["passive Perception 14"], ["Common (can't speak in wolf form)"], ["3 (700 XP)"], [GetAbility("Shapechanger"),GetAbility("Keen Hearing and Smell")], [GetAction("Multiattack (Humanoid or Hybrid Form Only)"),GetAction("Bite (Wolf or Hybrid Form Only)"),GetAction("Claws (Hybrid Form Only)"),GetAction("Spear (Humanoid Form Only)")]);

EnimiesList[400] = new Enemy("White Dragon Wyrmling", 16, 32, 30, new Stats(14,10,14,5 ,10,11),["N/A"], [" cold"], ["N/A"], [" Dex +2, Con +4, Wis +2, Cha +2"], [" Perception +4, Stealth +2"],["blindsight 10 ft., darkvision 60 ft., passive Perception 14"], ["Draconic"], ["2 (450 XP)"], [], [GetAction("Bite"),GetAction("Cold Breath (Recharge 5-6)")]);

EnimiesList[401] = new Enemy("Wight", 14, 45, 30, new Stats(15,14,16,10,13,15),[" necrotic; bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered"], [" poison"], [" exhaustion, poisoned"], ["N/A"], [" Perception +3, Stealth +4"],["darkvision 60 ft., passive Perception 13"], ["the languages it knew in life"], ["3 (700 XP)"], [GetAbility("Sunlight Sensitivity")], [GetAction("Multiattack"),GetAction("Life Drain"),GetAction("Longsword"),GetAction("Longbow")]);

EnimiesList[402] = new Enemy("Will-o'-Wisp", 19, 22, 0, new Stats(1 ,28,10,13,14,11),[" acid, cold, fire, necrotic, thunder; bludgeoning, piercing, and slashing from nonmagical attacks"], [" lightning, poison"], [" exhaustion, grappled, paralyzed, poisoned, prone, restrained, unconscious"], ["N/A"], ["N/A"], ["darkvision 120 ft., passive Perception 12"], ["the languages it knew in life"], ["2 (450 XP)"], [GetAbility("Consume Life"),GetAbility("Ephemeral"),GetAbility("Incorporeal Movement"),GetAbility("Variable Illumination")], [GetAction("Shock"),GetAction("Invisibility")]);

EnimiesList[403] = new Enemy("Winged Kobold", 13, 7, 30, new Stats(7 ,16,9 ,8 ,7 ,8 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 8"], ["Common, Draconic"], ["1/4 (50 XP)"], [GetAbility("Sunlight Sensitivity"),GetAbility("Pack Tactics")], [GetAction("Dagger"),GetAction("Dropped Rock")]);

EnimiesList[404] = new Enemy("Winter Wolf", 13, 75, 50, new Stats(18,13,14,7 ,12,8 ),["N/A"], [" cold"], ["N/A"], ["N/A"], [" Perception +5, Stealth +3"],["passive Perception 15"], ["Common, Giant, Winter Wolf"], ["3 (700 XP)"], [GetAbility("Keen Hearing and Smell"),GetAbility("Pack Tactics"),GetAbility("Snow Camouflage")], [GetAction("Bite"),GetAction("Cold Breath (Recharge 5-6)")]);

EnimiesList[405] = new Enemy("Wolf", 13, 11, 40, new Stats(12,15,12,3 ,12,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +3, Stealth +4"],["passive Perception 13"], ["—"], ["1/4 (50 XP)"], [GetAbility("Keen Hearing and Smell"),GetAbility("Pack Tactics")], [GetAction("Bite")]);

EnimiesList[406] = new Enemy("Worg", 13, 26, 50, new Stats(16,13,13,7 ,11,8 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +4"],["darkvision 60 ft., passive Perception 14"], ["Goblin, Worg"], ["1/2 (100 XP)"], [GetAbility("Keen Hearing and Smell")], [GetAction("Bite")]);

EnimiesList[407] = new Enemy("Wraith", 13, 67, 0, new Stats(6 ,16,16,12,14,15),[" acid, cold, fire, lightning, thunder; bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered"], [" necrotic, poison"], [" charmed, exhaustion, grappled, paralyzed, petrified, poisoned, prone, restrained"], ["N/A"], ["N/A"], ["darkvision 60 ft., passive Perception 12"], ["the languages it knew in life"], ["5 (1800 XP)"], [GetAbility("Incorporeal Movement"),GetAbility("Sunlight Sensitivity")], [GetAction("Life Drain"),GetAction("Create Specter")]);

EnimiesList[408] = new Enemy("Wyvern", 13, 110, 20, new Stats(19,10,16,5 ,12,6 ),["N/A"], ["N/A"], ["N/A"], ["N/A"], [" Perception +4"],["darkvision 60 ft., passive Perception 14"], ["—"], ["6 (2300 XP)"], [], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claws"),GetAction("Stinger")]);

EnimiesList[409] = new Enemy("Xorn", 19, 73, 20, new Stats(17,10,22,11,10,11),[" piercing and slashing from nonmagical attacks that aren't adamantine"], ["N/A"], ["N/A"], ["N/A"], [" Perception +6, Stealth +3"],["darkvision 60 ft., tremorsense 60 ft., passive Perception 16"], ["Terran"], ["5 (1800 XP)"], [GetAbility("Earth Glide"),GetAbility("Stone Camouflage"),GetAbility("Treasure Sense")], [GetAction("Multiattack"),GetAction("Claw"),GetAction("Bite")]);

EnimiesList[410] = new Enemy("Yeti", 12, 51, 40, new Stats(18,13,16,8 ,12,7 ),["N/A"], [" cold"], ["N/A"], ["N/A"], [" Perception +3, Stealth +3"],["darkvision 60 ft., passive Perception 13"], ["Yeti"], ["3 (700 XP)"], [GetAbility("Fear of Fire"),GetAbility("Keen Smell"),GetAbility("Snow Camouflage")], [GetAction("Multiattack"),GetAction("Claw"),GetAction("Chilling Gaze")]);

EnimiesList[411] = new Enemy("Yochlol", 15, 136, 30, new Stats(15,14,18,13,15,15),[" cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks"], [" poison"], [" poisoned"], [" Dex +6, Int +5, Wis +6, Cha +6"], [" Deception +10, Insight +6"],["darkvision 120 ft., passive Perception 12"], ["Abyssal, Elvish, Undercommon"], ["10 (5900 XP)"], [GetAbility("Shapechanger"),GetAbility("Magic Resistance"),GetAbility("Spider Climb"),GetAbility("Innate Spellcasting"),GetAbility("Web Walker")], [GetAction("Multiattack"),GetAction("Slam (Bite in Spider Form)"),GetAction("Mist Form")]);

EnimiesList[412] = new Enemy("Young Black Dragon", 18, 127, 40, new Stats(19,14,17,12,11,15),["N/A"], [" acid"], ["N/A"], [" Dex +5, Con +6, Wis +3, Cha +5"], [" Perception +6, Stealth +5"],["blindsight 30 ft., darkvision 120 ft., passive Perception 16"], ["Common, Draconic"], ["7 (2900 XP)"], [GetAbility("Amphibious")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Acid Breath (Recharge 5-6)")]);

EnimiesList[413] = new Enemy("Young Blue Dragon", 18, 152, 40, new Stats(21,10,19,14,13,17),["N/A"], [" lightning"], ["N/A"], [" Dex +4, Con +8, Wis +5, Cha +7"], [" Perception +9, Stealth +4"],["blindsight 30 ft., darkvision 120 ft., passive Perception 19"], ["Common, Draconic"], ["9 (5000 XP)"], [], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Lightning Breath (Recharge 5-6)")]);

EnimiesList[414] = new Enemy("Young Brass Dragon", 17, 110, 40, new Stats(19,10,17,12,11,15),["N/A"], [" fire"], ["N/A"], [" Dex +3, Con +6, Wis +3, Cha +5"], [" Perception +6, Persuasion +5, Stealth +3"],["blindsight 30 ft., darkvision 120 ft., passive Perception 16"], ["Common, Draconic"], ["6 (2300 XP)"], [], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Fire Breath"),GetAction("Sleep Breath")]);

EnimiesList[415] = new Enemy("Young Bronze Dragon", 18, 142, 40, new Stats(21,10,19,14,13,17),["N/A"], [" lightning"], ["N/A"], [" Dex +3, Con +7, Wis +4, Cha +6"], [" Insight +4, Perception +7, Stealth +3"],["blindsight 30 ft., darkvision 120 ft., passive Perception 17"], ["Common, Draconic"], ["8 (3900 XP)"], [GetAbility("Amphibious")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Lightning Breath"),GetAction("Repulsion Breath")]);

EnimiesList[416] = new Enemy("Young Copper Dragon", 17, 119, 40, new Stats(19,12,17,16,13,15),["N/A"], [" acid"], ["N/A"], [" Dex +4, Con +6, Wis +4, Cha +5"], [" Deception +5, Perception +7, Stealth +4"],["blindsight 30 ft., darkvision 120 ft., passive Perception 17"], ["Common, Draconic"], ["7 (2900 XP)"], [], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Acid Breath"),GetAction("Slowing Breath")]);

EnimiesList[417] = new Enemy("Young Gold Dragon", 18, 178, 40, new Stats(23,14,21,16,13,20),["N/A"], [" fire"], ["N/A"], [" Dex +6, Con +9, Wis +5, Cha +9"], [" Insight +5, Perception +9, Persuasion +9, Stealth +6"],["blindsight 30 ft., darkvision 120 ft., passive Perception 19"], ["Common, Draconic"], ["10 (5900 XP)"], [GetAbility("Amphibious")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Fire Breath"),GetAction("Weakening Breath")]);

EnimiesList[418] = new Enemy("Young Green Dragon", 18, 136, 40, new Stats(19,12,17,16,13,15),["N/A"], [" poison"], [" poisoned"], [" Dex +4, Con +6, Wis +4, Cha +5"], [" Deception +5, Perception +7, Stealth +4"],["blindsight 30 ft., darkvision 120 ft., passive Perception 17"], ["Common, Draconic"], ["8 (3900 XP)"], [GetAbility("Amphibious")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Poison Breath (Recharge 5-6)")]);

EnimiesList[419] = new Enemy("Young Red Dragon", 18, 178, 40, new Stats(23,10,21,14,11,19),["N/A"], [" fire"], ["N/A"], [" Dex +4, Con +9, Wis +4, Cha +8"], [" Perception +8, Stealth +4"],["blindsight 30 ft., darkvision 120 ft., passive Perception 18"], ["Common, Draconic"], ["10 (5900 XP)"], [], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Fire Breath (Recharge 5-6)")]);

EnimiesList[420] = new Enemy("Young Red Shadow Dragon", 18, 178, 40, new Stats(23,10,21,14,11,19),[" necrotic"], [" fire"], ["N/A"], [" Dex +4, Con +9, Wis +4, Cha +8"], [" Perception +8, Stealth +8"],["blindsight 30 ft., darkvision 120 ft., passive Perception 18"], ["Common, Draconic"], ["13 (10000 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[421] = new Enemy("Young Remorhaz", 14, 93, 30, new Stats(18,13,17,3 ,10,4 ),["N/A"], [" cold, fire"], ["N/A"], ["N/A"], ["N/A"], ["darkvision 60 ft., tremorsense 60 ft., passive Perception 10"], ["—"], ["5 (1800 XP)"], [], [GetAction("This full creature's stat block is not available (not OGL)")]);

EnimiesList[422] = new Enemy("Young Silver Dragon", 18, 168, 40, new Stats(23,10,21,14,11,19),["N/A"], [" cold"], ["N/A"], [" Dex +4, Con +9, Wis +4, Cha +8"], [" Arcana +6, History +6, Perception +8, Stealth +4"],["blindsight 30 ft., darkvision 120 ft., passive Perception 18"], ["Common, Draconic"], ["9 (5000 XP)"], [], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Breath Weapons (Recharge 5-6)"),GetAction("Cold Breath"),GetAction("Paralyzing Breath")]);

EnimiesList[423] = new Enemy("Young White Dragon", 17, 133, 40, new Stats(18,10,18,6 ,11,12),["N/A"], [" cold"], ["N/A"], [" Dex +3, Con +7, Wis +3, Cha +4"], [" Perception +6, Stealth +3"],["blindsight 30 ft., darkvision 120 ft., passive Perception 16"], ["Common, Draconic"], ["6 (2300 XP)"], [GetAbility("Ice Walk")], [GetAction("Multiattack"),GetAction("Bite"),GetAction("Claw"),GetAction("Cold Breath (Recharge 5-6)")]);

EnimiesList[424] = new Enemy("Yuan-ti Abomination", 15, 127, 40, new Stats(19,16,17,17,15,18),["N/A"], [" poison"], [" poisoned"], ["N/A"], [" Perception +5, Stealth +6"],["darkvision 60 ft., passive Perception 15"], ["Abyssal, Common, Draconic"], ["7 (2900 XP)"], [GetAbility("Shapechanger"),GetAbility("Innate Spellcasting (Abomination Form Only)"),GetAbility("Magic Resistance")], [GetAction("Multiattack (Abomination Form Only)"),GetAction("Bite"),GetAction("Constrict"),GetAction("Scimitar (Abomination Form Only)"),GetAction("Longbow (Abomination Form Only)")]);

EnimiesList[425] = new Enemy("Yuan-ti Malison", 12, 66, 30, new Stats(16,14,13,14,12,16),["N/A"], [" poison"], [" poisoned"], ["N/A"], [" Deception +5, Stealth +4"],["darkvision 60 ft., passive Perception 11"], ["Abyssal, Common, Draconic"], ["3 (700 XP)"], [GetAbility("Shapechanger"),GetAbility("Innate Spellcasting (Yuan-ti Form Only)"),GetAbility("Magic Resistance"),GetAbility("Malison Type")], [GetAction("Multiattack (Yuan-ti Form Only)"),GetAction("Bite"),GetAction("Scimitar (Yuan-ti Form Only)"),GetAction("Longbow (Yuan-ti Form Only)")], [GetAction("Multiattack (Yuan-ti Form Only)"),GetAction("Bite")], [GetAction("Multiattack (Yuan-ti Form Only)"),GetAction("Bite (Snake Form Only)"),GetAction("Constrict"),GetAction("Scimitar (Yuan-ti Form Only)"),GetAction("Longbow (Yuan-ti Form Only)")]);

EnimiesList[426] = new Enemy("Yuan-ti Pureblood", 11, 40, 30, new Stats(11,12,11,13,12,14),["N/A"], [" poison"], [" poisoned"], ["N/A"], [" Deception +6, Perception +3, Stealth +3"],["darkvision 60 ft., passive Perception 13"], ["Abyssal, Common, Draconic"], ["1 (200 XP)"], [GetAbility("Innate Spellcasting"),GetAbility("Magic Resistance")], [GetAction("Multiattack"),GetAction("Scimitar"),GetAction("Shortbow")]);

EnimiesList[427] = new Enemy("Zombie", 8, 22, 20, new Stats(13,6 ,16,3 ,6 ,5 ),["N/A"], [" poison"], [" poisoned"], [" Wis +0"], ["N/A"], ["darkvision 60 ft., passive Perception 8"], ["understands the languages it knew in life but can't speak"], ["1/4 (50 XP)"], [GetAbility("Undead Fortitude")], [GetAction("Slam")]);
//EnimiesList[2] = new Enemy("Name", 999, 999, new Speeds(20,50,0), new Stats(10,14,10,11,12,11), ["N/A"], ["N/A"], ["N/A"], ["N/A"], ["N/A"], 999, [""], [""]);
}

function GetAbility(Name){
    for (let count = 0; count < AbilitiesList.length; count++) {
        if (AbilitiesList[count].Name == Name) {return AbilitiesList[count];}
    }

    return new Abilities(Name, "Not Found");
}

function GetAction(Name){
    for (let count = 0; count < ActionsList.length; count++) {
        if (ActionsList[count].Name == Name) {
            return ActionsList[count];
        }
    }

    return new Actions(Name, "Not Found",999,999,999,"",null,null);
}


function Enemy(Name, AC, HP, Speed, Stat, Dmg_Res, DMG_Imm, Con_Imm, Sav_Throw, Skills, Senses, Languages, CR, AbilList, ActList) {
    this.Name = Name;
    this.AC = AC;
    this.HP = HP;
    this.Speed = new Speeds(Speed.Walk, Speed.Fly, Speed.Climb);
    this.Stats = new Stats(Stat.STR,Stat.DEX,Stat.CON,Stat.INT,Stat.WIS,Stat.CHA)
    this.DmgResList = Dmg_Res;
    this.DmgImmList = DMG_Imm;
    this.ConImmList = Con_Imm;
    this.Sav_Throw = Sav_Throw;
    this.Skills = Skills;
    this.SensesList = Senses;
    this.LanguagesList = Languages;
    this.CR = CR;
    this.AbilitiesList = AbilList;
    this.ActList = ActList;
}

function Speeds(Walk, Fly, Climb, Swim){
    this.Walk = Walk;
    this.Fly = Fly;
    this.Climb = Climb;
    this.Swim = Swim;
}

function Stats(STR, DEX, CON, INT, WIS, CHA){
    this.STR = STR;
    this.DEX = DEX;
    this.CON = CON;
    this.INT = INT;
    this.WIS = WIS;
    this.CHA = CHA;
}

function Abilities(Name, Desc){
    this.Name = Name;
    this.Desc = Desc;
}

function Actions(Name,Desc,toHit,Reach,DmgDie,DmgType,Save,SaveDc){
    this.Name = Name;
    this.Desc = Desc;
    this.toHit = toHit;
    this.Reach = Reach;
    this.DmgDie = DmgDie;
    this.DmgType = DmgType;
    this.Save = Save;
    this.SaveDc = SaveDc;
}

