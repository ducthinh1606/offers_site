"use strict";
// Class definition

var KTDatatableRecordSelectionDemo = function() {
    // Private functions

    var options = {
        // datasource definition
        data: {
            type: 'remote',
            source: {
                read: {
                    url: HOST_URL + '/api/datatables/demos/default.php',
                },
            },
            pageSize: 10,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
        },

        // layout definition
        layout: {
            scroll: false, // enable/disable datatable scroll both horizontal and
            footer: false // display/hide footer
        },

        // column sorting
        sortable: true,

        pagination: true,

        // columns definition
        columns: [{
            field: 'RecordID',
            title: '#',
            sortable: false,
            width: 20,
            selector: {
                class: ''
            },
            textAlign: 'center',
        }, {
            field: 'OrderID',
            title: 'Order ID',
            template: '{{OrderID}}',
        }, {
            field: 'Country',
            title: 'Country',
            template: function(row) {
                return row.Country + ' ' + row.ShipCountry;
            },
        }, {
            field: 'ShipAddress',
            title: 'Ship Address',
        }, {
            field: 'ShipDate',
            title: 'Ship Date',
            type: 'date',
            format: 'MM/DD/YYYY',
        }, {
            field: 'Status',
            title: 'Status',
            // callback function support for column rendering
            template: function(row) {
                var status = {
                    1: {'title': 'Pending', 'class': 'label-light-primary'},
                    2: {'title': 'Delivered', 'class': ' label-light-danger'},
                    3: {'title': 'Canceled', 'class': ' label-light-primary'},
                    4: {'title': 'Success', 'class': ' label-light-success'},
                    5: {'title': 'Info', 'class': ' label-light-info'},
                    6: {'title': 'Danger', 'class': ' label-light-danger'},
                    7: {'title': 'Warning', 'class': ' label-light-warning'},
                };
                return '<span class="label label-lg font-weight-bold' + status[row.Status].class + ' label-inline">' + status[row.Status].title + '</span>';
            },
        }, {
            field: 'Type',
            title: 'Type',
	        autoHide: false,
            // callback function support for column rendering
            template: function(row) {
                var status = {
                    1: {'title': 'Online', 'state': 'danger'},
                    2: {'title': 'Retail', 'state': 'primary'},
                    3: {'title': 'Direct', 'state': 'success'},
                };
                return '<span class="label label-' + status[row.Type].state + ' label-dot mr-2"></span><span class="font-weight-bold text-' + status[row.Type].state + '">' + status[row.Type].title + '</span>';
            },
        }, {
            field: 'Actions',
            title: 'Actions',
            sortable: false,
            width: 125,
            overflow: 'visible',
            textAlign: 'left',
	        autoHide: false,
            template: function() {
                return '\
                   
                  
                    <a href="javascript:;" class="btn btn-sm btn-clean btn-icon" title="Delete">\
                        <span class="svg-icon svg-icon-md">\
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
                                    <rect x="0" y="0" width="24" height="24"/>\
                                    <path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fill-rule="nonzero"/>\
                                    <path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3"/>\
                                </g>\
                            </svg>\
                        </span>\
                    </a>\
                ';
            },
        }],
    };

    // basic demo
    var localSelectorDemo = function() {
        // enable extension
        options.extensions = {
            // boolean or object (extension options)
            checkbox: true,
        };

        options.search = {
            input: $('#kt_datatable_search_query'),
            key: 'generalSearch'
        };

        var datatable = $('#kt_datatable').KTDatatable(options);

        $('#kt_datatable_search_status').on('change', function() {
            datatable.search($(this).val().toLowerCase(), 'Status');
        });

        $('#kt_datatable_search_type').on('change', function() {
            datatable.search($(this).val().toLowerCase(), 'Type');
        });

        $('#kt_datatable_search_status, #kt_datatable_search_type').selectpicker();

        datatable.on(
            'datatable-on-check datatable-on-uncheck',
            function(e) {
                var checkedNodes = datatable.rows('.datatable-row-active').nodes();
                var count = checkedNodes.length;
                $('#kt_datatable_selected_records').html(count);
                if (count > 0) {
                    $('#kt_datatable_group_action_form').collapse('show');
                } else {
                    $('#kt_datatable_group_action_form').collapse('hide');
                }
            });

        $('#kt_datatable_fetch_modal').on('show.bs.modal', function(e) {
            var ids = datatable.rows('.datatable-row-active').
            nodes().
            find('.checkbox > [type="checkbox"]').
            map(function(i, chk) {
                return $(chk).val();
            });
            console.log(ids);
            var c = document.createDocumentFragment();
            for (var i = 0; i < ids.length; i++) {
                var li = document.createElement('li');
                li.setAttribute('data-id', ids[i]);
                li.innerHTML = 'Selected record ID: ' + ids[i];
                c.appendChild(li);
            }
            $('#kt_datatable_fetch_display').append(c);
        }).on('hide.bs.modal', function(e) {
            $('#kt_datatable_fetch_display').empty();
        });
    };

    var serverSelectorDemo = function() {
        // enable extension
        options.extensions = {
            // boolean or object (extension options)
            checkbox: true,
        };
        options.search = {
            input: $('#kt_datatable_search_query_2'),
            key: 'generalSearch'
        };

        var datatable = $('#kt_datatable_2').KTDatatable(options);

        $('#kt_datatable_search_status_2').on('change', function() {
            datatable.search($(this).val().toLowerCase(), 'Status');
        });

        $('#kt_datatable_search_type_2').on('change', function() {
            datatable.search($(this).val().toLowerCase(), 'Type');
        });

        $('#kt_datatable_search_status_2, #kt_datatable_search_type_2').selectpicker();

        datatable.on(
            'datatable-on-click-checkbox',
            function(e) {
                // datatable.checkbox() access to extension methods
                var ids = datatable.checkbox().getSelectedId();
                var count = ids.length;

                $('#kt_datatable_selected_records_2').html(count);

                if (count > 0) {
                    $('#kt_datatable_group_action_form_2').collapse('show');
                } else {
                    $('#kt_datatable_group_action_form_2').collapse('hide');
                }
            });

        $('#kt_datatable_fetch_modal_2').on('show.bs.modal', function(e) {
            var ids = datatable.checkbox().getSelectedId();
            var c = document.createDocumentFragment();
            for (var i = 0; i < ids.length; i++) {
                var li = document.createElement('li');
                li.setAttribute('data-id', ids[i]);
                li.innerHTML = 'Selected record ID: ' + ids[i];
                c.appendChild(li);
            }
            $('#kt_datatable_fetch_display_2').append(c);
        }).on('hide.bs.modal', function(e) {
            $('#kt_datatable_fetch_display_2').empty();
        });
    };

    return {
        // public functions
        init: function() {
            localSelectorDemo();
            serverSelectorDemo();
        },
    };
}();

jQuery(document).ready(function() {
    KTDatatableRecordSelectionDemo.init();
});