# Simple fake table sorter

This jQuery plugin allows to sort table made without table markup.

## Demo

<a href="https://melicerte.github.io/jquery-fake-table-sort/demo.html" target="_blank">jQuery fake table sort demo</a>

## Installation

From npm

```bash
npm install melicerte/jquery-fake-table-sort
```

Use directly in HTML:

```html
<script
  src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
  integrity="sha256-k2WSCIexGzOj3Euiig+TlR8gA0EmPjuc79OEeY5L45g="
  crossorigin="anonymous"></script>
```

Include **jQuery Fake Table Sort:**

```html
<script src="js/jquery.fakeTableSort.min.js"></script>
```

### Prerequisites

```
jQuery >= 1.7.0
```

## Usage

```javascript
jQuery('.table-fake').fakeTableSortable();
```

### With options
```javascript
jQuery('.table-fake').fakeTableSortable({
    headerItems: 'div.table-fake-row-first > div',
    lineItems: 'div.table-fake-row',
    cellItems: 'div.table-fake-col',
    sortMethods: ['lexicographical', 'lexicographical', 'lexicographical', 'number'],
    textConverter: [null, null, convertDateInterval, null]
});
```

**headerItems** : CSS selector to find headers cells in the fake table.<br/>
*Defaults to div.table-fake-row-first > div*

**lineItems** : CSS selector to find content lines in the fake table.<br/>
*Defaults to div.table-fake-row*

**cellItems** : CSS selector to find content cell in content lines<br/>
*Defaults to div.table-fake-col*

**firstSort** : 'asc' or 'desc' : set first wanted order sort.<br/>
 Defaults to 'asc'.

**sortMethods** : Used to choose the sorting method.<br/>
Can be either a string or an array.<br/>
If it is string, the same sort method is used for every column.<br/>
If it is an array, each value will be used for one column.<br/>
You can use 'lexicographical' or 'number' sort.<br/>
*Defaults to "lexicographical"*

**textConverter** : Used to convert cell content before comparing for sort.<br/>
Can be either a function callback or an array of callback functions.<br/>
If it is string, the text converter callback is used for every column.<br/>
If it is an array, each callback will be used for its associated column.<br/>
The callback function must take one argument **value**, the value to convert, and return the converted value.<br/>
*Defaults to null*

### Style

You can add style on links added on header items.

They have class **fake-table-sorter**, plus **asc** if next action is to sort asc, **desc** id next action is desc sort

## Implementation details

This plugin uses the quicksort algorithm (Lomuto partition scheme).


## Authors

* **Etienne Châtaignier** - *First release*
