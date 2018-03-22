// https://www.robertparker.com/search/wines?vintage[]=2015&min-rating=85&expand=true&sort=name&order=desc&page=1

setTimeout(function () {

    var url_string = document.location.href
    var url = new URL(url_string);
    var getPartFileName = url.searchParams.get("filename");

    var hrefNext = jQuery('li.active').next().find('a').attr('href')

    exportTableToCSV(getPartFileName);

    if(jQuery('li.active').next().hasClass('disabled') === false){

        setTimeout(function () {
            if(hrefNext === 'undefined'){
                setTimeout(function () {
                    document.location.href = jQuery('li.active').next().find('a').attr('href') + '&filename=' + getPartFileName
                }, 5000)
            }else{
                document.location.href = jQuery('li.active').next().find('a').attr('href') + '&filename=' + getPartFileName
            }
        }, 2000)

    }

}, 5000)

function exportTableToCSV(partFilename) {

    var filename = 'export' + '_' + partFilename + '_' + jQuery('li.active a').html() +'.csv'

    var $rows = jQuery('.reactive-table.table-standard').find('tr:has(td)')

    // Temporary delimiter characters unlikely to be typed by keyboard
    // This is to avoid accidentally splitting the actual contents
    tmpColDelim = String.fromCharCode(11), // vertical tab character
    tmpRowDelim = String.fromCharCode(0), // null character

    // actual delimiter characters for CSV format
    colDelim = '","',
    rowDelim = '"\r\n"',

    // Grab text from table into CSV formatted string
    csv = '"' + $rows.map(function(i, row) {
        var $row = $(row),
            $cols = $row.find('td');

        return $cols.map(function(j, col) {
            var $col = $(col)

            var text = $col.text()

            //check this col is the color icon
            if($col.attr('class').search('color') !== -1){
                text = $col.find('a').attr('title')
            }

            return text.replace(/"/g, '""'); // escape double quotes

        }).get().join(tmpColDelim);

    }).get().join(tmpRowDelim)
        .split(tmpRowDelim).join(rowDelim)
        .split(tmpColDelim).join(colDelim) + '"';

    var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

    var link = document.createElement("a");
    link.download = filename;
    link.href = csvData;
    document.body.appendChild(link);
    link.click();
}
