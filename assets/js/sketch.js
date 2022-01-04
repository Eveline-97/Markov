/***-MARKOV CHAIN-***/
//elements
const f = 'F';
const p = '+';
const m = '-';
const r = '[';
const l = ']';

const rules = [
    {name: f,
    chain: [1/12., .25, 1/6., 1/6., 1/3.]},
    {name: p,
    chain: [.25, 1/12., .25, 1/6., .25]},
    {name: m,
    chain: [1/6., .25, 1/12., 1/3., 1/6.]},
    {name: r,
    chain: [1/6., 1/6., .25, 1/6., .25]},
    {name: l,
    chain: [.25, .25, 1/6., 1/6., 1/6.]}
];

let currentNode = f;

/*returns next note by calling chains*/
function generate() {
    console.log(currentNode);
    //get the current element
    let index;
    let next;
    let random = Math.random();

    for (let i = 0; i < 5; i++) {
        if (rules[i].name == currentNode) {
            index = i;
        }
    }

    next = chains(index, random);
    currentNode = next;
    display(next);
    return next;
}

/*chains chooses the next element*/
function chains(index, random) {
    let chain = rules[index].chain;

    /*this array remembers the index of a note and the probability of this note being the next one
    thus the next possible note*/
    let poss = [];

    //return all possibilities
    for (let i = 0; i < chain.length; i++) {
        if (chain[i] != 0) {
            poss.push([i, chain[i]]);
        }
    }

    //now a range of 0 to 1 is divided within all the possibilities, depending on their probability
    let divisions = [];
    let lowerBound = 0;

    for (let i = 1; i <= poss.length; i++) {
        //real index
        let j = i - 1;

        if (j == 0) //first element
        {
            let result = {
                index: poss[j][0],
                lower: 0,
                upper: poss[j][1]
            };
            divisions.push(result);
            //add element to lowerBound for 2nd index
            lowerBound += poss[j][1];
        } else if (i == poss.length) {
            let result = {
                index: poss[j][0],
                lower: 1 - poss[j][1],
                upper: 1
            };
            divisions.push(result);
        } else {
            let result = {
                index: poss[j][0],
                lower: lowerBound,
                upper: lowerBound + poss[j][1] 
            };
            divisions.push(result);
            //add element to lowerBound for next index
            lowerBound += poss[j][1];
        }
    }

    console.log(poss.length);

    //find the next node
    let next;
    for (let i = 0; i < divisions.length; i++) {
        if (random > divisions[i].lower && random <= divisions[i].upper) {
            nextIndex = divisions[i].index;
            next = rules[nextIndex].name;
        }
    }

    if (!next) {
        console.log('Error. No next node found.');
    } else {
        return next;
    }
}

/*Display the elements in the document*/
function display(node) {
    console.log(node);
    let results = document.getElementById('results')
    let element = document.createElement('p');
    element.innerHTML = node;
    results.appendChild(element);
}

let button = document.getElementById('generate');
button.addEventListener('click', generate);