
var kubik = [];
var answer = "";

function createNewNumEl(el) {
    var newId = el.id.substring(4)-1+2;
    if ($('#inp_'+newId).length > 0) {
        $('#inp_'+newId).focus();
        return false;
    }

    $('#cont').append('<input class="num" id="inp_'+newId+'" type="number"/>');
    var newEl = $('#inp_'+newId);
    var numEl = newId+1*1;
    if ((numEl) % 6 == 0) {
        newEl.addClass('mrBig');
    }
    if ((numEl) % 36 == 0) {
        //newEl.addClass('mrBBig');
        newEl.wrap('<span class="n36" ></span>');
        newEl.parent().append(numEl);
    }
    newEl.focus();
}

function numKeyDown(ev) {
    ev = ev || event;
    var sign=ev.keyCode? ev.keyCode : ev.charCode;

    if (9 != sign) {
        ev.preventDefault();
    }

    var el = ev.target || ev.srcElement
    if (46 == sign || 8 == sign) {
        if (el.value == '') {
            var id = el.id.substring(4);
            if (id == 0) {
                return false;
            }
            el.remove();
            var prevEl = $('#inp_'+(id-1));
            prevEl.focus();
            return false;
        }
        el.value = '';
        return false;
    }

    switch (sign) {
        case 49:
        case 97:
            el.value = 1;
            break;
        case 50:
        case 98:
            el.value = 2;
            break;
        case 51:
        case 99:
            el.value = 3;
            break;
        case 52:
        case 100:
            el.value = 4;
            break;
        case 53:
        case 101:
            el.value = 5;
            break;
        case 54:
        case 102:
            el.value = 6;
            break;
        default:
            return false;
            break;
    }
    if (!((sign > 48 && sign < 55) || (sign > 96 && sign < 103))) {
        return false;
    }
//        el.value = String.fromCharCode(sign);
    createNewNumEl(el);
}

ComboObj = function(i, j) {
    this.comboI = i;
    this.comboJ = j;
    this.comboName = i+' '+j;
}

ResultRow = function(occurrenceCount, combos) {
    this.occurrenceCount = occurrenceCount;
    if (typeof(combos) == "undefined") {
        combos = new Array();
    }
    this.combosCount = combos.length;
    this.combos = ko.observableArray(combos);
}

resultsModel = function (dataRows) {
    this.negIndex = ko.observable('?');
    this.rows = ko.observableArray(dataRows);
}

$(document).ready(function() {
    $('#inp_0').focus();

    var rows = new Array();
    var viewModel = new resultsModel(rows);
    ko.applyBindings(viewModel);

    $('#calc').click(function(e) {
        kubik = [];
        var numbers = $('.num');
        numbers.each(function() {
            if ('' != this.value) {
                kubik.push(this.value);
            }
        });

        var kubikLength = kubik.length;
        var avgVal = kubikLength / 36;

        kubik.push(kubik[0]);

        var groupCombination = new Array();
        var values = new Array();
        for (i = 1; i <= 6; i++) {
            for (j = 1; j <= 6; j++) {
                var value = comboCount(i, j);
                values.push(value);
                var comboGroup = groupCombination[value] ? groupCombination[value] : new Array();
                comboGroup.push(new ComboObj(i, j));
                groupCombination[value] = comboGroup;
            }
        }
        var MaxVal = Math.max.apply(null, values);

        rows = new Array();
        var sp1 = 0; var sp2 = 0;
        for (var c = MaxVal; c >=0; c--) {
            var len = groupCombination[c] ? groupCombination[c].length : 0;
            if (c > avgVal) {
                sp1 += Math.abs(len *(c-avgVal));
            }
            if (c < avgVal) {
                sp2 += Math.abs(len *(c-avgVal));
            }
            rows.push(new ResultRow(c, groupCombination[c]));
        }
        viewModel.rows(rows);

        var sp = (sp1 + sp2) / 2;
        var pn = Math.round(100*sp / (18 * avgVal));
        viewModel.negIndex(pn);
    });

    $(document).on('keydown', '.num', function(e){
        numKeyDown(e);
    })

    $(document).on('click', '.combo', function(){
        var $this = $(this);
        var i = $this.data('i');
        var j = $this.data('j');
        var iNumid = 0;
        $('.num').each(function() {
            if ('' == this.value) {
                return;
            }
            var $this = $(this);
            $this.removeClass('selected');
            if (iNumid == 0 && this.value == i) {
                iNumid = this.id;
                return;
            }
            if (iNumid != 0 && this.value == j) {
                $('#'+iNumid).addClass('selected');
                $this.addClass('selected');
            }
            iNumid = this.value == i ? this.id : 0;
        })
        var firstEl = $('#inp_0')
        if (iNumid != 0 && firstEl.val() == j) {
            $('#'+iNumid).addClass('selected');
            firstEl.addClass('selected');
        }
    })

});

function comboCount(a, b){
    var i = 0;
    var sum = 0;
    for (i=0; i<kubik.length; i++) {
        if (kubik[i] == a && kubik[i+1] == b) {
            sum++;
        }
    }
    return sum;
}
