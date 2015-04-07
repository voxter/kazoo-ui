winkstart.module('voip', 'callflow', {
        css: [
            'css/style.css',
            /*'css/popups.css',*/
            'css/two_columns.css',
            _t('callflow', 'css_callflow'),
            'css/ring_groups.css'
        ],

        templates: {
            callflow: 'tmpl/callflow.html',
            callflow_main: 'tmpl/callflow_main.html',
            branch: 'tmpl/branch.html',
            tools: 'tmpl/tools.html',
            root: 'tmpl/root.html',
            node: 'tmpl/node.html',
            num_row: 'tmpl/num_row.html',
            add_number: 'tmpl/add_number.html',
            edit_dialog: 'tmpl/edit_dialog.html',
            two_column: 'tmpl/two_column.html',
            call_record_callflow: 'tmpl/call_record_callflow.html',
            disa_callflow: 'tmpl/disa_callflow.html',
            pivot_callflow: 'tmpl/pivot_callflow.html',
            presence_callflow: 'tmpl/presence_callflow.html',
            page_group_dialog: 'tmpl/page_group_dialog.html',
            page_group_element: 'tmpl/page_group_element.html',
            ring_group_dialog: 'tmpl/ring_group_dialog.html',
            ring_group_element: 'tmpl/ring_group_element.html',
            buttons: 'tmpl/buttons.html',
            help_callflow: 'tmpl/help_callflow.html',
            fax_callflow: 'tmpl/fax_callflow.html',
            edit_name: 'tmpl/edit_name.html',
            prepend_cid_callflow: 'tmpl/prepend_cid_callflow.html',
	    set_cid_callflow: 'tmpl/set_cid_callflow.html',
            response_callflow: 'tmpl/response_callflow.html',
            group_pickup: 'tmpl/group_pickup.html',
            language_callflow: 'tmpl/language_callflow.html'
        },

        elements: {
            flow: '#ws_cf_flow',
            tools: '#ws_cf_tools',
            save: '#ws_cf_save',
            buf: '#ws_cf_buf'
        },

        subscribe: {
            'callflow.activate' : 'activate',
            'callflow.list-panel-click' : 'editCallflow',
            'callflow.edit-callflow' : 'editCallflow',
            'callflow.define_callflow_nodes': 'define_callflow_nodes'
        },

        resources: {
            'callflow.list_numbers': {
                url: '{api_url}/accounts/{account_id}/phone_numbers',
                contentType: 'application/json',
                verb: 'GET'
            },
            'callflow.list': {
                url: '{api_url}/accounts/{account_id}/callflows',
                contentType: 'application/json',
                verb: 'GET'
            },
            'callflow.list_no_loading': {
                url: '{api_url}/accounts/{account_id}/callflows',
                contentType: 'application/json',
                verb: 'GET',
                trigger_events: false
            },
            'callflow.get': {
                url: '{api_url}/accounts/{account_id}/callflows/{callflow_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'callflow.get_no_match': {
                url: '{api_url}/accounts/{account_id}/callflows?filter_numbers=no_match',
                contentType: 'application/json',
                verb: 'GET'
            },
            'callflow.create': {
                url: '{api_url}/accounts/{account_id}/callflows',
                contentType: 'application/json',
                verb: 'PUT'
            },
            'callflow.create_no_loading': {
                url: '{api_url}/accounts/{account_id}/callflows',
                contentType: 'application/json',
                verb: 'PUT',
                trigger_events: false
            },
            'callflow.update': {
                url: '{api_url}/accounts/{account_id}/callflows/{callflow_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            'callflow.update_no_loading': {
                url: '{api_url}/accounts/{account_id}/callflows/{callflow_id}',
                contentType: 'application/json',
                verb: 'POST',
                trigger_events: false
            },

            'callflow.delete': {
                url: '{api_url}/accounts/{account_id}/callflows/{callflow_id}',
                contentType: 'application/json',
                verb: 'DELETE'
            },
            'callflow.list_trunkstore_accounts': {
                url: '{api_url}/accounts/{account_id}/connectivity/',
                contentType: 'application/json',
                verb: 'GET'
            },
            'callflow.get_trunkstore_account': {
                url: '{api_url}/accounts/{account_id}/connectivity/{connectivity_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'callflow.list_media': {
                url: '{api_url}/accounts/{account_id}/media',
                contentType: 'application/json',
                verb: 'GET'
            },
            'callflow.list_devices': {
                url: '{api_url}/accounts/{account_id}/devices',
                contentType: 'application/json',
                verb: 'GET'
            },
            'callflow.list_users': {
                url: '{api_url}/accounts/{account_id}/users',
                contentType: 'application/json',
                verb: 'GET'
            },
            'callflow.list_groups': {
                url: '{api_url}/accounts/{account_id}/groups',
                contentType: 'application/json',
                verb: 'GET'
            }
        }
    },
    function (args) {
        var THIS = this;

        winkstart.registerResources(THIS.__whapp, THIS.config.resources);

        //winkstart.publish('statistics.add_stat', THIS.define_stats());

        winkstart.publish('whappnav.subnav.add', {
            whapp: 'voip',
            module: THIS.__module,
            label: _t('callflow', 'callflows_label'),
            icon: 'callflow',
            weight: '50'
        });
    },
    {
        actions: {},

        list_accounts: function(success, error) {
            winkstart.request('callflow.list_trunkstore_accounts', {
                    account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url
                },
                function(data, status) {
                    if(typeof success == 'function') {
                        success(data, status);
                    }
                },
                function(data, status) {
                    if(typeof error == 'function') {
                        error(data, status);
                    }
                }
            );
        },

        get_account: function(success, error) {
            var THIS = this;

            winkstart.request('callflow.get_trunkstore_account', {
                    account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url,
                    connectivity_id: winkstart.apps['voip'].connectivity_id
                },
                function(data, status) {
                    if(typeof success == 'function') {
                        success(data, status);
                    }
                },
                function(data, status) {
                    if(typeof error == 'function') {
                        error(data, status);
                    }
                }
            );
        },

        list_numbers_callflow: function(success, error) {
            var THIS = this;

            winkstart.request('callflow.list', {
                    api_url: winkstart.apps['voip'].api_url,
                    account_id: winkstart.apps['voip'].account_id
                },
                function(_data_callflows, status) {
                    var map_numbers = {};

                    $.each(_data_callflows.data, function(k, v) {
                        if(v.numbers) {
                            $.each(v.numbers, function(k2, v2) {
                                map_numbers[v2] = true;
                            });
                        }
                    });

                    if(typeof success == 'function') {
                        success(map_numbers);
                    }
                },
                function(_data_callflows, status) {
                    if(typeof error == 'function') {
                        error(_data_callflows);
                    }
                }
            );
        },

        list_numbers_trunkstore: function(success, error) {
            var THIS = this;

            THIS.list_accounts(
                function(data, status) {
                    var map_numbers = {};

                    if(data.data.length) {
                        winkstart.apps['voip'].connectivity_id = data.data[0];

                        THIS.get_account(
                            function(_data, status) {
                                if(typeof success == 'function') {
                                    $.each(_data.data.servers, function(k, v) {
                                        $.each(this.DIDs, function(k2, v2) {
                                            map_numbers[k2] = true;
                                        });
                                    });
                                    success(map_numbers, status);
                                }
                            },
                            function(_data, status) {
                                if(typeof error == 'function') {
                                    error(data, status);
                                }
                            }
                        );
                    }
                    else {
                        success(map_numbers, status);
                    }
                },
                function(data, status) {
                    if(typeof error == 'function') {
                        error(data, status);
                    }
                }
            );
        },

        activate: function (args) {
            var THIS = this,
            	args = args || {},
                callflow_html = THIS.templates.callflow_main.tmpl();

            $('#ws-content').empty()
                            .append(callflow_html);

            winkstart.publish('callflow.define_callflow_nodes', THIS.actions);

			THIS.config.elements._t = function(param){
				return window.translate['callflow'][param];
			};

            THIS.renderList(function() {
                THIS.templates.callflow.tmpl(THIS.config.elements).appendTo($('#callflow-view'));

                args.callback && args.callback();
            });
        },

        list_numbers: function(success, error) {
            var THIS = this;

            winkstart.request('callflow.list_numbers', {
                    api_url: winkstart.apps['voip'].api_url,
                    account_id: winkstart.apps['voip'].account_id
                },
                function(_data_numbers, status) {
                    THIS.list_numbers_callflow(
                        function(number_callflows, status) {
                        	if('numbers' in _data_numbers.data) {
                            	$.each(number_callflows, function(k, v) {
                                	delete _data_numbers.data.numbers[k];
                            	});
                            }

                            if(typeof success === 'function') {
                                THIS.list_numbers_trunkstore(
                                    function(numbers_trunkstore) {
                                    	if('numbers' in _data_numbers.data) {
                                        	$.each(numbers_trunkstore, function(k, v) {
                                            	delete _data_numbers.data.numbers[k];
                                        	});
                                        }

                                        success(_data_numbers);
                                    },
                                    function(data) {
                                        success(_data_numbers);
                                    }
                                );
                            }
                        },
                        function(_data_callflows, status) {
                            if(typeof error === 'function') {
                                error(_data_callflows);
                            }
                        }
                    );
                },
                function(_data, status) {
                    if(typeof error === 'function') {
                        error(_data);
                    }
                }
            );
        },

        renderButtons: function() {
			data = {
				_t: function(param){
					return window.translate['callflow'][param];
				}
			};
            var THIS = this,
                buttons_html = THIS.templates.buttons.tmpl(data);

            if(THIS.dataCallflow && THIS.dataCallflow.ui_metadata && THIS.dataCallflow.ui_metadata.ui === 'monster-ui') {
                buttons_html.find('.save').addClass('disabled');
            }

            $('.buttons').empty();

            $('.save', buttons_html).click(function() {
                if(THIS.dataCallflow && THIS.dataCallflow.ui_metadata && THIS.dataCallflow.ui_metadata.ui === 'monster-ui') {
                    winkstart.alert(_t('callflow', 'monster_callflow_error'));
                }
                else if(THIS.flow.numbers && THIS.flow.numbers.length > 0) {
                    THIS.save();
                }
                else {
                    winkstart.alert(_t('callflow', 'invalid_number') + '<br/><br/>' + _t('callflow', 'please_select_valid_number'));
                }
            });

            $('.delete', buttons_html).click(function() {
                if(THIS.flow.id) {
                    winkstart.confirm(_t('callflow', 'are_you_sure'), function() {
                        winkstart.deleteJSON('callflow.delete', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url,
                                callflow_id: THIS.flow.id
                            },
                            function() {
                                $('#ws_cf_flow').empty();
                                $('.buttons').empty();
                                $('#ws_cf_tools').empty();
                                THIS.renderList();
                                THIS._resetFlow();
                            }
                        );
                        THIS.show_pending_change(false);
                    });
                }
                else {
                    winkstart.alert(_t('callflow', 'this_callflow_has_not_been_created'));
                }
            });

            $('.copy_icon', '#ws_cf_flow').click(function() {
                delete(THIS.dataCallflow.id);
                THIS.flow.name = '';    
                THIS.flow.numbers = [];
                THIS.flow.id = undefined;
                THIS.renderFlow();
            });

            $('.buttons').append(buttons_html);
        },

        editCallflow: function(data) {
            var THIS = this;

            delete THIS.original_flow; // clear original_flow

            $('#callflow-view .callflow_help').remove();

            THIS._resetFlow();

            if(data && data.id) {
                winkstart.getJSON('callflow.get', {
                        crossbar: true,
                        account_id: winkstart.apps['voip'].account_id,
                        api_url: winkstart.apps['voip'].api_url,
                        callflow_id: data.id
                    },
                    function(json) {
                        THIS._resetFlow();

                        THIS.dataCallflow = json.data;

                        THIS.flow.id = json.data.id;
                        THIS.flow.name = json.data.name;
                        THIS.flow.contact_list = { exclude: 'contact_list' in json.data ? json.data.contact_list.exclude || false : false };
                        THIS.flow.caption_map = json.data.metadata;

                        if(json.data.flow.module != undefined) {
                            THIS.flow.root = THIS.buildFlow(json.data.flow, THIS.flow.root, 0, '_');
                        }

                        THIS.flow.numbers = json.data.numbers || [];
                        THIS.renderFlow();
                        THIS.renderButtons();
                    }
                );
            }
            else {
                THIS._resetFlow();
                THIS.dataCallflow = {};
                THIS.renderFlow();
                THIS.renderButtons();
            }

            THIS.renderTools();
        },

        buildFlow: function (json, parent, id, key) {
            var THIS = this,
            branch = THIS.branch(THIS.construct_action(json));

            branch.data.data = ('data' in json) ? json.data : {};
            branch.id = ++id;
            branch.key = key;

            branch.caption = THIS.actions[branch.actionName].caption(branch, THIS.flow.caption_map);

            if('key_caption' in THIS.actions[parent.actionName]) {
                branch.key_caption = THIS.actions[parent.actionName].key_caption(branch, THIS.flow.caption_map);
            }

            $.each(json.children, function(key, child) {
                branch = THIS.buildFlow(child, branch, id, key);
            });

            parent.addChild(branch);

            return parent;
        },

        construct_action: function(json) {  
            var action = '';

            if('data' in json) {
                if('id' in json.data) {
                    action = 'id=*,';
                }

                if('action' in json.data) {
                    action += 'action=' + json.data.action + ',';
                }
            }

            if(action != '') {
                action = '[' + action.replace(/,$/, ']');
            }
            else {
                action = '[]';
            }

            return json.module + action;
        },

        renderFlow: function() {
            var THIS = this;

            // Let it there for now, if we need to save callflows automatically again.
            /*if('savable' in THIS.flow) {
                THIS.save_callflow_no_loading();
            }*/

            THIS.flow.savable = true;

            var target = $(this.config.elements.flow).empty();

            target.append(this._renderFlow());

            var current_flow = THIS.stringify_flow(THIS.flow);
            if(!('original_flow' in THIS) || THIS.original_flow.split('|')[0] !== current_flow.split('|')[0]) {
                THIS.original_flow = current_flow;
                THIS.show_pending_change(false);
            } else {
                THIS.show_pending_change(THIS.original_flow !== current_flow);
            }
        },

        show_pending_change: function(pending_change) {
            var THIS = this;
            if(pending_change) {
                $('#pending_change', '#ws_callflow').show();
                $('.copy_icon', '#ws_cf_flow').hide();
                $('.save', '#ws_callflow').addClass('pulse-box');
            } else {
                $('#pending_change', '#ws_callflow').hide();
                $('.copy_icon', '#ws_cf_flow').show();
                $('.save', '#ws_callflow').removeClass('pulse-box');
            }
        },

        stringify_flow: function(flow) {
            var s_flow = flow.id + "|" + (!flow.name ? 'undefined' : flow.name),
                first_iteration;
            s_flow += "|NUMBERS";
            $.each(flow.numbers, function(key, value) {
                s_flow += "|" + value;
            });
            s_flow += "|NODES";
            $.each(flow.nodes, function(key, value) {
                s_flow += "|" + key + "::";
                first_iteration = true;
                $.each(value.data.data, function(k,v) {
                    if(!first_iteration) { s_flow += '//'; }
                    else { first_iteration = false; }
                    s_flow += k+':'+v;
                });
            });
            return s_flow;
        },

        // Create a new branch node for the flow
        branch: function(actionName) {
            var THIS = this;

            function branch(actionName) {
                var that = this;
                this.id = -1;
                this.actionName = actionName;
                this.module = THIS.actions[this.actionName].module;
                this.key = '_';
                this.parent = null;
                this.children = [];
                this.data = {
                    data: $.extend(true, {}, THIS.actions[this.actionName].data)
                };
                this.caption = '';
                this.key_caption = '';

                this.potentialChildren = function() {
                    var list = [];

                    for(var i in THIS.actions) {
                        if(THIS.actions[i].isUsable) {
                            list[i] = i;
                        }
                    }

                    for(var i in THIS.actions[this.actionName].rules) {
                        var rule = THIS.actions[this.actionName].rules[i];

                        switch (rule.type) {
                            case 'quantity':
                                if(this.children.length >= rule.maxSize) {
                                    list = [];
                                }
                                break;
                        }
                    }

                    return list;
                }

                this.contains = function(branch) {
                    var toCheck = branch;

                    while(toCheck.parent) {
                        if(this.id == toCheck.id) {
                            return true;
                        }
                        else {
                            toCheck = toCheck.parent;
                        }
                    }

                    return false;
                }

                this.removeChild = function(branch) {
                    $.each(this.children, function(i, child) {
                        if(child.id == branch.id) {
                            that.children.splice(i,1);
                            return false;
                        }
                    });
                }

                this.addChild = function(branch) {
                    if(!(branch.actionName in this.potentialChildren())) {
                        return false;
                    }

                    if(branch.contains(this)) {
                        return false;
                    }

                    if(branch.parent) {
                        branch.parent.removeChild(branch);
                    }

                    branch.parent = this;

                    this.children.push(branch);

                    return true;
                }

                this.getMetadata = function(key) {
                    var value;

                    if('data' in this.data && key in this.data.data) {
                        value = this.data.data[key];

                        return (value == 'null') ? null : value;
                    }

                    return false;
                }

                this.setMetadata = function(key, value) {
                    if(!('data' in this.data)) {
                        this.data.data = {};
                    }

                    this.data.data[key] = (value == null) ? 'null' : value;
                }

                this.deleteMetadata = function(key) {
                    if('data' in this.data && key in this.data.data) {
                        delete this.data.data[key];
                    }
                }

                this.index = function (index) {
                    this.id = index;

                    $.each(this.children, function() {
                        index = this.index(index+1);
                    });

                    return index;
                }

                this.nodes = function() {
                    var nodes = {};

                    nodes[this.id] = this;

                    $.each(this.children, function() {
                        var buf = this.nodes();

                        $.each(buf, function() {
                            nodes[this.id] = this;
                        });
                    });

                    return nodes;
                }

                this.serialize = function () {
                    var json = $.extend(true, {}, this.data);

                    json.module = this.module;

                    json.children = {};

                    $.each(this.children, function() {
                        json.children[this.key] = this.serialize();
                    });

                    return json;
                }
            }

            return new branch(actionName);
        },

        _count: function(json) {
            var count = 0;

            $.each(json, function() {
                count++;
            });

            return count;
        },

        categories: { },

        flow: { },

        _resetFlow: function() {
            var THIS = this;

            THIS.flow = {};
            THIS.flow.root = THIS.branch('root');    // head of the flow tree
            THIS.flow.root.key = 'flow';
            THIS.flow.numbers = [];
            THIS.flow.caption_map = {};
            THIS._formatFlow();
        },

        _formatFlow: function() {
            var THIS = this;

            THIS.flow.root.index(0);
            THIS.flow.nodes = THIS.flow.root.nodes();
        },

        _renderFlow: function() {
            var THIS = this;

            THIS._formatFlow();

            var layout = THIS._renderBranch(THIS.flow.root);

            $('.node', layout).hover(function() {
                    $(this).addClass('over');
                },
                function() {
                    $(this).removeClass('over');
                }
            );

            $('.node', layout).each(function() {
                var node = THIS.flow.nodes[$(this).attr('id')],
                    $node = $(this),
                    node_html;

                if (node.actionName == 'root') {
                    $node.removeClass('icons_black root');
                    node_html = THIS.templates.root.tmpl({name: THIS.flow.name || 'Callflow'});

                    $('.edit_icon', node_html).click(function() {
                        THIS.flow = $.extend(true, { contact_list: { exclude: false }} , THIS.flow);

                        var popup = winkstart.dialog(THIS.templates.edit_name.tmpl({name: THIS.flow.name, exclude: THIS.flow.contact_list.exclude, _t: function(param){return window.translate['callflow'][param];}}), {
                            width: '310px',
                            title: _t('callflow', 'popup_title')
                        });

                        $('#add', popup).click(function() {
                            var $callflow_name = $('#callflow_name', popup);
                            if($callflow_name.val() != '') {
                                THIS.flow.name = $callflow_name.val();
                                $('.root .top_bar .name', layout).html(THIS.flow.name);
                            }
                            else {
                                THIS.flow.name = '';
                                $('.root .top_bar .name', layout).html('Callflow');
                            }
                            THIS.flow.contact_list = {
                                exclude: $('#callflow_exclude', popup).prop('checked')
                            };
                            //THIS.save_callflow_no_loading();
                            THIS.renderFlow();

                            popup.dialog('close');
                        });
                    });

                    $('.tooltip', node_html).click(function() {
                        winkstart.dialog(THIS.templates.help_callflow.tmpl());
                    });

                    for(var x, size = THIS.flow.numbers.length, j = Math.floor((size) / 2) + 1, i = 0; i < j; i++) {
                        x = i * 2;
                        THIS.templates.num_row.tmpl({
                            numbers: THIS.flow.numbers.slice(x, (x + 2 < size) ? x + 2 : size),
							_t: function(param){
								return window.translate['callflow'][param];
							}
                        }).appendTo($('.content', node_html));
                    }

                    $('.number_column.empty', node_html).click(function() {
                        THIS.list_numbers(function(_data) {
                            var phone_numbers = [];

							if('numbers' in _data.data) {
                            	$.each(_data.data.numbers, function(k,v) {
                                    phone_numbers.push(k);
                            	});
                            }
                            phone_numbers.sort();

                            var popup_html = THIS.templates.add_number.tmpl({
								phone_numbers: phone_numbers,
								_t: function(param){
									return window.translate['callflow'][param];
								}
							}),
                                popup;

                            if(phone_numbers.length === 0) {
                                $('#list_numbers', popup_html).attr('disabled', 'disabled');
                                $('<option value="select_none">' + _t('callflow', 'no_phone_numbers') + '</option>').appendTo($('#list_numbers', popup_html));
                            }

                            var render = function() {
                                popup = winkstart.dialog(popup_html, {
                                        title: _t('callflow', 'add_number')
                                });
                            };

                            var refresh_numbers = function() {
                                 THIS.list_numbers(function(_data) {
                                    phone_numbers = [];

									if('numbers' in _data.data) {
                            			$.each(_data.data.numbers, function(k,v) {
                                    		phone_numbers.push(k);
                            			});
                            		}

                                    phone_numbers.sort();

                                    $('#list_numbers', popup).empty();

                                    if(phone_numbers.length === 0) {
                                        $('#list_numbers', popup).attr('disabled', 'disabled');
                                        $('<option value="select_none">' + _t('callflow', 'no_phone_numbers') + '</option>').appendTo($('#list_numbers', popup));
                                    }
                                    else {
                                        $('#list_numbers', popup).removeAttr('disabled');
                                        $.each(phone_numbers, function(k, v) {
                                            $('<option value="'+v+'">'+v+'</option>').appendTo($('#list_numbers', popup));
                                        });
                                    }
                                });
                            };

                            if(winkstart.publish('numbers_manager.render_fields', $('#number_manager_fields', popup_html), render, refresh_numbers)) {
                                render();
                            };

                            $('.extensions_content', popup).hide();

                            $('input[name="number_type"]', popup).click(function() {
                                if($(this).val() === 'your_numbers') {
                                    $('.list_numbers_content', popup).show();
                                    $('.extensions_content', popup).hide();
                                }
                                else {
                                    $('.extensions_content', popup).show();
                                    $('.list_numbers_content', popup).hide();
                                }
                            });

                            $('button.add_number', popup).click(function(event) {
                                event.preventDefault();
                                var number = $('input[name="number_type"]:checked', popup).val() === 'your_numbers' ? $('#list_numbers option:selected', popup).val() : $('#add_number_text', popup).val(),
                                    map_numbers = {},
                                    add_number = function() {
                                        if(number !== 'select_none' && number !== '') {
                                            THIS.flow.numbers.push(number);
                                            popup.dialog('close');

                                            THIS.renderFlow();
                                        }
                                        else {
                                            winkstart.alert(_t('callflow', 'you_didnt_select'));
                                        }
                                    },
                                    check_and_add_number = function() {
                                        THIS.list_numbers_callflow(
                                            function(data_numbers, status) {
                                                map_numbers = $.extend(true, map_numbers, data_numbers);
                                                if(number in map_numbers) {
                                                    winkstart.alert(_t('callflow', 'this_number_is_already_attached'));
                                                }
                                                else {
                                                    add_number();
                                                }
                                            },
                                            function(data_numbers, status) {
                                                add_number();
                                            }
                                        );
                                    };

                                THIS.list_numbers_trunkstore(
                                    function(data_numbers_trunkstore) {
                                        map_numbers = data_numbers_trunkstore;
                                        check_and_add_number();
                                    },
                                    function(data_numbers_trunkstore) {
                                        check_and_add_number();
                                    }
                                );
                            });
                        });
                    });

                    $('.number_column .delete', node_html).click(function() {
                        var number = $(this).parent('.number_column').dataset('number'),
                            index = $.inArray(number, THIS.flow.numbers);

                        if(index >= 0) {
                            THIS.flow.numbers.splice(index, 1);
                        }

                        THIS.renderFlow();
                    });

                }
                else {
                    node_html = THIS.templates.node.tmpl({
                        node: node,
                        callflow: THIS.actions[node.actionName]
                    });

                    $('.module', node_html).click(function() {
                        THIS.actions[node.actionName].edit(node, function() {
                            THIS.renderFlow();
                        });
                    });
                }

                $(this).append(node_html);

                $(this).droppable({
                    drop: function (event, ui) {
                        var target = THIS.flow.nodes[$(this).attr('id')],
                            action;

                        if (ui.draggable.hasClass('action')) {
                            action = ui.draggable.attr('name'),

                            branch = THIS.branch(action);
                            branch.caption = THIS.actions[action].caption(branch, THIS.flow.caption_map);

                            if (target.addChild(branch)) {
                                if(branch.parent && ('key_caption' in THIS.actions[branch.parent.actionName])) {
                                    branch.key_caption = THIS.actions[branch.parent.actionName].key_caption(branch, THIS.flow.caption_map);

                                    THIS.actions[branch.parent.actionName].key_edit(branch, function() {
                                        THIS.actions[action].edit(branch, function() {
                                            THIS.renderFlow();
                                        });
                                    });
                                }
                                else {
                                    THIS.actions[action].edit(branch, function() {
                                        THIS.renderFlow();
                                    });
                                }

                                //This is just in case something goes wrong with the dialog
                                THIS.renderFlow();
                            }
                        }

                        if (ui.draggable.hasClass('node')) {
                            var branch = THIS.flow.nodes[ui.draggable.attr('id')];

                            if (target.addChild(branch)) {
                                // If we move a node, destroy its key
                                branch.key = '_';

                                if(branch.parent && ('key_caption' in THIS.actions[branch.parent.actionName])) {
                                    branch.key_caption = THIS.actions[branch.parent.actionName].key_caption(branch, THIS.flow.caption_map);
                                }

                                ui.draggable.remove();
                                THIS.renderFlow();
                            }
                        }
                    }
                });

                // dragging the whole branch
                if($(this).attr('name') != 'root') {
                    $(this).draggable({
                        start: function () {
                            var children = $(this).next(),
                                t = children.offset().top - $(this).offset().top,
                                l = children.offset().left - $(this).offset().left;

                            THIS._enableDestinations($(this));

                            $(this).attr('t', t); $(this).attr('l', l);
                        },
                        drag: function () {
                            var children = $(this).next(),
                                t = $(this).offset().top + parseInt($(this).attr('t')),
                                l = $(this).offset().left + parseInt($(this).attr('l'));

                            children.offset({ top: t, left: l });
                        },
                        stop: function () {
                            THIS._disableDestinations();

                            THIS.renderFlow();
                        }
                    });
                }
            });

            $('.node-options .delete', layout).click(function() {
                var node = THIS.flow.nodes[$(this).attr('id')];

                if (node.parent) {
                    node.parent.removeChild(node);

                    THIS.renderFlow();
                }
            });

            return layout;
        },

        _renderBranch: function(branch) {
            var THIS = this,
                flow = THIS.templates.branch.tmpl({
                    node: branch,
                    display_key: branch.parent && ('key_caption' in THIS.actions[branch.parent.actionName])
                }),
                children;

            if(branch.parent && ('key_edit' in THIS.actions[branch.parent.actionName])) {
                $('.div_option', flow).click(function() {
                    THIS.actions[branch.parent.actionName].key_edit(branch, function() {
                        THIS.renderFlow();
                    });
                });
            }

            // This need to be evaluated before the children start adding content
            children = $('.children', flow);

            $.each(branch.children, function() {
                children.append(THIS._renderBranch(this));
            });

            return flow;
        },

        renderTools: function() {
            var THIS = this,
                buf = $(THIS.config.elements.buf),
                target,
                tools;

            /* Don't add categories here, this is just a hack to order the list on the right */
			THIS.categories = {};

            $.each(THIS.actions, function(i, data) {
                if('category' in data) {
                    data.category in THIS.categories ? true : THIS.categories[data.category] = [];
                    THIS.categories[data.category].push(i);
                }
            });

            tools = THIS.templates.tools.tmpl({
                categories: THIS.categories,
                nodes: THIS.actions,
				_t: function(param){
					return window.translate['callflow'][param];
				}
            });

            $('.content', tools).hide();

            $('.tooltip', tools).click(function() {
                winkstart.dialog(THIS.templates.help_callflow.tmpl());
            });

            // Set the basic drawer to open
            $('#basic', tools).removeClass('inactive').addClass('active');
            $('#basic .content', tools).show();

            $('.category .open', tools).click(function () {
                var current = $(this);

                $('.category .content', tools).hide();
                $('.category', tools).removeClass('active').addClass('inactive');

                $(this).parent('.category').removeClass('inactive').addClass('active');
                $(this).siblings('.content').show();
            });

            var help_box = $('.callflow_helpbox_wrapper', '#callflow-view').first();

            $('.tool', tools).hover(
                function () {
                    $(this).addClass('active');
                    $('.tool_name', '#callflow-view').removeClass('active');
                    $('.tool_name', $(this)).addClass('active');
                    if($(this).attr('help')) {
                        $('#help_box', help_box).html($(this).attr('help'));
                        $('.callflow_helpbox_wrapper', '#callflow-view').css('top', $(this).offset().top - 72)
                                                                        .show();
                    }
                },
                function () {
                    $(this).removeClass('active');
                    $('.callflow_helpbox_wrapper', '#callflow-view').hide();
                }
            );


            function action (el) {
                el.draggable({
                    start: function () {
                        var clone = $(this).clone();

                        THIS._enableDestinations($(this));

                        action(clone);
                        clone.addClass('inactive');
                        clone.insertBefore($(this));

                        $(this).addClass('active');
                    },
                    drag: function () {
                        $('.callflow_helpbox_wrapper', '#callflow-view').hide();
                    },
                    stop: function () {
                        THIS._disableDestinations();
                        $(this).prev().removeClass('inactive');
                        $(this).remove();
                    }
                });
            }

            $('.action', tools).each(function() {
                action($(this));
            });

            target = $(THIS.config.elements.tools).empty();
            target.append(tools);

            $('#ws_cf_tools', '#callflow-view').disableSelection();
        },

        _enableDestinations: function(el) {
            var THIS = this;

            $('.node').each(function () {
                var activate = true,
                    target = THIS.flow.nodes[$(this).attr('id')];

                if (el.attr('name') in target.potentialChildren()) {
                    if (el.hasClass('node') && THIS.flow.nodes[el.attr('id')].contains(target)) {
                        activate = false;
                    }
                }
                else {
                    activate = false;
                }

                if (activate) {
                    $(this).addClass('active');
                }
                else {
                    $(this).addClass('inactive');
                    $(this).droppable('disable');
                }
            });
        },

        _disableDestinations: function() {
            $('.node').each(function () {
                $(this).removeClass('active');
                $(this).removeClass('inactive');
                $(this).droppable('enable');
            });

            $('.tool').removeClass('active');
        },

        save_callflow_no_loading: function() {
            var THIS = this;

            /* If there is at least one number */
            if(THIS.flow && THIS.flow.numbers && THIS.flow.numbers.length > 0) {
                /* And at least one module inside the callflow */
                if(THIS.flow.nodes && THIS.flow.nodes[0] && THIS.flow.nodes[0].children && THIS.flow.nodes[0].children[0] && THIS.flow.nodes[0].children[0].module != '') {
                    /* If this is an existing callflow, update it */
                    if(THIS.flow.id) {
                        var data_post = {
                            numbers: THIS.flow.numbers,
                            flow: (THIS.flow.root.children[0] == undefined) ? {} : THIS.flow.root.children[0].serialize()
                        };

                        if(THIS.flow.name != '') {
                            data_post.name = THIS.flow.name;
                        }

                        winkstart.postJSON('callflow.update_no_loading', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url,
                                callflow_id: THIS.flow.id,
                                data: data_post
                            },
                            function(json) {
                                THIS.renderList(null, true);
                            },
                            winkstart.error_message.process_error()
                        );
                    }
                    /* Otherwise create the callflow */
                    else {
                        winkstart.putJSON('callflow.create_no_loading', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url,
                                data: {
                                    numbers: THIS.flow.numbers,
                                    flow: (THIS.flow.root.children[0] == undefined) ? {} : THIS.flow.root.children[0].serialize()
                                }
                            },
                            function(json) {
                                THIS.flow.id = json.data.id;
                                THIS.renderList(null, true);
                            },
                            winkstart.error_message.process_error()
                        );
                    }
                }
            }
        },

        save: function() {
            var THIS = this;

            if(THIS.flow.numbers && THIS.flow.numbers.length > 0) {
                var data_request = {
                        numbers: THIS.flow.numbers,
                        flow: (THIS.flow.root.children[0] == undefined) ? {} : THIS.flow.root.children[0].serialize()
                    };

                if(THIS.flow.name !== '') {
                    data_request.name = THIS.flow.name;
                }

                if('contact_list' in THIS.flow) {
                    data_request.contact_list = { exclude: THIS.flow.contact_list.exclude || false };
                }

                // We don't want to keep the old data from the flow, so we override it with what's on the current screen before the extend.
                THIS.dataCallflow.flow = data_request.flow;
                // Change dictated by the new field added by monster-ui. THis way we can potentially update callflows in Kazoo UI without breaking monster.
                data_request = $.extend(true, {}, THIS.dataCallflow, data_request);
                delete data_request.metadata;

                if(THIS.flow.id) {
                    winkstart.postJSON('callflow.update', {
                            account_id: winkstart.apps['voip'].account_id,
                            api_url: winkstart.apps['voip'].api_url,
                            callflow_id: THIS.flow.id,
                            data: data_request
                        },
                        function(json) {
                            THIS.renderList();
                            THIS.editCallflow({id: json.data.id});
                        },
                        winkstart.error_message.process_error()
                    );
                }
                else {
                    winkstart.putJSON('callflow.create', {
                            account_id: winkstart.apps['voip'].account_id,
                            api_url: winkstart.apps['voip'].api_url,
                            data: data_request
                        },
                        function(json) {
                            THIS.renderList();
                            THIS.editCallflow({id: json.data.id});
                        },
                        winkstart.error_message.process_error()
                    );
                }
            }
            else {
                winkstart.alert(_t('callflow', 'you_need_to_select_a_number'));
            }
        },

        renderList: function(callback, no_loading){
            var THIS = this,
                request = no_loading ? 'callflow.list_no_loading' : 'callflow.list';

            winkstart.request(true, request, {
                    account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url
                },
                function (data, status) {

                    // List Data that would be sent back from server
                    function map_crossbar_data(crossbar_data){
                        var new_list = [],
                            answer;

                        if(crossbar_data.length > 0) {
                            _.each(crossbar_data, function(elem){
                                if(elem.numbers) {
                                    for(var i = 0; i < elem.numbers.length; i++) {
                                        elem.numbers[i] = elem.numbers[i].replace(/^$/, '(no number)');
                                    }
                                }
                                if($.isArray(elem.numbers) && elem.featurecode == false) {
                                    new_list.push({
                                        id: elem.id,
                                        title: (elem.name) ? elem.name : (elem.numbers ? elem.numbers.toString() : '')
                                    });
                                }
                            });
                        }

                        new_list.sort(function(a, b) {
                            a.title.toLowerCase() < b.title.toLowerCase() ? answer = -1 : answer = 1;

                            return answer;
                        });

                        return new_list;
                    }

                    var options = {};
                    options.label = _t('callflow', 'callflow_module_label');
                    options.identifier = 'callflow-module-listview';
                    options.new_entity_label = _t('callflow', 'add_callflow_label');
                    options.data = map_crossbar_data(data.data);
                    options.publisher = winkstart.publish;
                    options.notifyMethod = 'callflow.list-panel-click';
                    options.notifyCreateMethod = 'callflow.edit-callflow';  /* Edit with no ID = Create */

                    $("#callflow-listpanel").empty();
                    $("#callflow-listpanel").listpanel(options);

                    if(typeof callback == 'function') {
                        callback();
                    }
                }
            );
        },

        define_stats: function() {
            var stats = {
                'callflows': {
                    icon: 'callflow',
                    get_stat: function(callback) {
                        winkstart.request('callflow.list_no_loading', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url
                            },
                            function(_data, status) {
                                $.each(_data.data, function() {
                                    if(this.featurecode) {
                                        _data.data.length--;
                                    }
                                });

                                var stat_attributes = {
                                    name: 'callflows',
                                    number: _data.data.length,
                                    active: _data.data.length > 0 ? true : false,
                                    color: _data.data.length < 1 ? 'red' : (_data.data.length > 1 ? 'green' : 'orange')
                                };
                                if(typeof callback === 'function') {
                                    callback(stat_attributes);
                                }
                            },
                            function(_data, status) {
                                callback({error: true});
                            }
                        );
                    },
                    click_handler: function() {
                        winkstart.publish('callflow.activate');
                    }
                }
            };

            return stats;
        },

        groups_list: function(callback) {
			winkstart.request(true, 'callflow.list_groups', {
					account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url
				},
				function(data, status) {
					callback && callback(data.data);
				}
			);
        },

        devices_list: function(callback) {
			winkstart.request(true, 'callflow.list_devices', {
					account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url
				},
				function(data, status) {
					callback && callback(data.data);
				}
			);
        },

        users_list: function(callback) {
			winkstart.request(true, 'callflow.list_users', {
					account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url
				},
				function(data, status) {
					callback && callback(data.data);
				}
			);
        },

        define_callflow_nodes: function(callflow_nodes) {
            var THIS = this,
                edit_page_group = function(node, callback) {
                    var node = node,
                    callback = callback;

                    winkstart.request(true, 'device.list', {
                            account_id: winkstart.apps['voip'].account_id,
                            api_url: winkstart.apps['voip'].api_url
                        },
                        function(data, status) {
                            var popup, popup_html, index, endpoints
                                selected_endpoints = {},
                                unselected_endpoints = [],
                                unselected_groups = [],
                                unselected_devices = [],
                                unselected_users = [];

                            if(endpoints = node.getMetadata('endpoints')) {
                                // We need to translate the endpoints to prevent nasty O(N^2) time complexities,
                                // we also need to clone to prevent managing of objects
                                $.each($.extend(true, {}, endpoints), function(i, obj) {
                                    obj.name = 'Undefined Device';
                                    selected_endpoints[obj.id] = obj;
                                });
                            }

                            $.each(data.data, function(i, obj) {
                                obj.endpoint_type = 'device';
                                if(obj.id in selected_endpoints) {
                                    selected_endpoints[obj.id].endpoint_type = 'device';
                                    selected_endpoints[obj.id].owner_id = obj.owner_id;
                                    selected_endpoints[obj.id].name = obj.name;
                                }
                                else {
                                    unselected_devices.push(obj);
                                }
                            });

                            unselected_devices = winkstart.sort(unselected_devices);

                            winkstart.request('groups.list', {
                                    account_id: winkstart.apps['voip'].account_id,
                                    api_url: winkstart.apps['voip'].api_url
                                },
                                function(_data, status) {
                                    $.each(_data.data, function(i, obj) {
                                        obj.endpoint_type = 'group';
                                        if(obj.id in selected_endpoints) {
                                            selected_endpoints[obj.id].endpoint_type = 'group',
                                            selected_endpoints[obj.id].name = obj.name;
                                        }
                                        else {
                                            unselected_groups.push(obj);
                                        }
                                    });

                                    unselected_groups = winkstart.sort(unselected_groups);

                                    winkstart.request('user.list', {
                                            account_id: winkstart.apps['voip'].account_id,
                                            api_url: winkstart.apps['voip'].api_url
                                        },
                                        function(_data, status) {
                                            $.each(_data.data, function(i, obj) {
                                                obj.name = obj.first_name + ' ' + obj.last_name;
                                                obj.endpoint_type = 'user';
                                                if(obj.id in selected_endpoints) {
                                                    selected_endpoints[obj.id].endpoint_type = 'user',
                                                    selected_endpoints[obj.id].name = obj.name;
                                                }
                                                else {
                                                    unselected_users.push(obj);
                                                }
                                            });
                                            unselected_users = winkstart.sort(unselected_users);

                                            popup_html = THIS.templates.page_group_dialog.tmpl({
												_t: function(param){
													return window.translate['callflow'][param];
												},
                                                form: {
                                                    name: node.getMetadata('name') || ''
                                                }
                                            });
                                            $.each(unselected_groups, function() {
                                                $('#groups_pane .connect.left', popup_html).append(THIS.templates.page_group_element.tmpl(this));
                                            });

                                            $.each(unselected_devices, function() {
                                                $('#devices_pane .connect.left', popup_html).append(THIS.templates.page_group_element.tmpl(this));
                                            });

                                            $.each(unselected_users, function() {
                                                $('#users_pane .connect.left', popup_html).append(THIS.templates.page_group_element.tmpl(this));
                                            });

                                            $.each(selected_endpoints, function() {
                                                //Check if user/device exists.
                                                if(this.endpoint_type) {
                                                    $('.connect.right', popup_html).append(THIS.templates.page_group_element.tmpl(this));
                                                }
                                            });

                                            $('#name', popup_html).bind('keyup blur change', function() {
                                                $('.column.right .title', popup_html).html('Page Group - ' + $(this).val());
                                            });

                                            $('ul.settings1 > li > a', popup_html).click(function(item) {
                                                $('.pane_content', popup_html).hide();

                                                //Reset Search field
                                                $('.searchfield', popup_html).val('');
                                                $('.column.left li', popup_html).show();

                                                $('ul.settings1 > li', popup_html).removeClass('current');

                                                var tab_id = $(this).attr('id');

                                                if(tab_id  === 'users_tab_link') {
                                                    $('#users_pane', popup_html).show();
                                                }
                                                else if(tab_id === 'devices_tab_link') {
                                                    $('#devices_pane', popup_html).show();
                                                }
                                                else if(tab_id === 'groups_tab_link') {
                                                    $('#groups_pane', popup_html).show();
                                                }

                                                $(this).parent().addClass('current');
                                            });

                                            $('.searchsubmit2', popup_html).click(function() {
                                                $('.searchfield', popup_html).val('');
                                                $('.column li', popup_html).show();
                                            });

                                            $('#devices_pane .searchfield', popup_html).keyup(function() {
                                                $('#devices_pane .column.left li').each(function() {
                                                    if($('.item_name', $(this)).html().toLowerCase().indexOf($('#devices_pane .searchfield', popup_html).val().toLowerCase()) == -1) {
                                                        $(this).hide();
                                                    }
                                                    else {
                                                        $(this).show();
                                                    }
                                                });
                                            });

                                            $('#users_pane .searchfield', popup_html).keyup(function() {
                                                $('#users_pane .column.left li').each(function() {
                                                    if($('.item_name', $(this)).html().toLowerCase().indexOf($('#users_pane .searchfield', popup_html).val().toLowerCase()) == -1) {
                                                        $(this).hide();
                                                    }
                                                    else {
                                                        $(this).show();
                                                    }
                                                });
                                            });

                                            $('#groups_pane .searchfield', popup_html).keyup(function() {
                                                $('#groups_pane .column.left li').each(function() {
                                                    if($('.item_name', $(this)).html().toLowerCase().indexOf($('#groups_pane .searchfield', popup_html).val().toLowerCase()) == -1) {
                                                        $(this).hide();
                                                    }
                                                    else {
                                                        $(this).show();
                                                    }
                                                });
                                            });

                                            if(jQuery.isEmptyObject(selected_endpoints)) {
                                                $('.column.right .connect', popup_html).addClass('no_element');
                                            }
                                            else {
                                                $('.column.right .connect', popup_html).removeClass('no_element');
                                            }

                                            $('.column.left .options', popup_html).hide();
                                            $('.column.left .actions', popup_html).hide();

                                            $('.options .option.delay', popup_html).bind('keyup', function() {
                                                $(this).parents('li').dataset('delay', $(this).val());
                                            });

                                            $('.options .option.timeout', popup_html).bind('keyup', function() {
                                                $(this).parents('li').dataset('timeout', $(this).val());
                                            });

                                            $('#save_ring_group', popup_html).click(function() {
                                                var name = $('#name', popup_html).val();

                                                endpoints = [];

                                                $('.right .connect li', popup_html).each(function() {
                                                    var item_data = $(this).dataset();
                                                    delete item_data.owner_id;
                                                    endpoints.push(item_data);
                                                });

                                                node.setMetadata('endpoints', endpoints);
                                                node.setMetadata('name', name);

                                                node.caption = name;

                                                popup.dialog('close');
                                            });

                                            popup = winkstart.dialog(popup_html, {
                                                title: _t('callflow', 'page_group_title'),
                                                beforeClose: function() {
                                                    if(typeof callback == 'function') {
                                                        callback();
                                                    }
                                                }
                                            });

                                            $('.scrollable', popup).jScrollPane({
                                                horizontalDragMinWidth: 0,
                                                horizontalDragMaxWidth: 0
                                            });

                                            $('.connect', popup).sortable({
                                                connectWith: $('.connect.right', popup),
                                                zIndex: 2000,
                                                helper: 'clone',
                                                appendTo: $('.wrapper', popup),
                                                scroll: false,
                                                receive: function(ev, ui) {
                                                    var data = ui.item.dataset(),
                                                        list_li = [],
                                                        confirm_text;

                                                    if(data.endpoint_type === 'device') {
                                                        confirm_text = _t('callflow', 'the_owner_of_this_device_is_already');
                                                        $('.connect.right li', popup_html).each(function() {
                                                            if($(this).dataset('id') === data.owner_id) {
                                                                list_li.push($(this));
                                                            }
                                                        });
                                                    }
                                                    else if(data.endpoint_type === 'user') {
                                                        confirm_text = _t('callflow', 'this_user_has_already_some_devices');
                                                        $('.connect.right li', popup_html).each(function() {
                                                            if($(this).dataset('owner_id') === data.id) {
                                                                list_li.push($(this));
                                                            }
                                                        });
                                                    }

                                                    if(list_li.length > 0) {
                                                        winkstart.confirm(confirm_text,
                                                            function() {
                                                                $.each(list_li, function() {
                                                                    remove_element(this);
                                                                });
                                                            },
                                                            function() {
                                                                remove_element(ui.item);
                                                            }
                                                        );
                                                    }

                                                    if($(this).hasClass('right')) {
                                                        $('.options', ui.item).show();
                                                        $('.actions', ui.item).show();
                                                        //$('.item_name', ui.item).addClass('right');
                                                        $('.column.right .connect', popup).removeClass('no_element');
                                                    }
                                                }
                                            });

                                            $(popup_html).delegate('.trash', 'click', function() {
                                                var $parent_li = $(this).parents('li').first();
                                                remove_element($parent_li);
                                            });

                                            $('.pane_content', popup_html).hide();
                                            $('#users_pane', popup_html).show();

                                            var remove_element = function(li) {
                                                var $parent_li = li;
                                                var data = $parent_li.dataset();
                                                data.name = jQuery.trim($('.item_name', $parent_li).html());
                                                $('#'+data.endpoint_type+'s_pane .connect.left', popup_html).append(THIS.templates.page_group_element.tmpl(data));
                                                $parent_li.remove();

                                                if($('.connect.right li', popup_html).size() == 0) {
                                                    $('.column.right .connect', popup).addClass('no_element');
                                                }

                                                if(data.name.toLowerCase().indexOf($('#'+data.endpoint_type+'s_pane .searchfield', popup_html).val().toLowerCase()) == -1) {
                                                    $('#'+data.id, popup_html).hide();
                                                }
                                            };
                                        }
                                    );
                                }
                            );
                        }
                    );
                },
                edit_ring_group = function(node, callback) {
                    var default_timeout = '20',
                        default_delay = '0',
                        node = node,
                        callback = callback;

                    winkstart.request(true, 'device.list', {
                            account_id: winkstart.apps['voip'].account_id,
                            api_url: winkstart.apps['voip'].api_url
                        },
                        function(data, status) {
                            var popup, popup_html, index, endpoints
                                selected_endpoints = {},
                                unselected_endpoints = [],
                                unselected_groups = [],
                                unselected_devices = [],
                                unselected_users = [];

                            if(endpoints = node.getMetadata('endpoints')) {
                                // We need to translate the endpoints to prevent nasty O(N^2) time complexities,
                                // we also need to clone to prevent managing of objects
                                $.each($.extend(true, {}, endpoints), function(i, obj) {
                                    obj.name = _t('callflow', 'undefined_device');
                                    selected_endpoints[obj.id] = obj;
                                });
                            }

                            $.each(data.data, function(i, obj) {
                                obj.endpoint_type = 'device';
                                if(obj.id in selected_endpoints) {
                                    selected_endpoints[obj.id].endpoint_type = 'device';
                                    selected_endpoints[obj.id].owner_id = obj.owner_id;
                                    selected_endpoints[obj.id].name = obj.name;
                                }
                                else {
                                    obj.delay = default_delay;
                                    obj.timeout = default_timeout;
                                    unselected_devices.push(obj);
                                }
                            });

                            unselected_devices = winkstart.sort(unselected_devices);

                            winkstart.request('groups.list', {
                                    account_id: winkstart.apps['voip'].account_id,
                                    api_url: winkstart.apps['voip'].api_url
                                },
                                function(_data, status) {
                                    $.each(_data.data, function(i, obj) {
                                        obj.endpoint_type = 'group';
                                        if(obj.id in selected_endpoints) {
                                            selected_endpoints[obj.id].endpoint_type = 'group',
                                            selected_endpoints[obj.id].name = obj.name;
                                        }
                                        else {
                                            obj.delay = default_delay;
                                            obj.timeout = default_timeout;
                                            unselected_groups.push(obj);
                                        }
                                    });

                            		unselected_groups = winkstart.sort(unselected_groups);

                                    winkstart.request('user.list', {
                                            account_id: winkstart.apps['voip'].account_id,
                                            api_url: winkstart.apps['voip'].api_url
                                        }, function(_data, status) {
                                            $.each(_data.data, function(i, obj) {
                                                obj.name = obj.first_name + ' ' + obj.last_name;
                                                obj.endpoint_type = 'user';
                                                if(obj.id in selected_endpoints) {
                                                    selected_endpoints[obj.id].endpoint_type = 'user',
                                                    selected_endpoints[obj.id].name = obj.name;
                                                }
                                                else {
                                                    obj.delay = default_delay;
                                                    obj.timeout = default_timeout;
                                                    unselected_users.push(obj);
                                                }
                                            });

                                            unselected_users = winkstart.sort(unselected_users);

                                            winkstart.request('media.list', {
                                                    account_id: winkstart.apps['voip'].account_id,
                                                    api_url: winkstart.apps['voip'].api_url
                                                },
                                                function(_data, status) {
                                                    var media_array = _data.data.sort(function(a,b) {
                                                        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
                                                    });

                                                    popup_html = THIS.templates.ring_group_dialog.tmpl({
        												_t: function(param){
        													return window.translate['callflow'][param];
        												},
                                                        form: {
                                                            name: node.getMetadata('name') || '',
                                                            strategy: {
                                                                items: [
                                                                    {
                                                                        id: 'simultaneous',
                                                                        name: _t('callflow', 'at_the_same_time')
                                                                    },
                                                                    {
                                                                        id: 'single',
                                                                        name: _t('callflow', 'in_order')
                                                                    }
                                                                ],
                                                                selected: node.getMetadata('strategy') || 'simultaneous'
                                                            },
                                                            timeout: node.getMetadata('timeout') || '30',
                                                            ringback: {
                                                                items: $.merge([
                                                                    {
                                                                        id: 'default',
                                                                        name: _t('callflow', 'default'),
                                                                        class: 'uneditable'
                                                                    },
                                                                    {
                                                                        id: 'silence_stream://300000',
                                                                        name: _t('callflow', 'silence'),
                                                                        class: 'uneditable'
                                                                    }
                                                                ], media_array),
                                                                selected: node.getMetadata('ringback') || 'default'
                                                            }
                                                        }
                                                    });
                                                    $.each(unselected_groups, function() {
                                                        $('#groups_pane .connect.left', popup_html).append(THIS.templates.ring_group_element.tmpl(this));
                                                    });

                                                    $.each(unselected_devices, function() {
                                                        $('#devices_pane .connect.left', popup_html).append(THIS.templates.ring_group_element.tmpl(this));
                                                    });

                                                    $.each(unselected_users, function() {
                                                        $('#users_pane .connect.left', popup_html).append(THIS.templates.ring_group_element.tmpl(this));
                                                    });

                                                    $.each(selected_endpoints, function() {
                                                        //Check if user/device exists.
                                                        if(this.endpoint_type) {
                                                            $('.connect.right', popup_html).append(THIS.templates.ring_group_element.tmpl(this));
                                                        }
                                                    });

                                                    $('#name', popup_html).bind('keyup blur change', function() {
                                                        $('.column.right .title', popup_html).html(_t('callflow', 'ring_group_val') + $(this).val());
                                                    });

                                                    $('#ringback', popup_html).change(function(e) {
                                                        if($(this).find('option:selected').hasClass('uneditable')) {
                                                            $('.media_action[data-action="edit"]', popup_html).hide();
                                                        } else {
                                                            $('.media_action[data-action="edit"]', popup_html).show();
                                                        }
                                                    });

                                                    $('.media_action', popup_html).click(function(e) {
                                                        var isCreation = $(this).data('action') === 'create',
                                                            mediaData = isCreation ? {} : { id: $('#ringback', popup_html).val() };

                                                        winkstart.publish('media.popup_edit', mediaData, function(_mediaData) {
                                                            if(_mediaData.data && _mediaData.data.id) {
                                                                if(isCreation) {
                                                                    $('#ringback', popup_html).append('<option value="'+_mediaData.data.id+'">'+_mediaData.data.name+'</option>');
                                                                } else {
                                                                    $('#ringback option[value="'+_mediaData.data.id+'"]', popup_html).text(_mediaData.data.name);
                                                                }
                                                                $('#ringback', popup_html).val(_mediaData.data.id);
                                                            }
                                                        });
                                                    });

                                                    $('ul.settings1 > li > a', popup_html).click(function(item) {
                                                        $('.pane_content', popup_html).hide();

                                                        //Reset Search field
                                                        $('.searchfield', popup_html).val('');
                                                        $('.column.left li', popup_html).show();

                                                        $('ul.settings1 > li', popup_html).removeClass('current');

                                                        var tab_id = $(this).attr('id');

                                                        if(tab_id  === 'users_tab_link') {
                                                            $('#users_pane', popup_html).show();
                                                        }
                                                        else if(tab_id === 'devices_tab_link') {
                                                            $('#devices_pane', popup_html).show();
                                                        }
                                                        else if(tab_id === 'groups_tab_link') {
                                                            $('#groups_pane', popup_html).show();
                                                        }

                                                        $(this).parent().addClass('current');
                                                    });

                                                    $('.searchsubmit2', popup_html).click(function() {
                                                        $('.searchfield', popup_html).val('');
                                                        $('.column li', popup_html).show();
                                                    });

                                                    $('#devices_pane .searchfield', popup_html).keyup(function() {
                                                        $('#devices_pane .column.left li').each(function() {
                                                            if($('.item_name', $(this)).html().toLowerCase().indexOf($('#devices_pane .searchfield', popup_html).val().toLowerCase()) == -1) {
                                                                $(this).hide();
                                                            }
                                                            else {
                                                                $(this).show();
                                                            }
                                                        });
                                                    });

                                                    $('#users_pane .searchfield', popup_html).keyup(function() {
                                                        $('#users_pane .column.left li').each(function() {
                                                            if($('.item_name', $(this)).html().toLowerCase().indexOf($('#users_pane .searchfield', popup_html).val().toLowerCase()) == -1) {
                                                                $(this).hide();
                                                            }
                                                            else {
                                                                $(this).show();
                                                            }
                                                        });
                                                    });

                                                    $('#groups_pane .searchfield', popup_html).keyup(function() {
                                                        $('#groups_pane .column.left li').each(function() {
                                                            if($('.item_name', $(this)).html().toLowerCase().indexOf($('#groups_pane .searchfield', popup_html).val().toLowerCase()) == -1) {
                                                                $(this).hide();
                                                            }
                                                            else {
                                                                $(this).show();
                                                            }
                                                        });
                                                    });

                                                    if(jQuery.isEmptyObject(selected_endpoints)) {
                                                        $('.column.right .connect', popup_html).addClass('no_element');
                                                    }
                                                    else {
                                                        $('.column.right .connect', popup_html).removeClass('no_element');
                                                    }

                                                    $('.column.left .options', popup_html).hide();
                                                    $('.column.left .actions', popup_html).hide();

                                                    $('.options .option.delay', popup_html).bind('keyup', function() {
                                                        $(this).parents('li').dataset('delay', $(this).val());
                                                    });

                                                    $('.options .option.timeout', popup_html).bind('keyup', function() {
                                                        $(this).parents('li').dataset('timeout', $(this).val());
                                                    });

                                                    $('#save_ring_group', popup_html).click(function() {
                                                        var name = $('#name', popup_html).val(),
                                                            global_timeout = 0,
                                                            strategy = $('#strategy', popup_html).val(),
                                                            ringback = $('#ringback', popup_html).val();

                                                        endpoints = [];

                                                        if(strategy === 'simultaneous') {
                                                            var computeTimeout = function(delay, local_timeout, global_timeout) {
                                                                var duration = delay + local_timeout;

                                                                if(duration > global_timeout) {
                                                                    global_timeout = duration;
                                                                }

                                                                return global_timeout;
                                                            }
                                                        }
                                                        else {
                                                            var computeTimeout = function(delay, local_timeout, global_timeout) {
                                                                global_timeout += delay + local_timeout;

                                                                return global_timeout;
                                                            }
                                                        }

                                                        $('.right .connect li', popup_html).each(function() {
                                                            var item_data = $(this).dataset();
                                                            delete item_data.owner_id;
                                                            endpoints.push(item_data);
                                                            global_timeout = computeTimeout(parseFloat(item_data.delay), parseFloat(item_data.timeout), global_timeout);
                                                        });

                                                        node.setMetadata('endpoints', endpoints);
                                                        node.setMetadata('name', name);
                                                        node.setMetadata('strategy', strategy);
                                                        node.setMetadata('timeout', global_timeout);
                                                        if(ringback === 'default') {
                                                            node.deleteMetadata('ringback', ringback);
                                                        } else {
                                                            node.setMetadata('ringback', ringback);
                                                        }

                                                        node.caption = name;

                                                        popup.dialog('close');
                                                    });

                                                    popup = winkstart.dialog(popup_html, {
                                                        title: _t('callflow', 'ring_group'),
                                                        beforeClose: function() {
                                                            if(typeof callback == 'function') {
                                                                callback();
                                                            }
                                                        }
                                                    });

                                                    $('.scrollable', popup).jScrollPane({
                                                        horizontalDragMinWidth: 0,
                                                        horizontalDragMaxWidth: 0
                                                    });

                                                    $('.connect', popup).sortable({
                                                        connectWith: $('.connect.right', popup),
                                                        zIndex: 2000,
                                                        helper: 'clone',
                                                        appendTo: $('.wrapper', popup),
                                                        scroll: false,
                                                        receive: function(ev, ui) {
                                                            var data = ui.item.dataset(),
                                                                list_li = [],
                                                                confirm_text;

                                                            if(data.endpoint_type === 'device') {
                                                                confirm_text = _t('callflow', 'the_owner_of_this_device_is_already');
                                                                $('.connect.right li', popup_html).each(function() {
                                                                    if($(this).dataset('id') === data.owner_id) {
                                                                        list_li.push($(this));
                                                                    }
                                                                });
                                                            }
                                                            else if(data.endpoint_type === 'user') {
                                                                confirm_text = _t('callflow', 'this_user_has_already_some_devices');
                                                                $('.connect.right li', popup_html).each(function() {
                                                                    if($(this).dataset('owner_id') === data.id) {
                                                                        list_li.push($(this));
                                                                    }
                                                                });
                                                            }

                                                            if(list_li.length > 0) {
                                                                winkstart.confirm(confirm_text,
                                                                    function() {
                                                                        $.each(list_li, function() {
                                                                            remove_element(this);
                                                                        });
                                                                    },
                                                                    function() {
                                                                        remove_element(ui.item);
                                                                    }
                                                                );
                                                            }

                                                            if($(this).hasClass('right')) {
                                                                $('.options', ui.item).show();
                                                                $('.actions', ui.item).show();
                                                                //$('.item_name', ui.item).addClass('right');
                                                                $('.column.right .connect', popup).removeClass('no_element');
                                                            }
                                                        }
                                                    });

                                                    $(popup_html).delegate('.trash', 'click', function() {
                                                        var $parent_li = $(this).parents('li').first();
                                                        remove_element($parent_li);
                                                    });

                                                    $('.pane_content', popup_html).hide();
                                                    $('#users_pane', popup_html).show();
                                                    if($('#ringback option:selected').hasClass('uneditable')) {
                                                        $('.media_action[data-action="edit"]', popup_html).hide();
                                                    } else {
                                                        $('.media_action[data-action="edit"]', popup_html).show();
                                                    }

                                                    var remove_element = function(li) {
                                                        var $parent_li = li;
                                                        var data = $parent_li.dataset();
                                                        data.name = jQuery.trim($('.item_name', $parent_li).html());
                                                        $('#'+data.endpoint_type+'s_pane .connect.left', popup_html).append(THIS.templates.ring_group_element.tmpl(data));
                                                        $parent_li.remove();

                                                        if($('.connect.right li', popup_html).size() == 0) {
                                                            $('.column.right .connect', popup).addClass('no_element');
                                                        }

                                                        if(data.name.toLowerCase().indexOf($('#'+data.endpoint_type+'s_pane .searchfield', popup_html).val().toLowerCase()) == -1) {
                                                            $('#'+data.id, popup_html).hide();
                                                        }
                                                    };
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                };

            $.extend(callflow_nodes, {
                'root': {
                    name: 'Root',
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable : 'false'
                },

                'callflow[id=*]': {
                    name: _t('callflow', 'callflow'),
                    icon: 'callflow',
                    category: _t('config', 'advanced_cat'),
                    module: 'callflow',
                    tip: _t('callflow', 'callflow_tip'),
                    data: {
                        id: 'null'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        var id = node.getMetadata('id'),
                            return_value = '';

                        if(id in caption_map && 'numbers' in caption_map[id]) {
                            return_value = caption_map[id].numbers.toString();
                        }

                        return return_value;
                    },
                    edit: function(node, callback) {
                        winkstart.request(true, 'callflow.list', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url
                            },
                            function(data, status) {
                                var popup, popup_html, _data = [];

                                $.each(data.data, function() {
                                    if(!this.featurecode && this.id != THIS.flow.id) {
                                        this.name = this.name ? this.name : ((this.numbers) ? this.numbers.toString() : _t('callflow', 'no_numbers'));

                                        _data.push(this);
                                    }
                                });

                                popup_html = THIS.templates.edit_dialog.tmpl({
									_t: function(param){
										return window.translate['callflow'][param];
									},
                                    objects: {
                                        type: 'callflow',
                                        items: winkstart.sort(_data),
                                        selected: node.getMetadata('id') || ''
                                    }
                                });

                                $('#add', popup_html).click(function() {
                                    node.setMetadata('id', $('#object-selector', popup_html).val());

                                    node.caption = $('#object-selector option:selected', popup_html).text();

                                    popup.dialog('close');
                                });

                                popup = winkstart.dialog(popup_html, {
                                    title: _t('callflow', 'callflow_title'),
                                    beforeClose: function() {
                                        if(typeof callback == 'function') {
                                            callback();
                                        }
                                    }
                                });
                            }
                        );
                    }
                },
                'page_group[]': {
                    name: _t('callflow', 'page_group'),
                    icon: 'ring_group',
                    category: _t('config', 'advanced_cat'),
                    module: 'page_group',
                    tip:  _t('callflow', 'page_group_tip'),
                    data: {
                        name: ''
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return node.getMetadata('name') || '';
                    },
                    edit: function(node, callback) {
                        edit_page_group(node, callback);
                    }
                },
                'ring_group[]': {
                    name: _t('callflow', 'ring_group'),
                    icon: 'ring_group',
                    category: _t('config', 'basic_cat'),
                    module: 'ring_group',
                    tip: _t('callflow', 'ring_group_tip'),
                    data: {
                        name: ''
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return node.getMetadata('name') || '';
                    },
                    edit: function(node, callback) {
                        edit_ring_group(node, callback);
                    }
                },
                'call_forward[action=activate]': {
                    name: _t('callflow', 'enable_call_forwarding'),
                    icon: 'rightarrow',
                    category: _t('config', 'call_forwarding_cat'),
                    module: 'call_forward',
                    tip: _t('callflow', 'enable_call_forwarding_tip'),
                    data: {
                        action: 'activate'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return '';
                    },
                    edit: function(node, callback) {
                        if(typeof callback == 'function') {
                            callback();
                        }
                    }
                },
                'call_forward[action=deactivate]': {
                    name: _t('callflow', 'disable_call_forwarding'),
                    icon: 'rightarrow',
                    category: _t('config', 'call_forwarding_cat'),
                    module: 'call_forward',
                    tip: _t('callflow', 'disable_call_forwarding_tip'),
                    data: {
                        action: 'deactivate'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return '';
                    },
                    edit: function(node, callback) {
                        if(typeof callback == 'function') {
                            callback();
                        }
                    }
                },
                'call_forward[action=update]': {
                    name: _t('callflow', 'update_call_forwarding'),
                    icon: 'rightarrow',
                    category: _t('config', 'call_forwarding_cat'),
                    module: 'call_forward',
                    tip: _t('callflow', 'update_call_forwarding_tip'),
                    data: {
                        action: 'update'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return '';
                    },
                    edit: function(node, callback) {
                        if(typeof callback == 'function') {
                            callback();
                        }
                    }
                },
                'dynamic_cid[]': {
                    name: _t('callflow', 'dynamic_cid'),
                    icon: 'rightarrow',
                    category: _t('config', 'caller_id_cat'),
                    module: 'dynamic_cid',
                    tip: _t('callflow', 'dynamic_cid_tip'),
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return '';
                    },
                    edit: function(node, callback) {
                        if(typeof callback == 'function') {
                            callback();
                        }
                    }
                },
                'prepend_cid[action=prepend]': {
                    name: _t('callflow', 'prepend'),
                    icon: 'plus_circle',
                    category: _t('config', 'caller_id_cat'),
                    module: 'prepend_cid',
                    tip: _t('callflow', 'prepend_tip'),
                    data: {
                        action: 'prepend',
                        caller_id_name_prefix: '',
                        caller_id_number_prefix: ''
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return (node.getMetadata('caller_id_name_prefix') || '') + ' ' + (node.getMetadata('caller_id_number_prefix') || '');
                    },
                    edit: function(node, callback) {
                        var popup, popup_html;

                        popup_html = THIS.templates.prepend_cid_callflow.tmpl({
							_t: function(param){
								return window.translate['callflow'][param];
							},
                            data_cid: {
                                'caller_id_name_prefix': node.getMetadata('caller_id_name_prefix') || '',
                                'caller_id_number_prefix': node.getMetadata('caller_id_number_prefix') || ''
                            }
                        });

                        $('#add', popup_html).click(function() {
                            var cid_name_val = $('#cid_name_prefix', popup_html).val(),
                                cid_number_val = $('#cid_number_prefix', popup_html).val();

                            node.setMetadata('caller_id_name_prefix', cid_name_val);
                            node.setMetadata('caller_id_number_prefix', cid_number_val);

                            node.caption = cid_name_val + ' ' + cid_number_val;

                            popup.dialog('close');
                        });

                        popup = winkstart.dialog(popup_html, {
                            title: _t('callflow', 'prepend_caller_id_title'),
                            minHeight: '0',
                            beforeClose: function() {
                                if(typeof callback == 'function') {
                                     callback();
                                }
                            }
                        });

                        if(typeof callback == 'function') {
                            callback();
                        }
                    }
                },
                'set_cid[]': {
                    name: _t('callflow', 'set_cid'),
                    icon: 'rightarrow',
                    category: _t('config', 'caller_id_cat'),
                    module: 'set_cid',
                    tip: _t('callflow', 'set_cid_tip'),
                    data: {
                        caller_id_name: '',
                        caller_id_number: ''
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return (node.getMetadata('caller_id_name') || '') + ' ' + (node.getMetadata('caller_id_number') || '');
                    },
                    edit: function(node, callback) {
                        var popup, popup_html;

                        popup_html = THIS.templates.set_cid_callflow.tmpl({
                                                        _t: function(param){
                                                                return window.translate['callflow'][param];
                                                        },
                            data_cid: {
                                'caller_id_name': node.getMetadata('caller_id_name') || '',
                                'caller_id_number': node.getMetadata('caller_id_number') || ''
                            }
                        });

                        $('#add', popup_html).click(function() {
                            var cid_name_val = $('#cid_name', popup_html).val(),
                                cid_number_val = $('#cid_number', popup_html).val();

                            node.setMetadata('caller_id_name', cid_name_val);
                            node.setMetadata('caller_id_number', cid_number_val);

                            node.caption = cid_name_val + ' ' + cid_number_val;

                            popup.dialog('close');
                        });

                        popup = winkstart.dialog(popup_html, {
                            title: _t('callflow', 'set_caller_id_title'),
                            minHeight: '0',
                            beforeClose: function() {
                                if(typeof callback == 'function') {
                                     callback();
                                }
                            }
                        });

                        if(typeof callback == 'function') {
                            callback();
                        }
                    }
                },
                'prepend_cid[action=reset]': {
                    name: _t('callflow', 'reset_prepend'),
                    icon: 'loop2',
                    category: _t('config', 'caller_id_cat'),
                    module: 'prepend_cid',
                    tip: _t('callflow', 'reset_prepend_tip'),
                    data: {
                        action: 'reset'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return '';
                    },
                    edit: function(node, callback) {
                        if(typeof callback == 'function') {
                            callback();
                        }
                    }
                },
                'manual_presence[]': {
                    name: _t('callflow', 'manual_presence'),
                    icon: 'lightbulb_on',
                    category: _t('config', 'advanced_cat'),
                    module: 'manual_presence',
                    tip: _t('callflow', 'manual_presence_tip'),
                    data: {
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return node.getMetadata('presence_id') || '';
                    },
                    edit: function(node, callback) {
                        var popup, popup_html;

                        popup_html = THIS.templates.presence_callflow.tmpl({
							_t: function(param){
								return window.translate['callflow'][param];
							},
                            data_presence: {
                                'presence_id': node.getMetadata('presence_id') || '',
                                'status': node.getMetadata('status') || 'busy'
                            }
                        });

                        $('#add', popup_html).click(function() {
                            var presence_id = $('#presence_id_input', popup_html).val();
                            node.setMetadata('presence_id', presence_id);
                            node.setMetadata('status', $('#presence_status option:selected', popup_html).val());

                            node.caption = presence_id;

                            popup.dialog('close');
                        });

                        popup = winkstart.dialog(popup_html, {
                            title: _t('callflow', 'manual_presence_title'),
                            beforeClose: function() {
                                if(typeof callback == 'function') {
                                     callback();
                                }
                            }
                        });
                    }
                },
                'language[]': {
                    name: _t('callflow', 'language'),
                    icon: 'earth',
                    category: _t('config', 'advanced_cat'),
                    module: 'language',
                    tip: _t('callflow', 'language_tip'),
                    data: {
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return node.getMetadata('language') || '';
                    },
                    edit: function(node, callback) {
                        var popup, popup_html;

                        popup_html = THIS.templates.language_callflow.tmpl({
                            _t: function(param){
                                return window.translate['callflow'][param];
                            },
                            data_language: {
                                'language': node.getMetadata('language') || ''
                            }
                        });

                        $('#add', popup_html).click(function() {
                            var language = $('#language_id_input', popup_html).val();
                            node.setMetadata('language', language);
                            node.caption = language;

                            popup.dialog('close');
                        });

                        popup = winkstart.dialog(popup_html, {
                            title: _t('callflow', 'language_title'),
                            beforeClose: function() {
                                if(typeof callback == 'function') {
                                     callback();
                                }
                            }
                        });
                    }
                },
                'group_pickup[]': {
                    name: _t('callflow', 'group_pickup'),
                    icon: 'sip',
                    category: _t('config', 'advanced_cat'),
                    module: 'group_pickup',
                    tip: _t('callflow', 'group_pickup_tip'),
                    data: {
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '0'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return node.getMetadata('name') || '';
                    },
                    edit: function(node, callback) {
                    	winkstart.parallel({
								groups: function(callback) {
									THIS.groups_list(function(groups) {
										callback(null, groups);
									});
								},
								users: function(callback) {
									THIS.users_list(function(users) {
										callback(null, users);
									});
								},
								devices: function(callback) {
									THIS.devices_list(function(devices) {
										callback(null, devices);
									});
								}
							},
							function(err, results) {
								var popup, popup_html;

                                popup_html = THIS.templates.group_pickup.tmpl({
									_t: function(param){
										return window.translate['callflow'][param];
									},
                                    data: {
                                        items: results,
                                        selected: node.getMetadata('device_id') || node.getMetadata('group_id') || node.getMetadata('user_id') || ''
                                    }
                                });

								$('#add', popup_html).click(function() {
									var selector = $('#endpoint_selector', popup_html),
										id = selector.val(),
										name = selector.find('#'+id).html(),
										type = $('#'+ id, popup_html).data('type'),
									    type_id = type.substring(type, type.length - 1) + '_id';

									/* Clear all the useless attributes */
									node.data.data = {};
                                    node.setMetadata(type_id, id);
                                    node.setMetadata('name', name);

                                    node.caption = name;

                                    popup.dialog('close');
                                });

                                popup = winkstart.dialog(popup_html, {
                                    title: _t('callflow', 'select_endpoint_title'),
                                    minHeight: '0',
                                    beforeClose: function() {
                                        if(typeof callback == 'function') {
                                            callback();
                                        }
                                    }
                                });
							}
                    	);
                    }
                },
                'receive_fax[]': {
                    name: _t('callflow', 'receive_fax'),
                    icon: 'sip',
                    category: _t('config', 'advanced_cat'),
                    module: 'receive_fax',
                    tip: _t('callflow', 'receive_fax_tip'),
                    data: {
                        owner_id: null
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '0'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return '';
                    },
                    edit: function(node, callback) {
                        winkstart.request('user.list', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url
                            },
                            function(data, status) {
                                var popup, popup_html;

                                $.each(data.data, function() {
                                    this.name = this.first_name + ' ' + this.last_name;
                                });

                                popup_html = THIS.templates.fax_callflow.tmpl({
									_t: function(param){
										return window.translate['callflow'][param];
									},
                                    objects: {
                                        items: data.data,
                                        selected: node.getMetadata('owner_id') || '',
                                        t_38: node.getMetadata('media') && node.getMetadata('media').fax_option || false
                                    }
                                });

                                if($('#user_selector option:selected', popup_html).val() == undefined) {
                                    $('#edit_link', popup_html).hide();
                                }

                                $('.inline_action', popup_html).click(function(ev) {
                                    var _data = ($(this).dataset('action') == 'edit') ?
                                                    { id: $('#user_selector', popup_html).val() } : {};

                                    ev.preventDefault();

                                    winkstart.publish('user.popup_edit', _data, function(_data) {
                                        node.setMetadata('owner_id', _data.data.id || 'null');

                                        popup.dialog('close');
                                    });
                                });

                                $('#add', popup_html).click(function() {
                                    node.setMetadata('owner_id', $('#user_selector', popup_html).val());
                                    node.setMetadata('media', {
                                        fax_option: $('#t_38_checkbox', popup_html).is(':checked')
                                    });
                                    popup.dialog('close');
                                });

                                popup = winkstart.dialog(popup_html, {
                                    title: _t('callflow', 'select_user_title'),
                                    minHeight: '0',
                                    beforeClose: function() {
                                        if(typeof callback == 'function') {
                                            callback();
                                        }
                                    }
                                });
                            }
                        );
                    }
                },
                'record_call[action=start]': {
                    name: _t('callflow', 'start_call_recording'),
                    icon: 'conference',
                    category: _t('config', 'call_recording_cat'),
                    module: 'record_call',
                    tip: _t('callflow', 'start_call_recording_tip'),
                    data: {
                        action: 'start'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node) {
                        return '';
                    },
                    edit: function(node, callback) {
                        var popup, popup_html;

                        popup_html = THIS.templates.call_record_callflow.tmpl({
							_t: function(param){
								return window.translate['callflow'][param];
							},
                            data_call_record: {
                                'format': node.getMetadata('format') || 'mp3',
                                'url': node.getMetadata('url') || '',
                                'time_limit': node.getMetadata('time_limit') || '600'
                            }
                        });

                        $('#add', popup_html).click(function() {
                            node.setMetadata('url', $('#url', popup_html).val());
                            node.setMetadata('format', $('#format', popup_html).val());
                            node.setMetadata('time_limit', $('#time_limit', popup_html).val());

                            popup.dialog('close');
                        });

                        popup = winkstart.dialog(popup_html, {
                            title: _t('callflow', 'start_call_recording'),
                            minHeight: '0',
                            beforeClose: function() {
                                if(typeof callback == 'function') {
                                     callback();
                                }
                            }
                        });
                    }
                },
                'record_call[action=stop]': {
                    name: _t('callflow', 'stop_call_recording'),
                    icon: 'conference',
                    category: _t('config', 'call_recording_cat'),
                    module: 'record_call',
                    tip: _t('callflow', 'stop_call_recording_tip'),
                    data: {
                        action: 'stop'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node) {
                        return '';
                    },
                    edit: function(node, callback) {
                    }
                },
                'pivot[]': {
                    name: _t('callflow', 'pivot'),
                    icon: 'conference',
                    category: _t('config', 'advanced_cat'),
                    module: 'pivot',
                    tip: _t('callflow', 'pivot_tip'),
                    data: {
                        method: 'get',
                        req_timeout: '5',
                        req_format: 'twiml',
                        voice_url: ''
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '0'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node) {
                        return '';
                    },
                    edit: function(node, callback) {
                        var popup, popup_html;

                        popup_html = THIS.templates.pivot_callflow.tmpl({
							_t: function(param){
								return window.translate['callflow'][param];
							},
                            data_pivot: {
                                'method': node.getMetadata('method') || 'get',
                                'voice_url': node.getMetadata('voice_url') || '',
                                'req_timeout': node.getMetadata('req_timeout') || '5',
                                'req_format': node.getMetadata('req_format') || 'twiml'
                            }
                        });

                        $('#add', popup_html).click(function() {
                            node.setMetadata('voice_url', $('#pivot_voiceurl_input', popup_html).val());
                            node.setMetadata('method', $('#pivot_method_input', popup_html).val());
                            node.setMetadata('req_format', $('#pivot_format_input', popup_html).val());

                            popup.dialog('close');
                        });

                        popup = winkstart.dialog(popup_html, {
                            title: _t('callflow', 'pivot_title'),
                            minHeight: '0',
                            beforeClose: function() {
                                if(typeof callback == 'function') {
                                     callback();
                                }
                            }
                        });
                    }
                },
                'disa[]': {
                    name: _t('callflow', 'disa'),
                    icon: 'conference',
                    category: _t('config', 'advanced_cat'),
                    module: 'disa',
                    tip: _t('callflow', 'disa_tip'),
                    data: {
                        pin: '',
                        retries: '3'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '0'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node) {
                        return '';
                    },
                    edit: function(node, callback) {
                        var popup, popup_html;

                        popup_html = THIS.templates.disa_callflow.tmpl({
							_t: function(param){
								return window.translate['callflow'][param];
							},
                            data_disa: {
                                'pin': node.getMetadata('pin') || '',
                                'retries': node.getMetadata('retries') || '3'
                            }
                        });

                        $('#add', popup_html).click(function() {
                            var save_disa = function() {
                                node.setMetadata('pin', $('#disa_pin_input', popup_html).val());
                                node.setMetadata('retries', $('#disa_retries_input', popup_html).val());

                                popup.dialog('close');
                            };
                            if($('#disa_pin_input', popup_html).val() == '') {
                                winkstart.confirm(_t('callflow', 'not_setting_a_pin'), function() {
                                    save_disa();
                                });
                            }
                            else {
                                save_disa();
                            }
                        });

                        popup = winkstart.dialog(popup_html, {
                            title: _t('callflow', 'disa_title'),
                            minHeight: '0',
                            beforeClose: function() {
                                if(typeof callback == 'function') {
                                     callback();
                                }
                            }
                        });
                    }
                },
                'response[]': {
                    name: _t('callflow', 'response'),
                    icon: 'rightarrow',
                    category: _t('config', 'advanced_cat'),
                    module: 'response',
                    tip: _t('callflow', 'response_tip'),
                    data: {
                        code: '',
                        message: '',
                        media: 'null'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '0'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return _t('callflow', 'sip_code_caption') + node.getMetadata('code');
                    },
                    edit: function(node, callback) {
                        winkstart.request(true, 'callflow.list_media', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url
                            },
                            function(data, status) {
                                var popup, popup_html;

                                popup_html = THIS.templates.response_callflow.tmpl({
									_t: function(param){
										return window.translate['callflow'][param];
									},
                                    response_data: {
                                        items: data.data,
                                        media_enabled: node.getMetadata('media') ? true : false,
                                        selected_media: node.getMetadata('media') || '',
                                        code: node.getMetadata('code') || '',
                                        message: node.getMetadata('message') || ''
                                    }
                                });

                                if($('#media_selector option:selected', popup_html).val() == undefined
                                || $('#media_selector option:selected', popup_html).val() == 'null') {
                                    $('#edit_link', popup_html).hide();
                                }

                                $('#media_selector', popup_html).change(function() {
                                    if($('#media_selector option:selected', popup_html).val() == undefined
                                    || $('#media_selector option:selected', popup_html).val() == 'null') {
                                        $('#edit_link', popup_html).hide();
                                    } else {
                                        $('#edit_link', popup_html).show();
                                    }
                                })

                                $('.inline_action', popup_html).click(function(ev) {
                                    var _data = ($(this).dataset('action') == 'edit') ?
                                                    { id: $('#media_selector', popup_html).val() } : {};

                                    ev.preventDefault();

                                    winkstart.publish('media.popup_edit', _data, function(_data) {
                                        node.setMetadata('media', _data.data.id || 'null');

                                        popup.dialog('close');
                                    });
                                });

                                $('#add', popup_html).click(function() {
                                    if($('#response_code_input', popup_html).val().match(/^[1-6][0-9]{2}$/)) {
                                        node.setMetadata('code', parseInt($('#response_code_input', popup_html).val(), 10));
                                        node.setMetadata('message', $('#response_message_input', popup_html).val());
                                        if($('#media_selector', popup_html).val() && $('#media_selector', popup_html).val() != 'null') {
                                            node.setMetadata('media', $('#media_selector', popup_html).val());
                                        } else {
                                            node.deleteMetadata('media');
                                        }

                                        node.caption = _t('callflow', 'sip_code_caption') + $('#response_code_input', popup_html).val();

                                        popup.dialog('close');
                                    } else {
                                        winkstart.alert('error', _t('callflow', 'please_enter_a_valide_sip_code'));
                                    }
                                });

                                popup = winkstart.dialog(popup_html, {
                                    title: _t('callflow', 'response_title'),
                                    minHeight: '0',
                                    beforeClose: function() {
                                        if(typeof callback == 'function') {
                                            callback();
                                        }
                                    }
                                });
                            }
                        );
                    }
                }
            });

            /* Migration callflows, fixes our goofs. To be removed eventually */
            $.extend(callflow_nodes, {
                'resource[]': {
                    name: _t('callflow', 'resource_name'),
                    icon: 'resource',
                    module: 'resources',
                    data: {},
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '0'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        winkstart.alert(_t('callflow', 'this_callflow_is_outdated'));
                        return '';
                    },
                    edit: function(node, callback) {
                    }
                },
                'hotdesk[id=*,action=call]': {
                    name: _t('callflow', 'hot_desking_name'),
                    icon: 'v_phone',
                    module: 'hotdesk',
                    data: {
                        action: 'bridge',
                        id: 'null'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        //Migration here:
                        node.setMetadata('action', 'bridge');

                        winkstart.alert(_t('callflow', 'this_callflow_is_outdated'));
                        return '';
                    },
                    edit: function(node, callback) {
                    }
                }
            });
        }
    }
);
