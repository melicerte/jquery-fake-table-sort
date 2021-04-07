(function ( $ ) {
    'use strict';

    $.fn.fakeTableSortable = function (options) {

        const settings = $.extend({}, $.fn.fakeTableSortable.defaults, options);

        return this.each(function() {
            const $table = $(this);

            //Enable sort only if there is more than one line
            if ($table.find(settings.lineItems).length > 1) {
                initHeaders($table, settings);
            }
        });

    };

    /**
     * Add links on header items
     * @param $table
     * @param settings
     */
    function initHeaders ($table, settings) {

        $table.find(settings.headerItems).each(function(){
            const $headerItem = $(this);

            const $action = $('<a href="#" class="fake-table-sorter" data-action="sort-' + settings.firstSort + '"></a>')
                .on('click', function(){
                    var $aSort = $(this);

                    //Run Sort
                    sort($aSort, settings, $table);

                    //Set current trigger
                    setCurrentTrigger($aSort);

                    return false;
                });

            $action.append($headerItem.text());

            $headerItem.html($action);
        });

    };

    /**
     * Do sort on selected column
     * @param elt
     * @param settings
     * @param $table
     * @returns {boolean}
     */
    function sort (elt, settings, $table) {

        //Get column datas
        const $column     = elt.parent();
        const $columnList = $column.parent().children();
        const iCol        = $columnList.index($column);
        const columns     = [];

        const $lineItems = $table.find(settings.lineItems);

        //For each line, get cell texts to use for sort
        $lineItems.each(function(){

            const line = $(this);

            const cell = $(line.find(settings.cellItems).get(iCol));

            let cellText = cell.text().trim();
            if (typeof settings.textConverter === 'string') {
                cellText = settings.textConverter(cellText);
            }

            if (typeof settings.textConverter === 'object' && settings.textConverter !== null && settings.textConverter[iCol] != null) {
                cellText = settings.textConverter[iCol](cellText);
            }

            columns.push({
                line: line,
                text: cellText
            });
        });

        //Set sort method
        let sortMethod = 'lexicographical';
        switch(typeof settings.sortMethods) {
            case 'string':
                sortMethod = settings.sortMethods;
                break;
            case 'object':
                sortMethod = settings.sortMethods[iCol];
                break;
        }

        //Start quicksort algorithm
        quickSort(columns, 0, columns.length - 1, sortMethod);

        //Reverse sort if wanted
        if (elt.attr('data-action') == 'sort-desc') {
            columns.reverse();
        }

        //Delete lines from fake table
        $lineItems.remove();

        //Add sorted lines to fake table
        for (let iLine = 0; iLine < columns.length ;iLine++) {

            const curLineItems = $table.find(settings.lineItems);
            const $line = columns[iLine].line;

            // If lines container exist, use it
            if (settings.linesContainer !== null) {
                //Do add line
                $line.appendTo($table.find(settings.linesContainer));

                continue;
            }

            //By default, add after header
            let $where = $table.find(settings.headerItems).parent();

            //If lines already added, add after last line
            if (curLineItems.length > 0) {
                $where = curLineItems.last();
            }

            //Do add line
            $line.insertAfter($where);
        }

        return false;
    };

    /**
     * Quicksort algorithm
     * @param array
     * @param low
     * @param high
     */
    function quickSort (array, low, high, sortMethod) {
        if (low < high) {
            const p = partition(array, low, high, sortMethod);
            quickSort(array, low, p - 1, sortMethod);
            quickSort(array, p + 1, high, sortMethod);
        }
    };

    /**
     * partition function for the Quicksort algorithm
     * @param array
     * @param low
     * @param high
     * @param sortMethod
     * @returns {number}
     */
    function partition (array, low, high, sortMethod) {
        const pivot = array[high];
        let i = low -1;

        for (let j = low; j <= high; j++) {

            var comparison = compareValues(array[j].text, pivot.text, sortMethod);

            if (comparison === 0 || comparison === -1) {
                i++;
                if (i != j) {
                    const temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            }
        }

        return i;
    };

    /**
     * Set current trigger
     * @param $trigger
     */
    function setCurrentTrigger ($trigger) {

        //Add classes ans set data-action on trigger
        if ($trigger.attr('data-action') == 'sort-asc') {
            $trigger
                .removeClass('asc')
                .addClass('desc')
                .attr('data-action', 'sort-desc')
            ;

        } else {
            $trigger
                .removeClass('desc')
                .addClass('asc')
                .attr('data-action', 'sort-asc')
            ;
        }

        //Remove classes and reset data-action on other triggers
        $trigger
            .parent()
            .siblings()
            .children('a')
            .removeClass('asc')
            .removeClass('desc')
            .attr('data-action', 'sort-asc')
    }

    /**
     * Compare 2 values according to $method
     * @param $value1
     * @param $value2
     * @param $method
     * @returns {number} -1 if $value1 < $value2, 0 if $value1 = $value2, 1 if $value1 > $value2
     */
    function compareValues ($value1, $value2, $method) {
        switch ($method) {
            case 'lexicographical':
                return $value1.localeCompare($value2);
                break;
            case 'number':
                $value1 = parseFloat($value1);
                $value2 = parseFloat($value2);

                if ($value1 < $value2) {
                    return -1;
                }
                if ($value1 == $value2) {
                    return 0;
                }
                if ($value1 > $value2) {
                    return 1;
                }
                break;
        }

        return 0;
    };


    /**
     * Default options for jQuery.FakeTableSort
     * @type {{headerItems: string, lineItems: string, cellItems: string, firstSort: string, sortMethods: string, textConverter: null}}
     */
    $.fn.fakeTableSortable.defaults = {
        headerItems: 'div.table-fake-row-first > div',  //Header items
        lineItems: 'div.table-fake-row',                //Line items
        cellItems: 'div.table-fake-col',                //Column items
        linesContainer: null,                           // If there is a lines container
        firstSort: 'asc',                               //First sort order : asc, then desc, then asc, etc.
        sortMethods: 'lexicographical',                 //Sort method : lexicographical for lexicographical, number for numbers. For a different sort function on each column, use ['number', 'lexicographical']
        textConverter: null                             //Cell text converter : convert data of cell before sorting. Can be string or array with same number of items as sortMethods parameter
    };

}(jQuery || this.jQuery || window.jQuery));
