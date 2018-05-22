/**
 * <%= moduleController %>
 *
 * @description :: Server-side logic for managing <%= module %>
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * `<%= moduleController %>.index()`
     * return view only
     */
    index: function(req, res) {
        return res.view('<%= module %>/index', {
            footer: [
                '/js/modules/<%= module %>/index.js'
            ]
        });
    },

    /**
     * `<%= moduleController %>.query()`
     * This is jquery datatables format query
     * @see https://datatables.net/examples/data_sources/server_side.html
     */
    query: function(req, res) {
        var cols = [<% for(var i in attrs){%>
            '<%=attrs[i].name%>', <%}%>
        ]
        var all = req.allParams();
        var search = req.param('search')
        var order = req.param('order')
        if (!order.length) {
            order = [{
                column: '<%=primary.name%>',
                dir: 'desc'
            }]
        }
        var limit = all['length']
        var skip = req.param('start')

        var sort = cols[order[0].column] + ' ' + order[0].dir
        var query;
        var cond = {}
        //default search column is primary key
        /**
        * extend example:
        * search records by id like %search% or name like %search%
        * cond = {
        *       or: [{
        *           id: {
        *               'contains': search.value
        *           }, name: {
        *               'contains': search.value
        *           }
        *       }]
        *   }
        */

        if (search && search.value) {
            cond = {
                or: [{
                    <%=primary.name%>: {
                        'contains': search.value
                    }
                }]
            }
            //copy & extend condition
            queryCond = JSON.parse(JSON.stringify(cond))
            queryCond.limit = limit
            queryCond.skip = skip
            query = <%= service %>.find(queryCond)

        } else {
            query = <%= service %>.find({
                limit: limit,
                skip: skip,
            })
        }

        <%= service %>.count(cond).exec(function(error, count) {
            query.sort(sort).then(function(data) {
                //jquery datatables format
                return res.json({
                    'draw': req.param('draw'),
                    'recordsTotal': count,
                    'recordsFiltered': count,
                    'data': data
                })
            })
        });

    },



    /**
     * `<%= moduleController %>.update()`
     * update modle api
     */
    update: function(req, res) {
        var rt = {
                success: false,
                msg: 'Server error'
            }
            //int primary id
        var pkid = parseInt(req.param('<%=primary.name%>'))
        var model = {
            <% for(var i in attrs){
                if(attrs[i].primary)continue
            %><%=attrs[i].name%>: req.param('<%=attrs[i].name%>'),
            <%}%>
        }
        //TODO: model validation
        if (pkid && !isNaN(pkid)) {
            <%= service %>.update({
                <%=primary.name%>: pkid
            }, model).exec(function(err, newmodel) {
                if (!err) {
                    rt.success = true
                    rt.msg = ''
                } else {
                    rt.msg = err
                }
                return res.json(rt);
            })
        } else {
            <%= service %>.create(model).exec(function(err, newmodel) {
                if (!err) {
                    rt.success = true
                    rt.msg = ''
                } else {
                    rt.msg = err
                }
                return res.json(rt);
            })
        }

    },


    /**
     * `<%= moduleController %>.remove()`
     * remove model api
     */
    remove: function(req, res) {
        var rt = {
                success: false,
                msg: 'Server error'
            }
        int primary id
        var pkid = parseInt(req.param('<%=primary.name%>'))
        if (pkid && !isNaN(pkid)) {
            <%= service %>.destroy({
                <%=primary.name%>: pkid
            }).exec(function(err) {
                if (!err) {
                    rt.success = true
                    rt.msg = ''
                } else {
                    rt.msg = err
                }
                return res.json(rt);
            })
        } else {
            rt.msg = 'Record not found!'
            return res.json(rt);
        }


    },

};
