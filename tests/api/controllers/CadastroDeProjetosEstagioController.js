/**
 * CadastroDeProjetosEstagioController
 *
 * @description :: Server-side logic for managing cadastroDeProjetosEstagio
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * `CadastroDeProjetosEstagioController.index()`
     * return view only
     */
    index: function(req, res) {
        return res.view('cadastroDeProjetosEstagio/index', {
            footer: [
                '/js/modules/cadastroDeProjetosEstagio/index.js'
            ]
        });
    },

    /**
     * `CadastroDeProjetosEstagioController.query()`
     * This is jquery datatables format query
     * @see https://datatables.net/examples/data_sources/server_side.html
     */
    query: function(req, res) {
        var cols = [
            'id', 
            'nome', 
            'Escola', 
        ]
        var all = req.allParams();
        var search = req.param('search')
        var order = req.param('order')
        if (!order.length) {
            order = [{
                column: 'id',
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
                    id: {
                        'contains': search.value
                    }
                }]
            }
            //copy & extend condition
            queryCond = JSON.parse(JSON.stringify(cond))
            queryCond.limit = limit
            queryCond.skip = skip
            query = CadastroDeProjetosEstagio.find(queryCond)

        } else {
            query = CadastroDeProjetosEstagio.find({
                limit: limit,
                skip: skip,
            })
        }

        CadastroDeProjetosEstagio.count(cond).exec(function(error, count) {
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
     * `CadastroDeProjetosEstagioController.update()`
     * update modle api
     */
    update: function(req, res) {
        var rt = {
                success: false,
                msg: 'Server error'
            }
        //int primary id;
        var pkid = parseInt(req.param('id'))
        var model = {
            nome: req.param('nome'),
            Escola: req.param('Escola'),
            
        }
        //TODO: model validation
        if (pkid && !isNaN(pkid)) {
            CadastroDeProjetosEstagio.update({
                id: pkid
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
            CadastroDeProjetosEstagio.create(model).exec(function(err, newmodel) {
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
     * `CadastroDeProjetosEstagioController.remove()`
     * remove model api
     */
    remove: function(req, res) {
        var rt = {
                success: false,
                msg: 'Server error'
            }
        //int primary id;
        var pkid = parseInt(req.param('id'))
        if (pkid && !isNaN(pkid)) {
            CadastroDeProjetosEstagio.destroy({
                id: pkid
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
