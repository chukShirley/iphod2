
(function() {
'use strict';

function F2(fun)
{
  function wrapper(a) { return function(b) { return fun(a,b); }; }
  wrapper.arity = 2;
  wrapper.func = fun;
  return wrapper;
}

function F3(fun)
{
  function wrapper(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  }
  wrapper.arity = 3;
  wrapper.func = fun;
  return wrapper;
}

function F4(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  }
  wrapper.arity = 4;
  wrapper.func = fun;
  return wrapper;
}

function F5(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  }
  wrapper.arity = 5;
  wrapper.func = fun;
  return wrapper;
}

function F6(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  }
  wrapper.arity = 6;
  wrapper.func = fun;
  return wrapper;
}

function F7(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  }
  wrapper.arity = 7;
  wrapper.func = fun;
  return wrapper;
}

function F8(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  }
  wrapper.arity = 8;
  wrapper.func = fun;
  return wrapper;
}

function F9(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  }
  wrapper.arity = 9;
  wrapper.func = fun;
  return wrapper;
}

function A2(fun, a, b)
{
  return fun.arity === 2
    ? fun.func(a, b)
    : fun(a)(b);
}
function A3(fun, a, b, c)
{
  return fun.arity === 3
    ? fun.func(a, b, c)
    : fun(a)(b)(c);
}
function A4(fun, a, b, c, d)
{
  return fun.arity === 4
    ? fun.func(a, b, c, d)
    : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e)
{
  return fun.arity === 5
    ? fun.func(a, b, c, d, e)
    : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f)
{
  return fun.arity === 6
    ? fun.func(a, b, c, d, e, f)
    : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g)
{
  return fun.arity === 7
    ? fun.func(a, b, c, d, e, f, g)
    : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h)
{
  return fun.arity === 8
    ? fun.func(a, b, c, d, e, f, g, h)
    : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i)
{
  return fun.arity === 9
    ? fun.func(a, b, c, d, e, f, g, h, i)
    : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

//import Native.List //

var _elm_lang$core$Native_Array = function() {

// A RRB-Tree has two distinct data types.
// Leaf -> "height"  is always 0
//         "table"   is an array of elements
// Node -> "height"  is always greater than 0
//         "table"   is an array of child nodes
//         "lengths" is an array of accumulated lengths of the child nodes

// M is the maximal table size. 32 seems fast. E is the allowed increase
// of search steps when concatting to find an index. Lower values will
// decrease balancing, but will increase search steps.
var M = 32;
var E = 2;

// An empty array.
var empty = {
	ctor: '_Array',
	height: 0,
	table: []
};


function get(i, array)
{
	if (i < 0 || i >= length(array))
	{
		throw new Error(
			'Index ' + i + ' is out of range. Check the length of ' +
			'your array first or use getMaybe or getWithDefault.');
	}
	return unsafeGet(i, array);
}


function unsafeGet(i, array)
{
	for (var x = array.height; x > 0; x--)
	{
		var slot = i >> (x * 5);
		while (array.lengths[slot] <= i)
		{
			slot++;
		}
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array = array.table[slot];
	}
	return array.table[i];
}


// Sets the value at the index i. Only the nodes leading to i will get
// copied and updated.
function set(i, item, array)
{
	if (i < 0 || length(array) <= i)
	{
		return array;
	}
	return unsafeSet(i, item, array);
}


function unsafeSet(i, item, array)
{
	array = nodeCopy(array);

	if (array.height === 0)
	{
		array.table[i] = item;
	}
	else
	{
		var slot = getSlot(i, array);
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array.table[slot] = unsafeSet(i, item, array.table[slot]);
	}
	return array;
}


function initialize(len, f)
{
	if (len <= 0)
	{
		return empty;
	}
	var h = Math.floor( Math.log(len) / Math.log(M) );
	return initialize_(f, h, 0, len);
}

function initialize_(f, h, from, to)
{
	if (h === 0)
	{
		var table = new Array((to - from) % (M + 1));
		for (var i = 0; i < table.length; i++)
		{
		  table[i] = f(from + i);
		}
		return {
			ctor: '_Array',
			height: 0,
			table: table
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = initialize_(f, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i-1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

function fromList(list)
{
	if (list.ctor === '[]')
	{
		return empty;
	}

	// Allocate M sized blocks (table) and write list elements to it.
	var table = new Array(M);
	var nodes = [];
	var i = 0;

	while (list.ctor !== '[]')
	{
		table[i] = list._0;
		list = list._1;
		i++;

		// table is full, so we can push a leaf containing it into the
		// next node.
		if (i === M)
		{
			var leaf = {
				ctor: '_Array',
				height: 0,
				table: table
			};
			fromListPush(leaf, nodes);
			table = new Array(M);
			i = 0;
		}
	}

	// Maybe there is something left on the table.
	if (i > 0)
	{
		var leaf = {
			ctor: '_Array',
			height: 0,
			table: table.splice(0, i)
		};
		fromListPush(leaf, nodes);
	}

	// Go through all of the nodes and eventually push them into higher nodes.
	for (var h = 0; h < nodes.length - 1; h++)
	{
		if (nodes[h].table.length > 0)
		{
			fromListPush(nodes[h], nodes);
		}
	}

	var head = nodes[nodes.length - 1];
	if (head.height > 0 && head.table.length === 1)
	{
		return head.table[0];
	}
	else
	{
		return head;
	}
}

// Push a node into a higher node as a child.
function fromListPush(toPush, nodes)
{
	var h = toPush.height;

	// Maybe the node on this height does not exist.
	if (nodes.length === h)
	{
		var node = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
		nodes.push(node);
	}

	nodes[h].table.push(toPush);
	var len = length(toPush);
	if (nodes[h].lengths.length > 0)
	{
		len += nodes[h].lengths[nodes[h].lengths.length - 1];
	}
	nodes[h].lengths.push(len);

	if (nodes[h].table.length === M)
	{
		fromListPush(nodes[h], nodes);
		nodes[h] = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
	}
}

// Pushes an item via push_ to the bottom right of a tree.
function push(item, a)
{
	var pushed = push_(item, a);
	if (pushed !== null)
	{
		return pushed;
	}

	var newTree = create(item, a.height);
	return siblise(a, newTree);
}

// Recursively tries to push an item to the bottom-right most
// tree possible. If there is no space left for the item,
// null will be returned.
function push_(item, a)
{
	// Handle resursion stop at leaf level.
	if (a.height === 0)
	{
		if (a.table.length < M)
		{
			var newA = {
				ctor: '_Array',
				height: 0,
				table: a.table.slice()
			};
			newA.table.push(item);
			return newA;
		}
		else
		{
		  return null;
		}
	}

	// Recursively push
	var pushed = push_(item, botRight(a));

	// There was space in the bottom right tree, so the slot will
	// be updated.
	if (pushed !== null)
	{
		var newA = nodeCopy(a);
		newA.table[newA.table.length - 1] = pushed;
		newA.lengths[newA.lengths.length - 1]++;
		return newA;
	}

	// When there was no space left, check if there is space left
	// for a new slot with a tree which contains only the item
	// at the bottom.
	if (a.table.length < M)
	{
		var newSlot = create(item, a.height - 1);
		var newA = nodeCopy(a);
		newA.table.push(newSlot);
		newA.lengths.push(newA.lengths[newA.lengths.length - 1] + length(newSlot));
		return newA;
	}
	else
	{
		return null;
	}
}

// Converts an array into a list of elements.
function toList(a)
{
	return toList_(_elm_lang$core$Native_List.Nil, a);
}

function toList_(list, a)
{
	for (var i = a.table.length - 1; i >= 0; i--)
	{
		list =
			a.height === 0
				? _elm_lang$core$Native_List.Cons(a.table[i], list)
				: toList_(list, a.table[i]);
	}
	return list;
}

// Maps a function over the elements of an array.
function map(f, a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? f(a.table[i])
				: map(f, a.table[i]);
	}
	return newA;
}

// Maps a function over the elements with their index as first argument.
function indexedMap(f, a)
{
	return indexedMap_(f, a, 0);
}

function indexedMap_(f, a, from)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? A2(f, from + i, a.table[i])
				: indexedMap_(f, a.table[i], i == 0 ? from : from + a.lengths[i - 1]);
	}
	return newA;
}

function foldl(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = foldl(f, b, a.table[i]);
		}
	}
	return b;
}

function foldr(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = a.table.length; i--; )
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = a.table.length; i--; )
		{
			b = foldr(f, b, a.table[i]);
		}
	}
	return b;
}

// TODO: currently, it slices the right, then the left. This can be
// optimized.
function slice(from, to, a)
{
	if (from < 0)
	{
		from += length(a);
	}
	if (to < 0)
	{
		to += length(a);
	}
	return sliceLeft(from, sliceRight(to, a));
}

function sliceRight(to, a)
{
	if (to === length(a))
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(0, to);
		return newA;
	}

	// Slice the right recursively.
	var right = getSlot(to, a);
	var sliced = sliceRight(to - (right > 0 ? a.lengths[right - 1] : 0), a.table[right]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (right === 0)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(0, right),
		lengths: a.lengths.slice(0, right)
	};
	if (sliced.table.length > 0)
	{
		newA.table[right] = sliced;
		newA.lengths[right] = length(sliced) + (right > 0 ? newA.lengths[right - 1] : 0);
	}
	return newA;
}

function sliceLeft(from, a)
{
	if (from === 0)
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(from, a.table.length + 1);
		return newA;
	}

	// Slice the left recursively.
	var left = getSlot(from, a);
	var sliced = sliceLeft(from - (left > 0 ? a.lengths[left - 1] : 0), a.table[left]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (left === a.table.length - 1)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(left, a.table.length + 1),
		lengths: new Array(a.table.length - left)
	};
	newA.table[0] = sliced;
	var len = 0;
	for (var i = 0; i < newA.table.length; i++)
	{
		len += length(newA.table[i]);
		newA.lengths[i] = len;
	}

	return newA;
}

// Appends two trees.
function append(a,b)
{
	if (a.table.length === 0)
	{
		return b;
	}
	if (b.table.length === 0)
	{
		return a;
	}

	var c = append_(a, b);

	// Check if both nodes can be crunshed together.
	if (c[0].table.length + c[1].table.length <= M)
	{
		if (c[0].table.length === 0)
		{
			return c[1];
		}
		if (c[1].table.length === 0)
		{
			return c[0];
		}

		// Adjust .table and .lengths
		c[0].table = c[0].table.concat(c[1].table);
		if (c[0].height > 0)
		{
			var len = length(c[0]);
			for (var i = 0; i < c[1].lengths.length; i++)
			{
				c[1].lengths[i] += len;
			}
			c[0].lengths = c[0].lengths.concat(c[1].lengths);
		}

		return c[0];
	}

	if (c[0].height > 0)
	{
		var toRemove = calcToRemove(a, b);
		if (toRemove > E)
		{
			c = shuffle(c[0], c[1], toRemove);
		}
	}

	return siblise(c[0], c[1]);
}

// Returns an array of two nodes; right and left. One node _may_ be empty.
function append_(a, b)
{
	if (a.height === 0 && b.height === 0)
	{
		return [a, b];
	}

	if (a.height !== 1 || b.height !== 1)
	{
		if (a.height === b.height)
		{
			a = nodeCopy(a);
			b = nodeCopy(b);
			var appended = append_(botRight(a), botLeft(b));

			insertRight(a, appended[1]);
			insertLeft(b, appended[0]);
		}
		else if (a.height > b.height)
		{
			a = nodeCopy(a);
			var appended = append_(botRight(a), b);

			insertRight(a, appended[0]);
			b = parentise(appended[1], appended[1].height + 1);
		}
		else
		{
			b = nodeCopy(b);
			var appended = append_(a, botLeft(b));

			var left = appended[0].table.length === 0 ? 0 : 1;
			var right = left === 0 ? 1 : 0;
			insertLeft(b, appended[left]);
			a = parentise(appended[right], appended[right].height + 1);
		}
	}

	// Check if balancing is needed and return based on that.
	if (a.table.length === 0 || b.table.length === 0)
	{
		return [a, b];
	}

	var toRemove = calcToRemove(a, b);
	if (toRemove <= E)
	{
		return [a, b];
	}
	return shuffle(a, b, toRemove);
}

// Helperfunctions for append_. Replaces a child node at the side of the parent.
function insertRight(parent, node)
{
	var index = parent.table.length - 1;
	parent.table[index] = node;
	parent.lengths[index] = length(node);
	parent.lengths[index] += index > 0 ? parent.lengths[index - 1] : 0;
}

function insertLeft(parent, node)
{
	if (node.table.length > 0)
	{
		parent.table[0] = node;
		parent.lengths[0] = length(node);

		var len = length(parent.table[0]);
		for (var i = 1; i < parent.lengths.length; i++)
		{
			len += length(parent.table[i]);
			parent.lengths[i] = len;
		}
	}
	else
	{
		parent.table.shift();
		for (var i = 1; i < parent.lengths.length; i++)
		{
			parent.lengths[i] = parent.lengths[i] - parent.lengths[0];
		}
		parent.lengths.shift();
	}
}

// Returns the extra search steps for E. Refer to the paper.
function calcToRemove(a, b)
{
	var subLengths = 0;
	for (var i = 0; i < a.table.length; i++)
	{
		subLengths += a.table[i].table.length;
	}
	for (var i = 0; i < b.table.length; i++)
	{
		subLengths += b.table[i].table.length;
	}

	var toRemove = a.table.length + b.table.length;
	return toRemove - (Math.floor((subLengths - 1) / M) + 1);
}

// get2, set2 and saveSlot are helpers for accessing elements over two arrays.
function get2(a, b, index)
{
	return index < a.length
		? a[index]
		: b[index - a.length];
}

function set2(a, b, index, value)
{
	if (index < a.length)
	{
		a[index] = value;
	}
	else
	{
		b[index - a.length] = value;
	}
}

function saveSlot(a, b, index, slot)
{
	set2(a.table, b.table, index, slot);

	var l = (index === 0 || index === a.lengths.length)
		? 0
		: get2(a.lengths, a.lengths, index - 1);

	set2(a.lengths, b.lengths, index, l + length(slot));
}

// Creates a node or leaf with a given length at their arrays for perfomance.
// Is only used by shuffle.
function createNode(h, length)
{
	if (length < 0)
	{
		length = 0;
	}
	var a = {
		ctor: '_Array',
		height: h,
		table: new Array(length)
	};
	if (h > 0)
	{
		a.lengths = new Array(length);
	}
	return a;
}

// Returns an array of two balanced nodes.
function shuffle(a, b, toRemove)
{
	var newA = createNode(a.height, Math.min(M, a.table.length + b.table.length - toRemove));
	var newB = createNode(a.height, newA.table.length - (a.table.length + b.table.length - toRemove));

	// Skip the slots with size M. More precise: copy the slot references
	// to the new node
	var read = 0;
	while (get2(a.table, b.table, read).table.length % M === 0)
	{
		set2(newA.table, newB.table, read, get2(a.table, b.table, read));
		set2(newA.lengths, newB.lengths, read, get2(a.lengths, b.lengths, read));
		read++;
	}

	// Pulling items from left to right, caching in a slot before writing
	// it into the new nodes.
	var write = read;
	var slot = new createNode(a.height - 1, 0);
	var from = 0;

	// If the current slot is still containing data, then there will be at
	// least one more write, so we do not break this loop yet.
	while (read - write - (slot.table.length > 0 ? 1 : 0) < toRemove)
	{
		// Find out the max possible items for copying.
		var source = get2(a.table, b.table, read);
		var to = Math.min(M - slot.table.length, source.table.length);

		// Copy and adjust size table.
		slot.table = slot.table.concat(source.table.slice(from, to));
		if (slot.height > 0)
		{
			var len = slot.lengths.length;
			for (var i = len; i < len + to - from; i++)
			{
				slot.lengths[i] = length(slot.table[i]);
				slot.lengths[i] += (i > 0 ? slot.lengths[i - 1] : 0);
			}
		}

		from += to;

		// Only proceed to next slots[i] if the current one was
		// fully copied.
		if (source.table.length <= to)
		{
			read++; from = 0;
		}

		// Only create a new slot if the current one is filled up.
		if (slot.table.length === M)
		{
			saveSlot(newA, newB, write, slot);
			slot = createNode(a.height - 1, 0);
			write++;
		}
	}

	// Cleanup after the loop. Copy the last slot into the new nodes.
	if (slot.table.length > 0)
	{
		saveSlot(newA, newB, write, slot);
		write++;
	}

	// Shift the untouched slots to the left
	while (read < a.table.length + b.table.length )
	{
		saveSlot(newA, newB, write, get2(a.table, b.table, read));
		read++;
		write++;
	}

	return [newA, newB];
}

// Navigation functions
function botRight(a)
{
	return a.table[a.table.length - 1];
}
function botLeft(a)
{
	return a.table[0];
}

// Copies a node for updating. Note that you should not use this if
// only updating only one of "table" or "lengths" for performance reasons.
function nodeCopy(a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice()
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths.slice();
	}
	return newA;
}

// Returns how many items are in the tree.
function length(array)
{
	if (array.height === 0)
	{
		return array.table.length;
	}
	else
	{
		return array.lengths[array.lengths.length - 1];
	}
}

// Calculates in which slot of "table" the item probably is, then
// find the exact slot via forward searching in  "lengths". Returns the index.
function getSlot(i, a)
{
	var slot = i >> (5 * a.height);
	while (a.lengths[slot] <= i)
	{
		slot++;
	}
	return slot;
}

// Recursively creates a tree with a given height containing
// only the given item.
function create(item, h)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: [item]
		};
	}
	return {
		ctor: '_Array',
		height: h,
		table: [create(item, h - 1)],
		lengths: [1]
	};
}

// Recursively creates a tree that contains the given tree.
function parentise(tree, h)
{
	if (h === tree.height)
	{
		return tree;
	}

	return {
		ctor: '_Array',
		height: h,
		table: [parentise(tree, h - 1)],
		lengths: [length(tree)]
	};
}

// Emphasizes blood brotherhood beneath two trees.
function siblise(a, b)
{
	return {
		ctor: '_Array',
		height: a.height + 1,
		table: [a, b],
		lengths: [length(a), length(a) + length(b)]
	};
}

function toJSArray(a)
{
	var jsArray = new Array(length(a));
	toJSArray_(jsArray, 0, a);
	return jsArray;
}

function toJSArray_(jsArray, i, a)
{
	for (var t = 0; t < a.table.length; t++)
	{
		if (a.height === 0)
		{
			jsArray[i + t] = a.table[t];
		}
		else
		{
			var inc = t === 0 ? 0 : a.lengths[t - 1];
			toJSArray_(jsArray, i + inc, a.table[t]);
		}
	}
}

function fromJSArray(jsArray)
{
	if (jsArray.length === 0)
	{
		return empty;
	}
	var h = Math.floor(Math.log(jsArray.length) / Math.log(M));
	return fromJSArray_(jsArray, h, 0, jsArray.length);
}

function fromJSArray_(jsArray, h, from, to)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: jsArray.slice(from, to)
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = fromJSArray_(jsArray, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i - 1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

return {
	empty: empty,
	fromList: fromList,
	toList: toList,
	initialize: F2(initialize),
	append: F2(append),
	push: F2(push),
	slice: F3(slice),
	get: F2(get),
	set: F3(set),
	map: F2(map),
	indexedMap: F2(indexedMap),
	foldl: F3(foldl),
	foldr: F3(foldr),
	length: length,

	toJSArray: toJSArray,
	fromJSArray: fromJSArray
};

}();
//import Native.Utils //

var _elm_lang$core$Native_Basics = function() {

function div(a, b)
{
	return (a / b) | 0;
}
function rem(a, b)
{
	return a % b;
}
function mod(a, b)
{
	if (b === 0)
	{
		throw new Error('Cannot perform mod 0. Division by zero error.');
	}
	var r = a % b;
	var m = a === 0 ? 0 : (b > 0 ? (a >= 0 ? r : r + b) : -mod(-a, -b));

	return m === b ? 0 : m;
}
function logBase(base, n)
{
	return Math.log(n) / Math.log(base);
}
function negate(n)
{
	return -n;
}
function abs(n)
{
	return n < 0 ? -n : n;
}

function min(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) < 0 ? a : b;
}
function max(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) > 0 ? a : b;
}
function clamp(lo, hi, n)
{
	return _elm_lang$core$Native_Utils.cmp(n, lo) < 0
		? lo
		: _elm_lang$core$Native_Utils.cmp(n, hi) > 0
			? hi
			: n;
}

var ord = ['LT', 'EQ', 'GT'];

function compare(x, y)
{
	return { ctor: ord[_elm_lang$core$Native_Utils.cmp(x, y) + 1] };
}

function xor(a, b)
{
	return a !== b;
}
function not(b)
{
	return !b;
}
function isInfinite(n)
{
	return n === Infinity || n === -Infinity;
}

function truncate(n)
{
	return n | 0;
}

function degrees(d)
{
	return d * Math.PI / 180;
}
function turns(t)
{
	return 2 * Math.PI * t;
}
function fromPolar(point)
{
	var r = point._0;
	var t = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(r * Math.cos(t), r * Math.sin(t));
}
function toPolar(point)
{
	var x = point._0;
	var y = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(Math.sqrt(x * x + y * y), Math.atan2(y, x));
}

return {
	div: F2(div),
	rem: F2(rem),
	mod: F2(mod),

	pi: Math.PI,
	e: Math.E,
	cos: Math.cos,
	sin: Math.sin,
	tan: Math.tan,
	acos: Math.acos,
	asin: Math.asin,
	atan: Math.atan,
	atan2: F2(Math.atan2),

	degrees: degrees,
	turns: turns,
	fromPolar: fromPolar,
	toPolar: toPolar,

	sqrt: Math.sqrt,
	logBase: F2(logBase),
	negate: negate,
	abs: abs,
	min: F2(min),
	max: F2(max),
	clamp: F3(clamp),
	compare: F2(compare),

	xor: F2(xor),
	not: not,

	truncate: truncate,
	ceiling: Math.ceil,
	floor: Math.floor,
	round: Math.round,
	toFloat: function(x) { return x; },
	isNaN: isNaN,
	isInfinite: isInfinite
};

}();
//import //

var _elm_lang$core$Native_Utils = function() {

// COMPARISONS

function eq(x, y)
{
	var stack = [];
	var isEqual = eqHelp(x, y, 0, stack);
	var pair;
	while (isEqual && (pair = stack.pop()))
	{
		isEqual = eqHelp(pair.x, pair.y, 0, stack);
	}
	return isEqual;
}


function eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push({ x: x, y: y });
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object')
	{
		if (typeof x === 'function')
		{
			throw new Error(
				'Trying to use `(==)` on functions. There is no way to know if functions are "the same" in the Elm sense.'
				+ ' Read more about this at http://package.elm-lang.org/packages/elm-lang/core/latest/Basics#=='
				+ ' which describes why it is this way and what the better version will look like.'
			);
		}
		return false;
	}

	if (x === null || y === null)
	{
		return false
	}

	if (x instanceof Date)
	{
		return x.getTime() === y.getTime();
	}

	if (!('ctor' in x))
	{
		for (var key in x)
		{
			if (!eqHelp(x[key], y[key], depth + 1, stack))
			{
				return false;
			}
		}
		return true;
	}

	// convert Dicts and Sets to lists
	if (x.ctor === 'RBNode_elm_builtin' || x.ctor === 'RBEmpty_elm_builtin')
	{
		x = _elm_lang$core$Dict$toList(x);
		y = _elm_lang$core$Dict$toList(y);
	}
	if (x.ctor === 'Set_elm_builtin')
	{
		x = _elm_lang$core$Set$toList(x);
		y = _elm_lang$core$Set$toList(y);
	}

	// check if lists are equal without recursion
	if (x.ctor === '::')
	{
		var a = x;
		var b = y;
		while (a.ctor === '::' && b.ctor === '::')
		{
			if (!eqHelp(a._0, b._0, depth + 1, stack))
			{
				return false;
			}
			a = a._1;
			b = b._1;
		}
		return a.ctor === b.ctor;
	}

	// check if Arrays are equal
	if (x.ctor === '_Array')
	{
		var xs = _elm_lang$core$Native_Array.toJSArray(x);
		var ys = _elm_lang$core$Native_Array.toJSArray(y);
		if (xs.length !== ys.length)
		{
			return false;
		}
		for (var i = 0; i < xs.length; i++)
		{
			if (!eqHelp(xs[i], ys[i], depth + 1, stack))
			{
				return false;
			}
		}
		return true;
	}

	if (!eqHelp(x.ctor, y.ctor, depth + 1, stack))
	{
		return false;
	}

	for (var key in x)
	{
		if (!eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

var LT = -1, EQ = 0, GT = 1;

function cmp(x, y)
{
	if (typeof x !== 'object')
	{
		return x === y ? EQ : x < y ? LT : GT;
	}

	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? EQ : a < b ? LT : GT;
	}

	if (x.ctor === '::' || x.ctor === '[]')
	{
		while (x.ctor === '::' && y.ctor === '::')
		{
			var ord = cmp(x._0, y._0);
			if (ord !== EQ)
			{
				return ord;
			}
			x = x._1;
			y = y._1;
		}
		return x.ctor === y.ctor ? EQ : x.ctor === '[]' ? LT : GT;
	}

	if (x.ctor.slice(0, 6) === '_Tuple')
	{
		var ord;
		var n = x.ctor.slice(6) - 0;
		var err = 'cannot compare tuples with more than 6 elements.';
		if (n === 0) return EQ;
		if (n >= 1) { ord = cmp(x._0, y._0); if (ord !== EQ) return ord;
		if (n >= 2) { ord = cmp(x._1, y._1); if (ord !== EQ) return ord;
		if (n >= 3) { ord = cmp(x._2, y._2); if (ord !== EQ) return ord;
		if (n >= 4) { ord = cmp(x._3, y._3); if (ord !== EQ) return ord;
		if (n >= 5) { ord = cmp(x._4, y._4); if (ord !== EQ) return ord;
		if (n >= 6) { ord = cmp(x._5, y._5); if (ord !== EQ) return ord;
		if (n >= 7) throw new Error('Comparison error: ' + err); } } } } } }
		return EQ;
	}

	throw new Error(
		'Comparison error: comparison is only defined on ints, '
		+ 'floats, times, chars, strings, lists of comparable values, '
		+ 'and tuples of comparable values.'
	);
}


// COMMON VALUES

var Tuple0 = {
	ctor: '_Tuple0'
};

function Tuple2(x, y)
{
	return {
		ctor: '_Tuple2',
		_0: x,
		_1: y
	};
}

function chr(c)
{
	return new String(c);
}


// GUID

var count = 0;
function guid(_)
{
	return count++;
}


// RECORDS

function update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


//// LIST STUFF ////

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return {
		ctor: '::',
		_0: hd,
		_1: tl
	};
}

function append(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (xs.ctor === '[]')
	{
		return ys;
	}
	var root = Cons(xs._0, Nil);
	var curr = root;
	xs = xs._1;
	while (xs.ctor !== '[]')
	{
		curr._1 = Cons(xs._0, Nil);
		xs = xs._1;
		curr = curr._1;
	}
	curr._1 = ys;
	return root;
}


// CRASHES

function crash(moduleName, region)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '` ' + regionToString(region) + '\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function crashCase(moduleName, region, value)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '`\n\n'
			+ 'This was caused by the `case` expression ' + regionToString(region) + '.\n'
			+ 'One of the branches ended with a crash and the following value got through:\n\n    ' + toString(value) + '\n\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function regionToString(region)
{
	if (region.start.line == region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'between lines ' + region.start.line + ' and ' + region.end.line;
}


// TO STRING

function toString(v)
{
	var type = typeof v;
	if (type === 'function')
	{
		return '<function>';
	}

	if (type === 'boolean')
	{
		return v ? 'True' : 'False';
	}

	if (type === 'number')
	{
		return v + '';
	}

	if (v instanceof String)
	{
		return '\'' + addSlashes(v, true) + '\'';
	}

	if (type === 'string')
	{
		return '"' + addSlashes(v, false) + '"';
	}

	if (v === null)
	{
		return 'null';
	}

	if (type === 'object' && 'ctor' in v)
	{
		var ctorStarter = v.ctor.substring(0, 5);

		if (ctorStarter === '_Tupl')
		{
			var output = [];
			for (var k in v)
			{
				if (k === 'ctor') continue;
				output.push(toString(v[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (ctorStarter === '_Task')
		{
			return '<task>'
		}

		if (v.ctor === '_Array')
		{
			var list = _elm_lang$core$Array$toList(v);
			return 'Array.fromList ' + toString(list);
		}

		if (v.ctor === '<decoder>')
		{
			return '<decoder>';
		}

		if (v.ctor === '_Process')
		{
			return '<process:' + v.id + '>';
		}

		if (v.ctor === '::')
		{
			var output = '[' + toString(v._0);
			v = v._1;
			while (v.ctor === '::')
			{
				output += ',' + toString(v._0);
				v = v._1;
			}
			return output + ']';
		}

		if (v.ctor === '[]')
		{
			return '[]';
		}

		if (v.ctor === 'Set_elm_builtin')
		{
			return 'Set.fromList ' + toString(_elm_lang$core$Set$toList(v));
		}

		if (v.ctor === 'RBNode_elm_builtin' || v.ctor === 'RBEmpty_elm_builtin')
		{
			return 'Dict.fromList ' + toString(_elm_lang$core$Dict$toList(v));
		}

		var output = '';
		for (var i in v)
		{
			if (i === 'ctor') continue;
			var str = toString(v[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return v.ctor + output;
	}

	if (type === 'object')
	{
		if (v instanceof Date)
		{
			return '<' + v.toString() + '>';
		}

		if (v.elm_web_socket)
		{
			return '<websocket>';
		}

		var output = [];
		for (var k in v)
		{
			output.push(k + ' = ' + toString(v[k]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return '<internal structure>';
}

function addSlashes(str, isChar)
{
	var s = str.replace(/\\/g, '\\\\')
			  .replace(/\n/g, '\\n')
			  .replace(/\t/g, '\\t')
			  .replace(/\r/g, '\\r')
			  .replace(/\v/g, '\\v')
			  .replace(/\0/g, '\\0');
	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}


return {
	eq: eq,
	cmp: cmp,
	Tuple0: Tuple0,
	Tuple2: Tuple2,
	chr: chr,
	update: update,
	guid: guid,

	append: F2(append),

	crash: crash,
	crashCase: crashCase,

	toString: toString
};

}();
var _elm_lang$core$Basics$never = function (_p0) {
	never:
	while (true) {
		var _p1 = _p0;
		var _v1 = _p1._0;
		_p0 = _v1;
		continue never;
	}
};
var _elm_lang$core$Basics$uncurry = F2(
	function (f, _p2) {
		var _p3 = _p2;
		return A2(f, _p3._0, _p3._1);
	});
var _elm_lang$core$Basics$curry = F3(
	function (f, a, b) {
		return f(
			{ctor: '_Tuple2', _0: a, _1: b});
	});
var _elm_lang$core$Basics$flip = F3(
	function (f, b, a) {
		return A2(f, a, b);
	});
var _elm_lang$core$Basics$always = F2(
	function (a, _p4) {
		return a;
	});
var _elm_lang$core$Basics$identity = function (x) {
	return x;
};
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<|'] = F2(
	function (f, x) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['|>'] = F2(
	function (x, f) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>>'] = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<<'] = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['++'] = _elm_lang$core$Native_Utils.append;
var _elm_lang$core$Basics$toString = _elm_lang$core$Native_Utils.toString;
var _elm_lang$core$Basics$isInfinite = _elm_lang$core$Native_Basics.isInfinite;
var _elm_lang$core$Basics$isNaN = _elm_lang$core$Native_Basics.isNaN;
var _elm_lang$core$Basics$toFloat = _elm_lang$core$Native_Basics.toFloat;
var _elm_lang$core$Basics$ceiling = _elm_lang$core$Native_Basics.ceiling;
var _elm_lang$core$Basics$floor = _elm_lang$core$Native_Basics.floor;
var _elm_lang$core$Basics$truncate = _elm_lang$core$Native_Basics.truncate;
var _elm_lang$core$Basics$round = _elm_lang$core$Native_Basics.round;
var _elm_lang$core$Basics$not = _elm_lang$core$Native_Basics.not;
var _elm_lang$core$Basics$xor = _elm_lang$core$Native_Basics.xor;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['||'] = _elm_lang$core$Native_Basics.or;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['&&'] = _elm_lang$core$Native_Basics.and;
var _elm_lang$core$Basics$max = _elm_lang$core$Native_Basics.max;
var _elm_lang$core$Basics$min = _elm_lang$core$Native_Basics.min;
var _elm_lang$core$Basics$compare = _elm_lang$core$Native_Basics.compare;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>='] = _elm_lang$core$Native_Basics.ge;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<='] = _elm_lang$core$Native_Basics.le;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>'] = _elm_lang$core$Native_Basics.gt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<'] = _elm_lang$core$Native_Basics.lt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/='] = _elm_lang$core$Native_Basics.neq;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['=='] = _elm_lang$core$Native_Basics.eq;
var _elm_lang$core$Basics$e = _elm_lang$core$Native_Basics.e;
var _elm_lang$core$Basics$pi = _elm_lang$core$Native_Basics.pi;
var _elm_lang$core$Basics$clamp = _elm_lang$core$Native_Basics.clamp;
var _elm_lang$core$Basics$logBase = _elm_lang$core$Native_Basics.logBase;
var _elm_lang$core$Basics$abs = _elm_lang$core$Native_Basics.abs;
var _elm_lang$core$Basics$negate = _elm_lang$core$Native_Basics.negate;
var _elm_lang$core$Basics$sqrt = _elm_lang$core$Native_Basics.sqrt;
var _elm_lang$core$Basics$atan2 = _elm_lang$core$Native_Basics.atan2;
var _elm_lang$core$Basics$atan = _elm_lang$core$Native_Basics.atan;
var _elm_lang$core$Basics$asin = _elm_lang$core$Native_Basics.asin;
var _elm_lang$core$Basics$acos = _elm_lang$core$Native_Basics.acos;
var _elm_lang$core$Basics$tan = _elm_lang$core$Native_Basics.tan;
var _elm_lang$core$Basics$sin = _elm_lang$core$Native_Basics.sin;
var _elm_lang$core$Basics$cos = _elm_lang$core$Native_Basics.cos;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['^'] = _elm_lang$core$Native_Basics.exp;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['%'] = _elm_lang$core$Native_Basics.mod;
var _elm_lang$core$Basics$rem = _elm_lang$core$Native_Basics.rem;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['//'] = _elm_lang$core$Native_Basics.div;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/'] = _elm_lang$core$Native_Basics.floatDiv;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['*'] = _elm_lang$core$Native_Basics.mul;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['-'] = _elm_lang$core$Native_Basics.sub;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['+'] = _elm_lang$core$Native_Basics.add;
var _elm_lang$core$Basics$toPolar = _elm_lang$core$Native_Basics.toPolar;
var _elm_lang$core$Basics$fromPolar = _elm_lang$core$Native_Basics.fromPolar;
var _elm_lang$core$Basics$turns = _elm_lang$core$Native_Basics.turns;
var _elm_lang$core$Basics$degrees = _elm_lang$core$Native_Basics.degrees;
var _elm_lang$core$Basics$radians = function (t) {
	return t;
};
var _elm_lang$core$Basics$GT = {ctor: 'GT'};
var _elm_lang$core$Basics$EQ = {ctor: 'EQ'};
var _elm_lang$core$Basics$LT = {ctor: 'LT'};
var _elm_lang$core$Basics$JustOneMore = function (a) {
	return {ctor: 'JustOneMore', _0: a};
};

var _elm_lang$core$Maybe$withDefault = F2(
	function ($default, maybe) {
		var _p0 = maybe;
		if (_p0.ctor === 'Just') {
			return _p0._0;
		} else {
			return $default;
		}
	});
var _elm_lang$core$Maybe$Nothing = {ctor: 'Nothing'};
var _elm_lang$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		var _p1 = maybeValue;
		if (_p1.ctor === 'Just') {
			return callback(_p1._0);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$Just = function (a) {
	return {ctor: 'Just', _0: a};
};
var _elm_lang$core$Maybe$map = F2(
	function (f, maybe) {
		var _p2 = maybe;
		if (_p2.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(
				f(_p2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		var _p3 = {ctor: '_Tuple2', _0: ma, _1: mb};
		if (((_p3.ctor === '_Tuple2') && (_p3._0.ctor === 'Just')) && (_p3._1.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A2(func, _p3._0._0, _p3._1._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map3 = F4(
	function (func, ma, mb, mc) {
		var _p4 = {ctor: '_Tuple3', _0: ma, _1: mb, _2: mc};
		if ((((_p4.ctor === '_Tuple3') && (_p4._0.ctor === 'Just')) && (_p4._1.ctor === 'Just')) && (_p4._2.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A3(func, _p4._0._0, _p4._1._0, _p4._2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map4 = F5(
	function (func, ma, mb, mc, md) {
		var _p5 = {ctor: '_Tuple4', _0: ma, _1: mb, _2: mc, _3: md};
		if (((((_p5.ctor === '_Tuple4') && (_p5._0.ctor === 'Just')) && (_p5._1.ctor === 'Just')) && (_p5._2.ctor === 'Just')) && (_p5._3.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A4(func, _p5._0._0, _p5._1._0, _p5._2._0, _p5._3._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map5 = F6(
	function (func, ma, mb, mc, md, me) {
		var _p6 = {ctor: '_Tuple5', _0: ma, _1: mb, _2: mc, _3: md, _4: me};
		if ((((((_p6.ctor === '_Tuple5') && (_p6._0.ctor === 'Just')) && (_p6._1.ctor === 'Just')) && (_p6._2.ctor === 'Just')) && (_p6._3.ctor === 'Just')) && (_p6._4.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A5(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0, _p6._4._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});

//import Native.Utils //

var _elm_lang$core$Native_List = function() {

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return { ctor: '::', _0: hd, _1: tl };
}

function fromArray(arr)
{
	var out = Nil;
	for (var i = arr.length; i--; )
	{
		out = Cons(arr[i], out);
	}
	return out;
}

function toArray(xs)
{
	var out = [];
	while (xs.ctor !== '[]')
	{
		out.push(xs._0);
		xs = xs._1;
	}
	return out;
}

function foldr(f, b, xs)
{
	var arr = toArray(xs);
	var acc = b;
	for (var i = arr.length; i--; )
	{
		acc = A2(f, arr[i], acc);
	}
	return acc;
}

function map2(f, xs, ys)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]')
	{
		arr.push(A2(f, xs._0, ys._0));
		xs = xs._1;
		ys = ys._1;
	}
	return fromArray(arr);
}

function map3(f, xs, ys, zs)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]')
	{
		arr.push(A3(f, xs._0, ys._0, zs._0));
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map4(f, ws, xs, ys, zs)
{
	var arr = [];
	while (   ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A4(f, ws._0, xs._0, ys._0, zs._0));
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map5(f, vs, ws, xs, ys, zs)
{
	var arr = [];
	while (   vs.ctor !== '[]'
		   && ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A5(f, vs._0, ws._0, xs._0, ys._0, zs._0));
		vs = vs._1;
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function sortBy(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		return _elm_lang$core$Native_Utils.cmp(f(a), f(b));
	}));
}

function sortWith(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		var ord = f(a)(b).ctor;
		return ord === 'EQ' ? 0 : ord === 'LT' ? -1 : 1;
	}));
}

return {
	Nil: Nil,
	Cons: Cons,
	cons: F2(Cons),
	toArray: toArray,
	fromArray: fromArray,

	foldr: F3(foldr),

	map2: F3(map2),
	map3: F4(map3),
	map4: F5(map4),
	map5: F6(map5),
	sortBy: F2(sortBy),
	sortWith: F2(sortWith)
};

}();
var _elm_lang$core$List$sortWith = _elm_lang$core$Native_List.sortWith;
var _elm_lang$core$List$sortBy = _elm_lang$core$Native_List.sortBy;
var _elm_lang$core$List$sort = function (xs) {
	return A2(_elm_lang$core$List$sortBy, _elm_lang$core$Basics$identity, xs);
};
var _elm_lang$core$List$singleton = function (value) {
	return {
		ctor: '::',
		_0: value,
		_1: {ctor: '[]'}
	};
};
var _elm_lang$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return list;
			} else {
				var _p0 = list;
				if (_p0.ctor === '[]') {
					return list;
				} else {
					var _v1 = n - 1,
						_v2 = _p0._1;
					n = _v1;
					list = _v2;
					continue drop;
				}
			}
		}
	});
var _elm_lang$core$List$map5 = _elm_lang$core$Native_List.map5;
var _elm_lang$core$List$map4 = _elm_lang$core$Native_List.map4;
var _elm_lang$core$List$map3 = _elm_lang$core$Native_List.map3;
var _elm_lang$core$List$map2 = _elm_lang$core$Native_List.map2;
var _elm_lang$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			var _p1 = list;
			if (_p1.ctor === '[]') {
				return false;
			} else {
				if (isOkay(_p1._0)) {
					return true;
				} else {
					var _v4 = isOkay,
						_v5 = _p1._1;
					isOkay = _v4;
					list = _v5;
					continue any;
				}
			}
		}
	});
var _elm_lang$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			_elm_lang$core$List$any,
			function (_p2) {
				return !isOkay(_p2);
			},
			list);
	});
var _elm_lang$core$List$foldr = _elm_lang$core$Native_List.foldr;
var _elm_lang$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			var _p3 = list;
			if (_p3.ctor === '[]') {
				return acc;
			} else {
				var _v7 = func,
					_v8 = A2(func, _p3._0, acc),
					_v9 = _p3._1;
				func = _v7;
				acc = _v8;
				list = _v9;
				continue foldl;
			}
		}
	});
var _elm_lang$core$List$length = function (xs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p4, i) {
				return i + 1;
			}),
		0,
		xs);
};
var _elm_lang$core$List$sum = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x + y;
			}),
		0,
		numbers);
};
var _elm_lang$core$List$product = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x * y;
			}),
		1,
		numbers);
};
var _elm_lang$core$List$maximum = function (list) {
	var _p5 = list;
	if (_p5.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$max, _p5._0, _p5._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$minimum = function (list) {
	var _p6 = list;
	if (_p6.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$min, _p6._0, _p6._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$member = F2(
	function (x, xs) {
		return A2(
			_elm_lang$core$List$any,
			function (a) {
				return _elm_lang$core$Native_Utils.eq(a, x);
			},
			xs);
	});
var _elm_lang$core$List$isEmpty = function (xs) {
	var _p7 = xs;
	if (_p7.ctor === '[]') {
		return true;
	} else {
		return false;
	}
};
var _elm_lang$core$List$tail = function (list) {
	var _p8 = list;
	if (_p8.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p8._1);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$head = function (list) {
	var _p9 = list;
	if (_p9.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p9._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List_ops = _elm_lang$core$List_ops || {};
_elm_lang$core$List_ops['::'] = _elm_lang$core$Native_List.cons;
var _elm_lang$core$List$map = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			F2(
				function (x, acc) {
					return {
						ctor: '::',
						_0: f(x),
						_1: acc
					};
				}),
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$filter = F2(
	function (pred, xs) {
		var conditionalCons = F2(
			function (front, back) {
				return pred(front) ? {ctor: '::', _0: front, _1: back} : back;
			});
		return A3(
			_elm_lang$core$List$foldr,
			conditionalCons,
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _p10 = f(mx);
		if (_p10.ctor === 'Just') {
			return {ctor: '::', _0: _p10._0, _1: xs};
		} else {
			return xs;
		}
	});
var _elm_lang$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			_elm_lang$core$List$maybeCons(f),
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$reverse = function (list) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return {ctor: '::', _0: x, _1: y};
			}),
		{ctor: '[]'},
		list);
};
var _elm_lang$core$List$scanl = F3(
	function (f, b, xs) {
		var scan1 = F2(
			function (x, accAcc) {
				var _p11 = accAcc;
				if (_p11.ctor === '::') {
					return {
						ctor: '::',
						_0: A2(f, x, _p11._0),
						_1: accAcc
					};
				} else {
					return {ctor: '[]'};
				}
			});
		return _elm_lang$core$List$reverse(
			A3(
				_elm_lang$core$List$foldl,
				scan1,
				{
					ctor: '::',
					_0: b,
					_1: {ctor: '[]'}
				},
				xs));
	});
var _elm_lang$core$List$append = F2(
	function (xs, ys) {
		var _p12 = ys;
		if (_p12.ctor === '[]') {
			return xs;
		} else {
			return A3(
				_elm_lang$core$List$foldr,
				F2(
					function (x, y) {
						return {ctor: '::', _0: x, _1: y};
					}),
				ys,
				xs);
		}
	});
var _elm_lang$core$List$concat = function (lists) {
	return A3(
		_elm_lang$core$List$foldr,
		_elm_lang$core$List$append,
		{ctor: '[]'},
		lists);
};
var _elm_lang$core$List$concatMap = F2(
	function (f, list) {
		return _elm_lang$core$List$concat(
			A2(_elm_lang$core$List$map, f, list));
	});
var _elm_lang$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _p13) {
				var _p14 = _p13;
				var _p16 = _p14._0;
				var _p15 = _p14._1;
				return pred(x) ? {
					ctor: '_Tuple2',
					_0: {ctor: '::', _0: x, _1: _p16},
					_1: _p15
				} : {
					ctor: '_Tuple2',
					_0: _p16,
					_1: {ctor: '::', _0: x, _1: _p15}
				};
			});
		return A3(
			_elm_lang$core$List$foldr,
			step,
			{
				ctor: '_Tuple2',
				_0: {ctor: '[]'},
				_1: {ctor: '[]'}
			},
			list);
	});
var _elm_lang$core$List$unzip = function (pairs) {
	var step = F2(
		function (_p18, _p17) {
			var _p19 = _p18;
			var _p20 = _p17;
			return {
				ctor: '_Tuple2',
				_0: {ctor: '::', _0: _p19._0, _1: _p20._0},
				_1: {ctor: '::', _0: _p19._1, _1: _p20._1}
			};
		});
	return A3(
		_elm_lang$core$List$foldr,
		step,
		{
			ctor: '_Tuple2',
			_0: {ctor: '[]'},
			_1: {ctor: '[]'}
		},
		pairs);
};
var _elm_lang$core$List$intersperse = F2(
	function (sep, xs) {
		var _p21 = xs;
		if (_p21.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			var step = F2(
				function (x, rest) {
					return {
						ctor: '::',
						_0: sep,
						_1: {ctor: '::', _0: x, _1: rest}
					};
				});
			var spersed = A3(
				_elm_lang$core$List$foldr,
				step,
				{ctor: '[]'},
				_p21._1);
			return {ctor: '::', _0: _p21._0, _1: spersed};
		}
	});
var _elm_lang$core$List$takeReverse = F3(
	function (n, list, taken) {
		takeReverse:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return taken;
			} else {
				var _p22 = list;
				if (_p22.ctor === '[]') {
					return taken;
				} else {
					var _v23 = n - 1,
						_v24 = _p22._1,
						_v25 = {ctor: '::', _0: _p22._0, _1: taken};
					n = _v23;
					list = _v24;
					taken = _v25;
					continue takeReverse;
				}
			}
		}
	});
var _elm_lang$core$List$takeTailRec = F2(
	function (n, list) {
		return _elm_lang$core$List$reverse(
			A3(
				_elm_lang$core$List$takeReverse,
				n,
				list,
				{ctor: '[]'}));
	});
var _elm_lang$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
			return {ctor: '[]'};
		} else {
			var _p23 = {ctor: '_Tuple2', _0: n, _1: list};
			_v26_5:
			do {
				_v26_1:
				do {
					if (_p23.ctor === '_Tuple2') {
						if (_p23._1.ctor === '[]') {
							return list;
						} else {
							if (_p23._1._1.ctor === '::') {
								switch (_p23._0) {
									case 1:
										break _v26_1;
									case 2:
										return {
											ctor: '::',
											_0: _p23._1._0,
											_1: {
												ctor: '::',
												_0: _p23._1._1._0,
												_1: {ctor: '[]'}
											}
										};
									case 3:
										if (_p23._1._1._1.ctor === '::') {
											return {
												ctor: '::',
												_0: _p23._1._0,
												_1: {
													ctor: '::',
													_0: _p23._1._1._0,
													_1: {
														ctor: '::',
														_0: _p23._1._1._1._0,
														_1: {ctor: '[]'}
													}
												}
											};
										} else {
											break _v26_5;
										}
									default:
										if ((_p23._1._1._1.ctor === '::') && (_p23._1._1._1._1.ctor === '::')) {
											var _p28 = _p23._1._1._1._0;
											var _p27 = _p23._1._1._0;
											var _p26 = _p23._1._0;
											var _p25 = _p23._1._1._1._1._0;
											var _p24 = _p23._1._1._1._1._1;
											return (_elm_lang$core$Native_Utils.cmp(ctr, 1000) > 0) ? {
												ctor: '::',
												_0: _p26,
												_1: {
													ctor: '::',
													_0: _p27,
													_1: {
														ctor: '::',
														_0: _p28,
														_1: {
															ctor: '::',
															_0: _p25,
															_1: A2(_elm_lang$core$List$takeTailRec, n - 4, _p24)
														}
													}
												}
											} : {
												ctor: '::',
												_0: _p26,
												_1: {
													ctor: '::',
													_0: _p27,
													_1: {
														ctor: '::',
														_0: _p28,
														_1: {
															ctor: '::',
															_0: _p25,
															_1: A3(_elm_lang$core$List$takeFast, ctr + 1, n - 4, _p24)
														}
													}
												}
											};
										} else {
											break _v26_5;
										}
								}
							} else {
								if (_p23._0 === 1) {
									break _v26_1;
								} else {
									break _v26_5;
								}
							}
						}
					} else {
						break _v26_5;
					}
				} while(false);
				return {
					ctor: '::',
					_0: _p23._1._0,
					_1: {ctor: '[]'}
				};
			} while(false);
			return list;
		}
	});
var _elm_lang$core$List$take = F2(
	function (n, list) {
		return A3(_elm_lang$core$List$takeFast, 0, n, list);
	});
var _elm_lang$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return result;
			} else {
				var _v27 = {ctor: '::', _0: value, _1: result},
					_v28 = n - 1,
					_v29 = value;
				result = _v27;
				n = _v28;
				value = _v29;
				continue repeatHelp;
			}
		}
	});
var _elm_lang$core$List$repeat = F2(
	function (n, value) {
		return A3(
			_elm_lang$core$List$repeatHelp,
			{ctor: '[]'},
			n,
			value);
	});
var _elm_lang$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(lo, hi) < 1) {
				var _v30 = lo,
					_v31 = hi - 1,
					_v32 = {ctor: '::', _0: hi, _1: list};
				lo = _v30;
				hi = _v31;
				list = _v32;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var _elm_lang$core$List$range = F2(
	function (lo, hi) {
		return A3(
			_elm_lang$core$List$rangeHelp,
			lo,
			hi,
			{ctor: '[]'});
	});
var _elm_lang$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$map2,
			f,
			A2(
				_elm_lang$core$List$range,
				0,
				_elm_lang$core$List$length(xs) - 1),
			xs);
	});

var _elm_lang$core$Array$append = _elm_lang$core$Native_Array.append;
var _elm_lang$core$Array$length = _elm_lang$core$Native_Array.length;
var _elm_lang$core$Array$isEmpty = function (array) {
	return _elm_lang$core$Native_Utils.eq(
		_elm_lang$core$Array$length(array),
		0);
};
var _elm_lang$core$Array$slice = _elm_lang$core$Native_Array.slice;
var _elm_lang$core$Array$set = _elm_lang$core$Native_Array.set;
var _elm_lang$core$Array$get = F2(
	function (i, array) {
		return ((_elm_lang$core$Native_Utils.cmp(0, i) < 1) && (_elm_lang$core$Native_Utils.cmp(
			i,
			_elm_lang$core$Native_Array.length(array)) < 0)) ? _elm_lang$core$Maybe$Just(
			A2(_elm_lang$core$Native_Array.get, i, array)) : _elm_lang$core$Maybe$Nothing;
	});
var _elm_lang$core$Array$push = _elm_lang$core$Native_Array.push;
var _elm_lang$core$Array$empty = _elm_lang$core$Native_Array.empty;
var _elm_lang$core$Array$filter = F2(
	function (isOkay, arr) {
		var update = F2(
			function (x, xs) {
				return isOkay(x) ? A2(_elm_lang$core$Native_Array.push, x, xs) : xs;
			});
		return A3(_elm_lang$core$Native_Array.foldl, update, _elm_lang$core$Native_Array.empty, arr);
	});
var _elm_lang$core$Array$foldr = _elm_lang$core$Native_Array.foldr;
var _elm_lang$core$Array$foldl = _elm_lang$core$Native_Array.foldl;
var _elm_lang$core$Array$indexedMap = _elm_lang$core$Native_Array.indexedMap;
var _elm_lang$core$Array$map = _elm_lang$core$Native_Array.map;
var _elm_lang$core$Array$toIndexedList = function (array) {
	return A3(
		_elm_lang$core$List$map2,
		F2(
			function (v0, v1) {
				return {ctor: '_Tuple2', _0: v0, _1: v1};
			}),
		A2(
			_elm_lang$core$List$range,
			0,
			_elm_lang$core$Native_Array.length(array) - 1),
		_elm_lang$core$Native_Array.toList(array));
};
var _elm_lang$core$Array$toList = _elm_lang$core$Native_Array.toList;
var _elm_lang$core$Array$fromList = _elm_lang$core$Native_Array.fromList;
var _elm_lang$core$Array$initialize = _elm_lang$core$Native_Array.initialize;
var _elm_lang$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			_elm_lang$core$Array$initialize,
			n,
			_elm_lang$core$Basics$always(e));
	});
var _elm_lang$core$Array$Array = {ctor: 'Array'};

//import Native.Utils //

var _elm_lang$core$Native_Debug = function() {

function log(tag, value)
{
	var msg = tag + ': ' + _elm_lang$core$Native_Utils.toString(value);
	var process = process || {};
	if (process.stdout)
	{
		process.stdout.write(msg);
	}
	else
	{
		console.log(msg);
	}
	return value;
}

function crash(message)
{
	throw new Error(message);
}

return {
	crash: crash,
	log: F2(log)
};

}();
//import Maybe, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_String = function() {

function isEmpty(str)
{
	return str.length === 0;
}
function cons(chr, str)
{
	return chr + str;
}
function uncons(str)
{
	var hd = str[0];
	if (hd)
	{
		return _elm_lang$core$Maybe$Just(_elm_lang$core$Native_Utils.Tuple2(_elm_lang$core$Native_Utils.chr(hd), str.slice(1)));
	}
	return _elm_lang$core$Maybe$Nothing;
}
function append(a, b)
{
	return a + b;
}
function concat(strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join('');
}
function length(str)
{
	return str.length;
}
function map(f, str)
{
	var out = str.split('');
	for (var i = out.length; i--; )
	{
		out[i] = f(_elm_lang$core$Native_Utils.chr(out[i]));
	}
	return out.join('');
}
function filter(pred, str)
{
	return str.split('').map(_elm_lang$core$Native_Utils.chr).filter(pred).join('');
}
function reverse(str)
{
	return str.split('').reverse().join('');
}
function foldl(f, b, str)
{
	var len = str.length;
	for (var i = 0; i < len; ++i)
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function foldr(f, b, str)
{
	for (var i = str.length; i--; )
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function split(sep, str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(sep));
}
function join(sep, strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join(sep);
}
function repeat(n, str)
{
	var result = '';
	while (n > 0)
	{
		if (n & 1)
		{
			result += str;
		}
		n >>= 1, str += str;
	}
	return result;
}
function slice(start, end, str)
{
	return str.slice(start, end);
}
function left(n, str)
{
	return n < 1 ? '' : str.slice(0, n);
}
function right(n, str)
{
	return n < 1 ? '' : str.slice(-n);
}
function dropLeft(n, str)
{
	return n < 1 ? str : str.slice(n);
}
function dropRight(n, str)
{
	return n < 1 ? str : str.slice(0, -n);
}
function pad(n, chr, str)
{
	var half = (n - str.length) / 2;
	return repeat(Math.ceil(half), chr) + str + repeat(half | 0, chr);
}
function padRight(n, chr, str)
{
	return str + repeat(n - str.length, chr);
}
function padLeft(n, chr, str)
{
	return repeat(n - str.length, chr) + str;
}

function trim(str)
{
	return str.trim();
}
function trimLeft(str)
{
	return str.replace(/^\s+/, '');
}
function trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function words(str)
{
	return _elm_lang$core$Native_List.fromArray(str.trim().split(/\s+/g));
}
function lines(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(/\r\n|\r|\n/g));
}

function toUpper(str)
{
	return str.toUpperCase();
}
function toLower(str)
{
	return str.toLowerCase();
}

function any(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return true;
		}
	}
	return false;
}
function all(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (!pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return false;
		}
	}
	return true;
}

function contains(sub, str)
{
	return str.indexOf(sub) > -1;
}
function startsWith(sub, str)
{
	return str.indexOf(sub) === 0;
}
function endsWith(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
}
function indexes(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _elm_lang$core$Native_List.Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _elm_lang$core$Native_List.fromArray(is);
}


function toInt(s)
{
	var len = s.length;

	// if empty
	if (len === 0)
	{
		return intErr(s);
	}

	// if hex
	var c = s[0];
	if (c === '0' && s[1] === 'x')
	{
		for (var i = 2; i < len; ++i)
		{
			var c = s[i];
			if (('0' <= c && c <= '9') || ('A' <= c && c <= 'F') || ('a' <= c && c <= 'f'))
			{
				continue;
			}
			return intErr(s);
		}
		return _elm_lang$core$Result$Ok(parseInt(s, 16));
	}

	// is decimal
	if (c > '9' || (c < '0' && c !== '-' && c !== '+'))
	{
		return intErr(s);
	}
	for (var i = 1; i < len; ++i)
	{
		var c = s[i];
		if (c < '0' || '9' < c)
		{
			return intErr(s);
		}
	}

	return _elm_lang$core$Result$Ok(parseInt(s, 10));
}

function intErr(s)
{
	return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int");
}


function toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return floatErr(s);
	}
	var n = +s;
	// faster isNaN check
	return n === n ? _elm_lang$core$Result$Ok(n) : floatErr(s);
}

function floatErr(s)
{
	return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float");
}


function toList(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split('').map(_elm_lang$core$Native_Utils.chr));
}
function fromList(chars)
{
	return _elm_lang$core$Native_List.toArray(chars).join('');
}

return {
	isEmpty: isEmpty,
	cons: F2(cons),
	uncons: uncons,
	append: F2(append),
	concat: concat,
	length: length,
	map: F2(map),
	filter: F2(filter),
	reverse: reverse,
	foldl: F3(foldl),
	foldr: F3(foldr),

	split: F2(split),
	join: F2(join),
	repeat: F2(repeat),

	slice: F3(slice),
	left: F2(left),
	right: F2(right),
	dropLeft: F2(dropLeft),
	dropRight: F2(dropRight),

	pad: F3(pad),
	padLeft: F3(padLeft),
	padRight: F3(padRight),

	trim: trim,
	trimLeft: trimLeft,
	trimRight: trimRight,

	words: words,
	lines: lines,

	toUpper: toUpper,
	toLower: toLower,

	any: F2(any),
	all: F2(all),

	contains: F2(contains),
	startsWith: F2(startsWith),
	endsWith: F2(endsWith),
	indexes: F2(indexes),

	toInt: toInt,
	toFloat: toFloat,
	toList: toList,
	fromList: fromList
};

}();

//import Native.Utils //

var _elm_lang$core$Native_Char = function() {

return {
	fromCode: function(c) { return _elm_lang$core$Native_Utils.chr(String.fromCharCode(c)); },
	toCode: function(c) { return c.charCodeAt(0); },
	toUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toUpperCase()); },
	toLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLowerCase()); },
	toLocaleUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleUpperCase()); },
	toLocaleLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleLowerCase()); }
};

}();
var _elm_lang$core$Char$fromCode = _elm_lang$core$Native_Char.fromCode;
var _elm_lang$core$Char$toCode = _elm_lang$core$Native_Char.toCode;
var _elm_lang$core$Char$toLocaleLower = _elm_lang$core$Native_Char.toLocaleLower;
var _elm_lang$core$Char$toLocaleUpper = _elm_lang$core$Native_Char.toLocaleUpper;
var _elm_lang$core$Char$toLower = _elm_lang$core$Native_Char.toLower;
var _elm_lang$core$Char$toUpper = _elm_lang$core$Native_Char.toUpper;
var _elm_lang$core$Char$isBetween = F3(
	function (low, high, $char) {
		var code = _elm_lang$core$Char$toCode($char);
		return (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(low)) > -1) && (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(high)) < 1);
	});
var _elm_lang$core$Char$isUpper = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('A'),
	_elm_lang$core$Native_Utils.chr('Z'));
var _elm_lang$core$Char$isLower = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('a'),
	_elm_lang$core$Native_Utils.chr('z'));
var _elm_lang$core$Char$isDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('9'));
var _elm_lang$core$Char$isOctDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('7'));
var _elm_lang$core$Char$isHexDigit = function ($char) {
	return _elm_lang$core$Char$isDigit($char) || (A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('a'),
		_elm_lang$core$Native_Utils.chr('f'),
		$char) || A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('A'),
		_elm_lang$core$Native_Utils.chr('F'),
		$char));
};

var _elm_lang$core$Result$toMaybe = function (result) {
	var _p0 = result;
	if (_p0.ctor === 'Ok') {
		return _elm_lang$core$Maybe$Just(_p0._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$Result$withDefault = F2(
	function (def, result) {
		var _p1 = result;
		if (_p1.ctor === 'Ok') {
			return _p1._0;
		} else {
			return def;
		}
	});
var _elm_lang$core$Result$Err = function (a) {
	return {ctor: 'Err', _0: a};
};
var _elm_lang$core$Result$andThen = F2(
	function (callback, result) {
		var _p2 = result;
		if (_p2.ctor === 'Ok') {
			return callback(_p2._0);
		} else {
			return _elm_lang$core$Result$Err(_p2._0);
		}
	});
var _elm_lang$core$Result$Ok = function (a) {
	return {ctor: 'Ok', _0: a};
};
var _elm_lang$core$Result$map = F2(
	function (func, ra) {
		var _p3 = ra;
		if (_p3.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(
				func(_p3._0));
		} else {
			return _elm_lang$core$Result$Err(_p3._0);
		}
	});
var _elm_lang$core$Result$map2 = F3(
	function (func, ra, rb) {
		var _p4 = {ctor: '_Tuple2', _0: ra, _1: rb};
		if (_p4._0.ctor === 'Ok') {
			if (_p4._1.ctor === 'Ok') {
				return _elm_lang$core$Result$Ok(
					A2(func, _p4._0._0, _p4._1._0));
			} else {
				return _elm_lang$core$Result$Err(_p4._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p4._0._0);
		}
	});
var _elm_lang$core$Result$map3 = F4(
	function (func, ra, rb, rc) {
		var _p5 = {ctor: '_Tuple3', _0: ra, _1: rb, _2: rc};
		if (_p5._0.ctor === 'Ok') {
			if (_p5._1.ctor === 'Ok') {
				if (_p5._2.ctor === 'Ok') {
					return _elm_lang$core$Result$Ok(
						A3(func, _p5._0._0, _p5._1._0, _p5._2._0));
				} else {
					return _elm_lang$core$Result$Err(_p5._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p5._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p5._0._0);
		}
	});
var _elm_lang$core$Result$map4 = F5(
	function (func, ra, rb, rc, rd) {
		var _p6 = {ctor: '_Tuple4', _0: ra, _1: rb, _2: rc, _3: rd};
		if (_p6._0.ctor === 'Ok') {
			if (_p6._1.ctor === 'Ok') {
				if (_p6._2.ctor === 'Ok') {
					if (_p6._3.ctor === 'Ok') {
						return _elm_lang$core$Result$Ok(
							A4(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0));
					} else {
						return _elm_lang$core$Result$Err(_p6._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p6._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p6._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p6._0._0);
		}
	});
var _elm_lang$core$Result$map5 = F6(
	function (func, ra, rb, rc, rd, re) {
		var _p7 = {ctor: '_Tuple5', _0: ra, _1: rb, _2: rc, _3: rd, _4: re};
		if (_p7._0.ctor === 'Ok') {
			if (_p7._1.ctor === 'Ok') {
				if (_p7._2.ctor === 'Ok') {
					if (_p7._3.ctor === 'Ok') {
						if (_p7._4.ctor === 'Ok') {
							return _elm_lang$core$Result$Ok(
								A5(func, _p7._0._0, _p7._1._0, _p7._2._0, _p7._3._0, _p7._4._0));
						} else {
							return _elm_lang$core$Result$Err(_p7._4._0);
						}
					} else {
						return _elm_lang$core$Result$Err(_p7._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p7._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p7._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p7._0._0);
		}
	});
var _elm_lang$core$Result$mapError = F2(
	function (f, result) {
		var _p8 = result;
		if (_p8.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(_p8._0);
		} else {
			return _elm_lang$core$Result$Err(
				f(_p8._0));
		}
	});
var _elm_lang$core$Result$fromMaybe = F2(
	function (err, maybe) {
		var _p9 = maybe;
		if (_p9.ctor === 'Just') {
			return _elm_lang$core$Result$Ok(_p9._0);
		} else {
			return _elm_lang$core$Result$Err(err);
		}
	});

var _elm_lang$core$String$fromList = _elm_lang$core$Native_String.fromList;
var _elm_lang$core$String$toList = _elm_lang$core$Native_String.toList;
var _elm_lang$core$String$toFloat = _elm_lang$core$Native_String.toFloat;
var _elm_lang$core$String$toInt = _elm_lang$core$Native_String.toInt;
var _elm_lang$core$String$indices = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$indexes = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$endsWith = _elm_lang$core$Native_String.endsWith;
var _elm_lang$core$String$startsWith = _elm_lang$core$Native_String.startsWith;
var _elm_lang$core$String$contains = _elm_lang$core$Native_String.contains;
var _elm_lang$core$String$all = _elm_lang$core$Native_String.all;
var _elm_lang$core$String$any = _elm_lang$core$Native_String.any;
var _elm_lang$core$String$toLower = _elm_lang$core$Native_String.toLower;
var _elm_lang$core$String$toUpper = _elm_lang$core$Native_String.toUpper;
var _elm_lang$core$String$lines = _elm_lang$core$Native_String.lines;
var _elm_lang$core$String$words = _elm_lang$core$Native_String.words;
var _elm_lang$core$String$trimRight = _elm_lang$core$Native_String.trimRight;
var _elm_lang$core$String$trimLeft = _elm_lang$core$Native_String.trimLeft;
var _elm_lang$core$String$trim = _elm_lang$core$Native_String.trim;
var _elm_lang$core$String$padRight = _elm_lang$core$Native_String.padRight;
var _elm_lang$core$String$padLeft = _elm_lang$core$Native_String.padLeft;
var _elm_lang$core$String$pad = _elm_lang$core$Native_String.pad;
var _elm_lang$core$String$dropRight = _elm_lang$core$Native_String.dropRight;
var _elm_lang$core$String$dropLeft = _elm_lang$core$Native_String.dropLeft;
var _elm_lang$core$String$right = _elm_lang$core$Native_String.right;
var _elm_lang$core$String$left = _elm_lang$core$Native_String.left;
var _elm_lang$core$String$slice = _elm_lang$core$Native_String.slice;
var _elm_lang$core$String$repeat = _elm_lang$core$Native_String.repeat;
var _elm_lang$core$String$join = _elm_lang$core$Native_String.join;
var _elm_lang$core$String$split = _elm_lang$core$Native_String.split;
var _elm_lang$core$String$foldr = _elm_lang$core$Native_String.foldr;
var _elm_lang$core$String$foldl = _elm_lang$core$Native_String.foldl;
var _elm_lang$core$String$reverse = _elm_lang$core$Native_String.reverse;
var _elm_lang$core$String$filter = _elm_lang$core$Native_String.filter;
var _elm_lang$core$String$map = _elm_lang$core$Native_String.map;
var _elm_lang$core$String$length = _elm_lang$core$Native_String.length;
var _elm_lang$core$String$concat = _elm_lang$core$Native_String.concat;
var _elm_lang$core$String$append = _elm_lang$core$Native_String.append;
var _elm_lang$core$String$uncons = _elm_lang$core$Native_String.uncons;
var _elm_lang$core$String$cons = _elm_lang$core$Native_String.cons;
var _elm_lang$core$String$fromChar = function ($char) {
	return A2(_elm_lang$core$String$cons, $char, '');
};
var _elm_lang$core$String$isEmpty = _elm_lang$core$Native_String.isEmpty;

var _elm_lang$core$Dict$foldr = F3(
	function (f, acc, t) {
		foldr:
		while (true) {
			var _p0 = t;
			if (_p0.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v1 = f,
					_v2 = A3(
					f,
					_p0._1,
					_p0._2,
					A3(_elm_lang$core$Dict$foldr, f, acc, _p0._4)),
					_v3 = _p0._3;
				f = _v1;
				acc = _v2;
				t = _v3;
				continue foldr;
			}
		}
	});
var _elm_lang$core$Dict$keys = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return {ctor: '::', _0: key, _1: keyList};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$values = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return {ctor: '::', _0: value, _1: valueList};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$toList = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: key, _1: value},
					_1: list
				};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$foldl = F3(
	function (f, acc, dict) {
		foldl:
		while (true) {
			var _p1 = dict;
			if (_p1.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v5 = f,
					_v6 = A3(
					f,
					_p1._1,
					_p1._2,
					A3(_elm_lang$core$Dict$foldl, f, acc, _p1._3)),
					_v7 = _p1._4;
				f = _v5;
				acc = _v6;
				dict = _v7;
				continue foldl;
			}
		}
	});
var _elm_lang$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _p2) {
				stepState:
				while (true) {
					var _p3 = _p2;
					var _p9 = _p3._1;
					var _p8 = _p3._0;
					var _p4 = _p8;
					if (_p4.ctor === '[]') {
						return {
							ctor: '_Tuple2',
							_0: _p8,
							_1: A3(rightStep, rKey, rValue, _p9)
						};
					} else {
						var _p7 = _p4._1;
						var _p6 = _p4._0._1;
						var _p5 = _p4._0._0;
						if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) < 0) {
							var _v10 = rKey,
								_v11 = rValue,
								_v12 = {
								ctor: '_Tuple2',
								_0: _p7,
								_1: A3(leftStep, _p5, _p6, _p9)
							};
							rKey = _v10;
							rValue = _v11;
							_p2 = _v12;
							continue stepState;
						} else {
							if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) > 0) {
								return {
									ctor: '_Tuple2',
									_0: _p8,
									_1: A3(rightStep, rKey, rValue, _p9)
								};
							} else {
								return {
									ctor: '_Tuple2',
									_0: _p7,
									_1: A4(bothStep, _p5, _p6, rValue, _p9)
								};
							}
						}
					}
				}
			});
		var _p10 = A3(
			_elm_lang$core$Dict$foldl,
			stepState,
			{
				ctor: '_Tuple2',
				_0: _elm_lang$core$Dict$toList(leftDict),
				_1: initialResult
			},
			rightDict);
		var leftovers = _p10._0;
		var intermediateResult = _p10._1;
		return A3(
			_elm_lang$core$List$foldl,
			F2(
				function (_p11, result) {
					var _p12 = _p11;
					return A3(leftStep, _p12._0, _p12._1, result);
				}),
			intermediateResult,
			leftovers);
	});
var _elm_lang$core$Dict$reportRemBug = F4(
	function (msg, c, lgot, rgot) {
		return _elm_lang$core$Native_Debug.crash(
			_elm_lang$core$String$concat(
				{
					ctor: '::',
					_0: 'Internal red-black tree invariant violated, expected ',
					_1: {
						ctor: '::',
						_0: msg,
						_1: {
							ctor: '::',
							_0: ' and got ',
							_1: {
								ctor: '::',
								_0: _elm_lang$core$Basics$toString(c),
								_1: {
									ctor: '::',
									_0: '/',
									_1: {
										ctor: '::',
										_0: lgot,
										_1: {
											ctor: '::',
											_0: '/',
											_1: {
												ctor: '::',
												_0: rgot,
												_1: {
													ctor: '::',
													_0: '\nPlease report this bug to <https://github.com/elm-lang/core/issues>',
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}));
	});
var _elm_lang$core$Dict$isBBlack = function (dict) {
	var _p13 = dict;
	_v14_2:
	do {
		if (_p13.ctor === 'RBNode_elm_builtin') {
			if (_p13._0.ctor === 'BBlack') {
				return true;
			} else {
				break _v14_2;
			}
		} else {
			if (_p13._0.ctor === 'LBBlack') {
				return true;
			} else {
				break _v14_2;
			}
		}
	} while(false);
	return false;
};
var _elm_lang$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			var _p14 = dict;
			if (_p14.ctor === 'RBEmpty_elm_builtin') {
				return n;
			} else {
				var _v16 = A2(_elm_lang$core$Dict$sizeHelp, n + 1, _p14._4),
					_v17 = _p14._3;
				n = _v16;
				dict = _v17;
				continue sizeHelp;
			}
		}
	});
var _elm_lang$core$Dict$size = function (dict) {
	return A2(_elm_lang$core$Dict$sizeHelp, 0, dict);
};
var _elm_lang$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			var _p15 = dict;
			if (_p15.ctor === 'RBEmpty_elm_builtin') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				var _p16 = A2(_elm_lang$core$Basics$compare, targetKey, _p15._1);
				switch (_p16.ctor) {
					case 'LT':
						var _v20 = targetKey,
							_v21 = _p15._3;
						targetKey = _v20;
						dict = _v21;
						continue get;
					case 'EQ':
						return _elm_lang$core$Maybe$Just(_p15._2);
					default:
						var _v22 = targetKey,
							_v23 = _p15._4;
						targetKey = _v22;
						dict = _v23;
						continue get;
				}
			}
		}
	});
var _elm_lang$core$Dict$member = F2(
	function (key, dict) {
		var _p17 = A2(_elm_lang$core$Dict$get, key, dict);
		if (_p17.ctor === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var _elm_lang$core$Dict$maxWithDefault = F3(
	function (k, v, r) {
		maxWithDefault:
		while (true) {
			var _p18 = r;
			if (_p18.ctor === 'RBEmpty_elm_builtin') {
				return {ctor: '_Tuple2', _0: k, _1: v};
			} else {
				var _v26 = _p18._1,
					_v27 = _p18._2,
					_v28 = _p18._4;
				k = _v26;
				v = _v27;
				r = _v28;
				continue maxWithDefault;
			}
		}
	});
var _elm_lang$core$Dict$NBlack = {ctor: 'NBlack'};
var _elm_lang$core$Dict$BBlack = {ctor: 'BBlack'};
var _elm_lang$core$Dict$Black = {ctor: 'Black'};
var _elm_lang$core$Dict$blackish = function (t) {
	var _p19 = t;
	if (_p19.ctor === 'RBNode_elm_builtin') {
		var _p20 = _p19._0;
		return _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$Black) || _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$BBlack);
	} else {
		return true;
	}
};
var _elm_lang$core$Dict$Red = {ctor: 'Red'};
var _elm_lang$core$Dict$moreBlack = function (color) {
	var _p21 = color;
	switch (_p21.ctor) {
		case 'Black':
			return _elm_lang$core$Dict$BBlack;
		case 'Red':
			return _elm_lang$core$Dict$Black;
		case 'NBlack':
			return _elm_lang$core$Dict$Red;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a double black node more black!');
	}
};
var _elm_lang$core$Dict$lessBlack = function (color) {
	var _p22 = color;
	switch (_p22.ctor) {
		case 'BBlack':
			return _elm_lang$core$Dict$Black;
		case 'Black':
			return _elm_lang$core$Dict$Red;
		case 'Red':
			return _elm_lang$core$Dict$NBlack;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a negative black node less black!');
	}
};
var _elm_lang$core$Dict$LBBlack = {ctor: 'LBBlack'};
var _elm_lang$core$Dict$LBlack = {ctor: 'LBlack'};
var _elm_lang$core$Dict$RBEmpty_elm_builtin = function (a) {
	return {ctor: 'RBEmpty_elm_builtin', _0: a};
};
var _elm_lang$core$Dict$empty = _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
var _elm_lang$core$Dict$isEmpty = function (dict) {
	return _elm_lang$core$Native_Utils.eq(dict, _elm_lang$core$Dict$empty);
};
var _elm_lang$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {ctor: 'RBNode_elm_builtin', _0: a, _1: b, _2: c, _3: d, _4: e};
	});
var _elm_lang$core$Dict$ensureBlackRoot = function (dict) {
	var _p23 = dict;
	if ((_p23.ctor === 'RBNode_elm_builtin') && (_p23._0.ctor === 'Red')) {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p23._1, _p23._2, _p23._3, _p23._4);
	} else {
		return dict;
	}
};
var _elm_lang$core$Dict$lessBlackTree = function (dict) {
	var _p24 = dict;
	if (_p24.ctor === 'RBNode_elm_builtin') {
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$lessBlack(_p24._0),
			_p24._1,
			_p24._2,
			_p24._3,
			_p24._4);
	} else {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	}
};
var _elm_lang$core$Dict$balancedTree = function (col) {
	return function (xk) {
		return function (xv) {
			return function (yk) {
				return function (yv) {
					return function (zk) {
						return function (zv) {
							return function (a) {
								return function (b) {
									return function (c) {
										return function (d) {
											return A5(
												_elm_lang$core$Dict$RBNode_elm_builtin,
												_elm_lang$core$Dict$lessBlack(col),
												yk,
												yv,
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, xk, xv, a, b),
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, zk, zv, c, d));
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _elm_lang$core$Dict$blacken = function (t) {
	var _p25 = t;
	if (_p25.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p25._1, _p25._2, _p25._3, _p25._4);
	}
};
var _elm_lang$core$Dict$redden = function (t) {
	var _p26 = t;
	if (_p26.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Native_Debug.crash('can\'t make a Leaf red');
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, _p26._1, _p26._2, _p26._3, _p26._4);
	}
};
var _elm_lang$core$Dict$balanceHelp = function (tree) {
	var _p27 = tree;
	_v36_6:
	do {
		_v36_5:
		do {
			_v36_4:
			do {
				_v36_3:
				do {
					_v36_2:
					do {
						_v36_1:
						do {
							_v36_0:
							do {
								if (_p27.ctor === 'RBNode_elm_builtin') {
									if (_p27._3.ctor === 'RBNode_elm_builtin') {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._3._0.ctor) {
												case 'Red':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																		break _v36_2;
																	} else {
																		if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																			break _v36_3;
																		} else {
																			break _v36_6;
																		}
																	}
																}
															}
														case 'NBlack':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																		break _v36_4;
																	} else {
																		break _v36_6;
																	}
																}
															}
														default:
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	break _v36_6;
																}
															}
													}
												case 'NBlack':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v36_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v36_3;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v36_5;
																	} else {
																		break _v36_6;
																	}
																}
															}
														case 'NBlack':
															if (_p27._0.ctor === 'BBlack') {
																if ((((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																	break _v36_4;
																} else {
																	if ((((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v36_5;
																	} else {
																		break _v36_6;
																	}
																}
															} else {
																break _v36_6;
															}
														default:
															if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																break _v36_5;
															} else {
																break _v36_6;
															}
													}
												default:
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v36_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v36_3;
																} else {
																	break _v36_6;
																}
															}
														case 'NBlack':
															if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																break _v36_4;
															} else {
																break _v36_6;
															}
														default:
															break _v36_6;
													}
											}
										} else {
											switch (_p27._3._0.ctor) {
												case 'Red':
													if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
														break _v36_0;
													} else {
														if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
															break _v36_1;
														} else {
															break _v36_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
														break _v36_5;
													} else {
														break _v36_6;
													}
												default:
													break _v36_6;
											}
										}
									} else {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._4._0.ctor) {
												case 'Red':
													if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
														break _v36_2;
													} else {
														if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
															break _v36_3;
														} else {
															break _v36_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
														break _v36_4;
													} else {
														break _v36_6;
													}
												default:
													break _v36_6;
											}
										} else {
											break _v36_6;
										}
									}
								} else {
									break _v36_6;
								}
							} while(false);
							return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._3._1)(_p27._3._3._2)(_p27._3._1)(_p27._3._2)(_p27._1)(_p27._2)(_p27._3._3._3)(_p27._3._3._4)(_p27._3._4)(_p27._4);
						} while(false);
						return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._1)(_p27._3._2)(_p27._3._4._1)(_p27._3._4._2)(_p27._1)(_p27._2)(_p27._3._3)(_p27._3._4._3)(_p27._3._4._4)(_p27._4);
					} while(false);
					return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._3._1)(_p27._4._3._2)(_p27._4._1)(_p27._4._2)(_p27._3)(_p27._4._3._3)(_p27._4._3._4)(_p27._4._4);
				} while(false);
				return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._1)(_p27._4._2)(_p27._4._4._1)(_p27._4._4._2)(_p27._3)(_p27._4._3)(_p27._4._4._3)(_p27._4._4._4);
			} while(false);
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_elm_lang$core$Dict$Black,
				_p27._4._3._1,
				_p27._4._3._2,
				A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3, _p27._4._3._3),
				A5(
					_elm_lang$core$Dict$balance,
					_elm_lang$core$Dict$Black,
					_p27._4._1,
					_p27._4._2,
					_p27._4._3._4,
					_elm_lang$core$Dict$redden(_p27._4._4)));
		} while(false);
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$Black,
			_p27._3._4._1,
			_p27._3._4._2,
			A5(
				_elm_lang$core$Dict$balance,
				_elm_lang$core$Dict$Black,
				_p27._3._1,
				_p27._3._2,
				_elm_lang$core$Dict$redden(_p27._3._3),
				_p27._3._4._3),
			A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3._4._4, _p27._4));
	} while(false);
	return tree;
};
var _elm_lang$core$Dict$balance = F5(
	function (c, k, v, l, r) {
		var tree = A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
		return _elm_lang$core$Dict$blackish(tree) ? _elm_lang$core$Dict$balanceHelp(tree) : tree;
	});
var _elm_lang$core$Dict$bubble = F5(
	function (c, k, v, l, r) {
		return (_elm_lang$core$Dict$isBBlack(l) || _elm_lang$core$Dict$isBBlack(r)) ? A5(
			_elm_lang$core$Dict$balance,
			_elm_lang$core$Dict$moreBlack(c),
			k,
			v,
			_elm_lang$core$Dict$lessBlackTree(l),
			_elm_lang$core$Dict$lessBlackTree(r)) : A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
	});
var _elm_lang$core$Dict$removeMax = F5(
	function (c, k, v, l, r) {
		var _p28 = r;
		if (_p28.ctor === 'RBEmpty_elm_builtin') {
			return A3(_elm_lang$core$Dict$rem, c, l, r);
		} else {
			return A5(
				_elm_lang$core$Dict$bubble,
				c,
				k,
				v,
				l,
				A5(_elm_lang$core$Dict$removeMax, _p28._0, _p28._1, _p28._2, _p28._3, _p28._4));
		}
	});
var _elm_lang$core$Dict$rem = F3(
	function (color, left, right) {
		var _p29 = {ctor: '_Tuple2', _0: left, _1: right};
		if (_p29._0.ctor === 'RBEmpty_elm_builtin') {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p30 = color;
				switch (_p30.ctor) {
					case 'Red':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
					case 'Black':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBBlack);
					default:
						return _elm_lang$core$Native_Debug.crash('cannot have bblack or nblack nodes at this point');
				}
			} else {
				var _p33 = _p29._1._0;
				var _p32 = _p29._0._0;
				var _p31 = {ctor: '_Tuple3', _0: color, _1: _p32, _2: _p33};
				if ((((_p31.ctor === '_Tuple3') && (_p31._0.ctor === 'Black')) && (_p31._1.ctor === 'LBlack')) && (_p31._2.ctor === 'Red')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._1._1, _p29._1._2, _p29._1._3, _p29._1._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/LBlack/Red',
						color,
						_elm_lang$core$Basics$toString(_p32),
						_elm_lang$core$Basics$toString(_p33));
				}
			}
		} else {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p36 = _p29._1._0;
				var _p35 = _p29._0._0;
				var _p34 = {ctor: '_Tuple3', _0: color, _1: _p35, _2: _p36};
				if ((((_p34.ctor === '_Tuple3') && (_p34._0.ctor === 'Black')) && (_p34._1.ctor === 'Red')) && (_p34._2.ctor === 'LBlack')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._0._1, _p29._0._2, _p29._0._3, _p29._0._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/Red/LBlack',
						color,
						_elm_lang$core$Basics$toString(_p35),
						_elm_lang$core$Basics$toString(_p36));
				}
			} else {
				var _p40 = _p29._0._2;
				var _p39 = _p29._0._4;
				var _p38 = _p29._0._1;
				var newLeft = A5(_elm_lang$core$Dict$removeMax, _p29._0._0, _p38, _p40, _p29._0._3, _p39);
				var _p37 = A3(_elm_lang$core$Dict$maxWithDefault, _p38, _p40, _p39);
				var k = _p37._0;
				var v = _p37._1;
				return A5(_elm_lang$core$Dict$bubble, color, k, v, newLeft, right);
			}
		}
	});
var _elm_lang$core$Dict$map = F2(
	function (f, dict) {
		var _p41 = dict;
		if (_p41.ctor === 'RBEmpty_elm_builtin') {
			return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
		} else {
			var _p42 = _p41._1;
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_p41._0,
				_p42,
				A2(f, _p42, _p41._2),
				A2(_elm_lang$core$Dict$map, f, _p41._3),
				A2(_elm_lang$core$Dict$map, f, _p41._4));
		}
	});
var _elm_lang$core$Dict$Same = {ctor: 'Same'};
var _elm_lang$core$Dict$Remove = {ctor: 'Remove'};
var _elm_lang$core$Dict$Insert = {ctor: 'Insert'};
var _elm_lang$core$Dict$update = F3(
	function (k, alter, dict) {
		var up = function (dict) {
			var _p43 = dict;
			if (_p43.ctor === 'RBEmpty_elm_builtin') {
				var _p44 = alter(_elm_lang$core$Maybe$Nothing);
				if (_p44.ctor === 'Nothing') {
					return {ctor: '_Tuple2', _0: _elm_lang$core$Dict$Same, _1: _elm_lang$core$Dict$empty};
				} else {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Dict$Insert,
						_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, k, _p44._0, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty)
					};
				}
			} else {
				var _p55 = _p43._2;
				var _p54 = _p43._4;
				var _p53 = _p43._3;
				var _p52 = _p43._1;
				var _p51 = _p43._0;
				var _p45 = A2(_elm_lang$core$Basics$compare, k, _p52);
				switch (_p45.ctor) {
					case 'EQ':
						var _p46 = alter(
							_elm_lang$core$Maybe$Just(_p55));
						if (_p46.ctor === 'Nothing') {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Remove,
								_1: A3(_elm_lang$core$Dict$rem, _p51, _p53, _p54)
							};
						} else {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Same,
								_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p46._0, _p53, _p54)
							};
						}
					case 'LT':
						var _p47 = up(_p53);
						var flag = _p47._0;
						var newLeft = _p47._1;
						var _p48 = flag;
						switch (_p48.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, newLeft, _p54)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, newLeft, _p54)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, newLeft, _p54)
								};
						}
					default:
						var _p49 = up(_p54);
						var flag = _p49._0;
						var newRight = _p49._1;
						var _p50 = flag;
						switch (_p50.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, _p53, newRight)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, _p53, newRight)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, _p53, newRight)
								};
						}
				}
			}
		};
		var _p56 = up(dict);
		var flag = _p56._0;
		var updatedDict = _p56._1;
		var _p57 = flag;
		switch (_p57.ctor) {
			case 'Same':
				return updatedDict;
			case 'Insert':
				return _elm_lang$core$Dict$ensureBlackRoot(updatedDict);
			default:
				return _elm_lang$core$Dict$blacken(updatedDict);
		}
	});
var _elm_lang$core$Dict$insert = F3(
	function (key, value, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(
				_elm_lang$core$Maybe$Just(value)),
			dict);
	});
var _elm_lang$core$Dict$singleton = F2(
	function (key, value) {
		return A3(_elm_lang$core$Dict$insert, key, value, _elm_lang$core$Dict$empty);
	});
var _elm_lang$core$Dict$union = F2(
	function (t1, t2) {
		return A3(_elm_lang$core$Dict$foldl, _elm_lang$core$Dict$insert, t2, t1);
	});
var _elm_lang$core$Dict$filter = F2(
	function (predicate, dictionary) {
		var add = F3(
			function (key, value, dict) {
				return A2(predicate, key, value) ? A3(_elm_lang$core$Dict$insert, key, value, dict) : dict;
			});
		return A3(_elm_lang$core$Dict$foldl, add, _elm_lang$core$Dict$empty, dictionary);
	});
var _elm_lang$core$Dict$intersect = F2(
	function (t1, t2) {
		return A2(
			_elm_lang$core$Dict$filter,
			F2(
				function (k, _p58) {
					return A2(_elm_lang$core$Dict$member, k, t2);
				}),
			t1);
	});
var _elm_lang$core$Dict$partition = F2(
	function (predicate, dict) {
		var add = F3(
			function (key, value, _p59) {
				var _p60 = _p59;
				var _p62 = _p60._1;
				var _p61 = _p60._0;
				return A2(predicate, key, value) ? {
					ctor: '_Tuple2',
					_0: A3(_elm_lang$core$Dict$insert, key, value, _p61),
					_1: _p62
				} : {
					ctor: '_Tuple2',
					_0: _p61,
					_1: A3(_elm_lang$core$Dict$insert, key, value, _p62)
				};
			});
		return A3(
			_elm_lang$core$Dict$foldl,
			add,
			{ctor: '_Tuple2', _0: _elm_lang$core$Dict$empty, _1: _elm_lang$core$Dict$empty},
			dict);
	});
var _elm_lang$core$Dict$fromList = function (assocs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p63, dict) {
				var _p64 = _p63;
				return A3(_elm_lang$core$Dict$insert, _p64._0, _p64._1, dict);
			}),
		_elm_lang$core$Dict$empty,
		assocs);
};
var _elm_lang$core$Dict$remove = F2(
	function (key, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(_elm_lang$core$Maybe$Nothing),
			dict);
	});
var _elm_lang$core$Dict$diff = F2(
	function (t1, t2) {
		return A3(
			_elm_lang$core$Dict$foldl,
			F3(
				function (k, v, t) {
					return A2(_elm_lang$core$Dict$remove, k, t);
				}),
			t1,
			t2);
	});

//import Maybe, Native.Array, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_Json = function() {


// CORE DECODERS

function succeed(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'succeed',
		msg: msg
	};
}

function fail(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'fail',
		msg: msg
	};
}

function decodePrimitive(tag)
{
	return {
		ctor: '<decoder>',
		tag: tag
	};
}

function decodeContainer(tag, decoder)
{
	return {
		ctor: '<decoder>',
		tag: tag,
		decoder: decoder
	};
}

function decodeNull(value)
{
	return {
		ctor: '<decoder>',
		tag: 'null',
		value: value
	};
}

function decodeField(field, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'field',
		field: field,
		decoder: decoder
	};
}

function decodeIndex(index, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'index',
		index: index,
		decoder: decoder
	};
}

function decodeKeyValuePairs(decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'key-value',
		decoder: decoder
	};
}

function mapMany(f, decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'map-many',
		func: f,
		decoders: decoders
	};
}

function andThen(callback, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'andThen',
		decoder: decoder,
		callback: callback
	};
}

function oneOf(decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'oneOf',
		decoders: decoders
	};
}


// DECODING OBJECTS

function map1(f, d1)
{
	return mapMany(f, [d1]);
}

function map2(f, d1, d2)
{
	return mapMany(f, [d1, d2]);
}

function map3(f, d1, d2, d3)
{
	return mapMany(f, [d1, d2, d3]);
}

function map4(f, d1, d2, d3, d4)
{
	return mapMany(f, [d1, d2, d3, d4]);
}

function map5(f, d1, d2, d3, d4, d5)
{
	return mapMany(f, [d1, d2, d3, d4, d5]);
}

function map6(f, d1, d2, d3, d4, d5, d6)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6]);
}

function map7(f, d1, d2, d3, d4, d5, d6, d7)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
}

function map8(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
}


// DECODE HELPERS

function ok(value)
{
	return { tag: 'ok', value: value };
}

function badPrimitive(type, value)
{
	return { tag: 'primitive', type: type, value: value };
}

function badIndex(index, nestedProblems)
{
	return { tag: 'index', index: index, rest: nestedProblems };
}

function badField(field, nestedProblems)
{
	return { tag: 'field', field: field, rest: nestedProblems };
}

function badIndex(index, nestedProblems)
{
	return { tag: 'index', index: index, rest: nestedProblems };
}

function badOneOf(problems)
{
	return { tag: 'oneOf', problems: problems };
}

function bad(msg)
{
	return { tag: 'fail', msg: msg };
}

function badToString(problem)
{
	var context = '_';
	while (problem)
	{
		switch (problem.tag)
		{
			case 'primitive':
				return 'Expecting ' + problem.type
					+ (context === '_' ? '' : ' at ' + context)
					+ ' but instead got: ' + jsToString(problem.value);

			case 'index':
				context += '[' + problem.index + ']';
				problem = problem.rest;
				break;

			case 'field':
				context += '.' + problem.field;
				problem = problem.rest;
				break;

			case 'oneOf':
				var problems = problem.problems;
				for (var i = 0; i < problems.length; i++)
				{
					problems[i] = badToString(problems[i]);
				}
				return 'I ran into the following problems'
					+ (context === '_' ? '' : ' at ' + context)
					+ ':\n\n' + problems.join('\n');

			case 'fail':
				return 'I ran into a `fail` decoder'
					+ (context === '_' ? '' : ' at ' + context)
					+ ': ' + problem.msg;
		}
	}
}

function jsToString(value)
{
	return value === undefined
		? 'undefined'
		: JSON.stringify(value);
}


// DECODE

function runOnString(decoder, string)
{
	var json;
	try
	{
		json = JSON.parse(string);
	}
	catch (e)
	{
		return _elm_lang$core$Result$Err('Given an invalid JSON: ' + e.message);
	}
	return run(decoder, json);
}

function run(decoder, value)
{
	var result = runHelp(decoder, value);
	return (result.tag === 'ok')
		? _elm_lang$core$Result$Ok(result.value)
		: _elm_lang$core$Result$Err(badToString(result));
}

function runHelp(decoder, value)
{
	switch (decoder.tag)
	{
		case 'bool':
			return (typeof value === 'boolean')
				? ok(value)
				: badPrimitive('a Bool', value);

		case 'int':
			if (typeof value !== 'number') {
				return badPrimitive('an Int', value);
			}

			if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
				return ok(value);
			}

			if (isFinite(value) && !(value % 1)) {
				return ok(value);
			}

			return badPrimitive('an Int', value);

		case 'float':
			return (typeof value === 'number')
				? ok(value)
				: badPrimitive('a Float', value);

		case 'string':
			return (typeof value === 'string')
				? ok(value)
				: (value instanceof String)
					? ok(value + '')
					: badPrimitive('a String', value);

		case 'null':
			return (value === null)
				? ok(decoder.value)
				: badPrimitive('null', value);

		case 'value':
			return ok(value);

		case 'list':
			if (!(value instanceof Array))
			{
				return badPrimitive('a List', value);
			}

			var list = _elm_lang$core$Native_List.Nil;
			for (var i = value.length; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result)
				}
				list = _elm_lang$core$Native_List.Cons(result.value, list);
			}
			return ok(list);

		case 'array':
			if (!(value instanceof Array))
			{
				return badPrimitive('an Array', value);
			}

			var len = value.length;
			var array = new Array(len);
			for (var i = len; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result);
				}
				array[i] = result.value;
			}
			return ok(_elm_lang$core$Native_Array.fromJSArray(array));

		case 'maybe':
			var result = runHelp(decoder.decoder, value);
			return (result.tag === 'ok')
				? ok(_elm_lang$core$Maybe$Just(result.value))
				: ok(_elm_lang$core$Maybe$Nothing);

		case 'field':
			var field = decoder.field;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return badPrimitive('an object with a field named `' + field + '`', value);
			}

			var result = runHelp(decoder.decoder, value[field]);
			return (result.tag === 'ok') ? result : badField(field, result);

		case 'index':
			var index = decoder.index;
			if (!(value instanceof Array))
			{
				return badPrimitive('an array', value);
			}
			if (index >= value.length)
			{
				return badPrimitive('a longer array. Need index ' + index + ' but there are only ' + value.length + ' entries', value);
			}

			var result = runHelp(decoder.decoder, value[index]);
			return (result.tag === 'ok') ? result : badIndex(index, result);

		case 'key-value':
			if (typeof value !== 'object' || value === null || value instanceof Array)
			{
				return badPrimitive('an object', value);
			}

			var keyValuePairs = _elm_lang$core$Native_List.Nil;
			for (var key in value)
			{
				var result = runHelp(decoder.decoder, value[key]);
				if (result.tag !== 'ok')
				{
					return badField(key, result);
				}
				var pair = _elm_lang$core$Native_Utils.Tuple2(key, result.value);
				keyValuePairs = _elm_lang$core$Native_List.Cons(pair, keyValuePairs);
			}
			return ok(keyValuePairs);

		case 'map-many':
			var answer = decoder.func;
			var decoders = decoder.decoders;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = runHelp(decoders[i], value);
				if (result.tag !== 'ok')
				{
					return result;
				}
				answer = answer(result.value);
			}
			return ok(answer);

		case 'andThen':
			var result = runHelp(decoder.decoder, value);
			return (result.tag !== 'ok')
				? result
				: runHelp(decoder.callback(result.value), value);

		case 'oneOf':
			var errors = [];
			var temp = decoder.decoders;
			while (temp.ctor !== '[]')
			{
				var result = runHelp(temp._0, value);

				if (result.tag === 'ok')
				{
					return result;
				}

				errors.push(result);

				temp = temp._1;
			}
			return badOneOf(errors);

		case 'fail':
			return bad(decoder.msg);

		case 'succeed':
			return ok(decoder.msg);
	}
}


// EQUALITY

function equality(a, b)
{
	if (a === b)
	{
		return true;
	}

	if (a.tag !== b.tag)
	{
		return false;
	}

	switch (a.tag)
	{
		case 'succeed':
		case 'fail':
			return a.msg === b.msg;

		case 'bool':
		case 'int':
		case 'float':
		case 'string':
		case 'value':
			return true;

		case 'null':
			return a.value === b.value;

		case 'list':
		case 'array':
		case 'maybe':
		case 'key-value':
			return equality(a.decoder, b.decoder);

		case 'field':
			return a.field === b.field && equality(a.decoder, b.decoder);

		case 'index':
			return a.index === b.index && equality(a.decoder, b.decoder);

		case 'map-many':
			if (a.func !== b.func)
			{
				return false;
			}
			return listEquality(a.decoders, b.decoders);

		case 'andThen':
			return a.callback === b.callback && equality(a.decoder, b.decoder);

		case 'oneOf':
			return listEquality(a.decoders, b.decoders);
	}
}

function listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

function encode(indentLevel, value)
{
	return JSON.stringify(value, null, indentLevel);
}

function identity(value)
{
	return value;
}

function encodeObject(keyValuePairs)
{
	var obj = {};
	while (keyValuePairs.ctor !== '[]')
	{
		var pair = keyValuePairs._0;
		obj[pair._0] = pair._1;
		keyValuePairs = keyValuePairs._1;
	}
	return obj;
}

return {
	encode: F2(encode),
	runOnString: F2(runOnString),
	run: F2(run),

	decodeNull: decodeNull,
	decodePrimitive: decodePrimitive,
	decodeContainer: F2(decodeContainer),

	decodeField: F2(decodeField),
	decodeIndex: F2(decodeIndex),

	map1: F2(map1),
	map2: F3(map2),
	map3: F4(map3),
	map4: F5(map4),
	map5: F6(map5),
	map6: F7(map6),
	map7: F8(map7),
	map8: F9(map8),
	decodeKeyValuePairs: decodeKeyValuePairs,

	andThen: F2(andThen),
	fail: fail,
	succeed: succeed,
	oneOf: oneOf,

	identity: identity,
	encodeNull: null,
	encodeArray: _elm_lang$core$Native_Array.toJSArray,
	encodeList: _elm_lang$core$Native_List.toArray,
	encodeObject: encodeObject,

	equality: equality
};

}();

var _elm_lang$core$Json_Encode$list = _elm_lang$core$Native_Json.encodeList;
var _elm_lang$core$Json_Encode$array = _elm_lang$core$Native_Json.encodeArray;
var _elm_lang$core$Json_Encode$object = _elm_lang$core$Native_Json.encodeObject;
var _elm_lang$core$Json_Encode$null = _elm_lang$core$Native_Json.encodeNull;
var _elm_lang$core$Json_Encode$bool = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$float = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$int = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$string = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$encode = _elm_lang$core$Native_Json.encode;
var _elm_lang$core$Json_Encode$Value = {ctor: 'Value'};

var _elm_lang$core$Json_Decode$null = _elm_lang$core$Native_Json.decodeNull;
var _elm_lang$core$Json_Decode$value = _elm_lang$core$Native_Json.decodePrimitive('value');
var _elm_lang$core$Json_Decode$andThen = _elm_lang$core$Native_Json.andThen;
var _elm_lang$core$Json_Decode$fail = _elm_lang$core$Native_Json.fail;
var _elm_lang$core$Json_Decode$succeed = _elm_lang$core$Native_Json.succeed;
var _elm_lang$core$Json_Decode$lazy = function (thunk) {
	return A2(
		_elm_lang$core$Json_Decode$andThen,
		thunk,
		_elm_lang$core$Json_Decode$succeed(
			{ctor: '_Tuple0'}));
};
var _elm_lang$core$Json_Decode$decodeValue = _elm_lang$core$Native_Json.run;
var _elm_lang$core$Json_Decode$decodeString = _elm_lang$core$Native_Json.runOnString;
var _elm_lang$core$Json_Decode$map8 = _elm_lang$core$Native_Json.map8;
var _elm_lang$core$Json_Decode$map7 = _elm_lang$core$Native_Json.map7;
var _elm_lang$core$Json_Decode$map6 = _elm_lang$core$Native_Json.map6;
var _elm_lang$core$Json_Decode$map5 = _elm_lang$core$Native_Json.map5;
var _elm_lang$core$Json_Decode$map4 = _elm_lang$core$Native_Json.map4;
var _elm_lang$core$Json_Decode$map3 = _elm_lang$core$Native_Json.map3;
var _elm_lang$core$Json_Decode$map2 = _elm_lang$core$Native_Json.map2;
var _elm_lang$core$Json_Decode$map = _elm_lang$core$Native_Json.map1;
var _elm_lang$core$Json_Decode$oneOf = _elm_lang$core$Native_Json.oneOf;
var _elm_lang$core$Json_Decode$maybe = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'maybe', decoder);
};
var _elm_lang$core$Json_Decode$index = _elm_lang$core$Native_Json.decodeIndex;
var _elm_lang$core$Json_Decode$field = _elm_lang$core$Native_Json.decodeField;
var _elm_lang$core$Json_Decode$at = F2(
	function (fields, decoder) {
		return A3(_elm_lang$core$List$foldr, _elm_lang$core$Json_Decode$field, decoder, fields);
	});
var _elm_lang$core$Json_Decode$keyValuePairs = _elm_lang$core$Native_Json.decodeKeyValuePairs;
var _elm_lang$core$Json_Decode$dict = function (decoder) {
	return A2(
		_elm_lang$core$Json_Decode$map,
		_elm_lang$core$Dict$fromList,
		_elm_lang$core$Json_Decode$keyValuePairs(decoder));
};
var _elm_lang$core$Json_Decode$array = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'array', decoder);
};
var _elm_lang$core$Json_Decode$list = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'list', decoder);
};
var _elm_lang$core$Json_Decode$nullable = function (decoder) {
	return _elm_lang$core$Json_Decode$oneOf(
		{
			ctor: '::',
			_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
			_1: {
				ctor: '::',
				_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, decoder),
				_1: {ctor: '[]'}
			}
		});
};
var _elm_lang$core$Json_Decode$float = _elm_lang$core$Native_Json.decodePrimitive('float');
var _elm_lang$core$Json_Decode$int = _elm_lang$core$Native_Json.decodePrimitive('int');
var _elm_lang$core$Json_Decode$bool = _elm_lang$core$Native_Json.decodePrimitive('bool');
var _elm_lang$core$Json_Decode$string = _elm_lang$core$Native_Json.decodePrimitive('string');
var _elm_lang$core$Json_Decode$Decoder = {ctor: 'Decoder'};

var _elm_lang$core$Debug$crash = _elm_lang$core$Native_Debug.crash;
var _elm_lang$core$Debug$log = _elm_lang$core$Native_Debug.log;

var _elm_lang$core$Tuple$mapSecond = F2(
	function (func, _p0) {
		var _p1 = _p0;
		return {
			ctor: '_Tuple2',
			_0: _p1._0,
			_1: func(_p1._1)
		};
	});
var _elm_lang$core$Tuple$mapFirst = F2(
	function (func, _p2) {
		var _p3 = _p2;
		return {
			ctor: '_Tuple2',
			_0: func(_p3._0),
			_1: _p3._1
		};
	});
var _elm_lang$core$Tuple$second = function (_p4) {
	var _p5 = _p4;
	return _p5._1;
};
var _elm_lang$core$Tuple$first = function (_p6) {
	var _p7 = _p6;
	return _p7._0;
};

//import //

var _elm_lang$core$Native_Platform = function() {


// PROGRAMS

function program(impl)
{
	return function(flagDecoder)
	{
		return function(object, moduleName)
		{
			object['worker'] = function worker(flags)
			{
				if (typeof flags !== 'undefined')
				{
					throw new Error(
						'The `' + moduleName + '` module does not need flags.\n'
						+ 'Call ' + moduleName + '.worker() with no arguments and you should be all set!'
					);
				}

				return initialize(
					impl.init,
					impl.update,
					impl.subscriptions,
					renderer
				);
			};
		};
	};
}

function programWithFlags(impl)
{
	return function(flagDecoder)
	{
		return function(object, moduleName)
		{
			object['worker'] = function worker(flags)
			{
				if (typeof flagDecoder === 'undefined')
				{
					throw new Error(
						'Are you trying to sneak a Never value into Elm? Trickster!\n'
						+ 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n'
						+ 'Use `program` instead if you do not want flags.'
					);
				}

				var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
				if (result.ctor === 'Err')
				{
					throw new Error(
						moduleName + '.worker(...) was called with an unexpected argument.\n'
						+ 'I tried to convert it to an Elm value, but ran into this problem:\n\n'
						+ result._0
					);
				}

				return initialize(
					impl.init(result._0),
					impl.update,
					impl.subscriptions,
					renderer
				);
			};
		};
	};
}

function renderer(enqueue, _)
{
	return function(_) {};
}


// HTML TO PROGRAM

function htmlToProgram(vnode)
{
	var emptyBag = batch(_elm_lang$core$Native_List.Nil);
	var noChange = _elm_lang$core$Native_Utils.Tuple2(
		_elm_lang$core$Native_Utils.Tuple0,
		emptyBag
	);

	return _elm_lang$virtual_dom$VirtualDom$program({
		init: noChange,
		view: function(model) { return main; },
		update: F2(function(msg, model) { return noChange; }),
		subscriptions: function (model) { return emptyBag; }
	});
}


// INITIALIZE A PROGRAM

function initialize(init, update, subscriptions, renderer)
{
	// ambient state
	var managers = {};
	var updateView;

	// init and update state in main process
	var initApp = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
		var model = init._0;
		updateView = renderer(enqueue, model);
		var cmds = init._1;
		var subs = subscriptions(model);
		dispatchEffects(managers, cmds, subs);
		callback(_elm_lang$core$Native_Scheduler.succeed(model));
	});

	function onMessage(msg, model)
	{
		return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
			var results = A2(update, msg, model);
			model = results._0;
			updateView(model);
			var cmds = results._1;
			var subs = subscriptions(model);
			dispatchEffects(managers, cmds, subs);
			callback(_elm_lang$core$Native_Scheduler.succeed(model));
		});
	}

	var mainProcess = spawnLoop(initApp, onMessage);

	function enqueue(msg)
	{
		_elm_lang$core$Native_Scheduler.rawSend(mainProcess, msg);
	}

	var ports = setupEffects(managers, enqueue);

	return ports ? { ports: ports } : {};
}


// EFFECT MANAGERS

var effectManagers = {};

function setupEffects(managers, callback)
{
	var ports;

	// setup all necessary effect managers
	for (var key in effectManagers)
	{
		var manager = effectManagers[key];

		if (manager.isForeign)
		{
			ports = ports || {};
			ports[key] = manager.tag === 'cmd'
				? setupOutgoingPort(key)
				: setupIncomingPort(key, callback);
		}

		managers[key] = makeManager(manager, callback);
	}

	return ports;
}

function makeManager(info, callback)
{
	var router = {
		main: callback,
		self: undefined
	};

	var tag = info.tag;
	var onEffects = info.onEffects;
	var onSelfMsg = info.onSelfMsg;

	function onMessage(msg, state)
	{
		if (msg.ctor === 'self')
		{
			return A3(onSelfMsg, router, msg._0, state);
		}

		var fx = msg._0;
		switch (tag)
		{
			case 'cmd':
				return A3(onEffects, router, fx.cmds, state);

			case 'sub':
				return A3(onEffects, router, fx.subs, state);

			case 'fx':
				return A4(onEffects, router, fx.cmds, fx.subs, state);
		}
	}

	var process = spawnLoop(info.init, onMessage);
	router.self = process;
	return process;
}

function sendToApp(router, msg)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		router.main(msg);
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sendToSelf(router, msg)
{
	return A2(_elm_lang$core$Native_Scheduler.send, router.self, {
		ctor: 'self',
		_0: msg
	});
}


// HELPER for STATEFUL LOOPS

function spawnLoop(init, onMessage)
{
	var andThen = _elm_lang$core$Native_Scheduler.andThen;

	function loop(state)
	{
		var handleMsg = _elm_lang$core$Native_Scheduler.receive(function(msg) {
			return onMessage(msg, state);
		});
		return A2(andThen, loop, handleMsg);
	}

	var task = A2(andThen, loop, init);

	return _elm_lang$core$Native_Scheduler.rawSpawn(task);
}


// BAGS

function leaf(home)
{
	return function(value)
	{
		return {
			type: 'leaf',
			home: home,
			value: value
		};
	};
}

function batch(list)
{
	return {
		type: 'node',
		branches: list
	};
}

function map(tagger, bag)
{
	return {
		type: 'map',
		tagger: tagger,
		tree: bag
	}
}


// PIPE BAGS INTO EFFECT MANAGERS

function dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	gatherEffects(true, cmdBag, effectsDict, null);
	gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		var fx = home in effectsDict
			? effectsDict[home]
			: {
				cmds: _elm_lang$core$Native_List.Nil,
				subs: _elm_lang$core$Native_List.Nil
			};

		_elm_lang$core$Native_Scheduler.rawSend(managers[home], { ctor: 'fx', _0: fx });
	}
}

function gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.type)
	{
		case 'leaf':
			var home = bag.home;
			var effect = toEffect(isCmd, home, taggers, bag.value);
			effectsDict[home] = insert(isCmd, effect, effectsDict[home]);
			return;

		case 'node':
			var list = bag.branches;
			while (list.ctor !== '[]')
			{
				gatherEffects(isCmd, list._0, effectsDict, taggers);
				list = list._1;
			}
			return;

		case 'map':
			gatherEffects(isCmd, bag.tree, effectsDict, {
				tagger: bag.tagger,
				rest: taggers
			});
			return;
	}
}

function toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		var temp = taggers;
		while (temp)
		{
			x = temp.tagger(x);
			temp = temp.rest;
		}
		return x;
	}

	var map = isCmd
		? effectManagers[home].cmdMap
		: effectManagers[home].subMap;

	return A2(map, applyTaggers, value)
}

function insert(isCmd, newEffect, effects)
{
	effects = effects || {
		cmds: _elm_lang$core$Native_List.Nil,
		subs: _elm_lang$core$Native_List.Nil
	};
	if (isCmd)
	{
		effects.cmds = _elm_lang$core$Native_List.Cons(newEffect, effects.cmds);
		return effects;
	}
	effects.subs = _elm_lang$core$Native_List.Cons(newEffect, effects.subs);
	return effects;
}


// PORTS

function checkPortName(name)
{
	if (name in effectManagers)
	{
		throw new Error('There can only be one port named `' + name + '`, but your program has multiple.');
	}
}


// OUTGOING PORTS

function outgoingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'cmd',
		cmdMap: outgoingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var outgoingPortMap = F2(function cmdMap(tagger, value) {
	return value;
});

function setupOutgoingPort(name)
{
	var subs = [];
	var converter = effectManagers[name].converter;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function onEffects(router, cmdList, state)
	{
		while (cmdList.ctor !== '[]')
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = converter(cmdList._0);
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
			cmdList = cmdList._1;
		}
		return init;
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}


// INCOMING PORTS

function incomingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'sub',
		subMap: incomingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var incomingPortMap = F2(function subMap(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});

function setupIncomingPort(name, callback)
{
	var sentBeforeInit = [];
	var subs = _elm_lang$core$Native_List.Nil;
	var converter = effectManagers[name].converter;
	var currentOnEffects = preInitOnEffects;
	var currentSend = preInitSend;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function preInitOnEffects(router, subList, state)
	{
		var postInitResult = postInitOnEffects(router, subList, state);

		for(var i = 0; i < sentBeforeInit.length; i++)
		{
			postInitSend(sentBeforeInit[i]);
		}

		sentBeforeInit = null; // to release objects held in queue
		currentSend = postInitSend;
		currentOnEffects = postInitOnEffects;
		return postInitResult;
	}

	function postInitOnEffects(router, subList, state)
	{
		subs = subList;
		return init;
	}

	function onEffects(router, subList, state)
	{
		return currentOnEffects(router, subList, state);
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

	// PUBLIC API

	function preInitSend(value)
	{
		sentBeforeInit.push(value);
	}

	function postInitSend(value)
	{
		var temp = subs;
		while (temp.ctor !== '[]')
		{
			callback(temp._0(value));
			temp = temp._1;
		}
	}

	function send(incomingValue)
	{
		var result = A2(_elm_lang$core$Json_Decode$decodeValue, converter, incomingValue);
		if (result.ctor === 'Err')
		{
			throw new Error('Trying to send an unexpected type of value through port `' + name + '`:\n' + result._0);
		}

		currentSend(result._0);
	}

	return { send: send };
}

return {
	// routers
	sendToApp: F2(sendToApp),
	sendToSelf: F2(sendToSelf),

	// global setup
	effectManagers: effectManagers,
	outgoingPort: outgoingPort,
	incomingPort: incomingPort,

	htmlToProgram: htmlToProgram,
	program: program,
	programWithFlags: programWithFlags,
	initialize: initialize,

	// effect bags
	leaf: leaf,
	batch: batch,
	map: F2(map)
};

}();

//import Native.Utils //

var _elm_lang$core$Native_Scheduler = function() {

var MAX_STEPS = 10000;


// TASKS

function succeed(value)
{
	return {
		ctor: '_Task_succeed',
		value: value
	};
}

function fail(error)
{
	return {
		ctor: '_Task_fail',
		value: error
	};
}

function nativeBinding(callback)
{
	return {
		ctor: '_Task_nativeBinding',
		callback: callback,
		cancel: null
	};
}

function andThen(callback, task)
{
	return {
		ctor: '_Task_andThen',
		callback: callback,
		task: task
	};
}

function onError(callback, task)
{
	return {
		ctor: '_Task_onError',
		callback: callback,
		task: task
	};
}

function receive(callback)
{
	return {
		ctor: '_Task_receive',
		callback: callback
	};
}


// PROCESSES

function rawSpawn(task)
{
	var process = {
		ctor: '_Process',
		id: _elm_lang$core$Native_Utils.guid(),
		root: task,
		stack: null,
		mailbox: []
	};

	enqueue(process);

	return process;
}

function spawn(task)
{
	return nativeBinding(function(callback) {
		var process = rawSpawn(task);
		callback(succeed(process));
	});
}

function rawSend(process, msg)
{
	process.mailbox.push(msg);
	enqueue(process);
}

function send(process, msg)
{
	return nativeBinding(function(callback) {
		rawSend(process, msg);
		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function kill(process)
{
	return nativeBinding(function(callback) {
		var root = process.root;
		if (root.ctor === '_Task_nativeBinding' && root.cancel)
		{
			root.cancel();
		}

		process.root = null;

		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sleep(time)
{
	return nativeBinding(function(callback) {
		var id = setTimeout(function() {
			callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}


// STEP PROCESSES

function step(numSteps, process)
{
	while (numSteps < MAX_STEPS)
	{
		var ctor = process.root.ctor;

		if (ctor === '_Task_succeed')
		{
			while (process.stack && process.stack.ctor === '_Task_onError')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_fail')
		{
			while (process.stack && process.stack.ctor === '_Task_andThen')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_andThen')
		{
			process.stack = {
				ctor: '_Task_andThen',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_onError')
		{
			process.stack = {
				ctor: '_Task_onError',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_nativeBinding')
		{
			process.root.cancel = process.root.callback(function(newRoot) {
				process.root = newRoot;
				enqueue(process);
			});

			break;
		}

		if (ctor === '_Task_receive')
		{
			var mailbox = process.mailbox;
			if (mailbox.length === 0)
			{
				break;
			}

			process.root = process.root.callback(mailbox.shift());
			++numSteps;
			continue;
		}

		throw new Error(ctor);
	}

	if (numSteps < MAX_STEPS)
	{
		return numSteps + 1;
	}
	enqueue(process);

	return numSteps;
}


// WORK QUEUE

var working = false;
var workQueue = [];

function enqueue(process)
{
	workQueue.push(process);

	if (!working)
	{
		setTimeout(work, 0);
		working = true;
	}
}

function work()
{
	var numSteps = 0;
	var process;
	while (numSteps < MAX_STEPS && (process = workQueue.shift()))
	{
		if (process.root)
		{
			numSteps = step(numSteps, process);
		}
	}
	if (!process)
	{
		working = false;
		return;
	}
	setTimeout(work, 0);
}


return {
	succeed: succeed,
	fail: fail,
	nativeBinding: nativeBinding,
	andThen: F2(andThen),
	onError: F2(onError),
	receive: receive,

	spawn: spawn,
	kill: kill,
	sleep: sleep,
	send: F2(send),

	rawSpawn: rawSpawn,
	rawSend: rawSend
};

}();
var _elm_lang$core$Platform_Cmd$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Cmd$none = _elm_lang$core$Platform_Cmd$batch(
	{ctor: '[]'});
var _elm_lang$core$Platform_Cmd_ops = _elm_lang$core$Platform_Cmd_ops || {};
_elm_lang$core$Platform_Cmd_ops['!'] = F2(
	function (model, commands) {
		return {
			ctor: '_Tuple2',
			_0: model,
			_1: _elm_lang$core$Platform_Cmd$batch(commands)
		};
	});
var _elm_lang$core$Platform_Cmd$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Cmd$Cmd = {ctor: 'Cmd'};

var _elm_lang$core$Platform_Sub$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Sub$none = _elm_lang$core$Platform_Sub$batch(
	{ctor: '[]'});
var _elm_lang$core$Platform_Sub$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Sub$Sub = {ctor: 'Sub'};

var _elm_lang$core$Platform$hack = _elm_lang$core$Native_Scheduler.succeed;
var _elm_lang$core$Platform$sendToSelf = _elm_lang$core$Native_Platform.sendToSelf;
var _elm_lang$core$Platform$sendToApp = _elm_lang$core$Native_Platform.sendToApp;
var _elm_lang$core$Platform$programWithFlags = _elm_lang$core$Native_Platform.programWithFlags;
var _elm_lang$core$Platform$program = _elm_lang$core$Native_Platform.program;
var _elm_lang$core$Platform$Program = {ctor: 'Program'};
var _elm_lang$core$Platform$Task = {ctor: 'Task'};
var _elm_lang$core$Platform$ProcessId = {ctor: 'ProcessId'};
var _elm_lang$core$Platform$Router = {ctor: 'Router'};

var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode = _elm_lang$core$Json_Decode$succeed;
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$resolve = _elm_lang$core$Json_Decode$andThen(_elm_lang$core$Basics$identity);
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$custom = _elm_lang$core$Json_Decode$map2(
	F2(
		function (x, y) {
			return y(x);
		}));
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$hardcoded = function (_p0) {
	return _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$custom(
		_elm_lang$core$Json_Decode$succeed(_p0));
};
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optionalDecoder = F3(
	function (pathDecoder, valDecoder, fallback) {
		var nullOr = function (decoder) {
			return _elm_lang$core$Json_Decode$oneOf(
				{
					ctor: '::',
					_0: decoder,
					_1: {
						ctor: '::',
						_0: _elm_lang$core$Json_Decode$null(fallback),
						_1: {ctor: '[]'}
					}
				});
		};
		var handleResult = function (input) {
			var _p1 = A2(_elm_lang$core$Json_Decode$decodeValue, pathDecoder, input);
			if (_p1.ctor === 'Ok') {
				var _p2 = A2(
					_elm_lang$core$Json_Decode$decodeValue,
					nullOr(valDecoder),
					_p1._0);
				if (_p2.ctor === 'Ok') {
					return _elm_lang$core$Json_Decode$succeed(_p2._0);
				} else {
					return _elm_lang$core$Json_Decode$fail(_p2._0);
				}
			} else {
				return _elm_lang$core$Json_Decode$succeed(fallback);
			}
		};
		return A2(_elm_lang$core$Json_Decode$andThen, handleResult, _elm_lang$core$Json_Decode$value);
	});
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optionalAt = F4(
	function (path, valDecoder, fallback, decoder) {
		return A2(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$custom,
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optionalDecoder,
				A2(_elm_lang$core$Json_Decode$at, path, _elm_lang$core$Json_Decode$value),
				valDecoder,
				fallback),
			decoder);
	});
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optional = F4(
	function (key, valDecoder, fallback, decoder) {
		return A2(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$custom,
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optionalDecoder,
				A2(_elm_lang$core$Json_Decode$field, key, _elm_lang$core$Json_Decode$value),
				valDecoder,
				fallback),
			decoder);
	});
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$requiredAt = F3(
	function (path, valDecoder, decoder) {
		return A2(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$custom,
			A2(_elm_lang$core$Json_Decode$at, path, valDecoder),
			decoder);
	});
var _NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$custom,
			A2(_elm_lang$core$Json_Decode$field, key, valDecoder),
			decoder);
	});

//import Result //

var _elm_lang$core$Native_Date = function() {

function fromString(str)
{
	var date = new Date(str);
	return isNaN(date.getTime())
		? _elm_lang$core$Result$Err('Unable to parse \'' + str + '\' as a date. Dates must be in the ISO 8601 format.')
		: _elm_lang$core$Result$Ok(date);
}

var dayTable = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var monthTable =
	['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


return {
	fromString: fromString,
	year: function(d) { return d.getFullYear(); },
	month: function(d) { return { ctor: monthTable[d.getMonth()] }; },
	day: function(d) { return d.getDate(); },
	hour: function(d) { return d.getHours(); },
	minute: function(d) { return d.getMinutes(); },
	second: function(d) { return d.getSeconds(); },
	millisecond: function(d) { return d.getMilliseconds(); },
	toTime: function(d) { return d.getTime(); },
	fromTime: function(t) { return new Date(t); },
	dayOfWeek: function(d) { return { ctor: dayTable[d.getDay()] }; }
};

}();
var _elm_lang$core$Task$onError = _elm_lang$core$Native_Scheduler.onError;
var _elm_lang$core$Task$andThen = _elm_lang$core$Native_Scheduler.andThen;
var _elm_lang$core$Task$spawnCmd = F2(
	function (router, _p0) {
		var _p1 = _p0;
		return _elm_lang$core$Native_Scheduler.spawn(
			A2(
				_elm_lang$core$Task$andThen,
				_elm_lang$core$Platform$sendToApp(router),
				_p1._0));
	});
var _elm_lang$core$Task$fail = _elm_lang$core$Native_Scheduler.fail;
var _elm_lang$core$Task$mapError = F2(
	function (convert, task) {
		return A2(
			_elm_lang$core$Task$onError,
			function (_p2) {
				return _elm_lang$core$Task$fail(
					convert(_p2));
			},
			task);
	});
var _elm_lang$core$Task$succeed = _elm_lang$core$Native_Scheduler.succeed;
var _elm_lang$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return _elm_lang$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var _elm_lang$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return _elm_lang$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$map3 = F4(
	function (func, taskA, taskB, taskC) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return A2(
							_elm_lang$core$Task$andThen,
							function (c) {
								return _elm_lang$core$Task$succeed(
									A3(func, a, b, c));
							},
							taskC);
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$map4 = F5(
	function (func, taskA, taskB, taskC, taskD) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return A2(
							_elm_lang$core$Task$andThen,
							function (c) {
								return A2(
									_elm_lang$core$Task$andThen,
									function (d) {
										return _elm_lang$core$Task$succeed(
											A4(func, a, b, c, d));
									},
									taskD);
							},
							taskC);
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$map5 = F6(
	function (func, taskA, taskB, taskC, taskD, taskE) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return A2(
							_elm_lang$core$Task$andThen,
							function (c) {
								return A2(
									_elm_lang$core$Task$andThen,
									function (d) {
										return A2(
											_elm_lang$core$Task$andThen,
											function (e) {
												return _elm_lang$core$Task$succeed(
													A5(func, a, b, c, d, e));
											},
											taskE);
									},
									taskD);
							},
							taskC);
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$sequence = function (tasks) {
	var _p3 = tasks;
	if (_p3.ctor === '[]') {
		return _elm_lang$core$Task$succeed(
			{ctor: '[]'});
	} else {
		return A3(
			_elm_lang$core$Task$map2,
			F2(
				function (x, y) {
					return {ctor: '::', _0: x, _1: y};
				}),
			_p3._0,
			_elm_lang$core$Task$sequence(_p3._1));
	}
};
var _elm_lang$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			_elm_lang$core$Task$map,
			function (_p4) {
				return {ctor: '_Tuple0'};
			},
			_elm_lang$core$Task$sequence(
				A2(
					_elm_lang$core$List$map,
					_elm_lang$core$Task$spawnCmd(router),
					commands)));
	});
var _elm_lang$core$Task$init = _elm_lang$core$Task$succeed(
	{ctor: '_Tuple0'});
var _elm_lang$core$Task$onSelfMsg = F3(
	function (_p7, _p6, _p5) {
		return _elm_lang$core$Task$succeed(
			{ctor: '_Tuple0'});
	});
var _elm_lang$core$Task$command = _elm_lang$core$Native_Platform.leaf('Task');
var _elm_lang$core$Task$Perform = function (a) {
	return {ctor: 'Perform', _0: a};
};
var _elm_lang$core$Task$perform = F2(
	function (toMessage, task) {
		return _elm_lang$core$Task$command(
			_elm_lang$core$Task$Perform(
				A2(_elm_lang$core$Task$map, toMessage, task)));
	});
var _elm_lang$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return _elm_lang$core$Task$command(
			_elm_lang$core$Task$Perform(
				A2(
					_elm_lang$core$Task$onError,
					function (_p8) {
						return _elm_lang$core$Task$succeed(
							resultToMessage(
								_elm_lang$core$Result$Err(_p8)));
					},
					A2(
						_elm_lang$core$Task$andThen,
						function (_p9) {
							return _elm_lang$core$Task$succeed(
								resultToMessage(
									_elm_lang$core$Result$Ok(_p9)));
						},
						task))));
	});
var _elm_lang$core$Task$cmdMap = F2(
	function (tagger, _p10) {
		var _p11 = _p10;
		return _elm_lang$core$Task$Perform(
			A2(_elm_lang$core$Task$map, tagger, _p11._0));
	});
_elm_lang$core$Native_Platform.effectManagers['Task'] = {pkg: 'elm-lang/core', init: _elm_lang$core$Task$init, onEffects: _elm_lang$core$Task$onEffects, onSelfMsg: _elm_lang$core$Task$onSelfMsg, tag: 'cmd', cmdMap: _elm_lang$core$Task$cmdMap};

//import Native.Scheduler //

var _elm_lang$core$Native_Time = function() {

var now = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
{
	callback(_elm_lang$core$Native_Scheduler.succeed(Date.now()));
});

function setInterval_(interval, task)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		var id = setInterval(function() {
			_elm_lang$core$Native_Scheduler.rawSpawn(task);
		}, interval);

		return function() { clearInterval(id); };
	});
}

return {
	now: now,
	setInterval_: F2(setInterval_)
};

}();
var _elm_lang$core$Time$setInterval = _elm_lang$core$Native_Time.setInterval_;
var _elm_lang$core$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		var _p0 = intervals;
		if (_p0.ctor === '[]') {
			return _elm_lang$core$Task$succeed(processes);
		} else {
			var _p1 = _p0._0;
			var spawnRest = function (id) {
				return A3(
					_elm_lang$core$Time$spawnHelp,
					router,
					_p0._1,
					A3(_elm_lang$core$Dict$insert, _p1, id, processes));
			};
			var spawnTimer = _elm_lang$core$Native_Scheduler.spawn(
				A2(
					_elm_lang$core$Time$setInterval,
					_p1,
					A2(_elm_lang$core$Platform$sendToSelf, router, _p1)));
			return A2(_elm_lang$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var _elm_lang$core$Time$addMySub = F2(
	function (_p2, state) {
		var _p3 = _p2;
		var _p6 = _p3._1;
		var _p5 = _p3._0;
		var _p4 = A2(_elm_lang$core$Dict$get, _p5, state);
		if (_p4.ctor === 'Nothing') {
			return A3(
				_elm_lang$core$Dict$insert,
				_p5,
				{
					ctor: '::',
					_0: _p6,
					_1: {ctor: '[]'}
				},
				state);
		} else {
			return A3(
				_elm_lang$core$Dict$insert,
				_p5,
				{ctor: '::', _0: _p6, _1: _p4._0},
				state);
		}
	});
var _elm_lang$core$Time$inMilliseconds = function (t) {
	return t;
};
var _elm_lang$core$Time$millisecond = 1;
var _elm_lang$core$Time$second = 1000 * _elm_lang$core$Time$millisecond;
var _elm_lang$core$Time$minute = 60 * _elm_lang$core$Time$second;
var _elm_lang$core$Time$hour = 60 * _elm_lang$core$Time$minute;
var _elm_lang$core$Time$inHours = function (t) {
	return t / _elm_lang$core$Time$hour;
};
var _elm_lang$core$Time$inMinutes = function (t) {
	return t / _elm_lang$core$Time$minute;
};
var _elm_lang$core$Time$inSeconds = function (t) {
	return t / _elm_lang$core$Time$second;
};
var _elm_lang$core$Time$now = _elm_lang$core$Native_Time.now;
var _elm_lang$core$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _p7 = A2(_elm_lang$core$Dict$get, interval, state.taggers);
		if (_p7.ctor === 'Nothing') {
			return _elm_lang$core$Task$succeed(state);
		} else {
			var tellTaggers = function (time) {
				return _elm_lang$core$Task$sequence(
					A2(
						_elm_lang$core$List$map,
						function (tagger) {
							return A2(
								_elm_lang$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						_p7._0));
			};
			return A2(
				_elm_lang$core$Task$andThen,
				function (_p8) {
					return _elm_lang$core$Task$succeed(state);
				},
				A2(_elm_lang$core$Task$andThen, tellTaggers, _elm_lang$core$Time$now));
		}
	});
var _elm_lang$core$Time$subscription = _elm_lang$core$Native_Platform.leaf('Time');
var _elm_lang$core$Time$State = F2(
	function (a, b) {
		return {taggers: a, processes: b};
	});
var _elm_lang$core$Time$init = _elm_lang$core$Task$succeed(
	A2(_elm_lang$core$Time$State, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty));
var _elm_lang$core$Time$onEffects = F3(
	function (router, subs, _p9) {
		var _p10 = _p9;
		var rightStep = F3(
			function (_p12, id, _p11) {
				var _p13 = _p11;
				return {
					ctor: '_Tuple3',
					_0: _p13._0,
					_1: _p13._1,
					_2: A2(
						_elm_lang$core$Task$andThen,
						function (_p14) {
							return _p13._2;
						},
						_elm_lang$core$Native_Scheduler.kill(id))
				};
			});
		var bothStep = F4(
			function (interval, taggers, id, _p15) {
				var _p16 = _p15;
				return {
					ctor: '_Tuple3',
					_0: _p16._0,
					_1: A3(_elm_lang$core$Dict$insert, interval, id, _p16._1),
					_2: _p16._2
				};
			});
		var leftStep = F3(
			function (interval, taggers, _p17) {
				var _p18 = _p17;
				return {
					ctor: '_Tuple3',
					_0: {ctor: '::', _0: interval, _1: _p18._0},
					_1: _p18._1,
					_2: _p18._2
				};
			});
		var newTaggers = A3(_elm_lang$core$List$foldl, _elm_lang$core$Time$addMySub, _elm_lang$core$Dict$empty, subs);
		var _p19 = A6(
			_elm_lang$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			_p10.processes,
			{
				ctor: '_Tuple3',
				_0: {ctor: '[]'},
				_1: _elm_lang$core$Dict$empty,
				_2: _elm_lang$core$Task$succeed(
					{ctor: '_Tuple0'})
			});
		var spawnList = _p19._0;
		var existingDict = _p19._1;
		var killTask = _p19._2;
		return A2(
			_elm_lang$core$Task$andThen,
			function (newProcesses) {
				return _elm_lang$core$Task$succeed(
					A2(_elm_lang$core$Time$State, newTaggers, newProcesses));
			},
			A2(
				_elm_lang$core$Task$andThen,
				function (_p20) {
					return A3(_elm_lang$core$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var _elm_lang$core$Time$Every = F2(
	function (a, b) {
		return {ctor: 'Every', _0: a, _1: b};
	});
var _elm_lang$core$Time$every = F2(
	function (interval, tagger) {
		return _elm_lang$core$Time$subscription(
			A2(_elm_lang$core$Time$Every, interval, tagger));
	});
var _elm_lang$core$Time$subMap = F2(
	function (f, _p21) {
		var _p22 = _p21;
		return A2(
			_elm_lang$core$Time$Every,
			_p22._0,
			function (_p23) {
				return f(
					_p22._1(_p23));
			});
	});
_elm_lang$core$Native_Platform.effectManagers['Time'] = {pkg: 'elm-lang/core', init: _elm_lang$core$Time$init, onEffects: _elm_lang$core$Time$onEffects, onSelfMsg: _elm_lang$core$Time$onSelfMsg, tag: 'sub', subMap: _elm_lang$core$Time$subMap};

var _elm_lang$core$Date$millisecond = _elm_lang$core$Native_Date.millisecond;
var _elm_lang$core$Date$second = _elm_lang$core$Native_Date.second;
var _elm_lang$core$Date$minute = _elm_lang$core$Native_Date.minute;
var _elm_lang$core$Date$hour = _elm_lang$core$Native_Date.hour;
var _elm_lang$core$Date$dayOfWeek = _elm_lang$core$Native_Date.dayOfWeek;
var _elm_lang$core$Date$day = _elm_lang$core$Native_Date.day;
var _elm_lang$core$Date$month = _elm_lang$core$Native_Date.month;
var _elm_lang$core$Date$year = _elm_lang$core$Native_Date.year;
var _elm_lang$core$Date$fromTime = _elm_lang$core$Native_Date.fromTime;
var _elm_lang$core$Date$toTime = _elm_lang$core$Native_Date.toTime;
var _elm_lang$core$Date$fromString = _elm_lang$core$Native_Date.fromString;
var _elm_lang$core$Date$now = A2(_elm_lang$core$Task$map, _elm_lang$core$Date$fromTime, _elm_lang$core$Time$now);
var _elm_lang$core$Date$Date = {ctor: 'Date'};
var _elm_lang$core$Date$Sun = {ctor: 'Sun'};
var _elm_lang$core$Date$Sat = {ctor: 'Sat'};
var _elm_lang$core$Date$Fri = {ctor: 'Fri'};
var _elm_lang$core$Date$Thu = {ctor: 'Thu'};
var _elm_lang$core$Date$Wed = {ctor: 'Wed'};
var _elm_lang$core$Date$Tue = {ctor: 'Tue'};
var _elm_lang$core$Date$Mon = {ctor: 'Mon'};
var _elm_lang$core$Date$Dec = {ctor: 'Dec'};
var _elm_lang$core$Date$Nov = {ctor: 'Nov'};
var _elm_lang$core$Date$Oct = {ctor: 'Oct'};
var _elm_lang$core$Date$Sep = {ctor: 'Sep'};
var _elm_lang$core$Date$Aug = {ctor: 'Aug'};
var _elm_lang$core$Date$Jul = {ctor: 'Jul'};
var _elm_lang$core$Date$Jun = {ctor: 'Jun'};
var _elm_lang$core$Date$May = {ctor: 'May'};
var _elm_lang$core$Date$Apr = {ctor: 'Apr'};
var _elm_lang$core$Date$Mar = {ctor: 'Mar'};
var _elm_lang$core$Date$Feb = {ctor: 'Feb'};
var _elm_lang$core$Date$Jan = {ctor: 'Jan'};

var _elm_lang$core$Set$foldr = F3(
	function (f, b, _p0) {
		var _p1 = _p0;
		return A3(
			_elm_lang$core$Dict$foldr,
			F3(
				function (k, _p2, b) {
					return A2(f, k, b);
				}),
			b,
			_p1._0);
	});
var _elm_lang$core$Set$foldl = F3(
	function (f, b, _p3) {
		var _p4 = _p3;
		return A3(
			_elm_lang$core$Dict$foldl,
			F3(
				function (k, _p5, b) {
					return A2(f, k, b);
				}),
			b,
			_p4._0);
	});
var _elm_lang$core$Set$toList = function (_p6) {
	var _p7 = _p6;
	return _elm_lang$core$Dict$keys(_p7._0);
};
var _elm_lang$core$Set$size = function (_p8) {
	var _p9 = _p8;
	return _elm_lang$core$Dict$size(_p9._0);
};
var _elm_lang$core$Set$member = F2(
	function (k, _p10) {
		var _p11 = _p10;
		return A2(_elm_lang$core$Dict$member, k, _p11._0);
	});
var _elm_lang$core$Set$isEmpty = function (_p12) {
	var _p13 = _p12;
	return _elm_lang$core$Dict$isEmpty(_p13._0);
};
var _elm_lang$core$Set$Set_elm_builtin = function (a) {
	return {ctor: 'Set_elm_builtin', _0: a};
};
var _elm_lang$core$Set$empty = _elm_lang$core$Set$Set_elm_builtin(_elm_lang$core$Dict$empty);
var _elm_lang$core$Set$singleton = function (k) {
	return _elm_lang$core$Set$Set_elm_builtin(
		A2(
			_elm_lang$core$Dict$singleton,
			k,
			{ctor: '_Tuple0'}));
};
var _elm_lang$core$Set$insert = F2(
	function (k, _p14) {
		var _p15 = _p14;
		return _elm_lang$core$Set$Set_elm_builtin(
			A3(
				_elm_lang$core$Dict$insert,
				k,
				{ctor: '_Tuple0'},
				_p15._0));
	});
var _elm_lang$core$Set$fromList = function (xs) {
	return A3(_elm_lang$core$List$foldl, _elm_lang$core$Set$insert, _elm_lang$core$Set$empty, xs);
};
var _elm_lang$core$Set$map = F2(
	function (f, s) {
		return _elm_lang$core$Set$fromList(
			A2(
				_elm_lang$core$List$map,
				f,
				_elm_lang$core$Set$toList(s)));
	});
var _elm_lang$core$Set$remove = F2(
	function (k, _p16) {
		var _p17 = _p16;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$remove, k, _p17._0));
	});
var _elm_lang$core$Set$union = F2(
	function (_p19, _p18) {
		var _p20 = _p19;
		var _p21 = _p18;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$union, _p20._0, _p21._0));
	});
var _elm_lang$core$Set$intersect = F2(
	function (_p23, _p22) {
		var _p24 = _p23;
		var _p25 = _p22;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$intersect, _p24._0, _p25._0));
	});
var _elm_lang$core$Set$diff = F2(
	function (_p27, _p26) {
		var _p28 = _p27;
		var _p29 = _p26;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$diff, _p28._0, _p29._0));
	});
var _elm_lang$core$Set$filter = F2(
	function (p, _p30) {
		var _p31 = _p30;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(
				_elm_lang$core$Dict$filter,
				F2(
					function (k, _p32) {
						return p(k);
					}),
				_p31._0));
	});
var _elm_lang$core$Set$partition = F2(
	function (p, _p33) {
		var _p34 = _p33;
		var _p35 = A2(
			_elm_lang$core$Dict$partition,
			F2(
				function (k, _p36) {
					return p(k);
				}),
			_p34._0);
		var p1 = _p35._0;
		var p2 = _p35._1;
		return {
			ctor: '_Tuple2',
			_0: _elm_lang$core$Set$Set_elm_builtin(p1),
			_1: _elm_lang$core$Set$Set_elm_builtin(p2)
		};
	});

var _elm_community$json_extra$Json_Decode_Extra$when = F3(
	function (checkDecoder, check, passDecoder) {
		return A2(
			_elm_lang$core$Json_Decode$andThen,
			function (checkVal) {
				return check(checkVal) ? passDecoder : _elm_lang$core$Json_Decode$fail(
					A2(
						_elm_lang$core$Basics_ops['++'],
						'Check failed with input `',
						A2(
							_elm_lang$core$Basics_ops['++'],
							_elm_lang$core$Basics$toString(checkVal),
							'`')));
			},
			checkDecoder);
	});
var _elm_community$json_extra$Json_Decode_Extra$combine = A2(
	_elm_lang$core$List$foldr,
	_elm_lang$core$Json_Decode$map2(
		F2(
			function (x, y) {
				return {ctor: '::', _0: x, _1: y};
			})),
	_elm_lang$core$Json_Decode$succeed(
		{ctor: '[]'}));
var _elm_community$json_extra$Json_Decode_Extra$collection = function (decoder) {
	return A2(
		_elm_lang$core$Json_Decode$andThen,
		function (length) {
			return _elm_community$json_extra$Json_Decode_Extra$combine(
				A2(
					_elm_lang$core$List$map,
					function (index) {
						return A2(
							_elm_lang$core$Json_Decode$field,
							_elm_lang$core$Basics$toString(index),
							decoder);
					},
					A2(_elm_lang$core$List$range, 0, length - 1)));
		},
		A2(_elm_lang$core$Json_Decode$field, 'length', _elm_lang$core$Json_Decode$int));
};
var _elm_community$json_extra$Json_Decode_Extra$fromResult = function (result) {
	var _p0 = result;
	if (_p0.ctor === 'Ok') {
		return _elm_lang$core$Json_Decode$succeed(_p0._0);
	} else {
		return _elm_lang$core$Json_Decode$fail(_p0._0);
	}
};
var _elm_community$json_extra$Json_Decode_Extra$parseInt = A2(
	_elm_lang$core$Json_Decode$andThen,
	function (_p1) {
		return _elm_community$json_extra$Json_Decode_Extra$fromResult(
			_elm_lang$core$String$toInt(_p1));
	},
	_elm_lang$core$Json_Decode$string);
var _elm_community$json_extra$Json_Decode_Extra$parseFloat = A2(
	_elm_lang$core$Json_Decode$andThen,
	function (_p2) {
		return _elm_community$json_extra$Json_Decode_Extra$fromResult(
			_elm_lang$core$String$toFloat(_p2));
	},
	_elm_lang$core$Json_Decode$string);
var _elm_community$json_extra$Json_Decode_Extra$doubleEncoded = function (decoder) {
	return A2(
		_elm_lang$core$Json_Decode$andThen,
		function (_p3) {
			return _elm_community$json_extra$Json_Decode_Extra$fromResult(
				A2(_elm_lang$core$Json_Decode$decodeString, decoder, _p3));
		},
		_elm_lang$core$Json_Decode$string);
};
var _elm_community$json_extra$Json_Decode_Extra$keys = A2(
	_elm_lang$core$Json_Decode$map,
	A2(
		_elm_lang$core$List$foldl,
		F2(
			function (_p4, acc) {
				var _p5 = _p4;
				return {ctor: '::', _0: _p5._0, _1: acc};
			}),
		{ctor: '[]'}),
	_elm_lang$core$Json_Decode$keyValuePairs(
		_elm_lang$core$Json_Decode$succeed(
			{ctor: '_Tuple0'})));
var _elm_community$json_extra$Json_Decode_Extra$sequenceHelp = F2(
	function (decoders, jsonValues) {
		return (!_elm_lang$core$Native_Utils.eq(
			_elm_lang$core$List$length(jsonValues),
			_elm_lang$core$List$length(decoders))) ? _elm_lang$core$Json_Decode$fail('Number of decoders does not match number of values') : _elm_community$json_extra$Json_Decode_Extra$fromResult(
			A3(
				_elm_lang$core$List$foldr,
				_elm_lang$core$Result$map2(
					F2(
						function (x, y) {
							return {ctor: '::', _0: x, _1: y};
						})),
				_elm_lang$core$Result$Ok(
					{ctor: '[]'}),
				A3(_elm_lang$core$List$map2, _elm_lang$core$Json_Decode$decodeValue, decoders, jsonValues)));
	});
var _elm_community$json_extra$Json_Decode_Extra$sequence = function (decoders) {
	return A2(
		_elm_lang$core$Json_Decode$andThen,
		_elm_community$json_extra$Json_Decode_Extra$sequenceHelp(decoders),
		_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$value));
};
var _elm_community$json_extra$Json_Decode_Extra$indexedList = function (indexedDecoder) {
	return A2(
		_elm_lang$core$Json_Decode$andThen,
		function (values) {
			return _elm_community$json_extra$Json_Decode_Extra$sequence(
				A2(
					_elm_lang$core$List$map,
					indexedDecoder,
					A2(
						_elm_lang$core$List$range,
						0,
						_elm_lang$core$List$length(values) - 1)));
		},
		_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$value));
};
var _elm_community$json_extra$Json_Decode_Extra$optionalField = F2(
	function (fieldName, decoder) {
		var finishDecoding = function (json) {
			var _p6 = A2(
				_elm_lang$core$Json_Decode$decodeValue,
				A2(_elm_lang$core$Json_Decode$field, fieldName, _elm_lang$core$Json_Decode$value),
				json);
			if (_p6.ctor === 'Ok') {
				return A2(
					_elm_lang$core$Json_Decode$map,
					_elm_lang$core$Maybe$Just,
					A2(_elm_lang$core$Json_Decode$field, fieldName, decoder));
			} else {
				return _elm_lang$core$Json_Decode$succeed(_elm_lang$core$Maybe$Nothing);
			}
		};
		return A2(_elm_lang$core$Json_Decode$andThen, finishDecoding, _elm_lang$core$Json_Decode$value);
	});
var _elm_community$json_extra$Json_Decode_Extra$withDefault = F2(
	function (fallback, decoder) {
		return A2(
			_elm_lang$core$Json_Decode$map,
			_elm_lang$core$Maybe$withDefault(fallback),
			_elm_lang$core$Json_Decode$maybe(decoder));
	});
var _elm_community$json_extra$Json_Decode_Extra$decodeDictFromTuples = F2(
	function (keyDecoder, tuples) {
		var _p7 = tuples;
		if (_p7.ctor === '[]') {
			return _elm_lang$core$Json_Decode$succeed(_elm_lang$core$Dict$empty);
		} else {
			var _p8 = A2(_elm_lang$core$Json_Decode$decodeString, keyDecoder, _p7._0._0);
			if (_p8.ctor === 'Ok') {
				return A2(
					_elm_lang$core$Json_Decode$andThen,
					function (_p9) {
						return _elm_lang$core$Json_Decode$succeed(
							A3(_elm_lang$core$Dict$insert, _p8._0, _p7._0._1, _p9));
					},
					A2(_elm_community$json_extra$Json_Decode_Extra$decodeDictFromTuples, keyDecoder, _p7._1));
			} else {
				return _elm_lang$core$Json_Decode$fail(_p8._0);
			}
		}
	});
var _elm_community$json_extra$Json_Decode_Extra$dict2 = F2(
	function (keyDecoder, valueDecoder) {
		return A2(
			_elm_lang$core$Json_Decode$andThen,
			_elm_community$json_extra$Json_Decode_Extra$decodeDictFromTuples(keyDecoder),
			_elm_lang$core$Json_Decode$keyValuePairs(valueDecoder));
	});
var _elm_community$json_extra$Json_Decode_Extra$set = function (decoder) {
	return A2(
		_elm_lang$core$Json_Decode$map,
		_elm_lang$core$Set$fromList,
		_elm_lang$core$Json_Decode$list(decoder));
};
var _elm_community$json_extra$Json_Decode_Extra$date = A2(
	_elm_lang$core$Json_Decode$andThen,
	function (_p10) {
		return _elm_community$json_extra$Json_Decode_Extra$fromResult(
			_elm_lang$core$Date$fromString(_p10));
	},
	_elm_lang$core$Json_Decode$string);
var _elm_community$json_extra$Json_Decode_Extra$andMap = _elm_lang$core$Json_Decode$map2(
	F2(
		function (x, y) {
			return y(x);
		}));
var _elm_community$json_extra$Json_Decode_Extra_ops = _elm_community$json_extra$Json_Decode_Extra_ops || {};
_elm_community$json_extra$Json_Decode_Extra_ops['|:'] = _elm_lang$core$Basics$flip(_elm_community$json_extra$Json_Decode_Extra$andMap);

var _elm_community$json_extra$Json_Encode_Extra$dict = F3(
	function (toKey, toValue, dict) {
		return _elm_lang$core$Json_Encode$object(
			A2(
				_elm_lang$core$List$map,
				function (_p0) {
					var _p1 = _p0;
					return {
						ctor: '_Tuple2',
						_0: toKey(_p1._0),
						_1: toValue(_p1._1)
					};
				},
				_elm_lang$core$Dict$toList(dict)));
	});
var _elm_community$json_extra$Json_Encode_Extra$maybe = function (encoder) {
	return function (_p2) {
		return A2(
			_elm_lang$core$Maybe$withDefault,
			_elm_lang$core$Json_Encode$null,
			A2(_elm_lang$core$Maybe$map, encoder, _p2));
	};
};

//import Maybe, Native.List //

var _elm_lang$core$Native_Regex = function() {

function escape(str)
{
	return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
function caseInsensitive(re)
{
	return new RegExp(re.source, 'gi');
}
function regex(raw)
{
	return new RegExp(raw, 'g');
}

function contains(re, string)
{
	return string.match(re) !== null;
}

function find(n, re, str)
{
	n = n.ctor === 'All' ? Infinity : n._0;
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex === re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch === undefined
				? _elm_lang$core$Maybe$Nothing
				: _elm_lang$core$Maybe$Just(submatch);
		}
		out.push({
			match: result[0],
			submatches: _elm_lang$core$Native_List.fromArray(subs),
			index: result.index,
			number: number
		});
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _elm_lang$core$Native_List.fromArray(out);
}

function replace(n, re, replacer, string)
{
	n = n.ctor === 'All' ? Infinity : n._0;
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch === undefined
				? _elm_lang$core$Maybe$Nothing
				: _elm_lang$core$Maybe$Just(submatch);
		}
		return replacer({
			match: match,
			submatches: _elm_lang$core$Native_List.fromArray(submatches),
			index: arguments[arguments.length - 2],
			number: count
		});
	}
	return string.replace(re, jsReplacer);
}

function split(n, re, str)
{
	n = n.ctor === 'All' ? Infinity : n._0;
	if (n === Infinity)
	{
		return _elm_lang$core$Native_List.fromArray(str.split(re));
	}
	var string = str;
	var result;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		if (!(result = re.exec(string))) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _elm_lang$core$Native_List.fromArray(out);
}

return {
	regex: regex,
	caseInsensitive: caseInsensitive,
	escape: escape,

	contains: F2(contains),
	find: F3(find),
	replace: F4(replace),
	split: F3(split)
};

}();

var _elm_lang$core$Regex$split = _elm_lang$core$Native_Regex.split;
var _elm_lang$core$Regex$replace = _elm_lang$core$Native_Regex.replace;
var _elm_lang$core$Regex$find = _elm_lang$core$Native_Regex.find;
var _elm_lang$core$Regex$contains = _elm_lang$core$Native_Regex.contains;
var _elm_lang$core$Regex$caseInsensitive = _elm_lang$core$Native_Regex.caseInsensitive;
var _elm_lang$core$Regex$regex = _elm_lang$core$Native_Regex.regex;
var _elm_lang$core$Regex$escape = _elm_lang$core$Native_Regex.escape;
var _elm_lang$core$Regex$Match = F4(
	function (a, b, c, d) {
		return {match: a, submatches: b, index: c, number: d};
	});
var _elm_lang$core$Regex$Regex = {ctor: 'Regex'};
var _elm_lang$core$Regex$AtMost = function (a) {
	return {ctor: 'AtMost', _0: a};
};
var _elm_lang$core$Regex$All = {ctor: 'All'};

var _elm_lang$core$Native_Bitwise = function() {

return {
	and: F2(function and(a, b) { return a & b; }),
	or: F2(function or(a, b) { return a | b; }),
	xor: F2(function xor(a, b) { return a ^ b; }),
	complement: function complement(a) { return ~a; },
	shiftLeftBy: F2(function(offset, a) { return a << offset; }),
	shiftRightBy: F2(function(offset, a) { return a >> offset; }),
	shiftRightZfBy: F2(function(offset, a) { return a >>> offset; })
};

}();

var _elm_lang$core$Bitwise$shiftRightZfBy = _elm_lang$core$Native_Bitwise.shiftRightZfBy;
var _elm_lang$core$Bitwise$shiftRightBy = _elm_lang$core$Native_Bitwise.shiftRightBy;
var _elm_lang$core$Bitwise$shiftLeftBy = _elm_lang$core$Native_Bitwise.shiftLeftBy;
var _elm_lang$core$Bitwise$complement = _elm_lang$core$Native_Bitwise.complement;
var _elm_lang$core$Bitwise$xor = _elm_lang$core$Native_Bitwise.xor;
var _elm_lang$core$Bitwise$or = _elm_lang$core$Native_Bitwise.or;
var _elm_lang$core$Bitwise$and = _elm_lang$core$Native_Bitwise.and;

var _elm_community$string_extra$String_Extra$accentRegex = function () {
	var matches = {
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: '[à-æ]', _1: 'a'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: '[À-Æ]', _1: 'A'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'ç', _1: 'c'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'Ç', _1: 'C'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: '[è-ë]', _1: 'e'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: '[È-Ë]', _1: 'E'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: '[ì-ï]', _1: 'i'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: '[Ì-Ï]', _1: 'I'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'ñ', _1: 'n'},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'Ñ', _1: 'N'},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: '[ò-ö]', _1: 'o'},
												_1: {
													ctor: '::',
													_0: {ctor: '_Tuple2', _0: '[Ò-Ö]', _1: 'O'},
													_1: {
														ctor: '::',
														_0: {ctor: '_Tuple2', _0: '[ù-ü]', _1: 'u'},
														_1: {
															ctor: '::',
															_0: {ctor: '_Tuple2', _0: '[Ù-Ü]', _1: 'U'},
															_1: {
																ctor: '::',
																_0: {ctor: '_Tuple2', _0: 'ý', _1: 'y'},
																_1: {
																	ctor: '::',
																	_0: {ctor: '_Tuple2', _0: 'ÿ', _1: 'y'},
																	_1: {
																		ctor: '::',
																		_0: {ctor: '_Tuple2', _0: 'Ý', _1: 'Y'},
																		_1: {ctor: '[]'}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};
	return A2(
		_elm_lang$core$List$map,
		function (_p0) {
			var _p1 = _p0;
			return {
				ctor: '_Tuple2',
				_0: _elm_lang$core$Regex$regex(_p1._0),
				_1: _p1._1
			};
		},
		matches);
}();
var _elm_community$string_extra$String_Extra$removeAccents = function (string) {
	if (_elm_lang$core$String$isEmpty(string)) {
		return string;
	} else {
		var do_regex_to_remove_acents = function (_p2) {
			var _p3 = _p2;
			return A3(
				_elm_lang$core$Regex$replace,
				_elm_lang$core$Regex$All,
				_p3._0,
				function (_p4) {
					return _p3._1;
				});
		};
		return A3(_elm_lang$core$List$foldl, do_regex_to_remove_acents, string, _elm_community$string_extra$String_Extra$accentRegex);
	}
};
var _elm_community$string_extra$String_Extra$nonEmpty = function (string) {
	return _elm_lang$core$String$isEmpty(string) ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$Maybe$Just(string);
};
var _elm_community$string_extra$String_Extra$replacementCodePoint = 65533;
var _elm_community$string_extra$String_Extra$toCodePoints = function (string) {
	var allCodeUnits = A2(
		_elm_lang$core$List$map,
		_elm_lang$core$Char$toCode,
		_elm_lang$core$String$toList(string));
	var combineAndReverse = F2(
		function (codeUnits, accumulated) {
			combineAndReverse:
			while (true) {
				var _p5 = codeUnits;
				if (_p5.ctor === '[]') {
					return accumulated;
				} else {
					var _p9 = _p5._0;
					var _p8 = _p5._1;
					if ((_elm_lang$core$Native_Utils.cmp(_p9, 0) > -1) && (_elm_lang$core$Native_Utils.cmp(_p9, 55295) < 1)) {
						var _v3 = _p8,
							_v4 = {ctor: '::', _0: _p9, _1: accumulated};
						codeUnits = _v3;
						accumulated = _v4;
						continue combineAndReverse;
					} else {
						if ((_elm_lang$core$Native_Utils.cmp(_p9, 55296) > -1) && (_elm_lang$core$Native_Utils.cmp(_p9, 56319) < 1)) {
							var _p6 = _p8;
							if (_p6.ctor === '[]') {
								return {ctor: '::', _0: _elm_community$string_extra$String_Extra$replacementCodePoint, _1: accumulated};
							} else {
								var _p7 = _p6._0;
								if ((_elm_lang$core$Native_Utils.cmp(_p7, 56320) > -1) && (_elm_lang$core$Native_Utils.cmp(_p7, 57343) < 1)) {
									var codePoint = (65536 + ((_p9 - 55296) * 1024)) + (_p7 - 56320);
									var _v6 = _p6._1,
										_v7 = {ctor: '::', _0: codePoint, _1: accumulated};
									codeUnits = _v6;
									accumulated = _v7;
									continue combineAndReverse;
								} else {
									var _v8 = _p8,
										_v9 = {ctor: '::', _0: _elm_community$string_extra$String_Extra$replacementCodePoint, _1: accumulated};
									codeUnits = _v8;
									accumulated = _v9;
									continue combineAndReverse;
								}
							}
						} else {
							if ((_elm_lang$core$Native_Utils.cmp(_p9, 57344) > -1) && (_elm_lang$core$Native_Utils.cmp(_p9, 65535) < 1)) {
								var _v10 = _p8,
									_v11 = {ctor: '::', _0: _p9, _1: accumulated};
								codeUnits = _v10;
								accumulated = _v11;
								continue combineAndReverse;
							} else {
								var _v12 = _p8,
									_v13 = {ctor: '::', _0: _elm_community$string_extra$String_Extra$replacementCodePoint, _1: accumulated};
								codeUnits = _v12;
								accumulated = _v13;
								continue combineAndReverse;
							}
						}
					}
				}
			}
		});
	return _elm_lang$core$List$reverse(
		A2(
			combineAndReverse,
			allCodeUnits,
			{ctor: '[]'}));
};
var _elm_community$string_extra$String_Extra$fromCodePoints = function (allCodePoints) {
	var splitAndReverse = F2(
		function (codePoints, accumulated) {
			splitAndReverse:
			while (true) {
				var _p10 = codePoints;
				if (_p10.ctor === '[]') {
					return accumulated;
				} else {
					var _p12 = _p10._1;
					var _p11 = _p10._0;
					if ((_elm_lang$core$Native_Utils.cmp(_p11, 0) > -1) && (_elm_lang$core$Native_Utils.cmp(_p11, 55295) < 1)) {
						var _v15 = _p12,
							_v16 = {ctor: '::', _0: _p11, _1: accumulated};
						codePoints = _v15;
						accumulated = _v16;
						continue splitAndReverse;
					} else {
						if ((_elm_lang$core$Native_Utils.cmp(_p11, 65536) > -1) && (_elm_lang$core$Native_Utils.cmp(_p11, 1114111) < 1)) {
							var subtracted = _p11 - 65536;
							var leading = (subtracted >> 10) + 55296;
							var trailing = (subtracted & 1023) + 56320;
							var _v17 = _p12,
								_v18 = {
								ctor: '::',
								_0: trailing,
								_1: {ctor: '::', _0: leading, _1: accumulated}
							};
							codePoints = _v17;
							accumulated = _v18;
							continue splitAndReverse;
						} else {
							if ((_elm_lang$core$Native_Utils.cmp(_p11, 57344) > -1) && (_elm_lang$core$Native_Utils.cmp(_p11, 65535) < 1)) {
								var _v19 = _p12,
									_v20 = {ctor: '::', _0: _p11, _1: accumulated};
								codePoints = _v19;
								accumulated = _v20;
								continue splitAndReverse;
							} else {
								var _v21 = _p12,
									_v22 = {ctor: '::', _0: _elm_community$string_extra$String_Extra$replacementCodePoint, _1: accumulated};
								codePoints = _v21;
								accumulated = _v22;
								continue splitAndReverse;
							}
						}
					}
				}
			}
		});
	var allCodeUnits = _elm_lang$core$List$reverse(
		A2(
			splitAndReverse,
			allCodePoints,
			{ctor: '[]'}));
	return _elm_lang$core$String$fromList(
		A2(_elm_lang$core$List$map, _elm_lang$core$Char$fromCode, allCodeUnits));
};
var _elm_community$string_extra$String_Extra$fromFloat = _elm_lang$core$Basics$toString;
var _elm_community$string_extra$String_Extra$fromInt = _elm_lang$core$Basics$toString;
var _elm_community$string_extra$String_Extra$leftOfBack = F2(
	function (pattern, string) {
		return A2(
			_elm_lang$core$Maybe$withDefault,
			'',
			A2(
				_elm_lang$core$Maybe$map,
				A2(_elm_lang$core$Basics$flip, _elm_lang$core$String$left, string),
				_elm_lang$core$List$head(
					_elm_lang$core$List$reverse(
						A2(_elm_lang$core$String$indexes, pattern, string)))));
	});
var _elm_community$string_extra$String_Extra$rightOfBack = F2(
	function (pattern, string) {
		return A2(
			_elm_lang$core$Maybe$withDefault,
			'',
			A2(
				_elm_lang$core$Maybe$map,
				function (_p13) {
					return A3(
						_elm_lang$core$Basics$flip,
						_elm_lang$core$String$dropLeft,
						string,
						A2(
							F2(
								function (x, y) {
									return x + y;
								}),
							_elm_lang$core$String$length(pattern),
							_p13));
				},
				_elm_lang$core$List$head(
					_elm_lang$core$List$reverse(
						A2(_elm_lang$core$String$indexes, pattern, string)))));
	});
var _elm_community$string_extra$String_Extra$firstResultHelp = F2(
	function ($default, list) {
		firstResultHelp:
		while (true) {
			var _p14 = list;
			if (_p14.ctor === '[]') {
				return $default;
			} else {
				if (_p14._0.ctor === 'Just') {
					return _p14._0._0;
				} else {
					var _v24 = $default,
						_v25 = _p14._1;
					$default = _v24;
					list = _v25;
					continue firstResultHelp;
				}
			}
		}
	});
var _elm_community$string_extra$String_Extra$firstResult = function (list) {
	return A2(_elm_community$string_extra$String_Extra$firstResultHelp, '', list);
};
var _elm_community$string_extra$String_Extra$leftOf = F2(
	function (pattern, string) {
		return A2(
			_elm_lang$core$String$join,
			'',
			A2(
				_elm_lang$core$List$map,
				function (_p15) {
					return _elm_community$string_extra$String_Extra$firstResult(
						function (_) {
							return _.submatches;
						}(_p15));
				},
				A3(
					_elm_lang$core$Regex$find,
					_elm_lang$core$Regex$AtMost(1),
					_elm_lang$core$Regex$regex(
						A2(
							_elm_lang$core$Basics_ops['++'],
							'^(.*?)',
							_elm_lang$core$Regex$escape(pattern))),
					string)));
	});
var _elm_community$string_extra$String_Extra$rightOf = F2(
	function (pattern, string) {
		return A2(
			_elm_lang$core$String$join,
			'',
			A2(
				_elm_lang$core$List$map,
				function (_p16) {
					return _elm_community$string_extra$String_Extra$firstResult(
						function (_) {
							return _.submatches;
						}(_p16));
				},
				A3(
					_elm_lang$core$Regex$find,
					_elm_lang$core$Regex$AtMost(1),
					_elm_lang$core$Regex$regex(
						A2(
							_elm_lang$core$Basics_ops['++'],
							_elm_lang$core$Regex$escape(pattern),
							'(.*)$')),
					string)));
	});
var _elm_community$string_extra$String_Extra$pluralize = F3(
	function (singular, plural, count) {
		return _elm_lang$core$Native_Utils.eq(count, 1) ? A2(_elm_lang$core$Basics_ops['++'], '1 ', singular) : A2(
			_elm_lang$core$Basics_ops['++'],
			_elm_lang$core$Basics$toString(count),
			A2(_elm_lang$core$Basics_ops['++'], ' ', plural));
	});
var _elm_community$string_extra$String_Extra$stripTags = function (string) {
	return A4(
		_elm_lang$core$Regex$replace,
		_elm_lang$core$Regex$All,
		_elm_lang$core$Regex$regex('<\\/?[^>]+>'),
		_elm_lang$core$Basics$always(''),
		string);
};
var _elm_community$string_extra$String_Extra$toSentenceHelper = F3(
	function (lastPart, sentence, list) {
		toSentenceHelper:
		while (true) {
			var _p17 = list;
			if (_p17.ctor === '[]') {
				return sentence;
			} else {
				if (_p17._1.ctor === '[]') {
					return A2(
						_elm_lang$core$Basics_ops['++'],
						sentence,
						A2(_elm_lang$core$Basics_ops['++'], lastPart, _p17._0));
				} else {
					var _v27 = lastPart,
						_v28 = A2(
						_elm_lang$core$Basics_ops['++'],
						sentence,
						A2(_elm_lang$core$Basics_ops['++'], ', ', _p17._0)),
						_v29 = _p17._1;
					lastPart = _v27;
					sentence = _v28;
					list = _v29;
					continue toSentenceHelper;
				}
			}
		}
	});
var _elm_community$string_extra$String_Extra$toSentenceBaseCase = function (list) {
	var _p18 = list;
	_v30_2:
	do {
		if (_p18.ctor === '::') {
			if (_p18._1.ctor === '[]') {
				return _p18._0;
			} else {
				if (_p18._1._1.ctor === '[]') {
					return A2(
						_elm_lang$core$Basics_ops['++'],
						_p18._0,
						A2(_elm_lang$core$Basics_ops['++'], ' and ', _p18._1._0));
				} else {
					break _v30_2;
				}
			}
		} else {
			break _v30_2;
		}
	} while(false);
	return '';
};
var _elm_community$string_extra$String_Extra$toSentenceOxford = function (list) {
	var _p19 = list;
	if (((_p19.ctor === '::') && (_p19._1.ctor === '::')) && (_p19._1._1.ctor === '::')) {
		return A3(
			_elm_community$string_extra$String_Extra$toSentenceHelper,
			', and ',
			A2(
				_elm_lang$core$Basics_ops['++'],
				_p19._0,
				A2(_elm_lang$core$Basics_ops['++'], ', ', _p19._1._0)),
			{ctor: '::', _0: _p19._1._1._0, _1: _p19._1._1._1});
	} else {
		return _elm_community$string_extra$String_Extra$toSentenceBaseCase(list);
	}
};
var _elm_community$string_extra$String_Extra$toSentence = function (list) {
	var _p20 = list;
	if (((_p20.ctor === '::') && (_p20._1.ctor === '::')) && (_p20._1._1.ctor === '::')) {
		return A3(
			_elm_community$string_extra$String_Extra$toSentenceHelper,
			' and ',
			A2(
				_elm_lang$core$Basics_ops['++'],
				_p20._0,
				A2(_elm_lang$core$Basics_ops['++'], ', ', _p20._1._0)),
			{ctor: '::', _0: _p20._1._1._0, _1: _p20._1._1._1});
	} else {
		return _elm_community$string_extra$String_Extra$toSentenceBaseCase(list);
	}
};
var _elm_community$string_extra$String_Extra$ellipsisWith = F3(
	function (howLong, append, string) {
		return (_elm_lang$core$Native_Utils.cmp(
			_elm_lang$core$String$length(string),
			howLong) < 1) ? string : A2(
			_elm_lang$core$Basics_ops['++'],
			A2(
				_elm_lang$core$String$left,
				howLong - _elm_lang$core$String$length(append),
				string),
			append);
	});
var _elm_community$string_extra$String_Extra$ellipsis = F2(
	function (howLong, string) {
		return A3(_elm_community$string_extra$String_Extra$ellipsisWith, howLong, '...', string);
	});
var _elm_community$string_extra$String_Extra$countOccurrences = F2(
	function (needle, haystack) {
		return (_elm_lang$core$Native_Utils.eq(
			_elm_lang$core$String$length(needle),
			0) || _elm_lang$core$Native_Utils.eq(
			_elm_lang$core$String$length(haystack),
			0)) ? 0 : _elm_lang$core$List$length(
			A2(_elm_lang$core$String$indexes, needle, haystack));
	});
var _elm_community$string_extra$String_Extra$unindent = function (multilineSting) {
	var isNotWhitespace = function ($char) {
		return (!_elm_lang$core$Native_Utils.eq(
			$char,
			_elm_lang$core$Native_Utils.chr(' '))) && (!_elm_lang$core$Native_Utils.eq(
			$char,
			_elm_lang$core$Native_Utils.chr('\t')));
	};
	var countLeadingWhitespace = F2(
		function (count, line) {
			countLeadingWhitespace:
			while (true) {
				var _p21 = _elm_lang$core$String$uncons(line);
				if (_p21.ctor === 'Nothing') {
					return count;
				} else {
					var _p23 = _p21._0._1;
					var _p22 = _p21._0._0;
					switch (_p22.valueOf()) {
						case ' ':
							var _v35 = count + 1,
								_v36 = _p23;
							count = _v35;
							line = _v36;
							continue countLeadingWhitespace;
						case '\t':
							var _v37 = count + 1,
								_v38 = _p23;
							count = _v37;
							line = _v38;
							continue countLeadingWhitespace;
						default:
							return count;
					}
				}
			}
		});
	var lines = _elm_lang$core$String$lines(multilineSting);
	var minLead = A2(
		_elm_lang$core$Maybe$withDefault,
		0,
		_elm_lang$core$List$minimum(
			A2(
				_elm_lang$core$List$map,
				countLeadingWhitespace(0),
				A2(
					_elm_lang$core$List$filter,
					_elm_lang$core$String$any(isNotWhitespace),
					lines))));
	return A2(
		_elm_lang$core$String$join,
		'\n',
		A2(
			_elm_lang$core$List$map,
			_elm_lang$core$String$dropLeft(minLead),
			lines));
};
var _elm_community$string_extra$String_Extra$dasherize = function (string) {
	return _elm_lang$core$String$toLower(
		A4(
			_elm_lang$core$Regex$replace,
			_elm_lang$core$Regex$All,
			_elm_lang$core$Regex$regex('[_-\\s]+'),
			_elm_lang$core$Basics$always('-'),
			A4(
				_elm_lang$core$Regex$replace,
				_elm_lang$core$Regex$All,
				_elm_lang$core$Regex$regex('([A-Z])'),
				function (_p24) {
					return A2(
						_elm_lang$core$String$append,
						'-',
						function (_) {
							return _.match;
						}(_p24));
				},
				_elm_lang$core$String$trim(string))));
};
var _elm_community$string_extra$String_Extra$underscored = function (string) {
	return _elm_lang$core$String$toLower(
		A4(
			_elm_lang$core$Regex$replace,
			_elm_lang$core$Regex$All,
			_elm_lang$core$Regex$regex('[_-\\s]+'),
			_elm_lang$core$Basics$always('_'),
			A4(
				_elm_lang$core$Regex$replace,
				_elm_lang$core$Regex$All,
				_elm_lang$core$Regex$regex('([a-z\\d])([A-Z]+)'),
				function (_p25) {
					return A2(
						_elm_lang$core$String$join,
						'_',
						A2(
							_elm_lang$core$List$filterMap,
							_elm_lang$core$Basics$identity,
							function (_) {
								return _.submatches;
							}(_p25)));
				},
				_elm_lang$core$String$trim(string))));
};
var _elm_community$string_extra$String_Extra$unsurround = F2(
	function (wrap, string) {
		if (A2(_elm_lang$core$String$startsWith, wrap, string) && A2(_elm_lang$core$String$endsWith, wrap, string)) {
			var length = _elm_lang$core$String$length(wrap);
			return A2(
				_elm_lang$core$String$dropRight,
				length,
				A2(_elm_lang$core$String$dropLeft, length, string));
		} else {
			return string;
		}
	});
var _elm_community$string_extra$String_Extra$unquote = function (string) {
	return A2(_elm_community$string_extra$String_Extra$unsurround, '\"', string);
};
var _elm_community$string_extra$String_Extra$surround = F2(
	function (wrap, string) {
		return A2(
			_elm_lang$core$Basics_ops['++'],
			wrap,
			A2(_elm_lang$core$Basics_ops['++'], string, wrap));
	});
var _elm_community$string_extra$String_Extra$quote = function (string) {
	return A2(_elm_community$string_extra$String_Extra$surround, '\"', string);
};
var _elm_community$string_extra$String_Extra$camelize = function (string) {
	return A4(
		_elm_lang$core$Regex$replace,
		_elm_lang$core$Regex$All,
		_elm_lang$core$Regex$regex('[-_\\s]+(.)?'),
		function (_p26) {
			var _p27 = _p26;
			var _p28 = _p27.submatches;
			if ((_p28.ctor === '::') && (_p28._0.ctor === 'Just')) {
				return _elm_lang$core$String$toUpper(_p28._0._0);
			} else {
				return '';
			}
		},
		_elm_lang$core$String$trim(string));
};
var _elm_community$string_extra$String_Extra$isBlank = function (string) {
	return A2(
		_elm_lang$core$Regex$contains,
		_elm_lang$core$Regex$regex('^\\s*$'),
		string);
};
var _elm_community$string_extra$String_Extra$nonBlank = function (string) {
	return _elm_community$string_extra$String_Extra$isBlank(string) ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$Maybe$Just(string);
};
var _elm_community$string_extra$String_Extra$clean = function (string) {
	return _elm_lang$core$String$trim(
		A4(
			_elm_lang$core$Regex$replace,
			_elm_lang$core$Regex$All,
			_elm_lang$core$Regex$regex('\\s\\s+'),
			_elm_lang$core$Basics$always(' '),
			string));
};
var _elm_community$string_extra$String_Extra$softBreakRegexp = function (width) {
	return _elm_lang$core$Regex$regex(
		A2(
			_elm_lang$core$Basics_ops['++'],
			'.{1,',
			A2(
				_elm_lang$core$Basics_ops['++'],
				_elm_lang$core$Basics$toString(width),
				'}(\\s+|$)|\\S+?(\\s+|$)')));
};
var _elm_community$string_extra$String_Extra$softEllipsis = F2(
	function (howLong, string) {
		return (_elm_lang$core$Native_Utils.cmp(
			_elm_lang$core$String$length(string),
			howLong) < 1) ? string : A3(
			_elm_lang$core$Basics$flip,
			_elm_lang$core$String$append,
			'...',
			A4(
				_elm_lang$core$Regex$replace,
				_elm_lang$core$Regex$All,
				_elm_lang$core$Regex$regex('([\\.,;:\\s])+$'),
				_elm_lang$core$Basics$always(''),
				A2(
					_elm_lang$core$String$join,
					'',
					A2(
						_elm_lang$core$List$map,
						function (_) {
							return _.match;
						},
						A3(
							_elm_lang$core$Regex$find,
							_elm_lang$core$Regex$AtMost(1),
							_elm_community$string_extra$String_Extra$softBreakRegexp(howLong),
							string)))));
	});
var _elm_community$string_extra$String_Extra$softBreak = F2(
	function (width, string) {
		return (_elm_lang$core$Native_Utils.cmp(width, 0) < 1) ? {ctor: '[]'} : A2(
			_elm_lang$core$List$map,
			function (_) {
				return _.match;
			},
			A3(
				_elm_lang$core$Regex$find,
				_elm_lang$core$Regex$All,
				_elm_community$string_extra$String_Extra$softBreakRegexp(width),
				string));
	});
var _elm_community$string_extra$String_Extra$softWrapWith = F3(
	function (width, separator, string) {
		return A2(
			_elm_lang$core$String$join,
			separator,
			A2(_elm_community$string_extra$String_Extra$softBreak, width, string));
	});
var _elm_community$string_extra$String_Extra$softWrap = F2(
	function (width, string) {
		return A3(_elm_community$string_extra$String_Extra$softWrapWith, width, '\n', string);
	});
var _elm_community$string_extra$String_Extra$breaker = F3(
	function (width, string, acc) {
		breaker:
		while (true) {
			var _p29 = string;
			if (_p29 === '') {
				return _elm_lang$core$List$reverse(acc);
			} else {
				var _v42 = width,
					_v43 = A2(_elm_lang$core$String$dropLeft, width, string),
					_v44 = {
					ctor: '::',
					_0: A3(_elm_lang$core$String$slice, 0, width, string),
					_1: acc
				};
				width = _v42;
				string = _v43;
				acc = _v44;
				continue breaker;
			}
		}
	});
var _elm_community$string_extra$String_Extra$break = F2(
	function (width, string) {
		return (_elm_lang$core$Native_Utils.eq(width, 0) || _elm_lang$core$Native_Utils.eq(string, '')) ? {
			ctor: '::',
			_0: string,
			_1: {ctor: '[]'}
		} : A3(
			_elm_community$string_extra$String_Extra$breaker,
			width,
			string,
			{ctor: '[]'});
	});
var _elm_community$string_extra$String_Extra$wrapWith = F3(
	function (width, separator, string) {
		return A2(
			_elm_lang$core$String$join,
			separator,
			A2(_elm_community$string_extra$String_Extra$break, width, string));
	});
var _elm_community$string_extra$String_Extra$wrap = F2(
	function (width, string) {
		return A3(_elm_community$string_extra$String_Extra$wrapWith, width, '\n', string);
	});
var _elm_community$string_extra$String_Extra$replaceSlice = F4(
	function (substitution, start, end, string) {
		return A2(
			_elm_lang$core$Basics_ops['++'],
			A3(_elm_lang$core$String$slice, 0, start, string),
			A2(
				_elm_lang$core$Basics_ops['++'],
				substitution,
				A3(
					_elm_lang$core$String$slice,
					end,
					_elm_lang$core$String$length(string),
					string)));
	});
var _elm_community$string_extra$String_Extra$insertAt = F3(
	function (insert, pos, string) {
		return A4(_elm_community$string_extra$String_Extra$replaceSlice, insert, pos, pos, string);
	});
var _elm_community$string_extra$String_Extra$replace = F3(
	function (search, substitution, string) {
		return A4(
			_elm_lang$core$Regex$replace,
			_elm_lang$core$Regex$All,
			_elm_lang$core$Regex$regex(
				_elm_lang$core$Regex$escape(search)),
			function (_p30) {
				return substitution;
			},
			string);
	});
var _elm_community$string_extra$String_Extra$changeCase = F2(
	function (mutator, word) {
		return A2(
			_elm_lang$core$Maybe$withDefault,
			'',
			A2(
				_elm_lang$core$Maybe$map,
				function (_p31) {
					var _p32 = _p31;
					return A2(
						_elm_lang$core$String$cons,
						mutator(_p32._0),
						_p32._1);
				},
				_elm_lang$core$String$uncons(word)));
	});
var _elm_community$string_extra$String_Extra$toSentenceCase = function (word) {
	return A2(_elm_community$string_extra$String_Extra$changeCase, _elm_lang$core$Char$toUpper, word);
};
var _elm_community$string_extra$String_Extra$toTitleCase = function (ws) {
	var uppercaseMatch = A3(
		_elm_lang$core$Regex$replace,
		_elm_lang$core$Regex$All,
		_elm_lang$core$Regex$regex('\\w+'),
		function (_p33) {
			return _elm_community$string_extra$String_Extra$toSentenceCase(
				function (_) {
					return _.match;
				}(_p33));
		});
	return A4(
		_elm_lang$core$Regex$replace,
		_elm_lang$core$Regex$All,
		_elm_lang$core$Regex$regex('^([a-z])|\\s+([a-z])'),
		function (_p34) {
			return uppercaseMatch(
				function (_) {
					return _.match;
				}(_p34));
		},
		ws);
};
var _elm_community$string_extra$String_Extra$classify = function (string) {
	return _elm_community$string_extra$String_Extra$toSentenceCase(
		A3(
			_elm_community$string_extra$String_Extra$replace,
			' ',
			'',
			_elm_community$string_extra$String_Extra$camelize(
				A4(
					_elm_lang$core$Regex$replace,
					_elm_lang$core$Regex$All,
					_elm_lang$core$Regex$regex('[\\W_]'),
					_elm_lang$core$Basics$always(' '),
					string))));
};
var _elm_community$string_extra$String_Extra$humanize = function (string) {
	return _elm_community$string_extra$String_Extra$toSentenceCase(
		_elm_lang$core$String$toLower(
			_elm_lang$core$String$trim(
				A4(
					_elm_lang$core$Regex$replace,
					_elm_lang$core$Regex$All,
					_elm_lang$core$Regex$regex('_id$|[-_\\s]+'),
					_elm_lang$core$Basics$always(' '),
					A4(
						_elm_lang$core$Regex$replace,
						_elm_lang$core$Regex$All,
						_elm_lang$core$Regex$regex('[A-Z]'),
						function (_p35) {
							return A2(
								_elm_lang$core$String$append,
								'-',
								function (_) {
									return _.match;
								}(_p35));
						},
						string)))));
};
var _elm_community$string_extra$String_Extra$decapitalize = function (word) {
	return A2(_elm_community$string_extra$String_Extra$changeCase, _elm_lang$core$Char$toLower, word);
};

var _elm_lang$core$Process$kill = _elm_lang$core$Native_Scheduler.kill;
var _elm_lang$core$Process$sleep = _elm_lang$core$Native_Scheduler.sleep;
var _elm_lang$core$Process$spawn = _elm_lang$core$Native_Scheduler.spawn;

var _elm_lang$dom$Native_Dom = function() {

var fakeNode = {
	addEventListener: function() {},
	removeEventListener: function() {}
};

var onDocument = on(typeof document !== 'undefined' ? document : fakeNode);
var onWindow = on(typeof window !== 'undefined' ? window : fakeNode);

function on(node)
{
	return function(eventName, decoder, toTask)
	{
		return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {

			function performTask(event)
			{
				var result = A2(_elm_lang$core$Json_Decode$decodeValue, decoder, event);
				if (result.ctor === 'Ok')
				{
					_elm_lang$core$Native_Scheduler.rawSpawn(toTask(result._0));
				}
			}

			node.addEventListener(eventName, performTask);

			return function()
			{
				node.removeEventListener(eventName, performTask);
			};
		});
	};
}

var rAF = typeof requestAnimationFrame !== 'undefined'
	? requestAnimationFrame
	: function(callback) { callback(); };

function withNode(id, doStuff)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		rAF(function()
		{
			var node = document.getElementById(id);
			if (node === null)
			{
				callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'NotFound', _0: id }));
				return;
			}
			callback(_elm_lang$core$Native_Scheduler.succeed(doStuff(node)));
		});
	});
}


// FOCUS

function focus(id)
{
	return withNode(id, function(node) {
		node.focus();
		return _elm_lang$core$Native_Utils.Tuple0;
	});
}

function blur(id)
{
	return withNode(id, function(node) {
		node.blur();
		return _elm_lang$core$Native_Utils.Tuple0;
	});
}


// SCROLLING

function getScrollTop(id)
{
	return withNode(id, function(node) {
		return node.scrollTop;
	});
}

function setScrollTop(id, desiredScrollTop)
{
	return withNode(id, function(node) {
		node.scrollTop = desiredScrollTop;
		return _elm_lang$core$Native_Utils.Tuple0;
	});
}

function toBottom(id)
{
	return withNode(id, function(node) {
		node.scrollTop = node.scrollHeight;
		return _elm_lang$core$Native_Utils.Tuple0;
	});
}

function getScrollLeft(id)
{
	return withNode(id, function(node) {
		return node.scrollLeft;
	});
}

function setScrollLeft(id, desiredScrollLeft)
{
	return withNode(id, function(node) {
		node.scrollLeft = desiredScrollLeft;
		return _elm_lang$core$Native_Utils.Tuple0;
	});
}

function toRight(id)
{
	return withNode(id, function(node) {
		node.scrollLeft = node.scrollWidth;
		return _elm_lang$core$Native_Utils.Tuple0;
	});
}


// SIZE

function width(options, id)
{
	return withNode(id, function(node) {
		switch (options.ctor)
		{
			case 'Content':
				return node.scrollWidth;
			case 'VisibleContent':
				return node.clientWidth;
			case 'VisibleContentWithBorders':
				return node.offsetWidth;
			case 'VisibleContentWithBordersAndMargins':
				var rect = node.getBoundingClientRect();
				return rect.right - rect.left;
		}
	});
}

function height(options, id)
{
	return withNode(id, function(node) {
		switch (options.ctor)
		{
			case 'Content':
				return node.scrollHeight;
			case 'VisibleContent':
				return node.clientHeight;
			case 'VisibleContentWithBorders':
				return node.offsetHeight;
			case 'VisibleContentWithBordersAndMargins':
				var rect = node.getBoundingClientRect();
				return rect.bottom - rect.top;
		}
	});
}

return {
	onDocument: F3(onDocument),
	onWindow: F3(onWindow),

	focus: focus,
	blur: blur,

	getScrollTop: getScrollTop,
	setScrollTop: F2(setScrollTop),
	getScrollLeft: getScrollLeft,
	setScrollLeft: F2(setScrollLeft),
	toBottom: toBottom,
	toRight: toRight,

	height: F2(height),
	width: F2(width)
};

}();

var _elm_lang$dom$Dom$blur = _elm_lang$dom$Native_Dom.blur;
var _elm_lang$dom$Dom$focus = _elm_lang$dom$Native_Dom.focus;
var _elm_lang$dom$Dom$NotFound = function (a) {
	return {ctor: 'NotFound', _0: a};
};

var _elm_lang$dom$Dom_LowLevel$onWindow = _elm_lang$dom$Native_Dom.onWindow;
var _elm_lang$dom$Dom_LowLevel$onDocument = _elm_lang$dom$Native_Dom.onDocument;

var _elm_lang$dom$Dom_Size$width = _elm_lang$dom$Native_Dom.width;
var _elm_lang$dom$Dom_Size$height = _elm_lang$dom$Native_Dom.height;
var _elm_lang$dom$Dom_Size$VisibleContentWithBordersAndMargins = {ctor: 'VisibleContentWithBordersAndMargins'};
var _elm_lang$dom$Dom_Size$VisibleContentWithBorders = {ctor: 'VisibleContentWithBorders'};
var _elm_lang$dom$Dom_Size$VisibleContent = {ctor: 'VisibleContent'};
var _elm_lang$dom$Dom_Size$Content = {ctor: 'Content'};

var _elm_lang$dom$Dom_Scroll$toX = _elm_lang$dom$Native_Dom.setScrollLeft;
var _elm_lang$dom$Dom_Scroll$x = _elm_lang$dom$Native_Dom.getScrollLeft;
var _elm_lang$dom$Dom_Scroll$toRight = _elm_lang$dom$Native_Dom.toRight;
var _elm_lang$dom$Dom_Scroll$toLeft = function (id) {
	return A2(_elm_lang$dom$Dom_Scroll$toX, id, 0);
};
var _elm_lang$dom$Dom_Scroll$toY = _elm_lang$dom$Native_Dom.setScrollTop;
var _elm_lang$dom$Dom_Scroll$y = _elm_lang$dom$Native_Dom.getScrollTop;
var _elm_lang$dom$Dom_Scroll$toBottom = _elm_lang$dom$Native_Dom.toBottom;
var _elm_lang$dom$Dom_Scroll$toTop = function (id) {
	return A2(_elm_lang$dom$Dom_Scroll$toY, id, 0);
};

var _elm_lang$virtual_dom$VirtualDom_Debug$wrap;
var _elm_lang$virtual_dom$VirtualDom_Debug$wrapWithFlags;

var _elm_lang$virtual_dom$Native_VirtualDom = function() {

var STYLE_KEY = 'STYLE';
var EVENT_KEY = 'EVENT';
var ATTR_KEY = 'ATTR';
var ATTR_NS_KEY = 'ATTR_NS';

var localDoc = typeof document !== 'undefined' ? document : {};


////////////  VIRTUAL DOM NODES  ////////////


function text(string)
{
	return {
		type: 'text',
		text: string
	};
}


function node(tag)
{
	return F2(function(factList, kidList) {
		return nodeHelp(tag, factList, kidList);
	});
}


function nodeHelp(tag, factList, kidList)
{
	var organized = organizeFacts(factList);
	var namespace = organized.namespace;
	var facts = organized.facts;

	var children = [];
	var descendantsCount = 0;
	while (kidList.ctor !== '[]')
	{
		var kid = kidList._0;
		descendantsCount += (kid.descendantsCount || 0);
		children.push(kid);
		kidList = kidList._1;
	}
	descendantsCount += children.length;

	return {
		type: 'node',
		tag: tag,
		facts: facts,
		children: children,
		namespace: namespace,
		descendantsCount: descendantsCount
	};
}


function keyedNode(tag, factList, kidList)
{
	var organized = organizeFacts(factList);
	var namespace = organized.namespace;
	var facts = organized.facts;

	var children = [];
	var descendantsCount = 0;
	while (kidList.ctor !== '[]')
	{
		var kid = kidList._0;
		descendantsCount += (kid._1.descendantsCount || 0);
		children.push(kid);
		kidList = kidList._1;
	}
	descendantsCount += children.length;

	return {
		type: 'keyed-node',
		tag: tag,
		facts: facts,
		children: children,
		namespace: namespace,
		descendantsCount: descendantsCount
	};
}


function custom(factList, model, impl)
{
	var facts = organizeFacts(factList).facts;

	return {
		type: 'custom',
		facts: facts,
		model: model,
		impl: impl
	};
}


function map(tagger, node)
{
	return {
		type: 'tagger',
		tagger: tagger,
		node: node,
		descendantsCount: 1 + (node.descendantsCount || 0)
	};
}


function thunk(func, args, thunk)
{
	return {
		type: 'thunk',
		func: func,
		args: args,
		thunk: thunk,
		node: undefined
	};
}

function lazy(fn, a)
{
	return thunk(fn, [a], function() {
		return fn(a);
	});
}

function lazy2(fn, a, b)
{
	return thunk(fn, [a,b], function() {
		return A2(fn, a, b);
	});
}

function lazy3(fn, a, b, c)
{
	return thunk(fn, [a,b,c], function() {
		return A3(fn, a, b, c);
	});
}



// FACTS


function organizeFacts(factList)
{
	var namespace, facts = {};

	while (factList.ctor !== '[]')
	{
		var entry = factList._0;
		var key = entry.key;

		if (key === ATTR_KEY || key === ATTR_NS_KEY || key === EVENT_KEY)
		{
			var subFacts = facts[key] || {};
			subFacts[entry.realKey] = entry.value;
			facts[key] = subFacts;
		}
		else if (key === STYLE_KEY)
		{
			var styles = facts[key] || {};
			var styleList = entry.value;
			while (styleList.ctor !== '[]')
			{
				var style = styleList._0;
				styles[style._0] = style._1;
				styleList = styleList._1;
			}
			facts[key] = styles;
		}
		else if (key === 'namespace')
		{
			namespace = entry.value;
		}
		else if (key === 'className')
		{
			var classes = facts[key];
			facts[key] = typeof classes === 'undefined'
				? entry.value
				: classes + ' ' + entry.value;
		}
 		else
		{
			facts[key] = entry.value;
		}
		factList = factList._1;
	}

	return {
		facts: facts,
		namespace: namespace
	};
}



////////////  PROPERTIES AND ATTRIBUTES  ////////////


function style(value)
{
	return {
		key: STYLE_KEY,
		value: value
	};
}


function property(key, value)
{
	return {
		key: key,
		value: value
	};
}


function attribute(key, value)
{
	return {
		key: ATTR_KEY,
		realKey: key,
		value: value
	};
}


function attributeNS(namespace, key, value)
{
	return {
		key: ATTR_NS_KEY,
		realKey: key,
		value: {
			value: value,
			namespace: namespace
		}
	};
}


function on(name, options, decoder)
{
	return {
		key: EVENT_KEY,
		realKey: name,
		value: {
			options: options,
			decoder: decoder
		}
	};
}


function equalEvents(a, b)
{
	if (a.options !== b.options)
	{
		if (a.options.stopPropagation !== b.options.stopPropagation || a.options.preventDefault !== b.options.preventDefault)
		{
			return false;
		}
	}
	return _elm_lang$core$Native_Json.equality(a.decoder, b.decoder);
}


function mapProperty(func, property)
{
	if (property.key !== EVENT_KEY)
	{
		return property;
	}
	return on(
		property.realKey,
		property.value.options,
		A2(_elm_lang$core$Json_Decode$map, func, property.value.decoder)
	);
}


////////////  RENDER  ////////////


function render(vNode, eventNode)
{
	switch (vNode.type)
	{
		case 'thunk':
			if (!vNode.node)
			{
				vNode.node = vNode.thunk();
			}
			return render(vNode.node, eventNode);

		case 'tagger':
			var subNode = vNode.node;
			var tagger = vNode.tagger;

			while (subNode.type === 'tagger')
			{
				typeof tagger !== 'object'
					? tagger = [tagger, subNode.tagger]
					: tagger.push(subNode.tagger);

				subNode = subNode.node;
			}

			var subEventRoot = { tagger: tagger, parent: eventNode };
			var domNode = render(subNode, subEventRoot);
			domNode.elm_event_node_ref = subEventRoot;
			return domNode;

		case 'text':
			return localDoc.createTextNode(vNode.text);

		case 'node':
			var domNode = vNode.namespace
				? localDoc.createElementNS(vNode.namespace, vNode.tag)
				: localDoc.createElement(vNode.tag);

			applyFacts(domNode, eventNode, vNode.facts);

			var children = vNode.children;

			for (var i = 0; i < children.length; i++)
			{
				domNode.appendChild(render(children[i], eventNode));
			}

			return domNode;

		case 'keyed-node':
			var domNode = vNode.namespace
				? localDoc.createElementNS(vNode.namespace, vNode.tag)
				: localDoc.createElement(vNode.tag);

			applyFacts(domNode, eventNode, vNode.facts);

			var children = vNode.children;

			for (var i = 0; i < children.length; i++)
			{
				domNode.appendChild(render(children[i]._1, eventNode));
			}

			return domNode;

		case 'custom':
			var domNode = vNode.impl.render(vNode.model);
			applyFacts(domNode, eventNode, vNode.facts);
			return domNode;
	}
}



////////////  APPLY FACTS  ////////////


function applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		switch (key)
		{
			case STYLE_KEY:
				applyStyles(domNode, value);
				break;

			case EVENT_KEY:
				applyEvents(domNode, eventNode, value);
				break;

			case ATTR_KEY:
				applyAttrs(domNode, value);
				break;

			case ATTR_NS_KEY:
				applyAttrsNS(domNode, value);
				break;

			case 'value':
				if (domNode[key] !== value)
				{
					domNode[key] = value;
				}
				break;

			default:
				domNode[key] = value;
				break;
		}
	}
}

function applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}

function applyEvents(domNode, eventNode, events)
{
	var allHandlers = domNode.elm_handlers || {};

	for (var key in events)
	{
		var handler = allHandlers[key];
		var value = events[key];

		if (typeof value === 'undefined')
		{
			domNode.removeEventListener(key, handler);
			allHandlers[key] = undefined;
		}
		else if (typeof handler === 'undefined')
		{
			var handler = makeEventHandler(eventNode, value);
			domNode.addEventListener(key, handler);
			allHandlers[key] = handler;
		}
		else
		{
			handler.info = value;
		}
	}

	domNode.elm_handlers = allHandlers;
}

function makeEventHandler(eventNode, info)
{
	function eventHandler(event)
	{
		var info = eventHandler.info;

		var value = A2(_elm_lang$core$Native_Json.run, info.decoder, event);

		if (value.ctor === 'Ok')
		{
			var options = info.options;
			if (options.stopPropagation)
			{
				event.stopPropagation();
			}
			if (options.preventDefault)
			{
				event.preventDefault();
			}

			var message = value._0;

			var currentEventNode = eventNode;
			while (currentEventNode)
			{
				var tagger = currentEventNode.tagger;
				if (typeof tagger === 'function')
				{
					message = tagger(message);
				}
				else
				{
					for (var i = tagger.length; i--; )
					{
						message = tagger[i](message);
					}
				}
				currentEventNode = currentEventNode.parent;
			}
		}
	};

	eventHandler.info = info;

	return eventHandler;
}

function applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		if (typeof value === 'undefined')
		{
			domNode.removeAttribute(key);
		}
		else
		{
			domNode.setAttribute(key, value);
		}
	}
}

function applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.namespace;
		var value = pair.value;

		if (typeof value === 'undefined')
		{
			domNode.removeAttributeNS(namespace, key);
		}
		else
		{
			domNode.setAttributeNS(namespace, key, value);
		}
	}
}



////////////  DIFF  ////////////


function diff(a, b)
{
	var patches = [];
	diffHelp(a, b, patches, 0);
	return patches;
}


function makePatch(type, index, data)
{
	return {
		index: index,
		type: type,
		data: data,
		domNode: undefined,
		eventNode: undefined
	};
}


function diffHelp(a, b, patches, index)
{
	if (a === b)
	{
		return;
	}

	var aType = a.type;
	var bType = b.type;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (aType !== bType)
	{
		patches.push(makePatch('p-redraw', index, b));
		return;
	}

	// Now we know that both nodes are the same type.
	switch (bType)
	{
		case 'thunk':
			var aArgs = a.args;
			var bArgs = b.args;
			var i = aArgs.length;
			var same = a.func === b.func && i === bArgs.length;
			while (same && i--)
			{
				same = aArgs[i] === bArgs[i];
			}
			if (same)
			{
				b.node = a.node;
				return;
			}
			b.node = b.thunk();
			var subPatches = [];
			diffHelp(a.node, b.node, subPatches, 0);
			if (subPatches.length > 0)
			{
				patches.push(makePatch('p-thunk', index, subPatches));
			}
			return;

		case 'tagger':
			// gather nested taggers
			var aTaggers = a.tagger;
			var bTaggers = b.tagger;
			var nesting = false;

			var aSubNode = a.node;
			while (aSubNode.type === 'tagger')
			{
				nesting = true;

				typeof aTaggers !== 'object'
					? aTaggers = [aTaggers, aSubNode.tagger]
					: aTaggers.push(aSubNode.tagger);

				aSubNode = aSubNode.node;
			}

			var bSubNode = b.node;
			while (bSubNode.type === 'tagger')
			{
				nesting = true;

				typeof bTaggers !== 'object'
					? bTaggers = [bTaggers, bSubNode.tagger]
					: bTaggers.push(bSubNode.tagger);

				bSubNode = bSubNode.node;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && aTaggers.length !== bTaggers.length)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !pairwiseRefEqual(aTaggers, bTaggers) : aTaggers !== bTaggers)
			{
				patches.push(makePatch('p-tagger', index, bTaggers));
			}

			// diff everything below the taggers
			diffHelp(aSubNode, bSubNode, patches, index + 1);
			return;

		case 'text':
			if (a.text !== b.text)
			{
				patches.push(makePatch('p-text', index, b.text));
				return;
			}

			return;

		case 'node':
			// Bail if obvious indicators have changed. Implies more serious
			// structural changes such that it's not worth it to diff.
			if (a.tag !== b.tag || a.namespace !== b.namespace)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);

			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			diffChildren(a, b, patches, index);
			return;

		case 'keyed-node':
			// Bail if obvious indicators have changed. Implies more serious
			// structural changes such that it's not worth it to diff.
			if (a.tag !== b.tag || a.namespace !== b.namespace)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);

			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			diffKeyedChildren(a, b, patches, index);
			return;

		case 'custom':
			if (a.impl !== b.impl)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);
			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			var patch = b.impl.diff(a,b);
			if (patch)
			{
				patches.push(makePatch('p-custom', index, patch));
				return;
			}

			return;
	}
}


// assumes the incoming arrays are the same length
function pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function diffFacts(a, b, category)
{
	var diff;

	// look for changes and removals
	for (var aKey in a)
	{
		if (aKey === STYLE_KEY || aKey === EVENT_KEY || aKey === ATTR_KEY || aKey === ATTR_NS_KEY)
		{
			var subDiff = diffFacts(a[aKey], b[aKey] || {}, aKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[aKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(aKey in b))
		{
			diff = diff || {};
			diff[aKey] =
				(typeof category === 'undefined')
					? (typeof a[aKey] === 'string' ? '' : null)
					:
				(category === STYLE_KEY)
					? ''
					:
				(category === EVENT_KEY || category === ATTR_KEY)
					? undefined
					:
				{ namespace: a[aKey].namespace, value: undefined };

			continue;
		}

		var aValue = a[aKey];
		var bValue = b[aKey];

		// reference equal, so don't worry about it
		if (aValue === bValue && aKey !== 'value'
			|| category === EVENT_KEY && equalEvents(aValue, bValue))
		{
			continue;
		}

		diff = diff || {};
		diff[aKey] = bValue;
	}

	// add new stuff
	for (var bKey in b)
	{
		if (!(bKey in a))
		{
			diff = diff || {};
			diff[bKey] = b[bKey];
		}
	}

	return diff;
}


function diffChildren(aParent, bParent, patches, rootIndex)
{
	var aChildren = aParent.children;
	var bChildren = bParent.children;

	var aLen = aChildren.length;
	var bLen = bChildren.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (aLen > bLen)
	{
		patches.push(makePatch('p-remove-last', rootIndex, aLen - bLen));
	}
	else if (aLen < bLen)
	{
		patches.push(makePatch('p-append', rootIndex, bChildren.slice(aLen)));
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	var index = rootIndex;
	var minLen = aLen < bLen ? aLen : bLen;
	for (var i = 0; i < minLen; i++)
	{
		index++;
		var aChild = aChildren[i];
		diffHelp(aChild, bChildren[i], patches, index);
		index += aChild.descendantsCount || 0;
	}
}



////////////  KEYED DIFF  ////////////


function diffKeyedChildren(aParent, bParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var aChildren = aParent.children;
	var bChildren = bParent.children;
	var aLen = aChildren.length;
	var bLen = bChildren.length;
	var aIndex = 0;
	var bIndex = 0;

	var index = rootIndex;

	while (aIndex < aLen && bIndex < bLen)
	{
		var a = aChildren[aIndex];
		var b = bChildren[bIndex];

		var aKey = a._0;
		var bKey = b._0;
		var aNode = a._1;
		var bNode = b._1;

		// check if keys match

		if (aKey === bKey)
		{
			index++;
			diffHelp(aNode, bNode, localPatches, index);
			index += aNode.descendantsCount || 0;

			aIndex++;
			bIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var aLookAhead = aIndex + 1 < aLen;
		var bLookAhead = bIndex + 1 < bLen;

		if (aLookAhead)
		{
			var aNext = aChildren[aIndex + 1];
			var aNextKey = aNext._0;
			var aNextNode = aNext._1;
			var oldMatch = bKey === aNextKey;
		}

		if (bLookAhead)
		{
			var bNext = bChildren[bIndex + 1];
			var bNextKey = bNext._0;
			var bNextNode = bNext._1;
			var newMatch = aKey === bNextKey;
		}


		// swap a and b
		if (aLookAhead && bLookAhead && newMatch && oldMatch)
		{
			index++;
			diffHelp(aNode, bNextNode, localPatches, index);
			insertNode(changes, localPatches, aKey, bNode, bIndex, inserts);
			index += aNode.descendantsCount || 0;

			index++;
			removeNode(changes, localPatches, aKey, aNextNode, index);
			index += aNextNode.descendantsCount || 0;

			aIndex += 2;
			bIndex += 2;
			continue;
		}

		// insert b
		if (bLookAhead && newMatch)
		{
			index++;
			insertNode(changes, localPatches, bKey, bNode, bIndex, inserts);
			diffHelp(aNode, bNextNode, localPatches, index);
			index += aNode.descendantsCount || 0;

			aIndex += 1;
			bIndex += 2;
			continue;
		}

		// remove a
		if (aLookAhead && oldMatch)
		{
			index++;
			removeNode(changes, localPatches, aKey, aNode, index);
			index += aNode.descendantsCount || 0;

			index++;
			diffHelp(aNextNode, bNode, localPatches, index);
			index += aNextNode.descendantsCount || 0;

			aIndex += 2;
			bIndex += 1;
			continue;
		}

		// remove a, insert b
		if (aLookAhead && bLookAhead && aNextKey === bNextKey)
		{
			index++;
			removeNode(changes, localPatches, aKey, aNode, index);
			insertNode(changes, localPatches, bKey, bNode, bIndex, inserts);
			index += aNode.descendantsCount || 0;

			index++;
			diffHelp(aNextNode, bNextNode, localPatches, index);
			index += aNextNode.descendantsCount || 0;

			aIndex += 2;
			bIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (aIndex < aLen)
	{
		index++;
		var a = aChildren[aIndex];
		var aNode = a._1;
		removeNode(changes, localPatches, a._0, aNode, index);
		index += aNode.descendantsCount || 0;
		aIndex++;
	}

	var endInserts;
	while (bIndex < bLen)
	{
		endInserts = endInserts || [];
		var b = bChildren[bIndex];
		insertNode(changes, localPatches, b._0, b._1, undefined, endInserts);
		bIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || typeof endInserts !== 'undefined')
	{
		patches.push(makePatch('p-reorder', rootIndex, {
			patches: localPatches,
			inserts: inserts,
			endInserts: endInserts
		}));
	}
}



////////////  CHANGES FROM KEYED DIFF  ////////////


var POSTFIX = '_elmW6BL';


function insertNode(changes, localPatches, key, vnode, bIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (typeof entry === 'undefined')
	{
		entry = {
			tag: 'insert',
			vnode: vnode,
			index: bIndex,
			data: undefined
		};

		inserts.push({ index: bIndex, entry: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.tag === 'remove')
	{
		inserts.push({ index: bIndex, entry: entry });

		entry.tag = 'move';
		var subPatches = [];
		diffHelp(entry.vnode, vnode, subPatches, entry.index);
		entry.index = bIndex;
		entry.data.data = {
			patches: subPatches,
			entry: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	insertNode(changes, localPatches, key + POSTFIX, vnode, bIndex, inserts);
}


function removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (typeof entry === 'undefined')
	{
		var patch = makePatch('p-remove', index, undefined);
		localPatches.push(patch);

		changes[key] = {
			tag: 'remove',
			vnode: vnode,
			index: index,
			data: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.tag === 'insert')
	{
		entry.tag = 'move';
		var subPatches = [];
		diffHelp(vnode, entry.vnode, subPatches, index);

		var patch = makePatch('p-remove', index, {
			patches: subPatches,
			entry: entry
		});
		localPatches.push(patch);

		return;
	}

	// this key has already been removed or moved, a duplicate!
	removeNode(changes, localPatches, key + POSTFIX, vnode, index);
}



////////////  ADD DOM NODES  ////////////
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function addDomNodes(domNode, vNode, patches, eventNode)
{
	addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.descendantsCount, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.index;

	while (index === low)
	{
		var patchType = patch.type;

		if (patchType === 'p-thunk')
		{
			addDomNodes(domNode, vNode.node, patch.data, eventNode);
		}
		else if (patchType === 'p-reorder')
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;

			var subPatches = patch.data.patches;
			if (subPatches.length > 0)
			{
				addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 'p-remove')
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;

			var data = patch.data;
			if (typeof data !== 'undefined')
			{
				data.entry.data = domNode;
				var subPatches = data.patches;
				if (subPatches.length > 0)
				{
					addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.index) > high)
		{
			return i;
		}
	}

	switch (vNode.type)
	{
		case 'tagger':
			var subNode = vNode.node;

			while (subNode.type === "tagger")
			{
				subNode = subNode.node;
			}

			return addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);

		case 'node':
			var vChildren = vNode.children;
			var childNodes = domNode.childNodes;
			for (var j = 0; j < vChildren.length; j++)
			{
				low++;
				var vChild = vChildren[j];
				var nextLow = low + (vChild.descendantsCount || 0);
				if (low <= index && index <= nextLow)
				{
					i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
					if (!(patch = patches[i]) || (index = patch.index) > high)
					{
						return i;
					}
				}
				low = nextLow;
			}
			return i;

		case 'keyed-node':
			var vChildren = vNode.children;
			var childNodes = domNode.childNodes;
			for (var j = 0; j < vChildren.length; j++)
			{
				low++;
				var vChild = vChildren[j]._1;
				var nextLow = low + (vChild.descendantsCount || 0);
				if (low <= index && index <= nextLow)
				{
					i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
					if (!(patch = patches[i]) || (index = patch.index) > high)
					{
						return i;
					}
				}
				low = nextLow;
			}
			return i;

		case 'text':
		case 'thunk':
			throw new Error('should never traverse `text` or `thunk` nodes like this');
	}
}



////////////  APPLY PATCHES  ////////////


function applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return applyPatchesHelp(rootDomNode, patches);
}

function applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.domNode
		var newNode = applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function applyPatch(domNode, patch)
{
	switch (patch.type)
	{
		case 'p-redraw':
			return applyPatchRedraw(domNode, patch.data, patch.eventNode);

		case 'p-facts':
			applyFacts(domNode, patch.eventNode, patch.data);
			return domNode;

		case 'p-text':
			domNode.replaceData(0, domNode.length, patch.data);
			return domNode;

		case 'p-thunk':
			return applyPatchesHelp(domNode, patch.data);

		case 'p-tagger':
			if (typeof domNode.elm_event_node_ref !== 'undefined')
			{
				domNode.elm_event_node_ref.tagger = patch.data;
			}
			else
			{
				domNode.elm_event_node_ref = { tagger: patch.data, parent: patch.eventNode };
			}
			return domNode;

		case 'p-remove-last':
			var i = patch.data;
			while (i--)
			{
				domNode.removeChild(domNode.lastChild);
			}
			return domNode;

		case 'p-append':
			var newNodes = patch.data;
			for (var i = 0; i < newNodes.length; i++)
			{
				domNode.appendChild(render(newNodes[i], patch.eventNode));
			}
			return domNode;

		case 'p-remove':
			var data = patch.data;
			if (typeof data === 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.entry;
			if (typeof entry.index !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.data = applyPatchesHelp(domNode, data.patches);
			return domNode;

		case 'p-reorder':
			return applyPatchReorder(domNode, patch);

		case 'p-custom':
			var impl = patch.data;
			return impl.applyPatch(domNode, impl.data);

		default:
			throw new Error('Ran into an unknown patch!');
	}
}


function applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = render(vNode, eventNode);

	if (typeof newNode.elm_event_node_ref === 'undefined')
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function applyPatchReorder(domNode, patch)
{
	var data = patch.data;

	// remove end inserts
	var frag = applyPatchReorderEndInsertsHelp(data.endInserts, patch);

	// removals
	domNode = applyPatchesHelp(domNode, data.patches);

	// inserts
	var inserts = data.inserts;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.entry;
		var node = entry.tag === 'move'
			? entry.data
			: render(entry.vnode, patch.eventNode);
		domNode.insertBefore(node, domNode.childNodes[insert.index]);
	}

	// add end inserts
	if (typeof frag !== 'undefined')
	{
		domNode.appendChild(frag);
	}

	return domNode;
}


function applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (typeof endInserts === 'undefined')
	{
		return;
	}

	var frag = localDoc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.entry;
		frag.appendChild(entry.tag === 'move'
			? entry.data
			: render(entry.vnode, patch.eventNode)
		);
	}
	return frag;
}


// PROGRAMS

var program = makeProgram(checkNoFlags);
var programWithFlags = makeProgram(checkYesFlags);

function makeProgram(flagChecker)
{
	return F2(function(debugWrap, impl)
	{
		return function(flagDecoder)
		{
			return function(object, moduleName, debugMetadata)
			{
				var checker = flagChecker(flagDecoder, moduleName);
				if (typeof debugMetadata === 'undefined')
				{
					normalSetup(impl, object, moduleName, checker);
				}
				else
				{
					debugSetup(A2(debugWrap, debugMetadata, impl), object, moduleName, checker);
				}
			};
		};
	});
}

function staticProgram(vNode)
{
	var nothing = _elm_lang$core$Native_Utils.Tuple2(
		_elm_lang$core$Native_Utils.Tuple0,
		_elm_lang$core$Platform_Cmd$none
	);
	return A2(program, _elm_lang$virtual_dom$VirtualDom_Debug$wrap, {
		init: nothing,
		view: function() { return vNode; },
		update: F2(function() { return nothing; }),
		subscriptions: function() { return _elm_lang$core$Platform_Sub$none; }
	})();
}


// FLAG CHECKERS

function checkNoFlags(flagDecoder, moduleName)
{
	return function(init, flags, domNode)
	{
		if (typeof flags === 'undefined')
		{
			return init;
		}

		var errorMessage =
			'The `' + moduleName + '` module does not need flags.\n'
			+ 'Initialize it with no arguments and you should be all set!';

		crash(errorMessage, domNode);
	};
}

function checkYesFlags(flagDecoder, moduleName)
{
	return function(init, flags, domNode)
	{
		if (typeof flagDecoder === 'undefined')
		{
			var errorMessage =
				'Are you trying to sneak a Never value into Elm? Trickster!\n'
				+ 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n'
				+ 'Use `program` instead if you do not want flags.'

			crash(errorMessage, domNode);
		}

		var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
		if (result.ctor === 'Ok')
		{
			return init(result._0);
		}

		var errorMessage =
			'Trying to initialize the `' + moduleName + '` module with an unexpected flag.\n'
			+ 'I tried to convert it to an Elm value, but ran into this problem:\n\n'
			+ result._0;

		crash(errorMessage, domNode);
	};
}

function crash(errorMessage, domNode)
{
	if (domNode)
	{
		domNode.innerHTML =
			'<div style="padding-left:1em;">'
			+ '<h2 style="font-weight:normal;"><b>Oops!</b> Something went wrong when starting your Elm program.</h2>'
			+ '<pre style="padding-left:1em;">' + errorMessage + '</pre>'
			+ '</div>';
	}

	throw new Error(errorMessage);
}


//  NORMAL SETUP

function normalSetup(impl, object, moduleName, flagChecker)
{
	object['embed'] = function embed(node, flags)
	{
		while (node.lastChild)
		{
			node.removeChild(node.lastChild);
		}

		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, node),
			impl.update,
			impl.subscriptions,
			normalRenderer(node, impl.view)
		);
	};

	object['fullscreen'] = function fullscreen(flags)
	{
		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, document.body),
			impl.update,
			impl.subscriptions,
			normalRenderer(document.body, impl.view)
		);
	};
}

function normalRenderer(parentNode, view)
{
	return function(tagger, initialModel)
	{
		var eventNode = { tagger: tagger, parent: undefined };
		var initialVirtualNode = view(initialModel);
		var domNode = render(initialVirtualNode, eventNode);
		parentNode.appendChild(domNode);
		return makeStepper(domNode, view, initialVirtualNode, eventNode);
	};
}


// STEPPER

var rAF =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { setTimeout(callback, 1000 / 60); };

function makeStepper(domNode, view, initialVirtualNode, eventNode)
{
	var state = 'NO_REQUEST';
	var currNode = initialVirtualNode;
	var nextModel;

	function updateIfNeeded()
	{
		switch (state)
		{
			case 'NO_REQUEST':
				throw new Error(
					'Unexpected draw callback.\n' +
					'Please report this to <https://github.com/elm-lang/virtual-dom/issues>.'
				);

			case 'PENDING_REQUEST':
				rAF(updateIfNeeded);
				state = 'EXTRA_REQUEST';

				var nextNode = view(nextModel);
				var patches = diff(currNode, nextNode);
				domNode = applyPatches(domNode, currNode, patches, eventNode);
				currNode = nextNode;

				return;

			case 'EXTRA_REQUEST':
				state = 'NO_REQUEST';
				return;
		}
	}

	return function stepper(model)
	{
		if (state === 'NO_REQUEST')
		{
			rAF(updateIfNeeded);
		}
		state = 'PENDING_REQUEST';
		nextModel = model;
	};
}


// DEBUG SETUP

function debugSetup(impl, object, moduleName, flagChecker)
{
	object['fullscreen'] = function fullscreen(flags)
	{
		var popoutRef = { doc: undefined };
		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, document.body),
			impl.update(scrollTask(popoutRef)),
			impl.subscriptions,
			debugRenderer(moduleName, document.body, popoutRef, impl.view, impl.viewIn, impl.viewOut)
		);
	};

	object['embed'] = function fullscreen(node, flags)
	{
		var popoutRef = { doc: undefined };
		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, node),
			impl.update(scrollTask(popoutRef)),
			impl.subscriptions,
			debugRenderer(moduleName, node, popoutRef, impl.view, impl.viewIn, impl.viewOut)
		);
	};
}

function scrollTask(popoutRef)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		var doc = popoutRef.doc;
		if (doc)
		{
			var msgs = doc.getElementsByClassName('debugger-sidebar-messages')[0];
			if (msgs)
			{
				msgs.scrollTop = msgs.scrollHeight;
			}
		}
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}


function debugRenderer(moduleName, parentNode, popoutRef, view, viewIn, viewOut)
{
	return function(tagger, initialModel)
	{
		var appEventNode = { tagger: tagger, parent: undefined };
		var eventNode = { tagger: tagger, parent: undefined };

		// make normal stepper
		var appVirtualNode = view(initialModel);
		var appNode = render(appVirtualNode, appEventNode);
		parentNode.appendChild(appNode);
		var appStepper = makeStepper(appNode, view, appVirtualNode, appEventNode);

		// make overlay stepper
		var overVirtualNode = viewIn(initialModel)._1;
		var overNode = render(overVirtualNode, eventNode);
		parentNode.appendChild(overNode);
		var wrappedViewIn = wrapViewIn(appEventNode, overNode, viewIn);
		var overStepper = makeStepper(overNode, wrappedViewIn, overVirtualNode, eventNode);

		// make debugger stepper
		var debugStepper = makeDebugStepper(initialModel, viewOut, eventNode, parentNode, moduleName, popoutRef);

		return function stepper(model)
		{
			appStepper(model);
			overStepper(model);
			debugStepper(model);
		}
	};
}

function makeDebugStepper(initialModel, view, eventNode, parentNode, moduleName, popoutRef)
{
	var curr;
	var domNode;

	return function stepper(model)
	{
		if (!model.isDebuggerOpen)
		{
			return;
		}

		if (!popoutRef.doc)
		{
			curr = view(model);
			domNode = openDebugWindow(moduleName, popoutRef, curr, eventNode);
			return;
		}

		// switch to document of popout
		localDoc = popoutRef.doc;

		var next = view(model);
		var patches = diff(curr, next);
		domNode = applyPatches(domNode, curr, patches, eventNode);
		curr = next;

		// switch back to normal document
		localDoc = document;
	};
}

function openDebugWindow(moduleName, popoutRef, virtualNode, eventNode)
{
	var w = 900;
	var h = 360;
	var x = screen.width - w;
	var y = screen.height - h;
	var debugWindow = window.open('', '', 'width=' + w + ',height=' + h + ',left=' + x + ',top=' + y);

	// switch to window document
	localDoc = debugWindow.document;

	popoutRef.doc = localDoc;
	localDoc.title = 'Debugger - ' + moduleName;
	localDoc.body.style.margin = '0';
	localDoc.body.style.padding = '0';
	var domNode = render(virtualNode, eventNode);
	localDoc.body.appendChild(domNode);

	localDoc.addEventListener('keydown', function(event) {
		if (event.metaKey && event.which === 82)
		{
			window.location.reload();
		}
		if (event.which === 38)
		{
			eventNode.tagger({ ctor: 'Up' });
			event.preventDefault();
		}
		if (event.which === 40)
		{
			eventNode.tagger({ ctor: 'Down' });
			event.preventDefault();
		}
	});

	function close()
	{
		popoutRef.doc = undefined;
		debugWindow.close();
	}
	window.addEventListener('unload', close);
	debugWindow.addEventListener('unload', function() {
		popoutRef.doc = undefined;
		window.removeEventListener('unload', close);
		eventNode.tagger({ ctor: 'Close' });
	});

	// switch back to the normal document
	localDoc = document;

	return domNode;
}


// BLOCK EVENTS

function wrapViewIn(appEventNode, overlayNode, viewIn)
{
	var ignorer = makeIgnorer(overlayNode);
	var blocking = 'Normal';
	var overflow;

	var normalTagger = appEventNode.tagger;
	var blockTagger = function() {};

	return function(model)
	{
		var tuple = viewIn(model);
		var newBlocking = tuple._0.ctor;
		appEventNode.tagger = newBlocking === 'Normal' ? normalTagger : blockTagger;
		if (blocking !== newBlocking)
		{
			traverse('removeEventListener', ignorer, blocking);
			traverse('addEventListener', ignorer, newBlocking);

			if (blocking === 'Normal')
			{
				overflow = document.body.style.overflow;
				document.body.style.overflow = 'hidden';
			}

			if (newBlocking === 'Normal')
			{
				document.body.style.overflow = overflow;
			}

			blocking = newBlocking;
		}
		return tuple._1;
	}
}

function traverse(verbEventListener, ignorer, blocking)
{
	switch(blocking)
	{
		case 'Normal':
			return;

		case 'Pause':
			return traverseHelp(verbEventListener, ignorer, mostEvents);

		case 'Message':
			return traverseHelp(verbEventListener, ignorer, allEvents);
	}
}

function traverseHelp(verbEventListener, handler, eventNames)
{
	for (var i = 0; i < eventNames.length; i++)
	{
		document.body[verbEventListener](eventNames[i], handler, true);
	}
}

function makeIgnorer(overlayNode)
{
	return function(event)
	{
		if (event.type === 'keydown' && event.metaKey && event.which === 82)
		{
			return;
		}

		var isScroll = event.type === 'scroll' || event.type === 'wheel';

		var node = event.target;
		while (node !== null)
		{
			if (node.className === 'elm-overlay-message-details' && isScroll)
			{
				return;
			}

			if (node === overlayNode && !isScroll)
			{
				return;
			}
			node = node.parentNode;
		}

		event.stopPropagation();
		event.preventDefault();
	}
}

var mostEvents = [
	'click', 'dblclick', 'mousemove',
	'mouseup', 'mousedown', 'mouseenter', 'mouseleave',
	'touchstart', 'touchend', 'touchcancel', 'touchmove',
	'pointerdown', 'pointerup', 'pointerover', 'pointerout',
	'pointerenter', 'pointerleave', 'pointermove', 'pointercancel',
	'dragstart', 'drag', 'dragend', 'dragenter', 'dragover', 'dragleave', 'drop',
	'keyup', 'keydown', 'keypress',
	'input', 'change',
	'focus', 'blur'
];

var allEvents = mostEvents.concat('wheel', 'scroll');


return {
	node: node,
	text: text,
	custom: custom,
	map: F2(map),

	on: F3(on),
	style: style,
	property: F2(property),
	attribute: F2(attribute),
	attributeNS: F3(attributeNS),
	mapProperty: F2(mapProperty),

	lazy: F2(lazy),
	lazy2: F3(lazy2),
	lazy3: F4(lazy3),
	keyedNode: F3(keyedNode),

	program: program,
	programWithFlags: programWithFlags,
	staticProgram: staticProgram
};

}();

var _elm_lang$virtual_dom$VirtualDom$programWithFlags = function (impl) {
	return A2(_elm_lang$virtual_dom$Native_VirtualDom.programWithFlags, _elm_lang$virtual_dom$VirtualDom_Debug$wrapWithFlags, impl);
};
var _elm_lang$virtual_dom$VirtualDom$program = function (impl) {
	return A2(_elm_lang$virtual_dom$Native_VirtualDom.program, _elm_lang$virtual_dom$VirtualDom_Debug$wrap, impl);
};
var _elm_lang$virtual_dom$VirtualDom$keyedNode = _elm_lang$virtual_dom$Native_VirtualDom.keyedNode;
var _elm_lang$virtual_dom$VirtualDom$lazy3 = _elm_lang$virtual_dom$Native_VirtualDom.lazy3;
var _elm_lang$virtual_dom$VirtualDom$lazy2 = _elm_lang$virtual_dom$Native_VirtualDom.lazy2;
var _elm_lang$virtual_dom$VirtualDom$lazy = _elm_lang$virtual_dom$Native_VirtualDom.lazy;
var _elm_lang$virtual_dom$VirtualDom$defaultOptions = {stopPropagation: false, preventDefault: false};
var _elm_lang$virtual_dom$VirtualDom$onWithOptions = _elm_lang$virtual_dom$Native_VirtualDom.on;
var _elm_lang$virtual_dom$VirtualDom$on = F2(
	function (eventName, decoder) {
		return A3(_elm_lang$virtual_dom$VirtualDom$onWithOptions, eventName, _elm_lang$virtual_dom$VirtualDom$defaultOptions, decoder);
	});
var _elm_lang$virtual_dom$VirtualDom$style = _elm_lang$virtual_dom$Native_VirtualDom.style;
var _elm_lang$virtual_dom$VirtualDom$mapProperty = _elm_lang$virtual_dom$Native_VirtualDom.mapProperty;
var _elm_lang$virtual_dom$VirtualDom$attributeNS = _elm_lang$virtual_dom$Native_VirtualDom.attributeNS;
var _elm_lang$virtual_dom$VirtualDom$attribute = _elm_lang$virtual_dom$Native_VirtualDom.attribute;
var _elm_lang$virtual_dom$VirtualDom$property = _elm_lang$virtual_dom$Native_VirtualDom.property;
var _elm_lang$virtual_dom$VirtualDom$map = _elm_lang$virtual_dom$Native_VirtualDom.map;
var _elm_lang$virtual_dom$VirtualDom$text = _elm_lang$virtual_dom$Native_VirtualDom.text;
var _elm_lang$virtual_dom$VirtualDom$node = _elm_lang$virtual_dom$Native_VirtualDom.node;
var _elm_lang$virtual_dom$VirtualDom$Options = F2(
	function (a, b) {
		return {stopPropagation: a, preventDefault: b};
	});
var _elm_lang$virtual_dom$VirtualDom$Node = {ctor: 'Node'};
var _elm_lang$virtual_dom$VirtualDom$Property = {ctor: 'Property'};

var _elm_lang$html$Html$programWithFlags = _elm_lang$virtual_dom$VirtualDom$programWithFlags;
var _elm_lang$html$Html$program = _elm_lang$virtual_dom$VirtualDom$program;
var _elm_lang$html$Html$beginnerProgram = function (_p0) {
	var _p1 = _p0;
	return _elm_lang$html$Html$program(
		{
			init: A2(
				_elm_lang$core$Platform_Cmd_ops['!'],
				_p1.model,
				{ctor: '[]'}),
			update: F2(
				function (msg, model) {
					return A2(
						_elm_lang$core$Platform_Cmd_ops['!'],
						A2(_p1.update, msg, model),
						{ctor: '[]'});
				}),
			view: _p1.view,
			subscriptions: function (_p2) {
				return _elm_lang$core$Platform_Sub$none;
			}
		});
};
var _elm_lang$html$Html$map = _elm_lang$virtual_dom$VirtualDom$map;
var _elm_lang$html$Html$text = _elm_lang$virtual_dom$VirtualDom$text;
var _elm_lang$html$Html$node = _elm_lang$virtual_dom$VirtualDom$node;
var _elm_lang$html$Html$body = _elm_lang$html$Html$node('body');
var _elm_lang$html$Html$section = _elm_lang$html$Html$node('section');
var _elm_lang$html$Html$nav = _elm_lang$html$Html$node('nav');
var _elm_lang$html$Html$article = _elm_lang$html$Html$node('article');
var _elm_lang$html$Html$aside = _elm_lang$html$Html$node('aside');
var _elm_lang$html$Html$h1 = _elm_lang$html$Html$node('h1');
var _elm_lang$html$Html$h2 = _elm_lang$html$Html$node('h2');
var _elm_lang$html$Html$h3 = _elm_lang$html$Html$node('h3');
var _elm_lang$html$Html$h4 = _elm_lang$html$Html$node('h4');
var _elm_lang$html$Html$h5 = _elm_lang$html$Html$node('h5');
var _elm_lang$html$Html$h6 = _elm_lang$html$Html$node('h6');
var _elm_lang$html$Html$header = _elm_lang$html$Html$node('header');
var _elm_lang$html$Html$footer = _elm_lang$html$Html$node('footer');
var _elm_lang$html$Html$address = _elm_lang$html$Html$node('address');
var _elm_lang$html$Html$main_ = _elm_lang$html$Html$node('main');
var _elm_lang$html$Html$p = _elm_lang$html$Html$node('p');
var _elm_lang$html$Html$hr = _elm_lang$html$Html$node('hr');
var _elm_lang$html$Html$pre = _elm_lang$html$Html$node('pre');
var _elm_lang$html$Html$blockquote = _elm_lang$html$Html$node('blockquote');
var _elm_lang$html$Html$ol = _elm_lang$html$Html$node('ol');
var _elm_lang$html$Html$ul = _elm_lang$html$Html$node('ul');
var _elm_lang$html$Html$li = _elm_lang$html$Html$node('li');
var _elm_lang$html$Html$dl = _elm_lang$html$Html$node('dl');
var _elm_lang$html$Html$dt = _elm_lang$html$Html$node('dt');
var _elm_lang$html$Html$dd = _elm_lang$html$Html$node('dd');
var _elm_lang$html$Html$figure = _elm_lang$html$Html$node('figure');
var _elm_lang$html$Html$figcaption = _elm_lang$html$Html$node('figcaption');
var _elm_lang$html$Html$div = _elm_lang$html$Html$node('div');
var _elm_lang$html$Html$a = _elm_lang$html$Html$node('a');
var _elm_lang$html$Html$em = _elm_lang$html$Html$node('em');
var _elm_lang$html$Html$strong = _elm_lang$html$Html$node('strong');
var _elm_lang$html$Html$small = _elm_lang$html$Html$node('small');
var _elm_lang$html$Html$s = _elm_lang$html$Html$node('s');
var _elm_lang$html$Html$cite = _elm_lang$html$Html$node('cite');
var _elm_lang$html$Html$q = _elm_lang$html$Html$node('q');
var _elm_lang$html$Html$dfn = _elm_lang$html$Html$node('dfn');
var _elm_lang$html$Html$abbr = _elm_lang$html$Html$node('abbr');
var _elm_lang$html$Html$time = _elm_lang$html$Html$node('time');
var _elm_lang$html$Html$code = _elm_lang$html$Html$node('code');
var _elm_lang$html$Html$var = _elm_lang$html$Html$node('var');
var _elm_lang$html$Html$samp = _elm_lang$html$Html$node('samp');
var _elm_lang$html$Html$kbd = _elm_lang$html$Html$node('kbd');
var _elm_lang$html$Html$sub = _elm_lang$html$Html$node('sub');
var _elm_lang$html$Html$sup = _elm_lang$html$Html$node('sup');
var _elm_lang$html$Html$i = _elm_lang$html$Html$node('i');
var _elm_lang$html$Html$b = _elm_lang$html$Html$node('b');
var _elm_lang$html$Html$u = _elm_lang$html$Html$node('u');
var _elm_lang$html$Html$mark = _elm_lang$html$Html$node('mark');
var _elm_lang$html$Html$ruby = _elm_lang$html$Html$node('ruby');
var _elm_lang$html$Html$rt = _elm_lang$html$Html$node('rt');
var _elm_lang$html$Html$rp = _elm_lang$html$Html$node('rp');
var _elm_lang$html$Html$bdi = _elm_lang$html$Html$node('bdi');
var _elm_lang$html$Html$bdo = _elm_lang$html$Html$node('bdo');
var _elm_lang$html$Html$span = _elm_lang$html$Html$node('span');
var _elm_lang$html$Html$br = _elm_lang$html$Html$node('br');
var _elm_lang$html$Html$wbr = _elm_lang$html$Html$node('wbr');
var _elm_lang$html$Html$ins = _elm_lang$html$Html$node('ins');
var _elm_lang$html$Html$del = _elm_lang$html$Html$node('del');
var _elm_lang$html$Html$img = _elm_lang$html$Html$node('img');
var _elm_lang$html$Html$iframe = _elm_lang$html$Html$node('iframe');
var _elm_lang$html$Html$embed = _elm_lang$html$Html$node('embed');
var _elm_lang$html$Html$object = _elm_lang$html$Html$node('object');
var _elm_lang$html$Html$param = _elm_lang$html$Html$node('param');
var _elm_lang$html$Html$video = _elm_lang$html$Html$node('video');
var _elm_lang$html$Html$audio = _elm_lang$html$Html$node('audio');
var _elm_lang$html$Html$source = _elm_lang$html$Html$node('source');
var _elm_lang$html$Html$track = _elm_lang$html$Html$node('track');
var _elm_lang$html$Html$canvas = _elm_lang$html$Html$node('canvas');
var _elm_lang$html$Html$math = _elm_lang$html$Html$node('math');
var _elm_lang$html$Html$table = _elm_lang$html$Html$node('table');
var _elm_lang$html$Html$caption = _elm_lang$html$Html$node('caption');
var _elm_lang$html$Html$colgroup = _elm_lang$html$Html$node('colgroup');
var _elm_lang$html$Html$col = _elm_lang$html$Html$node('col');
var _elm_lang$html$Html$tbody = _elm_lang$html$Html$node('tbody');
var _elm_lang$html$Html$thead = _elm_lang$html$Html$node('thead');
var _elm_lang$html$Html$tfoot = _elm_lang$html$Html$node('tfoot');
var _elm_lang$html$Html$tr = _elm_lang$html$Html$node('tr');
var _elm_lang$html$Html$td = _elm_lang$html$Html$node('td');
var _elm_lang$html$Html$th = _elm_lang$html$Html$node('th');
var _elm_lang$html$Html$form = _elm_lang$html$Html$node('form');
var _elm_lang$html$Html$fieldset = _elm_lang$html$Html$node('fieldset');
var _elm_lang$html$Html$legend = _elm_lang$html$Html$node('legend');
var _elm_lang$html$Html$label = _elm_lang$html$Html$node('label');
var _elm_lang$html$Html$input = _elm_lang$html$Html$node('input');
var _elm_lang$html$Html$button = _elm_lang$html$Html$node('button');
var _elm_lang$html$Html$select = _elm_lang$html$Html$node('select');
var _elm_lang$html$Html$datalist = _elm_lang$html$Html$node('datalist');
var _elm_lang$html$Html$optgroup = _elm_lang$html$Html$node('optgroup');
var _elm_lang$html$Html$option = _elm_lang$html$Html$node('option');
var _elm_lang$html$Html$textarea = _elm_lang$html$Html$node('textarea');
var _elm_lang$html$Html$keygen = _elm_lang$html$Html$node('keygen');
var _elm_lang$html$Html$output = _elm_lang$html$Html$node('output');
var _elm_lang$html$Html$progress = _elm_lang$html$Html$node('progress');
var _elm_lang$html$Html$meter = _elm_lang$html$Html$node('meter');
var _elm_lang$html$Html$details = _elm_lang$html$Html$node('details');
var _elm_lang$html$Html$summary = _elm_lang$html$Html$node('summary');
var _elm_lang$html$Html$menuitem = _elm_lang$html$Html$node('menuitem');
var _elm_lang$html$Html$menu = _elm_lang$html$Html$node('menu');

var _elm_lang$html$Html_Attributes$map = _elm_lang$virtual_dom$VirtualDom$mapProperty;
var _elm_lang$html$Html_Attributes$attribute = _elm_lang$virtual_dom$VirtualDom$attribute;
var _elm_lang$html$Html_Attributes$contextmenu = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'contextmenu', value);
};
var _elm_lang$html$Html_Attributes$draggable = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'draggable', value);
};
var _elm_lang$html$Html_Attributes$itemprop = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'itemprop', value);
};
var _elm_lang$html$Html_Attributes$tabindex = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'tabIndex',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$charset = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'charset', value);
};
var _elm_lang$html$Html_Attributes$height = function (value) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'height',
		_elm_lang$core$Basics$toString(value));
};
var _elm_lang$html$Html_Attributes$width = function (value) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'width',
		_elm_lang$core$Basics$toString(value));
};
var _elm_lang$html$Html_Attributes$formaction = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'formAction', value);
};
var _elm_lang$html$Html_Attributes$list = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'list', value);
};
var _elm_lang$html$Html_Attributes$minlength = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'minLength',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$maxlength = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'maxlength',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$size = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'size',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$form = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'form', value);
};
var _elm_lang$html$Html_Attributes$cols = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'cols',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$rows = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'rows',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$challenge = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'challenge', value);
};
var _elm_lang$html$Html_Attributes$media = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'media', value);
};
var _elm_lang$html$Html_Attributes$rel = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'rel', value);
};
var _elm_lang$html$Html_Attributes$datetime = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'datetime', value);
};
var _elm_lang$html$Html_Attributes$pubdate = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'pubdate', value);
};
var _elm_lang$html$Html_Attributes$colspan = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'colspan',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$rowspan = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'rowspan',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$manifest = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'manifest', value);
};
var _elm_lang$html$Html_Attributes$property = _elm_lang$virtual_dom$VirtualDom$property;
var _elm_lang$html$Html_Attributes$stringProperty = F2(
	function (name, string) {
		return A2(
			_elm_lang$html$Html_Attributes$property,
			name,
			_elm_lang$core$Json_Encode$string(string));
	});
var _elm_lang$html$Html_Attributes$class = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'className', name);
};
var _elm_lang$html$Html_Attributes$id = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'id', name);
};
var _elm_lang$html$Html_Attributes$title = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'title', name);
};
var _elm_lang$html$Html_Attributes$accesskey = function ($char) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'accessKey',
		_elm_lang$core$String$fromChar($char));
};
var _elm_lang$html$Html_Attributes$dir = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dir', value);
};
var _elm_lang$html$Html_Attributes$dropzone = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dropzone', value);
};
var _elm_lang$html$Html_Attributes$lang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'lang', value);
};
var _elm_lang$html$Html_Attributes$content = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'content', value);
};
var _elm_lang$html$Html_Attributes$httpEquiv = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'httpEquiv', value);
};
var _elm_lang$html$Html_Attributes$language = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'language', value);
};
var _elm_lang$html$Html_Attributes$src = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'src', value);
};
var _elm_lang$html$Html_Attributes$alt = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'alt', value);
};
var _elm_lang$html$Html_Attributes$preload = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'preload', value);
};
var _elm_lang$html$Html_Attributes$poster = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'poster', value);
};
var _elm_lang$html$Html_Attributes$kind = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'kind', value);
};
var _elm_lang$html$Html_Attributes$srclang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srclang', value);
};
var _elm_lang$html$Html_Attributes$sandbox = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'sandbox', value);
};
var _elm_lang$html$Html_Attributes$srcdoc = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srcdoc', value);
};
var _elm_lang$html$Html_Attributes$type_ = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'type', value);
};
var _elm_lang$html$Html_Attributes$value = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'value', value);
};
var _elm_lang$html$Html_Attributes$defaultValue = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'defaultValue', value);
};
var _elm_lang$html$Html_Attributes$placeholder = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'placeholder', value);
};
var _elm_lang$html$Html_Attributes$accept = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'accept', value);
};
var _elm_lang$html$Html_Attributes$acceptCharset = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'acceptCharset', value);
};
var _elm_lang$html$Html_Attributes$action = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'action', value);
};
var _elm_lang$html$Html_Attributes$autocomplete = function (bool) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'autocomplete',
		bool ? 'on' : 'off');
};
var _elm_lang$html$Html_Attributes$enctype = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'enctype', value);
};
var _elm_lang$html$Html_Attributes$method = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'method', value);
};
var _elm_lang$html$Html_Attributes$name = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'name', value);
};
var _elm_lang$html$Html_Attributes$pattern = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'pattern', value);
};
var _elm_lang$html$Html_Attributes$for = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'htmlFor', value);
};
var _elm_lang$html$Html_Attributes$max = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'max', value);
};
var _elm_lang$html$Html_Attributes$min = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'min', value);
};
var _elm_lang$html$Html_Attributes$step = function (n) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'step', n);
};
var _elm_lang$html$Html_Attributes$wrap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'wrap', value);
};
var _elm_lang$html$Html_Attributes$usemap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'useMap', value);
};
var _elm_lang$html$Html_Attributes$shape = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'shape', value);
};
var _elm_lang$html$Html_Attributes$coords = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'coords', value);
};
var _elm_lang$html$Html_Attributes$keytype = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'keytype', value);
};
var _elm_lang$html$Html_Attributes$align = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'align', value);
};
var _elm_lang$html$Html_Attributes$cite = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'cite', value);
};
var _elm_lang$html$Html_Attributes$href = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'href', value);
};
var _elm_lang$html$Html_Attributes$target = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'target', value);
};
var _elm_lang$html$Html_Attributes$downloadAs = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'download', value);
};
var _elm_lang$html$Html_Attributes$hreflang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'hreflang', value);
};
var _elm_lang$html$Html_Attributes$ping = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'ping', value);
};
var _elm_lang$html$Html_Attributes$start = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'start',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$headers = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'headers', value);
};
var _elm_lang$html$Html_Attributes$scope = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'scope', value);
};
var _elm_lang$html$Html_Attributes$boolProperty = F2(
	function (name, bool) {
		return A2(
			_elm_lang$html$Html_Attributes$property,
			name,
			_elm_lang$core$Json_Encode$bool(bool));
	});
var _elm_lang$html$Html_Attributes$hidden = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'hidden', bool);
};
var _elm_lang$html$Html_Attributes$contenteditable = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'contentEditable', bool);
};
var _elm_lang$html$Html_Attributes$spellcheck = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'spellcheck', bool);
};
var _elm_lang$html$Html_Attributes$async = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'async', bool);
};
var _elm_lang$html$Html_Attributes$defer = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'defer', bool);
};
var _elm_lang$html$Html_Attributes$scoped = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'scoped', bool);
};
var _elm_lang$html$Html_Attributes$autoplay = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autoplay', bool);
};
var _elm_lang$html$Html_Attributes$controls = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'controls', bool);
};
var _elm_lang$html$Html_Attributes$loop = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'loop', bool);
};
var _elm_lang$html$Html_Attributes$default = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'default', bool);
};
var _elm_lang$html$Html_Attributes$seamless = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'seamless', bool);
};
var _elm_lang$html$Html_Attributes$checked = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'checked', bool);
};
var _elm_lang$html$Html_Attributes$selected = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'selected', bool);
};
var _elm_lang$html$Html_Attributes$autofocus = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autofocus', bool);
};
var _elm_lang$html$Html_Attributes$disabled = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'disabled', bool);
};
var _elm_lang$html$Html_Attributes$multiple = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'multiple', bool);
};
var _elm_lang$html$Html_Attributes$novalidate = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'noValidate', bool);
};
var _elm_lang$html$Html_Attributes$readonly = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'readOnly', bool);
};
var _elm_lang$html$Html_Attributes$required = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'required', bool);
};
var _elm_lang$html$Html_Attributes$ismap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'isMap', value);
};
var _elm_lang$html$Html_Attributes$download = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'download', bool);
};
var _elm_lang$html$Html_Attributes$reversed = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'reversed', bool);
};
var _elm_lang$html$Html_Attributes$classList = function (list) {
	return _elm_lang$html$Html_Attributes$class(
		A2(
			_elm_lang$core$String$join,
			' ',
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Tuple$first,
				A2(_elm_lang$core$List$filter, _elm_lang$core$Tuple$second, list))));
};
var _elm_lang$html$Html_Attributes$style = _elm_lang$virtual_dom$VirtualDom$style;

var _elm_lang$html$Html_Events$keyCode = A2(_elm_lang$core$Json_Decode$field, 'keyCode', _elm_lang$core$Json_Decode$int);
var _elm_lang$html$Html_Events$targetChecked = A2(
	_elm_lang$core$Json_Decode$at,
	{
		ctor: '::',
		_0: 'target',
		_1: {
			ctor: '::',
			_0: 'checked',
			_1: {ctor: '[]'}
		}
	},
	_elm_lang$core$Json_Decode$bool);
var _elm_lang$html$Html_Events$targetValue = A2(
	_elm_lang$core$Json_Decode$at,
	{
		ctor: '::',
		_0: 'target',
		_1: {
			ctor: '::',
			_0: 'value',
			_1: {ctor: '[]'}
		}
	},
	_elm_lang$core$Json_Decode$string);
var _elm_lang$html$Html_Events$defaultOptions = _elm_lang$virtual_dom$VirtualDom$defaultOptions;
var _elm_lang$html$Html_Events$onWithOptions = _elm_lang$virtual_dom$VirtualDom$onWithOptions;
var _elm_lang$html$Html_Events$on = _elm_lang$virtual_dom$VirtualDom$on;
var _elm_lang$html$Html_Events$onFocus = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'focus',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onBlur = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'blur',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onSubmitOptions = _elm_lang$core$Native_Utils.update(
	_elm_lang$html$Html_Events$defaultOptions,
	{preventDefault: true});
var _elm_lang$html$Html_Events$onSubmit = function (msg) {
	return A3(
		_elm_lang$html$Html_Events$onWithOptions,
		'submit',
		_elm_lang$html$Html_Events$onSubmitOptions,
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onCheck = function (tagger) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'change',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetChecked));
};
var _elm_lang$html$Html_Events$onInput = function (tagger) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'input',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetValue));
};
var _elm_lang$html$Html_Events$onMouseOut = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseout',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseOver = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseover',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseLeave = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseleave',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseEnter = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseenter',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseUp = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseup',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseDown = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mousedown',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onDoubleClick = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'dblclick',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onClick = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'click',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$Options = F2(
	function (a, b) {
		return {stopPropagation: a, preventDefault: b};
	});

var _elm_lang$html$Html_Lazy$lazy3 = _elm_lang$virtual_dom$VirtualDom$lazy3;
var _elm_lang$html$Html_Lazy$lazy2 = _elm_lang$virtual_dom$VirtualDom$lazy2;
var _elm_lang$html$Html_Lazy$lazy = _elm_lang$virtual_dom$VirtualDom$lazy;

var _elm_lang$http$Native_Http = function() {


// ENCODING AND DECODING

function encodeUri(string)
{
	return encodeURIComponent(string);
}

function decodeUri(string)
{
	try
	{
		return _elm_lang$core$Maybe$Just(decodeURIComponent(string));
	}
	catch(e)
	{
		return _elm_lang$core$Maybe$Nothing;
	}
}


// SEND REQUEST

function toTask(request, maybeProgress)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		var xhr = new XMLHttpRequest();

		configureProgress(xhr, maybeProgress);

		xhr.addEventListener('error', function() {
			callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'NetworkError' }));
		});
		xhr.addEventListener('timeout', function() {
			callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'Timeout' }));
		});
		xhr.addEventListener('load', function() {
			callback(handleResponse(xhr, request.expect.responseToResult));
		});

		try
		{
			xhr.open(request.method, request.url, true);
		}
		catch (e)
		{
			return callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'BadUrl', _0: request.url }));
		}

		configureRequest(xhr, request);
		send(xhr, request.body);

		return function() { xhr.abort(); };
	});
}

function configureProgress(xhr, maybeProgress)
{
	if (maybeProgress.ctor === 'Nothing')
	{
		return;
	}

	xhr.addEventListener('progress', function(event) {
		if (!event.lengthComputable)
		{
			return;
		}
		_elm_lang$core$Native_Scheduler.rawSpawn(maybeProgress._0({
			bytes: event.loaded,
			bytesExpected: event.total
		}));
	});
}

function configureRequest(xhr, request)
{
	function setHeader(pair)
	{
		xhr.setRequestHeader(pair._0, pair._1);
	}

	A2(_elm_lang$core$List$map, setHeader, request.headers);
	xhr.responseType = request.expect.responseType;
	xhr.withCredentials = request.withCredentials;

	if (request.timeout.ctor === 'Just')
	{
		xhr.timeout = request.timeout._0;
	}
}

function send(xhr, body)
{
	switch (body.ctor)
	{
		case 'EmptyBody':
			xhr.send();
			return;

		case 'StringBody':
			xhr.setRequestHeader('Content-Type', body._0);
			xhr.send(body._1);
			return;

		case 'FormDataBody':
			xhr.send(body._0);
			return;
	}
}


// RESPONSES

function handleResponse(xhr, responseToResult)
{
	var response = toResponse(xhr);

	if (xhr.status < 200 || 300 <= xhr.status)
	{
		response.body = xhr.responseText;
		return _elm_lang$core$Native_Scheduler.fail({
			ctor: 'BadStatus',
			_0: response
		});
	}

	var result = responseToResult(response);

	if (result.ctor === 'Ok')
	{
		return _elm_lang$core$Native_Scheduler.succeed(result._0);
	}
	else
	{
		response.body = xhr.responseText;
		return _elm_lang$core$Native_Scheduler.fail({
			ctor: 'BadPayload',
			_0: result._0,
			_1: response
		});
	}
}

function toResponse(xhr)
{
	return {
		status: { code: xhr.status, message: xhr.statusText },
		headers: parseHeaders(xhr.getAllResponseHeaders()),
		url: xhr.responseURL,
		body: xhr.response
	};
}

function parseHeaders(rawHeaders)
{
	var headers = _elm_lang$core$Dict$empty;

	if (!rawHeaders)
	{
		return headers;
	}

	var headerPairs = rawHeaders.split('\u000d\u000a');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf('\u003a\u0020');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3(_elm_lang$core$Dict$update, key, function(oldValue) {
				if (oldValue.ctor === 'Just')
				{
					return _elm_lang$core$Maybe$Just(value + ', ' + oldValue._0);
				}
				return _elm_lang$core$Maybe$Just(value);
			}, headers);
		}
	}

	return headers;
}


// EXPECTORS

function expectStringResponse(responseToResult)
{
	return {
		responseType: 'text',
		responseToResult: responseToResult
	};
}

function mapExpect(func, expect)
{
	return {
		responseType: expect.responseType,
		responseToResult: function(response) {
			var convertedResponse = expect.responseToResult(response);
			return A2(_elm_lang$core$Result$map, func, convertedResponse);
		}
	};
}


// BODY

function multipart(parts)
{
	var formData = new FormData();

	while (parts.ctor !== '[]')
	{
		var part = parts._0;
		formData.append(part._0, part._1);
		parts = parts._1;
	}

	return { ctor: 'FormDataBody', _0: formData };
}

return {
	toTask: F2(toTask),
	expectStringResponse: expectStringResponse,
	mapExpect: F2(mapExpect),
	multipart: multipart,
	encodeUri: encodeUri,
	decodeUri: decodeUri
};

}();

var _elm_lang$http$Http_Internal$map = F2(
	function (func, request) {
		return _elm_lang$core$Native_Utils.update(
			request,
			{
				expect: A2(_elm_lang$http$Native_Http.mapExpect, func, request.expect)
			});
	});
var _elm_lang$http$Http_Internal$RawRequest = F7(
	function (a, b, c, d, e, f, g) {
		return {method: a, headers: b, url: c, body: d, expect: e, timeout: f, withCredentials: g};
	});
var _elm_lang$http$Http_Internal$Request = function (a) {
	return {ctor: 'Request', _0: a};
};
var _elm_lang$http$Http_Internal$Expect = {ctor: 'Expect'};
var _elm_lang$http$Http_Internal$FormDataBody = {ctor: 'FormDataBody'};
var _elm_lang$http$Http_Internal$StringBody = F2(
	function (a, b) {
		return {ctor: 'StringBody', _0: a, _1: b};
	});
var _elm_lang$http$Http_Internal$EmptyBody = {ctor: 'EmptyBody'};
var _elm_lang$http$Http_Internal$Header = F2(
	function (a, b) {
		return {ctor: 'Header', _0: a, _1: b};
	});

var _elm_lang$http$Http$decodeUri = _elm_lang$http$Native_Http.decodeUri;
var _elm_lang$http$Http$encodeUri = _elm_lang$http$Native_Http.encodeUri;
var _elm_lang$http$Http$expectStringResponse = _elm_lang$http$Native_Http.expectStringResponse;
var _elm_lang$http$Http$expectJson = function (decoder) {
	return _elm_lang$http$Http$expectStringResponse(
		function (response) {
			return A2(_elm_lang$core$Json_Decode$decodeString, decoder, response.body);
		});
};
var _elm_lang$http$Http$expectString = _elm_lang$http$Http$expectStringResponse(
	function (response) {
		return _elm_lang$core$Result$Ok(response.body);
	});
var _elm_lang$http$Http$multipartBody = _elm_lang$http$Native_Http.multipart;
var _elm_lang$http$Http$stringBody = _elm_lang$http$Http_Internal$StringBody;
var _elm_lang$http$Http$jsonBody = function (value) {
	return A2(
		_elm_lang$http$Http_Internal$StringBody,
		'application/json',
		A2(_elm_lang$core$Json_Encode$encode, 0, value));
};
var _elm_lang$http$Http$emptyBody = _elm_lang$http$Http_Internal$EmptyBody;
var _elm_lang$http$Http$header = _elm_lang$http$Http_Internal$Header;
var _elm_lang$http$Http$request = _elm_lang$http$Http_Internal$Request;
var _elm_lang$http$Http$post = F3(
	function (url, body, decoder) {
		return _elm_lang$http$Http$request(
			{
				method: 'POST',
				headers: {ctor: '[]'},
				url: url,
				body: body,
				expect: _elm_lang$http$Http$expectJson(decoder),
				timeout: _elm_lang$core$Maybe$Nothing,
				withCredentials: false
			});
	});
var _elm_lang$http$Http$get = F2(
	function (url, decoder) {
		return _elm_lang$http$Http$request(
			{
				method: 'GET',
				headers: {ctor: '[]'},
				url: url,
				body: _elm_lang$http$Http$emptyBody,
				expect: _elm_lang$http$Http$expectJson(decoder),
				timeout: _elm_lang$core$Maybe$Nothing,
				withCredentials: false
			});
	});
var _elm_lang$http$Http$getString = function (url) {
	return _elm_lang$http$Http$request(
		{
			method: 'GET',
			headers: {ctor: '[]'},
			url: url,
			body: _elm_lang$http$Http$emptyBody,
			expect: _elm_lang$http$Http$expectString,
			timeout: _elm_lang$core$Maybe$Nothing,
			withCredentials: false
		});
};
var _elm_lang$http$Http$toTask = function (_p0) {
	var _p1 = _p0;
	return A2(_elm_lang$http$Native_Http.toTask, _p1._0, _elm_lang$core$Maybe$Nothing);
};
var _elm_lang$http$Http$send = F2(
	function (resultToMessage, request) {
		return A2(
			_elm_lang$core$Task$attempt,
			resultToMessage,
			_elm_lang$http$Http$toTask(request));
	});
var _elm_lang$http$Http$Response = F4(
	function (a, b, c, d) {
		return {url: a, status: b, headers: c, body: d};
	});
var _elm_lang$http$Http$BadPayload = F2(
	function (a, b) {
		return {ctor: 'BadPayload', _0: a, _1: b};
	});
var _elm_lang$http$Http$BadStatus = function (a) {
	return {ctor: 'BadStatus', _0: a};
};
var _elm_lang$http$Http$NetworkError = {ctor: 'NetworkError'};
var _elm_lang$http$Http$Timeout = {ctor: 'Timeout'};
var _elm_lang$http$Http$BadUrl = function (a) {
	return {ctor: 'BadUrl', _0: a};
};
var _elm_lang$http$Http$StringPart = F2(
	function (a, b) {
		return {ctor: 'StringPart', _0: a, _1: b};
	});
var _elm_lang$http$Http$stringPart = _elm_lang$http$Http$StringPart;

var _elm_lang$navigation$Native_Navigation = function() {


// FAKE NAVIGATION

function go(n)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		if (n !== 0)
		{
			history.go(n);
		}
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function pushState(url)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		history.pushState({}, '', url);
		callback(_elm_lang$core$Native_Scheduler.succeed(getLocation()));
	});
}

function replaceState(url)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		history.replaceState({}, '', url);
		callback(_elm_lang$core$Native_Scheduler.succeed(getLocation()));
	});
}


// REAL NAVIGATION

function reloadPage(skipCache)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		document.location.reload(skipCache);
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function setLocation(url)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		try
		{
			window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			document.location.reload(false);
		}
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}


// GET LOCATION

function getLocation()
{
	var location = document.location;

	return {
		href: location.href,
		host: location.host,
		hostname: location.hostname,
		protocol: location.protocol,
		origin: location.origin,
		port_: location.port,
		pathname: location.pathname,
		search: location.search,
		hash: location.hash,
		username: location.username,
		password: location.password
	};
}


// DETECT IE11 PROBLEMS

function isInternetExplorer11()
{
	return window.navigator.userAgent.indexOf('Trident') !== -1;
}


return {
	go: go,
	setLocation: setLocation,
	reloadPage: reloadPage,
	pushState: pushState,
	replaceState: replaceState,
	getLocation: getLocation,
	isInternetExplorer11: isInternetExplorer11
};

}();

var _elm_lang$navigation$Navigation$replaceState = _elm_lang$navigation$Native_Navigation.replaceState;
var _elm_lang$navigation$Navigation$pushState = _elm_lang$navigation$Native_Navigation.pushState;
var _elm_lang$navigation$Navigation$go = _elm_lang$navigation$Native_Navigation.go;
var _elm_lang$navigation$Navigation$reloadPage = _elm_lang$navigation$Native_Navigation.reloadPage;
var _elm_lang$navigation$Navigation$setLocation = _elm_lang$navigation$Native_Navigation.setLocation;
var _elm_lang$navigation$Navigation_ops = _elm_lang$navigation$Navigation_ops || {};
_elm_lang$navigation$Navigation_ops['&>'] = F2(
	function (task1, task2) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (_p0) {
				return task2;
			},
			task1);
	});
var _elm_lang$navigation$Navigation$notify = F3(
	function (router, subs, location) {
		var send = function (_p1) {
			var _p2 = _p1;
			return A2(
				_elm_lang$core$Platform$sendToApp,
				router,
				_p2._0(location));
		};
		return A2(
			_elm_lang$navigation$Navigation_ops['&>'],
			_elm_lang$core$Task$sequence(
				A2(_elm_lang$core$List$map, send, subs)),
			_elm_lang$core$Task$succeed(
				{ctor: '_Tuple0'}));
	});
var _elm_lang$navigation$Navigation$cmdHelp = F3(
	function (router, subs, cmd) {
		var _p3 = cmd;
		switch (_p3.ctor) {
			case 'Jump':
				return _elm_lang$navigation$Navigation$go(_p3._0);
			case 'New':
				return A2(
					_elm_lang$core$Task$andThen,
					A2(_elm_lang$navigation$Navigation$notify, router, subs),
					_elm_lang$navigation$Navigation$pushState(_p3._0));
			case 'Modify':
				return A2(
					_elm_lang$core$Task$andThen,
					A2(_elm_lang$navigation$Navigation$notify, router, subs),
					_elm_lang$navigation$Navigation$replaceState(_p3._0));
			case 'Visit':
				return _elm_lang$navigation$Navigation$setLocation(_p3._0);
			default:
				return _elm_lang$navigation$Navigation$reloadPage(_p3._0);
		}
	});
var _elm_lang$navigation$Navigation$killPopWatcher = function (popWatcher) {
	var _p4 = popWatcher;
	if (_p4.ctor === 'Normal') {
		return _elm_lang$core$Process$kill(_p4._0);
	} else {
		return A2(
			_elm_lang$navigation$Navigation_ops['&>'],
			_elm_lang$core$Process$kill(_p4._0),
			_elm_lang$core$Process$kill(_p4._1));
	}
};
var _elm_lang$navigation$Navigation$onSelfMsg = F3(
	function (router, location, state) {
		return A2(
			_elm_lang$navigation$Navigation_ops['&>'],
			A3(_elm_lang$navigation$Navigation$notify, router, state.subs, location),
			_elm_lang$core$Task$succeed(state));
	});
var _elm_lang$navigation$Navigation$subscription = _elm_lang$core$Native_Platform.leaf('Navigation');
var _elm_lang$navigation$Navigation$command = _elm_lang$core$Native_Platform.leaf('Navigation');
var _elm_lang$navigation$Navigation$Location = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return function (k) {
											return {href: a, host: b, hostname: c, protocol: d, origin: e, port_: f, pathname: g, search: h, hash: i, username: j, password: k};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _elm_lang$navigation$Navigation$State = F2(
	function (a, b) {
		return {subs: a, popWatcher: b};
	});
var _elm_lang$navigation$Navigation$init = _elm_lang$core$Task$succeed(
	A2(
		_elm_lang$navigation$Navigation$State,
		{ctor: '[]'},
		_elm_lang$core$Maybe$Nothing));
var _elm_lang$navigation$Navigation$Reload = function (a) {
	return {ctor: 'Reload', _0: a};
};
var _elm_lang$navigation$Navigation$reload = _elm_lang$navigation$Navigation$command(
	_elm_lang$navigation$Navigation$Reload(false));
var _elm_lang$navigation$Navigation$reloadAndSkipCache = _elm_lang$navigation$Navigation$command(
	_elm_lang$navigation$Navigation$Reload(true));
var _elm_lang$navigation$Navigation$Visit = function (a) {
	return {ctor: 'Visit', _0: a};
};
var _elm_lang$navigation$Navigation$load = function (url) {
	return _elm_lang$navigation$Navigation$command(
		_elm_lang$navigation$Navigation$Visit(url));
};
var _elm_lang$navigation$Navigation$Modify = function (a) {
	return {ctor: 'Modify', _0: a};
};
var _elm_lang$navigation$Navigation$modifyUrl = function (url) {
	return _elm_lang$navigation$Navigation$command(
		_elm_lang$navigation$Navigation$Modify(url));
};
var _elm_lang$navigation$Navigation$New = function (a) {
	return {ctor: 'New', _0: a};
};
var _elm_lang$navigation$Navigation$newUrl = function (url) {
	return _elm_lang$navigation$Navigation$command(
		_elm_lang$navigation$Navigation$New(url));
};
var _elm_lang$navigation$Navigation$Jump = function (a) {
	return {ctor: 'Jump', _0: a};
};
var _elm_lang$navigation$Navigation$back = function (n) {
	return _elm_lang$navigation$Navigation$command(
		_elm_lang$navigation$Navigation$Jump(0 - n));
};
var _elm_lang$navigation$Navigation$forward = function (n) {
	return _elm_lang$navigation$Navigation$command(
		_elm_lang$navigation$Navigation$Jump(n));
};
var _elm_lang$navigation$Navigation$cmdMap = F2(
	function (_p5, myCmd) {
		var _p6 = myCmd;
		switch (_p6.ctor) {
			case 'Jump':
				return _elm_lang$navigation$Navigation$Jump(_p6._0);
			case 'New':
				return _elm_lang$navigation$Navigation$New(_p6._0);
			case 'Modify':
				return _elm_lang$navigation$Navigation$Modify(_p6._0);
			case 'Visit':
				return _elm_lang$navigation$Navigation$Visit(_p6._0);
			default:
				return _elm_lang$navigation$Navigation$Reload(_p6._0);
		}
	});
var _elm_lang$navigation$Navigation$Monitor = function (a) {
	return {ctor: 'Monitor', _0: a};
};
var _elm_lang$navigation$Navigation$program = F2(
	function (locationToMessage, stuff) {
		var init = stuff.init(
			_elm_lang$navigation$Native_Navigation.getLocation(
				{ctor: '_Tuple0'}));
		var subs = function (model) {
			return _elm_lang$core$Platform_Sub$batch(
				{
					ctor: '::',
					_0: _elm_lang$navigation$Navigation$subscription(
						_elm_lang$navigation$Navigation$Monitor(locationToMessage)),
					_1: {
						ctor: '::',
						_0: stuff.subscriptions(model),
						_1: {ctor: '[]'}
					}
				});
		};
		return _elm_lang$html$Html$program(
			{init: init, view: stuff.view, update: stuff.update, subscriptions: subs});
	});
var _elm_lang$navigation$Navigation$programWithFlags = F2(
	function (locationToMessage, stuff) {
		var init = function (flags) {
			return A2(
				stuff.init,
				flags,
				_elm_lang$navigation$Native_Navigation.getLocation(
					{ctor: '_Tuple0'}));
		};
		var subs = function (model) {
			return _elm_lang$core$Platform_Sub$batch(
				{
					ctor: '::',
					_0: _elm_lang$navigation$Navigation$subscription(
						_elm_lang$navigation$Navigation$Monitor(locationToMessage)),
					_1: {
						ctor: '::',
						_0: stuff.subscriptions(model),
						_1: {ctor: '[]'}
					}
				});
		};
		return _elm_lang$html$Html$programWithFlags(
			{init: init, view: stuff.view, update: stuff.update, subscriptions: subs});
	});
var _elm_lang$navigation$Navigation$subMap = F2(
	function (func, _p7) {
		var _p8 = _p7;
		return _elm_lang$navigation$Navigation$Monitor(
			function (_p9) {
				return func(
					_p8._0(_p9));
			});
	});
var _elm_lang$navigation$Navigation$InternetExplorer = F2(
	function (a, b) {
		return {ctor: 'InternetExplorer', _0: a, _1: b};
	});
var _elm_lang$navigation$Navigation$Normal = function (a) {
	return {ctor: 'Normal', _0: a};
};
var _elm_lang$navigation$Navigation$spawnPopWatcher = function (router) {
	var reportLocation = function (_p10) {
		return A2(
			_elm_lang$core$Platform$sendToSelf,
			router,
			_elm_lang$navigation$Native_Navigation.getLocation(
				{ctor: '_Tuple0'}));
	};
	return _elm_lang$navigation$Native_Navigation.isInternetExplorer11(
		{ctor: '_Tuple0'}) ? A3(
		_elm_lang$core$Task$map2,
		_elm_lang$navigation$Navigation$InternetExplorer,
		_elm_lang$core$Process$spawn(
			A3(_elm_lang$dom$Dom_LowLevel$onWindow, 'popstate', _elm_lang$core$Json_Decode$value, reportLocation)),
		_elm_lang$core$Process$spawn(
			A3(_elm_lang$dom$Dom_LowLevel$onWindow, 'hashchange', _elm_lang$core$Json_Decode$value, reportLocation))) : A2(
		_elm_lang$core$Task$map,
		_elm_lang$navigation$Navigation$Normal,
		_elm_lang$core$Process$spawn(
			A3(_elm_lang$dom$Dom_LowLevel$onWindow, 'popstate', _elm_lang$core$Json_Decode$value, reportLocation)));
};
var _elm_lang$navigation$Navigation$onEffects = F4(
	function (router, cmds, subs, _p11) {
		var _p12 = _p11;
		var _p15 = _p12.popWatcher;
		var stepState = function () {
			var _p13 = {ctor: '_Tuple2', _0: subs, _1: _p15};
			_v6_2:
			do {
				if (_p13._0.ctor === '[]') {
					if (_p13._1.ctor === 'Just') {
						return A2(
							_elm_lang$navigation$Navigation_ops['&>'],
							_elm_lang$navigation$Navigation$killPopWatcher(_p13._1._0),
							_elm_lang$core$Task$succeed(
								A2(_elm_lang$navigation$Navigation$State, subs, _elm_lang$core$Maybe$Nothing)));
					} else {
						break _v6_2;
					}
				} else {
					if (_p13._1.ctor === 'Nothing') {
						return A2(
							_elm_lang$core$Task$map,
							function (_p14) {
								return A2(
									_elm_lang$navigation$Navigation$State,
									subs,
									_elm_lang$core$Maybe$Just(_p14));
							},
							_elm_lang$navigation$Navigation$spawnPopWatcher(router));
					} else {
						break _v6_2;
					}
				}
			} while(false);
			return _elm_lang$core$Task$succeed(
				A2(_elm_lang$navigation$Navigation$State, subs, _p15));
		}();
		return A2(
			_elm_lang$navigation$Navigation_ops['&>'],
			_elm_lang$core$Task$sequence(
				A2(
					_elm_lang$core$List$map,
					A2(_elm_lang$navigation$Navigation$cmdHelp, router, subs),
					cmds)),
			stepState);
	});
_elm_lang$core$Native_Platform.effectManagers['Navigation'] = {pkg: 'elm-lang/navigation', init: _elm_lang$navigation$Navigation$init, onEffects: _elm_lang$navigation$Navigation$onEffects, onSelfMsg: _elm_lang$navigation$Navigation$onSelfMsg, tag: 'fx', cmdMap: _elm_lang$navigation$Navigation$cmdMap, subMap: _elm_lang$navigation$Navigation$subMap};

var _evancz$elm_markdown$Native_Markdown = function() {


// VIRTUAL-DOM WIDGETS

function toHtml(options, factList, rawMarkdown)
{
	var model = {
		options: options,
		markdown: rawMarkdown
	};
	return _elm_lang$virtual_dom$Native_VirtualDom.custom(factList, model, implementation);
}


// WIDGET IMPLEMENTATION

var implementation = {
	render: render,
	diff: diff
};

function render(model)
{
	var html = marked(model.markdown, formatOptions(model.options));
	var div = document.createElement('div');
	div.innerHTML = html;
	return div;
}

function diff(a, b)
{
	
	if (a.model.markdown === b.model.markdown && a.model.options === b.model.options)
	{
		return null;
	}

	return {
		applyPatch: applyPatch,
		data: marked(b.model.markdown, formatOptions(b.model.options))
	};
}

function applyPatch(domNode, data)
{
	domNode.innerHTML = data;
	return domNode;
}


// ACTUAL MARKDOWN PARSER

var marked = function() {
	// catch the `marked` object regardless of the outer environment.
	// (ex. a CommonJS module compatible environment.)
	// note that this depends on marked's implementation of environment detection.
	var module = {};
	var exports = module.exports = {};

	/**
	 * marked - a markdown parser
	 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
	 * https://github.com/chjj/marked
	 * commit cd2f6f5b7091154c5526e79b5f3bfb4d15995a51
	 */
	(function(){var block={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:noop,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:noop,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,blockquote:/^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:noop,paragraph:/^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,text:/^[^\n]+/};block.bullet=/(?:[*+-]|\d+\.)/;block.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;block.item=replace(block.item,"gm")(/bull/g,block.bullet)();block.list=replace(block.list)(/bull/g,block.bullet)("hr","\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def","\\n+(?="+block.def.source+")")();block.blockquote=replace(block.blockquote)("def",block.def)();block._tag="(?!(?:"+"a|em|strong|small|s|cite|q|dfn|abbr|data|time|code"+"|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo"+"|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b";block.html=replace(block.html)("comment",/<!--[\s\S]*?-->/)("closed",/<(tag)[\s\S]+?<\/\1>/)("closing",/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,block._tag)();block.paragraph=replace(block.paragraph)("hr",block.hr)("heading",block.heading)("lheading",block.lheading)("blockquote",block.blockquote)("tag","<"+block._tag)("def",block.def)();block.normal=merge({},block);block.gfm=merge({},block.normal,{fences:/^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,paragraph:/^/,heading:/^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/});block.gfm.paragraph=replace(block.paragraph)("(?!","(?!"+block.gfm.fences.source.replace("\\1","\\2")+"|"+block.list.source.replace("\\1","\\3")+"|")();block.tables=merge({},block.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/});function Lexer(options){this.tokens=[];this.tokens.links={};this.options=options||marked.defaults;this.rules=block.normal;if(this.options.gfm){if(this.options.tables){this.rules=block.tables}else{this.rules=block.gfm}}}Lexer.rules=block;Lexer.lex=function(src,options){var lexer=new Lexer(options);return lexer.lex(src)};Lexer.prototype.lex=function(src){src=src.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n");return this.token(src,true)};Lexer.prototype.token=function(src,top,bq){var src=src.replace(/^ +$/gm,""),next,loose,cap,bull,b,item,space,i,l;while(src){if(cap=this.rules.newline.exec(src)){src=src.substring(cap[0].length);if(cap[0].length>1){this.tokens.push({type:"space"})}}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);cap=cap[0].replace(/^ {4}/gm,"");this.tokens.push({type:"code",text:!this.options.pedantic?cap.replace(/\n+$/,""):cap});continue}if(cap=this.rules.fences.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"code",lang:cap[2],text:cap[3]||""});continue}if(cap=this.rules.heading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[1].length,text:cap[2]});continue}if(top&&(cap=this.rules.nptable.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].split(/ *\| */)}this.tokens.push(item);continue}if(cap=this.rules.lheading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[2]==="="?1:2,text:cap[1]});continue}if(cap=this.rules.hr.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"hr"});continue}if(cap=this.rules.blockquote.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"blockquote_start"});cap=cap[0].replace(/^ *> ?/gm,"");this.token(cap,top,true);this.tokens.push({type:"blockquote_end"});continue}if(cap=this.rules.list.exec(src)){src=src.substring(cap[0].length);bull=cap[2];this.tokens.push({type:"list_start",ordered:bull.length>1});cap=cap[0].match(this.rules.item);next=false;l=cap.length;i=0;for(;i<l;i++){item=cap[i];space=item.length;item=item.replace(/^ *([*+-]|\d+\.) +/,"");if(~item.indexOf("\n ")){space-=item.length;item=!this.options.pedantic?item.replace(new RegExp("^ {1,"+space+"}","gm"),""):item.replace(/^ {1,4}/gm,"")}if(this.options.smartLists&&i!==l-1){b=block.bullet.exec(cap[i+1])[0];if(bull!==b&&!(bull.length>1&&b.length>1)){src=cap.slice(i+1).join("\n")+src;i=l-1}}loose=next||/\n\n(?!\s*$)/.test(item);if(i!==l-1){next=item.charAt(item.length-1)==="\n";if(!loose)loose=next}this.tokens.push({type:loose?"loose_item_start":"list_item_start"});this.token(item,false,bq);this.tokens.push({type:"list_item_end"})}this.tokens.push({type:"list_end"});continue}if(cap=this.rules.html.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:!this.options.sanitizer&&(cap[1]==="pre"||cap[1]==="script"||cap[1]==="style"),text:cap[0]});continue}if(!bq&&top&&(cap=this.rules.def.exec(src))){src=src.substring(cap[0].length);this.tokens.links[cap[1].toLowerCase()]={href:cap[2],title:cap[3]};continue}if(top&&(cap=this.rules.table.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/(?: *\| *)?\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].replace(/^ *\| *| *\| *$/g,"").split(/ *\| */)}this.tokens.push(item);continue}if(top&&(cap=this.rules.paragraph.exec(src))){src=src.substring(cap[0].length);this.tokens.push({type:"paragraph",text:cap[1].charAt(cap[1].length-1)==="\n"?cap[1].slice(0,-1):cap[1]});continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"text",text:cap[0]});continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return this.tokens};var inline={escape:/^\\([\\`*{}\[\]()#+\-.!_>])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:noop,tag:/^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:noop,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/};inline._inside=/(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;inline._href=/\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;inline.link=replace(inline.link)("inside",inline._inside)("href",inline._href)();inline.reflink=replace(inline.reflink)("inside",inline._inside)();inline.normal=merge({},inline);inline.pedantic=merge({},inline.normal,{strong:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/});inline.gfm=merge({},inline.normal,{escape:replace(inline.escape)("])","~|])")(),url:/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:replace(inline.text)("]|","~]|")("|","|https?://|")()});inline.breaks=merge({},inline.gfm,{br:replace(inline.br)("{2,}","*")(),text:replace(inline.gfm.text)("{2,}","*")()});function InlineLexer(links,options){this.options=options||marked.defaults;this.links=links;this.rules=inline.normal;this.renderer=this.options.renderer||new Renderer;this.renderer.options=this.options;if(!this.links){throw new Error("Tokens array requires a `links` property.")}if(this.options.gfm){if(this.options.breaks){this.rules=inline.breaks}else{this.rules=inline.gfm}}else if(this.options.pedantic){this.rules=inline.pedantic}}InlineLexer.rules=inline;InlineLexer.output=function(src,links,options){var inline=new InlineLexer(links,options);return inline.output(src)};InlineLexer.prototype.output=function(src){var out="",link,text,href,cap;while(src){if(cap=this.rules.escape.exec(src)){src=src.substring(cap[0].length);out+=cap[1];continue}if(cap=this.rules.autolink.exec(src)){src=src.substring(cap[0].length);if(cap[2]==="@"){text=cap[1].charAt(6)===":"?this.mangle(cap[1].substring(7)):this.mangle(cap[1]);href=this.mangle("mailto:")+text}else{text=escape(cap[1]);href=text}out+=this.renderer.link(href,null,text);continue}if(!this.inLink&&(cap=this.rules.url.exec(src))){src=src.substring(cap[0].length);text=escape(cap[1]);href=text;out+=this.renderer.link(href,null,text);continue}if(cap=this.rules.tag.exec(src)){if(!this.inLink&&/^<a /i.test(cap[0])){this.inLink=true}else if(this.inLink&&/^<\/a>/i.test(cap[0])){this.inLink=false}src=src.substring(cap[0].length);out+=this.options.sanitize?this.options.sanitizer?this.options.sanitizer(cap[0]):escape(cap[0]):cap[0];continue}if(cap=this.rules.link.exec(src)){src=src.substring(cap[0].length);this.inLink=true;out+=this.outputLink(cap,{href:cap[2],title:cap[3]});this.inLink=false;continue}if((cap=this.rules.reflink.exec(src))||(cap=this.rules.nolink.exec(src))){src=src.substring(cap[0].length);link=(cap[2]||cap[1]).replace(/\s+/g," ");link=this.links[link.toLowerCase()];if(!link||!link.href){out+=cap[0].charAt(0);src=cap[0].substring(1)+src;continue}this.inLink=true;out+=this.outputLink(cap,link);this.inLink=false;continue}if(cap=this.rules.strong.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.strong(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.em.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.em(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.codespan(escape(cap[2],true));continue}if(cap=this.rules.br.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.br();continue}if(cap=this.rules.del.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.del(this.output(cap[1]));continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.text(escape(this.smartypants(cap[0])));continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return out};InlineLexer.prototype.outputLink=function(cap,link){var href=escape(link.href),title=link.title?escape(link.title):null;return cap[0].charAt(0)!=="!"?this.renderer.link(href,title,this.output(cap[1])):this.renderer.image(href,title,escape(cap[1]))};InlineLexer.prototype.smartypants=function(text){if(!this.options.smartypants)return text;return text.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014\/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014\/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…")};InlineLexer.prototype.mangle=function(text){if(!this.options.mangle)return text;var out="",l=text.length,i=0,ch;for(;i<l;i++){ch=text.charCodeAt(i);if(Math.random()>.5){ch="x"+ch.toString(16)}out+="&#"+ch+";"}return out};function Renderer(options){this.options=options||{}}Renderer.prototype.code=function(code,lang,escaped){if(this.options.highlight){var out=this.options.highlight(code,lang);if(out!=null&&out!==code){escaped=true;code=out}}if(!lang){return"<pre><code>"+(escaped?code:escape(code,true))+"\n</code></pre>"}return'<pre><code class="'+this.options.langPrefix+escape(lang,true)+'">'+(escaped?code:escape(code,true))+"\n</code></pre>\n"};Renderer.prototype.blockquote=function(quote){return"<blockquote>\n"+quote+"</blockquote>\n"};Renderer.prototype.html=function(html){return html};Renderer.prototype.heading=function(text,level,raw){return"<h"+level+' id="'+this.options.headerPrefix+raw.toLowerCase().replace(/[^\w]+/g,"-")+'">'+text+"</h"+level+">\n"};Renderer.prototype.hr=function(){return this.options.xhtml?"<hr/>\n":"<hr>\n"};Renderer.prototype.list=function(body,ordered){var type=ordered?"ol":"ul";return"<"+type+">\n"+body+"</"+type+">\n"};Renderer.prototype.listitem=function(text){return"<li>"+text+"</li>\n"};Renderer.prototype.paragraph=function(text){return"<p>"+text+"</p>\n"};Renderer.prototype.table=function(header,body){return"<table>\n"+"<thead>\n"+header+"</thead>\n"+"<tbody>\n"+body+"</tbody>\n"+"</table>\n"};Renderer.prototype.tablerow=function(content){return"<tr>\n"+content+"</tr>\n"};Renderer.prototype.tablecell=function(content,flags){var type=flags.header?"th":"td";var tag=flags.align?"<"+type+' style="text-align:'+flags.align+'">':"<"+type+">";return tag+content+"</"+type+">\n"};Renderer.prototype.strong=function(text){return"<strong>"+text+"</strong>"};Renderer.prototype.em=function(text){return"<em>"+text+"</em>"};Renderer.prototype.codespan=function(text){return"<code>"+text+"</code>"};Renderer.prototype.br=function(){return this.options.xhtml?"<br/>":"<br>"};Renderer.prototype.del=function(text){return"<del>"+text+"</del>"};Renderer.prototype.link=function(href,title,text){if(this.options.sanitize){try{var prot=decodeURIComponent(unescape(href)).replace(/[^\w:]/g,"").toLowerCase()}catch(e){return""}if(prot.indexOf("javascript:")===0||prot.indexOf("vbscript:")===0||prot.indexOf("data:")===0){return""}}var out='<a href="'+href+'"';if(title){out+=' title="'+title+'"'}out+=">"+text+"</a>";return out};Renderer.prototype.image=function(href,title,text){var out='<img src="'+href+'" alt="'+text+'"';if(title){out+=' title="'+title+'"'}out+=this.options.xhtml?"/>":">";return out};Renderer.prototype.text=function(text){return text};function Parser(options){this.tokens=[];this.token=null;this.options=options||marked.defaults;this.options.renderer=this.options.renderer||new Renderer;this.renderer=this.options.renderer;this.renderer.options=this.options}Parser.parse=function(src,options,renderer){var parser=new Parser(options,renderer);return parser.parse(src)};Parser.prototype.parse=function(src){this.inline=new InlineLexer(src.links,this.options,this.renderer);this.tokens=src.reverse();var out="";while(this.next()){out+=this.tok()}return out};Parser.prototype.next=function(){return this.token=this.tokens.pop()};Parser.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0};Parser.prototype.parseText=function(){var body=this.token.text;while(this.peek().type==="text"){body+="\n"+this.next().text}return this.inline.output(body)};Parser.prototype.tok=function(){switch(this.token.type){case"space":{return""}case"hr":{return this.renderer.hr()}case"heading":{return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,this.token.text)}case"code":{return this.renderer.code(this.token.text,this.token.lang,this.token.escaped)}case"table":{var header="",body="",i,row,cell,flags,j;cell="";for(i=0;i<this.token.header.length;i++){flags={header:true,align:this.token.align[i]};cell+=this.renderer.tablecell(this.inline.output(this.token.header[i]),{header:true,align:this.token.align[i]})}header+=this.renderer.tablerow(cell);for(i=0;i<this.token.cells.length;i++){row=this.token.cells[i];cell="";for(j=0;j<row.length;j++){cell+=this.renderer.tablecell(this.inline.output(row[j]),{header:false,align:this.token.align[j]})}body+=this.renderer.tablerow(cell)}return this.renderer.table(header,body)}case"blockquote_start":{var body="";while(this.next().type!=="blockquote_end"){body+=this.tok()}return this.renderer.blockquote(body)}case"list_start":{var body="",ordered=this.token.ordered;while(this.next().type!=="list_end"){body+=this.tok()}return this.renderer.list(body,ordered)}case"list_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.token.type==="text"?this.parseText():this.tok()}return this.renderer.listitem(body)}case"loose_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.tok()}return this.renderer.listitem(body)}case"html":{var html=!this.token.pre&&!this.options.pedantic?this.inline.output(this.token.text):this.token.text;return this.renderer.html(html)}case"paragraph":{return this.renderer.paragraph(this.inline.output(this.token.text))}case"text":{return this.renderer.paragraph(this.parseText())}}};function escape(html,encode){return html.replace(!encode?/&(?!#?\w+;)/g:/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function unescape(html){return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g,function(_,n){n=n.toLowerCase();if(n==="colon")return":";if(n.charAt(0)==="#"){return n.charAt(1)==="x"?String.fromCharCode(parseInt(n.substring(2),16)):String.fromCharCode(+n.substring(1))}return""})}function replace(regex,opt){regex=regex.source;opt=opt||"";return function self(name,val){if(!name)return new RegExp(regex,opt);val=val.source||val;val=val.replace(/(^|[^\[])\^/g,"$1");regex=regex.replace(name,val);return self}}function noop(){}noop.exec=noop;function merge(obj){var i=1,target,key;for(;i<arguments.length;i++){target=arguments[i];for(key in target){if(Object.prototype.hasOwnProperty.call(target,key)){obj[key]=target[key]}}}return obj}function marked(src,opt,callback){if(callback||typeof opt==="function"){if(!callback){callback=opt;opt=null}opt=merge({},marked.defaults,opt||{});var highlight=opt.highlight,tokens,pending,i=0;try{tokens=Lexer.lex(src,opt)}catch(e){return callback(e)}pending=tokens.length;var done=function(err){if(err){opt.highlight=highlight;return callback(err)}var out;try{out=Parser.parse(tokens,opt)}catch(e){err=e}opt.highlight=highlight;return err?callback(err):callback(null,out)};if(!highlight||highlight.length<3){return done()}delete opt.highlight;if(!pending)return done();for(;i<tokens.length;i++){(function(token){if(token.type!=="code"){return--pending||done()}return highlight(token.text,token.lang,function(err,code){if(err)return done(err);if(code==null||code===token.text){return--pending||done()}token.text=code;token.escaped=true;--pending||done()})})(tokens[i])}return}try{if(opt)opt=merge({},marked.defaults,opt);return Parser.parse(Lexer.lex(src,opt),opt)}catch(e){e.message+="\nPlease report this to https://github.com/chjj/marked.";if((opt||marked.defaults).silent){return"<p>An error occured:</p><pre>"+escape(e.message+"",true)+"</pre>"}throw e}}marked.options=marked.setOptions=function(opt){merge(marked.defaults,opt);return marked};marked.defaults={gfm:true,tables:true,breaks:false,pedantic:false,sanitize:false,sanitizer:null,mangle:true,smartLists:false,silent:false,highlight:null,langPrefix:"lang-",smartypants:false,headerPrefix:"",renderer:new Renderer,xhtml:false};marked.Parser=Parser;marked.parser=Parser.parse;marked.Renderer=Renderer;marked.Lexer=Lexer;marked.lexer=Lexer.lex;marked.InlineLexer=InlineLexer;marked.inlineLexer=InlineLexer.output;marked.parse=marked;if(typeof module!=="undefined"&&typeof exports==="object"){module.exports=marked}else if(typeof define==="function"&&define.amd){define(function(){return marked})}else{this.marked=marked}}).call(function(){return this||(typeof window!=="undefined"?window:global)}());

	return module.exports;
}();


// FORMAT OPTIONS FOR MARKED IMPLEMENTATION

function formatOptions(options)
{
	function toHighlight(code, lang)
	{
		if (!lang && options.defaultHighlighting.ctor === 'Just')
		{
			lang = options.defaultHighlighting._0;
		}

		if (typeof hljs !== 'undefined' && lang && hljs.listLanguages().indexOf(lang) >= 0)
		{
			return hljs.highlight(lang, code, true).value;
		}

		return code;
	}

	var gfm = options.githubFlavored;
	if (gfm.ctor === 'Just')
	{
		return {
			highlight: toHighlight,
			gfm: true,
			tables: gfm._0.tables,
			breaks: gfm._0.breaks,
			sanitize: options.sanitize,
			smartypants: options.smartypants
		};
	}

	return {
		highlight: toHighlight,
		gfm: false,
		tables: false,
		breaks: false,
		sanitize: options.sanitize,
		smartypants: options.smartypants
	};
}


// EXPORTS

return {
	toHtml: F3(toHtml)
};

}();

var _evancz$elm_markdown$Markdown$toHtmlWith = _evancz$elm_markdown$Native_Markdown.toHtml;
var _evancz$elm_markdown$Markdown$defaultOptions = {
	githubFlavored: _elm_lang$core$Maybe$Just(
		{tables: false, breaks: false}),
	defaultHighlighting: _elm_lang$core$Maybe$Nothing,
	sanitize: false,
	smartypants: false
};
var _evancz$elm_markdown$Markdown$toHtml = F2(
	function (attrs, string) {
		return A3(_evancz$elm_markdown$Native_Markdown.toHtml, _evancz$elm_markdown$Markdown$defaultOptions, attrs, string);
	});
var _evancz$elm_markdown$Markdown$Options = F4(
	function (a, b, c, d) {
		return {githubFlavored: a, defaultHighlighting: b, sanitize: c, smartypants: d};
	});

var _evancz$url_parser$UrlParser$toKeyValuePair = function (segment) {
	var _p0 = A2(_elm_lang$core$String$split, '=', segment);
	if (((_p0.ctor === '::') && (_p0._1.ctor === '::')) && (_p0._1._1.ctor === '[]')) {
		return A3(
			_elm_lang$core$Maybe$map2,
			F2(
				function (v0, v1) {
					return {ctor: '_Tuple2', _0: v0, _1: v1};
				}),
			_elm_lang$http$Http$decodeUri(_p0._0),
			_elm_lang$http$Http$decodeUri(_p0._1._0));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _evancz$url_parser$UrlParser$parseParams = function (queryString) {
	return _elm_lang$core$Dict$fromList(
		A2(
			_elm_lang$core$List$filterMap,
			_evancz$url_parser$UrlParser$toKeyValuePair,
			A2(
				_elm_lang$core$String$split,
				'&',
				A2(_elm_lang$core$String$dropLeft, 1, queryString))));
};
var _evancz$url_parser$UrlParser$splitUrl = function (url) {
	var _p1 = A2(_elm_lang$core$String$split, '/', url);
	if ((_p1.ctor === '::') && (_p1._0 === '')) {
		return _p1._1;
	} else {
		return _p1;
	}
};
var _evancz$url_parser$UrlParser$parseHelp = function (states) {
	parseHelp:
	while (true) {
		var _p2 = states;
		if (_p2.ctor === '[]') {
			return _elm_lang$core$Maybe$Nothing;
		} else {
			var _p4 = _p2._0;
			var _p3 = _p4.unvisited;
			if (_p3.ctor === '[]') {
				return _elm_lang$core$Maybe$Just(_p4.value);
			} else {
				if ((_p3._0 === '') && (_p3._1.ctor === '[]')) {
					return _elm_lang$core$Maybe$Just(_p4.value);
				} else {
					var _v4 = _p2._1;
					states = _v4;
					continue parseHelp;
				}
			}
		}
	}
};
var _evancz$url_parser$UrlParser$parse = F3(
	function (_p5, url, params) {
		var _p6 = _p5;
		return _evancz$url_parser$UrlParser$parseHelp(
			_p6._0(
				{
					visited: {ctor: '[]'},
					unvisited: _evancz$url_parser$UrlParser$splitUrl(url),
					params: params,
					value: _elm_lang$core$Basics$identity
				}));
	});
var _evancz$url_parser$UrlParser$parseHash = F2(
	function (parser, location) {
		return A3(
			_evancz$url_parser$UrlParser$parse,
			parser,
			A2(_elm_lang$core$String$dropLeft, 1, location.hash),
			_evancz$url_parser$UrlParser$parseParams(location.search));
	});
var _evancz$url_parser$UrlParser$parsePath = F2(
	function (parser, location) {
		return A3(
			_evancz$url_parser$UrlParser$parse,
			parser,
			location.pathname,
			_evancz$url_parser$UrlParser$parseParams(location.search));
	});
var _evancz$url_parser$UrlParser$intParamHelp = function (maybeValue) {
	var _p7 = maybeValue;
	if (_p7.ctor === 'Nothing') {
		return _elm_lang$core$Maybe$Nothing;
	} else {
		return _elm_lang$core$Result$toMaybe(
			_elm_lang$core$String$toInt(_p7._0));
	}
};
var _evancz$url_parser$UrlParser$mapHelp = F2(
	function (func, _p8) {
		var _p9 = _p8;
		return {
			visited: _p9.visited,
			unvisited: _p9.unvisited,
			params: _p9.params,
			value: func(_p9.value)
		};
	});
var _evancz$url_parser$UrlParser$State = F4(
	function (a, b, c, d) {
		return {visited: a, unvisited: b, params: c, value: d};
	});
var _evancz$url_parser$UrlParser$Parser = function (a) {
	return {ctor: 'Parser', _0: a};
};
var _evancz$url_parser$UrlParser$s = function (str) {
	return _evancz$url_parser$UrlParser$Parser(
		function (_p10) {
			var _p11 = _p10;
			var _p12 = _p11.unvisited;
			if (_p12.ctor === '[]') {
				return {ctor: '[]'};
			} else {
				var _p13 = _p12._0;
				return _elm_lang$core$Native_Utils.eq(_p13, str) ? {
					ctor: '::',
					_0: A4(
						_evancz$url_parser$UrlParser$State,
						{ctor: '::', _0: _p13, _1: _p11.visited},
						_p12._1,
						_p11.params,
						_p11.value),
					_1: {ctor: '[]'}
				} : {ctor: '[]'};
			}
		});
};
var _evancz$url_parser$UrlParser$custom = F2(
	function (tipe, stringToSomething) {
		return _evancz$url_parser$UrlParser$Parser(
			function (_p14) {
				var _p15 = _p14;
				var _p16 = _p15.unvisited;
				if (_p16.ctor === '[]') {
					return {ctor: '[]'};
				} else {
					var _p18 = _p16._0;
					var _p17 = stringToSomething(_p18);
					if (_p17.ctor === 'Ok') {
						return {
							ctor: '::',
							_0: A4(
								_evancz$url_parser$UrlParser$State,
								{ctor: '::', _0: _p18, _1: _p15.visited},
								_p16._1,
								_p15.params,
								_p15.value(_p17._0)),
							_1: {ctor: '[]'}
						};
					} else {
						return {ctor: '[]'};
					}
				}
			});
	});
var _evancz$url_parser$UrlParser$string = A2(_evancz$url_parser$UrlParser$custom, 'STRING', _elm_lang$core$Result$Ok);
var _evancz$url_parser$UrlParser$int = A2(_evancz$url_parser$UrlParser$custom, 'NUMBER', _elm_lang$core$String$toInt);
var _evancz$url_parser$UrlParser_ops = _evancz$url_parser$UrlParser_ops || {};
_evancz$url_parser$UrlParser_ops['</>'] = F2(
	function (_p20, _p19) {
		var _p21 = _p20;
		var _p22 = _p19;
		return _evancz$url_parser$UrlParser$Parser(
			function (state) {
				return A2(
					_elm_lang$core$List$concatMap,
					_p22._0,
					_p21._0(state));
			});
	});
var _evancz$url_parser$UrlParser$map = F2(
	function (subValue, _p23) {
		var _p24 = _p23;
		return _evancz$url_parser$UrlParser$Parser(
			function (_p25) {
				var _p26 = _p25;
				return A2(
					_elm_lang$core$List$map,
					_evancz$url_parser$UrlParser$mapHelp(_p26.value),
					_p24._0(
						{visited: _p26.visited, unvisited: _p26.unvisited, params: _p26.params, value: subValue}));
			});
	});
var _evancz$url_parser$UrlParser$oneOf = function (parsers) {
	return _evancz$url_parser$UrlParser$Parser(
		function (state) {
			return A2(
				_elm_lang$core$List$concatMap,
				function (_p27) {
					var _p28 = _p27;
					return _p28._0(state);
				},
				parsers);
		});
};
var _evancz$url_parser$UrlParser$top = _evancz$url_parser$UrlParser$Parser(
	function (state) {
		return {
			ctor: '::',
			_0: state,
			_1: {ctor: '[]'}
		};
	});
var _evancz$url_parser$UrlParser_ops = _evancz$url_parser$UrlParser_ops || {};
_evancz$url_parser$UrlParser_ops['<?>'] = F2(
	function (_p30, _p29) {
		var _p31 = _p30;
		var _p32 = _p29;
		return _evancz$url_parser$UrlParser$Parser(
			function (state) {
				return A2(
					_elm_lang$core$List$concatMap,
					_p32._0,
					_p31._0(state));
			});
	});
var _evancz$url_parser$UrlParser$QueryParser = function (a) {
	return {ctor: 'QueryParser', _0: a};
};
var _evancz$url_parser$UrlParser$customParam = F2(
	function (key, func) {
		return _evancz$url_parser$UrlParser$QueryParser(
			function (_p33) {
				var _p34 = _p33;
				var _p35 = _p34.params;
				return {
					ctor: '::',
					_0: A4(
						_evancz$url_parser$UrlParser$State,
						_p34.visited,
						_p34.unvisited,
						_p35,
						_p34.value(
							func(
								A2(_elm_lang$core$Dict$get, key, _p35)))),
					_1: {ctor: '[]'}
				};
			});
	});
var _evancz$url_parser$UrlParser$stringParam = function (name) {
	return A2(_evancz$url_parser$UrlParser$customParam, name, _elm_lang$core$Basics$identity);
};
var _evancz$url_parser$UrlParser$intParam = function (name) {
	return A2(_evancz$url_parser$UrlParser$customParam, name, _evancz$url_parser$UrlParser$intParamHelp);
};

var _lukewestby$elm_http_builder$HttpBuilder$replace = F2(
	function (old, $new) {
		return function (_p0) {
			return A2(
				_elm_lang$core$String$join,
				$new,
				A2(_elm_lang$core$String$split, old, _p0));
		};
	});
var _lukewestby$elm_http_builder$HttpBuilder$queryEscape = function (_p1) {
	return A3(
		_lukewestby$elm_http_builder$HttpBuilder$replace,
		'%20',
		'+',
		_elm_lang$http$Http$encodeUri(_p1));
};
var _lukewestby$elm_http_builder$HttpBuilder$queryPair = function (_p2) {
	var _p3 = _p2;
	return A2(
		_elm_lang$core$Basics_ops['++'],
		_lukewestby$elm_http_builder$HttpBuilder$queryEscape(_p3._0),
		A2(
			_elm_lang$core$Basics_ops['++'],
			'=',
			_lukewestby$elm_http_builder$HttpBuilder$queryEscape(_p3._1)));
};
var _lukewestby$elm_http_builder$HttpBuilder$joinUrlEncoded = function (args) {
	return A2(
		_elm_lang$core$String$join,
		'&',
		A2(_elm_lang$core$List$map, _lukewestby$elm_http_builder$HttpBuilder$queryPair, args));
};
var _lukewestby$elm_http_builder$HttpBuilder$toRequest = function (builder) {
	var encodedParams = _lukewestby$elm_http_builder$HttpBuilder$joinUrlEncoded(builder.queryParams);
	var fullUrl = _elm_lang$core$String$isEmpty(encodedParams) ? builder.url : A2(
		_elm_lang$core$Basics_ops['++'],
		builder.url,
		A2(_elm_lang$core$Basics_ops['++'], '?', encodedParams));
	return _elm_lang$http$Http$request(
		{method: builder.method, url: fullUrl, headers: builder.headers, body: builder.body, expect: builder.expect, timeout: builder.timeout, withCredentials: builder.withCredentials});
};
var _lukewestby$elm_http_builder$HttpBuilder$toTaskPlain = function (builder) {
	return _elm_lang$http$Http$toTask(
		_lukewestby$elm_http_builder$HttpBuilder$toRequest(builder));
};
var _lukewestby$elm_http_builder$HttpBuilder$withCacheBuster = F2(
	function (paramName, builder) {
		return _elm_lang$core$Native_Utils.update(
			builder,
			{
				cacheBuster: _elm_lang$core$Maybe$Just(paramName)
			});
	});
var _lukewestby$elm_http_builder$HttpBuilder$withQueryParams = F2(
	function (queryParams, builder) {
		return _elm_lang$core$Native_Utils.update(
			builder,
			{
				queryParams: A2(_elm_lang$core$Basics_ops['++'], builder.queryParams, queryParams)
			});
	});
var _lukewestby$elm_http_builder$HttpBuilder$toTaskWithCacheBuster = F2(
	function (paramName, builder) {
		var request = function (timestamp) {
			return _lukewestby$elm_http_builder$HttpBuilder$toTaskPlain(
				A2(
					_lukewestby$elm_http_builder$HttpBuilder$withQueryParams,
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: paramName,
							_1: _elm_lang$core$Basics$toString(timestamp)
						},
						_1: {ctor: '[]'}
					},
					builder));
		};
		return A2(_elm_lang$core$Task$andThen, request, _elm_lang$core$Time$now);
	});
var _lukewestby$elm_http_builder$HttpBuilder$toTask = function (builder) {
	var _p4 = builder.cacheBuster;
	if (_p4.ctor === 'Just') {
		return A2(_lukewestby$elm_http_builder$HttpBuilder$toTaskWithCacheBuster, _p4._0, builder);
	} else {
		return _lukewestby$elm_http_builder$HttpBuilder$toTaskPlain(builder);
	}
};
var _lukewestby$elm_http_builder$HttpBuilder$send = F2(
	function (tagger, builder) {
		return A2(
			_elm_lang$core$Task$attempt,
			tagger,
			_lukewestby$elm_http_builder$HttpBuilder$toTask(builder));
	});
var _lukewestby$elm_http_builder$HttpBuilder$withExpectString = function (builder) {
	return _elm_lang$core$Native_Utils.update(
		builder,
		{expect: _elm_lang$http$Http$expectString});
};
var _lukewestby$elm_http_builder$HttpBuilder$withExpectJson = F2(
	function (decoder, builder) {
		return _elm_lang$core$Native_Utils.update(
			builder,
			{
				expect: _elm_lang$http$Http$expectJson(decoder)
			});
	});
var _lukewestby$elm_http_builder$HttpBuilder$withExpect = F2(
	function (expect, builder) {
		return _elm_lang$core$Native_Utils.update(
			builder,
			{expect: expect});
	});
var _lukewestby$elm_http_builder$HttpBuilder$withCredentials = function (builder) {
	return _elm_lang$core$Native_Utils.update(
		builder,
		{withCredentials: true});
};
var _lukewestby$elm_http_builder$HttpBuilder$withTimeout = F2(
	function (timeout, builder) {
		return _elm_lang$core$Native_Utils.update(
			builder,
			{
				timeout: _elm_lang$core$Maybe$Just(timeout)
			});
	});
var _lukewestby$elm_http_builder$HttpBuilder$withBody = F2(
	function (body, builder) {
		return _elm_lang$core$Native_Utils.update(
			builder,
			{body: body});
	});
var _lukewestby$elm_http_builder$HttpBuilder$withStringBody = F2(
	function (contentType, value) {
		return _lukewestby$elm_http_builder$HttpBuilder$withBody(
			A2(_elm_lang$http$Http$stringBody, contentType, value));
	});
var _lukewestby$elm_http_builder$HttpBuilder$withUrlEncodedBody = function (_p5) {
	return A2(
		_lukewestby$elm_http_builder$HttpBuilder$withStringBody,
		'application/x-www-form-urlencoded',
		_lukewestby$elm_http_builder$HttpBuilder$joinUrlEncoded(_p5));
};
var _lukewestby$elm_http_builder$HttpBuilder$withJsonBody = function (value) {
	return _lukewestby$elm_http_builder$HttpBuilder$withBody(
		_elm_lang$http$Http$jsonBody(value));
};
var _lukewestby$elm_http_builder$HttpBuilder$withMultipartStringBody = function (partPairs) {
	return _lukewestby$elm_http_builder$HttpBuilder$withBody(
		_elm_lang$http$Http$multipartBody(
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Basics$uncurry(_elm_lang$http$Http$stringPart),
				partPairs)));
};
var _lukewestby$elm_http_builder$HttpBuilder$withBearerToken = F2(
	function (value, builder) {
		return _elm_lang$core$Native_Utils.update(
			builder,
			{
				headers: {
					ctor: '::',
					_0: A2(
						_elm_lang$http$Http$header,
						'Authorization',
						A2(_elm_lang$core$Basics_ops['++'], 'Bearer ', value)),
					_1: builder.headers
				}
			});
	});
var _lukewestby$elm_http_builder$HttpBuilder$withHeaders = F2(
	function (headerPairs, builder) {
		return _elm_lang$core$Native_Utils.update(
			builder,
			{
				headers: A2(
					_elm_lang$core$Basics_ops['++'],
					A2(
						_elm_lang$core$List$map,
						_elm_lang$core$Basics$uncurry(_elm_lang$http$Http$header),
						headerPairs),
					builder.headers)
			});
	});
var _lukewestby$elm_http_builder$HttpBuilder$withHeader = F3(
	function (key, value, builder) {
		return _elm_lang$core$Native_Utils.update(
			builder,
			{
				headers: {
					ctor: '::',
					_0: A2(_elm_lang$http$Http$header, key, value),
					_1: builder.headers
				}
			});
	});
var _lukewestby$elm_http_builder$HttpBuilder$requestWithMethodAndUrl = F2(
	function (method, url) {
		return {
			method: method,
			url: url,
			headers: {ctor: '[]'},
			body: _elm_lang$http$Http$emptyBody,
			expect: _elm_lang$http$Http$expectStringResponse(
				function (_p6) {
					return _elm_lang$core$Result$Ok(
						{ctor: '_Tuple0'});
				}),
			timeout: _elm_lang$core$Maybe$Nothing,
			withCredentials: false,
			queryParams: {ctor: '[]'},
			cacheBuster: _elm_lang$core$Maybe$Nothing
		};
	});
var _lukewestby$elm_http_builder$HttpBuilder$get = _lukewestby$elm_http_builder$HttpBuilder$requestWithMethodAndUrl('GET');
var _lukewestby$elm_http_builder$HttpBuilder$post = _lukewestby$elm_http_builder$HttpBuilder$requestWithMethodAndUrl('POST');
var _lukewestby$elm_http_builder$HttpBuilder$put = _lukewestby$elm_http_builder$HttpBuilder$requestWithMethodAndUrl('PUT');
var _lukewestby$elm_http_builder$HttpBuilder$patch = _lukewestby$elm_http_builder$HttpBuilder$requestWithMethodAndUrl('PATCH');
var _lukewestby$elm_http_builder$HttpBuilder$delete = _lukewestby$elm_http_builder$HttpBuilder$requestWithMethodAndUrl('DELETE');
var _lukewestby$elm_http_builder$HttpBuilder$options = _lukewestby$elm_http_builder$HttpBuilder$requestWithMethodAndUrl('OPTIONS');
var _lukewestby$elm_http_builder$HttpBuilder$trace = _lukewestby$elm_http_builder$HttpBuilder$requestWithMethodAndUrl('TRACE');
var _lukewestby$elm_http_builder$HttpBuilder$head = _lukewestby$elm_http_builder$HttpBuilder$requestWithMethodAndUrl('HEAD');
var _lukewestby$elm_http_builder$HttpBuilder$RequestBuilder = F9(
	function (a, b, c, d, e, f, g, h, i) {
		return {method: a, headers: b, url: c, body: d, expect: e, timeout: f, withCredentials: g, queryParams: h, cacheBuster: i};
	});

var _mgold$elm_date_format$Date_Local$greek = {
	date: {
		months: {jan: 'Ιανουαρίου', feb: 'Φεβρουαρίου', mar: 'Μαρτίου', apr: 'Απριλίου', may: 'Μαΐου', jun: 'Ιουνίου', jul: 'Ιουλίου', aug: 'Αυγούστου', sep: 'Σεπτεμβρίου', oct: 'Οκτωβρίου', nov: 'Νοεμβρίου', dec: 'Δεκεμβρίου'},
		monthsAbbrev: {jan: 'Ιαν', feb: 'Φεβ', mar: 'Μαρ', apr: 'Απρ', may: 'Μαϊ', jun: 'Ιουν', jul: 'Ιουλ', aug: 'Αυγ', sep: 'Σεπ', oct: 'Οκτ', nov: 'Νοε', dec: 'Δεκ'},
		wdays: {mon: 'Δευτέρα', tue: 'Τρίτη', wed: 'Τετάρτη', thu: 'Πέμπτη', fri: 'Παρασκευή', sat: 'Σάββατο', sun: 'Κυριακή'},
		wdaysAbbrev: {mon: 'Δευ', tue: 'Τρι', wed: 'Τετ', thu: 'Πεμ', fri: 'Παρ', sat: 'Σαβ', sun: 'Κυρ'},
		defaultFormat: _elm_lang$core$Maybe$Nothing
	},
	time: {am: 'πμ', pm: 'μμ', defaultFormat: _elm_lang$core$Maybe$Nothing},
	timeZones: _elm_lang$core$Maybe$Nothing,
	defaultFormat: _elm_lang$core$Maybe$Nothing
};
var _mgold$elm_date_format$Date_Local$brazilian = {
	date: {
		months: {jan: 'Janeiro', feb: 'Fevereiro', mar: 'Março', apr: 'Abril', may: 'Maio', jun: 'Junho', jul: 'Julho', aug: 'Agosto', sep: 'Setembro', oct: 'Outubro', nov: 'Novembro', dec: 'Dezembro'},
		monthsAbbrev: {jan: 'Jan', feb: 'Fev', mar: 'Mar', apr: 'Abr', may: 'Mai', jun: 'Jun', jul: 'Jul', aug: 'Ago', sep: 'Set', oct: 'Out', nov: 'Nov', dec: 'Dez'},
		wdays: {mon: 'Segunda-feira', tue: 'Terça-feira', wed: 'Quarta-feira', thu: 'Quinta-feira', fri: 'Sexta-feira', sat: 'Sábado', sun: 'Domingo'},
		wdaysAbbrev: {mon: 'Seg', tue: 'Ter', wed: 'Qua', thu: 'Qui', fri: 'Sex', sat: 'Sáb', sun: 'Dom'},
		defaultFormat: _elm_lang$core$Maybe$Just('%e de %B de %Y')
	},
	time: {
		am: 'am',
		pm: 'pm',
		defaultFormat: _elm_lang$core$Maybe$Just('%k:%M')
	},
	timeZones: _elm_lang$core$Maybe$Nothing,
	defaultFormat: _elm_lang$core$Maybe$Nothing
};
var _mgold$elm_date_format$Date_Local$french = {
	date: {
		months: {jan: 'Janvier', feb: 'Février', mar: 'Mars', apr: 'Avril', may: 'Mai', jun: 'Juin', jul: 'Juillet', aug: 'Août', sep: 'Septembre', oct: 'Octobre', nov: 'Novembre', dec: 'Décembre'},
		monthsAbbrev: {jan: 'Jan', feb: 'Fév', mar: 'Mar', apr: 'Avr', may: 'Mai', jun: 'Jui', jul: 'Jul', aug: 'Aoû', sep: 'Sep', oct: 'Oct', nov: 'Nov', dec: 'Déc'},
		wdays: {mon: 'Lundi', tue: 'Mardi', wed: 'Mercredi', thu: 'Jeudi', fri: 'Vendredi', sat: 'Samedi', sun: 'Dimanche'},
		wdaysAbbrev: {mon: 'Lun', tue: 'Mar', wed: 'Mer', thu: 'Jeu', fri: 'Ven', sat: 'Sam', sun: 'Dim'},
		defaultFormat: _elm_lang$core$Maybe$Nothing
	},
	time: {am: 'am', pm: 'pm', defaultFormat: _elm_lang$core$Maybe$Nothing},
	timeZones: _elm_lang$core$Maybe$Nothing,
	defaultFormat: _elm_lang$core$Maybe$Nothing
};
var _mgold$elm_date_format$Date_Local$international = {
	date: {
		months: {jan: 'January', feb: 'February', mar: 'March', apr: 'April', may: 'May', jun: 'June', jul: 'July', aug: 'August', sep: 'September', oct: 'October', nov: 'November', dec: 'December'},
		monthsAbbrev: {jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr', may: 'May', jun: 'Jun', jul: 'Jul', aug: 'Aug', sep: 'Sep', oct: 'Oct', nov: 'Nov', dec: 'Dec'},
		wdays: {mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday'},
		wdaysAbbrev: {mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun'},
		defaultFormat: _elm_lang$core$Maybe$Nothing
	},
	time: {am: 'am', pm: 'pm', defaultFormat: _elm_lang$core$Maybe$Nothing},
	timeZones: _elm_lang$core$Maybe$Nothing,
	defaultFormat: _elm_lang$core$Maybe$Nothing
};
var _mgold$elm_date_format$Date_Local$Local = F4(
	function (a, b, c, d) {
		return {date: a, time: b, timeZones: c, defaultFormat: d};
	});
var _mgold$elm_date_format$Date_Local$Months = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return function (k) {
											return function (l) {
												return {jan: a, feb: b, mar: c, apr: d, may: e, jun: f, jul: g, aug: h, sep: i, oct: j, nov: k, dec: l};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _mgold$elm_date_format$Date_Local$WeekDays = F7(
	function (a, b, c, d, e, f, g) {
		return {mon: a, tue: b, wed: c, thu: d, fri: e, sat: f, sun: g};
	});

var _mgold$elm_date_format$Date_Format$padWith = function (padding) {
	var padder = function () {
		var _p0 = padding;
		switch (_p0.ctor) {
			case 'NoPadding':
				return _elm_lang$core$Basics$identity;
			case 'Zero':
				return A2(
					_elm_lang$core$String$padLeft,
					2,
					_elm_lang$core$Native_Utils.chr('0'));
			case 'ZeroThreeDigits':
				return A2(
					_elm_lang$core$String$padLeft,
					3,
					_elm_lang$core$Native_Utils.chr('0'));
			default:
				return A2(
					_elm_lang$core$String$padLeft,
					2,
					_elm_lang$core$Native_Utils.chr(' '));
		}
	}();
	return function (_p1) {
		return padder(
			_elm_lang$core$Basics$toString(_p1));
	};
};
var _mgold$elm_date_format$Date_Format$zero2twelve = function (n) {
	return _elm_lang$core$Native_Utils.eq(n, 0) ? 12 : n;
};
var _mgold$elm_date_format$Date_Format$mod12 = function (h) {
	return A2(_elm_lang$core$Basics_ops['%'], h, 12);
};
var _mgold$elm_date_format$Date_Format$dayOfWeekToWord = F2(
	function (loc, dow) {
		var _p2 = dow;
		switch (_p2.ctor) {
			case 'Mon':
				return loc.mon;
			case 'Tue':
				return loc.tue;
			case 'Wed':
				return loc.wed;
			case 'Thu':
				return loc.thu;
			case 'Fri':
				return loc.fri;
			case 'Sat':
				return loc.sat;
			default:
				return loc.sun;
		}
	});
var _mgold$elm_date_format$Date_Format$monthToWord = F2(
	function (loc, m) {
		var _p3 = m;
		switch (_p3.ctor) {
			case 'Jan':
				return loc.jan;
			case 'Feb':
				return loc.feb;
			case 'Mar':
				return loc.mar;
			case 'Apr':
				return loc.apr;
			case 'May':
				return loc.may;
			case 'Jun':
				return loc.jun;
			case 'Jul':
				return loc.jul;
			case 'Aug':
				return loc.aug;
			case 'Sep':
				return loc.sep;
			case 'Oct':
				return loc.oct;
			case 'Nov':
				return loc.nov;
			default:
				return loc.dec;
		}
	});
var _mgold$elm_date_format$Date_Format$monthToInt = function (m) {
	var _p4 = m;
	switch (_p4.ctor) {
		case 'Jan':
			return 1;
		case 'Feb':
			return 2;
		case 'Mar':
			return 3;
		case 'Apr':
			return 4;
		case 'May':
			return 5;
		case 'Jun':
			return 6;
		case 'Jul':
			return 7;
		case 'Aug':
			return 8;
		case 'Sep':
			return 9;
		case 'Oct':
			return 10;
		case 'Nov':
			return 11;
		default:
			return 12;
	}
};
var _mgold$elm_date_format$Date_Format$re = _elm_lang$core$Regex$regex('%(_|-|0)?(%|Y|y|m|B|b|d|e|a|A|H|k|I|l|L|p|P|M|S)');
var _mgold$elm_date_format$Date_Format$ZeroThreeDigits = {ctor: 'ZeroThreeDigits'};
var _mgold$elm_date_format$Date_Format$Zero = {ctor: 'Zero'};
var _mgold$elm_date_format$Date_Format$Space = {ctor: 'Space'};
var _mgold$elm_date_format$Date_Format$NoPadding = {ctor: 'NoPadding'};
var _mgold$elm_date_format$Date_Format$formatToken = F3(
	function (loc, d, m) {
		var _p5 = function () {
			var _p6 = m.submatches;
			_v4_4:
			do {
				if (_p6.ctor === '::') {
					if (_p6._0.ctor === 'Just') {
						if (((_p6._1.ctor === '::') && (_p6._1._0.ctor === 'Just')) && (_p6._1._1.ctor === '[]')) {
							switch (_p6._0._0) {
								case '-':
									return {
										ctor: '_Tuple2',
										_0: _elm_lang$core$Maybe$Just(_mgold$elm_date_format$Date_Format$NoPadding),
										_1: _p6._1._0._0
									};
								case '_':
									return {
										ctor: '_Tuple2',
										_0: _elm_lang$core$Maybe$Just(_mgold$elm_date_format$Date_Format$Space),
										_1: _p6._1._0._0
									};
								case '0':
									return {
										ctor: '_Tuple2',
										_0: _elm_lang$core$Maybe$Just(_mgold$elm_date_format$Date_Format$Zero),
										_1: _p6._1._0._0
									};
								default:
									break _v4_4;
							}
						} else {
							break _v4_4;
						}
					} else {
						if (((_p6._1.ctor === '::') && (_p6._1._0.ctor === 'Just')) && (_p6._1._1.ctor === '[]')) {
							return {ctor: '_Tuple2', _0: _elm_lang$core$Maybe$Nothing, _1: _p6._1._0._0};
						} else {
							break _v4_4;
						}
					}
				} else {
					break _v4_4;
				}
			} while(false);
			return {ctor: '_Tuple2', _0: _elm_lang$core$Maybe$Nothing, _1: ' '};
		}();
		var padding = _p5._0;
		var symbol = _p5._1;
		var _p7 = symbol;
		switch (_p7) {
			case '%':
				return '%';
			case 'Y':
				return _elm_lang$core$Basics$toString(
					_elm_lang$core$Date$year(d));
			case 'y':
				return A2(
					_elm_lang$core$String$right,
					2,
					_elm_lang$core$Basics$toString(
						_elm_lang$core$Date$year(d)));
			case 'm':
				return A2(
					_mgold$elm_date_format$Date_Format$padWith,
					A2(_elm_lang$core$Maybe$withDefault, _mgold$elm_date_format$Date_Format$Zero, padding),
					_mgold$elm_date_format$Date_Format$monthToInt(
						_elm_lang$core$Date$month(d)));
			case 'B':
				return A2(
					_mgold$elm_date_format$Date_Format$monthToWord,
					loc.date.months,
					_elm_lang$core$Date$month(d));
			case 'b':
				return A2(
					_mgold$elm_date_format$Date_Format$monthToWord,
					loc.date.monthsAbbrev,
					_elm_lang$core$Date$month(d));
			case 'd':
				return A2(
					_mgold$elm_date_format$Date_Format$padWith,
					A2(_elm_lang$core$Maybe$withDefault, _mgold$elm_date_format$Date_Format$Zero, padding),
					_elm_lang$core$Date$day(d));
			case 'e':
				return A2(
					_mgold$elm_date_format$Date_Format$padWith,
					A2(_elm_lang$core$Maybe$withDefault, _mgold$elm_date_format$Date_Format$Space, padding),
					_elm_lang$core$Date$day(d));
			case 'a':
				return A2(
					_mgold$elm_date_format$Date_Format$dayOfWeekToWord,
					loc.date.wdaysAbbrev,
					_elm_lang$core$Date$dayOfWeek(d));
			case 'A':
				return A2(
					_mgold$elm_date_format$Date_Format$dayOfWeekToWord,
					loc.date.wdays,
					_elm_lang$core$Date$dayOfWeek(d));
			case 'H':
				return A2(
					_mgold$elm_date_format$Date_Format$padWith,
					A2(_elm_lang$core$Maybe$withDefault, _mgold$elm_date_format$Date_Format$Zero, padding),
					_elm_lang$core$Date$hour(d));
			case 'k':
				return A2(
					_mgold$elm_date_format$Date_Format$padWith,
					A2(_elm_lang$core$Maybe$withDefault, _mgold$elm_date_format$Date_Format$Space, padding),
					_elm_lang$core$Date$hour(d));
			case 'I':
				return A2(
					_mgold$elm_date_format$Date_Format$padWith,
					A2(_elm_lang$core$Maybe$withDefault, _mgold$elm_date_format$Date_Format$Zero, padding),
					_mgold$elm_date_format$Date_Format$zero2twelve(
						_mgold$elm_date_format$Date_Format$mod12(
							_elm_lang$core$Date$hour(d))));
			case 'l':
				return A2(
					_mgold$elm_date_format$Date_Format$padWith,
					A2(_elm_lang$core$Maybe$withDefault, _mgold$elm_date_format$Date_Format$Space, padding),
					_mgold$elm_date_format$Date_Format$zero2twelve(
						_mgold$elm_date_format$Date_Format$mod12(
							_elm_lang$core$Date$hour(d))));
			case 'p':
				return (_elm_lang$core$Native_Utils.cmp(
					_elm_lang$core$Date$hour(d),
					12) < 0) ? _elm_lang$core$String$toUpper(loc.time.am) : _elm_lang$core$String$toUpper(loc.time.pm);
			case 'P':
				return (_elm_lang$core$Native_Utils.cmp(
					_elm_lang$core$Date$hour(d),
					12) < 0) ? loc.time.am : loc.time.pm;
			case 'M':
				return A2(
					_mgold$elm_date_format$Date_Format$padWith,
					A2(_elm_lang$core$Maybe$withDefault, _mgold$elm_date_format$Date_Format$Zero, padding),
					_elm_lang$core$Date$minute(d));
			case 'S':
				return A2(
					_mgold$elm_date_format$Date_Format$padWith,
					A2(_elm_lang$core$Maybe$withDefault, _mgold$elm_date_format$Date_Format$Zero, padding),
					_elm_lang$core$Date$second(d));
			case 'L':
				return A2(
					_mgold$elm_date_format$Date_Format$padWith,
					A2(_elm_lang$core$Maybe$withDefault, _mgold$elm_date_format$Date_Format$ZeroThreeDigits, padding),
					_elm_lang$core$Date$millisecond(d));
			default:
				return '';
		}
	});
var _mgold$elm_date_format$Date_Format$localFormat = F3(
	function (loc, s, d) {
		return A4(
			_elm_lang$core$Regex$replace,
			_elm_lang$core$Regex$All,
			_mgold$elm_date_format$Date_Format$re,
			A2(_mgold$elm_date_format$Date_Format$formatToken, loc, d),
			s);
	});
var _mgold$elm_date_format$Date_Format$format = F2(
	function (s, d) {
		return A3(_mgold$elm_date_format$Date_Format$localFormat, _mgold$elm_date_format$Date_Local$international, s, d);
	});
var _mgold$elm_date_format$Date_Format$formatISO8601 = _mgold$elm_date_format$Date_Format$format('%Y-%m-%dT%H:%M:%SZ');

var _rtfeldman$elm_validate$Validate$validEmail = _elm_lang$core$Regex$caseInsensitive(
	_elm_lang$core$Regex$regex('^[a-zA-Z0-9.!#$%&\'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'));
var _rtfeldman$elm_validate$Validate$lacksNonWhitespaceChars = _elm_lang$core$Regex$regex('^\\s*$');
var _rtfeldman$elm_validate$Validate$isInt = function (str) {
	var _p0 = _elm_lang$core$String$toInt(str);
	if (_p0.ctor === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var _rtfeldman$elm_validate$Validate$isValidEmail = function (email) {
	return A2(_elm_lang$core$Regex$contains, _rtfeldman$elm_validate$Validate$validEmail, email);
};
var _rtfeldman$elm_validate$Validate$isBlank = function (str) {
	return A2(_elm_lang$core$Regex$contains, _rtfeldman$elm_validate$Validate$lacksNonWhitespaceChars, str);
};
var _rtfeldman$elm_validate$Validate$any = F2(
	function (validators, subject) {
		any:
		while (true) {
			var _p1 = validators;
			if (_p1.ctor === '[]') {
				return true;
			} else {
				var _p2 = _p1._0._0(subject);
				if (_p2.ctor === '[]') {
					var _v3 = _p1._1,
						_v4 = subject;
					validators = _v3;
					subject = _v4;
					continue any;
				} else {
					return false;
				}
			}
		}
	});
var _rtfeldman$elm_validate$Validate$firstErrorHelp = F2(
	function (validators, subject) {
		firstErrorHelp:
		while (true) {
			var _p3 = validators;
			if (_p3.ctor === '[]') {
				return {ctor: '[]'};
			} else {
				var _p4 = _p3._0._0(subject);
				if (_p4.ctor === '[]') {
					var _v7 = _p3._1,
						_v8 = subject;
					validators = _v7;
					subject = _v8;
					continue firstErrorHelp;
				} else {
					return _p4;
				}
			}
		}
	});
var _rtfeldman$elm_validate$Validate$validate = F2(
	function (_p5, subject) {
		var _p6 = _p5;
		return _p6._0(subject);
	});
var _rtfeldman$elm_validate$Validate$Validator = function (a) {
	return {ctor: 'Validator', _0: a};
};
var _rtfeldman$elm_validate$Validate$ifNotInt = F2(
	function (subjectToString, errorFromString) {
		var getErrors = function (subject) {
			var str = subjectToString(subject);
			return _rtfeldman$elm_validate$Validate$isInt(str) ? {ctor: '[]'} : {
				ctor: '::',
				_0: errorFromString(str),
				_1: {ctor: '[]'}
			};
		};
		return _rtfeldman$elm_validate$Validate$Validator(getErrors);
	});
var _rtfeldman$elm_validate$Validate$ifInvalidEmail = F2(
	function (subjectToEmail, errorFromEmail) {
		var getErrors = function (subject) {
			var email = subjectToEmail(subject);
			return _rtfeldman$elm_validate$Validate$isValidEmail(email) ? {ctor: '[]'} : {
				ctor: '::',
				_0: errorFromEmail(email),
				_1: {ctor: '[]'}
			};
		};
		return _rtfeldman$elm_validate$Validate$Validator(getErrors);
	});
var _rtfeldman$elm_validate$Validate$fromErrors = function (toErrors) {
	return _rtfeldman$elm_validate$Validate$Validator(toErrors);
};
var _rtfeldman$elm_validate$Validate$ifTrue = F2(
	function (test, error) {
		var getErrors = function (subject) {
			return test(subject) ? {
				ctor: '::',
				_0: error,
				_1: {ctor: '[]'}
			} : {ctor: '[]'};
		};
		return _rtfeldman$elm_validate$Validate$Validator(getErrors);
	});
var _rtfeldman$elm_validate$Validate$ifBlank = F2(
	function (subjectToString, error) {
		return A2(
			_rtfeldman$elm_validate$Validate$ifTrue,
			function (subject) {
				return _rtfeldman$elm_validate$Validate$isBlank(
					subjectToString(subject));
			},
			error);
	});
var _rtfeldman$elm_validate$Validate$ifEmptyList = F2(
	function (subjectToList, error) {
		return A2(
			_rtfeldman$elm_validate$Validate$ifTrue,
			function (subject) {
				return _elm_lang$core$List$isEmpty(
					subjectToList(subject));
			},
			error);
	});
var _rtfeldman$elm_validate$Validate$ifEmptyDict = F2(
	function (subjectToDict, error) {
		return A2(
			_rtfeldman$elm_validate$Validate$ifTrue,
			function (subject) {
				return _elm_lang$core$Dict$isEmpty(
					subjectToDict(subject));
			},
			error);
	});
var _rtfeldman$elm_validate$Validate$ifEmptySet = F2(
	function (subjectToSet, error) {
		return A2(
			_rtfeldman$elm_validate$Validate$ifTrue,
			function (subject) {
				return _elm_lang$core$Set$isEmpty(
					subjectToSet(subject));
			},
			error);
	});
var _rtfeldman$elm_validate$Validate$ifNothing = F2(
	function (subjectToMaybe, error) {
		return A2(
			_rtfeldman$elm_validate$Validate$ifTrue,
			function (subject) {
				return _elm_lang$core$Native_Utils.eq(
					subjectToMaybe(subject),
					_elm_lang$core$Maybe$Nothing);
			},
			error);
	});
var _rtfeldman$elm_validate$Validate$ifFalse = F2(
	function (test, error) {
		var getErrors = function (subject) {
			return test(subject) ? {ctor: '[]'} : {
				ctor: '::',
				_0: error,
				_1: {ctor: '[]'}
			};
		};
		return _rtfeldman$elm_validate$Validate$Validator(getErrors);
	});
var _rtfeldman$elm_validate$Validate$all = function (validators) {
	var newGetErrors = function (subject) {
		var accumulateErrors = F2(
			function (_p7, totalErrors) {
				var _p8 = _p7;
				return A2(
					_elm_lang$core$Basics_ops['++'],
					totalErrors,
					_p8._0(subject));
			});
		return A3(
			_elm_lang$core$List$foldl,
			accumulateErrors,
			{ctor: '[]'},
			validators);
	};
	return _rtfeldman$elm_validate$Validate$Validator(newGetErrors);
};
var _rtfeldman$elm_validate$Validate$firstError = function (validators) {
	var getErrors = function (subject) {
		return A2(_rtfeldman$elm_validate$Validate$firstErrorHelp, validators, subject);
	};
	return _rtfeldman$elm_validate$Validate$Validator(getErrors);
};

var _rtfeldman$selectlist$SelectList$toList = function (_p0) {
	var _p1 = _p0;
	return A2(
		_elm_lang$core$Basics_ops['++'],
		_p1._0,
		{ctor: '::', _0: _p1._1, _1: _p1._2});
};
var _rtfeldman$selectlist$SelectList$selectHelp = F4(
	function (isSelectable, beforeList, selectedElem, afterList) {
		var _p2 = {ctor: '_Tuple2', _0: beforeList, _1: afterList};
		if (_p2._0.ctor === '[]') {
			if (_p2._1.ctor === '[]') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				var _p5 = _p2._1._1;
				var _p4 = _p2._1._0;
				if (isSelectable(selectedElem)) {
					return _elm_lang$core$Maybe$Just(
						{ctor: '_Tuple3', _0: beforeList, _1: selectedElem, _2: afterList});
				} else {
					if (isSelectable(_p4)) {
						return _elm_lang$core$Maybe$Just(
							{
								ctor: '_Tuple3',
								_0: A2(
									_elm_lang$core$Basics_ops['++'],
									beforeList,
									{
										ctor: '::',
										_0: selectedElem,
										_1: {ctor: '[]'}
									}),
								_1: _p4,
								_2: _p5
							});
					} else {
						var _p3 = A4(
							_rtfeldman$selectlist$SelectList$selectHelp,
							isSelectable,
							{ctor: '[]'},
							_p4,
							_p5);
						if (_p3.ctor === 'Nothing') {
							return _elm_lang$core$Maybe$Nothing;
						} else {
							return _elm_lang$core$Maybe$Just(
								{
									ctor: '_Tuple3',
									_0: {ctor: '::', _0: selectedElem, _1: _p3._0._0},
									_1: _p3._0._1,
									_2: _p3._0._2
								});
						}
					}
				}
			}
		} else {
			var _p8 = _p2._0._1;
			var _p7 = _p2._0._0;
			if (isSelectable(_p7)) {
				return _elm_lang$core$Maybe$Just(
					{
						ctor: '_Tuple3',
						_0: {ctor: '[]'},
						_1: _p7,
						_2: A2(
							_elm_lang$core$Basics_ops['++'],
							_p8,
							{ctor: '::', _0: selectedElem, _1: afterList})
					});
			} else {
				var _p6 = A4(_rtfeldman$selectlist$SelectList$selectHelp, isSelectable, _p8, selectedElem, afterList);
				if (_p6.ctor === 'Nothing') {
					return _elm_lang$core$Maybe$Nothing;
				} else {
					return _elm_lang$core$Maybe$Just(
						{
							ctor: '_Tuple3',
							_0: {ctor: '::', _0: _p7, _1: _p6._0._0},
							_1: _p6._0._1,
							_2: _p6._0._2
						});
				}
			}
		}
	});
var _rtfeldman$selectlist$SelectList$selected = function (_p9) {
	var _p10 = _p9;
	return _p10._1;
};
var _rtfeldman$selectlist$SelectList$after = function (_p11) {
	var _p12 = _p11;
	return _p12._2;
};
var _rtfeldman$selectlist$SelectList$before = function (_p13) {
	var _p14 = _p13;
	return _p14._0;
};
var _rtfeldman$selectlist$SelectList$SelectList = F3(
	function (a, b, c) {
		return {ctor: 'SelectList', _0: a, _1: b, _2: c};
	});
var _rtfeldman$selectlist$SelectList$singleton = function (sel) {
	return A3(
		_rtfeldman$selectlist$SelectList$SelectList,
		{ctor: '[]'},
		sel,
		{ctor: '[]'});
};
var _rtfeldman$selectlist$SelectList$map = F2(
	function (transform, _p15) {
		var _p16 = _p15;
		return A3(
			_rtfeldman$selectlist$SelectList$SelectList,
			A2(_elm_lang$core$List$map, transform, _p16._0),
			transform(_p16._1),
			A2(_elm_lang$core$List$map, transform, _p16._2));
	});
var _rtfeldman$selectlist$SelectList$fromLists = _rtfeldman$selectlist$SelectList$SelectList;
var _rtfeldman$selectlist$SelectList$select = F2(
	function (isSelectable, _p17) {
		var _p18 = _p17;
		var _p19 = A4(_rtfeldman$selectlist$SelectList$selectHelp, isSelectable, _p18._0, _p18._1, _p18._2);
		if (_p19.ctor === 'Nothing') {
			return _p18;
		} else {
			return A3(_rtfeldman$selectlist$SelectList$SelectList, _p19._0._0, _p19._0._1, _p19._0._2);
		}
	});
var _rtfeldman$selectlist$SelectList$append = F2(
	function (list, _p20) {
		var _p21 = _p20;
		return A3(
			_rtfeldman$selectlist$SelectList$SelectList,
			_p21._0,
			_p21._1,
			A2(_elm_lang$core$Basics_ops['++'], _p21._2, list));
	});
var _rtfeldman$selectlist$SelectList$prepend = F2(
	function (list, _p22) {
		var _p23 = _p22;
		return A3(
			_rtfeldman$selectlist$SelectList$SelectList,
			A2(_elm_lang$core$Basics_ops['++'], list, _p23._0),
			_p23._1,
			_p23._2);
	});
var _rtfeldman$selectlist$SelectList$AfterSelected = {ctor: 'AfterSelected'};
var _rtfeldman$selectlist$SelectList$Selected = {ctor: 'Selected'};
var _rtfeldman$selectlist$SelectList$BeforeSelected = {ctor: 'BeforeSelected'};
var _rtfeldman$selectlist$SelectList$mapBy = F2(
	function (transform, _p24) {
		var _p25 = _p24;
		return A3(
			_rtfeldman$selectlist$SelectList$SelectList,
			A2(
				_elm_lang$core$List$map,
				transform(_rtfeldman$selectlist$SelectList$BeforeSelected),
				_p25._0),
			A2(transform, _rtfeldman$selectlist$SelectList$Selected, _p25._1),
			A2(
				_elm_lang$core$List$map,
				transform(_rtfeldman$selectlist$SelectList$AfterSelected),
				_p25._2));
	});

var _user$project$Elm_Data_AuthToken$withAuthorization = F2(
	function (maybeToken, builder) {
		var _p0 = maybeToken;
		if (_p0.ctor === 'Just') {
			return A3(
				_lukewestby$elm_http_builder$HttpBuilder$withHeader,
				'authorization',
				A2(_elm_lang$core$Basics_ops['++'], 'Token ', _p0._0._0),
				builder);
		} else {
			return builder;
		}
	});
var _user$project$Elm_Data_AuthToken$encode = function (_p1) {
	var _p2 = _p1;
	return _elm_lang$core$Json_Encode$string(_p2._0);
};
var _user$project$Elm_Data_AuthToken$AuthToken = function (a) {
	return {ctor: 'AuthToken', _0: a};
};
var _user$project$Elm_Data_AuthToken$decoder = A2(_elm_lang$core$Json_Decode$map, _user$project$Elm_Data_AuthToken$AuthToken, _elm_lang$core$Json_Decode$string);

var _user$project$Elm_Data_UserPhoto$photoToUrl = function (_p0) {
	var _p1 = _p0;
	var _p2 = _p1._0;
	if (_p2.ctor === 'Nothing') {
		return 'https://static.productionready.io/images/smiley-cyrus.jpg';
	} else {
		return _p2._0;
	}
};
var _user$project$Elm_Data_UserPhoto$toMaybeString = function (_p3) {
	var _p4 = _p3;
	return _p4._0;
};
var _user$project$Elm_Data_UserPhoto$encode = function (_p5) {
	var _p6 = _p5;
	return A2(_elm_community$json_extra$Json_Encode_Extra$maybe, _elm_lang$core$Json_Encode$string, _p6._0);
};
var _user$project$Elm_Data_UserPhoto$src = function (_p7) {
	return _elm_lang$html$Html_Attributes$src(
		_user$project$Elm_Data_UserPhoto$photoToUrl(_p7));
};
var _user$project$Elm_Data_UserPhoto$UserPhoto = function (a) {
	return {ctor: 'UserPhoto', _0: a};
};
var _user$project$Elm_Data_UserPhoto$initUserPhoto = _user$project$Elm_Data_UserPhoto$UserPhoto(_elm_lang$core$Maybe$Nothing);
var _user$project$Elm_Data_UserPhoto$decoder = A2(
	_elm_lang$core$Json_Decode$map,
	_user$project$Elm_Data_UserPhoto$UserPhoto,
	_elm_lang$core$Json_Decode$nullable(_elm_lang$core$Json_Decode$string));

var _user$project$Elm_Util$appendErrors = F2(
	function (model, errors) {
		return _elm_lang$core$Native_Utils.update(
			model,
			{
				errors: A2(_elm_lang$core$Basics_ops['++'], model.errors, errors)
			});
	});
var _user$project$Elm_Util$onClickStopPropagation = function (msg) {
	return A3(
		_elm_lang$html$Html_Events$onWithOptions,
		'click',
		_elm_lang$core$Native_Utils.update(
			_elm_lang$html$Html_Events$defaultOptions,
			{stopPropagation: true}),
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _user$project$Elm_Util$viewIf = F2(
	function (condition, content) {
		return condition ? content : _elm_lang$html$Html$text('');
	});
var _user$project$Elm_Util_ops = _user$project$Elm_Util_ops || {};
_user$project$Elm_Util_ops['=>'] = F2(
	function (v0, v1) {
		return {ctor: '_Tuple2', _0: v0, _1: v1};
	});
var _user$project$Elm_Util$pair = F2(
	function (first, second) {
		return A2(_user$project$Elm_Util_ops['=>'], first, second);
	});

var _user$project$Elm_Data_User$usernameToHtml = function (_p0) {
	var _p1 = _p0;
	return _elm_lang$html$Html$text(_p1._0);
};
var _user$project$Elm_Data_User$encodeUsername = function (_p2) {
	var _p3 = _p2;
	return _elm_lang$core$Json_Encode$string(_p3._0);
};
var _user$project$Elm_Data_User$usernameToString = function (_p4) {
	var _p5 = _p4;
	return _p5._0;
};
var _user$project$Elm_Data_User$encode = function (user) {
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: A2(
				_user$project$Elm_Util_ops['=>'],
				'whoami',
				_elm_lang$core$Json_Encode$string(user.name)),
			_1: {
				ctor: '::',
				_0: A2(
					_user$project$Elm_Util_ops['=>'],
					'token',
					_user$project$Elm_Data_AuthToken$encode(user.token)),
				_1: {
					ctor: '::',
					_0: A2(
						_user$project$Elm_Util_ops['=>'],
						'name',
						_user$project$Elm_Data_User$encodeUsername(user.username)),
					_1: {
						ctor: '::',
						_0: A2(
							_user$project$Elm_Util_ops['=>'],
							'bio',
							A2(_elm_community$json_extra$Json_Encode_Extra$maybe, _elm_lang$core$Json_Encode$string, user.bio)),
						_1: {
							ctor: '::',
							_0: A2(
								_user$project$Elm_Util_ops['=>'],
								'image',
								_user$project$Elm_Data_UserPhoto$encode(user.image)),
							_1: {
								ctor: '::',
								_0: A2(
									_user$project$Elm_Util_ops['=>'],
									'createdAt',
									_elm_lang$core$Json_Encode$int(user.createdAt)),
								_1: {
									ctor: '::',
									_0: A2(
										_user$project$Elm_Util_ops['=>'],
										'updatedAt',
										_elm_lang$core$Json_Encode$int(user.updatedAt)),
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			}
		});
};
var _user$project$Elm_Data_User$User = F7(
	function (a, b, c, d, e, f, g) {
		return {name: a, token: b, username: c, bio: d, image: e, createdAt: f, updatedAt: g};
	});
var _user$project$Elm_Data_User$Username = function (a) {
	return {ctor: 'Username', _0: a};
};
var _user$project$Elm_Data_User$initUsername = _user$project$Elm_Data_User$Username('');
var _user$project$Elm_Data_User$usernameParser = A2(
	_evancz$url_parser$UrlParser$custom,
	'USERNAME',
	function (_p6) {
		return _elm_lang$core$Result$Ok(
			_user$project$Elm_Data_User$Username(_p6));
	});
var _user$project$Elm_Data_User$usernameDecoder = A2(_elm_lang$core$Json_Decode$map, _user$project$Elm_Data_User$Username, _elm_lang$core$Json_Decode$string);
var _user$project$Elm_Data_User$decoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'updatedAt',
	_elm_lang$core$Json_Decode$int,
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'createdAt',
		_elm_lang$core$Json_Decode$int,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'image',
			_user$project$Elm_Data_UserPhoto$decoder,
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
				'bio',
				_elm_lang$core$Json_Decode$nullable(_elm_lang$core$Json_Decode$string),
				A3(
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
					'whoami',
					_user$project$Elm_Data_User$usernameDecoder,
					A3(
						_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
						'token',
						_user$project$Elm_Data_AuthToken$decoder,
						A3(
							_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
							'name',
							_elm_lang$core$Json_Decode$string,
							_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_User$User))))))));

var _user$project$Elm_Data_Article_Author$initAuthor = {
	username: _user$project$Elm_Data_User$initUsername,
	bio: _elm_lang$core$Maybe$Just(''),
	image: _user$project$Elm_Data_UserPhoto$initUserPhoto,
	following: false
};
var _user$project$Elm_Data_Article_Author$Author = F4(
	function (a, b, c, d) {
		return {username: a, bio: b, image: c, following: d};
	});
var _user$project$Elm_Data_Article_Author$decoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'following',
	_elm_lang$core$Json_Decode$bool,
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'image',
		_user$project$Elm_Data_UserPhoto$decoder,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'bio',
			_elm_lang$core$Json_Decode$nullable(_elm_lang$core$Json_Decode$string),
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
				'whoami',
				_user$project$Elm_Data_User$usernameDecoder,
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Article_Author$Author)))));

var _user$project$Elm_Data_Article$bodyToMarkdownString = function (_p0) {
	var _p1 = _p0;
	return _p1._0;
};
var _user$project$Elm_Data_Article$bodyToHtml = F2(
	function (_p2, attributes) {
		var _p3 = _p2;
		return A2(_evancz$elm_markdown$Markdown$toHtml, attributes, _p3._0);
	});
var _user$project$Elm_Data_Article$bodyPreviewHtml = F2(
	function (_p4, attributes) {
		var _p5 = _p4;
		var preview = A2(_elm_community$string_extra$String_Extra$ellipsis, 50, _p5._0);
		return A2(_evancz$elm_markdown$Markdown$toHtml, attributes, preview);
	});
var _user$project$Elm_Data_Article$eachTag = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'tags',
	_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string),
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'popular',
		_elm_lang$core$Json_Decode$int,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'_id',
			_elm_lang$core$Json_Decode$string,
			_elm_lang$core$Json_Decode$succeed(
				F3(
					function (id, value, tags) {
						return {name: id, count: value, articleIds: tags};
					})))));
var _user$project$Elm_Data_Article$tagListDecoder = A2(
	_elm_lang$core$Json_Decode$at,
	{
		ctor: '::',
		_0: 'rows',
		_1: {ctor: '[]'}
	},
	_elm_lang$core$Json_Decode$list(_user$project$Elm_Data_Article$eachTag));
var _user$project$Elm_Data_Article$tagToString = function (tag) {
	return tag.name;
};
var _user$project$Elm_Data_Article$slugToString = function (_p6) {
	var _p7 = _p6;
	return _p7._0;
};
var _user$project$Elm_Data_Article$initTag = {
	name: 'No Tag',
	count: 0,
	articleIds: {ctor: '[]'}
};
var _user$project$Elm_Data_Article$Article = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return {description: a, slug: b, title: c, tags: d, createdAt: e, updatedAt: f, favorited: g, favoritesCount: h, author: i, body: j};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _user$project$Elm_Data_Article$TagRows = function (a) {
	return {rows: a};
};
var _user$project$Elm_Data_Article$Tag = F3(
	function (a, b, c) {
		return {name: a, count: b, articleIds: c};
	});
var _user$project$Elm_Data_Article$tagDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'tags',
	_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string),
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'popular',
		_elm_lang$core$Json_Decode$int,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'_id',
			_elm_lang$core$Json_Decode$string,
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Article$Tag))));
var _user$project$Elm_Data_Article$Slug = function (a) {
	return {ctor: 'Slug', _0: a};
};
var _user$project$Elm_Data_Article$slugParser = A2(
	_evancz$url_parser$UrlParser$custom,
	'SLUG',
	function (_p8) {
		return _elm_lang$core$Result$Ok(
			_user$project$Elm_Data_Article$Slug(_p8));
	});
var _user$project$Elm_Data_Article$SlugTag = function (a) {
	return {ctor: 'SlugTag', _0: a};
};
var _user$project$Elm_Data_Article$Body = function (a) {
	return {ctor: 'Body', _0: a};
};
var _user$project$Elm_Data_Article$bodyDecoder = A2(_elm_lang$core$Json_Decode$map, _user$project$Elm_Data_Article$Body, _elm_lang$core$Json_Decode$string);
var _user$project$Elm_Data_Article$decoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'body',
	_user$project$Elm_Data_Article$bodyDecoder,
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'authorBio',
		_user$project$Elm_Data_Article_Author$decoder,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'favoritedCount',
			_elm_lang$core$Json_Decode$int,
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
				'favorited',
				_elm_lang$core$Json_Decode$bool,
				A3(
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
					'updatedAt',
					_elm_community$json_extra$Json_Decode_Extra$date,
					A3(
						_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
						'createdAt',
						_elm_community$json_extra$Json_Decode_Extra$date,
						A3(
							_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
							'tagList',
							_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string),
							A3(
								_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
								'title',
								_elm_lang$core$Json_Decode$string,
								A3(
									_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
									'slug',
									A2(_elm_lang$core$Json_Decode$map, _user$project$Elm_Data_Article$Slug, _elm_lang$core$Json_Decode$string),
									A3(
										_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
										'description',
										A2(
											_elm_lang$core$Json_Decode$map,
											_elm_lang$core$Maybe$withDefault(''),
											_elm_lang$core$Json_Decode$nullable(_elm_lang$core$Json_Decode$string)),
										_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Article$Article)))))))))));

var _user$project$Elm_Data_Article_Comment$idToString = function (_p0) {
	var _p1 = _p0;
	return _elm_lang$core$Basics$toString(_p1._0);
};
var _user$project$Elm_Data_Article_Comment$Comment = F5(
	function (a, b, c, d, e) {
		return {id: a, body: b, createdAt: c, updatedAt: d, author: e};
	});
var _user$project$Elm_Data_Article_Comment$CommentId = function (a) {
	return {ctor: 'CommentId', _0: a};
};
var _user$project$Elm_Data_Article_Comment$commentIdDecoder = A2(_elm_lang$core$Json_Decode$map, _user$project$Elm_Data_Article_Comment$CommentId, _elm_lang$core$Json_Decode$int);
var _user$project$Elm_Data_Article_Comment$decoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'author',
	_user$project$Elm_Data_Article_Author$decoder,
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'updatedAt',
		_elm_community$json_extra$Json_Decode_Extra$date,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'createdAt',
			_elm_community$json_extra$Json_Decode_Extra$date,
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
				'body',
				_elm_lang$core$Json_Decode$string,
				A3(
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
					'id',
					_user$project$Elm_Data_Article_Comment$commentIdDecoder,
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Article_Comment$Comment))))));

var _user$project$Elm_Data_Article_Feed$init = {
	articles: {ctor: '[]'},
	articlesCount: -1,
	tags: {ctor: '[]'}
};
var _user$project$Elm_Data_Article_Feed$Feed = F3(
	function (a, b, c) {
		return {articles: a, articlesCount: b, tags: c};
	});
var _user$project$Elm_Data_Article_Feed$decoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'tags',
	_elm_lang$core$Json_Decode$list(_user$project$Elm_Data_Article$tagDecoder),
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'total_rows',
		_elm_lang$core$Json_Decode$int,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'rows',
			_elm_lang$core$Json_Decode$list(_user$project$Elm_Data_Article$decoder),
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Article_Feed$Feed))));

var _user$project$Elm_Data_Calendar$initCalendar = {
	weeks: {ctor: '[]'},
	month: '',
	year: ''
};
var _user$project$Elm_Data_Calendar$initEu = {
	id: '',
	title: '',
	colors: {ctor: '[]'},
	ot: {ctor: '[]'},
	ps: {ctor: '[]'},
	nt: {ctor: '[]'},
	gs: {ctor: '[]'}
};
var _user$project$Elm_Data_Calendar$initEuReading = {style: '', ref: ''};
var _user$project$Elm_Data_Calendar$initMpep = {id: '', title: '', mp1: '', mp2: '', ep1: '', ep2: ''};
var _user$project$Elm_Data_Calendar$initDay = {
	year: '',
	month: '',
	date: '',
	day: '',
	mppss: {ctor: '[]'},
	eppss: {ctor: '[]'},
	mpep: _user$project$Elm_Data_Calendar$initMpep,
	eu: _user$project$Elm_Data_Calendar$initEu,
	reflection: ''
};
var _user$project$Elm_Data_Calendar$initPsalmRef = {ps: 0, vsFrom: 0, vsTo: 0};
var _user$project$Elm_Data_Calendar$PsalmRef = F3(
	function (a, b, c) {
		return {ps: a, vsFrom: b, vsTo: c};
	});
var _user$project$Elm_Data_Calendar$psalmRefDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'vsTo',
	_elm_lang$core$Json_Decode$int,
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'vsFrom',
		_elm_lang$core$Json_Decode$int,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'ps',
			_elm_lang$core$Json_Decode$int,
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Calendar$PsalmRef))));
var _user$project$Elm_Data_Calendar$Mpep = F6(
	function (a, b, c, d, e, f) {
		return {id: a, title: b, ep1: c, ep2: d, mp1: e, mp2: f};
	});
var _user$project$Elm_Data_Calendar$mpepDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'ep2',
	_elm_lang$core$Json_Decode$string,
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'ep1',
		_elm_lang$core$Json_Decode$string,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'mp2',
			_elm_lang$core$Json_Decode$string,
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
				'mp1',
				_elm_lang$core$Json_Decode$string,
				A4(
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optional,
					'title',
					_elm_lang$core$Json_Decode$string,
					'',
					A3(
						_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
						'_id',
						_elm_lang$core$Json_Decode$string,
						_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Calendar$Mpep)))))));
var _user$project$Elm_Data_Calendar$EuReading = F2(
	function (a, b) {
		return {style: a, ref: b};
	});
var _user$project$Elm_Data_Calendar$euReadingDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'read',
	_elm_lang$core$Json_Decode$string,
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'style',
		_elm_lang$core$Json_Decode$string,
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Calendar$EuReading)));
var _user$project$Elm_Data_Calendar$Eu = F7(
	function (a, b, c, d, e, f, g) {
		return {id: a, title: b, colors: c, ot: d, ps: e, nt: f, gs: g};
	});
var _user$project$Elm_Data_Calendar$euDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'gs',
	_elm_lang$core$Json_Decode$list(_user$project$Elm_Data_Calendar$euReadingDecoder),
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'nt',
		_elm_lang$core$Json_Decode$list(_user$project$Elm_Data_Calendar$euReadingDecoder),
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'ps',
			_elm_lang$core$Json_Decode$list(_user$project$Elm_Data_Calendar$euReadingDecoder),
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
				'ot',
				_elm_lang$core$Json_Decode$list(_user$project$Elm_Data_Calendar$euReadingDecoder),
				A3(
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
					'colors',
					_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string),
					A3(
						_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
						'title',
						_elm_lang$core$Json_Decode$string,
						A3(
							_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
							'_id',
							_elm_lang$core$Json_Decode$string,
							_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Calendar$Eu))))))));
var _user$project$Elm_Data_Calendar$Day = F9(
	function (a, b, c, d, e, f, g, h, i) {
		return {year: a, month: b, date: c, day: d, mppss: e, eppss: f, mpep: g, eu: h, reflection: i};
	});
var _user$project$Elm_Data_Calendar$dayDecoder = A2(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$hardcoded,
	'Nothing Today',
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'eu',
		_user$project$Elm_Data_Calendar$euDecoder,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'mpep',
			_user$project$Elm_Data_Calendar$mpepDecoder,
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
				'eppss',
				_elm_lang$core$Json_Decode$list(_user$project$Elm_Data_Calendar$psalmRefDecoder),
				A3(
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
					'mppss',
					_elm_lang$core$Json_Decode$list(_user$project$Elm_Data_Calendar$psalmRefDecoder),
					A3(
						_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
						'day',
						_elm_lang$core$Json_Decode$string,
						A3(
							_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
							'date',
							_elm_lang$core$Json_Decode$string,
							A3(
								_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
								'month',
								_elm_lang$core$Json_Decode$string,
								A3(
									_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
									'year',
									_elm_lang$core$Json_Decode$string,
									_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Calendar$Day))))))))));
var _user$project$Elm_Data_Calendar$Week = function (a) {
	return {days: a};
};
var _user$project$Elm_Data_Calendar$weekDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'days',
	_elm_lang$core$Json_Decode$list(_user$project$Elm_Data_Calendar$dayDecoder),
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Calendar$Week));
var _user$project$Elm_Data_Calendar$Calendar = F3(
	function (a, b, c) {
		return {weeks: a, month: b, year: c};
	});
var _user$project$Elm_Data_Calendar$calendarDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'year',
	_elm_lang$core$Json_Decode$string,
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'month',
		_elm_lang$core$Json_Decode$string,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'weeks',
			_elm_lang$core$Json_Decode$list(_user$project$Elm_Data_Calendar$weekDecoder),
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Calendar$Calendar))));

var _user$project$Elm_Data_Error$Error = function (a) {
	return {msg: a};
};
var _user$project$Elm_Data_Error$decoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'msg',
	_elm_lang$core$Json_Decode$string,
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Error$Error));

var _user$project$Elm_Data_Psalm$initPsalm = {
	id: '',
	rev: '',
	name: '',
	title: '',
	show: true,
	vss: {ctor: '[]'}
};
var _user$project$Elm_Data_Psalm$initVs = {vs: '', title: '', first: '', second: ''};
var _user$project$Elm_Data_Psalm$Vs = F4(
	function (a, b, c, d) {
		return {vs: a, title: b, first: c, second: d};
	});
var _user$project$Elm_Data_Psalm$vsDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'second',
	_elm_lang$core$Json_Decode$string,
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'first',
		_elm_lang$core$Json_Decode$string,
		A4(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optional,
			'title',
			_elm_lang$core$Json_Decode$string,
			'',
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
				'vs',
				_elm_lang$core$Json_Decode$string,
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Psalm$Vs)))));
var _user$project$Elm_Data_Psalm$Psalm = F6(
	function (a, b, c, d, e, f) {
		return {id: a, rev: b, name: c, title: d, show: e, vss: f};
	});
var _user$project$Elm_Data_Psalm$psalmDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'vss',
	_elm_lang$core$Json_Decode$list(_user$project$Elm_Data_Psalm$vsDecoder),
	A2(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$hardcoded,
		true,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'title',
			_elm_lang$core$Json_Decode$string,
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
				'name',
				_elm_lang$core$Json_Decode$string,
				A3(
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
					'_rev',
					_elm_lang$core$Json_Decode$string,
					A3(
						_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
						'_id',
						_elm_lang$core$Json_Decode$string,
						_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Psalm$Psalm)))))));
var _user$project$Elm_Data_Psalm$decoder = _elm_lang$core$Json_Decode$list(_user$project$Elm_Data_Psalm$psalmDecoder);

var _user$project$Elm_Data_Lessons$initEuLessons = {
	title: '',
	dateString: '',
	ot: {ctor: '[]'},
	ps: {ctor: '[]'},
	nt: {ctor: '[]'},
	gs: {ctor: '[]'}
};
var _user$project$Elm_Data_Lessons$initLesson = {
	title: '',
	vss: {ctor: '[]'}
};
var _user$project$Elm_Data_Lessons$initCollects = {
	id: '',
	title: '',
	texts: {ctor: '[]'},
	preface: ''
};
var _user$project$Elm_Data_Lessons$initDailyLessons = {
	office: '',
	season: '',
	dateString: '',
	dayOfWeek: 0,
	lesson1: {ctor: '[]'},
	lesson2: {ctor: '[]'},
	psalms: {ctor: '[]'},
	collects: _user$project$Elm_Data_Lessons$initCollects
};
var _user$project$Elm_Data_Lessons$initVerse = {id: '', book: '', chap: 0, vs: 0, html: ''};
var _user$project$Elm_Data_Lessons$Verse = F5(
	function (a, b, c, d, e) {
		return {id: a, book: b, chap: c, vs: d, html: e};
	});
var _user$project$Elm_Data_Lessons$verseDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'vss',
	_elm_lang$core$Json_Decode$string,
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'vs',
		_elm_lang$core$Json_Decode$int,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'chap',
			_elm_lang$core$Json_Decode$int,
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
				'book',
				_elm_lang$core$Json_Decode$string,
				A3(
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
					'_id',
					_elm_lang$core$Json_Decode$string,
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Lessons$Verse))))));
var _user$project$Elm_Data_Lessons$Collects = F4(
	function (a, b, c, d) {
		return {id: a, title: b, texts: c, preface: d};
	});
var _user$project$Elm_Data_Lessons$collectDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'preface',
	_elm_lang$core$Json_Decode$string,
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'text',
		_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string),
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'title',
			_elm_lang$core$Json_Decode$string,
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
				'_id',
				_elm_lang$core$Json_Decode$string,
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Lessons$Collects)))));
var _user$project$Elm_Data_Lessons$Lesson = F2(
	function (a, b) {
		return {title: a, vss: b};
	});
var _user$project$Elm_Data_Lessons$lessonDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'vss',
	_elm_lang$core$Json_Decode$list(_user$project$Elm_Data_Lessons$verseDecoder),
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'title',
		_elm_lang$core$Json_Decode$string,
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Lessons$Lesson)));
var _user$project$Elm_Data_Lessons$DailyLessons = F8(
	function (a, b, c, d, e, f, g, h) {
		return {office: a, season: b, dateString: c, dayOfWeek: d, lesson1: e, lesson2: f, psalms: g, collects: h};
	});
var _user$project$Elm_Data_Lessons$dailyLessonsDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'collects',
	_user$project$Elm_Data_Lessons$collectDecoder,
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'psalms',
		_user$project$Elm_Data_Psalm$decoder,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'lesson2',
			_elm_lang$core$Json_Decode$list(_user$project$Elm_Data_Lessons$lessonDecoder),
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
				'lesson1',
				_elm_lang$core$Json_Decode$list(_user$project$Elm_Data_Lessons$lessonDecoder),
				A3(
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
					'dayOfWeek',
					_elm_lang$core$Json_Decode$int,
					A3(
						_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
						'date',
						_elm_lang$core$Json_Decode$string,
						A3(
							_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
							'season',
							_elm_lang$core$Json_Decode$string,
							A3(
								_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
								'office',
								_elm_lang$core$Json_Decode$string,
								_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Lessons$DailyLessons)))))))));
var _user$project$Elm_Data_Lessons$EuLessons = F6(
	function (a, b, c, d, e, f) {
		return {title: a, dateString: b, ot: c, ps: d, nt: e, gs: f};
	});

var _user$project$Elm_Data_Profile$initProfile = {bio: _elm_lang$core$Maybe$Nothing, following: false, image: _user$project$Elm_Data_UserPhoto$initUserPhoto, username: _user$project$Elm_Data_User$initUsername, whoami: ''};
var _user$project$Elm_Data_Profile$Profile = F5(
	function (a, b, c, d, e) {
		return {bio: a, following: b, image: c, username: d, whoami: e};
	});
var _user$project$Elm_Data_Profile$decoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'whoami',
	_elm_lang$core$Json_Decode$string,
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'_id',
		_user$project$Elm_Data_User$usernameDecoder,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'image',
			_user$project$Elm_Data_UserPhoto$decoder,
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
				'following',
				_elm_lang$core$Json_Decode$bool,
				A3(
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
					'bio',
					_elm_lang$core$Json_Decode$nullable(_elm_lang$core$Json_Decode$string),
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Data_Profile$Profile))))));

var _user$project$Elm_Data_Session$attempt = F3(
	function (attemptedAction, toCmd, session) {
		var _p0 = A2(
			_elm_lang$core$Maybe$map,
			function (_) {
				return _.token;
			},
			session.user);
		if (_p0.ctor === 'Nothing') {
			return A2(
				_user$project$Elm_Util_ops['=>'],
				{
					ctor: '::',
					_0: A2(
						_elm_lang$core$Basics_ops['++'],
						'You have been signed out. Please sign back in to ',
						A2(_elm_lang$core$Basics_ops['++'], attemptedAction, '.')),
					_1: {ctor: '[]'}
				},
				_elm_lang$core$Platform_Cmd$none);
		} else {
			return A2(
				_user$project$Elm_Util_ops['=>'],
				{ctor: '[]'},
				toCmd(_p0._0));
		}
	});
var _user$project$Elm_Data_Session$Session = function (a) {
	return {user: a};
};

var _user$project$Elm_Page_About$update = F2(
	function (msg, model) {
		var _p0 = msg;
		return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
	});
var _user$project$Elm_Page_About$view = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text('About Goes Here'),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_About$init = {
	errors: {ctor: '[]'}
};
var _user$project$Elm_Page_About$Model = function (a) {
	return {errors: a};
};
var _user$project$Elm_Page_About$NoOp = {ctor: 'NoOp'};

var _user$project$Elm_Views_Article_Favorite$button = F4(
	function (toggleFavorite, article, extraAttributes, extraChildren) {
		var children = A2(
			_elm_lang$core$Basics_ops['++'],
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$i,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('ion-hart'),
						_1: {ctor: '[]'}
					},
					{ctor: '[]'}),
				_1: {ctor: '[]'}
			},
			extraChildren);
		var favoriteButtonClass = article.favorited ? 'btn-primary' : 'btn=outline-primary';
		var attributes = A2(
			_elm_lang$core$Basics_ops['++'],
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class(
					A2(_elm_lang$core$Basics_ops['++'], 'btn btn-sm ', favoriteButtonClass)),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Util$onClickStopPropagation(
						toggleFavorite(article)),
					_1: {ctor: '[]'}
				}
			},
			extraAttributes);
		return A2(_elm_lang$html$Html$button, attributes, children);
	});

var _user$project$Elm_Route$routeToString = function (page) {
	var pieces = function () {
		var _p0 = page;
		switch (_p0.ctor) {
			case 'Home':
				return {ctor: '[]'};
			case 'Login':
				return {
					ctor: '::',
					_0: 'login',
					_1: {ctor: '[]'}
				};
			case 'Logout':
				return {
					ctor: '::',
					_0: 'logout',
					_1: {ctor: '[]'}
				};
			case 'Register':
				return {
					ctor: '::',
					_0: 'register',
					_1: {ctor: '[]'}
				};
			case 'Settings':
				return {
					ctor: '::',
					_0: 'settings',
					_1: {ctor: '[]'}
				};
			case 'Narthex':
				return {
					ctor: '::',
					_0: 'narthex',
					_1: {ctor: '[]'}
				};
			case 'Article':
				return {
					ctor: '::',
					_0: 'article',
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Data_Article$slugToString(_p0._0),
						_1: {ctor: '[]'}
					}
				};
			case 'Profile':
				return {
					ctor: '::',
					_0: 'profile',
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Data_User$usernameToString(_p0._0),
						_1: {ctor: '[]'}
					}
				};
			case 'NewArticle':
				return {
					ctor: '::',
					_0: 'editor',
					_1: {ctor: '[]'}
				};
			case 'EditArticle':
				return {
					ctor: '::',
					_0: 'editor',
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Data_Article$slugToString(_p0._0),
						_1: {ctor: '[]'}
					}
				};
			case 'About':
				return {ctor: '[]'};
			case 'Calendar':
				return {
					ctor: '::',
					_0: 'calendar',
					_1: {ctor: '[]'}
				};
			case 'MP':
				return {
					ctor: '::',
					_0: 'mp',
					_1: {ctor: '[]'}
				};
			case 'Midday':
				return {
					ctor: '::',
					_0: 'midday',
					_1: {ctor: '[]'}
				};
			case 'EP':
				return {
					ctor: '::',
					_0: 'ep',
					_1: {ctor: '[]'}
				};
			case 'Compline':
				return {
					ctor: '::',
					_0: 'compline',
					_1: {ctor: '[]'}
				};
			default:
				return {
					ctor: '::',
					_0: 'communionToSick',
					_1: {ctor: '[]'}
				};
		}
	}();
	return A2(
		_elm_lang$core$Basics_ops['++'],
		'#/',
		A2(_elm_lang$core$String$join, '/', pieces));
};
var _user$project$Elm_Route$href = function (route) {
	return _elm_lang$html$Html_Attributes$href(
		_user$project$Elm_Route$routeToString(route));
};
var _user$project$Elm_Route$modifyUrl = function (_p1) {
	return _elm_lang$navigation$Navigation$modifyUrl(
		_user$project$Elm_Route$routeToString(_p1));
};
var _user$project$Elm_Route$CommunionToSick = {ctor: 'CommunionToSick'};
var _user$project$Elm_Route$Compline = {ctor: 'Compline'};
var _user$project$Elm_Route$Midday = {ctor: 'Midday'};
var _user$project$Elm_Route$EP = {ctor: 'EP'};
var _user$project$Elm_Route$MP = {ctor: 'MP'};
var _user$project$Elm_Route$Calendar = {ctor: 'Calendar'};
var _user$project$Elm_Route$EditArticle = function (a) {
	return {ctor: 'EditArticle', _0: a};
};
var _user$project$Elm_Route$NewArticle = {ctor: 'NewArticle'};
var _user$project$Elm_Route$Profile = function (a) {
	return {ctor: 'Profile', _0: a};
};
var _user$project$Elm_Route$Article = function (a) {
	return {ctor: 'Article', _0: a};
};
var _user$project$Elm_Route$Narthex = {ctor: 'Narthex'};
var _user$project$Elm_Route$Settings = {ctor: 'Settings'};
var _user$project$Elm_Route$Register = {ctor: 'Register'};
var _user$project$Elm_Route$Logout = {ctor: 'Logout'};
var _user$project$Elm_Route$Login = {ctor: 'Login'};
var _user$project$Elm_Route$About = {ctor: 'About'};
var _user$project$Elm_Route$Home = {ctor: 'Home'};
var _user$project$Elm_Route$route = _evancz$url_parser$UrlParser$oneOf(
	{
		ctor: '::',
		_0: A2(
			_evancz$url_parser$UrlParser$map,
			_user$project$Elm_Route$Home,
			_evancz$url_parser$UrlParser$s('')),
		_1: {
			ctor: '::',
			_0: A2(
				_evancz$url_parser$UrlParser$map,
				_user$project$Elm_Route$Login,
				_evancz$url_parser$UrlParser$s('login')),
			_1: {
				ctor: '::',
				_0: A2(
					_evancz$url_parser$UrlParser$map,
					_user$project$Elm_Route$Logout,
					_evancz$url_parser$UrlParser$s('logout')),
				_1: {
					ctor: '::',
					_0: A2(
						_evancz$url_parser$UrlParser$map,
						_user$project$Elm_Route$About,
						_evancz$url_parser$UrlParser$s('about')),
					_1: {
						ctor: '::',
						_0: A2(
							_evancz$url_parser$UrlParser$map,
							_user$project$Elm_Route$Settings,
							_evancz$url_parser$UrlParser$s('settings')),
						_1: {
							ctor: '::',
							_0: A2(
								_evancz$url_parser$UrlParser$map,
								_user$project$Elm_Route$Profile,
								A2(
									_evancz$url_parser$UrlParser_ops['</>'],
									_evancz$url_parser$UrlParser$s('profile'),
									_user$project$Elm_Data_User$usernameParser)),
							_1: {
								ctor: '::',
								_0: A2(
									_evancz$url_parser$UrlParser$map,
									_user$project$Elm_Route$Register,
									_evancz$url_parser$UrlParser$s('register')),
								_1: {
									ctor: '::',
									_0: A2(
										_evancz$url_parser$UrlParser$map,
										_user$project$Elm_Route$Narthex,
										_evancz$url_parser$UrlParser$s('narthex')),
									_1: {
										ctor: '::',
										_0: A2(
											_evancz$url_parser$UrlParser$map,
											_user$project$Elm_Route$Article,
											A2(
												_evancz$url_parser$UrlParser_ops['</>'],
												_evancz$url_parser$UrlParser$s('article'),
												_user$project$Elm_Data_Article$slugParser)),
										_1: {
											ctor: '::',
											_0: A2(
												_evancz$url_parser$UrlParser$map,
												_user$project$Elm_Route$NewArticle,
												_evancz$url_parser$UrlParser$s('editor')),
											_1: {
												ctor: '::',
												_0: A2(
													_evancz$url_parser$UrlParser$map,
													_user$project$Elm_Route$EditArticle,
													A2(
														_evancz$url_parser$UrlParser_ops['</>'],
														_evancz$url_parser$UrlParser$s('editor'),
														_user$project$Elm_Data_Article$slugParser)),
												_1: {
													ctor: '::',
													_0: A2(
														_evancz$url_parser$UrlParser$map,
														_user$project$Elm_Route$Calendar,
														_evancz$url_parser$UrlParser$s('calendar')),
													_1: {
														ctor: '::',
														_0: A2(
															_evancz$url_parser$UrlParser$map,
															_user$project$Elm_Route$MP,
															_evancz$url_parser$UrlParser$s('mp')),
														_1: {
															ctor: '::',
															_0: A2(
																_evancz$url_parser$UrlParser$map,
																_user$project$Elm_Route$Midday,
																_evancz$url_parser$UrlParser$s('midday')),
															_1: {
																ctor: '::',
																_0: A2(
																	_evancz$url_parser$UrlParser$map,
																	_user$project$Elm_Route$EP,
																	_evancz$url_parser$UrlParser$s('ep')),
																_1: {
																	ctor: '::',
																	_0: A2(
																		_evancz$url_parser$UrlParser$map,
																		_user$project$Elm_Route$Compline,
																		_evancz$url_parser$UrlParser$s('compline')),
																	_1: {
																		ctor: '::',
																		_0: A2(
																			_evancz$url_parser$UrlParser$map,
																			_user$project$Elm_Route$CommunionToSick,
																			_evancz$url_parser$UrlParser$s('communionToSick')),
																		_1: {ctor: '[]'}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Route$fromLocation = function (location) {
	return _elm_lang$core$String$isEmpty(location.hash) ? _elm_lang$core$Maybe$Just(_user$project$Elm_Route$Home) : A2(_evancz$url_parser$UrlParser$parseHash, _user$project$Elm_Route$route, location);
};

var _user$project$Elm_Views_Author$view = function (username) {
	return A2(
		_elm_lang$html$Html$a,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('author'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Route$href(
					_user$project$Elm_Route$Profile(username)),
				_1: {ctor: '[]'}
			}
		},
		{
			ctor: '::',
			_0: _user$project$Elm_Data_User$usernameToHtml(username),
			_1: {ctor: '[]'}
		});
};

var _user$project$Elm_Views_Article$formattedTimestamp = function (article) {
	return A2(_mgold$elm_date_format$Date_Format$format, '%B %e, %Y', article.createdAt);
};
var _user$project$Elm_Views_Article$view = F2(
	function (toggleFavorite, article) {
		var author = article.author;
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('article-preview'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('article-meta'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$a,
							{
								ctor: '::',
								_0: _user$project$Elm_Route$href(
									_user$project$Elm_Route$Profile(author.username)),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$img,
									{
										ctor: '::',
										_0: _user$project$Elm_Data_UserPhoto$src(author.image),
										_1: {ctor: '[]'}
									},
									{ctor: '[]'}),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('info'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _user$project$Elm_Views_Author$view(author.username),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$span,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$class('date'),
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text(
													_user$project$Elm_Views_Article$formattedTimestamp(article)),
												_1: {ctor: '[]'}
											}),
										_1: {ctor: '[]'}
									}
								}),
							_1: {
								ctor: '::',
								_0: A4(
									_user$project$Elm_Views_Article_Favorite$button,
									toggleFavorite,
									article,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('pull-xs-right'),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text(
											A2(
												_elm_lang$core$Basics_ops['++'],
												' ',
												_elm_lang$core$Basics$toString(article.favoritesCount))),
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							}
						}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$a,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('preview-link'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Route$href(
									_user$project$Elm_Route$Article(article.slug)),
								_1: {ctor: '[]'}
							}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$h1,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text(article.title),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$p,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text(article.description),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$span,
										{ctor: '[]'},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text('Read more...'),
											_1: {ctor: '[]'}
										}),
									_1: {ctor: '[]'}
								}
							}
						}),
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$Elm_Views_Article$viewTimestamp = function (article) {
	return A2(
		_elm_lang$html$Html$span,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('date'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(
				_user$project$Elm_Views_Article$formattedTimestamp(article)),
			_1: {ctor: '[]'}
		});
};

var _user$project$Elm_Views_Errors$styles = _elm_lang$html$Html_Attributes$style(
	{
		ctor: '::',
		_0: A2(_user$project$Elm_Util_ops['=>'], 'position', 'fixed'),
		_1: {
			ctor: '::',
			_0: A2(_user$project$Elm_Util_ops['=>'], 'top', '0'),
			_1: {
				ctor: '::',
				_0: A2(_user$project$Elm_Util_ops['=>'], 'background', 'rgb(250, 250, 250)'),
				_1: {
					ctor: '::',
					_0: A2(_user$project$Elm_Util_ops['=>'], 'padding', '20px'),
					_1: {
						ctor: '::',
						_0: A2(_user$project$Elm_Util_ops['=>'], 'border', '1px solid'),
						_1: {ctor: '[]'}
					}
				}
			}
		}
	});
var _user$project$Elm_Views_Errors$view = F2(
	function (dismissErrors, errors) {
		return _elm_lang$core$List$isEmpty(errors) ? _elm_lang$html$Html$text('') : A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('error-messages'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Views_Errors$styles,
					_1: {ctor: '[]'}
				}
			},
			A2(
				_elm_lang$core$Basics_ops['++'],
				A2(
					_elm_lang$core$List$map,
					function (error) {
						return A2(
							_elm_lang$html$Html$p,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(error),
								_1: {ctor: '[]'}
							});
					},
					errors),
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$button,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Events$onClick(dismissErrors),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('Ok'),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}));
	});

var _user$project$Elm_Views_Spinner$syncing = A2(
	_elm_lang$html$Html$div,
	{
		ctor: '::',
		_0: _elm_lang$html$Html_Attributes$class('blinky'),
		_1: {ctor: '[]'}
	},
	{
		ctor: '::',
		_0: _elm_lang$html$Html$text('Syncing DB'),
		_1: {ctor: '[]'}
	});
var _user$project$Elm_Views_Spinner$spinner = A2(
	_elm_lang$html$Html$li,
	{
		ctor: '::',
		_0: _elm_lang$html$Html_Attributes$class('sk-three-bounce'),
		_1: {
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$style(
				{
					ctor: '::',
					_0: A2(_user$project$Elm_Util_ops['=>'], 'float', 'left'),
					_1: {
						ctor: '::',
						_0: A2(_user$project$Elm_Util_ops['=>'], 'margin', '8px'),
						_1: {ctor: '[]'}
					}
				}),
			_1: {ctor: '[]'}
		}
	},
	{
		ctor: '::',
		_0: A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('sk-child sk-bounce1'),
				_1: {ctor: '[]'}
			},
			{ctor: '[]'}),
		_1: {
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('sk-child sk-bounce2'),
					_1: {ctor: '[]'}
				},
				{ctor: '[]'}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('sk-child sk-bounce3'),
						_1: {ctor: '[]'}
					},
					{ctor: '[]'}),
				_1: {ctor: '[]'}
			}
		}
	});

var _user$project$Elm_Views_Page$bodyId = 'page-body';
var _user$project$Elm_Views_Page$isActive = F2(
	function (page, route) {
		var _p0 = {ctor: '_Tuple2', _0: page, _1: route};
		_v0_12:
		do {
			if (_p0.ctor === '_Tuple2') {
				switch (_p0._0.ctor) {
					case 'Home':
						if (_p0._1.ctor === 'Home') {
							return true;
						} else {
							break _v0_12;
						}
					case 'Login':
						if (_p0._1.ctor === 'Login') {
							return true;
						} else {
							break _v0_12;
						}
					case 'Register':
						if (_p0._1.ctor === 'Register') {
							return true;
						} else {
							break _v0_12;
						}
					case 'Settings':
						if (_p0._1.ctor === 'Settings') {
							return true;
						} else {
							break _v0_12;
						}
					case 'Profile':
						if (_p0._1.ctor === 'Profile') {
							return true;
						} else {
							break _v0_12;
						}
					case 'NewArticle':
						if (_p0._1.ctor === 'NewArticle') {
							return true;
						} else {
							break _v0_12;
						}
					case 'Calendar':
						if (_p0._1.ctor === 'Calendar') {
							return true;
						} else {
							break _v0_12;
						}
					case 'MP':
						if (_p0._1.ctor === 'MP') {
							return true;
						} else {
							break _v0_12;
						}
					case 'EP':
						if (_p0._1.ctor === 'EP') {
							return true;
						} else {
							break _v0_12;
						}
					case 'Midday':
						if (_p0._1.ctor === 'Midday') {
							return true;
						} else {
							break _v0_12;
						}
					case 'Compline':
						if (_p0._1.ctor === 'Compline') {
							return true;
						} else {
							break _v0_12;
						}
					case 'CommunionToSick':
						if (_p0._1.ctor === 'CommunionToSick') {
							return true;
						} else {
							break _v0_12;
						}
					default:
						break _v0_12;
				}
			} else {
				break _v0_12;
			}
		} while(false);
		return false;
	});
var _user$project$Elm_Views_Page$navbarLink = F3(
	function (page, route, linkContent) {
		return A2(
			_elm_lang$html$Html$li,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$classList(
					{
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'dark-blue', _1: true},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'dark-red',
								_1: A2(_user$project$Elm_Views_Page$isActive, page, route)
							},
							_1: {ctor: '[]'}
						}
					}),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$a,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('pageLink bg_light_gray mb4'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Route$href(route),
							_1: {ctor: '[]'}
						}
					},
					linkContent),
				_1: {ctor: '[]'}
			});
	});
var _user$project$Elm_Views_Page$viewFooter = A2(
	_elm_lang$html$Html$footer,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('content-center'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$a,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class(''),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$href('/'),
							_1: {ctor: '[]'}
						}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('Legereme '),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$span,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class(''),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('Prayers and Offices from ACNA'),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$p,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('Code & design licensed under MIT.'),
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					}
				}
			}),
		_1: {ctor: '[]'}
	});
var _user$project$Elm_Views_Page$viewSignIn = F2(
	function (page, user) {
		var linkTo = _user$project$Elm_Views_Page$navbarLink(page);
		var _p1 = user;
		if (_p1.ctor === 'Nothing') {
			return {
				ctor: '::',
				_0: A2(
					linkTo,
					_user$project$Elm_Route$Login,
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('Sign in'),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						linkTo,
						_user$project$Elm_Route$Register,
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('Sign up'),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							linkTo,
							_user$project$Elm_Route$Narthex,
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('Narthex'),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								linkTo,
								_user$project$Elm_Route$Calendar,
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text('Calendar'),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									linkTo,
									_user$project$Elm_Route$MP,
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text('Morning Prayer'),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										linkTo,
										_user$project$Elm_Route$Midday,
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text('Midday'),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											linkTo,
											_user$project$Elm_Route$EP,
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('Evening Prayer'),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												linkTo,
												_user$project$Elm_Route$Compline,
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Compline'),
													_1: {ctor: '[]'}
												}),
											_1: {
												ctor: '::',
												_0: A2(
													linkTo,
													_user$project$Elm_Route$CommunionToSick,
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text('Communion to Sick'),
														_1: {ctor: '[]'}
													}),
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					}
				}
			};
		} else {
			var _p2 = _p1._0;
			return {
				ctor: '::',
				_0: A2(
					linkTo,
					_user$project$Elm_Route$NewArticle,
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$i,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class(''),
								_1: {ctor: '[]'}
							},
							{ctor: '[]'}),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html$text(' New Post'),
							_1: {ctor: '[]'}
						}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						linkTo,
						_user$project$Elm_Route$Settings,
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$i,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class(''),
									_1: {ctor: '[]'}
								},
								{ctor: '[]'}),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html$text(' Settings'),
								_1: {ctor: '[]'}
							}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							linkTo,
							_user$project$Elm_Route$Profile(_p2.username),
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$img,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class(''),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Data_UserPhoto$src(_p2.image),
											_1: {ctor: '[]'}
										}
									},
									{ctor: '[]'}),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Data_User$usernameToHtml(_p2.username),
									_1: {ctor: '[]'}
								}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								linkTo,
								_user$project$Elm_Route$Narthex,
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text('Narthex'),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									linkTo,
									_user$project$Elm_Route$Calendar,
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text('Calendar'),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										linkTo,
										_user$project$Elm_Route$MP,
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text('Morning Prayer'),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											linkTo,
											_user$project$Elm_Route$Midday,
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('Midday'),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												linkTo,
												_user$project$Elm_Route$EP,
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Evening Prayer'),
													_1: {ctor: '[]'}
												}),
											_1: {
												ctor: '::',
												_0: A2(
													linkTo,
													_user$project$Elm_Route$Compline,
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text('Compline'),
														_1: {ctor: '[]'}
													}),
												_1: {
													ctor: '::',
													_0: A2(
														linkTo,
														_user$project$Elm_Route$CommunionToSick,
														{
															ctor: '::',
															_0: _elm_lang$html$Html$text('Communion to Sick'),
															_1: {ctor: '[]'}
														}),
													_1: {
														ctor: '::',
														_0: A2(
															linkTo,
															_user$project$Elm_Route$Logout,
															{
																ctor: '::',
																_0: _elm_lang$html$Html$text('Sign out'),
																_1: {ctor: '[]'}
															}),
														_1: {ctor: '[]'}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			};
		}
	});
var _user$project$Elm_Views_Page$viewHeader = F4(
	function (page, user, isLoading, isSyncing) {
		return A2(
			_elm_lang$html$Html$nav,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class(''),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class(''),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$a,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class(''),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Route$href(_user$project$Elm_Route$Home),
									_1: {ctor: '[]'}
								}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('Legereme'),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$button,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$id('navButton'),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('h2 pb5 bn'),
										_1: {ctor: '[]'}
									}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text('☰'),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$ul,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$id('navMenu'),
										_1: {
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('dn list w-100 z-5 absolute bg-near-white'),
											_1: {ctor: '[]'}
										}
									},
									{
										ctor: '::',
										_0: A3(_elm_lang$html$Html_Lazy$lazy2, _user$project$Elm_Util$viewIf, isLoading, _user$project$Elm_Views_Spinner$spinner),
										_1: {
											ctor: '::',
											_0: A3(
												_user$project$Elm_Views_Page$navbarLink,
												page,
												_user$project$Elm_Route$Home,
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('The Door'),
													_1: {ctor: '[]'}
												}),
											_1: A2(_user$project$Elm_Views_Page$viewSignIn, page, user)
										}
									}),
								_1: {ctor: '[]'}
							}
						}
					}),
				_1: {ctor: '[]'}
			});
	});
var _user$project$Elm_Views_Page$frame = F5(
	function (isLoading, isSyncing, user, page, content) {
		var _p3 = A2(
			_elm_lang$core$Debug$log,
			'FRAME: ',
			{ctor: '_Tuple3', _0: isLoading, _1: isSyncing, _2: page});
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('page-frame'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A4(_user$project$Elm_Views_Page$viewHeader, page, user, isLoading, isSyncing),
				_1: {
					ctor: '::',
					_0: A2(_user$project$Elm_Util$viewIf, isSyncing, _user$project$Elm_Views_Spinner$syncing),
					_1: {
						ctor: '::',
						_0: content,
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Views_Page$viewFooter,
							_1: {ctor: '[]'}
						}
					}
				}
			});
	});
var _user$project$Elm_Views_Page$CommunionToSick = {ctor: 'CommunionToSick'};
var _user$project$Elm_Views_Page$Compline = {ctor: 'Compline'};
var _user$project$Elm_Views_Page$Midday = {ctor: 'Midday'};
var _user$project$Elm_Views_Page$EP = {ctor: 'EP'};
var _user$project$Elm_Views_Page$MP = {ctor: 'MP'};
var _user$project$Elm_Views_Page$Calendar = {ctor: 'Calendar'};
var _user$project$Elm_Views_Page$NewArticle = {ctor: 'NewArticle'};
var _user$project$Elm_Views_Page$Profile = function (a) {
	return {ctor: 'Profile', _0: a};
};
var _user$project$Elm_Views_Page$Settings = {ctor: 'Settings'};
var _user$project$Elm_Views_Page$Register = {ctor: 'Register'};
var _user$project$Elm_Views_Page$Login = {ctor: 'Login'};
var _user$project$Elm_Views_Page$Home = {ctor: 'Home'};
var _user$project$Elm_Views_Page$Other = {ctor: 'Other'};

var _user$project$Elm_Views_User_Follow$button = F2(
	function (toggleFollow, _p0) {
		var _p1 = _p0;
		var _p3 = _p1.username;
		var _p2 = _p1.following ? {ctor: '_Tuple2', _0: 'Unfollow', _1: 'btn-secondary'} : {ctor: '_Tuple2', _0: 'Follow', _1: 'btn-outline-secondary'};
		var prefix = _p2._0;
		var secondaryClass = _p2._1;
		var classes = _elm_lang$html$Html_Attributes$class(
			A2(
				_elm_lang$core$String$join,
				' ',
				{
					ctor: '::',
					_0: 'btn',
					_1: {
						ctor: '::',
						_0: 'btn-sm',
						_1: {
							ctor: '::',
							_0: secondaryClass,
							_1: {
								ctor: '::',
								_0: 'action-btn',
								_1: {ctor: '[]'}
							}
						}
					}
				}));
		return A2(
			_elm_lang$html$Html$button,
			{
				ctor: '::',
				_0: classes,
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Events$onClick(
						toggleFollow(_p3)),
					_1: {ctor: '[]'}
				}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$i,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('ion-plus-round'),
						_1: {ctor: '[]'}
					},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html$text(
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							A2(
								_elm_lang$core$Basics_ops['++'],
								prefix,
								A2(
									_elm_lang$core$Basics_ops['++'],
									' ',
									_user$project$Elm_Data_User$usernameToString(_p3))))),
					_1: {ctor: '[]'}
				}
			});
	});

var _user$project$Elm_Page_Errored$view = F2(
	function (session, _p0) {
		var _p1 = _p0;
		return A2(
			_elm_lang$html$Html$main_,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$id('content'),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('container'),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$tabindex(-1),
						_1: {ctor: '[]'}
					}
				}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$h1,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('Error Loading Page'),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('row'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$p,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text(_p1._0.errorMessage),
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$Elm_Page_Errored$Model = F2(
	function (a, b) {
		return {activePage: a, errorMessage: b};
	});
var _user$project$Elm_Page_Errored$PageLoadError = function (a) {
	return {ctor: 'PageLoadError', _0: a};
};
var _user$project$Elm_Page_Errored$pageLoadError = F2(
	function (activePage, errorMessage) {
		return _user$project$Elm_Page_Errored$PageLoadError(
			{activePage: activePage, errorMessage: errorMessage});
	});

var _user$project$Elm_Request_Helpers$articleUrl = function (str) {
	return A2(_elm_lang$core$Basics_ops['++'], 'http://legereme.com:5984', str);
};
var _user$project$Elm_Request_Helpers$userUrl = function (str) {
	return A2(_elm_lang$core$Basics_ops['++'], 'http://legereme.com:5984/_user', str);
};
var _user$project$Elm_Request_Helpers$tagsUrl = function (str) {
	return A2(_elm_lang$core$Basics_ops['++'], 'http://legereme.com:5984', str);
};
var _user$project$Elm_Request_Helpers$iphodUrl = function (str) {
	return A2(_elm_lang$core$Basics_ops['++'], 'http://legereme.com:5984/iphod', str);
};
var _user$project$Elm_Request_Helpers$apiUrl = function (str) {
	return A2(_elm_lang$core$Basics_ops['++'], 'https://conduit.productionready.io/api', str);
};

var _user$project$Elm_Ports$storeSession = _elm_lang$core$Native_Platform.outgoingPort(
	'storeSession',
	function (v) {
		return (v.ctor === 'Nothing') ? null : v._0;
	});
var _user$project$Elm_Ports$onSessionChange = _elm_lang$core$Native_Platform.incomingPort('onSessionChange', _elm_lang$core$Json_Decode$value);
var _user$project$Elm_Ports$toss = _elm_lang$core$Native_Platform.outgoingPort(
	'toss',
	function (v) {
		return v;
	});
var _user$project$Elm_Ports$tossEncodedListOfStrings = function (fields) {
	var objs = function (_p0) {
		var _p1 = _p0;
		return {
			ctor: '_Tuple2',
			_0: _p1._0,
			_1: _elm_lang$core$Json_Encode$string(_p1._1)
		};
	};
	return _user$project$Elm_Ports$toss(
		_elm_lang$core$Json_Encode$object(
			A2(_elm_lang$core$List$map, objs, fields)));
};
var _user$project$Elm_Ports$profileRequest = F2(
	function (user, author) {
		return _user$project$Elm_Ports$tossEncodedListOfStrings(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'request', _1: 'Profile'},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'username',
						_1: _user$project$Elm_Data_User$usernameToString(user)
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'author',
							_1: _user$project$Elm_Data_User$usernameToString(author)
						},
						_1: {ctor: '[]'}
					}
				}
			});
	});
var _user$project$Elm_Ports$login = F2(
	function (username, password) {
		return _user$project$Elm_Ports$tossEncodedListOfStrings(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'request', _1: 'Login'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'email', _1: username},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'password', _1: password},
						_1: {ctor: '[]'}
					}
				}
			});
	});
var _user$project$Elm_Ports$register = F3(
	function (name, username, password) {
		return _user$project$Elm_Ports$tossEncodedListOfStrings(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'request', _1: 'Register'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'email', _1: name},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'whoami', _1: username},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'password', _1: password},
							_1: {ctor: '[]'}
						}
					}
				}
			});
	});
var _user$project$Elm_Ports$requestCalendar = _user$project$Elm_Ports$tossEncodedListOfStrings(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'request', _1: 'Calendar'},
		_1: {ctor: '[]'}
	});
var _user$project$Elm_Ports$requestLessons = function (office) {
	return _user$project$Elm_Ports$tossEncodedListOfStrings(
		{
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'request', _1: 'Lessons'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'office', _1: office},
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Elm_Ports$requestFeed = F4(
	function (user, feedSource, limit, offset) {
		var username = function () {
			var _p2 = user;
			if (_p2.ctor === 'Just') {
				return _user$project$Elm_Data_User$usernameToString(_p2._0.username);
			} else {
				return '';
			}
		}();
		return _user$project$Elm_Ports$tossEncodedListOfStrings(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'request', _1: 'Feed'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'username', _1: username},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'feedSource', _1: feedSource},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'limit',
								_1: _elm_lang$core$Basics$toString(limit)
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'offset',
									_1: _elm_lang$core$Basics$toString(offset)
								},
								_1: {ctor: '[]'}
							}
						}
					}
				}
			});
	});
var _user$project$Elm_Ports$requestTags = function (user) {
	var username = function () {
		var _p3 = user;
		if (_p3.ctor === 'Just') {
			return _user$project$Elm_Data_User$usernameToString(_p3._0.username);
		} else {
			return '';
		}
	}();
	return _user$project$Elm_Ports$tossEncodedListOfStrings(
		{
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'request', _1: 'Tags'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'username', _1: username},
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Elm_Ports$requestProfile = function (profile) {
	return _user$project$Elm_Ports$tossEncodedListOfStrings(
		{
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'request', _1: 'Profie'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'profile', _1: profile},
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Elm_Ports$requestOfficePsalms = function (office) {
	return _user$project$Elm_Ports$tossEncodedListOfStrings(
		{
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'request', _1: 'OfficePsalms'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'office', _1: office},
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Elm_Ports$toggleFollow = F2(
	function (username, follow) {
		return _user$project$Elm_Ports$toss(
			_elm_lang$core$Json_Encode$object(
				{
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'request',
						_1: _elm_lang$core$Json_Encode$string('ToggleFollow')
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'username',
							_1: _elm_lang$core$Json_Encode$string(
								_user$project$Elm_Data_User$usernameToString(username))
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'follow',
								_1: _elm_lang$core$Json_Encode$bool(follow)
							},
							_1: {ctor: '[]'}
						}
					}
				}));
	});
var _user$project$Elm_Ports$requestArticle = _elm_lang$core$Native_Platform.outgoingPort(
	'requestArticle',
	function (v) {
		return v;
	});
var _user$project$Elm_Ports$requestPsalms = _elm_lang$core$Native_Platform.outgoingPort(
	'requestPsalms',
	function (v) {
		return _elm_lang$core$Native_List.toArray(v).map(
			function (v) {
				return [v._0, v._1, v._2];
			});
	});
var _user$project$Elm_Ports$submitArticle = _elm_lang$core$Native_Platform.outgoingPort(
	'submitArticle',
	function (v) {
		return v;
	});
var _user$project$Elm_Ports$updateUser = _elm_lang$core$Native_Platform.outgoingPort(
	'updateUser',
	function (v) {
		return v;
	});
var _user$project$Elm_Ports$error = _elm_lang$core$Native_Platform.incomingPort('error', _elm_lang$core$Json_Decode$value);
var _user$project$Elm_Ports$dbSync = _elm_lang$core$Native_Platform.incomingPort('dbSync', _elm_lang$core$Json_Decode$value);
var _user$project$Elm_Ports$followCompleted = _elm_lang$core$Native_Platform.incomingPort('followCompleted', _elm_lang$core$Json_Decode$value);
var _user$project$Elm_Ports$logInFail = _elm_lang$core$Native_Platform.incomingPort('logInFail', _elm_lang$core$Json_Decode$value);
var _user$project$Elm_Ports$logInSuccess = _elm_lang$core$Native_Platform.incomingPort('logInSuccess', _elm_lang$core$Json_Decode$value);
var _user$project$Elm_Ports$mpPsalms = _elm_lang$core$Native_Platform.incomingPort('mpPsalms', _elm_lang$core$Json_Decode$value);
var _user$project$Elm_Ports$chatReceived = _elm_lang$core$Native_Platform.incomingPort('chatReceived', _elm_lang$core$Json_Decode$value);
var _user$project$Elm_Ports$portErrors = _elm_lang$core$Native_Platform.incomingPort('portErrors', _elm_lang$core$Json_Decode$value);
var _user$project$Elm_Ports$registrationComplete = _elm_lang$core$Native_Platform.incomingPort('registrationComplete', _elm_lang$core$Json_Decode$value);
var _user$project$Elm_Ports$requestedArticle = _elm_lang$core$Native_Platform.incomingPort('requestedArticle', _elm_lang$core$Json_Decode$value);
var _user$project$Elm_Ports$requestedCalendar = _elm_lang$core$Native_Platform.incomingPort('requestedCalendar', _elm_lang$core$Json_Decode$value);
var _user$project$Elm_Ports$requestedFeed = _elm_lang$core$Native_Platform.incomingPort('requestedFeed', _elm_lang$core$Json_Decode$value);
var _user$project$Elm_Ports$requestedLessons = _elm_lang$core$Native_Platform.incomingPort('requestedLessons', _elm_lang$core$Json_Decode$value);
var _user$project$Elm_Ports$requestedProfile = _elm_lang$core$Native_Platform.incomingPort('requestedProfile', _elm_lang$core$Json_Decode$value);
var _user$project$Elm_Ports$requestedPsalms = _elm_lang$core$Native_Platform.incomingPort('requestedPsalms', _elm_lang$core$Json_Decode$value);
var _user$project$Elm_Ports$requestedTags = _elm_lang$core$Native_Platform.incomingPort('requestedTags', _elm_lang$core$Json_Decode$value);
var _user$project$Elm_Ports$updateUserComplete = _elm_lang$core$Native_Platform.incomingPort('updateUserComplete', _elm_lang$core$Json_Decode$value);

var _user$project$Elm_Request_Article$buildFromQueryParams = F2(
	function (url, queryParams) {
		return A2(
			_lukewestby$elm_http_builder$HttpBuilder$withQueryParams,
			queryParams,
			A2(
				_lukewestby$elm_http_builder$HttpBuilder$withExpect,
				_elm_lang$http$Http$expectJson(_user$project$Elm_Data_Article_Feed$decoder),
				_lukewestby$elm_http_builder$HttpBuilder$get(
					_user$project$Elm_Request_Helpers$articleUrl(url))));
	});
var _user$project$Elm_Request_Article$maybeVal = function (_p0) {
	var _p1 = _p0;
	var _p2 = _p1._1;
	if (_p2.ctor === 'Nothing') {
		return _elm_lang$core$Maybe$Nothing;
	} else {
		return _elm_lang$core$Maybe$Just(
			A2(_user$project$Elm_Util_ops['=>'], _p1._0, _p2._0));
	}
};
var _user$project$Elm_Request_Article$delete = F2(
	function (slug, token) {
		return _lukewestby$elm_http_builder$HttpBuilder$toRequest(
			A2(
				_user$project$Elm_Data_AuthToken$withAuthorization,
				_elm_lang$core$Maybe$Just(token),
				_lukewestby$elm_http_builder$HttpBuilder$delete(
					_user$project$Elm_Request_Helpers$apiUrl(
						A2(
							_elm_lang$core$Basics_ops['++'],
							'/artices/',
							_user$project$Elm_Data_Article$slugToString(slug))))));
	});
var _user$project$Elm_Request_Article$update = F3(
	function (slug, config, token) {
		var article = _elm_lang$core$Json_Encode$object(
			{
				ctor: '::',
				_0: A2(
					_user$project$Elm_Util_ops['=>'],
					'title',
					_elm_lang$core$Json_Encode$string(config.title)),
				_1: {
					ctor: '::',
					_0: A2(
						_user$project$Elm_Util_ops['=>'],
						'description',
						_elm_lang$core$Json_Encode$string(config.description)),
					_1: {
						ctor: '::',
						_0: A2(
							_user$project$Elm_Util_ops['=>'],
							'body',
							_elm_lang$core$Json_Encode$string(config.body)),
						_1: {ctor: '[]'}
					}
				}
			});
		var body = _elm_lang$http$Http$jsonBody(
			_elm_lang$core$Json_Encode$object(
				{
					ctor: '::',
					_0: A2(_user$project$Elm_Util_ops['=>'], 'article', article),
					_1: {ctor: '[]'}
				}));
		var expect = _elm_lang$http$Http$expectJson(
			A2(_elm_lang$core$Json_Decode$field, 'article', _user$project$Elm_Data_Article$decoder));
		return _lukewestby$elm_http_builder$HttpBuilder$toRequest(
			A2(
				_lukewestby$elm_http_builder$HttpBuilder$withExpect,
				expect,
				A2(
					_lukewestby$elm_http_builder$HttpBuilder$withBody,
					body,
					A2(
						_user$project$Elm_Data_AuthToken$withAuthorization,
						_elm_lang$core$Maybe$Just(token),
						_lukewestby$elm_http_builder$HttpBuilder$put(
							_user$project$Elm_Request_Helpers$apiUrl(
								A2(
									_elm_lang$core$Basics_ops['++'],
									'/artices/',
									_user$project$Elm_Data_Article$slugToString(slug))))))));
	});
var _user$project$Elm_Request_Article$create = F2(
	function (config, user) {
		var article = _elm_lang$core$Json_Encode$object(
			{
				ctor: '::',
				_0: A2(
					_user$project$Elm_Util_ops['=>'],
					'title',
					_elm_lang$core$Json_Encode$string(config.title)),
				_1: {
					ctor: '::',
					_0: A2(
						_user$project$Elm_Util_ops['=>'],
						'description',
						_elm_lang$core$Json_Encode$string(config.description)),
					_1: {
						ctor: '::',
						_0: A2(
							_user$project$Elm_Util_ops['=>'],
							'body',
							_elm_lang$core$Json_Encode$string(config.body)),
						_1: {
							ctor: '::',
							_0: A2(
								_user$project$Elm_Util_ops['=>'],
								'tagList',
								_elm_lang$core$Json_Encode$list(
									A2(_elm_lang$core$List$map, _elm_lang$core$Json_Encode$string, config.tags))),
							_1: {
								ctor: '::',
								_0: A2(
									_user$project$Elm_Util_ops['=>'],
									'favorited',
									_elm_lang$core$Json_Encode$bool(false)),
								_1: {
									ctor: '::',
									_0: A2(
										_user$project$Elm_Util_ops['=>'],
										'favoritedCount',
										_elm_lang$core$Json_Encode$int(0)),
									_1: {
										ctor: '::',
										_0: A2(
											_user$project$Elm_Util_ops['=>'],
											'author',
											_elm_lang$core$Json_Encode$string(
												_user$project$Elm_Data_User$usernameToString(user.username))),
										_1: {
											ctor: '::',
											_0: A2(
												_user$project$Elm_Util_ops['=>'],
												'name',
												_elm_lang$core$Json_Encode$string(user.name)),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}
				}
			});
		return _user$project$Elm_Ports$submitArticle(article);
	});
var _user$project$Elm_Request_Article$buildFavorite = F3(
	function (builderFromUrl, slug, token) {
		var expect = _elm_lang$http$Http$expectJson(
			A2(_elm_lang$core$Json_Decode$field, 'article', _user$project$Elm_Data_Article$decoder));
		return _lukewestby$elm_http_builder$HttpBuilder$toRequest(
			A2(
				_lukewestby$elm_http_builder$HttpBuilder$withExpect,
				expect,
				A2(
					_user$project$Elm_Data_AuthToken$withAuthorization,
					_elm_lang$core$Maybe$Just(token),
					builderFromUrl(
						A2(
							_elm_lang$core$String$join,
							'/',
							{
								ctor: '::',
								_0: _user$project$Elm_Request_Helpers$apiUrl('/articles'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Data_Article$slugToString(slug),
									_1: {
										ctor: '::',
										_0: 'favorite',
										_1: {ctor: '[]'}
									}
								}
							})))));
	});
var _user$project$Elm_Request_Article$unfavorite = _user$project$Elm_Request_Article$buildFavorite(_lukewestby$elm_http_builder$HttpBuilder$delete);
var _user$project$Elm_Request_Article$favorite = _user$project$Elm_Request_Article$buildFavorite(_lukewestby$elm_http_builder$HttpBuilder$post);
var _user$project$Elm_Request_Article$toggleFavorite = F2(
	function (article, authToken) {
		return article.favorited ? A2(_user$project$Elm_Request_Article$unfavorite, article.slug, authToken) : A2(_user$project$Elm_Request_Article$favorite, article.slug, authToken);
	});
var _user$project$Elm_Request_Article$tags = A2(
	_elm_lang$http$Http$get,
	_user$project$Elm_Request_Helpers$tagsUrl('/tags/_design/slugs/_view/slug-view'),
	_user$project$Elm_Data_Article$tagListDecoder);
var _user$project$Elm_Request_Article$feed = F2(
	function (config, token) {
		return _lukewestby$elm_http_builder$HttpBuilder$toRequest(
			A2(
				_user$project$Elm_Data_AuthToken$withAuthorization,
				_elm_lang$core$Maybe$Just(token),
				A2(
					_user$project$Elm_Request_Article$buildFromQueryParams,
					'/articles/_design/latest/_view/feed',
					A2(
						_elm_lang$core$List$filterMap,
						_user$project$Elm_Request_Article$maybeVal,
						{
							ctor: '::',
							_0: A2(
								_user$project$Elm_Util_ops['=>'],
								'limit',
								_elm_lang$core$Maybe$Just(
									_elm_lang$core$Basics$toString(config.limit))),
							_1: {
								ctor: '::',
								_0: A2(
									_user$project$Elm_Util_ops['=>'],
									'offset',
									_elm_lang$core$Maybe$Just(
										_elm_lang$core$Basics$toString(config.offset))),
								_1: {
									ctor: '::',
									_0: A2(
										_user$project$Elm_Util_ops['=>'],
										'descending',
										_elm_lang$core$Maybe$Just('true')),
									_1: {
										ctor: '::',
										_0: A2(
											_user$project$Elm_Util_ops['=>'],
											'include_docs',
											_elm_lang$core$Maybe$Just('true')),
										_1: {ctor: '[]'}
									}
								}
							}
						}))));
	});
var _user$project$Elm_Request_Article$defaultFeedConfig = {limit: 10, offset: 0};
var _user$project$Elm_Request_Article$list = F2(
	function (config, maybeToken) {
		return _lukewestby$elm_http_builder$HttpBuilder$toRequest(
			A2(
				_user$project$Elm_Data_AuthToken$withAuthorization,
				maybeToken,
				A2(
					_user$project$Elm_Request_Article$buildFromQueryParams,
					'/articles/_design/latest/_view/feed',
					A2(
						_elm_lang$core$List$filterMap,
						_user$project$Elm_Request_Article$maybeVal,
						{
							ctor: '::',
							_0: A2(
								_user$project$Elm_Util_ops['=>'],
								'tag',
								A2(_elm_lang$core$Maybe$map, _user$project$Elm_Data_Article$tagToString, config.tag)),
							_1: {
								ctor: '::',
								_0: A2(
									_user$project$Elm_Util_ops['=>'],
									'author',
									A2(_elm_lang$core$Maybe$map, _user$project$Elm_Data_User$usernameToString, config.author)),
								_1: {
									ctor: '::',
									_0: A2(
										_user$project$Elm_Util_ops['=>'],
										'favorited',
										A2(_elm_lang$core$Maybe$map, _user$project$Elm_Data_User$usernameToString, config.favorited)),
									_1: {
										ctor: '::',
										_0: A2(
											_user$project$Elm_Util_ops['=>'],
											'limit',
											_elm_lang$core$Maybe$Just(
												_elm_lang$core$Basics$toString(config.limit))),
										_1: {
											ctor: '::',
											_0: A2(
												_user$project$Elm_Util_ops['=>'],
												'skip',
												_elm_lang$core$Maybe$Just(
													_elm_lang$core$Basics$toString(config.offset))),
											_1: {
												ctor: '::',
												_0: A2(
													_user$project$Elm_Util_ops['=>'],
													'descending',
													_elm_lang$core$Maybe$Just('true')),
												_1: {
													ctor: '::',
													_0: A2(
														_user$project$Elm_Util_ops['=>'],
														'include_docs',
														_elm_lang$core$Maybe$Just('true')),
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}))));
	});
var _user$project$Elm_Request_Article$defaultListConfig = {tag: _elm_lang$core$Maybe$Nothing, author: _elm_lang$core$Maybe$Nothing, favorited: _elm_lang$core$Maybe$Nothing, limit: 20, offset: 0};
var _user$project$Elm_Request_Article$get = F2(
	function (maybeToken, slug) {
		var expect = _elm_lang$http$Http$expectJson(
			A2(_elm_lang$core$Json_Decode$field, 'article', _user$project$Elm_Data_Article$decoder));
		return _lukewestby$elm_http_builder$HttpBuilder$toRequest(
			A2(
				_user$project$Elm_Data_AuthToken$withAuthorization,
				maybeToken,
				A2(
					_lukewestby$elm_http_builder$HttpBuilder$withExpect,
					expect,
					_lukewestby$elm_http_builder$HttpBuilder$get(
						_user$project$Elm_Request_Helpers$articleUrl(
							A2(
								_elm_lang$core$Basics_ops['++'],
								'/articles/_design/slugs/_view/slug-view?key=',
								A2(
									_elm_lang$core$Basics_ops['++'],
									'\"',
									A2(
										_elm_lang$core$Basics_ops['++'],
										_user$project$Elm_Data_Article$slugToString(slug),
										'\"'))))))));
	});
var _user$project$Elm_Request_Article$ListConfig = F5(
	function (a, b, c, d, e) {
		return {tag: a, author: b, favorited: c, limit: d, offset: e};
	});
var _user$project$Elm_Request_Article$FeedConfig = F2(
	function (a, b) {
		return {limit: a, offset: b};
	});

var _user$project$Elm_Request_Article_Comments$delete = F3(
	function (slug, commentId, token) {
		return _lukewestby$elm_http_builder$HttpBuilder$toRequest(
			A2(
				_user$project$Elm_Data_AuthToken$withAuthorization,
				_elm_lang$core$Maybe$Just(token),
				_lukewestby$elm_http_builder$HttpBuilder$delete(
					_user$project$Elm_Request_Helpers$apiUrl(
						A2(
							_elm_lang$core$Basics_ops['++'],
							'/articles/',
							A2(
								_elm_lang$core$Basics_ops['++'],
								_user$project$Elm_Data_Article$slugToString(slug),
								A2(
									_elm_lang$core$Basics_ops['++'],
									'/comments/',
									_user$project$Elm_Data_Article_Comment$idToString(commentId))))))));
	});
var _user$project$Elm_Request_Article_Comments$encodeCommentBody = function (body) {
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: A2(
				_user$project$Elm_Util_ops['=>'],
				'comment',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: A2(
							_user$project$Elm_Util_ops['=>'],
							'body',
							_elm_lang$core$Json_Encode$string(body)),
						_1: {ctor: '[]'}
					})),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Request_Article_Comments$post = F3(
	function (slug, body, token) {
		return _lukewestby$elm_http_builder$HttpBuilder$toRequest(
			A2(
				_user$project$Elm_Data_AuthToken$withAuthorization,
				_elm_lang$core$Maybe$Just(token),
				A2(
					_lukewestby$elm_http_builder$HttpBuilder$withExpect,
					_elm_lang$http$Http$expectJson(
						A2(_elm_lang$core$Json_Decode$field, 'comment', _user$project$Elm_Data_Article_Comment$decoder)),
					A2(
						_lukewestby$elm_http_builder$HttpBuilder$withBody,
						_elm_lang$http$Http$jsonBody(
							_user$project$Elm_Request_Article_Comments$encodeCommentBody(body)),
						_lukewestby$elm_http_builder$HttpBuilder$post(
							_user$project$Elm_Request_Helpers$apiUrl(
								A2(
									_elm_lang$core$Basics_ops['++'],
									'/articles/',
									A2(
										_elm_lang$core$Basics_ops['++'],
										_user$project$Elm_Data_Article$slugToString(slug),
										'/comments'))))))));
	});
var _user$project$Elm_Request_Article_Comments$list = F2(
	function (maybeToken, slug) {
		return _lukewestby$elm_http_builder$HttpBuilder$toRequest(
			A2(
				_user$project$Elm_Data_AuthToken$withAuthorization,
				maybeToken,
				A2(
					_lukewestby$elm_http_builder$HttpBuilder$withExpect,
					_elm_lang$http$Http$expectJson(
						A2(
							_elm_lang$core$Json_Decode$field,
							'comments',
							_elm_lang$core$Json_Decode$list(_user$project$Elm_Data_Article_Comment$decoder))),
					_lukewestby$elm_http_builder$HttpBuilder$get(
						_user$project$Elm_Request_Helpers$apiUrl(
							A2(
								_elm_lang$core$Basics_ops['++'],
								'/articles/',
								A2(
									_elm_lang$core$Basics_ops['++'],
									_user$project$Elm_Data_Article$slugToString(slug),
									'/comments')))))));
	});

var _user$project$Elm_Request_Profile$buildFollow = F3(
	function (builderFormUrl, username, token) {
		return _lukewestby$elm_http_builder$HttpBuilder$toRequest(
			A2(
				_lukewestby$elm_http_builder$HttpBuilder$withExpect,
				_elm_lang$http$Http$expectJson(
					A2(_elm_lang$core$Json_Decode$field, 'profile', _user$project$Elm_Data_Profile$decoder)),
				A2(
					_user$project$Elm_Data_AuthToken$withAuthorization,
					_elm_lang$core$Maybe$Just(token),
					builderFormUrl(
						A2(
							_elm_lang$core$String$join,
							'/',
							{
								ctor: '::',
								_0: _user$project$Elm_Request_Helpers$articleUrl('/articles'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Data_User$usernameToString(username),
									_1: {
										ctor: '::',
										_0: 'follow',
										_1: {ctor: '[]'}
									}
								}
							})))));
	});
var _user$project$Elm_Request_Profile$unfollow = _user$project$Elm_Request_Profile$buildFollow(_lukewestby$elm_http_builder$HttpBuilder$delete);
var _user$project$Elm_Request_Profile$follow = _user$project$Elm_Request_Profile$buildFollow(_lukewestby$elm_http_builder$HttpBuilder$post);
var _user$project$Elm_Request_Profile$toggleFollow = F3(
	function (username, following, authToken) {
		return following ? A2(_user$project$Elm_Request_Profile$unfollow, username, authToken) : A2(_user$project$Elm_Request_Profile$follow, username, authToken);
	});
var _user$project$Elm_Request_Profile$get = F2(
	function (username, maybeToken) {
		return _lukewestby$elm_http_builder$HttpBuilder$toRequest(
			A2(
				_lukewestby$elm_http_builder$HttpBuilder$withExpect,
				_elm_lang$http$Http$expectJson(
					A2(_elm_lang$core$Json_Decode$field, 'profile', _user$project$Elm_Data_Profile$decoder)),
				_lukewestby$elm_http_builder$HttpBuilder$get(
					_user$project$Elm_Request_Helpers$articleUrl(
						A2(
							_elm_lang$core$Basics_ops['++'],
							'/articles/',
							_user$project$Elm_Data_User$usernameToString(username))))));
	});

var _user$project$Elm_Page_Article$editButton = function (article) {
	return A2(
		_elm_lang$html$Html$button,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('btn btn-outline-secondary btn-sm'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Route$href(
					_user$project$Elm_Route$EditArticle(article.slug)),
				_1: {ctor: '[]'}
			}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$i,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('ion-edit'),
					_1: {ctor: '[]'}
				},
				{ctor: '[]'}),
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html$text(' Edit Article'),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Elm_Page_Article$withoutComment = function (id) {
	return _elm_lang$core$List$filter(
		function (comment) {
			return !_elm_lang$core$Native_Utils.eq(comment.id, id);
		});
};
var _user$project$Elm_Page_Article$formatCommentTimestamp = _mgold$elm_date_format$Date_Format$format('%B %e, %Y');
var _user$project$Elm_Page_Article$followCompleted = _user$project$Elm_Ports$followCompleted(
	function (_p0) {
		return _elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _elm_lang$core$Json_Decode$bool, _p0));
	});
var _user$project$Elm_Page_Article$Model = F5(
	function (a, b, c, d, e) {
		return {errors: a, commentText: b, commentInFlight: c, article: d, comments: e};
	});
var _user$project$Elm_Page_Article$init = F2(
	function (session, slug) {
		var handleLoadError = function (_p1) {
			return A2(_user$project$Elm_Page_Errored$pageLoadError, _user$project$Elm_Views_Page$Other, 'Article currently unavailable.');
		};
		var maybeAuthToken = A2(
			_elm_lang$core$Maybe$map,
			function (_) {
				return _.token;
			},
			session.user);
		var loadArticle = _elm_lang$http$Http$toTask(
			A2(_user$project$Elm_Request_Article$get, maybeAuthToken, slug));
		var loadComments = _elm_lang$http$Http$toTask(
			A2(_user$project$Elm_Request_Article_Comments$list, maybeAuthToken, slug));
		return A2(
			_elm_lang$core$Task$mapError,
			handleLoadError,
			A3(
				_elm_lang$core$Task$map2,
				A3(
					_user$project$Elm_Page_Article$Model,
					{ctor: '[]'},
					'',
					false),
				loadArticle,
				loadComments));
	});
var _user$project$Elm_Page_Article$ArticleDeleted = function (a) {
	return {ctor: 'ArticleDeleted', _0: a};
};
var _user$project$Elm_Page_Article$DeleteArticle = {ctor: 'DeleteArticle'};
var _user$project$Elm_Page_Article$deleteButton = function (article) {
	return A2(
		_elm_lang$html$Html$button,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('btn btn-outline-danger btn-sm'),
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html_Events$onClick(_user$project$Elm_Page_Article$DeleteArticle),
				_1: {ctor: '[]'}
			}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$i,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('ion-trash'),
					_1: {ctor: '[]'}
				},
				{ctor: '[]'}),
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html$text(' Delete Article'),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Elm_Page_Article$CommentPosted = function (a) {
	return {ctor: 'CommentPosted', _0: a};
};
var _user$project$Elm_Page_Article$PostComment = {ctor: 'PostComment'};
var _user$project$Elm_Page_Article$CommentDeleted = F2(
	function (a, b) {
		return {ctor: 'CommentDeleted', _0: a, _1: b};
	});
var _user$project$Elm_Page_Article$DeleteComment = function (a) {
	return {ctor: 'DeleteComment', _0: a};
};
var _user$project$Elm_Page_Article$viewComment = F2(
	function (user, comment) {
		var isAuthor = _elm_lang$core$Native_Utils.eq(
			A2(
				_elm_lang$core$Maybe$map,
				function (_) {
					return _.username;
				},
				user),
			_elm_lang$core$Maybe$Just(comment.author.username));
		var author = comment.author;
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('card'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('card-text'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$p,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('card-text'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(comment.body),
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('card-footer'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$a,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('comment-author'),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$href(''),
										_1: {ctor: '[]'}
									}
								},
								{
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$img,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('comment-author-img'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Data_UserPhoto$src(author.image),
												_1: {ctor: '[]'}
											}
										},
										{ctor: '[]'}),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html$text(' '),
										_1: {ctor: '[]'}
									}
								}),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html$text(' '),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$a,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('comment-author'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Route$href(
													_user$project$Elm_Route$Profile(author.username)),
												_1: {ctor: '[]'}
											}
										},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text(
												_user$project$Elm_Data_User$usernameToString(comment.author.username)),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$span,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$class('date-posted'),
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text(
													_user$project$Elm_Page_Article$formatCommentTimestamp(comment.createdAt)),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												_user$project$Elm_Util$viewIf,
												isAuthor,
												A2(
													_elm_lang$html$Html$span,
													{
														ctor: '::',
														_0: _elm_lang$html$Html_Attributes$class('mod-options'),
														_1: {
															ctor: '::',
															_0: _elm_lang$html$Html_Events$onClick(
																_user$project$Elm_Page_Article$DeleteComment(comment.id)),
															_1: {ctor: '[]'}
														}
													},
													{
														ctor: '::',
														_0: A2(
															_elm_lang$html$Html$i,
															{
																ctor: '::',
																_0: _elm_lang$html$Html_Attributes$class('ion-trash-a'),
																_1: {ctor: '[]'}
															},
															{ctor: '[]'}),
														_1: {ctor: '[]'}
													})),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}),
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$Elm_Page_Article$SetCommentText = function (a) {
	return {ctor: 'SetCommentText', _0: a};
};
var _user$project$Elm_Page_Article$viewAddComment = F2(
	function (postingDisabled, maybeUser) {
		var _p2 = maybeUser;
		if (_p2.ctor === 'Nothing') {
			return A2(
				_elm_lang$html$Html$p,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$a,
						{
							ctor: '::',
							_0: _user$project$Elm_Route$href(_user$project$Elm_Route$Login),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('Sign in'),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html$text('or'),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$a,
								{
									ctor: '::',
									_0: _user$project$Elm_Route$href(_user$project$Elm_Route$Register),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text('sign up'),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html$text(' to add comments on this article.'),
								_1: {ctor: '[]'}
							}
						}
					}
				});
		} else {
			return A2(
				_elm_lang$html$Html$form,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('card comment-form'),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Events$onSubmit(_user$project$Elm_Page_Article$PostComment),
						_1: {ctor: '[]'}
					}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('card-block'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$textarea,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('form-control'),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$placeholder('Write a comment...'),
										_1: {
											ctor: '::',
											_0: A2(_elm_lang$html$Html_Attributes$attribute, 'rows', '3'),
											_1: {
												ctor: '::',
												_0: _elm_lang$html$Html_Events$onInput(_user$project$Elm_Page_Article$SetCommentText),
												_1: {ctor: '[]'}
											}
										}
									}
								},
								{ctor: '[]'}),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('card-footer'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$img,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('comment-author-img'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Data_UserPhoto$src(_p2._0.image),
											_1: {ctor: '[]'}
										}
									},
									{ctor: '[]'}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$button,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('btn btn-sm btn-primary'),
											_1: {
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$disabled(postingDisabled),
												_1: {ctor: '[]'}
											}
										},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text('Post Comment'),
											_1: {ctor: '[]'}
										}),
									_1: {ctor: '[]'}
								}
							}),
						_1: {ctor: '[]'}
					}
				});
		}
	});
var _user$project$Elm_Page_Article$FollowCompleted = function (a) {
	return {ctor: 'FollowCompleted', _0: a};
};
var _user$project$Elm_Page_Article$subscriptions = function (model) {
	return _elm_lang$core$Platform_Sub$batch(
		{
			ctor: '::',
			_0: A2(_elm_lang$core$Platform_Sub$map, _user$project$Elm_Page_Article$FollowCompleted, _user$project$Elm_Page_Article$followCompleted),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Article$ToggleFollow = {ctor: 'ToggleFollow'};
var _user$project$Elm_Page_Article$followButton = _user$project$Elm_Views_User_Follow$button(
	function (_p3) {
		return _user$project$Elm_Page_Article$ToggleFollow;
	});
var _user$project$Elm_Page_Article$FavoriteCompleted = function (a) {
	return {ctor: 'FavoriteCompleted', _0: a};
};
var _user$project$Elm_Page_Article$update = F3(
	function (session, msg, model) {
		var article = model.article;
		var author = article.author;
		var _p4 = msg;
		switch (_p4.ctor) {
			case 'DismissErrors':
				return A2(
					_user$project$Elm_Util_ops['=>'],
					_elm_lang$core$Native_Utils.update(
						model,
						{
							errors: {ctor: '[]'}
						}),
					_elm_lang$core$Platform_Cmd$none);
			case 'ToggleFavorite':
				var cmdFromAuth = function (authToken) {
					return A2(
						_elm_lang$core$Task$attempt,
						_user$project$Elm_Page_Article$FavoriteCompleted,
						A2(
							_elm_lang$core$Task$map,
							function (newArticle) {
								return _elm_lang$core$Native_Utils.update(
									newArticle,
									{body: article.body});
							},
							_elm_lang$http$Http$toTask(
								A2(_user$project$Elm_Request_Article$toggleFavorite, model.article, authToken))));
				};
				return A2(
					_elm_lang$core$Tuple$mapFirst,
					_user$project$Elm_Util$appendErrors(model),
					A3(_user$project$Elm_Data_Session$attempt, 'favorite', cmdFromAuth, session));
			case 'FavoriteCompleted':
				if (_p4._0.ctor === 'Ok') {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{article: _p4._0._0}),
						_elm_lang$core$Platform_Cmd$none);
				} else {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						A2(
							_user$project$Elm_Util$appendErrors,
							model,
							{
								ctor: '::',
								_0: 'There was a server error tryiing to record your Favorite. Sorry!',
								_1: {ctor: '[]'}
							}),
						_elm_lang$core$Platform_Cmd$none);
				}
			case 'ToggleFollow':
				return A2(
					_user$project$Elm_Util_ops['=>'],
					model,
					A2(_user$project$Elm_Ports$toggleFollow, author.username, author.following));
			case 'FollowCompleted':
				if (_p4._0.ctor === 'Just') {
					var newArticle = _elm_lang$core$Native_Utils.update(
						article,
						{
							author: _elm_lang$core$Native_Utils.update(
								author,
								{following: _p4._0._0})
						});
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{article: newArticle}),
						_elm_lang$core$Platform_Cmd$none);
				} else {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								errors: {ctor: '::', _0: 'Unable to follow user', _1: model.errors}
							}),
						_elm_lang$core$Platform_Cmd$none);
				}
			case 'SetCommentText':
				return A2(
					_user$project$Elm_Util_ops['=>'],
					_elm_lang$core$Native_Utils.update(
						model,
						{commentText: _p4._0}),
					_elm_lang$core$Platform_Cmd$none);
			case 'PostComment':
				var comment = model.commentText;
				if (model.commentInFlight || _elm_lang$core$String$isEmpty(comment)) {
					return A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none);
				} else {
					var cmdFromAuth = function (authToken) {
						return A2(
							_elm_lang$http$Http$send,
							_user$project$Elm_Page_Article$CommentPosted,
							A3(_user$project$Elm_Request_Article_Comments$post, model.article.slug, comment, authToken));
					};
					return A2(
						_elm_lang$core$Tuple$mapFirst,
						_user$project$Elm_Util$appendErrors(
							_elm_lang$core$Native_Utils.update(
								model,
								{commentInFlight: true})),
						A3(_user$project$Elm_Data_Session$attempt, 'post a comment', cmdFromAuth, session));
				}
			case 'CommentPosted':
				if (_p4._0.ctor === 'Ok') {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								commentInFlight: false,
								comments: {ctor: '::', _0: _p4._0._0, _1: model.comments}
							}),
						_elm_lang$core$Platform_Cmd$none);
				} else {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								errors: A2(
									_elm_lang$core$Basics_ops['++'],
									model.errors,
									{
										ctor: '::',
										_0: 'Server error while trying to post comment.',
										_1: {ctor: '[]'}
									})
							}),
						_elm_lang$core$Platform_Cmd$none);
				}
			case 'DeleteComment':
				var _p5 = _p4._0;
				var cmdFromAuth = function (authToken) {
					return A2(
						_elm_lang$http$Http$send,
						_user$project$Elm_Page_Article$CommentDeleted(_p5),
						A3(_user$project$Elm_Request_Article_Comments$delete, model.article.slug, _p5, authToken));
				};
				return A2(
					_elm_lang$core$Tuple$mapFirst,
					_user$project$Elm_Util$appendErrors(model),
					A3(_user$project$Elm_Data_Session$attempt, 'delete comments', cmdFromAuth, session));
			case 'CommentDeleted':
				if (_p4._1.ctor === 'Ok') {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								comments: A2(_user$project$Elm_Page_Article$withoutComment, _p4._0, model.comments)
							}),
						_elm_lang$core$Platform_Cmd$none);
				} else {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								errors: A2(
									_elm_lang$core$Basics_ops['++'],
									model.errors,
									{
										ctor: '::',
										_0: 'Server error while trying to delete comment.',
										_1: {ctor: '[]'}
									})
							}),
						_elm_lang$core$Platform_Cmd$none);
				}
			case 'DeleteArticle':
				var cmdFromAuth = function (authToken) {
					return A2(
						_elm_lang$http$Http$send,
						_user$project$Elm_Page_Article$ArticleDeleted,
						A2(_user$project$Elm_Request_Article$delete, model.article.slug, authToken));
				};
				return A2(
					_elm_lang$core$Tuple$mapFirst,
					_user$project$Elm_Util$appendErrors(model),
					A3(_user$project$Elm_Data_Session$attempt, 'delete articles', cmdFromAuth, session));
			default:
				if (_p4._0.ctor === 'Ok') {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						model,
						_user$project$Elm_Route$modifyUrl(_user$project$Elm_Route$Home));
				} else {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								errors: A2(
									_elm_lang$core$Basics_ops['++'],
									model.errors,
									{
										ctor: '::',
										_0: 'Server error while trying to delete article.',
										_1: {ctor: '[]'}
									})
							}),
						_elm_lang$core$Platform_Cmd$none);
				}
		}
	});
var _user$project$Elm_Page_Article$ToggleFavorite = {ctor: 'ToggleFavorite'};
var _user$project$Elm_Page_Article$favoriteButton = function (article) {
	var favoriteText = A2(
		_elm_lang$core$Basics_ops['++'],
		' Favorite Article (',
		A2(
			_elm_lang$core$Basics_ops['++'],
			_elm_lang$core$Basics$toString(article.favoritesCount),
			')'));
	return A4(
		_user$project$Elm_Views_Article_Favorite$button,
		function (_p6) {
			return _user$project$Elm_Page_Article$ToggleFavorite;
		},
		article,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(favoriteText),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Article$viewButtons = F3(
	function (article, author, maybeUser) {
		var isMyArticle = _elm_lang$core$Native_Utils.eq(
			A2(
				_elm_lang$core$Maybe$map,
				function (_) {
					return _.username;
				},
				maybeUser),
			_elm_lang$core$Maybe$Just(author.username));
		return isMyArticle ? {
			ctor: '::',
			_0: _user$project$Elm_Page_Article$editButton(article),
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html$text(' '),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Article$deleteButton(article),
					_1: {ctor: '[]'}
				}
			}
		} : {
			ctor: '::',
			_0: _user$project$Elm_Page_Article$followButton(author),
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html$text(' '),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Article$favoriteButton(article),
					_1: {ctor: '[]'}
				}
			}
		};
	});
var _user$project$Elm_Page_Article$DismissErrors = {ctor: 'DismissErrors'};
var _user$project$Elm_Page_Article$viewBanner = F4(
	function (errors, article, author, maybeUser) {
		var buttons = A3(_user$project$Elm_Page_Article$viewButtons, article, author, maybeUser);
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('banner'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('container'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$h1,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(article.title),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('article-meta'),
									_1: {ctor: '[]'}
								},
								A2(
									_elm_lang$core$Basics_ops['++'],
									{
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$a,
											{
												ctor: '::',
												_0: _user$project$Elm_Route$href(
													_user$project$Elm_Route$Profile(author.username)),
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$img,
													{
														ctor: '::',
														_0: _user$project$Elm_Data_UserPhoto$src(author.image),
														_1: {ctor: '[]'}
													},
													{ctor: '[]'}),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$div,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$class('info'),
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: _user$project$Elm_Views_Author$view(author.username),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Views_Article$viewTimestamp(article),
														_1: {ctor: '[]'}
													}
												}),
											_1: {ctor: '[]'}
										}
									},
									buttons)),
							_1: {
								ctor: '::',
								_0: A2(_user$project$Elm_Views_Errors$view, _user$project$Elm_Page_Article$DismissErrors, errors),
								_1: {ctor: '[]'}
							}
						}
					}),
				_1: {ctor: '[]'}
			});
	});
var _user$project$Elm_Page_Article$view = F2(
	function (session, model) {
		var postingDisabled = model.commentInFlight;
		var article = model.article;
		var author = article.author;
		var buttons = A3(_user$project$Elm_Page_Article$viewButtons, article, author, session.user);
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('article-page'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A4(_user$project$Elm_Page_Article$viewBanner, model.errors, article, author, session.user),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('container page'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('row article-content'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('col-md-12'),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: A2(
												_user$project$Elm_Data_Article$bodyToHtml,
												article.body,
												{ctor: '[]'}),
											_1: {ctor: '[]'}
										}),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$hr,
									{ctor: '[]'},
									{ctor: '[]'}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('article-actions'),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$div,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$class('article-meta'),
													_1: {ctor: '[]'}
												},
												A2(
													_elm_lang$core$Basics_ops['++'],
													{
														ctor: '::',
														_0: A2(
															_elm_lang$html$Html$a,
															{
																ctor: '::',
																_0: _user$project$Elm_Route$href(
																	_user$project$Elm_Route$Profile(author.username)),
																_1: {ctor: '[]'}
															},
															{
																ctor: '::',
																_0: A2(
																	_elm_lang$html$Html$img,
																	{
																		ctor: '::',
																		_0: _user$project$Elm_Data_UserPhoto$src(author.image),
																		_1: {ctor: '[]'}
																	},
																	{ctor: '[]'}),
																_1: {ctor: '[]'}
															}),
														_1: {
															ctor: '::',
															_0: A2(
																_elm_lang$html$Html$div,
																{
																	ctor: '::',
																	_0: _elm_lang$html$Html_Attributes$class('info'),
																	_1: {ctor: '[]'}
																},
																{
																	ctor: '::',
																	_0: _user$project$Elm_Views_Author$view(author.username),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Views_Article$viewTimestamp(article),
																		_1: {ctor: '[]'}
																	}
																}),
															_1: {ctor: '[]'}
														}
													},
													buttons)),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$div,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$class('row'),
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$div,
													{
														ctor: '::',
														_0: _elm_lang$html$Html_Attributes$class('col-xs-12 col-md-8 offset-md-2'),
														_1: {ctor: '[]'}
													},
													{
														ctor: '::',
														_0: A2(_user$project$Elm_Page_Article$viewAddComment, postingDisabled, session.user),
														_1: A2(
															_elm_lang$core$List$map,
															_user$project$Elm_Page_Article$viewComment(session.user),
															model.comments)
													}),
												_1: {ctor: '[]'}
											}),
										_1: {ctor: '[]'}
									}
								}
							}
						}),
					_1: {ctor: '[]'}
				}
			});
	});

var _user$project$Elm_Views_Form$control = F3(
	function (element, attributes, children) {
		return A2(
			_elm_lang$html$Html$fieldset,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('form-group'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					element,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('form-control'),
						_1: attributes
					},
					children),
				_1: {ctor: '[]'}
			});
	});
var _user$project$Elm_Views_Form$viewErrors = function (errors) {
	return A2(
		_elm_lang$html$Html$ul,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('error-messages'),
			_1: {ctor: '[]'}
		},
		A2(
			_elm_lang$core$List$map,
			function (_p0) {
				var _p1 = _p0;
				return A2(
					_elm_lang$html$Html$li,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text(_p1._1),
						_1: {ctor: '[]'}
					});
			},
			errors));
};
var _user$project$Elm_Views_Form$textarea = _user$project$Elm_Views_Form$control(_elm_lang$html$Html$textarea);
var _user$project$Elm_Views_Form$input = function (attrs) {
	return A2(
		_user$project$Elm_Views_Form$control,
		_elm_lang$html$Html$input,
		A2(
			_elm_lang$core$Basics_ops['++'],
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$type_('text'),
				_1: {ctor: '[]'}
			},
			attrs));
};
var _user$project$Elm_Views_Form$password = function (attrs) {
	return A2(
		_user$project$Elm_Views_Form$control,
		_elm_lang$html$Html$input,
		A2(
			_elm_lang$core$Basics_ops['++'],
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$type_('password'),
				_1: {ctor: '[]'}
			},
			attrs));
};

var _user$project$Elm_Page_Article_Editor$redirectToArticle = function (_p0) {
	return _user$project$Elm_Route$modifyUrl(
		_user$project$Elm_Route$Article(_p0));
};
var _user$project$Elm_Page_Article_Editor$tagsFromString = function (str) {
	return A2(
		_elm_lang$core$List$filter,
		function (_p1) {
			return !_elm_lang$core$String$isEmpty(_p1);
		},
		A2(
			_elm_lang$core$List$map,
			_elm_lang$core$String$trim,
			A2(_elm_lang$core$String$split, ' ', str)));
};
var _user$project$Elm_Page_Article_Editor$initEdit = F2(
	function (session, slug) {
		var maybeAuthToken = A2(
			_elm_lang$core$Maybe$map,
			function (_) {
				return _.token;
			},
			session.user);
		return A2(
			_elm_lang$core$Task$map,
			function (article) {
				return {
					errors: {ctor: '[]'},
					editingArticle: _elm_lang$core$Maybe$Just(slug),
					title: article.title,
					body: _user$project$Elm_Data_Article$bodyToMarkdownString(article.body),
					description: article.description,
					tags: article.tags
				};
			},
			A2(
				_elm_lang$core$Task$mapError,
				function (_p2) {
					return A2(_user$project$Elm_Page_Errored$pageLoadError, _user$project$Elm_Views_Page$Other, 'Article is currently unavailable.');
				},
				_elm_lang$http$Http$toTask(
					A2(_user$project$Elm_Request_Article$get, maybeAuthToken, slug))));
	});
var _user$project$Elm_Page_Article_Editor$initNew = {
	errors: {ctor: '[]'},
	editingArticle: _elm_lang$core$Maybe$Nothing,
	title: '',
	body: '',
	description: '',
	tags: {ctor: '[]'}
};
var _user$project$Elm_Page_Article_Editor$Model = F6(
	function (a, b, c, d, e, f) {
		return {errors: a, editingArticle: b, title: c, body: d, description: e, tags: f};
	});
var _user$project$Elm_Page_Article_Editor$EditCompleted = function (a) {
	return {ctor: 'EditCompleted', _0: a};
};
var _user$project$Elm_Page_Article_Editor$CreateCompleted = function (a) {
	return {ctor: 'CreateCompleted', _0: a};
};
var _user$project$Elm_Page_Article_Editor$SetBody = function (a) {
	return {ctor: 'SetBody', _0: a};
};
var _user$project$Elm_Page_Article_Editor$SetTags = function (a) {
	return {ctor: 'SetTags', _0: a};
};
var _user$project$Elm_Page_Article_Editor$SetDescription = function (a) {
	return {ctor: 'SetDescription', _0: a};
};
var _user$project$Elm_Page_Article_Editor$SetTitle = function (a) {
	return {ctor: 'SetTitle', _0: a};
};
var _user$project$Elm_Page_Article_Editor$Save = {ctor: 'Save'};
var _user$project$Elm_Page_Article_Editor$viewForm = function (model) {
	var isEditing = !_elm_lang$core$Native_Utils.eq(model.editingArticle, _elm_lang$core$Maybe$Nothing);
	var saveButtonText = isEditing ? 'Update Article' : 'Publish Article';
	return A2(
		_elm_lang$html$Html$form,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Events$onSubmit(_user$project$Elm_Page_Article_Editor$Save),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$fieldset,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: A2(
						_user$project$Elm_Views_Form$input,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('form-control-lg'),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$placeholder('Article Title'),
								_1: {
									ctor: '::',
									_0: _elm_lang$html$Html_Events$onInput(_user$project$Elm_Page_Article_Editor$SetTitle),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$defaultValue(model.title),
										_1: {ctor: '[]'}
									}
								}
							}
						},
						{ctor: '[]'}),
					_1: {
						ctor: '::',
						_0: A2(
							_user$project$Elm_Views_Form$input,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$placeholder('What\'s this article about?'),
								_1: {
									ctor: '::',
									_0: _elm_lang$html$Html_Events$onInput(_user$project$Elm_Page_Article_Editor$SetDescription),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$defaultValue(model.description),
										_1: {ctor: '[]'}
									}
								}
							},
							{ctor: '[]'}),
						_1: {
							ctor: '::',
							_0: A2(
								_user$project$Elm_Views_Form$textarea,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$placeholder('Write your article (in markdown)'),
									_1: {
										ctor: '::',
										_0: A2(_elm_lang$html$Html_Attributes$attribute, 'rows', '8'),
										_1: {
											ctor: '::',
											_0: _elm_lang$html$Html_Events$onInput(_user$project$Elm_Page_Article_Editor$SetBody),
											_1: {
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$defaultValue(model.body),
												_1: {ctor: '[]'}
											}
										}
									}
								},
								{ctor: '[]'}),
							_1: {
								ctor: '::',
								_0: A2(
									_user$project$Elm_Views_Form$input,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$placeholder('Enter tags'),
										_1: {
											ctor: '::',
											_0: _elm_lang$html$Html_Events$onInput(_user$project$Elm_Page_Article_Editor$SetTags),
											_1: {
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$defaultValue(
													A2(_elm_lang$core$String$join, ' ', model.tags)),
												_1: {ctor: '[]'}
											}
										}
									},
									{ctor: '[]'}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$button,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('btn btn-lg pull-xs-right btn-primary'),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text(saveButtonText),
											_1: {ctor: '[]'}
										}),
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Article_Editor$view = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('editor-page'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('container page'),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('row'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('col-md-10 offset-md-1 col-xs-12'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _user$project$Elm_Views_Form$viewErrors(model.errors),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Article_Editor$viewForm(model),
										_1: {ctor: '[]'}
									}
								}),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Article_Editor$Body = {ctor: 'Body'};
var _user$project$Elm_Page_Article_Editor$Title = {ctor: 'Title'};
var _user$project$Elm_Page_Article_Editor$modelValidator = _rtfeldman$elm_validate$Validate$all(
	{
		ctor: '::',
		_0: A2(
			_rtfeldman$elm_validate$Validate$ifBlank,
			function (_) {
				return _.title;
			},
			A2(_user$project$Elm_Util_ops['=>'], _user$project$Elm_Page_Article_Editor$Title, 'title can\'t be blank.')),
		_1: {
			ctor: '::',
			_0: A2(
				_rtfeldman$elm_validate$Validate$ifBlank,
				function (_) {
					return _.body;
				},
				A2(_user$project$Elm_Util_ops['=>'], _user$project$Elm_Page_Article_Editor$Body, 'body can\'t be blank.')),
			_1: {ctor: '[]'}
		}
	});
var _user$project$Elm_Page_Article_Editor$Form = {ctor: 'Form'};
var _user$project$Elm_Page_Article_Editor$update = F3(
	function (user, msg, model) {
		var _p3 = msg;
		switch (_p3.ctor) {
			case 'Save':
				var _p4 = A2(_rtfeldman$elm_validate$Validate$validate, _user$project$Elm_Page_Article_Editor$modelValidator, model);
				if (_p4.ctor === '[]') {
					var _p5 = model.editingArticle;
					if (_p5.ctor === 'Nothing') {
						return A2(
							_user$project$Elm_Util_ops['=>'],
							model,
							A2(_user$project$Elm_Request_Article$create, model, user));
					} else {
						return A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none);
					}
				} else {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{errors: _p4}),
						_elm_lang$core$Platform_Cmd$none);
				}
			case 'SetTitle':
				return A2(
					_user$project$Elm_Util_ops['=>'],
					_elm_lang$core$Native_Utils.update(
						model,
						{title: _p3._0}),
					_elm_lang$core$Platform_Cmd$none);
			case 'SetDescription':
				return A2(
					_user$project$Elm_Util_ops['=>'],
					_elm_lang$core$Native_Utils.update(
						model,
						{description: _p3._0}),
					_elm_lang$core$Platform_Cmd$none);
			case 'SetTags':
				return A2(
					_user$project$Elm_Util_ops['=>'],
					_elm_lang$core$Native_Utils.update(
						model,
						{
							tags: _user$project$Elm_Page_Article_Editor$tagsFromString(_p3._0)
						}),
					_elm_lang$core$Platform_Cmd$none);
			case 'SetBody':
				return A2(
					_user$project$Elm_Util_ops['=>'],
					_elm_lang$core$Native_Utils.update(
						model,
						{body: _p3._0}),
					_elm_lang$core$Platform_Cmd$none);
			case 'CreateCompleted':
				if (_p3._0.ctor === 'Ok') {
					return A2(
						_user$project$Elm_Util$pair,
						model,
						_user$project$Elm_Route$modifyUrl(
							_user$project$Elm_Route$Article(_p3._0._0.slug)));
				} else {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								errors: A2(
									_elm_lang$core$Basics_ops['++'],
									model.errors,
									{
										ctor: '::',
										_0: A2(_user$project$Elm_Util_ops['=>'], _user$project$Elm_Page_Article_Editor$Form, 'Server error while attempting to publish article'),
										_1: {ctor: '[]'}
									})
							}),
						_elm_lang$core$Platform_Cmd$none);
				}
			default:
				if (_p3._0.ctor === 'Ok') {
					return A2(
						_user$project$Elm_Util$pair,
						model,
						_user$project$Elm_Route$modifyUrl(
							_user$project$Elm_Route$Article(_p3._0._0.slug)));
				} else {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								errors: A2(
									_elm_lang$core$Basics_ops['++'],
									model.errors,
									{
										ctor: '::',
										_0: A2(_user$project$Elm_Util_ops['=>'], _user$project$Elm_Page_Article_Editor$Form, 'Server error while attempting to save article'),
										_1: {ctor: '[]'}
									})
							}),
						_elm_lang$core$Platform_Cmd$none);
				}
		}
	});

var _user$project$Elm_Page_Calendar$dayTitle = function (day) {
	var title = function () {
		var _p0 = day.day;
		if (_p0 === 'Sunday') {
			return day.eu.title;
		} else {
			return day.mpep.title;
		}
	}();
	return A2(
		_elm_lang$html$Html$p,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('day-title'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(title),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Calendar$dayClass = function (day) {
	var color = A2(
		_elm_lang$core$Maybe$withDefault,
		'green',
		_elm_lang$core$List$head(day.eu.colors));
	return A2(_elm_lang$core$Basics_ops['++'], 'day_of_month day_', color);
};
var _user$project$Elm_Page_Calendar$showWeek = function (week) {
	var rowOfDays = function (day) {
		return A2(
			_elm_lang$html$Html$td,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('td-top'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$p,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class(
									_user$project$Elm_Page_Calendar$dayClass(day)),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(day.date),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Calendar$dayTitle(day),
							_1: {ctor: '[]'}
						}
					}),
				_1: {ctor: '[]'}
			});
	};
	return A2(_elm_lang$core$List$map, rowOfDays, week.days);
};
var _user$project$Elm_Page_Calendar$showWeeks = function (weeks) {
	var rowsOfWeeks = function (wk) {
		return A2(
			_elm_lang$html$Html$tr,
			{ctor: '[]'},
			_user$project$Elm_Page_Calendar$showWeek(wk));
	};
	return A2(_elm_lang$core$List$map, rowsOfWeeks, weeks);
};
var _user$project$Elm_Page_Calendar$view = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text('Calendar goes here'),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$table,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$id('calendar'),
						_1: {ctor: '[]'}
					},
					A2(
						_elm_lang$core$Basics_ops['++'],
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$tr,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$th,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('cal_move_month'),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text('<'),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$th,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$colspan(5),
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text(
													A2(
														_elm_lang$core$Basics_ops['++'],
														model.cal.month,
														A2(_elm_lang$core$Basics_ops['++'], ' ', model.cal.year))),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$th,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$class('cal_move_month'),
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('>'),
													_1: {ctor: '[]'}
												}),
											_1: {ctor: '[]'}
										}
									}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$tr,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$th,
											{ctor: '[]'},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('Sun'),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$th,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Mon'),
													_1: {ctor: '[]'}
												}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$th,
													{ctor: '[]'},
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text('Tue'),
														_1: {ctor: '[]'}
													}),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$html$Html$th,
														{ctor: '[]'},
														{
															ctor: '::',
															_0: _elm_lang$html$Html$text('Wed'),
															_1: {ctor: '[]'}
														}),
													_1: {
														ctor: '::',
														_0: A2(
															_elm_lang$html$Html$th,
															{ctor: '[]'},
															{
																ctor: '::',
																_0: _elm_lang$html$Html$text('Thu'),
																_1: {ctor: '[]'}
															}),
														_1: {
															ctor: '::',
															_0: A2(
																_elm_lang$html$Html$th,
																{ctor: '[]'},
																{
																	ctor: '::',
																	_0: _elm_lang$html$Html$text('Fri'),
																	_1: {ctor: '[]'}
																}),
															_1: {
																ctor: '::',
																_0: A2(
																	_elm_lang$html$Html$th,
																	{ctor: '[]'},
																	{
																		ctor: '::',
																		_0: _elm_lang$html$Html$text('Sat'),
																		_1: {ctor: '[]'}
																	}),
																_1: {ctor: '[]'}
															}
														}
													}
												}
											}
										}
									}),
								_1: {ctor: '[]'}
							}
						},
						_user$project$Elm_Page_Calendar$showWeeks(model.cal.weeks))),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Elm_Page_Calendar$update = F2(
	function (msg, model) {
		var _p1 = msg;
		switch (_p1.ctor) {
			case 'NoOp':
				return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
			case 'GetCalendar':
				if (_p1._0.ctor === 'NextMonth') {
					return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
				} else {
					return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
				}
			default:
				if (_p1._0.ctor === 'Just') {
					var newModel = _elm_lang$core$Native_Utils.update(
						model,
						{cal: _p1._0._0});
					return {ctor: '_Tuple2', _0: newModel, _1: _elm_lang$core$Platform_Cmd$none};
				} else {
					return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
				}
		}
	});
var _user$project$Elm_Page_Calendar$calendarChange = _user$project$Elm_Ports$requestedCalendar(
	function (_p2) {
		return _elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$Elm_Data_Calendar$calendarDecoder, _p2));
	});
var _user$project$Elm_Page_Calendar$initWeek = {
	days: {ctor: '[]'}
};
var _user$project$Elm_Page_Calendar$initToggle = {toggleA: false, toggleB: false};
var _user$project$Elm_Page_Calendar$init = {
	errors: {ctor: '[]'},
	thisOption: '',
	cal: _user$project$Elm_Data_Calendar$initCalendar,
	toggle: _user$project$Elm_Page_Calendar$initToggle
};
var _user$project$Elm_Page_Calendar$initCal = function (cal) {
	var model = _user$project$Elm_Page_Calendar$init;
	return _elm_lang$core$Native_Utils.update(
		model,
		{cal: cal});
};
var _user$project$Elm_Page_Calendar$Toggle = F2(
	function (a, b) {
		return {toggleA: a, toggleB: b};
	});
var _user$project$Elm_Page_Calendar$Model = F4(
	function (a, b, c, d) {
		return {errors: a, thisOption: b, cal: c, toggle: d};
	});
var _user$project$Elm_Page_Calendar$Week = function (a) {
	return {days: a};
};
var _user$project$Elm_Page_Calendar$Weeks = function (a) {
	return {weeks: a};
};
var _user$project$Elm_Page_Calendar$LastMonth = {ctor: 'LastMonth'};
var _user$project$Elm_Page_Calendar$NextMonth = {ctor: 'NextMonth'};
var _user$project$Elm_Page_Calendar$SetCalendar = function (a) {
	return {ctor: 'SetCalendar', _0: a};
};
var _user$project$Elm_Page_Calendar$subscriptions = function (model) {
	return _elm_lang$core$Platform_Sub$batch(
		{
			ctor: '::',
			_0: A2(_elm_lang$core$Platform_Sub$map, _user$project$Elm_Page_Calendar$SetCalendar, _user$project$Elm_Page_Calendar$calendarChange),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Calendar$GetCalendar = function (a) {
	return {ctor: 'GetCalendar', _0: a};
};
var _user$project$Elm_Page_Calendar$NoOp = {ctor: 'NoOp'};

var _user$project$Elm_Page_Office_Format$toDataRef = function (str) {
	return A4(
		_elm_lang$core$Regex$replace,
		_elm_lang$core$Regex$All,
		_elm_lang$core$Regex$regex('[\\s\\:\\.\\,\\-]'),
		function (_p0) {
			return '_';
		},
		str);
};
var _user$project$Elm_Page_Office_Format$withAmen = function (s) {
	return A2(
		_elm_lang$html$Html$p,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('office'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(s),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$span,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('italic'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('Amen.'),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Elm_Page_Office_Format$versical = F2(
	function (speaker, says) {
		return A2(
			_elm_lang$html$Html$li,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$span,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('versical-speaker'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text(speaker),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$span,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('versical-speaker-says'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(says),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$Elm_Page_Office_Format$versicals = function (vx) {
	var listVersicals = function (_p1) {
		var _p2 = _p1;
		return A2(_user$project$Elm_Page_Office_Format$versical, _p2._0, _p2._1);
	};
	return A2(
		_elm_lang$html$Html$ul,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('versicals'),
			_1: {ctor: '[]'}
		},
		A2(_elm_lang$core$List$map, listVersicals, vx));
};
var _user$project$Elm_Page_Office_Format$wordOfTheLord = _user$project$Elm_Page_Office_Format$versicals(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: '', _1: 'The Word of the Lord.'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'People', _1: 'Thanks be to God'},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Elm_Page_Office_Format$title2Italic = function (s) {
	return A2(
		_elm_lang$html$Html$p,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('title2 italic'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(s),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Office_Format$title2 = function (s) {
	return A2(
		_elm_lang$html$Html$p,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('title2'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(s),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Office_Format$title1 = function (s) {
	return A2(
		_elm_lang$html$Html$p,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('title1'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(s),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Office_Format$theLordBeWithYou = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$versicals(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'The Lord be with you.'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'People', _1: 'And with your spirit.'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'officiant', _1: 'Let us pray.'},
						_1: {ctor: '[]'}
					}
				}
			}),
		_1: {ctor: '[]'}
	});
var _user$project$Elm_Page_Office_Format$theWordOfTheLord = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$versicals(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: ' ', _1: 'The Word of the Lord'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'People', _1: 'Thanks be to God'},
					_1: {ctor: '[]'}
				}
			}),
		_1: {ctor: '[]'}
	});
var _user$project$Elm_Page_Office_Format$pbSection = function (s) {
	return A2(
		_elm_lang$html$Html$p,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('section'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(s),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Office_Format$rubricNewline = function (s) {
	return A2(
		_elm_lang$html$Html$p,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('rubric-newline'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(s),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Office_Format$rubricOffice = function (s) {
	return A2(
		_elm_lang$html$Html$p,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('rubric-office'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(s),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Office_Format$rubricBlack = function (s) {
	return A2(
		_elm_lang$html$Html$p,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('i black'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(s),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Office_Format$rubricWithText = function (_p3) {
	var _p4 = _p3;
	return A2(
		_elm_lang$html$Html$p,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$span,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('i dark-red'),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text(_p4._0),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$span,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('office'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text(_p4._1),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Elm_Page_Office_Format$rubric = function (s) {
	return A2(
		_elm_lang$html$Html$p,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('i dark-red'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(s),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Office_Format$reference = function (s) {
	return A2(
		_elm_lang$html$Html$p,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('bible_ref'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(s),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Office_Format$pbVsIndent = function (s) {
	return A2(
		_elm_lang$html$Html$p,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('pb_vs_indent'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(s),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Office_Format$pbVs = function (s) {
	return A2(
		_elm_lang$html$Html$p,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('pb_vs'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(s),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Office_Format$pbVss = function (strings) {
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		A2(_elm_lang$core$List$map, _user$project$Elm_Page_Office_Format$pbVs, strings));
};
var _user$project$Elm_Page_Office_Format$orThis = A2(
	_elm_lang$html$Html$p,
	{
		ctor: '::',
		_0: _elm_lang$html$Html_Attributes$class('alt_confession rubric'),
		_1: {ctor: '[]'}
	},
	{
		ctor: '::',
		_0: _elm_lang$html$Html$text('or this'),
		_1: {ctor: '[]'}
	});
var _user$project$Elm_Page_Office_Format$openingSentence = function (_p5) {
	var _p6 = _p5;
	return A2(
		_elm_lang$html$Html$p,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$span,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('italic'),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text(_p6._0),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$br,
					{ctor: '[]'},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html$text(_p6._1),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$br,
							{ctor: '[]'},
							{ctor: '[]'}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$span,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('italic'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text(_p6._2),
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						}
					}
				}
			}
		});
};
var _user$project$Elm_Page_Office_Format$justText = function (s) {
	return A2(
		_elm_lang$html$Html$p,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('office'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(s),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Office_Format$mpepAdditionalDirectives = function (show) {
	return show ? A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbSection('Additional Directives: Morning and Evening Prayer'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$justText('\n          The Confession and Apostles’ Creed may be omitted, provided each is said at least once during the\n          course of the day\n        '),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$justText('\n          The Gloria Patri in the opening versicles may be said in unison. The following form of the Gloria\n          Patri may alternately be used:\n        '),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('Glory to the Father, and to the Son, and to the Holy Spirit:'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('As it was in the beginning, is now, and will be forever. Amen.'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$justText('\n          The Officiant and People may join in saying “Alleluia” (except in Lent) as an alternative to the\n          versicles “Praise the Lord. The Lord’s name be praised.”\n        '),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$justText('If an offering is to be received, it is appropriate to do so during the hymn or anthem following the collects'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$justText('\n          A sermon may be preached after the lessons, after the hymn or anthem following the collects, or\n          after the conclusion of the Office.\n        '),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			}
		}) : A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{ctor: '[]'});
};
var _user$project$Elm_Page_Office_Format$complineAdditionalDirectives = function (show) {
	return show ? A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$h3,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('Additional Directives'),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$justText('\n            For those saying Compline every day, particularly in families or other communities, additional short\n            Scriptural readings may be desired. Some appropriate readings include:\n            '),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVsIndent('Isaiah 26:3-4'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('Isaiah 30:15a'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('Matthew 6:31-34'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('2 Corinthians 4:6'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVsIndent('1 Thessalonians 5:9-10'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVsIndent('1 Thessalonians 5:23'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVsIndent('Ephesians 4:26-27'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$justText('\n            If desired, either version of the Lord’s Prayer may conclude with the phrase, “deliver us from evil,”\n            omitting the doxology.\n            '),
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}) : A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{ctor: '[]'});
};
var _user$project$Elm_Page_Office_Format$middayDirectives = function (show) {
	return show ? A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$h3,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('Additional Directives'),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$justText('\n          If desired, either version of the Lord’s Prayer may conclude with the phrase, “deliver us from evil,”\n          omitting the doxology.\n        '),
				_1: {ctor: '[]'}
			}
		}) : A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{ctor: '[]'});
};
var _user$project$Elm_Page_Office_Format$italic = function (str) {
	return A2(
		_elm_lang$html$Html$p,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('italic'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(str),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Office_Format$emptyLine = A2(
	_elm_lang$html$Html$br,
	{ctor: '[]'},
	{ctor: '[]'});
var _user$project$Elm_Page_Office_Format$centerItalic = function (str) {
	return A2(
		_elm_lang$html$Html$p,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('italic'),
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$style(
					{
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'text-align', _1: 'center'},
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(str),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Office_Format$canticle = F2(
	function (title, name) {
		return A2(
			_elm_lang$html$Html$p,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('canticle'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$span,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('canticle-title'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text(title),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$span,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('canticle-name'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(name),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$Elm_Page_Office_Format$bibleText = F2(
	function (vss, ref) {
		return A2(
			_elm_lang$html$Html$p,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('office'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(vss),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$span,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('bible_ref'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(ref),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$Elm_Page_Office_Format$bibleRef = function (str) {
	return A2(
		_elm_lang$html$Html$p,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('bible_ref'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(str),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Office_Format$antiphon = function (_p7) {
	var _p8 = _p7;
	return A2(
		_elm_lang$html$Html$p,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$span,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('italic'),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text(_p8._0),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$br,
					{ctor: '[]'},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html$text(_p8._1),
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$Elm_Page_Office_Format$altReadingText = F2(
	function (ref, str) {
		return A2(
			_elm_lang$html$Html$p,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('comp_scripture this_alt_reading'),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$id(
						_user$project$Elm_Page_Office_Format$toDataRef(ref)),
					_1: {ctor: '[]'}
				}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(str),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$span,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('s_ref'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(ref),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$Elm_Page_Office_Format$altReadings = function (list) {
	var reading = function (ref) {
		return A2(
			_elm_lang$html$Html$li,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('alt_readings-select'),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html_Attributes$attribute,
						'data-ref',
						_user$project$Elm_Page_Office_Format$toDataRef(ref)),
					_1: {ctor: '[]'}
				}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(ref),
				_1: {ctor: '[]'}
			});
	};
	return A2(
		_elm_lang$html$Html$ul,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('alt_readings-options'),
			_1: {ctor: '[]'}
		},
		A2(_elm_lang$core$List$map, reading, list));
};
var _user$project$Elm_Page_Office_Format$agnus_dei_resp = function (str) {
	return A2(
		_elm_lang$html$Html$p,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('agnus-dei-resp'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(str),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Office_Format$agnus_dei = function (str) {
	return A2(
		_elm_lang$html$Html$p,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('agnus-dei'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(str),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Office_Format$hideable = F2(
	function (show, attr) {
		return show ? _elm_lang$html$Html_Attributes$style(attr) : _elm_lang$html$Html_Attributes$style(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'display', _1: 'none'},
				_1: {ctor: '[]'}
			});
	});

var _user$project$Elm_Page_Office_Prayers$venite = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Venite', 'O Come'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$rubricBlack('Psalm 95:1-7; 8-11'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$emptyLine,
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVs('O come, let us sing to the Lord;'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVs('Let us make a joyful noise to the rock of our salvation!'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVs('Let us come into his presence with thanksgiving;'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVs('Let us make a joyful noise to him with songs of praise!'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVs('For the Lord is a great God, and a great King above all gods.'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVs('In his hand are the depths of the earth;'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVsIndent('the heights of the mountains are his also.'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVs('The sea is his, for he made it,'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and his hands formed the dry land.'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVs('O come, let us worship and bow down;'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVsIndent('Let us kneel before the Lord, our Maker!'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVs('For he is our God, and we are the people of his pasture,'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and the sheep of his hand.'),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$pbVs('O, that today you would hearken to his voice!'),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$emptyLine,
																			_1: {ctor: '[]'}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$teDeum = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Te Deum Laudamus', 'We Praise You, O God'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbVs('We praise you, O God,'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$pbVsIndent('we acclaim you as Lord;'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVsIndent('all creation worships you,'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('the Father everlasting.'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVs('To you all angels, all the powers of heaven,'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVs('The cherubim and seraphim, sing in endless praise:'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVsIndent('Holy, Holy, Holy, Lord God of power and might,'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVsIndent('heaven and earth are full of your glory.'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVs('The glorious company of apostles praise you.'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVs('The noble fellowship of prophets praise you.'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVs('The white-robed army of martyrs praise you.'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVs('Throughout the world the holy Church acclaims you:'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVsIndent('Father, of majesty unbounded,'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVsIndent('your true and only Son, worthy of all praise,'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Format$pbVsIndent('the Holy Spirit, advocate and guide.'),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$pbVs('You, Christ, are the king of glory,'),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$pbVsIndent('the eternal Son of the Father.'),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$pbVs('When you took our flesh to set us free'),
																				_1: {
																					ctor: '::',
																					_0: _user$project$Elm_Page_Office_Format$pbVsIndent('you humbly chose the Virgin’s womb.'),
																					_1: {
																						ctor: '::',
																						_0: _user$project$Elm_Page_Office_Format$pbVs('You overcame the sting of death'),
																						_1: {
																							ctor: '::',
																							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and opened the kingdom of heaven to all believers.'),
																							_1: {
																								ctor: '::',
																								_0: _user$project$Elm_Page_Office_Format$pbVs('You are seated at God’s right hand in glory.'),
																								_1: {
																									ctor: '::',
																									_0: _user$project$Elm_Page_Office_Format$pbVsIndent('We believe that you will come to be our judge.'),
																									_1: {
																										ctor: '::',
																										_0: _user$project$Elm_Page_Office_Format$pbVs('Come then, Lord, and help your people,'),
																										_1: {
																											ctor: '::',
																											_0: _user$project$Elm_Page_Office_Format$pbVsIndent('bought with the price of your own blood,'),
																											_1: {
																												ctor: '::',
																												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and bring us with your saints'),
																												_1: {
																													ctor: '::',
																													_0: _user$project$Elm_Page_Office_Format$pbVsIndent('to glory everlasting.'),
																													_1: {
																														ctor: '::',
																														_0: _user$project$Elm_Page_Office_Format$rubric('The following verses may be omitted '),
																														_1: {
																															ctor: '::',
																															_0: _user$project$Elm_Page_Office_Format$pbVs('Save your people, Lord, and bless your inheritance;'),
																															_1: {
																																ctor: '::',
																																_0: _user$project$Elm_Page_Office_Format$pbVsIndent('govern and uphold them now and always.'),
																																_1: {
																																	ctor: '::',
																																	_0: _user$project$Elm_Page_Office_Format$pbVs('Day by day we bless you;'),
																																	_1: {
																																		ctor: '::',
																																		_0: _user$project$Elm_Page_Office_Format$pbVsIndent('we praise your name forever.'),
																																		_1: {
																																			ctor: '::',
																																			_0: _user$project$Elm_Page_Office_Format$pbVs('Keep us today, Lord, from all sin;'),
																																			_1: {
																																				ctor: '::',
																																				_0: _user$project$Elm_Page_Office_Format$pbVsIndent('have mercy on us, Lord, have mercy.'),
																																				_1: {
																																					ctor: '::',
																																					_0: _user$project$Elm_Page_Office_Format$pbVs('Lord, show us your love and mercy,'),
																																					_1: {
																																						ctor: '::',
																																						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('for we have put our trust in you.'),
																																						_1: {
																																							ctor: '::',
																																							_0: _user$project$Elm_Page_Office_Format$pbVs('In you, Lord, is our hope,'),
																																							_1: {
																																								ctor: '::',
																																								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('let us never be put to shame.'),
																																								_1: {ctor: '[]'}
																																							}
																																						}
																																					}
																																				}
																																			}
																																		}
																																	}
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$surgeIlluminare = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$rubric('Especially suitable for use during the season after Epiphany'),
		_1: {
			ctor: '::',
			_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Surge, illuminare', 'Arise, shine, for your light has come'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$rubricBlack('Isaiah 60:1-3, 11a, 14c, 18-19'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVs('Arise, shine, for your light has come,'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and the glory of the Lord has dawned upon you.'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVs('For behold, darkness covers the land;'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('deep gloom enshrouds the peoples.'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVs('But over you the Lord will rise,'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and his glory will appear upon you.'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVs('Nations will stream to your light,'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and kings to the brightness of your dawning.'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVs('Your gates will always be open;'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVsIndent('by day or night they will never be shut.'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVs('They will call you, The City of the Lord,'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVsIndent('the Zion of the Holy One of Israel.'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Format$pbVs('Violence will no more be heard in your land,'),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$pbVsIndent('ruin or destruction within your borders.'),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$pbVs('You will call your walls, Salvation,'),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and all your portals, Praise.'),
																				_1: {
																					ctor: '::',
																					_0: _user$project$Elm_Page_Office_Format$pbVs('The sun will no more be your light by day;'),
																					_1: {
																						ctor: '::',
																						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('by night you will not need the brightness of the moon.'),
																						_1: {
																							ctor: '::',
																							_0: _user$project$Elm_Page_Office_Format$pbVs('The Lord will be your everlasting light,'),
																							_1: {
																								ctor: '::',
																								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and your God will be your glory.'),
																								_1: {
																									ctor: '::',
																									_0: _user$project$Elm_Page_Office_Format$pbVs('Glory to the Father, and to the Son, and to the Holy Spirit;'),
																									_1: {
																										ctor: '::',
																										_0: _user$project$Elm_Page_Office_Format$pbVsIndent('as it was in the beginning, is now, and ever shall be,'),
																										_1: {
																											ctor: '::',
																											_0: _user$project$Elm_Page_Office_Format$pbVs('world without end. Amen.'),
																											_1: {ctor: '[]'}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$quaeriteDominum = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$rubric('Especially suitable for use during Lent'),
		_1: {
			ctor: '::',
			_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Quaerite Dominum', 'Seek the Lord while he wills to be found'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$rubricBlack('Isaiah 55:6-11'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVs('Seek the Lord while he wills to be found;'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('call upon him when he draws near.'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVs('Let the wicked forsake their ways'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and the evil ones their thoughts;'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVs('And let them turn to the Lord, and he will have compassion,'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and to our God, for he will richly pardon.'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVs('For my thoughts are not your thoughts,'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('nor your ways my ways, says the Lord.'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVs('For as the heavens are higher than the earth,'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVsIndent('so are my ways higher than your ways,'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and my thoughts than your thoughts.'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVs('For as rain and snow fall from the heavens'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and return not again, but water the earth,'),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$pbVs('Bringing forth life and giving growth,'),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$pbVsIndent('seed for sowing and bread for eating,'),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$pbVs('So is my word that goes forth from my mouth;'),
																				_1: {
																					ctor: '::',
																					_0: _user$project$Elm_Page_Office_Format$pbVsIndent('it will not return to me empty;'),
																					_1: {
																						ctor: '::',
																						_0: _user$project$Elm_Page_Office_Format$pbVs('But it will accomplish that which I have purposed,'),
																						_1: {
																							ctor: '::',
																							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and prosper in that for which I sent it.'),
																							_1: {
																								ctor: '::',
																								_0: _user$project$Elm_Page_Office_Format$pbVs('Glory to the Father, and to the Son, and to the Holy Spirit;'),
																								_1: {
																									ctor: '::',
																									_0: _user$project$Elm_Page_Office_Format$pbVsIndent('as it was in the beginning, is now, and ever shall be, world'),
																									_1: {
																										ctor: '::',
																										_0: _user$project$Elm_Page_Office_Format$pbVsIndent('without end. Amen.'),
																										_1: {ctor: '[]'}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$prayers = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$versicals(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'O Lord, show us your mercy;'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'People', _1: 'And grant us your salvation.'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'O Lord, save our nations;'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'People', _1: 'And guide us in the way of justice and truth.'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Clothe your ministers with righteousness;'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'People', _1: 'And make your chosen people joyful.'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'O Lord, save your people;'},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'People', _1: 'And bless your inheritance.'},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Give peace in our time, O Lord;'},
												_1: {
													ctor: '::',
													_0: {ctor: '_Tuple2', _0: 'People', _1: 'For only in you can we live in safety.'},
													_1: {
														ctor: '::',
														_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Let not the needy, O Lord, be forgotten;'},
														_1: {
															ctor: '::',
															_0: {ctor: '_Tuple2', _0: 'People', _1: 'Nor the hope of the poor be taken away.'},
															_1: {
																ctor: '::',
																_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Create in us clean hearts, O God;'},
																_1: {
																	ctor: '::',
																	_0: {ctor: '_Tuple2', _0: 'People', _1: 'And take not your Holy Spirit from us.'},
																	_1: {ctor: '[]'}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}),
		_1: {ctor: '[]'}
	});
var _user$project$Elm_Page_Office_Prayers$prayerIntro = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$versicals(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'The Lord be with you.'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'People', _1: 'And with your spirit.'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Let us pray.'},
						_1: {ctor: '[]'}
					}
				}
			}),
		_1: {ctor: '[]'}
	});
var _user$project$Elm_Page_Office_Prayers$phosHilaron = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Phos hilaron', 'O Gladsome Light'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbVs('O gladsome light,'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$pbVs('pure brightness of the ever-living Father in heaven,'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVs('O Jesus Christ, holy and blessed!'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVs('Now as we come to the setting of the sun,'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVs('and our eyes behold the vesper light,'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVs('we sing praises to God: the Father, the Son, and the Holy Spirit.'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVs('You are worthy at all times to be praised by happy voices,'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVs('O Son of God, O Giver of Life,'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVs('and to be glorified through all the worlds.'),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$paschaNostrum = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$rubric('\n      During the first week of Easter, the Pascha Nostrum\n      will be used in place of the Invitatory Psalm. It is\n      appropriate to use this canticle throughout Eastertide.\n      '),
		_1: {
			ctor: '::',
			_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Pascha Nostrum', 'Christ our Passover'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$rubricBlack('1 Corinthians 5:7-8; Romans 6:9-11; 1 Corinthians 15:20-22'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$emptyLine,
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVs('Alleluia. Christ our Passover has been sacrificed for us;'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('therefore let us keep the feast,'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVs('Not with the old leaven, the leaven of malice and evil,'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVsIndent('but with the unleavened bread of sincerity and truth. Alleluia.'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVs('Christ being raised from the dead will never die again;'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVsIndent('death no longer has dominion over him.'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVs('The death that he died, he died to sin, once for all;'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVsIndent('but the life he lives, he lives to God.'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVs('So also consider yourselves dead to sin,'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and alive to God in Jesus Christ our Lord. Alleluia.'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVs('Christ has been raised from the dead,'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Format$pbVsIndent('the first fruits of those who have fallen asleep.'),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$pbVs('For since by a man came death,'),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$pbVsIndent('by a man has come also the resurrection of the dead.'),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$pbVs('For as in Adam all die,'),
																				_1: {
																					ctor: '::',
																					_0: _user$project$Elm_Page_Office_Format$pbVsIndent('so also in Christ shall all be made alive. Alleluia.'),
																					_1: {ctor: '[]'}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$nuncDimittis = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Nunc dimittis', 'The Song of Simeon'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$rubricBlack('Luke 2:29-32'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$pbVs('Lord, now let your servant depart in peace,'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVsIndent('according to your word.'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVs('For my eyes have seen your salvation,'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('which you have prepared before the face of all people;'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVs('to be a light to lighten the Gentiles,'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and to be the glory of your people Israel.'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVs('Glory to the Father, and to the Son, and to the Holy Spirit;'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVsIndent('as it was in the beginning, is now, and ever shall be, world'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('without end. Amen.'),
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$mercy3 = A2(
	_elm_lang$html$Html$table,
	{
		ctor: '::',
		_0: _elm_lang$html$Html_Attributes$class('mercy3'),
		_1: {ctor: '[]'}
	},
	{
		ctor: '::',
		_0: A2(
			_elm_lang$html$Html$tr,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$td,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$p,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('Lord, have mercy upon us.'),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$p,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$italic('Christ, have mercy upon us.'),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$p,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text('Lord, have mercy upon us.'),
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							}
						}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$td,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('mercy3-or'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$italic('or'),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$td,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$p,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text('Lord, have mercy'),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$p,
										{ctor: '[]'},
										{
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$italic('Christ, have mercy'),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$p,
											{ctor: '[]'},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('Lord, have mercy'),
												_1: {ctor: '[]'}
											}),
										_1: {ctor: '[]'}
									}
								}
							}),
						_1: {ctor: '[]'}
					}
				}
			}),
		_1: {ctor: '[]'}
	});
var _user$project$Elm_Page_Office_Prayers$magnificat = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Magnificat', 'The Song of Mary'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$rubricBlack('Luke 1:46-55'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$pbVs('My soul magnifies the Lord,'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and my spirit rejoices in God my Savior.'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVs('For he has regarded'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('the lowliness of his handmaiden.'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVs('For behold, from now on,'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVsIndent('all generations will call me blessed.'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVs('For he that is mighty has magnified me,'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and holy is his Name.'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVs('And his mercy is on those who fear him,'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVsIndent('throughout all generations.'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVs('He has shown the strength of his arm;'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVsIndent('he has scattered the proud in the imagination of their hearts.'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVs('He has brought down the mighty from their thrones,'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and has exalted the humble and meek.'),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$pbVs('He has filled the hungry with good things,'),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and the rich he has sent empty away.'),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$pbVs('He, remembering his mercy, has helped his servant Israel,'),
																				_1: {
																					ctor: '::',
																					_0: _user$project$Elm_Page_Office_Format$pbVsIndent('as he promised to our fathers, Abraham and his seed forever.'),
																					_1: {
																						ctor: '::',
																						_0: _user$project$Elm_Page_Office_Format$pbVs('Glory to the Father, and to the Son, and to the Holy Spirit;'),
																						_1: {
																							ctor: '::',
																							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('as it was in the beginning, is now, and ever shall be,'),
																							_1: {
																								ctor: '::',
																								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('world without end. Amen.'),
																								_1: {ctor: '[]'}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$magnaEtMirabilia = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$rubric('Especially suitable for use in Advent and Easter'),
		_1: {
			ctor: '::',
			_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Magna et mirabilia', 'The Song of the Redeemed'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$rubricBlack('Revelation 15:3-4'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVs('O ruler of the universe, Lord God,'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('great deeds are they that you have done,'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('surpassing human understanding.'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVs('Your ways are ways of righteousness and truth,'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVsIndent('O King of all the ages.'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVs('Who can fail to do you homage, Lord,'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and sing the praises of your Name?'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('for you only are the Holy One.'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVs('All nations will draw near and fall down before you,'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVsIndent('because your just and holy works have been revealed.'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVs('Glory to the Father, and to the Son, and to the Holy Spirit;'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVsIndent('as it was in the beginning, is now, and ever shall be, world'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Format$pbVsIndent('without end. Amen.'),
																	_1: {ctor: '[]'}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$lordsPrayerTrad = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$pbVs('Our Father, who art in heaven, hallowed be thy Name.'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbVs('Thy kingdom come, thy will be done, on earth as it is in heaven.'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$pbVs('Give us this day our daily bread.'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVs('And forgive us our trespasses, as we forgive those who trespass'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('against us.'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVs('And lead us not into temptation, but deliver us from evil.'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVs('For thine is the kingdom, and the power, and the glory,'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVs('forever and ever. Amen.'),
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$lordsPrayerModern = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$pbVs('Our Father in heaven, hallowed be your Name.'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbVs('Your kingdom come, your will be done, on earth as it is in heaven.'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$pbVs('Give us today our daily bread.'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVs('And forgive us our sins as we forgive those who sin against us.'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVs('Save us from the time of trial, and deliver us from evil.'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVs('For the kingdom, the power, and the glory are yours,'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('now and forever. Amen.'),
								_1: {ctor: '[]'}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$lordsPrayerTraditional = function (trad) {
	return trad ? _user$project$Elm_Page_Office_Prayers$lordsPrayerTrad : _user$project$Elm_Page_Office_Prayers$lordsPrayerModern;
};
var _user$project$Elm_Page_Office_Prayers$lentVeniteAddOn = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$emptyLine,
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$rubric('In Lent, and on other penitential occasions, the following verses are added.'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$pbVs('Do not harden your hearts, as at Meribah,'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVsIndent('as on the day at Massah in the wilderness,'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('when your fathers put me to the test'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and put me to the proof, though they had seen my work.'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVs('For forty years I loathed that generation'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and said, “They are a people who go astray in their heart,'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and they have not known my ways.”'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVs('Therefore I swore in my wrath,'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('“They shall not enter my rest.”'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$emptyLine,
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$kyriePantokrator = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$justText('Especially suitable for use during Lent'),
		_1: {
			ctor: '::',
			_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Kyrie Pantokrator', 'A Song of Penitence'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$rubricBlack('Prayer of Manasseh, 1-2, 4, 6-7, 11-15'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVs('O Lord and Ruler of the hosts of heaven,'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('God of Abraham, Isaac, and Jacob,'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and of all their righteous offspring:'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVs('You made the heavens and the earth,'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVsIndent('with all their vast array.'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVs('All things quake with fear at your presence;'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVsIndent('they tremble because of your power.'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVs('But your merciful promise is beyond all measure;'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVsIndent('it surpasses all that our minds can fathom.'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVs('O Lord, you are full of compassion,'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVsIndent('long-suffering, and abounding in mercy.'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVs('You hold back your hand;'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Format$pbVsIndent('you do not punish as we deserve.'),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$pbVs('In your great goodness, Lord,'),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$pbVsIndent('you have promised forgiveness to sinners,'),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$pbVsIndent('that they may repent of their sin and be saved.'),
																				_1: {
																					ctor: '::',
																					_0: _user$project$Elm_Page_Office_Format$pbVs('And now, O Lord, I bend the knee of my heart,'),
																					_1: {
																						ctor: '::',
																						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and make my appeal, sure of your gracious goodness.'),
																						_1: {
																							ctor: '::',
																							_0: _user$project$Elm_Page_Office_Format$pbVs('I have sinned, O Lord, I have sinned,'),
																							_1: {
																								ctor: '::',
																								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and I know my wickedness only too well.'),
																								_1: {
																									ctor: '::',
																									_0: _user$project$Elm_Page_Office_Format$pbVs('Therefore I make this prayer to you:'),
																									_1: {
																										ctor: '::',
																										_0: _user$project$Elm_Page_Office_Format$pbVs('Forgive me, Lord, forgive me.'),
																										_1: {
																											ctor: '::',
																											_0: _user$project$Elm_Page_Office_Format$pbVs('Do not let me perish in my sin,'),
																											_1: {
																												ctor: '::',
																												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('nor condemn me to the depths of the earth.'),
																												_1: {
																													ctor: '::',
																													_0: _user$project$Elm_Page_Office_Format$pbVs('For you, O Lord, are the God of those who repent,'),
																													_1: {
																														ctor: '::',
																														_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and in me you will show forth your goodness.'),
																														_1: {
																															ctor: '::',
																															_0: _user$project$Elm_Page_Office_Format$pbVs('Unworthy as I am, you will save me,'),
																															_1: {
																																ctor: '::',
																																_0: _user$project$Elm_Page_Office_Format$pbVsIndent('in accordance with your great mercy,'),
																																_1: {
																																	ctor: '::',
																																	_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and I will praise you without ceasing all the days of my life.'),
																																	_1: {
																																		ctor: '::',
																																		_0: _user$project$Elm_Page_Office_Format$pbVs('For all the powers of heaven sing your praises,'),
																																		_1: {
																																			ctor: '::',
																																			_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and yours is the glory to ages of ages. Amen.'),
																																			_1: {ctor: '[]'}
																																		}
																																	}
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$jubilate = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Jubilate', 'Be Joyful'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$rubricBlack('Psalm 100'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$emptyLine,
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVs('Be joyful in the Lord, all you lands;'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('serve the Lord with gladness'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and come before his presence with a song.'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVs('Know this: the Lord himself is God;'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVsIndent('he himself has made us, and we are his;'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVsIndent('we are his people and the sheep of his pasture.'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVs('Enter his gates with thanksgiving;'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('go into his courts with praise;'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVsIndent('give thanks to him and call upon his Name.'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVs('For the Lord is good;'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVsIndent('his mercy is everlasting;'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and his faithfulness endures from age to age.'),
																_1: {ctor: '[]'}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$invitatory = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$versicals(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'O Lord, open our lips;'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'People', _1: 'And our mouth shall proclaim your praise.'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'O God, make speed to save us;'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'People', _1: 'O Lord, make haste to help us.'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Glory to the Father, and to the Son, and to the Holy Spirit;'},
								_1: {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'People', _1: 'As it was in the beginning, is now, and ever shall be, world without end. Amen.'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Praise the Lord.'},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'People', _1: 'The Lord’s name be praised.'},
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}
				}
			}),
		_1: {ctor: '[]'}
	});
var _user$project$Elm_Page_Office_Prayers$graces = function (i) {
	var thisRef = function () {
		var _p0 = i;
		switch (_p0) {
			case 1:
				return '2 Corinthians 13:14';
			case 2:
				return 'Romans 15:13';
			default:
				return 'Ephesians 3:20-21';
		}
	}();
	var thisGrace = function () {
		var _p1 = i;
		switch (_p1) {
			case 1:
				return ' The grace of our Lord Jesus Christ, and the love of God, and the\n              fellowship of the Holy Spirit, be with us all evermore. Amen.';
			case 2:
				return ' May the God of hope fill us with all joy and peace in believing\n              through the power of the Holy Spirit. Amen. ';
			default:
				return ' Glory to God whose power, working in us, can do infinitely more\n              than we can ask or imagine: Glory to him from generation to\n              generation in the Church, and in Christ Jesus forever and ever. Amen. ';
		}
	}();
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$emptyLine,
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$rubric('The Officiant may invite the People to join in one of the Graces.'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$rubric('Officiant'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$justText(thisGrace),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$bibleRef(thisRef),
							_1: {ctor: '[]'}
						}
					}
				}
			}
		});
};
var _user$project$Elm_Page_Office_Prayers$gloria = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$pbVs('Glory be to the Father, and to the Son, and to the Holy Spirit;'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbVsIndent('as it was in the beginning, is now, and ever shall be,'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$pbVsIndent('world without end. Amen.'),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$gloriaInExcelsis = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Gloria in Excelsis', ''),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbVs('Glory to God in the highest,'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and peace to his people on earth.'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVs('Lord God, heavenly King,'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('almighty God and Father,'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('we worship you, we give you thanks,'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('we praise you for your glory.'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVs('Lord Jesus Christ, only Son of the Father,'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVs('Lord God, Lamb of God,'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVsIndent('you take away the sin of the world:'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('have mercy on us;'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVsIndent('you are seated at the right hand of the Father:'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVsIndent('receive our prayer.'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVs('For you alone are the Holy One,'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVsIndent('you alone are the Lord,'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Format$pbVsIndent('you alone are the Most High,'),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$pbVs('Jesus Christ,'),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$pbVsIndent('with the Holy Spirit,'),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$pbVsIndent('in the glory of God the Father. Amen.'),
																				_1: {ctor: '[]'}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$generalThanksgiving = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$emptyLine,
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbSection('The General Thanksgiving'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$rubric('Officiant and People'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVs('Almighty God, Father of all mercies,'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVs('we your unworthy servants give you humble thanks'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVs('for all your goodness and loving-kindness'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('to us and to all whom you have made.'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVs('We bless you for our creation, preservation,'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and all the blessings of this life;'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVs('but above all for your immeasurable love'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVs('in the redemption of the world by our Lord Jesus Christ;'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVs('for the means of grace, and for the hope of glory.'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVs('And, we pray, give us such an awareness of your mercies,'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVs('that with truly thankful hearts we may show forth your praise,'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVs('not only with our lips, but in our lives,'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Format$pbVs('by giving up our selves to your service,'),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$pbVs('and by walking before you'),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$pbVsIndent('in holiness and righteousness all our days;'),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$pbVs('through Jesus Christ our Lord,'),
																				_1: {
																					ctor: '::',
																					_0: _user$project$Elm_Page_Office_Format$pbVs('to whom, with you and the Holy Spirit,'),
																					_1: {
																						ctor: '::',
																						_0: _user$project$Elm_Page_Office_Format$pbVs('be honor and glory throughout all ages. Amen.'),
																						_1: {
																							ctor: '::',
																							_0: _user$project$Elm_Page_Office_Format$emptyLine,
																							_1: {ctor: '[]'}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$mpSaturday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$emptyLine,
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Sabbath Rest (Saturday)'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$withAmen('\n        Almighty God, who after the creation of the world rested from all your works and sanctified a day\n        of rest for all your creatures: Grant that we, putting away all earthly anxieties, may be duly prepared\n        for the service of your sanctuary, and that our rest here upon earth may be a preparation for the\n        eternal rest promised to your people in heaven; through Jesus Christ our Lord.\n      '),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$mpFriday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$emptyLine,
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Endurance (Friday)'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$withAmen('\n        Almighty God, whose most dear Son went not up to joy but first he suffered pain, and entered not\n        into glory before he was crucified: Mercifully grant that we, walking in the way of the cross, may find\n        it none other than the way of life and peace; through Jesus Christ your Son our Lord.\n      '),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$mpThursday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$emptyLine,
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Guidance (Thursday)'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$withAmen('\n        Heavenly Father, in you we live and move and have our being: We humbly pray you so to guide and\n        govern us by your Holy Spirit, that in all the cares and occupations of our life we may not forget\n        you, but may remember that we are ever walking in your sight; through Jesus Christ our Lord.\n      '),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$mpWednesday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$emptyLine,
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Grace (Wednesday)'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$withAmen('\n        O Lord, our heavenly Father, almighty and everlasting God, you have brought us safely to the\n        beginning of this day: Defend us by your mighty power, that we may not fall into sin nor run into\n        any danger; and that guided by your Spirit, we may do what is righteous in your sight; through Jesus\n        Christ our Lord.\n      '),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$mpTuesday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$emptyLine,
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Peace (Tuesday)'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$withAmen('\n        O God, the author of peace and lover of concord, to know you is eternal life and to serve you is\n        perfect freedom: Defend us, your humble servants, in all assaults of our enemies; that we, surely\n        trusting in your defense, may not fear the power of any adversaries, through the might of Jesus\n        Christ our Lord.\n      '),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$mpMonday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$emptyLine,
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for the Renewal of Life (Monday)'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$withAmen('\n        O God, the King eternal, whose light divides the day from the night and turns the shadow of death\n        into the morning: Drive far from us all wrong desires, incline our hearts to keep your law, and guide\n        our feet into the way of peace; that, having done your will with cheerfulness during the day, we may,\n        when night comes, rejoice to give you thanks; through Jesus Christ our Lord.\n      '),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$mpSunday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$emptyLine,
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Strength to Await Christ’s Return (Sunday)'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$withAmen('\n        O God, the King eternal, whose light divides the day from\n        the night and turns the shadow of death into the morning:\n        Drive far from us all wrong desires, incline our hearts to\n        keep your law, and guide our feet into the way of peace;\n        that, having done your will with cheerfulness during the day,\n        we may, when night comes, rejoice to give you thanks;\n        through Jesus Christ our Lord.\n      '),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$epWednesday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$emptyLine,
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Protection (Wednesday)'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$withAmen('\n      O God, the life of all who live, the light of the faithful, the strength\n      of those who labor, and the repose of the dead: We thank you for the\n      blessings of the day that is past, and humbly ask for your protection\n      through the coming night. Bring us in safety to the morning hours;\n      through him who died and rose again for us, your Son our Savior\n      Jesus Christ.\n      '),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$epThursday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$emptyLine,
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for the Presence of Christ (Thursday)'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$withAmen('\n      Lord Jesus, stay with us, for evening is at hand and the day is past; be\n      our companion in the way, kindle our hearts, and awaken hope, that\n      we may know you as you are revealed in Scripture and the breaking\n      of bread. Grant this for the sake of your love.\n      '),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$epTuesday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$emptyLine,
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Aid against Perils (Tuesday)'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$withAmen('\n      Lighten our darkness, we beseech you, O Lord; and by your great\n      mercy defend us from all perils and dangers of this night; for the love\n      of your only Son, our Savior Jesus Christ.\n      '),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$epSunday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$emptyLine,
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Resurrection Hope (Sunday)'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$withAmen('\n      Lord God, whose Son our Savior Jesus Christ triumphed over the\n      powers of death and prepared for us our place in the new Jerusalem:\n      Grant that we, who have this day given thanks for his resurrection,\n      may praise you in that City of which he is the light, and where he\n      lives and reigns forever and ever.\n      '),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$epSaturday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$emptyLine,
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for the Eve of Worship (Saturday)'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$withAmen('\n      O God, the source of eternal light: Shed forth your unending day\n      upon us who watch for you, that our lips may praise you, our lives\n      may bless you, and our worship on the morrow give you glory;\n      through Jesus Christ our Lord.\n      '),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$epMonday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$emptyLine,
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Peace (Monday)'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$withAmen('\n        O God, the source of all holy desires, all good counsels, and all just\n        works: Give to your servants that peace which the world cannot give,\n        that our hearts may be set to obey your commandments, and that we,\n        being defended from the fear of our enemies, may pass our time in\n        rest and quietness, through the merits of Jesus Christ our Savior.\n        '),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$epFriday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$emptyLine,
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Faith (Friday)'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$withAmen('\n        Lord Jesus Christ, by your death you took away the sting of death:\n        Grant to us your servants so to follow in faith where you have led the\n        way, that we may at length fall asleep peacefully in you and wake up\n        in your likeness; for your tender mercies’ sake.\n        '),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$collectOfDay = F2(
	function (date, mpep) {
		var _p2 = {
			ctor: '_Tuple2',
			_0: mpep,
			_1: _elm_lang$core$Date$dayOfWeek(date)
		};
		if (_p2._0.ctor === 'Mp') {
			switch (_p2._1.ctor) {
				case 'Sun':
					return _user$project$Elm_Page_Office_Prayers$mpSunday;
				case 'Mon':
					return _user$project$Elm_Page_Office_Prayers$mpMonday;
				case 'Tue':
					return _user$project$Elm_Page_Office_Prayers$mpTuesday;
				case 'Wed':
					return _user$project$Elm_Page_Office_Prayers$mpWednesday;
				case 'Thu':
					return _user$project$Elm_Page_Office_Prayers$mpThursday;
				case 'Fri':
					return _user$project$Elm_Page_Office_Prayers$mpFriday;
				default:
					return _user$project$Elm_Page_Office_Prayers$mpSaturday;
			}
		} else {
			switch (_p2._1.ctor) {
				case 'Sun':
					return _user$project$Elm_Page_Office_Prayers$epSunday;
				case 'Mon':
					return _user$project$Elm_Page_Office_Prayers$epMonday;
				case 'Tue':
					return _user$project$Elm_Page_Office_Prayers$epTuesday;
				case 'Wed':
					return _user$project$Elm_Page_Office_Prayers$epWednesday;
				case 'Thu':
					return _user$project$Elm_Page_Office_Prayers$epThursday;
				case 'Fri':
					return _user$project$Elm_Page_Office_Prayers$epFriday;
				default:
					return _user$project$Elm_Page_Office_Prayers$epSaturday;
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$epForMission = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$emptyLine,
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbSection('Collect for Mission'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$justText('\n          O God and Father of all, whom the whole heavens adore: Let the\n          whole earth also worship you, all nations obey you, all tongues\n          confess and bless you, and men, women and children everywhere\n          love you and serve you in peace; through Jesus Christ our Lord.\n          Amen.\n          '),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$justText('\n          Keep watch, dear Lord, with those who work, or watch, or weep this\n          night, and give your angels charge over those who sleep. Tend the\n          sick, Lord Christ; give rest to the weary, bless the dying, soothe the\n          suffering, pity the afflicted, shield the joyous; and all for your love’s\n          sake. Amen.\n          '),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$justText('\n          O God, you manifest in your servants the signs of your presence:\n          Send forth upon us the Spirit of love, that in companionship with\n          one another your abounding grace may increase among us; through\n          Jesus Christ our Lord. Amen.\n          '),
						_1: {ctor: '[]'}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$eoPrayer = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$versicals(
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: '&nbsp;', _1: 'Let us bless the Lord'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'People', _1: 'Thanks be to God'},
					_1: {ctor: '[]'}
				}
			}),
		_1: {ctor: '[]'}
	});
var _user$project$Elm_Page_Office_Prayers$ecceDeus = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$rubric('Suitable for use at any time'),
		_1: {
			ctor: '::',
			_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Ecce, Deus', 'Surely, it is God who saves me'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$rubricBlack('Isaiah 12:2-6'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVs('Surely, it is God who saves me;'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('I will trust in him and not be afraid.'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVs('For the Lord is my stronghold and my sure defense,'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and he will be my Savior.'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVs('Therefore you shall draw water with rejoicing'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVsIndent('from the springs of salvation.'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVs('And on that day you shall say,'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('Give thanks to the Lord and call upon his Name;'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVs('Make his deeds known among the peoples;'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVsIndent('see that they remember that his Name is exalted.'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVs('Sing the praises of the Lord, for he has done great things,'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and this is known in all the world.'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Format$pbVs('Cry aloud, inhabitants of Zion, ring out your joy,'),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$pbVsIndent('for the great one in the midst of you is the Holy One of Israel.'),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$pbVs('Glory to the Father, and to the Son, and to the Holy Spirit;'),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$pbVsIndent('as it was in the beginning, is now, and ever shall be,'),
																				_1: {
																					ctor: '::',
																					_0: _user$project$Elm_Page_Office_Format$pbVsIndent('world without end. Amen.'),
																					_1: {ctor: '[]'}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$dignusEs = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$rubric('Especially suitable for use after Ascension and in Easter season'),
		_1: {
			ctor: '::',
			_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Dignus es', 'A Song to the Lamb'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$pbVs('Revelation 4:11; 5:9-10, 13'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVs('Splendor and honor and kingly power'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('are yours by right, O Lord our God,'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVs('For you created everything that is,'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and by your will they were created and have their being;'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVs('And yours by right, O Lamb that was slain,'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVsIndent('for with your blood you have redeemed for God,'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVs('From every family, language, people and nation,'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('a kingdom of priests to serve our God.'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVs('And so, to him who sits upon the throne,'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and to Christ the Lamb,'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVs('Be worship and praise, dominion and splendor,'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVsIndent('for ever and for evermore.'),
																_1: {ctor: '[]'}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$deusMisereatur = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$rubric('Suitable for use at any time'),
		_1: {
			ctor: '::',
			_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Deus misereatur', 'May God be Merciful to us and Bless us'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$rubricBlack('Psalm 67'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVs('May God be merciful to us and bless us,'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('show us the light of his countenance and come to us.'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVs('Let your ways be known upon earth,'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('your saving health among all nations.'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVs('Let the peoples praise you, O God;'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVsIndent('let all the peoples praise you.'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVs('Let the nations be glad and sing for joy,'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('for you judge the peoples with equity and guide all the nations'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVsIndent('upon earth.'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVs('Let the peoples praise you, O God;'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVsIndent('let all the peoples praise you.'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVs('The earth has brought forth her increase;'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Format$pbVsIndent('may God, our own God, give us his blessing.'),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$pbVs('May God give us his blessing,'),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and may all the ends of the earth stand in awe of him.'),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$pbVs('Glory to the Father, and to the Son, and to the Holy Spirit;'),
																				_1: {
																					ctor: '::',
																					_0: _user$project$Elm_Page_Office_Format$pbVsIndent('as it was in the beginning, is now, and ever shall be,'),
																					_1: {
																						ctor: '::',
																						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('world without end. Amen.'),
																						_1: {ctor: '[]'}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$confession = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$pbSection('Confession of Sin'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$emptyLine,
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$rubric('The Officiant says to the People'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$justText('\n      Dearly beloved, the Scriptures teach us to acknowledge our many sins and offenses,\n      not concealing them from our heavenly Father, but confessing them with humble\n      and obedient hearts that we may obtain forgiveness by his infinite goodness\n      and mercy. We ought at all times humbly to acknowledge our sins before Almighty God,\n      but especially when we come together in his presence to give thanks for the great\n      benefits we have received at his hands, to declare his most worthy praise, to hear\n      his holy Word, and to ask, for ourselves and others, those things necessary for\n      our life and our salvation. Therefore, come with me to the throne of heavenly grace.\n      '),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$orThis,
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$justText('Let us humbly confess our sins to Almighty God.'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$rubric('Silence is kept. All kneeling the Officiant and People say'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVs('Almighty and most merciful Father,'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVs('we have erred and strayed from your ways like lost sheep.'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVs('we have followed too much the deceits and desires of our'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('own hearts.'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVs('we have offended against your holy laws.'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVs('we have left undone those things which we ought to have done'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVs('and we have done those things which we ought not to have done;'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVs('and apart from your grace, there is no health in us.'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Format$pbVs('O Lord, have mercy upon us.'),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$pbVs('Spare those who confess their faults.'),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$pbVs('Restore those who are penitent, according to your promises declared'),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$pbVsIndent('to all people in Christ Jesus our Lord;'),
																				_1: {
																					ctor: '::',
																					_0: _user$project$Elm_Page_Office_Format$pbVs('And grant, O most merciful Father, for his sake,'),
																					_1: {
																						ctor: '::',
																						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('that we may now live a godly, righteous, and sober life,'),
																						_1: {
																							ctor: '::',
																							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('to the glory of your holy Name. Amen.'),
																							_1: {
																								ctor: '::',
																								_0: _user$project$Elm_Page_Office_Format$emptyLine,
																								_1: {
																									ctor: '::',
																									_0: _user$project$Elm_Page_Office_Format$rubric('The Priest alone stands and says'),
																									_1: {
																										ctor: '::',
																										_0: _user$project$Elm_Page_Office_Format$justText('\n      Almighty God, the Father of our Lord Jesus Christ,desires not the death of sinners,\n      but that they may turn from their wickedness and live. He has empowered and\n      commanded his ministers to pronounce to his people, being penitent, the absolution\n      and remission of their sins. He pardons all who truly repent and genuinely believe\n      his holy Gospel. For this reason, we beseech him to grant us true repentance and his\n      Holy Spirit, that our present deeds may please him, the rest of our lives may be pure\n      and holy, and that at the last we may come to his eternal joy; through Jesus Christ our Lord. Amen.\n      '),
																										_1: {
																											ctor: '::',
																											_0: _user$project$Elm_Page_Office_Format$rubric('or this'),
																											_1: {
																												ctor: '::',
																												_0: _user$project$Elm_Page_Office_Format$justText('\n      The Almighty and merciful Lord grant you absolution and remission of all your sins,\n      true repentance, amendment of life, and the grace and consolation of his Holy Spirit. Amen.\n      '),
																												_1: {
																													ctor: '::',
																													_0: _user$project$Elm_Page_Office_Format$rubric('A deacon or layperson remains kneeling and prays'),
																													_1: {
																														ctor: '::',
																														_0: _user$project$Elm_Page_Office_Format$justText('\n      Grant your faithful people, merciful Lord, pardon and peace;\n      that we may be cleansed from all our sins, and serve you with a\n      quiet mind; through Jesus Christ our Lord. Amen.\n      '),
																														_1: {
																															ctor: '::',
																															_0: _user$project$Elm_Page_Office_Format$emptyLine,
																															_1: {ctor: '[]'}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$compAltReadings = A2(
	_elm_lang$html$Html$div,
	{
		ctor: '::',
		_0: _elm_lang$html$Html_Attributes$class('alt_readings'),
		_1: {ctor: '[]'}
	},
	{
		ctor: '::',
		_0: A2(
			_elm_lang$html$Html$button,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('alt_readings-button button'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text('Alternate Readings'),
				_1: {ctor: '[]'}
			}),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$altReadings(
				{
					ctor: '::',
					_0: 'Isaiah 26:3-4',
					_1: {
						ctor: '::',
						_0: 'Isaiah 30:15a',
						_1: {
							ctor: '::',
							_0: 'Matthew 6:31-34',
							_1: {
								ctor: '::',
								_0: '2 Corinthians 4:6',
								_1: {
									ctor: '::',
									_0: '1 Thessalonians 5:9-10',
									_1: {
										ctor: '::',
										_0: '1 Thessalonians 5:23',
										_1: {
											ctor: '::',
											_0: 'Ephesians 4:26-27',
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}
				}),
			_1: {
				ctor: '::',
				_0: A2(_user$project$Elm_Page_Office_Format$altReadingText, 'Isaiah 26:3-4', '\n      You keep him in perfect peace\n        whose mind is stayed on you,\n        because he trusts in you.\n      Trust in the Lord forever,\n        for the Lord God is an everlasting rock.\n      '),
				_1: {
					ctor: '::',
					_0: A2(_user$project$Elm_Page_Office_Format$altReadingText, 'Isaiah 30:15a', '\n        For thus said the Lord God, the Holy One of Israel,\n        “In returning and rest you shall be saved;\n            in quietness and in trust shall be your strength.”\n      '),
					_1: {
						ctor: '::',
						_0: A2(_user$project$Elm_Page_Office_Format$altReadingText, 'Matthew 6:31-34', '\n        Therefore do not be anxious, saying, ‘What shall we eat?’ or ‘What shall we drink?’\n        or ‘What shall we wear?’ For the Gentiles seek after all these things, and your\n        heavenly Father knows that you need them all. But seek first the kingdom of God\n        and his righteousness, and all these things will be added to you.\n        “Therefore do not be anxious about tomorrow, for tomorrow will be anxious for itself.\n        Sufficient for the day is its own trouble.\n        '),
						_1: {
							ctor: '::',
							_0: A2(_user$project$Elm_Page_Office_Format$altReadingText, '2 Corinthians 4:6', '\n        For God, who said, “Let light shine out of darkness,” has shone in our hearts to\n        give the light of the knowledge of the glory of God in the face of Jesus Christ.\n        '),
							_1: {
								ctor: '::',
								_0: A2(_user$project$Elm_Page_Office_Format$altReadingText, '1 Thessalonians 5:9-10', '\n        For God has not destined us for wrath, but to obtain salvation through our Lord\n        Jesus Christ, who died for us so that whether we are awake or asleep we might live with him.\n        '),
								_1: {
									ctor: '::',
									_0: A2(_user$project$Elm_Page_Office_Format$altReadingText, '1 Thessalonians 5:23', '\n        Now may the God of peace himself sanctify you completely, and may your whole spirit\n        and soul and body be kept blameless at the coming of our Lord Jesus Christ.\n        '),
									_1: {
										ctor: '::',
										_0: A2(_user$project$Elm_Page_Office_Format$altReadingText, 'Ephesians 4:26-27', '\n        Be angry and do not sin; do not let the sun go down on your anger,\n        and give no opportunity to the devil.\n        '),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$chrysostom = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$emptyLine,
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$pbSection('A Prayer of St. John Chrysostom'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$justText('\n      Almighty God, you have given us grace at this time with one accord\n      to make our common supplications to you; and you have promised\n      through your well beloved Son that when two or three are gathered\n      together in his name you will be in the midst of them: Fulfill now, O\n      Lord, our desires and petitions as may be best for us; granting us in\n      this world knowledge of your truth, and in the age to come life\n      everlasting. Amen.\n      '),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$cantemusDomino = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$rubric('Especially suitable for use in Easter'),
		_1: {
			ctor: '::',
			_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Cantemus Domino', 'The Song of Moses'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$rubricBlack('Exodus 15:1-6, 11-13, 17-18'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVs('I will sing to the Lord, for he is lofty and uplifted;'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('the horse and its rider has he hurled into the sea.'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVs('The Lord is my strength and my refuge;'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('the Lord has become my Savior.'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVs('This is my God and I will praise him,'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVsIndent('the God of my people and I will exalt him.'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVs('The Lord is a mighty warrior;'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVs('Yahweh is his Name.'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVs('The chariots of Pharaoh and his army has he hurled into the sea;'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVsIndent('the finest of those who bear armor have been drowned in the'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVs('Red Sea.'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVs('The fathomless deep has overwhelmed them;'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Format$pbVsIndent('they sank into the depths like a stone.'),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$pbVs('Your right hand, O Lord, is glorious in might;'),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$pbVsIndent('your right hand, O Lord, has overthrown the enemy.'),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$pbVs('Who can be compared with you, O Lord, among the gods?'),
																				_1: {
																					ctor: '::',
																					_0: _user$project$Elm_Page_Office_Format$pbVsIndent('who is like you, glorious in holiness,'),
																					_1: {
																						ctor: '::',
																						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('awesome in renown, and worker of wonders?'),
																						_1: {
																							ctor: '::',
																							_0: _user$project$Elm_Page_Office_Format$pbVs('You stretched forth your right hand;'),
																							_1: {
																								ctor: '::',
																								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('the earth swallowed them up.'),
																								_1: {
																									ctor: '::',
																									_0: _user$project$Elm_Page_Office_Format$pbVs('With your constant love you led the people you redeemed;'),
																									_1: {
																										ctor: '::',
																										_0: _user$project$Elm_Page_Office_Format$pbVsIndent('you brought them in safety to your holy dwelling.'),
																										_1: {
																											ctor: '::',
																											_0: _user$project$Elm_Page_Office_Format$pbVs('You will bring them in and plant them'),
																											_1: {
																												ctor: '::',
																												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('on the mount of your possession,'),
																												_1: {
																													ctor: '::',
																													_0: _user$project$Elm_Page_Office_Format$pbVs('The resting-place you have made for yourself, O Lord,'),
																													_1: {
																														ctor: '::',
																														_0: _user$project$Elm_Page_Office_Format$pbVsIndent('the sanctuary, O Lord, that your hand has established.'),
																														_1: {
																															ctor: '::',
																															_0: _user$project$Elm_Page_Office_Format$pbVs('The Lord shall reign for ever and for ever.'),
																															_1: {
																																ctor: '::',
																																_0: _user$project$Elm_Page_Office_Format$pbVs('Glory to the Father, and to the Son, and to the Holy Spirit;'),
																																_1: {
																																	ctor: '::',
																																	_0: _user$project$Elm_Page_Office_Format$pbVsIndent('as it was in the beginning, is now, and ever shall be,'),
																																	_1: {
																																		ctor: '::',
																																		_0: _user$project$Elm_Page_Office_Format$pbVsIndent('world without end. Amen.'),
																																		_1: {ctor: '[]'}
																																	}
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$cantateDomino = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$rubric('Especially suitable for use in Easter and at any time outside penitential seasons'),
		_1: {
			ctor: '::',
			_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Cantate Domino', 'Sing to the Lord a New Song'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$rubricBlack('Psalm 98'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVs('Sing to the Lord a new song,'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('for he has done marvelous things.'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVs('With his right hand and his holy arm'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('has he won for himself the victory.'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVs('The Lord has made known his victory;'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVsIndent('his righteousness has he openly shown in the sight of the nations.'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVs('He remembers his mercy and faithfulness to the house of Israel,'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and all the ends of the earth have seen the victory of our God.'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVs('Shout with joy to the Lord, all you lands; lift up your voice, rejoice,'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and sing.'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVs('Sing to the Lord with the harp,'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVsIndent('with the harp and the voice of song.'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Format$pbVs('With trumpets and the sound of the horn'),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$pbVsIndent('shout with joy before the King, the Lord.'),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$pbVs('Let the sea make a noise and all that is in it,'),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$pbVsIndent('the lands and those who dwell therein.'),
																				_1: {
																					ctor: '::',
																					_0: _user$project$Elm_Page_Office_Format$pbVs('Let the rivers clap their hands,'),
																					_1: {
																						ctor: '::',
																						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and let the hills ring out with joy before the Lord,'),
																						_1: {
																							ctor: '::',
																							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('when he comes to judge the earth.'),
																							_1: {
																								ctor: '::',
																								_0: _user$project$Elm_Page_Office_Format$pbVs('In righteousness shall he judge the world'),
																								_1: {
																									ctor: '::',
																									_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and the peoples with equity.'),
																									_1: {
																										ctor: '::',
																										_0: _user$project$Elm_Page_Office_Format$pbVs('Glory to the Father, and tocantate Son, and to the Holy Spirit;'),
																										_1: {
																											ctor: '::',
																											_0: _user$project$Elm_Page_Office_Format$pbVsIndent('as it was in the beginning, is now, and ever shall be,'),
																											_1: {
																												ctor: '::',
																												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('world without end. Amen.'),
																												_1: {ctor: '[]'}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$benedictus = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Benedictus', 'The Song of Zechariah'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$rubricBlack('Luke 1:68-79'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$pbVs('Blessed be the Lord, the God of Israel;'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVsIndent('he has come to his people and set them free.'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVs('He has raised up for us a mighty savior,'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('born of the house of his servant David.'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVs('Through his holy prophets he promised of old,'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVs('that he would save us from our enemies,'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVsIndent('from the hands of all who hate us.'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVs('He promised to show mercy to our fathers'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and to remember his holy covenant.'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVs('This was the oath he swore to our father Abraham,'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVsIndent('to set us free from the hands of our enemies,'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVs('Free to worship him without fear,'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVsIndent('holy and righteous in his sight'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Format$pbVsIndent('all the days of our life.'),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$pbVs('You, my child, shall be called the prophet of the Most High,'),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$pbVsIndent('for you will go before the Lord to prepare his way,'),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$pbVs('To give his people knowledge of salvation'),
																				_1: {
																					ctor: '::',
																					_0: _user$project$Elm_Page_Office_Format$pbVsIndent('by the forgiveness of their sins.'),
																					_1: {
																						ctor: '::',
																						_0: _user$project$Elm_Page_Office_Format$pbVs('In the tender compassion of our God'),
																						_1: {
																							ctor: '::',
																							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('the dawn from on high shall break upon us,'),
																							_1: {
																								ctor: '::',
																								_0: _user$project$Elm_Page_Office_Format$pbVs('To shine on those who dwell in darkness and the shadow of death,'),
																								_1: {
																									ctor: '::',
																									_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and to guide our feet into the way of peace.'),
																									_1: {
																										ctor: '::',
																										_0: _user$project$Elm_Page_Office_Format$pbVs('Glory to the Father, and to the Son, and to the Holy Spirit;'),
																										_1: {
																											ctor: '::',
																											_0: _user$project$Elm_Page_Office_Format$pbVsIndent('as it was in the beginning, is now, and ever shall be,'),
																											_1: {
																												ctor: '::',
																												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('world without end. Amen.'),
																												_1: {
																													ctor: '::',
																													_0: _user$project$Elm_Page_Office_Format$emptyLine,
																													_1: {ctor: '[]'}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$benedictisEsDomine = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Benedictus es, Domine', 'A Song of Praise'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$rubricBlack('Song of the Three Young Men, 29-34<'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$pbVs('Glory to you, Lord God of our fathers;'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVsIndent('you are worthy of praise; glory to you.'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVs('Glory to you for the radiance of your holy Name;'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('we will praise you and highly exalt you for ever.'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVs('Glory to you in the splendor of your temple;'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVsIndent('on the throne of your majesty, glory to you.'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVs('Glory to you, seated between the Cherubim;'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVsIndent('we will praise you and highly exalt you for ever.'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVs('Glory to you, beholding the depths;'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVsIndent('in the high vault of heaven, glory to you.'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVs('Glory to the Father, and to the Son, and to the Holy Spirit;'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVsIndent('we will praise you and highly exalt you for ever.'),
															_1: {ctor: '[]'}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$benediciteOmniaOperaDomini = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$rubric('Especially suitable for use on Saturday'),
		_1: {
			ctor: '::',
			_0: A2(_user$project$Elm_Page_Office_Format$canticle, 'Benedicite, omnia opera Domini', 'A Song of Creation'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$rubricBlack('Song of the Three Young Men, 35-65'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$centerItalic('Invocation'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVs('Glorify the Lord, all you works of the Lord,'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('praise him and highly exalt him for ever.'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVs('In the firmament of his power, glorify the Lord,'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVsIndent('praise him and highly exalt him for ever.'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$centerItalic('I The Cosmic Order'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVs('Glorify the Lord, you angels and all powers of the Lord,'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('O heavens and all waters above the heavens.'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVs('Sun and moon and stars of the sky, glorify the Lord,'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVsIndent('praise him and highly exalt him for ever.'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVs('Glorify the Lord, every shower of rain and fall of dew,'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVsIndent('all winds and fire and heat,'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Format$pbVs('Winter and summer, glorify the Lord,'),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$pbVsIndent('praise him and highly exalt him for ever.'),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$pbVs('Glorify the Lord, O chill and cold,'),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$pbVsIndent('drops of dew and flakes of snow.'),
																				_1: {
																					ctor: '::',
																					_0: _user$project$Elm_Page_Office_Format$pbVs('Frost and cold, ice and sleet, glorify the Lord,'),
																					_1: {
																						ctor: '::',
																						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('praise him and highly exalt him for ever.'),
																						_1: {
																							ctor: '::',
																							_0: _user$project$Elm_Page_Office_Format$pbVs('Glorify the Lord, of nights and days,'),
																							_1: {
																								ctor: '::',
																								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('O shining light and enfolding dark.'),
																								_1: {
																									ctor: '::',
																									_0: _user$project$Elm_Page_Office_Format$pbVs('Storm clouds and thunderbolts, glorify the Lord,'),
																									_1: {
																										ctor: '::',
																										_0: _user$project$Elm_Page_Office_Format$pbVsIndent('praise him and highly exalt him for ever.'),
																										_1: {
																											ctor: '::',
																											_0: _user$project$Elm_Page_Office_Format$centerItalic('II The Earth and its Creatures'),
																											_1: {
																												ctor: '::',
																												_0: _user$project$Elm_Page_Office_Format$pbVs('Let the earth glorify the Lord,'),
																												_1: {
																													ctor: '::',
																													_0: _user$project$Elm_Page_Office_Format$pbVsIndent('praise him and highly exalt him forever.'),
																													_1: {
																														ctor: '::',
																														_0: _user$project$Elm_Page_Office_Format$pbVs('Glorify the Lord, O mountains and hills,'),
																														_1: {
																															ctor: '::',
																															_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and all that grows upon the earth,'),
																															_1: {
																																ctor: '::',
																																_0: _user$project$Elm_Page_Office_Format$pbVsIndent('praise him and highly exalt him forever.'),
																																_1: {
																																	ctor: '::',
																																	_0: _user$project$Elm_Page_Office_Format$pbVs('Glorify the Lord, O springs of water, seas, and streams,'),
																																	_1: {
																																		ctor: '::',
																																		_0: _user$project$Elm_Page_Office_Format$pbVsIndent('O whales and all that move in the waters.'),
																																		_1: {
																																			ctor: '::',
																																			_0: _user$project$Elm_Page_Office_Format$pbVs('All birds of the air, glorify the Lord,'),
																																			_1: {
																																				ctor: '::',
																																				_0: _user$project$Elm_Page_Office_Format$pbVsIndent('praise him and highly exalt him forever.'),
																																				_1: {
																																					ctor: '::',
																																					_0: _user$project$Elm_Page_Office_Format$pbVs('Glorify the Lord, O beasts of the wild,'),
																																					_1: {
																																						ctor: '::',
																																						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and all you flocks and herds.'),
																																						_1: {
																																							ctor: '::',
																																							_0: _user$project$Elm_Page_Office_Format$pbVs('O men and women everywhere, glorify the Lord,'),
																																							_1: {
																																								ctor: '::',
																																								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('praise him and highly exalt him forever.'),
																																								_1: {
																																									ctor: '::',
																																									_0: _user$project$Elm_Page_Office_Format$centerItalic('III The People of God'),
																																									_1: {
																																										ctor: '::',
																																										_0: _user$project$Elm_Page_Office_Format$pbVs('Let the people of God glorify the Lord,'),
																																										_1: {
																																											ctor: '::',
																																											_0: _user$project$Elm_Page_Office_Format$pbVsIndent('praise him and highly exalt him forever.'),
																																											_1: {
																																												ctor: '::',
																																												_0: _user$project$Elm_Page_Office_Format$pbVs('Glorify the Lord, O priests and servants of the Lord,'),
																																												_1: {
																																													ctor: '::',
																																													_0: _user$project$Elm_Page_Office_Format$pbVsIndent('praise him and highly exalt him forever.'),
																																													_1: {
																																														ctor: '::',
																																														_0: _user$project$Elm_Page_Office_Format$pbVs('Glorify the Lord, O spirits and souls of the righteous,'),
																																														_1: {
																																															ctor: '::',
																																															_0: _user$project$Elm_Page_Office_Format$pbVsIndent('praise him and highly exalt him forever.'),
																																															_1: {
																																																ctor: '::',
																																																_0: _user$project$Elm_Page_Office_Format$pbVs('You that are holy and humble of heart, glorify the Lord,'),
																																																_1: {
																																																	ctor: '::',
																																																	_0: _user$project$Elm_Page_Office_Format$pbVsIndent('praise him and highly exalt him forever.'),
																																																	_1: {
																																																		ctor: '::',
																																																		_0: _user$project$Elm_Page_Office_Format$centerItalic('Doxology'),
																																																		_1: {
																																																			ctor: '::',
																																																			_0: _user$project$Elm_Page_Office_Format$pbVs('Let us glorify the Lord: the Father, the Son and the Holy Spirit;'),
																																																			_1: {
																																																				ctor: '::',
																																																				_0: _user$project$Elm_Page_Office_Format$pbVsIndent('praise him and highly exalt him forever.'),
																																																				_1: {
																																																					ctor: '::',
																																																					_0: _user$project$Elm_Page_Office_Format$pbVs('In the firmament of his power, glorify the Lord,'),
																																																					_1: {
																																																						ctor: '::',
																																																						_0: _user$project$Elm_Page_Office_Format$pbVsIndent('praise him and highly exalt him forever.'),
																																																						_1: {ctor: '[]'}
																																																					}
																																																				}
																																																			}
																																																		}
																																																	}
																																																}
																																															}
																																														}
																																													}
																																												}
																																											}
																																										}
																																									}
																																								}
																																							}
																																						}
																																					}
																																				}
																																			}
																																		}
																																	}
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$apostlesCreed = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$pbSection('The Apostles’ Creed'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$rubric('Officiant and People together, all standing'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$pbVs('I believe in God, the Father almighty,'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$pbVsIndent('creator of heaven and earth.'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$pbVs('I believe in Jesus Christ, his only Son, our Lord.'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$pbVsIndent('He was conceived by the Holy Spirit'),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and born of the Virgin Mary.'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$pbVsIndent('He suffered under Pontius Pilate,'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$pbVsIndent('was crucified, died, and was buried.'),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$pbVsIndent('He descended to the dead.'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('On the third day he rose again.'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$pbVsIndent('He ascended into heaven,'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and is seated at the right hand of the Father.'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$pbVsIndent('He will come again to judge the living and the dead.'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$pbVs('I believe in the Holy Spirit,'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Format$pbVsIndent('the holy catholic Church,'),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$pbVsIndent('the communion of saints,'),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$pbVsIndent('the forgiveness of sins,'),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$pbVsIndent('the resurrection of the body,'),
																				_1: {
																					ctor: '::',
																					_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and the life everlasting. Amen.'),
																					_1: {ctor: '[]'}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$agnusDei = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$agnus_dei('Lamb of God, you take away the sin of the world,'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$agnus_dei_resp('have mercy on us'),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$agnus_dei('Lamb of God, you take away the sin of the world,'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$agnus_dei_resp('have mercy on us'),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$agnus_dei('Lamb of God, you take away the sin of the world,'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$agnus_dei_resp('grant us your peace'),
							_1: {ctor: '[]'}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Page_Office_Prayers$Ep = {ctor: 'Ep'};
var _user$project$Elm_Page_Office_Prayers$Mp = {ctor: 'Mp'};

var _user$project$Elm_Views_Psalm$versify = function (vs) {
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$ul,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('psalm'),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$li,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('ps_num'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$sup,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text(vs.vs),
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$li,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('ps_first'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(vs.first),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$li,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('star'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text('*'),
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						}
					}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$ul,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('psalm'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$li,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('ps_second'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(vs.second),
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Elm_Views_Psalm$formattedPsalm = function (ps) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('esv_text'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$id(ps.id),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$h3,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(ps.name),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$span,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('ps_title'),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text(ps.title),
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{ctor: '[]'},
							A2(_elm_lang$core$List$map, _user$project$Elm_Views_Psalm$versify, ps.vss)),
						_1: {ctor: '[]'}
					}
				}),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Views_Psalm$formattedPsalms = function (pss) {
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		A2(_elm_lang$core$List$map, _user$project$Elm_Views_Psalm$formattedPsalm, pss));
};

var _user$project$Elm_Page_CommunionToSick$update = F2(
	function (msg, model) {
		var _p0 = msg;
		switch (_p0.ctor) {
			case 'NoOp':
				return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
			case 'ChangePsalm':
				return {
					ctor: '_Tuple2',
					_0: model,
					_1: _user$project$Elm_Ports$requestPsalms(
						{
							ctor: '::',
							_0: _p0._0,
							_1: {ctor: '[]'}
						})
				};
			case 'SetPsalms':
				if (_p0._0.ctor === 'Just') {
					var newModel = _elm_lang$core$Native_Utils.update(
						model,
						{psalms: _p0._0._0});
					return {ctor: '_Tuple2', _0: newModel, _1: _elm_lang$core$Platform_Cmd$none};
				} else {
					return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
				}
			default:
				var newOption = _elm_lang$core$String$isEmpty(model.thisOption) ? 'Mobile Options go here' : '';
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{thisOption: newOption}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
		}
	});
var _user$project$Elm_Page_CommunionToSick$psalmsChange = _user$project$Elm_Ports$requestedPsalms(
	function (_p1) {
		return _elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$Elm_Data_Psalm$decoder, _p1));
	});
var _user$project$Elm_Page_CommunionToSick$initModel = {
	psalms: {ctor: '[]'},
	thisOption: ''
};
var _user$project$Elm_Page_CommunionToSick$init = {ctor: '_Tuple2', _0: _user$project$Elm_Page_CommunionToSick$initModel, _1: _elm_lang$core$Platform_Cmd$none};
var _user$project$Elm_Page_CommunionToSick$Model = F2(
	function (a, b) {
		return {psalms: a, thisOption: b};
	});
var _user$project$Elm_Page_CommunionToSick$SetPsalms = function (a) {
	return {ctor: 'SetPsalms', _0: a};
};
var _user$project$Elm_Page_CommunionToSick$subscriptions = function (model) {
	return _elm_lang$core$Platform_Sub$batch(
		{
			ctor: '::',
			_0: A2(_elm_lang$core$Platform_Sub$map, _user$project$Elm_Page_CommunionToSick$SetPsalms, _user$project$Elm_Page_CommunionToSick$psalmsChange),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_CommunionToSick$MoreOptions = {ctor: 'MoreOptions'};
var _user$project$Elm_Page_CommunionToSick$ChangePsalm = function (a) {
	return {ctor: 'ChangePsalm', _0: a};
};
var _user$project$Elm_Page_CommunionToSick$view = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$button,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('more-options'),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Events$onClick(_user$project$Elm_Page_CommunionToSick$MoreOptions),
						_1: {ctor: '[]'}
					}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('Options'),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$emptyLine,
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('mpep'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$p,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('midday'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text('Communion of the Sick'),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$p,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text(model.thisOption),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$rubric('The Minister begins'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$justText('Grace to you and peace from God our Father and the Lord Jesus Christ. '),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$reference('Philippians 1:2'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$rubric('The Minister continues'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$withAmen('\n          Almighty God, to you all hearts are open, all desires known, and from you\n          no secrets are hid: Cleanse the thoughts of our hearts by the inspiration\n          of your Holy Spirit, that we may perfectly love you, and worthily magnify\n          your holy Name; through Christ our Lord.\n          '),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$rubric('A Psalm may be prayed. Psalms'),
														_1: {
															ctor: '::',
															_0: A2(
																_elm_lang$html$Html$p,
																{ctor: '[]'},
																{
																	ctor: '::',
																	_0: A2(
																		_elm_lang$html$Html$button,
																		{
																			ctor: '::',
																			_0: _elm_lang$html$Html_Attributes$class('more-options'),
																			_1: {
																				ctor: '::',
																				_0: _elm_lang$html$Html_Events$onClick(
																					_user$project$Elm_Page_CommunionToSick$ChangePsalm(
																						{ctor: '_Tuple3', _0: 23, _1: 1, _2: 999})),
																				_1: {ctor: '[]'}
																			}
																		},
																		{
																			ctor: '::',
																			_0: _elm_lang$html$Html$text('23'),
																			_1: {ctor: '[]'}
																		}),
																	_1: {
																		ctor: '::',
																		_0: A2(
																			_elm_lang$html$Html$button,
																			{
																				ctor: '::',
																				_0: _elm_lang$html$Html_Attributes$class('more-options'),
																				_1: {
																					ctor: '::',
																					_0: _elm_lang$html$Html_Events$onClick(
																						_user$project$Elm_Page_CommunionToSick$ChangePsalm(
																							{ctor: '_Tuple3', _0: 62, _1: 1, _2: 999})),
																					_1: {ctor: '[]'}
																				}
																			},
																			{
																				ctor: '::',
																				_0: _elm_lang$html$Html$text('62'),
																				_1: {ctor: '[]'}
																			}),
																		_1: {
																			ctor: '::',
																			_0: A2(
																				_elm_lang$html$Html$button,
																				{
																					ctor: '::',
																					_0: _elm_lang$html$Html_Attributes$class('more-options'),
																					_1: {
																						ctor: '::',
																						_0: _elm_lang$html$Html_Events$onClick(
																							_user$project$Elm_Page_CommunionToSick$ChangePsalm(
																								{ctor: '_Tuple3', _0: 10, _1: 1, _2: 999})),
																						_1: {ctor: '[]'}
																					}
																				},
																				{
																					ctor: '::',
																					_0: _elm_lang$html$Html$text('103'),
																					_1: {ctor: '[]'}
																				}),
																			_1: {
																				ctor: '::',
																				_0: _elm_lang$html$Html$text('and'),
																				_1: {
																					ctor: '::',
																					_0: A2(
																						_elm_lang$html$Html$button,
																						{
																							ctor: '::',
																							_0: _elm_lang$html$Html_Attributes$class('more-options'),
																							_1: {
																								ctor: '::',
																								_0: _elm_lang$html$Html_Events$onClick(
																									_user$project$Elm_Page_CommunionToSick$ChangePsalm(
																										{ctor: '_Tuple3', _0: 145, _1: 1, _2: 999})),
																								_1: {ctor: '[]'}
																							}
																						},
																						{
																							ctor: '::',
																							_0: _elm_lang$html$Html$text('145'),
																							_1: {ctor: '[]'}
																						}),
																					_1: {
																						ctor: '::',
																						_0: _elm_lang$html$Html$text('are particularly appropriate. '),
																						_1: {ctor: '[]'}
																					}
																				}
																			}
																		}
																	}
																}),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Views_Psalm$formattedPsalms(model.psalms),
																_1: {
																	ctor: '::',
																	_0: A2(
																		_elm_lang$html$Html$div,
																		{
																			ctor: '::',
																			_0: _elm_lang$html$Html_Attributes$id('sick-communion-psalm'),
																			_1: {ctor: '[]'}
																		},
																		{
																			ctor: '::',
																			_0: _user$project$Elm_Views_Psalm$formattedPsalms(model.psalms),
																			_1: {ctor: '[]'}
																		}),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$rubric('\n            One of the following Gospel lessons is read, or the readings appropriate to the day\n            '),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$justText('\n            For God so loved the world, that he gave his only Son, that whoever believes in\n            him should not perish but have eternal life.\n            '),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$reference('John 3:16'),
																				_1: {
																					ctor: '::',
																					_0: _user$project$Elm_Page_Office_Format$emptyLine,
																					_1: {
																						ctor: '::',
																						_0: _user$project$Elm_Page_Office_Format$justText('\n            Jesus said, “I am the living bread that came down from heaven. If anyone\n            eats of this bread, he will live forever. And the bread that I will give\n            for the life of the world is my flesh.” For my flesh is true food, and my\n            blood is true drink. Whoever feeds on my flesh and drinks my blood abides\n            in me, and I in him.\n            '),
																						_1: {
																							ctor: '::',
																							_0: _user$project$Elm_Page_Office_Format$reference('John 6:51, 55-56'),
																							_1: {
																								ctor: '::',
																								_0: _user$project$Elm_Page_Office_Format$rubric('Reflection on the lessons may follow.'),
																								_1: {
																									ctor: '::',
																									_0: _user$project$Elm_Page_Office_Format$rubric('The minister may say the confession and the sick person joins in as able.'),
																									_1: {
																										ctor: '::',
																										_0: _user$project$Elm_Page_Office_Format$pbVs('Most merciful God,'),
																										_1: {
																											ctor: '::',
																											_0: _user$project$Elm_Page_Office_Format$pbVs('we confess that we have sinned against you'),
																											_1: {
																												ctor: '::',
																												_0: _user$project$Elm_Page_Office_Format$pbVs('in thought, word and deed,'),
																												_1: {
																													ctor: '::',
																													_0: _user$project$Elm_Page_Office_Format$pbVs('by what we have done, and by what we have left undone.'),
																													_1: {
																														ctor: '::',
																														_0: _user$project$Elm_Page_Office_Format$pbVs('We have not loved you with our whole heart;'),
																														_1: {
																															ctor: '::',
																															_0: _user$project$Elm_Page_Office_Format$pbVs('we have not loved our neighbors as ourselves.'),
																															_1: {
																																ctor: '::',
																																_0: _user$project$Elm_Page_Office_Format$pbVs('We are truly sorry and we humbly repent.'),
																																_1: {
																																	ctor: '::',
																																	_0: _user$project$Elm_Page_Office_Format$pbVs('For the sake of your Son Jesus Christ,'),
																																	_1: {
																																		ctor: '::',
																																		_0: _user$project$Elm_Page_Office_Format$pbVs('have mercy on us and forgive us;'),
																																		_1: {
																																			ctor: '::',
																																			_0: _user$project$Elm_Page_Office_Format$pbVs('that we may delight in your will, and walk in your ways,'),
																																			_1: {
																																				ctor: '::',
																																				_0: _user$project$Elm_Page_Office_Format$pbVs('to the glory of your Name. Amen.'),
																																				_1: {
																																					ctor: '::',
																																					_0: _user$project$Elm_Page_Office_Format$rubric('A Priest, if present, says'),
																																					_1: {
																																						ctor: '::',
																																						_0: _user$project$Elm_Page_Office_Format$withAmen('\n            Almighty God, our heavenly Father, who in his great mercy has promised forgiveness\n            of sins to all those who sincerely repent and with true faith turn to him, have\n            mercy upon you, pardon and deliver you from all your sins, confirm and strengthen\n            you in all goodness, and bring you to everlasting life;\n            through Jesus Christ our Lord.\n            '),
																																						_1: {
																																							ctor: '::',
																																							_0: _user$project$Elm_Page_Office_Format$rubric('A Deacon or lay person prays'),
																																							_1: {
																																								ctor: '::',
																																								_0: _user$project$Elm_Page_Office_Format$withAmen('\n            Grant your faithful people, merciful Lord, pardon and peace; that we may\n            be cleansed from all our sins, and serve you with a quiet mind; through\n            Jesus Christ our Lord.\n            '),
																																								_1: {
																																									ctor: '::',
																																									_0: _user$project$Elm_Page_Office_Format$emptyLine,
																																									_1: {
																																										ctor: '::',
																																										_0: _user$project$Elm_Page_Office_Format$versicals(
																																											{
																																												ctor: '::',
																																												_0: {ctor: '_Tuple2', _0: 'Minister', _1: 'The peace of the Lord be always with you.'},
																																												_1: {
																																													ctor: '::',
																																													_0: {ctor: '_Tuple2', _0: 'People', _1: 'And with your spirit. '},
																																													_1: {
																																														ctor: '::',
																																														_0: {ctor: '_Tuple2', _0: 'Minister', _1: 'Let us pray.'},
																																														_1: {ctor: '[]'}
																																													}
																																												}
																																											}),
																																										_1: {
																																											ctor: '::',
																																											_0: _user$project$Elm_Page_Office_Format$rubric('Minister and People'),
																																											_1: {
																																												ctor: '::',
																																												_0: _user$project$Elm_Page_Office_Prayers$lordsPrayerTrad,
																																												_1: {
																																													ctor: '::',
																																													_0: _user$project$Elm_Page_Office_Format$rubric('Then may be said'),
																																													_1: {
																																														ctor: '::',
																																														_0: _user$project$Elm_Page_Office_Prayers$agnusDei,
																																														_1: {
																																															ctor: '::',
																																															_0: _user$project$Elm_Page_Office_Format$rubric('The minister may say'),
																																															_1: {
																																																ctor: '::',
																																																_0: _user$project$Elm_Page_Office_Format$justText('\n            The body of our Lord Jesus Christ, which was given for you,\n            preserve your body and soul to everlasting life.\n            '),
																																																_1: {
																																																	ctor: '::',
																																																	_0: _user$project$Elm_Page_Office_Format$justText('\n            The blood of our Lord Jesus Christ, which was shed for you,\n            preserve your body and soul to everlasting life.\n            '),
																																																	_1: {
																																																		ctor: '::',
																																																		_0: _user$project$Elm_Page_Office_Format$rubric('After Communion, the minister says'),
																																																		_1: {
																																																			ctor: '::',
																																																			_0: _user$project$Elm_Page_Office_Format$pbVs('Almighty and ever-living God,'),
																																																			_1: {
																																																				ctor: '::',
																																																				_0: _user$project$Elm_Page_Office_Format$pbVs('we thank you for feeding us, in these holy mysteries,'),
																																																				_1: {
																																																					ctor: '::',
																																																					_0: _user$project$Elm_Page_Office_Format$pbVs('with the spiritual food of the most precious Body and Blood'),
																																																					_1: {
																																																						ctor: '::',
																																																						_0: _user$project$Elm_Page_Office_Format$pbVs('of your Son our Savior Jesus Christ;'),
																																																						_1: {
																																																							ctor: '::',
																																																							_0: _user$project$Elm_Page_Office_Format$pbVs('and for assuring us, through this Sacrament, of your favor and goodness towards us;'),
																																																							_1: {
																																																								ctor: '::',
																																																								_0: _user$project$Elm_Page_Office_Format$pbVs('and that we are true members of the mystical body of your Son,'),
																																																								_1: {
																																																									ctor: '::',
																																																									_0: _user$project$Elm_Page_Office_Format$pbVs('the blessed company of all faithful people;'),
																																																									_1: {
																																																										ctor: '::',
																																																										_0: _user$project$Elm_Page_Office_Format$pbVs('and are also heirs, through hope, of your everlasting kingdom.'),
																																																										_1: {
																																																											ctor: '::',
																																																											_0: _user$project$Elm_Page_Office_Format$pbVs('And we humbly ask you, heavenly Father,'),
																																																											_1: {
																																																												ctor: '::',
																																																												_0: _user$project$Elm_Page_Office_Format$pbVs('to assist us with your grace,'),
																																																												_1: {
																																																													ctor: '::',
																																																													_0: _user$project$Elm_Page_Office_Format$pbVs('that we may continue in that holy fellowship,'),
																																																													_1: {
																																																														ctor: '::',
																																																														_0: _user$project$Elm_Page_Office_Format$pbVs('and do all such good works as you have prepared for us to walk in;'),
																																																														_1: {
																																																															ctor: '::',
																																																															_0: _user$project$Elm_Page_Office_Format$pbVs('through Jesus Christ our Lord,'),
																																																															_1: {
																																																																ctor: '::',
																																																																_0: _user$project$Elm_Page_Office_Format$pbVs('to whom with you and the Holy Spirit,'),
																																																																_1: {
																																																																	ctor: '::',
																																																																	_0: _user$project$Elm_Page_Office_Format$pbVs('be all honor and glory, now and forever. Amen.'),
																																																																	_1: {
																																																																		ctor: '::',
																																																																		_0: _user$project$Elm_Page_Office_Format$rubric('A Priest gives this blessing'),
																																																																		_1: {
																																																																			ctor: '::',
																																																																			_0: _user$project$Elm_Page_Office_Format$withAmen('\n            The peace of God which passes all understanding keep your hearts and minds in the\n            knowledge and love of God, and of his Son Jesus Christ our Lord; and the blessing\n            of God Almighty, the Father, the Son, and the Holy Spirit, be among you, and remain\n            with you always.\n            '),
																																																																			_1: {
																																																																				ctor: '::',
																																																																				_0: _user$project$Elm_Page_Office_Format$rubric('A Deacon or lay person says the following'),
																																																																				_1: {
																																																																					ctor: '::',
																																																																					_0: _user$project$Elm_Page_Office_Format$withAmen('\n            The grace of our Lord Jesus Christ, and the love of God, and the fellowship of the\n            Holy Spirit, be with us all evermore.\n            '),
																																																																					_1: {
																																																																						ctor: '::',
																																																																						_0: _user$project$Elm_Page_Office_Format$reference('2 Corinthians 13:14'),
																																																																						_1: {
																																																																							ctor: '::',
																																																																							_0: _user$project$Elm_Page_Office_Format$emptyLine,
																																																																							_1: {
																																																																								ctor: '::',
																																																																								_0: _user$project$Elm_Page_Office_Format$versicals(
																																																																									{
																																																																										ctor: '::',
																																																																										_0: {ctor: '_Tuple2', _0: 'Minister', _1: 'Let us bless the Lord'},
																																																																										_1: {
																																																																											ctor: '::',
																																																																											_0: {ctor: '_Tuple2', _0: 'People', _1: 'Thanks be to God'},
																																																																											_1: {ctor: '[]'}
																																																																										}
																																																																									}),
																																																																								_1: {ctor: '[]'}
																																																																							}
																																																																						}
																																																																					}
																																																																				}
																																																																			}
																																																																		}
																																																																	}
																																																																}
																																																															}
																																																														}
																																																													}
																																																												}
																																																											}
																																																										}
																																																									}
																																																								}
																																																							}
																																																						}
																																																					}
																																																				}
																																																			}
																																																		}
																																																	}
																																																}
																																															}
																																														}
																																													}
																																												}
																																											}
																																										}
																																									}
																																								}
																																							}
																																						}
																																					}
																																				}
																																			}
																																		}
																																	}
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}),
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$Elm_Page_CommunionToSick$NoOp = {ctor: 'NoOp'};

var _user$project$Elm_Page_Compline$update = F2(
	function (msg, model) {
		var _p0 = msg;
		switch (_p0.ctor) {
			case 'NoOp':
				return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
			case 'GetPsalm':
				return {
					ctor: '_Tuple2',
					_0: model,
					_1: _user$project$Elm_Ports$requestPsalms(
						{
							ctor: '::',
							_0: {ctor: '_Tuple3', _0: _p0._0, _1: _p0._1, _2: _p0._2},
							_1: {ctor: '[]'}
						})
				};
			case 'SetPsalm':
				if (_p0._0.ctor === 'Just') {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							model,
							{psalms: _p0._0._0}),
						_1: _elm_lang$core$Platform_Cmd$none
					};
				} else {
					var _p1 = A2(_elm_lang$core$Debug$log, 'COULDNT GET PSALMS', '');
					return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
				}
			case 'MoreOptions':
				return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
			default:
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{directions: !model.directions}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
		}
	});
var _user$project$Elm_Page_Compline$psalmChange = _user$project$Elm_Ports$requestedPsalms(
	function (_p2) {
		return _elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$Elm_Data_Psalm$decoder, _p2));
	});
var _user$project$Elm_Page_Compline$init = {
	errors: {ctor: '[]'},
	thisOption: '',
	directions: false,
	psalms: {ctor: '[]'}
};
var _user$project$Elm_Page_Compline$Model = F4(
	function (a, b, c, d) {
		return {errors: a, thisOption: b, directions: c, psalms: d};
	});
var _user$project$Elm_Page_Compline$ShowDirections = {ctor: 'ShowDirections'};
var _user$project$Elm_Page_Compline$MoreOptions = {ctor: 'MoreOptions'};
var _user$project$Elm_Page_Compline$SetPsalm = function (a) {
	return {ctor: 'SetPsalm', _0: a};
};
var _user$project$Elm_Page_Compline$subscriptions = function (model) {
	return _elm_lang$core$Platform_Sub$batch(
		{
			ctor: '::',
			_0: A2(_elm_lang$core$Platform_Sub$map, _user$project$Elm_Page_Compline$SetPsalm, _user$project$Elm_Page_Compline$psalmChange),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Compline$GetPsalm = F3(
	function (a, b, c) {
		return {ctor: 'GetPsalm', _0: a, _1: b, _2: c};
	});
var _user$project$Elm_Page_Compline$psalmButton = F4(
	function (ps, vsFrom, vsTo, str) {
		return A2(
			_elm_lang$html$Html$li,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$button,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('more-options'),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Events$onClick(
								A3(_user$project$Elm_Page_Compline$GetPsalm, ps, vsFrom, vsTo)),
							_1: {ctor: '[]'}
						}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text(str),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			});
	});
var _user$project$Elm_Page_Compline$view = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$button,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('more-options'),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Events$onClick(_user$project$Elm_Page_Compline$MoreOptions),
						_1: {ctor: '[]'}
					}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('Options'),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$emptyLine,
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('mpep'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$p,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('midday'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text('Compline'),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$p,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text(model.thisOption),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$rubric('The Officient begins'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$versicals(
											{
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: '', _1: 'Our Help is in the Name of the Lord'},
												_1: {
													ctor: '::',
													_0: {ctor: '_Tuple2', _0: 'People', _1: 'The maker of heaven and earth'},
													_1: {ctor: '[]'}
												}
											}),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$rubric('The Officiant continues'),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Format$justText('Let us humbly confess our sins to Almighty God.'),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$rubric('Silence may be kept. The Officiant and People then say'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$pbVss(
															{
																ctor: '::',
																_0: 'Almighty God and Father, we confess to you,',
																_1: {
																	ctor: '::',
																	_0: 'to one another, and to the whole company of heaven,',
																	_1: {
																		ctor: '::',
																		_0: 'that we have sinned, through our own fault,',
																		_1: {
																			ctor: '::',
																			_0: 'in thought, and word, and deed,',
																			_1: {
																				ctor: '::',
																				_0: 'and in what we have left undone.',
																				_1: {
																					ctor: '::',
																					_0: 'For the sake of your Son our Lord Jesus Christ,',
																					_1: {
																						ctor: '::',
																						_0: 'have mercy upon us, forgive us all our sins,',
																						_1: {
																							ctor: '::',
																							_0: 'and by the power of your Holy Spirit',
																							_1: {
																								ctor: '::',
																								_0: 'raise us up to serve you in newness of life,',
																								_1: {
																									ctor: '::',
																									_0: 'to the glory of your Name. Amen.',
																									_1: {ctor: '[]'}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$rubric('The Officiant alone says'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$justText('May Almighty God grant us forgiveness of our sins,'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Format$withAmen('and the grace and comfort of his Holy Spirit. '),
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$versicals(
																			{
																				ctor: '::',
																				_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'O God, make speed to save us'},
																				_1: {
																					ctor: '::',
																					_0: {ctor: '_Tuple2', _0: 'People', _1: 'O Lord, make haste to help us.'},
																					_1: {
																						ctor: '::',
																						_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Glory be to the Father, and to the Son, and to the Holy Spirit;'},
																						_1: {
																							ctor: '::',
																							_0: {ctor: '_Tuple2', _0: 'People', _1: 'as it was in the beginning, is now, and ever shall be, world without end. Amen.'},
																							_1: {ctor: '[]'}
																						}
																					}
																				}
																			}),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$rubricWithText(
																				{ctor: '_Tuple2', _0: 'Except in Lent, add', _1: 'Alleluia'}),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$rubric('\n        One or more of the following Psalms are sung or said.\n        Traditionally three are used: 4, 91, and 134.\n        Other suitable selections from the Psalms may be substituted.\n        '),
																				_1: {
																					ctor: '::',
																					_0: A2(
																						_elm_lang$html$Html$ul,
																						{
																							ctor: '::',
																							_0: _elm_lang$html$Html_Attributes$class('pick-psalm'),
																							_1: {ctor: '[]'}
																						},
																						{
																							ctor: '::',
																							_0: A4(_user$project$Elm_Page_Compline$psalmButton, 4, 1, 999, '4'),
																							_1: {
																								ctor: '::',
																								_0: A4(_user$project$Elm_Page_Compline$psalmButton, 31, 1, 5, '31:1-5'),
																								_1: {
																									ctor: '::',
																									_0: A4(_user$project$Elm_Page_Compline$psalmButton, 91, 1, 999, '91'),
																									_1: {
																										ctor: '::',
																										_0: A4(_user$project$Elm_Page_Compline$psalmButton, 134, 1, 999, '134'),
																										_1: {ctor: '[]'}
																									}
																								}
																							}
																						}),
																					_1: {
																						ctor: '::',
																						_0: _user$project$Elm_Views_Psalm$formattedPsalms(model.psalms),
																						_1: {
																							ctor: '::',
																							_0: _user$project$Elm_Page_Office_Format$rubric('At the end of the Psalms is sung or said'),
																							_1: {
																								ctor: '::',
																								_0: _user$project$Elm_Page_Office_Prayers$gloria,
																								_1: {
																									ctor: '::',
																									_0: _user$project$Elm_Page_Office_Format$rubric('One of the following, or some other suitable passage of Scripture, is read.'),
																									_1: {
																										ctor: '::',
																										_0: A2(_user$project$Elm_Page_Office_Format$bibleText, '\n        You, O Lord, are in the midst of us, and we are called by your Name: do not forsake us.\n        ', 'Jeremiah 14:9'),
																										_1: {
																											ctor: '::',
																											_0: A2(_user$project$Elm_Page_Office_Format$bibleText, '\n        Come to me, all who labor and are heavy-laden, and I will give you rest. Take my yoke upon you,\n        and learn from me, for I am gentle and lowly in heart, and you will find rest for your souls. For my\n        yoke is easy, and my burden is light.\n        ', 'Matthew 11:28-30'),
																											_1: {
																												ctor: '::',
																												_0: A2(_user$project$Elm_Page_Office_Format$bibleText, '\n        Now may the God of peace who brought again from the dead our Lord Jesus, the great shepherd of\n        the sheep, by the blood of the eternal covenant, equip you with everything good that you may do his\n        will, working in us that which is pleasing in his sight, through Jesus Christ, to whom be glory for\n        ever and ever. Amen.\n        ', 'Hebrews 13:20-21'),
																												_1: {
																													ctor: '::',
																													_0: A2(_user$project$Elm_Page_Office_Format$bibleText, '\n        Be sober-minded, be watchful. Your adversary the devil prowls around like a roaring lion, seeking\n        someone to devour. Resist him, firm in your faith.\n        ', '1 Peter 5:8-9a'),
																													_1: {
																														ctor: '::',
																														_0: _user$project$Elm_Page_Office_Format$rubric('At the end of the reading is said'),
																														_1: {
																															ctor: '::',
																															_0: _user$project$Elm_Page_Office_Format$wordOfTheLord,
																															_1: {
																																ctor: '::',
																																_0: _user$project$Elm_Page_Office_Format$rubric('A period of silence may follow. A suitable hymn may be sung.'),
																																_1: {
																																	ctor: '::',
																																	_0: _user$project$Elm_Page_Office_Format$versicals(
																																		{
																																			ctor: '::',
																																			_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Into your hands, O Lord, I commend my spirit;'},
																																			_1: {
																																				ctor: '::',
																																				_0: {ctor: '_Tuple2', _0: 'People', _1: 'For you have redeemed me, O Lord, O God of truth.'},
																																				_1: {
																																					ctor: '::',
																																					_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Keep me as the apple of your eye;'},
																																					_1: {
																																						ctor: '::',
																																						_0: {ctor: '_Tuple2', _0: 'People', _1: 'Hide me under the shadow of your wings.'},
																																						_1: {ctor: '[]'}
																																					}
																																				}
																																			}
																																		}),
																																	_1: {
																																		ctor: '::',
																																		_0: _user$project$Elm_Page_Office_Prayers$mercy3,
																																		_1: {
																																			ctor: '::',
																																			_0: _user$project$Elm_Page_Office_Format$rubric('Officiant and People'),
																																			_1: {
																																				ctor: '::',
																																				_0: _user$project$Elm_Page_Office_Prayers$lordsPrayerTrad,
																																				_1: {
																																					ctor: '::',
																																					_0: _user$project$Elm_Page_Office_Prayers$lordsPrayerModern,
																																					_1: {
																																						ctor: '::',
																																						_0: _user$project$Elm_Page_Office_Format$versicals(
																																							{
																																								ctor: '::',
																																								_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'O Lord, hear our prayer;'},
																																								_1: {
																																									ctor: '::',
																																									_0: {ctor: '_Tuple2', _0: 'People', _1: 'And let our cry come to you.'},
																																									_1: {
																																										ctor: '::',
																																										_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Let us pray.'},
																																										_1: {ctor: '[]'}
																																									}
																																								}
																																							}),
																																						_1: {
																																							ctor: '::',
																																							_0: _user$project$Elm_Page_Office_Format$rubric('The Officiant then says one or more of the following Collects. Other appropriate Collects may also be used.'),
																																							_1: {
																																								ctor: '::',
																																								_0: _user$project$Elm_Page_Office_Format$withAmen('\n        Visit this place, O Lord, and drive far from it all snares of the enemy; let your holy angels dwell with\n        us to preserve us in peace; and let your blessing be upon us always; through Jesus Christ our Lord.\n        '),
																																								_1: {
																																									ctor: '::',
																																									_0: _user$project$Elm_Page_Office_Format$withAmen('\n        Lighten our darkness, we beseech you, O Lord; and by your great mercy defend us from all perils\n        and dangers of this night; for the love of your only Son, our Savior Jesus Christ.\n        '),
																																									_1: {
																																										ctor: '::',
																																										_0: _user$project$Elm_Page_Office_Format$withAmen('\n        Be present, O merciful God, and protect us through the hours of this night, so that we who are\n        wearied by the changes and chances of this life may rest in your eternal changelessness; through\n        Jesus Christ our Lord.\n        '),
																																										_1: {
																																											ctor: '::',
																																											_0: _user$project$Elm_Page_Office_Format$withAmen('\n        Look down, O Lord, from your heavenly throne, illumine this night with your celestial brightness,\n        and from the children of light banish the deeds of darkness; through Jesus Christ our Lord.\n        '),
																																											_1: {
																																												ctor: '::',
																																												_0: _user$project$Elm_Page_Office_Format$justText('A Collect for Saturdays'),
																																												_1: {
																																													ctor: '::',
																																													_0: _user$project$Elm_Page_Office_Format$withAmen('\n        We give you thanks, O God, for revealing your Son Jesus Christ to us by the light of his\n        resurrection: Grant that as we sing your glory at the close of this day, our joy may abound in the\n        morning as we celebrate the Paschal mystery; through Jesus Christ our Lord.\n        '),
																																													_1: {
																																														ctor: '::',
																																														_0: _user$project$Elm_Page_Office_Format$rubric('One of the following prayers may be added'),
																																														_1: {
																																															ctor: '::',
																																															_0: _user$project$Elm_Page_Office_Format$withAmen('\n        Keep watch, dear Lord, with those who work, or watch, or weep this night, and give your angels\n        charge over those who sleep. Tend the sick, Lord Christ; give rest to the weary, bless the dying,\n        soothe the suffering, pity the afflicted, shield the joyous; and all for your love’s sake.\n        '),
																																															_1: {
																																																ctor: '::',
																																																_0: _user$project$Elm_Page_Office_Format$rubric('or this'),
																																																_1: {
																																																	ctor: '::',
																																																	_0: _user$project$Elm_Page_Office_Format$withAmen('\n        O God, your unfailing providence sustains the world we live in and the life we live: Watch over\n        those, both night and day, who work while others sleep, and grant that we may never forget that our\n        common life depends upon each other’s toil; through Jesus Christ our Lord.\n        '),
																																																	_1: {
																																																		ctor: '::',
																																																		_0: _user$project$Elm_Page_Office_Format$rubric('Silence may be kept, and free intercessions and thanksgivings may be offered.'),
																																																		_1: {
																																																			ctor: '::',
																																																			_0: _user$project$Elm_Page_Office_Format$rubric('The Officiant and People say or sing the Song of Simeon (Luke 2:29-32) with this Antiphon'),
																																																			_1: {
																																																				ctor: '::',
																																																				_0: _user$project$Elm_Page_Office_Format$justText('Guide us waking, O Lord, and guard us sleeping; that awake'),
																																																				_1: {
																																																					ctor: '::',
																																																					_0: _user$project$Elm_Page_Office_Format$justText('we may watch with Christ, and asleep we may rest in peace.'),
																																																					_1: {
																																																						ctor: '::',
																																																						_0: _user$project$Elm_Page_Office_Format$rubricWithText(
																																																							{ctor: '_Tuple2', _0: 'In Easter Season, add', _1: 'Alleluia, alleluia, alleluia.'}),
																																																						_1: {
																																																							ctor: '::',
																																																							_0: _user$project$Elm_Page_Office_Format$pbVs('Lord, now let your servant depart in peace,'),
																																																							_1: {
																																																								ctor: '::',
																																																								_0: _user$project$Elm_Page_Office_Format$pbVsIndent('according to your word.'),
																																																								_1: {
																																																									ctor: '::',
																																																									_0: _user$project$Elm_Page_Office_Format$pbVs('For my eyes have seen your salvation,'),
																																																									_1: {
																																																										ctor: '::',
																																																										_0: _user$project$Elm_Page_Office_Format$pbVsIndent('which you have prepared before the face of all people;'),
																																																										_1: {
																																																											ctor: '::',
																																																											_0: _user$project$Elm_Page_Office_Format$pbVs('to be a light to lighten the Gentiles,'),
																																																											_1: {
																																																												ctor: '::',
																																																												_0: _user$project$Elm_Page_Office_Format$pbVsIndent('and to be the glory of your people Israel.'),
																																																												_1: {
																																																													ctor: '::',
																																																													_0: _user$project$Elm_Page_Office_Prayers$gloria,
																																																													_1: {
																																																														ctor: '::',
																																																														_0: _user$project$Elm_Page_Office_Format$emptyLine,
																																																														_1: {
																																																															ctor: '::',
																																																															_0: _user$project$Elm_Page_Office_Format$justText('Guide us waking, O Lord, and guard us sleeping; that awake'),
																																																															_1: {
																																																																ctor: '::',
																																																																_0: _user$project$Elm_Page_Office_Format$justText('we may watch with Christ, and asleep we may rest in peace.'),
																																																																_1: {
																																																																	ctor: '::',
																																																																	_0: _user$project$Elm_Page_Office_Format$rubricWithText(
																																																																		{ctor: '_Tuple2', _0: 'In Easter Season, add', _1: 'Alleluia, alleluia, alleluia.'}),
																																																																	_1: {
																																																																		ctor: '::',
																																																																		_0: _user$project$Elm_Page_Office_Format$versicals(
																																																																			{
																																																																				ctor: '::',
																																																																				_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Let us bless the Lord.'},
																																																																				_1: {
																																																																					ctor: '::',
																																																																					_0: {ctor: '_Tuple2', _0: 'People', _1: 'Thanks be to God.'},
																																																																					_1: {ctor: '[]'}
																																																																				}
																																																																			}),
																																																																		_1: {
																																																																			ctor: '::',
																																																																			_0: _user$project$Elm_Page_Office_Format$rubric('The Officiant concludes with the following'),
																																																																			_1: {
																																																																				ctor: '::',
																																																																				_0: _user$project$Elm_Page_Office_Format$withAmen('The Lord Almighty grant us a peaceful night and a perfect end.'),
																																																																				_1: {
																																																																					ctor: '::',
																																																																					_0: _user$project$Elm_Page_Office_Format$rubric('Or This'),
																																																																					_1: {
																																																																						ctor: '::',
																																																																						_0: _user$project$Elm_Page_Office_Format$withAmen('\n        The almighty and merciful Lord, Father, Son, and Holy Spirit,\n        bless us and keep us, this night and evermore.\n        '),
																																																																						_1: {
																																																																							ctor: '::',
																																																																							_0: A2(
																																																																								_elm_lang$html$Html$button,
																																																																								{
																																																																									ctor: '::',
																																																																									_0: _elm_lang$html$Html_Attributes$class('more-options'),
																																																																									_1: {
																																																																										ctor: '::',
																																																																										_0: _elm_lang$html$Html_Events$onClick(_user$project$Elm_Page_Compline$ShowDirections),
																																																																										_1: {ctor: '[]'}
																																																																									}
																																																																								},
																																																																								{
																																																																									ctor: '::',
																																																																									_0: _elm_lang$html$Html$text('Additional Directives'),
																																																																									_1: {ctor: '[]'}
																																																																								}),
																																																																							_1: {
																																																																								ctor: '::',
																																																																								_0: _user$project$Elm_Page_Office_Format$complineAdditionalDirectives(model.directions),
																																																																								_1: {ctor: '[]'}
																																																																							}
																																																																						}
																																																																					}
																																																																				}
																																																																			}
																																																																		}
																																																																	}
																																																																}
																																																															}
																																																														}
																																																													}
																																																												}
																																																											}
																																																										}
																																																									}
																																																								}
																																																							}
																																																						}
																																																					}
																																																				}
																																																			}
																																																		}
																																																	}
																																																}
																																															}
																																														}
																																													}
																																												}
																																											}
																																										}
																																									}
																																								}
																																							}
																																						}
																																					}
																																				}
																																			}
																																		}
																																	}
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}),
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$Elm_Page_Compline$NoOp = {ctor: 'NoOp'};

var _user$project$Elm_Views_Collects$mpMission = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$rubric('Unless The Great Litany or the Eucharist is to follow, one of the following prayers for mission is added.'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$emptyLine,
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$withAmen('\n            Almighty and everlasting God, who alone works great marvels: Send down upon our clergy and the\n            congregations committed to their charge the life-giving Spirit of your grace, shower them with the\n            continual dew of your blessing, and ignite in them a zealous love of your Gospel, through Jesus\n            Christ our Lord.\n                '),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$emptyLine,
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$withAmen('\n            O God, you have made of one blood all the peoples of the earth, and sent your blessed Son to\n            preach peace to those who are far off and to those who are near: Grant that people everywhere may\n            seek after you and find you; bring the nations into your fold; pour out your Spirit upon all flesh; and\n            hasten the coming of your kingdom; through Jesus Christ our Lord.\n                '),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$emptyLine,
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$withAmen('\n            Lord Jesus Christ, you stretched out your arms of love on the hard wood of the cross that everyone\n            might come within the reach of your saving embrace: So clothe us in your Spirit that we, reaching\n            forth our hands in love, may bring those who do not know you to the knowledge and love of you;\n            for the honor of your Name.\n                '),
								_1: {ctor: '[]'}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Views_Collects$mpSaturday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Sabbath Rest (Saturday)'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$withAmen('\n            Almighty God, who after the creation of the world rested from all your works and sanctified a day\n            of rest for all your creatures: Grant that we, putting away all earthly anxieties, may be duly prepared\n            for the service of your sanctuary, and that our rest here upon earth may be a preparation for the\n            eternal rest promised to your people in heaven; through Jesus Christ our Lord.\n                '),
			_1: {ctor: '[]'}
		}
	});
var _user$project$Elm_Views_Collects$mpFriday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Endurance (Friday)'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$withAmen('\n            Almighty God, whose most dear Son went not up to joy but first he suffered pain, and entered not\n            into glory before he was crucified: Mercifully grant that we, walking in the way of the cross, may find\n            it none other than the way of life and peace; through Jesus Christ your Son our Lord.\n                '),
			_1: {ctor: '[]'}
		}
	});
var _user$project$Elm_Views_Collects$mpThursday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Guidance (Thursday)'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$withAmen('\n            Heavenly Father, in you we live and move and have our being: We humbly pray you so to guide and\n            govern us by your Holy Spirit, that in all the cares and occupations of our life we may not forget\n            you, but may remember that we are ever walking in your sight; through Jesus Christ our Lord.\n            '),
			_1: {ctor: '[]'}
		}
	});
var _user$project$Elm_Views_Collects$mpWednesday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Grace (Wednesday)'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$withAmen('\n            O Lord, our heavenly Father, almighty and everlasting God, you have brought us safely to the\n            beginning of this day: Defend us by your mighty power, that we may not fall into sin nor run into\n            any danger; and that guided by your Spirit, we may do what is righteous in your sight; through Jesus\n            Christ our Lord.\n                '),
			_1: {ctor: '[]'}
		}
	});
var _user$project$Elm_Views_Collects$mpTuesday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Peace (Tuesday)'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$withAmen('\n            O God, the author of peace and lover of concord, to know you is eternal life and to serve you is\n            perfect freedom: Defend us, your humble servants, in all assaults of our enemies; that we, surely\n            trusting in your defense, may not fear the power of any adversaries, through the might of Jesus\n            Christ our Lord.\n                '),
			_1: {ctor: '[]'}
		}
	});
var _user$project$Elm_Views_Collects$mpMonday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for the Renewal of Life (Monday)'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$withAmen('\n        O God, the King eternal, whose light divides the day from the night and turns the shadow of death\n        into the morning: Drive far from us all wrong desires, incline our hearts to keep your law, and guide\n        our feet into the way of peace; that, having done your will with cheerfulness during the day, we may,\n        when night comes, rejoice to give you thanks; through Jesus Christ our Lord.\n        '),
			_1: {ctor: '[]'}
		}
	});
var _user$project$Elm_Views_Collects$mpSunday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Strength to Await Christ’s Return (Sunday)'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$withAmen('\n        O God our King, by the resurrection of your Son Jesus Christ on the first day of the week, you\n        conquered sin, put death to flight, and gave us the hope of everlasting life: Redeem all our days by\n        this victory; forgive our sins, banish our fears, make us bold to praise you and to do your will; and\n        steel us to wait for the consummation of your kingdom on the last great Day; through the same\n        Jesus Christ our Lord.\n        '),
			_1: {ctor: '[]'}
		}
	});
var _user$project$Elm_Views_Collects$epMission = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$rubric('Unless the Eucharist is to follow, one of the following prayers for mission is added.'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$withAmen('\n        O God and Father of all, whom the whole heavens adore: Let the whole earth also worship you, all\n        nations obey you, all tongues confess and bless you, and men, women and children everywhere love\n        you and serve you in peace; through Jesus Christ our Lord.\n        '),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$emptyLine,
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$withAmen('\n        Keep watch, dear Lord, with those who work, or watch, or weep this night, and give your angels\n        charge over those who sleep. Tend the sick, Lord Christ; give rest to the weary, bless the dying,\n        soothe the suffering, pity the afflicted, shield the joyous; and all for your love’s sake.\n        '),
					_1: {
						ctor: '::',
						_0: _user$project$Elm_Page_Office_Format$emptyLine,
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$withAmen('\n        O God, you manifest in your servants the signs of your presence: Send forth upon us the Spirit of\n        love, that in companionship with one another your abounding grace may increase among us;\n        through Jesus Christ our Lord.\n        '),
							_1: {ctor: '[]'}
						}
					}
				}
			}
		}
	});
var _user$project$Elm_Views_Collects$epSaturday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for the Eve of Worship (Saturday)'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$withAmen('\n        O God, the source of eternal light: Shed forth your unending day\n        upon us who watch for you, that our lips may praise you, our lives\n        may bless you, and our worship on the morrow give you glory; through Jesus Christ our Lord.\n        '),
			_1: {ctor: '[]'}
		}
	});
var _user$project$Elm_Views_Collects$epFriday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Faith (Friday)'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$withAmen('\n        Lord Jesus Christ, by your death you took away the sting of death: Grant to us your servants so to\n        follow in faith where you have led the way, that we may at length fall asleep peacefully in you and\n        wake up in your likeness; for your tender mercies’ sake.\n        '),
			_1: {ctor: '[]'}
		}
	});
var _user$project$Elm_Views_Collects$epThursday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for the Presence of Christ (Thursday)'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$withAmen('\n        Lord Jesus, stay with us, for evening is at hand and the day is past; be our companion in the way,\n        kindle our hearts, and awaken hope, that we may know you as you are revealed in Scripture and the\n        breaking of bread. Grant this for the sake of your love.\n        '),
			_1: {ctor: '[]'}
		}
	});
var _user$project$Elm_Views_Collects$epWednesday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Protection (Wednesday)'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$withAmen('\n        O God, the life of all who live, the light of the faithful, the strength of those who labor, and the\n        repose of the dead: We thank you for the blessings of the day that is past, and humbly ask for your\n        protection through the coming night. Bring us in safety to the morning hours; through him who\n        died and rose again for us, your Son our Savior Jesus Christ.\n        '),
			_1: {ctor: '[]'}
		}
	});
var _user$project$Elm_Views_Collects$epTuesday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Aid against Perils (Tuesday)'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$withAmen('\n        Lighten our darkness, we beseech you, O Lord; and by your great mercy defend us from all perils\n        and dangers of this night; for the love of your only Son, our Savior Jesus Christ.\n        '),
			_1: {ctor: '[]'}
		}
	});
var _user$project$Elm_Views_Collects$epMonday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Peace (Monday)'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$withAmen('\n        O God, the source of all holy desires, all good counsels, and all just works: Give to your servants\n        that peace which the world cannot give, that our hearts may be set to obey your commandments,\n        and that we, being defended from the fear of our enemies, may pass our time in rest and quietness,\n        through the merits of Jesus Christ our Savior.\n        '),
			_1: {ctor: '[]'}
		}
	});
var _user$project$Elm_Views_Collects$epSunday = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$pbSection('A Collect for Resurrection Hope (Sunday)'),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$withAmen('\n        Lord God, whose Son our Savior Jesus Christ triumphed over the powers of death and prepared for\n        us our place in the new Jerusalem: Grant that we, who have this day given thanks for his\n        resurrection, may praise you in that City of which he is the light, and where he lives and reigns\n        forever and ever.\n        '),
			_1: {ctor: '[]'}
		}
	});
var _user$project$Elm_Views_Collects$mpCollectOfDay = function (dayOfWeek) {
	var thisCollect = function () {
		var _p0 = dayOfWeek;
		switch (_p0) {
			case 0:
				return _user$project$Elm_Views_Collects$mpSunday;
			case 1:
				return _user$project$Elm_Views_Collects$mpMonday;
			case 2:
				return _user$project$Elm_Views_Collects$mpTuesday;
			case 3:
				return _user$project$Elm_Views_Collects$mpWednesday;
			case 4:
				return _user$project$Elm_Views_Collects$mpThursday;
			case 5:
				return _user$project$Elm_Views_Collects$mpFriday;
			case 6:
				return _user$project$Elm_Views_Collects$mpSaturday;
			default:
				return A2(
					_elm_lang$html$Html$div,
					{ctor: '[]'},
					{ctor: '[]'});
		}
	}();
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: thisCollect,
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Views_Collects$mpMission,
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Elm_Views_Collects$epCollectOfDay = function (dayOfWeek) {
	var thisCollect = function () {
		var _p1 = dayOfWeek;
		switch (_p1) {
			case 0:
				return _user$project$Elm_Views_Collects$epSunday;
			case 1:
				return _user$project$Elm_Views_Collects$epMonday;
			case 2:
				return _user$project$Elm_Views_Collects$epTuesday;
			case 3:
				return _user$project$Elm_Views_Collects$epWednesday;
			case 4:
				return _user$project$Elm_Views_Collects$epThursday;
			case 5:
				return _user$project$Elm_Views_Collects$epFriday;
			case 6:
				return _user$project$Elm_Views_Collects$epSaturday;
			default:
				return A2(
					_elm_lang$html$Html$div,
					{ctor: '[]'},
					{ctor: '[]'});
		}
	}();
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: thisCollect,
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Views_Collects$epMission,
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Elm_Views_Collects$collects = function (texts) {
	var display = function (str) {
		return _elm_lang$core$Native_Utils.eq(str, 'orthis') ? _user$project$Elm_Page_Office_Format$orThis : _elm_lang$html$Html$text(str);
	};
	var multipleText = A2(_elm_lang$core$List$intersperse, 'orthis', texts);
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		A2(_elm_lang$core$List$map, display, multipleText));
};

var _user$project$Elm_Views_Lessons$formattedVerses = function (vss) {
	var formattedVerse = function (vs) {
		return A2(
			_evancz$elm_markdown$Markdown$toHtml,
			{ctor: '[]'},
			vs.html);
	};
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('esv_text'),
			_1: {ctor: '[]'}
		},
		A2(_elm_lang$core$List$map, formattedVerse, vss));
};
var _user$project$Elm_Views_Lessons$formattedLessons = function (lessons) {
	var formattedLesson = function (l) {
		return A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(l.title),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Views_Lessons$formattedVerses(l.vss),
					_1: {ctor: '[]'}
				}
			});
	};
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		A2(_elm_lang$core$List$map, formattedLesson, lessons));
};

var _user$project$Elm_Views_OpeningSentences$epDaysOfThanksgiving = A2(
	_elm_lang$html$Html$div,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: _user$project$Elm_Page_Office_Format$openingSentence(
			{ctor: '_Tuple3', _0: 'Days of Thanksgiving', _1: 'The Lord by wisdom founded the earth; by understanding he established the heavens; by his\n            knowledge the deeps broke open, and the clouds drop down the dew.', _2: 'Proverbs 3:19-20'}),
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$openingSentence(
				{ctor: '_Tuple3', _0: 'At any time', _1: 'Worship the Lord in the beauty of holiness; let the whole earth tremble before him.', _2: 'Psalm 96:9'}),
			_1: {
				ctor: '::',
				_0: A2(_user$project$Elm_Page_Office_Format$bibleText, '\n            I will bless the Lord who gives me counsel; my heart teaches me, night after night. I have set the\n            Lord always before me; because he is at my right hand, I shall not fall.\n        ', 'Psalm 16:7-8'),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Elm_Views_OpeningSentences$epOpeningSentences = function (season) {
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$rubric('The Officiant may begin Evening Prayer by reading an opening sentence of Scripture.\n            One of the following, or a sentence from among\n            those provided at the end of the Office, is customary.\n            '),
			_1: {
				ctor: '::',
				_0: A2(_user$project$Elm_Page_Office_Format$bibleText, 'Jesus spoke to them, saying, “I am the light of the world. Whoever follows me will not walk in\n            darkness, but will have the light of life.”', 'John 8:12'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$orThis,
					_1: {
						ctor: '::',
						_0: A2(_user$project$Elm_Page_Office_Format$bibleText, 'O Lord, I love the habitation of your house and the place where your glory dwells.', 'Psalm 26:8'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$orThis,
							_1: {
								ctor: '::',
								_0: A2(_user$project$Elm_Page_Office_Format$bibleText, 'Let my prayer be set forth in your sight as incense,\n            the lifting up of my hands as the evening sacrifice.', 'Psalm 141:2'),
								_1: {
									ctor: '::',
									_0: function () {
										var _p0 = season;
										switch (_p0) {
											case 'advent':
												return _user$project$Elm_Page_Office_Format$openingSentence(
													{ctor: '_Tuple3', _0: 'Advent', _1: '\n                        Therefore stay awake – for you do not know when the master of the house will come, in the\n                        evening, or at midnight, or when the cock crows, or in the morning – lest he come suddenly and\n                        find you asleep.\n                    ', _2: 'Mark 13:35-36'});
											case 'christmas':
												return _user$project$Elm_Page_Office_Format$openingSentence(
													{ctor: '_Tuple3', _0: 'Christmas', _1: 'Behold, the dwelling place of God is with man. He will dwell with them, and they will be his people,\n                        and God himself will be with them as their God.', _2: 'Revelation 21:3'});
											case 'epiphany':
												return _user$project$Elm_Page_Office_Format$openingSentence(
													{ctor: '_Tuple3', _0: 'Epiphany', _1: 'Nations shall come to your light, and kings to the brightness of your rising.', _2: 'Isaiah 60:3'});
											case 'lent':
												return A2(
													_elm_lang$html$Html$div,
													{ctor: '[]'},
													{
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$openingSentence(
															{ctor: '_Tuple3', _0: 'Lent', _1: '\n                            If we say we have no sin, we deceive ourselves, and the truth is not in us. If we confess our sins, he\n                            is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.\n                          ', _2: '1 John 1:8-9'}),
														_1: {
															ctor: '::',
															_0: A2(_user$project$Elm_Page_Office_Format$bibleText, 'For I know my transgressions, and my sin is ever before me.', 'Psalm 51:3'),
															_1: {
																ctor: '::',
																_0: A2(_user$project$Elm_Page_Office_Format$bibleText, 'To the Lord our God belong mercy and forgiveness, for we have rebelled against him.', 'Daniel 9:9'),
																_1: {ctor: '[]'}
															}
														}
													});
											case 'holyweek':
												return _user$project$Elm_Page_Office_Format$openingSentence(
													{ctor: '_Tuple3', _0: 'Holy Week', _1: 'All we like sheep have gone astray; we have turned every one to his own way; and the Lord has laid\n                        on him the iniquity of us all.', _2: 'Isaiah 53:6'});
											case 'easter':
												return _user$project$Elm_Page_Office_Format$openingSentence(
													{ctor: '_Tuple3', _0: 'Easter', _1: 'Thanks be to God, who gives us the victory through our Lord Jesus Christ.', _2: '1 Corinthians 15:57'});
											case 'ascension':
												return _user$project$Elm_Page_Office_Format$openingSentence(
													{ctor: '_Tuple3', _0: 'Ascension', _1: 'For Christ has entered, not into holy places made with hands, which are copies of the true things,\n                        but into heaven itself, now to appear in the presence of God on our behalf.', _2: 'Hebrews 9:24'});
											case 'pentecost':
												return A2(
													_elm_lang$html$Html$div,
													{ctor: '[]'},
													{
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$openingSentence(
															{ctor: '_Tuple3', _0: 'Pentecost', _1: 'The Spirit and the Bride say, “Come.” And let the one who hears say, “Come.” And let the one who\n                        is thirsty come; let the one who desires take the water of life without price.', _2: 'Revelation 22:17'}),
														_1: {
															ctor: '::',
															_0: A2(_user$project$Elm_Page_Office_Format$bibleText, 'There is a river whose streams make glad the city of God, the holy habitation of the Most High.', 'Psalm 46:4'),
															_1: {ctor: '[]'}
														}
													});
											case 'trinity':
												return _user$project$Elm_Page_Office_Format$openingSentence(
													{ctor: '_Tuple3', _0: 'Trinity Sunday', _1: 'Holy, holy, holy, is the Lord God of Hosts; the whole earth is full of his glory!', _2: 'Isaiah 6:3'});
											default:
												return A2(
													_elm_lang$html$Html$div,
													{ctor: '[]'},
													{ctor: '[]'});
										}
									}(),
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			}
		});
};
var _user$project$Elm_Views_OpeningSentences$mpOpeningSentences = function (season) {
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: _user$project$Elm_Page_Office_Format$rubric('\n          The Officiant may begin Morning Prayer by reading an opening sentence of Scripture. One of the following, or a sentence from among those\n          provided at the end of the Office, is customary.\n        '),
			_1: {
				ctor: '::',
				_0: A2(_user$project$Elm_Page_Office_Format$bibleText, 'Grace to you and peace from God our Father and the Lord Jesus Christ.', 'Philippians 1:2'),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Page_Office_Format$orThis,
					_1: {
						ctor: '::',
						_0: A2(_user$project$Elm_Page_Office_Format$bibleText, 'I was glad when they said to me, “Let us go to the house of the Lord!”', 'Psalm 122:1'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$orThis,
							_1: {
								ctor: '::',
								_0: A2(_user$project$Elm_Page_Office_Format$bibleText, '\n            Let the words of my mouth and the meditation of my heart be acceptable in your sight, O Lord, my\n            rock and my redeemer.\n          ', 'Psalm 19:14'),
								_1: {
									ctor: '::',
									_0: function () {
										var _p1 = season;
										switch (_p1) {
											case 'advent':
												return _user$project$Elm_Page_Office_Format$openingSentence(
													{ctor: '_Tuple3', _0: 'Advent', _1: 'In the wilderness prepare the way of the Lord; make straight in the desert a highway for our God.', _2: 'Isaiah 40:3'});
											case 'christmas':
												return _user$project$Elm_Page_Office_Format$openingSentence(
													{ctor: '_Tuple3', _0: 'Christmas', _1: 'Fear not, for behold, I bring you good news of a great joy that will be for all people. For unto you is\n                  born this day in the city of David a Savior, who is Christ the Lord.', _2: 'Luke 2:10-11'});
											case 'epiphany':
												return _user$project$Elm_Page_Office_Format$openingSentence(
													{ctor: '_Tuple3', _0: 'Epiphany', _1: 'From the rising of the sun to its setting my name will be great among the nations, and in every place\n                  incense will be offered to my name, and a pure offering. For my name will be great among the\n                  nations, says the Lord of hosts.', _2: 'Malachi 1:11'});
											case 'lent':
												return A2(
													_elm_lang$html$Html$div,
													{ctor: '[]'},
													{
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$openingSentence(
															{ctor: '_Tuple3', _0: 'Lent and other Penitential Occasions', _1: 'Repent, for the kingdom of heaven is at hand.', _2: 'Matthew 3:2'}),
														_1: {
															ctor: '::',
															_0: A2(_user$project$Elm_Page_Office_Format$bibleText, 'Hide your face from my sins, and blot out all my iniquities.', 'Psalm 51:9'),
															_1: {
																ctor: '::',
																_0: A2(_user$project$Elm_Page_Office_Format$bibleText, 'If anyone would come after me, let him deny himself and take up his cross and follow me.', 'Mark 8:34'),
																_1: {ctor: '[]'}
															}
														}
													});
											case 'holyweek':
												return _user$project$Elm_Page_Office_Format$openingSentence(
													{ctor: '_Tuple3', _0: 'Holy Week', _1: 'Is it nothing to you, all you who pass by? Look and see if there is any sorrow like my sorrow, which\n                    was brought upon me, which the Lord inflicted on the day of his fierce anger.', _2: 'Lamentations 1:12'});
											case 'easter':
												return A2(
													_elm_lang$html$Html$div,
													{ctor: '[]'},
													{
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$openingSentence(
															{ctor: '_Tuple3', _0: 'Easter', _1: 'If then you have been raised with Christ, seek the things that are above, where Christ is, seated at\n                                the right hand of God.', _2: 'Colossians 3:1'}),
														_1: {
															ctor: '::',
															_0: A2(_user$project$Elm_Page_Office_Format$bibleText, 'Alleluia. Christ is risen. The Lord is risen indeed. Alleluia.', 'Mark 16:6 and Luke 24:34'),
															_1: {ctor: '[]'}
														}
													});
											case 'ascension':
												return _user$project$Elm_Page_Office_Format$openingSentence(
													{ctor: '_Tuple3', _0: 'Ascension', _1: 'Since then we have a great high priest who has passed through the heavens, Jesus, the Son of God,\n                    let us hold fast our confession. Let us then with confidence draw near to the throne of grace, that\n                    we may receive mercy and find grace to help in time of need.', _2: 'Hebrews 4:14, 16'});
											case 'pentecost':
												return _user$project$Elm_Page_Office_Format$openingSentence(
													{ctor: '_Tuple3', _0: 'Pentecost', _1: 'You will receive power when the Holy Spirit has come upon you, and you will be my witnesses in\n                    Jerusalem and in all Judea and Samaria, and to the end of the earth.', _2: 'Acts 1:8'});
											case 'trinity':
												return _user$project$Elm_Page_Office_Format$openingSentence(
													{ctor: '_Tuple3', _0: 'Trinity Sunday', _1: 'Holy, holy, holy, is the Lord God Almighty, who was and is and is to come!', _2: 'Revelation 4:8'});
											default:
												return A2(
													_elm_lang$html$Html$div,
													{ctor: '[]'},
													{ctor: '[]'});
										}
									}(),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$openingSentence(
											{ctor: '_Tuple3', _0: 'Days of Thanksgiving', _1: 'Honor the Lord with your wealth and with the firstfruits of all your produce; then your barns will be\n                        filled with plenty, and your vats will be bursting with wine.', _2: 'Proverbs 3:9-10'}),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Format$openingSentence(
												{ctor: '_Tuple3', _0: 'At any time', _1: 'The Lord is in his holy temple; let all the earth keep silence before him.', _2: 'Habakkuk 2:20'}),
											_1: {
												ctor: '::',
												_0: A2(_user$project$Elm_Page_Office_Format$bibleText, 'Send out your light and your truth; let them lead me; let them bring me to your holy hill and to your dwelling!', 'Psalm 43:3'),
												_1: {
													ctor: '::',
													_0: A2(_user$project$Elm_Page_Office_Format$bibleText, 'Thus says the One who is high and lifted up, who inhabits eternity, whose name is Holy: “I dwell in\n              the high and holy place, and also with him who is of a contrite and lowly spirit, to revive the spirit of\n              the lowly, and to revive the heart of the contrite.”', 'Isaiah 57:15'),
													_1: {
														ctor: '::',
														_0: A2(_user$project$Elm_Page_Office_Format$bibleText, 'The hour is coming, and is now here, when the true worshipers will worship the Father in spirit and\n              truth, for the Father is seeking such people to worship him.', 'John 4:23'),
														_1: {ctor: '[]'}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		});
};

var _user$project$Elm_Page_EP$lessonsChange = _user$project$Elm_Ports$requestedLessons(
	function (_p0) {
		return _elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$Elm_Data_Lessons$dailyLessonsDecoder, _p0));
	});
var _user$project$Elm_Page_EP$fetchLessons = function (model) {
	return A2(
		_elm_lang$core$Platform_Cmd_ops['!'],
		model,
		{
			ctor: '::',
			_0: _user$project$Elm_Ports$requestLessons('ep'),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_EP$initToggle = {tradionalLordsPrayer: true, teDeum: true, directions: false};
var _user$project$Elm_Page_EP$initNew = {
	errors: {ctor: '[]'},
	thisOption: '',
	toggle: _user$project$Elm_Page_EP$initToggle,
	lessons: _user$project$Elm_Data_Lessons$initDailyLessons,
	time: 0,
	showDirections: false,
	daysOfThanksgiving: false
};
var _user$project$Elm_Page_EP$initEP = function (lessons) {
	var model = _user$project$Elm_Page_EP$initNew;
	return _elm_lang$core$Native_Utils.update(
		model,
		{lessons: lessons});
};
var _user$project$Elm_Page_EP$Toggle = F3(
	function (a, b, c) {
		return {tradionalLordsPrayer: a, teDeum: b, directions: c};
	});
var _user$project$Elm_Page_EP$Model = F7(
	function (a, b, c, d, e, f, g) {
		return {errors: a, thisOption: b, toggle: c, lessons: d, time: e, showDirections: f, daysOfThanksgiving: g};
	});
var _user$project$Elm_Page_EP$DaysOfThanksgiving = {ctor: 'DaysOfThanksgiving'};
var _user$project$Elm_Page_EP$ShowDirections = {ctor: 'ShowDirections'};
var _user$project$Elm_Page_EP$UpdateTime = function (a) {
	return {ctor: 'UpdateTime', _0: a};
};
var _user$project$Elm_Page_EP$update = F2(
	function (msg, model) {
		var _p1 = msg;
		switch (_p1.ctor) {
			case 'NoOp':
				return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
			case 'FetchLessons':
				return {
					ctor: '_Tuple2',
					_0: model,
					_1: _user$project$Elm_Ports$requestLessons('ep')
				};
			case 'SetLessons':
				if (_p1._0.ctor === 'Just') {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							model,
							{lessons: _p1._0._0}),
						_1: _elm_lang$core$Platform_Cmd$none
					};
				} else {
					return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
				}
			case 'MoreOptions':
				return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
			case 'RequestTime':
				return {
					ctor: '_Tuple2',
					_0: model,
					_1: A2(_elm_lang$core$Task$perform, _user$project$Elm_Page_EP$UpdateTime, _elm_lang$core$Time$now)
				};
			case 'UpdateTime':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{time: _p1._0}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'ShowDirections':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{showDirections: !model.showDirections}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			default:
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{daysOfThanksgiving: !model.daysOfThanksgiving}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
		}
	});
var _user$project$Elm_Page_EP$RequestTime = {ctor: 'RequestTime'};
var _user$project$Elm_Page_EP$MoreOptions = {ctor: 'MoreOptions'};
var _user$project$Elm_Page_EP$view = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$button,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('iphod more-options'),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Events$onClick(_user$project$Elm_Page_EP$MoreOptions),
						_1: {ctor: '[]'}
					}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('Options'),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$emptyLine,
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('mpep'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$p,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('midday'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text('Daily Evening Prayer'),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$p,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text(model.thisOption),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$p,
										{ctor: '[]'},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text(model.lessons.dateString),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Views_OpeningSentences$epOpeningSentences(model.lessons.season),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$button,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$class('iphod'),
													_1: {
														ctor: '::',
														_0: _elm_lang$html$Html_Events$onClick(_user$project$Elm_Page_EP$DaysOfThanksgiving),
														_1: {ctor: '[]'}
													}
												},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Days of Thanksgiving'),
													_1: {ctor: '[]'}
												}),
											_1: {
												ctor: '::',
												_0: model.daysOfThanksgiving ? _user$project$Elm_Views_OpeningSentences$epDaysOfThanksgiving : A2(
													_elm_lang$html$Html$div,
													{ctor: '[]'},
													{ctor: '[]'}),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Prayers$confession,
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Prayers$invitatory,
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$rubric('Alternative forms of the “Glory be” and “Praise the Lord” are found in Additional Directions.'),
															_1: {
																ctor: '::',
																_0: _user$project$Elm_Page_Office_Format$rubric('The following or some other suitable hymn or Psalm may be sung or said'),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Prayers$phosHilaron,
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$rubric('Then follows'),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$pbSection('The Psalm or Psalms Appointed'),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Views_Psalm$formattedPsalms(model.lessons.psalms),
																				_1: {
																					ctor: '::',
																					_0: _user$project$Elm_Page_Office_Format$rubric('At the end of the Psalms is sung or said'),
																					_1: {
																						ctor: '::',
																						_0: _user$project$Elm_Page_Office_Prayers$gloria,
																						_1: {
																							ctor: '::',
																							_0: _user$project$Elm_Page_Office_Format$pbSection('The Lessons'),
																							_1: {
																								ctor: '::',
																								_0: _user$project$Elm_Page_Office_Format$rubric('One or more lessons, as appointed, are read, the Reader first saying'),
																								_1: {
																									ctor: '::',
																									_0: _user$project$Elm_Views_Lessons$formattedLessons(model.lessons.lesson1),
																									_1: {
																										ctor: '::',
																										_0: _user$project$Elm_Views_Lessons$formattedLessons(model.lessons.lesson2),
																										_1: {
																											ctor: '::',
																											_0: _user$project$Elm_Page_Office_Format$rubric('A citation giving chapter and verse may be added.'),
																											_1: {
																												ctor: '::',
																												_0: _user$project$Elm_Page_Office_Format$rubric('After each lesson the Reader may say'),
																												_1: {
																													ctor: '::',
																													_0: _user$project$Elm_Page_Office_Format$wordOfTheLord,
																													_1: {
																														ctor: '::',
																														_0: _user$project$Elm_Page_Office_Format$rubric('Or the Reader may say'),
																														_1: {
																															ctor: '::',
																															_0: A2(_user$project$Elm_Page_Office_Format$versical, '', 'Here ends the Reading.'),
																															_1: {
																																ctor: '::',
																																_0: _user$project$Elm_Page_Office_Format$rubric('\n                    The following Canticles are normally sung or said after each of the lessons.\n                    The Officiant may also use a Canticle drawn from the\n                    “Supplemental Canticles” or an appropriate song of praise.\n                '),
																																_1: {
																																	ctor: '::',
																																	_0: _user$project$Elm_Page_Office_Prayers$magnificat,
																																	_1: {
																																		ctor: '::',
																																		_0: _user$project$Elm_Page_Office_Prayers$phosHilaron,
																																		_1: {
																																			ctor: '::',
																																			_0: _user$project$Elm_Page_Office_Prayers$apostlesCreed,
																																			_1: {
																																				ctor: '::',
																																				_0: _user$project$Elm_Page_Office_Format$pbSection('The Prayers'),
																																				_1: {
																																					ctor: '::',
																																					_0: _user$project$Elm_Page_Office_Format$theLordBeWithYou,
																																					_1: {
																																						ctor: '::',
																																						_0: _user$project$Elm_Page_Office_Format$rubric('The People kneel or stand.'),
																																						_1: {
																																							ctor: '::',
																																							_0: _user$project$Elm_Page_Office_Prayers$mercy3,
																																							_1: {
																																								ctor: '::',
																																								_0: _user$project$Elm_Page_Office_Format$rubric('Officiant and People'),
																																								_1: {
																																									ctor: '::',
																																									_0: _user$project$Elm_Page_Office_Prayers$lordsPrayerTrad,
																																									_1: {
																																										ctor: '::',
																																										_0: _user$project$Elm_Page_Office_Format$rubric('or'),
																																										_1: {
																																											ctor: '::',
																																											_0: _user$project$Elm_Page_Office_Prayers$lordsPrayerModern,
																																											_1: {
																																												ctor: '::',
																																												_0: _user$project$Elm_Page_Office_Format$versicals(
																																													{
																																														ctor: '::',
																																														_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'O Lord, show your mercy upon us;'},
																																														_1: {
																																															ctor: '::',
																																															_0: {ctor: '_Tuple2', _0: 'People', _1: 'And grant us your salvation.'},
																																															_1: {
																																																ctor: '::',
																																																_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'O Lord, guide those who govern us;'},
																																																_1: {
																																																	ctor: '::',
																																																	_0: {ctor: '_Tuple2', _0: 'People', _1: 'And lead us in the way of justice and truth.'},
																																																	_1: {
																																																		ctor: '::',
																																																		_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Clothe your ministers with righteousness;'},
																																																		_1: {
																																																			ctor: '::',
																																																			_0: {ctor: '_Tuple2', _0: 'People', _1: 'And let your people sing with joy.'},
																																																			_1: {
																																																				ctor: '::',
																																																				_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'O Lord, save your people;'},
																																																				_1: {
																																																					ctor: '::',
																																																					_0: {ctor: '_Tuple2', _0: 'People', _1: 'And bless your inheritance.'},
																																																					_1: {
																																																						ctor: '::',
																																																						_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Give peace in our time, O Lord;'},
																																																						_1: {
																																																							ctor: '::',
																																																							_0: {ctor: '_Tuple2', _0: 'People', _1: 'And defend us by your mighty power.'},
																																																							_1: {
																																																								ctor: '::',
																																																								_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Let not the needy, O Lord, be forgotten;'},
																																																								_1: {
																																																									ctor: '::',
																																																									_0: {ctor: '_Tuple2', _0: 'People', _1: 'Nor the hope of the poor be taken away.'},
																																																									_1: {
																																																										ctor: '::',
																																																										_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Create in us clean hearts, O God;'},
																																																										_1: {
																																																											ctor: '::',
																																																											_0: {ctor: '_Tuple2', _0: 'People', _1: 'And take not your Holy Spirit from us.'},
																																																											_1: {ctor: '[]'}
																																																										}
																																																									}
																																																								}
																																																							}
																																																						}
																																																					}
																																																				}
																																																			}
																																																		}
																																																	}
																																																}
																																															}
																																														}
																																													}),
																																												_1: {
																																													ctor: '::',
																																													_0: _user$project$Elm_Page_Office_Format$rubric('or this'),
																																													_1: {
																																														ctor: '::',
																																														_0: _user$project$Elm_Page_Office_Format$justText('That this evening may be holy, good, and peaceful,'),
																																														_1: {
																																															ctor: '::',
																																															_0: _user$project$Elm_Page_Office_Format$italic('We entreat you, O Lord.'),
																																															_1: {
																																																ctor: '::',
																																																_0: _user$project$Elm_Page_Office_Format$justText('That your holy angels may lead us in paths of peace and goodwill,'),
																																																_1: {
																																																	ctor: '::',
																																																	_0: _user$project$Elm_Page_Office_Format$italic('We entreat you, O Lord.'),
																																																	_1: {
																																																		ctor: '::',
																																																		_0: _user$project$Elm_Page_Office_Format$justText('That we may be pardoned and forgiven for our sins and offenses,'),
																																																		_1: {
																																																			ctor: '::',
																																																			_0: _user$project$Elm_Page_Office_Format$italic('We entreat you, O Lord.'),
																																																			_1: {
																																																				ctor: '::',
																																																				_0: _user$project$Elm_Page_Office_Format$justText('That there may be peace in your Church and in the whole world,'),
																																																				_1: {
																																																					ctor: '::',
																																																					_0: _user$project$Elm_Page_Office_Format$italic('We entreat you, O Lord.'),
																																																					_1: {
																																																						ctor: '::',
																																																						_0: _user$project$Elm_Page_Office_Format$justText('That we may depart this life in your faith and fear,\n                        and not be condemned before the great judgment\n                        seat of Christ,'),
																																																						_1: {
																																																							ctor: '::',
																																																							_0: _user$project$Elm_Page_Office_Format$italic('We entreat you, O Lord.'),
																																																							_1: {
																																																								ctor: '::',
																																																								_0: _user$project$Elm_Page_Office_Format$justText('That we may be bound together by your Holy Spirit in the communion\n                    of [________ and] all your\n                    saints, entrusting one another and all our life to Christ,'),
																																																								_1: {
																																																									ctor: '::',
																																																									_0: _user$project$Elm_Page_Office_Format$rubric('\n                    The Officiant then prays one or more of the following collects, always beginning with the\n                    Collect of the Day (the prayer of the previous Sunday or of the Holy Day being observed).\n                    It is traditional to pray the Collects for Peace and Aid against Perils daily. Alternatively,\n                    one may pray the collects on a weekly rotation, using the suggestions in parentheses.\n                '),
																																																									_1: {
																																																										ctor: '::',
																																																										_0: _user$project$Elm_Page_Office_Format$justText('COLLECT OF WEEK GOES HERE'),
																																																										_1: {
																																																											ctor: '::',
																																																											_0: _user$project$Elm_Views_Collects$collects(model.lessons.collects.texts),
																																																											_1: {
																																																												ctor: '::',
																																																												_0: _user$project$Elm_Page_Office_Format$justText('COLLECT OF DAY GOES HERE'),
																																																												_1: {
																																																													ctor: '::',
																																																													_0: _user$project$Elm_Views_Collects$epCollectOfDay(model.lessons.dayOfWeek),
																																																													_1: {
																																																														ctor: '::',
																																																														_0: _user$project$Elm_Page_Office_Format$rubric('The Officiant may invite the People to offer intercessions and thanksgivings.'),
																																																														_1: {
																																																															ctor: '::',
																																																															_0: _user$project$Elm_Page_Office_Format$rubric('A hymn or anthem may be sung.'),
																																																															_1: {
																																																																ctor: '::',
																																																																_0: _user$project$Elm_Page_Office_Prayers$generalThanksgiving,
																																																																_1: {
																																																																	ctor: '::',
																																																																	_0: _user$project$Elm_Page_Office_Prayers$chrysostom,
																																																																	_1: {
																																																																		ctor: '::',
																																																																		_0: _user$project$Elm_Page_Office_Format$versicals(
																																																																			{
																																																																				ctor: '::',
																																																																				_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Let us bless the Lord.'},
																																																																				_1: {
																																																																					ctor: '::',
																																																																					_0: {ctor: '_Tuple2', _0: 'People', _1: 'Thanks be to God.'},
																																																																					_1: {ctor: '[]'}
																																																																				}
																																																																			}),
																																																																		_1: {
																																																																			ctor: '::',
																																																																			_0: _user$project$Elm_Page_Office_Format$rubric('From Easter Day through the Day of Pentecost “Alleluia, alleluia” may be added to the preceding versicle and response.'),
																																																																			_1: {
																																																																				ctor: '::',
																																																																				_0: _user$project$Elm_Page_Office_Format$rubric('The Officiant says one of these concluding sentences (and the People may be invited to join)'),
																																																																				_1: {
																																																																					ctor: '::',
																																																																					_0: _user$project$Elm_Page_Office_Format$withAmen('\n                  The grace of our Lord Jesus Christ, and the love of God, and the fellowship of the Holy Spirit, be\n                  with us all evermore.\n                '),
																																																																					_1: {
																																																																						ctor: '::',
																																																																						_0: _user$project$Elm_Page_Office_Format$reference('2 Corinthians 13:14'),
																																																																						_1: {
																																																																							ctor: '::',
																																																																							_0: _user$project$Elm_Page_Office_Format$withAmen('\n                  May the God of hope fill us with all joy and peace in believing through the power of the Holy Spirit.\n                '),
																																																																							_1: {
																																																																								ctor: '::',
																																																																								_0: _user$project$Elm_Page_Office_Format$reference('Romans 15:13'),
																																																																								_1: {
																																																																									ctor: '::',
																																																																									_0: _user$project$Elm_Page_Office_Format$withAmen('\n                  Glory to God whose power, working in us, can do infinitely more than we can ask or imagine: Glory\n                  to him from generation to generation in the Church, and in Christ Jesus forever and ever.\n                '),
																																																																									_1: {
																																																																										ctor: '::',
																																																																										_0: _user$project$Elm_Page_Office_Format$reference('Ephesians 3:20-21'),
																																																																										_1: {
																																																																											ctor: '::',
																																																																											_0: A2(
																																																																												_elm_lang$html$Html$button,
																																																																												{
																																																																													ctor: '::',
																																																																													_0: _elm_lang$html$Html_Attributes$class('iphod'),
																																																																													_1: {
																																																																														ctor: '::',
																																																																														_0: _elm_lang$html$Html_Events$onClick(_user$project$Elm_Page_EP$ShowDirections),
																																																																														_1: {ctor: '[]'}
																																																																													}
																																																																												},
																																																																												{
																																																																													ctor: '::',
																																																																													_0: _elm_lang$html$Html$text('Additional Directions'),
																																																																													_1: {ctor: '[]'}
																																																																												}),
																																																																											_1: {
																																																																												ctor: '::',
																																																																												_0: _user$project$Elm_Page_Office_Format$mpepAdditionalDirectives(model.showDirections),
																																																																												_1: {ctor: '[]'}
																																																																											}
																																																																										}
																																																																									}
																																																																								}
																																																																							}
																																																																						}
																																																																					}
																																																																				}
																																																																			}
																																																																		}
																																																																	}
																																																																}
																																																															}
																																																														}
																																																													}
																																																												}
																																																											}
																																																										}
																																																									}
																																																								}
																																																							}
																																																						}
																																																					}
																																																				}
																																																			}
																																																		}
																																																	}
																																																}
																																															}
																																														}
																																													}
																																												}
																																											}
																																										}
																																									}
																																								}
																																							}
																																						}
																																					}
																																				}
																																			}
																																		}
																																	}
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}),
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$Elm_Page_EP$SetLessons = function (a) {
	return {ctor: 'SetLessons', _0: a};
};
var _user$project$Elm_Page_EP$subscriptions = function (model) {
	return _elm_lang$core$Platform_Sub$batch(
		{
			ctor: '::',
			_0: A2(_elm_lang$core$Platform_Sub$map, _user$project$Elm_Page_EP$SetLessons, _user$project$Elm_Page_EP$lessonsChange),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_EP$FetchLessons = {ctor: 'FetchLessons'};
var _user$project$Elm_Page_EP$init = function () {
	var newModel = _user$project$Elm_Page_EP$initNew;
	return A2(_user$project$Elm_Page_EP$update, _user$project$Elm_Page_EP$FetchLessons, newModel);
}();
var _user$project$Elm_Page_EP$NoOp = {ctor: 'NoOp'};

var _user$project$Elm_Views_Article_Feed$isTagFeed = function (source) {
	var _p0 = source;
	if (_p0.ctor === 'TagFeed') {
		return true;
	} else {
		return false;
	}
};
var _user$project$Elm_Views_Article_Feed$selectFeedSource = F2(
	function (source, sources) {
		var withoutTags = A2(
			_elm_lang$core$List$filter,
			function (_p1) {
				return !_user$project$Elm_Views_Article_Feed$isTagFeed(_p1);
			},
			_rtfeldman$selectlist$SelectList$toList(sources));
		var newSources = function () {
			var _p2 = source;
			switch (_p2.ctor) {
				case 'YourFeed':
					return withoutTags;
				case 'GlobalFeed':
					return withoutTags;
				case 'FavoritedFeed':
					return withoutTags;
				case 'AuthorFeed':
					return withoutTags;
				default:
					return A2(
						_elm_lang$core$Basics_ops['++'],
						withoutTags,
						{
							ctor: '::',
							_0: source,
							_1: {ctor: '[]'}
						});
			}
		}();
		var _p3 = newSources;
		if (_p3.ctor === '[]') {
			return sources;
		} else {
			return A2(
				_rtfeldman$selectlist$SelectList$select,
				F2(
					function (x, y) {
						return _elm_lang$core$Native_Utils.eq(x, y);
					})(source),
				A3(
					_rtfeldman$selectlist$SelectList$fromLists,
					{ctor: '[]'},
					_p3._0,
					_p3._1));
		}
	});
var _user$project$Elm_Views_Article_Feed$replaceArticle = F2(
	function (newArticle, oldArticle) {
		return _elm_lang$core$Native_Utils.eq(newArticle.slug, oldArticle.slug) ? newArticle : oldArticle;
	});
var _user$project$Elm_Views_Article_Feed$scrollToTop = A2(
	_elm_lang$core$Task$onError,
	function (_p4) {
		return _elm_lang$core$Task$succeed(
			{ctor: '_Tuple0'});
	},
	_elm_lang$dom$Dom_Scroll$toTop(_user$project$Elm_Views_Page$bodyId));
var _user$project$Elm_Views_Article_Feed$limit = function (feedSource) {
	var _p5 = feedSource;
	switch (_p5.ctor) {
		case 'YourFeed':
			return 10;
		case 'GlobalFeed':
			return 10;
		case 'TagFeed':
			return 10;
		case 'FavoritedFeed':
			return 5;
		default:
			return 5;
	}
};
var _user$project$Elm_Views_Article_Feed$fetch = F3(
	function (token, page, feedSource) {
		var articlesPerPage = _user$project$Elm_Views_Article_Feed$limit(feedSource);
		var offset = (page - 1) * articlesPerPage;
		var defaultListConfig = _user$project$Elm_Request_Article$defaultListConfig;
		var listConfig = _elm_lang$core$Native_Utils.update(
			defaultListConfig,
			{offset: offset, limit: articlesPerPage});
		var task = function () {
			var _p6 = feedSource;
			switch (_p6.ctor) {
				case 'YourFeed':
					var defaultFeedConfig = _user$project$Elm_Request_Article$defaultFeedConfig;
					var feedConfig = _elm_lang$core$Native_Utils.update(
						defaultFeedConfig,
						{offset: offset, limit: articlesPerPage});
					return A2(
						_elm_lang$core$Maybe$withDefault,
						_elm_lang$core$Task$fail(
							_elm_lang$http$Http$BadUrl('You need to be signed in to view your feed.')),
						A2(
							_elm_lang$core$Maybe$map,
							function (_p7) {
								return _elm_lang$http$Http$toTask(
									A2(_user$project$Elm_Request_Article$feed, feedConfig, _p7));
							},
							token));
				case 'GlobalFeed':
					return _elm_lang$http$Http$toTask(
						A2(_user$project$Elm_Request_Article$list, listConfig, token));
				case 'TagFeed':
					return _elm_lang$http$Http$toTask(
						A2(
							_user$project$Elm_Request_Article$list,
							_elm_lang$core$Native_Utils.update(
								listConfig,
								{
									tag: _elm_lang$core$Maybe$Just(_p6._0)
								}),
							token));
				case 'FavoritedFeed':
					return _elm_lang$http$Http$toTask(
						A2(
							_user$project$Elm_Request_Article$list,
							_elm_lang$core$Native_Utils.update(
								listConfig,
								{
									favorited: _elm_lang$core$Maybe$Just(_p6._0)
								}),
							token));
				default:
					return _elm_lang$http$Http$toTask(
						A2(
							_user$project$Elm_Request_Article$list,
							_elm_lang$core$Native_Utils.update(
								listConfig,
								{
									author: _elm_lang$core$Maybe$Just(_p6._0)
								}),
							token));
			}
		}();
		return A2(
			_elm_lang$core$Task$map,
			function (feed) {
				return {ctor: '_Tuple2', _0: page, _1: feed};
			},
			task);
	});
var _user$project$Elm_Views_Article_Feed$sourceName = function (source) {
	var _p8 = source;
	switch (_p8.ctor) {
		case 'YourFeed':
			return 'Your Feed';
		case 'GlobalFeed':
			return 'Global Feed';
		case 'TagFeed':
			return A2(
				_elm_lang$core$Basics_ops['++'],
				'#',
				_user$project$Elm_Data_Article$tagToString(_p8._0));
		case 'FavoritedFeed':
			return 'Favorite Articles';
		default:
			return 'My Articles';
	}
};
var _user$project$Elm_Views_Article_Feed$InternalModel = F5(
	function (a, b, c, d, e) {
		return {errors: a, feed: b, feedSources: c, activePage: d, isLoading: e};
	});
var _user$project$Elm_Views_Article_Feed$Model = function (a) {
	return {ctor: 'Model', _0: a};
};
var _user$project$Elm_Views_Article_Feed$init = F2(
	function (session, feedSources) {
		return _user$project$Elm_Views_Article_Feed$Model(
			{
				errors: {ctor: '[]'},
				feed: _user$project$Elm_Data_Article_Feed$init,
				feedSources: feedSources,
				activePage: 1,
				isLoading: true
			});
	});
var _user$project$Elm_Views_Article_Feed$SetFeed = function (a) {
	return {ctor: 'SetFeed', _0: a};
};
var _user$project$Elm_Views_Article_Feed$SelectPage = function (a) {
	return {ctor: 'SelectPage', _0: a};
};
var _user$project$Elm_Views_Article_Feed$pageLink = F2(
	function (page, isActive) {
		return A2(
			_elm_lang$html$Html$li,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$classList(
					{
						ctor: '::',
						_0: A2(_user$project$Elm_Util_ops['=>'], 'page-item', true),
						_1: {
							ctor: '::',
							_0: A2(_user$project$Elm_Util_ops['=>'], 'active', isActive),
							_1: {ctor: '[]'}
						}
					}),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$a,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('page-link'),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$href('javascript:void(0);'),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Events$onClick(
									_user$project$Elm_Views_Article_Feed$SelectPage(page)),
								_1: {ctor: '[]'}
							}
						}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text(
							_elm_lang$core$Basics$toString(page)),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			});
	});
var _user$project$Elm_Views_Article_Feed$pagination = F3(
	function (activePage, feed, feedSource) {
		var articlesPerPage = _user$project$Elm_Views_Article_Feed$limit(feedSource);
		var totalPages = _elm_lang$core$Basics$ceiling(
			_elm_lang$core$Basics$toFloat(feed.articlesCount) / _elm_lang$core$Basics$toFloat(articlesPerPage));
		return (_elm_lang$core$Native_Utils.cmp(totalPages, 1) > 0) ? A2(
			_elm_lang$html$Html$ul,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('pagination '),
				_1: {ctor: '[]'}
			},
			A2(
				_elm_lang$core$List$map,
				function (page) {
					return A2(
						_user$project$Elm_Views_Article_Feed$pageLink,
						page,
						_elm_lang$core$Native_Utils.eq(page, activePage));
				},
				A2(_elm_lang$core$List$range, 1, totalPages))) : _elm_lang$html$Html$text('');
	});
var _user$project$Elm_Views_Article_Feed$FavoriteCompleted = function (a) {
	return {ctor: 'FavoriteCompleted', _0: a};
};
var _user$project$Elm_Views_Article_Feed$ToggleFavorite = function (a) {
	return {ctor: 'ToggleFavorite', _0: a};
};
var _user$project$Elm_Views_Article_Feed$viewArticles = function (_p9) {
	var _p10 = _p9;
	var _p11 = _p10._0.feed;
	return A2(
		_elm_lang$core$Basics_ops['++'],
		A2(
			_elm_lang$core$List$map,
			_user$project$Elm_Views_Article$view(_user$project$Elm_Views_Article_Feed$ToggleFavorite),
			_p11.articles),
		{
			ctor: '::',
			_0: A3(
				_user$project$Elm_Views_Article_Feed$pagination,
				_p10._0.activePage,
				_p11,
				_rtfeldman$selectlist$SelectList$selected(_p10._0.feedSources)),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Views_Article_Feed$FeedLoadCompleted = F2(
	function (a, b) {
		return {ctor: 'FeedLoadCompleted', _0: a, _1: b};
	});
var _user$project$Elm_Views_Article_Feed$updateInternal = F3(
	function (session, msg, model) {
		var _p12 = msg;
		switch (_p12.ctor) {
			case 'DismissErrors':
				return A2(
					_user$project$Elm_Util_ops['=>'],
					_elm_lang$core$Native_Utils.update(
						model,
						{
							errors: {ctor: '[]'}
						}),
					_elm_lang$core$Platform_Cmd$none);
			case 'SelectFeedSource':
				var _p13 = _p12._0;
				return A2(
					_user$project$Elm_Util$pair,
					_elm_lang$core$Native_Utils.update(
						model,
						{isLoading: true}),
					A2(
						_elm_lang$core$Task$attempt,
						_user$project$Elm_Views_Article_Feed$FeedLoadCompleted(_p13),
						A3(
							_user$project$Elm_Views_Article_Feed$fetch,
							A2(
								_elm_lang$core$Maybe$map,
								function (_) {
									return _.token;
								},
								session.user),
							1,
							_p13)));
			case 'FeedLoadCompleted':
				if (_p12._1.ctor === 'Ok') {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								feed: _p12._1._0._1,
								feedSources: A2(_user$project$Elm_Views_Article_Feed$selectFeedSource, _p12._0, model.feedSources),
								activePage: _p12._1._0._0,
								isLoading: false
							}),
						_elm_lang$core$Platform_Cmd$none);
				} else {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								errors: A2(
									_elm_lang$core$Basics_ops['++'],
									model.errors,
									{
										ctor: '::',
										_0: 'Server error while trying to load feed',
										_1: {ctor: '[]'}
									}),
								isLoading: false
							}),
						_elm_lang$core$Platform_Cmd$none);
				}
			case 'ToggleFavorite':
				var _p14 = session.user;
				if (_p14.ctor === 'Nothing') {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								errors: A2(
									_elm_lang$core$Basics_ops['++'],
									model.errors,
									{
										ctor: '::',
										_0: 'You are currently signed out. You must sign in go favorite articles.',
										_1: {ctor: '[]'}
									})
							}),
						_elm_lang$core$Platform_Cmd$none);
				} else {
					return A2(
						_user$project$Elm_Util$pair,
						model,
						A2(
							_elm_lang$http$Http$send,
							_user$project$Elm_Views_Article_Feed$FavoriteCompleted,
							A2(_user$project$Elm_Request_Article$toggleFavorite, _p12._0, _p14._0.token)));
				}
			case 'FavoriteCompleted':
				if (_p12._0.ctor === 'Ok') {
					var feed = model.feed;
					var newFeed = _elm_lang$core$Native_Utils.update(
						feed,
						{
							articles: A2(
								_elm_lang$core$List$map,
								_user$project$Elm_Views_Article_Feed$replaceArticle(_p12._0._0),
								feed.articles)
						});
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{feed: newFeed}),
						_elm_lang$core$Platform_Cmd$none);
				} else {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								errors: A2(
									_elm_lang$core$Basics_ops['++'],
									model.errors,
									{
										ctor: '::',
										_0: 'Server error while trying to favorite article',
										_1: {ctor: '[]'}
									})
							}),
						_elm_lang$core$Platform_Cmd$none);
				}
			case 'SelectPage':
				var source = _rtfeldman$selectlist$SelectList$selected(model.feedSources);
				return A2(
					_user$project$Elm_Util$pair,
					model,
					A2(
						_elm_lang$core$Task$attempt,
						_user$project$Elm_Views_Article_Feed$FeedLoadCompleted(source),
						A2(
							_elm_lang$core$Task$andThen,
							function (feed) {
								return A2(
									_elm_lang$core$Task$map,
									function (_p15) {
										return feed;
									},
									_user$project$Elm_Views_Article_Feed$scrollToTop);
							},
							A3(
								_user$project$Elm_Views_Article_Feed$fetch,
								A2(
									_elm_lang$core$Maybe$map,
									function (_) {
										return _.token;
									},
									session.user),
								_p12._0,
								source))));
			default:
				if (_p12._0.ctor === 'Just') {
					return A2(_user$project$Elm_Util_ops['=>'], _p12._0._0, _elm_lang$core$Platform_Cmd$none);
				} else {
					return A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none);
				}
		}
	});
var _user$project$Elm_Views_Article_Feed$update = F3(
	function (session, msg, _p16) {
		var _p17 = _p16;
		return A2(
			_elm_lang$core$Tuple$mapFirst,
			_user$project$Elm_Views_Article_Feed$Model,
			A3(_user$project$Elm_Views_Article_Feed$updateInternal, session, msg, _p17._0));
	});
var _user$project$Elm_Views_Article_Feed$SelectFeedSource = function (a) {
	return {ctor: 'SelectFeedSource', _0: a};
};
var _user$project$Elm_Views_Article_Feed$viewFeedSource = F2(
	function (position, source) {
		return A2(
			_elm_lang$html$Html$li,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('nav-item'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$a,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$classList(
							{
								ctor: '::',
								_0: A2(_user$project$Elm_Util_ops['=>'], 'nav-link', true),
								_1: {
									ctor: '::',
									_0: A2(
										_user$project$Elm_Util_ops['=>'],
										'active',
										_elm_lang$core$Native_Utils.eq(position, _rtfeldman$selectlist$SelectList$Selected)),
									_1: {ctor: '[]'}
								}
							}),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$href('javascript:void(0);'),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Events$onClick(
									_user$project$Elm_Views_Article_Feed$SelectFeedSource(source)),
								_1: {ctor: '[]'}
							}
						}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text(
							_user$project$Elm_Views_Article_Feed$sourceName(source)),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			});
	});
var _user$project$Elm_Views_Article_Feed$DismissErrors = {ctor: 'DismissErrors'};
var _user$project$Elm_Views_Article_Feed$viewFeedSources = function (_p18) {
	var _p19 = _p18;
	return A2(
		_elm_lang$html$Html$ul,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('nav nav-pills outline-active'),
			_1: {ctor: '[]'}
		},
		A2(
			_elm_lang$core$Basics_ops['++'],
			_rtfeldman$selectlist$SelectList$toList(
				A2(_rtfeldman$selectlist$SelectList$mapBy, _user$project$Elm_Views_Article_Feed$viewFeedSource, _p19._0.feedSources)),
			{
				ctor: '::',
				_0: A2(_user$project$Elm_Views_Errors$view, _user$project$Elm_Views_Article_Feed$DismissErrors, _p19._0.errors),
				_1: {
					ctor: '::',
					_0: A2(_user$project$Elm_Util$viewIf, _p19._0.isLoading, _user$project$Elm_Views_Spinner$spinner),
					_1: {ctor: '[]'}
				}
			}));
};
var _user$project$Elm_Views_Article_Feed$AuthorFeed = function (a) {
	return {ctor: 'AuthorFeed', _0: a};
};
var _user$project$Elm_Views_Article_Feed$authorFeed = _user$project$Elm_Views_Article_Feed$AuthorFeed;
var _user$project$Elm_Views_Article_Feed$FavoritedFeed = function (a) {
	return {ctor: 'FavoritedFeed', _0: a};
};
var _user$project$Elm_Views_Article_Feed$favoritedFeed = _user$project$Elm_Views_Article_Feed$FavoritedFeed;
var _user$project$Elm_Views_Article_Feed$TagFeed = function (a) {
	return {ctor: 'TagFeed', _0: a};
};
var _user$project$Elm_Views_Article_Feed$tagFeed = _user$project$Elm_Views_Article_Feed$TagFeed;
var _user$project$Elm_Views_Article_Feed$selectTag = F2(
	function (maybeAuthToken, tagName) {
		var source = _user$project$Elm_Views_Article_Feed$tagFeed(tagName);
		return A2(
			_elm_lang$core$Task$attempt,
			_user$project$Elm_Views_Article_Feed$FeedLoadCompleted(source),
			A3(_user$project$Elm_Views_Article_Feed$fetch, maybeAuthToken, 1, source));
	});
var _user$project$Elm_Views_Article_Feed$GlobalFeed = {ctor: 'GlobalFeed'};
var _user$project$Elm_Views_Article_Feed$globalFeed = _user$project$Elm_Views_Article_Feed$GlobalFeed;
var _user$project$Elm_Views_Article_Feed$YourFeed = {ctor: 'YourFeed'};
var _user$project$Elm_Views_Article_Feed$yourFeed = _user$project$Elm_Views_Article_Feed$YourFeed;
var _user$project$Elm_Views_Article_Feed$initFeedSources = A3(
	_rtfeldman$selectlist$SelectList$fromLists,
	{ctor: '[]'},
	_user$project$Elm_Views_Article_Feed$yourFeed,
	{
		ctor: '::',
		_0: _user$project$Elm_Views_Article_Feed$globalFeed,
		_1: {
			ctor: '::',
			_0: _user$project$Elm_Views_Article_Feed$tagFeed(_user$project$Elm_Data_Article$initTag),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Views_Article_Feed$favoritedFeed(_user$project$Elm_Data_User$initUsername),
				_1: {
					ctor: '::',
					_0: _user$project$Elm_Views_Article_Feed$authorFeed(_user$project$Elm_Data_User$initUsername),
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Elm_Views_Article_Feed$decoder = A2(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$hardcoded,
	true,
	A2(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$hardcoded,
		1,
		A2(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$hardcoded,
			_user$project$Elm_Views_Article_Feed$initFeedSources,
			A2(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$hardcoded,
				_user$project$Elm_Data_Article_Feed$init,
				A3(
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
					'errors',
					_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string),
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Views_Article_Feed$InternalModel))))));

var _user$project$Elm_Page_Home$update = F3(
	function (session, msg, model) {
		var _p0 = msg;
		switch (_p0.ctor) {
			case 'SetFeed':
				if (_p0._0.ctor === 'Just') {
					return A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none);
				} else {
					return A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none);
				}
			case 'SelectTag':
				var _p3 = _p0._0;
				var _p1 = A2(_elm_lang$core$Debug$log, 'FEED SOURCE: ', model.feedSources);
				var _p2 = A2(_elm_lang$core$Debug$log, 'TAG NAME: ', _p3);
				return A2(
					_user$project$Elm_Util_ops['=>'],
					model,
					_elm_lang$core$Platform_Cmd$batch(
						{
							ctor: '::',
							_0: A4(_user$project$Elm_Ports$requestFeed, session.user, _p3.name, 20, 0),
							_1: {
								ctor: '::',
								_0: _elm_lang$core$Platform_Cmd$none,
								_1: {ctor: '[]'}
							}
						}));
			default:
				var _p4 = A2(_elm_lang$core$Debug$log, 'SelectArticle: ', _p0._0);
				return A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none);
		}
	});
var _user$project$Elm_Page_Home$viewBanner = A2(
	_elm_lang$html$Html$div,
	{
		ctor: '::',
		_0: _elm_lang$html$Html_Attributes$class('bg-green w-100 ph3 pv3 pv4-ns ph4-m ph5-l'),
		_1: {ctor: '[]'}
	},
	{
		ctor: '::',
		_0: A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class(''),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$h2,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class(''),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('The Door'),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$span,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('A place to share your knowledge'),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}
			}),
		_1: {ctor: '[]'}
	});
var _user$project$Elm_Page_Home$init = F2(
	function (session, feed) {
		var feedSources = _elm_lang$core$Native_Utils.eq(session.user, _elm_lang$core$Maybe$Nothing) ? _rtfeldman$selectlist$SelectList$singleton(_user$project$Elm_Views_Article_Feed$globalFeed) : A3(
			_rtfeldman$selectlist$SelectList$fromLists,
			{ctor: '[]'},
			_user$project$Elm_Views_Article_Feed$yourFeed,
			{
				ctor: '::',
				_0: _user$project$Elm_Views_Article_Feed$globalFeed,
				_1: {ctor: '[]'}
			});
		var feedMe = _user$project$Elm_Views_Article_Feed$sourceName(
			_rtfeldman$selectlist$SelectList$selected(feedSources));
		return {
			tags: feed.tags,
			errors: {ctor: '[]'},
			feed: feed,
			feedSources: _user$project$Elm_Views_Article_Feed$initFeedSources,
			activePage: 0,
			isLoading: true
		};
	});
var _user$project$Elm_Page_Home$userParams = _elm_lang$core$Json_Encode$object(
	{
		ctor: '::',
		_0: {
			ctor: '_Tuple2',
			_0: 'user_id',
			_1: _elm_lang$core$Json_Encode$string('123')
		},
		_1: {ctor: '[]'}
	});
var _user$project$Elm_Page_Home$Model = F6(
	function (a, b, c, d, e, f) {
		return {tags: a, errors: b, feed: c, feedSources: d, activePage: e, isLoading: f};
	});
var _user$project$Elm_Page_Home$decoder = A2(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$hardcoded,
	true,
	A2(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$hardcoded,
		1,
		A2(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$hardcoded,
			_user$project$Elm_Views_Article_Feed$initFeedSources,
			A2(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$hardcoded,
				_user$project$Elm_Data_Article_Feed$init,
				A3(
					_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
					'errors',
					_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string),
					A2(
						_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$hardcoded,
						{ctor: '[]'},
						_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Page_Home$Model)))))));
var _user$project$Elm_Page_Home$SelectArticle = function (a) {
	return {ctor: 'SelectArticle', _0: a};
};
var _user$project$Elm_Page_Home$viewArticle = function (article) {
	return {
		ctor: '::',
		_0: A2(
			_elm_lang$html$Html$li,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class(''),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Events$onClick(
						_user$project$Elm_Page_Home$SelectArticle(article)),
					_1: {ctor: '[]'}
				}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$img,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('mw4 fl'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Data_UserPhoto$src(article.author.image),
							_1: {ctor: '[]'}
						}
					},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$p,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class(''),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(article.title),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$p,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class(''),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(
									A2(
										_elm_lang$core$Basics_ops['++'],
										'by ',
										_user$project$Elm_Data_User$usernameToString(article.author.username))),
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					}
				}
			}),
		_1: {
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$li,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class(''),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text(article.description),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$li,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: A2(
							_user$project$Elm_Data_Article$bodyPreviewHtml,
							article.body,
							{ctor: '[]'}),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			}
		}
	};
};
var _user$project$Elm_Page_Home$viewFeed = function (feed) {
	var listThis = function (art) {
		return A2(
			_elm_lang$html$Html$ul,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('list pl0'),
				_1: {ctor: '[]'}
			},
			_user$project$Elm_Page_Home$viewArticle(art));
	};
	return A2(_elm_lang$core$List$map, listThis, feed.articles);
};
var _user$project$Elm_Page_Home$SetFeed = function (a) {
	return {ctor: 'SetFeed', _0: a};
};
var _user$project$Elm_Page_Home$SelectTag = function (a) {
	return {ctor: 'SelectTag', _0: a};
};
var _user$project$Elm_Page_Home$viewTag = function (tagName) {
	return A2(
		_elm_lang$html$Html$a,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('b--green f3 ba br3 pa1 ma2'),
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$href('javascript:void(0)'),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Events$onClick(
						_user$project$Elm_Page_Home$SelectTag(tagName)),
					_1: {ctor: '[]'}
				}
			}
		},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(
				_user$project$Elm_Data_Article$tagToString(tagName)),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Home$viewTags = function (tags) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('flex flex-wrap'),
			_1: {ctor: '[]'}
		},
		A2(_elm_lang$core$List$map, _user$project$Elm_Page_Home$viewTag, tags));
};
var _user$project$Elm_Page_Home$view = F2(
	function (session, model) {
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class(''),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _user$project$Elm_Page_Home$viewBanner,
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('ml0 pl0'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('fl w-60'),
									_1: {ctor: '[]'}
								},
								_user$project$Elm_Page_Home$viewFeed(model.feed)),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('fr w-40'),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$p,
											{ctor: '[]'},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('Popular Tags'),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Home$viewTags(model.tags),
											_1: {ctor: '[]'}
										}
									}),
								_1: {ctor: '[]'}
							}
						}),
					_1: {ctor: '[]'}
				}
			});
	});

var _user$project$Elm_Request_User$storeSession = function (user) {
	return _user$project$Elm_Ports$storeSession(
		_elm_lang$core$Maybe$Just(
			A2(
				_elm_lang$core$Json_Encode$encode,
				0,
				_user$project$Elm_Data_User$encode(user))));
};

var _user$project$Elm_Page_Login$optionalError = function (fieldName) {
	var errorToString = function (errorMessage) {
		return A2(
			_elm_lang$core$String$join,
			' ',
			{
				ctor: '::',
				_0: fieldName,
				_1: {
					ctor: '::',
					_0: errorMessage,
					_1: {ctor: '[]'}
				}
			});
	};
	return A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optional,
		fieldName,
		_elm_lang$core$Json_Decode$list(
			A2(_elm_lang$core$Json_Decode$map, errorToString, _elm_lang$core$Json_Decode$string)),
		{ctor: '[]'});
};
var _user$project$Elm_Page_Login$errorsDecoder = A2(
	_user$project$Elm_Page_Login$optionalError,
	'password',
	A2(
		_user$project$Elm_Page_Login$optionalError,
		'username',
		A2(
			_user$project$Elm_Page_Login$optionalError,
			'name',
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(
				F3(
					function (name, username, password) {
						return _elm_lang$core$List$concat(
							{
								ctor: '::',
								_0: name,
								_1: {
									ctor: '::',
									_0: username,
									_1: {
										ctor: '::',
										_0: password,
										_1: {ctor: '[]'}
									}
								}
							});
					})))));
var _user$project$Elm_Page_Login$logInSuccess = _user$project$Elm_Ports$logInSuccess(
	function (_p0) {
		return _elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$Elm_Data_User$decoder, _p0));
	});
var _user$project$Elm_Page_Login$initialModel = {
	errors: {ctor: '[]'},
	name: '',
	password: '',
	ok: false
};
var _user$project$Elm_Page_Login$LogInFail = F4(
	function (a, b, c, d) {
		return {status: a, error: b, name: c, reason: d};
	});
var _user$project$Elm_Page_Login$loginFailDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'reason',
	_elm_lang$core$Json_Decode$string,
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'name',
		_elm_lang$core$Json_Decode$string,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'error',
			_elm_lang$core$Json_Decode$string,
			A3(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
				'status',
				_elm_lang$core$Json_Decode$int,
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Page_Login$LogInFail)))));
var _user$project$Elm_Page_Login$logInFail = _user$project$Elm_Ports$logInFail(
	function (_p1) {
		return _elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$Elm_Page_Login$loginFailDecoder, _p1));
	});
var _user$project$Elm_Page_Login$Model = F4(
	function (a, b, c, d) {
		return {errors: a, name: b, password: c, ok: d};
	});
var _user$project$Elm_Page_Login$LogInFailure = function (a) {
	return {ctor: 'LogInFailure', _0: a};
};
var _user$project$Elm_Page_Login$LogInSuccess = function (a) {
	return {ctor: 'LogInSuccess', _0: a};
};
var _user$project$Elm_Page_Login$subscriptions = function (model) {
	return _elm_lang$core$Platform_Sub$batch(
		{
			ctor: '::',
			_0: A2(_elm_lang$core$Platform_Sub$map, _user$project$Elm_Page_Login$LogInFailure, _user$project$Elm_Page_Login$logInFail),
			_1: {
				ctor: '::',
				_0: A2(_elm_lang$core$Platform_Sub$map, _user$project$Elm_Page_Login$LogInSuccess, _user$project$Elm_Page_Login$logInSuccess),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Elm_Page_Login$SetPassword = function (a) {
	return {ctor: 'SetPassword', _0: a};
};
var _user$project$Elm_Page_Login$SetEmail = function (a) {
	return {ctor: 'SetEmail', _0: a};
};
var _user$project$Elm_Page_Login$SubmitForm = {ctor: 'SubmitForm'};
var _user$project$Elm_Page_Login$viewForm = A2(
	_elm_lang$html$Html$form,
	{
		ctor: '::',
		_0: _elm_lang$html$Html_Events$onSubmit(_user$project$Elm_Page_Login$SubmitForm),
		_1: {ctor: '[]'}
	},
	{
		ctor: '::',
		_0: A2(
			_user$project$Elm_Views_Form$input,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('form-control-lg'),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$placeholder('Email'),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Events$onInput(_user$project$Elm_Page_Login$SetEmail),
						_1: {ctor: '[]'}
					}
				}
			},
			{ctor: '[]'}),
		_1: {
			ctor: '::',
			_0: A2(
				_user$project$Elm_Views_Form$password,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('form-control-lg'),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$placeholder('Password'),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Events$onInput(_user$project$Elm_Page_Login$SetPassword),
							_1: {ctor: '[]'}
						}
					}
				},
				{ctor: '[]'}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$button,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('btn btn-lg btn-primary pull-xs-right'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('Sign in'),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Elm_Page_Login$view = F2(
	function (session, model) {
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('auth-page'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('container page'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('col-md-6 offset-md-3 col-xs-12'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$h1,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('text-xs-center'),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text('Sign in'),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$p,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('text-xs-center'),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$a,
												{
													ctor: '::',
													_0: _user$project$Elm_Route$href(_user$project$Elm_Route$Register),
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Need an account?'),
													_1: {ctor: '[]'}
												}),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Views_Form$viewErrors(model.errors),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Login$viewForm,
											_1: {ctor: '[]'}
										}
									}
								}
							}),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			});
	});
var _user$project$Elm_Page_Login$SetUser = function (a) {
	return {ctor: 'SetUser', _0: a};
};
var _user$project$Elm_Page_Login$NoOp = {ctor: 'NoOp'};
var _user$project$Elm_Page_Login$Password = {ctor: 'Password'};
var _user$project$Elm_Page_Login$Email = {ctor: 'Email'};
var _user$project$Elm_Page_Login$modelValidator = _rtfeldman$elm_validate$Validate$all(
	{
		ctor: '::',
		_0: A2(
			_rtfeldman$elm_validate$Validate$ifBlank,
			function (_) {
				return _.name;
			},
			A2(_user$project$Elm_Util_ops['=>'], _user$project$Elm_Page_Login$Email, 'email can\'t be blank.')),
		_1: {
			ctor: '::',
			_0: A2(
				_rtfeldman$elm_validate$Validate$ifBlank,
				function (_) {
					return _.password;
				},
				A2(_user$project$Elm_Util_ops['=>'], _user$project$Elm_Page_Login$Password, 'password can\'t be blank')),
			_1: {ctor: '[]'}
		}
	});
var _user$project$Elm_Page_Login$Form = {ctor: 'Form'};
var _user$project$Elm_Page_Login$update = F2(
	function (msg, model) {
		var _p2 = msg;
		switch (_p2.ctor) {
			case 'LogInFailure':
				if (_p2._0.ctor === 'Just') {
					var newErrors = A2(
						_elm_lang$core$List$map,
						function (errorMessage) {
							return A2(_user$project$Elm_Util_ops['=>'], _user$project$Elm_Page_Login$Form, errorMessage);
						},
						{
							ctor: '::',
							_0: _p2._0._0.reason,
							_1: {ctor: '[]'}
						});
					return A2(
						_user$project$Elm_Util_ops['=>'],
						A2(
							_user$project$Elm_Util_ops['=>'],
							_elm_lang$core$Native_Utils.update(
								model,
								{errors: newErrors}),
							_elm_lang$core$Platform_Cmd$none),
						_user$project$Elm_Page_Login$NoOp);
				} else {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none),
						_user$project$Elm_Page_Login$NoOp);
				}
			case 'SubmitForm':
				var _p3 = A2(_rtfeldman$elm_validate$Validate$validate, _user$project$Elm_Page_Login$modelValidator, model);
				if (_p3.ctor === '[]') {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						A2(
							_user$project$Elm_Util_ops['=>'],
							_elm_lang$core$Native_Utils.update(
								model,
								{
									errors: {ctor: '[]'}
								}),
							A2(_user$project$Elm_Ports$login, model.name, model.password)),
						_user$project$Elm_Page_Login$NoOp);
				} else {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						A2(
							_user$project$Elm_Util_ops['=>'],
							_elm_lang$core$Native_Utils.update(
								model,
								{errors: _p3}),
							_elm_lang$core$Platform_Cmd$none),
						_user$project$Elm_Page_Login$NoOp);
				}
			case 'SetEmail':
				return A2(
					_user$project$Elm_Util_ops['=>'],
					A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{name: _p2._0}),
						_elm_lang$core$Platform_Cmd$none),
					_user$project$Elm_Page_Login$NoOp);
			case 'SetPassword':
				return A2(
					_user$project$Elm_Util_ops['=>'],
					A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{password: _p2._0}),
						_elm_lang$core$Platform_Cmd$none),
					_user$project$Elm_Page_Login$NoOp);
			default:
				if (_p2._0.ctor === 'Just') {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						A2(
							_user$project$Elm_Util_ops['=>'],
							model,
							_elm_lang$core$Platform_Cmd$batch(
								{
									ctor: '::',
									_0: _user$project$Elm_Request_User$storeSession(_p2._0._0),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Route$modifyUrl(_user$project$Elm_Route$Home),
										_1: {ctor: '[]'}
									}
								})),
						_user$project$Elm_Page_Login$NoOp);
				} else {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none),
						_user$project$Elm_Page_Login$NoOp);
				}
		}
	});

var _user$project$Elm_Views_Antiphon$seasonalAntiphon = F2(
	function (office, season) {
		var _p0 = {ctor: '_Tuple2', _0: office, _1: season};
		if (_p0._0 === 'mp') {
			switch (_p0._1) {
				case 'advent':
					return _user$project$Elm_Page_Office_Format$antiphon(
						{ctor: '_Tuple2', _0: 'Advent', _1: 'Our King and Savior now draws near: * O come, let us adore him.'});
				case 'christmas':
					return _user$project$Elm_Page_Office_Format$antiphon(
						{ctor: '_Tuple2', _0: 'Christmas', _1: 'Alleluia, to us a child is born: * O come, let us adore him. Alleluia.'});
				case 'epiphany':
					return _user$project$Elm_Page_Office_Format$antiphon(
						{ctor: '_Tuple2', _0: 'Epiphany, and the Feast of the Transfiguration', _1: 'The Lord has shown forth his glory: * O come, let us adore him.'});
				case 'presentation':
					return _user$project$Elm_Page_Office_Format$antiphon(
						{ctor: '_Tuple2', _0: 'Presentation and Annunciation', _1: 'The Word was made flesh and dwelt among us: * O come, let us adore him.'});
				case 'annunciation':
					return _user$project$Elm_Page_Office_Format$antiphon(
						{ctor: '_Tuple2', _0: 'Presentation and Annunciation', _1: 'The Word was made flesh and dwelt among us: * O come, let us adore him.'});
				case 'lent':
					return _user$project$Elm_Page_Office_Format$antiphon(
						{ctor: '_Tuple2', _0: 'Lent', _1: 'The Lord is full of compassion and mercy: * O come, let us adore him.'});
				case 'easter':
					return _user$project$Elm_Page_Office_Format$antiphon(
						{ctor: '_Tuple2', _0: 'Easter until Ascension', _1: 'Alleluia. The Lord is risen indeed: * O come, let us adore him. Alleluia.'});
				case 'ascension':
					return _user$project$Elm_Page_Office_Format$antiphon(
						{ctor: '_Tuple2', _0: 'Ascension until Pentecost', _1: 'Alleluia. Christ the Lord has ascended into heaven: * O come, let us adore him. Alleluia'});
				case 'pentecost':
					return _user$project$Elm_Page_Office_Format$antiphon(
						{ctor: '_Tuple2', _0: 'Day of Pentecost', _1: 'Alleluia. The Spirit of the Lord renews the face of the earth: * O come, let us adore him. Alleluia.'});
				case 'trinity':
					return _user$project$Elm_Page_Office_Format$antiphon(
						{ctor: '_Tuple2', _0: 'Trinity Sunday', _1: 'Father, Son, and Holy Spirit, one God: * O come, let us adore him.'});
				case 'rld':
					return _user$project$Elm_Page_Office_Format$antiphon(
						{ctor: '_Tuple2', _0: 'All Saints and other major saints’ days', _1: 'The Lord is glorious in his saints: * O come, let us adore him.'});
				default:
					return _user$project$Elm_Page_Office_Format$antiphon(
						{ctor: '_Tuple2', _0: 'For use at any time', _1: 'The earth is the Lord\'s for he made it: * O come let us adore him.'});
			}
		} else {
			return _user$project$Elm_Page_Office_Format$antiphon(
				{ctor: '_Tuple2', _0: '', _1: ''});
		}
	});
var _user$project$Elm_Views_Antiphon$antiphons = F2(
	function (office, season) {
		var _p1 = office;
		switch (_p1) {
			case 'mp':
				return A2(
					_elm_lang$html$Html$div,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: A2(_user$project$Elm_Views_Antiphon$seasonalAntiphon, office, season),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$orThis,
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$justText('Worship the Lord in the beauty of holiness: * O come let us adore him.'),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$orThis,
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$justText('The mercy of the Lord is everlasting: * O come let us adore him.'),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					});
			case 'ep':
				return A2(
					_elm_lang$html$Html$div,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: A2(_user$project$Elm_Views_Antiphon$seasonalAntiphon, office, season),
						_1: {ctor: '[]'}
					});
			default:
				return A2(
					_elm_lang$html$Html$div,
					{ctor: '[]'},
					{ctor: '[]'});
		}
	});

var _user$project$Elm_Page_MP$lessonsChange = _user$project$Elm_Ports$requestedLessons(
	function (_p0) {
		return _elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$Elm_Data_Lessons$dailyLessonsDecoder, _p0));
	});
var _user$project$Elm_Page_MP$fetchLessons = function (model) {
	return A2(
		_elm_lang$core$Platform_Cmd_ops['!'],
		model,
		{
			ctor: '::',
			_0: _user$project$Elm_Ports$requestLessons('mp'),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_MP$initToggle = {tradionalLordsPrayer: true, teDeum: true, directions: false, options: false};
var _user$project$Elm_Page_MP$initNew = {
	errors: {ctor: '[]'},
	thisOption: '',
	toggle: _user$project$Elm_Page_MP$initToggle,
	lessons: _user$project$Elm_Data_Lessons$initDailyLessons,
	time: 0
};
var _user$project$Elm_Page_MP$initMP = function (lessons) {
	var model = _user$project$Elm_Page_MP$initNew;
	return _elm_lang$core$Native_Utils.update(
		model,
		{lessons: lessons});
};
var _user$project$Elm_Page_MP$Toggle = F4(
	function (a, b, c, d) {
		return {tradionalLordsPrayer: a, teDeum: b, directions: c, options: d};
	});
var _user$project$Elm_Page_MP$Model = F5(
	function (a, b, c, d, e) {
		return {errors: a, thisOption: b, toggle: c, lessons: d, time: e};
	});
var _user$project$Elm_Page_MP$ShowDirections = {ctor: 'ShowDirections'};
var _user$project$Elm_Page_MP$UpdateTime = function (a) {
	return {ctor: 'UpdateTime', _0: a};
};
var _user$project$Elm_Page_MP$update = F2(
	function (msg, model) {
		var _p1 = msg;
		switch (_p1.ctor) {
			case 'NoOp':
				return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
			case 'FetchLessons':
				return {
					ctor: '_Tuple2',
					_0: model,
					_1: _user$project$Elm_Ports$requestLessons('mp')
				};
			case 'SetLessons':
				if (_p1._0.ctor === 'Just') {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							model,
							{lessons: _p1._0._0}),
						_1: _elm_lang$core$Platform_Cmd$none
					};
				} else {
					return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
				}
			case 'MoreOptions':
				var toggle = model.toggle;
				var newToggle = _elm_lang$core$Native_Utils.update(
					toggle,
					{options: !toggle.options});
				var newModel = _elm_lang$core$Native_Utils.update(
					model,
					{toggle: newToggle});
				return {ctor: '_Tuple2', _0: newModel, _1: _elm_lang$core$Platform_Cmd$none};
			case 'RequestTime':
				return {
					ctor: '_Tuple2',
					_0: model,
					_1: A2(_elm_lang$core$Task$perform, _user$project$Elm_Page_MP$UpdateTime, _elm_lang$core$Time$now)
				};
			case 'UpdateTime':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{time: _p1._0}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			default:
				var toggle = model.toggle;
				var newToggle = _elm_lang$core$Native_Utils.update(
					toggle,
					{directions: !toggle.directions});
				var newModel = _elm_lang$core$Native_Utils.update(
					model,
					{toggle: newToggle});
				return {ctor: '_Tuple2', _0: newModel, _1: _elm_lang$core$Platform_Cmd$none};
		}
	});
var _user$project$Elm_Page_MP$RequestTime = {ctor: 'RequestTime'};
var _user$project$Elm_Page_MP$MoreOptions = {ctor: 'MoreOptions'};
var _user$project$Elm_Page_MP$view = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$button,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('more-options'),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Events$onClick(_user$project$Elm_Page_MP$MoreOptions),
						_1: {ctor: '[]'}
					}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('Options'),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: _user$project$Elm_Page_Office_Format$emptyLine,
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class(''),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$p,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class(''),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text('Daily Morning Prayer'),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$p,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text(model.thisOption),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$p,
										{ctor: '[]'},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text(
												A2(
													_elm_lang$core$Basics_ops['++'],
													'Time: ',
													_elm_lang$core$Basics$toString(model.time))),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Views_OpeningSentences$mpOpeningSentences(model.lessons.season),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Page_Office_Prayers$confession,
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Office_Prayers$invitatory,
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$rubric('Alternative forms of the “Glory be” and “Praise the Lord” are found in Additional Directions.'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Format$rubric('Then follows the Venite. Alternatively, the Jubilate may be used.'),
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$rubric('These antiphons may be sung or said before and after the Invitatory Psalm.'),
															_1: {
																ctor: '::',
																_0: A2(_user$project$Elm_Views_Antiphon$antiphons, 'mp', model.lessons.season),
																_1: {
																	ctor: '::',
																	_0: _user$project$Elm_Page_Office_Prayers$venite,
																	_1: {
																		ctor: '::',
																		_0: _user$project$Elm_Page_Office_Format$rubric('In Lent, and on other penitential occasions, the following verses are added.'),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Prayers$lentVeniteAddOn,
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$orThis,
																				_1: {
																					ctor: '::',
																					_0: _user$project$Elm_Page_Office_Prayers$jubilate,
																					_1: {
																						ctor: '::',
																						_0: _user$project$Elm_Page_Office_Format$rubric('During the first week of Easter, the Pascha Nostrum is used in place of the Invitatory Psalm and may be used throughout Eastertide.'),
																						_1: {
																							ctor: '::',
																							_0: _user$project$Elm_Page_Office_Prayers$paschaNostrum,
																							_1: {
																								ctor: '::',
																								_0: _user$project$Elm_Page_Office_Format$rubric('Then follows'),
																								_1: {
																									ctor: '::',
																									_0: _user$project$Elm_Page_Office_Format$pbSection('The Psalm or Psalms Appointed'),
																									_1: {
																										ctor: '::',
																										_0: _user$project$Elm_Views_Psalm$formattedPsalms(model.lessons.psalms),
																										_1: {
																											ctor: '::',
																											_0: _user$project$Elm_Page_Office_Format$rubric('At the end of the Psalms is sung or said'),
																											_1: {
																												ctor: '::',
																												_0: _user$project$Elm_Page_Office_Prayers$gloria,
																												_1: {
																													ctor: '::',
																													_0: _user$project$Elm_Page_Office_Format$pbSection('The Lessons'),
																													_1: {
																														ctor: '::',
																														_0: _user$project$Elm_Page_Office_Format$rubric('One or more lessons, as appointed, are read, the Reader first saying'),
																														_1: {
																															ctor: '::',
																															_0: _user$project$Elm_Views_Lessons$formattedLessons(model.lessons.lesson1),
																															_1: {
																																ctor: '::',
																																_0: _user$project$Elm_Views_Lessons$formattedLessons(model.lessons.lesson2),
																																_1: {
																																	ctor: '::',
																																	_0: _user$project$Elm_Page_Office_Format$rubric('A citation giving chapter and verse may be added.'),
																																	_1: {
																																		ctor: '::',
																																		_0: _user$project$Elm_Page_Office_Format$rubric('After each lesson the Reader may say'),
																																		_1: {
																																			ctor: '::',
																																			_0: _user$project$Elm_Page_Office_Format$wordOfTheLord,
																																			_1: {
																																				ctor: '::',
																																				_0: _user$project$Elm_Page_Office_Format$rubric('Or the Reader may say'),
																																				_1: {
																																					ctor: '::',
																																					_0: A2(_user$project$Elm_Page_Office_Format$versical, '', 'Here ends the Reading.'),
																																					_1: {
																																						ctor: '::',
																																						_0: _user$project$Elm_Page_Office_Format$rubric('\n          The following Canticles are normally sung or said after each of the lessons. The Officiant may also use a Canticle drawn from the\n          “Supplemental Canticles” or an appropriate song of praise.\n        '),
																																						_1: {
																																							ctor: '::',
																																							_0: _user$project$Elm_Page_Office_Prayers$teDeum,
																																							_1: {
																																								ctor: '::',
																																								_0: _user$project$Elm_Page_Office_Format$rubric('During Lent the Benedictus es, Domine usually replaces the Te Deum and may be used at other times.'),
																																								_1: {
																																									ctor: '::',
																																									_0: _user$project$Elm_Page_Office_Prayers$benedictisEsDomine,
																																									_1: {
																																										ctor: '::',
																																										_0: _user$project$Elm_Page_Office_Prayers$benedictus,
																																										_1: {
																																											ctor: '::',
																																											_0: _user$project$Elm_Page_Office_Format$pbSection('The Apostles’ Creed'),
																																											_1: {
																																												ctor: '::',
																																												_0: _user$project$Elm_Page_Office_Format$rubric('Officiant and People together, all standing'),
																																												_1: {
																																													ctor: '::',
																																													_0: _user$project$Elm_Page_Office_Prayers$apostlesCreed,
																																													_1: {
																																														ctor: '::',
																																														_0: _user$project$Elm_Page_Office_Format$pbSection('The Prayers'),
																																														_1: {
																																															ctor: '::',
																																															_0: _user$project$Elm_Page_Office_Format$theLordBeWithYou,
																																															_1: {
																																																ctor: '::',
																																																_0: _user$project$Elm_Page_Office_Format$rubric('The People kneel or stand.'),
																																																_1: {
																																																	ctor: '::',
																																																	_0: _user$project$Elm_Page_Office_Prayers$mercy3,
																																																	_1: {
																																																		ctor: '::',
																																																		_0: _user$project$Elm_Page_Office_Format$rubric('Officiant and People'),
																																																		_1: {
																																																			ctor: '::',
																																																			_0: _user$project$Elm_Page_Office_Prayers$lordsPrayerTrad,
																																																			_1: {
																																																				ctor: '::',
																																																				_0: _user$project$Elm_Page_Office_Format$rubric('or'),
																																																				_1: {
																																																					ctor: '::',
																																																					_0: _user$project$Elm_Page_Office_Prayers$lordsPrayerModern,
																																																					_1: {
																																																						ctor: '::',
																																																						_0: _user$project$Elm_Page_Office_Format$versicals(
																																																							{
																																																								ctor: '::',
																																																								_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'O Lord, show your mercy upon us;'},
																																																								_1: {
																																																									ctor: '::',
																																																									_0: {ctor: '_Tuple2', _0: 'People', _1: 'And grant us your salvation.'},
																																																									_1: {
																																																										ctor: '::',
																																																										_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'O Lord, guide those who govern us;'},
																																																										_1: {
																																																											ctor: '::',
																																																											_0: {ctor: '_Tuple2', _0: 'People', _1: 'And lead us in the way of justice and truth.'},
																																																											_1: {
																																																												ctor: '::',
																																																												_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Clothe your ministers with righteousness;'},
																																																												_1: {
																																																													ctor: '::',
																																																													_0: {ctor: '_Tuple2', _0: 'People', _1: 'And let your people sing with joy.'},
																																																													_1: {
																																																														ctor: '::',
																																																														_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'O Lord, save your people;'},
																																																														_1: {
																																																															ctor: '::',
																																																															_0: {ctor: '_Tuple2', _0: 'People', _1: 'And bless your inheritance.'},
																																																															_1: {
																																																																ctor: '::',
																																																																_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Give peace in our time, O Lord;'},
																																																																_1: {
																																																																	ctor: '::',
																																																																	_0: {ctor: '_Tuple2', _0: 'People', _1: 'And defend us by your mighty power.'},
																																																																	_1: {
																																																																		ctor: '::',
																																																																		_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Let not the needy, O Lord, be forgotten;'},
																																																																		_1: {
																																																																			ctor: '::',
																																																																			_0: {ctor: '_Tuple2', _0: 'People', _1: 'Nor the hope of the poor be taken away.'},
																																																																			_1: {
																																																																				ctor: '::',
																																																																				_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Create in us clean hearts, O God;'},
																																																																				_1: {
																																																																					ctor: '::',
																																																																					_0: {ctor: '_Tuple2', _0: 'People', _1: 'And take not your Holy Spirit from us.'},
																																																																					_1: {ctor: '[]'}
																																																																				}
																																																																			}
																																																																		}
																																																																	}
																																																																}
																																																															}
																																																														}
																																																													}
																																																												}
																																																											}
																																																										}
																																																									}
																																																								}
																																																							}),
																																																						_1: {
																																																							ctor: '::',
																																																							_0: _user$project$Elm_Page_Office_Format$rubric('\n          The Officiant then prays one or more of the following collects, always beginning with the Collect of the Day (the prayer of the previous Sunday\n          or of the Holy Day being observed). It is traditional to pray the Collects for Peace and Grace daily. Alternatively, one may pray the collects on\n          a weekly rotation, using the suggestions in parentheses.\n        '),
																																																							_1: {
																																																								ctor: '::',
																																																								_0: _user$project$Elm_Page_Office_Format$justText('COLLECT OF WEEK GOES HERE'),
																																																								_1: {
																																																									ctor: '::',
																																																									_0: _user$project$Elm_Views_Collects$collects(model.lessons.collects.texts),
																																																									_1: {
																																																										ctor: '::',
																																																										_0: _user$project$Elm_Page_Office_Format$justText('COLLECT OF DAY GOES HERE'),
																																																										_1: {
																																																											ctor: '::',
																																																											_0: _user$project$Elm_Views_Collects$mpCollectOfDay(model.lessons.dayOfWeek),
																																																											_1: {
																																																												ctor: '::',
																																																												_0: _user$project$Elm_Page_Office_Format$rubric('The Officiant may invite the People to offer intercessions and thanksgivings.'),
																																																												_1: {
																																																													ctor: '::',
																																																													_0: _user$project$Elm_Page_Office_Format$rubric('A hymn or anthem may be sung.'),
																																																													_1: {
																																																														ctor: '::',
																																																														_0: _user$project$Elm_Page_Office_Format$rubric('Before the close of the Office one or both of the following prayers may be used.'),
																																																														_1: {
																																																															ctor: '::',
																																																															_0: _user$project$Elm_Page_Office_Prayers$generalThanksgiving,
																																																															_1: {
																																																																ctor: '::',
																																																																_0: _user$project$Elm_Page_Office_Prayers$chrysostom,
																																																																_1: {
																																																																	ctor: '::',
																																																																	_0: _user$project$Elm_Page_Office_Format$versicals(
																																																																		{
																																																																			ctor: '::',
																																																																			_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Let us bless the Lord.'},
																																																																			_1: {
																																																																				ctor: '::',
																																																																				_0: {ctor: '_Tuple2', _0: 'People', _1: 'Thanks be to God.'},
																																																																				_1: {ctor: '[]'}
																																																																			}
																																																																		}),
																																																																	_1: {
																																																																		ctor: '::',
																																																																		_0: _user$project$Elm_Page_Office_Format$rubric('From Easter Day through the Day of Pentecost “Alleluia, alleluia” may be added to the preceding versicle and response.'),
																																																																		_1: {
																																																																			ctor: '::',
																																																																			_0: _user$project$Elm_Page_Office_Format$rubric('The Officiant says one of these concluding sentences (and the People may be invited to join)'),
																																																																			_1: {
																																																																				ctor: '::',
																																																																				_0: _user$project$Elm_Page_Office_Format$withAmen('\n          The grace of our Lord Jesus Christ, and the love of God, and the fellowship of the Holy Spirit, be\n          with us all evermore.\n        '),
																																																																				_1: {
																																																																					ctor: '::',
																																																																					_0: _user$project$Elm_Page_Office_Format$reference('2 Corinthians 13:14'),
																																																																					_1: {
																																																																						ctor: '::',
																																																																						_0: _user$project$Elm_Page_Office_Format$withAmen('\n          May the God of hope fill us with all joy and peace in believing through the power of the Holy Spirit.\n        '),
																																																																						_1: {
																																																																							ctor: '::',
																																																																							_0: _user$project$Elm_Page_Office_Format$reference('Romans 15:13'),
																																																																							_1: {
																																																																								ctor: '::',
																																																																								_0: _user$project$Elm_Page_Office_Format$withAmen('\n          Glory to God whose power, working in us, can do infinitely more than we can ask or imagine: Glory\n          to him from generation to generation in the Church, and in Christ Jesus forever and ever.\n        '),
																																																																								_1: {
																																																																									ctor: '::',
																																																																									_0: _user$project$Elm_Page_Office_Format$reference('Ephesians 3:20-21'),
																																																																									_1: {
																																																																										ctor: '::',
																																																																										_0: A2(
																																																																											_elm_lang$html$Html$button,
																																																																											{
																																																																												ctor: '::',
																																																																												_0: _elm_lang$html$Html_Attributes$class('more-options'),
																																																																												_1: {
																																																																													ctor: '::',
																																																																													_0: _elm_lang$html$Html_Events$onClick(_user$project$Elm_Page_MP$ShowDirections),
																																																																													_1: {ctor: '[]'}
																																																																												}
																																																																											},
																																																																											{
																																																																												ctor: '::',
																																																																												_0: _elm_lang$html$Html$text('Additional Directions'),
																																																																												_1: {ctor: '[]'}
																																																																											}),
																																																																										_1: {
																																																																											ctor: '::',
																																																																											_0: _user$project$Elm_Page_Office_Format$mpepAdditionalDirectives(model.toggle.directions),
																																																																											_1: {ctor: '[]'}
																																																																										}
																																																																									}
																																																																								}
																																																																							}
																																																																						}
																																																																					}
																																																																				}
																																																																			}
																																																																		}
																																																																	}
																																																																}
																																																															}
																																																														}
																																																													}
																																																												}
																																																											}
																																																										}
																																																									}
																																																								}
																																																							}
																																																						}
																																																					}
																																																				}
																																																			}
																																																		}
																																																	}
																																																}
																																															}
																																														}
																																													}
																																												}
																																											}
																																										}
																																									}
																																								}
																																							}
																																						}
																																					}
																																				}
																																			}
																																		}
																																	}
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}),
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$Elm_Page_MP$SetLessons = function (a) {
	return {ctor: 'SetLessons', _0: a};
};
var _user$project$Elm_Page_MP$subscriptions = function (model) {
	return _elm_lang$core$Platform_Sub$batch(
		{
			ctor: '::',
			_0: A2(_elm_lang$core$Platform_Sub$map, _user$project$Elm_Page_MP$SetLessons, _user$project$Elm_Page_MP$lessonsChange),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_MP$FetchLessons = {ctor: 'FetchLessons'};
var _user$project$Elm_Page_MP$init = function () {
	var newModel = _user$project$Elm_Page_MP$initNew;
	return A2(_user$project$Elm_Page_MP$update, _user$project$Elm_Page_MP$FetchLessons, newModel);
}();
var _user$project$Elm_Page_MP$NoOp = {ctor: 'NoOp'};

var _user$project$Elm_Page_Midday$update = F2(
	function (msg, model) {
		var _p0 = msg;
		switch (_p0.ctor) {
			case 'NoOp':
				return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
			case 'SetPsalm':
				if (_p0._0.ctor === 'Just') {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							model,
							{psalms: _p0._0._0}),
						_1: _elm_lang$core$Platform_Cmd$none
					};
				} else {
					var _p1 = A2(_elm_lang$core$Debug$log, 'COULDNT GET PSALMS', '');
					return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
				}
			case 'GetPsalm':
				return {
					ctor: '_Tuple2',
					_0: model,
					_1: _user$project$Elm_Ports$requestPsalms(
						{
							ctor: '::',
							_0: {ctor: '_Tuple3', _0: _p0._0, _1: _p0._1, _2: _p0._2},
							_1: {ctor: '[]'}
						})
				};
			case 'MoreOptions':
				var _p2 = A2(_elm_lang$core$Debug$log, 'MORE OPTIONS CLICKED', 'Midday');
				return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
			case 'LordsPrayerTrad':
				var toggle = model.toggle;
				var newToggle = _elm_lang$core$Native_Utils.update(
					toggle,
					{lordsPrayerTrad: !toggle.lordsPrayerTrad});
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{toggle: newToggle}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			default:
				var toggle = model.toggle;
				var newToggle = _elm_lang$core$Native_Utils.update(
					toggle,
					{directives: !toggle.directives});
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{toggle: newToggle}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
		}
	});
var _user$project$Elm_Page_Midday$psalmChange = _user$project$Elm_Ports$requestedPsalms(
	function (_p3) {
		return _elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$Elm_Data_Psalm$decoder, _p3));
	});
var _user$project$Elm_Page_Midday$initToggle = {lordsPrayerTrad: true, directives: false};
var _user$project$Elm_Page_Midday$init = {
	errors: {ctor: '[]'},
	thisOption: '',
	psalms: {ctor: '[]'},
	toggle: _user$project$Elm_Page_Midday$initToggle
};
var _user$project$Elm_Page_Midday$Toggle = F2(
	function (a, b) {
		return {lordsPrayerTrad: a, directives: b};
	});
var _user$project$Elm_Page_Midday$Model = F4(
	function (a, b, c, d) {
		return {errors: a, thisOption: b, psalms: c, toggle: d};
	});
var _user$project$Elm_Page_Midday$AdditionalDirectives = {ctor: 'AdditionalDirectives'};
var _user$project$Elm_Page_Midday$LordsPrayerTrad = {ctor: 'LordsPrayerTrad'};
var _user$project$Elm_Page_Midday$MoreOptions = {ctor: 'MoreOptions'};
var _user$project$Elm_Page_Midday$SetPsalm = function (a) {
	return {ctor: 'SetPsalm', _0: a};
};
var _user$project$Elm_Page_Midday$subscriptions = function (model) {
	return _elm_lang$core$Platform_Sub$batch(
		{
			ctor: '::',
			_0: A2(_elm_lang$core$Platform_Sub$map, _user$project$Elm_Page_Midday$SetPsalm, _user$project$Elm_Page_Midday$psalmChange),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Midday$GetPsalm = F3(
	function (a, b, c) {
		return {ctor: 'GetPsalm', _0: a, _1: b, _2: c};
	});
var _user$project$Elm_Page_Midday$psalmButton = F4(
	function (ps, vsFrom, vsTo, str) {
		return A2(
			_elm_lang$html$Html$li,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$button,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('iphod'),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Events$onClick(
								A3(_user$project$Elm_Page_Midday$GetPsalm, ps, vsFrom, vsTo)),
							_1: {ctor: '[]'}
						}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text(str),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			});
	});
var _user$project$Elm_Page_Midday$view = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('z-0'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class(''),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$p,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('h4'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('Midday'),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$p,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(model.thisOption),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Page_Office_Format$versicals(
								{
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'O God, make speed to save us.'},
									_1: {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: 'People', _1: 'O Lord, make haste to help us.'},
										_1: {
											ctor: '::',
											_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Glory be to the Father, and to the Son, and to the Holy Spirit;'},
											_1: {
												ctor: '::',
												_0: {ctor: '_Tuple2', _0: 'People', _1: 'as it was in the beginning, is now, and ever shall be, world without end. Amen.'},
												_1: {ctor: '[]'}
											}
										}
									}
								}),
							_1: {
								ctor: '::',
								_0: _user$project$Elm_Page_Office_Format$rubricWithText(
									{ctor: '_Tuple2', _0: 'Except in Lent, add', _1: 'Alleluia.'}),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Page_Office_Format$rubric('A suitable hymn may be sung.'),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Page_Office_Format$rubric('\n          One or more of the following Psalms is sung or said. Other suitable selections include Psalms 19, 67, one or more sections of Psalm\n          119, or a selection from Psalms 120 through 133.\"\n        '),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$ul,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$class('pick-psalm'),
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: A4(_user$project$Elm_Page_Midday$psalmButton, 119, 105, 112, '119'),
													_1: {
														ctor: '::',
														_0: A4(_user$project$Elm_Page_Midday$psalmButton, 121, 1, 8, '121'),
														_1: {
															ctor: '::',
															_0: A4(_user$project$Elm_Page_Midday$psalmButton, 124, 1, 6, '124'),
															_1: {
																ctor: '::',
																_0: A4(_user$project$Elm_Page_Midday$psalmButton, 126, 1, 7, '126'),
																_1: {
																	ctor: '::',
																	_0: A2(
																		_elm_lang$html$Html$li,
																		{ctor: '[]'},
																		{
																			ctor: '::',
																			_0: A2(
																				_elm_lang$html$Html$button,
																				{
																					ctor: '::',
																					_0: _elm_lang$html$Html_Attributes$class('iphod'),
																					_1: {ctor: '[]'}
																				},
																				{
																					ctor: '::',
																					_0: _elm_lang$html$Html$text('Others'),
																					_1: {ctor: '[]'}
																				}),
																			_1: {ctor: '[]'}
																		}),
																	_1: {ctor: '[]'}
																}
															}
														}
													}
												}),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Views_Psalm$formattedPsalms(model.psalms),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Office_Format$rubric('At the end of the Psalms is sung or said'),
													_1: {
														ctor: '::',
														_0: _user$project$Elm_Page_Office_Prayers$gloria,
														_1: {
															ctor: '::',
															_0: _user$project$Elm_Page_Office_Format$rubric('One of the following, or some other suitable passage of Scripture, is read'),
															_1: {
																ctor: '::',
																_0: A2(_user$project$Elm_Page_Office_Format$bibleText, '\n          Jesus said, “Now is the judgment of this world; now will the ruler of this world be cast out. And I,\n          when I am lifted up from the earth, will draw all people to myself.”\n        ', 'John 12:31-32'),
																_1: {
																	ctor: '::',
																	_0: A2(_user$project$Elm_Page_Office_Format$bibleText, '\n          If anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come. All\n          this is from God, who through Christ reconciled us to himself and gave us the ministry of\n          reconciliation.\n        ', '2 Corinthians 5:17-18'),
																	_1: {
																		ctor: '::',
																		_0: A2(_user$project$Elm_Page_Office_Format$bibleText, '\n          From the rising of the sun to its setting my Name will be great among the nations, and in every place\n          incense will be offered to my Name, and a pure offering. For my Name will be great among the\n          nations, says the Lord of Hosts.\n        ', 'Malachi 1:11 '),
																		_1: {
																			ctor: '::',
																			_0: _user$project$Elm_Page_Office_Format$rubric('At the end of the reading is said'),
																			_1: {
																				ctor: '::',
																				_0: _user$project$Elm_Page_Office_Format$wordOfTheLord,
																				_1: {
																					ctor: '::',
																					_0: _user$project$Elm_Page_Office_Format$rubric('A meditation, silent or spoken, may follow.'),
																					_1: {
																						ctor: '::',
																						_0: _user$project$Elm_Page_Office_Format$rubric('The Officiant then begins the Prayers'),
																						_1: {
																							ctor: '::',
																							_0: _user$project$Elm_Page_Office_Format$versicals(
																								{
																									ctor: '::',
																									_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'I will bless the Lord at all times.'},
																									_1: {
																										ctor: '::',
																										_0: {ctor: '_Tuple2', _0: 'People', _1: 'His praise shall continually be in my mouth.'},
																										_1: {ctor: '[]'}
																									}
																								}),
																							_1: {
																								ctor: '::',
																								_0: _user$project$Elm_Page_Office_Prayers$mercy3,
																								_1: {
																									ctor: '::',
																									_0: A2(
																										_elm_lang$html$Html$ul,
																										{
																											ctor: '::',
																											_0: _elm_lang$html$Html_Attributes$class('pick-psalm'),
																											_1: {ctor: '[]'}
																										},
																										{
																											ctor: '::',
																											_0: A2(
																												_elm_lang$html$Html$li,
																												{ctor: '[]'},
																												{
																													ctor: '::',
																													_0: A2(
																														_elm_lang$html$Html$button,
																														{
																															ctor: '::',
																															_0: _elm_lang$html$Html_Attributes$class('iphod'),
																															_1: {
																																ctor: '::',
																																_0: _elm_lang$html$Html_Events$onClick(_user$project$Elm_Page_Midday$LordsPrayerTrad),
																																_1: {ctor: '[]'}
																															}
																														},
																														{
																															ctor: '::',
																															_0: _elm_lang$html$Html$text('Lord\'s Prayer'),
																															_1: {ctor: '[]'}
																														}),
																													_1: {ctor: '[]'}
																												}),
																											_1: {
																												ctor: '::',
																												_0: A2(
																													_elm_lang$html$Html$li,
																													{ctor: '[]'},
																													{
																														ctor: '::',
																														_0: A2(
																															_elm_lang$html$Html$button,
																															{
																																ctor: '::',
																																_0: _elm_lang$html$Html_Attributes$class('iphod'),
																																_1: {
																																	ctor: '::',
																																	_0: _elm_lang$html$Html_Events$onClick(_user$project$Elm_Page_Midday$AdditionalDirectives),
																																	_1: {ctor: '[]'}
																																}
																															},
																															{
																																ctor: '::',
																																_0: _elm_lang$html$Html$text('Additional Directives'),
																																_1: {ctor: '[]'}
																															}),
																														_1: {ctor: '[]'}
																													}),
																												_1: {ctor: '[]'}
																											}
																										}),
																									_1: {
																										ctor: '::',
																										_0: _user$project$Elm_Page_Office_Format$middayDirectives(model.toggle.directives),
																										_1: {
																											ctor: '::',
																											_0: _user$project$Elm_Page_Office_Prayers$lordsPrayerTraditional(model.toggle.lordsPrayerTrad),
																											_1: {
																												ctor: '::',
																												_0: _user$project$Elm_Page_Office_Format$versicals(
																													{
																														ctor: '::',
																														_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'O Lord, hear our prayer;'},
																														_1: {
																															ctor: '::',
																															_0: {ctor: '_Tuple2', _0: 'People', _1: 'And let our cry come to you.'},
																															_1: {
																																ctor: '::',
																																_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Let us pray. '},
																																_1: {ctor: '[]'}
																															}
																														}
																													}),
																												_1: {
																													ctor: '::',
																													_0: _user$project$Elm_Page_Office_Format$rubric('The Officiant then says one or more of the following Collects. Other appropriate Collects may also be used.'),
																													_1: {
																														ctor: '::',
																														_0: _user$project$Elm_Page_Office_Format$withAmen('\n          Blessed Savior, at this hour you hung upon the cross, stretching out your loving arms: Grant that all\n          the peoples of the earth may look to you and be saved; for your tender mercies’ sake. Amen.\n          Almighty Savior, who at mid-day called your servant Saint Paul to be an apostle to the Gentiles: We\n          pray you to illumine the world with the radiance of your glory, that all nations may come and\n          worship you; for you live and reign with the Father and the Holy Spirit, one God, for ever and ever.\n        '),
																														_1: {
																															ctor: '::',
																															_0: _user$project$Elm_Page_Office_Format$withAmen('\n          Father of all mercies, you revealed your boundless compassion to your apostle Saint Peter in a threefold\n          vision: Forgive our unbelief, we pray, and so strengthen our hearts and enkindle our zeal, that\n          we may fervently desire the salvation of all people, and diligently labor in the extension of your\n          kingdom; through him who gave himself for the life of the world, your Son our Savior Jesus Christ.\n        '),
																															_1: {
																																ctor: '::',
																																_0: _user$project$Elm_Page_Office_Format$withAmen('\n          Pour your grace into our hearts, O Lord, that we who have known the incarnation of your Son Jesus\n          Christ, announced by an angel to the Virgin Mary, may by his cross and passion be brought to the\n          glory of his resurrection; who lives and reigns with you, in the unity of the Holy Spirit, one God,\n          now and for ever.\n        '),
																																_1: {
																																	ctor: '::',
																																	_0: _user$project$Elm_Page_Office_Format$rubric('Silence may be kept, and other intercessions and thanksgivings may be offered.'),
																																	_1: {
																																		ctor: '::',
																																		_0: _user$project$Elm_Page_Office_Format$versicals(
																																			{
																																				ctor: '::',
																																				_0: {ctor: '_Tuple2', _0: 'Officiant', _1: 'Let us bless the Lord.'},
																																				_1: {
																																					ctor: '::',
																																					_0: {ctor: '_Tuple2', _0: 'People', _1: 'Thanks be to God. '},
																																					_1: {ctor: '[]'}
																																				}
																																			}),
																																		_1: {
																																			ctor: '::',
																																			_0: _user$project$Elm_Page_Office_Format$rubric('From Easter Day through the Day of Pentecost “Alleluia, alleluia” may be added to the preceding versicle and response.'),
																																			_1: {
																																				ctor: '::',
																																				_0: _user$project$Elm_Page_Office_Format$rubric('The Officiant may conclude with this, or one of the other Concluding Sentences from Morning and Evening Prayer.'),
																																				_1: {
																																					ctor: '::',
																																					_0: _user$project$Elm_Page_Office_Format$withAmen('\n          The grace of our Lord Jesus Christ, and the love of God, and the fellowship of the Holy Spirit, be\n          with us all evermore.\n        '),
																																					_1: {
																																						ctor: '::',
																																						_0: _user$project$Elm_Page_Office_Format$reference('2 Corinthians 13:14'),
																																						_1: {
																																							ctor: '::',
																																							_0: A2(
																																								_elm_lang$html$Html$button,
																																								{
																																									ctor: '::',
																																									_0: _elm_lang$html$Html_Attributes$class('iphod'),
																																									_1: {
																																										ctor: '::',
																																										_0: _elm_lang$html$Html_Events$onClick(_user$project$Elm_Page_Midday$AdditionalDirectives),
																																										_1: {ctor: '[]'}
																																									}
																																								},
																																								{
																																									ctor: '::',
																																									_0: _elm_lang$html$Html$text('Additional Directives'),
																																									_1: {ctor: '[]'}
																																								}),
																																							_1: {
																																								ctor: '::',
																																								_0: _user$project$Elm_Page_Office_Format$middayDirectives(model.toggle.directives),
																																								_1: {ctor: '[]'}
																																							}
																																						}
																																					}
																																				}
																																			}
																																		}
																																	}
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Midday$NoOp = {ctor: 'NoOp'};

var _user$project$Elm_Page_Narthex$viewMessage = function (chat) {
	return A2(
		_elm_lang$html$Html$li,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: _elm_lang$html$Html$text(
				A2(
					_elm_lang$core$Basics_ops['++'],
					chat.name,
					A2(_elm_lang$core$Basics_ops['++'], 'sez:', chat.message))),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Narthex$view = function (model) {
	var drawMessages = function (messages) {
		return A2(_elm_lang$core$List$map, _user$project$Elm_Page_Narthex$viewMessage, messages);
	};
	return A2(
		_elm_lang$html$Html$div,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$form,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$input,
						{ctor: '[]'},
						{ctor: '[]'}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$button,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('Submit'),
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$ul,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('list'),
						_1: {ctor: '[]'}
					},
					drawMessages(model.messages)),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Elm_Page_Narthex$update = F3(
	function (session, msg, model) {
		var _p0 = msg;
		if (_p0._0.ctor === 'Just') {
			return A2(
				_user$project$Elm_Util_ops['=>'],
				_elm_lang$core$Native_Utils.update(
					model,
					{
						messages: {ctor: '::', _0: _p0._0._0, _1: model.messages}
					}),
				_elm_lang$core$Platform_Cmd$none);
		} else {
			var _p1 = A2(_elm_lang$core$Debug$log, 'RECEIVE CHAT: ', 'ERROR');
			return A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none);
		}
	});
var _user$project$Elm_Page_Narthex$init = {
	newMessage: '',
	messages: {
		ctor: '::',
		_0: {name: 'TEst', message: 'Test Message'},
		_1: {ctor: '[]'}
	}
};
var _user$project$Elm_Page_Narthex$Chat = F2(
	function (a, b) {
		return {name: a, message: b};
	});
var _user$project$Elm_Page_Narthex$chatDecoder = A3(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
	'message',
	_elm_lang$core$Json_Decode$string,
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'name',
		_elm_lang$core$Json_Decode$string,
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Page_Narthex$Chat)));
var _user$project$Elm_Page_Narthex$receiveChat = _user$project$Elm_Ports$chatReceived(
	function (_p2) {
		return _elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$Elm_Page_Narthex$chatDecoder, _p2));
	});
var _user$project$Elm_Page_Narthex$Model = F2(
	function (a, b) {
		return {newMessage: a, messages: b};
	});
var _user$project$Elm_Page_Narthex$ReceiveChat = function (a) {
	return {ctor: 'ReceiveChat', _0: a};
};
var _user$project$Elm_Page_Narthex$subscriptions = function (model) {
	return _elm_lang$core$Platform_Sub$batch(
		{
			ctor: '::',
			_0: A2(_elm_lang$core$Platform_Sub$map, _user$project$Elm_Page_Narthex$ReceiveChat, _user$project$Elm_Page_Narthex$receiveChat),
			_1: {ctor: '[]'}
		});
};

var _user$project$Elm_Views_Assets$src = function (_p0) {
	var _p1 = _p0;
	return _elm_lang$html$Html_Attributes$src(_p1._0);
};
var _user$project$Elm_Views_Assets$Image = function (a) {
	return {ctor: 'Image', _0: a};
};
var _user$project$Elm_Views_Assets$error = _user$project$Elm_Views_Assets$Image('/assets/images/error.jpg');

var _user$project$Elm_Page_NotFound$view = function (session) {
	return A2(
		_elm_lang$html$Html$main_,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$id('content'),
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('container'),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$tabindex(-1),
					_1: {ctor: '[]'}
				}
			}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$h1,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('Not Found'),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('row'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$img,
							{
								ctor: '::',
								_0: _user$project$Elm_Views_Assets$src(_user$project$Elm_Views_Assets$error),
								_1: {
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$alt('giant laser walrus wreaking havoc'),
									_1: {ctor: '[]'}
								}
							},
							{ctor: '[]'}),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			}
		});
};

var _user$project$Elm_Page_Profile$defaultFeedSources = function (username) {
	return A3(
		_rtfeldman$selectlist$SelectList$fromLists,
		{ctor: '[]'},
		_user$project$Elm_Views_Article_Feed$authorFeed(username),
		{
			ctor: '::',
			_0: _user$project$Elm_Views_Article_Feed$favoritedFeed(username),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Profile$setProfile = _user$project$Elm_Ports$requestedProfile(
	function (_p0) {
		return _elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$Elm_Data_Profile$decoder, _p0));
	});
var _user$project$Elm_Page_Profile$init = F2(
	function (session, author) {
		var sessionUsername = function () {
			var _p1 = A2(
				_elm_lang$core$Maybe$map,
				function (_) {
					return _.username;
				},
				session.user);
			if (_p1.ctor === 'Nothing') {
				return _user$project$Elm_Data_User$initUsername;
			} else {
				return _p1._0;
			}
		}();
		var cmds = _elm_lang$core$Native_Utils.eq(session.user, _elm_lang$core$Maybe$Nothing) ? _elm_lang$core$Platform_Cmd$none : _elm_lang$core$Platform_Cmd$batch(
			{
				ctor: '::',
				_0: A2(_user$project$Elm_Ports$profileRequest, sessionUsername, author),
				_1: {
					ctor: '::',
					_0: A4(
						_user$project$Elm_Ports$requestFeed,
						session.user,
						_user$project$Elm_Data_User$usernameToString(author),
						_user$project$Elm_Request_Article$defaultListConfig.limit,
						_user$project$Elm_Request_Article$defaultListConfig.offset),
					_1: {
						ctor: '::',
						_0: _elm_lang$core$Platform_Cmd$none,
						_1: {ctor: '[]'}
					}
				}
			});
		var model = {
			errors: {ctor: '[]'},
			profile: _user$project$Elm_Data_Profile$initProfile,
			feed: A2(
				_user$project$Elm_Views_Article_Feed$init,
				session,
				_user$project$Elm_Page_Profile$defaultFeedSources(author))
		};
		return A2(_user$project$Elm_Util_ops['=>'], model, cmds);
	});
var _user$project$Elm_Page_Profile$Model = F3(
	function (a, b, c) {
		return {errors: a, profile: b, feed: c};
	});
var _user$project$Elm_Page_Profile$SetFeed = function (a) {
	return {ctor: 'SetFeed', _0: a};
};
var _user$project$Elm_Page_Profile$SetProfile = function (a) {
	return {ctor: 'SetProfile', _0: a};
};
var _user$project$Elm_Page_Profile$subscriptions = function (model) {
	return _elm_lang$core$Platform_Sub$batch(
		{
			ctor: '::',
			_0: A2(_elm_lang$core$Platform_Sub$map, _user$project$Elm_Page_Profile$SetProfile, _user$project$Elm_Page_Profile$setProfile),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Profile$FeedMsg = function (a) {
	return {ctor: 'FeedMsg', _0: a};
};
var _user$project$Elm_Page_Profile$viewFeed = function (feed) {
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('col-xs-12 col-md-10 offset-md-1'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('articles-toggle'),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$map,
						_user$project$Elm_Page_Profile$FeedMsg,
						_user$project$Elm_Views_Article_Feed$viewFeedSources(feed)),
					_1: {ctor: '[]'}
				}),
			_1: A2(
				_elm_lang$core$List$map,
				_elm_lang$html$Html$map(_user$project$Elm_Page_Profile$FeedMsg),
				_user$project$Elm_Views_Article_Feed$viewArticles(feed))
		});
};
var _user$project$Elm_Page_Profile$FollowCompleted = function (a) {
	return {ctor: 'FollowCompleted', _0: a};
};
var _user$project$Elm_Page_Profile$update = F3(
	function (session, msg, model) {
		var profile = model.profile;
		var _p2 = msg;
		switch (_p2.ctor) {
			case 'DismissErrors':
				return A2(
					_user$project$Elm_Util_ops['=>'],
					_elm_lang$core$Native_Utils.update(
						model,
						{
							errors: {ctor: '[]'}
						}),
					_elm_lang$core$Platform_Cmd$none);
			case 'ToggleFollow':
				var _p3 = session.user;
				if (_p3.ctor === 'Nothing') {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								errors: A2(
									_elm_lang$core$Basics_ops['++'],
									model.errors,
									{
										ctor: '::',
										_0: 'You are currently signed out. YOu must be sifnged in to follow people.',
										_1: {ctor: '[]'}
									})
							}),
						_elm_lang$core$Platform_Cmd$none);
				} else {
					return A2(
						_user$project$Elm_Util$pair,
						model,
						A2(
							_elm_lang$http$Http$send,
							_user$project$Elm_Page_Profile$FollowCompleted,
							A3(_user$project$Elm_Request_Profile$toggleFollow, profile.username, profile.following, _p3._0.token)));
				}
			case 'FollowCompleted':
				if (_p2._0.ctor === 'Ok') {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{profile: _p2._0._0}),
						_elm_lang$core$Platform_Cmd$none);
				} else {
					return A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none);
				}
			case 'FeedMsg':
				var _p4 = A3(_user$project$Elm_Views_Article_Feed$update, session, _p2._0, model.feed);
				var newFeed = _p4._0;
				var subCmd = _p4._1;
				return A2(
					_user$project$Elm_Util_ops['=>'],
					_elm_lang$core$Native_Utils.update(
						model,
						{feed: newFeed}),
					A2(_elm_lang$core$Platform_Cmd$map, _user$project$Elm_Page_Profile$FeedMsg, subCmd));
			case 'SetProfile':
				if (_p2._0.ctor === 'Just') {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{profile: _p2._0._0}),
						_elm_lang$core$Platform_Cmd$none);
				} else {
					return A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none);
				}
			default:
				if (_p2._0.ctor === 'Just') {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{feed: _p2._0._0}),
						_elm_lang$core$Platform_Cmd$none);
				} else {
					return A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none);
				}
		}
	});
var _user$project$Elm_Page_Profile$ToggleFollow = {ctor: 'ToggleFollow'};
var _user$project$Elm_Page_Profile$followButton = _user$project$Elm_Views_User_Follow$button(
	function (_p5) {
		return _user$project$Elm_Page_Profile$ToggleFollow;
	});
var _user$project$Elm_Page_Profile$viewProfileInfo = F2(
	function (isMyProfile, profile) {
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('col-xs12 col-md-10 offset-md-1'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$img,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('user-img'),
						_1: {
							ctor: '::',
							_0: _user$project$Elm_Data_UserPhoto$src(profile.image),
							_1: {ctor: '[]'}
						}
					},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$h4,
						{ctor: '[]'},
						{
							ctor: '::',
							_0: _user$project$Elm_Data_User$usernameToHtml(profile.username),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$p,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(
									A2(_elm_lang$core$Maybe$withDefault, '', profile.bio)),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_user$project$Elm_Util$viewIf,
								!isMyProfile,
								_user$project$Elm_Page_Profile$followButton(profile)),
							_1: {ctor: '[]'}
						}
					}
				}
			});
	});
var _user$project$Elm_Page_Profile$DismissErrors = {ctor: 'DismissErrors'};
var _user$project$Elm_Page_Profile$view = F2(
	function (session, model) {
		var profile = model.profile;
		var isMyProfile = A2(
			_elm_lang$core$Maybe$withDefault,
			false,
			A2(
				_elm_lang$core$Maybe$map,
				function (_p6) {
					var _p7 = _p6;
					return _elm_lang$core$Native_Utils.eq(_p7.username, profile.username);
				},
				session.user));
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('profile-page'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(_user$project$Elm_Views_Errors$view, _user$project$Elm_Page_Profile$DismissErrors, model.errors),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('user-info'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('user-info'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('row'),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: A2(_user$project$Elm_Page_Profile$viewProfileInfo, isMyProfile, profile),
											_1: {ctor: '[]'}
										}),
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('container'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('row'),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: _user$project$Elm_Page_Profile$viewFeed(model.feed),
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					}
				}
			});
	});

var _user$project$Elm_Page_Register$optionalError = function (fieldName) {
	var errorToString = function (errorMessage) {
		return A2(
			_elm_lang$core$String$join,
			' ',
			{
				ctor: '::',
				_0: fieldName,
				_1: {
					ctor: '::',
					_0: errorMessage,
					_1: {ctor: '[]'}
				}
			});
	};
	return A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optional,
		fieldName,
		_elm_lang$core$Json_Decode$list(
			A2(_elm_lang$core$Json_Decode$map, errorToString, _elm_lang$core$Json_Decode$string)),
		{ctor: '[]'});
};
var _user$project$Elm_Page_Register$errorsDecoder = A2(
	_user$project$Elm_Page_Register$optionalError,
	'password',
	A2(
		_user$project$Elm_Page_Register$optionalError,
		'username',
		A2(
			_user$project$Elm_Page_Register$optionalError,
			'name',
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(
				F3(
					function (name, username, password) {
						return _elm_lang$core$List$concat(
							{
								ctor: '::',
								_0: name,
								_1: {
									ctor: '::',
									_0: username,
									_1: {
										ctor: '::',
										_0: password,
										_1: {ctor: '[]'}
									}
								}
							});
					})))));
var _user$project$Elm_Page_Register$registering = _user$project$Elm_Ports$registrationComplete(
	function (_p0) {
		return _elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$Elm_Data_User$decoder, _p0));
	});
var _user$project$Elm_Page_Register$initialModel = {
	errors: {ctor: '[]'},
	name: '',
	username: '',
	password: ''
};
var _user$project$Elm_Page_Register$Model = F4(
	function (a, b, c, d) {
		return {errors: a, name: b, username: c, password: d};
	});
var _user$project$Elm_Page_Register$registrationDecode = A2(
	_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$hardcoded,
	'',
	A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
		'whoami',
		_elm_lang$core$Json_Decode$string,
		A3(
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$required,
			'name',
			_elm_lang$core$Json_Decode$string,
			A2(
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$hardcoded,
				{ctor: '[]'},
				_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(_user$project$Elm_Page_Register$Model)))));
var _user$project$Elm_Page_Register$Registration = function (a) {
	return {ctor: 'Registration', _0: a};
};
var _user$project$Elm_Page_Register$subscriptions = function (model) {
	return _elm_lang$core$Platform_Sub$batch(
		{
			ctor: '::',
			_0: A2(_elm_lang$core$Platform_Sub$map, _user$project$Elm_Page_Register$Registration, _user$project$Elm_Page_Register$registering),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Register$RegisterCompleted = function (a) {
	return {ctor: 'RegisterCompleted', _0: a};
};
var _user$project$Elm_Page_Register$SetPassword = function (a) {
	return {ctor: 'SetPassword', _0: a};
};
var _user$project$Elm_Page_Register$SetUsername = function (a) {
	return {ctor: 'SetUsername', _0: a};
};
var _user$project$Elm_Page_Register$SetEmail = function (a) {
	return {ctor: 'SetEmail', _0: a};
};
var _user$project$Elm_Page_Register$SubmitForm = {ctor: 'SubmitForm'};
var _user$project$Elm_Page_Register$viewForm = A2(
	_elm_lang$html$Html$form,
	{
		ctor: '::',
		_0: _elm_lang$html$Html_Events$onSubmit(_user$project$Elm_Page_Register$SubmitForm),
		_1: {ctor: '[]'}
	},
	{
		ctor: '::',
		_0: A2(
			_user$project$Elm_Views_Form$input,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('form-control-lg'),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$placeholder('Username'),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Events$onInput(_user$project$Elm_Page_Register$SetUsername),
						_1: {ctor: '[]'}
					}
				}
			},
			{ctor: '[]'}),
		_1: {
			ctor: '::',
			_0: A2(
				_user$project$Elm_Views_Form$input,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('form-control-lg'),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$placeholder('Email'),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Events$onInput(_user$project$Elm_Page_Register$SetEmail),
							_1: {ctor: '[]'}
						}
					}
				},
				{ctor: '[]'}),
			_1: {
				ctor: '::',
				_0: A2(
					_user$project$Elm_Views_Form$password,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('form-control-lg'),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$placeholder('Password'),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Events$onInput(_user$project$Elm_Page_Register$SetPassword),
								_1: {ctor: '[]'}
							}
						}
					},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$button,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('btn btn-lg btn-primary pull-xs-right'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text('Sign up'),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Elm_Page_Register$view = F2(
	function (session, model) {
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('auth-page'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('container page'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('row'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('col-md-6 offset-md-3 col0xs-12'),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$h1,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$class('text-xs-center'),
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('Sign up'),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$p,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$class('text-xs-center'),
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: A2(
														_elm_lang$html$Html$a,
														{
															ctor: '::',
															_0: _user$project$Elm_Route$href(_user$project$Elm_Route$Login),
															_1: {ctor: '[]'}
														},
														{
															ctor: '::',
															_0: _elm_lang$html$Html$text('Have an account?'),
															_1: {ctor: '[]'}
														}),
													_1: {ctor: '[]'}
												}),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Views_Form$viewErrors(model.errors),
												_1: {
													ctor: '::',
													_0: _user$project$Elm_Page_Register$viewForm,
													_1: {ctor: '[]'}
												}
											}
										}
									}),
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			});
	});
var _user$project$Elm_Page_Register$SetUser = function (a) {
	return {ctor: 'SetUser', _0: a};
};
var _user$project$Elm_Page_Register$NoOp = {ctor: 'NoOp'};
var _user$project$Elm_Page_Register$Password = {ctor: 'Password'};
var _user$project$Elm_Page_Register$Email = {ctor: 'Email'};
var _user$project$Elm_Page_Register$Username = {ctor: 'Username'};
var _user$project$Elm_Page_Register$modelValidator = _rtfeldman$elm_validate$Validate$all(
	{
		ctor: '::',
		_0: A2(
			_rtfeldman$elm_validate$Validate$ifBlank,
			function (_) {
				return _.username;
			},
			A2(_user$project$Elm_Util_ops['=>'], _user$project$Elm_Page_Register$Username, 'username can\'t be blank.')),
		_1: {
			ctor: '::',
			_0: A2(
				_rtfeldman$elm_validate$Validate$ifBlank,
				function (_) {
					return _.name;
				},
				A2(_user$project$Elm_Util_ops['=>'], _user$project$Elm_Page_Register$Email, 'Email can\'t be blank.')),
			_1: {
				ctor: '::',
				_0: A2(
					_rtfeldman$elm_validate$Validate$ifBlank,
					function (_) {
						return _.password;
					},
					A2(_user$project$Elm_Util_ops['=>'], _user$project$Elm_Page_Register$Password, 'password can\'t be blank.')),
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Elm_Page_Register$Form = {ctor: 'Form'};
var _user$project$Elm_Page_Register$update = F2(
	function (msg, model) {
		var _p1 = msg;
		switch (_p1.ctor) {
			case 'SubmitForm':
				var _p2 = A2(_rtfeldman$elm_validate$Validate$validate, _user$project$Elm_Page_Register$modelValidator, model);
				if (_p2.ctor === '[]') {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						A2(
							_user$project$Elm_Util_ops['=>'],
							_elm_lang$core$Native_Utils.update(
								model,
								{
									errors: {ctor: '[]'}
								}),
							A3(_user$project$Elm_Ports$register, model.name, model.username, model.password)),
						_user$project$Elm_Page_Register$NoOp);
				} else {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						A2(
							_user$project$Elm_Util_ops['=>'],
							_elm_lang$core$Native_Utils.update(
								model,
								{errors: _p2}),
							_elm_lang$core$Platform_Cmd$none),
						_user$project$Elm_Page_Register$NoOp);
				}
			case 'SetEmail':
				return A2(
					_user$project$Elm_Util_ops['=>'],
					A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{name: _p1._0}),
						_elm_lang$core$Platform_Cmd$none),
					_user$project$Elm_Page_Register$NoOp);
			case 'SetUsername':
				return A2(
					_user$project$Elm_Util_ops['=>'],
					A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{username: _p1._0}),
						_elm_lang$core$Platform_Cmd$none),
					_user$project$Elm_Page_Register$NoOp);
			case 'SetPassword':
				return A2(
					_user$project$Elm_Util_ops['=>'],
					A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{password: _p1._0}),
						_elm_lang$core$Platform_Cmd$none),
					_user$project$Elm_Page_Register$NoOp);
			case 'Registration':
				if (_p1._0.ctor === 'Just') {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						A2(
							_user$project$Elm_Util_ops['=>'],
							model,
							_elm_lang$core$Platform_Cmd$batch(
								{
									ctor: '::',
									_0: _user$project$Elm_Request_User$storeSession(_p1._0._0),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Route$modifyUrl(_user$project$Elm_Route$Settings),
										_1: {ctor: '[]'}
									}
								})),
						_user$project$Elm_Page_Register$NoOp);
				} else {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none),
						_user$project$Elm_Page_Register$NoOp);
				}
			default:
				if (_p1._0.ctor === 'Err') {
					var errorMessages = function () {
						var _p3 = _p1._0._0;
						if (_p3.ctor === 'BadStatus') {
							return A2(
								_elm_lang$core$Result$withDefault,
								{ctor: '[]'},
								A2(
									_elm_lang$core$Json_Decode$decodeString,
									A2(_elm_lang$core$Json_Decode$field, 'errors', _user$project$Elm_Page_Register$errorsDecoder),
									_p3._0.body));
						} else {
							return {
								ctor: '::',
								_0: 'undable to process registration',
								_1: {ctor: '[]'}
							};
						}
					}();
					return A2(
						_user$project$Elm_Util_ops['=>'],
						A2(
							_user$project$Elm_Util_ops['=>'],
							_elm_lang$core$Native_Utils.update(
								model,
								{
									errors: A2(
										_elm_lang$core$List$map,
										function (errorMessage) {
											return A2(_user$project$Elm_Util_ops['=>'], _user$project$Elm_Page_Register$Form, errorMessage);
										},
										errorMessages)
								}),
							_elm_lang$core$Platform_Cmd$none),
						_user$project$Elm_Page_Register$NoOp);
				} else {
					var _p4 = _p1._0._0;
					return A2(
						_user$project$Elm_Util_ops['=>'],
						A2(
							_user$project$Elm_Util_ops['=>'],
							model,
							_elm_lang$core$Platform_Cmd$batch(
								{
									ctor: '::',
									_0: _user$project$Elm_Request_User$storeSession(_p4),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Route$modifyUrl(_user$project$Elm_Route$Home),
										_1: {ctor: '[]'}
									}
								})),
						_user$project$Elm_Page_Register$SetUser(_p4));
				}
		}
	});

var _user$project$Elm_Page_Settings$optionalError = function (fieldName) {
	var errorToString = function (errorMessage) {
		return A2(
			_elm_lang$core$String$join,
			' ',
			{
				ctor: '::',
				_0: fieldName,
				_1: {
					ctor: '::',
					_0: errorMessage,
					_1: {ctor: '[]'}
				}
			});
	};
	return A3(
		_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$optional,
		fieldName,
		_elm_lang$core$Json_Decode$list(
			A2(_elm_lang$core$Json_Decode$map, errorToString, _elm_lang$core$Json_Decode$string)),
		{ctor: '[]'});
};
var _user$project$Elm_Page_Settings$errorsDecoder = A2(
	_user$project$Elm_Page_Settings$optionalError,
	'password',
	A2(
		_user$project$Elm_Page_Settings$optionalError,
		'username',
		A2(
			_user$project$Elm_Page_Settings$optionalError,
			'name',
			_NoRedInk$elm_decode_pipeline$Json_Decode_Pipeline$decode(
				F3(
					function (name, username, password) {
						return _elm_lang$core$List$concat(
							{
								ctor: '::',
								_0: name,
								_1: {
									ctor: '::',
									_0: username,
									_1: {
										ctor: '::',
										_0: password,
										_1: {ctor: '[]'}
									}
								}
							});
					})))));
var _user$project$Elm_Page_Settings$saveCompleted = _user$project$Elm_Ports$updateUserComplete(
	function (_p0) {
		return _elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$Elm_Data_User$decoder, _p0));
	});
var _user$project$Elm_Page_Settings$init = function (user) {
	return {
		errors: {ctor: '[]'},
		image: _user$project$Elm_Data_UserPhoto$toMaybeString(user.image),
		name: user.name,
		bio: A2(_elm_lang$core$Maybe$withDefault, '', user.bio),
		username: _user$project$Elm_Data_User$usernameToString(user.username),
		password: _elm_lang$core$Maybe$Nothing
	};
};
var _user$project$Elm_Page_Settings$Model = F6(
	function (a, b, c, d, e, f) {
		return {errors: a, image: b, name: c, bio: d, username: e, password: f};
	});
var _user$project$Elm_Page_Settings$SaveCompleted = function (a) {
	return {ctor: 'SaveCompleted', _0: a};
};
var _user$project$Elm_Page_Settings$subscriptions = function (model) {
	return _elm_lang$core$Platform_Sub$batch(
		{
			ctor: '::',
			_0: A2(_elm_lang$core$Platform_Sub$map, _user$project$Elm_Page_Settings$SaveCompleted, _user$project$Elm_Page_Settings$saveCompleted),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Settings$SetImage = function (a) {
	return {ctor: 'SetImage', _0: a};
};
var _user$project$Elm_Page_Settings$SetBio = function (a) {
	return {ctor: 'SetBio', _0: a};
};
var _user$project$Elm_Page_Settings$SetPassword = function (a) {
	return {ctor: 'SetPassword', _0: a};
};
var _user$project$Elm_Page_Settings$SetUsername = function (a) {
	return {ctor: 'SetUsername', _0: a};
};
var _user$project$Elm_Page_Settings$SetName = function (a) {
	return {ctor: 'SetName', _0: a};
};
var _user$project$Elm_Page_Settings$SubmitForm = {ctor: 'SubmitForm'};
var _user$project$Elm_Page_Settings$viewForm = function (model) {
	return A2(
		_elm_lang$html$Html$form,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Events$onSubmit(_user$project$Elm_Page_Settings$SubmitForm),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$fieldset,
				{ctor: '[]'},
				{
					ctor: '::',
					_0: A2(
						_user$project$Elm_Views_Form$input,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$placeholder('URL of profile picture'),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$defaultValue(
									A2(_elm_lang$core$Maybe$withDefault, '', model.image)),
								_1: {
									ctor: '::',
									_0: _elm_lang$html$Html_Events$onInput(_user$project$Elm_Page_Settings$SetImage),
									_1: {ctor: '[]'}
								}
							}
						},
						{ctor: '[]'}),
					_1: {
						ctor: '::',
						_0: A2(
							_user$project$Elm_Views_Form$input,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('form-control-lg'),
								_1: {
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$placeholder('Username'),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$defaultValue(model.username),
										_1: {
											ctor: '::',
											_0: _elm_lang$html$Html_Events$onInput(_user$project$Elm_Page_Settings$SetUsername),
											_1: {ctor: '[]'}
										}
									}
								}
							},
							{ctor: '[]'}),
						_1: {
							ctor: '::',
							_0: A2(
								_user$project$Elm_Views_Form$textarea,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('form-control-lg'),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$placeholder('Short bio about you'),
										_1: {
											ctor: '::',
											_0: A2(_elm_lang$html$Html_Attributes$attribute, 'rows', '8'),
											_1: {
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$defaultValue(model.bio),
												_1: {
													ctor: '::',
													_0: _elm_lang$html$Html_Events$onInput(_user$project$Elm_Page_Settings$SetBio),
													_1: {ctor: '[]'}
												}
											}
										}
									}
								},
								{ctor: '[]'}),
							_1: {
								ctor: '::',
								_0: A2(
									_user$project$Elm_Views_Form$input,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('form-control-lg'),
										_1: {
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$placeholder('Email'),
											_1: {
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$defaultValue(model.name),
												_1: {
													ctor: '::',
													_0: _elm_lang$html$Html_Events$onInput(_user$project$Elm_Page_Settings$SetName),
													_1: {ctor: '[]'}
												}
											}
										}
									},
									{ctor: '[]'}),
								_1: {
									ctor: '::',
									_0: A2(
										_user$project$Elm_Views_Form$password,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('form-control-lg'),
											_1: {
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$placeholder('Password'),
												_1: {
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$defaultValue(
														A2(_elm_lang$core$Maybe$withDefault, '', model.password)),
													_1: {
														ctor: '::',
														_0: _elm_lang$html$Html_Events$onInput(_user$project$Elm_Page_Settings$SetPassword),
														_1: {ctor: '[]'}
													}
												}
											}
										},
										{ctor: '[]'}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$button,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$class('btn btn-lg btn-primary pull-xs-right'),
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('Update Settings'),
												_1: {ctor: '[]'}
											}),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}),
			_1: {ctor: '[]'}
		});
};
var _user$project$Elm_Page_Settings$view = F2(
	function (session, model) {
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('settings-page'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('container page'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('row'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('col-md-6 offset-md-3 col-xs'),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$h1,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$class('text-xs-center'),
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('Your Settings'),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: _user$project$Elm_Views_Form$viewErrors(model.errors),
											_1: {
												ctor: '::',
												_0: _user$project$Elm_Page_Settings$viewForm(model),
												_1: {ctor: '[]'}
											}
										}
									}),
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			});
	});
var _user$project$Elm_Page_Settings$SetUser = function (a) {
	return {ctor: 'SetUser', _0: a};
};
var _user$project$Elm_Page_Settings$NoOp = {ctor: 'NoOp'};
var _user$project$Elm_Page_Settings$Unknown = {ctor: 'Unknown'};
var _user$project$Elm_Page_Settings$Bio = {ctor: 'Bio'};
var _user$project$Elm_Page_Settings$ImageUrl = {ctor: 'ImageUrl'};
var _user$project$Elm_Page_Settings$Password = {ctor: 'Password'};
var _user$project$Elm_Page_Settings$Name = {ctor: 'Name'};
var _user$project$Elm_Page_Settings$Username = {ctor: 'Username'};
var _user$project$Elm_Page_Settings$modelValidator = _rtfeldman$elm_validate$Validate$all(
	{
		ctor: '::',
		_0: A2(
			_rtfeldman$elm_validate$Validate$ifBlank,
			function (_) {
				return _.username;
			},
			A2(_user$project$Elm_Util_ops['=>'], _user$project$Elm_Page_Settings$Username, 'username can\'t be blank.')),
		_1: {
			ctor: '::',
			_0: A2(
				_rtfeldman$elm_validate$Validate$ifBlank,
				function (_) {
					return _.name;
				},
				A2(_user$project$Elm_Util_ops['=>'], _user$project$Elm_Page_Settings$Name, 'email can\'t be blank.')),
			_1: {ctor: '[]'}
		}
	});
var _user$project$Elm_Page_Settings$update = F3(
	function (session, msg, model) {
		var _p1 = msg;
		switch (_p1.ctor) {
			case 'SubmitForm':
				var _p2 = A2(_rtfeldman$elm_validate$Validate$validate, _user$project$Elm_Page_Settings$modelValidator, model);
				if (_p2.ctor === '[]') {
					var updates = _elm_lang$core$Json_Encode$object(
						{
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'username',
								_1: _elm_lang$core$Json_Encode$string(model.username)
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'name',
									_1: _elm_lang$core$Json_Encode$string(model.name)
								},
								_1: {
									ctor: '::',
									_0: {
										ctor: '_Tuple2',
										_0: 'bio',
										_1: _elm_lang$core$Json_Encode$string(model.bio)
									},
									_1: {
										ctor: '::',
										_0: {
											ctor: '_Tuple2',
											_0: 'image',
											_1: A2(_elm_community$json_extra$Json_Encode_Extra$maybe, _elm_lang$core$Json_Encode$string, model.image)
										},
										_1: {
											ctor: '::',
											_0: {
												ctor: '_Tuple2',
												_0: 'password',
												_1: A2(_elm_community$json_extra$Json_Encode_Extra$maybe, _elm_lang$core$Json_Encode$string, model.password)
											},
											_1: {ctor: '[]'}
										}
									}
								}
							}
						});
					return A2(
						_user$project$Elm_Util_ops['=>'],
						A2(
							_user$project$Elm_Util_ops['=>'],
							model,
							_user$project$Elm_Ports$updateUser(updates)),
						_user$project$Elm_Page_Settings$NoOp);
				} else {
					return A2(
						_user$project$Elm_Util_ops['=>'],
						A2(
							_user$project$Elm_Util_ops['=>'],
							_elm_lang$core$Native_Utils.update(
								model,
								{errors: _p2}),
							_elm_lang$core$Platform_Cmd$none),
						_user$project$Elm_Page_Settings$NoOp);
				}
			case 'SetName':
				return A2(
					_user$project$Elm_Util_ops['=>'],
					A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{name: _p1._0}),
						_elm_lang$core$Platform_Cmd$none),
					_user$project$Elm_Page_Settings$NoOp);
			case 'SetUsername':
				return A2(
					_user$project$Elm_Util_ops['=>'],
					A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{username: _p1._0}),
						_elm_lang$core$Platform_Cmd$none),
					_user$project$Elm_Page_Settings$NoOp);
			case 'SetPassword':
				var _p3 = _p1._0;
				var password = _elm_lang$core$String$isEmpty(_p3) ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$Maybe$Just(_p3);
				return A2(
					_user$project$Elm_Util_ops['=>'],
					A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{password: password}),
						_elm_lang$core$Platform_Cmd$none),
					_user$project$Elm_Page_Settings$NoOp);
			case 'SetBio':
				return A2(
					_user$project$Elm_Util_ops['=>'],
					A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{bio: _p1._0}),
						_elm_lang$core$Platform_Cmd$none),
					_user$project$Elm_Page_Settings$NoOp);
			case 'SetImage':
				var _p4 = _p1._0;
				var image = _elm_lang$core$String$isEmpty(_p4) ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$Maybe$Just(_p4);
				return A2(
					_user$project$Elm_Util_ops['=>'],
					A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{image: image}),
						_elm_lang$core$Platform_Cmd$none),
					_user$project$Elm_Page_Settings$NoOp);
			default:
				if (_p1._0.ctor === 'Nothing') {
					var errors = {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: _user$project$Elm_Page_Settings$Unknown, _1: 'Could not save changes'},
						_1: {ctor: '[]'}
					};
					return A2(
						_user$project$Elm_Util_ops['=>'],
						A2(
							_user$project$Elm_Util_ops['=>'],
							_elm_lang$core$Native_Utils.update(
								model,
								{errors: errors}),
							_elm_lang$core$Platform_Cmd$none),
						_user$project$Elm_Page_Settings$NoOp);
				} else {
					var _p5 = _p1._0._0;
					return A2(
						_user$project$Elm_Util_ops['=>'],
						A2(
							_user$project$Elm_Util_ops['=>'],
							model,
							_elm_lang$core$Platform_Cmd$batch(
								{
									ctor: '::',
									_0: _user$project$Elm_Request_User$storeSession(_p5),
									_1: {
										ctor: '::',
										_0: _user$project$Elm_Route$modifyUrl(_user$project$Elm_Route$Home),
										_1: {ctor: '[]'}
									}
								})),
						_user$project$Elm_Page_Settings$SetUser(_p5));
				}
		}
	});
var _user$project$Elm_Page_Settings$Form = {ctor: 'Form'};

var _user$project$Main$getPage = function (pageState) {
	var _p0 = pageState;
	if (_p0.ctor === 'Loaded') {
		return _p0._0;
	} else {
		return _p0._0;
	}
};
var _user$project$Main$dbSync = _user$project$Elm_Ports$dbSync(
	function (_p1) {
		return _elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _elm_lang$core$Json_Decode$string, _p1));
	});
var _user$project$Main$requestedLessons = _user$project$Elm_Ports$requestedLessons(
	function (_p2) {
		return _elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$Elm_Data_Lessons$dailyLessonsDecoder, _p2));
	});
var _user$project$Main$requestedFeed = _user$project$Elm_Ports$requestedFeed(
	function (_p3) {
		return _elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$Elm_Data_Article_Feed$decoder, _p3));
	});
var _user$project$Main$requestedCalendar = _user$project$Elm_Ports$requestedCalendar(
	function (_p4) {
		return _elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$Elm_Data_Calendar$calendarDecoder, _p4));
	});
var _user$project$Main$portError = _user$project$Elm_Ports$error(
	function (_p5) {
		return _elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$Elm_Data_Error$decoder, _p5));
	});
var _user$project$Main$sessionChange = _user$project$Elm_Ports$onSessionChange(
	function (_p6) {
		return _elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _user$project$Elm_Data_User$decoder, _p6));
	});
var _user$project$Main$decodeUserFromJson = function (json) {
	return A2(
		_elm_lang$core$Maybe$andThen,
		function (_p7) {
			return _elm_lang$core$Result$toMaybe(
				A2(_elm_lang$core$Json_Decode$decodeString, _user$project$Elm_Data_User$decoder, _p7));
		},
		_elm_lang$core$Result$toMaybe(
			A2(_elm_lang$core$Json_Decode$decodeValue, _elm_lang$core$Json_Decode$string, json)));
};
var _user$project$Main$Model = F6(
	function (a, b, c, d, e, f) {
		return {session: a, pageState: b, dailyLessons: c, euLessons: d, calendar: e, dbSyncing: f};
	});
var _user$project$Main$CommunionToSick = function (a) {
	return {ctor: 'CommunionToSick', _0: a};
};
var _user$project$Main$Compline = function (a) {
	return {ctor: 'Compline', _0: a};
};
var _user$project$Main$EP = function (a) {
	return {ctor: 'EP', _0: a};
};
var _user$project$Main$Midday = function (a) {
	return {ctor: 'Midday', _0: a};
};
var _user$project$Main$MP = function (a) {
	return {ctor: 'MP', _0: a};
};
var _user$project$Main$Calendar = function (a) {
	return {ctor: 'Calendar', _0: a};
};
var _user$project$Main$About = function (a) {
	return {ctor: 'About', _0: a};
};
var _user$project$Main$Editor = F2(
	function (a, b) {
		return {ctor: 'Editor', _0: a, _1: b};
	});
var _user$project$Main$Article = function (a) {
	return {ctor: 'Article', _0: a};
};
var _user$project$Main$Narthex = function (a) {
	return {ctor: 'Narthex', _0: a};
};
var _user$project$Main$Profile = F2(
	function (a, b) {
		return {ctor: 'Profile', _0: a, _1: b};
	});
var _user$project$Main$Register = function (a) {
	return {ctor: 'Register', _0: a};
};
var _user$project$Main$Login = function (a) {
	return {ctor: 'Login', _0: a};
};
var _user$project$Main$Settings = function (a) {
	return {ctor: 'Settings', _0: a};
};
var _user$project$Main$Home = function (a) {
	return {ctor: 'Home', _0: a};
};
var _user$project$Main$Errored = function (a) {
	return {ctor: 'Errored', _0: a};
};
var _user$project$Main$NotFound = {ctor: 'NotFound'};
var _user$project$Main$Blank = {ctor: 'Blank'};
var _user$project$Main$initialPage = _user$project$Main$Blank;
var _user$project$Main$TransitioningFrom = function (a) {
	return {ctor: 'TransitioningFrom', _0: a};
};
var _user$project$Main$Loaded = function (a) {
	return {ctor: 'Loaded', _0: a};
};
var _user$project$Main$pageErrored = F3(
	function (model, activePage, errorMessage) {
		var error = A2(_user$project$Elm_Page_Errored$pageLoadError, activePage, errorMessage);
		return A2(
			_user$project$Elm_Util_ops['=>'],
			_elm_lang$core$Native_Utils.update(
				model,
				{
					pageState: _user$project$Main$Loaded(
						_user$project$Main$Errored(error))
				}),
			_elm_lang$core$Platform_Cmd$none);
	});
var _user$project$Main$PortError = function (a) {
	return {ctor: 'PortError', _0: a};
};
var _user$project$Main$RequestedFeed = function (a) {
	return {ctor: 'RequestedFeed', _0: a};
};
var _user$project$Main$RequestedCalendar = function (a) {
	return {ctor: 'RequestedCalendar', _0: a};
};
var _user$project$Main$DbSync = function (a) {
	return {ctor: 'DbSync', _0: a};
};
var _user$project$Main$GetCalendar = function (a) {
	return {ctor: 'GetCalendar', _0: a};
};
var _user$project$Main$GetDailyLessons = function (a) {
	return {ctor: 'GetDailyLessons', _0: a};
};
var _user$project$Main$CommunionToSickMsg = function (a) {
	return {ctor: 'CommunionToSickMsg', _0: a};
};
var _user$project$Main$ComplineMsg = function (a) {
	return {ctor: 'ComplineMsg', _0: a};
};
var _user$project$Main$EPMsg = function (a) {
	return {ctor: 'EPMsg', _0: a};
};
var _user$project$Main$MiddayMsg = function (a) {
	return {ctor: 'MiddayMsg', _0: a};
};
var _user$project$Main$MPMsg = function (a) {
	return {ctor: 'MPMsg', _0: a};
};
var _user$project$Main$MPLoaded = function (a) {
	return {ctor: 'MPLoaded', _0: a};
};
var _user$project$Main$CalendarMsg = function (a) {
	return {ctor: 'CalendarMsg', _0: a};
};
var _user$project$Main$NarthexMsg = function (a) {
	return {ctor: 'NarthexMsg', _0: a};
};
var _user$project$Main$AboutMsg = function (a) {
	return {ctor: 'AboutMsg', _0: a};
};
var _user$project$Main$EditorMsg = function (a) {
	return {ctor: 'EditorMsg', _0: a};
};
var _user$project$Main$ArticleMsg = function (a) {
	return {ctor: 'ArticleMsg', _0: a};
};
var _user$project$Main$ProfileMsg = function (a) {
	return {ctor: 'ProfileMsg', _0: a};
};
var _user$project$Main$RegisterMsg = function (a) {
	return {ctor: 'RegisterMsg', _0: a};
};
var _user$project$Main$LoginMsg = function (a) {
	return {ctor: 'LoginMsg', _0: a};
};
var _user$project$Main$RequestedLessons = function (a) {
	return {ctor: 'RequestedLessons', _0: a};
};
var _user$project$Main$RequestedProfile = function (a) {
	return {ctor: 'RequestedProfile', _0: a};
};
var _user$project$Main$SetUser = function (a) {
	return {ctor: 'SetUser', _0: a};
};
var _user$project$Main$SettingsMsg = function (a) {
	return {ctor: 'SettingsMsg', _0: a};
};
var _user$project$Main$pageSubscriptions = function (page) {
	var _p8 = page;
	switch (_p8.ctor) {
		case 'Blank':
			return _elm_lang$core$Platform_Sub$none;
		case 'Errored':
			return _elm_lang$core$Platform_Sub$none;
		case 'NotFound':
			return _elm_lang$core$Platform_Sub$none;
		case 'Settings':
			return A2(
				_elm_lang$core$Platform_Sub$map,
				_user$project$Main$SettingsMsg,
				_user$project$Elm_Page_Settings$subscriptions(_p8._0));
		case 'Home':
			return _elm_lang$core$Platform_Sub$none;
		case 'Login':
			return A2(
				_elm_lang$core$Platform_Sub$map,
				_user$project$Main$LoginMsg,
				_user$project$Elm_Page_Login$subscriptions(_p8._0));
		case 'Register':
			return A2(
				_elm_lang$core$Platform_Sub$map,
				_user$project$Main$RegisterMsg,
				_user$project$Elm_Page_Register$subscriptions(_p8._0));
		case 'Profile':
			return A2(
				_elm_lang$core$Platform_Sub$map,
				_user$project$Main$ProfileMsg,
				_user$project$Elm_Page_Profile$subscriptions(_p8._1));
		case 'Article':
			return A2(
				_elm_lang$core$Platform_Sub$map,
				_user$project$Main$ArticleMsg,
				_user$project$Elm_Page_Article$subscriptions(_p8._0));
		case 'Editor':
			return _elm_lang$core$Platform_Sub$none;
		case 'About':
			return _elm_lang$core$Platform_Sub$none;
		case 'Narthex':
			return A2(
				_elm_lang$core$Platform_Sub$map,
				_user$project$Main$NarthexMsg,
				_user$project$Elm_Page_Narthex$subscriptions(_p8._0));
		case 'Calendar':
			return A2(
				_elm_lang$core$Platform_Sub$map,
				_user$project$Main$CalendarMsg,
				_user$project$Elm_Page_Calendar$subscriptions(_p8._0));
		case 'MP':
			return A2(
				_elm_lang$core$Platform_Sub$map,
				_user$project$Main$MPMsg,
				_user$project$Elm_Page_MP$subscriptions(_p8._0));
		case 'Midday':
			return A2(
				_elm_lang$core$Platform_Sub$map,
				_user$project$Main$MiddayMsg,
				_user$project$Elm_Page_Midday$subscriptions(_p8._0));
		case 'EP':
			return A2(
				_elm_lang$core$Platform_Sub$map,
				_user$project$Main$EPMsg,
				_user$project$Elm_Page_EP$subscriptions(_p8._0));
		case 'Compline':
			return A2(
				_elm_lang$core$Platform_Sub$map,
				_user$project$Main$ComplineMsg,
				_user$project$Elm_Page_Compline$subscriptions(_p8._0));
		default:
			return A2(
				_elm_lang$core$Platform_Sub$map,
				_user$project$Main$CommunionToSickMsg,
				_user$project$Elm_Page_CommunionToSick$subscriptions(_p8._0));
	}
};
var _user$project$Main$subscriptions = function (model) {
	return _elm_lang$core$Platform_Sub$batch(
		{
			ctor: '::',
			_0: _user$project$Main$pageSubscriptions(
				_user$project$Main$getPage(model.pageState)),
			_1: {
				ctor: '::',
				_0: A2(_elm_lang$core$Platform_Sub$map, _user$project$Main$DbSync, _user$project$Main$dbSync),
				_1: {
					ctor: '::',
					_0: A2(_elm_lang$core$Platform_Sub$map, _user$project$Main$PortError, _user$project$Main$portError),
					_1: {
						ctor: '::',
						_0: A2(_elm_lang$core$Platform_Sub$map, _user$project$Main$RequestedCalendar, _user$project$Main$requestedCalendar),
						_1: {
							ctor: '::',
							_0: A2(_elm_lang$core$Platform_Sub$map, _user$project$Main$RequestedFeed, _user$project$Main$requestedFeed),
							_1: {
								ctor: '::',
								_0: A2(_elm_lang$core$Platform_Sub$map, _user$project$Main$RequestedLessons, _user$project$Main$requestedLessons),
								_1: {
									ctor: '::',
									_0: A2(_elm_lang$core$Platform_Sub$map, _user$project$Main$SetUser, _user$project$Main$sessionChange),
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			}
		});
};
var _user$project$Main$HomeMsg = function (a) {
	return {ctor: 'HomeMsg', _0: a};
};
var _user$project$Main$viewPage = F4(
	function (session, isLoading, isSyncing, page) {
		var frame = A3(_user$project$Elm_Views_Page$frame, isLoading, isSyncing, session.user);
		var _p9 = page;
		switch (_p9.ctor) {
			case 'NotFound':
				return A2(
					frame,
					_user$project$Elm_Views_Page$Other,
					_user$project$Elm_Page_NotFound$view(session));
			case 'Blank':
				return A2(
					frame,
					_user$project$Elm_Views_Page$Other,
					_elm_lang$html$Html$text(''));
			case 'Errored':
				return A2(
					frame,
					_user$project$Elm_Views_Page$Other,
					A2(_user$project$Elm_Page_Errored$view, session, _p9._0));
			case 'Settings':
				return A2(
					_elm_lang$html$Html$map,
					_user$project$Main$SettingsMsg,
					A2(
						frame,
						_user$project$Elm_Views_Page$Other,
						A2(_user$project$Elm_Page_Settings$view, session, _p9._0)));
			case 'Home':
				return A2(
					_elm_lang$html$Html$map,
					_user$project$Main$HomeMsg,
					A2(
						frame,
						_user$project$Elm_Views_Page$Home,
						A2(_user$project$Elm_Page_Home$view, session, _p9._0)));
			case 'Login':
				return A2(
					_elm_lang$html$Html$map,
					_user$project$Main$LoginMsg,
					A2(
						frame,
						_user$project$Elm_Views_Page$Other,
						A2(_user$project$Elm_Page_Login$view, session, _p9._0)));
			case 'Register':
				return A2(
					_elm_lang$html$Html$map,
					_user$project$Main$RegisterMsg,
					A2(
						frame,
						_user$project$Elm_Views_Page$Other,
						A2(_user$project$Elm_Page_Register$view, session, _p9._0)));
			case 'Profile':
				return A2(
					_elm_lang$html$Html$map,
					_user$project$Main$ProfileMsg,
					A2(
						frame,
						_user$project$Elm_Views_Page$Profile(_p9._0),
						A2(_user$project$Elm_Page_Profile$view, session, _p9._1)));
			case 'Article':
				return A2(
					_elm_lang$html$Html$map,
					_user$project$Main$ArticleMsg,
					A2(
						frame,
						_user$project$Elm_Views_Page$Other,
						A2(_user$project$Elm_Page_Article$view, session, _p9._0)));
			case 'Editor':
				var framePage = _elm_lang$core$Native_Utils.eq(_p9._0, _elm_lang$core$Maybe$Nothing) ? _user$project$Elm_Views_Page$NewArticle : _user$project$Elm_Views_Page$Other;
				return A2(
					_elm_lang$html$Html$map,
					_user$project$Main$EditorMsg,
					A2(
						frame,
						framePage,
						_user$project$Elm_Page_Article_Editor$view(_p9._1)));
			case 'About':
				return A2(
					_elm_lang$html$Html$map,
					_user$project$Main$AboutMsg,
					A2(
						frame,
						_user$project$Elm_Views_Page$Other,
						_user$project$Elm_Page_About$view(_p9._0)));
			case 'Narthex':
				return A2(
					_elm_lang$html$Html$map,
					_user$project$Main$NarthexMsg,
					A2(
						frame,
						_user$project$Elm_Views_Page$Other,
						_user$project$Elm_Page_Narthex$view(_p9._0)));
			case 'Calendar':
				return A2(
					_elm_lang$html$Html$map,
					_user$project$Main$CalendarMsg,
					A2(
						frame,
						_user$project$Elm_Views_Page$Other,
						_user$project$Elm_Page_Calendar$view(_p9._0)));
			case 'MP':
				return A2(
					_elm_lang$html$Html$map,
					_user$project$Main$MPMsg,
					A2(
						frame,
						_user$project$Elm_Views_Page$Other,
						_user$project$Elm_Page_MP$view(_p9._0)));
			case 'Midday':
				return A2(
					_elm_lang$html$Html$map,
					_user$project$Main$MiddayMsg,
					A2(
						frame,
						_user$project$Elm_Views_Page$Other,
						_user$project$Elm_Page_Midday$view(_p9._0)));
			case 'EP':
				return A2(
					_elm_lang$html$Html$map,
					_user$project$Main$EPMsg,
					A2(
						frame,
						_user$project$Elm_Views_Page$Other,
						_user$project$Elm_Page_EP$view(_p9._0)));
			case 'Compline':
				return A2(
					_elm_lang$html$Html$map,
					_user$project$Main$ComplineMsg,
					A2(
						frame,
						_user$project$Elm_Views_Page$Other,
						_user$project$Elm_Page_Compline$view(_p9._0)));
			default:
				return A2(
					_elm_lang$html$Html$map,
					_user$project$Main$CommunionToSickMsg,
					A2(
						frame,
						_user$project$Elm_Views_Page$Other,
						_user$project$Elm_Page_CommunionToSick$view(_p9._0)));
		}
	});
var _user$project$Main$view = function (model) {
	var _p10 = model.pageState;
	if (_p10.ctor === 'Loaded') {
		return A4(_user$project$Main$viewPage, model.session, false, model.dbSyncing, _p10._0);
	} else {
		return A4(_user$project$Main$viewPage, model.session, true, model.dbSyncing, _p10._0);
	}
};
var _user$project$Main$EditArticleLoaded = F2(
	function (a, b) {
		return {ctor: 'EditArticleLoaded', _0: a, _1: b};
	});
var _user$project$Main$ProfileLoaded = F2(
	function (a, b) {
		return {ctor: 'ProfileLoaded', _0: a, _1: b};
	});
var _user$project$Main$ArtileLoaded = function (a) {
	return {ctor: 'ArtileLoaded', _0: a};
};
var _user$project$Main$setRoute = F2(
	function (maybeRoute, model) {
		var errored = _user$project$Main$pageErrored(model);
		var transition = F2(
			function (toMsg, task) {
				return A2(
					_user$project$Elm_Util_ops['=>'],
					_elm_lang$core$Native_Utils.update(
						model,
						{
							pageState: _user$project$Main$TransitioningFrom(
								_user$project$Main$getPage(model.pageState))
						}),
					A2(_elm_lang$core$Task$attempt, toMsg, task));
			});
		var _p11 = maybeRoute;
		if (_p11.ctor === 'Nothing') {
			return A2(
				_user$project$Elm_Util_ops['=>'],
				_elm_lang$core$Native_Utils.update(
					model,
					{
						pageState: _user$project$Main$Loaded(_user$project$Main$NotFound)
					}),
				_elm_lang$core$Platform_Cmd$none);
		} else {
			switch (_p11._0.ctor) {
				case 'NewArticle':
					var _p12 = model.session.user;
					if (_p12.ctor === 'Just') {
						return A2(
							_user$project$Elm_Util_ops['=>'],
							_elm_lang$core$Native_Utils.update(
								model,
								{
									pageState: _user$project$Main$Loaded(
										A2(_user$project$Main$Editor, _elm_lang$core$Maybe$Nothing, _user$project$Elm_Page_Article_Editor$initNew))
								}),
							_elm_lang$core$Platform_Cmd$none);
					} else {
						return A2(errored, _user$project$Elm_Views_Page$NewArticle, 'You must be signed in t post an article.');
					}
				case 'EditArticle':
					var _p14 = _p11._0._0;
					var _p13 = model.session.user;
					if (_p13.ctor === 'Just') {
						return A2(
							transition,
							_user$project$Main$EditArticleLoaded(_p14),
							A2(_user$project$Elm_Page_Article_Editor$initEdit, model.session, _p14));
					} else {
						return A2(errored, _user$project$Elm_Views_Page$Other, 'You must be signed in to edit an article.');
					}
				case 'Settings':
					var _p15 = model.session.user;
					if (_p15.ctor === 'Just') {
						return A2(
							_user$project$Elm_Util_ops['=>'],
							_elm_lang$core$Native_Utils.update(
								model,
								{
									pageState: _user$project$Main$Loaded(
										_user$project$Main$Settings(
											_user$project$Elm_Page_Settings$init(_p15._0)))
								}),
							_elm_lang$core$Platform_Cmd$none);
					} else {
						return A2(errored, _user$project$Elm_Views_Page$Settings, 'You must be signed in to access  your settings.');
					}
				case 'Home':
					return A2(
						_user$project$Elm_Util_ops['=>'],
						model,
						A4(_user$project$Elm_Ports$requestFeed, model.session.user, 'global', 20, 0));
				case 'Login':
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								pageState: _user$project$Main$Loaded(
									_user$project$Main$Login(_user$project$Elm_Page_Login$initialModel))
							}),
						_elm_lang$core$Platform_Cmd$none);
				case 'Logout':
					var session = model.session;
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								session: _elm_lang$core$Native_Utils.update(
									session,
									{user: _elm_lang$core$Maybe$Nothing})
							}),
						_elm_lang$core$Platform_Cmd$batch(
							{
								ctor: '::',
								_0: _user$project$Elm_Ports$storeSession(
									_elm_lang$core$Maybe$Just('{}')),
								_1: {
									ctor: '::',
									_0: _user$project$Elm_Route$modifyUrl(_user$project$Elm_Route$Home),
									_1: {ctor: '[]'}
								}
							}));
				case 'Register':
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								pageState: _user$project$Main$Loaded(
									_user$project$Main$Register(_user$project$Elm_Page_Register$initialModel))
							}),
						_elm_lang$core$Platform_Cmd$none);
				case 'Profile':
					var _p16 = _p11._0._0;
					return A2(
						_user$project$Elm_Util_ops['=>'],
						model,
						A2(_user$project$Elm_Ports$profileRequest, _p16, _p16));
				case 'Article':
					return A2(
						transition,
						_user$project$Main$ArtileLoaded,
						A2(_user$project$Elm_Page_Article$init, model.session, _p11._0._0));
				case 'About':
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								pageState: _user$project$Main$Loaded(
									_user$project$Main$About(_user$project$Elm_Page_About$init))
							}),
						_elm_lang$core$Platform_Cmd$none);
				case 'Narthex':
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								pageState: _user$project$Main$Loaded(
									_user$project$Main$Narthex(_user$project$Elm_Page_Narthex$init))
							}),
						_elm_lang$core$Platform_Cmd$none);
				case 'Calendar':
					return A2(_user$project$Elm_Util_ops['=>'], model, _user$project$Elm_Ports$requestCalendar);
				case 'MP':
					return A2(
						_user$project$Elm_Util_ops['=>'],
						model,
						_user$project$Elm_Ports$requestLessons('mp'));
				case 'EP':
					return A2(
						_user$project$Elm_Util_ops['=>'],
						model,
						_user$project$Elm_Ports$requestLessons('ep'));
				case 'Midday':
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								pageState: _user$project$Main$Loaded(
									_user$project$Main$Midday(_user$project$Elm_Page_Midday$init))
							}),
						_elm_lang$core$Platform_Cmd$none);
				case 'Compline':
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								pageState: _user$project$Main$Loaded(
									_user$project$Main$Compline(_user$project$Elm_Page_Compline$init))
							}),
						_elm_lang$core$Platform_Cmd$none);
				default:
					return A2(
						_user$project$Elm_Util_ops['=>'],
						_elm_lang$core$Native_Utils.update(
							model,
							{
								pageState: _user$project$Main$Loaded(
									_user$project$Main$CommunionToSick(_user$project$Elm_Page_CommunionToSick$initModel))
							}),
						_elm_lang$core$Platform_Cmd$none);
			}
		}
	});
var _user$project$Main$init = F2(
	function (val, location) {
		return A2(
			_user$project$Main$setRoute,
			_user$project$Elm_Route$fromLocation(location),
			{
				pageState: _user$project$Main$Loaded(_user$project$Main$initialPage),
				session: {
					user: _user$project$Main$decodeUserFromJson(val)
				},
				dailyLessons: _user$project$Elm_Data_Lessons$initDailyLessons,
				euLessons: _user$project$Elm_Data_Lessons$initEuLessons,
				calendar: _user$project$Elm_Data_Calendar$initCalendar,
				dbSyncing: false
			});
	});
var _user$project$Main$updatePage = F3(
	function (page, msg, model) {
		var errored = _user$project$Main$pageErrored(model);
		var toPage = F5(
			function (toModel, toMsg, subUpdate, subMsg, subModel) {
				var _p17 = A2(subUpdate, subMsg, subModel);
				var newModel = _p17._0;
				var newCmd = _p17._1;
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{
							pageState: _user$project$Main$Loaded(
								toModel(newModel))
						}),
					_1: A2(_elm_lang$core$Platform_Cmd$map, toMsg, newCmd)
				};
			});
		var session = model.session;
		var _p18 = {ctor: '_Tuple2', _0: msg, _1: page};
		_v8_35:
		do {
			_v8_34:
			do {
				switch (_p18._0.ctor) {
					case 'SetRoute':
						return A2(_user$project$Main$setRoute, _p18._0._0, model);
					case 'HomeLoaded':
						if (_p18._0._0.ctor === 'Ok') {
							return A2(
								_user$project$Elm_Util_ops['=>'],
								_elm_lang$core$Native_Utils.update(
									model,
									{
										pageState: _user$project$Main$Loaded(
											_user$project$Main$Home(_p18._0._0._0))
									}),
								_elm_lang$core$Platform_Cmd$none);
						} else {
							return A2(
								_user$project$Elm_Util_ops['=>'],
								_elm_lang$core$Native_Utils.update(
									model,
									{
										pageState: _user$project$Main$Loaded(
											_user$project$Main$Errored(_p18._0._0._0))
									}),
								_elm_lang$core$Platform_Cmd$none);
						}
					case 'ProfileLoaded':
						if (_p18._0._1.ctor === 'Ok') {
							return A2(
								_user$project$Elm_Util_ops['=>'],
								_elm_lang$core$Native_Utils.update(
									model,
									{
										pageState: _user$project$Main$Loaded(
											A2(_user$project$Main$Profile, _p18._0._0, _p18._0._1._0))
									}),
								_elm_lang$core$Platform_Cmd$none);
						} else {
							return A2(
								_user$project$Elm_Util_ops['=>'],
								_elm_lang$core$Native_Utils.update(
									model,
									{
										pageState: _user$project$Main$Loaded(
											_user$project$Main$Errored(_p18._0._1._0))
									}),
								_elm_lang$core$Platform_Cmd$none);
						}
					case 'ArtileLoaded':
						if (_p18._0._0.ctor === 'Ok') {
							return A2(
								_user$project$Elm_Util_ops['=>'],
								_elm_lang$core$Native_Utils.update(
									model,
									{
										pageState: _user$project$Main$Loaded(
											_user$project$Main$Article(_p18._0._0._0))
									}),
								_elm_lang$core$Platform_Cmd$none);
						} else {
							return A2(
								_user$project$Elm_Util_ops['=>'],
								_elm_lang$core$Native_Utils.update(
									model,
									{
										pageState: _user$project$Main$Loaded(
											_user$project$Main$Errored(_p18._0._0._0))
									}),
								_elm_lang$core$Platform_Cmd$none);
						}
					case 'EditArticleLoaded':
						if (_p18._0._1.ctor === 'Ok') {
							return A2(
								_user$project$Elm_Util_ops['=>'],
								_elm_lang$core$Native_Utils.update(
									model,
									{
										pageState: _user$project$Main$Loaded(
											A2(
												_user$project$Main$Editor,
												_elm_lang$core$Maybe$Just(_p18._0._0),
												_p18._0._1._0))
									}),
								_elm_lang$core$Platform_Cmd$none);
						} else {
							return A2(
								_user$project$Elm_Util_ops['=>'],
								_elm_lang$core$Native_Utils.update(
									model,
									{
										pageState: _user$project$Main$Loaded(
											_user$project$Main$Errored(_p18._0._1._0))
									}),
								_elm_lang$core$Platform_Cmd$none);
						}
					case 'SetUser':
						var _p19 = _p18._0._0;
						var session = model.session;
						var cmd = ((!_elm_lang$core$Native_Utils.eq(session.user, _elm_lang$core$Maybe$Nothing)) && _elm_lang$core$Native_Utils.eq(_p19, _elm_lang$core$Maybe$Nothing)) ? _user$project$Elm_Route$modifyUrl(_user$project$Elm_Route$Home) : _elm_lang$core$Platform_Cmd$none;
						return A2(
							_user$project$Elm_Util_ops['=>'],
							_elm_lang$core$Native_Utils.update(
								model,
								{
									session: _elm_lang$core$Native_Utils.update(
										session,
										{user: _p19})
								}),
							cmd);
					case 'SettingsMsg':
						switch (_p18._1.ctor) {
							case 'Settings':
								var _p20 = A3(_user$project$Elm_Page_Settings$update, model.session, _p18._0._0, _p18._1._0);
								var pageModel = _p20._0._0;
								var cmd = _p20._0._1;
								var msgFromPage = _p20._1;
								var newModel = function () {
									var _p21 = msgFromPage;
									if (_p21.ctor === 'NoOp') {
										return model;
									} else {
										var session = model.session;
										return _elm_lang$core$Native_Utils.update(
											model,
											{
												session: {
													user: _elm_lang$core$Maybe$Just(_p21._0)
												}
											});
									}
								}();
								return A2(
									_user$project$Elm_Util_ops['=>'],
									_elm_lang$core$Native_Utils.update(
										newModel,
										{
											pageState: _user$project$Main$Loaded(
												_user$project$Main$Settings(pageModel))
										}),
									A2(_elm_lang$core$Platform_Cmd$map, _user$project$Main$SettingsMsg, cmd));
							case 'NotFound':
								break _v8_34;
							default:
								break _v8_35;
						}
					case 'LoginMsg':
						switch (_p18._1.ctor) {
							case 'Login':
								var _p22 = A2(_user$project$Elm_Page_Login$update, _p18._0._0, _p18._1._0);
								var pageModel = _p22._0._0;
								var cmd = _p22._0._1;
								var msgFromPage = _p22._1;
								var newModel = function () {
									var _p23 = msgFromPage;
									if (_p23.ctor === 'NoOp') {
										return model;
									} else {
										var session = model.session;
										return _elm_lang$core$Native_Utils.update(
											model,
											{
												session: {
													user: _elm_lang$core$Maybe$Just(_p23._0)
												}
											});
									}
								}();
								return A2(
									_user$project$Elm_Util_ops['=>'],
									_elm_lang$core$Native_Utils.update(
										newModel,
										{
											pageState: _user$project$Main$Loaded(
												_user$project$Main$Login(pageModel))
										}),
									A2(_elm_lang$core$Platform_Cmd$map, _user$project$Main$LoginMsg, cmd));
							case 'NotFound':
								break _v8_34;
							default:
								break _v8_35;
						}
					case 'RegisterMsg':
						switch (_p18._1.ctor) {
							case 'Register':
								var _p24 = A2(_user$project$Elm_Page_Register$update, _p18._0._0, _p18._1._0);
								var pageModel = _p24._0._0;
								var cmd = _p24._0._1;
								var msgFromPage = _p24._1;
								var newModel = function () {
									var _p25 = msgFromPage;
									if (_p25.ctor === 'NoOp') {
										return model;
									} else {
										var session = model.session;
										return _elm_lang$core$Native_Utils.update(
											model,
											{
												session: {
													user: _elm_lang$core$Maybe$Just(_p25._0)
												}
											});
									}
								}();
								return A2(
									_user$project$Elm_Util_ops['=>'],
									_elm_lang$core$Native_Utils.update(
										newModel,
										{
											pageState: _user$project$Main$Loaded(
												_user$project$Main$Register(pageModel))
										}),
									A2(_elm_lang$core$Platform_Cmd$map, _user$project$Main$RegisterMsg, cmd));
							case 'NotFound':
								break _v8_34;
							default:
								break _v8_35;
						}
					case 'HomeMsg':
						switch (_p18._1.ctor) {
							case 'Home':
								return A5(
									toPage,
									_user$project$Main$Home,
									_user$project$Main$HomeMsg,
									_user$project$Elm_Page_Home$update(session),
									_p18._0._0,
									_p18._1._0);
							case 'NotFound':
								break _v8_34;
							default:
								break _v8_35;
						}
					case 'ProfileMsg':
						switch (_p18._1.ctor) {
							case 'Profile':
								return A5(
									toPage,
									_user$project$Main$Profile(_p18._1._0),
									_user$project$Main$ProfileMsg,
									_user$project$Elm_Page_Profile$update(model.session),
									_p18._0._0,
									_p18._1._1);
							case 'NotFound':
								break _v8_34;
							default:
								break _v8_35;
						}
					case 'ArticleMsg':
						switch (_p18._1.ctor) {
							case 'Article':
								return A5(
									toPage,
									_user$project$Main$Article,
									_user$project$Main$ArticleMsg,
									_user$project$Elm_Page_Article$update(model.session),
									_p18._0._0,
									_p18._1._0);
							case 'NotFound':
								break _v8_34;
							default:
								break _v8_35;
						}
					case 'EditorMsg':
						switch (_p18._1.ctor) {
							case 'Editor':
								var _p27 = _p18._1._0;
								var _p26 = model.session.user;
								if (_p26.ctor === 'Nothing') {
									return _elm_lang$core$Native_Utils.eq(_p27, _elm_lang$core$Maybe$Nothing) ? A2(errored, _user$project$Elm_Views_Page$NewArticle, 'You must be signed in to post articles') : A2(errored, _user$project$Elm_Views_Page$Other, 'You must be signed in to edit articles.');
								} else {
									return A5(
										toPage,
										_user$project$Main$Editor(_p27),
										_user$project$Main$EditorMsg,
										_user$project$Elm_Page_Article_Editor$update(_p26._0),
										_p18._0._0,
										_p18._1._1);
								}
							case 'NotFound':
								break _v8_34;
							default:
								break _v8_35;
						}
					case 'MPMsg':
						switch (_p18._1.ctor) {
							case 'MP':
								return A5(toPage, _user$project$Main$MP, _user$project$Main$MPMsg, _user$project$Elm_Page_MP$update, _p18._0._0, _p18._1._0);
							case 'NotFound':
								break _v8_34;
							default:
								break _v8_35;
						}
					case 'MiddayMsg':
						switch (_p18._1.ctor) {
							case 'Midday':
								return A5(toPage, _user$project$Main$Midday, _user$project$Main$MiddayMsg, _user$project$Elm_Page_Midday$update, _p18._0._0, _p18._1._0);
							case 'NotFound':
								break _v8_34;
							default:
								break _v8_35;
						}
					case 'EPMsg':
						switch (_p18._1.ctor) {
							case 'EP':
								return A5(toPage, _user$project$Main$EP, _user$project$Main$EPMsg, _user$project$Elm_Page_EP$update, _p18._0._0, _p18._1._0);
							case 'NotFound':
								break _v8_34;
							default:
								break _v8_35;
						}
					case 'ComplineMsg':
						switch (_p18._1.ctor) {
							case 'Compline':
								return A5(toPage, _user$project$Main$Compline, _user$project$Main$ComplineMsg, _user$project$Elm_Page_Compline$update, _p18._0._0, _p18._1._0);
							case 'NotFound':
								break _v8_34;
							default:
								break _v8_35;
						}
					case 'CommunionToSickMsg':
						switch (_p18._1.ctor) {
							case 'CommunionToSick':
								return A5(toPage, _user$project$Main$CommunionToSick, _user$project$Main$CommunionToSickMsg, _user$project$Elm_Page_CommunionToSick$update, _p18._0._0, _p18._1._0);
							case 'NotFound':
								break _v8_34;
							default:
								break _v8_35;
						}
					case 'CalendarMsg':
						switch (_p18._1.ctor) {
							case 'Calendar':
								return A5(toPage, _user$project$Main$Calendar, _user$project$Main$CalendarMsg, _user$project$Elm_Page_Calendar$update, _p18._0._0, _p18._1._0);
							case 'NotFound':
								break _v8_34;
							default:
								break _v8_35;
						}
					case 'GetCalendar':
						return A2(_user$project$Elm_Util_ops['=>'], model, _user$project$Elm_Ports$requestCalendar);
					case 'GetDailyLessons':
						return A2(
							_user$project$Elm_Util_ops['=>'],
							model,
							_user$project$Elm_Ports$requestLessons(_p18._0._0));
					case 'DbSync':
						if (_p18._0._0.ctor === 'Just') {
							var dbSyncing = _elm_lang$core$Native_Utils.eq(_p18._0._0._0, 'busy');
							return A2(
								_user$project$Elm_Util_ops['=>'],
								_elm_lang$core$Native_Utils.update(
									model,
									{dbSyncing: dbSyncing}),
								_elm_lang$core$Platform_Cmd$none);
						} else {
							if (_p18._1.ctor === 'NotFound') {
								break _v8_34;
							} else {
								break _v8_35;
							}
						}
					case 'RequestedFeed':
						if (_p18._0._0.ctor === 'Just') {
							return A2(
								_user$project$Elm_Util_ops['=>'],
								_elm_lang$core$Native_Utils.update(
									model,
									{
										pageState: _user$project$Main$Loaded(
											_user$project$Main$Home(
												A2(_user$project$Elm_Page_Home$init, model.session, _p18._0._0._0)))
									}),
								_elm_lang$core$Platform_Cmd$none);
						} else {
							var _p28 = A2(_elm_lang$core$Debug$log, 'ELM REQUEST FEED FAIL:', _p18._1);
							return A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none);
						}
					case 'RequestedProfile':
						if (_p18._0._0.ctor === 'Just') {
							return A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none);
						} else {
							return A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none);
						}
					case 'RequestedLessons':
						if (_p18._0._0.ctor === 'Just') {
							var _p29 = _p18._0._0._0;
							return _elm_lang$core$Native_Utils.eq(_p29.office, 'ep') ? A2(
								_user$project$Elm_Util_ops['=>'],
								_elm_lang$core$Native_Utils.update(
									model,
									{
										pageState: _user$project$Main$Loaded(
											_user$project$Main$EP(
												_user$project$Elm_Page_EP$initEP(_p29)))
									}),
								_elm_lang$core$Platform_Cmd$none) : A2(
								_user$project$Elm_Util_ops['=>'],
								_elm_lang$core$Native_Utils.update(
									model,
									{
										pageState: _user$project$Main$Loaded(
											_user$project$Main$MP(
												_user$project$Elm_Page_MP$initMP(_p29)))
									}),
								_elm_lang$core$Platform_Cmd$none);
						} else {
							return A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none);
						}
					case 'RequestedCalendar':
						if (_p18._0._0.ctor === 'Just') {
							return A2(
								_user$project$Elm_Util_ops['=>'],
								_elm_lang$core$Native_Utils.update(
									model,
									{
										pageState: _user$project$Main$Loaded(
											_user$project$Main$Calendar(
												_user$project$Elm_Page_Calendar$initCal(_p18._0._0._0)))
									}),
								_elm_lang$core$Platform_Cmd$none);
						} else {
							if (_p18._1.ctor === 'NotFound') {
								break _v8_34;
							} else {
								break _v8_35;
							}
						}
					case 'PortError':
						if (_p18._0._0.ctor === 'Just') {
							var _p30 = A2(_elm_lang$core$Debug$log, 'PORT ERROR:', _p18._0._0._0);
							return A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none);
						} else {
							if (_p18._1.ctor === 'NotFound') {
								break _v8_34;
							} else {
								break _v8_35;
							}
						}
					default:
						if (_p18._1.ctor === 'NotFound') {
							break _v8_34;
						} else {
							break _v8_35;
						}
				}
			} while(false);
			var _p31 = A2(_elm_lang$core$Debug$log, 'ELM UPDATE FAIL NOT FOUND:', _p18._0);
			return A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none);
		} while(false);
		var _p32 = A2(
			_elm_lang$core$Debug$log,
			'ELM UPDATE FAIL NO MATCEHS:',
			{ctor: '_Tuple2', _0: _p18._0, _1: _p18._1});
		return A2(_user$project$Elm_Util_ops['=>'], model, _elm_lang$core$Platform_Cmd$none);
	});
var _user$project$Main$update = F2(
	function (msg, model) {
		return A3(
			_user$project$Main$updatePage,
			_user$project$Main$getPage(model.pageState),
			msg,
			model);
	});
var _user$project$Main$HomeLoaded = function (a) {
	return {ctor: 'HomeLoaded', _0: a};
};
var _user$project$Main$SetRoute = function (a) {
	return {ctor: 'SetRoute', _0: a};
};
var _user$project$Main$main = A2(
	_elm_lang$navigation$Navigation$programWithFlags,
	function (_p33) {
		return _user$project$Main$SetRoute(
			_user$project$Elm_Route$fromLocation(_p33));
	},
	{init: _user$project$Main$init, view: _user$project$Main$view, update: _user$project$Main$update, subscriptions: _user$project$Main$subscriptions})(_elm_lang$core$Json_Decode$value);

var Elm = {};
Elm['Main'] = Elm['Main'] || {};
if (typeof _user$project$Main$main !== 'undefined') {
    _user$project$Main$main(Elm['Main'], 'Main', undefined);
}

if (typeof define === "function" && define['amd'])
{
  define([], function() { return Elm; });
  return;
}

if (typeof module === "object")
{
  module['exports'] = Elm;
  return;
}

var globalElm = this['Elm'];
if (typeof globalElm === "undefined")
{
  this['Elm'] = Elm;
  return;
}

for (var publicModule in Elm)
{
  if (publicModule in globalElm)
  {
    throw new Error('There are two Elm modules called `' + publicModule + '` on this page! Rename one of them.');
  }
  globalElm[publicModule] = Elm[publicModule];
}

}).call(this);

