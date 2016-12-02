/* @flow */
/* jshint ignore:start */

import util from "./util.js";

type RuleDataList = {
  first: string,
  map: string[][]
}[];

type Map = {
  [key: string]: string[]
};

const arrayMerge = (a: string[], b: string[]): string[] => {
  return a.concat(b).filter((v, i, s) => s.indexOf(v) === i);
}

const firstSetGenerator = (rule: RuleDataList): Map => {

  let firstSet: Map = {};
  let cycleCheck: boolean[] = [];
  const termSet: string[] = util.getTerminateSymbol(rule);

  for (let i = 0; i < rule.length; i++)
    cycleCheck.push(false);

  const recursiveFindFirstSet = (no: number, head: string) => {

    if(cycleCheck[no] === true) {
      // Infinite Recursive Call
      throw 'Infinite Loop';
    }
    cycleCheck[no] = true;

    firstSet[head] = firstSet[head] || [];

    for (let m = 0; m < rule[no].map.length; m++) {

      let nextHead: string = rule[no].map[m][0];

      if (termSet.indexOf(nextHead) !== -1) {
        firstSet[head] = arrayMerge(firstSet[head], [nextHead]);
      } else {
        for (let i = 0; i < rule.length; i++) {
          if (rule[i].first === nextHead) {
            recursiveFindFirstSet(i, nextHead);
          }
        }
        firstSet[head] = arrayMerge(firstSet[head], firstSet[nextHead]);
      }
    }

    cycleCheck[no] = false;
  }

  for(let i=0; i<rule.length; i++) {
    recursiveFindFirstSet(i, rule[i].first);
  }

  return firstSet;
}

module.exports = firstSetGenerator;