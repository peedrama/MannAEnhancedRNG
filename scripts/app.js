// Amardeep Mann
// 2-15-23
// Enhanced Random Name Generator
// This time we created a random name generator that not only picks a random name, but also allows the addition/removal of names as well as the formation of groups

import { saveToLocalStorageByName, getLocalStorage, removeFromLocalStorage } from "./localStorage.js";

let namesList = getLocalStorage();
// namesList = ["Danny T.", "Ken M.", "Scott M.", "Aisha", "Amar", "Andrea", "Andrew", "Brandon", "Carlos", "Caroline", "Chris", "Daniel", "Elizar", "Fernando", "Griffin", "Harrison", "Isaiah", "Jacob", "Jasmine", "Jeremy", "Jessie", "John", "Jovann", "Kenneth", "Kent", "Lerissa", "Madeline", "Manuel", "Marcel", "Mark", "N. Harrison", "Pedro", "Reed", "Richard", "Samuel", "Shaun", "Ulises"];
let lastFiveNames = [];

let generateBtn = document.getElementById('generateBtn');
let clearBtn = document.getElementById('clearBtn');
let pickTxt = document.getElementById('pickTxt');
let pwrLvlTxt = document.getElementById('pwrLvlTxt');
let outputCont = document.getElementById('outputCont');
let nameInp = document.getElementById('nameInp');
let addNameBtn = document.getElementById('addNameBtn');
let listCont = document.getElementById('listCont');
let groupsBtn = document.getElementById('groupsBtn');
let groupsCont = document.getElementById('groupsCont');

generateBtn.addEventListener('click', PickName);
clearBtn.addEventListener('click', ClearList);

addNameBtn.addEventListener('click', addName);
nameInp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addName();
    }
});


function addName() {
    if (nameInp.value) {
        saveToLocalStorageByName(nameInp.value);
        namesList.push(nameInp.value);
        console.log(namesList);
        outputText.textContent = '';
        nameInp.value = '';
    } else {
        outputText.textContent = 'Please enter a name in the input field';
    }
    populateListItems();
}

function populateListItems() {
    listCont.innerHTML = '';
    for (let i = 0; i < namesList.length; i++) {
        let div = document.createElement('div');
        let name = document.createElement('h4');
        let icon = document.createElement('i');
        div.classList.add('listItem', 'd-flex', 'justify-content-center', 'align-items-center', 'px-4');
        name.classList.add('listTxt');
        icon.classList.add('ph-x-bold', 'delBtn');
        name.textContent = namesList[i];
        div.append(name, icon);
        listCont.append(div);
        icon.addEventListener('click', function() {
            removeFromLocalStorage(namesList[i]);
            namesList.splice(i, 1);
            console.log(namesList[i]);
            populateListItems();
        });
    }
}

function PickName() {
    if (namesList.length === 0) {
        outputText.textContent = 'Please add at least one name to the list';
        return;
    }
    outputText.textContent = 'Random pick';
    outputCont.classList.remove('d-none');
    groupsCont.classList.add('d-none');
    let pick, randNum, pwrLvl;
    let count = 0;
    // This makes it so you never have the same person twice in a row
    do {
        randNum = Math.floor(Math.random() * namesList.length);
        pick = namesList[randNum];
        console.log(pick);
        count++;
    } while (lastFiveNames.includes(pick) && count < 10);

    pickTxt.textContent = namesList[randNum];
    lastFiveNames.unshift(namesList[randNum]);
    
    if (pick.split(' ').length > 1) {
        pwrLvl = Math.floor(Math.random() * 1000) + 9000;
    } else {
        pwrLvl = Math.floor(Math.random() * 5000);
    }
    pwrLvlTxt.textContent = pwrLvl;

    if (lastFiveNames.length > 1) {
        lastFiveNames = lastFiveNames.slice(0, 1);
    }

    // ShowLastFive(); // Don't need this anymore
}

function ShowLastFive() {
    let namesTxt = '';
    for (let i = 0; i < lastFiveNames.length; i++) {
        namesTxt += lastFiveNames[i] + '\n';
    }
    lastFiveTxt.textContent = namesTxt;
}

function ClearList() {
    outputText.textContent = '';
    outputCont.classList.add('d-none');
    groupsCont.classList.add('d-none');
    lastFiveNames = [];
    pickTxt.textContent = '';
    // lastFiveTxt.textContent = '';
}

groupsBtn.addEventListener('click', function() {

    if (groupSizeRadio.checked) {
        if (parseInt(groupSizeInp.value) > groupSizeInp.max) {
            groupSizeInp.value = groupSizeInp.max;
        } else if (parseInt(groupSizeInp.value) < groupSizeInp.min) {
            groupSizeInp.value = groupSizeInp.min;
        }
        createGroupsBySize();

    } else if (numGroupsRadio.checked) {
        createNumOfGroups();
    }
});

function createGroupsBySize() {
    console.log('Create groups by size', groupSizeInp.value);
    let randomList = namesList.slice().sort((a, b) => 0.5 - Math.random());
    const groupSize = parseInt(groupSizeInp.value);
    let groups = [];
    for (let i = 0; i < randomList.length; i += groupSize) {
        console.log(i);
        let group = randomList.slice(i, i + groupSize);
        console.log(group);
        // Check to see if last group is 1
        if (group.length > 1) {
            groups.push(group);
        } else {
            groups[groups.length-1].push(group[0]);
        }
    }
    console.log(groups);
    populateGroups(groups);
}

function populateGroups(array) {
    outputText.textContent = 'Groups';
    groupsCont.innerHTML = '';
    outputCont.classList.add('d-none');
    groupsCont.classList.remove('d-none');
    for (let i = 0; i < array.length; i++) {
        let div = document.createElement('div');
        div.classList.add('groupItem', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center', 'px-4');
        let title = document.createElement('h4');
        title.classList.add('groupTtl');
        title.textContent = `Group ${i+1}`
        div.append(title);

        // Iterate over group members
        let group = array[i];
        for (let j = 0; j < group.length; j++) {
            let name = document.createElement('h6');
            name.textContent = group[j];
            name.classList.add('groupTxt');
            div.append(name);
        }
        groupsCont.append(div);
    }
}

function createNumOfGroups() {
    console.log('Create num of groups', numGroupsInp.value);
    let randomList = namesList.slice().sort((a, b) => 0.5 - Math.random());
    const groupSize = Math.ceil(randomList.length / parseInt( numGroupsInp.value ));
    let groups = [];
    for (let i = 0; i < randomList.length; i += groupSize) {
        console.log(i);
        let group = randomList.slice(i, i + groupSize);
        console.log(group);
        // Check to see if last group is 1
        if (group.length > 1) {
            groups.push(group);
        } else {
            groups[groups.length-1].push(group[0]);
        }
    }
    console.log(groups);
    populateGroups(groups);
}

// Run at page load
populateListItems();