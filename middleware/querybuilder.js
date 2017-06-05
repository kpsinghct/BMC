'use strict'

/**
* @name middleware.querybuilder
 *@description  middleware which work with select query. 
 * This middleware automatically handle paging ,searching,where condtion and sorting. Based on that paramiters it will prepare
 * req.options .
* @author KP Singh Chundawat <kpsinghct@gmail.com>
* @version 0.0.0
* @copyright Blackroot Technologies Pvt. Ltd
*/
function parse(dt, val) {
    switch (dt) {
        case 'd':
            return new Date(val);

        case 'a':
            return val.split('.');
        default:
            return val;
    }
}

module.exports.queryBuilder = function (req, res, next) {
    //for select query
    req.options = {
        sort: '-_id', //for decending use - (dash sign)
        page: parseInt(req.query.page) || 0,
        pagesize: parseInt(req.query.pagesize) || 10000,
        pageskip: 0,
        where: {}, //it will work like :- where=_id;59199e1e4398661e409cb668,name;dasds
        search: ''//it will work like :- search=_id;59199e1e4398661e409cb668,name;dasds
    }
    if (req.query.select) {
        req.options.select = req.query.select.replace(/,/g, ' ');
    }
    if (req.query.where) {
        var whr = req.query.where.split(',');
        whr.forEach(function (item) {
            var splitedstring = item.split(';');
            if (splitedstring[1].startsWith('$')) {
                //split again with *
                var conditn = splitedstring[1].split('*');
                var key = splitedstring[0];
                req.options.where[key] = {};
                conditn.forEach(function (citem) {
                    var cdata = citem.split('|');
                    try {
                        req.options.where[key][cdata[0]] = parse(cdata[1], cdata[2]);
                    }
                    catch (e) {
                        console.log(e);
                    }

                });

            }
            else if (splitedstring[1] != 'undefined')
                req.options.where[splitedstring[0]] = splitedstring[1];
        });
    }

    if (req.query.sort) {
        //remove comma with space
        req.options.sort = req.query.sort.replace(/,/g, ' ');

    }
    if (req.query.search) {
        var srch = req.query.search.split(',');
        srch.forEach(function (item, idx) {
            if (item.indexOf(';') > -1) {
                var splitedstring = item.split(';');
                if (splitedstring[1] != 'undefined') {
                    if (idx > 0) {
                        req.options.search += ' || ';
                    }
                    req.options.search += '(this.' + splitedstring[0] + '.toLowerCase().indexOf("' + splitedstring[1].toLowerCase() + '") !== -1)';
                }

                //to do ---
                //for multiple search field either for condition or || and .
                //let use $or and $and
            }
            else {
                if (item != 'undefined')
                    req.options.search += 'this.title.toLowerCase().indexOf("' + item.toLowerCase() + '") !== -1';
            }

        });
        //req.options.search = 'this.title.indexOf("op") !== -1';

    }
    if (!req.options.search) {
        req.options.search = 'this';
    }
    if (req.options.page) {
        req.options.pageskip = req.options.pagesize * req.options.page;
    }

    next();
};


