'use strict';

class HashMap {
  constructor(initialCapacity=8) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  get(key) {
    const index = this._findSlot(key);
    if (this._slots[index] === undefined) {
      throw new Error('Key error');
    }
    return this._slots[index].value;
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    const index = this._findSlot(key);
    this._slots[index] = {
      key,
      value,
      deleted: false
    };
    this.length++;
  }

  remove(key) {
    const index = this._findSlot(key);
    const slot = this._slots[index];
    if (slot === undefined) {
      throw new Error('Key error');
    }
    slot.deleted = true;
    this.length--;
    this._deleted++;
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const start = hash % this._capacity;

    for (let i=start; i<start + this._capacity; i++) {
      const index = i % this._capacity;
      const slot = this._slots[index];
      if (slot === undefined || (slot.key == key && !slot.deleted)) {
        return index;
      }
    }
  }

  _resize(size) {
    const oldSlots = this._slots;
    this._capacity = size;
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._deleted = 0;
    this._slots = [];

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.deleted) {
        this.set(slot.key, slot.value);
      }
    }
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i=0; i<string.length; i++) {
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash;
    }
    return hash >>> 0;
  }
}


HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;

// const lotr = new HashMap;

// let lotrArr = [
//   {Hobbit:'Bilbo'}, 
//   {Hobbit:'Frodo'}, 
//   {Wizard:'Gandolf'}, 
//   {Human:'Aragon'}, 
//   {Elf: 'Legolas'}, 
//   {Maiar:'The Necromancer'}, 
//   {Maiar: 'Sauron'}, 
//   {RingBearer: 'Gollum'}, 
//   {LadyOfLight: 'Galadriel'}, 
//   {HalfElven: 'Arwen'}, 
//   {Ent: 'Treebeard'}
// ];

// lotrArr.forEach(obj => {
//   let tempArr = Object.entries(obj);
//   lotr.set(tempArr[0][0], tempArr[0][1]);
// });


// console.log(lotr);
// console.log(lotr.get('Maiar'));

let tempString = 'acecarr';

//a: 1, b: 2, c: 3, etc. 
//most shallow fail is no duplicate letters (North)
// racecar
// r:2 a:2 c:2 e:2 
// acecarr
// a - > c -> e->c ->a -> r ->r

//  take hashmap with incremented values;
//  counter for odd, if odd ever goes above 1, fail out
const permutations = (string) => {
  let stringArr = string.toLowerCase().split('');
  let hashStr = new HashMap;
  for(let i = 0; i < stringArr.length; i++){
    hashStr.set(stringArr[i], 0);
  }
  for(let i = 0; i < stringArr.length; i++){
    hashStr.set(stringArr[i], hashStr.get(stringArr[i]) + 1);
  }
  let uniq = [...new Set(stringArr)];
  let odds = 0;
  for(let i = 0; i < uniq.length; i++){
    if(hashStr.get(uniq[i]) % 2 === 1){
      odds = odds + 1;
    }
    if(odds > 1){
      return false;
    }
  }
  return true;
};

// console.log(permutations('acecarr'));
// console.log(premutations('north'));


//I am glass and not unbreakable
const groupings = (arr) => {
  let hashArr = [];
  let output = [];
  for(let i = 0; i < arr.length; i++){
    let hashMap = new HashMap;
    let stringArr = arr[i].split('');
    if(hashArr.length === 0){
      for(let j=0; j < stringArr.length; j++){
        hashMap.set(stringArr[j], 1);
      }
      hashArr.push(hashMap);
      output.push([arr[i]])
      console.log(output);
    } else{
    let error = 0;
    for(let j = 0; j < hashArr.length; j++){
      error = 0;
      for(let k = 0; k < stringArr.length; k++){
        try {
          hashArr[j].get(stringArr[k])
        }
        catch{
          error = error + 1;
        }
      }
      if(error === 0){
        output[j].push(arr[i]);
        break;
      }
    }
    if(error > 0){
      let hashName = arr[i] + 'Hash';
      console.log('hashName', hashName);
      hashName = new HashMap;
      for(let j=0; j < stringArr.length; j++){
        hashName.set(stringArr[j], 1);
      }
      hashArr.push(hashName);
      output.push([arr[i]])
    }
  }
  }
  console.log(hashArr);
  return output;
};

console.log(groupings(['east', 'cars', 'acre', 'arcs', 'teas', 'eats', 'race']));