'use strict';

class _Node {
  constructor(key, value, next) {
    this.key = key;
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    }
    else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }

  insertBefore(key, newItem) {
    //  key A newItem = D
    //  A -> B -> E -> F
    //  pc 
    let currNode = this.head;
    let previous = this.head;
    if (this.head === null) {
      return new _Node(newItem, null);
    }

    if (this.head.value === key) {
      return this.head = new _Node(newItem, this.head);
    }

    while (currNode) {
      if (currNode.value === key) {
        return previous.next = new _Node(newItem, currNode);
      }
      previous = currNode;
      currNode = currNode.next;
    }
    return console.log('key doesnt exist in list');
  }

  insertAfter(key, newItem) {
    //  insert new node after node containing key
    let currNode = this.head;
    let previous = this.head;
    if (this.head === null) {
      return new _Node(newItem, null);
    }
    while (currNode) {
      if (currNode.value === key) {
        //  key -> newNode -> key.next
        let nextNode = currNode.next;
        return currNode.next = new _Node(newItem, nextNode);
      }
      previous = currNode;
      currNode = currNode.next;
    }
    return console.log('key doesnt exist in list');
  }

  insertOrReplace(key, value, next){
     //  insert new node after node containing key
     let currNode = this.head;
     let previous = this.head;
     while (currNode) {
       if (currNode.key === key) {
         //  key -> newNode -> key.next
         currNode.value = value;
         return;
       } else if(currNode.next === null){
           currNode.next = new _Node(key, value, next);
           return;
         } else{
       previous = currNode;
       currNode = currNode.next;
     }
    }
     return console.log('key doesnt exist in list');
  }

  insertAt(numKey, newItem) {
    let counter = 1;
    let currNode = this.head;
    let previous = this.head;

    if (numKey === counter || numKey === 0) {
      return this.head = new _Node(newItem, this.head);
    }

    while (currNode) {
      if (numKey === counter) {
        return previous.next = new _Node(newItem, currNode);
      }
      previous = currNode;
      currNode = currNode.next;
      counter++;
    }
    return console.log('location requested is longer than linked list');
  }

  find(item) {
    // start at the top
    let currNode = this.head;
    if (!this.head) {
      return null;
    }
    // check if we found it
    while (currNode.value !== item) {
      // return null once we hit the end of the list
      // or we dont find it
      if (currNode.next === null) {
        return null;
      }
      else {
        // keep looking
        currNode = currNode.next;
      }
    }
    return currNode;
  }

  remove(item) {
    //if the list is empty
    if (!this.head) {
      return null;
    }
    //if the node to be removed is head, make the next node head
    if (this.head.value === item) {
      this.head = this.head.next;
      return;
    }
    //start at the head
    let currNode = this.head;
    //keep track of previous
    let previousNode = this.head;

    while ((currNode !== null) && (currNode.value !== item)) {
      //save the previous node 
      previousNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      console.log(`${item} not found`);
      return;
    }
    previousNode.next = currNode.next;
  }
}

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

  set(key, value, next = null) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    const indexO = this._findSlot(key);
    //Empty or Occupied
    //If Empty, this._slots = new LinkedList, THEN LinkedList.head = new _node{key, value, next: null}
    if(indexO.first === false){
      this._slots[indexO.index] = new LinkedList();
      this._slots[indexO.index].head = new _Node(key, value, next);
      this.length++;
    }
    //If occupied, let tempNode = new _Node (key, value), this._slots[index].first Q: does new _Node key = first.key? if yes, first.value = value BREAK, second Q: is next null?
    this._slots[indexO.index].insertOrReplace(key, value, next);
    console.log(this._slots[indexO.index]);
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
      if (slot === undefined) {
        // return index;
        return {
          index: index,
          first: false
        };
      } else {
        return {
          index: index,
          first: true
        }
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

const lotr = new HashMap;

let lotrArr = [
  {Hobbit:'Bilbo'}, 
  {Hobbit:'Frodo'}, 
  {Wizard:'Gandolf'}, 
  {Human:'Aragon'}, 
  {Elf: 'Legolas'}, 
  {Maiar:'The Necromancer'}, 
  {Maiar: 'Sauron'}, 
  {RingBearer: 'Gollum'}, 
  {LadyOfLight: 'Galadriel'}, 
  {HalfElven: 'Arwen'}, 
  {Ent: 'Treebeard'}
];

lotr.set('Hobbit', 'Bilbo');
lotr.set('Human', 'Aragon');
lotr.set('Hobbit', 'Frodo');
console.log(lotr);